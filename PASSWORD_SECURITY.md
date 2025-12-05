# 🔐 How to Change Admin Password

## Security Features

✅ **Password NOT in code** - Stored as SHA-256 hash in `.env.local`  
✅ **`.env.local` NOT in Git** - Protected by `.gitignore`  
✅ **Hash-based authentication** - Password never stored in plain text  
✅ **Safe to publish code** - No secrets exposed in repository

---

## Change Admin Password (3 Steps)

### Step 1: Generate Password Hash

Open terminal in project folder and run:

```bash
node generate-password-hash.js
```

You'll be prompted:
```
Enter your new admin password: [type your password]
```

**Example Output:**
```
✅ Password hash generated successfully!

========================================
Copy this hash to your .env.local file:
========================================

a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3

========================================
```

### Step 2: Update .env.local File

1. Open `.env.local` file in your project root
2. Find this line:
   ```
   REACT_APP_ADMIN_PASSWORD_HASH=ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f
   ```
3. Replace the hash with your new generated hash:
   ```
   REACT_APP_ADMIN_PASSWORD_HASH=a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3
   ```
4. Save the file

### Step 3: Restart Server

```bash
# Stop the server (Ctrl+C)
# Start again
npm start
```

✅ Done! Your new password is now active.

---

## Important Security Notes

### ✅ What's Protected

1. **`.env.local` file** is in `.gitignore` - never uploaded to Git/GitHub
2. **Password stored as hash** - cannot be reverse-engineered
3. **Only you have the password** - hash is unique to your password
4. **Code is safe to publish** - no secrets in source code

### 📁 Files That Are Safe to Publish

- ✅ All `.js` files in `src/`
- ✅ All `.css` files
- ✅ All `.json` files
- ✅ `generate-password-hash.js` (helper script)
- ✅ Firebase config in code (API keys are domain-restricted)

### 🚫 Files That Are Private (NOT in Git)

- ❌ `.env.local` - Your password hash
- ❌ `.env` - Any environment variables
- ❌ `node_modules/` - Dependencies
- ❌ `build/` - Compiled output

### Verify Git Protection

Check if `.env.local` is protected:

```bash
git status
```

You should **NOT** see `.env.local` in the list. If you do, it means it's being tracked by Git (bad!).

---

## Default Password

**Default:** `admin123`  
**Default Hash:** `ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f`

⚠️ **Change this immediately for production!**

---

## How Password Security Works

### When You Login:

1. You enter password in browser
2. Password is hashed using SHA-256 (in browser)
3. Hash is compared with stored hash from `.env.local`
4. If hashes match → Login successful
5. Original password is never stored or transmitted

### Why This is Secure:

- **No plain text password** in code or config files
- **Hash cannot be reversed** to get original password
- **Each password has unique hash**
- **Fast and secure** - SHA-256 is cryptographically strong

### Example:
```
Password: "MySecret123"  →  Hash: "a1b2c3d4e5f6..."
Password: "MySecret124"  →  Hash: "z9y8x7w6v5u4..." (completely different)
```

---

## Deployment to Vercel

### For Production Deployment:

1. Go to Vercel Dashboard → Your Project
2. Go to **Settings** → **Environment Variables**
3. Add new variable:
   - **Key:** `REACT_APP_ADMIN_PASSWORD_HASH`
   - **Value:** Your generated hash (from Step 1)
   - **Environment:** Production
4. Click **Save**
5. Redeploy your app

**Important:** Don't use the default `admin123` hash in production!

---

## Lost Your Password?

### No Problem! Reset It:

1. Run `node generate-password-hash.js`
2. Enter a NEW password
3. Copy the new hash to `.env.local`
4. Restart server
5. Login with your new password

---

## Password Best Practices

### ✅ Good Passwords:
- `MyBOCAdmin2024!` - 15 characters, mixed case, number, symbol
- `BankOfCeylon@Secure123` - 22 characters, memorable, strong
- `LOC-Admin-2024-Dec$` - 19 characters, clear pattern, secure

### ❌ Weak Passwords:
- `admin` - Too short, too common
- `password123` - Dictionary word
- `admin123` - Default password (change it!)

### Recommendations:
- **Minimum 12 characters**
- **Mix uppercase, lowercase, numbers, symbols**
- **Don't use common words**
- **Make it memorable but unique**

---

## Troubleshooting

### Problem: "Incorrect password" but I'm sure it's right

**Solution:**
1. Generate hash again: `node generate-password-hash.js`
2. Copy the exact hash (no spaces before/after)
3. Replace in `.env.local`
4. Restart server completely

### Problem: Can't find `.env.local` file

**Solution:**
It might be hidden. Show hidden files:
- **Windows:** View → Show → Hidden items
- **Mac:** Cmd+Shift+. (dot)

Or create it manually:
1. Create new file named `.env.local` in project root
2. Copy content from `.env.local.example` (if exists)
3. Or copy from this guide above

### Problem: Password still showing in code

**Solution:**
The password is NOT in code. Only the hash is stored. If someone sees the code, they only see the hash, which cannot be reversed to get your password.

---

## For Your Client

### Share These Instructions:

1. **To Change Password:**
   - Run: `node generate-password-hash.js`
   - Follow prompts
   - Update `.env.local`
   - Restart server

2. **Keep `.env.local` File Safe:**
   - Don't share this file
   - Don't upload to cloud/email
   - Backup locally only

3. **Safe to Share:**
   - All code files (.js, .css)
   - GitHub repository (without .env.local)
   - Firebase config (it's domain-restricted)

---

## Quick Reference

```bash
# Generate new password hash
node generate-password-hash.js

# Check if .env.local is protected
git status

# Restart development server
npm start

# Deploy to production (after changing password)
git push origin main
```

---

**Last Updated:** December 5, 2025  
**Security Level:** Production-Ready 🔒
