# IET Akashvani - Deployment Checklist

## Pre-Deployment Setup

### 1. Environment Variables
Ensure all required environment variables are set in `.env.local`:

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

### 2. Supabase Database Migrations
Run all migrations in Supabase SQL Editor in order:

1. `migrations/fix-users-rls-policy.sql` - User profile creation
2. `migrations/fix-posts-rls-policies.sql` - Post creation and viewing
3. `migrations/fix-messages-rls-policies.sql` - Messages in rooms
4. `migrations/create-owner-profile.sql` - Owner profile (optional)
5. `migrations/add-special-users.sql` - Special users table (optional)

### 3. Supabase Auth Configuration
In Supabase Dashboard → Authentication → Providers → Google:

- Enable Google provider
- Add Client ID and Client Secret
- Add redirect URLs:
  - `http://localhost:3000/auth/callback` (development)
  - `https://your-app.vercel.app/auth/callback` (production)
- Add additional redirect URLs:
  - `http://localhost:3000/auth/admin-callback`
  - `https://your-app.vercel.app/auth/admin-callback`

### 4. Google OAuth Configuration
In Google Cloud Console:

- Create OAuth 2.0 credentials
- Add authorized redirect URIs (same as above)
- Enable Google+ API
- Add test users if in testing mode

### 5. Cloudinary Setup
In Cloudinary Dashboard:

- Create upload preset: `iet_akashvani`
- Set to unsigned
- Configure folder: `iet-akashvani/posts`
- Set max file size: 10MB
- Enable auto-optimization

---

## Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Admin panel and discussion rooms complete"
git push origin main
```

### Step 2: Deploy to Vercel
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Step 3: Initialize Rooms
After deployment, run the room initialization endpoint once:

```bash
curl "https://your-app.vercel.app/api/init-rooms?secret=YOUR_ADMIN_SECRET"
```

This creates all cross-branch rooms and alumni room.

### Step 4: Create Owner Profile
1. Visit your app: `https://your-app.vercel.app`
2. Click "Sign in with Google"
3. Sign in with owner email (anantshukla836@gmail.com)
4. Complete profile setup
5. You now have GOD MODE access

---

## Post-Deployment Testing

### Test 1: Owner Login
- [ ] Visit app homepage
- [ ] Click "Sign in with Google"
- [ ] Sign in with owner email
- [ ] Verify redirect to /feed (not /setup if already setup)
- [ ] Verify owner badge appears (👑 OWNER)

### Test 2: Regular User Flow
- [ ] Sign in with @ietlucknow.ac.in email
- [ ] Complete profile setup (name, roll number)
- [ ] Verify redirect to /feed
- [ ] Create a post
- [ ] Like a post
- [ ] Comment on a post

### Test 3: Admin Panel
- [ ] Login as owner
- [ ] Navigate to /admin/dashboard
- [ ] Verify stats are accurate
- [ ] Test Users page (search, ban, unban)
- [ ] Test Badges page (approve/reject)
- [ ] Test Reports page (dismiss/delete)

### Test 4: Discussion Rooms
- [ ] Navigate to /rooms
- [ ] Verify rooms list appears
- [ ] Click on a room
- [ ] Send a message
- [ ] Open same room in incognito/another browser
- [ ] Verify real-time sync works

### Test 5: Profile Page
- [ ] Navigate to /profile
- [ ] Verify all info displays correctly
- [ ] Verify posts count is accurate
- [ ] Test sign out

### Test 6: Anonymous Posts
- [ ] Create an anonymous post
- [ ] Login as regular user
- [ ] Verify shows "Anonymous IETian"
- [ ] Login as owner
- [ ] Verify shows real name + "(Anonymous)"

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Check Supabase usage (stay within free tier)
- [ ] Check Cloudinary usage (stay within free tier)
- [ ] Check Vercel usage (stay within free tier)
- [ ] Review pending reports (if any)
- [ ] Review pending designations (if any)

### Weekly Checks
- [ ] Review user growth
- [ ] Check for spam posts
- [ ] Review banned users
- [ ] Check room activity

### Monthly Checks
- [ ] Review all stats
- [ ] Clean up old messages (auto-expires after 1 year)
- [ ] Review special users
- [ ] Update documentation if needed

---

## Troubleshooting

### Issue: OAuth not working
**Solution**: 
1. Check Google OAuth credentials
2. Verify redirect URLs match exactly
3. Check Supabase Auth settings
4. Clear browser cache and cookies

### Issue: Posts not creating
**Solution**:
1. Check RLS policies in Supabase
2. Run `migrations/fix-posts-rls-policies.sql`
3. Verify user profile exists in database

### Issue: Messages not sending
**Solution**:
1. Check RLS policies for messages table
2. Run `migrations/fix-messages-rls-policies.sql`
3. Verify Supabase Realtime is enabled

### Issue: Rooms not appearing
**Solution**:
1. Run room initialization endpoint
2. Check user's year and branch are set
3. Verify rooms table has data

### Issue: Admin panel not accessible
**Solution**:
1. Verify logged in as owner email
2. Check NEXT_PUBLIC_ADMIN_EMAIL in .env
3. Clear browser cache

---

## Cost Monitoring

### Supabase Free Tier Limits
- Database: 500MB
- Storage: 1GB
- Bandwidth: 2GB
- Realtime: 200 concurrent connections

### Cloudinary Free Tier Limits
- Storage: 25GB
- Bandwidth: 25GB/month
- Transformations: 25,000/month

### Vercel Free Tier Limits
- Bandwidth: 100GB/month
- Builds: 6,000 minutes/month
- Serverless function executions: 100GB-hours

**Action if approaching limits**:
1. Optimize images (already using compression)
2. Clean up old data
3. Consider upgrading (but try to stay free)

---

## Security Checklist

- [ ] All RLS policies enabled
- [ ] Owner email hardcoded (not in public env)
- [ ] ADMIN_SECRET is strong and secret
- [ ] Google OAuth restricted to @ietlucknow.ac.in
- [ ] Owner bypass only for owner email
- [ ] Anonymous posts hide identity (except from owner)
- [ ] Banned users cannot post/comment
- [ ] Special users have correct access levels

---

## Backup Strategy

### Database Backup
Supabase provides automatic backups on free tier:
- Point-in-time recovery: 7 days
- Manual backups: Export SQL from Supabase dashboard

### Code Backup
- GitHub repository (already backed up)
- Keep local copy

### Environment Variables
- Keep secure copy of .env.local
- Document all variables

---

## Support & Documentation

### User Documentation
- `README.md` - Project overview
- `COMPLETE_SETUP_GUIDE.md` - Setup instructions
- `OAUTH_QUICK_START.md` - OAuth setup guide

### Admin Documentation
- `ADMIN_GUIDE.md` - Admin panel guide
- `ADMIN_ROOMS_COMPLETE.md` - Latest features
- `DEPLOYMENT_GUIDE.md` - Deployment instructions

### Technical Documentation
- `supabase-schema.sql` - Database schema
- `SECURITY_MODEL.md` - Security architecture
- All migration files in `migrations/`

---

## Success Criteria

✅ All features working:
- User authentication (Google OAuth)
- Profile setup and management
- Post creation (text + images)
- Anonymous posting
- Likes and comments
- Discussion rooms (real-time chat)
- Admin panel (users, badges, reports)
- Profile page with stats

✅ Cost: ₹0/month
- Supabase free tier
- Cloudinary free tier
- Vercel free tier

✅ Security:
- RLS policies enabled
- Owner GOD MODE working
- Anonymous posts protected
- Domain restriction working

✅ Performance:
- Real-time updates working
- Image compression working
- Fast page loads

---

## Congratulations! 🎉

Your IET Akashvani platform is now live and ready for students!

**Next Steps**:
1. Announce to IET Lucknow students
2. Monitor usage and feedback
3. Add more features as needed
4. Keep costs at ₹0/month

**Remember**: You have GOD MODE as owner. Use it wisely! 👑
