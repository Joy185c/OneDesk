-- ====================================================================
-- ONEDESK — PHASE 1: DATABASE, SECURITY & PERSISTENCE MIGRATION
-- Safe & Idempotent (Preserves all existing data, never drops tables)
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/drerxdtwrjyuxjwywypr/sql
-- ====================================================================

-- 1. Ensure required extensions exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Enhance tasks table safely
ALTER TABLE public.tasks 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.tasks 
  ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.tasks 
  ADD COLUMN IF NOT EXISTS workspace_id UUID;

-- Create indexes for high performance querying
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace_id ON public.tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);

-- 3. Workspaces table
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'My Workspace',
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON public.workspaces(owner_id);

-- 4. Workspace Members table
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'guest')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON public.workspace_members(workspace_id);

-- 5. Workspace Invitations table
CREATE TABLE IF NOT EXISTS public.workspace_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'guest')),
  token TEXT NOT NULL UNIQUE,
  invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked', 'expired')),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_workspace_invitations_token ON public.workspace_invitations(token);

-- 6. Enable Row Level Security (RLS) on all Phase 1 tables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_invitations ENABLE ROW LEVEL SECURITY;

-- 7. Remove insecure wildcard public policies
DROP POLICY IF EXISTS "Public access policy on tasks" ON public.tasks;
DROP POLICY IF EXISTS "Public access policy on workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Public access policy on workspace_members" ON public.workspace_members;
DROP POLICY IF EXISTS "Public access policy on workspace_invitations" ON public.workspace_invitations;

-- 8. Strict RLS Policies for tasks
DROP POLICY IF EXISTS "Users can read own or workspace tasks" ON public.tasks;
CREATE POLICY "Users can read own or workspace tasks"
  ON public.tasks
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR (workspace_id IS NOT NULL AND workspace_id IN (
      SELECT wm.workspace_id FROM public.workspace_members wm WHERE wm.user_id = auth.uid()
    ))
  );

DROP POLICY IF EXISTS "Users can insert own tasks" ON public.tasks;
CREATE POLICY "Users can insert own tasks"
  ON public.tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can update own or workspace tasks" ON public.tasks;
CREATE POLICY "Users can update own or workspace tasks"
  ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR (workspace_id IS NOT NULL AND workspace_id IN (
      SELECT wm.workspace_id FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin', 'member')
    ))
  )
  WITH CHECK (
    user_id = auth.uid() 
    OR (workspace_id IS NOT NULL AND workspace_id IN (
      SELECT wm.workspace_id FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin', 'member')
    ))
  );

DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;
CREATE POLICY "Users can delete own tasks"
  ON public.tasks
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
  );

-- 9. Strict RLS Policies for workspaces & members
DROP POLICY IF EXISTS "Users can view workspaces they belong to" ON public.workspaces;
CREATE POLICY "Users can view workspaces they belong to"
  ON public.workspaces
  FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() 
    OR id IN (SELECT wm.workspace_id FROM public.workspace_members wm WHERE wm.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can create workspaces" ON public.workspaces;
CREATE POLICY "Users can create workspaces"
  ON public.workspaces
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owners can update workspaces" ON public.workspaces;
CREATE POLICY "Owners can update workspaces"
  ON public.workspaces
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Workspace members policies
DROP POLICY IF EXISTS "Members can view other members in same workspace" ON public.workspace_members;
CREATE POLICY "Members can view other members in same workspace"
  ON public.workspace_members
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT w.id FROM public.workspaces w WHERE w.owner_id = auth.uid()
      UNION
      SELECT wm.workspace_id FROM public.workspace_members wm WHERE wm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners and admins can manage workspace members" ON public.workspace_members;
CREATE POLICY "Owners and admins can manage workspace members"
  ON public.workspace_members
  FOR ALL
  TO authenticated
  USING (
    workspace_id IN (
      SELECT w.id FROM public.workspaces w WHERE w.owner_id = auth.uid()
      UNION
      SELECT wm.workspace_id FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT w.id FROM public.workspaces w WHERE w.owner_id = auth.uid()
      UNION
      SELECT wm.workspace_id FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin')
    )
  );

-- Invitations policies
DROP POLICY IF EXISTS "Members can view invitations for their workspaces" ON public.workspace_invitations;
CREATE POLICY "Members can view invitations for their workspaces"
  ON public.workspace_invitations
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT w.id FROM public.workspaces w WHERE w.owner_id = auth.uid()
      UNION
      SELECT wm.workspace_id FROM public.workspace_members wm WHERE wm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can create invitations" ON public.workspace_invitations;
CREATE POLICY "Admins can create invitations"
  ON public.workspace_invitations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    invited_by = auth.uid()
  );
