# TechWealth MPA (Multi-Page Application)

Converted from React SPA to Next.js App Router with separate pages for each section.

## Structure

```
app/
├── (public)/
│   ├── page.tsx              # Home page
│   ├── events/page.tsx       # Events listing
│   ├── vision/page.tsx       # Mission & Vision
│   ├── register/page.tsx     # Registration/Membership tiers
│   └── login/page.tsx        # VIP member login/dashboard
├── (admin)/
│   └── admin/dashboard/page.tsx  # Admin panel
├── components/
│   ├── Navbar.tsx            # Navigation component
│   ├── Counter.tsx           # Animated counter
│   ├── EventCard.tsx         # Event display card
│   ├── SignUpForm.tsx        # Registration form
│   └── AdminAccess.tsx       # Admin dashboard
├── lib/
│   ├── firebase.ts           # Firebase configuration
│   └── translations.ts       # EN/ZH translations
├── layout.tsx                # Root layout
└── globals.css               # Global styles with Tailwind
```

## Features Preserved

- ✅ All original styling and CSS classes
- ✅ Bilingual support (English/Traditional Chinese)
- ✅ Firebase authentication
- ✅ Membership tier pricing display
- ✅ Event countdown timers
- ✅ Admin dashboard with membership management
- ✅ Responsive design
- ✅ All animations and transitions

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes Required

The following API endpoints need to be implemented:

- `GET /api/events` - Returns list of events
- `POST /api/submit-application` - Handles membership application submission

## Firebase Configuration

Firebase config is located in `lib/firebase.ts`. Update if needed.

## Admin Access

Navigate to `/admin/dashboard` or press Alt+Shift+A on any page.
Default password: `techwealth2026`
