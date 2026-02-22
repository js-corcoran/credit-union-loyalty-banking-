# Shard 04: Account Status Detail

**Build Priority**: P1 | **Estimated Effort**: 14 hours | **Screen ID**: SCR-04 | **Route**: `/loyalty/account-status`

## 1. Screen Name & Route

Account Status Detail | `/loyalty/account-status` | Breadcrumb: Home > Loyalty > Account Status

## 2. Purpose & Jobs-to-be-Done

Display member's specific tier qualification data: qualifying balances, autopay status, days until thresholds, predicted tier status (if maintaining current behavior), and tier loss risk with recovery steps.

**Jobs**:
1. **Understand personal tier calculation** — See exactly how balance and autopay status determine current tier
2. **See days to tier loss** — Know how long until grace period expires if qualification lost
3. **Identify specific actions** — Get exact dollar/action amounts needed to advance tier
4. **Monitor tier health** — Check if currently at risk of retrogression

## 3. User Stories & Acceptance Criteria

### Story 1: Member Sees Tier Qualification Breakdown

**As a** member wanting to understand my tier
**I want to** see my current balance, autopay count, and how they result in my current tier
**So that** I feel confident my tier status is correct

**Given** I navigate to Account Status Detail
**When** the page loads
**Then** I see:
- Current tier badge (large, 64×64px) with name
- Tier calculation formula (visual): "Your tier = $14,500 balance + 2 autopays = Plus Tier"
- Qualifying accounts breakdown:
  - Checking: $15,000 ✓
  - Savings: $8,500 ✓
  - Total: $23,500 qualifying
- Autopay status:
  - Loan autopay: ✓ (expires May 31, 2026)
  - Bill payment: ✓ (expires Feb 28, 2027)
  - Count: 2 of 2 required for Plus
- Days until next threshold: "120 days until tier loss threshold (if balance drops below $10,000)"
- Predicted tier (if maintaining): "If you maintain this balance and autopay, you'll reach Premium tier on April 15" (if progressing)

**And** all numbers are transparent, traceable, personalized

---

### Story 2: Member Sees Tier Loss Risk & Recovery Steps

**As a** member concerned about losing tier status
**I want to** see if I'm at risk and what I need to do to prevent tier loss
**So that** I can take proactive action

**Given** I'm a Plus member with balance at $10,200 (only $200 above minimum)
**When** I view Account Status Detail
**Then** I see:
- Alert: "Your balance is approaching Plus tier minimum ($10,000)" (supportive tone, not alarming)
- Days until risk: "You have 120 days before your grace period starts"
- Recovery steps: "To maintain Plus tier: Increase balance by $200, OR maintain 2 active autopays"
- Action CTA: "Increase balance" (link to Transfer) or "Review autopay" (link to Autopay Management)

**And** alert is yellow/warning (not red/urgent) for non-immediate risk

---

### Story 3: Member Sees Specific Advancement Path

**As an** optimizer member (PERSONA-02)
**I want to** see exactly what's needed to reach next tier
**So that** I can make informed decision about advancing

**Given** I'm in Plus tier, wanting to reach Premium
**When** I view Account Status Detail
**Then** I see:
- Distance to next tier: "You're $1,500 away from Premium Tier"
- What's needed: "Maintain $25,000+ balance (you have $23,500) AND 2+ autopays (you have 2)"
- Options to reach: "Increase balance by $1,500" OR "Maintain current balance if second autopay qualifies"
- Time estimate: "If you increase balance by $100/month, you'll reach Premium in 15 months"

**And** all actions are specific and quantified (not vague)

---

## 4. States

- **Default**: Fully loaded with member qualification data
- **Loading**: Skeleton screens for account list, tier calculation, action items
- **Error**: "Unable to calculate your tier status. Please contact support."
- **At-Risk**: If tier loss threshold approaching, show prominent alert with recovery steps
- **Offline**: Show cached data with "You're offline" indicator

---

## 5. Information Architecture

**Current Tier Region** (prominent):
- Large tier badge (64×64px)
- "You're in Plus Tier" heading
- Tier calculation visual: "Your tier = $14,500 balance + 2 autopays = Plus Tier"
- Benefits callout: "You're earning $145/year in benefits"

**Qualifying Accounts Region**:
- Heading: "Your Qualifying Accounts"
- Table or list:
  - Account name | Balance | Contributes to tier?
  - Checking | $15,000 | ✓
  - Savings | $8,500 | ✓
  - Total: $23,500
- Link: "Manage accounts" (future feature)

**Autopay Status Region**:
- Heading: "Your Autopays"
- List:
  - Type | Status | Expires | Counts toward tier?
  - Loan autopay | Active | May 31, 2026 | ✓ (all tiers)
  - Bill payment | Active | Feb 28, 2027 | ✓ (all tiers)
  - Count: 2 of 3 possible
- Link: "Add autopay" → Autopay Management

**Tier Loss Risk Alert** (conditional, if at risk):
- Supportive warning: "Your balance is approaching minimum"
- Days remaining: "120 days until grace period"
- Recovery options: "Increase balance by $X" or "Maintain X more autopays"
- Actions: Buttons "Transfer money" or "Add autopay"

**Advancement Path Region**:
- Heading: "Next Tier: Premium"
- Gap analysis: "You need: $1,500 more in balance + 2 autopays (you have 2)"
- Options: "Increase balance by $1,500" OR "Maintain current if you keep autopays active"
- Timeline: "Estimated 15 months if you add $100/month"
- Link: "View Premium tier benefits" → Tier Details

**Action Section**:
- Primary CTA: "Increase balance by $1,500" → Transfer
- Secondary CTA: "Review autopay" → Autopay Management
- Tertiary CTA: "View tier comparison" → Tier Details

---

## 6. Components & Responsibilities

**Page Component** (`app/loyalty/account-status/page.tsx`):
- Server-render: Fetch getTierStatus() with account breakdown + autopay details
- Pass data to client regions
- Implement error boundary with fallback UI
- Handle offline state with cached data display

**TierCalculationVisual**:
- **Purpose**: Visualize tier calculation formula with member-specific values
- **Props**:
  - `tier: 'classic' | 'plus' | 'premium'` (current tier)
  - `qualifyingBalance: number` (member's total qualifying balance)
  - `autopayCount: number` (active autopay count)
  - `className?: string` (optional Tailwind classes)
- **States**:
  - Default: Display formula with values highlighted
  - At Risk: Highlight deficit in red if approaching threshold
- **Accessibility**: Semantic HTML with aria-label explaining formula: "Your tier equals {balance} in qualifying accounts plus {count} active autopays, which qualifies for {tier} tier"
- **Implementation**: Render formula using SVG or semantic HTML icons (balance icon + autopay icon + equals sign + tier badge)

**QualifyingAccountsList**:
- **Purpose**: Display member's qualifying accounts with contribution status
- **Props**:
  - `accounts: Array<{ accountId, accountName, balance, rollingBalance3Month, contributesToTier }>`
  - `selectedAccountId?: string` (for expandable details state)
  - `onAccountSelect?: (accountId: string) => void` (for optional detail expansion)
- **States**:
  - Default: Collapsed table view showing account name, balance, checkmark
  - Expanded (optional): Show rolling 3-month balance history inline
  - Empty: "No qualifying accounts" message with link to account management
- **Rendering**: Table on desktop (`<table>`), stacked list on mobile (`<ul>` with proper spacing)
- **Accessibility**: `<table>` with header cells, `scope="col"` attributes, `aria-label` for checkmark column ("Account contributes to tier qualification")

**AutopayStatusList**:
- **Purpose**: Display active autopays with expiration tracking and tier contribution
- **Props**:
  - `autopays: Array<{ autopayId, type ('loan'|'bill'|'credit_card'), status ('active'|'expired'|'pending'), expirationDate, contributesToTier }>`
  - `onAddAutopayClick?: () => void` (for CTA interaction)
  - `today: Date` (for calculating days until expiration)
- **States**:
  - Active: Display with checkmark, green "Active" badge, expiration date
  - Expiring Soon (< 30 days): Display with warning icon, orange "Expiring Soon" badge
  - Empty: "No active autopays. Add one to maintain or advance tier." with "Add autopay" CTA
- **Rendering**: List format with visual badges (color-coded by status); desktop may show 2 columns for density
- **Accessibility**: Each autopay row has `aria-label` with full status ("Loan autopay, active, expires May 31, 2026")

**TierLossRiskAlert** (conditional):
- **Purpose**: Alert member if approaching tier loss threshold with recovery options
- **Props**:
  - `isAtRisk: boolean` (render only if true)
  - `riskType: 'balance' | 'autopay' | 'both'` (which factor is at risk)
  - `daysRemaining: number` (days until grace period threshold)
  - `recoverySteps: Array<{ action, amount, description }>` (specific actions needed)
  - `onTransferClick?: () => void` (CTA handlers)
  - `onAddAutopayClick?: () => void`
- **States**:
  - Default (if rendered): Yellow/amber background (#F59E0B), supportive tone alert box
  - Critical (< 14 days): Red background (#EF4444) with "Alert" prefix
- **Animation**: Fade-in on first load (200ms)
- **Rendering**: Alert banner with icon, message, recovery steps, and inline CTA buttons
- **Accessibility**: `role="alert"`, `aria-live="polite"`, all action steps announced to screen readers

**AdvancementPathCard**:
- **Purpose**: Show path to next tier with quantified gap and timeline estimate
- **Props**:
  - `nextTier: 'plus' | 'premium'` (next tier available)
  - `balanceGap: number` (additional balance needed)
  - `autopayGap: number` (additional autopays needed, typically 0)
  - `monthlyIncrementEstimate?: number` (default $100/month for timeline calculation)
  - `onViewTierDetailsClick?: () => void` (CTA handler)
- **States**:
  - Default: Show gap analysis, timeline, and action CTA
  - At Next Tier Threshold: Show "You're close to Premium tier!" with emphasized CTA
  - Premium Tier: Do not render (member at max tier)
- **Rendering**: Card layout with heading, gap summary, timeline calculation, "View Premium benefits" CTA
- **Calculation Logic**:
  - `monthsToReachTier = Math.ceil(balanceGap / monthlyIncrementEstimate)` (displayed as "Estimated 15 months")
  - Show both linear path (balance increase) and conditional path (if maintaining current)
- **Accessibility**: `aria-label` summarizing advancement opportunity: "You need {balanceGap} more in balance to reach {nextTier} tier, estimated {months} months away"

---

## 7. Interactions

**Navigation Interactions**:
- Click "Transfer money" CTA button → Navigate to `/transfer` (with referrer context: `?from=account-status`)
- Click "Add autopay" CTA button → Navigate to `/autopay/add` (with referrer context: `?from=account-status`)
- Click "View Premium benefits" or "View Premium tier" link → Navigate to `/loyalty/tier-details` with Premium tier pre-selected
- Click "Manage accounts" link (future) → Navigate to account management section (out of current scope)

**Expand/Collapse Interactions**:
- Click account row in QualifyingAccountsList → Expand to show 3-month rolling balance history (optional; default collapsed)
  - Keyboard: Tab to row, press Enter to toggle expand
  - Animation: 200ms smooth height transition
- Click "Refresh" button (if visible in error state) → Re-fetch tier status data

**Keyboard Navigation**:
- Tab through all interactive elements in order: Search (if present), Tier calculation visual, Account rows, Autopay rows, CTA buttons
- Enter/Space: Activate buttons and expand/collapse rows
- Escape: Close any expanded details (if modal-like behavior)
- Focus indicators: 4px outline border with 2px inner spacing, uses tier-color for visibility

**Accessibility Keyboard Shortcuts**:
- Alt+S: Focus search if present (future feature)
- Alt+T: Jump to tier calculation visual

**Touch/Mobile Interactions**:
- Tap account row → Expand with single tap (no double-tap required)
- Tap CTA buttons → Highlight with 200ms press animation
- Min 48×48px tap targets for all buttons and interactive rows

---

## 8. Data Contracts

### GET /api/member/:memberId/tier-status

```json
{
  "memberId": "MEMBER-001",
  "currentTier": "plus",
  "tierCalculation": {
    "qualifyingBalance": 23500,
    "autopayCount": 2,
    "formulaResult": "plus"
  },
  "qualifyingAccounts": [
    {
      "accountId": "CHK-9876",
      "accountName": "Checking",
      "balance": 15000,
      "rollingBalance3Month": 14500,
      "contributesToTier": ["classic", "plus", "premium"]
    },
    {
      "accountId": "SAV-5432",
      "accountName": "Savings",
      "balance": 8500,
      "rollingBalance3Month": 8200,
      "contributesToTier": ["classic", "plus"]
    }
  ],
  "autopayStatus": [
    {
      "autopayId": "AP-001",
      "type": "loan",
      "status": "active",
      "expirationDate": "2026-05-31",
      "contributesToTier": ["classic", "plus", "premium"]
    },
    {
      "autopayId": "AP-002",
      "type": "bill",
      "status": "active",
      "expirationDate": "2027-02-28",
      "contributesToTier": ["classic", "plus", "premium"]
    }
  ],
  "nextTierThreshold": {
    "tier": "premium",
    "minimumBalance": 25000,
    "balanceGap": 1500,
    "minimumAutopay": 2,
    "autopayGap": 0
  },
  "riskStatus": {
    "isAtRisk": false,
    "riskType": null,
    "daysUntilThreshold": 120,
    "recoverySteps": []
  }
}
```

---

## 9. Validation Rules

- Tier calculation must match PRD rules
- Account balances must sum correctly
- Autopay expiration dates must be valid and future-dated
- Risk alerts only triggered for immediate risk (14-day window for grace period)

---

## 10. Visual & Responsive Rules

- Large tier badge (64×64px) centered or left-aligned
- Account list: Full-width table on desktop, single-column on mobile
- Tier calculation formula: Visual components (balance icon + autopay icon = tier badge)
- Risk alert: Yellow/amber background (`#F59E0B`) if moderate risk, red if urgent

---

## 11. Accessibility Checklist

- Tier calculation formula: Semantic HTML or `aria-label` explaining calculation
- Account table: Proper `<table>` structure with header/body cells
- Risk alert: `role="alert"` for immediate announcements
- All amounts: 18pt+ Bold for scanability
- Actions: ≥48×48px buttons

---

## 12. Telemetry

**Event 1: Page View**
- `event: "account_status_view"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "currentTier": "plus",
    "isAtRisk": false,
    "riskType": null,
    "accountCount": 2,
    "autopayCount": 2,
    "timestamp": "2026-02-21T14:30:00Z",
    "source": "account-status-page"
  }
  ```
- Fired: On page load (server-side or client hydration)

**Event 2: Tier Loss Risk Alert Shown**
- `event: "tier_loss_risk_alert_shown"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "currentTier": "plus",
    "riskType": "balance",
    "daysUntilThreshold": 120,
    "balanceDeficit": 200,
    "timestamp": "2026-02-21T14:30:00Z"
  }
  ```
- Fired: When TierLossRiskAlert component renders (only if at risk)
- Use case: Track which members are being proactively notified of risk

**Event 3: Risk Recovery Action**
- `event: "tier_loss_risk_action_clicked"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "currentTier": "plus",
    "action": "transfer" | "add_autopay",
    "targetRoute": "/transfer" | "/autopay/add",
    "timestamp": "2026-02-21T14:30:05Z"
  }
  ```
- Fired: When member clicks "Transfer money" or "Add autopay" in risk alert
- Use case: Measure recovery action engagement

**Event 4: Advancement Path Interaction**
- `event: "advancement_path_viewed"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "currentTier": "plus",
    "nextTier": "premium",
    "balanceGap": 1500,
    "autopayGap": 0,
    "estimatedMonths": 15,
    "timestamp": "2026-02-21T14:30:10Z"
  }
  ```
- Fired: When AdvancementPathCard is visible/rendered
- Use case: Track tier advancement awareness

**Event 5: Advancement Path Action**
- `event: "advancement_path_action_clicked"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "currentTier": "plus",
    "nextTier": "premium",
    "action": "view_tier_details" | "transfer",
    "targetRoute": "/loyalty/tier-details" | "/transfer",
    "balanceGap": 1500,
    "timestamp": "2026-02-21T14:30:15Z"
  }
  ```
- Fired: When member clicks "View Premium benefits" or equivalent advancement CTA
- Use case: Measure advancement motivation and conversion to action

**Event 6: Account Details Expanded**
- `event: "account_details_expanded"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "accountId": "CHK-9876",
    "accountName": "Checking",
    "accountBalance": 15000,
    "timestamp": "2026-02-21T14:30:20Z"
  }
  ```
- Fired: When member expands account row to view rolling balance history
- Use case: Track detail-level engagement with account-specific data

**Event 7: Error Occurred**
- `event: "account_status_error"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "errorType": "tier_calculation_failed" | "network_error" | "data_missing",
    "errorMessage": "Unable to calculate your tier status",
    "timestamp": "2026-02-21T14:30:25Z"
  }
  ```
- Fired: When page fails to load tier status
- Use case: Track error frequency and types for debugging

---

## 13. Open Questions & Assumptions

**Questions**:
1. Should account balance history be shown graphically? (Current: assume no, show summary only — can be Phase 2)
2. How often is tier calculation refreshed? (Current: assume once daily, triggered by scheduled job or member login)
3. Should members be able to manually refresh tier status, or is daily refresh sufficient? (Current: assume daily only; manual refresh not in MVP)

**Assumptions**:
1. Tier calculation API (GET `/api/member/:memberId/tier-status`) returns all necessary data in single request
2. Autopay expiration dates are future-dated and valid (no past expirations in active list)
3. Rolling balance is pre-calculated by backend (frontend does not recalculate)
4. Risk alert threshold is "14 days before grace period expires" (hardcoded in business logic)
5. Timeline estimation assumes linear balance growth at $100/month increments (can be adjusted with `monthlyIncrementEstimate` prop)
6. Members see their own tier status only (no peer comparison or family account aggregation in MVP)
7. Account data shown is current as-of page load time; real-time updates deferred to Phase 2

---

## 14. Design Rationale

**UX Lead**: Account Status Detail provides member-specific tier calculation transparency; visual tier formula demystifies rules; advancement path provides quantified action items; risk alert tone is supportive, not alarming.

**Frontend Architect**: Server-renders member tier status; reuses TierBadge component; table layouts responsive to mobile; risk alert is conditional client component.

**Product/Delivery**: Account Status Detail supports PERSONA-02 optimization (specific advancement metrics); reduces support volume (members understand their tier status); risk alerts enable proactive retrogression prevention.

---

## 15. Cursor-Claude Ready Build Plan

### File Structure

```
app/loyalty/account-status/
├── page.tsx                          # Server component (main page)
└── components/
    ├── TierCalculationVisual.tsx     # Tier formula display
    ├── QualifyingAccountsList.tsx    # Accounts table/list
    ├── AutopayStatusList.tsx         # Autopay list with status badges
    ├── TierLossRiskAlert.tsx         # Risk alert banner (conditional)
    └── AdvancementPathCard.tsx       # Tier advancement path

lib/
├── api/
│   └── tierStatus.ts                 # getTierStatus() API call wrapper
├── hooks/
│   └── useTierStatus.ts              # Custom hook for tier status fetching/caching
└── types/
    └── tierStatus.ts                 # TypeScript interfaces for tier status data
```

### Implementation Checklist

**Phase 1: Data & API Layer**
- [ ] Create `lib/types/tierStatus.ts`:
  - [ ] `TierStatusResponse` interface (matching API contract in Section 8)
  - [ ] `TierCalculation` type
  - [ ] `QualifyingAccount` type
  - [ ] `AutopayStatus` type
  - [ ] `RiskStatus` type
- [ ] Create `lib/api/tierStatus.ts`:
  - [ ] `getTierStatus(memberId: string): Promise<TierStatusResponse>` function
  - [ ] Error handling with retry logic (3 attempts, exponential backoff)
  - [ ] Request timeout (5 seconds)

**Phase 2: Server Component**
- [ ] Create `app/loyalty/account-status/page.tsx`:
  - [ ] Fetch tier status server-side using `getTierStatus()`
  - [ ] Handle loading state (skeleton UI)
  - [ ] Handle error state (error message + support CTA + retry button)
  - [ ] Handle offline state (show cached data with "offline" badge)
  - [ ] Pass data to client components
  - [ ] Implement telemetry event: `account_status_view`

**Phase 3: Component Implementation**

**TierCalculationVisual Component**:
- [ ] Create `components/loyalty/account-status/TierCalculationVisual.tsx`
- [ ] Implement formula visualization (SVG or semantic HTML with icons)
- [ ] Display member's balance and autopay count with values highlighted
- [ ] Add aria-label explaining formula
- [ ] Props validation (tier must be classic/plus/premium, balances positive)
- [ ] Test: Render with different tier values, verify formula reads correctly

**QualifyingAccountsList Component**:
- [ ] Create `components/loyalty/account-status/QualifyingAccountsList.tsx`
- [ ] Implement desktop table layout (`<table>`, `<thead>`, `<tbody>`, `<tfoot>`)
  - [ ] Columns: Account Name | Balance | Contributes to Tier
  - [ ] Total row at bottom showing sum
- [ ] Implement mobile stacked layout (`<ul>` with semantic structure)
- [ ] Add expandable details (optional; shows rolling 3-month history)
  - [ ] 200ms smooth height transition animation
  - [ ] Keyboard: Enter to toggle expand
- [ ] Handle empty state ("No qualifying accounts found")
- [ ] Props validation (accounts array, proper structure)
- [ ] Test: Render with 1, 2, 3 accounts; test expand/collapse; test empty state

**AutopayStatusList Component**:
- [ ] Create `components/loyalty/account-status/AutopayStatusList.tsx`
- [ ] Implement list layout with status badges
  - [ ] Active: Green badge + checkmark
  - [ ] Expiring Soon (< 30 days): Orange badge + warning icon
  - [ ] Expired: Red badge + X icon
- [ ] Show expiration date for active autopays
- [ ] Calculate "days until expiration" from expirationDate and today
- [ ] Handle empty state ("No active autopays. Add one to maintain or advance tier.")
- [ ] Add "Add autopay" CTA button in empty state
- [ ] Props validation (autopays array, dates are valid futures)
- [ ] Test: Render with active/expiring/expired autopays; test empty state; verify day calculations

**TierLossRiskAlert Component**:
- [ ] Create `components/loyalty/account-status/TierLossRiskAlert.tsx`
- [ ] Conditional render based on `isAtRisk` prop (only render if true)
- [ ] Implement alert styling:
  - [ ] Moderate risk (> 14 days): Yellow/amber background (#F59E0B)
  - [ ] Critical risk (≤ 14 days): Red background (#EF4444)
- [ ] Display alert message with recovery steps
- [ ] Add "Transfer money" and "Add autopay" CTA buttons
- [ ] Add 200ms fade-in animation on mount
- [ ] Accessibility: `role="alert"`, `aria-live="polite"`, all steps announced
- [ ] Telemetry: Fire `tier_loss_risk_alert_shown` event on mount
- [ ] Props validation (daysRemaining positive, recoverySteps non-empty if at risk)
- [ ] Test: Render at-risk and not-at-risk states; verify animation; verify telemetry

**AdvancementPathCard Component**:
- [ ] Create `components/loyalty/account-status/AdvancementPathCard.tsx`
- [ ] Display next tier name (e.g., "Premium")
- [ ] Show gap analysis: "You need $X more in balance"
- [ ] Calculate timeline: `Math.ceil(balanceGap / monthlyIncrementEstimate)` months
- [ ] Display options: "If you increase balance by $100/month, you'll reach Premium in 15 months"
- [ ] Add "View Premium benefits" CTA button
- [ ] Handle max-tier case (Premium): Do not render card
- [ ] Telemetry: Fire `advancement_path_viewed` on mount, `advancement_path_action_clicked` on CTA click
- [ ] Props validation (nextTier is valid, gaps are non-negative)
- [ ] Test: Render for Classic→Plus and Plus→Premium progressions; test max-tier case; verify calculations

**Phase 4: Styling & Responsiveness**
- [ ] Apply Tailwind classes matching UX spec:
  - [ ] Tier badge: 64×64px, tier color
  - [ ] Account balances: 18pt+ Bold, green for positive values
  - [ ] All amounts: Green (#10B981) color
  - [ ] Buttons: Tier-color background, white text, 48×48px minimum tap targets
- [ ] Desktop layout:
  - [ ] 3-column grid for account list (optional for density)
  - [ ] Full-width CTA buttons or side-by-side (if space)
  - [ ] Max-width container (1200px) with padding
- [ ] Tablet layout:
  - [ ] Single-column account list, single-column autopay list
  - [ ] Stacked CTA buttons
  - [ ] Touch-friendly spacing (24px between sections)
- [ ] Mobile layout:
  - [ ] 100% width, 16px padding on sides
  - [ ] Stacked sections vertically
  - [ ] Full-width buttons
  - [ ] 48×48px minimum tap targets verified

**Phase 5: Testing**

**Unit Tests** (`TierCalculationVisual.test.tsx`):
- [ ] Renders formula with correct tier color
- [ ] Displays member balance and autopay count correctly
- [ ] Aria-label present and descriptive
- [ ] Props validation: throws error if invalid tier

**Unit Tests** (`QualifyingAccountsList.test.tsx`):
- [ ] Renders account rows correctly (name, balance, checkmark)
- [ ] Calculates total balance correctly
- [ ] Expands/collapses account details
- [ ] Empty state displays correctly
- [ ] Keyboard Enter key toggles expand
- [ ] Mobile list layout renders instead of table

**Unit Tests** (`AutopayStatusList.test.tsx`):
- [ ] Renders active autopays with green badge and expiration date
- [ ] Calculates "days until expiration" correctly
- [ ] Renders expiring-soon autopays with orange badge (< 30 days)
- [ ] Renders empty state with "Add autopay" CTA
- [ ] Empty state button click triggers callback

**Unit Tests** (`TierLossRiskAlert.test.tsx`):
- [ ] Does not render when `isAtRisk={false}`
- [ ] Renders alert when `isAtRisk={true}`
- [ ] Shows yellow background for moderate risk, red for critical (< 14 days)
- [ ] Displays recovery steps correctly
- [ ] "Transfer money" button triggers callback with `/transfer` route
- [ ] "Add autopay" button triggers callback with `/autopay/add` route
- [ ] Fade-in animation executes (verify animation class applied)
- [ ] `tier_loss_risk_alert_shown` telemetry event fires on mount
- [ ] `role="alert"` and `aria-live="polite"` attributes present

**Unit Tests** (`AdvancementPathCard.test.tsx`):
- [ ] Does not render when member at max tier (Premium)
- [ ] Displays next tier name and gap analysis
- [ ] Calculates timeline correctly: `Math.ceil(1500 / 100) = 15 months`
- [ ] Shows correct advancement CTA: "View Premium benefits"
- [ ] CTA click triggers callback and navigation
- [ ] `advancement_path_viewed` fires on mount
- [ ] `advancement_path_action_clicked` fires on CTA click with correct action type

**Integration Tests** (`account-status.integration.test.tsx`):
- [ ] Page loads tier status from API successfully
- [ ] All components render with correct data
- [ ] TierLossRiskAlert shows when member at risk
- [ ] AdvancementPathCard shows next tier path
- [ ] All CTAs navigate to correct routes
- [ ] Error state displays with retry button
- [ ] Offline state displays cached data
- [ ] `account_status_view` telemetry event fires on load

**E2E Tests** (`account-status.e2e.test.ts`):
- [ ] Navigate to `/loyalty/account-status` and page loads
- [ ] Verify tier calculation formula displays correctly
- [ ] Click "Transfer money" → Navigate to `/transfer`
- [ ] Click "Add autopay" → Navigate to `/autopay/add`
- [ ] Click "View Premium benefits" → Navigate to `/loyalty/tier-details`
- [ ] Expand account details (if applicable) → Details display
- [ ] Verify all text is readable at 16pt+ size
- [ ] Verify all buttons are ≥48×48px tap targets

**Phase 6: Accessibility & Performance**
- [ ] Lighthouse Accessibility audit: 90+ score
- [ ] Keyboard navigation: Tab through all interactive elements
- [ ] Screen reader testing: All text, labels, and alerts announced correctly
- [ ] Color contrast: All text 4.5:1 minimum (amounts 7:1 minimum)
- [ ] Focus indicators: 4px outline on all focusable elements
- [ ] Performance:
  - [ ] First Contentful Paint (FCP): < 1.5s
  - [ ] Largest Contentful Paint (LCP): < 2.5s
  - [ ] Cumulative Layout Shift (CLS): < 0.1
- [ ] Bundle size: Component and related dependencies < 50KB gzipped

**Phase 7: Documentation & Deployment**
- [ ] Add JSDoc comments to all component functions
- [ ] Document prop types and defaults
- [ ] Add usage examples in component files
- [ ] Update project README with Account Status page integration notes
- [ ] Test in staging environment with real API
- [ ] Deploy to production with feature flag (if using)

---

✅ **SHARD 04 COMPLETE**
