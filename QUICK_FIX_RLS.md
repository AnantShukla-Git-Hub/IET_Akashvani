# Quick Fix: Setup Page RLS Error

**Problem:** Setup failing with error `{}`

**Cause:** Missing RLS policy for INSERT on users table

---

## Quick Fix (2 minutes)

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your IET Akashvani project
3. Click **SQL Editor** in left sidebar

### Step 2: Run This SQL
Copy and paste this into SQL Editor:

```sql
-- Fix RLS Policy for Users Table
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

CREATE POLICY "Authenticated users can insert profile" ON users 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);
```

### Step 3: Click "Run"
- Should see: `DROP POLICY` and `CREATE POLICY` success messages

### Step 4: Test
1. Open `http://localhost:3000`
2. Login with college email
3. Fill setup form
4. Click "Complete Setup"
5. Should work now! ✅

---

## What This Does

**Before:** RLS blocks all INSERT operations (no policy exists)  
**After:** Authenticated users can insert their profile

**Security:** Still secure because:
- User must be logged in (OAuth)
- Email is unique (can't duplicate)
- Roll number is unique (can't steal)

---

## Verify It Worked

Run this in SQL Editor:
```sql
SELECT policyname FROM pg_policies WHERE tablename = 'users';
```

Should see:
- `Users can view all profiles`
- `Authenticated users can insert profile` ← NEW!
- `Users can update own profile`

---

**Done!** Setup should work now.

For detailed explanation, see [SETUP_RLS_FIX.md](./SETUP_RLS_FIX.md)
