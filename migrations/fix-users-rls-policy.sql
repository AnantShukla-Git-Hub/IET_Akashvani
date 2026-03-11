-- Fix RLS Policy for Users Table
-- This allows authenticated users to insert their profile during setup

-- Drop the old policy if it exists
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create new policy that allows any authenticated user to insert
CREATE POLICY "Authenticated users can insert profile" ON users 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users';
