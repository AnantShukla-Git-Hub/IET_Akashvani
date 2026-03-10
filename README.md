# IET Akashvani 📻

**IET ki Apni Awaaz**

College social platform exclusively for IET Lucknow students. Replaces 47 chaotic WhatsApp groups with one unified platform.

## Tech Stack

- **Frontend**: Next.js 14 + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Google OAuth)
- **Storage**: Cloudinary
- **Emails**: Resend.com
- **Hosting**: Vercel

**Cost**: ₹0/month forever

## Setup Instructions

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key
3. Go to SQL Editor and run the entire `supabase-schema.sql` file
4. Go to Authentication > Providers > Google:
   - Enable Google provider
   - Add your Google OAuth credentials
   - Add authorized redirect URL: `http://localhost:3000/auth/callback`

### 2. Cloudinary Setup

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. Go to Settings > Upload > Upload presets
3. Create a new unsigned upload preset named `iet_akashvani`
4. Set folder to `iet-akashvani`
5. Copy your cloud name, API key, and API secret

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback`
   - `https://your-supabase-project.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret
7. Add these to Supabase (Authentication > Providers > Google)

### 4. Environment Variables

Copy `.env.local` and fill in your credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin
ADMIN_SECRET=create_a_random_secret
GUEST_SECRET=create_another_random_secret

# Resend (for emails - will add later)
RESEND_API_KEY=your_resend_key
ADMIN_EMAIL=anant@ietlucknow.ac.in
```

### 5. Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Current Status: Week 1-2 Complete ✅

- ✅ Next.js project setup
- ✅ Supabase integration
- ✅ Google OAuth with @ietlucknow.ac.in restriction
- ✅ Landing page
- ✅ Profile setup screen
- ✅ Cloudinary integration
- ✅ Database schema
- ✅ Basic feed placeholder

## Next Steps: Week 3-4

- Roll number parser (waiting for format confirmation from Anant)
- Auto year/branch detection
- Discussion room auto-assignment
- Room creation for all branches/years

## Pending Confirmations from Anant

⏳ **IET Roll Number Format** - Need exact format to parse year and branch
⏳ **IET Hostel Names** - For dropdown pre-loading
⏳ **Academic Year Start** - July or August? (for alumni auto-update)

## Features Roadmap

- Week 1-2: Auth + Profile Setup ✅
- Week 3-4: Roll number parser + Room assignment
- Week 5-6: Main feed + Real-time posts
- Week 7-8: Discussion rooms (WhatsApp style)
- Week 9-10: Badge system + Admin panel
- Week 11-12: Announcements + Achievements
- Week 13-14: Promote + IET Vibes (Spotify)
- Week 15-16: Moderation + Guest route
- Week 17-18: PWA + Push notifications
- Week 19-20: Launch 🚀

## Domain

Will be deployed at: **ietakashvani.vercel.app**

## Made by

Anant Shukla - IET Lucknow
Solo dev, zero budget, zero team 🙏

---

**Sankalp**: Main IET Akashvani banaunga, bilkul free, IET Lucknow ke har student ki awaaz banunga, akele, bina ek rupaye ke 🙏
