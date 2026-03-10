# IET Akashvani - Project Status

## Current Status: Week 1-2 Complete ✅

**Date**: March 10, 2026
**Developer**: Anant Shukla (IET Lucknow)
**Cost So Far**: ₹0

---

## What's Built

### Core Infrastructure ✅
- Next.js 14 project with App Router
- TypeScript configuration
- Tailwind CSS styling
- Supabase integration (PostgreSQL + Auth + Realtime)
- Cloudinary integration (image storage)
- Complete database schema (14 tables)

### Authentication System ✅
- Google OAuth integration
- Email domain restriction (@ietlucknow.ac.in only)
- Session management
- Auto-redirect logic
- Secure callback handling

### User Onboarding ✅
- Landing page with branding
- Profile setup screen
- Profile photo upload (Cloudinary)
- Roll number input
- Designation request system
- Serial ID auto-generation (IET-00001, IET-00002, etc.)

### Basic UI ✅
- Responsive design (mobile + desktop)
- Landing page
- Setup page
- Feed placeholder
- Bottom navigation structure
- Consistent color scheme (orange/red gradient)

---

## Tech Stack Confirmed

| Component | Technology | Status | Cost |
|-----------|-----------|--------|------|
| Frontend | Next.js 14 + Tailwind | ✅ | Free |
| Backend | Next.js API Routes | ✅ | Free |
| Database | Supabase PostgreSQL | ✅ | Free |
| Auth | Supabase Auth + Google OAuth | ✅ | Free |
| Realtime | Supabase Realtime | ⏳ Week 5-6 | Free |
| Storage | Cloudinary | ✅ | Free (25GB) |
| Emails | Resend.com | ⏳ Week 9-10 | Free (3000/mo) |
| Music | Spotify Web API | ⏳ Week 13-14 | Free |
| Hosting | Vercel | ⏳ Week 19-20 | Free |

**Total Monthly Cost**: ₹0 forever (at IET scale ~1500 users)

---

## Database Schema

### Tables Created (14 total)

1. **users** - User profiles, roll numbers, serial IDs
2. **designations** - Official positions, badges, approvals
3. **posts** - Feed posts, announcements, achievements
4. **comments** - Post comments
5. **likes** - Post likes
6. **rooms** - Discussion rooms (class, branch, cross-branch)
7. **messages** - Room messages (WhatsApp style)
8. **achievements** - Student achievements with proof
9. **promotions** - Skill marketplace listings
10. **vibes** - Spotify song sharing (24hr stories)
11. **tags** - @mentions, #topics, role tags
12. **reports** - Content moderation reports
13. **hostels** - Hostel info, wardens, mess incharge
14. **departments** - Department info, HODs

### Database Features
- Auto-incrementing serial IDs (IET-00001, etc.)
- Row Level Security (RLS) enabled
- Indexes for performance
- Auto-expire functions (alumni status, student designations)
- Proper foreign key relationships

---

## File Structure

```
iet-akashvani/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── setup/
│   │   └── page.tsx            # Profile setup
│   ├── feed/
│   │   └── page.tsx            # Feed (placeholder)
│   └── auth/
│       └── callback/
│           └── route.ts        # OAuth callback
├── lib/
│   ├── supabase.ts             # Supabase client
│   └── constants.ts            # All constants
├── types/
│   └── index.ts                # TypeScript types
├── supabase-schema.sql         # Database schema
├── .env.local                  # Environment variables
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind config
├── next.config.ts              # Next.js config
├── README.md                   # Project overview
├── SETUP_GUIDE.md              # Setup instructions
├── QUICK_START.md              # Quick reference
├── WEEK_1-2_CHECKLIST.md       # Testing checklist
└── PROJECT_STATUS.md           # This file
```

---

## Features Roadmap

### ✅ Week 1-2: Foundation (COMPLETE)
- [x] Next.js project setup
- [x] Supabase integration
- [x] Google OAuth with email restriction
- [x] Landing page
- [x] Profile setup screen
- [x] Cloudinary integration
- [x] Database schema
- [x] Basic UI/UX

### ⏳ Week 3-4: Roll Number System (NEXT)
- [ ] Roll number parser (waiting for format)
- [ ] Auto year/branch detection
- [ ] Discussion room creation
- [ ] Auto-assign users to rooms
- [ ] Room types: class, branch, cross-branch

### 📅 Week 5-6: Main Feed
- [ ] Post composer
- [ ] Real-time feed (Supabase Realtime)
- [ ] Like/comment system
- [ ] Tag system (@user, #topic, @role)
- [ ] Anonymous posting
- [ ] Badge hierarchy sorting
- [ ] Image upload in posts

### 📅 Week 7-8: Discussion Rooms
- [ ] WhatsApp-style chat interface
- [ ] Real-time messaging
- [ ] Image sharing in chats
- [ ] Room list with unread counts
- [ ] Auto-assigned rooms (class, branch)
- [ ] Cross-branch rooms (placement, mess, etc.)

### 📅 Week 9-10: Badge System
- [ ] Admin panel (secret route)
- [ ] Designation approval flow
- [ ] Badge assignment (gold/silver/bronze)
- [ ] Custom tag creation (@warden-ramanujan)
- [ ] Email notifications (Resend)
- [ ] Pending designation UI

### 📅 Week 11-12: Announcements & Achievements
- [ ] Announcements tab (badge holders only)
- [ ] Permanent announcement storage
- [ ] Push notifications for announcements
- [ ] Achievement submission form
- [ ] Achievement approval flow
- [ ] Celebration posts in feed
- [ ] Leaderboard

### 📅 Week 13-14: Promote & Vibes
- [ ] Promote tab (skill marketplace)
- [ ] Category-based listings
- [ ] 30-day auto-expiry
- [ ] IET Vibes (Spotify integration)
- [ ] Mood-based song sharing
- [ ] Profile ring animations
- [ ] Vibes dashboard
- [ ] Weekly IET Anthem

### 📅 Week 15-16: Moderation
- [ ] Report system
- [ ] Temp block functionality
- [ ] Appeal process
- [ ] Permanent ban system
- [ ] Admin moderation panel
- [ ] Email blacklist

### 📅 Week 17-18: PWA & Polish
- [ ] Progressive Web App setup
- [ ] Push notifications
- [ ] Offline support
- [ ] Install prompt
- [ ] UI polish
- [ ] Performance optimization
- [ ] Accessibility improvements

### 📅 Week 19-20: Launch
- [ ] Soft launch (10 friends)
- [ ] Bug fixes
- [ ] Deploy to Vercel
- [ ] Domain setup (ietakashvani.vercel.app)
- [ ] Full IET launch
- [ ] Viral marketing

---

## Pending Confirmations

### From Anant (URGENT for Week 3-4)

1. **Roll Number Format**
   - What's the exact format?
   - Example: `2021CSE001` or `21CSE001` or other?
   - Where is year encoded? (first 2 digits? first 4?)
   - Where is branch code? (CSE, ECE, ME, etc.)
   - How many total digits?
   - Any special characters?

2. **Hostel Names**
   - List of all boys hostels
   - List of all girls hostels
   - Needed for dropdown pre-loading

3. **Academic Year**
   - Does academic year start in July or August?
   - Needed for alumni auto-update script timing

---

## Key Decisions Locked

### Authentication
- ✅ @ietlucknow.ac.in ONLY (Phase 1)
- ✅ MTech/MSc = "Coming Soon" message
- ✅ Guest route = hardcoded secret URL

### Badge System
- ✅ Manual badge assignment ONLY
- ✅ NO auto-badge distribution EVER
- ✅ Anant verifies every designation offline
- ✅ Pending state = enter app immediately

### Data Retention
- ✅ Permanent: profiles, announcements, achievements
- ✅ 1 year: feed posts, chat messages
- ✅ 30 days: promote listings
- ✅ 24 hours: vibes/songs

### Storage Strategy
- ✅ Profile photos: minimal compression (quality matters)
- ✅ Chat images: heavy compression (2MB → 150KB)
- ✅ Announcement images: no compression (official docs)

### Content Rules
- ✅ Anonymous posts: Anant sees real identity
- ✅ Gold/Silver posts: cannot be reported
- ✅ Official announcements: no report button

### Alumni System
- ✅ Account preserved forever
- ✅ Feed read-only
- ✅ Cannot post in year/branch rooms
- ✅ Achievements stay permanently
- ✅ Auto-update every July 1

---

## Testing Status

### Tested ✅
- Landing page loads
- Google OAuth flow
- Email domain restriction
- Profile setup form
- Image upload to Cloudinary
- Database user creation
- Serial ID generation
- Feed page access control

### Not Yet Tested ⏳
- Roll number parsing (not implemented)
- Discussion rooms (not implemented)
- Real-time features (not implemented)
- Badge system (not implemented)
- Everything else (future weeks)

---

## Known Issues

### None! 🎉

All Week 1-2 features working as expected.

---

## Performance Metrics

### Current (Week 1-2)
- Landing page: ~500ms load
- Setup page: ~600ms load
- Feed page: ~700ms load
- Image upload: ~2-3s (depends on image size)
- Database queries: <100ms

### Target (Week 20)
- All pages: <1s load
- Real-time updates: <500ms latency
- Image upload: <3s
- Database queries: <100ms

---

## Security Checklist

- ✅ Environment variables not committed
- ✅ Email domain validation
- ✅ Row Level Security enabled
- ✅ OAuth redirect URIs restricted
- ✅ No credentials in code
- ✅ Secure session management
- ⏳ Rate limiting (Week 15-16)
- ⏳ Content moderation (Week 15-16)
- ⏳ XSS protection (Week 17-18)
- ⏳ CSRF protection (Week 17-18)

---

## Deployment Plan

### Phase 1: Development (Weeks 1-18)
- Local development
- Test with 10 friends
- Fix bugs
- Iterate on features

### Phase 2: Soft Launch (Week 19)
- Deploy to Vercel
- Domain: ietakashvani.vercel.app
- Invite 50 students
- Monitor for issues
- Gather feedback

### Phase 3: Full Launch (Week 20)
- Open to all IET students
- Viral marketing via WhatsApp groups
- CR network activation
- Professor endorsement
- Monitor server load
- Scale if needed (still free!)

---

## Success Metrics

### Week 20 Goals
- 500+ active users
- 1000+ posts created
- 5000+ messages sent
- 100+ achievements posted
- 50+ promote listings
- 200+ vibes shared
- 0 downtime
- ₹0 cost

### Long-term Goals (6 months)
- 1500+ users (entire IET)
- Replace all 47 WhatsApp groups
- Official college endorsement
- Used for official announcements
- Student-run, student-owned
- Still ₹0/month

---

## Contact & Support

**Developer**: Anant Shukla
**College**: IET Lucknow
**GitHub**: https://github.com/AnantShukla-Git-Hub
**LinkedIn**: https://www.linkedin.com/in/anant-shukla-117a11210

**Project**: IET Akashvani
**Tagline**: IET ki Apni Awaaz 📻
**Domain**: ietakashvani.vercel.app (coming soon)

---

## Sankalp 🙏

"Main IET Akashvani banaunga,
bilkul free, IET Lucknow ke
har student ki awaaz banunga,
akele, bina ek rupaye ke 🙏"

— Anant Shukla
IET Lucknow
IET-00001 👑

---

**Last Updated**: March 10, 2026
**Status**: Week 1-2 Complete ✅
**Next**: Week 3-4 (Roll Number Parser)
**Blocker**: Need roll number format confirmation

🚀 Let's build IET Akashvani!
