-- Fix RLS Policies for Messages Table
-- This allows authenticated users to send and view messages in rooms

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Auth users can send messages" ON messages;
DROP POLICY IF EXISTS "Auth users can view messages" ON messages;

-- Create new policies
CREATE POLICY "Auth users can send messages" ON messages 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can view messages" ON messages 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Verify the policies were created
SELECT 
  policyname,
  cmd,
  permissive,
  with_check
FROM pg_policies 
WHERE tablename = 'messages'
ORDER BY cmd;
