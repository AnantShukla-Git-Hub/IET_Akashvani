# IET Akashvani - Quick Start

## What's Been Built (Week 1-2) ✅

### Files Created

```
iet-akashvani/
├── app/
│   ├── page.tsx                    # Landing page with Google OAuth
│   ├── layout.tsx                  # Root layout with metadata
│   ├── setup/
│   │   └── page.tsx               # Profile setup screen
│   ├── feed/
│   │   └── page.tsx               # Feed placeholder
│   └── auth/
│       └── callback/
│           └── route.ts           # OAuth callback handler
├── lib/
│   ├── supabase.ts                # Supabase client
│   └── constants.ts               # All constants (badges, rooms, etc.)
├── types/
│   └── index.ts                   # TypeScript type definitions
├── supabase-schema.sql            # Complete database schema
├── .env.local                     # Environment variables (fill this!)
├── README.md                      # Project overview
├── SETUP_GUIDE.md                 # Detailed setup instructions
└── QUICK_START.md                 # This file
```

### Features Implemented

1. **Landing Page** (`/`)
   - IET Akashvani branding
   - Google OAuth button
   - Auto-redirects if already logged in

2. **Email Domain Check**
   - Only @ietlucknow.ac.in allowed
   - Rejects other emails with message
   - Automatic sign-out if wrong domain

3. **Profile Setup** (`/setup`)
   - Profile photo upload (Cloudinary)
   - Full name input
   - Roll number input
   - Optional designation request
   - Auto-generates serial ID (IET-00001, etc.)

4. **Feed Page** (`/feed`)
   - Basic welcome screen
   - Shows user info
   - Bottom navigation placeholder
   - Auth check (redirects if not logged in)

5. **Database Schema**
   - All 14 tables created
   - Indexes for performance
   - Row Level Security enabled
   - Auto-functions for serial_id, alumni status

### What Works Right Now

✅ User can visit landing page
✅ Click "Login with College Email"
✅ Google OAuth popup opens
✅ Non-IET emails get rejected
✅ IET emails proceed to setup
✅ Upload profile photo to Cloudinary
✅ Fill profile form
✅ Submit creates user in database
✅ Auto-generates serial ID
✅ Redirects to feed
✅ Feed shows user info

### What's NOT Implemented Yet

❌ Roll number parsing (waiting for format)
❌ Auto year/branch detection
❌ Discussion rooms
❌ Actual feed posts
❌ Real-time updates
❌ Badge system
❌ Admin panel
❌ Achievements
❌ Announcements
❌ Promote feature
❌ IET Vibes (Spotify)
❌ Moderation
❌ Email notifications

## How to Run

### First Time Setup

1. **Install dependencies**
   ```bash
   cd iet-akashvani
   npm install
   ```

2. **Setup Supabase**
   - Create project at supabase.com
   - Run `supabase-schema.sql` in SQL Editor
   - Setup Google OAuth provider
   - Copy credentials to `.env.local`

3. **Setup Cloudinary**
   - Create account at cloudinary.com
   - Create upload preset: `iet_akashvani`
   - Copy credentials to `.env.local`

4. **Setup Google OAuth**
   - Create project in Google Cloud Console
   - Enable Google+ API
   - Create OAuth credentials
   - Add redirect URIs
   - Add credentials to Supabase

5. **Fill `.env.local`**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ADMIN_SECRET=random_string
   GUEST_SECRET=random_string
   ```

6. **Run dev server**
   ```bash
   npm run dev
   ```

7. **Open browser**
   ```
   http://localhost:3000
   ```

### Daily Development

```bash
cd iet-akashvani
npm run dev
```

That's it! Server runs on http://localhost:3000

## Testing the App

### Test Flow 1: New User Signup

1. Open http://localhost:3000
2. Click "Login with College Email"
3. Select @ietlucknow.ac.in email
4. Should redirect to `/setup`
5. Upload photo, fill name, roll number
6. Click "Complete Setup"
7. Should redirect to `/feed`
8. Check Supabase - user should be in database

### Test Flow 2: Returning User

1. Open http://localhost:3000
2. Already logged in? Auto-redirects to `/feed`
3. Not logged in? Shows landing page

### Test Flow 3: Wrong Email

1. Open http://localhost:3000
2. Click "Login with College Email"
3. Select non-IET email (like @gmail.com)
4. Should redirect back with error message
5. Should NOT create user in database

## Database Tables

All tables are in Supabase. Check them:
1. Go to Supabase dashboard
2. Click "Table Editor"
3. See all tables:
   - users
   - designations
   - posts
   - comments
   - likes
   - rooms
   - messages
   - achievements
   - promotions
   - vibes
   - tags
   - reports
   - hostels
   - departments

## Next Development Phase

### Week 3-4: Roll Number System

**Waiting for Anant to confirm:**
- Exact roll number format
- Where year is encoded
- Where branch is encoded

**Once confirmed, implement:**
1. Roll number parser function
2. Auto-detect year (1/2/3/4)
3. Auto-detect branch (CSE/ECE/ME/etc.)
4. Create discussion rooms:
   - Year+Branch rooms (e.g., "3rd Year CSE")
   - Branch-wide rooms (e.g., "CSE Branch")
   - Cross-branch rooms (Placement, Mess, etc.)
5. Auto-assign users to rooms on signup

### Week 5-6: Main Feed

1. Create post composer
2. Real-time feed with Supabase Realtime
3. Like/comment functionality
4. Tag system (@mentions, #topics)
5. Anonymous posting
6. Badge hierarchy sorting

## Important Notes

### Email Domain Check
- Hardcoded: `@ietlucknow.ac.in`
- Phase 1: BTech only
- Phase 2: MTech/MSc via guest route

### Serial ID
- Auto-generates: IET-00001, IET-00002, etc.
- Anant is IET-00001 (first user)
- Never changes, permanent

### Designation Flow
- User requests → enters app immediately
- Shows "⏳ Pending Approval"
- Anant verifies offline
- Anant approves in admin panel
- Badge goes live

### Storage Strategy
- Profile photos: Cloudinary, minimal compression
- Chat images: Cloudinary, heavy compression
- 25GB free tier (enough for IET scale)

### Cost Breakdown
- Vercel: Free (hobby plan)
- Supabase: Free (500MB DB, 2GB bandwidth)
- Cloudinary: Free (25GB storage)
- Resend: Free (3000 emails/month)
- Spotify API: Free
- **Total: ₹0/month**

## Troubleshooting

### "Module not found"
```bash
npm install
```

### "Invalid email domain"
- Use @ietlucknow.ac.in email only

### OAuth not working
- Check Google Console redirect URIs
- Check Supabase provider settings
- Clear browser cache

### Image upload fails
- Check Cloudinary preset name
- Must be "unsigned"
- Check cloud name in .env.local

### Database errors
- Run supabase-schema.sql again
- Check Supabase logs

## Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check

# Lint code
npm run lint
```

## File Structure Logic

- `app/` - Next.js 14 App Router pages
- `lib/` - Utility functions, clients, constants
- `types/` - TypeScript type definitions
- `components/` - Reusable React components (Week 5+)
- `hooks/` - Custom React hooks (Week 5+)
- `utils/` - Helper functions (Week 3+)

## Ready to Continue?

Once Week 1-2 is tested and working:

1. **Get roll number format from Anant**
2. **Start Week 3-4 development**
3. **Implement room system**
4. **Move to Week 5-6 (feed)**

---

**Status**: Week 1-2 Complete ✅
**Next**: Week 3-4 (Roll Number Parser)
**Blocker**: Need roll number format from Anant

🚀 IET Akashvani - Let's build!
