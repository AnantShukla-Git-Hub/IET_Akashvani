-- Create Owner Profile
-- This creates the owner profile for Anant with GOD MODE access
-- Run this ONCE in Supabase SQL Editor

-- Check if owner already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'anantshukla836@gmail.com'
  ) THEN
    -- Create owner profile
    INSERT INTO users (
      email,
      name,
      role,
      is_admin,
      skip_setup,
      can_see_anonymous,
      badge_override,
      college
    ) VALUES (
      'anantshukla836@gmail.com',
      'Anant Shukla',
      'owner',
      true,
      true,
      true,
      'owner',
      'IET Lucknow'
    );
    
    RAISE NOTICE 'Owner profile created successfully';
  ELSE
    RAISE NOTICE 'Owner profile already exists';
  END IF;
END $$;

-- Verify owner profile
SELECT 
  email,
  name,
  role,
  is_admin,
  skip_setup,
  can_see_anonymous,
  badge_override,
  serial_id
FROM users 
WHERE email = 'anantshukla836@gmail.com';

-- Expected output:
-- email: anantshukla836@gmail.com
-- name: Anant Shukla
-- role: owner
-- is_admin: true
-- skip_setup: true
-- can_see_anonymous: true
-- badge_override: owner
-- serial_id: IET-00001 (or similar)
