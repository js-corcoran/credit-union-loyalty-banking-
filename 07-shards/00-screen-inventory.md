# Credit Union Loyalty Banking — Screen Inventory & Build Order

**Pipeline Phase**: Step 7 — Context Sharder
**Date**: February 21, 2026
**Total Screens**: 17 primary + 3 supporting routes
**Total Shards**: 13 build packages

---

## Build Order Table

| # | Screen Name | Slug | Journey Stage | Primary Personas | Priority | Build Order | Shard File | Dependencies |
|---|---|---|---|---|---|---|---|---|
| 1 | Home / Dashboard (Updated) | home-dashboard | Everyday Banking | All | P0 | 1 | 01-home-dashboard-shard.md | Auth, Member Context |
| 2 | Loyalty Hub Main | loyalty-hub | Discovery | PERSONA-02, PERSONA-04 | P0 | 2 | 02-loyalty-hub-shard.md | TierBadge, BenefitCard, API |
| 3 | Tier Details Page | tier-details | Learning | PERSONA-02 | P1 | 3 | 03-tier-details-shard.md | TierBadge, Accordion, Tab Nav |
| 4 | Account Status Detail | account-status | Understanding | PERSONA-02, PERSONA-03 | P1 | 4 | 04-account-status-shard.md | Tier calculations, Progress |
| 5 | Benefit Details Page | benefit-details | Validation | PERSONA-02, PERSONA-04 | P1 | 5 | 05-benefit-details-shard.md | BenefitCard, Calculations |
| 6 | FAQ & Search | faq-search | Support | All | P1 | 6 | 06-faq-search-shard.md | Search API, Content DB |
| 7 | Help / Support | help-support | Support | PERSONA-03 | P2 | 7 | 07-help-support-shard.md | Contact forms, Routing |
| 8 | Account Detail (Enhanced) | account-detail | Everyday Banking | All | P0 | 2 | 08-account-detail-shard.md | Benefit context, Transaction link |
| 9 | Transaction Detail (Enhanced) | transaction-detail | Validation | All | P1 | 5 | 09-transaction-detail-shard.md | Benefit earned context |
| 10 | Transfer / Move Money | transfer-initiation | Action | All | P0 | 3 | 10-transfer-initiation-shard.md | Fee waiver logic, Fee display |
| 11 | Transfer Confirmation | transfer-confirm | Action | All | P0 | 3 | 11-transfer-confirm-shard.md | Fee waiver callout |
| 12 | Autopay Management List | autopay-list | Management | PERSONA-02 | P1 | 4 | 12-autopay-list-shard.md | Autopay API, Tier contribution |
| 13 | Autopay Setup Flow | autopay-setup | Action | All | P1 | 4 | 13-autopay-setup-shard.md | Tier impact messaging |
| 14 | Autopay Removal Confirm | autopay-remove | Safety | All | P1 | 4 | 14-autopay-remove-shard.md | Tier impact warning |
| 15 | Legacy Migration Onboarding | legacy-onboarding | Transition | All | P2 | 8 | 15-legacy-onboarding-shard.md | Benefit comparison |
| 16 | Retrogression Alert | retrogression-alert | Safety (Triggered) | All | P0 | 6 | 16-retrogression-alert-shard.md | Notification system, Triggers |
| 17 | Notification Settings | notification-settings | Management | All | P2 | 7 | 17-notification-settings-shard.md | Preference storage |

---

## Shared Infrastructure

### Cross-Cutting Components (Used Across Multiple Screens)

**Loyalty-Specific Components** (built once, used in multiple shards):
- **TierBadge** — Displays current tier with color-coded icon + text (sizes: small 32px, medium 64px, large 80px)
- **TierProgressBar** — Shows progress to next tier with numeric labels and visual fill (supports balance or autopay metrics)
- **BenefitCard** — Displays benefit with icon, name, description, real-dollar value (variants: primary, locked, comparison)
- **RetrogressionAlert** — Supportive warning banner with CTA and icon (tone: helpful, not alarming)
- **TierRulesAccordion** — Expandable tier requirement details (Classic, Plus, Premium)
- **LoyaltyContextCallout** — Inline benefit context for transfers/transactions (e.g., "Fee waiver saves $2.50")
- **BenefitCalculationCard** — Shows personalized annual benefit value breakdown with transparent calculations
- **TierComparisonTable** — Side-by-side tier comparison (requirements, benefits, ROI)
- **NotificationBanner** — In-app alert container with dismiss + action CTA
- **SearchBar + FAQ Filter** — Full-text search + category browse for FAQ section

**Standard Shadcn Components** (already exist, extended for loyalty):
- Button, Card, Alert, Badge, Progress, Accordion, Tabs, Modal, Input, Form, Toast
- Accessible focus management, ARIA labels, keyboard navigation built-in

### Design System Tokens (Defined Once, Used Everywhere)

**Color Palette**:
- **Classic Tier**: `#6B7280` (gray) — background, borders, inactive states
- **Plus Tier**: `#D4A574` (gold/amber) — accent, highlights, tier-specific UI
- **Premium Tier**: `#E8E8E8` (platinum/silver) — accent, highlights, tier-specific UI
- **Positive/Success**: `#10B981` (emerald) — benefit savings, achievement messages
- **Warning/Retrogression**: `#F59E0B` (amber) — gentle alerts, approaching thresholds
- **Urgent/Risk**: `#EF4444` (red) — only for immediate tier loss risk (14-day window)
- **Neutral**: `#F3F4F6` (light gray) — backgrounds, dividers
- **Text Primary**: `#111827` (dark gray) — body text, contrast 7:1+
- **Text Secondary**: `#6B7280` (medium gray) — labels, helpers, contrast 4.5:1+
- **Accent/Link**: `#3B82F6` (blue) — navigation, actionable links

**Typography**:
- **Heading 1**: 28pt Bold (h1) — page titles
- **Heading 2**: 24pt Bold (h2) — section headers
- **Heading 3**: 20pt Bold (h3) — subsection headers
- **Body**: 16pt Regular (default for all ages, WCAG 2.1 AAA target)
- **Small**: 14pt Regular — labels, helpers (never smaller for accessibility)
- **Monospace**: 14pt (for numbers/balance displays, easier scanning)

**Spacing**:
- **Micro**: 4px (rarely used, internal component spacing)
- **Extra Small**: 8px (padding in small buttons, compact spacing)
- **Small**: 12px (padding in labels, tight spacing)
- **Base**: 16px (standard padding, margins)
- **Medium**: 24px (section spacing, medium gaps)
- **Large**: 32px (major section spacing)
- **Extra Large**: 48px (top-level section gaps, whitespace)

**Touch Targets**:
- **Minimum**: 44×44px (WCAG 2.1 AA)
- **Recommended**: 48×48px (WCAG 2.1 AAA, financial institution standard)
- **Comfortable**: 56×56px (for older demographic)

**Breakpoints**:
- **Mobile**: 320px–479px (primary breakpoint for older adults)
- **Tablet**: 480px–1024px (medium screens)
- **Desktop**: 1025px+ (large screens)
- **Container Max-Width**: 900px (prevents text lines from getting too long for readability)

**Shadows**:
- **Subtle**: `0 1px 2px rgba(0,0,0,0.05)` (card base)
- **Medium**: `0 4px 6px rgba(0,0,0,0.1)` (card hover)
- **Elevated**: `0 20px 25px rgba(0,0,0,0.15)` (modal)

### Shared Data Models

**Member Context** (available to all screens via React Context):
```typescript
{
  memberId: string;
  firstName: string;
  email: string;
  currentTier: "classic" | "plus" | "premium";
  tierChangeDate: Date;
  qualifyingAccounts: QualifyingAccount[];
  autopayStatus: AutopayStatus;
  notificationPreferences: NotificationPreferences;
}
```

**Tier Configuration** (global, fetched once):
```typescript
{
  tierId: "classic" | "plus" | "premium";
  tierName: string;
  displayColor: string;
  requirements: TierRequirements;
  benefits: Benefit[];
  gracePeriodDays: number;
}
```

**API Facade** (used by all data-fetching screens):
- `getMemberTier()` — current tier + qualification data
- `calculateBenefitValue()` — member-specific benefit ROI
- `getTierThresholdMonitor()` — days to tier loss, actions needed
- `searchFAQ()` — full-text search + category filter
- `submitNotificationPreferences()` — save user choices

### Auth & Routing Stubs

**Authentication**:
- All screens assume user is authenticated (member session available)
- Member ID passed via React Context or URL param `/member/:memberId/...`
- Protected routes redirect unauthenticated to login

**Navigation Structure**:
```
/ (Home/Dashboard)
├── /loyalty (Loyalty Hub Main)
│   ├── /loyalty/tier-details
│   ├── /loyalty/account-status
│   ├── /loyalty/benefits
│   ├── /loyalty/faq
│   └── /loyalty/support
├── /accounts/:id (Account Detail)
│   └── /transactions/:id (Transaction Detail)
├── /transfer (Transfer Initiation)
│   └── /transfer/confirm (Transfer Confirmation)
├── /autopay (Autopay Management List)
│   ├── /autopay/add (Autopay Setup)
│   └── /autopay/:id/remove (Autopay Removal)
├── /legacy-migration (First-login onboarding)
├── /settings (Notification Settings)
└── /help (Help/Support)
```

### Error Handling & Fallback States

**Tier Calculation Errors**:
- If tier cannot be calculated, show "Unable to determine your tier. Please contact support." with support link
- Fallback: assume Classic tier (conservative)

**Benefit Calculation Errors**:
- If benefit value cannot be calculated, show "Calculating your benefits..." with spinner, then retry
- Fallback: show "Benefits apply to your account. Contact support for details."

**API Timeouts**:
- Network requests timeout after 5 seconds
- Show "Loading..." state, then error message with retry button
- Offline state: show cached data if available, with "You're offline" indicator

**Missing Data**:
- If member has no qualifying accounts: "No qualifying accounts yet. Link accounts to unlock tier benefits."
- If no autopays: Show "Add an autopay to qualify for higher tiers"

---

## Build Prerequisites

### Shadcn Components to Install First

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add select
npx shadcn-ui@latest add toast
```

### Project Structure

```
credit-union-loyalty-app/
├── app/                            # Next.js 14 App Router
│   ├── layout.tsx                  # Root layout, MemberContext provider
│   ├── page.tsx                    # Home/Dashboard (SCR-01)
│   ├── loyalty/
│   │   ├── layout.tsx              # Loyalty section layout
│   │   ├── page.tsx                # Loyalty Hub Main (SCR-02)
│   │   ├── tier-details/page.tsx   # Tier Details (SCR-03)
│   │   ├── account-status/page.tsx # Account Status (SCR-04)
│   │   ├── benefits/page.tsx       # Benefit Details (SCR-05)
│   │   ├── faq/page.tsx            # FAQ & Search (SCR-06)
│   │   └── support/page.tsx        # Support (SCR-07)
│   ├── accounts/
│   │   ├── page.tsx                # Account List
│   │   └── [id]/page.tsx           # Account Detail (SCR-08)
│   ├── transactions/
│   │   └── [id]/page.tsx           # Transaction Detail (SCR-09)
│   ├── transfer/
│   │   ├── page.tsx                # Transfer Initiation (SCR-10)
│   │   └── confirm/page.tsx        # Transfer Confirmation (SCR-11)
│   ├── autopay/
│   │   ├── page.tsx                # Autopay List (SCR-12)
│   │   ├── add/page.tsx            # Autopay Setup (SCR-13)
│   │   └── [id]/remove/page.tsx    # Autopay Removal (SCR-14)
│   ├── legacy-migration/page.tsx   # Legacy Onboarding (SCR-15)
│   ├── settings/page.tsx           # Notification Settings (SCR-17)
│   └── help/page.tsx               # Help/Support (SCR-07)
│
├── components/
│   ├── loyalty/                    # Loyalty-specific components
│   │   ├── TierBadge.tsx
│   │   ├── TierProgressBar.tsx
│   │   ├── BenefitCard.tsx
│   │   ├── BenefitCalculationCard.tsx
│   │   ├── TierComparisonTable.tsx
│   │   ├── TierRulesAccordion.tsx
│   │   ├── LoyaltyContextCallout.tsx
│   │   └── SearchFAQ.tsx
│   ├── notifications/              # Alert components
│   │   ├── RetrogressionAlert.tsx
│   │   ├── NotificationBanner.tsx
│   │   └── NotificationModal.tsx
│   ├── ui/                         # Shadcn UI (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── ... (other Shadcn components)
│   └── layout/
│       ├── Header.tsx
│       ├── Navigation.tsx
│       └── Footer.tsx
│
├── lib/
│   ├── api.ts                      # API facade (mock data initially)
│   ├── calculations.ts             # Tier calc, benefit calc logic
│   ├── types.ts                    # TypeScript interfaces (Member, Tier, etc.)
│   ├── constants.ts                # Tier config, design tokens, FAQ data
│   ├── utils.ts                    # Helper functions (formatting, validation)
│   └── hooks/
│       ├── useMember.ts            # Access member context
│       ├── useTier.ts              # Tier calculations
│       ├── useBenefits.ts          # Benefit calculations
│       └── useNotifications.ts     # Notification logic
│
├── context/
│   ├── MemberContext.tsx           # Member data context
│   ├── NotificationContext.tsx     # Notification state
│   └── TierConfigContext.tsx       # Tier configuration
│
├── styles/
│   ├── globals.css                 # Global Tailwind + custom CSS
│   ├── variables.css               # CSS custom properties
│   └── accessibility.css           # A11y-specific styles
│
├── public/
│   ├── icons/                      # SVG icons (tier badges, benefits)
│   ├── images/                     # Explanatory diagrams
│   └── fonts/                      # Custom fonts (if needed)
│
├── tests/
│   ├── components/
│   │   ├── TierBadge.test.tsx
│   │   ├── BenefitCard.test.tsx
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
├── .env.local                      # Environment variables
├── tailwind.config.js              # Tailwind configuration
├── tsconfig.json                   # TypeScript config
├── next.config.js                  # Next.js config
├── jest.config.js                  # Jest testing config
└── README.md                       # Setup guide
```

### Environment Setup

```bash
# Install dependencies
npm install

# Tailwind CSS (already in Next.js 14)
npm install -D tailwindcss postcss autoprefixer

# Shadcn UI
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npx shadcn-ui@latest init

# Testing
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D cypress

# TypeScript & ESLint (usually pre-configured in Next.js)
npm install -D typescript @types/react @types/node eslint
```

### Mock Data Setup

Create `/lib/api.ts` with mock functions:

```typescript
// Mock data service (replace with real API calls later)
export async function getMemberTier(memberId: string): Promise<MemberTier> {
  // Return mock member data
  return mockMembers[memberId] || mockMembers["MEMBER-001"];
}

export async function calculateBenefitValue(
  memberId: string,
  tier: TierType
): Promise<MemberBenefitCalculation> {
  // Return mock benefit calculations
  return mockBenefits[memberId] || mockBenefits["MEMBER-001"];
}

export async function searchFAQ(query: string): Promise<FAQItem[]> {
  // Return matching FAQ items
  return mockFAQItems.filter(faq =>
    faq.question.toLowerCase().includes(query.toLowerCase()) ||
    faq.keywords.some(kw => kw.includes(query.toLowerCase()))
  );
}
```

### Design Token Configuration

Create `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    colors: {
      "tier-classic": "#6B7280",
      "tier-plus": "#D4A574",
      "tier-premium": "#E8E8E8",
      "success": "#10B981",
      "warning": "#F59E0B",
      "urgent": "#EF4444",
      "text-primary": "#111827",
      "text-secondary": "#6B7280",
      "bg-light": "#F3F4F6",
    },
    fontSize: {
      xs: ["12px", { lineHeight: "16px" }],
      sm: ["14px", { lineHeight: "20px" }],
      base: ["16px", { lineHeight: "24px" }],
      lg: ["18px", { lineHeight: "28px" }],
      xl: ["20px", { lineHeight: "28px" }],
      "2xl": ["24px", { lineHeight: "32px" }],
      "3xl": ["28px", { lineHeight: "36px" }],
    },
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "12px",
      base: "16px",
      lg: "24px",
      xl: "32px",
      "2xl": "48px",
    },
    extend: {
      minHeight: {
        touch: "48px",
      },
      minWidth: {
        touch: "48px",
      },
    },
  },
};
```

### Initial Commands

```bash
# Create Next.js project
npx create-next-app@latest credit-union-loyalty-app --typescript --tailwind

# Install Shadcn
npx shadcn-ui@latest init

# Install all Shadcn components (from list above)
npx shadcn-ui@latest add button card badge progress alert accordion tabs dialog input form popover tooltip select toast

# Create folder structure
mkdir -p {app/loyalty,app/accounts,app/transactions,app/transfer,app/autopay,components/{loyalty,notifications,ui,layout},lib,context,styles,public/{icons,images},tests/{components,lib,integration}}

# Start dev server
npm run dev
```

---

## Next Steps

- **Shard Handoff**: Each shard file (01 through 17) is self-contained, ready for a frontend engineer to build
- **Build Order**: Shards should be built in priority order (P0 first), not shard file number order
- **Parallel Development**: Shards with no dependencies can be built in parallel (e.g., SCR-03 Tier Details can be built while SCR-10 Transfer is in progress)
- **Component Reuse**: All shared components must be built in Shard 01 first, so subsequent shards can import them
- **Testing**: Each shard includes unit test stubs and integration test scenarios
- **Integration**: After all shards complete, Step 8 assembles them into a cohesive, working application with end-to-end testing

---

✅ **Screen Inventory COMPLETE**

- 17 primary screens mapped to 13 build shards
- Shared infrastructure defined (components, design tokens, data models)
- Build prerequisites documented (Shadcn installation, folder structure)
- Ready for Step 8 assembly and final integration
