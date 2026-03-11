-- IET Akashvani Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  roll_number TEXT UNIQUE,
  year INTEGER,
  branch TEXT,
  college TEXT DEFAULT 'IET Lucknow',
  profile_pic_url TEXT,
  serial_id TEXT UNIQUE,
  is_alumni BOOLEAN DEFAULT FALSE,
  batch_year INTEGER,
  is_banned BOOLEAN DEFAULT FALSE,
  is_guest BOOLEAN DEFAULT FALSE,
  role TEXT CHECK (role IN ('student', 'owner')) DEFAULT 'student',
  is_admin BOOLEAN DEFAULT FALSE,
  skip_setup BOOLEAN DEFAULT FALSE,
  is_special_user BOOLEAN DEFAULT FALSE,
  special_user_role TEXT CHECK (special_user_role IN ('Guest', 'Faculty', 'Special', 'Alumni')),
  access_level TEXT CHECK (access_level IN ('read_only', 'can_post', 'full')) DEFAULT 'read_only',
  added_by UUID REFERENCES users(id),
  blocked_reason TEXT,
  blocked_at TIMESTAMP WITH TIME ZONE,
  badge_override TEXT,
  can_see_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Designations table
CREATE TABLE designations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  designation_title TEXT NOT NULL,
  unit TEXT,
  badge_level TEXT CHECK (badge_level IN ('gold', 'silver', 'bronze')),
  custom_tag TEXT UNIQUE,
  expiry_type TEXT CHECK (expiry_type IN ('permanent', 'annual')) DEFAULT 'permanent',
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('feed', 'announcement', 'achievement', 'promote')) DEFAULT 'feed',
  image_url TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('class', 'branch', 'cross-branch', 'alumni')) DEFAULT 'cross-branch',
  branch TEXT,
  year INTEGER,
  is_cross_branch BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  proof_image_url TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotions table
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT,
  contact_email TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vibes table
CREATE TABLE vibes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  spotify_link TEXT NOT NULL,
  song_name TEXT NOT NULL,
  artist TEXT NOT NULL,
  album_art_url TEXT,
  preview_url TEXT,
  mood TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_type TEXT CHECK (tag_type IN ('role', 'user', 'topic')) NOT NULL,
  tag_value TEXT NOT NULL,
  notified_user_id UUID REFERENCES users(id),
  notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  reported_by UUID REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'dismissed', 'action_taken')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hostels table
CREATE TABLE hostels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_name TEXT NOT NULL,
  type TEXT CHECK (type IN ('boys', 'girls')),
  warden_user_id UUID REFERENCES users(id),
  mess_incharge_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departments table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dept_name TEXT NOT NULL,
  hod_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_roll_number ON users(roll_number);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_designations_user_id ON designations(user_id);
CREATE INDEX idx_achievements_user_id ON achievements(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vibes ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic - will expand later)
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert profile" ON users FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Function to auto-generate serial_id
CREATE OR REPLACE FUNCTION generate_serial_id()
RETURNS TRIGGER AS $$
DECLARE
  next_serial INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(serial_id FROM 5) AS INTEGER)), 0) + 1
  INTO next_serial
  FROM users
  WHERE serial_id LIKE 'IET-%';
  
  NEW.serial_id := 'IET-' || LPAD(next_serial::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_serial_id
BEFORE INSERT ON users
FOR EACH ROW
WHEN (NEW.serial_id IS NULL)
EXECUTE FUNCTION generate_serial_id();

-- Function to auto-expire student designations every August 1
CREATE OR REPLACE FUNCTION expire_student_designations()
RETURNS void AS $$
BEGIN
  UPDATE designations
  SET is_active = FALSE
  WHERE expiry_type = 'annual'
  AND EXTRACT(MONTH FROM NOW()) = 8
  AND EXTRACT(DAY FROM NOW()) = 1;
END;
$$ LANGUAGE plpgsql;

-- Function to update alumni status every August 1
CREATE OR REPLACE FUNCTION update_alumni_status()
RETURNS void AS $$
BEGIN
  UPDATE users
  SET is_alumni = TRUE,
      batch_year = EXTRACT(YEAR FROM NOW())
  WHERE year = 4
  AND EXTRACT(MONTH FROM NOW()) = 8
  AND EXTRACT(DAY FROM NOW()) = 1;
  
  -- Increment year for remaining students
  UPDATE users
  SET year = year + 1
  WHERE year < 4
  AND is_alumni = FALSE
  AND EXTRACT(MONTH FROM NOW()) = 8
  AND EXTRACT(DAY FROM NOW()) = 1;
END;
$$ LANGUAGE plpgsql;
