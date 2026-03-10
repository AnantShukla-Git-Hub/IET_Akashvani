-- Migration: Add Special Users Support
-- Run this in Supabase SQL Editor to add special user features

-- Add new columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_special_user BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS special_user_role TEXT CHECK (special_user_role IN ('Guest', 'Faculty', 'Special', 'Alumni'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS access_level TEXT CHECK (access_level IN ('read_only', 'can_post', 'full')) DEFAULT 'read_only';
ALTER TABLE users ADD COLUMN IF NOT EXISTS added_by UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS blocked_reason TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMP WITH TIME ZONE;

-- Create index for special users
CREATE INDEX IF NOT EXISTS idx_users_special ON users(is_special_user) WHERE is_special_user = true;
CREATE INDEX IF NOT EXISTS idx_users_banned ON users(is_banned) WHERE is_banned = true;

-- Update RLS policies for special users
-- Special users can view based on their access level
CREATE POLICY "Special users can view based on access" ON posts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (
        users.is_special_user = false
        OR users.access_level IN ('read_only', 'can_post', 'full')
      )
      AND users.is_banned = false
    )
  );

-- Special users can post based on access level
CREATE POLICY "Special users can post based on access" ON posts
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (
        users.is_special_user = false
        OR users.access_level IN ('can_post', 'full')
      )
      AND users.is_banned = false
    )
  );

-- Banned users cannot do anything
CREATE POLICY "Banned users cannot post" ON posts
  FOR INSERT
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_banned = true
    )
  );

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Special users support added successfully!';
  RAISE NOTICE 'Next step: Set is_admin = true for your user in the users table';
END $$;
