-- Verify RLS Policies for IET Akashvani
-- Run this in Supabase SQL Editor to check all policies

-- Check if RLS is enabled on tables
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('users', 'posts', 'comments', 'messages', 'achievements', 'promotions', 'vibes')
ORDER BY tablename;

-- Expected output: rowsecurity = true for all tables

-- Check all policies on users table
SELECT 
  policyname,
  cmd,
  permissive,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY cmd;

-- Expected output:
-- policyname                              | cmd    | permissive | qual | with_check
-- ----------------------------------------|--------|------------|------|---------------------------
-- Authenticated users can insert profile  | INSERT | PERMISSIVE | NULL | (auth.uid() IS NOT NULL)
-- Users can view all profiles             | SELECT | PERMISSIVE | true | NULL
-- Users can update own profile            | UPDATE | PERMISSIVE | (auth.uid() = id) | NULL

-- Check all policies on posts table
SELECT 
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'posts'
ORDER BY cmd;

-- Expected output:
-- Anyone can view posts
-- Authenticated users can create posts
-- Users can update own posts
-- Users can delete own posts

-- Test if authenticated user can insert (this will fail if not logged in)
-- Don't run this - just for reference
-- INSERT INTO users (email, name) VALUES ('test@ietlucknow.ac.in', 'Test User');

-- Summary of all policies
SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- Expected output:
-- tablename | policy_count
-- ----------|-------------
-- posts     | 4
-- users     | 3
-- (other tables may have fewer policies)
