# Mkutano — Comprehensive Application Documentation

**Version:** 0.1.0  
**Last Updated:** February 22, 2026  
**Deployment:** Vercel (Auto-deployed from GitHub)  
**Repository:** dig-software/MKUTANOAPP

---

## Table of Contents

1. [Application Overview](#application-overview)
2. [Core Features](#core-features)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [User Roles & Permissions](#user-roles--permissions)
6. [Data Model](#data-model)
7. [Application Structure](#application-structure)
8. [Key Features by Module](#key-features-by-module)
9. [Enterprise Edition](#enterprise-edition)
10. [Authentication & Security](#authentication--security)
11. [Offline-First & PWA](#offline-first--pwa)
12. [Getting Started](#getting-started)
13. [Demo Accounts](#demo-accounts)
14. [API & Integration](#api--integration)
15. [Deployment & Versioning](#deployment--versioning)

---

## Application Overview

**Mkutano** (meaning "gathering" or "meeting" in Swahili) is an offline-first, mobile-optimized web application designed for women's village savings and loan associations (VSLAs) across Africa.

### Core Mission
Enable transparent financial management, accountability, and impact tracking for savings groups through a comprehensive yet intuitive platform that works offline, scales to 1000+ groups, and provides insights for NGO/MFI partners.

### Key Statistics
- **33 Routes** in production application
- **4 User Roles** (Secretary, Member, NGO, MFI, Admin)
- **8+ Dashboard Modules** for member/secretary management
- **100% Progressive Web App** (installable on mobile & desktop)
- **Offline-First Architecture** with service worker sync

### Primary Users
1. **Village Savings Secretaries** - Manage group meetings and finances
2. **Group Members** - View contributions, loans, and savings
3. **NGO Staff** - Track loan impact across funded groups
4. **MFI Managers** - Monitor lending portfolio performance
5. **System Administrators** - Oversee multi-group operations

---

## Core Features

### Public Marketing Site
- **Landing Page** with hero section, features, how-it-works flow, testimonials
- **Marketing Pages**: Benefits for Secretaries/Members/NGOs/MFIs
- **News & Press** section for organizational updates
- **Contact Form** with email capture for inquiries
- **Multi-step Signup Portal** with phone verification
- **FAQ Section** addressing common questions
- **Responsive Design** optimized for mobile-first experience

### Community Dashboard (Savings Groups)
- **Meeting Management**: Create, track, and close savings group meetings
- **Member Registry**: Complete member profiles with wallet balances
- **Contribution Tracking**: Record contributions, social fund, fines
- **Loan Management**: Issue loans with repayment schedules
- **Repayment Recording**: Track repayments with interest calculations
- **Member Wallets**: Personal savings balance and transaction history
- **Financial Reports**: Auto-generated PDFs with group summaries
- **Audit Trail**: Complete accountability log of all transactions

### Enterprise Edition (NGO/MFI Platform)
- **NGO Dashboard**: Program overview, budget tracking, partner MFI allocation
- **MFI Dashboard**: Lending portfolio KPIs, group performance monitoring
- **Impact Tracking**: Repayment metrics, borrower metrics, trend analysis
- **Loan Portfolio View**: Complete funding flow from NGO → MFI → Groups
- **Performance Analytics**: Repayment rates, overdue tracking, health status
- **Quick Navigation**: One-click access to funded groups, impact reports, loan details

### Offline-First Capabilities
- **Service Worker Caching**: Automatic offline data capture
- **Sync Status Display**: Visual indicator of synced/pending data
- **Demo Mode**: Use app without authentication
- **Local Storage**: Automatic fallback for internet loss
- **Background Sync**: Queue updates for when connection restored

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│               CLIENT (Next.js 14 App Router)                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐      ┌──────────────────────────────┐ │
│  │   UI Components  │      │    State Management          │ │
│  │  - Public Pages  │◄────►│  - UserContext (React)       │ │
│  │  - Dashboard     │      │  - useOffline Hook           │ │
│  │  - Forms         │      │  - localStorage Fallback     │ │
│  └──────────────────┘      └──────────────────────────────┘ │
│         │                              │                     │
│         └──────────────┬───────────────┘                     │
│                        ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │         Service Worker (public/sw.js)                   │ │
│  │  - Network-first for pages                              │ │
│  │  - Cache-first for assets                               │ │
│  │  - Offline data queuing                                 │ │
│  └─────────────────────────────────────────────────────────┘ │
│         │                                                    │
└─────────┼────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│            BACKEND (Supabase PostgreSQL + Auth)             │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   PostgreSQL   │  │  Supabase Auth  │  │   RLS Rules  │ │
│  │   Database     │  │  (Phone + Email)│  │ (Row-level   │ │
│  │  - 12 Tables   │  │                 │  │  Security)   │ │
│  │  - Complete    │  │  - JWT tokens   │  │              │ │
│  │    Schema      │  │  - Sessions     │  │              │ │
│  └────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
          ▲
          │
┌─────────┴─────────────────────────────────────────────────┐
│           DEPLOYMENT (Vercel Auto-Deploy)                │
│  - GitHub push triggers automatic build & deploy        │
│  - Environment variables for Supabase credentials       │
│  - Production URL: mkutano-app.vercel.app               │
└────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
USER ACTION (Contribution recorded)
        │
        ▼
┌───────────────────────────────────────┐
│  React Component (meetings/new/page)  │
│  - Form input & validation            │
│  - API call preparation               │
└──────────────────┬────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   ONLINE            OFFLINE (No connection)
        │                     │
        ▼                     ▼
  Supabase API        Service Worker
     │                 + localStorage
     │                     │
     ▼                     ▼
PostgreSQL DB      Queued for sync
     │                     │
     ▼                     ▼
RLS Security Check   Attempt retry
     │                     │
     ▼                     ▼
  Audit Log          Restore when online
     │
     ▼
Success Response
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14.2.20 (React 18, Server & Client Components)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.1 with PostCSS
- **UI Components**: Custom components + Lucide React icons
- **State Management**: React Context API (UserContext)
- **Charts**: Recharts 2.12.7
- **PDF Export**: jsPDF 2.5.1 + jsPDF-AutoTable 3.8.2

### Backend & Database
- **Backend-as-a-Service**: Supabase (PostgreSQL 14+)
- **Authentication**: Supabase Auth (Phone + Email)
- **Database**: 12 PostgreSQL tables with RLS policies
- **Security**: Row-Level Security (RLS) policies per user role
- **Hosting**: Vercel (auto-deploys from GitHub)

### PWA & Offline
- **Service Worker**: Custom public/sw.js
- **Web Manifest**: public/manifest.json
- **Offline Detection**: Custom useOffline hook
- **Caching Strategy**: Network-first (pages), Cache-first (assets)
- **Background Sync**: Event-based sync manager

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode
- **Version Control**: Git/GitHub (dig-software/MKUTANOAPP)
- **CI/CD**: Vercel auto-deployment

---

## User Roles & Permissions

### 1. Secretary Role
**Primary Responsibility**: Manage savings group meetings and member finances

**Permissions**:
- ✅ Create and close meetings
- ✅ Record contributions and loans
- ✅ View all group members and their wallets
- ✅ Edit member details (for their group only)
- ✅ View audit logs (their group only)
- ✅ Generate reports (their group)
- ✅ Manage group settings

**Dashboard Pages**:
- `/dashboard` - Home (meeting overview)
- `/dashboard/meetings` - Manage meetings
- `/dashboard/meetings/new` - Create meeting
- `/dashboard/members` - Member registry
- `/dashboard/contributions` - Contribution history
- `/dashboard/loans` - Loan management
- `/dashboard/wallet` - Group wallet
- `/dashboard/settings` - Group settings

**Demo Account**: Phone: `+254700000001`

### 2. Member Role
**Primary Responsibility**: Track personal savings and loans

**Permissions**:
- ✅ View personal wallet balance
- ✅ View personal contribution history
- ✅ View personal loans and repayment schedule
- ✅ View meeting attendance history
- ❌ Cannot create meetings
- ❌ Cannot edit other members' data

**Dashboard Pages**:
- `/dashboard` - Home (personal summary)
- `/dashboard/my-contributions` - Personal contribution history
- `/dashboard/my-loans` - Personal loans

**Demo Account**: Phone: `+254700000003`

### 3. NGO Role
**Primary Responsibility**: Track loan impact across funded groups

**Permissions**:
- ✅ View all funded groups and program details
- ✅ Monitor repayment metrics and performance
- ✅ Access impact analytics and trend reports
- ✅ View complete loan portfolio across groups
- ✅ Export reports (future)
- ❌ Cannot modify group data
- ❌ Cannot issue loans directly

**Dashboard Pages**:
- `/dashboard/ngo` - Program overview & budget tracking
- `/dashboard/ngo/groups` - All funded groups
- `/dashboard/ngo/groups/[groupId]` - Group details
- `/dashboard/ngo/impact` - Impact analytics
- `/dashboard/ngo/loans` - Complete loan portfolio

**Login Path**: `/enterprise/ngo-login`
**Demo Account**: "Maendeleo Foundation" (Ngĩũrĩtũ)

### 4. MFI (Microfinance Institution) Role
**Primary Responsibility**: Monitor lending portfolio and disbursement

**Permissions**:
- ✅ View lending portfolio across groups
- ✅ Track disbursements and repayments
- ✅ Monitor group performance metrics
- ✅ View repayment rates and outstanding balances
- ✅ Access group transaction history
- ❌ Cannot modify loan amounts after disbursement
- ❌ Cannot edit group details

**Dashboard Pages**:
- `/dashboard/mfi` - Lending portfolio overview
- `/dashboard/mfi/groups` - Active lending groups
- `/dashboard/mfi/reports` - Performance reports
- `/dashboard/mfi/users` - MFI staff management

**Login Path**: `/enterprise/mfi-login`
**Demo Account**: "Ulinzi MFI for MSMEs"

### 5. Admin Role
**Primary Responsibility**: System-wide administration and oversight

**Permissions**:
- ✅ Manage all groups and members
- ✅ Reset user passwords
- ✅ View all audit logs
- ✅ System configuration
- ✅ User role assignment
- ✅ View all reports across system
- ✅ Manage system settings

**Dashboard Pages**:
- `/dashboard/system` - System settings
- `/dashboard/users` - All users
- `/dashboard/audit` - Complete audit trail

---

## Data Model

### Core Entities

#### 1. User
```typescript
interface User {
  id: string;                    // UUID primary key
  name: string;                  // Full name
  phone: string;                 // Unique, for authentication
  email?: string;                // Optional email
  role: UserRole;                // "secretary" | "member" | "ngo" | "admin"
  groupId?: string;              // Group if secretary/member
  memberId?: string;             // Member ID if role=member
  avatarInitials: string;        // For avatar display
  joinedAt: string;              // ISO timestamp
  isActive: boolean;             // Account status
}
```

#### 2. Group (Savings Group/VSLA)
```typescript
interface Group {
  id: string;                    // UUID primary key
  name: string;                  // Group name (e.g., "Maendeleo wa Wanawake")
  village: string;               // Village/location
  district: string;              // District
  country: string;               // Country (default: "Kenya")
  secretaryId: string;           // Group secretary UUID
  secretaryName: string;         // Secretary name (cached)
  secretaryPhone: string;        // Secretary phone (cached)
  memberCount: number;           // Total active members
  createdAt: string;             // ISO timestamp
  cycleStartDate: string;        // Savings cycle start (ISO date)
  cycleEndDate: string;          // Savings cycle end (ISO date)
  currency: string;              // Currency code (default: "KES")
  joinCode: string;              // Join code for new members
  isActive: boolean;             // Group status
}
```

#### 3. Member
```typescript
interface Member {
  id: string;                    // UUID primary key
  groupId: string;               // Associated group
  userId: string;                // Associated user
  name: string;                  // Member name
  phone: string;                 // Contact phone
  nationalId?: string;           // Optional national ID
  totalSaved: number;            // Cumulative savings
  totalLoaned: number;           // Total borrowed
  totalRepaid: number;           // Total repaid
  walletBalance: number;         // Current balance
  joinedAt: string;              // ISO timestamp
  status: MemberStatus;          // "active" | "inactive" | "suspended"
}
```

#### 4. Meeting
```typescript
interface Meeting {
  id: string;                    // UUID primary key
  groupId: string;               // Associated group
  sessionNumber: number;         // Sequential session #
  date: string;                  // Meeting date (ISO)
  venue: string;                 // Meeting location
  facilitatorId: string;         // Facilitator UUID
  status: MeetingStatus;         // "draft" | "open" | "confirmed" | "closed"
  totalContributions: number;    // Sum of contributions
  totalLoansIssued: number;      // Sum of new loans
  totalRepayments: number;       // Sum of repayments
  attendanceCount: number;       // Members present
  notes?: string;                // Optional notes
  createdAt: string;             // Created timestamp
  closedAt?: string;             // Closed timestamp
  syncStatus: SyncStatus;        // "synced" | "pending" | "offline"
}
```

#### 5. Contribution
```typescript
interface Contribution {
  id: string;                    // UUID primary key
  meetingId: string;             // Associated meeting
  groupId: string;               // Associated group
  memberId: string;              // Contributing member
  memberName: string;            // Member name (cached)
  amount: number;                // Contribution amount
  type: ContributionType;        // "contribution" | "social_fund" | "fine"
  recordedAt: string;            // ISO timestamp
  recordedBy: string;            // Secretary UUID
  confirmed: boolean;            // Confirmation status
}
```

#### 6. Loan
```typescript
interface Loan {
  id: string;                    // UUID primary key
  meetingId: string;             // Meeting issued in
  groupId: string;               // Associated group
  memberId: string;              // Borrower UUID
  memberName: string;            // Borrower name (cached)
  amount: number;                // Principal amount
  interestRate: number;          // Interest % (e.g., 10 for 10%)
  purpose: string;               // Loan purpose
  issuedAt: string;              // ISO timestamp
  dueDate: string;               // ISO date when due
  status: LoanStatus;            // "active" | "repaid" | "overdue" | "written_off"
  totalRepaid: number;           // Amount repaid so far
  balance: number;               // Remaining balance
  issuedBy: string;              // Secretary UUID
}
```

#### 7. Repayment
```typescript
interface Repayment {
  id: string;                    // UUID primary key
  loanId: string;                // Associated loan
  meetingId: string;             // Meeting recorded in
  groupId: string;               // Associated group
  memberId: string;              // Paying member
  memberName: string;            // Member name (cached)
  principal: number;             // Principal portion
  interest: number;              // Interest portion
  total: number;                 // Total repaid
  recordedAt: string;            // ISO timestamp
  recordedBy: string;            // Secretary UUID
}
```

#### 8. AuditLog
```typescript
interface AuditLog {
  id: string;                    // UUID primary key
  groupId: string;               // Associated group
  actorId: string;               // User performing action
  actorName: string;             // User name (cached)
  action: string;                // Action type (e.g., "created", "updated")
  entity: string;                // Entity type (e.g., "contribution", "loan")
  entityId: string;              // Entity UUID
  details: string;               // Detailed description
  timestamp: string;             // ISO timestamp
  ipAddress?: string;            // IP address if available
}
```

#### 9. NGO Program (Enterprise)
```typescript
interface NgoProgram {
  id: string;                    // UUID primary key
  name: string;                  // Program name
  budget: number;                // Total budget
  allocated: number;             // Allocated to MFIs
  fundedGroups: { [mfiId: string]: number }; // Fund allocation by MFI
  impactMetrics: {
    activeBorrowers: number;
    repaymentRate: number;
    outstandingBalance: number;
  };
}
```

#### 10. MFI LendingPortfolio (Enterprise)
```typescript
interface MfiLendingPortfolio {
  totalDisbursed: number;        // Total funding disbursed
  totalRepaid: number;           // Total repayments received
  outstanding: number;           // Outstanding balance
  lendingGroups: LendingGroup[]; // Active group loans
  repaymentRate: number;         // Overall repayment %
  performanceMetrics: {
    groupsActive: number;
    totalBorrowers: number;
    avgLoanSize: number;
  };
}
```

### Database Relationships

```
users (1) ──── (many) members
  │                      │
  │                      └─ (1) groups
  │                             │
  │                             ├─ (many) meetings
  │                             │           │
  │                             │           └─ (many) contributions
  │                             │           └─ (many) loans
  │                             │
  │                             └─ (many) audit_logs
  │
  └─ (1) groups (if secretary)

loans ────── (many) repayments (payment_logs)

ngos (1) ──── (many) groups (ngo_id foreign key)
  │
  └─ (many) mfi_partnerships
        │
        └─ (many) lending_groups

audit_logs track all changes to provide complete accountability
```

---

## Application Structure

### Directory Layout

```
MKUTANO APP/
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                 # Public marketing pages (grouped layout)
│   │   │   ├── layout.tsx            # Public layout with navbar/footer
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── benefits/
│   │   │   │   └── page.tsx          # Benefits page
│   │   │   ├── contact/
│   │   │   │   └── page.tsx          # Contact form page
│   │   │   ├── faqs/
│   │   │   │   └── page.tsx          # FAQ page
│   │   │   └── news/
│   │   │       └── page.tsx          # News/press page
│   │   │
│   │   ├── dashboard/                # Protected dashboard (with layout)
│   │   │   ├── layout.tsx            # Dashboard shell with sidebar
│   │   │   ├── page.tsx              # Dashboard home (role-specific)
│   │   │   │
│   │   │   ├── meetings/             # Meeting management
│   │   │   │   ├── page.tsx          # Meetings list
│   │   │   │   └── new/
│   │   │   │       └── page.tsx      # Create new meeting
│   │   │   │
│   │   │   ├── members/              # Member registry
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── contributions/        # Contribution history
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── my-contributions/     # Personal contributions
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── loans/                # Group loan management
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── my-loans/             # Personal loans
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── meeting-history/      # Past meetings
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── wallet/               # Group wallet
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── ngo/                  # NGO dashboard (role-specific)
│   │   │   │   ├── page.tsx          # NGO dashboard home
│   │   │   │   ├── groups/
│   │   │   │   │   ├── page.tsx      # Funded groups list
│   │   │   │   │   └── [groupId]/
│   │   │   │   │       └── page.tsx  # Group details
│   │   │   │   ├── impact/
│   │   │   │   │   └── page.tsx      # Impact analytics
│   │   │   │   └── loans/
│   │   │   │       └── page.tsx      # Loan portfolio
│   │   │   │
│   │   │   ├── mfi/                  # MFI dashboard (role-specific)
│   │   │   │   ├── page.tsx          # MFI dashboard home
│   │   │   │   ├── groups/ (future)
│   │   │   │   └── reports/ (future)
│   │   │   │
│   │   │   ├── reports/              # General reports
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── audit/                # Audit log viewer
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── all-groups/           # Admin: all groups listed
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── users/                # Admin: user management
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── system/               # Admin: system settings
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── settings/             # Group settings
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── test/                 # Testing page
│   │   │       └── page.tsx
│   │   │
│   │   ├── enterprise/               # Enterprise Edition (NGO/MFI platform)
│   │   │   ├── page.tsx              # Enterprise landing page
│   │   │   ├── ngo-login/
│   │   │   │   └── page.tsx          # NGO login page
│   │   │   └── mfi-login/
│   │   │       └── page.tsx          # MFI login page
│   │   │
│   │   ├── login/                    # Authentication
│   │   │   └── page.tsx              # Unified login page
│   │   │
│   │   ├── signup/                   # Signup
│   │   │   └── page.tsx              # Multi-step signup
│   │   │
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── test/
│   │       └── page.tsx              # Developer testing page
│   │
│   ├── components/
│   │   ├── public/                   # Public site components
│   │   │   ├── PublicNavbar.tsx      # Navigation with enterprise link
│   │   │   ├── PublicFooter.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   └── FAQSection.tsx
│   │   │
│   │   └── ui/                       # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── Modal.tsx
│   │       ├── PWAInstall.tsx        # PWA install prompt
│   │       └── SyncStatus.tsx        # Offline sync indicator
│   │
│   └── lib/
│       ├── types.ts                  # TypeScript interface definitions
│       ├── mockData.ts               # Demo data & demo credentials
│       ├── accountManager.ts         # User account logic
│       ├── supabase.ts               # Supabase client initialization
│       ├── supabaseService.ts        # Supabase API calls
│       ├── syncManager.ts            # Offline sync manager
│       ├── pwa.ts                    # PWA utilities
│       ├── demoMode.ts               # Demo mode helper
│       ├── useOffline.ts             # Custom hook for offline detection
│       ├── UserContext.tsx           # Global user state
│       └── utils.ts                  # Utility functions
│
├── public/                           # Static assets
│   ├── sw.js                         # Service worker
│   ├── manifest.json                 # PWA web manifest
│   ├── site.webmanifest              # Alternative manifest format
│   └── icons/                        # PWA app icons (to be added)
│
├── Configuration Files
│   ├── package.json                  # Dependencies & scripts
│   ├── tsconfig.json                 # TypeScript config
│   ├── tailwind.config.ts            # Tailwind CSS config
│   ├── postcss.config.js             # PostCSS plugins
│   ├── next.config.mjs               # Next.js config
│   ├── .eslintrc.json                # ESLint rules
│   └── next-env.d.ts                 # Auto-generated types
│
└── Documentation Files
    ├── README.md                     # Quick start guide
    ├── DATABASE_SCHEMA.md            # Complete DB schema
    ├── SUPABASE_SETUP.md             # Supabase configuration
    ├── RLS_POLICIES.sql              # Row-level security rules
    ├── SQL_MIGRATIONS.sql            # Database migrations
    ├── PWA_SETUP.md                  # PWA implementation details
    ├── NGO_PORTAL_DOCUMENTATION.md   # NGO/MFI features
    ├── COMPREHENSIVE_DOCUMENTATION.md # This file
    └── [PWA documentation files]
```

---

## Key Features by Module

### 1. Authentication & User Management

#### Login Page (`/login`)
- **Phone-based Authentication**: Primary login method
- **Email Authentication**: Alternative login method
- **Demo Mode**: Built-in demo accounts for testing
- **Enterprise Quick Links**: Shortcuts to NGO/MFI portals
- **Phone/Email Toggle**: Easy switching between auth methods

#### Signup Page (`/signup`)
- **Multi-step Signup**: Form broken into manageable steps
- **Phone Verification**: Phone-based account creation
- **Group Joining**: Create new group or join existing
- **Role Selection**: Secretary or Member registration
- **Data Validation**: Real-time form validation

#### Session Management
- **Supabase Auth**: Secure JWT-based authentication
- **Demo Logins**: Work offline without authentication
- **Session Persistence**: Auto-restore user session
- **Proper Logout**: Clear session and localStorage on logout
- **Role-Based Redirects**: Direct users to appropriate dashboard

---

### 2. Meeting Management (`/dashboard/meetings`)

#### Create Meeting (`/dashboard/meetings/new`)
**Purpose**: Record a complete savings group meeting session

**Key Steps**:
1. Select meeting date and venue
2. Record member attendance (with checkbox)
3. Record contributions (member → amount → type)
4. Record new loans (member → amount → rate → purpose → due date)
5. Record repayments (member → loan → amount)
6. Add meeting notes
7. **Confirm and Close**: Final audit before sending to database

**Features**:
- Real-time calculations (totals update as data entered)
- Offline-capable: Data saved locally if offline
- Undo functionality for recent entries
- Automatic confirmation prompts before closing
- Sync status indicator shows pending/offline state

#### Meeting List Page
- View all past meetings with summary stats
- Filter by date range or status
- Sort by session number, date, or attendance
- Quick view of contributions/loans/repayments per meeting
- Export capabilities (future)

---

### 3. Member Management (`/dashboard/members`)

#### Member Registry
- **Complete Member List**: All group members with status
- **Member Profiles**: Name, phone, national ID, join date
- **Wallet Display**: Current balance, total saved, total loaned
- **Loan Summary**: Active loans and repayment status
- **Member Status**: Active/Inactive/Suspended indicators
- **Quick Actions**: Edit details, view loans, view contributions

#### Member Details Card
- Full profile information
- Savings journey (total saved → total loaned → total repaid)
- Current wallet balance
- Active loans with repayment progress
- Recent contributions
- Member activity timeline

---

### 4. Financial Tracking

#### Contributions (`/dashboard/contributions`)
- **All Contributions**: Group-wide contribution history
- **Type Breakdown**: Contribution vs Social Fund vs Fines
- **Filtering**: By member, meeting, type, date range
- **Sorting Options**: By amount, date, member
- **Detailed View**: Meeting context for each contribution

#### My Contributions (`/dashboard/my-contributions` - Member only)
- **Personal History**: User's own contributions
- **Running Balance**: Cumulative savings over time
- **Status Column**: Confirmed vs Pending
- **Download**: Export to CSV (future)

#### Loans (`/dashboard/loans` - Group view)
- **All Loans**: Outstanding and repaid loans
- **Status Tracking**: Active, Repaid, Overdue, Written off
- **Repayment Progress**: Visual progress bars
- **Overdue Alerts**: Highlighted overdue loans
- **Interest Calculation**: Shows principal vs interest

#### My Loans (`/dashboard/my-loans` - Member only)
- **Personal Loans**: User's own loan portfolio
- **Repayment Schedule**: Dates and expected amounts
- **Status**: Current repayment status
- **Remaining Balance**: Amount still owed
- **Next Payment**: Due date and amount

#### Wallet (`/dashboard/wallet`)
- **Balance Overview**: Current available balance
- **Summary Stats**: Total saved, total loaned, total repaid
- **Transaction History**: All wallet movements
- **Funding Source**: Where balance comes from (contributions, repayments)

---

### 5. Reporting & Analytics (`/dashboard/reports`)

#### Auto-Generated Reports
- **Meeting Summary**: Per-meeting financial snapshot
- **Monthly Report**: Monthly savings, loans, repayments
- **Annual Report**: Yearly cycle summary
- **Member Statement**: Individual member account statement

#### PDF Export
- Formatted with group details, signatures, audit trail
- Ready for offline printing
- Suitable for member distribution

#### Dashboard Analytics
- 6-month trend visualization
- Open loans vs closed loans
- Member wallet distribution
- Top performers by savings/repayment

---

### 6. Audit Trail (`/dashboard/audit`)

#### Complete Accountability Log
- **Action Tracking**: Every transaction logged
- **Actor Identification**: Who made the change
- **Entity Changes**: What was modified
- **Timestamps**: Exact time of change
- **Details**: Full description of action

#### Audit Information Recorded
- Meeting created/closed
- Contribution recorded
- Loan issued
- Repayment recorded
- Member added/removed
- Settings changed

#### Filtering & Search
- By action type
- By member/actor
- By date range
- By entity type

---

### 7. Settings (`/dashboard/settings`)

#### Group Configuration
- **Group Name & Details**: Edit group information
- **Secretary Contact**: Update secretary details
- **Meeting Frequency**: Set meeting schedule
- **Contribution Amounts**: Minimum/maximum ranges
- **Loan Limits**: Maximum loan amount
- **Interest Rates**: Default rate for new loans

#### Member Management
- **Add Members**: Invite new members
- **Remove Members**: Deactivate members
- **Edit Profiles**: Update member information
- **Reset Passwords**: Help members regain access

---

## Enterprise Edition

### Overview
The Enterprise Edition provides a dedicated platform for NGOs and Microfinance Institutions to track loan impact, monitor repayment performance, and manage funding allocations across multiple savings groups.

### NGO Portal (`/enterprise/ngo-login`)

**User Role**: NGO Program Manager

**Key Dashboard** (`/dashboard/ngo`):
- **Program Overview**:
  - Program name and budget (e.g., "Women Entrepreneurs Fund 2026")
  - Total budget vs allocated amount
  - Budget allocation progress bar (70% allocated to MFIs)
  
- **Funding Allocation**: Shows MFI partners and their fund allocations
  - MFI name and total allocated
  - Number of groups per MFI
  - Funding status (% distributed)
  
- **Impact Metrics**:
  - Active borrowers count
  - Overall repayment rate percentage
  - Outstanding balance tracking
  
- **Quick Navigation**: Links to Groups, Impact, and Loans pages

#### Funded Groups (`/dashboard/ngo/groups`)
- **Overview Cards**: Each group card shows:
  - Group name and location
  - Member count
  - Total loans issued
  - Repayment percentage
  - Overall health status (Healthy/Moderate/At Risk)
  
- **Sortable List**: By name, location, repayment rate
- **Color-Coded Health**: Visual status indicators

#### Group Details (`/dashboard/ngo/groups/[groupId]`)
- **Group Information**: Full group profile
- **Contact Details**: Secretary name, phone, location
- **Financial Metrics**:
  - Funded amount
  - Funds repaid
  - Outstanding balance
  - Repayment rate
  
- **Member Loan Details**: Table of all member loans with:
  - Member name
  - Loan amount
  - Loan status
  - Repayment progress
  - Overdue alerts

#### Impact Analytics (`/dashboard/ngo/impact`)
- **Repayment Trend**: 6-month trend visualization
- **Loan Status Breakdown**: Fully Repaid / On Schedule / Overdue
- **Group Performance**: Comparison of all groups
- **Key Insights**: Positive trends and recommendations

#### Loan Portfolio (`/dashboard/ngo/loans`)
- **Complete Portfolio**: All loans across all funded groups
- **Filtering Options**: By status, group, date range
- **Detailed View**: Member, group, amount, repayment, balance
- **Status Indicators**: Visual status tags
- **Overdue Alerts**: Highlighted overdue loans

### MFI Portal (`/enterprise/mfi-login`)

**User Role**: MFI Lending Manager

**Key Dashboard** (`/dashboard/mfi`):
- **Lending Portfolio KPIs**:
  - Total Disbursed: Sum of all loans issued
  - Total Repaid: Sum of all repayments received
  - Outstanding: Total remaining balance
  - Repayment Rate: Percentage of due loans repaid
  - Groups Active: Number of partner groups
  
- **Active Lending Groups Table**:
  - Group name
  - Funding amount (amount lent to group)
  - Repayments received
  - Outstanding balance
  - Repayment percentage
  - Performance status

#### MFI Reports (Future)
- Detailed lending performance analysis
- Disbursement schedules
- Repayment forecasts

### Enterprise Landing Page (`/enterprise`)
- **Platform Overview**: Description of NGO and MFI solutions
- **Feature Comparison**: Benefits for each platform
- **Flow Diagram**: How funding flows from NGO → MFI → Groups → Impact
- **Quick Navigation**: Links to NGO and MFI login pages

---

## Authentication & Security

### Authentication Methods

#### Phone-Based Authentication (Primary)
- **Supabase Auth**: Phone OTP
- **No Password Required**: Code-based authentication
- **SMS Delivery**: OTP sent to phone number
- **Fast Onboarding**: Quick signup process

#### Email Authentication (Alternative)
- **Secure**: Email-based OTP or password
- **Recovery**: Account recovery mechanism
- **Professional**: For desktop/corporate users

#### Demo Mode (Development/Testing)
- **No Authentication Required**: Pre-configured demo accounts
- **Offline Capable**: Works without internet
- **Data Isolation**: Demo data separate from production
- **Demo Credentials**:
  ```
  Phone: +254700000001 (Secretary)
  Phone: +254700000002 (NGO)
  Phone: +254700000003 (Member)
  
  NGO Demo Login: Maendeleo Foundation
  MFI Demo Login: Ulinzi MFI for MSMEs
  ```

### Security Features

#### Row-Level Security (RLS)
- **Database-Level Enforcement**: PostgreSQL RLS policies
- **User Isolation**: Each user sees only their data
- **Role-Based Access**: Different views per role
- **Audit Logging**: All access logged

#### Session Management
- **JWT Tokens**: Secure token-based sessions
- **Auto-Logout**: Inactive session timeout (configurable)
- **Device Management**: Sessions per device
- **Logout Option**: Explicit sign-out clears all sessions

#### Data Encryption
- **In Transit**: HTTPS/SSL for all connections
- **At Rest**: Supabase encryption for stored data
- **Sensitive Fields**: Additional encryption for PII

#### Audit Trail
- **Complete Logging**: Every action recorded
- **Actor Identification**: User email/name logged
- **Timestamp Precision**: Millisecond-level timestamps
- **IP Tracking**: Optional IP address logging

---

## Offline-First & PWA

### Progressive Web App (PWA)

#### Installation
- **Desktop**: Chrome/Edge install button prompts
- **Mobile**: Add to home screen (iOS/Android)
- **Standalone**: App runs full-screen without browser chrome
- **Native Feel**: Instant load, smooth animations

#### Service Worker (`public/sw.js`)

**Caching Strategies**:
- **Network-First (Pages)**: Try online, fallback to cache
- **Cache-First (Assets)**: Use cache, refresh in background
- **Stale-While-Revalidate**: Serve cache while fetching update

**Offline Capabilities**:
- View previously loaded pages
- Access cached resources
- Queue actions for sync
- Automatic retry on reconnect

#### Offline Data Capture

**Meeting Creation Workflow**:
1. User creates meeting with contributions/loans
2. Data saved to **localStorage** immediately
3. Service worker intercepts network request
4. If online: sync to Supabase
5. If offline: queue for later
6. Sync status indicator shows "Offline" or "Synced"

**Local Storage Structure**:
```javascript
localStorage.mkutano_pendingChanges = [
  {
    type: "contribution",
    meetingId: "...",
    groupId: "...",
    amount: 500,
    memberId: "...",
    timestamp: "2026-02-22T10:30:00Z"
  },
  // ... more items
]

localStorage.mkutano_user = {
  id: "...",
  phone: "+254...",
  role: "secretary",
  groupId: "..."
}
```

#### Demo Mode
- **Built-in Demo Data**: No authentication required
- **Pre-configured Accounts**: Ready-to-use demo users
- **Mock Data**: Realistic sample data for all tables
- **Complete Offline**: Works 100% offline in demo mode

### Sync Manager (`src/lib/syncManager.ts`)

#### Auto-Sync Workflow
1. **Queue**: Changes saved to localStorage
2. **Watch**: Sync manager monitors for connectivity
3. **Batch**: Multiple changes batched together
4. **Send**: When online, POST to Supabase
5. **Confirm**: Success confirmation updates metadata
6. **Retry**: Failed requests retry with exponential backoff

#### Conflict Resolution
- **Timestamp-Based**: Later timestamp wins
- **User Notification**: Alert user of conflicts
- **Manual Merge**: UI for resolving conflicts

---

## Getting Started

### Installation from Source

#### 1. Prerequisites
```bash
# Node.js 18+ required
node --version  # Should be v18 or higher
npm --version   # Should be v8 or higher
```

#### 2. Clone Repository
```bash
git clone https://github.com/dig-software/MKUTANOAPP.git
cd MKUTANO\ APP
```

#### 3. Install Dependencies
```bash
npm install
```

#### 4. Environment Variables
Create `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

#### 6. Production Build
```bash
npm run build
npm start
```

### Deployment on Vercel

#### 1. Push to GitHub
```bash
git push origin main
```

#### 2. Connect Repository
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Select MKUTANOAPP repository
- Click "Import"

#### 3. Set Environment Variables
In Vercel dashboard:
- Add `NEXT_PUBLIC_SUPABASE_URL`
- Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Click "Deploy"

#### 4. Automatic Deployments
- Main branch pushes automatically deploy
- Preview deployments for pull requests
- Production URL: mkutano-app.vercel.app

---

## Demo Accounts

### Community Savings Group Accounts

| Role | Phone Number | Notes | Dashboard |
|------|-------------|-------|-----------|
| Secretary | `+254700000001` | Creates meetings, manages group | /dashboard |
| Member | `+254700000003` | Views personal savings/loans | /dashboard |

### Enterprise Edition Accounts

#### NGO Portal (`/enterprise/ngo-login`)

| Organization | Demo Account | Role | Features |
|--------------|-------------|------|----------|
| **Maendeleo Foundation** | Click "Demo: Maendeleo Foundation" | NGO Staff | Program overview, impact tracking, loan portfolio |
| Ulinzi Community Programs | Demo account | NGO Staff | Alternative NGO account |

**Default Credentials**: Username shown, no password required (click "Demo Account" button)

#### MFI Portal (`/enterprise/mfi-login`)

| Institution | Demo Account | Role | Features |
|-------------|-------------|------|----------|
| **Ulinzi MFI for MSMEs** | Click "Demo: Ulinzi MFI..." | MFI Manager | Lending portfolio, disbursement tracking, group performance |
| Ashima Microfinance | Demo account | MFI Manager | Alternative MFI account |

**Default Credentials**: Institution name shown, no password required

### Mock Data Included

**Community**:
- Group: "Maendeleo wa Wanawake" (Women's Savings Group)
- 3 demo members with various loan histories
- Sample meetings and contributions
- Realistic financial data

**Enterprise**:
- **NGO**: "Women Entrepreneurs Fund 2026"
  - Budget: 500,000 KES
  - Funding split: 200K to Ulinzi MFI + 150K to Ashima MFI
  
- **MFI**: "Ulinzi MFI for MSMEs"
  - Lending portfolio: 180,000 KES disbursed
  - Active groups: 3 (Maendeleo, Shoprite, Jua Kali)
  - Repayment rate: 92%
  - Outstanding balance: 15,000 KES

---

## API & Integration

### Supabase Integration

#### Initialization (`src/lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

#### Authentication Methods
```typescript
// Phone authentication
const { error } = await supabase.auth.signInWithOtp({
  phone: '+254700000001',
})

// Verify OTP
const { data, error } = await supabase.auth.verifyOtp({
  phone: '+254700000001',
  token: otpCode
})

// Sign out
await supabase.auth.signOut()
```

#### Data Queries
```typescript
// Fetch group data
const { data, error } = await supabase
  .from('groups')
  .select('*')
  .eq('id', groupId)
  .single()

// Insert contribution
const { data, error } = await supabase
  .from('contributions')
  .insert([{
    meetingId,
    groupId,
    memberId,
    amount: 500,
    type: 'contribution'
  }])

// Update loan status
const { error } = await supabase
  .from('loans')
  .update({ status: 'repaid' })
  .eq('id', loanId)
```

### API Endpoints (Backend - Future)

**Proposed REST API** (not yet implemented):

```
POST /api/auth/phone - Start phone authentication
POST /api/auth/verify - Verify OTP
GET  /api/groups/:groupId - Fetch group data
GET  /api/groups/:groupId/members - List members
POST /api/meetings - Create meeting
POST /api/contributions - Record contribution
POST /api/loans - Issue loan
POST /api/repayments - Record repayment
GET  /api/reports/:reportId - Generate report
POST /api/sync - Sync offline changes
```

---

## Deployment & Versioning

### Current Version
- **Version**: 0.1.0
- **Release Date**: February 22, 2026
- **Status**: Beta (Production Ready, some features in progress)

### Deployments
- **Production**: mkutano-app.vercel.app (Auto-deployed from main branch)
- **Development**: localhost:3000 (Run `npm run dev`)
- **Git Repository**: github.com/dig-software/MKUTANOAPP

### Build Output
- **33 Routes** including:
  - 6 public pages (/benefits, /contact, /faqs, /news, /login, /signup)
  - 20+ dashboard pages (secretary/member/ngo/admin views)
  - 3 enterprise pages (/enterprise, /enterprise/ngo-login, /enterprise/mfi-login)
  - 1 test page (/test)

### Recent Changes

#### Latest Commit: `4f232a0` (Feb 22, 2026)
- Added `/dashboard/ngo` root page with program overview
- Added `/dashboard/mfi` root page with lending portfolio KPIs
- Fixed 404 errors for enterprise login flows
- Integrated mockNgoPrograms and mockMfiLendingPortfolio data

#### Previous Changes:
- **Commit `6aa0d8b`**: Enterprise Edition foundation (login pages, navigation)
- **Commit `ee203e9`**: Fixed logout session caching (proper Supabase signOut)
- **Commit `790adc8`**: Removed shares concept across entire app

### Performance Metrics
- **First Load JS**: 87.3 kB (shared by all routes)
- **Average Page Size**: 90-150 kB (route-specific JS)
- **largest Bundle**: /dashboard/meetings (~107 kB)
- **Smallest Bundle**: /news, /benefits (~4-5 kB)

### Browser Support
- **Chrome/Chromium**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support (iOS 13+)
- **Edge**: ✅ Full support

---

## Support & Troubleshooting

### Common Issues

#### "Service Worker not registering"
- **Solution**: Navigate to `/` and wait 5 seconds
- **Check**: DevTools → Application → Service Workers

#### "Offline changes not syncing"
- **Solution**: Ensure you're online and wait 10 seconds
- **Check**: SyncStatus component shows "synced"
- **Manual**: Refresh page to force sync

#### "Login keeps redirecting"
- **Solution**: Clear browser cache and localStorage
- Command: Open DevTools → Application → Storage → Clear All

#### "Demo account not working"
- **Solution**: Ensure demo mode is enabled
- **Check**: See /test page for demo mode status

---

## Summary

**Mkutano** is a comprehensive platform for managing village savings and loan associations with strong offline-first capabilities, enterprise-grade security, and an intuitive interface. The system supports both community groups (VSLA) and enterprise partners (NGO/MFI) through role-based access control and specialized dashboards.

**Key Strengths**:
- ✅ Offline-first architecture (works anywhere)
- ✅ PWA installable on mobile & desktop
- ✅ Complete audit trail for accountability
- ✅ Multi-role platform (Community + Enterprise)
- ✅ Automatic Vercel deployment
- ✅ Progressive enhancement (works in any modern browser)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Built-in demo mode for testing

**Demo Ready**: Visit https://mkutano-app.vercel.app and login with demo credentials to explore all features.

---

*For detailed technical questions or feature requests, refer to the specific documentation files in the project root.*
