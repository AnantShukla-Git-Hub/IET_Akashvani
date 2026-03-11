# OAuth Verification Checklist

Use this checklist to verify your Google OAuth with force account selection is working correctly.

---

## Pre-Flight Checks

Before testing, verify these are complete:

### 1. Environment Variables
- [ ] `.env.local` file exists
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

### 2. Supabase Configuration
- [ ] Supabase project is created
- [ ] Database schema is applied (supabase-schema.sql)
- [ ] Google provider is enabled
- [ ] Client ID is added
- [ ] Client Secret is added
- [ ] Site URL is set to `http://localhost:3000`
- [ ] Redirect URLs include `http://localhost:3000/auth/callback`

### 3. Google Cloud Console
- [ ] Google Cloud project is created
- [ ] Google+ API is enabled
- [ ] OAuth consent screen is configured
- [ ] OAuth 2.0 Client is created
- [ ] Authorized JavaScript origins include `http://localhost:3000`
- [ ] Authorized redirect URIs include:
  - [ ] `http://localhost:3000/auth/callback`
  - [ ] `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

### 4. Code Verification
- [ ] `app/page.tsx` has `prompt: 'select_account'` in OAuth options
- [ ] `app/auth/callback/route.ts` exists and handles callback
- [ ] `lib/constants.ts` has `ALLOWED_EMAIL_DOMAIN = '@ietlucknow.ac.in'`

### 5. Development Server
- [ ] `npm install` completed successfully
- [ ] `npm run dev` is running
- [ ] No console errors on startup
- [ ] App opens at `http://localhost:3000`

---

## Functional Tests

### Test 1: Landing Page ✅
- [ ] Open `http://localhost:3000`
- [ ] Landing page loads without errors
- [ ] "Login with College Email" button is visible
- [ ] Button is clickable (not disabled)
- [ ] No console errors (F12)

### Test 2: Account Selection Popup ✅
- [ ] Click "Login with College Email"
- [ ] Google popup appears (not blocked)
- [ ] Popup shows "Choose an account" heading
- [ ] All your Google accounts are listed
- [ ] Can scroll through accounts
- [ ] "Use another account" option is visible

**If popup doesn't appear:**
- Check browser popup blocker
- Try incognito/private mode
- Clear browser cache
- Wait 5 minutes (Google caches OAuth settings)

### Test 3: College Email Login ✅
- [ ] Select @ietlucknow.ac.in email from picker
- [ ] Google authenticates (may ask for password/2FA)
- [ ] Redirects to callback URL (briefly visible)
- [ ] Redirects to `/setup` (new user) or `/feed` (existing user)
- [ ] No error messages
- [ ] User is logged in

### Test 4: Wrong Email Rejection ✅
- [ ] Sign out (if logged in)
- [ ] Click "Login with College Email"
- [ ] Select personal Gmail (e.g., @gmail.com)
- [ ] Google authenticates
- [ ] Redirects back to landing page
- [ ] Error message appears: "Sirf IET Lucknow college email allowed hai 🙏"
- [ ] User is NOT logged in

### Test 5: Account Selection Persistence ✅
- [ ] Login with college email
- [ ] Complete profile setup (if new user)
- [ ] Sign out
- [ ] Click "Login with College Email" again
- [ ] Account picker appears AGAIN (not auto-login)
- [ ] Can choose account again

**This confirms `prompt: 'select_account'` is working!**

### Test 6: Cancel Login ✅
- [ ] Click "Login with College Email"
- [ ] Account picker appears
- [ ] Click "Cancel" or close popup
- [ ] Popup closes
- [ ] Stay on landing page
- [ ] No error message
- [ ] Can try again

### Test 7: Multiple Accounts ✅
- [ ] Login to multiple Google accounts in browser
- [ ] Click "Login with College Email"
- [ ] Account picker shows ALL accounts
- [ ] Can see both college and personal emails
- [ ] Can select any account
- [ ] Only college email works

---

## Browser Compatibility Tests

Test on multiple browsers:

### Chrome
- [ ] Account picker appears
- [ ] Login works
- [ ] No console errors

### Firefox
- [ ] Account picker appears
- [ ] Login works
- [ ] No console errors

### Edge
- [ ] Account picker appears
- [ ] Login works
- [ ] No console errors

### Safari (Mac only)
- [ ] Account picker appears
- [ ] May need to allow popups
- [ ] Login works

### Brave
- [ ] Disable shields for localhost
- [ ] Account picker appears
- [ ] Login works

---

## Security Tests

### Test 1: Email Domain Validation
- [ ] Only @ietlucknow.ac.in emails can login
- [ ] @gmail.com is rejected
- [ ] @yahoo.com is rejected
- [ ] Other domains are rejected

### Test 2: Session Security
- [ ] Open browser DevTools (F12)
- [ ] Go to Application → Cookies
- [ ] Supabase session cookie is httpOnly
- [ ] Cannot access cookie from JavaScript console

### Test 3: OAuth Token Security
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Login with college email
- [ ] OAuth tokens are NOT visible in console
- [ ] Tokens are handled by Supabase

### Test 4: Redirect URL Validation
- [ ] Try manually visiting: `http://localhost:3000/auth/callback`
- [ ] Without code parameter, redirects to `/`
- [ ] Cannot bypass OAuth flow

---

## Performance Tests

### Test 1: Load Times
- [ ] Landing page loads in < 1 second
- [ ] Account picker appears in < 2 seconds
- [ ] Login completes in < 5 seconds
- [ ] Redirects are smooth (no flashing)

### Test 2: Network Requests
- [ ] Open DevTools → Network tab
- [ ] Click "Login with College Email"
- [ ] OAuth request completes successfully
- [ ] No failed requests
- [ ] No 404 errors

### Test 3: Console Errors
- [ ] Open DevTools → Console tab
- [ ] No errors on page load
- [ ] No errors during login
- [ ] No errors after login
- [ ] Only info/debug logs (if any)

---

## Error Handling Tests

### Test 1: Network Error
- [ ] Open DevTools → Network tab
- [ ] Enable "Offline" mode
- [ ] Click "Login with College Email"
- [ ] Error message appears
- [ ] User stays on landing page
- [ ] Disable offline mode
- [ ] Can try again successfully

### Test 2: Invalid OAuth Code
- [ ] Manually visit: `http://localhost:3000/auth/callback?code=invalid`
- [ ] Redirects to landing page
- [ ] No crash
- [ ] Can login normally

### Test 3: Missing Environment Variables
- [ ] Temporarily remove `NEXT_PUBLIC_SUPABASE_URL` from `.env.local`
- [ ] Restart dev server
- [ ] App shows error or doesn't load
- [ ] Add variable back
- [ ] Restart dev server
- [ ] App works again

---

## Accessibility Tests

### Test 1: Keyboard Navigation
- [ ] Tab to "Login with College Email" button
- [ ] Button gets focus (visible outline)
- [ ] Press Enter to login
- [ ] OAuth flow starts

### Test 2: Screen Reader
- [ ] Enable screen reader (if available)
- [ ] Navigate to login button
- [ ] Button is announced correctly
- [ ] Error messages are announced

### Test 3: Color Contrast
- [ ] Text is readable on background
- [ ] Button has good contrast
- [ ] Error messages are visible

---

## Documentation Verification

### Check all documentation exists:
- [ ] `OAUTH_SETUP.md` - Complete setup guide
- [ ] `OAUTH_CONFIG_CHECKLIST.md` - Quick reference
- [ ] `TEST_OAUTH_FLOW.md` - Testing guide
- [ ] `OAUTH_FORCE_ACCOUNT_SELECTION.md` - Implementation details
- [ ] `OAUTH_FLOW_DIAGRAM.md` - Visual flow diagram
- [ ] `OAUTH_IMPLEMENTATION_SUMMARY.md` - Summary
- [ ] `OAUTH_VERIFICATION_CHECKLIST.md` - This file
- [ ] `README.md` - Updated with OAuth references
- [ ] `PROJECT_STATUS.md` - Updated with latest changes

---

## Production Readiness Checklist

Before deploying to production:

### Code
- [ ] All tests pass
- [ ] No console errors
- [ ] No console warnings
- [ ] Code is clean and documented

### Configuration
- [ ] Production URLs added to Google Cloud Console
- [ ] Production URLs added to Supabase
- [ ] Environment variables set in Vercel
- [ ] HTTPS enabled

### Security
- [ ] Email domain validation works
- [ ] OAuth tokens are secure
- [ ] Session cookies are httpOnly
- [ ] No credentials in code

### Performance
- [ ] Page load times are acceptable
- [ ] OAuth flow is smooth
- [ ] No memory leaks
- [ ] No performance warnings

### Documentation
- [ ] All docs are up to date
- [ ] Setup guide is accurate
- [ ] Testing guide is complete
- [ ] Troubleshooting is comprehensive

---

## Troubleshooting Checklist

If something doesn't work, check:

### Account Picker Doesn't Appear
- [ ] Check `prompt: 'select_account'` in code
- [ ] Clear browser cache
- [ ] Try incognito mode
- [ ] Wait 5 minutes (Google caches)
- [ ] Check browser popup blocker

### "Redirect URI Mismatch" Error
- [ ] Check Google Cloud Console redirect URIs
- [ ] Verify Supabase callback URL is added
- [ ] Check for typos in URLs
- [ ] Wait 1 minute after saving changes

### Login Fails with Domain Error
- [ ] Verify using @ietlucknow.ac.in email
- [ ] Check `ALLOWED_EMAIL_DOMAIN` in constants
- [ ] Check callback route validation logic

### Stuck on Callback Page
- [ ] Check `app/auth/callback/route.ts` exists
- [ ] Check Supabase redirect URLs
- [ ] Check browser console for errors
- [ ] Verify Supabase credentials

### Button Disabled/Loading Forever
- [ ] Refresh page
- [ ] Check browser console for errors
- [ ] Verify Supabase credentials
- [ ] Check network tab for failed requests

---

## Final Verification

All checks complete? ✅

- [ ] All pre-flight checks pass
- [ ] All functional tests pass
- [ ] All browser compatibility tests pass
- [ ] All security tests pass
- [ ] All performance tests pass
- [ ] All error handling tests pass
- [ ] All accessibility tests pass
- [ ] All documentation exists

**If all checked:** Your OAuth implementation is production-ready! 🎉

**If any unchecked:** Review the relevant section and fix issues.

---

## Quick Test Command

```bash
# Start dev server
cd iet-akashvani
npm run dev

# Open in browser
# Windows:
start http://localhost:3000

# Mac:
open http://localhost:3000

# Linux:
xdg-open http://localhost:3000
```

---

## Support

If you're still stuck after checking everything:

1. Review [OAUTH_SETUP.md](./OAUTH_SETUP.md)
2. Review [OAUTH_CONFIG_CHECKLIST.md](./OAUTH_CONFIG_CHECKLIST.md)
3. Review [TEST_OAUTH_FLOW.md](./TEST_OAUTH_FLOW.md)
4. Check browser console (F12) for errors
5. Check Supabase logs (Dashboard → Logs)
6. Try incognito/private mode
7. Clear browser cache and cookies

---

**Verification Complete!** ✅

Your OAuth with force account selection is ready to use.

Test it now: `http://localhost:3000`
