# Shard 03: Tier Details Page

**Build Priority**: P1
**Estimated Effort**: 16 hours
**Screen ID**: SCR-03
**Route**: `/loyalty/tier-details`
**Component File**: `app/loyalty/tier-details/page.tsx`

---

## 1. Screen Name & Route

**Full Screen Name**: Tier Details Page
**URL Route**: `/loyalty/tier-details`
**Navigation Access**: Loyalty Hub → "View tier details" | Home → Tier badge → Tier Details
**Page Title**: "Tier Comparison & Requirements"
**Breadcrumb**: Home > Loyalty > Tier Details

---

## 2. Purpose & Jobs-to-be-Done

**Primary Purpose**: Allow members (especially PERSONA-02 Optimizer) to deep-dive into tier structure, understand full qualification rules, compare tiers side-by-side, and see how to advance from current tier to next.

**Jobs-to-be-Done**:
1. **Understand tier rules** — Member needs transparent explanation of qualification requirements (balance, autopay rules, rolling balance calculation)
2. **Compare tiers** — Member wants side-by-side view of what each tier offers
3. **Learn how to advance** — Member needs specific steps to reach next tier
4. **Reduce uncertainty** — Member (PERSONA-04 Skeptic) wants edge cases and grace periods explained

---

## 3. User Stories & Acceptance Criteria

### Story 1: Member Compares All Three Tiers

**As a** benefit optimizer (PERSONA-02)
**I want to** see tab-based view of Classic, Plus, Premium with requirements and benefits
**So that** I understand what each tier requires and what I get

**Given** I navigate to Tier Details Page
**When** the page loads
**Then** I see:
- Tab navigation: "Classic | Plus | Premium" (48×48px tap target per tab)
- Current tier tab pre-selected (e.g., "Plus")
- For each tier tab:
  - Summary: One-sentence simple rule ("Maintain $10,000+ balance and 2 autopays to qualify")
  - Requirements section: Visual checklist (✓ or ✗) showing qualification status
    - Balance requirement: "$10,000+ rolling 3-month average"
    - Autopay requirement: "2 active autopays (loan, credit card, or bill payment)"
  - Benefits section: List of benefits with descriptions
  - How to Qualify section: Specific steps (e.g., "Increase balance by $1,500" or "Add 1 autopay")
  - Grace Period section: "Tier changes take effect 30 days after losing qualification"

**And** current tier is visually highlighted (color background or bold indicator)

---

### Story 2: Member Understands Rolling Balance Calculation

**As a** confused member (PERSONA-03)
**I want to** see visual explanation of rolling balance with example
**So that** I understand how my balance is calculated for tier qualification

**Given** I view the Plus tier tab
**When** I look at the balance requirement section
**Then** I see:
- Rolling balance definition: "Average of your balance on the last day of each month for the past 3 months"
- Visual diagram: 3-month calendar showing last-day-of-month balances
  - Jan 31: $10,500 | Feb 28: $10,200 | Mar 31: $9,800 → Average: $10,167 ✓ (qualifies for Plus)
- Member-specific example: "Your rolling balance is $14,500 (based on Jan: $14,200, Feb: $14,600, Mar: $14,700)"
- Link to FAQ for more details: "Learn more about rolling balance"

**And** visual diagram uses member's actual recent balances (real data, not hypothetical)

---

### Story 3: Member Understands Autopay Rules and Limits

**As a** member wanting to optimize autopay (PERSONA-02)
**I want to** understand which autopays count toward tier and any limits
**So that** I can strategically set up autopay to maximize tier benefits

**Given** I view tier requirements
**When** I look at autopay section
**Then** I see:
- Autopay types that count: "Loan autopays, bill payments, and credit card autopays"
- Limits: "Credit card autopays: max 1 per tier"
- Examples:
  - "Classic: 1 autopay (any type) + $2,500+ balance = qualifies"
  - "Plus: 2 autopays (loan + bill + credit card, max 1 credit card) + $10,000+ balance = qualifies"
- Member-specific status: "You have 2 active autopays (1 loan + 1 bill)" ✓
- What counts vs. what doesn't: Visual table (Loan ✓ | Credit card ✓ | Bill payment ✓ | One-time payment ✗)

**And** credit card limit is clearly highlighted to prevent confusion

---

### Story 4: Member Understands Grace Period and Tier Loss

**As a** member concerned about tier loss (PERSONA-04, loss-averse)
**I want to** understand what happens if I lose qualification
**So that** I can avoid unpleasant surprises

**Given** I view tier details
**When** I expand "Grace Period" section
**Then** I see:
- Grace period duration: "You have 30 days after losing qualification"
- Trigger events: "If your rolling balance drops below minimum OR active autopays fall below requirement"
- What happens: "On day 31, your tier automatically changes to lower tier"
- Example: "If you remove an autopay on March 15, your Plus qualification changes to Classic on April 14 (if you don't add another autopay)"
- How to avoid: "Add an autopay or increase balance before grace period ends"
- What you lose: "Premium APY boost ($50+/year), fee waiver ($60/year)" — real-dollar impact
- How to re-qualify: Link to Account Status Detail to see specific actions needed

**And** tone is supportive ("You have time to act") not alarming ("You're losing benefits")

---

## 4. States

### Default State
- All tier tabs loaded with requirements and benefits
- Current tier tab selected and highlighted
- Visual indicators (✓/✗) showing member's qualification status
- Rolling balance diagram showing member's recent data
- Autopay rules and limits displayed
- Grace period explanation visible

### Loading State
- Skeleton screens for tier tabs
- Placeholder for rolling balance diagram

### Error State
- If tier config cannot load: "Unable to load tier information. Please try again."
- If rolling balance cannot be calculated: "Unable to calculate your rolling balance. Contact support."

---

## 5. Information Architecture

### Visual Regions (Top to Bottom)

**Header Region**:
- Heading: "Understand Your Tiers"
- Subheading: "Compare requirements and benefits across all three tiers"

**Tab Navigation**:
- Three tabs: Classic | Plus | Premium
- Current tier tab pre-selected
- Smooth transition between tabs (no page reload)

**Tier Summary Region** (per selected tab):
- Tier name (24pt Bold) + tier color badge
- One-sentence summary: "Maintain $10,000+ and 2 autopays to qualify for Plus Tier"
- Tier color background at 5% opacity

**Requirements Section**:
- Heading: "How to Qualify"
- Checklist format:
  - [✓ or ✗] Balance requirement: "$10,000+ rolling 3-month average"
  - [✓ or ✗] Autopay requirement: "2 active autopays"
- Member's current status: Green checkmarks if qualifies, red X if doesn't
- Specific gap: "You're $1,500 away from Premium" (if not qualified)

**Rolling Balance Diagram Section** (optional but recommended):
- Heading: "What's a Rolling Balance?"
- Visual: 3-month calendar showing last-day-of-month balance
- Member's actual data: Jan $14,200 | Feb $14,600 | Mar $14,700 → Average $14,500
- Clear label: "Your rolling balance is $14,500"

**Autopay Rules Section**:
- Table: Autopay type | Counts toward tier? | Limit?
  - Loan autopay | Yes | No limit
  - Credit card autopay | Yes | Max 1 per tier
  - Bill payment | Yes | No limit
- Member-specific status: "You have 1 loan + 1 bill (qualify for Plus/Premium)"

**Benefits Section**:
- Heading: "Benefits at This Tier"
- Card grid: Each benefit with icon, name, description, real-dollar value
- Example: "APY Boost: Earn +0.25% annual interest" (calculated for member's balance)

**Grace Period Section** (expandable):
- Heading: "What if I lose qualification?"
- Content: Grace period duration, trigger events, tier drop consequences, recovery steps
- Tone: Supportive and reassuring

**Action Section**:
- Primary CTA: "Increase balance by $1,500 to reach Premium" or "View your account status"
- Secondary CTA: "Browse all FAQs"

---

## 6. Components & Responsibilities

### Component Tree

```
Page (app/loyalty/tier-details/page.tsx) — Server Component
├── Header
│   ├── Heading "Understand Your Tiers"
│   └── Subheading
├── TabNavigation (Client)
│   ├── Tab Classic
│   ├── Tab Plus (pre-selected)
│   └── Tab Premium
├── [For each selected tier tab]:
│   ├── TierSummaryRegion
│   │   ├── Tier badge (80×80px)
│   │   ├── Tier name (24pt Bold)
│   │   └── One-sentence rule
│   ├── RequirementsSection
│   │   ├── Balance requirement (with status ✓/✗)
│   │   └── Autopay requirement (with status ✓/✗)
│   ├── RollingBalanceDiagram
│   │   ├── 3-month calendar visualization
│   │   └── Member's actual balance data
│   ├── AutopayRulesTable
│   │   └── Table (Type | Counts? | Limit?)
│   ├── BenefitsList
│   │   └── BenefitCard × 3
│   ├── GracePeriodSection (expandable)
│   │   ├── Duration
│   │   ├── Trigger events
│   │   ├── Consequences
│   │   └── Recovery steps
│   └── ActionSection
│       ├── Primary CTA
│       └── Secondary CTA
└── Footer
```

### Component Responsibilities

**TabNavigation**:
- Props: `tabs`, `activeTab`, `onTabChange`
- Responsibility: Render tab buttons, handle selection, maintain active state
- Accessibility: `role="tablist"`, semantic `<button>` for each tab

**TierBadge** (reused):
- Size: "large" (80×80px) for tier details

**BenefitCard** (reused):
- Props: `benefit`, `variant="comparison"` (text-heavy, no icons)
- Responsibility: Display benefit for comparison

**RequirementsSection**:
- Props: `tier`, `memberStatus` (current qualification status)
- Responsibility: Display balance/autopay requirements with visual status indicators
- Accessibility: List items with semantic markup, status icons accompanied by text

**RollingBalanceDiagram**:
- Props: `memberBalances` (last 3 months data)
- Responsibility: Render 3-month calendar visualization with member's actual data
- Accessibility: `aria-label="Your rolling balance is $14,500, calculated from Jan $14,200, Feb $14,600, Mar $14,700"`

**AutopayRulesTable**:
- Props: `autopayTypes`
- Responsibility: Display table of autopay types, countability, limits
- Accessibility: Semantic `<table>` with `<thead>`, `<tbody>`, proper cell associations

---

## 7. Interactions

### Tab Navigation
- **Click tab**: Switch to selected tier, smooth content transition
- **Keyboard**: Arrow left/right to navigate between tabs; Tab/Shift+Tab to focus tabs
- **Active indicator**: Bold text or underline on active tab

### Expandable Sections
- **Click "Grace Period"**: Expand content
- **Click again**: Collapse
- **Accessibility**: `aria-expanded="true/false"`

### CTA Buttons
- **Click "Increase balance"**: Navigate to Transfer Initiation (SCR-10)
- **Click "View account status"**: Navigate to Account Status Detail (SCR-04)

---

## 8. Data Contracts

### GET /api/member/:memberId/tier-details

**Response**:
```json
{
  "memberId": "MEMBER-001",
  "currentTier": "plus",
  "tiers": [
    {
      "tierId": "classic",
      "tierName": "Classic",
      "displayColor": "#6B7280",
      "summary": "Maintain $2,500+ and 1 autopay to qualify",
      "requirements": {
        "minimumBalance": 2500,
        "minimumAutopay": 1,
        "autopayTypes": ["loan", "bill"],
        "creditCardAutopayLimit": 0
      },
      "benefits": [...],
      "gracePeriodDays": 30
    },
    {
      "tierId": "plus",
      "tierName": "Plus",
      ...
    }
  ],
  "memberStatus": {
    "currentTier": "plus",
    "qualifyingBalance": 14500,
    "rollingBalance3Month": [14200, 14600, 14700],
    "autopayCount": 2,
    "autopayTypes": ["loan", "bill"],
    "balanceGapToNextTier": 10500,
    "autopayGapToNextTier": 0
  },
  "autopayRules": [
    { "type": "loan", "countsTowardTier": true, "limit": null },
    { "type": "bill", "countsTowardTier": true, "limit": null },
    { "type": "credit-card", "countsTowardTier": true, "limit": 1 }
  ]
}
```

### TypeScript Service Facade

```typescript
export async function getTierDetails(
  memberId: string
): Promise<TierDetailsResponse> {
  const response = await fetch(`/api/member/${memberId}/tier-details`, {
    method: "GET"
  });
  if (!response.ok) throw new Error("Failed to fetch tier details");
  return response.json();
}

interface TierDetailsResponse {
  memberId: string;
  currentTier: "classic" | "plus" | "premium";
  tiers: TierDetail[];
  memberStatus: MemberQualificationStatus;
  autopayRules: AutopayRule[];
}
```

### Mock Data

```typescript
const mockTierDetails: TierDetailsResponse = {
  memberId: "MEMBER-001",
  currentTier: "plus",
  tiers: [
    {
      tierId: "classic",
      tierName: "Classic",
      displayColor: "#6B7280",
      summary: "Maintain $2,500+ and 1 autopay to qualify",
      requirements: {
        minimumBalance: 2500,
        minimumAutopay: 1,
        autopayTypes: ["loan", "bill"],
        creditCardAutopayLimit: 0
      },
      benefits: [
        {
          benefitId: "apy-boost-classic",
          benefitName: "APY Boost",
          description: "Earn +0.1% on savings",
          annualValue: 25
        }
      ],
      gracePeriodDays: 30
    },
    // Plus, Premium...
  ],
  memberStatus: {
    currentTier: "plus",
    qualifyingBalance: 14500,
    rollingBalance3Month: [14200, 14600, 14700],
    autopayCount: 2,
    autopayTypes: ["loan", "bill"],
    balanceGapToNextTier: 10500,
    autopayGapToNextTier: 0
  },
  autopayRules: [
    { type: "loan", countsTowardTier: true, limit: null },
    { type: "bill", countsTowardTier: true, limit: null },
    { type: "credit-card", countsTowardTier: true, limit: 1 }
  ]
};
```

---

## 9. Validation Rules

- Tier summary must be simple (one sentence, 16pt or larger)
- Rolling balance must be calculated as average of 3 months
- Grace period must be consistent across all tiers (30 days)
- All autopay types must be defined in rules

---

## 10. Visual & Responsive Rules

### Design Tokens

**Colors**:
- Tab active: Tier-color underline (2px)
- Requirements checkmarks: #10B981 (success green)
- Requirements X marks: #EF4444 (urgent red)
- Rolling balance bar: Tier-color gradient

**Typography**:
- Tab text: 16pt Regular
- Tier name (in content): 24pt Bold
- Section heading: 20pt Bold
- Requirement text: 16pt Regular
- Requirement status: 16pt Bold (checkmark or X)

**Spacing**:
- Tab padding: 12px horizontal, 16px vertical
- Section margin: 32px top
- Requirements list: 12px item spacing

### Responsive Breakpoints

**Mobile**:
- Tabs stack if needed; single-column content
- Rolling balance diagram: Full-width, scrollable if needed
- Autopay rules table: Responsive (stack columns)

**Desktop**:
- Tabs inline
- Rolling balance diagram: Max-width 400px
- Autopay rules table: Full table

---

## 11. Accessibility Checklist

- Tab navigation: `role="tablist"`, `<button role="tab">`, `aria-selected`
- Active tab: `aria-selected="true"`, bold or underline indicator
- Status indicators (✓/✗): Accompanied by text; not icon-only
- Rolling balance: `aria-label="Your rolling balance is $14,500, calculated from..."`
- Expandable sections: `aria-expanded="true/false"`
- All text ≥16pt except labels (14pt minimum)
- Color contrast: 7:1 for all text

---

## 12. Telemetry

- `event: "tier_details_view"`
- `event: "tier_tab_click"` — Which tier tab selected
- `event: "grace_period_expand"` — Member explores risk information
- `event: "action_cta_click"` — Member initiates action from tier details

---

## 13. Open Questions & Assumptions

1. **Rolling balance visualization**: Should it show member's actual data or hypothetical example? (Current: actual member data)
2. **Tier comparison**: Should Premium tier show on tab even if member can't reach it? (Current: yes, for aspirational value)

---

## 14. Design Rationale

**UX Lead**: Tab-based navigation reduces cognitive load (member focuses on one tier at a time); visual indicators (✓/✗) provide instant qualification status; rolling balance diagram demystifies complex rule; real-dollar benefit values support trust.

**Frontend Architect**: Page server-renders tier config + member status; tab state managed by client component; reuses TierBadge and BenefitCard from prior shards; rolling balance diagram is reusable SVG component.

**Product/Delivery**: Tier Details page is educational; supports PERSONA-02 optimization goal (understanding qualification rules); supports PERSONA-04 skeptic (edge cases and grace period clarity); reduces support calls about tier rules.

---

## 15. Cursor-Claude Ready Build Plan

### File Structure

```
app/loyalty/tier-details/
├── page.tsx                    # Server component
└── components/
    ├── TierTabs.tsx            # Tab navigation
    ├── TierSummary.tsx         # Tier badge + summary
    ├── RequirementsChecklist.tsx # Balance + autopay status
    ├── RollingBalanceDiagram.tsx # 3-month visualization
    ├── AutopayRulesTable.tsx   # Autopay types table
    ├── BenefitsSection.tsx     # Benefit cards
    └── GracePeriodExplainer.tsx # Grace period section

tests/
└── tier-details.test.tsx
```

### Test Stubs

```typescript
describe("Tier Details Page", () => {
  test("renders all three tier tabs", () => {
    // Render page
    // Assert: Classic, Plus, Premium tabs visible
    // Assert: Plus tab pre-selected
  });

  test("switches tier content on tab click", () => {
    // Render page
    // Click Premium tab
    // Assert: Premium requirements displayed
    // Assert: Premium benefits displayed
  });

  test("shows member's rolling balance calculation", () => {
    // Render page
    // Assert: 3-month diagram visible with member's actual balances
    // Assert: Average calculation correct
  });

  test("displays grace period explanation", () => {
    // Render page
    // Click "Grace Period" expandable
    // Assert: Duration (30 days), triggers, consequences visible
  });
});
```

---

✅ **SHARD 03 COMPLETE**
