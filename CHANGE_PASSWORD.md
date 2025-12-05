# 🚀 QUICK START: Change Your Admin Password

## Change Password NOW (2 Minutes)

### Step 1: Generate Hash
Open terminal and run:
```bash
cd d:\Full_BOC\loan-locator
node generate-password-hash.js
```

Type your new password when prompted.

### Step 2: Copy Hash
You'll see output like:
```
✅ Password hash generated successfully!

Copy this hash to your .env.local file:
========================================
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### Step 3: Update File
Open `.env.local` and change this line:
```env
REACT_APP_ADMIN_PASSWORD_HASH=ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f
```

To your new hash:
```env
REACT_APP_ADMIN_PASSWORD_HASH=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### Step 4: Restart
```bash
# Stop server (Ctrl+C if running)
npm start
```

### Step 5: Test
1. Open http://localhost:3000
2. Click "Admin" button
3. Login with your NEW password

✅ Done!

---

## For Production (Vercel)

After changing password locally:

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Edit `REACT_APP_ADMIN_PASSWORD_HASH`
5. Paste your new hash
6. Save and redeploy

---

## Your Password is SECURE! 🔒

- ✅ NOT in code
- ✅ NOT in Git
- ✅ NOT visible in GitHub
- ✅ SHA-256 encrypted
- ✅ Safe to publish code

**For details:** See `SECURITY_README.md`
