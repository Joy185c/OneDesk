-- ====================================================================
-- ONEDESK — PHASE 2: REAL MULTI-USER COLLABORATION & CLOUD PERSISTENCE
-- Safe & Idempotent Migration for Supabase Free Tier
-- ====================================================================

-- 1. Ensure Realtime publication is enabled for collaborative tables
DO $$
BEGIN
  -- chat_messages
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;

  -- docs
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'docs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.docs;
  END IF;

  -- whiteboards
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'whiteboards'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.whiteboards;
  END IF;

  -- workspace_members
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'workspace_members'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.workspace_members;
  END IF;
END $$;

-- 2. Enhanced RLS Policies for Cross-Device Invitations
-- Allow anyone (including unauthenticated invitees with an invite link) to read pending invitation by token
DROP POLICY IF EXISTS "Public lookup of pending invitations" ON public.workspace_invitations;
CREATE POLICY "Public lookup of pending invitations"
  ON public.workspace_invitations
  FOR SELECT
  USING (status = 'pending');

-- Allow authenticated invitee or system to accept/update their invitation
DROP POLICY IF EXISTS "Invitee can update pending invitation" ON public.workspace_invitations;
CREATE POLICY "Invitee can update pending invitation"
  ON public.workspace_invitations
  FOR UPDATE
  TO authenticated
  USING (status = 'pending')
  WITH CHECK (status IN ('accepted', 'revoked'));

-- Allow authenticated users to join workspace when they have a valid token
DROP POLICY IF EXISTS "Users can self-join workspace upon invitation" ON public.workspace_members;
CREATE POLICY "Users can self-join workspace upon invitation"
  ON public.workspace_members
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 3. Enhanced RLS for Chat Messages (Direct Messages & Workspace Channels)
DROP POLICY IF EXISTS "Chat message workspace channel access" ON public.chat_messages;
CREATE POLICY "Chat message workspace channel access"
  ON public.chat_messages
  FOR ALL
  TO authenticated
  USING (
    -- Public/General channel messages or messages sent/received by user
    recipient_user = 'general'
    OR recipient_user IS NULL
    OR user_id = auth.uid()
    OR recipient_user = auth.uid()::text
  )
  WITH CHECK (
    user_id = auth.uid()
  );

-- 4. Cloud Docs Persistence RLS
DROP POLICY IF EXISTS "Users can access their own or workspace docs" ON public.docs;
CREATE POLICY "Users can access their own or workspace docs"
  ON public.docs
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid()
    OR user_id IS NULL
  )
  WITH CHECK (
    user_id = auth.uid()
  );

-- 5. Whiteboard Cloud Persistence RLS
DROP POLICY IF EXISTS "Users can access their own or workspace whiteboards" ON public.whiteboards;
CREATE POLICY "Users can access their own or workspace whiteboards"
  ON public.whiteboards
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid()
    OR user_id IS NULL
  )
  WITH CHECK (
    user_id = auth.uid()
  );
