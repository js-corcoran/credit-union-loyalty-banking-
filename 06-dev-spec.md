# Credit Union Loyalty Banking Experience — Developer Specification

**Project**: Credit Union Loyalty Banking Experience
**Phase**: Step 6 — Dev Spec Generator (Technical Implementation Blueprint)
**Date**: February 21, 2026
**Status**: COMPLETE
**Author Caliber**: VP/Senior Director of Engineering + Technical Architecture

---

## PIPELINE INPUT SUMMARY

| Input Document | Consumed Elements | Key Decisions Derived |
|---|---|---|
| **03-experience-strategy.md** | 7 Experience Principles, 4 Target Personas (PERSONA-01 through PERSONA-04), Current & Future-State Journey Maps, Experience Architecture, Design System Recommendations | Design constraints (zero core banking friction, WCAG 2.1 AAA baseline), Navigation structure (Loyalty as primary nav item), Proactive alert triggers (30-day autopay expiration, balance within $500 of minimum), Multi-layer communication (1–2 disclosure levels max) |
| **04-prd.md** | Feature Requirements (Loyalty Hub, Tier Details, Account Status, Benefits Display, Autopay Management, Retrogression Alerts, FAQ), 7 Strategic Objectives with measurable outcomes, Screen/Flow specifications, Acceptance Criteria | 17 Named screens (SCR-01 through SCR-17), 7 Primary user flows with conditional logic, Benefit calculation engine requirements, Notification system triggers, FAQ database scope (25–30 questions) |
| **05-ux-spec.md** | Component Specifications (TierBadge, TierProgressBar, BenefitCard, RetrogressionAlert, LoyaltyContextCallout, TierRulesAccordion, etc.), Layout Logic, Information Architecture, Responsive Breakpoints, Accessibility Checkpoints, Content Data Models | Component props/variants/states, Shadcn base components for each, Test IDs matching UX spec, Accessibility ARIA attributes, Touch target sizing (48×48px minimum), Typography scale (16pt baseline), Container max-widths (900px desktop) |

---

## CONFLICT RESOLUTION LOG

| Conflict | Resolution | Rationale |
|----------|-----------|-----------|
| **Experience Strategy** specifies "multi-layer, 1–2 levels max" communication; **UX Spec** shows 3+ levels in some flows (Hub main → Tier Details → Account Status → FAQ) | Interpret as "Hub main is essential layer, Tier Details/Account Status/FAQ are optional exploration layers; no single task requires 3+ levels to complete" | Experience Strategy's constraint is about minimizing forced navigation depth, not eliminating optional layers. Success metric is "time-to-information <3 min via self-service," not "no 3-level navigation exists" |
| **PRD** lists "Transfer / Move Money" as single screen (SCR-10); **UX Spec** describes both initiation (SCR-10) and confirmation (SCR-11) | SCR-10 is initiation flow (form entry); SCR-11 is confirmation screen (with fee waiver callout). Both counted as single feature "Transfer" with two sub-screens | Confirmation screens are distinct flows requiring separate component logic; both are required for complete implementation |
| **Experience Strategy** recommends "Phased rollout (early-access cohort)" but **PRD** assumes "100% rollout" | Recommend phased rollout (Phase 2) as Mode B; big-bang (100%) as Mode A fallback | Phased approach reduces day-1 support spike and allows iteration; big-bang simpler operationally |
| **UX Spec** defines Tier benefit colors (Classic: gray #5B7C99, Plus: gold #D4A574, Premium: silver #E8E8E8); Experience Strategy specifies AAA contrast (7:1+) | Use UX Spec colors but verify 7:1 contrast against white backgrounds; adjust if needed while preserving tier distinction | UX Spec defines visual direction; Experience Strategy defines accessibility floor; both must be satisfied |

**Conflicts Resolved**: 4 (all resolved in favor of UX spec for UI details, Experience Strategy for principles/constraints)

---

## 1. OVERVIEW

### Project Summary

Credit Union Loyalty Banking Experience is a seamlessly integrated, three-tier loyalty program (Classic, Plus, Premium) designed for credit union members aged 55+ that preserves familiar banking workflows while introducing transparent tier qualification, real-dollar benefit visualization, and proactive retrogression prevention through a centralized Loyalty Hub.

### Scope & Objectives

**In Scope**:
- Loyalty Hub: Central destination for tier status, benefits, calculations, FAQ
- Tier System: Three tiers with rolling balance and autopay qualification criteria
- Contextual Integration: Tier badges, benefit callouts within account summary, transfers, autopay flows
- Notifications: Proactive alerts (autopay expiration, balance approaching threshold, tier achievement)
- FAQ & Self-Service: 25–30 questions covering qualification, benefits, retrogression, legacy migration
- Real-Dollar Benefit Calculation: Dynamic engine computing member-specific APY boost, fee waiver, third-party rewards
- Accessibility: WCAG 2.1 AAA compliance (16pt+ font, 7:1 contrast, 48px+ tap targets)

**Out of Scope**:
- Actual autopay execution (existing backend service; integration only)
- Third-party rewards provider integration (API contract defined; provider handles fulfillment)
- Email delivery system (integration with existing email service)
- Core banking flows (account summary, transaction history, transfer initiation) — these are enhanced, not rebuilt

### Organizational Goals Aligned

1. **Deposit Growth**: Contextual tier nudges ("Add $1,500 to reach Premium") drive 30% balance increase for advancing members
2. **Product Penetration**: Autopay setup nudges and loan contextualization drive 20%+ loan origination increase
3. **Engagement & Retention**: Loyalty Hub engagement +40%, app login frequency +30%, 12-month retention +25%
4. **Support Cost Reduction**: FAQ-driven Hub reduces loyalty-related support calls 60–80%
5. **Credit Loss Reduction**: Proactive autopay expiration alerts maintain 90%+ autopay persistence, reducing late payments 20%
6. **Minimal Transitional Volatility**: Day-1/Day-2 support volume normalized; zero regression in core task completion time
7. **Trust & Transparency**: 80%+ of members understand tier calculation through account-specific detail pages

---

## 2. TECHNICAL ARCHITECTURE

### Mode A: Design-First (Default — Next.js 14 + Tailwind CSS + Shadcn UI)

**Tech Stack**:
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + CSS modules for component-specific overrides
- **UI Components**: Shadcn UI for base components (Button, Card, Accordion, Tabs, Alert, Badge, Progress)
- **State Management**: React Context API (TierContext, NotificationContext, MemberDataContext)
- **Data**: Mock data sourced from `/lib/mock-data.ts`; all API calls abstracted behind clean interfaces in `/lib/api.ts`
- **Accessibility**: Manual ARIA attributes, semantic HTML, keyboard navigation testing
- **Testing**: Jest + React Testing Library for unit/integration; axe-core for accessibility

**Key Design Pattern**: All real API calls replaced with mock implementations that mirror real API contracts. A developer can swap out mock data for real API calls by modifying `/lib/api.ts` without touching components.

**Project Structure**:

```
credit-union-loyalty/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home / Dashboard (SCR-01)
│   ├── (auth)/                  # Auth group layout (optional, if needed)
│   ├── accounts/
│   │   ├── page.tsx             # Account list
│   │   └── [id]/
│   │       ├── layout.tsx        # Account detail context
│   │       └── page.tsx          # Account Detail (SCR-08)
│   ├── transactions/
│   │   └── page.tsx             # Transaction History
│   │   └── [id]/
│   │       └── page.tsx         # Transaction Detail (SCR-09)
│   ├── transfer/
│   │   ├── page.tsx             # Transfer Initiation (SCR-10)
│   │   └── confirm/
│   │       └── page.tsx         # Transfer Confirmation (SCR-11)
│   ├── autopay/
│   │   ├── page.tsx             # Autopay Management List (SCR-12)
│   │   ├── add/
│   │   │   └── page.tsx         # Autopay Add/Edit Flow (SCR-13)
│   │   └── [id]/
│   │       ├── edit/page.tsx    # Autopay Edit
│   │       └── remove/page.tsx  # Autopay Removal Confirmation (SCR-14)
│   ├── loans/
│   │   ├── page.tsx             # Loans Overview
│   │   └── [id]/
│   │       └── page.tsx         # Loan Detail
│   ├── loyalty/                 # Loyalty Hub
│   │   ├── page.tsx             # Loyalty Hub Main (SCR-02)
│   │   ├── tier-details/
│   │   │   └── page.tsx         # Tier Details Page (SCR-03)
│   │   ├── account-status/
│   │   │   └── page.tsx         # Account Status Detail (SCR-04)
│   │   ├── benefits/
│   │   │   └── page.tsx         # Benefit Details Page (SCR-05)
│   │   └── faq/
│   │       └── page.tsx         # FAQ & Search (SCR-06)
│   ├── help/
│   │   └── page.tsx             # Help / Support (SCR-07)
│   ├── notifications/
│   │   └── page.tsx             # Notification Center
│   ├── settings/
│   │   └── page.tsx             # Notification Settings (SCR-17)
│   └── legacy-migration/
│       └── page.tsx             # Legacy Migration Onboarding (SCR-15)
│
├── components/                   # Reusable React Components (organized by feature)
│   ├── loyalty/                 # Loyalty-specific components
│   │   ├── TierBadge.tsx        # Displays tier with color, icon, name
│   │   ├── TierProgressBar.tsx  # Progress bar to next tier
│   │   ├── BenefitCard.tsx      # Single benefit display (APY, fee waiver, rewards)
│   │   ├── BenefitValueCalculator.tsx  # Calculates real-dollar benefit value
│   │   ├── RetrogressionAlert.tsx      # Proactive tier-loss warning
│   │   ├── TierRulesAccordion.tsx      # Expandable tier rules
│   │   ├── LoyaltyContextCallout.tsx   # Inline benefit info in banking flows
│   │   ├── TierActionCTA.tsx           # Action button (increase balance, add autopay)
│   │   └── LoyaltyHubNavigation.tsx    # Tab navigation within Hub
│   │
│   ├── banking/                 # Banking-specific components (enhanced with loyalty)
│   │   ├── AccountCard.tsx      # Account summary card (now with tier badge)
│   │   ├── AccountDetail.tsx    # Account detail view (now with loyalty context)
│   │   ├── TransactionItem.tsx  # Transaction list item
│   │   ├── TransactionDetail.tsx # Transaction detail (now with benefit context)
│   │   ├── TransferForm.tsx     # Transfer initiation form
│   │   ├── TransferConfirmation.tsx # Confirmation with fee waiver display
│   │   ├── AutopayList.tsx      # Autopay list (with tier contribution info)
│   │   ├── AutopayForm.tsx      # Autopay setup form
│   │   └── AutopayRemovalConfirm.tsx # Removal confirmation
│   │
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx           # App header with navigation
│   │   ├── Navigation.tsx       # Main navigation (bottom nav mobile, side nav desktop)
│   │   ├── Sidebar.tsx          # Desktop side navigation
│   │   └── MobileNav.tsx        # Mobile bottom navigation
│   │
│   ├── faq/                     # FAQ components
│   │   ├── FAQSearch.tsx        # Full-text search input
│   │   ├── FAQCategoryBrowse.tsx # Category-based navigation
│   │   ├── FAQItem.tsx          # Single FAQ Q&A
│   │   └── FAQList.tsx          # FAQ list with search/filter
│   │
│   ├── notifications/           # Notification components
│   │   ├── NotificationBanner.tsx # In-app notification banner
│   │   ├── NotificationModal.tsx  # Modal notification (urgent alerts)
│   │   ├── NotificationCenter.tsx # Notification history
│   │   └── NotificationSettings.tsx # Notification preferences
│   │
│   └── shared/                  # Shared utility components
│       ├── Button.tsx           # Wrapped Shadcn button
│       ├── Card.tsx             # Wrapped Shadcn card
│       ├── Modal.tsx            # Dialog/modal wrapper
│       ├── Tabs.tsx             # Wrapped Shadcn tabs
│       ├── Accordion.tsx        # Wrapped Shadcn accordion
│       ├── LoadingSpinner.tsx   # Loading indicator
│       └── ErrorBoundary.tsx    # Error handling
│
├── lib/                         # Utilities, helpers, data
│   ├── api.ts                  # Mock API layer (real API signatures)
│   ├── mock-data.ts            # Mock members, accounts, tiers, benefits
│   ├── calculations.ts         # Benefit calculation logic, tier qualification logic
│   ├── types.ts                # TypeScript interfaces (Member, Account, Tier, Benefit, etc.)
│   ├── constants.ts            # Tier thresholds, benefit rates, feature flags
│   ├── hooks.ts                # Custom React hooks (useTierStatus, useBenefitValue, etc.)
│   └── formatting.ts           # Currency formatting, date formatting utilities
│
├── context/                    # React Context providers
│   ├── MemberContext.tsx       # Member profile, current tier, account data
│   ├── TierContext.tsx         # Tier configuration, benefit rules
│   ├── NotificationContext.tsx # Notification state, preferences
│   └── LayoutContext.tsx       # Mobile/desktop layout state
│
├── styles/                     # Global and component-specific styles
│   ├── globals.css             # Global Tailwind + custom CSS
│   ├── variables.css           # CSS custom properties (color vars, spacing, etc.)
│   └── accessibility.css       # Accessibility-specific styles (focus indicators, etc.)
│
├── public/                     # Static assets
│   ├── icons/                  # SVG icons (tier badges, benefits, alerts)
│   ├── images/                 # Images (explanatory diagrams, screenshots)
│   └── fonts/                  # Custom fonts (if using)
│
├── tests/                      # Test files (mirror app structure)
│   ├── components/
│   │   ├── TierBadge.test.tsx
│   │   ├── BenefitCard.test.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── loyalty.test.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── calculations.test.ts
│   │   ├── api.test.ts
│   │   └── ...
│   └── integration/
│       ├── tier-progression-flow.test.tsx
│       ├── retrogression-alert-flow.test.tsx
│       └── ...
│
├── .env.local                  # Environment variables (API endpoints, feature flags)
├── tailwind.config.js          # Tailwind configuration (color palette, breakpoints)
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration
├── jest.config.js              # Jest testing configuration
└── README.md                   # Setup and development guide

```

**Key Architectural Decisions**:

1. **Mock Data First**: All components built against `/lib/api.ts` which exports mock-data-powered functions. Real API integration happens by replacing mock calls, not refactoring components.

2. **Server vs. Client Components**: Use Next.js 14 App Router `'use client'` directive selectively. Pages are server components; interactive components (forms, alerts, tabs) are client components.

3. **State Management**: React Context for member data, tier config, notifications. No Redux/Zustand overhead for this scope; Context sufficient for feature complexity.

4. **Calculations in Lib**: All tier qualification logic, benefit calculation, date threshold logic centralized in `/lib/calculations.ts`. Components call these functions; tests verify calculation accuracy.

5. **Shadcn UI Foundation**: Leverage Shadcn for accessibility baseline (Button, Card, Accordion, Tabs, Alert, Badge, Progress). Custom theming via Tailwind variables, not component re-implementations.

---

### Mode B: Recommended Approach (Full-Stack Production-Ready)

**Why Mode B Matters**: The credit union needs **real-time tier calculation**, **rolling balance computation**, **retrogression monitoring**, and a **notification system** that works reliably at scale. Mode A is great for prototyping; Mode B is production-recommended.

**Technology Stack for Mode B**:
- **Frontend**: Next.js 14 App Router + Tailwind + Shadcn (same as Mode A)
- **Backend**: Node.js/Express or Python/FastAPI for API routes
- **Database**: PostgreSQL for member data, tier status, notifications, audit logs
- **Caching**: Redis for tier qualification cache, benefit calculation cache
- **Job Queue**: Bull/RabbitMQ for background jobs (daily rolling balance recalculation, proactive alert triggers)
- **Real-Time**: WebSocket (Socket.io) or Server-Sent Events (SSE) for tier change notifications
- **Monitoring**: Prometheus/Grafana for metrics; Sentry for error tracking
- **Testing**: Cypress for E2E tests; Jest for unit tests; K6 for load testing

**Rationale for Mode B**:

1. **Rolling Balance Complexity**: Requires daily batch job to compute 3-month rolling average for all members. Mode A mock can't handle this at scale.

2. **Proactive Alert System**: Retrogression alerts need background job to check balance/autopay status daily, trigger alerts before threshold. Mode A would require polling.

3. **Real-Time Tier Changes**: When member increases balance or removes autopay, tier change should be immediate. Mode B's database ensures consistency.

4. **Audit Trail**: Financial institutions require audit logs of all tier changes, benefit calculations, alerts sent. Mode B's database design accommodates this.

5. **Multi-Device Sync**: Member's tier status must be consistent across app, web, branch staff portals. Mode B's backend ensures single source of truth.

6. **Scalability**: Mode A will struggle with 100,000+ members; Mode B's caching and job queue handle volume.

**Recommended Implementation Path**:
1. **Sprint 1–2**: Build Mode A (Next.js + Shadcn + mock data) to validate UX with real members
2. **Sprint 3–4**: Build Mode B backend (Express + PostgreSQL + job queue) in parallel
3. **Sprint 5–6**: Integrate frontend to Mode B backend; run load testing, security audit
4. **Sprint 7**: Launch Mode B to production

**API Contract Example** (Mode B backend):

```typescript
// GET /api/member/:memberId/tier
{
  memberId: "12345",
  currentTier: "plus",
  tierChangeDate: "2025-11-15",
  nextTierThreshold: 10000,
  daysUntilTierLoss: 45,
  qualifyingAccounts: [
    {
      accountId: "CHK-9876",
      balance: 15000,
      contributesToTier: true,
      rollingBalance3Month: 14500
    }
  ],
  autopayStatus: {
    loanAutopay: true,
    creditCardAutopay: false,
    totalCount: 1,
    expirationDate: "2026-05-31"
  }
}

// POST /api/member/:memberId/notifications/preferences
{
  frequencyPreference: "daily" | "weekly" | "alerts-only",
  channels: ["in-app", "email", "sms"],
  notificationTypes: {
    tierAchievement: true,
    retrogressionRisk: true,
    autopayExpiration: true,
    balanceThreshold: true
  }
}

// POST /api/member/:memberId/benefit-calculation
{
  tier: "plus",
  benefitBreakdown: [
    {
      benefit: "apy-boost",
      apyPercentage: 0.25,
      memberBalance: 25000,
      annualValue: 62.50
    },
    {
      benefit: "fee-waiver",
      estimatedTransfersPerMonth: 2,
      annualValue: 60
    },
    {
      benefit: "third-party-rewards",
      estimatedAnnualValue: 15
    }
  ],
  totalAnnualBenefit: 137.50
}
```

**Decision**: For **production launch**, implement Mode B backend. For **initial MVP/prototype**, Mode A with clear handoff plan to Mode B.

---

## 3. DATA MODELS

### Core TypeScript Interfaces

```typescript
// Member & Account Data
interface Member {
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  currentTier: TierType;  // "classic" | "plus" | "premium"
  tierChangeDate: Date;
  joinDate: Date;
  qualifyingAccounts: QualifyingAccount[];
  autopayStatus: AutopayStatus;
  notificationPreferences: NotificationPreferences;
  lastLoginDate: Date;
}

type TierType = "classic" | "plus" | "premium";

interface QualifyingAccount {
  accountId: string;
  accountType: "checking" | "savings" | "money-market" | "line-of-credit";
  currentBalance: number;
  rollingBalance3Month: number;  // Average of last day of each month for past 3 months
  qualifiesForTier: boolean;
  contributesToTier: TierType[];  // Which tiers this account qualifies for
}

interface AutopayStatus {
  loanAutopay: boolean;
  creditCardAutopay: boolean;  // Limited to 1 per tier
  billPaymentAutopay: boolean;
  totalCount: number;
  autopayDetails: AutopayDetail[];
}

interface AutopayDetail {
  autopayId: string;
  accountId: string;
  payeeType: "loan" | "credit-card" | "bill";
  amount: number;
  frequency: "monthly" | "bi-weekly" | "quarterly";
  expirationDate: Date;
  status: "active" | "paused" | "expired";
  contributesToTier: TierType[];
}

// Tier Configuration
interface TierConfiguration {
  tierId: TierType;
  tierName: string;
  displayColor: string;  // Hex color for UI
  iconName: string;
  requirements: TierRequirements;
  benefits: Benefit[];
  gracePeriodDays: number;  // Days before tier officially changes after qualification lapse
  priority: number;  // 1=premium, 2=plus, 3=classic (for comparison views)
}

interface TierRequirements {
  minimumBalance: number;  // In dollars; must maintain rolling 3-month average
  minimumAutopay: number;  // Number of active autopays required
  autopayTypes: ("loan" | "credit-card" | "bill")[];  // Which types count
  creditCardAutopayLimit: number;  // Max credit card autopays counted toward tier
  rollingBalancePeriodMonths: number;  // Always 3 for this program
}

// Benefit & Calculation
interface Benefit {
  benefitId: string;
  benefitName: string;  // "APY Boost", "Fee Waiver", "Third-Party Rewards"
  benefitType: "apy-boost" | "fee-waiver" | "third-party-rewards";
  description: string;
  icon: string;
  tier: TierType;

  // APY Boost specific
  apyBoostPercentage?: number;  // e.g., 0.25 for +0.25%

  // Fee Waiver specific
  waivableFeesPerYear?: number;  // e.g., 12 for monthly ATM fees
  feeAmount?: number;  // e.g., 2.50 for transfer fee

  // Third-party rewards specific
  partnerName?: string;
  rewardRate?: number;  // e.g., 0.001 for 0.1%
}

interface MemberBenefitCalculation {
  memberId: string;
  tier: TierType;
  calculationDate: Date;
  benefitBreakdown: CalculatedBenefit[];
  totalAnnualBenefitValue: number;  // Sum of all benefits in dollars
}

interface CalculatedBenefit {
  benefitId: string;
  benefitName: string;
  apyBoost?: number;  // If applicable
  memberBalance?: number;  // Used for APY calculation
  estimatedTransfersPerMonth?: number;  // Used for fee waiver
  calculatedAnnualValue: number;  // Real-dollar value
  calculationBasis: string;  // Transparent explanation: "memberBalance * apyBoost / 100"
  isEstimate: boolean;
  lastUpdated: Date;
}

// Transactions & History
interface Transaction {
  transactionId: string;
  accountId: string;
  date: Date;
  merchant: string;
  amount: number;
  transactionType: "debit" | "credit" | "transfer" | "fee" | "interest";
  category: string;  // Auto-categorized
  description: string;
  tierBenefit?: TransactionBenefit;  // If benefit applies
}

interface TransactionBenefit {
  benefitType: "apy-boost" | "fee-waiver" | "third-party-rewards";
  benefitValue: number;  // In dollars (e.g., 2.50 fee saved)
  description: string;
}

// Notifications
interface Notification {
  notificationId: string;
  memberId: string;
  notificationType: "tier-achievement" | "tier-loss-risk" | "autopay-expiration" | "balance-approaching-threshold" | "retrogression-alert";
  title: string;
  message: string;
  severity: "info" | "warning" | "urgent";
  actionUrl?: string;
  actionText?: string;
  createdDate: Date;
  readDate?: Date;
  expirationDate: Date;  // Auto-remove after this date
  channels: NotificationChannel[];
}

type NotificationChannel = "in-app" | "email" | "sms";

interface NotificationPreferences {
  frequencyPreference: "daily" | "weekly" | "alerts-only";
  preferredChannels: NotificationChannel[];
  notificationTypePreferences: {
    tierAchievement: boolean;
    retrogressionRisk: boolean;
    autopayExpiration: boolean;
    balanceThreshold: boolean;
  };
  timePreference?: string;  // e.g., "9:00 AM" for daily digest
}

// FAQ & Content
interface FAQItem {
  faqId: string;
  question: string;
  answer: string;
  category: "qualification" | "benefits" | "retrogression" | "legacy-migration" | "troubleshooting";
  keywords: string[];  // For search
  relatedFAQIds: string[];  // Cross-links
  visualExplanation?: {
    type: "diagram" | "flowchart" | "image";
    url: string;
    altText: string;
  };
  relevantTiers: TierType[];
  exampleMember?: {
    balance: number;
    autopayCount: number;
    expectedTier: TierType;
  };
}

// Tier Migration (Legacy Program)
interface TierMigrationStatus {
  memberId: string;
  legacyProgram: {
    tierName: string;
    benefits: string[];
  };
  newProgram: {
    tierName: TierType;
    benefits: Benefit[];
    annualValue: number;
  };
  migrationDate: Date;
  benefitComparison: {
    oldBenefitValue: number;
    newBenefitValue: number;
    improvementPercentage: number;
  };
}

// Search & Analytics
interface TierThresholdMonitor {
  memberId: string;
  currentTier: TierType;
  nextTierThreshold: number;
  currentProgress: number;  // For balance tier
  daysUntilTierLoss: number;
  riskFactors: string[];  // e.g., "autopay-expires-march-31", "balance-dropping"
  recommendedActions: string[];  // e.g., "add-autopay", "increase-balance-by-$1500"
  lastUpdatedDate: Date;
}
```

### Dummy Data Examples

```typescript
// Mock Member 1: Change-Averse Everyday Banker (PERSONA-01)
const mockMember1: Member = {
  memberId: "MEMBER-001",
  firstName: "Patricia",
  lastName: "Johnson",
  email: "patricia.johnson@email.com",
  phoneNumber: "555-0100",
  currentTier: "plus",
  tierChangeDate: new Date("2025-11-15"),
  joinDate: new Date("2010-03-20"),
  qualifyingAccounts: [
    {
      accountId: "CHK-9876",
      accountType: "checking",
      currentBalance: 15000,
      rollingBalance3Month: 14500,
      qualifiesForTier: true,
      contributesToTier: ["classic", "plus", "premium"]
    },
    {
      accountId: "SAV-5432",
      accountType: "savings",
      currentBalance: 8500,
      rollingBalance3Month: 8200,
      qualifiesForTier: true,
      contributesToTier: ["classic", "plus"]
    }
  ],
  autopayStatus: {
    loanAutopay: true,
    creditCardAutopay: false,
    billPaymentAutopay: true,
    totalCount: 2,
    autopayDetails: [
      {
        autopayId: "AP-001",
        accountId: "LOAN-001",
        payeeType: "loan",
        amount: 1250,
        frequency: "monthly",
        expirationDate: new Date("2026-05-31"),
        status: "active",
        contributesToTier: ["classic", "plus", "premium"]
      },
      {
        autopayId: "AP-002",
        accountId: "CHK-9876",
        payeeType: "bill",
        amount: 150,
        frequency: "monthly",
        expirationDate: new Date("2027-02-28"),
        status: "active",
        contributesToTier: ["classic", "plus", "premium"]
      }
    ]
  },
  notificationPreferences: {
    frequencyPreference: "weekly",
    preferredChannels: ["in-app", "email"],
    notificationTypePreferences: {
      tierAchievement: true,
      retrogressionRisk: true,
      autopayExpiration: true,
      balanceThreshold: false
    }
  },
  lastLoginDate: new Date("2026-02-20")
};

// Mock Tier Configuration
const mockTierConfigurations: TierConfiguration[] = [
  {
    tierId: "classic",
    tierName: "Classic",
    displayColor: "#6B7280",
    iconName: "tier-classic",
    requirements: {
      minimumBalance: 2500,
      minimumAutopay: 1,
      autopayTypes: ["loan", "bill"],
      creditCardAutopayLimit: 0,
      rollingBalancePeriodMonths: 3
    },
    benefits: [
      {
        benefitId: "apy-boost-classic",
        benefitName: "APY Boost",
        benefitType: "apy-boost",
        description: "Earn extra interest on savings",
        icon: "percentage-icon",
        tier: "classic",
        apyBoostPercentage: 0.1
      },
      {
        benefitId: "fee-waiver-classic",
        benefitName: "Fee Waiver",
        benefitType: "fee-waiver",
        description: "Waived ATM fees",
        icon: "shield-icon",
        tier: "classic",
        waivableFeesPerYear: 12,
        feeAmount: 2.50
      }
    ],
    gracePeriodDays: 30,
    priority: 3
  },
  {
    tierId: "plus",
    tierName: "Plus",
    displayColor: "#D4A574",
    iconName: "tier-plus",
    requirements: {
      minimumBalance: 10000,
      minimumAutopay: 2,
      autopayTypes: ["loan", "bill", "credit-card"],
      creditCardAutopayLimit: 1,
      rollingBalancePeriodMonths: 3
    },
    benefits: [
      {
        benefitId: "apy-boost-plus",
        benefitName: "APY Boost",
        benefitType: "apy-boost",
        description: "Earn higher interest on savings",
        icon: "percentage-icon",
        tier: "plus",
        apyBoostPercentage: 0.25
      },
      {
        benefitId: "fee-waiver-plus",
        benefitName: "Fee Waiver",
        benefitType: "fee-waiver",
        description: "Waived transfer fees",
        icon: "shield-icon",
        tier: "plus",
        waivableFeesPerYear: 24,
        feeAmount: 2.50
      },
      {
        benefitId: "rewards-plus",
        benefitName: "Third-Party Rewards",
        benefitType: "third-party-rewards",
        description: "Access to partner rewards",
        icon: "gift-icon",
        tier: "plus",
        partnerName: "Rewards Partner XYZ",
        rewardRate: 0.001
      }
    ],
    gracePeriodDays: 30,
    priority: 2
  },
  {
    tierId: "premium",
    tierName: "Premium",
    displayColor: "#E8E8E8",
    iconName: "tier-premium",
    requirements: {
      minimumBalance: 25000,
      minimumAutopay: 2,
      autopayTypes: ["loan", "bill", "credit-card"],
      creditCardAutopayLimit: 1,
      rollingBalancePeriodMonths: 3
    },
    benefits: [
      {
        benefitId: "apy-boost-premium",
        benefitName: "APY Boost",
        benefitType: "apy-boost",
        description: "Earn best-in-class interest on savings",
        icon: "percentage-icon",
        tier: "premium",
        apyBoostPercentage: 0.5
      },
      {
        benefitId: "fee-waiver-premium",
        benefitName: "Fee Waiver",
        benefitType: "fee-waiver",
        description: "Waived transfer and foreign ATM fees",
        icon: "shield-icon",
        tier: "premium",
        waivableFeesPerYear: 36,
        feeAmount: 2.50
      },
      {
        benefitId: "rewards-premium",
        benefitName: "Premium Rewards",
        benefitType: "third-party-rewards",
        description: "Double rewards on partner purchases",
        icon: "gift-icon",
        tier: "premium",
        partnerName: "Rewards Partner XYZ",
        rewardRate: 0.002
      }
    ],
    gracePeriodDays: 30,
    priority: 1
  }
];

// Mock Calculated Benefit (Member 1)
const mockMemberBenefit1: MemberBenefitCalculation = {
  memberId: "MEMBER-001",
  tier: "plus",
  calculationDate: new Date("2026-02-21"),
  benefitBreakdown: [
    {
      benefitId: "apy-boost-plus",
      benefitName: "APY Boost",
      apyBoost: 0.25,
      memberBalance: 23500,  // Combined balance of qualifying accounts
      calculatedAnnualValue: 58.75,  // (23500 * 0.25) / 100
      calculationBasis: "memberBalance * apyBoostPercentage / 100",
      isEstimate: false,
      lastUpdated: new Date("2026-02-21")
    },
    {
      benefitId: "fee-waiver-plus",
      benefitName: "Fee Waiver",
      estimatedTransfersPerMonth: 2,
      calculatedAnnualValue: 60,  // 2 transfers/month * 12 months * $2.50/transfer
      calculationBasis: "estimatedTransfersPerMonth * 12 * feePerTransfer",
      isEstimate: true,
      lastUpdated: new Date("2026-02-21")
    },
    {
      benefitId: "rewards-plus",
      benefitName: "Third-Party Rewards",
      calculatedAnnualValue: 25,  // Estimated based on spending history
      calculationBasis: "partner-api-calculation",
      isEstimate: true,
      lastUpdated: new Date("2026-02-21")
    }
  ],
  totalAnnualBenefitValue: 143.75
};

// Mock FAQ Items
const mockFAQItems: FAQItem[] = [
  {
    faqId: "FAQ-001",
    question: "What is a rolling balance?",
    answer: "Your rolling balance is the average of your account balance on the last day of each of the past 3 months. For example, if your balance was $2,600 on January 31, $2,500 on February 28, and $2,400 on March 31, your rolling balance would be $2,500.",
    category: "qualification",
    keywords: ["rolling", "balance", "calculation", "three-month"],
    relatedFAQIds: ["FAQ-002", "FAQ-003"],
    visualExplanation: {
      type: "diagram",
      url: "/images/rolling-balance-diagram.svg",
      altText: "Visual explanation of rolling 3-month balance calculation"
    },
    relevantTiers: ["classic", "plus", "premium"],
    exampleMember: {
      balance: 8500,
      autopayCount: 2,
      expectedTier: "plus"
    }
  },
  {
    faqId: "FAQ-002",
    question: "How do I qualify for Plus tier?",
    answer: "To qualify for Plus tier, you need two things: (1) maintain an average balance of $10,000 across qualifying accounts (checking, savings, money market) over the past 3 months, AND (2) maintain at least 2 active autopays (loan, bill payment, or credit card autopay—limited to 1 credit card per tier).",
    category: "qualification",
    keywords: ["qualify", "plus", "requirements", "autopay"],
    relatedFAQIds: ["FAQ-001", "FAQ-004"],
    relevantTiers: ["plus"],
    exampleMember: {
      balance: 15000,
      autopayCount: 2,
      expectedTier: "plus"
    }
  },
  {
    faqId: "FAQ-003",
    question: "What happens if my balance drops below my tier's requirement?",
    answer: "If your rolling balance drops below your tier's minimum for 30 days, your tier status will downgrade on the 31st day. Before this happens, we'll send you a proactive alert. You can restore your tier by increasing your balance back above the threshold within those 30 days.",
    category: "retrogression",
    keywords: ["retrogression", "downgrade", "tier-loss", "grace-period"],
    relatedFAQIds: ["FAQ-005"],
    relevantTiers: ["classic", "plus", "premium"]
  }
];
```

---

## 4. ROUTE STRUCTURE

### All Next.js App Routes Mapped to PRD Screens

| Screen ID | Screen Name | Route | Component File |
|-----------|------------|-------|-----------------|
| **SCR-01** | Home / Dashboard (Updated) | `/` | `app/page.tsx` |
| **SCR-02** | Loyalty Hub Main | `/loyalty` | `app/loyalty/page.tsx` |
| **SCR-03** | Tier Details Page | `/loyalty/tier-details` | `app/loyalty/tier-details/page.tsx` |
| **SCR-04** | Account Status Detail | `/loyalty/account-status` | `app/loyalty/account-status/page.tsx` |
| **SCR-05** | Benefit Details Page | `/loyalty/benefits` | `app/loyalty/benefits/page.tsx` |
| **SCR-06** | FAQ & Search | `/loyalty/faq` | `app/loyalty/faq/page.tsx` |
| **SCR-07** | Help / Support | `/help` | `app/help/page.tsx` |
| **SCR-08** | Account Detail (Enhanced) | `/accounts/[id]` | `app/accounts/[id]/page.tsx` |
| **SCR-09** | Transaction Detail (Enhanced) | `/transactions/[id]` | `app/transactions/[id]/page.tsx` |
| **SCR-10** | Transfer / Move Money Initiation | `/transfer` | `app/transfer/page.tsx` |
| **SCR-11** | Transfer Confirmation | `/transfer/confirm` | `app/transfer/confirm/page.tsx` |
| **SCR-12** | Autopay Management List | `/autopay` | `app/autopay/page.tsx` |
| **SCR-13** | Autopay Add/Edit Flow | `/autopay/add` | `app/autopay/add/page.tsx` |
| **SCR-14** | Autopay Removal Confirmation | `/autopay/[id]/remove` | `app/autopay/[id]/remove/page.tsx` |
| **SCR-15** | Legacy Migration Onboarding | `/legacy-migration` | `app/legacy-migration/page.tsx` |
| **SCR-16** | Retrogression Alert / Notification | Triggered contextually | Modal in `components/notifications/NotificationModal.tsx` |
| **SCR-17** | Notification Settings | `/settings` | `app/settings/page.tsx` |

### Additional Supporting Routes

| Route | Purpose | File |
|-------|---------|------|
| `/accounts` | Account list/summary | `app/accounts/page.tsx` |
| `/transactions` | Transaction history | `app/transactions/page.tsx` |
| `/loans` | Loans overview | `app/loans/page.tsx` |
| `/notifications` | Notification center | `app/notifications/page.tsx` |
| `/legacy-migration` | First-login legacy migration onboarding | `app/legacy-migration/page.tsx` |

---

## 5. COMPONENT SPECIFICATIONS

### Loyalty-Specific Components

#### **1. TierBadge Component**

**File**: `components/loyalty/TierBadge.tsx`

**Props**:
```typescript
interface TierBadgeProps {
  tier: TierType;  // "classic" | "plus" | "premium"
  size?: "small" | "medium" | "large";  // Default: "medium"
  variant?: "solid" | "outline";  // Default: "solid"
  showLabel?: boolean;  // Default: true
  className?: string;
}
```

**States**: Default, Focus (keyboard), Hover (desktop), Active (when selected)

**Shadcn Base**: Shadcn Badge component with custom icon + color overlay

**Implementation Notes**:
- Small: 32×32px with icon only (account card)
- Medium: 64×64px with icon + text (Hub main)
- Large: 80×80px with icon + text + benefits preview (Tier Details)
- Accessibility: `aria-label="Plus tier badge. You're currently in Plus tier with access to APY boost and fee waivers"`
- Test ID: `tier-badge-plus`, `tier-badge-classic`, `tier-badge-premium`

---

#### **2. TierProgressBar Component**

**File**: `components/loyalty/TierProgressBar.tsx`

**Props**:
```typescript
interface TierProgressBarProps {
  currentValue: number;  // Current balance or autopay count
  targetValue: number;  // Target for next tier
  tier: TierType;  // Current tier
  metric: "balance" | "autopay";  // Which metric displayed
  showLabel?: boolean;  // Default: true
  estimatedDays?: number;  // Optional timeline
  className?: string;
}
```

**Display**: `"8,500 / 10,000" | "2 of 3 autopays"`

**Shadcn Base**: Shadcn Progress component with custom numeric labels

**Accessibility**: `role="progressbar"`, `aria-valuenow=8500`, `aria-valuemin=2500`, `aria-valuemax=10000`

**Test ID**: `tier-progress-bar-balance`, `tier-progress-bar-autopay`

---

#### **3. BenefitCard Component**

**File**: `components/loyalty/BenefitCard.tsx`

**Props**:
```typescript
interface BenefitCardProps {
  benefit: Benefit;
  memberBalance?: number;
  estimatedValue?: number;
  variant?: "primary" | "locked" | "comparison";
  tier: TierType;
  onClick?: () => void;
  className?: string;
}
```

**Content**: Icon + Benefit Name + Description + Real-Dollar Value

**Variants**:
- **Primary**: Full color, prominent
- **Locked**: Grayed out, "Available with Plus tier"
- **Comparison**: Text-heavy, minimal styling

**Shadcn Base**: Shadcn Card with custom icon + value display

**Test ID**: `benefit-card-apy-boost`, `benefit-card-fee-waiver`, `benefit-card-rewards`

---

#### **4. RetrogressionAlert Component**

**File**: `components/notifications/RetrogressionAlert.tsx`

**Props**:
```typescript
interface RetrogressionAlertProps {
  riskType: "balance-approaching" | "autopay-expiring" | "threshold-14days" | "post-downgrade";
  currentValue: number;
  targetValue: number;
  daysUntilThreshold: number;
  recoveryAction: "add-balance" | "confirm-autopay" | "add-autopay";
  onDismiss: () => void;
  onAction: () => void;
  className?: string;
}
```

**Tone**: Supportive ("To maintain Plus tier..."), not alarming ("You're losing status...")

**Shadcn Base**: Shadcn Alert with custom CTA styling

**Test ID**: `retrogression-alert-balance`, `retrogression-alert-autopay`

---

#### **5. LoyaltyContextCallout Component**

**File**: `components/loyalty/LoyaltyContextCallout.tsx`

**Props**:
```typescript
interface LoyaltyContextCalloutProps {
  context: "account-summary" | "transaction-detail" | "transfer-confirmation" | "autopay-status";
  tier: TierType;
  relevantBenefit: string;  // "apy-boost" | "fee-waiver" | "rewards"
  applicableValue?: number;
  onLearnMore?: () => void;
  className?: string;
}
```

**Rules**: Only appear if relevant to member's tier and account type; non-required interaction

**Shadcn Base**: Shadcn Card with "Learn more" link

**Test ID**: `loyalty-callout-account-summary`, `loyalty-callout-transfer-confirmation`

---

#### **6. TierRulesAccordion Component**

**File**: `components/loyalty/TierRulesAccordion.tsx`

**Props**:
```typescript
interface TierRulesAccordionProps {
  tiers: TierConfiguration[];
  memberTier: TierType;
  expandedByDefault?: boolean;  // Default: false (only member's tier expanded)
  className?: string;
}
```

**Structure**: Collapsible sections for Classic / Plus / Premium; current tier expanded by default

**Content Levels**:
- Summary (always visible): "Classic: $2,500 balance + 1 autopay"
- Detailed Rules (expandable): Balance requirement, autopay requirement, effective date, grace period
- Benefits (expandable): Real-dollar examples
- How to Qualify (expandable): Steps to reach/upgrade
- Edge Cases (expandable): Boundary conditions

**Shadcn Base**: Shadcn Accordion with custom rule content

**Test ID**: `tier-rules-accordion-classic`, `tier-rules-accordion-plus`

---

#### **7. BenefitValueCalculator Component**

**File**: `components/loyalty/BenefitValueCalculator.tsx`

**Props**:
```typescript
interface BenefitValueCalculatorProps {
  memberData: {
    currentBalance: number;
    estimatedTransfersPerMonth: number;
    tier: TierType;
  };
  tiers: TierConfiguration[];
  displayComparison?: boolean;  // Show comparison to lower/higher tiers
  className?: string;
}
```

**Calculation Logic**:
- APY Boost: `(memberBalance * tierAPY - lowerTierAPY) / 100`
- Fee Waiver: `estimatedTransfersPerMonth * 12 * feePerTransfer`
- Third-Party Rewards: Integrated with API

**Output**: Individual benefits + annual summary + comparison scenarios

**Test ID**: `benefit-calculator`

---

#### **8. LoyaltyHubNavigation Component**

**File**: `components/loyalty/LoyaltyHubNavigation.tsx`

**Props**:
```typescript
interface LoyaltyHubNavigationProps {
  currentPage: "main" | "tier-details" | "account-status" | "benefits" | "faq";
  tier: TierType;
  className?: string;
}
```

**Navigation Structure**:
- Desktop: Horizontal tabs (Overview | Your Status | All Tiers | Benefits | FAQ)
- Mobile (≤480px): Current page + "Back" button

**Shadcn Base**: Shadcn Tabs component with custom layout

**Test ID**: `loyalty-hub-navigation`, `loyalty-hub-tab-overview`

---

### Banking Components (Enhanced with Loyalty)

#### **AccountCard Component**

**File**: `components/banking/AccountCard.tsx`

**New Elements**:
- Tier badge (small, non-intrusive)
- Benefit indicator ("Plus tier: +0.25% APY")
- Progress bar (if applicable)
- "View tier details" link

**Accessibility**: All new elements optional; core task unchanged

**Test ID**: `account-card-{accountId}`

---

#### **TransactionDetail Component**

**File**: `components/banking/TransactionDetail.tsx`

**New Elements** (if benefit-relevant):
- Benefit context banner ("You earned $2.45 in fee waiver with your Plus tier")
- "Learn more" link to Benefit Details

**Test ID**: `transaction-detail-{transactionId}`

---

#### **TransferConfirmation Component**

**File**: `components/banking/TransferConfirmation.tsx`

**New Elements**:
- Fee waiver callout: "Your Plus tier gives you fee-free transfers. This transfer would cost $2.50; you pay $0."
- Celebratory messaging after completion

**Test ID**: `transfer-confirmation`

---

#### **AutopayForm Component**

**File**: `components/banking/AutopayForm.tsx`

**New Elements**:
- During setup: "Adding this loan autopay moves you toward Plus tier: 2 of 2 required"
- Real-time feedback as member selects autopay type

**Test ID**: `autopay-form`

---

### Form & Input Components

#### **TierActionCTA Component**

**File**: `components/loyalty/TierActionCTA.tsx`

**Props**:
```typescript
interface TierActionCTAProps {
  actionType: "increase-balance" | "add-autopay" | "confirm-autopay" | "learn-more";
  currentValue: number;
  targetValue: number;
  tier: TierType;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}
```

**Button Text Examples**:
- "Increase balance by $1,500 to reach Premium tier"
- "Add another autopay to maintain Plus tier"

**Shadcn Base**: Shadcn Button with custom text + tier color

**Test ID**: `tier-action-cta-increase-balance`

---

### Notification Components

#### **NotificationBanner Component**

**File**: `components/notifications/NotificationBanner.tsx`

**Props**:
```typescript
interface NotificationBannerProps {
  notification: Notification;
  onDismiss: () => void;
  onAction?: () => void;
  className?: string;
}
```

**Types**: Tier achievement, retrogression risk, autopay expiration, balance threshold

**Shadcn Base**: Shadcn Alert with custom styling

---

#### **NotificationCenter Component**

**File**: `components/notifications/NotificationCenter.tsx`

**Features**:
- Notification history (last 30 days)
- Filter by type (tier, autopay, balance)
- Mark as read/unread
- Settings link to Notification Preferences

**Test ID**: `notification-center`

---

---

## 6. STATE MANAGEMENT

### React Context Structure

#### **MemberContext**

**File**: `context/MemberContext.tsx`

```typescript
interface MemberContextType {
  member: Member | null;
  loading: boolean;
  error: string | null;
  updateMember: (updates: Partial<Member>) => Promise<void>;
  refreshMember: () => Promise<void>;
}

export const MemberContext = createContext<MemberContextType | undefined>(undefined);
```

**Provider Wraps**: Root layout; all pages have access to member data

**Usage**: `useMember()` hook in any component

---

#### **TierContext**

**File**: `context/TierContext.tsx`

```typescript
interface TierContextType {
  tiers: TierConfiguration[];
  tierThresholds: Map<TierType, TierRequirements>;
  loading: boolean;
  getTierRequirements: (tier: TierType) => TierRequirements;
  calculateTierFromData: (member: Member) => TierType;
}

export const TierContext = createContext<TierContextType | undefined>(undefined);
```

**Provider Wraps**: Root layout; single source of truth for tier configuration

**Usage**: `useTiers()` hook

---

#### **NotificationContext**

**File**: `context/NotificationContext.tsx`

```typescript
interface NotificationContextType {
  notifications: Notification[];
  preferences: NotificationPreferences;
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  dismissNotification: (notificationId: string) => void;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
```

**Provider Wraps**: Root layout; notification state global

**Usage**: `useNotifications()` hook

---

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│ Root Layout (app/layout.tsx)                            │
│ ├─ MemberProvider                                       │
│ ├─ TierProvider                                         │
│ └─ NotificationProvider                                 │
└─────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│ Pages (SCR-01 through SCR-17)                           │
│ ├─ Read member data from MemberContext                  │
│ ├─ Read tier config from TierContext                    │
│ ├─ Read notifications from NotificationContext          │
│ └─ Call lib/calculations.ts for derived data            │
└─────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│ Components (TierBadge, BenefitCard, etc.)               │
│ ├─ Receive props from pages                             │
│ ├─ Use hooks (useTierStatus, useBenefitValue, etc.)     │
│ └─ Dispatch notifications on user action                │
└─────────────────────────────────────────────────────────┘
```

---

## 7. API LAYER (lib/api.ts)

### Mock Implementations (Mode A)

```typescript
// lib/api.ts - Mode A (Mock)

import {
  Member,
  TierConfiguration,
  Notification,
  MemberBenefitCalculation,
  FAQItem
} from './types';
import {
  mockMember1,
  mockTierConfigurations,
  mockFAQItems
} from './mock-data';

/**
 * Member API Functions
 */

export async function getMemberProfile(memberId: string): Promise<Member> {
  // Mock: Return hardcoded member
  // Real: GET /api/member/:memberId
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMember1), 300);  // Simulate network delay
  });
}

export async function getMemberBenefits(memberId: string): Promise<MemberBenefitCalculation> {
  // Mock: Calculate benefits based on tier and balance
  // Real: GET /api/member/:memberId/benefits
  return new Promise((resolve) => {
    setTimeout(() => {
      const member = mockMember1;
      const totalBalance = member.qualifyingAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
      const calculation = calculateBenefitValue(member.currentTier, totalBalance, member.autopayStatus);
      resolve(calculation);
    }, 300);
  });
}

/**
 * Tier API Functions
 */

export async function getTierConfigurations(): Promise<TierConfiguration[]> {
  // Mock: Return tier config
  // Real: GET /api/tiers
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTierConfigurations), 300);
  });
}

export async function calculateMemberTier(memberId: string): Promise<{
  currentTier: TierType,
  nextTierThreshold: number,
  daysUntilTierLoss: number,
  recommendedActions: string[]
}> {
  // Mock: Determine tier based on balance and autopay
  // Real: POST /api/member/:memberId/calculate-tier
  const member = await getMemberProfile(memberId);
  const totalBalance = member.qualifyingAccounts.reduce((sum, acc) => sum + acc.rollingBalance3Month, 0);
  const autopayCount = member.autopayStatus.totalCount;

  let tier: TierType = "classic";
  if (totalBalance >= 25000 && autopayCount >= 2) tier = "premium";
  else if (totalBalance >= 10000 && autopayCount >= 2) tier = "plus";
  else tier = "classic";

  return {
    currentTier: tier,
    nextTierThreshold: tier === "classic" ? 10000 : tier === "plus" ? 25000 : undefined,
    daysUntilTierLoss: 45,  // Mock: placeholder
    recommendedActions: tier === "classic" ? ["Add $7,500 to balance", "Add another autopay"] : []
  };
}

/**
 * Benefit Calculation Functions
 */

export function calculateBenefitValue(
  tier: TierType,
  memberBalance: number,
  autopayStatus: AutopayStatus
): MemberBenefitCalculation {
  // Helper function: Calculate real-dollar benefit values
  const tierConfig = mockTierConfigurations.find(t => t.tierId === tier)!;

  const benefitBreakdown = tierConfig.benefits.map(benefit => {
    let value = 0;
    if (benefit.benefitType === "apy-boost") {
      value = (memberBalance * (benefit.apyBoostPercentage || 0)) / 100;
    } else if (benefit.benefitType === "fee-waiver") {
      // Assume 2 transfers per month
      value = 2 * 12 * (benefit.feeAmount || 0);
    } else if (benefit.benefitType === "third-party-rewards") {
      // Assume $15K annual spending
      value = 15000 * (benefit.rewardRate || 0);
    }

    return {
      benefitId: benefit.benefitId,
      benefitName: benefit.benefitName,
      apyBoost: benefit.apyBoostPercentage,
      memberBalance: benefit.benefitType === "apy-boost" ? memberBalance : undefined,
      estimatedTransfersPerMonth: benefit.benefitType === "fee-waiver" ? 2 : undefined,
      calculatedAnnualValue: value,
      calculationBasis: "local-calculation",
      isEstimate: benefit.benefitType !== "apy-boost",
      lastUpdated: new Date()
    };
  });

  const totalValue = benefitBreakdown.reduce((sum, b) => sum + b.calculatedAnnualValue, 0);

  return {
    memberId: "MEMBER-001",  // Mock
    tier,
    calculationDate: new Date(),
    benefitBreakdown,
    totalAnnualBenefitValue: totalValue
  };
}

/**
 * Notification API Functions
 */

export async function getNotifications(memberId: string): Promise<Notification[]> {
  // Mock: Return hardcoded notifications
  // Real: GET /api/member/:memberId/notifications
  return new Promise((resolve) => {
    setTimeout(() => resolve([]), 300);  // Mock: empty list
  });
}

export async function sendNotification(
  memberId: string,
  notification: Omit<Notification, 'notificationId' | 'createdDate'>
): Promise<Notification> {
  // Mock: Generate ID and return
  // Real: POST /api/member/:memberId/notifications
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...notification,
        notificationId: `NOTIF-${Date.now()}`,
        createdDate: new Date()
      });
    }, 300);
  });
}

/**
 * FAQ API Functions
 */

export async function getFAQItems(
  category?: string,
  searchQuery?: string
): Promise<FAQItem[]> {
  // Mock: Filter by category or search query
  // Real: GET /api/faq?category=...&q=...
  return new Promise((resolve) => {
    let results = mockFAQItems;

    if (category) {
      results = results.filter(item => item.category === category);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(item =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.keywords.some(k => k.toLowerCase().includes(query))
      );
    }

    setTimeout(() => resolve(results), 300);
  });
}

/**
 * Autopay API Functions
 */

export async function getAutopays(memberId: string): Promise<AutopayDetail[]> {
  // Mock: Return member's autopays
  // Real: GET /api/member/:memberId/autopays
  const member = await getMemberProfile(memberId);
  return new Promise((resolve) => {
    setTimeout(() => resolve(member.autopayStatus.autopayDetails), 300);
  });
}

export async function createAutopay(
  memberId: string,
  autopayData: Omit<AutopayDetail, 'autopayId'>
): Promise<AutopayDetail> {
  // Mock: Generate ID and return
  // Real: POST /api/member/:memberId/autopays
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...autopayData,
        autopayId: `AP-${Date.now()}`
      });
    }, 300);
  });
}

export async function updateAutopay(
  memberId: string,
  autopayId: string,
  updates: Partial<AutopayDetail>
): Promise<AutopayDetail> {
  // Mock: Return updated autopay
  // Real: PUT /api/member/:memberId/autopays/:autopayId
  return new Promise((resolve) => {
    const member = await getMemberProfile(memberId);
    const autopay = member.autopayStatus.autopayDetails.find(ap => ap.autopayId === autopayId)!;
    setTimeout(() => resolve({ ...autopay, ...updates }), 300);
  });
}

export async function deleteAutopay(memberId: string, autopayId: string): Promise<void> {
  // Mock: Just resolve
  // Real: DELETE /api/member/:memberId/autopays/:autopayId
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 300);
  });
}

/**
 * Transaction API Functions
 */

export async function getTransactions(memberId: string, accountId?: string): Promise<Transaction[]> {
  // Mock: Return dummy transactions
  // Real: GET /api/member/:memberId/transactions
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTransactions: Transaction[] = [
        {
          transactionId: "TXN-001",
          accountId: "CHK-9876",
          date: new Date("2026-02-20"),
          merchant: "Local Grocery Store",
          amount: 75.50,
          transactionType: "debit",
          category: "Groceries",
          description: "Debit card purchase",
          tierBenefit: {
            benefitType: "fee-waiver",
            benefitValue: 0,
            description: "No transfer fee applied"
          }
        }
      ];
      resolve(mockTransactions);
    }, 300);
  });
}

/**
 * Transfer API Functions
 */

export async function initiateTransfer(
  memberId: string,
  fromAccountId: string,
  toAccountId: string,
  amount: number
): Promise<{ transferId: string; fee: number; tierBenefit?: string }> {
  // Mock: Calculate fee based on tier
  // Real: POST /api/member/:memberId/transfers
  const member = await getMemberProfile(memberId);
  const fee = member.currentTier === "classic" ? 2.50 : 0;  // Fee waived for Plus/Premium

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        transferId: `TFR-${Date.now()}`,
        fee,
        tierBenefit: fee === 0 ? "Fee waived by Plus tier" : undefined
      });
    }, 300);
  });
}
```

### Real API Integration (Mode B)

For Mode B, replace mock functions with real HTTP calls:

```typescript
// lib/api.ts - Mode B (Real API)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function getMemberProfile(memberId: string): Promise<Member> {
  const response = await fetch(`${API_BASE_URL}/member/${memberId}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch member profile: ${response.statusText}`);
  }

  return response.json();
}

export async function calculateMemberTier(memberId: string): Promise<TierCalculation> {
  const response = await fetch(`${API_BASE_URL}/member/${memberId}/calculate-tier`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to calculate tier: ${response.statusText}`);
  }

  return response.json();
}

// ... etc
```

---

## 8. ACCESSIBILITY IMPLEMENTATION

### WCAG 2.1 AAA Compliance (Target)

**Typography**:
- All text ≥16pt (14pt minimum for truly secondary labels)
- Line height 1.5–2.0 for body text (generous spacing)
- Font weights: Regular (400) for body, Bold (600–700) for headers (no light weights)
- Sans-serif fonts only (no serif)

**Color & Contrast**:
- All text: Minimum 7:1 contrast ratio (AAA standard)
- Large text (18pt+): Minimum 3:1 contrast
- Never convey information through color alone (always icon + color + text)
- High-contrast backgrounds: Dark text on light, light text on dark

**Interactive Elements**:
- Minimum 48×48px tap target size
- 8–10px spacing between adjacent tap targets
- Keyboard focus indicators: 3px+ border, high-contrast color
- Tab order logical: Left to right, top to bottom (no tabindex abuses)

**Navigation & Structure**:
- Flat, linear navigation (≤2 disclosure levels max)
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>` as appropriate
- Headings: `<h1>` page title, `<h2>` sections, `<h3>` subsections (no skipping levels)
- Lists: Use `<ul>`, `<ol>`, `<li>` for list content

**Screen Reader Support**:
- `aria-label` on icon-only buttons: `aria-label="Show more benefits"`
- `aria-current="page"` on current navigation link
- `aria-expanded="true|false"` on expandable sections
- `aria-describedby` linking labels to help text
- `role="alert"` on notifications (auto-announced)
- List structure: `<ul role="list">` with `<li>` items (not divs)

**Focus Management**:
- Focus visible on all interactive elements (outline, border, or background change)
- No focus traps (tab key can exit any interactive section)
- Modal dialogs: Focus moves to modal, returns to trigger on close
- Skip links (optional): "Skip to main content" link for keyboard users

**Reduced Motion**:
- `prefers-reduced-motion: reduce` query supported
- Animations disabled for users who set this preference
- Transitions: 200–300ms default; respect reduced motion preference

**Color Blindness Accommodation**:
- Red/green never sole differentiator (pair with icon and text)
- Tier colors: Gray/Blue/Gold (distinct even in grayscale)
- Alert colors: Orange (warning), Red (error), Green (success) with icon/text reinforcement

**Testing**:
- Automated: axe-core, WAVE, Lighthouse accessibility audit
- Manual: Keyboard navigation test (Tab, Enter, Space), screen reader test (NVDA/JAWS)
- Inclusive testing: Users with vision/motor/cognitive disabilities (15–20% of test participants)

### Implementation Checklist

- [ ] Typography: All body text ≥16pt, headings 24pt+
- [ ] Contrast: 7:1 for all text (audit with WebAIM contrast checker)
- [ ] Touch targets: All buttons/links ≥48×48px
- [ ] Keyboard: All functionality accessible via keyboard (no mouse-only features)
- [ ] Screen reader: Proper `aria-label`, `role`, semantic HTML
- [ ] Focus: Visible focus indicators on all interactive elements
- [ ] Motion: Animations respect `prefers-reduced-motion`
- [ ] Color: Never sole information conveyor (always paired with icon/text)
- [ ] Modals: Focus management, scroll lock, return focus on close
- [ ] Forms: Labels associated with inputs, error messages linked
- [ ] Test: Axe-core scan shows 0 critical violations
- [ ] Inclusive testing: 15–20% of participants 55+ age group

---

## 9. TESTING STRATEGY

### Unit Tests (Jest + React Testing Library)

**Files**: `tests/components/` and `tests/lib/`

```bash
# Component unit tests
tests/components/
├── TierBadge.test.tsx
├── TierProgressBar.test.tsx
├── BenefitCard.test.tsx
├── RetrogressionAlert.test.tsx
├── LoyaltyContextCallout.test.tsx
├── TierRulesAccordion.test.tsx
├── BenefitValueCalculator.test.tsx
└── LoyaltyHubNavigation.test.tsx

# Utility function tests
tests/lib/
├── calculations.test.ts
├── api.test.ts
└── formatting.test.ts
```

**Example Test Case** (BenefitValueCalculator):

```typescript
import { render, screen } from '@testing-library/react';
import BenefitValueCalculator from '@/components/loyalty/BenefitValueCalculator';

describe('BenefitValueCalculator', () => {
  it('calculates APY boost correctly', () => {
    const memberData = {
      currentBalance: 10000,
      estimatedTransfersPerMonth: 2,
      tier: 'plus' as const
    };

    render(<BenefitValueCalculator memberData={memberData} />);

    // APY Boost: 10000 * 0.25% / 100 = $25/year
    expect(screen.getByText(/\$25.*APY/)).toBeInTheDocument();
  });

  it('displays annual summary', () => {
    // ... test setup
    render(<BenefitValueCalculator memberData={memberData} />);

    expect(screen.getByText(/\$.*annual/i)).toBeInTheDocument();
  });

  it('respects accessibility (aria-labels)', () => {
    // ... test setup
    const { container } = render(<BenefitValueCalculator memberData={memberData} />);

    expect(container.querySelector('[aria-label*="benefit"]')).toBeInTheDocument();
  });
});
```

### Integration Tests (Cypress)

**Files**: `tests/integration/`

```bash
tests/integration/
├── tier-progression-flow.cy.ts
├── retrogression-alert-flow.cy.ts
├── autopay-setup-flow.cy.ts
├── transfer-with-fee-waiver.cy.ts
└── legacy-migration-flow.cy.ts
```

**Example E2E Test** (Tier Progression):

```typescript
// tests/integration/tier-progression-flow.cy.ts

describe('Tier Progression Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login('member-001');  // Mock login
  });

  it('shows progress toward next tier on home screen', () => {
    cy.get('[data-testid="tier-progress-bar-balance"]')
      .should('contain', '$8,500 / $10,000');
  });

  it('navigates to Loyalty Hub and shows account status', () => {
    cy.get('[data-testid="tier-badge-plus"]').click();
    cy.url().should('include', '/loyalty');

    cy.get('[data-testid="loyalty-hub-tab-account-status"]').click();
    cy.get('[data-testid="account-status-detail"]')
      .should('contain', 'Days until Premium');
  });

  it('shows action CTA to increase balance', () => {
    cy.get('[data-testid="tier-badge-plus"]').click();

    cy.get('[data-testid="tier-action-cta-increase-balance"]')
      .should('contain', 'Increase balance by $1,500');
      .click();

    cy.url().should('include', '/transfer');
  });

  it('confirms tier achievement message', () => {
    // Complete transfer to reach Premium
    cy.get('[data-testid="transfer-form"]').within(() => {
      cy.get('input[name="amount"]').type('1500');
    });
    cy.get('[data-testid="transfer-confirm"]').click();

    // Expect celebratory notification
    cy.get('[data-testid="notification-banner"]')
      .should('contain', 'Congratulations! You reached Premium tier');
  });
});
```

### Accessibility Testing (axe-core)

```typescript
// tests/accessibility/loyalty-hub.a11y.test.ts

import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import LoyaltyHubMain from '@/app/loyalty/page';

expect.extend(toHaveNoViolations);

describe('Loyalty Hub Accessibility', () => {
  it('has no axe violations on Loyalty Hub main', async () => {
    const { container } = render(<LoyaltyHubMain />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('keyboard navigation works correctly', () => {
    render(<LoyaltyHubMain />);

    // Tab to first tier badge
    cy.get('body').tab();
    cy.focused().should('have.attr', 'data-testid', 'tier-badge-plus');

    // Tab to next interactive element
    cy.focused().tab();
    cy.focused().should('have.attr', 'data-testid', 'tier-progress-bar-balance');
  });

  it('screen reader announces tier status', () => {
    render(<LoyaltyHubMain />);

    cy.get('[data-testid="tier-badge-plus"]')
      .should('have.attr', 'aria-label')
      .and('contain', 'Plus tier');
  });
});
```

### Test Coverage Targets

| Category | Target Coverage |
|----------|-----------------|
| Components | 90%+ (critical components 100%) |
| Utility functions | 95%+ |
| Pages/Routes | 80%+ |
| Overall | 85%+ |

**Critical Components** (100% coverage required):
- `TierProgressBar.tsx` (calculation logic)
- `BenefitValueCalculator.tsx` (financial accuracy)
- `RetrogressionAlert.tsx` (proactive alert triggers)
- `lib/calculations.ts` (tier qualification logic)

---

## 10. IMPLEMENTATION PLAN

### Build Order & Complexity

**Phase 1: Foundation (Weeks 1–4)**

1. **Project Setup** (Week 1)
   - [ ] Initialize Next.js 14 project, Tailwind, Shadcn
   - [ ] Set up TypeScript, Jest, React Testing Library
   - [ ] Set up git repo, CI/CD pipeline (GitHub Actions)
   - [ ] Create design tokens (color palette, spacing, typography)
   - **Complexity**: Low | **Dependencies**: None

2. **Data Models & Mock Data** (Week 1–2)
   - [ ] Define all TypeScript interfaces (`types.ts`)
   - [ ] Create mock data file (`mock-data.ts`)
   - [ ] Set up API abstraction layer (`api.ts`)
   - [ ] Create context providers (MemberContext, TierContext, NotificationContext)
   - **Complexity**: Medium | **Dependencies**: None

3. **Core Loyalty Components** (Week 2–3)
   - [ ] TierBadge component + unit tests
   - [ ] TierProgressBar component + unit tests
   - [ ] BenefitCard component + unit tests
   - [ ] BenefitValueCalculator component + unit tests
   - [ ] RetrogressionAlert component + unit tests
   - **Complexity**: Medium | **Dependencies**: Data models, Shadcn setup

4. **Layout & Navigation** (Week 3–4)
   - [ ] Root layout with providers
   - [ ] Header/navigation (mobile + desktop)
   - [ ] Sidebar for desktop
   - [ ] Bottom nav for mobile
   - **Complexity**: Low–Medium | **Dependencies**: Components from Phase 1

**Phase 2: Screens & Flows (Weeks 5–10)**

5. **Home / Dashboard (SCR-01)** (Week 5)
   - [ ] Account cards with tier badges
   - [ ] Progress bars on qualifying accounts
   - [ ] "View tier details" links
   - [ ] Integration test: everyday banking flow
   - **Complexity**: Medium | **Dependencies**: TierBadge, TierProgressBar

6. **Loyalty Hub Pages** (Week 5–7)
   - [ ] **SCR-02: Loyalty Hub Main** (Week 5)
     - Tier badge, benefit summary, progress, action CTAs
   - [ ] **SCR-03: Tier Details Page** (Week 6)
     - Tab-based tier comparison, full rules, benefits breakdown
   - [ ] **SCR-04: Account Status Detail** (Week 6)
     - Member's tier calculation data, days to threshold
   - [ ] **SCR-05: Benefit Details Page** (Week 7)
     - Deep dive into each benefit with real-dollar calculations
   - [ ] **SCR-06: FAQ & Search** (Week 7)
     - Full-text search, category browse, 25–30 FAQs
   - [ ] **LoyaltyHubNavigation** component for tab-based navigation
   - **Complexity**: High | **Dependencies**: All core components

7. **Banking Integration Screens** (Week 7–8)
   - [ ] **SCR-08: Account Detail** (Week 7)
     - Add loyalty context callout
   - [ ] **SCR-09: Transaction Detail** (Week 8)
     - Add benefit context if applicable
   - [ ] **SCR-10/11: Transfer Flow** (Week 8)
     - Add fee waiver callout before/during confirmation

8. **Autopay Flow** (Week 8–9)
   - [ ] **SCR-12: Autopay List** (Week 8)
     - Show tier contribution for each autopay
   - [ ] **SCR-13: Autopay Add/Edit** (Week 8)
     - Tier impact messaging during setup
   - [ ] **SCR-14: Autopay Removal Confirmation** (Week 9)
     - Warn about tier loss impact

9. **Notifications & Settings** (Week 9–10)
   - [ ] **SCR-16: Retrogression Alert** (Week 9)
     - Proactive alerts when balance/autopay at risk
   - [ ] **SCR-17: Notification Settings** (Week 10)
     - Frequency preferences, channel preferences
   - [ ] **Notification Center** (Week 10)
     - History, filtering, mark as read

10. **Legacy Migration** (Week 10)
    - [ ] **SCR-15: Legacy Migration Onboarding** (Week 10)
        - First-login modal explaining program change
    - [ ] Legacy FAQ section (inherited from SCR-06)

**Phase 3: Polish & Testing (Weeks 11–14)**

11. **Accessibility Audit** (Week 11)
    - [ ] WCAG 2.1 AAA audit (axe-core)
    - [ ] Keyboard navigation testing (Tab, Enter, Space)
    - [ ] Screen reader testing (NVDA/JAWS)
    - [ ] Contrast verification (WebAIM checker)
    - [ ] User testing with 55+ demographic (15–20% of test group)

12. **Integration Testing** (Week 11–12)
    - [ ] Tier progression flow (E2E)
    - [ ] Retrogression alert flow (E2E)
    - [ ] Autopay setup flow with tier impact (E2E)
    - [ ] Transfer with fee waiver (E2E)
    - [ ] Legacy migration flow (E2E)

13. **Performance & Load Testing** (Week 12–13)
    - [ ] Lighthouse score ≥90 (performance, accessibility, SEO)
    - [ ] Page load time <3 seconds
    - [ ] API response time <500ms (mock)
    - [ ] No jank on animations (60fps target)

14. **Bug Fix & Documentation** (Week 13–14)
    - [ ] Fix accessibility violations
    - [ ] Fix test failures
    - [ ] Update README with setup instructions
    - [ ] Code documentation (JSDoc comments)

### Dependencies Between Screens

```
SCR-01 (Home)
├─ depends on: TierBadge, TierProgressBar
├─ unlocks: Navigation to SCR-02

SCR-02 (Loyalty Hub Main)
├─ depends on: TierBadge, TierProgressBar, BenefitCard, BenefitValueCalculator
├─ unlocks: SCR-03, SCR-04, SCR-05, SCR-06

SCR-03 (Tier Details)
├─ depends on: TierRulesAccordion, BenefitCard
├─ unlocks: Tier understanding (supports flow 3)

SCR-04 (Account Status)
├─ depends on: BenefitValueCalculator, TierProgressBar
├─ unlocks: Tier calculation transparency

SCR-08 (Account Detail)
├─ depends on: LoyaltyContextCallout
├─ unlocks: Benefit surfacing in banking

SCR-10 (Transfer Initiation)
├─ depends on: No new components (existing transfer form)
├─ unlocks: SCR-11

SCR-11 (Transfer Confirmation)
├─ depends on: LoyaltyContextCallout
├─ unlocks: Fee waiver demonstration

SCR-12 (Autopay List)
├─ depends on: LoyaltyContextCallout
├─ unlocks: SCR-13

SCR-13 (Autopay Add/Edit)
├─ depends on: No new components (existing autopay form + tier messaging)
├─ unlocks: Autopay tier contribution

SCR-16 (Retrogression Alert)
├─ depends on: RetrogressionAlert, TierActionCTA
├─ unlocks: Proactive alert system
```

### Estimated Complexity per Screen

| Screen | Component Complexity | Data Complexity | Flow Complexity | Estimate (hours) |
|--------|---------------------|-----------------|-----------------|------------------|
| SCR-01 | Low (card updates) | Low | Low | 8 |
| SCR-02 | Medium (multiple sections) | Medium | Medium | 16 |
| SCR-03 | Medium (accordion) | Medium | Low | 12 |
| SCR-04 | High (calculations) | High | Medium | 20 |
| SCR-05 | High (calculations + comparison) | High | Medium | 20 |
| SCR-06 | Medium (search + filter) | Medium | Low | 16 |
| SCR-08 | Low (card integration) | Low | Low | 4 |
| SCR-09 | Low (callout integration) | Low | Low | 4 |
| SCR-10 | Low (existing form) | Low | Low | 4 |
| SCR-11 | Low (callout integration) | Low | Low | 4 |
| SCR-12 | Low (list with callouts) | Low | Low | 8 |
| SCR-13 | Low (messaging during setup) | Low | Low | 8 |
| SCR-14 | Low (confirmation) | Low | Low | 4 |
| SCR-15 | Medium (onboarding) | Low | Low | 12 |
| SCR-16 | Medium (alert logic) | Medium | Medium | 16 |
| SCR-17 | Low (preferences form) | Low | Low | 8 |
| **Total** | | | | **164 hours** |

**Timeline**: 14 weeks (4 hours/day, 5 days/week) = 280 hours available; 164 hours core development + 60 hours testing/accessibility + 40 hours buffer = 264 hours total

---

## 11. OPEN QUESTIONS

| # | Question | Impact | Recommendation |
|---|----------|--------|-----------------|
| 1 | **Real API Timeline**: When will Mode B (Express + PostgreSQL backend) be ready? Should Mode A timeline assume API integration or mock-only launch? | High | Agree on backend timeline in sprint planning. Recommend Mode A MVP (Week 14) → Mode B integration (Week 18–20). |
| 2 | **Third-Party Rewards Integration**: Which rewards provider API will integrate? What latency tolerance for benefit calculations? | Medium | Coordinate with vendor; define API contract; plan fallback if provider API down. |
| 3 | **Legacy Program Benefit Mapping**: Exact mapping of old program benefits → new tier benefits? How to position to members (improvement or change)? | High | Finance + Product team to define legacy benefit values; craft migration messaging to emphasize improvement. |
| 4 | **Autopay Reconciliation**: Which autopay types count toward tier? Is "credit card autopay limited to 1 per tier" enforced at application level or just rules? | Medium | Legal + Compliance to confirm tier qualification rules; implement validation in `lib/calculations.ts`. |
| 5 | **Notification Delivery**: Email service selected? SMS provider? In-app notification persistence (store in DB or ephemeral)? | Medium | Procurement to select email/SMS vendors; architecture to confirm persistence approach. |
| 6 | **Phased vs. Big Bang Rollout**: Resource availability for phased rollout (10% → 30% → 100%)? | Medium | Project management to evaluate resource capacity; recommend phased if possible (reduces day-1 risk). |
| 7 | **Accessibility Testing**: Budget for professional 3rd-party accessibility audit + inclusive user testing (55+ demographic)? | Medium | Finance to approve; recommend VPAT certification pre-launch. |
| 8 | **A/B Testing Infrastructure**: Capability to A/B test notification triggers, nudge messaging, alert thresholds? | Low | Engineering to assess feature flag infrastructure; recommend LaunchDarkly or similar. |
| 9 | **Member Communication Timeline**: When will pre-launch communication campaign launch (2–3 weeks before go-live)? Approved messaging? | High | Marketing to finalize communication timeline; coordinate with launch schedule. |
| 10 | **Support Team Training**: How many support staff? When does training window start? Sufficient to cover Day 1 spike? | High | Operations to finalize support team size; recommend training 2 weeks before launch; extra staff on call Day 1–2. |

---

## 12. ACCEPTANCE CRITERIA

### Product-Level Acceptance (Launch Gate)

- [ ] **80%+ member awareness** of new loyalty program before launch (measured by pre-launch communication analytics)
- [ ] **Zero regression** in core banking task completion time (balance check, transfer, autopay) vs. pre-loyalty baseline
- [ ] **70%+ adoption** of Loyalty Hub within 30 days post-launch (login rate)
- [ ] **FAQ covers 80%+ of anticipated support questions** (validated by pre-launch team review; all 25–30 questions documented)
- [ ] **Day-1 support volume ≤10% above baseline** (max 165 calls vs. baseline 150)
- [ ] **Day-2 support volume normalizes** within 48 hours
- [ ] **90%+ of support team trained** before launch; 90%+ confidence in explaining tier rules
- [ ] **WCAG 2.1 AAA compliance** 95%+ (minor exceptions allowed for technical reasons)
- [ ] **Member satisfaction** ≥75% CSAT for launch experience

### Technical Acceptance (Dev Spec Validation)

- [ ] **All 17 screens (SCR-01 through SCR-17)** implemented and tested
- [ ] **All 7 user flows** functional end-to-end (integration tests passing)
- [ ] **All components** render correctly with correct test IDs (`tier-badge-plus`, `benefit-card-apy-boost`, etc.)
- [ ] **Data layer** (`lib/api.ts`) mocks all real API calls; can swap to real API without component changes
- [ ] **Benefit calculations** mathematically accurate (unit tests verify formulas)
- [ ] **Tier qualification logic** matches PRD requirements (edge cases tested)
- [ ] **Notifications** trigger at correct thresholds (balance within $500, autopay 30 days before expiration, etc.)
- [ ] **Accessibility** (WCAG 2.1 AAA): All text ≥16pt, contrast ≥7:1, touch targets ≥48×48px, keyboard navigation functional, screen reader support
- [ ] **Performance**: Lighthouse score ≥90, page load <3 seconds, no jank in animations
- [ ] **Code quality**: No axe violations, 85%+ test coverage, all TypeScript types strict, no console errors

### Business Metrics Baseline (Post-Launch Tracking)

- [ ] **Tier advancement rate**: ≥15% of Classic members reach Plus within 90 days
- [ ] **Deposit growth**: 30%+ balance increase for members advancing to Plus/Premium
- [ ] **Self-service efficiency**: 11:1 ratio (FAQ visitors per support ticket)
- [ ] **Engagement**: 40%+ increase in Loyalty Hub login frequency vs. pre-launch
- [ ] **Retention**: 25%+ improvement in 12-month retention for engaged members
- [ ] **Autopay persistence**: 92%+ maintenance (vs. 85% baseline)
- [ ] **Member satisfaction**: NPS +15 points, CSAT ≥85%

---

## CONCLUSION

This Developer Specification provides a comprehensive technical blueprint for implementing the Credit Union Loyalty Banking Experience. It synthesizes the Experience Strategy (Step 3), PRD (Step 4), and UX Spec (Step 5) into actionable development guidance.

**Immediate Next Steps**:
1. Present Mode A vs. Mode B architecture decision to stakeholders
2. Confirm backend timeline and third-party integrations
3. Begin data model review and mock data setup (Week 1)
4. Finalize design tokens and accessibility baseline
5. Set up CI/CD pipeline and testing infrastructure

A developer starting from this spec should be able to:
- Understand the complete scope (17 screens, 7 flows, 8+ components)
- Begin implementing with clear file paths, component names, and test IDs
- Integrate real APIs when ready without component refactoring
- Validate accuracy against acceptance criteria
- Measure progress against estimated complexity and timeline

---

## ✅ PIPELINE STEP 6 COMPLETE

- **Output file**: 06-dev-spec.md
- **Handoff ready for**: Step 7 (Context Sharder) / Development Sprint Planning
- **Implementation approach**: Mode A (Design-First: Next.js 14 + Tailwind + Shadcn) + Mode B (Recommended: Full-stack with Express + PostgreSQL)
- **Screens to build**: 17 (SCR-01 through SCR-17)
- **Components to build**: 8 core loyalty + 6 banking (enhanced) + 4 layout + 2 form/input + 4 notifications
- **Open questions**: 10 (all documented with recommendations)
- **Conflicts resolved**: 4 (all resolved; see Conflict Resolution Log)
- **Total estimated effort**: 164 hours core development + 60 hours testing = 224 hours (14-week sprint)
- **Ready for development**: YES

---
