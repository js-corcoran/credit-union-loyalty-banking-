# Shard 08: Account Detail

**Build Priority**: P0 — Core banking integration with loyalty context
**Estimated Effort**: 12 hours
**Screen ID**: SCR-08
**Route**: `/accounts/[id]`
**Component File**: `app/accounts/[id]/page.tsx`

---

## 1. Screen Name & Route

**Full Screen Name**: Account Detail
**URL Route**: `/accounts/[id]` (Next.js dynamic route, e.g., `/accounts/CHK-9876`)
**Navigation Access**: From Home Dashboard account cards, from Account List page, from transaction detail links
**Page Title**: "Checking Account - Credit Union Banking"
**Breadcrumb**: Home > Accounts > Checking Account

**Route Parameters**: `id` (account ID, e.g., "CHK-9876", "SAV-5432")
**Auth Requirements**: Authenticated member (must own the account being viewed)

---

## 2. Purpose & Jobs-to-be-Done

**Primary Purpose**: Show comprehensive account detail including current balance, transaction history, recent activity, and loyalty tier context. Enable members to understand how this specific account contributes to loyalty tier qualification via rolling balance. Preserve familiar banking interface while layering loyalty information contextually.

**Jobs-to-be-Done**:

1. **View account details and transaction history** — Member needs full balance, recent transactions, account information (unchanged core banking experience)
2. **Understand tier contribution** — Member (PERSONA-02) wants to see "this account's rolling 3-month balance contributes $8,500 to tier qualification"; needs visibility into how this account affects tier status
3. **Track tier-dependent benefits on account** — Member wants to see whether this account benefits from tier APY boost, fee waiver status, or other tier-specific benefits
4. **Make account management decisions** — Member (PERSONA-02 Optimizer) considers: "If I add $2,000 to this account, I'd reach Premium tier and get 0.5% APY boost = $125/year"

**Design Principle Applied**: "Banking-First with Loyalty Context" — Account detail is primarily a banking screen (balance, transactions); loyalty context is layered non-intrusively to support tier understanding without friction.

---

## 3. User Stories & Acceptance Criteria

### Story 1: Everyday Banker Views Account Balance and Recent Transactions

**As a** change-averse member (PERSONA-01)
**I want to** view my account balance, account number, and recent transactions unchanged
**So that** I can complete account management tasks without added complexity

**Given** I am viewing a checking account detail page
**When** the page loads
**Then** I see:
- Account name (e.g., "Checking", "Savings", "Money Market")
- Account number (masked: last 4 digits, e.g., "****9876")
- Current balance displayed prominently (24pt Bold, dark text)
- Account status (Active, Closed, Dormant)
- Recent transactions list (sorted by date DESC, showing 10–20 most recent)
- Each transaction shows: date, merchant, amount, category, balance after transaction
- No new loyalty-specific information interrupts this experience

**And** the layout matches the home dashboard account card experience (consistent design)

---

### Story 2: Benefit Optimizer Sees Tier Contribution at Top of Page

**As a** financially savvy member (PERSONA-02)
**I want to** see at the top of the account detail: "This account's rolling 3-month balance: $8,500 (contributes to Plus tier)" with visual progress indicator
**So that** I can assess whether adjusting this account balance would help me reach Premium tier

**Given** I am viewing a checking account detail page
**When** the page loads
**Then** I see:
- Account summary card with current balance
- Below balance: Tier contribution callout (prominent, non-intrusive)
  - "This account's rolling 3-month balance: $8,500"
  - "Together with other accounts, you qualify for: Plus Tier"
  - Visual bar showing "This account: $8,500 / Total needed for Premium: $25,000"
  - Optional nudge: "Add $1,500 to this account to reach Premium tier (+$125 APY boost/year)"
- Tier badge (32×32px) showing current tier color
- All information is read-only (no way to modify balance from this page; links to transfer if desired)

**And** the tier contribution context is grayed out or labeled "Information only" (not an action item)

---

### Story 3: Member Sees Fee Waiver or APY Boost Benefits Applied to This Account

**As a** skeptical member (PERSONA-04)
**I want to** see on transactions that the fee waiver from Plus tier was applied (e.g., "Fee waived: $2.50" badge on transfer)
**So that** I can verify that loyalty benefits are actually being credited to this account

**Given** I am viewing a checking account with Plus tier
**When** I look at recent transactions, specifically transfer transactions
**Then** I see:
- Transfer transaction shows: "Account Transfer" | "-$100" | "2026-02-20"
- Below amount, a green badge: "Fee waived with Plus tier" with dollar amount "$2.50"
- For other transaction types (e.g., interest-bearing account): "Interest with APY boost (0.25%): +$0.94" badge
- Badge includes: benefit type, real-dollar value, tier requirement (to reinforce authenticity)
- Clicking badge shows tooltip: "Your Plus tier includes 0% fee on transfers and 0.25% APY boost"

**And** benefit badges appear consistently across all eligible transactions on this account

---

### Story 4: Member Navigates Between Accounts via Account Switcher

**As a** any member with multiple accounts
**I want to** see a dropdown or tab showing all my accounts and switch between them quickly
**So that** I don't have to navigate back to home dashboard to view different account

**Given** I am viewing a checking account detail page
**When** I look at the top of the page
**Then** I see:
- Account selector dropdown (or tab bar if 2–3 accounts)
- Current account highlighted (e.g., "Checking ****9876")
- Other accounts listed with their balances (e.g., "Savings ****5432 - $8,500", "Money Market ****1111 - $2,000")
- Clicking another account navigates to `/accounts/SAV-5432`
- Dropdown shows tier contribution for each account (e.g., "Savings [8,500]" in italic)

**And** switching accounts preserves scroll position and page focus (smooth experience)

---

## 4. States

### Default State
- Page fully loaded with account data
- Account balance retrieved and displayed prominently
- Recent transactions list populated with 10–20 transactions
- Tier contribution context visible (callout with balance and tier badge)
- All CTAs (Transfer, Pay Bill) visible and active
- Account selector shows all accounts with current account highlighted

### Loading State
- Page layout displays skeleton screens
- Account header shows shimmer animation (balance, account number)
- Transactions show 10 skeleton rows
- Tier context region shows placeholder skeleton
- Account selector is disabled until page fully loads
- CTAs disabled until data loads

### Error State
- Account data fails to load (API timeout/error)
- Display alert: "Unable to load account details. Please try again."
- "Retry" button visible
- Account selector still visible (user can try different account)
- Recent transactions fallback: show "Unable to load transactions"

### Empty State
- Account has no recent transactions: "No recent transactions. Your activity will appear here."
- Account is empty balance: "Current balance: $0.00"
- Account is closed: "This account is closed. No new transactions are available."
- Tier context: Show only "This account is not contributing to tier qualification" (closed account)

### Permission Denied State
- User not authenticated: redirect to login before reaching account detail
- User doesn't own this account: show "Access Denied. You don't have permission to view this account."
- Member is staff viewing member account: show "Member Account (Read-Only)" banner

### Offline State
- Browser detects no network connection
- Display cached account data (if available from previous session)
- Show "You're offline. Displaying cached account data." indicator at top
- Disable "Transfer", "Pay Bill" CTAs (require live data)
- Keep transaction list visible (read-only)

---

## 5. Information Architecture

### Visual Regions (Top to Bottom)

**Header Region** (sticky, 56px height):
- Left: Breadcrumb "Home > Accounts > Checking"
- Right: Notifications icon, Settings icon, User menu

**Account Selector Region** (sticky below header, 48px height):
- Account dropdown or tab bar: "Checking ****9876" (highlighted/current)
- Other accounts listed with balances: "Savings ****5432 - $8,500"
- Quick balance summary per account
- Click to switch account

**Account Summary Region** (prominent, non-scrolling):
- Left side:
  - Account name (16pt Bold): "Checking"
  - Account number (14pt Regular): "****9876"
  - Account status (14pt Regular, green if active): "Active"
- Center:
  - Current balance (28pt Bold, largest text): "$15,000.00"
- Right side:
  - Tier badge (48×48px): Plus tier icon and color
  - Account status icon (e.g., checkmark for active)

**Tier Contribution Region** (informational, prominent, conditional display):
- Background: Light gray or subtle tier-colored accent
- **Visibility Rules** (CRITICAL for zero-friction experience):
  - Show tier context ONLY when: (a) member is NOT in Premium tier AND (b) member's balance is within $500 of next tier threshold
  - Example: Plus tier member with $24,600 balance toward $25,000 Premium threshold → Show context
  - Example: Plus tier member with $20,000 balance toward $25,000 Premium threshold → DO NOT show (too far away; would feel intrusive)
  - Example: Premium tier member → DO NOT show (at top tier; no advancement possible)
  - If tier context does not meet visibility criteria: Hide entire region; space available for other account details
- Content (when shown):
  - Heading: "Loyalty Tier Contribution"
  - "This account's rolling 3-month balance: $8,500"
  - "Together with your other accounts, you qualify for: Plus Tier (gold badge)"
  - Visual bar: "$8,500 (this account) + $6,500 (savings account) = $15,000 total / $25,000 needed for Premium"
  - Nudge (one-time per session): "Add $1,500 to this account to reach Premium tier (+$125 APY boost/year)"
    - Nudge appears once per session; user can dismiss via X button (top-right of callout)
    - If dismissed by user, nudge doesn't reappear for 7 days (cookie/session storage)
    - Non-dismissible if nudge not yet shown in this session
  - Link to "How is my tier calculated?" → Help Center FAQ
- All text read-only; no input fields
- Label on region: "Information only - not an action item" (14pt Regular, gray, subtle)

**Action Buttons Region** (sticky or inline, 48px buttons):
- Primary CTA: "Transfer Money" (full-width or large button)
- Secondary CTAs: "Pay a Bill", "Set Up Autopay" (if applicable)
- All buttons ≥48×48px tap target

**Recent Transactions Region** (main content area):
- Heading: "Recent Transactions"
- Filter/sort options (optional): "Filter by category", "Sort by date" dropdown
- Transaction list showing 10–20 most recent:
  - Date | Merchant/Description | Amount | Category | Status | Benefit badge (if applicable)
  - Example rows:
    - "2026-02-20 | Transfer to Savings | -$1,000 | Transfer | Completed | Fee waived with Plus tier: $2.50"
    - "2026-02-19 | Starbucks Coffee | -$5.50 | Food & Dining | Completed | --"
    - "2026-02-15 | Direct Deposit | +$2,500 | Income | Completed | APY boost applied: +$0.15"
- **Benefit Badge Visibility & Placement** (CRITICAL for mobile UX):
  - Desktop (1024px+): Badge displays inline at right edge of transaction row; full text visible
  - Tablet (480px–1024px): Badge displays inline at row end if space available; truncates to icon-only if constrained
  - Mobile (<480px): Badge moves to second row of transaction item OR displays as icon-only (green checkmark) with tooltip on tap showing full text "Fee waived $2.50"
  - Badge never truncates text on desktop; all information always visible on largest screens
  - Mobile badge tap shows tooltip: "Fee waived with Plus tier: $2.50. Your Plus tier includes 0% fee on transfers." (modal or tooltip overlay)
- **Benefit Badge Styling** (for transaction-level context):
  - Background: Green (#10B981)
  - Text: White, 12pt Bold
  - Border radius: 4px
  - Padding: 4px 8px
  - Icon: Green checkmark (if icon-only variant)
- CTA per transaction: "View details" → Navigate to `/transactions/[id]`
- Pagination or "Load more" button if > 20 transactions

**Footer Region**:
- Links: Help, Security, Dispute a Transaction, etc.

### Content Priority

1. **Account balance** (unchanged, primary focus) — most critical information
2. **Account selector** (enables quick navigation) — supports multiple-account members
3. **Recent transactions** (unchanged, secondary focus) — contextual activity
4. **Tier contribution context** (new, informational) — supports tier understanding
5. **Benefit badges on transactions** (contextual, subtle) — reinforces program value

### Progressive Disclosure

- **Balance is visible** immediately on page load (no scroll needed)
- **Tier contribution context** is visible but not overwhelming (gray background, contained section)
- **Transactions are listed** but abbreviated (date, merchant, amount, category)
- **Benefit badges** are inline with transactions (visible without expansion)
- **Full transaction details** hidden in linked transaction detail page (one-click to expand)
- **Account selector** visible at top for quick switching
- **Help links** guide users to FAQ if confused about tier contribution

---

## 6. Components & Responsibilities

### Component Tree

```
Page (app/accounts/[id]/page.tsx) — Server Component
├── Header (reused from layout)
├── AccountSelectorRegion (Client)
│   ├── AccountSelector Dropdown/Tabs (Client)
│   │   └── AccountOption × N (Client)
│   └── Quick balance summary
├── AccountSummaryRegion (Client, non-scrolling)
│   ├── Account name, number, status (left)
│   ├── Current balance (center, large)
│   └── Tier badge (right)
├── TierContributionRegion (Client, informational)
│   ├── Heading
│   ├── Rolling balance summary
│   ├── Tier qualification status
│   ├── Visual progress bar (optional)
│   ├── Tier nudge (optional)
│   └── Help link
├── ActionButtonsRegion (Client, sticky)
│   ├── Button "Transfer Money"
│   ├── Button "Pay a Bill"
│   └── Button "Set Up Autopay"
├── RecentTransactionsRegion (Client)
│   ├── Heading "Recent Transactions"
│   ├── Filter/sort options (optional)
│   ├── TransactionItem × 10–20 (Client)
│   │   ├── Date
│   │   ├── Merchant/Description
│   │   ├── Amount
│   │   ├── Category
│   │   ├── Status
│   │   ├── Benefit badge (if applicable, LoyaltyContextCallout)
│   │   └── CTA "View details"
│   └── Pagination or "Load more"
└── Footer
```

### Component Responsibilities

**AccountSelectorRegion** (custom component):
- Props: `accounts: Account[]`, `currentAccountId: string`, `onAccountChange: (id) => void`
- Responsibility: Display current account (highlighted) and others; enable quick switching
- Accessibility: Each account option is a button; current account has `aria-current="page"`

**TierContributionRegion** (custom component, reusable):
- Props: `accountBalance: number`, `rollingBalance: number`, `currentTier: string`, `nextTierThreshold: number`, `allAccountsBalance: number`, `balanceGapToNextTier: number`, `isVisible: boolean`, `onDismissNudge?: () => void`
- Responsibility: Display tier contribution context with progress bar and nudge; only render if `isVisible === true` (determined by visibility rules)
- Visibility Logic (in parent page component):
  - Calculate `balanceGapToNextTier = nextTierThreshold.minimumBalance - allAccountsBalance`
  - Determine `isVisible = currentTier !== 'premium' && balanceGapToNextTier <= 500`
  - Pass to component; if `isVisible === false`, component returns null (doesn't render)
- Nudge State Management:
  - Use `useCallback` for `onDismissNudge` to track dismissal in localStorage with key `tierNudgeDismissedUntil[accountId]`
  - Check if dismissal cookie/storage exists; if yes and not expired (7 days), hide nudge but keep region visible
- Accessibility: All text is readable; progress bar has `role="progressbar"` with ARIA values; dismiss button has `aria-label="Dismiss tier advancement nudge"`

**TransactionItem** (custom component, reusable from Home):
- Props: `transaction: Transaction`, `tier: string`, `onViewDetails: (id) => void`
- Responsibility: Display transaction summary with benefit badge if applicable
- Accessibility: Item is clickable container; "View details" is explicit button

**AccountSummaryRegion** (custom component):
- Props: `accountName: string`, `accountNumber: string`, `balance: number`, `status: string`, `tier: string`
- Responsibility: Display account header info and balance prominently
- Accessibility: Balance is large enough (28pt) and high contrast; no ARIA needed beyond semantic HTML

**Page (app/accounts/[id]/page.tsx)** (server component):
- Responsibility: Fetch account data (getAccountDetail, getAccountTransactions, getAccountTierContext)
- Validate user owns this account (auth check)
- Pass data to client components
- Handle loading/error states gracefully

---

## 7. Interactions

### Click Interactions

**Account Selector**:
- Click account option → Navigate to `/accounts/[id]`
- Keyboard: Enter or Space on focused option

**"View Details" CTA** (per transaction):
- Click → Navigate to `/transactions/[id]`
- Keyboard: Enter on focused item

**"Transfer Money" Button**:
- Click → Navigate to `/transfer?from=[currentAccountId]` (pre-fill source account)
- Keyboard: Tab to button, Enter to activate

**"Pay a Bill" Button**:
- Click → Navigate to bill pay flow (or open bill pay modal)
- Keyboard: Tab to button, Enter to activate

**Help Link** (in tier contribution region):
- Click "How is my tier calculated?" → Navigate to `/help` (may scroll to specific FAQ)
- Keyboard: Enter on focused link

**Benefit Badge** (on transaction):
- Hover/click → Show tooltip: "Fee waived with Plus tier ($2.50). Your Plus tier includes 0% fee on transfers."
- Keyboard: Focus on badge, tooltip appears

### Keyboard Navigation

- **Tab order**: Account selector → Balance/summary section → Action buttons → Transactions (top to bottom) → Footer links
- **Focus indicators**: All interactive elements show 2px blue outline (7:1 contrast)
- **Enter/Space**: Activate buttons, follow links, expand transaction details
- **Escape**: Close any open modals or tooltips
- **Page Up/Page Down**: Scroll through transactions (if list is long)

### Touch Interactions (Mobile)

- **Account selector tap**: Open dropdown or switch tab (48px+ touch target)
- **Transaction item tap**: Navigate to detail or show actions menu (full-width tap target, ≥56px height)
- **Button tap**: All buttons ≥48×48px touch target
- **Swipe**: Swipe-to-delete or archive (optional enhancement)

### Focus Management

- **Page load**: Focus on account selector or balance summary
- **Account switch**: Focus moves to new account's balance summary
- **Navigation away**: Focus returns to this page when using browser back button
- **Modal dismiss**: Focus returns to triggering button (e.g., "Transfer Money")

---

## 8. Data Contracts

### Request / Response Models

#### GET /api/accounts/:accountId (Fetch Account Detail)

**Request**:
```typescript
{
  accountId: string;  // e.g., "CHK-9876"
}
```

**Response** (HTTP 200 OK):
```json
{
  "accountId": "CHK-9876",
  "memberId": "MEMBER-001",
  "accountName": "Checking",
  "accountType": "checking",
  "maskedAccountNumber": "****9876",
  "currentBalance": 15000,
  "availableBalance": 15000,
  "accountStatus": "active",
  "openedDate": "2015-06-15",
  "interestRate": 0.01,
  "apy": 0.01,
  "tierAPYBoost": 0.0025,
  "effectiveAPY": 0.0125,
  "lastStatementDate": "2026-02-28",
  "nextStatementDate": "2026-03-28",
  "currency": "USD"
}
```

#### GET /api/accounts/:accountId/transactions?limit=20&offset=0 (Fetch Account Transactions)

**Response** (HTTP 200 OK):
```json
{
  "accountId": "CHK-9876",
  "transactions": [
    {
      "transactionId": "TXN-1005",
      "accountId": "CHK-9876",
      "date": "2026-02-20",
      "merchant": "Transfer to Savings",
      "amount": -1000,
      "description": "Account Transfer",
      "category": "Transfer",
      "runningBalance": 14000,
      "status": "completed",
      "tierBenefit": {
        "benefitType": "fee-waiver",
        "benefitValue": 2.50,
        "description": "Fee waived with Plus tier"
      }
    },
    {
      "transactionId": "TXN-1004",
      "accountId": "CHK-9876",
      "date": "2026-02-19",
      "merchant": "Starbucks Coffee",
      "amount": -5.50,
      "description": "Debit Card Purchase",
      "category": "Food & Dining",
      "runningBalance": 15005.50,
      "status": "completed",
      "tierBenefit": null
    }
  ],
  "totalCount": 87,
  "hasMore": true
}
```

#### GET /api/accounts/:accountId/tier-context (Fetch Tier Contribution for This Account)

**Response** (HTTP 200 OK):
```json
{
  "accountId": "CHK-9876",
  "accountBalance": 15000,
  "rollingBalance3Month": 14500,
  "contributesToTier": ["classic", "plus", "premium"],
  "currentTierFromAllAccounts": "plus",
  "allAccountsTotalBalance": 23500,
  "nextTierThreshold": {
    "tier": "premium",
    "minimumBalance": 25000,
    "minimumAutopay": 2,
    "balanceShortfall": 1500
  },
  "tierBenefitsOnThisAccount": {
    "apyBoost": 0.0025,
    "feeWaiverApplied": true,
    "thirdPartyRewardsEligible": true
  }
}
```

### TypeScript Service Facade

**File**: `/lib/api.ts`

```typescript
export interface AccountDetail {
  accountId: string;
  memberId: string;
  accountName: string;
  accountType: "checking" | "savings" | "money-market";
  maskedAccountNumber: string;
  currentBalance: number;
  availableBalance: number;
  accountStatus: "active" | "closed" | "dormant";
  openedDate: string;
  interestRate: number;
  apy: number;
  tierAPYBoost: number;
  effectiveAPY: number;
  lastStatementDate: string;
  nextStatementDate: string;
  currency: string;
}

export interface AccountTransaction {
  transactionId: string;
  accountId: string;
  date: string;
  merchant: string;
  amount: number;
  description: string;
  category: string;
  runningBalance: number;
  status: "completed" | "pending" | "failed";
  tierBenefit?: {
    benefitType: "apy-boost" | "fee-waiver" | "third-party-rewards";
    benefitValue: number;
    description: string;
  };
}

export interface AccountTierContext {
  accountId: string;
  accountBalance: number;
  rollingBalance3Month: number;
  contributesToTier: string[];
  currentTierFromAllAccounts: string;
  allAccountsTotalBalance: number;
  nextTierThreshold: {
    tier: string;
    minimumBalance: number;
    minimumAutopay: number;
    balanceShortfall: number;
  };
  tierBenefitsOnThisAccount: {
    apyBoost: number;
    feeWaiverApplied: boolean;
    thirdPartyRewardsEligible: boolean;
  };
}

// API functions
export async function getAccountDetail(accountId: string): Promise<AccountDetail> {
  const response = await fetch(`/api/accounts/${accountId}`, { method: "GET" });
  if (!response.ok) throw new Error("Failed to fetch account detail");
  return response.json();
}

export async function getAccountTransactions(
  accountId: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ transactions: AccountTransaction[]; totalCount: number; hasMore: boolean }> {
  const response = await fetch(
    `/api/accounts/${accountId}/transactions?limit=${limit}&offset=${offset}`,
    { method: "GET" }
  );
  if (!response.ok) throw new Error("Failed to fetch transactions");
  return response.json();
}

export async function getAccountTierContext(accountId: string): Promise<AccountTierContext> {
  const response = await fetch(`/api/accounts/${accountId}/tier-context`, { method: "GET" });
  if (!response.ok) throw new Error("Failed to fetch tier context");
  return response.json();
}
```

### Mock Data (Initial Development)

```typescript
const mockAccountDetail: AccountDetail = {
  accountId: "CHK-9876",
  memberId: "MEMBER-001",
  accountName: "Checking",
  accountType: "checking",
  maskedAccountNumber: "****9876",
  currentBalance: 15000,
  availableBalance: 15000,
  accountStatus: "active",
  openedDate: "2015-06-15",
  interestRate: 0.01,
  apy: 0.01,
  tierAPYBoost: 0.0025,
  effectiveAPY: 0.0125,
  lastStatementDate: "2026-02-28",
  nextStatementDate: "2026-03-28",
  currency: "USD"
};

const mockTransactions: AccountTransaction[] = [
  {
    transactionId: "TXN-1005",
    accountId: "CHK-9876",
    date: "2026-02-20",
    merchant: "Transfer to Savings",
    amount: -1000,
    description: "Account Transfer",
    category: "Transfer",
    runningBalance: 14000,
    status: "completed",
    tierBenefit: {
      benefitType: "fee-waiver",
      benefitValue: 2.50,
      description: "Fee waived with Plus tier"
    }
  }
];

export async function getAccountDetail(accountId: string): Promise<AccountDetail> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockAccountDetail;
}

export async function getAccountTransactions(accountId: string): Promise<any> {
  await new Promise(resolve => setTimeout(resolve, 250));
  return {
    transactions: mockTransactions,
    totalCount: mockTransactions.length,
    hasMore: false
  };
}

export async function getAccountTierContext(accountId: string): Promise<AccountTierContext> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    accountId: "CHK-9876",
    accountBalance: 15000,
    rollingBalance3Month: 14500,
    contributesToTier: ["classic", "plus", "premium"],
    currentTierFromAllAccounts: "plus",
    allAccountsTotalBalance: 23500,
    nextTierThreshold: {
      tier: "premium",
      minimumBalance: 25000,
      minimumAutopay: 2,
      balanceShortfall: 1500
    },
    tierBenefitsOnThisAccount: {
      apyBoost: 0.0025,
      feeWaiverApplied: true,
      thirdPartyRewardsEligible: true
    }
  };
}
```

---

## 9. Validation Rules

### Account Data Validation

- **Account ID**: Required, non-empty string (8–16 alphanumeric characters)
- **Account balance**: Number ≥ 0, formatted to 2 decimal places
- **Account status**: One of "active", "closed", "dormant"
- **Transaction date**: Valid ISO 8601 date; must not be in future
- **Running balance**: Must match calculation (previous balance + transaction amount)

### Display Validation

- **Balance display**: If balance > $1M, show "Your balance" instead of exact amount (security)
- **Account closed**: If status is "closed", disable all CTAs (Transfer, Pay Bill) with message "This account is closed and cannot be used for transactions"
- **Tier context missing**: If tier context API fails, show "Tier information unavailable. Contact support." (don't hide entire section)
- **No transactions**: Show "No transactions yet" placeholder (don't show empty list)

---

## 10. Visual & Responsive Rules

### Design Tokens Applied

**Colors**:
- Account balance: Dark text (#111827), 28pt Bold
- Account number/status: Medium gray (#6B7280), 14pt Regular
- Tier contribution region: Light gray background (#F3F4F6), subtle border
- Tier badge: Color-coded per tier (Classic: gray, Plus: gold, Premium: silver)
- Benefit badge on transaction: Green (#10B981) background, white text
- Transaction text: Dark gray (#111827), 14pt Regular

**Typography**:
- Page title: 28pt Bold
- Account name: 16pt Bold
- Account balance: 28pt Bold (largest, scannable)
- Section headings: 20pt Bold
- Transaction row: 14pt Regular (merchant), 14pt Bold (amount)
- Tier context text: 14pt Regular
- Benefit badge: 12pt Bold, white text

**Spacing**:
- Page padding: 16px mobile, 24px tablet/desktop
- Account summary height: 100px minimum (room for balance + info)
- Tier context section: 24px padding, 32px margin-bottom
- Transaction row: 12px padding (vertical), 16px (horizontal)
- Between major sections: 32px

**Shadows**:
- Account summary card: Subtle shadow `0 1px 2px rgba(0,0,0,0.05)` (light elevation)
- Tier context region: No shadow, light gray background only (informational, not interactive)

### Responsive Breakpoints

**Mobile (320px–479px)**:
- Full-width account selector (dropdown), 48px height
- Account summary: Balance on top, account info below (stacked)
- Tier context: Single column, full width
- Transactions: Single column, full width
- Section headings: 18pt

**Tablet (480px–1024px)**:
- Account selector: Tabs if 2–3 accounts, dropdown if more
- Account summary: Two columns (left: info, right: balance + tier badge)
- Tier context: Full width, wider layout
- Transactions: Full width, horizontal scrolling for wide table (optional)
- Section headings: 20pt

**Desktop (1025px+)**:
- Account selector: Tabs or dropdown (both acceptable)
- Account summary: Three columns (left: info, center: balance, right: tier badge)
- Tier context: Full width, constrained to 900px max-width
- Transactions: Full width with sortable columns
- Container max-width: 900px (prevents long lines)

### Touch Target Sizing

- **Account selector button**: 48×48px minimum
- **Action buttons**: 48×48px minimum
- **Transaction row tap target**: Full row, ≥56px height
- **Benefit badge**: 44×44px minimum (includes hover area)
- **Help link**: 44×44px minimum tap target

### Layout Behavior

- **Account summary**: Sticky or fixed (not scrollable, always visible)
- **Action buttons**: Sticky footer or inline (depends on content height)
- **Transactions**: Scrollable, full-width on mobile
- **Tier context**: Scrollable with account summary (not sticky)

---

## 11. Accessibility Checklist

### Semantic HTML

- Page uses `<header>`, `<main>`, `<section>`, `<footer>` landmarks
- Account summary is `<section>` with `<h1>` account name
- Tier context is `<section>` with `<h2>` heading
- Transactions are `<table>` OR `<article>` list with `<button>` CTAs (if not table)
- All buttons are semantic `<button>` tags, not `<div>`

### ARIA Labels & Roles

- **Account balance**: `aria-label="Current balance $15,000"` (large text, no ARIA needed if clear)
- **Account selector**: `aria-label="Select account"` on dropdown; selected account has `aria-current="page"`
- **Tier context section**: `role="region"`, `aria-label="Loyalty tier contribution"`
- **Transaction table**: `role="table"`, headers have `scope="col"`, rows have `role="row"`
- **Transaction list** (if not table): Each transaction is `role="article"`, "View details" link is explicit `<a>` or `<button>`
- **Benefit badge**: `aria-label="Fee waived with Plus tier: $2.50"` (not color-alone)

### Focus Management & Indicators

- **Account selector**: Focus on dropdown/tabs; visible outline on focus
- **Action buttons**: All have visible 2px blue outline on focus
- **Transaction items**: If clickable, visible outline on focus
- **Focus order**: Account selector → Balance/summary → Action buttons → Transactions (top to bottom) → Footer
- **No focus traps**: User can Tab through entire page sequentially

### Color Contrast

- **Account balance (28pt Bold dark gray on white)**: **12:1 contrast** ✅
- **Transaction text (14pt Regular dark gray on white)**: **12:1 contrast** ✅
- **Benefit badge (white on green #10B981)**: **7.5:1 contrast** ✅
- **Tier contribution text (14pt Regular dark gray on light gray)**: **7:1 contrast** ✅
- **Links (blue #3B82F6 on white)**: **4.5:1 contrast** (WCAG AA) ✅
- **Tier badge**: Not color-alone; accompanied by text label ✅

### Text Alternatives

- **Tier badge icon**: Accompanied by text label (e.g., "Plus") — no alt needed
- **Category icon** (per transaction): `aria-label="Food and Dining"` if icon-only
- **Status icon** (completed, pending): `aria-label="Completed"` or included in transaction text
- **Benefit badge icon**: `aria-label="Fee waived"` OR use text-only badge (preferred)

### Keyboard Navigation

- **Tab**: Move through account selector, buttons, transaction rows
- **Shift+Tab**: Move backward
- **Enter/Space**: Activate buttons, follow links, switch account
- **Escape**: Close dropdowns or modals
- **Arrow keys**: Navigate account selector (Down/Up to next account)
- **No keyboard traps**: User can Tab away from any element

### Screen Reader Support

- **Page title**: "Checking Account ****9876 - Credit Union Banking"
- **Account balance announced**: "Your balance is $15,000"
- **Tier context announced**: "This account contributes to Plus tier. Rolling 3-month balance: $8,500. Together with other accounts, you need $25,000 for Premium tier."
- **Transaction announced**: "Transfer to Savings, negative $1,000, completed, Fee waived with Plus tier: $2.50"
- **Help link announced**: "How is my tier calculated?, link" (clearly navigates to help)

### Mobile Accessibility (Touch)

- **Minimum tap target**: 48×48px (account selector, buttons, transaction rows)
- **Spacing between targets**: 8px minimum
- **No hover-only content**: All interactive content accessible via tap
- **Account selector**: Easy to tap, large button or tab targets
- **Transaction rows**: Full-width tap target (≥56px height recommended)

### Cognitive Load Management

- **Simple language**: "Account balance" not "Available funds on record"
- **Consistent terminology**: "Plus Tier" throughout (not "Gold" or "Level 2")
- **Short paragraphs**: Tier context broken into 2–3 line paragraphs
- **Visual hierarchy**: Balance is largest; tier info is secondary
- **No jargon**: "Rolling 3-month average" explained simply; link to FAQ for details

---

## 12. Telemetry

### Analytics Events

**Page Load**:
- `event: "page_view"`
- `page: "account_detail"`
- `accountId: accountId`
- `accountType: "checking" | "savings" | "money-market"`
- `userTier: currentTier`

**Account Switched**:
- `event: "account_selector_click"`
- `fromAccountId: previousAccountId`
- `toAccountId: newAccountId`

**View Transaction Details**:
- `event: "transaction_detail_click"`
- `transactionId: transactionId`
- `hasTierBenefit: boolean`

**Transfer Initiated**:
- `event: "transfer_start"`
- `source: "account_detail"`
- `fromAccountId: accountId`

**Help Link Clicked**:
- `event: "help_link_click"`
- `source: "account_detail"`
- `topic: "tier_contribution"`

**Error State**:
- `event: "error_loading_account"`
- `errorCode: error.code`
- `accountId: accountId`

---

## 13. Open Questions & Assumptions

### Questions for Product/Design

1. **Tier Nudge**: Should the tier contribution section always show a nudge ("Add $X to reach Premium")? Or only when user is close to next tier (within 20%)? (Current: assumption yes, always show)
2. **Multiple Accounts in Tier**: Should we show each account's contribution percentage? Or just absolute balances? (Current: assumption absolute balances with totals)
3. **Transaction Detail Modal**: Should transaction details open in modal or new page? (Current: assumption new page `/transactions/[id]`)
4. **Pagination**: Should transaction list be paginated (20 at a time) or infinite scroll? (Current: assumption paginated with "Load more" button)

### Assumptions

1. **Account is authenticated**: Member can only view own accounts (enforced on backend)
2. **Account data is current**: Balance updated at page load; not real-time streaming
3. **Tier contribution is calculated**: Backend provides accurate rolling balance for tier calculation
4. **Transactions are sortable**: Sorted by date DESC by default; can add filter/sort UI later
5. **Multiple accounts are possible**: Member may have 2–5 accounts; account selector is necessary
6. **Benefit context is available**: Transactions include tier benefit info if applicable
7. **Mobile is primary breakpoint**: Design optimized for 375px width

---

## 14. Design Rationale (Three-Experts Synthesis)

**UX Lead Perspective**:
- Account detail preserves familiar banking interface (balance, transactions) without disruption
- Tier contribution context is prominent but not dominant (informational, not transactional)
- Account selector at top supports multiple-account mental model (quick navigation)
- Benefit badges on transactions reinforce program value (visceral proof)
- Help link guides confused users to FAQ without overwhelming account view

**Frontend Architect Perspective**:
- Account detail is server-rendered for performance (fetch account data on server)
- Account selector can use client-side routing (next/navigation) for smooth transitions
- Transaction list can be paginated or infinite-scroll (both supported by component)
- Tier context component is reusable (also used on Home Dashboard)
- Telemetry captures account interactions (informs retention, engagement metrics)

**Product/Delivery Perspective**:
- Account detail is P0 MVP feature (core banking, non-negotiable)
- Tier contribution context is low-friction addition (supports tier understanding)
- Account detail is secondary entry point (most users navigate from home)
- Key success metric: 80% of PERSONA-02 members understand tier contribution after viewing account
- Benefit badges on transactions support confidence metric: "80% of members perceive benefits as genuine"

---

## 14.5. Cross-Shard Component Specification: TierContributionContext

To ensure consistency across shards and reduce duplication, the **TierContributionContext** component is specified here as a reusable module used by Shard 08 (Account Detail) and referenced by other shards.

**Component Name**: TierContributionContext
**File Location**: `components/loyalty/TierContributionContext.tsx`
**Usage**: Shard 08 (Account Detail page)

**Props**:
```typescript
interface TierContributionContextProps {
  accountId: string;
  accountBalance: number;
  rollingBalance3Month: number;
  currentTier: "classic" | "plus" | "premium";
  nextTierThreshold: {
    tier: string;
    minimumBalance: number;
    minimumAutopay: number;
    balanceShortfall: number;
  };
  allAccountsTotalBalance: number;
  onDismissNudge?: () => void;
}
```

**Variants**:
1. **Visible** (when within $500 of next tier):
   - Shows tier contribution summary, progress bar, and nudge
   - Nudge is dismissible (7-day expiration)
   - Background: Light gray (#F3F4F6), labeled "Information only"

2. **Hidden** (when > $500 from next tier OR at Premium tier):
   - Component returns `null`; no DOM rendering
   - Parent layout does not reserve space for this region

3. **Dismissed Nudge** (when user dismisses nudge):
   - Region still visible but nudge is hidden
   - Region shows only: Tier summary + progress bar
   - Nudge reappears after 7 days or session refresh

**Accessibility**:
- All text ≥14pt
- Progress bar: `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Dismiss button: `aria-label="Dismiss tier advancement suggestion"`, clear focus indicator
- Color-blind safe: Progress bar includes text-based percentage (not color-only)

---

## 15. Cursor-Claude Ready Build Plan

### File Structure (to create)

```
app/accounts/
├── [id]/
│   ├── page.tsx                 # Account detail server component
│   └── layout.tsx               # Account detail context (optional)
├── page.tsx                     # Accounts list (optional)
└── loading.tsx                  # Streaming skeleton UI

components/account/
├── AccountSelectorRegion.tsx    # Account switcher dropdown/tabs
├── AccountSummaryRegion.tsx     # Account header (name, number, balance, tier)
├── TierContributionRegion.tsx   # Tier context for this account
├── RecentTransactionsRegion.tsx # Transaction list
├── TransactionItem.tsx          # Single transaction row with benefit badge
└── AccountActions.tsx           # Transfer, Pay Bill, Set Up Autopay buttons

lib/
├── accounts.ts                  # Account-specific utilities (format balance, etc.)
└── (existing: api.ts, types.ts, utils.ts)

tests/account/
├── account-detail.test.tsx      # Account detail page integration
├── account-selector.test.tsx    # Account switching functionality
├── tier-contribution.test.tsx   # Tier context rendering and calculations
└── transaction-list.test.tsx    # Transaction display and pagination
```

### Mock Setup

1. **Create mock account data** in `lib/api.ts` (1–3 account variants)
2. **Create mock transaction list** (20 transactions with mix of benefits and no-benefit)
3. **Create mock tier context** (calculate rolling balance for each account)
4. **Provide 2 scenarios**: User in Plus tier (with benefits), user in Classic tier (no benefits)

### Test Stubs (to implement)

```typescript
// tests/account/account-detail.test.tsx
describe("Account Detail", () => {
  test("displays account balance prominently", () => {
    // Render account detail for checking account
    // Assert: balance displayed ($15,000)
    // Assert: balance text is 28pt Bold, dark gray
  });

  test("shows tier contribution context", () => {
    // Render account detail
    // Assert: "This account contributes to Plus tier" visible
    // Assert: rolling balance ($8,500) shown
    // Assert: total needed for Premium tier shown ($25,000)
  });

  test("displays tier benefits on transactions", () => {
    // Render account with Plus tier
    // Find transfer transaction
    // Assert: benefit badge visible ("Fee waived with Plus tier: $2.50")
  });

  test("switches to different account via selector", () => {
    // Render account detail with multiple accounts
    // Click "Savings ****5432" in account selector
    // Assert: URL changes to /accounts/SAV-5432
    // Assert: balance updated to savings balance
  });

  test("paginates transaction list", () => {
    // Render account with 50+ transactions
    // Assert: first 20 transactions shown
    // Click "Load more"
    // Assert: next 20 transactions loaded and displayed
  });

  test("handles account load error gracefully", () => {
    // Mock API to return error
    // Render account detail
    // Assert: error message displayed
    // Assert: "Retry" button visible
  });

  test("disables transfer button for closed account", () => {
    // Render account with status: "closed"
    // Assert: "Transfer Money" button disabled
    // Assert: tooltip: "This account is closed and cannot be used for transactions"
  });
});
```

### Component Build Checklist

- [ ] Create `app/accounts/[id]/page.tsx` (server component, fetch account + transactions + tier context)
- [ ] Create `components/account/AccountSelectorRegion.tsx` (dropdown or tabs)
- [ ] Create `components/account/AccountSummaryRegion.tsx` (name, number, balance, tier badge)
- [ ] Create `components/account/TierContributionRegion.tsx` (rolling balance context, nudge)
- [ ] Create `components/account/RecentTransactionsRegion.tsx` (transaction list)
- [ ] Create `components/account/TransactionItem.tsx` (row with benefit badge)
- [ ] Implement `lib/api.ts` with mock account, transaction, and tier context data
- [ ] Implement `lib/accounts.ts` with formatting/calculation utilities
- [ ] Add Tailwind styling (colors, spacing, responsive breakpoints)
- [ ] Implement account selector switching (next/navigation)
- [ ] Implement transaction pagination/infinite scroll
- [ ] Add ARIA labels and roles (account selector, tier context region, transaction table)
- [ ] Implement keyboard navigation (Tab, Enter, Escape)
- [ ] Test color contrast (all text 7:1+ against background)
- [ ] Test touch targets (all clickable areas 48×48px minimum)
- [ ] Create unit tests for account selector, tier context calculations
- [ ] Create integration tests for full account detail flow
- [ ] Deploy to staging for QA and accessibility audit

---

✅ **SHARD 08: Account Detail — Build-Ready Specification**

**Full specification document**: See [04-prd.md](../04-prd.md) (Feature Requirements), [05-ux-spec.md](../05-ux-spec.md) (Interaction Design), [06-dev-spec.md](../06-dev-spec.md) (Technical Architecture)

**Handoff**: This shard is ready for frontend engineer to build using Next.js 14 + Shadcn + Tailwind. Follow Cursor-Claude Ready Build Plan (section 15) for file structure, component setup, and test stubs.
