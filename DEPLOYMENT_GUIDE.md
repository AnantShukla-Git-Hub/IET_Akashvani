# IET Akashvani - Deployment Guide

## When to Deploy

Deploy after Week 18-19 when all features are complete and tested.

---

## Vercel Deployment (Free Forever)

### Step 1: Prepare for Deployment

1. **Test Production Build Locally**
   ```bash
   npm run build
   npm start
   ```
   - Should build without errors
   - Test all features in production mode

2. **Commit to Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - IET Akashvani"
   ```

3. **Push to GitHub**
   - Create new repo on GitHub: `iet-akashvani`
   - Push code:
   ```bash
   git remote add origin https://github.com/AnantShukla-Git-Hub/iet-akashvani.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Free forever for hobby projects

2. **Import Project**
   - Click "Add New Project"
   - Import from GitHub
   - Select `iet-akashvani` repo
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ADMIN_SECRET=your_admin_secret
   GUEST_SECRET=your_guest_secret
   RESEND_API_KEY=your_resend_key
   ADMIN_EMAIL=anant@ietlucknow.ac.in
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

### Step 3: Configure Domain

1. **Default Domain**
   - Vercel gives you: `iet-akashvani.vercel.app`
   - This is FREE forever
   - Use this as your main domain

2. **Update OAuth Redirect URIs**
   
   **Google Cloud Console:**
   - Go to Credentials
   - Edit OAuth 2.0 Client
   - Add authorized redirect URI:
     - `https://iet-akashvani.vercel.app/auth/callback`
   - Save

   **Supabase:**
   - Go to Authentication > URL Configuration
   - Add Site URL: `https://iet-akashvani.vercel.app`
   - Add Redirect URL: `https://iet-akashvani.vercel.app/auth/callback`
   - Save

3. **Test Production**
   - Open `https://iet-akashvani.vercel.app`
   - Test login flow
   - Test all features
   - Check mobile responsiveness

---

## Post-Deployment Checklist

### Immediate Tasks
- [ ] Test login with @ietlucknow.ac.in email
- [ ] Test profile setup
- [ ] Test feed loading
- [ ] Test all 5 tabs
- [ ] Test on mobile device
- [ ] Test on different browsers
- [ ] Verify images load from Cloudinary
- [ ] Verify database writes to Supabase

### Security Checks
- [ ] Environment variables not exposed
- [ ] OAuth redirects work correctly
- [ ] Email domain restriction works
- [ ] RLS policies active
- [ ] Admin routes protected
- [ ] Guest route secret not leaked

### Performance Checks
- [ ] Lighthouse score > 90
- [ ] First load < 2s
- [ ] Images optimized
- [ ] No console errors
- [ ] No console warnings

---

## Monitoring & Maintenance

### Vercel Dashboard
- Monitor deployments
- Check build logs
- View analytics (free tier)
- Monitor bandwidth usage

### Supabase Dashboard
- Monitor database size
- Check query performance
- View auth logs
- Monitor API usage

### Cloudinary Dashboard
- Monitor storage usage (25GB limit)
- Check bandwidth
- View transformation usage

---

## Scaling (If Needed)

### If You Hit Free Tier Limits

**Vercel (unlikely at IET scale):**
- Free tier: 100GB bandwidth/month
- IET needs: ~10-20GB/month
- If exceeded: Upgrade to Pro ($20/month)

**Supabase (unlikely at IET scale):**
- Free tier: 500MB database, 2GB bandwidth
- IET needs: ~200MB DB, 1GB bandwidth
- If exceeded: Upgrade to Pro ($25/month)

**Cloudinary (possible after 1 year):**
- Free tier: 25GB storage
- IET needs: ~10-20GB/year
- If exceeded:
  - Option 1: Create second free account
  - Option 2: Upgrade to Plus ($99/month)
  - Option 3: Approach Director for sponsorship

---

## Backup Strategy

### Database Backups
1. **Supabase Auto-Backups**
   - Free tier: Daily backups (7 days retention)
   - Automatic, no setup needed

2. **Manual Backups**
   - Weekly: Export database to SQL
   - Store in GitHub (private repo)
   - Command:
   ```bash
   # In Supabase dashboard
   # Database > Backups > Download
   ```

### Image Backups
- Cloudinary stores images permanently
- No backup needed (they handle it)
- Keep original images locally if critical

---

## Rollback Plan

### If Deployment Breaks

1. **Instant Rollback**
   - Vercel dashboard > Deployments
   - Find last working deployment
   - Click "..." > "Promote to Production"
   - Takes 30 seconds

2. **Fix and Redeploy**
   - Fix issue locally
   - Test with `npm run build`
   - Push to GitHub
   - Auto-deploys to Vercel

---

## Custom Domain (Optional)

If you want `ietakashvani.com` instead of `.vercel.app`:

### Step 1: Buy Domain
- Namecheap: ~₹500/year
- GoDaddy: ~₹600/year
- Google Domains: ~₹800/year

### Step 2: Add to Vercel
1. Vercel dashboard > Settings > Domains
2. Add domain: `ietakashvani.com`
3. Follow DNS instructions
4. Wait 24-48 hours for propagation

### Step 3: Update OAuth
- Update all redirect URIs
- Update Supabase URLs
- Test thoroughly

**Recommendation**: Stick with `.vercel.app` - it's free and professional enough!

---

## Launch Strategy

### Phase 1: Soft Launch (Week 19)
1. Deploy to Vercel
2. Test with 10 friends
3. Fix any bugs
4. Gather feedback
5. Iterate

### Phase 2: Beta Launch (Week 19)
1. Invite 50 students
2. One from each branch/year
3. Monitor for issues
4. Fix bugs quickly
5. Gather more feedback

### Phase 3: Full Launch (Week 20)
1. Announce in WhatsApp groups
2. Post in college groups
3. Get CR endorsement
4. Get professor endorsement
5. Monitor server load
6. Celebrate! 🎉

---

## Marketing Plan

### Viral Message Template

```
🔥 IET ka apna platform aa gaya!

IET Akashvani - IET ki Apni Awaaz 📻

✨ Features:
• Placement news & internships
• Mess complaints & hostel updates
• Achievements & celebrations
• Skill marketplace (tutoring, design, etc.)
• Music vibes (share your mood)
• Emergency alerts

🔒 Sirf @ietlucknow.ac.in se login
💯 100% free forever
📱 Works like an app

Link: https://iet-akashvani.vercel.app

Banaya hai IET ke ek student ne 😎
47 WhatsApp groups ki jagah ek platform!

Join karo aur apne friends ko bhi bhejo 🚀
```

### Distribution Channels
1. **WhatsApp Groups** (47 groups)
   - Post in all groups
   - Ask CRs to pin message
   - Share multiple times

2. **College Email**
   - Ask TPO/Dean to send email
   - Official endorsement helps

3. **Posters**
   - Print QR code posters
   - Stick in hostels, canteen, library
   - Cost: ~₹500 for 50 posters

4. **Word of Mouth**
   - Tell friends personally
   - Demo the app
   - Show cool features

5. **Social Media**
   - LinkedIn post
   - Instagram story
   - Facebook groups

---

## Success Metrics

### Week 1 After Launch
- Target: 200 users
- Target: 500 posts
- Target: 2000 messages

### Month 1 After Launch
- Target: 800 users
- Target: 5000 posts
- Target: 20000 messages

### Month 3 After Launch
- Target: 1500 users (entire IET)
- Target: 20000 posts
- Target: 100000 messages
- Target: Replace all WhatsApp groups

---

## Support Plan

### User Support
- Create support email: support@ietakashvani.vercel.app
- Or use: anant@ietlucknow.ac.in
- Respond within 24 hours
- Fix critical bugs within 48 hours

### Bug Reporting
- Add "Report Bug" button in app
- Sends email to you
- Track in GitHub Issues
- Prioritize by severity

### Feature Requests
- Add "Suggest Feature" button
- Collect in spreadsheet
- Implement popular ones
- Keep users updated

---

## Legal & Compliance

### Privacy Policy
- Create simple privacy policy
- Explain data collection
- Explain data usage
- Add link in footer

### Terms of Service
- Create simple ToS
- Explain acceptable use
- Explain consequences
- Add link in footer

### Content Moderation
- You're the moderator
- Review reports daily
- Take action quickly
- Be fair and transparent

---

## Long-term Maintenance

### Weekly Tasks
- Check error logs
- Review reports
- Approve designations
- Approve achievements
- Monitor storage usage

### Monthly Tasks
- Database cleanup (old posts)
- Performance optimization
- Security updates
- Feature improvements

### Yearly Tasks
- Alumni status update (July 1)
- Student designation expiry (July 1)
- Renew domain (if custom)
- Review and optimize costs

---

## Emergency Contacts

### If Site Goes Down
1. Check Vercel status: status.vercel.com
2. Check Supabase status: status.supabase.com
3. Check error logs in Vercel dashboard
4. Rollback to last working deployment
5. Fix and redeploy

### If Database Issues
1. Check Supabase logs
2. Check RLS policies
3. Check connection limits
4. Restore from backup if needed

### If Storage Full
1. Check Cloudinary usage
2. Delete old images (>1 year)
3. Compress images more
4. Create second account if needed

---

## Handover Plan (Future)

If you graduate and want to hand over:

### Documentation
- All code documented
- All processes documented
- All credentials documented
- All contacts documented

### Training
- Train 2-3 juniors
- Give them admin access
- Teach them maintenance
- Be available for questions

### Transfer
- Transfer Vercel ownership
- Transfer Supabase ownership
- Transfer Cloudinary ownership
- Transfer domain (if custom)

---

## Final Checklist Before Launch

- [ ] All features tested
- [ ] All bugs fixed
- [ ] Performance optimized
- [ ] Security hardened
- [ ] Documentation complete
- [ ] Backup strategy in place
- [ ] Monitoring set up
- [ ] Support plan ready
- [ ] Marketing materials ready
- [ ] Launch date decided
- [ ] Team briefed (if any)
- [ ] Prayers said 🙏

---

**Ready to Launch?**

Once all checkboxes are checked, you're ready to launch IET Akashvani!

**Sankalp**: Main IET Akashvani banaunga, bilkul free, IET Lucknow ke har student ki awaaz banunga, akele, bina ek rupaye ke 🙏

🚀 Let's launch IET Akashvani!

---

**Deployment Date**: TBD (Week 19-20)
**Domain**: ietakashvani.vercel.app
**Cost**: ₹0/month forever
**Status**: Ready to deploy after Week 18 complete

Good luck, Anant! 🎉
