# Shard 02: SCR-04 Tier Details Screen Modifications — Smart Loyalty Transfer Feature

**Project**: Smart Loyalty Transfer Feature Enhancement
**Shard**: 02-tier-details-modifications-shard
**Affected Screen**: SCR-04 (Tier Details Page)
**Date**: 2026-02-22
**Status**: BUILD READY
**Depends On**: Shard 01 (Shared Infrastructure)
**Estimated LOC**: 650
**Time Estimate**: 2 days

---

## Section 1: Screen Name & Route

**Screen ID**: SCR-04
**Screen Name**: Tier Details Page
**Route**: `/tier-details` or `/loyalty/tier/{tierLevel}`
**Primary Purpose**: Display deep-dive information about tier requirements, benefits, and progression path

**Modifications**:
- Enhanced TierProgressionCTA button with deep-link generation
- Added LoyaltyAmountBadge inline tier gap display
- Real-time tier gap calculation and updates
- CTA click handler to generate and navigate to move-money deep-link

**Files Modified/Created**:
- `app/tier-details/page.tsx` (enhanced with loyalty context)
- `app/tier-details/components/TierCard.tsx` (enhanced)
- `app/tier-details/components/TierProgressionCTA.tsx` (new)
- `app/tier-details/components/LoyaltyAmountBadge.tsx` (new)
- `app/tier-details/hooks/useTierDetails.ts` (new)

---

## Section 2: Purpose & Jobs-to-be-Done

**Purpose**: Display tier information while offering a direct, low-friction path to tier progression transfers. The CTA transforms a passive "Learn More" button into an active "Transfer Now" action button.

**Jobs-to-be-Done**:
1. **For Members**: "I want to know what I need to reach the next tier, and I want to initiate that transfer immediately without leaving this page"
2. **For Product**: "I want members to recognize the specific amount they need to transfer and take action on it"
3. **For Design**: "I want to emphasize tier benefits and make the progression path crystal clear"

**Success Indicators**:
- CTA tap-through rate ≥40% from baseline (measured as CTA taps / page views)
- Average time from CTA tap to transfer confirmation <90 seconds
- Zero "confused about amount" support tickets related to this page

---

## Section 3: User Stories & Acceptance Criteria

**Story 1: Member sees tier gap clearly on page load**

- GIVEN: Member is viewing SCR-04 Tier Details for Plus tier
- WHEN: Page loads
- THEN: Member sees "You need to transfer $1,500 to reach Plus tier" clearly displayed
- AND: LoyaltyAmountBadge shows "$1,500" in large, legible text
- AND: "Transfer $1,500 to reach Plus" CTA button is visible, 48px+ tall, 7:1 contrast

**Story 2: Member taps CTA and deep-link is generated**

- GIVEN: Member is viewing tier gap ($1,500 to reach Plus)
- WHEN: Member taps "Transfer $1,500 to reach Plus" button
- THEN: URL is generated: `/move-money?loyalty=true&targetTier=plus&amount=1500&toAccountId=SAV-12345&memo=Loyalty+tier+qualification+transfer&initiatingPage=tier-details`
- AND: Navigation to move-money screen occurs
- AND: Analytics event `loyalty_transfer_cta_tapped` is fired with sourceTier=classic, targetTier=plus

**Story 3: Tier gap updates in real-time**

- GIVEN: Page has loaded with tier gap = $1,500
- WHEN: Member receives a deposit (balance changes to $9,000)
- AND: Page is in focus (or member taps "Refresh")
- THEN: Tier gap recalculates to $1,000
- AND: CTA button updates: "Transfer $1,000 to reach Plus"
- AND: No error; member never sees stale data

**Story 4: Already qualifies for tier**

- GIVEN: Member is viewing Plus tier card
- WHEN: Member's current balance = $10,500 (already qualifies)
- THEN: CTA button is disabled or hidden
- AND: Message displays: "✓ You already qualify for Plus tier"
- AND: Optional: "Next milestone: Premium tier" link to Premium card
- AND: Button is not clickable

**Story 5: Accessibility compliance**

- GIVEN: Member is using a screen reader
- WHEN: Member navigates to CTA button
- THEN: ARIA label announces: "Increase balance by $1,500 to reach Plus tier and unlock ATM fee waive plus 0.95% APY"
- AND: Keyboard tab navigation works; button is actionable via Enter/Space
- AND: Focus ring is visible (2px, 7:1 contrast)

---

## Section 4: States

**State 1: Loading**
- Tier gap data is being fetched
- CTA button shows spinner + "Loading..."
- LoyaltyAmountBadge is hidden or shows skeleton

**State 2: Loaded - Gap Exists**
- Tier gap successfully calculated: $1,500
- CTA button text: "Transfer $1,500 to reach Plus"
- CTA enabled, clickable
- LoyaltyAmountBadge displays "$1,500"

**State 3: Loaded - Already Qualifies**
- Tier gap = 0 (member already qualifies)
- CTA button disabled or hidden
- Message: "✓ You already qualify for Plus"
- Optional: Link to next tier (Premium)

**State 4: Insufficient Funds**
- Tier gap exists but member's total liquid assets < gap
- CTA still clickable (respects member autonomy)
- Subtext warning: "You'll need to save more to qualify"

**State 5: Data Stale**
- Tier gap calculated >15 min ago
- Soft warning: "Balance updated 20 min ago"
- "Refresh?" button available to recalculate

**State 6: Error**
- Tier gap fetch failed (network error)
- CTA button shows error state: "Unable to load tier info"
- "Retry" button available
- Fallback: Show generic "Learn More" button

**State 7: Hover/Focus**
- CTA button background slightly lighter or darker (clear visual feedback)
- Tooltip or expanded text shows tier benefits: "ATM fee waive, 0.95% APY, etc."

---

## Section 5: Information Architecture

**Page Structure**:

```
Tier Details Page
├── Header Section
│   ├── Tier Name (e.g., "Plus Tier")
│   ├── Tier Badge/Icon
│   └── "This is your next tier" or "You already have this tier"
│
├── Tier Requirements Section
│   ├── Requirement 1: Rolling Average Balance
│   │   ├── Icon (balance)
│   │   ├── Label: "Rolling Average Balance"
│   │   ├── Requirement: "$10,000"
│   │   ├── Current: "$8,500"
│   │   └── Gap: "Need $1,500 more" ← Uses LoyaltyAmountBadge
│   │
│   ├── Requirement 2: Active Autopays
│   │   ├── Label: "Active Autopays"
│   │   ├── Requirement: "2 minimum"
│   │   └── Current: "1"
│   │
│   └── Requirement 3: Credit Cards
│       ├── Label: "Max Credit Cards"
│       ├── Requirement: "1 maximum"
│       └── Current: "0"
│
├── Tier Benefits Section
│   ├── Benefit 1: APY
│   │   ├── Icon
│   │   ├── Label: "Savings APY"
│   │   ├── Value: "0.95%"
│   │   └── Savings: "Save ~$45/year"
│   │
│   ├── Benefit 2: Fee Waives
│   │   ├── Icon
│   │   ├── Label: "ATM Fee Waive"
│   │   ├── Value: "$0.50/mo"
│   │   └── Savings: "Save ~$6/year"
│   │
│   └── Benefit 3: Services
│       ├── Icon
│       ├── Label: "Included Autopays"
│       ├── Value: "2 free"
│       └── Savings: "Save $0 (standard)"
│
├── CTA Section ← Core modification
│   ├── TierProgressionCTA Button
│   │   ├── Text: "Transfer $1,500 to reach Plus"
│   │   ├── Click: Generate deep-link & navigate
│   │   ├── State: Enabled/Disabled/Loading/Error
│   │   └── Accessibility: ARIA labels, keyboard nav
│   │
│   └── Help Text
│       └── "Tap to transfer funds and reach this tier instantly"
│
├── Next Steps Section (Optional)
│   ├── After reaching Plus: "Next, work toward Premium"
│   ├── Link: "View Premium tier benefits →"
│
└── FAQ / Help Section (Optional)
    ├── "How are tier benefits calculated?"
    ├── "Can I transfer to multiple tiers?"
    └── "Contact support" link
```

---

## Section 6: Components & Responsibilities

**Component 1: TierProgressionCTA**

**File**: `app/tier-details/components/TierProgressionCTA.tsx`

**Responsibility**: Render a prominent CTA button that, when clicked, calculates tier gap, generates deep-link URL, and navigates to Move Money screen.

**Props Interface**:
```typescript
interface TierProgressionCTAProps {
  currentTier: TierLevel;
  targetTier: TierLevel;
  tierGapAmount: number;
  destinationAccountId: string;
  destinationAccountName: string;
  tierBenefits: TierBenefit[];
  isLoading?: boolean;
  isDisabled?: boolean;
  disabledReason?: string;  // e.g., "You already qualify"
  onCTAClick?: () => void;  // Analytics callback
}
```

**Render**:
```
┌────────────────────────────────────────────┐
│ [ICON] Transfer $1,500 to reach Plus      │ ← 48px height, 16px font
└────────────────────────────────────────────┘
```

**Behavior**:
1. On click: Call `calculateTierTransferContext()`
2. Generate URL: `/move-money?loyalty=true&targetTier=plus&...`
3. Navigate: `router.push(url)`
4. Fire analytics: `loyalty_transfer_cta_tapped`
5. Track time for success metric (time to confirmation)

**Accessibility**:
- `aria-label`: "Increase balance by $1,500 to reach Plus tier and unlock ATM fee waive plus 0.95% APY savings rate"
- `aria-busy="true"` when loading
- `aria-disabled="true"` when disabled
- Visible focus ring (2px, teal-500)
- Keyboard: Tab to focus, Enter/Space to activate

**LOC**: ~150

---

**Component 2: LoyaltyAmountBadge**

**File**: `app/tier-details/components/LoyaltyAmountBadge.tsx`

**Responsibility**: Display the tier gap amount prominently, inline with requirements.

**Props Interface**:
```typescript
interface LoyaltyAmountBadgeProps {
  amount: number;              // e.g., 1500
  isStale?: boolean;          // true if data >15 min old
  currencySymbol?: string;    // defaults to "$"
  showRefresh?: boolean;      // Show "Refresh?" button
  onRefresh?: () => void;
}
```

**Render**:
```
┌──────────────────────────────────┐
│ Gap: $1,500 ┄┄ Need $1,500 more │
└──────────────────────────────────┘
```

(Stale state):
```
┌──────────────────────────────────┐
│ Gap: $1,500  ⚠️ Updated 15 min ago
│ [Refresh?]
└──────────────────────────────────┘
```

**Behavior**:
- Display amount with currency symbol
- If `isStale`, show warning icon + timestamp
- On "Refresh?" click, call `onRefresh()` to re-fetch tier gap
- Animate color change when amount updates

**Accessibility**:
- Label describes purpose: "Amount you need to transfer to reach next tier"
- Announce stale state to screen readers

**LOC**: ~120

---

**Component 3: TierCard (Enhanced)**

**File**: `app/tier-details/components/TierCard.tsx`

**Modification**: Existing tier card component modified to include TierProgressionCTA and LoyaltyAmountBadge.

**Before**:
```
┌─ Tier Card ─────────────────────┐
│ Plus Tier                       │
│ Rolling Avg: $10,000            │
│ Autopays: 2                     │
│ Benefits: ...                   │
│ [Learn More →] [Upgrade Now]   │
└─────────────────────────────────┘
```

**After**:
```
┌─ Tier Card ─────────────────────┐
│ Plus Tier                       │
│ Rolling Avg: $10,000 (you have $8,500)
│              Gap: $1,500 ← LoyaltyAmountBadge
│ Autopays: 2 (you have 1)
│ Benefits: ...                   │
│ [Transfer $1,500 to reach Plus] ← TierProgressionCTA
└─────────────────────────────────┘
```

**LOC**: ~100 (modification)

---

**Page Component**:

**File**: `app/tier-details/page.tsx`

**Responsibility**: Orchestrate tier data fetching, pass context to sub-components, handle real-time updates.

**Hook Usage**:
- `useTierGap(memberId)` to fetch tier gap
- `useLoyaltyTransfer()` to store context for downstream use
- `useSearchParams()` to parse URL (if navigating back to this page)

**Render Logic**:
```typescript
export default function TierDetailsPage() {
  const searchParams = useSearchParams();
  const tierLevel = searchParams.get('tier') || 'plus';

  const { gap, isLoading, error, refresh } = useTierGap(memberId);
  const { context, setContext } = useLoyaltyTransfer();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState onRetry={refresh} />;

  return (
    <main>
      <TierCard
        tierLevel={tierLevel}
        gap={gap}
        onCTAClick={() => {
          // Calculate and store context
          const ctx = calculateTierTransferContext(gap);
          setContext(ctx);
          // Navigate (handled by TierProgressionCTA)
        }}
        onRefreshClick={refresh}
      />
    </main>
  );
}
```

**LOC**: ~150

---

## Section 7: Interactions

**Interaction 1: Page Load → Tier Gap Calculation**

```
User navigates to /tier-details?tier=plus
  ↓
Page mounts
  ↓
useTierGap(memberId) hook called
  ↓
Mock/Real service fetches gap:
  currentBalance: 8500
  tierThreshold: 10000
  tierGapAmount: 1500
  ↓
TierCard renders with:
  - LoyaltyAmountBadge: "$1,500"
  - TierProgressionCTA: "Transfer $1,500 to reach Plus" (enabled)
  ↓
Analytics: `tier_details_page_viewed` with tier=plus, gap=1500
```

**Interaction 2: CTA Click → Deep-Link Generation**

```
User taps "Transfer $1,500 to reach Plus" button
  ↓
TierProgressionCTA.onClick() triggered
  ↓
calculateTierTransferContext({
  currentTier: 'classic',
  targetTier: 'plus',
  tierGapAmount: 1500,
  destinationAccountId: 'SAV-12345',
  tierBenefits: [...]
}) called
  ↓
generateLoyaltyTransferUrl(context) creates:
  "/move-money?loyalty=true&targetTier=plus&amount=1500&toAccountId=SAV-12345&memo=Loyalty+tier+qualification+transfer&initiatingPage=tier-details"
  ↓
router.push(url)
  ↓
Browser navigates to /move-money
  ↓
Analytics:
  `loyalty_transfer_cta_tapped` {
    currentTier: 'classic',
    targetTier: 'plus',
    amount: 1500,
    initiatingPage: 'tier-details',
    timestamp: '2026-02-22T14:32:15Z'
  }
```

**Interaction 3: Real-Time Tier Gap Update**

```
User is on /tier-details?tier=plus
  ↓
Member receives a $500 deposit (balance changes to $9,000)
  ↓
(Option A: User taps "Refresh?" button)
useTierGap(memberId, { forceRefresh: true }) called
  ↓
Tier gap recalculated: 10000 - 9000 = 1000
  ↓
LoyaltyAmountBadge updates: "$1,500" → "$1,000"
  ↓
TierProgressionCTA updates: "Transfer $1,500..." → "Transfer $1,000..."
  ↓
isStale flag removed (data <5 min old)
  ↓
Analytics: `tier_gap_refreshed` { newGap: 1000, oldGap: 1500 }
```

**Interaction 4: Already Qualifies**

```
User is viewing Plus tier card
  ↓
Tier gap calculation returns: tierGapAmount = 0 (member already qualifies)
  ↓
TierProgressionCTA is disabled/hidden
  ↓
Message displays: "✓ You already qualify for Plus tier"
  ↓
Optional link: "Next milestone: Premium tier" navigates to Premium card
  ↓
Analytics: `tier_already_qualified` { tier: 'plus' }
```

---

## Section 8: Data Contracts

**URL Params** (Input):
```
GET /tier-details?tier=plus
GET /tier-details?tier=premium
GET /tier-details?tier=classic
```

**Deep-Link Generated** (Output to Move Money):
```
GET /move-money?loyalty=true
  &targetTier=plus
  &amount=1500
  &toAccountId=SAV-12345
  &memo=Loyalty+tier+qualification+transfer
  &initiatingPage=tier-details
```

**Service Response** (`useTierGap` return):
```typescript
{
  memberId: 'mem-98765',
  currentTier: 'classic',
  nextTier: 'plus',
  currentBalance: 8500,
  nextTierThreshold: 10000,
  tierGapAmount: 1500,
  destinationAccountId: 'SAV-12345',
  destinationAccountType: 'savings',
  qualificationAccountType: 'savings',
  activeAutopays: 1,
  requiredAutopays: 2,
  activeCreditCards: 0,
  maxCreditCards: 1,
  calculatedAt: '2026-02-22T14:30:00Z',
  qualifiesNow: false,
  wouldQualifyWith: (amount) => (8500 + amount) >= 10000
}
```

---

## Section 9: Validation Rules

| Field | Rule | Error | Warning |
|-------|------|-------|---------|
| Tier Level | Must be valid tier (classic, plus, premium) | Invalid tier | N/A |
| Tier Gap | Must be ≥ 0 | N/A | If 0: "Already qualifies" |
| Destination Account | Must exist and count toward tier | Account invalid | Restricted account |
| Tier Benefits | Must be non-empty array | No benefits | Display generic benefits |
| Data Freshness | Cache for 5 min; warn if >15 min old | N/A | Show stale warning + refresh button |

---

## Section 10: Visual & Responsive Rules

**Tailwind Classes**:

```css
/* CTA Button */
.tier-progression-cta {
  @apply min-h-[48px] min-w-[48px] px-6 py-3 rounded-lg;
  @apply font-semibold text-base md:text-lg;
  @apply bg-teal-600 text-white;
  @apply hover:bg-teal-700 active:bg-teal-800;
  @apply focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2;
  @apply disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed;
  @apply transition-all duration-200;
}

/* Amount Badge */
.loyalty-amount-badge {
  @apply inline-flex items-center gap-2;
  @apply px-3 py-2 rounded-md;
  @apply bg-teal-50 border-l-4 border-teal-500;
  @apply text-base font-semibold text-gray-900;
}

.loyalty-amount-badge.stale {
  @apply bg-yellow-50 border-yellow-500;
}

/* Tier Card */
.tier-card {
  @apply p-6 rounded-lg border-2 border-gray-200;
  @apply bg-white shadow-sm;
  @apply md:p-8;
}
```

**Responsive Behavior**:
- Mobile (320px): Single column, full-width CTA
- Tablet (641px): Side-by-side benefits and CTA
- Desktop (1025px): Multi-column layout with detailed tier comparisons

---

## Section 11: Accessibility Checklist

- [x] CTA button: 48px × 48px minimum tap target
- [x] Font size: 16px+ (WCAG AAA)
- [x] Color contrast: 7:1+ (banner background vs. text)
- [x] Focus ring: 2px, 7:1 contrast, visible on all interactive elements
- [x] ARIA labels: Describe button purpose (tier, amount, benefits)
- [x] Keyboard navigation: Tab to reach CTA, Enter/Space to activate
- [x] Screen reader: Announce tier gap, benefits, button state
- [x] Loading state: `aria-busy="true"` while fetching
- [x] Disabled state: `aria-disabled="true"` with reason in `aria-label`
- [x] Semantic HTML: Use `<button>` not `<div>` with onclick
- [x] Plain language: "Transfer $1,500 to reach Plus" not "Elevate account status to Plus tier"
- [x] No color-only messaging: Combine color with text/icons

---

## Section 12: Telemetry

| Event | Trigger | Payload |
|-------|---------|---------|
| `tier_details_page_viewed` | Page loads | { tier: 'plus', gap: 1500, isStale: false } |
| `loyalty_transfer_cta_tapped` | CTA clicked | { currentTier: 'classic', targetTier: 'plus', amount: 1500, initiatingPage: 'tier-details' } |
| `tier_gap_refreshed` | User clicks "Refresh" | { newGap: 1000, oldGap: 1500, deltaMinutes: 15 } |
| `tier_already_qualified` | Gap = 0 | { tier: 'plus' } |
| `tier_gap_fetch_error` | API call fails | { errorCode: 'NETWORK_ERROR', retryCount: 3 } |

---

## Section 13: Open Questions & Assumptions

**Open Questions**:
1. Should we show all three tiers (Classic, Plus, Premium) on one page, or have separate page views for each?
   - Assumption: Separate pages per tier for clarity
2. Should tier gap update automatically on timer, or only when user taps "Refresh"?
   - Assumption: Only on refresh (respects user control, reduces API calls)

**Assumptions**:
- [x] Tier gap is always ≥ 0; never negative
- [x] Destination account for tier qualification is always known (no ambiguity)
- [x] Member has at least one qualifying account type (savings or checking)
- [x] Tier benefits are configurable per tier (loaded from service, not hardcoded)

---

## Section 14: Design Rationale

**Design Expert**: "The CTA transforms the page from informational to actionable. By prominently displaying the tier gap and making the 'transfer now' path crystal clear, we eliminate the gap between desire (wanting the tier) and action (initiating the transfer). The 48px button size ensures older users can tap easily. The teal color ties to the loyalty brand, making it visually distinct from non-loyalty CTAs."

**Engineering Expert**: "Using `useTierGap` hook allows the page to benefit from real-time balance updates without re-fetching on a timer. The deep-link generation is handled inside TierProgressionCTA, keeping the logic co-located with the UI. This reduces prop drilling and makes the component self-contained."

**Product Expert**: "This page is the entry point for the loyalty transfer journey. By pre-calculating the gap and offering a direct CTA, we reduce the 6-step tier progression transfer to 2 steps: (1) Tap CTA, (2) Confirm on Move Money. This directly supports our goal of 40%+ conversion lift."

---

## Section 15: Build Plan

**Day 1**: Implement TierProgressionCTA and LoyaltyAmountBadge components
**Day 2**: Integrate into page, handle real-time updates, accessibility testing

**Test Coverage**:
- Unit tests for CTA click handler, deep-link generation
- Integration tests for tier gap updates
- E2E tests: Page load → CTA tap → navigate to Move Money
- Accessibility: Keyboard nav, screen reader, focus management

**Success Criteria**:
- [x] CTA taps trigger analytics events
- [x] Deep-link URL is correctly formatted
- [x] Navigation to Move Money succeeds
- [x] Tier gap updates in real-time
- [x] WCAG 2.1 AAA compliance verified

---

**Document Generated**: 2026-02-22
**Status**: READY FOR IMPLEMENTATION
