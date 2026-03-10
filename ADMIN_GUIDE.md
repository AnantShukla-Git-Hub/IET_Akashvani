# IET Akashvani - Admin Guide

## Admin Dashboard Overview

The admin dashboard provides complete control over IET Akashvani without touching code.

**Access:** `https://ietakashvani.vercel.app/admin/login`

---

## Features

### 1. Overview Tab 📊

**Quick Stats:**
- Total Users
- Special Access Users
- Pending Designations
- Blocked Users

**Purpose:** Get a quick snapshot of platform health.

---

### 2. Special Access Management 👥

This is the main feature for managing non-IET email users.

#### Add Special User

**Steps:**
1. Click "Add Special User" button
2. Fill in the form:
   - **Email Address:** Any email (not restricted to @ietlucknow.ac.in)
   - **Full Name:** User's full name
   - **Role:** Select from dropdown
   - **Access Level:** Select from dropdown
3. Click "Add User"
4. User receives email notification (Week 9-10)

**Roles:**
- **Guest** - Temporary visitors, external people
- **Faculty** - IET faculty with non-IET email
- **Special** - Special cases (MTech, MSc, etc.)
- **Alumni** - Alumni who lost college email

**Access Levels:**

| Level | Can View | Can Post | Can Comment | Can Like | Can Join Rooms | Can Create Achievements | Can Promote | Can Share Vibes |
|-------|----------|----------|-------------|----------|----------------|------------------------|-------------|-----------------|
| **Read Only** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Can Post** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Full** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Recommendations:**
- **Guest:** Read Only (just viewing)
- **Faculty:** Can Post (can post announcements)
- **Special:** Full (same as regular students)
- **Alumni:** Can Post (can post but limited)

#### View Special Users

**Shows:**
- Name and email
- Role badge (Guest/Faculty/Special/Alumni)
- Access level badge
- Date added
- Action buttons

**Actions:**
- **Block:** Temporarily block user (can unblock later)
- **Remove:** Permanently delete user account

#### Block User

**When to use:**
- User violating rules
- Suspicious activity
- Temporary suspension

**Process:**
1. Click "Block" button
2. Enter reason for blocking
3. User immediately blocked
4. User sees "Account under review" message
5. Can unblock from "Blocked Users" tab

#### Remove User

**When to use:**
- User no longer needs access
- Duplicate account
- Permanent removal

**Warning:** This deletes the account permanently!

---

### 3. Designations Tab 🎖️

**Coming in Week 9-10**

Will show:
- Pending designation requests
- Approve/Reject buttons
- Badge assignment
- Custom tag creation

---

### 4. Reports Tab 🚨

**Coming in Week 15-16**

Will show:
- Content reports from users
- Reported posts/comments
- Action buttons (dismiss/temp block/ban)

---

### 5. Blocked Users Tab 🚫

**Shows:**
- All blocked users
- Block reason
- Block date/time
- Unblock button

**Unblock Process:**
1. Review block reason
2. Click "Unblock" button
3. Confirm action
4. User immediately unblocked
5. User can access platform again

---

## Use Cases

### Use Case 1: Faculty Member Needs Access

**Scenario:** Dr. Sharma (faculty) wants to post announcements but has @gmail.com email.

**Solution:**
1. Go to Special Access tab
2. Click "Add Special User"
3. Email: `dr.sharma@gmail.com`
4. Name: `Dr. Sharma`
5. Role: `Faculty`
6. Access Level: `Can Post`
7. Click "Add User"
8. Dr. Sharma receives email with login link
9. Dr. Sharma can now post announcements

### Use Case 2: Alumni Lost College Email

**Scenario:** Rahul (2023 batch) lost access to college email but wants to stay connected.

**Solution:**
1. Go to Special Access tab
2. Click "Add Special User"
3. Email: `rahul@gmail.com`
4. Name: `Rahul Kumar`
5. Role: `Alumni`
6. Access Level: `Can Post`
7. Click "Add User"
8. Rahul can now access with personal email

### Use Case 3: MTech Student

**Scenario:** Priya is MTech student with different email format.

**Solution:**
1. Go to Special Access tab
2. Click "Add Special User"
3. Email: `priya.mtech@ietlucknow.ac.in`
4. Name: `Priya Singh`
5. Role: `Special`
6. Access Level: `Full`
7. Click "Add User"
8. Priya has full access like BTech students

### Use Case 4: Guest Visitor

**Scenario:** Company recruiter wants to view placement posts.

**Solution:**
1. Go to Special Access tab
2. Click "Add Special User"
3. Email: `recruiter@company.com`
4. Name: `John Doe`
5. Role: `Guest`
6. Access Level: `Read Only`
7. Click "Add User"
8. Recruiter can view but not post

### Use Case 5: User Misbehaving

**Scenario:** User posting spam/inappropriate content.

**Solution:**
1. Go to Special Access tab (or any user list)
2. Find the user
3. Click "Block" button
4. Enter reason: "Posting spam"
5. User immediately blocked
6. Review later and decide: unblock or remove

---

## Admin Setup

### Making Yourself Admin

**One-time setup in Supabase:**

1. Go to Supabase dashboard
2. Click "Table Editor"
3. Click "users" table
4. Find your user row (search by email)
5. Edit the row
6. Set `is_admin` = `true`
7. Save

**That's it!** You're now admin.

### Making Another User Admin

Same process - just set their `is_admin` to `true`.

**Recommendation:** Only make trusted people admin.

---

## Security

### Admin Access

- Only users with `is_admin = true` can access dashboard
- Admin login is separate from regular login
- Admin route: `/admin/login`
- Regular users redirected if they try to access

### Special User Security

- Special users cannot become admin
- Special users cannot add other special users
- Only admin can manage special access
- All actions logged in database

### Blocking

- Blocked users cannot login
- Blocked users cannot post/comment
- Blocked users see "Account under review"
- Blocking is reversible

### Removing

- Removing deletes account permanently
- All user's posts/comments remain (for context)
- Cannot be undone
- Use carefully

---

## Email Notifications

**Coming in Week 9-10 with Resend API**

Special users will receive:
- Welcome email with login instructions
- Access level details
- Platform guidelines
- Support contact

---

## Database Schema

### New Fields in `users` Table:

```sql
is_special_user BOOLEAN DEFAULT FALSE
special_user_role TEXT ('Guest', 'Faculty', 'Special', 'Alumni')
access_level TEXT ('read_only', 'can_post', 'full')
added_by UUID (references admin who added them)
blocked_reason TEXT
blocked_at TIMESTAMP
```

### Queries

**Get all special users:**
```sql
SELECT * FROM users WHERE is_special_user = true;
```

**Get all blocked users:**
```sql
SELECT * FROM users WHERE is_banned = true;
```

**Get users added by specific admin:**
```sql
SELECT * FROM users WHERE added_by = 'admin_user_id';
```

---

## Troubleshooting

### Can't Access Admin Dashboard

**Problem:** Redirected to main site
**Solution:** Check if `is_admin = true` in database

### Special User Can't Login

**Problem:** User says they can't login
**Solution:** 
1. Check if user exists in database
2. Check if `is_banned = false`
3. Check if email is correct
4. Send them direct login link

### Special User Has Wrong Access

**Problem:** User can't do something they should be able to
**Solution:**
1. Go to Special Access tab
2. Find the user
3. Remove them
4. Add them again with correct access level

### Blocked User Still Active

**Problem:** Blocked user still posting
**Solution:**
1. Check database - is `is_banned = true`?
2. User might be cached - they need to logout/login
3. Check if it's a different user with similar name

---

## Best Practices

### Adding Special Users

1. **Verify Identity:** Make sure you know who they are
2. **Start Restrictive:** Give minimum access first, increase if needed
3. **Document Reason:** Keep note of why you added them
4. **Review Regularly:** Check special users list monthly

### Blocking Users

1. **Always Give Reason:** Clear reason helps with appeals
2. **Temporary First:** Block before removing permanently
3. **Communicate:** Tell user why they're blocked (via email)
4. **Review Appeals:** Give users chance to explain

### Access Levels

1. **Read Only:** Default for guests/visitors
2. **Can Post:** For faculty, alumni who need to post
3. **Full:** Only for trusted users (MTech, special cases)

### Security

1. **Limit Admins:** Only 2-3 trusted people
2. **Regular Audits:** Review special users monthly
3. **Monitor Activity:** Check for suspicious behavior
4. **Quick Response:** Block immediately if needed

---

## Future Features

### Coming Soon:

**Week 9-10:**
- Email notifications for special users
- Designation approval system
- Badge management

**Week 15-16:**
- Content moderation
- Report management
- Auto-moderation rules

**Week 17-18:**
- Activity logs
- Admin analytics
- Bulk actions

---

## Support

### For Admins:

If you need help with admin dashboard:
1. Check this guide first
2. Check database directly in Supabase
3. Contact developer (Anant)

### For Special Users:

If special user needs help:
1. They should email you (admin)
2. You check their account in dashboard
3. You fix the issue or explain

---

## Quick Reference

### Admin URLs:
- Login: `/admin/login`
- Dashboard: `/admin`

### Common Actions:
- Add special user: Admin → Special Access → Add Special User
- Block user: Find user → Block button → Enter reason
- Unblock user: Admin → Blocked Users → Unblock button
- Remove user: Find user → Remove button → Confirm

### Access Levels:
- Read Only: View + Like only
- Can Post: View + Post + Comment + Rooms
- Full: Everything

### Roles:
- Guest: Temporary visitors
- Faculty: IET faculty
- Special: MTech/MSc/Special cases
- Alumni: Graduated students

---

**Admin Dashboard:** Complete control without touching code! 🎉

**Questions?** Check this guide or contact developer.

---

**Last Updated:** Week 3-4
**Status:** Special Access Management Complete ✅
**Next:** Designation Management (Week 9-10)
