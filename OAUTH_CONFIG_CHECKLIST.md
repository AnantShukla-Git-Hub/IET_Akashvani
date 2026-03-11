# OAuth Configuration Checklist

Quick reference to verify your Google OAuth setup is correct.

---

## ✅ Code Configuration (Already Done)

### 1. Landing Page (app/page.tsx)
```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    queryParams: {
      prompt: 'select_account', // ✅ Forces account selection
      access_type: 'offline',
    },
  },
});
```

### 2. Callback Route (app/auth/callback/route.ts)
- ✅ Handles OAuth code exchange
- ✅ Validates @ietlucknow.ac.in domain
- ✅ Redirects to /setup (new) or /feed (existing)

---

## 🔧 Supabase Dashboard Configuration

### Authentication → Providers → Google

**Required Settings:**
- [ ] Google provider is **ENABLED** (toggle ON)
- [ ] **Client ID** is filled (from Google Cloud Console)
- [ ] **Client Secret** is filled (from Google Cloud Console)

### Authentication → URL Configuration

**Site URL:**
```
http://localhost:3000
```

**Redirect URLs:**
```
http://localhost:3000/auth/callback
http://localhost:3000/**
```

---

## 🌐 Google Cloud Console Configuration

### APIs & Services → Credentials → OAuth 2.0 Client

**Authorized JavaScript origins:**
```
http://localhost:3000
```

**Authorized redirect URIs:**
```
http://localhost:3000/auth/callback
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

**How to get YOUR_PROJECT_REF:**
- Look at your Supabase project URL
- Format: `https://YOUR_PROJECT_REF.supabase.co`
- Example: `https://abcdefghijklmnop.supabase.co`
- Use: `abcdefghijklmnop`

---

## 🧪 Testing the Setup

### Test 1: Account Selection Popup
1. Open `http://localhost:3000`
2. Click "Login with College Email"
3. **Expected:** Google account selection popup appears
4. **Expected:** You can choose which Google account to use
5. ✅ If popup shows account selection → Working!
6. ❌ If auto-logs in without selection → Check `prompt: 'select_account'` in code

### Test 2: Email Domain Validation
1. Try logging in with @ietlucknow.ac.in email
2. **Expected:** Redirects to /setup or /feed
3. ✅ Success!

4. Try logging in with personal Gmail (e.g., @gmail.com)
5. **Expected:** Error message "Sirf IET Lucknow college email allowed hai 🙏"
6. ✅ If error shows → Domain validation working!

### Test 3: Callback URL
1. After clicking login, check browser URL
2. **Expected:** Briefly shows `http://localhost:3000/auth/callback?code=...`
3. **Expected:** Then redirects to /setup or /feed
4. ✅ If redirects correctly → Callback working!

---

## 🐛 Troubleshooting

### Issue: "Redirect URI mismatch"
**Problem:** Callback URL not configured in Google Cloud Console

**Fix:**
1. Go to Google Cloud Console → Credentials
2. Click your OAuth client
3. Add to "Authorized redirect URIs":
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
4. Save and try again

### Issue: Account selection doesn't appear
**Problem:** `prompt: 'select_account'` not working

**Fix:**
1. Check `app/page.tsx` has:
   ```typescript
   queryParams: {
     prompt: 'select_account',
   }
   ```
2. Clear browser cache
3. Try incognito/private mode
4. If still not working, Google might be caching - wait 5 minutes

### Issue: "Invalid email domain" error
**Problem:** Using wrong email

**Fix:**
- Use @ietlucknow.ac.in email only
- Personal Gmail won't work (by design)

### Issue: Stuck on callback page
**Problem:** Callback route not handling redirect

**Fix:**
1. Check `app/auth/callback/route.ts` exists
2. Check Supabase redirect URLs include:
   ```
   http://localhost:3000/auth/callback
   ```
3. Check browser console (F12) for errors

---

## 📋 Quick Verification Commands

### Check if OAuth is configured in Supabase:
1. Go to Supabase Dashboard
2. Authentication → Providers
3. Find "Google" - should be green/enabled

### Check callback URL in code:
```bash
# Search for redirectTo in code
grep -r "redirectTo" iet-akashvani/app/
```

**Expected output:**
```
redirectTo: `${window.location.origin}/auth/callback`
```

### Check prompt parameter:
```bash
# Search for prompt in code
grep -r "prompt:" iet-akashvani/app/
```

**Expected output:**
```
prompt: 'select_account',
```

---

## ✨ Feature Confirmation

If all tests pass, you should have:

- ✅ Force account selection popup (users choose their email)
- ✅ Domain validation (@ietlucknow.ac.in only)
- ✅ Proper callback handling (redirects to /setup or /feed)
- ✅ Error messages for invalid emails
- ✅ Secure OAuth flow

---

## 🚀 Production Checklist (For Later)

When deploying to Vercel:

### Update Google Cloud Console:
- [ ] Add production URL to "Authorized JavaScript origins"
- [ ] Add production callback to "Authorized redirect URIs"

### Update Supabase:
- [ ] Update Site URL to production domain
- [ ] Add production URLs to Redirect URLs

### Update .env:
- [ ] Set NEXT_PUBLIC_SITE_URL to production domain

---

**Configuration Complete!** 🎉

Your OAuth setup with force account selection is ready to use.

Test it now: `http://localhost:3000`
