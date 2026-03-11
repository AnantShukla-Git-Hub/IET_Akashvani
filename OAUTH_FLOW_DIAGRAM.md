# OAuth Flow Diagram

Visual representation of the Google OAuth login flow with force account selection.

---

## Complete OAuth Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  User opens app  │
│ localhost:3000   │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                    Landing Page (app/page.tsx)                │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  🎨 IET Akashvani                                      │  │
│  │  📻 IET ki Apni Awaaz                                  │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────┐     │  │
│  │  │  🔐 Login with College Email                 │     │  │
│  │  └──────────────────────────────────────────────┘     │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────┘
                           │ User clicks button
                           ▼
┌──────────────────────────────────────────────────────────────┐
│              supabase.auth.signInWithOAuth()                  │
│                                                               │
│  provider: 'google'                                           │
│  options: {                                                   │
│    redirectTo: 'http://localhost:3000/auth/callback'         │
│    queryParams: {                                             │
│      prompt: 'select_account',  ← FORCE ACCOUNT SELECTION    │
│      access_type: 'offline'                                   │
│    }                                                          │
│  }                                                            │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                  Google OAuth Popup                           │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Choose an account                                     │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────┐     │  │
│  │  │  👤 anant@ietlucknow.ac.in                   │     │  │
│  │  │     IET Lucknow                              │     │  │
│  │  └──────────────────────────────────────────────┘     │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────┐     │  │
│  │  │  👤 anantshukla836@gmail.com                 │     │  │
│  │  │     Personal Gmail                           │     │  │
│  │  └──────────────────────────────────────────────┘     │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────┐     │  │
│  │  │  ➕ Use another account                       │     │  │
│  │  └──────────────────────────────────────────────┘     │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────┘
                           │ User selects account
                           ▼
                    ┌──────────────┐
                    │  Which one?  │
                    └──────┬───────┘
                           │
         ┌─────────────────┴─────────────────┐
         │                                   │
         ▼                                   ▼
┌─────────────────────┐           ┌─────────────────────┐
│ @ietlucknow.ac.in   │           │   @gmail.com        │
│   (College Email)   │           │ (Personal Email)    │
└──────────┬──────────┘           └──────────┬──────────┘
           │                                  │
           ▼                                  ▼
┌─────────────────────┐           ┌─────────────────────┐
│ Google authenticates│           │ Google authenticates│
└──────────┬──────────┘           └──────────┬──────────┘
           │                                  │
           ▼                                  ▼
┌─────────────────────────────────────────────────────────────┐
│  Google redirects to Supabase:                               │
│  https://YOUR_PROJECT.supabase.co/auth/v1/callback?code=...  │
└──────────┬──────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│  Supabase processes OAuth code                               │
│  Creates session                                             │
│  Redirects to: http://localhost:3000/auth/callback?code=...  │
└──────────┬──────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│         Callback Handler (app/auth/callback/route.ts)        │
│                                                              │
│  1. Exchange code for session                                │
│  2. Get user email                                           │
│  3. Validate email domain                                    │
└──────────┬──────────────────────────────────────────────────┘
           │
           ▼
    ┌──────────────┐
    │ Email check  │
    └──────┬───────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌─────────┐   ┌─────────┐
│ Valid   │   │ Invalid │
│ @iet... │   │ Other   │
└────┬────┘   └────┬────┘
     │             │
     ▼             ▼
┌─────────┐   ┌──────────────────┐
│ Check   │   │ Sign out user    │
│ if new  │   │ Redirect to /    │
│ user    │   │ Show error msg   │
└────┬────┘   └──────────────────┘
     │
┌────┴────┐
│         │
▼         ▼
┌────┐  ┌────┐
│New │  │Old │
└─┬──┘  └─┬──┘
  │       │
  ▼       ▼
┌────┐  ┌────┐
│/setup│ │/feed│
└────┘  └────┘
```

---

## Detailed Step-by-Step Flow

### Step 1: Landing Page
```
User → Opens http://localhost:3000
     → Sees landing page
     → Clicks "Login with College Email"
```

### Step 2: OAuth Initiation
```
Code → supabase.auth.signInWithOAuth({
         provider: 'google',
         options: {
           redirectTo: 'http://localhost:3000/auth/callback',
           queryParams: {
             prompt: 'select_account',  ← KEY FEATURE
             access_type: 'offline'
           }
         }
       })
```

### Step 3: Google Account Selection
```
Google → Shows account picker popup
       → Lists all logged-in Google accounts
       → User selects one account
       → prompt: 'select_account' forces this step
```

### Step 4: Google Authentication
```
Google → Authenticates selected account
       → Generates OAuth code
       → Redirects to Supabase callback
```

### Step 5: Supabase Processing
```
Supabase → Receives OAuth code
         → Exchanges code for tokens
         → Creates user session
         → Redirects to app callback
```

### Step 6: App Callback
```
App → Receives code in URL
    → Exchanges code for session
    → Gets user email
    → Validates email domain
```

### Step 7: Email Validation
```
if (email.endsWith('@ietlucknow.ac.in')) {
  ✅ Valid → Check if new user
} else {
  ❌ Invalid → Sign out + Show error
}
```

### Step 8: User Routing
```
if (new user) {
  → Redirect to /setup
  → User fills profile
} else {
  → Redirect to /feed
  → User sees main feed
}
```

---

## Key Components

### 1. Landing Page (app/page.tsx)
**Responsibility:**
- Display login button
- Initiate OAuth flow
- Handle loading state
- Show error messages

**Key Code:**
```typescript
const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        prompt: 'select_account',
        access_type: 'offline',
      },
    },
  });
};
```

### 2. Callback Handler (app/auth/callback/route.ts)
**Responsibility:**
- Exchange OAuth code for session
- Validate email domain
- Check if user exists
- Route to correct page

**Key Code:**
```typescript
export async function GET(request: Request) {
  const code = requestUrl.searchParams.get('code');
  const { data } = await supabase.auth.exchangeCodeForSession(code);
  
  if (email.endsWith('@ietlucknow.ac.in')) {
    // Check if user exists
    if (existingUser) {
      return NextResponse.redirect('/feed');
    } else {
      return NextResponse.redirect('/setup');
    }
  } else {
    await supabase.auth.signOut();
    return NextResponse.redirect('/?error=invalid_email');
  }
}
```

### 3. Supabase Client (lib/supabase.ts)
**Responsibility:**
- Initialize Supabase client
- Provide auth methods
- Manage sessions

### 4. Constants (lib/constants.ts)
**Responsibility:**
- Store allowed email domain
- Other app constants

**Key Code:**
```typescript
export const ALLOWED_EMAIL_DOMAIN = '@ietlucknow.ac.in';
```

---

## OAuth Parameters Explained

### prompt: 'select_account'
**What it does:**
- Forces Google to show account selection screen
- Works even if user is already logged in
- Allows user to choose which account to use

**Without it:**
- Google auto-selects first logged-in account
- User might accidentally use wrong email
- Confusing UX

**With it:**
- User explicitly chooses account
- Clear which email they're using
- Better UX, fewer errors

### access_type: 'offline'
**What it does:**
- Requests refresh token from Google
- Allows long-term access without re-login
- Standard OAuth parameter

### redirectTo
**What it does:**
- Tells Supabase where to redirect after OAuth
- Must match authorized redirect URIs
- Format: `http://localhost:3000/auth/callback`

---

## Error Handling Flow

```
┌─────────────────┐
│  OAuth Error?   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│Network │ │Invalid │
│Error   │ │Email   │
└───┬────┘ └───┬────┘
    │          │
    ▼          ▼
┌────────────────┐
│ Show error msg │
│ Stay on /      │
│ Allow retry    │
└────────────────┘
```

---

## Security Flow

```
┌──────────────────┐
│ User clicks login│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ OAuth popup      │
│ (Google domain)  │ ← Secure, can't be faked
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Google verifies  │
│ real identity    │ ← 2FA, password, etc.
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ OAuth code       │
│ (one-time use)   │ ← Can't be reused
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Supabase session │
│ (httpOnly cookie)│ ← Secure, can't be stolen
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Email validation │
│ @ietlucknow...   │ ← App-level check
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ User logged in   │
│ Secure session   │
└──────────────────┘
```

---

## Configuration Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Google Cloud Console                      │
│                                                              │
│  OAuth 2.0 Client                                            │
│  ├─ Authorized JavaScript origins:                           │
│  │  └─ http://localhost:3000                                 │
│  │                                                           │
│  └─ Authorized redirect URIs:                                │
│     ├─ http://localhost:3000/auth/callback                   │
│     └─ https://YOUR_PROJECT.supabase.co/auth/v1/callback     │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Client ID + Secret
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Dashboard                        │
│                                                              │
│  Authentication → Providers → Google                         │
│  ├─ Client ID: [from Google]                                 │
│  └─ Client Secret: [from Google]                             │
│                                                              │
│  Authentication → URL Configuration                          │
│  ├─ Site URL: http://localhost:3000                          │
│  └─ Redirect URLs:                                           │
│     ├─ http://localhost:3000/auth/callback                   │
│     └─ http://localhost:3000/**                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Supabase URL + Key
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      .env.local                              │
│                                                              │
│  NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co   │
│  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key                 │
│  NEXT_PUBLIC_SITE_URL=http://localhost:3000                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Timeline Diagram

```
Time →

0ms     User clicks "Login with College Email"
        │
100ms   OAuth request sent to Supabase
        │
200ms   Supabase redirects to Google
        │
300ms   Google account picker appears ← prompt: 'select_account'
        │
        [User selects account - variable time]
        │
5s      User clicks on @ietlucknow.ac.in
        │
5.5s    Google authenticates
        │
6s      Google redirects to Supabase
        │
6.5s    Supabase processes OAuth code
        │
7s      Supabase redirects to app callback
        │
7.5s    App validates email
        │
8s      App redirects to /setup or /feed
        │
8.5s    User sees their page ✅
```

---

## Success vs Failure Paths

### Success Path (College Email)
```
Login → Account Picker → Select @iet... → Auth → Callback → Validate ✅ → /setup or /feed
```

### Failure Path (Wrong Email)
```
Login → Account Picker → Select @gmail.com → Auth → Callback → Validate ❌ → Sign out → / (with error)
```

### Cancel Path
```
Login → Account Picker → Cancel → Stay on /
```

---

**Visual Guide Complete!** 📊

This diagram shows the complete OAuth flow with force account selection.

For implementation details, see [OAUTH_FORCE_ACCOUNT_SELECTION.md](./OAUTH_FORCE_ACCOUNT_SELECTION.md)
