-- =======================================================
-- CLICKJOY (ClickUp 3.0 Full Production Suite) - SUPABASE POSTGRESQL SCHEMA
-- Paste this entire SQL into your Supabase SQL Editor and click "Run"
-- Provides 100% production-ready tables for Tasks, Docs, Timesheets,
-- Clips, Goals, Forms, Chat Launchpad, Whiteboards, & Integrations.
-- =======================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =======================================================
-- 2. Profiles Table (Syncs with Supabase auth.users)
-- =======================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Joy Kumar Yuv',
  email TEXT,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
  role TEXT DEFAULT 'Workspace Owner',
  workspace_name TEXT DEFAULT 'Joy Kumar Yuv''s Workspace',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================
-- 3. Tasks Table (Core Sprint & CRM Backlog)
-- =======================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT CHECK (status IN ('TODO', 'IN PROGRESS', 'REVIEW', 'COMPLETE')) DEFAULT 'TODO',
  priority TEXT CHECK (priority IN ('Urgent', 'High', 'Normal', 'Low')) DEFAULT 'Normal',
  due_date TEXT DEFAULT 'May 28, 2026',
  time_estimate TEXT DEFAULT '3d',
  tags TEXT[] DEFAULT ARRAY['Feature']::TEXT[],
  assignee_name TEXT DEFAULT 'Joy Kumar Yuv',
  assignee_avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
  assignee_role TEXT DEFAULT 'Product Lead',
  comments_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Subtasks Table
CREATE TABLE IF NOT EXISTS public.subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Task Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  author TEXT NOT NULL DEFAULT 'Joy Kumar Yuv',
  avatar TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================
-- 6. Connected Docs & Wikis Table
-- =======================================================
CREATE TABLE IF NOT EXISTS public.docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Untitled Document',
  content TEXT NOT NULL DEFAULT '',
  category TEXT DEFAULT 'My Docs',
  author TEXT DEFAULT 'Joy Kumar Yuv',
  is_pinned BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================
-- 7. Time Tracking & Timesheet Entries Table
-- =======================================================
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

-- =======================================================
-- 8. Timesheet Approvals Table
-- =======================================================
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

-- =======================================================
-- 9. Forms & Form Submissions Tables
-- =======================================================
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

-- =======================================================
-- 10. Clips Video & Voice Recordings Table
-- =======================================================
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

-- =======================================================
-- 11. Goals & Strategic Key Results (OKRs) Tables
-- =======================================================
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

-- =======================================================
-- 12. Channels & Chat Messages Tables (Chat Launchpad)
-- =======================================================
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

-- =======================================================
-- 13. Whiteboards Table (Visual Canvas)
-- =======================================================
CREATE TABLE IF NOT EXISTS public.whiteboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Untitled Whiteboard',
  elements JSONB DEFAULT '[]'::JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================
-- 14. Integrations Table (App Center Directory)
-- =======================================================
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

-- =======================================================
-- 15. Super Agents Table (ClickUp Brain Autonomous AI)
-- =======================================================
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
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =======================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.docs ENABLE ROW LEVEL SECURITY;
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

-- Allow read/write access for demo & authenticated users
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public access policy on %I" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public access policy on %I" ON public.%I FOR ALL USING (true) WITH CHECK (true);', tbl, tbl);
  END LOOP;
END $$;

-- =======================================================
-- REALTIME REPLICATION (For live multiplayer sync)
-- =======================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.docs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.time_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.clips;
ALTER PUBLICATION supabase_realtime ADD TABLE public.goals;

-- =======================================================
-- INITIAL SEED DATA
-- =======================================================
-- 1. Tasks
INSERT INTO public.tasks (key, title, status, priority, due_date, time_estimate, tags, assignee_name, comments_count)
VALUES 
  ('CLK-10', 'Launch Mobile App in Core', 'IN PROGRESS', 'Urgent', 'May 15, 2026', '8d', ARRAY['Design', 'Product', 'iOS'], 'Alex Rivera', 16),
  ('CLK-14', 'Figma token synchronization pipeline', 'IN PROGRESS', 'High', 'May 18, 2026', '4d', ARRAY['Design System', 'API'], 'Ivan Villa', 8),
  ('CLK-08', 'Executive dashboard & real-time velocity metrics', 'TODO', 'Normal', 'May 24, 2026', '12d', ARRAY['Analytics', 'BI'], 'Sarah Chen', 3),
  ('CLK-22', 'Multi-workspace permissions audit & SOC2 review', 'REVIEW', 'Urgent', 'May 12, 2026', '5d', ARRAY['Security', 'Compliance'], 'David Kim', 12),
  ('CLK-04', 'ClickUp AI document summary & action item extraction', 'COMPLETE', 'High', 'May 02, 2026', '6d', ARRAY['AI', 'Docs'], 'Brendan Wolfe', 24)
ON CONFLICT DO NOTHING;

-- 2. Docs
INSERT INTO public.docs (title, content, category)
VALUES 
  ('ClickUp 3.0 Engineering Principles', '# ClickUp 3.0 Engineering Architecture\n\n## 1. Sub-second performance\nEvery interaction must complete within 100ms. All state changes are optimistically rendered and synchronized across background workers.\n\n## 2. Universal Search\nUniversal Search operates across tasks, connected docs, and live chat threads.', 'Engineering'),
  ('Sales Playbook 2026', '# Enterprise Sales Strategy\n\n- Lead Qualification SLA: 15 minutes\n- Demo Call conversion benchmark: 42%\n- Security audit approval workflow', 'Sales CRM'),
  ('Sprint 24 PRD & Release Goals', '# Sprint 24 Objectives\n\n- Connect Supabase PostgreSQL database\n- Enable Realtime multiplayer sync across tabs\n- Persist tasks, comments, and subtasks in production', 'Product')
ON CONFLICT DO NOTHING;

-- 3. Channels
INSERT INTO public.channels (name, topic)
VALUES
  ('general', 'Joy Kumar Yuv''s Workspace general updates'),
  ('sales-crm', 'Inbound lead pipelines & deals discussions'),
  ('announcements', 'Workspace product updates and releases')
ON CONFLICT DO NOTHING;

-- 4. Initial Goals
INSERT INTO public.goals (name, description, owner, color, icon, due_date, status)
VALUES
  ('Scale Q4 Enterprise Pipeline', 'Accelerate outbound sales CRM demos and close 12 key enterprise deals before year end.', 'Joy Kumar Yuv', '#7c3aed', '🎯', 'Dec 31, 2026', 'on_track')
ON CONFLICT DO NOTHING;

-- 5. Connected Apps Seed
INSERT INTO public.integrations (id, name, category, description, icon_bg, icon_color, connected)
VALUES
  ('google-calendar', 'Google Calendar', 'Calendars', 'Sync tasks with Google Calendar in real-time.', '#4285f4', '#ffffff', TRUE),
  ('google-drive', 'Google Drive', 'Cloud Storage', 'Browse, attach, and create Google Docs and Sheets.', '#34a853', '#ffffff', FALSE),
  ('slack', 'Slack', 'Communication', 'Create tasks from Slack messages and unfurl links.', '#4a154b', '#ffffff', FALSE),
  ('github', 'GitHub', 'Development', 'Link pull requests, branch commits, and issue tracking.', '#24292e', '#ffffff', FALSE),
  ('figma', 'Figma', 'Design', 'Embed live interactive Figma files directly into tasks.', '#f24e1e', '#ffffff', FALSE)
ON CONFLICT (id) DO UPDATE SET connected = EXCLUDED.connected;

-- 6. Super Agents Seed
INSERT INTO public.super_agents (id, name, role, capabilities, prompt_instructions)
VALUES
  ('brain', 'ClickUp Brain', 'Core Workspace Intelligence', ARRAY['Universal Search', 'AI Summarization', 'Sprint Estimation'], 'You are ClickUp Brain 3.0, the native AI engine.'),
  ('meeting-agent', 'Meeting Agent', 'Autonomous Notetaker', ARRAY['Live Transcription', 'Action Item Extraction', 'Task Creation'], 'You record and summarize team meetings autonomously.')
ON CONFLICT (id) DO NOTHING;
