# 🚀 TechWealth Deployment Instructions

**Generated:** 2026-06-09  
**Status:** ✅ Build ready, awaiting Firebase authentication

---

## ✅ What's Done

- [x] Admin member schema added to Sanity CMS
- [x] Bilingual support (EN/中文) verified
- [x] Production build compiled successfully
- [x] Code pushed to GitHub (`main` branch)
- [x] Firebase configuration updated
- [x] `.firebaserc` created (project: `techwealth-website`)

---

## 🔐 Tonight's Deployment Steps

### Step 1: Login to Firebase

Open terminal and run:

```bash
cd /root/.openclaw/workspace/TechWealth
firebase login
```

This will open your browser. Login with your Google account that has access to the `techwealth-website` Firebase project.

---

### Step 2: Deploy to Hosting

```bash
firebase deploy --only hosting
```

Expected output:
```
✔ Deploy complete!
Hosting URL: https://techwealth-website.web.app
```

---

### Step 3: Verify Deployment

Visit:
- **Public Site:** https://techwealth-website.web.app
- **Check:** English + Traditional Chinese toggle works
- **Check:** No 404 errors

---

## 🎯 Admin Panel Access

### Sanity Studio (Member Management)

**URL:** https://techwealth-website.sanity.studio/

**Login:** Use your Sanity account credentials (same one used when setting up the project)

**What you can do:**
- ✅ View all members
- ✅ Add/edit member records
- ✅ Approve/reject membership applications
- ✅ Update tier status (Bronze/Silver/Gold/Platinum/Diamond)
- ✅ Track payment status
- ✅ Add admin notes
- ✅ Verify members (asset/income check toggle)

**Navigation:**
1. Login to Sanity Studio
2. Click **"Member"** in left sidebar
3. Click **"Create new member"** or edit existing
4. Use filters to search by name, email, tier, status

---

## 📋 Member Schema Fields

When adding/editing members in Sanity:

| Field | Description |
|-------|-------------|
| **Name** | Full name (required) |
| **Email** | Business email (required) |
| **Phone / WhatsApp** | Contact number |
| **Company** | Company name |
| **Job Title** | Position/title |
| **Tier** | Bronze/Silver/Gold/Platinum/Diamond |
| **Status** | Pending/Active/Rejected/Suspended |
| **Payment Method** | Bank Transfer/FPS, Stripe, PayPal, Crypto, Manual |
| **Payment Status** | Unpaid/Paid/Partial/Refunded |
| **Payment Amount** | In USD |
| **Transaction ID** | Reference number |
| **Verified** | Asset/income check completed (boolean) |
| **Telegram Handle** | @username |
| **LinkedIn Profile** | Profile URL |
| **Admin Notes** | Internal notes (not visible to members) |

---

## 🛠️ Troubleshooting

### If deployment fails:

```bash
# Check Firebase project is set correctly
firebase projects:list

# Re-login if needed
firebase logout
firebase login

# Try deploy again
firebase deploy --only hosting
```

### If Sanity Studio doesn't show "Member" section:

1. Make sure you deployed the latest code
2. Check `sanity/schemas/member.js` exists
3. Check `sanity/schemas/index.js` includes `import member from "./member"`

---

## 📞 Support

If anything breaks tonight, message me with:
1. Screenshot of the error
2. What step you were on
3. Any error messages from terminal

---

**Ready for tonight!** 🍾
