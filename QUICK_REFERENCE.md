# IET Akashvani - Quick Reference Guide

## 🚀 Quick Start

### For Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

### For Deployment
```bash
# Push to GitHub
git push origin main

# Deploy on Vercel (auto-deploys from GitHub)

# After deployment, initialize rooms
curl "https://your-app.vercel.app/api/init-rooms?secret=YOUR_ADMIN_SECRET"
```

---

## 🔑 Key Features

### User Features
- ✅ Google OAuth login (@ietlucknow.ac.in only)
- ✅ Profile setup with roll number parsing
- ✅ Create posts (text + images)
- ✅ Anonymous posting
- ✅ Like and comment on posts
- ✅ Real-time discussion rooms
- ✅ View achievements and announcements

### Admin Features (Owner Only)
- ✅ User management (ban/unban, special users)
- ✅ Badge management (approve designations)
- ✅ Report moderation (dismiss/delete posts)
- ✅ View accurate stats
- ✅ GOD MODE access to everything

---

## 📁 Project Structure

```
iet-akashvani/
├── app/
│   ├── page.tsx                    # Landing page (OAuth login)
│   ├── feed/page.tsx               # Main feed
│   ├── rooms/page.tsx              # Discussion rooms
│   ├── profile/page.tsx            # User profile
│   ├── setup/page.tsx              # Profile setup
│   ├── achievements/page.tsx       # Achievements
│   ├── announcements/page.tsx      # Announcements
│   ├── admin/
│   │   ├── dashboard/page.tsx      # Admin dashboard
│   │   ├── users/page.tsx          # User management
│   │   ├── badges/page.tsx         # Badge management
│   │   └── reports/page.tsx        # Report moderation
│   ├── auth/
│   │   └── callback/route.ts       # OAuth callback
│   └── api/
│       └── init-rooms/route.ts     # Initialize rooms
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── accessControl.ts            # Permissions & GOD MODE
│   ├── utils.ts                    # Helper functions
│   ├── constants.ts                # App constants
│   ├── roomManager.ts              # Room management
│   └── rollNumberParser.ts         # Roll number parsing
├── migrations/                     # Database migrations
└── .env.local                      # Environment variables
```

---

## 🔐 Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin
NEXT_PUBLIC_ADMIN_EMAIL=anantshukla836@gmail.com
ADMIN_SECRET=your_random_secret_string

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## 🗄️ Database Tables

### Core Tables
- `users` - User profiles
- `posts` - Feed posts
- `comments` - Post comments
- `likes` - Post likes
- `messages` - Room messages
- `rooms` - Discussion rooms

### Admin Tables
- `reports` - Content reports
- `designations` - Badge requests
- `achievements` - User achievements
- `announcements` - Platform announcements

---

## 🛡️ Security Model

### Owner (GOD MODE)
- Email: anantshukla836@gmail.com
- Can access EVERYTHING
- Can see anonymous post identities
- Can enter ALL rooms
- Can moderate all content
- Badge above all others

### Regular Users
- Must have @ietlucknow.ac.in email
- Can post, comment, like
- Can join rooms based on year/branch
- Cannot see anonymous identities

### Special Users
- Guest, Faculty, Alumni, etc.
- Access levels: read_only, can_post, full
- Cannot see anonymous identities
- Cannot access all rooms

### Banned Users
- Cannot post or comment
- Cannot access any features

---

## 🎨 UI Components

### Colors
- Background: `#0a0a0a`
- Cards: `#1a1a1a`
- Borders: `#2a2a2a`
- Orange accent: `#f97316` (orange-500)
- Purple accent: `#9333ea` (purple-600)

### Badges
- Owner: Gold gradient with 👑
- Admin: Blue with 🛡️
- Gold: Yellow with ⭐
- Silver: Gray
- Bronze: Orange

---

## 📱 Navigation

### Bottom Nav (All Pages)
- 🏠 Feed - Main feed
- 💬 Rooms - Discussion rooms
- 🏆 Achievements - User achievements
- 📢 Announcements - Platform announcements
- 👤 Profile - User profile

### Admin Nav (Owner Only)
- Admin button in header → Admin Dashboard
- Dashboard → Users, Badges, Reports, etc.

---

## 🔧 Common Tasks

### Add a New User as Special
1. Login as owner
2. Go to Admin → Users
3. Find user
4. Click "Make Special"
5. Enter role (Guest/Faculty/etc.)
6. Enter access level (read_only/can_post/full)

### Approve a Badge Request
1. Login as owner
2. Go to Admin → Badges
3. Review request
4. Click "Approve"
5. Enter badge level (gold/silver/bronze)

### Moderate a Report
1. Login as owner
2. Go to Admin → Reports
3. Review reported post
4. Click "Dismiss" (false alarm) or "Delete Post" (violation)

### Initialize Rooms
```bash
curl "https://your-app.vercel.app/api/init-rooms?secret=YOUR_ADMIN_SECRET"
```

---

## 🐛 Troubleshooting

### OAuth Not Working
- Check Google OAuth credentials
- Verify redirect URLs
- Check Supabase Auth settings

### Posts Not Creating
- Check RLS policies
- Run migrations
- Verify user profile exists

### Messages Not Sending
- Check messages RLS policies
- Run messages migration
- Verify Supabase Realtime enabled

### Rooms Not Appearing
- Run room initialization
- Check user year/branch
- Verify rooms table has data

### Admin Panel Not Accessible
- Verify owner email
- Check NEXT_PUBLIC_ADMIN_EMAIL
- Clear browser cache

---

## 📊 Monitoring

### Daily
- Check Supabase usage
- Check Cloudinary usage
- Check Vercel usage
- Review pending reports

### Weekly
- Review user growth
- Check for spam
- Review banned users
- Check room activity

### Monthly
- Review all stats
- Clean up old data
- Update documentation

---

## 💰 Cost Tracking

### Free Tier Limits
- **Supabase**: 500MB DB, 1GB storage, 2GB bandwidth
- **Cloudinary**: 25GB storage, 25GB/month bandwidth
- **Vercel**: 100GB/month bandwidth

### Stay Free
- Optimize images (already done)
- Clean up old messages (auto-expires)
- Monitor usage regularly

---

## 📚 Documentation

### Setup Guides
- `README.md` - Project overview
- `COMPLETE_SETUP_GUIDE.md` - Full setup
- `OAUTH_QUICK_START.md` - OAuth setup
- `DEPLOYMENT_CHECKLIST.md` - Deployment

### Feature Docs
- `ADMIN_GUIDE.md` - Admin panel
- `ADMIN_ROOMS_COMPLETE.md` - Latest features
- `TASK_8_COMPLETE.md` - Task 8 summary

### Technical Docs
- `supabase-schema.sql` - Database schema
- `SECURITY_MODEL.md` - Security architecture
- `migrations/` - All migrations

---

## 🎯 Key Functions

### `lib/utils.ts`
```typescript
timeAgo(date)              // "2 mins ago"
formatCount(count)         // "1.2K"
getOrdinal(num)           // "1st", "2nd", "3rd"
formatYearBranch(y, b)    // "1st Year • CS Regular"
compressImage(file)       // Compress before upload
```

### `lib/accessControl.ts`
```typescript
isOwner(email)                    // Check if owner
isOwnerUser(user)                 // Check if owner (user object)
canSeeAnonymousIdentity(email)    // Only owner = true
canEnterRoom(email, room, user)   // Check room access
canModerate(email)                // Only owner = true
getPermissions(user)              // Get all permissions
getUserBadge(user)                // Get badge text
getBadgeColor(badge)              // Get badge CSS class
getPostAuthorName(post, user)     // Get author name (handles anonymous)
getPostAuthorBranch(post, user)   // Get author branch
```

### `lib/roomManager.ts`
```typescript
initializeAllRooms()              // Create all rooms
getUserRooms(userId)              // Get user's accessible rooms
getUserRoomAssignments(y, b)      // Get room assignments
```

### `lib/rollNumberParser.ts`
```typescript
parseRollNumber(rollNumber)       // Parse 13-digit roll number
getCurrentAcademicYear()          // Get current academic year
calculateStudyYear(admYear)       // Calculate current year
shouldBeAlumni(admYear)           // Check if alumni
```

---

## 🚨 Emergency Contacts

### Technical Issues
- Check GitHub Issues
- Review error logs in Vercel
- Check Supabase logs

### Security Issues
- Immediately ban user (Admin → Users)
- Delete violating content (Admin → Reports)
- Review RLS policies

### Cost Issues
- Check usage in dashboards
- Optimize if approaching limits
- Consider cleanup strategies

---

## ✅ Pre-Launch Checklist

- [ ] All migrations run
- [ ] Rooms initialized
- [ ] Owner profile created
- [ ] All features tested
- [ ] Documentation reviewed
- [ ] Environment variables set
- [ ] OAuth configured
- [ ] Cloudinary configured
- [ ] Domain configured (if custom)
- [ ] Monitoring set up

---

## 🎉 Launch!

Once everything is checked:
1. Announce to IET Lucknow students
2. Share link: your-app.vercel.app
3. Monitor usage and feedback
4. Respond to reports quickly
5. Keep improving!

---

**Remember**: You have GOD MODE as owner. Use it wisely! 👑

**Cost**: ₹0/month forever (if you stay within free tiers)

**Support**: Check documentation or create GitHub issue
