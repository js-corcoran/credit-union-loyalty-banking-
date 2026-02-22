# Shard 12: Autopay Management List

**Build Priority**: P1 — Critical tier qualification feature
**Estimated Effort**: 14 hours
**Screen ID**: SCR-12
**Route**: `/autopay`
**Component File**: `app/autopay/page.tsx`

---

## 1. Screen Name & Route

**Full Screen Name**: Autopay Management List with Tier Contribution Status
**URL Route**: `/autopay`
**Navigation Access**: Main navigation → "Autopay" or Loyalty Hub → "Manage Autopay"
**Page Title**: "Autopay Management"
**Breadcrumb**: Home > Autopay
**Auth Requirements**: Authenticated member with active accounts

---

## 2. Purpose & Jobs-to-be-Done

**Primary Purpose**: Central hub for viewing all active autopay items (loans, credit cards, bill payments) with transparent tier contribution status. Members must understand which autopays count toward tier qualification, any autopay-specific rules (e.g., "1 credit card autopay max per tier"), and how autopay status impacts their current tier and path to advancement.

**Jobs-to-be-Done**:
1. **View all autopays** — Member wants complete view of automated payments they've set up across accounts
2. **Understand tier impact** — Member needs to see how each autopay contributes to their tier qualification without confusion
3. **Manage autopays** — Member wants to add new autopay, edit existing, or remove with clear consequences visible
4. **Prevent tier loss** — Member recognizes which autopays are critical to maintaining current tier and avoids accidental removal

**Design Principle Applied**: "Transparency & Control" — Show tier contribution for each autopay with clear, scannable status indicators; "Cognitive Load Management" — Avoid overwhelming with rules; show rules inline only where applicable to user's specific autopays.

---

## 3. User Stories & Acceptance Criteria

### Story 1: Member Views All Autopays with Tier Status

**As a** benefit-aware member (PERSONA-02)
**I want to** see all my autopays and understand how each one counts toward my tier
**So that** I can make informed decisions about whether to add, edit, or remove autopays

**Given** I navigate to `/autopay`
**When** the page loads
**Then** I see:
- Heading: "Your Autopay Items" (20pt Bold)
- List of all active autopays with:
  - Autopay target (e.g., "Auto Loan — $450/month")
  - Frequency: "Monthly on the 15th"
  - Status: "Active" or "Scheduled" with visual indicator
  - **NEW**: Tier contribution section:
    - Badge showing tiers it counts toward: "Counts toward Classic, Plus, Premium"
    - Explanation: "This loan autopay qualifies for all tier levels" (gray text, optional)
    - Any limits: "Note: Only 1 credit card autopay per tier level" (if applicable)
    - Current contribution status: "Helps maintain your Plus tier" (green highlight if member qualifies)
- Add Autopay CTA: "Add New Autopay" (primary button)
- Empty state (if no autopays): "No autopays set up. Add one to unlock higher tier benefits."

**And** tier contribution information is clear and scannable without requiring expansion

---

### Story 2: Member at Risk Recognizes Tier Dependency

**As a** Plus tier member (PERSONA-02)
**I want to** see which autopays are critical to maintaining my tier
**So that** I avoid accidentally removing an autopay and losing my tier status

**Given** I'm a Plus tier member with 2 loan autopays (exactly meeting Plus requirement of 2 autopays)
**When** I view my autopay list
**Then** I see:
- Each autopay row displays: Target, frequency, status
- Tier contribution badge: "Counts toward Plus + Premium" (gold/tier color)
- Contribution status: "Required to maintain your Plus tier" (emphasized, yellow or gold background)
- Action menu on each autopay row:
  - Edit (pencil icon)
  - Remove (with warning: "Removing this autopay will drop you to Classic tier. Are you sure?")
  - Pause (if available; "Temporarily pause until [date]" alternative to removal)
- Support message: "These autopays are keeping you in Plus tier. Contact support if you need help managing."

**And** the warning/emphasis only appears for autopays that would cause tier retrogression if removed

---

### Story 3: Member Adds New Autopay from List

**As a** member seeking to advance tier (PERSONA-02)
**I want to** add a new autopay from this list screen
**So that** I don't need to navigate elsewhere to improve my tier status

**Given** I'm on the autopay list page and my Plus tier could advance to Premium with 1 more autopay
**When** I click "Add New Autopay"
**Then** I navigate to SCR-13 (Autopay Setup) with:
- Prefill context: "Adding autopay will move you toward Premium tier"
- Progress indicator: "You have 2 of 3 required autopays for Premium"
- Setup form appears (see SCR-13 for details)

**And** after successful setup, I return to autopay list with new autopay visible and tier impact message updated

---

### Story 4: Member Removes Autopay with Clear Retrogression Warning

**As a** member managing autopays
**I want to** remove an autopay and understand the tier impact before confirming
**So that** I can decide whether to proceed, pause instead, or contact support

**Given** I'm on the autopay list and I click "Remove" on an autopay
**When** the removal confirmation appears
**Then** I see:
- Warning modal/card with clear retrogression message:
  - Icon: Alert icon (yellow, not alarming)
  - Title: "Removing this autopay will drop you to Classic tier"
  - Explanation: "Your Plus tier requires 2 autopays. Removing this one leaves you with 1 autopay."
  - Benefits lost: "You'll lose +0.25% APY boost ($58/year on your balance)"
  - Recovery path: "You can get back to Plus by adding another autopay or reaching $10,000 balance."
- Action buttons:
  - "Pause Instead" (if available; shows date selector)
  - "Continue Removal" (red/destructive style, requires confirmation)
  - "Cancel"
- Support link: "Questions? Contact support" → Help page

**And** the tone is supportive, not threatening; includes clear path to recovery

---

## 4. States

### Default State
- Autopay list fully loaded with all active autopays
- Tier contribution information visible for each autopay
- Add Autopay CTA prominent and enabled
- No tooltips or warnings unless user hovers/taps on actions

### Loading State
- Skeleton rows for each expected autopay (show ~3 placeholders if unknown count)
- Heading visible: "Loading your autopay information..."
- Add Autopay button disabled until data loads
- Timeout: If data not loaded after 10 seconds, show error state with retry

### Empty State
- No autopays exist
- Heading: "No Autopays Set Up"
- Icon: Calendar/check icon
- Message: "Add autopays to unlock higher tier benefits and automate your payments."
- Primary CTA: "Add Your First Autopay" → SCR-13
- Secondary link: "Learn about autopay benefits" → Loyalty Hub

### Error State
- Autopay list fails to load
- Error message: "Unable to load your autopays. Please try again."
- Retry button: "Retry"
- Support link: "Contact support if problem persists"
- Fallback: Show cached data if available with "Data may be outdated" banner

### Permission Denied State
- User lacks permission to view/manage autopays
- Message: "You don't have permission to manage autopays for this account."
- Support CTA: "Contact support"

### Offline State
- "You're offline. Showing cached autopay information."
- Data shown is last-known state
- Add/Edit/Remove actions disabled until online

---

## 5. Information Architecture

### Visual Regions (Top to Bottom)

**Header Region**:
- Page title: "Your Autopay Items" (20pt Bold)
- Optional description: "View and manage automated payments. Your autopays help unlock tier benefits." (14pt, secondary text)

**Tier Status Summary** (optional, above list):
- Quick card: "Your Plus tier requires 2 autopays. You have 2 active." (green check if requirements met, yellow alert if at risk)
- Link: "View tier details" → `/loyalty/tier-details`

**Autopay List Region**:
- Column headers (if table): Target | Frequency | Status | Tier Contribution | Actions
- For each autopay, display as row or card:
  - **Autopay Target**: Loan/Credit Card name, account identifier
    - Bold 16pt for scannability
    - Account type icon (loan vs. card)
  - **Frequency**: "Monthly on the 15th" (14pt)
  - **Status**: "Active" (green badge) or "Scheduled" (blue badge) or "Paused" (gray badge)
  - **Tier Contribution**: Badge showing tiers (e.g., "Classic, Plus, Premium")
    - If autopay is critical to current tier: Gold/colored background with emphasis
    - Text: "Required to maintain Plus tier" (if applicable)
  - **Actions**: Menu button (⋮) or inline buttons (Edit, Remove)
    - Edit (pencil icon) → SCR-13
    - Remove (trash icon) → Confirmation modal
    - Pause (if available; clock icon) → Date selector
    - Link "View details" (info icon) → Transaction/account detail (optional)

**Add Autopay Section** (bottom of list or floating):
- Primary CTA: "Add New Autopay" button (48×48px tap target)
- Alt text: "Tap to add a new autopay and move toward higher tiers"

**Support Section** (optional footer):
- Contact info for questions about autopay and tier impact
- Link to Help page (SCR-07)

### Content Priority

1. **Autopay targets and frequency** — Members need to know what payments are automated
2. **Tier contribution status** — Which tiers does each autopay count toward
3. **Retrogression warnings** — If removing would cause tier loss
4. **Action buttons** — How to manage (add, edit, remove)
5. **Support link** — Fallback if member has questions

### Progressive Disclosure

- List shows autopay + tier contribution at a glance
- Detailed tier rules available via link to Tier Details page
- Removal warnings appear on demand (when user initiates removal)
- No third-level navigation required for core use case

---

## 6. Components & Responsibilities

### Component Tree

```
Page (app/autopay/page.tsx) — Server Component
├── Header (from layout)
├── TierStatusSummary (Client, optional)
│   ├── Card showing "You have X of Y autopays for Plus tier"
│   ├── Status indicator (check or warning)
│   └── Link to tier details
├── AutopayListRegion (Client)
│   ├── Heading "Your Autopay Items"
│   └── AutopayListTable (Client)
│       └── AutopayListRow × N (Client)
│           ├── AutopayTarget (loan/card name + icon)
│           ├── Frequency display
│           ├── StatusBadge
│           ├── TierContributionBadge
│           ├── ActionMenu
│           │   ├── Edit link
│           │   ├── Remove button (triggers modal)
│           │   ├── Pause button (if available)
│           │   └── View details link
│           └── (on Remove click) RemovalConfirmationModal (Client)
│               ├── Warning icon
│               ├── Title + explanation
│               ├── Benefits lost display
│               ├── Recovery path
│               ├── "Pause Instead" button
│               ├── "Continue Removal" button (destructive)
│               └── "Cancel" button
├── AddAutopaySection (Client)
│   └── Primary CTA "Add New Autopay" button
├── SupportSection (optional)
│   └── Help link + contact info
└── Footer (from layout)
```

### Component Responsibilities

**AutopayListTable** (NEW):
- Props: `autopays: Autopay[]`, `memberTier`, `tierRequirements`
- Responsibility: Render all autopays with tier contribution status
- Accessibility: Table semantic structure with headers and row scopes

**AutopayListRow** (NEW):
- Props: `autopay`, `memberTier`, `isRequiredForCurrentTier`, `onEdit`, `onRemove`, `onPause`
- Responsibility: Render single autopay with actions
- Variants: standard, highlighted (if required for tier), paused

**RemovalConfirmationModal** (NEW):
- Props: `autopay`, `currentTier`, `benefitsLost`, `recoveryPath`, `onConfirm`, `onCancel`, `onPause`
- Responsibility: Display retrogression warning and handle removal logic
- Accessibility: Modal with aria-modal, focus trap

**TierContributionBadge** (NEW):
- Props: `tiers: string[]`, `isRequired: boolean`
- Responsibility: Display tier badge with emphasis if required for current tier

**Page (app/autopay/page.tsx)**:
- Responsibility: Fetch member's autopays, tier status, render list
- Server-side: Fetch `getAutopays()`, `getMemberTier()`
- Error handling: If autopay fetch fails, show error state

---

## 7. Interactions

### Click Interactions

**"Edit" Button**:
- Click → Navigate to `/autopay/[id]/edit` with autopay details pre-filled (SCR-13)

**"Remove" Button**:
- Click → Open RemovalConfirmationModal
- Modal shows retrogression warning (if applicable)

**"Continue Removal" Button**:
- Click → Submit removal request, close modal
- On success: Autopay removed from list, list re-fetches or updates in real-time
- Toast message: "Autopay removed. Your tier has changed to Classic." (if retrogression)

**"Pause Instead" Button**:
- Click → Show date selector for pause duration
- Options: "Until [date]" or "Until [date in 3 months]"
- Submit → Autopay paused, modal closes, list shows paused status

**"Add New Autopay" Button**:
- Click → Navigate to `/autopay/add` (SCR-13)
- Prefill context: If member could advance by adding autopay, show hint in SCR-13

**"View Tier Details" Link**:
- Click → Navigate to `/loyalty/tier-details`

### Keyboard Navigation

- **Tab order**: Tier status summary → Autopay list rows (Edit, Remove, Pause buttons in order) → Add Autopay button
- **Enter/Space**: Activate Edit, Remove, or Pause buttons
- **Escape**: Close any open modals

### Touch Interactions (Mobile)

- **Row tap**: Expand details or show action menu
- **Action button tap**: ≥48×48px target
- **Modal buttons**: Full-width on mobile for touch ease

### Focus Management

- **Page load**: Focus moves to "Add New Autopay" button (primary action)
- **Modal opens**: Focus moves to modal heading (RemovalConfirmationModal)
- **Modal closes**: Focus returns to Remove button that opened it
- **Autopay removed**: Live region announces "Autopay removed"

---

## 8. Data Contracts

### GET /api/member/:memberId/autopays

**Response** (HTTP 200 OK):
```json
{
  "memberId": "MEMBER-001",
  "autopays": [
    {
      "autopayId": "AP-001",
      "paymentType": "loan",
      "targetAccountName": "Auto Loan",
      "amount": 450.00,
      "frequency": "monthly",
      "dayOfMonth": 15,
      "status": "active",
      "nextPaymentDate": "2026-03-15",
      "tierContribution": {
        "countsToward": ["classic", "plus", "premium"],
        "limits": null,
        "description": "Loan autopays count toward all tier levels"
      }
    },
    {
      "autopayId": "AP-002",
      "paymentType": "credit_card",
      "targetAccountName": "Rewards Card",
      "amount": 300.00,
      "frequency": "monthly",
      "dayOfMonth": 1,
      "status": "active",
      "nextPaymentDate": "2026-03-01",
      "tierContribution": {
        "countsToward": ["plus", "premium"],
        "limits": "Only 1 credit card autopay per tier level",
        "description": "Credit card autopays count toward Plus and Premium tiers (max 1 per tier)"
      }
    }
  ],
  "memberTier": "plus",
  "tierRequirements": {
    "tier": "plus",
    "requiredAutopayCount": 2,
    "currentAutopayCount": 2,
    "breakdownByType": {
      "loan": 1,
      "creditCard": 1,
      "billPayment": 0
    }
  }
}
```

### TypeScript Service Facade

```typescript
export async function getAutopays(
  memberId: string
): Promise<AutopaysResponse> {
  const response = await fetch(`/api/member/${memberId}/autopays`);
  if (!response.ok) throw new Error("Failed to fetch autopays");
  return response.json();
}

export async function removeAutopay(
  memberId: string,
  autopayId: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`/api/member/${memberId}/autopay/${autopayId}`, {
    method: "DELETE"
  });
  if (!response.ok) throw new Error("Failed to remove autopay");
  return response.json();
}

interface AutopaysResponse {
  memberId: string;
  autopays: Autopay[];
  memberTier: "classic" | "plus" | "premium";
  tierRequirements: TierRequirements;
}

interface Autopay {
  autopayId: string;
  paymentType: "loan" | "credit_card" | "bill_payment";
  targetAccountName: string;
  amount: number;
  frequency: "monthly" | "bi-weekly" | "weekly";
  dayOfMonth: number;
  status: "active" | "scheduled" | "paused";
  nextPaymentDate: string;
  tierContribution: TierContributionInfo;
}

interface TierContributionInfo {
  countsToward: string[];
  limits: string | null;
  description: string;
}

interface TierRequirements {
  tier: "classic" | "plus" | "premium";
  requiredAutopayCount: number;
  currentAutopayCount: number;
  breakdownByType: {
    loan: number;
    creditCard: number;
    billPayment: number;
  };
}
```

### Mock Data

```typescript
const mockAutopaysResponse: AutopaysResponse = {
  memberId: "MEMBER-001",
  autopays: [
    {
      autopayId: "AP-001",
      paymentType: "loan",
      targetAccountName: "Auto Loan",
      amount: 450.00,
      frequency: "monthly",
      dayOfMonth: 15,
      status: "active",
      nextPaymentDate: "2026-03-15",
      tierContribution: {
        countsToward: ["classic", "plus", "premium"],
        limits: null,
        description: "Loan autopays count toward all tier levels"
      }
    }
  ],
  memberTier: "plus",
  tierRequirements: {
    tier: "plus",
    requiredAutopayCount: 2,
    currentAutopayCount: 2,
    breakdownByType: { loan: 1, creditCard: 1, billPayment: 0 }
  }
};
```

---

## 9. Validation Rules

- **Autopay list**: Must contain ≥0 active autopays
- **Payment type**: Must be "loan", "credit_card", or "bill_payment"
- **Frequency**: Must be "weekly", "bi-weekly", or "monthly"
- **Day of month**: Must be 1–31 (or < 28 if month has fewer days)
- **Status**: Must be "active", "scheduled", or "paused"
- **Next payment date**: Must be today or future date
- **Tier contribution**: Must match actual tier qualification rules (not self-reported)

---

## 10. Visual & Responsive Rules

### Design Tokens

**Colors**:
- Active status badge: #10B981 (green)
- Paused status badge: #9CA3AF (gray)
- Tier contribution badge: Tier-specific color (Plus: #D4A574)
- Required for tier emphasis: Gold/tier color background at 10% opacity
- Action button (Remove): #DC2626 (red, destructive)
- Action button (Edit): #6366F1 (indigo, secondary)
- Action button (Pause): #F59E0B (amber, neutral)

**Typography**:
- Page title: 20pt Bold
- Autopay target: 16pt Bold
- Frequency: 14pt Regular
- Tier contribution: 14pt Regular
- Status badge: 12pt Bold
- Button text: 16pt Bold

**Spacing**:
- Row padding: 16px
- Column gap: 12px
- Button spacing: 8px (horizontal gap between action buttons)
- Section margin: 24px top

### Responsive Breakpoints

**Mobile (320px–479px)**:
- Single-column layout (card style)
- Each autopay as full-width card with:
  - Autopay target (bold)
  - Frequency + Status (secondary row)
  - Tier contribution (secondary row)
  - Action menu (⋮ button) or row of buttons below
- Add Autopay button: Full-width (48px height)
- No table layout; use card/list layout

**Tablet (480px–1024px)**:
- Two-column layout or table with text wrapping
- Autopay target + frequency in one column
- Tier contribution + status in second column
- Action buttons in third column or row menu

**Desktop (1025px+)**:
- Full table layout: Target | Frequency | Status | Tier Contribution | Actions
- Horizontal alignment for scannability
- Container max-width: 900px
- Autopay target column min-width 250px

---

## 11. Accessibility Checklist

- Page heading: Semantic `<h1>` with "Your Autopay Items"
- Autopay list: Semantic `<table>` with proper `<thead>`, `<tbody>`, header `<th>` elements (if table layout)
- Or if card layout: `<ul>` with `<li>` items, each with semantic content structure
- Status badges: Icon + color + text (not color alone)
- Tier contribution: Icon + text (not color alone)
- Action buttons: ≥48×48px tap target, visible focus indicator (2px outline)
- Links: Underline or icon supplement (not color alone)
- Modal (RemovalConfirmationModal): `aria-modal="true"`, focus trap, semantic heading
- Live region: `aria-live="polite"` for removal confirmation messages
- Color contrast: All text ≥7:1 against background
- Focus order: Logical from top to bottom, Tab key traversal

---

## 12. Telemetry

- `event: "autopay_list_view"` — Page load
  - `properties: { autopayCount, memberTier, requiredForTier: boolean }`
- `event: "autopay_edit_click"` — User taps Edit on autopay
  - `properties: { autopayId, paymentType, tier }`
- `event: "autopay_remove_click"` — User initiates removal
  - `properties: { autopayId, paymentType, wilCauseTierLoss: boolean }`
- `event: "autopay_removed"` — Removal confirmed
  - `properties: { autopayId, newTier }`
- `event: "autopay_add_click"` — User taps Add New Autopay
  - `properties: { currentTier, autopayGapToNextTier }`

---

## 13. Open Questions & Assumptions

1. **Pause vs. Remove**: Should "Pause" be available for all autopay types, or only certain types (e.g., credit cards)? (Assumption: Available for all)
2. **Tier Recalculation Timing**: When autopay is removed, is tier recalculated immediately, or at next rolling balance calculation (daily)? (Assumption: Immediate if balance criteria met; otherwise next daily batch)
3. **Notification on Removal**: Should member receive notification/email when autopay removal causes tier retrogression? (Assumption: Yes, in-app toast + email)

---

## 14. Design Rationale (Three-Experts Synthesis)

**UX Lead**: Autopay list provides transparency on tier contribution without requiring members to understand complex rules; tier badges show what matters without overwhelming detail. Removal warnings use supportive tone, not threats, to manage loss-aversion psychology.

**Frontend Architect**: Page server-renders autopay list; RemovalConfirmationModal is client component with clear state management. Tier contribution calculated server-side ensures accuracy; client only displays.

**Product/Delivery**: Autopay list is gateway to autopay management; members who understand autopay impact are less likely to accidentally remove critical autopays, reducing support volume and improving autopay persistence rate (target: 90%+).

---

## 15. Cursor-Claude Ready Build Plan

### File Structure

```
app/autopay/
├── page.tsx                    # Autopay list (server)
├── [id]/
│   ├── edit/page.tsx          # (Shard 13)
│   └── remove/page.tsx        # (Shard 14)
└── add/page.tsx               # (Shard 13)

components/autopay/
├── AutopayListTable.tsx       # NEW
├── AutopayListRow.tsx         # NEW
├── TierContributionBadge.tsx  # NEW
├── RemovalConfirmationModal.tsx # NEW
└── StatusBadge.tsx            # NEW

lib/
├── api.ts                      # Add getAutopays(), removeAutopay()
```

### Test Stubs

```typescript
describe("Autopay Management List (SCR-12)", () => {
  test("displays all autopays with tier contribution", () => {
    // Render autopay list
    // Assert: All autopays visible with payment type, frequency
    // Assert: Tier contribution badges displayed
  });

  test("shows warning for autopays required to maintain tier", () => {
    // Render with Plus tier member having 2 required autopays
    // Assert: "Required to maintain Plus tier" label visible on each
  });

  test("opens removal confirmation modal", () => {
    // Click Remove on required autopay
    // Assert: Modal shows retrogression warning
    // Assert: "Pause Instead" and "Continue Removal" buttons visible
  });

  test("removes autopay and updates tier status", async () => {
    // Click Remove, then "Continue Removal" in modal
    // Assert: API call to DELETE /api/member/:id/autopay/:autopayId
    // Assert: Autopay removed from list
    // Assert: Tier status updated if retrogression occurred
  });

  test("navigates to add autopay screen", () => {
    // Click "Add New Autopay" button
    // Assert: Navigate to /autopay/add
  });
});
```

---

✅ **SHARD 12 COMPLETE — Autopay Management List Ready for Build**
