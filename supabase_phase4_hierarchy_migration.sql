-- ====================================================================
-- ONEDESK — PHASE 4: COMPLETE HIERARCHICAL PROJECT MANAGEMENT
-- Safe & Idempotent Migration
-- Architecture: Workspace -> Space -> Folder -> List -> Task -> Subtask
-- ====================================================================

-- 1. Spaces Table
CREATE TABLE IF NOT EXISTS public.spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#7c3aed',
  icon TEXT DEFAULT 'layout',
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_spaces_workspace_id ON public.spaces(workspace_id);
CREATE INDEX IF NOT EXISTS idx_spaces_is_archived ON public.spaces(is_archived);

-- 2. Folders Table
CREATE TABLE IF NOT EXISTS public.folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_folders_space_id ON public.folders(space_id);
CREATE INDEX IF NOT EXISTS idx_folders_workspace_id ON public.folders(workspace_id);

-- 3. Lists Table
CREATE TABLE IF NOT EXISTS public.lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_lists_space_id ON public.lists(space_id);
CREATE INDEX IF NOT EXISTS idx_lists_folder_id ON public.lists(folder_id);
CREATE INDEX IF NOT EXISTS idx_lists_workspace_id ON public.lists(workspace_id);

-- 4. Extend Tasks Table with Hierarchy References
ALTER TABLE public.tasks 
  ADD COLUMN IF NOT EXISTS space_id UUID REFERENCES public.spaces(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS list_id UUID REFERENCES public.lists(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_tasks_space_id ON public.tasks(space_id);
CREATE INDEX IF NOT EXISTS idx_tasks_folder_id ON public.tasks(folder_id);
CREATE INDEX IF NOT EXISTS idx_tasks_list_id ON public.tasks(list_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;

-- 6. Strict RLS Policies for Spaces
DROP POLICY IF EXISTS "Workspace members can view spaces" ON public.spaces;
CREATE POLICY "Workspace members can view spaces"
  ON public.spaces
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT w.id FROM public.workspaces w WHERE w.owner_id = auth.uid()
      UNION
      SELECT wm.workspace_id FROM public.workspace_members wm WHERE wm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Workspace members can manage spaces" ON public.spaces;
CREATE POLICY "Workspace members can manage spaces"
  ON public.spaces
  FOR ALL
  TO authenticated
  USING (
    workspace_id IN (
      SELECT w.id FROM public.workspaces w WHERE w.owner_id = auth.uid()
      UNION
      SELECT wm.workspace_id FROM public.workspace_members wm WHERE wm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT w.id FROM public.workspaces w WHERE w.owner_id = auth.uid()
      UNION
      SELECT wm.workspace_id FROM public.workspace_members wm WHERE wm.user_id = auth.uid()
    )
  );

-- 7. Strict RLS Policies for Folders
DROP POLICY IF EXISTS "Workspace members can view folders" ON public.folders;
CREATE POLICY "Workspace members can view folders"
  ON public.folders
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT w.id FROM public.workspaces w WHERE w.owner_id = auth.uid()
      UNION
      SELECT wm.workspace_id FROM public.workspace_members wm WHERE wm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Workspace members can manage folders" ON public.folders;
CREATE POLICY "Workspace members can manage folders"
  ON public.folders
  FOR ALL
  TO authenticated
  USING (
    workspace_id IN (
      SELECT w.id FROM public.workspaces w WHERE w.owner_id = auth.uid()
      UNION
      SELECT wm.workspace_id FROM public.workspace_members wm WHERE wm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT w.id FROM public.workspaces w WHERE w.owner_id = auth.uid()
      UNION
      SELECT wm.workspace_id FROM public.workspace_members wm WHERE wm.user_id = auth.uid()
    )
  );

-- 8. Strict RLS Policies for Lists
DROP POLICY IF EXISTS "Workspace members can view lists" ON public.lists;
CREATE POLICY "Workspace members can view lists"
  ON public.lists
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT w.id FROM public.workspaces w WHERE w.owner_id = auth.uid()
      UNION
      SELECT wm.workspace_id FROM public.workspace_members wm WHERE wm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Workspace members can manage lists" ON public.lists;
CREATE POLICY "Workspace members can manage lists"
  ON public.lists
  FOR ALL
  TO authenticated
  USING (
    workspace_id IN (
      SELECT w.id FROM public.workspaces w WHERE w.owner_id = auth.uid()
      UNION
      SELECT wm.workspace_id FROM public.workspace_members wm WHERE wm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT w.id FROM public.workspaces w WHERE w.owner_id = auth.uid()
      UNION
      SELECT wm.workspace_id FROM public.workspace_members wm WHERE wm.user_id = auth.uid()
    )
  );
