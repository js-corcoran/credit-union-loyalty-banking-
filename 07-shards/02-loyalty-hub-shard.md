# Shard 02: Loyalty Hub Main

**Build Priority**: P0 — Core loyalty destination
**Estimated Effort**: 20 hours
**Screen ID**: SCR-02
**Route**: `/loyalty`
**Component File**: `app/loyalty/page.tsx`

---

## 1. Screen Name & Route

**Full Screen Name**: Loyalty Hub Main
**URL Route**: `/loyalty`
**Navigation Access**: Main navigation → "Loyalty" tab; also accessible from tier badge click on Home (SCR-01)
**Page Title**: "Loyalty Benefits"
**Breadcrumb**: Home > Loyalty

---

## 2. Purpose & Jobs-to-be-Done

**Primary Purpose**: Provide comprehensive loyalty program overview showing member's current tier, benefits summary, progress to next tier, account qualification status, and contextually intelligent actions (increase balance, add autopay) all in one hub.

**Jobs-to-be-Done**:
1. **Discover program value** — Member (PERSONA-02, PERSONA-04) wants proof program is worth their attention
2. **Understand personal status** — Member needs to see current tier, qualification requirements, benefit value
3. **Take action** — Member (PERSONA-02 Optimizer) wants clear next steps to advance tier
4. **Find answers** — Member (PERSONA-03 Overwhelmed) wants searchable FAQ without leaving hub

**Design Principle Applied**: "Multi-Layer Communication" — Hub provides summary tier badge + benefits preview; details (Tier Details, Benefit Details, FAQ) in linked screens; one-click access pattern.

---

## 3. User Stories & Acceptance Criteria

### Story 1: Member Views Comprehensive Tier Overview

**As a** benefit-curious member (PERSONA-02)
**I want to** see my current tier, benefits summary, and progress all in one place
**So that** I understand my loyalty program value at a glance

**Given** I navigate to `/loyalty`
**When** the page loads
**Then** I see:
- Large tier badge (64×64px) displaying current tier (Classic, Plus, or Premium) with color-coded icon + text
- Heading: "You're in Plus Tier" (16pt Bold)
- Benefits summary: 3–4 key benefits as visual tiles, each with icon + name + description + annual value ("$25/year extra APY")
- Personalized benefit values: "Based on your current balance of $23,500"
- Progress section: Progress bar showing "8,500 / 10,000" with label "Distance to Premium Tier"
- Account status summary: "Your qualifying accounts total $23,500" + "2 active autopays"

**And** all content is scannable (large text, visual hierarchy, generous whitespace)

---

### Story 2: Skeptic Member Validates Benefit Authenticity

**As a** skeptical member (PERSONA-04)
**I want to** see real-dollar benefit values and transparent calculations
**So that** I trust the loyalty program is genuine value, not marketing

**Given** I view the Loyalty Hub Main
**When** I look at benefit tiles
**Then** I see:
- Each benefit tile displays: Icon + Benefit Name + Real-Dollar Value
- Example: APY Boost tile shows "$25/year on your current $23,500 balance"
- Fee Waiver tile shows "$60/year estimated (based on 2 transfers/month)"
- Links to expand details: "Learn more about this benefit" → Benefit Details Page (SCR-05)
- Total annual value prominently displayed: "Your Plus tier gives you $145/year in total benefits"
- Comparison context: "If you upgraded to Premium ($25,000+), you'd earn $280/year"

**And** no abstract percentages; all values in dollars, personalized to member's balance

---

### Story 3: Optimizer Member Identifies Next Steps

**As a** optimization-focused member (PERSONA-02)
**I want to** see clear, actionable next steps to reach the next tier
**So that** I can decide whether and how to advance

**Given** I view the Loyalty Hub Main as a Plus Tier member
**When** I scroll to the action section
**Then** I see:
- Primary action: "You're $1,500 away from Premium Tier"
- Action card: "Increase balance by $1,500 to qualify for Premium" with CTA "Transfer money" → Transfer Initiation (SCR-10)
- Alternative action: "Add another autopay to qualify for Plus tier benefits" with CTA "Add autopay" → Autopay Management (SCR-12)
- Secondary action: "View your account status" with CTA → Account Status Detail (SCR-04)

**And** actions are personalized based on member's current progress (balance gap, autopay count)

---

### Story 4: Overwhelmed Member Finds Answers Without Navigation Friction

**As an** overwhelmed member (PERSONA-03)
**I want to** ask questions about the program and find answers quickly
**So that** I don't get confused or abandon exploration

**Given** I'm on the Loyalty Hub Main
**When** I click "Have questions?" section
**Then** I see:
- Search box: "Search FAQs" (find-in-page search)
- Popular questions: "How is my tier calculated?", "What benefits apply to me?", "What's a rolling balance?"
- Category browse: Tier Qualification | Benefits | Retrogression | Legacy Migration | Troubleshooting
- CTA "Browse all FAQs" → FAQ & Search Page (SCR-06)

**And** search results appear inline without leaving hub

---

## 4. States

### Default State
- Page fully loaded with member tier, benefits, and account status
- Tier badge displayed with color and icon
- Benefits tiles showing real-dollar values personalized to member
- Progress bar showing numeric distance to next tier
- Actionable next steps visible
- FAQ search accessible

### Loading State
- Skeleton screens for tier badge, benefit tiles, progress bar
- "Loading your loyalty information..." message
- No interactive elements enabled until data loads

### Error State
- Tier cannot be calculated: "Unable to load your tier status. Please contact support."
- Benefits cannot be calculated: "Calculating your benefits... Please wait."
- FAQ search fails: "Search unavailable. Please try again."
- All errors include retry button or support link

### Empty State
- Member has no qualifying accounts: "You don't have any qualifying accounts yet. Link accounts to unlock tier benefits."
- No autopays: "Add an autopay to unlock higher tier benefits"

### Permission Denied State
- User not authenticated: redirect to login
- User is staff viewing member profile: show "Member Account (Read-Only)" banner

### Offline State
- Display cached tier and benefit data if available
- Show "You're offline. Some information may be outdated." indicator
- FAQ search disabled (not available offline)

---

## 5. Information Architecture

### Visual Regions (Top to Bottom)

**Tier Status Region** (prominent, full-width):
- Heading: "Your Loyalty Tier"
- Large tier badge (64×64px) centered or left-aligned
- Tier name: "Plus Tier" (24pt Bold)
- Tagline: "You're earning $145/year in benefits" (16pt, secondary text)
- Background: Light tier-color tint (very subtle, 5% opacity) or white

**Benefits Summary Region**:
- Heading: "Your Benefits"
- Card grid: 3–4 benefit tiles (responsive layout: 1 column mobile, 2–3 desktop)
- Each tile: Icon + Benefit Name + Description + Real-Dollar Value
- Example tile: "APY Boost | Earn +0.25% interest | $25/year on your balance"
- Visual cue: Green text for benefit value (high contrast)

**Account Status Region**:
- Heading: "Your Accounts"
- Summary card: "Total qualifying balance: $23,500" + "Autopay status: 2 active" + "Days to threshold: 120"
- Optional: Link "View detailed account status" → Account Status Detail (SCR-04)
- Visual: Large numbers (18pt+) for scanability

**Progress to Next Tier Region**:
- Heading: "Path to Premium Tier"
- Progress bar: "8,500 / 10,000" with visual fill
- Supporting text: "You need $1,500 more in qualifying balance to reach Premium"
- Alternative progress: If autopay-limited, show "You have 1 of 2 required autopays"
- CTA: "Increase balance" or "Add autopay" (context-dependent)

**Action Section** (call-to-action, primary focus):
- Heading: "Next Steps"
- Primary action card (color-highlighted, full-width on mobile):
  - Bold statement: "Reach Premium tier by [date if projected]"
  - Action CTA: Button "Transfer Money" or "Add Autopay" (48×48px minimum)
- Secondary actions (grid, optional):
  - "View tier details" → Tier Details Page (SCR-03)
  - "View your benefits" → Benefit Details Page (SCR-05)
  - "Manage autopay" → Autopay Management (SCR-12)

**FAQ Section**:
- Heading: "Have Questions?"
- Search input: "Search FAQs..." (focus on load if member scrolls this far)
- Popular questions (3 expandable items):
  - "How is my tier calculated?"
  - "What's a rolling balance?"
  - "Can I have multiple autopays?"
- CTA: "Browse all FAQs (25+ questions)" → FAQ & Search Page (SCR-06)

**Support Section**:
- Heading: "Need Help?"
- Contact options: Phone, Chat, Email (with loyalty-specific routing note)
- CTA: "Contact Support" → Help / Support Page (SCR-07)

### Content Priority

1. **Tier Badge + Status** — Immediate visual confirmation of tier
2. **Annual Benefit Value** — Proof of real-dollar value
3. **Benefits Summary** — What member actually gets
4. **Account Status** — Qualification transparency
5. **Progress to Next Tier** — What's required to advance
6. **Action CTAs** — How to take next steps
7. **FAQ** — Self-service support

### Progressive Disclosure

- Hub provides summary; detailed views (Tier Details, Benefit Details) in separate screens (one-click access)
- FAQ answers shown inline (expand/collapse) without leaving hub
- Account status summary on hub; detailed breakdown on Account Status page
- Benefit values shown on tiles; detailed calculations on Benefit Details page

---

## 6. Components & Responsibilities

### Component Tree

```
Page (app/loyalty/page.tsx) — Server Component
├── Header (from layout)
├── TierStatusRegion (Client)
│   ├── TierBadge (medium 64×64px)
│   ├── Heading "Your Loyalty Tier"
│   ├── Tier name "Plus Tier"
│   └── Tagline "You're earning $145/year"
├── BenefitsSummaryRegion (Client)
│   ├── Heading "Your Benefits"
│   └── BenefitCard × 3 (Client)
│       ├── Icon
│       ├── Benefit name
│       ├── Description
│       ├── Real-dollar value (green)
│       └── CTA "Learn more" → /loyalty/benefits
├── AccountStatusRegion (Client)
│   ├── Heading "Your Accounts"
│   ├── Summary card
│   │   ├── Total balance (large 18pt)
│   │   ├── Autopay count
│   │   └── Days to threshold
│   └── CTA "View detailed status" → /loyalty/account-status
├── ProgressRegion (Client)
│   ├── Heading "Path to Premium Tier"
│   ├── TierProgressBar
│   ├── Supporting text "You need $1,500 more"
│   └── Visual fill indicating progress
├── ActionSection (Client)
│   ├── Heading "Next Steps"
│   ├── PrimaryActionCard
│   │   ├── Bold statement
│   │   └── CTA Button (color-coded per tier)
│   └── SecondaryActions (grid)
│       ├── "View tier details" link
│       ├── "View benefits" link
│       └── "Manage autopay" link
├── FAQSection (Client)
│   ├── Heading "Have Questions?"
│   ├── SearchFAQ (component)
│   │   └── Search input + autocomplete
│   └── PopularQuestions × 3
│       ├── Question (expandable)
│       └── Answer (collapsible content)
├── SupportSection (Client)
│   ├── Heading "Need Help?"
│   ├── Contact method tiles (Phone, Chat, Email)
│   └── CTA "Contact Support" → /help
└── Footer (from layout)
```

### Component Responsibilities

**TierStatusRegion**:
- Props: `tier`, `annualBenefitValue`, `personalizationNote`
- Responsibility: Display tier badge + supporting text
- Accessibility: Section landmark with `aria-label="Your loyalty tier status"`

**BenefitCard** (reused from Shard 01):
- Props: `benefit`, `memberBalance`, `estimatedValue`, `variant="primary"`
- Responsibility: Display benefit with real-dollar value
- Used in: Home Dashboard (small variant), Loyalty Hub (primary variant)

**TierProgressBar** (reused from Shard 01):
- Props: `currentValue`, `targetValue`, `tier`, `metric="balance"`
- Responsibility: Display progress to next tier with numeric label
- Used in: Home Dashboard, Loyalty Hub, Account Status Detail

**SearchFAQ**:
- Props: `onSearch`, `results`, `loading`
- Responsibility: Search input + results display + category browse
- Accessibility: Search input with live region for results announcements

**ActionSection**:
- Props: `currentTier`, `qualificationGap`, `recommendedAction`
- Responsibility: Display primary + secondary actions based on member status
- Example: If member is $1,500 away from Premium, show "Transfer Money" CTA

**Page (app/loyalty/page.tsx)**:
- Responsibility: Fetch member tier, calculate benefits, render all regions
- Server-side: Fetch getMemberTier(), calculateBenefitValue()
- Pass data to client components

---

## 7. Interactions

### Click Interactions

**Tier Badge**:
- Click → Navigate to Tier Details Page (SCR-03)
- Optional: Show tooltip "Click to compare tiers"

**Benefit Card**:
- Click → Navigate to Benefit Details Page (SCR-05)
- Shows more info about that specific benefit

**Action CTA ("Transfer Money" or "Add Autopay")**:
- Click → Navigate to /transfer or /autopay/add
- Maintains state so member knows what action they initiated

**"View Detailed Status" CTA**:
- Click → Navigate to Account Status Detail (SCR-04)

**FAQ Question**:
- Click → Expand answer (accordion)
- Click again → Collapse

**FAQ Search**:
- Type → Trigger search with results appearing inline
- Click result → Jump to FAQ & Search Page (SCR-06) with search preserved

**"Contact Support" CTA**:
- Click → Navigate to Help / Support Page (SCR-07)

### Keyboard Navigation

- **Tab order**: Tier badge → Benefit cards → Action buttons → FAQ search → Support CTA → Footer
- **Enter/Space**: Activate buttons and expandable accordion items
- **Arrow keys**: Navigate benefit cards (optional carousel enhancement)

### Touch Interactions (Mobile)

- **Tier badge tap**: Navigate to tier comparison
- **Benefit card swipe**: Swipe between benefits (optional carousel)
- **FAQ accordion tap**: Expand/collapse answer
- **CTA button tap**: ≥48×48px target

### Focus Management

- **Page load**: Focus moves to first benefit card or action section
- **FAQ search focus**: Results appear in live region, announced to screen readers
- **Navigation back**: Focus returns to Loyalty Hub, maintains scroll position

---

## 8. Data Contracts

### GET /api/member/:memberId/loyalty-summary

**Response** (HTTP 200 OK):
```json
{
  "memberId": "MEMBER-001",
  "currentTier": "plus",
  "tierChangeDate": "2025-11-15",
  "annualBenefitValue": 145,
  "qualifyingAccounts": [
    {
      "accountId": "CHK-9876",
      "accountName": "Checking",
      "balance": 15000,
      "contributesToTier": ["classic", "plus", "premium"]
    },
    {
      "accountId": "SAV-5432",
      "accountName": "Savings",
      "balance": 8500,
      "contributesToTier": ["classic", "plus"]
    }
  ],
  "totalQualifyingBalance": 23500,
  "autopayStatus": {
    "totalCount": 2,
    "loanAutopay": true,
    "creditCardAutopay": false,
    "expirationDate": "2026-05-31"
  },
  "nextTierThreshold": {
    "tier": "premium",
    "minimumBalance": 25000,
    "balanceGap": 1500,
    "minimumAutopay": 2,
    "autopayGap": 0
  },
  "benefits": [
    {
      "benefitId": "apy-boost-plus",
      "benefitName": "APY Boost",
      "description": "Earn +0.25% annual interest",
      "annualValue": 58.75,
      "personalizationNote": "Based on your $23,500 balance"
    },
    {
      "benefitId": "fee-waiver-plus",
      "benefitName": "Fee Waiver",
      "description": "Waived transfer fees",
      "annualValue": 60,
      "personalizationNote": "Based on ~2 transfers/month"
    },
    {
      "benefitId": "rewards-plus",
      "benefitName": "Third-Party Rewards",
      "description": "Access to partner rewards",
      "annualValue": 26.25,
      "personalizationNote": "Based on your purchase history"
    }
  ]
}
```

### TypeScript Service Facade

```typescript
export async function getLoyaltySummary(
  memberId: string
): Promise<LoyaltySummaryResponse> {
  const response = await fetch(`/api/member/${memberId}/loyalty-summary`, {
    method: "GET"
  });
  if (!response.ok) throw new Error("Failed to fetch loyalty summary");
  return response.json();
}

interface LoyaltySummaryResponse {
  memberId: string;
  currentTier: "classic" | "plus" | "premium";
  annualBenefitValue: number;
  qualifyingAccounts: Account[];
  totalQualifyingBalance: number;
  autopayStatus: AutopayStatus;
  nextTierThreshold: TierThreshold;
  benefits: BenefitWithValue[];
}

interface BenefitWithValue {
  benefitId: string;
  benefitName: string;
  description: string;
  annualValue: number;
  personalizationNote: string;
}
```

### Mock Data

```typescript
const mockLoyaltySummary: LoyaltySummaryResponse = {
  memberId: "MEMBER-001",
  currentTier: "plus",
  annualBenefitValue: 145,
  qualifyingAccounts: [
    {
      accountId: "CHK-9876",
      accountName: "Checking",
      balance: 15000,
      contributesToTier: ["classic", "plus", "premium"]
    },
    {
      accountId: "SAV-5432",
      accountName: "Savings",
      balance: 8500,
      contributesToTier: ["classic", "plus"]
    }
  ],
  totalQualifyingBalance: 23500,
  autopayStatus: {
    totalCount: 2,
    loanAutopay: true,
    creditCardAutopay: false,
    expirationDate: new Date("2026-05-31")
  },
  nextTierThreshold: {
    tier: "premium",
    minimumBalance: 25000,
    balanceGap: 1500,
    minimumAutopay: 2,
    autopayGap: 0
  },
  benefits: [
    {
      benefitId: "apy-boost-plus",
      benefitName: "APY Boost",
      description: "Earn +0.25% annual interest",
      annualValue: 58.75,
      personalizationNote: "Based on your $23,500 balance"
    },
    {
      benefitId: "fee-waiver-plus",
      benefitName: "Fee Waiver",
      description: "Waived transfer fees",
      annualValue: 60,
      personalizationNote: "Based on ~2 transfers/month"
    },
    {
      benefitId: "rewards-plus",
      benefitName: "Third-Party Rewards",
      description: "Access to partner rewards",
      annualValue: 26.25,
      personalizationNote: "Based on your purchase history"
    }
  ]
};
```

---

## 9. Validation Rules

- **Annual benefit value**: Must be ≥ $0, formatted as currency
- **Qualifying balance**: Sum of all account balances in qualifying accounts
- **Tier must be one of**: "classic", "plus", "premium"
- **Next tier threshold**: Minimum balance and autopay count must be valid
- **Benefits**: Must have icon, name, description, value for display

---

## 10. Visual & Responsive Rules

### Design Tokens

**Colors**:
- Tier badge background: Tier-specific (Classic: #6B7280, Plus: #D4A574, Premium: #E8E8E8)
- Benefit value text: #10B981 (success green, high contrast)
- Action CTA button: Tier-specific color, white text
- Section background: #FFFFFF (white) or tier-color at 5% opacity

**Typography**:
- Tier name: 24pt Bold
- Section headings: 20pt Bold
- Benefit card title: 16pt Bold
- Benefit value: 18pt Bold (high contrast, scannable)
- Body text: 16pt Regular

**Spacing**:
- Section padding: 24px top/bottom
- Benefit card grid gap: 16px (mobile), 24px (desktop)
- Button spacing: 12px vertical margin

### Responsive Breakpoints

**Mobile (320px–479px)**:
- Single-column layout (100% width minus 16px padding)
- Benefit cards stack vertically
- Action buttons full-width (48px height)
- Tier badge: 64×64px centered

**Tablet (480px–1024px)**:
- 2-column benefit card grid
- Tier badge: 64×64px, left-aligned
- Wider padding (24px)

**Desktop (1025px+)**:
- 3-column benefit card grid
- Tier badge: 80×80px (large)
- Container max-width: 900px

---

## 11. Accessibility Checklist

- Tier badge: `aria-label="Plus tier. Your tier qualifies for APY boost, fee waiver, and third-party rewards."`
- Benefit value: Large text (18pt+), high contrast (7:1)
- All buttons: ≥48×48px tap target, semantic `<button>` elements
- FAQ accordion: Semantic `<details>` and `<summary>` elements (or `role="region"` if custom)
- Focus indicators: Visible 2px outline on all interactive elements
- Screen reader: All regions have descriptive headings and labels
- Color: Not used alone; all tier-color regions accompanied by text label

---

## 12. Telemetry

- `event: "loyalty_hub_view"` — Page load
- `event: "benefit_card_click"` — Member explores specific benefit
- `event: "action_cta_click"` — Member initiates next step (transfer, autopay)
- `event: "faq_search"` — Member searches FAQs
- `event: "tier_details_click"` — Member navigates to tier comparison

---

## 13. Open Questions & Assumptions

1. **Benefit Calculations**: Should estimated values (transfer fees, partner rewards) be marked "estimated" or presented as fact? (Current: marked as "estimated based on..." for transparency)
2. **Action Priority**: If member needs both balance increase AND autopay to reach next tier, which action should be primary? (Current: balance increase, as it's more impactful)

---

## 14. Design Rationale (Three-Experts Synthesis)

**UX Lead**: Hub provides comprehensive overview without requiring navigation to multiple pages; progressive disclosure moves details to separate screens; real-dollar benefit values support trust and engagement.

**Frontend Architect**: Page server-renders member data; all interactive regions are client components with isolated state; reuses TierBadge and BenefitCard components from Shard 01.

**Product/Delivery**: Hub is gateway to entire loyalty experience; success metric is 80% engagement with benefits summary and 40% click-through to action CTAs; data informs phase 2 personalization.

---

## 15. Cursor-Claude Ready Build Plan

### File Structure

```
app/loyalty/
├── page.tsx                    # Loyalty Hub server component
├── layout.tsx                  # Loyalty section layout
├── tier-details/
├── account-status/
├── benefits/
└── faq/

components/loyalty/
├── TierStatusRegion.tsx        # (reuse from Shard 01)
├── BenefitsSummaryRegion.tsx  # New
├── AccountStatusRegion.tsx     # New
├── ProgressRegion.tsx          # New
├── ActionSection.tsx           # New
├── FAQSection.tsx              # New
└── SupportSection.tsx          # New

lib/
├── api.ts                      # Add getLoyaltySummary()
```

### Test Stubs

```typescript
describe("Loyalty Hub Main", () => {
  test("displays tier badge with benefits summary", () => {
    // Render loyalty hub
    // Assert: tier badge visible
    // Assert: 3 benefit tiles displayed with real-dollar values
  });

  test("shows personalized benefit values", () => {
    // Render hub
    // Assert: benefit values say "Based on your current balance"
  });

  test("displays action CTA based on qualification gap", () => {
    // Render hub for member $1,500 away from Premium
    // Assert: "Increase balance by $1,500" action visible
  });

  test("allows FAQ search with inline results", () => {
    // Render hub
    // Type "rolling balance" in search
    // Assert: results appear inline
  });
});
```

---

✅ **SHARD 02 COMPLETE — Loyalty Hub Ready for Build**
