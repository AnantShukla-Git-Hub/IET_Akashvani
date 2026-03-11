# Test OAuth Flow - Step by Step Guide

Quick guide to test the Google OAuth login with force account selection.

---

## Prerequisites

1. ✅ Supabase project is set up
2. ✅ Google OAuth is configured in Supabase
3. ✅ `.env.local` has correct Supabase credentials
4. ✅ Development server is running: `npm run dev`

---

## Test Scenario 1: First Time Login (New User)

### Steps:
1. Open browser (Chrome/Firefox/Edge)
2. Go to: `http://localhost:3000`
3. You should see the landing page with "IET Akashvani" title
4. Click **"Login with College Email"** button

### Expected Behavior:
- ✅ Google account selection popup appears
- ✅ Shows all your logged-in Google accounts
- ✅ You can choose which account to use

5. Select your **@ietlucknow.ac.in** email from the list
6. Click on the account

### Expected Behavior:
- ✅ Google authenticates
- ✅ Redirects to: `http://localhost:3000/auth/callback?code=...` (briefly)
- ✅ Then redirects to: `http://localhost:3000/setup`
- ✅ Setup page appears (profile setup form)

### Result: ✅ PASS if you reach /setup page

---

## Test Scenario 2: Login with Wrong Email

### Steps:
1. Open browser in **incognito/private mode**
2. Go to: `http://localhost:3000`
3. Click **"Login with College Email"** button

### Expected Behavior:
- ✅ Google account selection popup appears

4. Select a **personal Gmail** (e.g., yourname@gmail.com)
5. Click on the account

### Expected Behavior:
- ✅ Redirects back to landing page
- ✅ Shows error message: "Sirf IET Lucknow college email allowed hai 🙏"
- ✅ User is NOT logged in

### Result: ✅ PASS if error message appears

---

## Test Scenario 3: Existing User Login

### Prerequisites:
- You've already completed profile setup once

### Steps:
1. Sign out if logged in
2. Go to: `http://localhost:3000`
3. Click **"Login with College Email"** button

### Expected Behavior:
- ✅ Google account selection popup appears

4. Select your **@ietlucknow.ac.in** email

### Expected Behavior:
- ✅ Redirects to: `http://localhost:3000/auth/callback?code=...` (briefly)
- ✅ Then redirects to: `http://localhost:3000/feed`
- ✅ Feed page appears (not setup page)

### Result: ✅ PASS if you reach /feed page directly

---

## Test Scenario 4: Account Selection Always Appears

### Purpose: Verify force account selection works

### Steps:
1. Login with your @ietlucknow.ac.in email (complete flow)
2. You should be on /feed or /setup page
3. Sign out (if there's a logout button)
4. Go back to: `http://localhost:3000`
5. Click **"Login with College Email"** button again

### Expected Behavior:
- ✅ Google account selection popup appears AGAIN
- ✅ Even though you just logged in
- ✅ You can choose account again

### Why This Matters:
Without `prompt: 'select_account'`, Google would auto-select the last used account. With it, users always get to choose.

### Result: ✅ PASS if account picker appears every time

---

## Test Scenario 5: Multiple Accounts

### Prerequisites:
- You're logged into multiple Google accounts in your browser

### Steps:
1. Go to: `http://localhost:3000`
2. Click **"Login with College Email"** button

### Expected Behavior:
- ✅ Account picker shows ALL your Google accounts
- ✅ You can see:
  - yourname@ietlucknow.ac.in
  - yourname@gmail.com
  - other accounts...
- ✅ You can scroll through the list
- ✅ You can click any account

3. Select the @ietlucknow.ac.in account

### Expected Behavior:
- ✅ Login succeeds
- ✅ Redirects to /setup or /feed

### Result: ✅ PASS if you can see and select from multiple accounts

---

## Test Scenario 6: Cancel Login

### Steps:
1. Go to: `http://localhost:3000`
2. Click **"Login with College Email"** button
3. Account picker appears
4. Click **"Cancel"** or close the popup

### Expected Behavior:
- ✅ Popup closes
- ✅ You stay on landing page
- ✅ No error message
- ✅ Can try again

### Result: ✅ PASS if cancel works smoothly

---

## Test Scenario 7: Network Error Handling

### Steps:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Enable "Offline" mode
4. Go to: `http://localhost:3000`
5. Click **"Login with College Email"** button

### Expected Behavior:
- ✅ Error message appears
- ✅ Something like "Network error" or "Failed to connect"
- ✅ User stays on landing page

6. Disable "Offline" mode
7. Try login again

### Expected Behavior:
- ✅ Login works normally

### Result: ✅ PASS if error is handled gracefully

---

## Common Issues & Solutions

### Issue 1: Account picker doesn't appear
**Symptoms:**
- Login button does nothing
- Or auto-logs in without showing accounts

**Solutions:**
1. Check browser console (F12) for errors
2. Verify `prompt: 'select_account'` in `app/page.tsx`
3. Clear browser cache
4. Try incognito mode
5. Wait 5 minutes (Google caches OAuth settings)

### Issue 2: "Redirect URI mismatch"
**Symptoms:**
- Error page from Google
- Says redirect URI doesn't match

**Solutions:**
1. Check Google Cloud Console → Credentials
2. Verify these URIs are added:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
3. Save and wait 1 minute
4. Try again

### Issue 3: Stuck on callback page
**Symptoms:**
- URL shows `/auth/callback?code=...`
- Page doesn't redirect

**Solutions:**
1. Check `app/auth/callback/route.ts` exists
2. Check Supabase redirect URLs include:
   - `http://localhost:3000/auth/callback`
3. Check browser console for errors
4. Verify Supabase credentials in `.env.local`

### Issue 4: "Invalid email domain" error
**Symptoms:**
- Error message appears after login
- Even with @ietlucknow.ac.in email

**Solutions:**
1. Check `lib/constants.ts` has:
   ```typescript
   export const ALLOWED_EMAIL_DOMAIN = '@ietlucknow.ac.in';
   ```
2. Verify email actually ends with @ietlucknow.ac.in
3. Check for typos in email

### Issue 5: Login button disabled/loading forever
**Symptoms:**
- Button shows "Loading..." forever
- Can't click button

**Solutions:**
1. Refresh page
2. Check browser console for errors
3. Verify Supabase credentials are correct
4. Check network tab for failed requests

---

## Browser Testing Matrix

Test on multiple browsers to ensure compatibility:

| Browser | Version | Account Picker | Login Works | Notes |
|---------|---------|----------------|-------------|-------|
| Chrome | Latest | ✅ | ✅ | Recommended |
| Firefox | Latest | ✅ | ✅ | Works well |
| Edge | Latest | ✅ | ✅ | Chromium-based |
| Safari | Latest | ⚠️ | ✅ | May need popup permission |
| Brave | Latest | ⚠️ | ✅ | Disable shields for localhost |

---

## Performance Checklist

- [ ] Account picker appears within 1-2 seconds
- [ ] Login completes within 3-5 seconds
- [ ] No console errors
- [ ] Smooth redirects (no flashing)
- [ ] Error messages are clear

---

## Security Checklist

- [ ] Only @ietlucknow.ac.in emails can login
- [ ] Personal Gmail is rejected
- [ ] OAuth tokens are not exposed in console
- [ ] Redirect URLs are validated
- [ ] Session is secure (httpOnly cookies)

---

## Accessibility Checklist

- [ ] Login button is keyboard accessible (Tab key)
- [ ] Can press Enter to login
- [ ] Error messages are readable
- [ ] Color contrast is good
- [ ] Screen reader friendly

---

## Final Verification

Run through all 7 test scenarios above. If all pass:

✅ OAuth with force account selection is working correctly!

If any fail, check the troubleshooting section or:
1. Review OAUTH_CONFIG_CHECKLIST.md
2. Review OAUTH_SETUP.md
3. Check Supabase logs
4. Check browser console

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

**Happy Testing!** 🧪

If all tests pass, your OAuth implementation is production-ready!
