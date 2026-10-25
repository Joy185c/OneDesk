-- ====================================================================
-- ONEDESK — SUPABASE EMAIL + PASSWORD AUTHENTICATION & RLS FOUNDATION
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/drerxdtwrjyuxjwywypr/sql
-- ====================================================================

-- 1. Ensure required extensions exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Profiles Table (strictly linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Workspace Member',
  email TEXT,
  avatar_url TEXT DEFAULT '',
  role TEXT DEFAULT 'Workspace Owner',
  workspace_name TEXT DEFAULT 'My Workspace',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Idempotent Trigger: Automatically create or update public.profiles on Email Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_name TEXT;
  extracted_workspace TEXT;
BEGIN
  extracted_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1),
    'Workspace Member'
  );

  extracted_workspace := COALESCE(
    NEW.raw_user_meta_data->>'workspace_name',
    extracted_name || '''s Workspace'
  );

  INSERT INTO public.profiles (id, name, email, avatar_url, role, workspace_name)
  VALUES (
    NEW.id,
    extracted_name,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'Workspace Owner',
    extracted_workspace
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create the trigger cleanly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Safe, idempotent RLS policies for profiles
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Public profile lookup for team members" ON public.profiles;
CREATE POLICY "Public profile lookup for team members"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- 6. Ensure existing users without a profile have one created safely
INSERT INTO public.profiles (id, name, email, workspace_name)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1), 'Member'),
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1), 'Member') || '''s Workspace'
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
