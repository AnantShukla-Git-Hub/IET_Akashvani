# IET Akashvani - Complete Setup Guide

Follow these steps in order to set up IET Akashvani from scratch.

---

## Prerequisites

- Node.js 18+ installed
- Git installed
- A Google account
- A web browser

---

## STEP 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub or email
4. Click "New Project"
5. Fill in:
   - **Name:** `iet-akashvani`
   - **Database Password:** (create a strong password and save it)
   - **Region:** Choose closest to India (Mumbai if available)
   - **Pricing Plan:** Free
6. Click "Create new project"
7. Wait 2-3 minutes for setup to complete

### 1.2 Get Supabase Credentials

1. In your Supabase project dashboard
2. Click the **Settings** icon (⚙️) in the left sidebar
3. Click **API** in the settings menu
4. You'll see:
   - **Project URL** - Copy this (looks like: `https://xxxxx.supabase.co`)
   - **Project API keys** - Copy the `anon` `public` key (long string starting with `eyJ...`)

**Save these for Step 6!**

### 1.3 Run Database Schema

1. In Supabase dashboard, click **SQL Editor** in left sidebar
2. Click **New query**
3. Copy the ENTIRE content from `supabase-schema.sql` file
4. Paste into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see: "Success. No rows returned"
7. Verify tables created:
   - Click **Table Editor** in left sidebar
   - You should see 14 tables: users, designations, posts, comments, likes, rooms, messages, achievements, promotions, vibes, tags, reports, hostels, departments

### 1.4 Run Special Users Migration

1. Still in **SQL Editor**
2. Click **New query**
3. Copy the ENTIRE content from `migrations/add-special-users.sql`
4. Paste and click **Run**
5. You should see: "Special users support added successfully!"

---

## STEP 2: Google OAuth Setup

### 2.1 Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click the project dropdown (top left)
3. Click **New Project**
4. Project name: `IET Akashvani`
5. Click **Create**
6. Wait for project creation
7. Select the new project from dropdown

### 2.2 Enable Google+ API

1. Click hamburger menu (☰) → **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it
4. Click **Enable**

### 2.3 Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External**
3. Click **Create**
4. Fill in:
   - **App name:** `IET Akashvani`
   - **User support email:** Your email
   - **Developer contact:** Your email
5. Click **Save and Continue**
6. **Scopes:** Skip (click **Save and Continue**)
7. **Test users:** Add your @ietlucknow.ac.in email and 2-3 friends
8. Click **Save and Continue**
9. Click **Back to Dashboard**

### 2.4 Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `IET Akashvani Web`
5. **Authorized JavaScript origins:**
   - Add: `http://localhost:3000`
   - Add: `https://ietakashvani.vercel.app` (for later)
6. **Authorized redirect URIs:**
   - Add: `http://localhost:3000/auth/callback`
   - Add: `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
     (Replace YOUR_SUPABASE_PROJECT_REF with your actual project ref from Supabase URL)
7. Click **Create**
8. **Copy the Client ID and Client Secret** (save these!)

### 2.5 Add OAuth to Supabase

1. Go back to Supabase dashboard
2. Click **Authentication** in left sidebar
3. Click **Providers**
4. Find **Google** and toggle it ON
5. Paste:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)
6. Click **Save**

**Important:** The callback URL shown in Supabase should match what you added in Google Cloud Console:
`https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

---

## STEP 3: Cloudinary Setup

### 3.1 Create Cloudinary Account

1. Go to https://cloudinary.com
2. Click **Sign Up**
3. Fill in details and verify email
4. Login to dashboard

### 3.2 Get Cloudinary Credentials

1. In Cloudinary dashboard (home page)
2. You'll see:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Copy all three (save these!)

### 3.3 Create Upload Preset

1. Click **Settings** (⚙️) icon (top right)
2. Click **Upload** tab
3. Scroll to **Upload presets**
4. Click **Add upload preset**
5. Fill in:
   - **Preset name:** `iet_akashvani`
   - **Signing mode:** **Unsigned**
   - **Folder:** `iet-akashvani`
6. Click **Save**

---

## STEP 4: Clone and Install Project

### 4.1 Clone Repository

```bash
cd your-projects-folder
git clone https://github.com/AnantShukla-Git-Hub/iet-akashvani.git
cd iet-akashvani
```

Or if you have the folder already:
```bash
cd iet-akashvani
```

### 4.2 Install Dependencies

```bash
npm install
```

Wait for installation to complete (2-3 minutes).

---

## STEP 5: Configure Environment Variables

### 5.1 Open .env.local File

Open `iet-akashvani/.env.local` in your code editor.

### 5.2 Fill in All Values

Replace the placeholder values with your actual credentials:

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_long_key_here

# ============================================
# SITE CONFIGURATION
# ============================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ============================================
# CLOUDINARY CONFIGURATION
# ============================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnop

# ============================================
# ADMIN CONFIGURATION
# ============================================
NEXT_PUBLIC_OWNER_EMAIL=anantshukla836@gmail.com
ADMIN_SECRET=create_a_random_long_string_here
GUEST_SECRET=create_another_random_string_here

# ============================================
# EMAIL CONFIGURATION (Leave empty for now)
# ============================================
RESEND_API_KEY=
ADMIN_EMAIL=anant@ietlucknow.ac.in
```

**Generate Random Secrets:**
You can use this command or any password generator:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5.3 Save the File

Save `.env.local` with all values filled in.

---

## STEP 6: Initialize Rooms

### 6.1 Start Development Server

```bash
npm run dev
```

Wait for "Ready" message. Server runs on http://localhost:3000

### 6.2 Initialize Cross-Branch Rooms

Open a new terminal and run:

```bash
curl "http://localhost:3000/api/init-rooms?secret=YOUR_ADMIN_SECRET"
```

Replace `YOUR_ADMIN_SECRET` with the value from your `.env.local`

You should see:
```json
{
  "success": true,
  "message": "All rooms initialized successfully"
}
```

---

## STEP 7: Make Yourself Admin & Owner

### 7.1 Create Your Account First

1. Open http://localhost:3000
2. Click "Login with College Email"
3. Select your @ietlucknow.ac.in email
4. Complete profile setup
5. You're now in the system!

### 7.2 Set Admin & Owner Flags

1. Go to Supabase dashboard
2. Click **Table Editor**
3. Click **users** table
4. Find your user row (search by email)
5. Click to edit the row
6. Set these fields:
   - `is_admin` = `true`
   - `role` = `owner`
7. Click **Save**

**You're now the Owner with GOD MODE! 👑**

---

## STEP 8: Test Everything

### 8.1 Test Landing Page

1. Open http://localhost:3000
2. Should see "IET Akashvani" landing page
3. Should see "Login with College Email" button

### 8.2 Test Login Flow

1. Click "Login with College Email"
2. Google OAuth popup should open
3. Select @ietlucknow.ac.in email
4. Should redirect to setup page (if new user)
5. Or redirect to feed (if returning user)

### 8.3 Test Profile Setup

1. Upload profile photo
2. Enter name
3. Enter roll number (13 digits)
4. Should see parsed info (year, branch)
5. Click "Complete Setup"
6. Should redirect to feed

### 8.4 Test Roll Number Parser

1. Go to http://localhost:3000/test-parser
2. Try: `2500520100112`
3. Should show:
   - Admission Year: 2025
   - Current Year: 1st
   - Branch: CSE Regular

### 8.5 Test Admin Dashboard

1. Go to http://localhost:3000/admin/login
2. Login with your account
3. Should see admin dashboard
4. Try adding a special user
5. Check if it appears in the list

### 8.6 Verify Database

1. Go to Supabase → Table Editor
2. Check **users** table - your user should be there
3. Check **rooms** table - should have 9 rooms (8 cross-branch + 1 alumni)
4. Check **designations** table - should be empty (for now)

---

## STEP 9: Invite Test Users

### 9.1 Share with Friends

1. Share the link: http://localhost:3000
2. Ask 2-3 friends to sign up
3. They should use @ietlucknow.ac.in emails
4. Watch them appear in your users table!

### 9.2 Test Different Roll Numbers

Ask friends to use different:
- Years (2024, 2025 batches)
- Branches (CSE Regular, CSE SF, CSE AI)
- Verify year and branch auto-detection works

---

## Troubleshooting

### "Invalid email domain" Error

**Problem:** Using non-IET email
**Solution:** Use @ietlucknow.ac.in email only (or add as special user via admin)

### Google OAuth Not Working

**Problem:** OAuth popup doesn't open or shows error
**Solution:**
1. Check redirect URIs in Google Cloud Console
2. Make sure they match exactly
3. Check Supabase provider settings
4. Clear browser cache

### Roll Number Not Parsing

**Problem:** "Invalid roll number" error
**Solution:**
1. Check length (must be 13 digits)
2. Check branch code (position 7): 0, 1, or 2
3. Try test parser: http://localhost:3000/test-parser

### Images Not Uploading

**Problem:** Cloudinary upload fails
**Solution:**
1. Check cloud name in .env.local
2. Check upload preset is "unsigned"
3. Check preset name is exactly `iet_akashvani`

### Database Errors

**Problem:** "relation does not exist" or similar
**Solution:**
1. Re-run supabase-schema.sql in SQL Editor
2. Check all 14 tables exist
3. Run migrations/add-special-users.sql

### Can't Access Admin Dashboard

**Problem:** Redirected to main site
**Solution:**
1. Check `is_admin = true` in database
2. Check `role = owner` in database
3. Logout and login again

---

## Next Steps

Once everything is working:

1. ✅ Landing page loads
2. ✅ Login works
3. ✅ Profile setup works
4. ✅ Roll number parsing works
5. ✅ Admin dashboard accessible
6. ✅ Database populated

**You're ready for Week 5-6: Main Feed!** 🚀

---

## Quick Reference

### URLs:
- Main site: http://localhost:3000
- Test parser: http://localhost:3000/test-parser
- Admin login: http://localhost:3000/admin/login
- Admin dashboard: http://localhost:3000/admin

### Commands:
```bash
# Start dev server
npm run dev

# Initialize rooms
curl "http://localhost:3000/api/init-rooms?secret=YOUR_SECRET"

# Type check
npm run type-check

# Build for production
npm run build
```

### Important Files:
- `.env.local` - Environment variables
- `supabase-schema.sql` - Database schema
- `migrations/add-special-users.sql` - Special users migration

### Support:
- Check documentation in project folder
- Check Supabase logs
- Check browser console (F12)
- Check terminal for errors

---

**Setup Complete!** 🎉

Time to build the feed! 🚀
