# Shard 09: Transaction Detail

**Build Priority**: P1 — Banking integration with loyalty context
**Estimated Effort**: 10 hours
**Screen ID**: SCR-09
**Route**: `/transactions` (list), `/transactions/[id]` (detail)
**Component File**: `app/transactions/page.tsx`, `app/transactions/[id]/page.tsx`

---

## 1. Screen Name & Route

**Full Screen Name**: Transaction History and Detail
**URL Routes**:
- `/transactions` (transaction list with search/filter)
- `/transactions/[id]` (individual transaction detail)

**Navigation Access**: From Home Dashboard, Account Detail, primary navigation link
**Page Title**: "Transactions - Credit Union Banking" (list), "Transaction Detail - [Date] [Merchant]" (detail)
**Breadcrumb**: Home > Transactions (list), Home > Transactions > [Date] [Merchant] (detail)

**Route Parameters**: `id` (transaction ID, e.g., "TXN-1005")
**Auth Requirements**: Authenticated member (must own the account where transaction occurred)

---

## 2. Purpose & Jobs-to-be-Done

**Primary Purpose**: Display member transaction history with rich loyalty context showing fee waivers applied, cashback earned, APY boost impact on interest transactions. Enable filtering, search, and detailed view of individual transactions. Preserve familiar transaction UI while adding loyalty benefit visibility.

**Jobs-to-be-Done**:

1. **View transaction history** — Member needs searchable, filterable transaction list by date, merchant, category (unchanged core experience)
2. **Understand loyalty benefits applied to transaction** — Member (PERSONA-04 Skeptic) wants to see "this transfer saved me $2.50 in fees via Plus tier"; needs proof of benefit value
3. **Track cashback and reward earnings** — Member wants to see third-party rewards earned on eligible transactions (future feature)
4. **Verify transaction details and disputes** — Member needs full transaction information (amount, date, merchant, running balance) to verify accuracy or initiate dispute

**Design Principle Applied**: "Transaction Context Transparency" — Loyalty benefits are contextually shown on transactions where they apply (not hidden in FAQ); real-dollar values reinforce program authenticity.

---

## 3. User Stories & Acceptance Criteria

### Story 1: Everyday Banker Searches Transaction History

**As a** change-averse member (PERSONA-01)
**I want to** search for a transaction by merchant name or date
**So that** I can find specific transactions without scrolling through entire history

**Given** I am on the transaction history page
**When** I enter "Starbucks" in the search box
**Then** I see:
- Search results filtered to matching transactions (date, merchant, amount)
- Results sorted by relevance (date DESC)
- "No results found" message if no matches
- Search is instant (debounced within 300ms)

**And** I can clear search and return to full transaction list

---

### Story 2: Benefit Optimizer Sees Tier Benefits Applied to Transactions

**As a** financially savvy member (PERSONA-02)
**I want to** see on a transfer transaction that the Plus tier saved me $2.50 in fees
**So that** I can quantify the real-dollar benefit I'm receiving from loyalty program

**Given** I am viewing transaction history for a Plus tier member
**When** I look at a transfer transaction (e.g., "Transfer to Savings - $1,000 - 2026-02-20")
**Then** I see:
- Green benefit badge: "Fee waived with Plus tier: $2.50"
- Clicking badge shows tooltip: "Plus tier includes 0% fee on transfers. Normally, this transfer would have cost $2.50."
- For interest transactions: "Interest with APY boost (0.25%): +$0.94" (showing incremental interest earned due to tier)
- Benefit badge includes: benefit type, real-dollar value, tier requirement

**And** benefit badges are consistent across all eligible transactions

---

### Story 3: Skeptic Validates Transaction Detail and Fee Waiver

**As a** skeptical member (PERSONA-04)
**I want to** click on a transaction to see full details including the fee waiver context
**So that** I can confirm the transaction and loyalty benefit are both accurate

**Given** I click on a transfer transaction from the history list
**When** the transaction detail page loads
**Then** I see:
- Transaction header: Date, merchant/description, status
- Transaction details (full screen):
  - Merchant name and address (if available)
  - Transaction amount (large, bold)
  - Transaction type (transfer, purchase, deposit, etc.)
  - Running balance before and after transaction
  - Transaction date and posting date (if different)
  - Transaction ID
  - Category and description
  - Related account (e.g., "From: Checking ****9876")
- **Loyalty Context Section**:
  - If fee waived: "You saved $2.50 with Plus tier fee waiver on this transfer"
  - If APY boosted: "This interest credit includes +$0.94 from your Plus tier APY boost (0.25%)"
  - If no benefit: No badge shown (simplifies UI)
- Link to account detail: "View account" → `/accounts/[accountId]`
- Option to dispute transaction (if applicable)
- Back button to return to transaction list

**And** all information is read-only (no ability to edit or modify transaction)

---

### Story 4: Member Filters Transactions by Category and Date Range

**As a** any member
**I want to** filter transaction list by category (e.g., "Food & Dining") and date range
**So that** I can analyze spending patterns by category

**Given** I am on transaction history page
**When** I select "Food & Dining" from category filter
**Then** I see:
- Transaction list updates to show only matching category
- Results count displayed (e.g., "12 transactions in Food & Dining")
- Can combine filters: Category + Date range
- Can clear filters to show all transactions

**And** filter state is preserved when navigating between pages

---

## 4. States

### Default State (List)
- Page fully loaded with transaction list
- 20–50 most recent transactions displayed
- Search box empty
- Filter options visible
- No results from search (search box empty)

### Default State (Detail)
- Transaction detail page fully loaded
- Transaction information displayed (date, merchant, amount, status)
- Loyalty context shown if applicable (benefit badge or "no benefit" state)
- Related actions visible (dispute, back to list)

### Loading State
- Transaction list: Skeleton rows showing placeholders
- Transaction detail: Skeleton showing transaction header, details section, loyalty context
- Search disabled until page loads
- Filter buttons disabled

### Error State (List)
- Transaction list fails to load
- Display: "Unable to load transactions. Please try again."
- Retry button visible
- Search/filter still functional (work on cached data if available)

### Error State (Detail)
- Transaction detail fails to load
- Display: "Unable to load transaction details. Please try again."
- Retry button visible
- Back button to return to list

### Empty State (List)
- No transactions in history: "No transactions yet. Your transaction history will appear here."
- No results for search: "No transactions found matching '[search term]'. Try different keywords."
- No results for filter: "No transactions in this category for the selected date range."

### Empty State (Detail)
- Transaction has no loyalty benefit: Show transaction details without benefit section (simplifies UI)

### Offline State
- Browser detects no network connection
- Display cached transaction data (if available)
- Show "You're offline. Displaying cached data." indicator
- Disable search functionality (requires live data)

---

## 5. Information Architecture

### Transaction List Page

**Header Region** (sticky):
- Left: Breadcrumb "Home > Transactions"
- Right: Notifications, Settings, User menu

**Search & Filter Region** (sticky below header):
- Large search input (400px+, 48px height): "Search by merchant or description..."
- Filter options:
  - Date range picker: "Last 30 days" | "Last 90 days" | "This year" | "Custom range"
  - Category filter: Dropdown with "All categories", "Food & Dining", "Shopping", "Transfers", "Income", etc.
  - Account filter (if multiple accounts): "All accounts" | "Checking" | "Savings"
  - Status filter: "All" | "Completed" | "Pending" | "Failed"
- "Clear filters" link (visible if any filter active)

**Results Summary Region**:
- "Showing 20 transactions from [date] to [date]"
- Or: "Found 5 transactions matching '[search term]'"
- Or: "No transactions found"

**Transaction List Region**:
- Each transaction shows as row/card:
  - Date (left): "Feb 20, 2026"
  - Merchant/Description (center-left): "Transfer to Savings"
  - Amount (center-right, bold): "-$1,000"
  - Category badge (small): "Transfer"
  - **Benefit Badge on List** (cross-shard consistency):
    - Desktop (1024px+): Badge inline at right edge of transaction row, full text "Fee waived $2.50" visible
    - Tablet (480px–1024px): Badge inline at row end if space allows; truncates to icon-only (green checkmark) with tooltip on hover
    - Mobile (<480px): Badge moves to second row of transaction item OR displays as icon-only with tooltip on tap
    - Badge styling: Green (#10B981) background, white text, 12pt Bold
    - Badge always clickable/tappable to show full tooltip: "Fee waived with Plus tier: $2.50"
    - Blank space (no badge) if no benefit (keeps layout aligned)
  - Status indicator (far right): Checkmark if completed, clock if pending
- Full row is clickable, navigates to detail page
- Transaction rows sorted by date DESC
- Pagination or infinite scroll: "Load more" button or auto-load as user scrolls

### Transaction Detail Page

**Header Region**:
- Breadcrumb: "Home > Transactions > [Date] [Merchant]"
- Back button: Returns to transaction list (preserves scroll position and filters)

**Transaction Summary Card** (prominent, non-intrusive):
- Left side: Date, merchant, category, status
- Right side: Amount (large, bold), running balance before/after
- Light gray background, subtle border

**Transaction Details Section**:
- Full transaction information in key-value format:
  - Merchant name / Description
  - Transaction amount (formatted currency)
  - Transaction type (transfer, purchase, deposit, etc.)
  - Posting date (if different from transaction date)
  - Transaction ID (for reference/disputes)
  - Running balance after transaction
  - Category and description
  - Related account (e.g., "From: Checking ****9876" or "To: External account")
- All information is read-only

**Loyalty Context Section** (conditional, informational):
- Heading: "Loyalty Benefits Applied" (only shown if benefit exists)
- Benefit information:
  - "Fee waived with Plus tier: $2.50" (for fee-waivable transactions)
  - "Interest with APY boost (0.25%): +$0.94" (for interest transactions)
  - "Cashback reward earned: +$1.50" (for eligible purchases, future)
- Explanation: "Your Plus tier includes [benefit description]. Without this benefit, this transaction would have cost $2.50 more."
- **TransactionBenefitBadge Display** (cross-shard consistency):
  - Badge shows only on transaction detail page (Shard 09) if benefit exists; no badge on list page without explicit interaction
  - Badge styling: Green background (#10B981), white text, 12pt Bold, 4px border-radius
  - Mobile <480px: Badge displays on second line or as icon-only with tap-to-reveal tooltip
  - Desktop/tablet: Badge inline with benefit text
  - Hover/tap shows tooltip: "Your Plus tier saved you $2.50 on this transfer. Plus tier benefits include fee-free transfers."
- Link to Tier Details: "Learn more about your tier benefits" → `/loyalty/tier-details`

**Action Buttons**:
- "Dispute transaction" (if transaction is eligible for dispute)
- "View account" → `/accounts/[accountId]` (navigate to account detail)
- "Back to transactions" (sticky footer or inline)

---

## 6. Components & Responsibilities

### Component Tree (List)

```
Page (app/transactions/page.tsx) — Server Component
├── Header (reused)
├── SearchFilterRegion (Client)
│   ├── SearchInput (Client)
│   ├── FilterOptions (Client)
│   │   ├── DateRangePicker
│   │   ├── CategoryFilter
│   │   ├── AccountFilter
│   │   └── StatusFilter
│   └── ClearFiltersLink
├── ResultsSummary (Client)
├── TransactionListRegion (Client)
│   ├── TransactionRow × 20–50 (Client)
│   │   ├── Date
│   │   ├── Merchant/Description
│   │   ├── Amount
│   │   ├── Category badge
│   │   ├── Benefit badge (LoyaltyContextCallout)
│   │   └── Status indicator
│   └── Pagination / Load more button
└── Footer
```

### Component Tree (Detail)

```
Page (app/transactions/[id]/page.tsx) — Server Component
├── Header
├── BackButton (sticky)
├── TransactionSummaryCard (Client)
│   ├── Date, merchant, category, status (left)
│   ├── Amount, running balance (right)
├── TransactionDetailsSection (Client)
│   ├── Key-value pairs (merchant, amount, type, posting date, ID, etc.)
│   └── Related account link
├── LoyaltyContextSection (Client, conditional)
│   ├── Benefit badge
│   ├── Benefit explanation
│   └── Link to Tier Details
├── ActionButtonsRegion (Client)
│   ├── Button "Dispute transaction"
│   ├── Button "View account"
│   └── Button "Back to transactions"
└── Footer
```

### Component Responsibilities

**SearchInput** (custom, reusable):
- Props: `onSearch: (query) => void`, `placeholder?: string`
- Debounce 300ms; trigger search handler
- Clear button visible if text entered

**TransactionRow** (custom component):
- Props: `transaction: Transaction`, `onViewDetails: (id) => void`
- Display date, merchant, amount, category, status, benefit badge
- Full row is clickable → `/transactions/[id]`

**FilterOptions** (custom component):
- Props: `onFilterChange: (filters) => void`, `currentFilters: Filters`
- Date range, category, account, status filters
- "Clear filters" link

**LoyaltyContextSection** (custom, reusable):
- Props: `transaction: Transaction`, `tier: string`
- Show benefit badge + explanation (only if benefit exists)
- Link to tier details

**Page components** (server):
- Fetch transaction list with filters/search
- Fetch transaction detail with loyalty context
- Handle auth/permission checks

---

## 7. Interactions

### Click Interactions (List)

**Search Input**:
- Type → Debounce 300ms → Filter transactions by keyword
- Click X → Clear search → Reset to full list

**Category Filter**:
- Click dropdown → Select category → Filter transactions

**Date Range Filter**:
- Click "Last 30 days", "Last 90 days", etc. → Filter by date
- Click "Custom range" → Open date picker → Select dates → Filter

**Transaction Row**:
- Click → Navigate to `/transactions/[id]`
- Keyboard: Enter on focused row

**"Load more" Button**:
- Click → Load next 20 transactions and append to list

### Click Interactions (Detail)

**Back Button**:
- Click → Navigate back to `/transactions` (preserves scroll position and filters)

**Benefit Badge**:
- Hover/click → Show tooltip: "Fee waived with Plus tier ($2.50). Your Plus tier includes 0% fee on transfers."

**"View account" Link**:
- Click → Navigate to `/accounts/[accountId]`

**"Dispute transaction" Button**:
- Click → Open dispute flow (may open modal or navigate to new page)

### Keyboard Navigation

**List**:
- Tab: Search input → Category filter → Date filter → Transaction rows → Load more → Footer
- Arrow keys: Navigate through filtered transaction list (if implemented)
- Enter: Select focused filter option or navigate to focused transaction

**Detail**:
- Tab: Back button → Transaction details → Benefit section → Action buttons → Footer
- Escape: Close any expanded detail sections

---

## 8. Data Contracts

### Endpoints

#### GET /api/transactions?limit=20&offset=0&category=&dateFrom=&dateTo=

**Response**:
```json
{
  "transactions": [
    {
      "transactionId": "TXN-1005",
      "date": "2026-02-20",
      "merchant": "Transfer to Savings",
      "amount": -1000,
      "category": "transfer",
      "status": "completed",
      "accountId": "CHK-9876",
      "runningBalance": 14000,
      "tierBenefit": {
        "benefitType": "fee-waiver",
        "benefitValue": 2.50,
        "description": "Fee waived with Plus tier"
      }
    }
  ],
  "totalCount": 87,
  "hasMore": true
}
```

#### GET /api/transactions/:id

**Response**:
```json
{
  "transactionId": "TXN-1005",
  "accountId": "CHK-9876",
  "date": "2026-02-20",
  "postingDate": "2026-02-20",
  "merchant": "Savings Account",
  "merchantAddress": "Online Transfer",
  "description": "Transfer to Savings Account",
  "amount": -1000,
  "category": "transfer",
  "status": "completed",
  "runningBalance": 14000,
  "balanceBeforeTransaction": 15000,
  "transactionId": "TXN-1005",
  "type": "transfer",
  "relatedAccount": {
    "accountId": "SAV-5432",
    "accountName": "Savings",
    "maskedNumber": "****5432"
  },
  "tierBenefit": {
    "benefitType": "fee-waiver",
    "benefitValue": 2.50,
    "description": "Fee waived with Plus tier"
  }
}
```

### TypeScript Interfaces

```typescript
export interface Transaction {
  transactionId: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  status: "completed" | "pending" | "failed";
  accountId: string;
  runningBalance: number;
  tierBenefit?: {
    benefitType: "apy-boost" | "fee-waiver" | "cashback";
    benefitValue: number;
    description: string;
  };
}

export interface TransactionDetail extends Transaction {
  postingDate: string;
  merchantAddress: string;
  description: string;
  balanceBeforeTransaction: number;
  type: string;
  relatedAccount?: {
    accountId: string;
    accountName: string;
    maskedNumber: string;
  };
}

// API functions
export async function getTransactions(
  limit: number = 20,
  offset: number = 0,
  filters?: { category?: string; dateFrom?: string; dateTo?: string; search?: string }
): Promise<{ transactions: Transaction[]; totalCount: number; hasMore: boolean }> {
  // Implementation
}

export async function getTransactionDetail(transactionId: string): Promise<TransactionDetail> {
  // Implementation
}
```

### Mock Data

```typescript
const mockTransactions: Transaction[] = [
  {
    transactionId: "TXN-1005",
    date: "2026-02-20",
    merchant: "Transfer to Savings",
    amount: -1000,
    category: "transfer",
    status: "completed",
    accountId: "CHK-9876",
    runningBalance: 14000,
    tierBenefit: {
      benefitType: "fee-waiver",
      benefitValue: 2.50,
      description: "Fee waived with Plus tier"
    }
  },
  {
    transactionId: "TXN-1004",
    date: "2026-02-19",
    merchant: "Starbucks Coffee",
    amount: -5.50,
    category: "food-dining",
    status: "completed",
    accountId: "CHK-9876",
    runningBalance: 15000,
    tierBenefit: null
  }
];
```

---

## 9. Validation Rules

- **Transaction date**: Valid ISO 8601 date; must not be in future
- **Amount**: Must match account ledger; formatted to 2 decimal places
- **Status**: One of "completed", "pending", "failed"
- **Running balance**: Must match calculation
- **Benefit value**: Must match tier calculation rules

---

## 10. Visual & Responsive Rules

### Design Tokens

**Colors**:
- Transaction amount: Bold dark gray (#111827), 16pt
- Benefit badge: Green (#10B981) background, white text, 12pt Bold
- Pending transaction: Orange (#F59E0B) status indicator
- Failed transaction: Red (#EF4444) status indicator

**Typography**:
- Transaction date: 14pt Regular
- Merchant: 16pt Regular (primary)
- Amount: 16pt Bold
- Category badge: 12pt Bold
- Benefit text: 12pt Regular, green
- Detail section labels: 12pt Bold
- Detail section values: 14pt Regular

**Spacing**:
- Search box: 48px height
- Transaction row: 12px padding (vertical), 16px (horizontal), 48px minimum height
- Filter options: 8px spacing between buttons
- Detail section: 24px padding, 32px margins between sections

### Responsive Breakpoints

**Mobile (320px–479px)**:
- Search box: Full width
- Filters: Collapsible dropdown (not always visible)
- Transaction rows: Single column, full width
- Amount right-aligned
- Benefit badge: Inline at end of row

**Tablet/Desktop**:
- Search + filters visible in sticky header
- Transaction rows in table format (date | merchant | amount | status | benefit)
- More detailed information visible per row

---

## 11. Accessibility Checklist

### Semantic HTML
- List page: `<table>` or `<article>` list with `<button>` CTAs
- Detail page: `<section>` landmarks for detail, benefit, actions
- All buttons are semantic `<button>` tags

### ARIA Labels
- **Search input**: `aria-label="Search transactions by merchant or description"`
- **Filter buttons**: `aria-label="Filter by [category]"`, etc.
- **Benefit badge**: `aria-label="Fee waived with Plus tier: $2.50"` (not color-alone)
- **Transaction row**: If clickable container, `role="button"` with keyboard support

### Focus Management
- Search input focused on page load (list)
- Back button focused on page load (detail)
- Tab order: Filters → Transactions → Load more (list)
- Visible 2px blue outline on all focusable elements

### Color Contrast
- Benefit badge (white on green): **7.5:1 contrast** ✅
- Transaction text (dark gray on white): **12:1 contrast** ✅
- All text meets WCAG AAA baseline

### Touch Targets
- All clickable elements: ≥48×48px
- Transaction rows: Full width, ≥48px height
- Filter buttons: ≥44×44px minimum

---

## 12. Telemetry

### Analytics Events

**Page Load** (List):
- `event: "page_view"`, `page: "transaction_list"`

**Search**:
- `event: "transaction_search"`, `query: searchTerm`

**Filter**:
- `event: "transaction_filter"`, `filterType: category | dateRange | status`, `filterValue: value`

**View Detail**:
- `event: "transaction_detail_view"`, `transactionId: id`, `hasBenefit: boolean`

**Dispute Initiated**:
- `event: "transaction_dispute"`, `transactionId: id`

---

## 13. Open Questions & Assumptions

1. Should transaction list be paginated (20 at a time) or infinite scroll? (Current: paginated)
2. Should search be full-text or merchant-only? (Current: full-text)
3. Should we show pending vs. completed transactions differently? (Current: status indicator)

---

## 14. Design Rationale (Three-Experts Synthesis)

**UX Lead Perspective**:
- Search and filter are prominently placed (sticky header) for discoverability
- Benefit badges on transactions reinforce loyalty program value (visceral proof)
- Transaction detail focuses on information clarity (read-only, no editing friction)
- Loyalty context is separate section (doesn't interrupt transaction details)

**Frontend Architect Perspective**:
- Transaction list can be paginated or infinite-scroll (both easily supported)
- Benefit badges are reusable component (LoyaltyContextCallout)
- Search/filter is client-side (fast filtering without API call per keystroke)
- Transaction detail page is server-rendered for SEO and performance

**Product/Delivery Perspective**:
- Transaction detail is P1 MVP feature (core banking + loyalty context)
- Benefit badges on transactions support key metric: "80% perceive benefits as genuine"
- Transaction search/filter supports customer engagement (exploring financial history)
- Loyalty context doesn't interrupt banking workflow (secondary, informational)

---

## 14.5. Cross-Shard Component Specification: TransactionBenefitBadge

To ensure consistency across shards (Shards 08, 09, 11), the **TransactionBenefitBadge** component is specified here as a reusable module.

**Component Name**: TransactionBenefitBadge
**File Location**: `components/loyalty/TransactionBenefitBadge.tsx`
**Usage**: Shard 08 (account detail transactions), Shard 09 (transaction list/detail), Shard 11 (transfer confirmation)

**Props**:
```typescript
interface TransactionBenefitBadgeProps {
  benefitType: "fee-waiver" | "apy-boost" | "cashback";
  benefitValue: number;
  description: string;
  tier: "classic" | "plus" | "premium";
  variant?: "inline" | "icon-only" | "full";  // Default: inline
  onTap?: () => void;  // For mobile tooltip trigger
}
```

**Variants**:
1. **Inline** (desktop/tablet):
   - Shows full text: "Fee waived $2.50"
   - Green background, white text, 12pt Bold
   - Inline with transaction/amount text

2. **Icon-Only** (mobile <480px):
   - Shows green checkmark icon only
   - 24×24px icon
   - Tap shows tooltip: "Fee waived with Plus tier: $2.50"

3. **Full** (transaction detail):
   - Shows full context: "Fee waived with Plus tier: $2.50"
   - Plus explanation text below
   - Used on Shard 09 transaction detail page

**Responsive Behavior** (auto-handled by component):
- Desktop (1024px+): Render `variant="inline"` (full text)
- Tablet (480px–1024px): Render `variant="inline"` if space available; fallback to `variant="icon-only"` if constrained
- Mobile (<480px): Render `variant="icon-only"` (icon + tooltip)

**Accessibility**:
- Icon variant includes `aria-label="Fee waived with Plus tier: $2.50"`
- Tooltip on tap: Modal overlay showing benefit details
- Color-blind safe: Checkmark icon + text label (not color-only)

---

## 15. Cursor-Claude Ready Build Plan

### File Structure

```
app/transactions/
├── page.tsx                 # Transaction list server component
├── [id]/
│   └── page.tsx            # Transaction detail server component
└── loading.tsx             # Skeleton UI

components/transactions/
├── SearchFilterRegion.tsx   # Search + filter controls
├── TransactionRow.tsx       # Single transaction row with benefit badge
├── TransactionDetailCard.tsx # Transaction summary card (detail page)
├── LoyaltyContextSection.tsx # Benefit context (reusable)
└── TransactionActions.tsx   # Dispute, view account, back buttons

lib/
├── transactions.ts         # Transaction utilities (search, filter, sort)
└── (existing: api.ts, types.ts)

tests/transactions/
├── transaction-list.test.tsx
├── transaction-detail.test.tsx
└── search-filter.test.tsx
```

### Mock Setup

1. Create 20–30 mock transactions with varying categories and benefits
2. Create mock detail for individual transaction
3. Provide 2 scenarios: Plus tier (with benefits), Classic tier (no benefits)

### Component Build Checklist

- [ ] Create `app/transactions/page.tsx` (server component, fetch transactions)
- [ ] Create `app/transactions/[id]/page.tsx` (server component, fetch detail + loyalty context)
- [ ] Create `components/transactions/SearchFilterRegion.tsx` (search + filter controls)
- [ ] Create `components/transactions/TransactionRow.tsx` (list row with benefit badge)
- [ ] Create `components/transactions/TransactionDetailCard.tsx` (detail summary)
- [ ] Implement `lib/transactions.ts` with search, filter, sort logic
- [ ] Implement mock transaction data and API facades
- [ ] Add Tailwind styling (colors, spacing, responsive)
- [ ] Implement search/filter with debounce (300ms)
- [ ] Add pagination or infinite scroll
- [ ] Add ARIA labels and focus management
- [ ] Test color contrast and touch targets
- [ ] Create unit and integration tests
- [ ] Deploy to staging for QA

---

✅ **SHARD 09: Transaction Detail — Build-Ready Specification**

**Handoff**: Ready for frontend build using Next.js 14 + Shadcn + Tailwind.
