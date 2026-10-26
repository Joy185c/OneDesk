-- ====================================================================
-- ONEDESK — PHASE 3: COMPLETE FEATURE INTEGRATION & FUNCTIONAL COMPLETION
-- Safe & Idempotent Migration for Supabase Free Tier ($0 Cost)
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/drerxdtwrjyuxjwywypr/sql
-- ====================================================================

-- 1. Ensure extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Calendar Events Table (Phase 3A: Planner & Calendar)
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  day_index INTEGER NOT NULL DEFAULT 0,
  date_str DATE NOT NULL DEFAULT CURRENT_DATE,
  start_hour NUMERIC(4, 2) NOT NULL DEFAULT 10,
  duration_hours NUMERIC(4, 2) NOT NULL DEFAULT 1,
  is_all_day BOOLEAN DEFAULT FALSE,
  color TEXT DEFAULT '#7c3aed',
  bg_color TEXT DEFAULT '#faf5ff',
  border_color TEXT DEFAULT '#ddd6fe',
  text_color TEXT DEFAULT '#6b21a8',
  badge TEXT,
  type TEXT CHECK (type IN ('meeting', 'focus', 'task', 'all-day')) DEFAULT 'meeting',
  attendees TEXT[] DEFAULT ARRAY[]::TEXT[],
  meeting_url TEXT,
  description TEXT DEFAULT '',
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user ON public.calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON public.calendar_events(date_str);

-- 3. Planner Priorities Table (Phase 3A: Planner Daily Priorities)
CREATE TABLE IF NOT EXISTS public.planner_priorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('urgent', 'high', 'normal', 'low')) DEFAULT 'normal',
  completed BOOLEAN DEFAULT FALSE,
  due_date TEXT DEFAULT 'Today',
  estimate TEXT DEFAULT '1h',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_planner_priorities_user ON public.planner_priorities(user_id);

-- 4. Notifications Table (Phase 3B: Inbox & Real Activity Notifications)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender TEXT NOT NULL DEFAULT 'System',
  sender_avatar TEXT DEFAULT 'SY',
  is_ai BOOLEAN DEFAULT FALSE,
  action TEXT NOT NULL,
  task_title TEXT,
  task_id UUID,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  tab TEXT CHECK (tab IN ('primary', 'other', 'later', 'cleared')) DEFAULT 'primary',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- 5. Enable Row Level Security (RLS) on all Phase 3 tables
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planner_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timesheet_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for Calendar Events
DROP POLICY IF EXISTS "Users can manage own calendar events" ON public.calendar_events;
CREATE POLICY "Users can manage own calendar events"
  ON public.calendar_events
  FOR ALL
  USING (user_id = auth.uid() OR user_id IS NULL)
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- 7. RLS Policies for Planner Priorities
DROP POLICY IF EXISTS "Users can manage own planner priorities" ON public.planner_priorities;
CREATE POLICY "Users can manage own planner priorities"
  ON public.planner_priorities
  FOR ALL
  USING (user_id = auth.uid() OR user_id IS NULL)
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- 8. RLS Policies for Notifications
DROP POLICY IF EXISTS "Users can view and update own notifications" ON public.notifications;
CREATE POLICY "Users can view and update own notifications"
  ON public.notifications
  FOR ALL
  USING (user_id = auth.uid() OR user_id IS NULL)
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- 9. RLS Policies for Time Entries & Approvals
DROP POLICY IF EXISTS "Users can manage time entries" ON public.time_entries;
CREATE POLICY "Users can manage time entries"
  ON public.time_entries
  FOR ALL
  USING (user_id = auth.uid() OR user_id IS NULL)
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can manage timesheet approvals" ON public.timesheet_approvals;
CREATE POLICY "Users can manage timesheet approvals"
  ON public.timesheet_approvals
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 10. RLS Policies for Forms & Submissions
DROP POLICY IF EXISTS "Users can manage own forms" ON public.forms;
CREATE POLICY "Users can manage own forms"
  ON public.forms
  FOR ALL
  USING (user_id = auth.uid() OR user_id IS NULL)
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

DROP POLICY IF EXISTS "Anyone can submit to active forms" ON public.form_submissions;
CREATE POLICY "Anyone can submit to active forms"
  ON public.form_submissions
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Form creators can view submissions" ON public.form_submissions;
CREATE POLICY "Form creators can view submissions"
  ON public.form_submissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.forms f 
      WHERE f.id = form_submissions.form_id 
      AND (f.user_id = auth.uid() OR f.user_id IS NULL)
    )
  );

-- 11. RLS Policies for Goals & Targets
DROP POLICY IF EXISTS "Users can manage own goals" ON public.goals;
CREATE POLICY "Users can manage own goals"
  ON public.goals
  FOR ALL
  USING (user_id = auth.uid() OR user_id IS NULL)
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can manage goal targets" ON public.goal_targets;
CREATE POLICY "Users can manage goal targets"
  ON public.goal_targets
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.goals g 
      WHERE g.id = goal_targets.goal_id 
      AND (g.user_id = auth.uid() OR g.user_id IS NULL)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.goals g 
      WHERE g.id = goal_targets.goal_id 
      AND (g.user_id = auth.uid() OR g.user_id IS NULL)
    )
  );

-- 12. Add Realtime Replication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'calendar_events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.calendar_events;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;
