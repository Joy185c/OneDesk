-- =======================================================
-- CLICKJOY (ClickUp 3.0) - MIGRATION V2 (NEW HUBS & FEATURES)
-- Only contains the new tables added for Timesheets, Clips,
-- Goals, Forms, Chat Launchpad, Whiteboard, & Integrations.
-- Paste and Run this in your Supabase SQL Editor.
-- =======================================================

-- 1. Time Tracking & Timesheet Entries Table
CREATE TABLE IF NOT EXISTS public.time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id TEXT,
  task_title TEXT NOT NULL,
  task_key TEXT DEFAULT 'CRM-101',
  duration_seconds INTEGER NOT NULL DEFAULT 3600,
  date_str DATE NOT NULL DEFAULT CURRENT_DATE,
  day_of_week INTEGER DEFAULT 0,
  start_time TEXT DEFAULT '10:00 am',
  end_time TEXT DEFAULT '11:00 am',
  notes TEXT DEFAULT '',
  tags TEXT[] DEFAULT ARRAY['Development']::TEXT[],
  billable BOOLEAN DEFAULT TRUE,
  user_name TEXT NOT NULL DEFAULT 'Joy Kumar Yuv',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Timesheet Approvals Table
CREATE TABLE IF NOT EXISTS public.timesheet_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_label TEXT NOT NULL,
  user_name TEXT NOT NULL DEFAULT 'Joy Kumar Yuv',
  user_initials TEXT DEFAULT 'JY',
  total_hours NUMERIC(6, 2) NOT NULL DEFAULT 40.0,
  status TEXT CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')) DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by TEXT,
  rejection_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Forms & Form Submissions Tables
CREATE TABLE IF NOT EXISTS public.forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT CHECK (status IN ('active', 'draft', 'archived')) DEFAULT 'active',
  submissions_count INTEGER DEFAULT 0,
  color TEXT DEFAULT '#7c3aed',
  fields JSONB DEFAULT '[]'::JSONB,
  target_list TEXT DEFAULT 'Sales CRM Backlog',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  submitter_email TEXT,
  answers JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Clips Video & Voice Recordings Table
CREATE TABLE IF NOT EXISTS public.clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('video', 'voice', 'syncup')) DEFAULT 'video',
  duration_seconds INTEGER NOT NULL DEFAULT 60,
  author TEXT NOT NULL DEFAULT 'Joy Kumar Yuv',
  author_initials TEXT DEFAULT 'JY',
  views_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  thumbnail_gradient TEXT DEFAULT 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
  transcript TEXT DEFAULT '',
  video_url TEXT,
  tags TEXT[] DEFAULT ARRAY['Walkthrough']::TEXT[],
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Goals & Strategic Key Results (OKRs) Tables
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  owner TEXT NOT NULL DEFAULT 'Joy Kumar Yuv',
  owner_initials TEXT DEFAULT 'JY',
  color TEXT DEFAULT '#7c3aed',
  icon TEXT DEFAULT '🎯',
  due_date TEXT DEFAULT 'Dec 31, 2026',
  status TEXT CHECK (status IN ('on_track', 'at_risk', 'behind', 'completed')) DEFAULT 'on_track',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.goal_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('currency', 'number', 'tasks', 'boolean')) DEFAULT 'tasks',
  current_value NUMERIC(14, 2) NOT NULL DEFAULT 0,
  target_value NUMERIC(14, 2) NOT NULL DEFAULT 10,
  unit TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Channels & Chat Messages Tables (Chat Launchpad)
CREATE TABLE IF NOT EXISTS public.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  topic TEXT DEFAULT '',
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
  recipient_user TEXT,
  sender TEXT NOT NULL DEFAULT 'Joy Kumar Yuv',
  sender_initials TEXT DEFAULT 'JY',
  is_ai BOOLEAN DEFAULT FALSE,
  avatar_bg TEXT DEFAULT '#0f172a',
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Whiteboards Table (Visual Canvas)
CREATE TABLE IF NOT EXISTS public.whiteboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Untitled Whiteboard',
  elements JSONB DEFAULT '[]'::JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Integrations Table (App Center Directory)
CREATE TABLE IF NOT EXISTS public.integrations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  icon_bg TEXT,
  icon_color TEXT,
  connected BOOLEAN DEFAULT FALSE,
  config JSONB DEFAULT '{}'::JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Super Agents Table (ClickUp Brain Autonomous AI)
CREATE TABLE IF NOT EXISTS public.super_agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  capabilities TEXT[],
  prompt_instructions TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR NEW TABLES
-- =======================================================
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timesheet_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whiteboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_agents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public access on time_entries" ON public.time_entries;
CREATE POLICY "Public access on time_entries" ON public.time_entries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on timesheet_approvals" ON public.timesheet_approvals;
CREATE POLICY "Public access on timesheet_approvals" ON public.timesheet_approvals FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on forms" ON public.forms;
CREATE POLICY "Public access on forms" ON public.forms FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on form_submissions" ON public.form_submissions;
CREATE POLICY "Public access on form_submissions" ON public.form_submissions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on clips" ON public.clips;
CREATE POLICY "Public access on clips" ON public.clips FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on goals" ON public.goals;
CREATE POLICY "Public access on goals" ON public.goals FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on goal_targets" ON public.goal_targets;
CREATE POLICY "Public access on goal_targets" ON public.goal_targets FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on channels" ON public.channels;
CREATE POLICY "Public access on channels" ON public.channels FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on chat_messages" ON public.chat_messages;
CREATE POLICY "Public access on chat_messages" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on whiteboards" ON public.whiteboards;
CREATE POLICY "Public access on whiteboards" ON public.whiteboards FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on integrations" ON public.integrations;
CREATE POLICY "Public access on integrations" ON public.integrations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on super_agents" ON public.super_agents;
CREATE POLICY "Public access on super_agents" ON public.super_agents FOR ALL USING (true) WITH CHECK (true);

-- =======================================================
-- REALTIME REPLICATION (For live sync on new tables)
-- =======================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.time_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.clips;
ALTER PUBLICATION supabase_realtime ADD TABLE public.goals;

-- =======================================================
-- INITIAL SEED DATA FOR NEW TABLES
-- =======================================================
INSERT INTO public.channels (name, topic)
VALUES
  ('general', 'Joy Kumar Yuv''s Workspace general updates'),
  ('sales-crm', 'Inbound lead pipelines & deals discussions'),
  ('announcements', 'Workspace product updates and releases')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.goals (name, description, owner, color, icon, due_date, status)
VALUES
  ('Scale Q4 Enterprise Pipeline', 'Accelerate outbound sales CRM demos and close 12 key enterprise deals before year end.', 'Joy Kumar Yuv', '#7c3aed', '🎯', 'Dec 31, 2026', 'on_track')
ON CONFLICT DO NOTHING;

INSERT INTO public.integrations (id, name, category, description, icon_bg, icon_color, connected)
VALUES
  ('google-calendar', 'Google Calendar', 'Calendars', 'Sync tasks with Google Calendar in real-time.', '#4285f4', '#ffffff', TRUE),
  ('google-drive', 'Google Drive', 'Cloud Storage', 'Browse, attach, and create Google Docs and Sheets.', '#34a853', '#ffffff', FALSE),
  ('slack', 'Slack', 'Communication', 'Create tasks from Slack messages and unfurl links.', '#4a154b', '#ffffff', FALSE),
  ('github', 'GitHub', 'Development', 'Link pull requests, branch commits, and issue tracking.', '#24292e', '#ffffff', FALSE),
  ('figma', 'Figma', 'Design', 'Embed live interactive Figma files directly into tasks.', '#f24e1e', '#ffffff', FALSE)
ON CONFLICT (id) DO UPDATE SET connected = EXCLUDED.connected;

INSERT INTO public.super_agents (id, name, role, capabilities, prompt_instructions)
VALUES
  ('brain', 'ClickUp Brain', 'Core Workspace Intelligence', ARRAY['Universal Search', 'AI Summarization', 'Sprint Estimation'], 'You are ClickUp Brain 3.0, the native AI engine.'),
  ('meeting-agent', 'Meeting Agent', 'Autonomous Notetaker', ARRAY['Live Transcription', 'Action Item Extraction', 'Task Creation'], 'You record and summarize team meetings autonomously.')
ON CONFLICT (id) DO NOTHING;
