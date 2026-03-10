# Week 1-2 Completion Checklist

## Setup Tasks

### Supabase Setup
- [ ] Create Supabase account
- [ ] Create new project "iet-akashvani"
- [ ] Copy Project URL
- [ ] Copy anon key
- [ ] Run `supabase-schema.sql` in SQL Editor
- [ ] Verify all 14 tables created
- [ ] Enable Google OAuth provider
- [ ] Add Google OAuth credentials to Supabase

### Google Cloud Console
- [ ] Create Google Cloud project
- [ ] Enable Google+ API
- [ ] Create OAuth consent screen
- [ ] Add test users (@ietlucknow.ac.in emails)
- [ ] Create OAuth 2.0 credentials
- [ ] Add redirect URIs:
  - [ ] `http://localhost:3000/auth/callback`
  - [ ] `https://[project].supabase.co/auth/v1/callback`
- [ ] Copy Client ID
- [ ] Copy Client Secret

### Cloudinary Setup
- [ ] Create Cloudinary account
- [ ] Copy Cloud Name
- [ ] Copy API Key
- [ ] Copy API Secret
- [ ] Create upload preset "iet_akashvani"
- [ ] Set preset to "Unsigned"
- [ ] Set folder to "iet-akashvani"

### Project Setup
- [ ] Navigate to `iet-akashvani` folder
- [ ] Run `npm install`
- [ ] Fill `.env.local` with all credentials
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Landing page loads successfully

## Testing Checklist

### Landing Page Tests
- [ ] Landing page displays correctly
- [ ] "IET Akashvani" title shows
- [ ] "IET ki Apni Awaaz 📻" tagline shows
- [ ] Description box shows 4 points
- [ ] "Login with College Email" button visible
- [ ] Button has Google icon

### OAuth Flow Tests
- [ ] Click login button
- [ ] Google OAuth popup opens
- [ ] Can select @ietlucknow.ac.in email
- [ ] Redirects to `/setup` page
- [ ] Try with non-IET email
- [ ] Shows error: "Sirf IET Lucknow college email allowed hai 🙏"
- [ ] Does NOT create user in database

### Profile Setup Tests
- [ ] Setup page loads
- [ ] "Welcome to IET Akashvani! 🎉" shows
- [ ] Profile photo upload button works
- [ ] Click "Upload Photo"
- [ ] Cloudinary widget opens
- [ ] Upload a photo
- [ ] Photo preview shows
- [ ] Name field pre-filled from Google
- [ ] Can edit name
- [ ] Roll number field works
- [ ] Converts to uppercase automatically
- [ ] "I hold a designation" checkbox works
- [ ] Checking it shows designation form
- [ ] Designation dropdown has all options
- [ ] Unit field works
- [ ] Extra info textarea works
- [ ] Shows "⏳ Pending Approval" message
- [ ] "Complete Setup" button works
- [ ] Submits without errors
- [ ] Redirects to `/feed`

### Feed Page Tests
- [ ] Feed page loads
- [ ] Header shows "IET Akashvani"
- [ ] Profile picture shows in header
- [ ] Welcome message shows with name
- [ ] Serial ID displays (IET-00001)
- [ ] Year displays
- [ ] Branch displays
- [ ] "Feed coming in Week 5-6" message shows
- [ ] Bottom navigation shows
- [ ] 5 tabs visible: Feed, Rooms, Achievements, Announcements, Profile
- [ ] Feed tab is highlighted (orange)

### Database Tests
- [ ] Open Supabase Table Editor
- [ ] Click "users" table
- [ ] Your user entry exists
- [ ] Email is correct
- [ ] Name is correct
- [ ] Roll number is correct
- [ ] Profile pic URL is Cloudinary link
- [ ] Serial ID is "IET-00001" (or next number)
- [ ] Year is set (placeholder: 3)
- [ ] Branch is set (placeholder: CSE)
- [ ] created_at timestamp is correct
- [ ] If designation requested:
  - [ ] Click "designations" table
  - [ ] Entry exists with status "pending"
  - [ ] user_id matches your user id

### Returning User Tests
- [ ] Close browser
- [ ] Open http://localhost:3000 again
- [ ] Should auto-redirect to `/feed`
- [ ] Should NOT show landing page
- [ ] Should NOT show setup page
- [ ] Feed loads with your data

### Logout and Re-login Tests
- [ ] Manually go to Supabase dashboard
- [ ] Authentication > Users
- [ ] Delete your user (for testing)
- [ ] Go back to app
- [ ] Should redirect to landing page
- [ ] Login again
- [ ] Should go to setup (new user flow)

## Code Quality Checks

### TypeScript
- [ ] No TypeScript errors
- [ ] Run `npm run build` - should succeed
- [ ] All types defined in `types/index.ts`

### File Structure
- [ ] All files in correct folders
- [ ] No unused files
- [ ] `.env.local` has all variables
- [ ] `.gitignore` includes `.env*.local`

### Constants
- [ ] All badge levels defined
- [ ] All designation types listed
- [ ] All branches listed
- [ ] All cross-branch rooms defined
- [ ] All promote categories defined
- [ ] All achievement types defined
- [ ] All vibe moods defined

### Database Schema
- [ ] All 14 tables created
- [ ] All indexes created
- [ ] RLS enabled on sensitive tables
- [ ] Serial ID trigger works
- [ ] Functions created (expire_student_designations, update_alumni_status)

## Documentation Checks

- [ ] README.md complete
- [ ] SETUP_GUIDE.md detailed
- [ ] QUICK_START.md helpful
- [ ] supabase-schema.sql commented
- [ ] Code has comments where needed

## Security Checks

- [ ] `.env.local` in `.gitignore`
- [ ] No credentials in code
- [ ] Email domain check works
- [ ] RLS policies set
- [ ] OAuth redirect URIs correct

## Performance Checks

- [ ] Landing page loads fast
- [ ] Setup page loads fast
- [ ] Feed page loads fast
- [ ] Image upload works smoothly
- [ ] No console errors
- [ ] No console warnings

## Browser Compatibility

Test in:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Edge

## Mobile Responsiveness

Test on mobile (or browser dev tools):
- [ ] Landing page looks good
- [ ] Setup page looks good
- [ ] Feed page looks good
- [ ] Bottom navigation accessible
- [ ] Forms are usable
- [ ] Images display correctly

## Final Verification

- [ ] Can create multiple test users
- [ ] Serial IDs increment (IET-00001, IET-00002, etc.)
- [ ] Each user has unique email
- [ ] Each user has unique roll number
- [ ] Each user has unique serial ID
- [ ] Profile photos stored in Cloudinary
- [ ] All data persists after refresh

## Known Limitations (Expected)

These are NOT bugs - they're planned for later weeks:

- ⏳ Roll number doesn't auto-detect year/branch (Week 3-4)
- ⏳ No discussion rooms yet (Week 3-4)
- ⏳ No actual feed posts (Week 5-6)
- ⏳ No real-time updates (Week 5-6)
- ⏳ No badge system (Week 9-10)
- ⏳ No admin panel (Week 9-10)
- ⏳ No email notifications (Week 9-10)
- ⏳ No achievements (Week 11-12)
- ⏳ No announcements (Week 11-12)
- ⏳ No promote feature (Week 13-14)
- ⏳ No IET Vibes (Week 13-14)
- ⏳ No moderation (Week 15-16)

## Pending Information from Anant

Before starting Week 3-4, need:

- [ ] Exact IET roll number format
  - Example: `2021CSE001` or `21CSE001` or other?
  - Where is year encoded?
  - Where is branch code?
  - How many digits total?

- [ ] IET hostel names list
  - Boys hostels: ?
  - Girls hostels: ?
  - For dropdown pre-loading

- [ ] Academic year start month
  - July or August?
  - For alumni auto-update timing

## Week 1-2 Complete! 🎉

If all checkboxes above are checked, Week 1-2 is DONE!

### What You've Built:
✅ Complete authentication system
✅ Email domain restriction
✅ Profile setup flow
✅ Database schema (all tables)
✅ Image upload to Cloudinary
✅ Serial ID auto-generation
✅ Designation request system
✅ Basic UI/UX
✅ Mobile responsive design

### Next Steps:
1. Get roll number format from Anant
2. Start Week 3-4 development
3. Implement roll number parser
4. Create discussion rooms
5. Auto-assign users to rooms

---

**Status**: Week 1-2 Complete ✅
**Time Taken**: ~2 weeks
**Cost**: ₹0
**Lines of Code**: ~1000+
**Files Created**: 15+

**Sankalp**: Main IET Akashvani banaunga 🙏

Ready for Week 3-4! 🚀
