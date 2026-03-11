# Google OAuth Setup Guide

Complete step-by-step instructions for setting up Google OAuth with Supabase.

**✨ FEATURE: Force Account Selection**
- OAuth popup will ALWAYS show account selection screen
- Users can choose their college email (@ietlucknow.ac.in)
- Prevents accidental login with personal Gmail

**📋 Quick Reference:** See [OAUTH_CONFIG_CHECKLIST.md](./OAUTH_CONFIG_CHECKLIST.md) for verification checklist

---

## How Force Account Selection Works

When users click "Login with College Email", they will ALWAYS see the Google account selection popup, even if they're already logged into a Google account in their browser.

**Implementation:**
```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    queryParams: {
      prompt: 'select_account', // ← This forces account selection
      access_type: 'offline',
    },
  },
});
```

**Why this matters:**
- Students often have multiple Google accounts (personal + college)
- Without this, Google auto-selects the first logged-in account
- With `prompt: 'select_account'`, users explicitly choose their @ietlucknow.ac.in email
- Prevents login failures due to wrong email selection

---

## Part 1: Google Cloud Console Setup

### Step 1: Create Google Cloud Project

1. Open https://console.cloud.google.com in your browser
2. Click the **project dropdown** at the top left (next to "Google Cloud")
3. Click **"New Project"** button
4. Enter project details:
   - **Project name:** `IET Akashvani`
   - **Organization:** Leave as "No organization"
5. Click **"Create"**
6. Wait 10-20 seconds for project creation
7. Click **"Select Project"** when it appears

### Step 2: Enable Google+ API

1. In the left sidebar, click **☰ (hamburger menu)**
2. Navigate to: **APIs & Services** → **Library**
3. In the search box, type: `Google+ API`
4. Click on **"Google+ API"** in the results
5. Click the blue **"Enable"** button
6. Wait for it to enable (5-10 seconds)

### Step 3: Configure OAuth Consent Screen

1. In the left sidebar, go to: **APIs & Services** → **OAuth consent screen**
2. Select **"External"** user type
3. Click **"Create"**

**Fill in OAuth consent screen:**

**Page 1 - App information:**
- **App name:** `IET Akashvani`
- **User support email:** Select your email from dropdown
- **App logo:** (Skip for now)
- **App domain:** (Skip for now)
- **Developer contact information:** Enter your email
- Click **"Save and Continue"**

**Page 2 - Scopes:**
- Click **"Save and Continue"** (don't add any scopes)

**Page 3 - Test users:**
- Click **"+ Add Users"**
- Add these emails (one per line):
  ```
  your-email@ietlucknow.ac.in
  anantshukla836@gmail.com
  ```
- Add 2-3 more friend emails for testing
- Click **"Add"**
- Click **"Save and Continue"**

**Page 4 - Summary:**
- Review and click **"Back to Dashboard"**

### Step 4: Create OAuth Credentials

1. In the left sidebar, go to: **APIs & Services** → **Credentials**
2. Click **"+ Create Credentials"** at the top
3. Select **"OAuth client ID"**

**Configure OAuth client:**

4. **Application type:** Select **"Web application"**
5. **Name:** `IET Akashvani Web Client`

**Authorized JavaScript origins:**
6. Click **"+ Add URI"**
7. Add: `http://localhost:3000`
8. Click **"+ Add URI"** again
9. Add: `https://ietakashvani.vercel.app` (for production later)

**Authorized redirect URIs:**
10. Click **"+ Add URI"**
11. Add: `http://localhost:3000/auth/callback`
12. Click **"+ Add URI"** again
13. **IMPORTANT:** Add your Supabase callback URL:
    ```
    https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
    ```
    
    **How to get YOUR_PROJECT_REF:**
    - Go to your Supabase dashboard
    - Look at the URL in your browser
    - It will be: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`
    - Copy the `YOUR_PROJECT_REF` part
    - Or get it from your Supabase URL: `https://YOUR_PROJECT_REF.supabase.co`

14. Click **"Create"**

**Save your credentials:**

15. A popup will appear with:
    - **Client ID** (looks like: `123456789-abc...apps.googleusercontent.com`)
    - **Client Secret** (looks like: `GOCSPX-abc...`)
16. **COPY BOTH** and save them somewhere safe (you'll need them in the next part)
17. Click **"OK"**

---

## Part 2: Supabase Configuration

### Step 1: Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your **IET Akashvani** project
3. You should see the project dashboard

### Step 2: Navigate to Authentication Settings

1. In the left sidebar, click **"Authentication"** (🔐 icon)
2. Click **"Providers"** tab at the top
3. Scroll down to find **"Google"**

### Step 3: Enable Google Provider

1. Find **"Google"** in the providers list
2. Toggle the switch to **ON** (it will turn green)
3. The Google configuration form will expand

### Step 4: Add Google OAuth Credentials

**Fill in the form:**

1. **Client ID (for OAuth):**
   - Paste the **Client ID** you copied from Google Cloud Console
   - It should look like: `123456789-abc...apps.googleusercontent.com`

2. **Client Secret (for OAuth):**
   - Paste the **Client Secret** you copied from Google Cloud Console
   - It should look like: `GOCSPX-abc...`

3. **Authorized Client IDs:**
   - Leave this empty (not needed)

4. **Skip nonce check:**
   - Leave unchecked (default)

5. Click **"Save"** button at the bottom

### Step 5: Verify Callback URL

1. After saving, you'll see a **"Callback URL (for OAuth)"** field
2. It should show:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
3. **IMPORTANT:** Make sure this EXACT URL is added in Google Cloud Console (you did this in Part 1, Step 4, point 13)

### Step 6: Configure Site URL

1. Still in Supabase, click **"URL Configuration"** tab (next to Providers)
2. Find **"Site URL"** field
3. For development, set it to: `http://localhost:3000`
4. Click **"Save"**

### Step 7: Add Redirect URLs

1. Still in **"URL Configuration"** tab
2. Find **"Redirect URLs"** section
3. Click **"Add URL"**
4. Add: `http://localhost:3000/auth/callback`
5. Click **"Add URL"** again
6. Add: `http://localhost:3000/**` (wildcard for all routes)
7. Click **"Save"**

---

## Part 3: Verification

### Test the Setup

1. Open your IET Akashvani app: `http://localhost:3000`
2. Click **"Login with College Email"**
3. You should see Google OAuth popup
4. Select your @ietlucknow.ac.in email
5. If it works → Success! ✅
6. If it fails → Check troubleshooting below

### Common Issues & Fixes

**Issue 1: "Redirect URI mismatch"**
- **Problem:** Callback URL not added correctly in Google Cloud Console
- **Fix:** 
  1. Go to Google Cloud Console → Credentials
  2. Click on your OAuth client
  3. Check "Authorized redirect URIs"
  4. Make sure this is added: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
  5. Save and try again

**Issue 2: "Access blocked: This app's request is invalid"**
- **Problem:** OAuth consent screen not configured
- **Fix:**
  1. Go to Google Cloud Console → OAuth consent screen
  2. Make sure status is "Testing"
  3. Add your email to test users
  4. Try again

**Issue 3: "Invalid email domain"**
- **Problem:** Using non-IET email
- **Fix:** Use @ietlucknow.ac.in email only

**Issue 4: OAuth popup doesn't open**
- **Problem:** Browser blocking popups
- **Fix:**
  1. Check browser address bar for popup blocked icon
  2. Allow popups for localhost:3000
  3. Try again

**Issue 5: "Client ID not found"**
- **Problem:** Wrong Client ID in Supabase
- **Fix:**
  1. Go to Google Cloud Console → Credentials
  2. Copy Client ID again
  3. Go to Supabase → Authentication → Providers → Google
  4. Paste correct Client ID
  5. Save and try again

---

## Quick Reference

### URLs You Need:

**Google Cloud Console:**
- Main: https://console.cloud.google.com
- Credentials: https://console.cloud.google.com/apis/credentials
- OAuth Consent: https://console.cloud.google.com/apis/credentials/consent

**Supabase:**
- Dashboard: https://supabase.com/dashboard
- Your project: https://supabase.com/dashboard/project/YOUR_PROJECT_REF
- Auth settings: https://supabase.com/dashboard/project/YOUR_PROJECT_REF/auth/providers

### Callback URLs:

**For Google Cloud Console (Authorized redirect URIs):**
```
http://localhost:3000/auth/callback
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

**For Supabase (Redirect URLs):**
```
http://localhost:3000/auth/callback
http://localhost:3000/**
```

### Credentials Format:

**Client ID:**
```
123456789-abcdefghijklmnop.apps.googleusercontent.com
```

**Client Secret:**
```
GOCSPX-abcdefghijklmnopqrstuvwxyz
```

---

## Production Deployment

When deploying to Vercel:

### Update Google Cloud Console:

1. Go to Credentials → Your OAuth client
2. Add to **Authorized JavaScript origins:**
   ```
   https://ietakashvani.vercel.app
   ```
3. Add to **Authorized redirect URIs:**
   ```
   https://ietakashvani.vercel.app/auth/callback
   ```
4. Save

### Update Supabase:

1. Go to Authentication → URL Configuration
2. Update **Site URL** to: `https://ietakashvani.vercel.app`
3. Add to **Redirect URLs:**
   ```
   https://ietakashvani.vercel.app/auth/callback
   https://ietakashvani.vercel.app/**
   ```
4. Save

---

## Security Notes

1. **Never commit credentials to Git**
   - Client ID and Secret should be in `.env.local` only
   - `.env.local` is in `.gitignore`

2. **Keep Client Secret private**
   - Only store in Supabase dashboard
   - Never expose in frontend code

3. **Test users in development**
   - OAuth consent screen should be in "Testing" mode
   - Add test users to allow them to login

4. **Production verification**
   - Before public launch, submit OAuth consent screen for verification
   - This allows any @ietlucknow.ac.in email to login

---

## Support

If you're still stuck:

1. Check browser console (F12) for errors
2. Check Supabase logs (Dashboard → Logs)
3. Verify all URLs match exactly
4. Try incognito/private browsing mode
5. Clear browser cache and cookies

---

**Setup Complete!** 🎉

Your Google OAuth should now be working with Supabase.

Test it by logging in with your @ietlucknow.ac.in email!
