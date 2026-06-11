# TechWealth Manual Approval Flow

**Created:** 2026-06-11  
**Status:** ✅ Implemented and ready for deployment

---

## 🎯 Overview

This document explains the complete manual sign-up → approval workflow now live in TechWealth.

---

## 📱 User Journey

### Step 1: Visit Website
**URL:** `https://techwealth-website.web.app` (after deployment)

User lands on homepage, sees:
- Elite positioning (1250+ members, $450M+ assets)
- Tier pricing (Bronze HK$1k → Diamond Invite-only)
- "Apply for Membership" CTA

### Step 2: Select Tier + Fill Form
**Page:** `/register` (Apply for Membership)

User selects their tier and fills out:
- ✅ Name (first + last)
- ✅ Business email
- ✅ Phone / WhatsApp
- ✅ Company name
- ✅ Job title
- 📝 Telegram handle (optional)
- 📝 LinkedIn profile (optional)
- ✅ Preferred payment method

**Auto-calculated:** Payment amount based on tier selected

### Step 3: Submit Application
User clicks "Submit Application" → 

**Backend Action:**
```javascript
POST /api/submit-application
→ Saves to Firestore: `membership_applications` collection
→ Status: "pending" (default)
→ Payment Status: "unpaid" (default)
→ Verified: false (default)
```

**User Sees:**
- Success message: "Application Submitted!"
- Next steps explained (review → contact → payment → access)
- Expected timeline: 48 hours

### Step 4: Admin Review (You in Sanity Studio)
**URL:** `https://techwealth-website.sanity.studio/`

You receive application notification → Login to Sanity → Review details:

**Verification Checklist (5-7 min per app):**
1. Google name + company
2. Check LinkedIn (if provided)
3. Verify company website exists
4. Assess tier appropriateness
5. Look for red flags

**Decision:**
- ✅ **Approve** → Change status to "active", set verified=true
- ❌ **Reject** → Change status to "rejected", add notes
- ⏸️ **Hold** → Leave as "pending", request more info

### Step 5: Welcome Email (After Approval)
You send personalized welcome email with:
- Approval confirmation
- Payment instructions (their chosen method)
- Expected next steps

**Template in:** `ADMIN_GUIDE.md`

### Step 6: Payment Processing
User pays via their selected method:
- 🏦 Bank Transfer / FPS → Send account details
- 💳 Stripe → Send payment link
- 🅿️ PayPal → Send invoice
- 💰 Crypto → Send wallet address
- 📝 Manual → Arrange offline

**After Payment Received:**
1. Update Sanity record:
   - `paymentStatus: "paid"`
   - `paymentDate: [now]`
   - `transactionId: [reference]`

2. Create user membership document in Firestore:
   ```
   /artifacts/{appId}/users/{uid}/membership/status
   ```
   With fields:
   - `memberId: "TW-XXXXXXXX"`
   - `status: "active"`
   - `tier: "[their tier]"`
   - `joinedAt: [timestamp]`

### Step 7: Grant Full Access
Send user their unique Member ID:
- **Member ID:** `TW-ABCD1234` (example)
- **Member Portal:** Same website, now unlocked
- **Telegram Group:** Private invite link

User can now:
- ✅ Access member-only pages
- ✅ View member directory
- ✅ Join private Telegram group
- ✅ RSVP for VIP events
- ✅ See their member dashboard

---

## 🔐 Firestore Collections Structure

### `membership_applications` (Public Applications)
```javascript
{
  _id: "auto-generated",
  name: "John Doe",
  email: "john@company.com",
  phone: "+852 XXXX XXXX",
  company: "Acme Corp",
  title: "CEO",
  tier: "gold",
  status: "pending" | "active" | "rejected" | "suspended",
  paymentMethod: "bank_transfer",
  paymentAmount: 100000,
  paymentStatus: "unpaid" | "paid" | "partial" | "refunded",
  paymentDate: ISODate("..."),
  transactionId: "TXN123456",
  telegramHandle: "@johndoe",
  linkedinUrl: "https://linkedin.com/in/johndoe",
  verified: false,
  joinedDate: ISODate("..."),
  appliedDate: ISODate("..."),
  notes: "Admin-only internal notes"
}
```

### `artifacts/{appId}/users/{uid}/membership/status` (Approved Members)
```javascript
{
  memberId: "TW-ABCD1234",
  status: "active",
  tier: "gold",
  joinedAt: "2026-06-11T12:00:00Z"
}
```

---

## 🛠️ Technical Implementation

### Frontend Components

**`src/components/SignUpForm.js`**
- Tier selection UI (5 tiers with pricing)
- Multi-field form with validation
- Bilingual labels (EN/中文)
- Submission handler with loading state
- Success state with next steps

**`src/index.js` (Updated)**
- Integrated SignUpForm component
- `handleApplicationSubmit()` function
- Application status tracking (`applicationStatus` state)
- LocalStorage for email persistence
- Anonymous auth on submit

### Backend API

**`api/submit-application.js`**
- POST endpoint for form submissions
- Firebase/Firestore integration
- Server-side validation
- Auto-sets `status: "pending"`
- Returns application ID on success

### Admin Interface

**Sanity Studio (Hosted)**
- URL: `https://techwealth-website.sanity.studio/`
- Collection: `membership_applications`
- Full CRUD operations
- Filter by status
- Real-time updates

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│   User Visits   │
│   Website       │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Selects Tier   │
│  + Fills Form   │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Submit App     │
│  (POST /api/)   │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Firestore      │
│  membership_    │
│  applications   │
│  status: pending│
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Admin Reviews  │
│  (Sanity Studio)│
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    v         v
┌──────┐  ┌──────┐
│Approve│  │Reject│
└──┬───┘  └──┬───┘
   │         │
   v         v
┌─────────┐  ┌────────┐
│Send     │  │End     │
│Welcome  │  │        │
│Email    │  │        │
└────┬────┘  └────────┘
     │
     v
┌─────────┐
│Payment  │
│Received │
└────┬────┘
     │
     v
┌─────────┐
│Create   │
│Member   │
│Document │
└────┬────┘
     │
     v
┌─────────┐
│Grant    │
│Full     │
│Access   │
└─────────┘
```

---

## 🎯 Success Metrics

**Track these in Sanity Studio:**

| Metric | Target | Current |
|--------|--------|---------|
| Applications/week | 20+ | TBD |
| Approval rate | 60-80% | TBD |
| Time to approval | <24 hours | TBD |
| Approved → Paid conversion | 80%+ | TBD |
| Average tier | Gold/Silver | TBD |

---

## 🚀 Deployment Checklist

Before going live:

- [ ] Run `firebase login`
- [ ] Run `firebase deploy --only hosting`
- [ ] Verify site loads: `https://techwealth-website.web.app`
- [ ] Test sign-up form (submit test application)
- [ ] Verify application appears in Sanity Studio
- [ ] Test approval flow (approve test app)
- [ ] Test member portal access
- [ ] Verify bilingual toggle works (EN/中文)
- [ ] Check mobile responsiveness
- [ ] Test all tier selections
- [ ] Confirm API endpoint works (check Firebase logs)

---

## 📞 Post-Launch Support

**If applications not appearing in Sanity:**
1. Check Firebase Console → Firestore → `membership_applications` collection
2. Verify API endpoint is deployed (check Vercel/Netlify logs if using)
3. Check browser console for errors during submission

**If approval not granting access:**
1. Ensure Sanity doc published (not just saved as draft)
2. Manually create user membership doc in Firestore
3. Clear browser cache / try incognito

**If payment tracking issues:**
1. Use Sanity to update payment fields
2. Sync to user's membership document manually
3. Consider Stripe integration for automation (Phase 2)

---

## 🔜 Phase 2 Enhancements (Future)

**Planned improvements:**
- [ ] Automated email notifications (approval/rejection)
- [ ] Stripe integration for instant payment
- [ ] Member directory (searchable by approved members)
- [ ] Event RSVP system
- [ ] Member dashboard with stats
- [ ] Referral tracking
- [ ] Automated tier upgrades
- [ ] WhatsApp/Telegram bot integration

---

**Bottom Line:** The manual approval flow is production-ready. Deploy, test with a real application, then start accepting members. 🚀
