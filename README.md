# Mkutano — Village Savings Group Management System

**Mkutano** is an offline-first, mobile-optimized web application designed for women's village savings and loan associations (VSLAs) across Africa. Built with Next.js 14, TypeScript, and Tailwind CSS.

---

## 🌟 Key Features

### Public Marketing Site
- **Landing Page** with hero, features, how-it-works, testimonials, and FAQs
- **Benefits Pages** for Secretaries, Members, NGOs/MFIs
- **News & Press** section
- **Contact Form** with email capture
- **Multi-step Signup Portal**

### Dashboard (Authenticated)
- **Role-based access control**: Secretary, Member, NGO, Admin
- **Offline-first data capture** with sync status indicator
- **Meeting session manager** with attendance, contributions, loans, repayments
- **Member registry** with wallet balances and savings history
- **Loan tracking** with repayment schedules and overdue alerts
- **Auto-generated financial reports** (PDF export ready)
- **Analytics dashboard** with charts and trends
- **Dispute-prevention confirmation screen** before closing sessions
- **Audit trail logs** for accountability

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

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

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📂 Project Structure

```
MKUTANO APP/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (public)/          # Public marketing pages
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── benefits/      # Benefits for different roles
│   │   │   ├── contact/       # Contact form
│   │   │   ├── faqs/          # FAQ page
│   │   │   └── news/          # News & press
│   │   ├── dashboard/         # Protected dashboard
│   │   │   ├── page.tsx       # Dashboard home
│   │   │   ├── meetings/      # Meeting management
│   │   │   ├── members/       # Member registry
│   │   │   ├── loans/         # Loan tracking
│   │   │   ├── contributions/ # Contribution history
│   │   │   └── reports/       # Financial reports
│   │   ├── login/             # Login page
│   │   ├── signup/            # Multi-step signup
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── public/            # Public site components
│   │   │   ├── PublicNavbar.tsx
│   │   │   ├── PublicFooter.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   └── FAQSection.tsx
│   │   └── ui/                # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       └── Modal.tsx
│   └── lib/
│       ├── types.ts           # TypeScript type definitions
│       ├── mockData.ts        # Mock data for demo
│       └── utils.ts           # Utility functions
├── public/                    # Static assets
├── tailwind.config.ts         # Tailwind CSS configuration
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

---

## 🎨 Design System

### Color Palette
- **Forest Green** (`forest-*`): Primary brand color, trust, finance
- **Earth Orange** (`earth-*`): Secondary, warmth, collaboration
- **Terracotta** (`terra-*`): Accent, alerts, urgency
- **Sand** (`sand-*`): Backgrounds, borders, neutral tones

### Typography
- **Display Font**: Lexend (headings, bold statements)
- **Body Font**: Inter (readable, clean, professional)

### Components
- Tailwind CSS utility classes with custom extensions
- Reusable React components in `src/components/ui/`
- Consistent spacing, shadows, and border-radius

---

## 🔐 Authentication & Roles

### User Roles
1. **Secretary** — Full access to run meetings, manage members, issue loans
2. **Member** — View personal wallet, loan status, meeting history
3. **NGO/MFI Partner** — Dashboard for all partner groups, analytics, reports
4. **Admin** — System-wide management, audit logs, user management

### Demo Credentials (Login Page)
- **Secretary**: `+254 712 345 678` (any password)
- **Admin**: `+254 700 000 001` (any password)

---

## 📊 Data Model (Mock)

### Entities
- **User** — name, phone, email, role, groupId
- **Group** — name, village, district, memberCount, shareValue, currency
- **Member** — userId, groupId, sharesHeld, totalSaved, walletBalance, loans
- **Meeting** — sessionNumber, date, venue, status, totals, syncStatus
- **Contribution** — meetingId, memberId, shares, amount, type, confirmed
- **Loan** — memberId, amount, interestRate, purpose, dueDate, status, balance
- **Repayment** — loanId, principal, interest, total
- **AuditLog** — actorId, action, entity, entityId, timestamp
- **Notification** — userId, title, message, type, isRead

(See `src/lib/types.ts` for full definitions)

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **PDF Generation**: jspdf, jspdf-autotable (ready for integration)
- **State**: React hooks (no external state library yet)
- **Deployment**: Vercel-ready

---

## 🌍 Offline-First Strategy

Mkutano is designed to work seamlessly without internet:
- **Local data capture** using IndexedDB/localStorage (to be implemented)
- **Sync status indicator** (Synced, Pending, Offline)
- **Background sync** when connection is restored
- **Conflict resolution** for simultaneous edits

(Current version uses mock data; backend integration pending)

---

## 📝 Roadmap

### Phase 1: MVP (Current)
- ✅ Full UI/UX design system
- ✅ Public marketing site
- ✅ Authentication pages
- ✅ Dashboard with all core pages
- ✅ Meeting flow (attendance → contributions → review)
- ⏳ Backend API integration

### Phase 2: Production
- [ ] Real authentication (NextAuth.js / Clerk)
- [ ] PostgreSQL / Supabase backend
- [ ] Offline sync with service workers
- [ ] PDF generation service
- [ ] SMS/Email notifications
- [ ] Multi-language support (Swahili, Luganda, Twi)

### Phase 3: Scale
- [ ] Mobile app (React Native / PWA)
- [ ] NGO partner API
- [ ] Advanced analytics
- [ ] AI-powered insights
- [ ] Bulk group onboarding tools

---

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

(No tests written yet — contributions welcome!)

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📧 Contact

- **Email**: hello@mkutano.app
- **Phone**: +254 712 345 678
- **Office**: iHub Nairobi, Kenya

Built with ❤️ for women's savings groups across Africa.
