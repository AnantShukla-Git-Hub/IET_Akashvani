# IET Akashvani - Security Model

## Authentication vs Profile Information

### CRITICAL: Roll Numbers Are NOT Used for Authentication!

---

## Authentication Flow (SECURE)

### Step 1: Google OAuth
- User clicks "Login with College Email"
- Google OAuth popup opens
- **User picks their REAL Google account themselves**
- Google verifies the user's identity
- This is the ONLY authentication step

### Step 2: Email Domain Check
- Check if email ends with `@ietlucknow.ac.in`
- If YES → Allow entry
- If NO → Reject with message

### Step 3: Profile Setup
- User enters profile information
- Roll number is just profile data
- NO validation against a list
- NO authentication based on roll number

---

## Why This Approach?

### Problem with Roll Number Authentication:
❌ Anyone can guess a roll number  
❌ Roll numbers are predictable (sequential)  
❌ No way to verify if person owns that roll number  
❌ Security risk: impersonation  

### Solution: Google OAuth Only:
✅ Google verifies real identity  
✅ User must have access to the email account  
✅ Cannot be guessed or faked  
✅ Industry-standard security  
✅ Two-factor authentication (if enabled)  

---

## Roll Number Usage

### Roll numbers are ONLY used for:

1. **Detecting Branch**
   - Parse 9-digit branch code
   - Show branch name (CS Regular, ECE, etc.)
   - Auto-fill profile

2. **Detecting Batch Year**
   - Parse first 2 digits
   - Calculate current study year
   - Auto-fill profile

3. **Detecting Class Roll**
   - Parse last 2 digits
   - Show class roll number
   - For reference only

4. **Profile Display**
   - Show on user profile
   - Show in posts
   - Show in rooms

5. **Statistics**
   - Count students per branch
   - Count students per year
   - Analytics only

### Roll numbers are NOT used for:
❌ Authentication  
❌ Login verification  
❌ Access control  
❌ Security checks  
❌ Identity proof  

---

## Roll Number Format

### Structure: 13 digits
```
2500520100112
││││││││││││└─ Class roll (12)
│││││││││└└─── Unknown
││└└└└└└└───── Branch code (005201000 = CS Regular)
└└──────────── Year (25 = 2025)
```

### Branch Codes (9 digits):
- `005200000` = Civil Engineering (CE)
- `005201000` = CS Regular (CSR)
- `005201001` = CS Self Finance (CSSF)
- `005215200` = CS AI (CSAI)
- `005203100` = ECE
- `005202000` = EE
- `005204000` = ME
- `005205100` = Chemical Engineering (CHE)

### Validation:
- Check length (13 digits)
- Check format (all digits)
- Parse branch code
- Show live preview
- **NO authentication check**

---

## Security Layers

### Layer 1: Google OAuth (PRIMARY)
- User must have @ietlucknow.ac.in email
- Google verifies email ownership
- Cannot be bypassed

### Layer 2: Email Domain Check
- Server-side validation
- Only @ietlucknow.ac.in allowed
- Rejects all other domains

### Layer 3: Supabase RLS (Row Level Security)
- Database-level security
- Users can only access their own data
- Cannot read/write other users' data

### Layer 4: Access Control
- Permission checks in code
- Owner/Admin privileges
- Special user access levels

### Layer 5: Rate Limiting (Future)
- Prevent brute force
- Limit API calls
- DDoS protection

---

## Attack Scenarios & Mitigations

### Scenario 1: Someone tries to use another student's roll number

**Attack:**
1. Attacker logs in with their own @ietlucknow.ac.in email
2. Attacker enters victim's roll number
3. Attacker tries to impersonate victim

**Mitigation:**
- ✅ Attacker's email is recorded in database
- ✅ Attacker's Google account is linked
- ✅ Attacker cannot access victim's account
- ✅ Attacker's posts show their own name (from Google)
- ✅ Admin can see who logged in (email audit trail)

**Result:** Attack fails. Attacker identified.

### Scenario 2: Someone tries to guess roll numbers

**Attack:**
1. Attacker tries multiple roll numbers
2. Attacker tries to find valid combinations

**Mitigation:**
- ✅ Roll numbers are not validated against a list
- ✅ Any 13-digit number is accepted (format check only)
- ✅ No feedback on whether roll number exists
- ✅ No benefit to guessing

**Result:** Attack is pointless.

### Scenario 3: Someone tries to login without IET email

**Attack:**
1. Attacker uses @gmail.com or other email
2. Attacker tries to access platform

**Mitigation:**
- ✅ Email domain check rejects non-IET emails
- ✅ Google OAuth only allows whitelisted emails
- ✅ Cannot bypass email check

**Result:** Attack blocked at authentication.

### Scenario 4: Someone tries to access another user's data

**Attack:**
1. Attacker logs in successfully
2. Attacker tries to read/modify other users' posts

**Mitigation:**
- ✅ Supabase RLS policies enforce access control
- ✅ Database rejects unauthorized queries
- ✅ Cannot access other users' data

**Result:** Attack blocked at database level.

---

## Privacy Considerations

### What's Public:
- Name (from Google profile)
- Profile picture (from Google)
- Branch (from roll number)
- Year (from roll number)
- Posts (unless anonymous)
- Comments
- Likes

### What's Private:
- Email address (only visible to owner/admin)
- Roll number (only visible to owner/admin)
- Anonymous post identity (only visible to owner)
- Reports (only visible to owner/admin)

### Anonymous Posts:
- Name hidden (shows "Anonymous IETian")
- Avatar hidden (shows generic avatar)
- Branch shown (for context)
- Year hidden
- **ONLY Owner sees real identity**

---

## Admin/Owner Privileges

### Owner (anantshukla836@gmail.com):
- Can see ALL anonymous post identities
- Can access ALL rooms
- Can see ALL reports
- Can moderate ALL content
- GOD MODE access

### Regular Admin:
- Can approve designations
- Can manage special users
- Can view reports
- Cannot see anonymous identities

### Regular Users:
- Can see own data
- Can see public posts
- Cannot see anonymous identities
- Cannot access admin features

---

## Best Practices

### For Users:
1. Use your real @ietlucknow.ac.in email
2. Enter your correct roll number
3. Don't share your Google account
4. Enable 2FA on Google account
5. Report suspicious activity

### For Admins:
1. Never share admin credentials
2. Review reports regularly
3. Monitor for suspicious patterns
4. Keep audit logs
5. Update security policies

### For Developers:
1. Never use roll numbers for authentication
2. Always validate email domain
3. Use Supabase RLS policies
4. Sanitize user input
5. Log security events

---

## Compliance

### Data Protection:
- Minimal data collection
- No sensitive data stored
- Google handles authentication
- Supabase handles security
- GDPR-friendly (EU students)

### Access Logs:
- All logins logged
- Email addresses recorded
- Timestamps recorded
- IP addresses (via Supabase)
- Audit trail available

---

## Future Enhancements

### Planned (Week 15-16):
- Rate limiting
- IP blocking
- Suspicious activity detection
- Auto-ban on abuse
- Email verification (optional)

### Planned (Week 17-18):
- Two-factor authentication (optional)
- Session management
- Device tracking
- Login notifications
- Security dashboard

---

## Summary

### ✅ Secure:
- Google OAuth authentication
- Email domain validation
- Supabase RLS policies
- Access control checks
- Audit logging

### ❌ NOT Secure:
- Roll number authentication
- Roll number validation
- Roll number as identity proof

### 🔑 Key Principle:
**Authentication = Google OAuth ONLY**  
**Roll Number = Profile Information ONLY**

---

## Questions?

**Q: Why not validate roll numbers against a list?**  
A: Because roll numbers are not authentication. Anyone can enter any roll number. The email is what matters.

**Q: What if someone enters a fake roll number?**  
A: Their email is still recorded. They can't impersonate anyone. Admin can see who they are.

**Q: Can someone access another student's account?**  
A: No. Each account is tied to a unique Google email. Cannot be shared or transferred.

**Q: What if someone's email is compromised?**  
A: They should secure their Google account (change password, enable 2FA). Contact admin to block account.

**Q: How do we prevent spam/abuse?**  
A: Email domain check, rate limiting, moderation, reports, bans. Multiple layers.

---

**Security Model:** Complete ✅  
**Authentication:** Google OAuth Only ✅  
**Roll Numbers:** Profile Info Only ✅  
**Cost:** ₹0 ✅

**Sankalp:** Main IET Akashvani banaunga 🙏
