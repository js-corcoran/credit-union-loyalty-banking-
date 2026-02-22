# Shard 01: Home / Dashboard (Updated)

**Build Priority**: P0 — Part of MVP foundation
**Estimated Effort**: 16 hours (includes Tech Stack setup)
**Screen ID**: SCR-01
**Route**: `/`
**Component File**: `app/page.tsx`

---

## 1. Screen Name & Route

**Full Screen Name**: Home / Dashboard (Updated)
**URL Route**: `/` (root, Next.js app/page.tsx)
**Navigation Access**: Primary entry point after login; accessible from all screens via "Home" in main navigation
**Page Title**: "Home" or "Dashboard"
**Breadcrumb**: None (root)

---

## 2. Purpose & Jobs-to-be-Done

**Primary Purpose**: Provide quick account overview with loyalty tier visibility and progress indication, enabling members to complete everyday banking tasks (view balance, transfer money) with zero added friction while optionally discovering loyalty program.

**Jobs-to-be-Done**:
1. **Check account balance** — Member needs current balance at a glance (unchanged core experience)
2. **Initiate transfer** — Member needs to move money quickly without encountering loyalty friction
3. **Discover loyalty tier** — Member (especially PERSONA-02 Optimizer) wants to see current tier and progress to next without navigating away
4. **Understand personal value** — Member (PERSONA-04 Skeptic) wants proof that their tier matters in concrete, visible form

**Design Principle Applied**: "Additive Integration" — preserve core banking flows completely unchanged; layer loyalty information through discoverable entry points. Tier badge and progress bar are optional visual layers; core account summary is untouched.

---

## 3. User Stories & Acceptance Criteria

### Story 1: Everyday Banker Views Account Summary with Tier Badge

**As a** change-averse member (PERSONA-01)
**I want to** see my account balance and recent transactions (unchanged layout)
**So that** I can complete everyday banking without additional friction or confusion

**Given** I am logged in and on the Home dashboard
**When** the page loads
**Then** I see:
- Checking account card with current balance (primary)
- Savings account card with current balance (secondary)
- "View account" and "Transfer" CTAs (unchanged)
- Recent transactions list (unchanged)
- **NEW**: Small tier badge (32×32px icon + "Plus" text label) on account card, positioned non-intrusively (top-right or below balance)

**And** the page layout is identical to pre-loyalty baseline (zero added friction in visual hierarchy)

---

### Story 2: Benefit Optimizer Discovers Tier Progress at a Glance

**As a** benefit-conscious member (PERSONA-02)
**I want to** see my current tier and progress to next tier displayed visually
**So that** I can assess my qualification status without navigating away from home

**Given** I am logged in and on the Home dashboard
**When** the page loads
**Then** I see:
- Account card includes tier badge (32×32px icon + "Plus" text)
- Below account balance: Progress bar showing "8,500 / 10,000" (current balance / next tier threshold)
- Optional: Numeric label "8,500 of 10,000 to reach Premium" (16pt text)
- Progress bar uses tier-appropriate color (gold/amber for Plus)

**And** the progress bar is clickable, linking to Loyalty Hub Main (SCR-02)

---

### Story 3: Skeptic Validates Tier Status via Visual Confirmation

**As a** skeptical member (PERSONA-04)
**I want to** see my tier badge with color and icon (clear visual differentiation)
**So that** I can instantly recognize my tier status without reading text labels

**Given** I am on the Home dashboard
**When** I look at my account card
**Then** I see:
- Tier badge with distinct color (Classic: gray, Plus: gold, Premium: silver)
- Tier icon (unique symbol for each tier)
- Tier name in text (e.g., "Plus Tier")
- Tier badge follows 48×48px minimum tap target (exceeds WCAG 2.1 AAA)

**And** the tier badge is self-explanatory without tooltip or hover state required

---

### Story 4: Member Initiates Transfer Without Loyalty Friction

**As a** member wanting to transfer money
**I want to** click "Transfer" and proceed to transfer flow (unchanged)
**So that** loyalty information does not interrupt banking workflow

**Given** I am on the Home dashboard
**When** I click the "Transfer" button
**Then** I navigate to Transfer / Move Money Initiation (SCR-10) with zero interruption or overlay

**And** the transfer flow proceeds as before; loyalty context (fee waiver) is shown at confirmation, not during initiation

---

## 4. States

### Default State
- Page fully loaded with member data
- Account balances retrieved and displayed
- Tier badge visible with current tier and color
- Progress bar showing distance to next tier
- Recent transactions list populated
- All CTAs (Transfer, View Account, View Loyalty Hub) visible and interactive

### Loading State
- Page layout displays skeleton screens (gray placeholder boxes)
- Account card shows shimmer animation (16px bar for balance)
- Progress bar shows indeterminate animation
- Recent transactions show 3 skeleton rows
- CTAs disabled until data loads

### Error State
- Account data fails to load (API timeout/error)
- Display alert: "Unable to load your account. Please try again."
- "Retry" button visible
- Tier badge and progress bar hidden (fallback: assume Classic tier, don't display)
- Recent transactions fallback: show "Unable to load transactions"
- CTAs (Transfer, View Account) disabled

### Empty State
- Member has no checking/savings accounts: "You don't have any accounts yet. Visit a branch or call us to open an account."
- No recent transactions: "Your transaction history will appear here"
- No autopay status: (displayed on Loyalty Hub instead)

### Permission Denied State
- User not authenticated: redirect to login before reaching home
- User is staff viewing member account: show "Member Account (Read-Only)" banner
- (Not applicable for member self-service)

### Offline State
- Browser detects no network connection
- Display cached account data (if available from previous session)
- Show "You're offline" indicator at top
- Disable "Transfer" and "View Loyalty Hub" CTAs (require live data)
- Enable "View Account" if cached account detail available

---

## 5. Information Architecture

### Visual Regions (Top to Bottom)

**Header Region** (fixed, 56px height):
- Left: Logo / "Home" text
- Center: Empty (clean)
- Right: Notifications icon (bell) + Settings icon (gear) + User menu (avatar dropdown)

**Tier Status Region** (prominent, non-intrusive):
- Background: Light gray or transparent
- Content: Large tier badge (medium size 64×64px) + "You're in Plus Tier" heading
- Optional: Progress bar summary ("8,500 of 10,000 to reach Premium")
- CTA: "Explore Loyalty Benefits" (link to Loyalty Hub)
- **Note**: This region is NEW but positioned above account cards, not interrupting main content

**Account Summary Region** (primary, unchanged):
- Heading: "Your Accounts"
- Card 1: Checking Account
  - Account name (e.g., "Checking")
  - Account number (masked: last 4 digits)
  - Current balance (large 24pt black text, right-aligned)
  - Tier badge (32×32px, top-right of card)
- Card 2: Savings Account (same layout)
- Card 3: Money Market (if applicable)
- CTA per card: "View Account" → link to Account Detail (SCR-08)

**Recent Transactions Region**:
- Heading: "Recent Transactions"
- List of 5 most recent transactions:
  - Merchant/description (left)
  - Amount (right, green if credit, black if debit)
  - Date (secondary text below)
  - Optional benefit earned context (e.g., "Fee waived", small green badge)
- CTA: "View all transactions" → link to Transaction History

**Action Buttons Region** (sticky or inline):
- Primary CTA: "Transfer Money" (full-width or large button, 48px height)
- Secondary CTAs: "Pay a Bill", "Request Check" (if applicable)
- All buttons ≥48×48px tap target

### Content Priority

1. **Tier Badge + Status** (NEW, but non-invasive positioning) — helps discovery, supports PERSONA-02/PERSONA-04
2. **Account Balances** (unchanged, primary focus) — critical for all personas
3. **Recent Transactions** (unchanged, secondary focus) — useful context
4. **Progress to Next Tier** (NEW, optional) — supports PERSONA-02 optimization goals
5. **Action CTAs** (unchanged, persistent) — enables everyday banking

### Progressive Disclosure

- **Tier badge** is clickable and navigates to Loyalty Hub (one-click discovery)
- **Progress bar** shows numeric label; additional details on Loyalty Hub
- **Benefit context** on transactions shown inline in this screen (no modal required)
- Tier details hidden in Tier Details page (SCR-03) for deep dive; not cluttering dashboard

---

## 6. Components & Responsibilities

### Component Tree

```
Page (app/page.tsx) — Server Component
├── Header
│   ├── Logo
│   ├── Notifications Icon (Client)
│   ├── Settings Icon (Client)
│   └── User Menu Dropdown (Client)
├── TierStatusRegion (Client) — Loyalty-Specific
│   ├── TierBadge (medium 64×64px)
│   ├── Heading "You're in Plus Tier"
│   ├── Progress Bar Summary (optional)
│   └── CTA "Explore Loyalty Benefits" → link to /loyalty
├── AccountSummaryRegion (Client)
│   ├── Heading "Your Accounts"
│   └── AccountCard × 3 (Client)
│       ├── Account name
│       ├── Account number (masked)
│       ├── Balance (large text, 24pt)
│       ├── TierBadge (small 32×32px, top-right)
│       ├── Benefit context (e.g., "APY boost applies", small text)
│       └── CTA "View Account" → /accounts/[id]
├── RecentTransactionsRegion (Client)
│   ├── Heading "Recent Transactions"
│   ├── TransactionItem × 5 (Client)
│   │   ├── Merchant / Description (left)
│   │   ├── Amount (right)
│   │   ├── Date (secondary)
│   │   ├── Benefit earned badge (if applicable)
│   │   └── CTA "View details" → /transactions/[id]
│   └── CTA "View all transactions" → /transactions
├── ActionButtonsRegion (Client, sticky)
│   ├── Button "Transfer Money" (primary, 48px)
│   ├── Button "Pay a Bill" (secondary, 48px)
│   └── Button "Request Check" (secondary, 48px)
└── Footer
    ├── Help Link
    ├── Security Link
    └── Accessibility Statement
```

### Component Responsibilities

**TierBadge** (reusable, built once in component library):
- Props: `tier` ("classic" | "plus" | "premium"), `size` ("small" | "medium" | "large"), `showLabel` (boolean)
- Responsibility: Render tier icon + text label with appropriate sizing and color
- Used in: Home Dashboard (medium), Account Detail (small), Tier Details (large)

**AccountCard** (custom component):
- Props: `accountId`, `accountName`, `balance`, `accountNumber` (masked), `tier` (for benefit context)
- Responsibility: Display account summary, render tier badge, navigate to account detail
- Accessibility: Card is clickable container; "View Account" CTA is explicit button

**TransactionItem** (custom component):
- Props: `transactionId`, `merchant`, `amount`, `date`, `benefitEarned` (optional)
- Responsibility: Display transaction summary with optional benefit context badge
- Accessibility: Item is clickable; description is large enough (16pt+)

**TierStatusRegion** (custom, loyalty-specific):
- Props: `currentTier`, `nextTierThreshold`, `currentProgress` (balance or autopay count)
- Responsibility: Display tier badge + progress summary + CTA to explore
- Accessibility: Entire region is a landmark `<section>` with `aria-label="Loyalty tier status"`

**Page (app/page.tsx)** (server component):
- Responsibility: Fetch member data (getMemberTier, getAccountSummary, getRecentTransactions)
- Render all regions with server-side data; pass to client components
- Handle loading state (streaming skeleton)
- Redirect if unauthenticated

---

## 7. Interactions

### Click Interactions

**Tier Badge** (medium 64×64px):
- Click → Navigate to `/loyalty` (Loyalty Hub Main)
- Accessible name: "Plus tier badge. Click to view loyalty benefits"

**Progress Bar**:
- Click → Navigate to `/loyalty` (Loyalty Hub Main)
- Cursor changes to pointer on hover

**"View Account" CTA** (per account card):
- Click → Navigate to `/accounts/[accountId]`
- Keyboard: Enter or Space key (button semantics)

**"Transfer Money" Button**:
- Click → Navigate to `/transfer`
- Keyboard: Tab to button, Enter to activate

**Transaction Item**:
- Click → Navigate to `/transactions/[transactionId]`
- Keyboard: Enter on focused item

**"View all transactions" CTA**:
- Click → Navigate to `/transactions`

### Keyboard Navigation

- **Tab order**: Header (Logo, Notifications, Settings, User Menu) → Tier Status CTA → Account Cards → View Account CTAs → Transaction Items → Transfer Button → Footer Links
- **Focus indicators**: All interactive elements show 2px border outline (bright blue, 7:1 contrast)
- **Enter/Space**: Activates buttons and clickable regions
- **Escape**: Closes any open dropdowns (User Menu, Notifications)

### Touch Interactions (Mobile)

- **Tier Badge tap**: Navigate to `/loyalty`
- **Account Card tap**: Navigate to `/accounts/[id]` or show account options menu
- **Transaction Item swipe**: Swipe-to-delete/archive (if implemented) or long-press for options
- **Button tap**: All buttons ≥48×48px touch target

### Focus Management

- **Page load**: Focus moves to first account card (or tier badge if prominently displayed)
- **Navigation from home**: Focus returns to home when navigating back (preserve scroll position with browser history)
- **Modal/alert dismissal**: Focus returns to triggering element (e.g., back to button that opened alert)

---

## 8. Data Contracts

### Request / Response Models

#### GET /api/member/:memberId (Fetch Member Tier & Account Summary)

**Request**:
```typescript
{
  memberId: string;  // from session
}
```

**Response** (HTTP 200 OK):
```json
{
  "memberId": "MEMBER-001",
  "firstName": "Patricia",
  "currentTier": "plus",
  "tierChangeDate": "2025-11-15",
  "qualifyingAccounts": [
    {
      "accountId": "CHK-9876",
      "accountType": "checking",
      "accountName": "Checking",
      "balance": 15000,
      "maskedAccountNumber": "****9876",
      "currentBalance": 15000,
      "rollingBalance3Month": 14500,
      "contributesToTier": ["classic", "plus", "premium"]
    },
    {
      "accountId": "SAV-5432",
      "accountType": "savings",
      "accountName": "Savings",
      "balance": 8500,
      "maskedAccountNumber": "****5432",
      "rollingBalance3Month": 8200,
      "contributesToTier": ["classic", "plus"]
    }
  ],
  "autopayStatus": {
    "totalCount": 2,
    "loanAutopay": true,
    "creditCardAutopay": false
  },
  "nextTierThreshold": {
    "minimumBalance": 25000,
    "minimumAutopay": 2,
    "tier": "premium"
  },
  "daysUntilTierLoss": null
}
```

**Error Response** (HTTP 500):
```json
{
  "error": "Unable to fetch member data",
  "code": "MEMBER_FETCH_ERROR"
}
```

#### GET /api/member/:memberId/transactions?limit=5 (Fetch Recent Transactions)

**Response** (HTTP 200 OK):
```json
{
  "transactions": [
    {
      "transactionId": "TXN-1001",
      "accountId": "CHK-9876",
      "date": "2026-02-20",
      "merchant": "Starbucks Coffee",
      "amount": -5.50,
      "description": "Debit Card Purchase",
      "category": "Food & Dining",
      "tierBenefit": null
    },
    {
      "transactionId": "TXN-1000",
      "accountId": "CHK-9876",
      "date": "2026-02-19",
      "merchant": "Transfer to Savings",
      "amount": -1000,
      "description": "Account Transfer",
      "category": "Transfer",
      "tierBenefit": {
        "benefitType": "fee-waiver",
        "benefitValue": 2.50,
        "description": "Fee waived with Plus tier"
      }
    }
  ]
}
```

### TypeScript Service Facade

**File**: `/lib/api.ts`

```typescript
// Member & Account Data
export async function getMemberTier(
  memberId: string
): Promise<MemberTierResponse> {
  const response = await fetch(`/api/member/${memberId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!response.ok) throw new Error("Failed to fetch member tier");
  return response.json();
}

export async function getRecentTransactions(
  memberId: string,
  limit: number = 5
): Promise<TransactionResponse[]> {
  const response = await fetch(
    `/api/member/${memberId}/transactions?limit=${limit}`,
    { method: "GET" }
  );
  if (!response.ok) throw new Error("Failed to fetch transactions");
  return response.json();
}

// Type definitions
interface MemberTierResponse {
  memberId: string;
  firstName: string;
  currentTier: "classic" | "plus" | "premium";
  tierChangeDate: Date;
  qualifyingAccounts: QualifyingAccount[];
  autopayStatus: AutopayStatus;
  nextTierThreshold: TierThreshold;
  daysUntilTierLoss: number | null;
}

interface QualifyingAccount {
  accountId: string;
  accountType: "checking" | "savings";
  accountName: string;
  balance: number;
  maskedAccountNumber: string;
  rollingBalance3Month: number;
  contributesToTier: ("classic" | "plus" | "premium")[];
}

interface TransactionResponse {
  transactionId: string;
  accountId: string;
  date: string;
  merchant: string;
  amount: number;
  description: string;
  category: string;
  tierBenefit?: {
    benefitType: "apy-boost" | "fee-waiver" | "third-party-rewards";
    benefitValue: number;
    description: string;
  };
}
```

### Mock Data (Initial Development)

**File**: `/lib/api.ts` (mock implementation)

```typescript
const mockMember: MemberTierResponse = {
  memberId: "MEMBER-001",
  firstName: "Patricia",
  currentTier: "plus",
  tierChangeDate: new Date("2025-11-15"),
  qualifyingAccounts: [
    {
      accountId: "CHK-9876",
      accountType: "checking",
      accountName: "Checking",
      balance: 15000,
      maskedAccountNumber: "****9876",
      rollingBalance3Month: 14500,
      contributesToTier: ["classic", "plus", "premium"]
    },
    {
      accountId: "SAV-5432",
      accountType: "savings",
      accountName: "Savings",
      balance: 8500,
      maskedAccountNumber: "****5432",
      rollingBalance3Month: 8200,
      contributesToTier: ["classic", "plus"]
    }
  ],
  autopayStatus: { totalCount: 2, loanAutopay: true, creditCardAutopay: false },
  nextTierThreshold: {
    minimumBalance: 25000,
    minimumAutopay: 2,
    tier: "premium"
  },
  daysUntilTierLoss: null
};

const mockTransactions: TransactionResponse[] = [
  {
    transactionId: "TXN-1001",
    accountId: "CHK-9876",
    date: "2026-02-20",
    merchant: "Starbucks Coffee",
    amount: -5.50,
    description: "Debit Card Purchase",
    category: "Food & Dining",
    tierBenefit: null
  },
  {
    transactionId: "TXN-1000",
    accountId: "CHK-9876",
    date: "2026-02-19",
    merchant: "Transfer to Savings",
    amount: -1000,
    description: "Account Transfer",
    category: "Transfer",
    tierBenefit: {
      benefitType: "fee-waiver",
      benefitValue: 2.50,
      description: "Fee waived with Plus tier"
    }
  }
];

export async function getMemberTier(memberId: string): Promise<MemberTierResponse> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockMember;
}

export async function getRecentTransactions(
  memberId: string,
  limit: number = 5
): Promise<TransactionResponse[]> {
  await new Promise(resolve => setTimeout(resolve, 150));
  return mockTransactions.slice(0, limit);
}
```

### Future API Endpoints (Production)

- **GET `/api/v1/member/:memberId`** — Full member profile with tier
- **GET `/api/v1/member/:memberId/accounts`** — List of accounts with balances
- **GET `/api/v1/member/:memberId/transactions?accountId=&limit=&offset=`** — Paginated transaction history
- **GET `/api/v1/member/:memberId/tier-status`** — Current tier + next tier info

---

## 9. Validation Rules

### Member Data Validation

- **Member ID**: Required, non-empty string (8–16 alphanumeric characters)
- **Account Balance**: Number ≥ 0, formatted to 2 decimal places (e.g., "$15,000.50")
- **Tier**: One of "classic", "plus", "premium"
- **Transaction Date**: Valid ISO 8601 date; must not be in future

### Display Validation

- **Balance Display**: If balance > $1M, show "Your balance" instead of exact amount (for security); offer "View full balance" link
- **Tier Badge**: If tier cannot be determined, default to Classic (fallback)
- **Progress Bar**: If next tier threshold cannot be calculated, show "Loading tier info..." and retry
- **Recent Transactions**: If list is empty, show "No recent transactions" message; don't show empty list

### Error Handling

- **API timeout** (5 seconds): Show error message "Unable to load your account. Please try again." + Retry button
- **Network error**: If offline, show cached data with "You're offline" indicator
- **Malformed response**: Log error to monitoring service; show generic error message to user

---

## 10. Visual & Responsive Rules

### Design Tokens Applied

**Colors**:
- Account cards: White background (`#FFFFFF`), light gray border (`#E5E7EB`)
- Tier badge: Color-coded per tier (Classic: `#6B7280`, Plus: `#D4A574`, Premium: `#E8E8E8`)
- Balance text: Dark gray (`#111827`), 24pt Bold
- Secondary text (date, account number): Medium gray (`#6B7280`), 14pt Regular
- Links: Blue (`#3B82F6`), underline on hover
- Buttons: Background color per tier, white text, 48px minimum height

**Typography**:
- Page title: 28pt Bold (`h1`)
- Section headings: 24pt Bold (`h2`)
- Account card heading: 16pt Bold
- Account balance: 24pt Bold (scannable)
- Body text: 16pt Regular (WCAG 2.1 AAA baseline for all ages)
- Labels: 14pt Regular (secondary)
- Links: 16pt Blue underline

**Spacing**:
- Page padding: 16px on mobile, 24px on tablet/desktop (container max-width 900px)
- Account card margin: 12px bottom (16px on tablet/desktop)
- Between sections: 32px (large vertical spacing for visual breathing room)
- Tier badge position: 8px from top-right of account card

**Shadows**:
- Account card: Subtle shadow `0 1px 2px rgba(0,0,0,0.05)` (light elevation)
- Account card hover: Medium shadow `0 4px 6px rgba(0,0,0,0.1)` (interactive feedback)

### Responsive Breakpoints

**Mobile (320px–479px)**:
- Full-width account cards (minus 16px padding)
- Tier badge positioned top-right of account card (32×32px)
- Button full-width or stacked vertically
- Balance text: 22pt (slightly smaller for mobile)
- Section headings: 20pt

**Tablet (480px–1024px)**:
- Account cards max-width 400px, displayed in grid (1–2 columns)
- Tier badge: 48×48px (larger)
- Buttons: 48px height, horizontal layout if space allows
- Balance text: 24pt
- Section headings: 24pt

**Desktop (1025px+)**:
- Account cards max-width 350px, displayed in grid (2–3 columns)
- Tier status section: Full-width banner above account cards
- Tier badge: 64×64px (large)
- Progress bar: Wider display with clear numeric labels
- Buttons: Inline layout with primary CTA prominent
- Container max-width: 900px (prevents long text lines)

### Touch Target Sizing

- All interactive elements: ≥48×48px (financial institution standard)
- Tier badge: 32×32px minimum (fits in account card), 64×64px in dedicated region
- Account card tap target: Full card is clickable (min 200×100px)
- Transaction item tap target: Full row is clickable (min 300×60px)
- Button tap target: ≥48×48px

### Layout Behavior

- **Account cards**: Scroll horizontally on very small mobile if needed (but prefer single column)
- **Transaction list**: Always single column (full-width, easy scrolling)
- **Action buttons**: Sticky footer or inline, depending on content height
- **Sticky header**: Fixed 56px header with logo, notifications, settings
- **Scroll position preservation**: Browser history maintains scroll position when navigating back

---

## 11. Accessibility Checklist

### Semantic HTML

- Page uses `<header>`, `<main>`, `<section>`, `<article>`, `<footer>` landmarks
- Account card is `<section>` with `<h2>` heading per card (e.g., "Checking Account")
- Button elements are semantic `<button>` tags, not `<div>` or `<a>` (for keyboard accessibility)
- Tier badge includes `aria-label="Plus tier badge"` if icon-only

### ARIA Labels & Roles

- Tier badge: `aria-label="Plus tier. Click to view loyalty benefits"`
- Progress bar: `role="progressbar"`, `aria-valuenow="8500"`, `aria-valuemin="2500"`, `aria-valuemax="10000"`, `aria-label="Balance progress to Premium tier"`
- Account balance: Large, high-contrast text (≥18pt, 7:1 contrast); no ARIA needed if text is clear
- Transaction item: If clickable container, `role="button"` and keyboard navigation support
- Page region: Tier status region has `aria-label="Your loyalty tier status"`

### Focus Management & Indicators

- All interactive elements have visible focus indicators (2px outline, blue `#3B82F6`, 7:1 contrast)
- Focus order: Header → Tier Status → Account 1 → Account 2 → Account 3 → Recent Transactions → Action Buttons → Footer
- Focus trap: None; user can tab through entire page sequentially
- Skip links: Optional "Skip to main content" link (hidden until focused)

### Color Contrast

- Balance text: 24pt Bold dark gray on white: **12:1 contrast** ✅
- Secondary text (14pt): Medium gray on white: **4.5:1 contrast** (WCAG 2.1 AA) ✅
- Button text: White on tier-color background: **7:1 contrast minimum** (WCAG 2.1 AAA) ✅
- Tier badge: Icon is color-coded, but accompanied by text label (not color-alone) ✅

### Text Alternatives

- Tier badge icon: `alt="Plus tier icon"` (if `<img>`), or `aria-label` (if `<svg>` or CSS icon)
- Account icon: Not needed (account type indicated by text label)
- Transaction category icon: `aria-label="Food and Dining"` if icon-only

### Keyboard Navigation

- **Tab**: Move forward through focusable elements
- **Shift+Tab**: Move backward
- **Enter/Space**: Activate buttons
- **Arrow keys**: If scrollable list, arrow keys can navigate (optional enhancement)
- No keyboard traps; all interactive elements accessible via Tab

### Screen Reader Support

- Page title: "Home - Credit Union Banking"
- Landmarks announced: "Navigation", "Main content", "Complementary"
- Account card heading: "Checking Account" announced before card content
- Balance announced: "Your balance is $15,000"
- Link announcements: "Transfer Money, button" (semantic button)
- Tier badge announced: "Plus tier badge, button" (if clickable)

### Mobile Accessibility (Touch)

- Minimum tap target: 48×48px (all buttons, tier badge, account cards)
- Account card: Full card is tappable (≥60px height recommended)
- Transaction item: Full row is tappable (≥56px height)
- No small links or buttons that require precise tapping

### Cognitive Load Management

- Simple language: "Your balance" not "Account balance on record"
- Consistent terminology: "Plus Tier" throughout (not "Gold" or "Level 2")
- Limited choices: 3 account cards max per screen (no scrolling list)
- Visual hierarchy: Balance is largest, tier is prominent but secondary
- Progressive disclosure: Deep details hidden in linked screens (Loyalty Hub, Account Detail)

---

## 12. Telemetry

### Analytics Events

**Page Load**:
- `event: "page_view"`
- `page: "home"`
- `timestamp: ISO 8601`
- `userId: memberId`
- `userTier: currentTier`

**Tier Badge Interaction**:
- `event: "tier_badge_click"`
- `source: "home_dashboard"`
- `tier: currentTier`
- `timestamp: ISO 8601`

**Transfer Initiation**:
- `event: "transfer_start"`
- `source: "home_dashboard"`
- `timestamp: ISO 8601`

**View Account Click**:
- `event: "account_detail_click"`
- `accountId: accountId`
- `accountType: "checking" | "savings"`
- `source: "home_dashboard"`

**View Transaction Click**:
- `event: "transaction_detail_click"`
- `transactionId: transactionId`
- `hasBenefitContext: boolean` (did transaction include loyalty benefit?)
- `source: "home_dashboard"`

**Error State**:
- `event: "error_loading_member_data"`
- `errorCode: error.code`
- `timestamp: ISO 8601`

### Error Tracking

- Sentry or equivalent: Log API failures, timeouts, malformed responses
- Monitoring: Track API response times (alert if > 2 seconds)
- Dashboard: Track page load time (target < 2 seconds)

---

## 13. Open Questions & Assumptions

### Questions for Product/Design

1. **Tier Status Prominence**: Should tier status be a dedicated banner above account cards, or integrated into account cards themselves? (Current design: dedicated banner; can be adjusted)
2. **Progress Metric**: Should progress bar show balance OR autopay count? Or toggle between them? (Current: balance shown by default)
3. **Legacy Members**: For members migrating from old program, should tier badge show "New Plus Tier" vs. "Old Gold Tier" comparison? (Current: assume new tier only)
4. **Notification Bell**: Should notifications show loyalty-specific alerts (tier loss risk, autopay expiration)? (Current: assumption yes; design pending)

### Assumptions

1. **Member is authenticated**: Page assumes valid JWT token in session; redirect if missing
2. **Account balances are live**: Data fetched at page load; not real-time streaming (production can implement WebSocket if needed)
3. **Tier calculation is stable**: Tier doesn't change mid-page-load (handled in backend)
4. **Recent transactions are sortable**: Sorted by date DESC; 5 most recent shown
5. **Tier badge is always visible**: Even if member is in Classic tier (don't hide low-value tier)
6. **Mobile is primary breakpoint**: Design optimized for 375px width (typical smartphone)
7. **No account linking**: Member has pre-configured accounts; this screen doesn't add/remove accounts

---

## 14. Design Rationale (Three-Experts Synthesis)

**UX Lead Perspective**:
- Tier badge and progress bar are placed prominently but don't interrupt core banking workflow (additive integration principle)
- Account cards remain the primary focus; loyalty information is optional secondary layer
- Progress bar includes numeric labels, not just visual fill (accessible, actionable for all cognitive styles)
- One-click access to Loyalty Hub from tier badge supports discovery without navigation friction

**Frontend Architect Perspective**:
- Page is server-side rendered (Next.js `app/page.tsx`) to optimize for performance and SEO
- Member context fetched on server, passed to client components; no waterfall requests
- All interactive components use client directives (`'use client'`) only where needed (buttons, dropdowns)
- Component tree is flat and simple; minimal re-renders on state updates
- Reusable TierBadge component built once, imported by multiple screens (DRY principle)

**Product/Delivery Perspective**:
- Home dashboard is P0 priority; must launch in MVP with zero regressions in everyday banking
- Tier badge visibility supports key success metric: 70% of Plus/Premium members aware of tier status
- Progress bar supports PERSONA-02 goal: 40% of Classic-eligible members add autopay within 60 days
- Home screen is high-traffic entry point; performance optimization critical (target < 2 second load)
- Telemetry tracks engagement with tier discovery; data informs phase 2 loyalty features (benefit notifications, tier alerts)

---

## 15. Cursor-Claude Ready Build Plan

### File Structure (to create)

```
app/
├── page.tsx                         # Home dashboard server component
├── layout.tsx                       # Root layout (MemberContext, Header, Footer)
├── error.tsx                        # Error boundary
└── loading.tsx                      # Streaming skeleton UI

components/
├── loyalty/
│   ├── TierBadge.tsx               # Reusable tier badge (small, medium, large)
│   └── TierProgressBar.tsx         # Reusable progress bar with numeric labels
├── home/
│   ├── TierStatusRegion.tsx        # Tier badge + progress summary + CTA
│   ├── AccountSummaryRegion.tsx    # Account cards with balances
│   └── RecentTransactionsRegion.tsx # Transaction list with benefit context
└── ui/
    └── Button.tsx                   # Shadcn button (already installed)

lib/
├── api.ts                           # Mock API (getMemberTier, getRecentTransactions)
├── types.ts                         # TypeScript interfaces
└── utils.ts                         # Format balance, calculate progress, etc.

tests/
├── components/
│   ├── TierBadge.test.tsx
│   └── TierProgressBar.test.tsx
├── pages/
│   └── home.test.tsx
└── integration/
    └── home-dashboard-flow.test.tsx
```

### Mock Setup

1. **Create mock data** in `lib/api.ts` with hardcoded MemberTierResponse and TransactionResponse
2. **Create mock API function** that simulates 200ms delay (realistic network latency)
3. **Provide 2–3 member variants** for testing (PERSONA-01, PERSONA-02, PERSONA-04)

### Test Stubs (to implement)

```typescript
// tests/pages/home.test.tsx
describe("Home Dashboard", () => {
  test("renders account cards with tier badge", () => {
    // Render <Page /> with mock data
    // Assert: account balances displayed
    // Assert: tier badge visible with correct color
  });

  test("displays progress bar to next tier", () => {
    // Render dashboard for member in Plus tier
    // Assert: progress bar shows "8,500 / 10,000"
    // Assert: progress bar is clickable, links to /loyalty
  });

  test("navigates to transfer flow without loyalty friction", () => {
    // Render dashboard
    // Click "Transfer" button
    // Assert: navigates to /transfer (not /loyalty)
  });

  test("shows benefit context for transactions with earned benefits", () => {
    // Render dashboard with transaction that has tierBenefit
    // Assert: benefit badge shown (e.g., "Fee waived")
  });

  test("handles loading state with skeleton UI", () => {
    // Render page with loading state
    // Assert: skeleton screens visible
    // Assert: no layout shift on load
  });

  test("handles error state gracefully", () => {
    // Mock API to return error
    // Render dashboard
    // Assert: error message displayed
    // Assert: "Retry" button visible and functional
  });
});
```

### Component Build Checklist

- [ ] Create `app/page.tsx` (server component, fetch member data)
- [ ] Create `app/layout.tsx` (root layout, MemberContext provider)
- [ ] Create `components/loyalty/TierBadge.tsx` (reusable, size + color variants)
- [ ] Create `components/loyalty/TierProgressBar.tsx` (reusable, numeric labels)
- [ ] Create `components/home/TierStatusRegion.tsx` (region composition)
- [ ] Create `components/home/AccountSummaryRegion.tsx` (account cards)
- [ ] Create `components/home/RecentTransactionsRegion.tsx` (transaction list)
- [ ] Implement `lib/api.ts` with mock getMemberTier() and getRecentTransactions()
- [ ] Implement `lib/utils.ts` with formatBalance(), calculateProgress(), etc.
- [ ] Add CSS/Tailwind styling (colors, spacing, breakpoints)
- [ ] Implement responsive design (mobile, tablet, desktop)
- [ ] Add accessibility ARIA labels, focus management, contrast validation
- [ ] Implement error boundary in `app/error.tsx`
- [ ] Create unit tests for TierBadge, TierProgressBar
- [ ] Create page integration tests for home dashboard flow
- [ ] Deploy to staging environment for QA

---

## TECH STACK SETUP (Included in Shard 01)

### Project Bootstrap

```bash
# Create Next.js 14 app with TypeScript, Tailwind, ESLint
npx create-next-app@latest credit-union-loyalty-app \
  --typescript \
  --tailwind \
  --eslint \
  --no-git

cd credit-union-loyalty-app

# Install Shadcn UI
npx shadcn-ui@latest init

# Install required Shadcn components
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

# Install testing dependencies
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D cypress
npm install -D @testing-library/user-event

# Install analytics & monitoring (optional for MVP)
npm install @sentry/nextjs
```

### Environment Variables (.env.local)

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
API_BASE_URL=http://localhost:3000/api

# Feature Flags
NEXT_PUBLIC_LOYALTY_ENABLED=true
NEXT_PUBLIC_MOCK_DATA=true

# Analytics (optional)
NEXT_PUBLIC_SENTRY_DSN=

# Member Context (for development)
NEXT_PUBLIC_MOCK_MEMBER_ID=MEMBER-001
```

### Folder Structure Setup

```bash
mkdir -p app/{loyalty,accounts,transactions,transfer,autopay,legacy-migration,settings,help}
mkdir -p components/{loyalty,notifications,ui,layout,home}
mkdir -p lib/hooks
mkdir -p context
mkdir -p styles
mkdir -p public/{icons,images,fonts}
mkdir -p tests/{components,lib,integration,pages}
```

### Tailwind Configuration (tailwind.config.js)

```javascript
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
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
      white: "#FFFFFF",
      transparent: "transparent",
      black: "#000000",
      blue: { 500: "#3B82F6" },
      gray: {
        50: "#F9FAFB",
        100: "#F3F4F6",
        200: "#E5E7EB",
        300: "#D1D5DB",
        400: "#9CA3AF",
        500: "#6B7280",
        600: "#4B5563",
        700: "#374151",
        800: "#1F2937",
        900: "#111827",
      },
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
      minHeight: { touch: "48px" },
      minWidth: { touch: "48px" },
      boxShadow: {
        subtle: "0 1px 2px rgba(0,0,0,0.05)",
        medium: "0 4px 6px rgba(0,0,0,0.1)",
        elevated: "0 20px 25px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [],
};
```

### TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,

    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,

    "moduleResolution": "node",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "noEmit": true
  },
  "include": ["app", "components", "lib", "context", "tests"],
  "exclude": ["node_modules"]
}
```

### Jest Configuration (jest.config.js)

```javascript
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

module.exports = createJestConfig({
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
});
```

### package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest --watch",
    "test:ci": "jest --ci --coverage",
    "test:e2e": "cypress open",
    "test:e2e:headless": "cypress run"
  }
}
```

### Development Workflow

```bash
# 1. Start development server
npm run dev
# Open http://localhost:3000

# 2. Create feature branch
git checkout -b feature/home-dashboard

# 3. Build component (follow Cursor-Claude Build Plan)
# 4. Run tests
npm run test

# 5. Build & check for errors
npm run build

# 6. Push to staging
git add .
git commit -m "feat: implement home dashboard with tier badge"
git push origin feature/home-dashboard

# 7. QA testing on staging
# 8. Merge to main
```

---

✅ **SHARD 01 COMPLETE — Ready for Frontend Build**
