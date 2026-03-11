-- Fix RLS Policies for Posts Table
-- This allows authenticated users to create posts and everyone to view them

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
DROP POLICY IF EXISTS "Auth users can post" ON posts;
DROP POLICY IF EXISTS "Anyone can view posts" ON posts;

-- Create new policies
CREATE POLICY "Auth users can post" ON posts 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view posts" ON posts 
FOR SELECT 
USING (true);

-- Keep existing update and delete policies
-- (Users can update/delete their own posts)

-- Verify the policies were created
SELECT 
  policyname,
  cmd,
  permissive,
  with_check
FROM pg_policies 
WHERE tablename = 'posts'
ORDER BY cmd;
