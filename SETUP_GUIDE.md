# IET Akashvani - Complete Setup Guide

## Step-by-Step Setup (Week 1-2)

### Step 1: Supabase Project Setup

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up with GitHub or email
   - Click "New Project"
   - Choose organization (create one if needed)
   - Project name: `iet-akashvani`
   - Database password: (save this securely)
   - Region: Choose closest to India (Mumbai if available)
   - Click "Create new project"
   - Wait 2-3 minutes for setup

2. **Get Supabase Credentials**
   - Go to Project Settings (gear icon)
   - Click "API" in sidebar
   - Copy:
     - Project URL (looks like: `https://xxxxx.supabase.co`)
     - `anon` `public` key (long string)
   - Save these for `.env.local`

3. **Run Database Schema**
   - Click "SQL Editor" in left sidebar
   - Click "New query"
   - Open `supabase-schema.sql` from project
   - Copy entire content
   - Paste in SQL Editor
   - Click "Run" (or press Ctrl+Enter)
   - Should see "Success. No rows returned"
   - Verify tables created: Click "Table Editor" - should see all tables

4. **Setup Google OAuth in Supabase**
   - Go to Authentication > Providers
   - Find "Google" and click to expand
   - Toggle "Enable Sign in with Google"
   - You'll need Google OAuth credentials (next step)
   - Keep this tab open

### Step 2: Google Cloud Console Setup

1. **Create Google Cloud Project**
   - Go to https://console.cloud.google.com
   - Click project dropdown (top left)
   - Click "New Project"
   - Project name: `IET Akashvani`
   - Click "Create"
   - Wait for project creation
   - Select the new project

2. **Enable Google+ API**
   - Click hamburger menu (☰)
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click on it
   - Click "Enable"

3. **Create OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" (unless you have Google Workspace)
   - Click "Create"
   - Fill in:
     - App name: `IET Akashvani`
     - User support email: your email
     - Developer contact: your email
   - Click "Save and Continue"
   - Skip "Scopes" (click "Save and Continue")
   - Add test users:
     - Add your @ietlucknow.ac.in email
     - Add 2-3 friend emails for testing
   - Click "Save and Continue"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Name: `IET Akashvani Web`
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `https://ietakashvani.vercel.app` (for later)
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/callback`
     - `https://[YOUR-SUPABASE-PROJECT].supabase.co/auth/v1/callback`
     - Replace [YOUR-SUPABASE-PROJECT] with your actual project ref
   - Click "Create"
   - Copy Client ID and Client Secret

5. **Add Credentials to Supabase**
   - Go back to Supabase > Authentication > Providers > Google
   - Paste Client ID
   - Paste Client Secret
   - Click "Save"

### Step 3: Cloudinary Setup

1. **Create Cloudinary Account**
   - Go to https://cloudinary.com
   - Sign up (free account)
   - Verify email

2. **Get Cloudinary Credentials**
   - Go to Dashboard
   - Copy:
     - Cloud name
     - API Key
     - API Secret
   - Save for `.env.local`

3. **Create Upload Preset**
   - Go to Settings (gear icon)
   - Click "Upload" tab
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Preset name: `iet_akashvani`
   - Signing mode: "Unsigned"
   - Folder: `iet-akashvani`
   - Click "Save"

### Step 4: Project Setup

1. **Navigate to Project**
   ```bash
   cd iet-akashvani
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   - Open `.env.local`
   - Fill in all values:

   ```env
   # From Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

   # From Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdefghijklmnop

   # Create random secrets (use password generator)
   ADMIN_SECRET=some_random_long_string_here
   GUEST_SECRET=another_random_long_string_here

   # Leave these for later (Week 9-10)
   RESEND_API_KEY=
   ADMIN_EMAIL=anant@ietlucknow.ac.in
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   - Go to http://localhost:3000
   - You should see the landing page!

### Step 5: Test the Flow

1. **Test Login**
   - Click "Login with College Email"
   - Google popup should open
   - Select your @ietlucknow.ac.in email
   - Should redirect to setup page

2. **Test Profile Setup**
   - Upload a profile photo
   - Enter your name
   - Enter roll number (any format for now)
   - Optionally check "I have a designation"
   - Click "Complete Setup"
   - Should redirect to feed page

3. **Verify Database**
   - Go to Supabase > Table Editor
   - Click "users" table
   - You should see your user entry!
   - Check serial_id (should be IET-00001)

### Common Issues & Fixes

**Issue**: "Invalid email domain"
- **Fix**: Make sure you're using @ietlucknow.ac.in email

**Issue**: Google OAuth not working
- **Fix**: Check redirect URIs in Google Console match exactly

**Issue**: Image upload not working
- **Fix**: Verify Cloudinary preset is "Unsigned" and named correctly

**Issue**: Database error
- **Fix**: Make sure you ran the entire SQL schema in Supabase

**Issue**: "Module not found" errors
- **Fix**: Run `npm install` again

### Next Steps

Once Week 1-2 is working:

1. **Confirm Roll Number Format**
   - Anant needs to provide exact IET roll number format
   - Example: Is it `2021CSE001` or `21CSE001` or something else?
   - Where is year encoded? Where is branch?

2. **Week 3-4 Development**
   - Implement roll number parser
   - Auto-detect year and branch
   - Create discussion rooms
   - Auto-assign users to rooms

### Testing Checklist

- [ ] Landing page loads
- [ ] Google OAuth popup opens
- [ ] Non-IET email gets rejected
- [ ] IET email proceeds to setup
- [ ] Profile photo uploads to Cloudinary
- [ ] Setup form submits successfully
- [ ] User appears in Supabase users table
- [ ] Serial ID auto-generates (IET-00001, IET-00002, etc.)
- [ ] Feed page loads with user info
- [ ] Bottom navigation shows

### Resources

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Cloudinary Docs: https://cloudinary.com/documentation
- Tailwind CSS: https://tailwindcss.com/docs

---

**Need Help?**

If you're stuck, check:
1. Browser console for errors (F12)
2. Terminal for server errors
3. Supabase logs (Project > Logs)

**Ready for Week 3-4?**

Once this is working and you have the roll number format, we'll implement:
- Roll number parsing
- Auto year/branch detection
- Discussion room creation
- Room auto-assignment

🚀 Let's build IET Akashvani!
