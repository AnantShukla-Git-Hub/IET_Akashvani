# OAuth Quick Start Guide

Get Google OAuth with force account selection working in 10 minutes.

---

## Prerequisites

- [ ] Supabase project created
- [ ] `.env.local` file with Supabase credentials
- [ ] Google account
- [ ] Development server can run (`npm run dev`)

---

## Step 1: Google Cloud Console (5 minutes)

### 1.1 Create Project
1. Go to https://console.cloud.google.com
2. Click project dropdown → "New Project"
3. Name: "IET Akashvani" → Create

### 1.2 Enable API
1. ☰ Menu → APIs & Services → Library
2. Search "Google+ API" → Enable

### 1.3 OAuth Consent Screen
1. ☰ Menu → APIs & Services → OAuth consent screen
2. Select "External" → Create
3. App name: "IET Akashvani"
4. User support email: Your email
5. Developer contact: Your email
6. Save and Continue (3 times)

### 1.4 Create Credentials
1. ☰ Menu → APIs & Services → Credentials
2. "+ Create Credentials" → OAuth client ID
3. Application type: Web application
4. Name: "IET Akashvani Web Client"
5. Authorized JavaScript origins:
   - Add: `http://localhost:3000`
6. Authorized redirect URIs:
   - Add: `http://localhost:3000/auth/callback`
   - Add: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
     (Get YOUR_PROJECT from Supabase URL)
7. Create
8. **COPY Client ID and Client Secret** (you'll need these!)

---

## Step 2: Supabase Dashboard (3 minutes)

### 2.1 Enable Google Provider
1. Go to https://supabase.com/dashboard
2. Select your project
3. Authentication → Providers
4. Find "Google" → Toggle ON
5. Paste Client ID (from Step 1.4)
6. Paste Client Secret (from Step 1.4)
7. Save

### 2.2 Configure URLs
1. Authentication → URL Configuration
2. Site URL: `http://localhost:3000`
3. Redirect URLs → Add URL:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/**`
4. Save

---

## Step 3: Verify Code (1 minute)

### 3.1 Check app/page.tsx
Should have:
```typescript
queryParams: {
  prompt: 'select_account',
  access_type: 'offline',
}
```

✅ Already there! No changes needed.

### 3.2 Check app/auth/callback/route.ts
Should exist and handle callback.

✅ Already there! No changes needed.

---

## Step 4: Test (1 minute)

### 4.1 Start Dev Server
```bash
npm run dev
```

### 4.2 Test Login
1. Open http://localhost:3000
2. Click "Login with College Email"
3. **Account picker should appear** ✅
4. Select @ietlucknow.ac.in email
5. Should redirect to /setup or /feed ✅

---

## ✅ Success Checklist

- [ ] Account picker appears when clicking login
- [ ] Can see all Google accounts in picker
- [ ] College email login works
- [ ] Personal Gmail is rejected
- [ ] No console errors

**All checked?** You're done! 🎉

---

## ❌ Troubleshooting

### Account picker doesn't appear
- Clear browser cache
- Try incognito mode
- Wait 5 minutes (Google caches)

### "Redirect URI mismatch"
- Check Step 1.4 - did you add both redirect URIs?
- Check Step 2.2 - did you add callback URL?
- Wait 1 minute after saving

### Login fails
- Check `.env.local` has correct Supabase credentials
- Check Supabase provider is enabled
- Check Client ID/Secret are correct

---

## 📚 Need More Help?

- **Complete guide:** [OAUTH_SETUP.md](./OAUTH_SETUP.md)
- **Verification:** [OAUTH_CONFIG_CHECKLIST.md](./OAUTH_CONFIG_CHECKLIST.md)
- **Testing:** [TEST_OAUTH_FLOW.md](./TEST_OAUTH_FLOW.md)
- **All docs:** [OAUTH_DOCS_INDEX.md](./OAUTH_DOCS_INDEX.md)

---

**Time:** 10 minutes  
**Cost:** ₹0  
**Result:** Working OAuth with force account selection ✅
