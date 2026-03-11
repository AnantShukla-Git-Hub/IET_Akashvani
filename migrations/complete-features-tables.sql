-- Complete Features Database Migration
-- Run this in Supabase SQL Editor

-- Add missing fields to achievements table
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Create achievement_likes table
CREATE TABLE IF NOT EXISTS achievement_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(achievement_id, user_id)
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('normal', 'important', 'urgent')) DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create announcement_likes table (for engagement)
CREATE TABLE IF NOT EXISTS announcement_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(announcement_id, user_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_achievement_likes_achievement_id ON achievement_likes(achievement_id);
CREATE INDEX IF NOT EXISTS idx_achievement_likes_user_id ON achievement_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON announcements(priority);
CREATE INDEX IF NOT EXISTS idx_announcement_likes_announcement_id ON announcement_likes(announcement_id);

-- Enable RLS on new tables
ALTER TABLE achievement_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievement_likes
CREATE POLICY "Anyone can view achievement likes" ON achievement_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like achievements" ON achievement_likes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can unlike achievements" ON achievement_likes FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for announcements
CREATE POLICY "Anyone can view announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Only admins can create announcements" ON announcements FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
    AND (users.is_admin = true OR users.role = 'owner')
  )
);
CREATE POLICY "Only admins can update announcements" ON announcements FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
    AND (users.is_admin = true OR users.role = 'owner')
  )
);
CREATE POLICY "Only admins can delete announcements" ON announcements FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
    AND (users.is_admin = true OR users.role = 'owner')
  )
);

-- RLS Policies for announcement_likes
CREATE POLICY "Anyone can view announcement likes" ON announcement_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like announcements" ON announcement_likes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can unlike announcements" ON announcement_likes FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for achievements (update existing)
DROP POLICY IF EXISTS "Anyone can view achievements" ON achievements;
DROP POLICY IF EXISTS "Anyone can view approved achievements" ON achievements;
DROP POLICY IF EXISTS "Authenticated users can create achievements" ON achievements;
DROP POLICY IF EXISTS "Users can update own achievements" ON achievements;

-- Allow admins to see all achievements, regular users only see approved ones
CREATE POLICY "Users can view achievements based on role" ON achievements FOR SELECT USING (
  status = 'approved' OR 
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
    AND (users.is_admin = true OR users.role = 'owner')
  )
);

CREATE POLICY "Authenticated users can create achievements" ON achievements FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
    AND users.id = achievements.user_id
  )
);

CREATE POLICY "Users can update own pending achievements" ON achievements FOR UPDATE USING (
  auth.uid() IS NOT NULL AND 
  status = 'pending' AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = achievements.user_id 
    AND users.email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
  )
);

CREATE POLICY "Admins can update all achievements" ON achievements FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
    AND (users.is_admin = true OR users.role = 'owner')
  )
);