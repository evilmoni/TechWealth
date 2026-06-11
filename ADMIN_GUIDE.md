# TechWealth Admin Guide — Manual Approval Workflow

**Last Updated:** 2026-06-11  
**Status:** ✅ Ready for production use

---

## 📋 Overview

Members apply via the public website → Applications saved to Firestore → Admin reviews in Sanity Studio → Approve/Reject → Member notified

---

## 🔐 Accessing Sanity Studio

**URL:** `https://techwealth-website.sanity.studio/`

**Login:** Use your Sanity account credentials (same as project setup)

---

## 📥 Reviewing Applications

### Step 1: Navigate to Applications

1. Login to Sanity Studio
2. In left sidebar, click **"Membership Applications"** (or `membership_applications`)
3. You'll see a list of all applications with status badges

### Step 2: Filter by Status

Use the filter dropdown to view:
- **⏳ Pending** — Awaiting your review (default view)
- **✅ Approved** — Already approved
- **❌ Rejected** — Declined applications
- **⚠️ Suspended** — Previously approved, now suspended

### Step 3: Review Application Details

Click any application to see full details:

| Field | What to Check |
|-------|---------------|
| **Name** | Full legal name |
| **Email** | Business email (verify domain matches company) |
| **Phone** | WhatsApp-capable number |
| **Company** | Verify company exists (Google search / LinkedIn) |
| **Job Title** | Reasonable for company size |
| **Tier Selected** | Bronze/Silver/Gold/Platinum/Diamond |
| **Telegram Handle** | Optional — check if provided |
| **LinkedIn Profile** | Optional — verify professional background |
| **Payment Method** | Their preferred payment method |
| **Payment Amount** | Auto-calculated based on tier |
| **Applied Date** | When they submitted |

---

## ✅ Approval Process

### For Each Application:

**1. Verify Identity (5 min)**
- Google their name + company
- Check LinkedIn profile (if provided)
- Verify company website exists
- Look for red flags (fake info, suspicious patterns)

**2. Assess Fit (2 min)**
- Are they in your target demographic?
- Business owner / executive / professional?
- Can they afford the tier they selected?
- Will they add value to the network?

**3. Decision:**

**Approve if:**
- ✅ Info checks out
- ✅ Professional background verified
- ✅ Tier is appropriate for their level
- ✅ No red flags

**Reject if:**
- ❌ Fake/fabricated information
- ❌ Cannot verify identity/company
- ❌ Clearly cannot afford membership
- ❌ Spam or low-quality application

---

## 🎯 Taking Action in Sanity

### To Approve:

1. Open the application document
2. Change **Status** from `⏳ Pending Approval` → `✅ Active`
3. Set **Verified** toggle to `true` (checked)
4. Update **Payment Status** to match reality:
   - `⏳ Unpaid` → They haven't paid yet (most common)
   - `✅ Paid` → Payment received
   - `⚠️ Partial` → Partial payment received
5. Add **Payment Amount** (HKD)
6. Add **Transaction ID** (if applicable)
7. Optional: Add **Admin Notes** (internal only)
8. Click **"Publish"** to save changes

### To Reject:

1. Open the application document
2. Change **Status** from `⏳ Pending Approval` → `❌ Rejected`
3. Add **Admin Notes** explaining reason (optional but recommended)
4. Click **"Publish"**

### To Request More Info:

1. Leave status as `⏳ Pending Approval`
2. Add **Admin Notes**: "Need verification of [X]"
3. Contact applicant via email/phone directly
4. Update once info received

---

## 📞 Post-Approval Workflow

### After Approving an Application:

**Step 1: Send Welcome Email**

Template:
```
Subject: Welcome to TechWealth Elite — [Their Name]

Dear [Name],

Your application to TechWealth Elite has been approved! 🎉

**Membership Details:**
- Tier: [Bronze/Silver/Gold/Platinum]
- Amount: HK$[X,XXX]
- Status: Active

**Next Steps:**

1. **Payment:** Please complete payment via [their selected method]
   - Bank Transfer / FPS: [Your account details]
   - Stripe/PayPal: [Link to payment page]
   - Crypto: [Wallet address]

2. **Verification:** Once payment is received, we'll send your unique Member ID

3. **Access:** Use your Member ID to access the member portal and join our private Telegram group

**Questions?** Reply to this email or WhatsApp me at [your number]

Welcome aboard,
[Your Name]
TechWealth Admin
```

**Step 2: Process Payment**

- Send them payment instructions via email/WhatsApp
- Receive payment via their chosen method
- Record transaction details in Sanity:
  - Payment Date
  - Transaction ID
  - Update Payment Status to "Paid"

**Step 3: Grant Full Access**

Once payment confirmed:
- Update Firestore user document with `memberId` and `status: 'active'`
- Send them their unique Member ID
- Invite to private Telegram group
- Add to member directory (if applicable)

---

## 🛠️ Sanity Schema Reference

### Membership Application Fields:

```javascript
{
  name: string (required),
  email: string (required, email format),
  phone: string (required),
  company: string (required),
  title: string (required),
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond",
  status: "pending" | "active" | "rejected" | "suspended",
  paymentMethod: "bank_transfer" | "stripe" | "paypal" | "crypto" | "manual",
  paymentStatus: "unpaid" | "paid" | "partial" | "refunded",
  paymentAmount: number (HKD),
  paymentDate: datetime,
  transactionId: string,
  telegramHandle: string (optional),
  linkedinUrl: url (optional),
  verified: boolean,
  joinedDate: datetime (auto-set),
  appliedDate: datetime (auto-set),
  notes: text (admin-only)
}
```

---

## 📊 Daily Admin Checklist

**Morning (10:00 HKT):**
- [ ] Check for new pending applications
- [ ] Review + verify each application
- [ ] Approve/reject decisions made
- [ ] Send welcome emails for approvals

**Afternoon (15:00 HKT):**
- [ ] Follow up on unpaid approved applications
- [ ] Process any received payments
- [ ] Update payment records in Sanity

**Evening (21:00 HKT):**
- [ ] Final check for new applications
- [ ] Confirm all pending apps have been actioned
- [ ] Log any issues/observations

---

## 🚨 Red Flags to Watch For

**Immediate Reject Triggers:**
- Disposable email addresses (tempmail, guerrillamail, etc.)
- Fake company names (can't find any online presence)
- Inconsistent information (title doesn't match company size)
- Spam-like patterns (generic info, no LinkedIn, no digital footprint)
- Multiple applications from same IP with different names

**Needs Extra Verification:**
- Very young applicants (<25) applying for Platinum/Diamond
- High-tier applications from unknown companies
- Applicants from high-risk industries
- Mismatched info (e.g., CEO of tiny startup applying for Diamond tier)

---

## 💡 Best Practices

1. **Respond within 24 hours** — Fast approval = better conversion
2. **Personalize welcome emails** — Mention something specific from their app
3. **Keep admin notes professional** — These are internal but permanent
4. **Verify before approving** — 5 min of Google saves hours of problems later
5. **Track everything** — Payment records, communications, decisions
6. **Follow up on unpaid** — Many will forget to pay after approval
7. **Build relationships early** — First interaction sets the tone

---

## 📈 Metrics to Track

**Weekly Review:**
- Total applications received
- Approval rate (% approved vs rejected)
- Average time to approval
- Conversion rate (approved → paid)
- Revenue by tier

**Monthly Review:**
- Which tiers are most popular?
- Which payment methods preferred?
- Common rejection reasons
- Member retention rate

---

## 🔧 Troubleshooting

**Problem:** Application not showing in Sanity  
**Solution:** Check Firestore collection name is `membership_applications`

**Problem:** Can't publish changes  
**Solution:** Ensure all required fields are filled (name, email, tier, status)

**Problem:** Applicant says they can't access member portal after approval  
**Solution:** Need to create their user document in Firestore with `memberId` and `status: 'active'`

**Problem:** Payment recorded but status not updating  
**Solution:** Manually update `paymentStatus` field in Sanity, then sync to user's membership doc

---

## 📞 Support

If anything breaks or you need help:
1. Check this guide first
2. Review Sanity Studio documentation
3. Check Firestore data directly (Firebase Console)
4. Message YBOT for technical assistance

---

**Remember:** You're building an elite network. Quality > Quantity. Every member should add value to the ecosystem.
