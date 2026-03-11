# Auth Callback Route Fix

**Date:** March 11, 2026  
**Status:** ✅ FIXED  
**File:** `app/auth/callback/route.ts`

---

## Problem Description

The auth callback route needed better user existence checking to:
1. Route new users to `/setup`
2. Route returning users to `/feed` directly
3. Prevent duplicate user creation errors

---

## Fix Applied

### Updated User Existence Check

**Before:**
```typescript
const { data: existingUser } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
  .single();
```

**After:**
```typescript
const { data: existingUser, error: userError } = await supabase
  .from('users')
  .select('id, skip_setup')
  .eq('email', email)
  .single();

if (userError) {
  // Log error but don't fail - might be "no rows" error for new user
  console.log('User lookup:', userError.code === 'PGRST116' ? 'New user' : userError.message);
}
```

**Improvements:**
- ✅ Only select needed fields (`id, skip_setup` instead of `*`)
- ✅ Capture and handle `userError`
- ✅ Recognize `PGRST116` error code (no rows found) as "new user"
- ✅ Added console logging for debugging

### Enhanced Routing Logic

```typescript
if (existingUser) {
  // Returning user → go to feed directly
  console.log('Existing user found, redirecting to feed');
  return NextResponse.redirect(new URL('/feed', requestUrl.origin));
} else {
  // New user → go to setup
  console.log('New user, redirecting to setup');
  return NextResponse.redirect(new URL('/setup', requestUrl.origin));
}
```

**Benefits:**
- ✅ Clear comments explaining routing
- ✅ Console logs for debugging
- ✅ Explicit handling of both cases

### Added Error Logging

```typescript
if (!error && data.session) {
  // ... existing code
} else {
  // OAuth error
  console.error('OAuth error:', error);
}
```

```typescript
// Fallback redirect
console.log('No code or error, redirecting to home');
return NextResponse.redirect(new URL('/', requestUrl.origin));
```

---

## How It Works

### Flow Diagram

```
Google OAuth Callback
        ↓
Exchange code for session
        ↓
    Success?
        ↓
   ┌────┴────┐
   │         │
  Yes       No → Log error → Redirect to /
   │
   ↓
Check email domain
   │
   ├─ @ietlucknow.ac.in? → Yes → Continue
   │
   └─ Other domain? → No → Sign out → Redirect to /?error=invalid_email
   
   ↓
Query database for user
   │
   ├─ User exists? → Yes → Redirect to /feed ✅
   │
   └─ User not found? → No → Redirect to /setup ✅
```

---

## User Scenarios

### Scenario 1: First-Time User
**Steps:**
1. User clicks "Login with College Email"
2. Selects @ietlucknow.ac.in account
3. Google authenticates
4. Callback receives OAuth code
5. Exchanges code for session
6. Checks email domain ✅
7. Queries database for user
8. User not found (new user)
9. **Redirects to `/setup`** ✅

**Result:** User fills profile setup form

### Scenario 2: Returning User
**Steps:**
1. User clicks "Login with College Email"
2. Selects @ietlucknow.ac.in account
3. Google authenticates
4. Callback receives OAuth code
5. Exchanges code for session
6. Checks email domain ✅
7. Queries database for user
8. User found (existing user)
9. **Redirects to `/feed`** ✅

**Result:** User sees main feed immediately

### Scenario 3: Wrong Email Domain
**Steps:**
1. User clicks "Login with College Email"
2. Selects @gmail.com account
3. Google authenticates
4. Callback receives OAuth code
5. Exchanges code for session
6. Checks email domain ❌
7. Signs out user
8. **Redirects to `/?error=invalid_email`** ❌

**Result:** User sees error message on landing page

### Scenario 4: OAuth Error
**Steps:**
1. User clicks "Login with College Email"
2. OAuth flow fails (network error, user cancels, etc.)
3. Callback receives error
4. Logs error
5. **Redirects to `/`** ❌

**Result:** User stays on landing page, can try again

---

## Error Handling

### Supabase Error Codes

**PGRST116** - No rows found
- This is NORMAL for new users
- Means user doesn't exist in database yet
- Should redirect to `/setup`

**Other errors:**
- Log the error message
- Still redirect appropriately based on `existingUser` value

### Console Logging

**New User:**
```
User lookup: New user
New user, redirecting to setup
```

**Existing User:**
```
Existing user found, redirecting to feed
```

**Invalid Email:**
```
Invalid email domain: user@gmail.com
```

**OAuth Error:**
```
OAuth error: { ... }
```

**Fallback:**
```
No code or error, redirecting to home
```

---

## Benefits

### 1. No Duplicate User Errors ✅
- Checks if user exists BEFORE redirecting to setup
- Existing users skip setup entirely
- New users go to setup only once

### 2. Better User Experience ✅
- Returning users go straight to feed
- No unnecessary setup screen
- Faster login flow

### 3. Better Debugging ✅
- Console logs at each decision point
- Error codes are recognized and logged
- Easy to trace issues

### 4. Cleaner Code ✅
- Explicit error handling
- Clear comments
- Logical flow

---

## Testing

### Test Case 1: New User Login
**Steps:**
1. Use email that's NOT in database
2. Login with OAuth
3. Check browser console
4. Check redirect URL

**Expected Console Output:**
```
User lookup: New user
New user, redirecting to setup
```

**Expected Result:** Redirects to `/setup` ✅

### Test Case 2: Existing User Login
**Steps:**
1. Complete setup once (create user in database)
2. Logout
3. Login again with same email
4. Check browser console
5. Check redirect URL

**Expected Console Output:**
```
Existing user found, redirecting to feed
```

**Expected Result:** Redirects to `/feed` ✅

### Test Case 3: Wrong Email Domain
**Steps:**
1. Login with @gmail.com
2. Check browser console
3. Check redirect URL

**Expected Console Output:**
```
Invalid email domain: user@gmail.com
```

**Expected Result:** Redirects to `/?error=invalid_email` ✅

### Test Case 4: Multiple Logins (Same User)
**Steps:**
1. Login as new user → goes to setup
2. Complete setup
3. Logout
4. Login again → goes to feed
5. Logout
6. Login again → goes to feed

**Expected Result:** 
- First time: `/setup` ✅
- All subsequent times: `/feed` ✅

---

## Database Query Optimization

### Before
```typescript
.select('*')  // Selects ALL columns
```

**Problems:**
- ❌ Fetches unnecessary data
- ❌ Slower query
- ❌ More bandwidth

### After
```typescript
.select('id, skip_setup')  // Only needed columns
```

**Benefits:**
- ✅ Faster query
- ✅ Less bandwidth
- ✅ Only fetch what we need

**Note:** We select `skip_setup` for future use (special users who skip setup)

---

## Security Considerations

### Email Domain Validation
```typescript
if (email && email.endsWith(ALLOWED_EMAIL_DOMAIN))
```

**Security:**
- ✅ Only @ietlucknow.ac.in emails allowed
- ✅ Checked on server-side (can't be bypassed)
- ✅ Invalid emails are signed out immediately

### Session Management
```typescript
await supabase.auth.signOut();
```

**Security:**
- ✅ Invalid users are signed out
- ✅ No session persists for wrong emails
- ✅ Clean state for retry

---

## Future Enhancements

### 1. Skip Setup for Special Users
```typescript
if (existingUser) {
  if (existingUser.skip_setup) {
    return NextResponse.redirect(new URL('/feed', requestUrl.origin));
  } else {
    // Check if setup is complete
    // ...
  }
}
```

### 2. Incomplete Setup Detection
```typescript
if (existingUser) {
  // Check if user completed setup
  if (!existingUser.roll_number) {
    // Setup incomplete, redirect to setup
    return NextResponse.redirect(new URL('/setup', requestUrl.origin));
  }
  // Setup complete, go to feed
  return NextResponse.redirect(new URL('/feed', requestUrl.origin));
}
```

### 3. Banned User Check
```typescript
if (existingUser) {
  if (existingUser.is_banned) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL('/?error=banned', requestUrl.origin));
  }
  // ...
}
```

---

## Files Modified

1. **app/auth/callback/route.ts**
   - Updated user existence check
   - Added error handling
   - Added console logging
   - Optimized database query

---

## Related Files

- `app/page.tsx` - Landing page with login button
- `app/setup/page.tsx` - Profile setup form
- `app/feed/page.tsx` - Main feed
- `lib/constants.ts` - ALLOWED_EMAIL_DOMAIN constant

---

## Conclusion

The auth callback route now properly:
1. ✅ Checks if user exists in database
2. ✅ Routes new users to setup
3. ✅ Routes returning users to feed
4. ✅ Handles errors gracefully
5. ✅ Logs for debugging
6. ✅ Prevents duplicate user errors

**Status:** READY TO TEST

**Next:** Test the complete OAuth flow with new and returning users!

---

**Fixed by:** Kiro AI Assistant  
**Date:** March 11, 2026  
**Time:** ~5 minutes  
**Cost:** ₹0
