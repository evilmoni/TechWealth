# TechWealth MPA — Deployment Guide

**Status:** ✅ Build Passing  
**Last Build:** 2026-06-22  
**Framework:** Next.js 16.2.9 (Turbopack)  
**Prisma:** v5.22.0

---

## 📦 **Current Build Status**

```
✓ Compiled successfully
✓ TypeScript validation passed
✓ Static pages generated (6 pages)
✓ Dynamic routes configured (4 routes)

Route (app)
┌ ○ /                    (Static - Home page)
├ ○ /_not-found          (Static - 404 page)
├ ƒ /admin/applications  (Dynamic - Admin panel, server-rendered)
├ ƒ /api/submit-application (Dynamic - API endpoint)
├ ƒ /dashboard           (Dynamic - Member dashboard, auth required)
├ ○ /events              (Static - Events listing)
├ ○ /login               (Static - Login form)
├ ○ /register            (Static - Membership application)
└ ○ /vision              (Static - Mission & vision)

○  (Static)   - Prerendered as static content
ƒ  (Dynamic)  - Server-rendered on demand (requires Node.js runtime)
```

---

## 🚀 **Deployment Steps**

### **1. Push to GitHub**

```bash
cd /root/.openclaw/workspace/techwealth-mpa

# Initialize remote (choose your preferred repo name)
git remote add origin https://github.com/YBOT8AI/TechWealth-MPA.git
# OR
git remote add origin https://github.com/evilmoni/TechWealth-MPA.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### **2. Deploy to Vercel**

**Option A: Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Option B: Vercel Dashboard**
1. Go to https://vercel.com/new
2. Import GitHub repository: `YBOT8AI/TechWealth-MPA`
3. Configure project:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
4. Add environment variables (see below)
5. Click **Deploy**

### **3. Environment Variables (Production)**

Add these to your Vercel project settings:

```bash
# Database (PostgreSQL via Supabase or other provider)
DATABASE_URL="postgresql://user:password@host:5432/techwealth?schema=public"

# NextAuth.js
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="https://techwealth-mpa.vercel.app"

# Upstash Redis (for rate limiting - optional for staging)
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## 🗄️ **Database Setup (PostgreSQL)**

### **Option A: Supabase (Recommended)**

1. Go to https://supabase.com
2. Create new project (free tier available)
3. Get connection string from **Settings → Database**
4. Format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
5. Add to `DATABASE_URL` in Vercel

### **Option B: Self-Hosted PostgreSQL**

1. Set up PostgreSQL server (AWS RDS, DigitalOcean, etc.)
2. Create database: `CREATE DATABASE techwealth;`
3. Get connection string
4. Add to `DATABASE_URL` in Vercel

### **Run Migrations**

After deploying to Vercel, run Prisma migrations:

```bash
# Install Vercel CLI locally
npm install -g vercel

# Link to your project
vercel link

# Pull environment variables from Vercel
vercel env pull

# Run migrations (uses production DATABASE_URL)
npx prisma migrate deploy
```

---

## 🔒 **Security Checklist (Pre-Production)**

Before going live, verify:

- [ ] **Environment Variables:** All secrets set in Vercel (not committed to Git)
- [ ] **HTTPS:** Enforced by Vercel automatically
- [ ] **HTTP-only Cookies:** Configured in `src/lib/auth.ts`
- [ ] **CSP Headers:** Configured in `next.config.js`
- [ ] **Rate Limiting:** Upstash Redis connected (optional for staging)
- [ ] **Database Access:** Restricted to Vercel IP ranges only
- [ ] **Admin Accounts:** Create initial admin user manually in database
- [ ] **Error Tracking:** Sentry or similar configured (optional)

---

## 🧪 **Testing Deployment**

### **Staging Environment**

1. Deploy to a separate Vercel project (staging)
2. Use separate database (Supabase free tier)
3. Test all flows:
   - User registration
   - Application submission
   - Admin approval workflow
   - Member login/logout
   - RBAC enforcement (try accessing `/admin` without admin role)

### **Production Checklist**

- [ ] Registration flow works end-to-end
- [ ] Application appears in admin panel
- [ ] Admin can approve/reject applications
- [ ] Approved users can access member dashboard
- [ ] Non-members redirected to login on `/dashboard`
- [ ] Non-admins redirected on `/admin/*` routes
- [ ] Logout clears session properly
- [ ] Mobile responsive design verified
- [ ] Performance acceptable (<3s page load)

---

## 📊 **Post-Deployment Monitoring**

### **Vercel Analytics**

Enable in Vercel dashboard:
- **Web Vitals:** Core Web Vitals tracking
- **Speed Insights:** Real-user performance metrics
- **Analytics:** Page views, unique visitors (optional)

### **Error Tracking**

Recommended: Set up Sentry

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### **Database Monitoring**

- **Supabase:** Built-in query performance monitoring
- **Prisma:** Enable query logging in development only

---

## 🔄 **Update Workflow**

After initial deployment:

```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push origin main

# Vercel auto-deploys on push to main branch
# Check deployment status at: https://vercel.com/dashboard
```

---

## 🆘 **Troubleshooting**

### **Build Fails**

```bash
# Check build logs in Vercel dashboard
# Test build locally:
npm run build

# Common issues:
# - TypeScript errors → fix type issues
# - Missing env vars → add to .env.local and test locally first
# - Prisma schema errors → run npx prisma validate
```

### **Runtime Errors**

```bash
# Check Vercel function logs
vercel logs [deployment-url]

# Common issues:
# - DATABASE_URL not set → verify env vars in Vercel
# - Prisma client not generated → add prisma generate to build command
# - Auth not working → verify NEXTAUTH_SECRET and NEXTAUTH_URL
```

### **Database Connection Issues**

```bash
# Test connection locally with production URL
npx prisma db pull

# If fails:
# 1. Check DATABASE_URL format
# 2. Verify database allows connections from Vercel IPs
# 3. For Supabase: enable connection pooling
```

---

## 📝 **Next Steps After Deployment**

1. **Create Initial Admin User:**
   ```bash
   # Connect to database directly (e.g., via Supabase SQL editor)
   INSERT INTO "User" (id, email, "passwordHash", role, name)
   VALUES ('admin-id', 'admin@techwealth.com', 'bcrypt-hash', 'ADMIN', 'Admin');
   ```

2. **Test Production Flow:**
   - Submit test application via `/register`
   - Approve via `/admin/applications`
   - Login as approved member
   - Verify dashboard access

3. **Monitor First Week:**
   - Watch error logs daily
   - Track application submissions
   - Monitor database query performance

---

**Owner:** TOBY NG  
**Lead Developer:** YBOT  
**Deployment Target:** Vercel  
**Database:** PostgreSQL (Supabase recommended)  
**Status:** Ready for staging deployment
