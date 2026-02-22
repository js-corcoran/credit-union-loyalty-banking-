# Shard 05: Benefit Details Page

**Build Priority**: P1 | **Estimated Effort**: 12 hours | **Screen ID**: SCR-05 | **Route**: `/loyalty/benefits`

## 1. Screen Name & Route

Benefit Details Page | `/loyalty/benefits` | Breadcrumb: Home > Loyalty > Benefits

## 2. Purpose & Jobs-to-be-Done

Provide comprehensive benefit breakdown for each benefit type (APY Boost, Fee Waiver, Third-Party Rewards) with real-dollar examples, member-specific calculations, and transparent methodology for trust-building.

**Jobs**: (1) Validate benefit authenticity, (2) Understand personal benefit value, (3) Learn how to maximize benefits

## 3. User Stories & Acceptance Criteria

### Story 1: Skeptic Member Validates APY Boost Calculation

**As a** skeptical member (PERSONA-04)
**I want to** see exactly how APY boost is calculated with my actual balance
**So that** I trust the benefit is real and accurately calculated

**Given** I navigate to Benefit Details Page
**When** I view APY Boost section
**Then** I see:
- Benefit name: "APY Boost" with icon
- Description: "Earn +0.25% annual interest on qualifying savings accounts"
- Your calculation:
  - "Your current balance: $23,500"
  - "Plus tier APY boost: +0.25%"
  - "Annual value: $23,500 × 0.25% = $58.75"
  - "Monthly value: ~$4.90"
- Transparency: "How we calculate: Balance × APY % ÷ 100"
- Comparison context: "With Classic tier (+0.1%), you'd earn $23.50/year. Plus tier gives you +$35.25 extra."
- Real-dollar proof: "You earned $58.75 in APY boost over the past year with Plus tier"

**And** visual representation shows benefit accruing over time (optional chart)

---

### Story 2: Optimizer Member Sees Fee Waiver Impact

**As a** benefit optimizer (PERSONA-02)
**I want to** understand how fee waivers apply to my transactions
**So that** I can maximize benefit usage

**Given** I view Fee Waiver benefit section
**When** I look at calculation
**Then** I see:
- Benefit name: "Fee Waiver"
- Description: "Waived transfer fees on your Plus tier"
- Rules: "All transfers between your accounts, to other members, and ACH transfers are free"
- Your calculation:
  - "Your transfer frequency: ~2 transfers/month (based on history)"
  - "Fee per transfer without tier: $2.50"
  - "Annual savings: 2 transfers/month × 12 months × $2.50 = $60/year"
  - "Monthly savings: ~$5"
- Real-world example: "On Feb 19, you transferred $1,000 to savings. Normally $2.50, you paid $0 with Plus tier. You saved $2.50."
- Comparison: "Premium tier waives both transfer AND foreign ATM fees ($0 cost instead of $3 per transaction)"

**And** recent transactions show applied fee waivers inline

---

### Story 3: Member Understands Total Annual Benefit Value

**As a** member wanting to see full loyalty value
**I want to** see total annual benefit value with transparent breakdown
**So that** I understand the program is worth my engagement

**Given** I scroll to bottom of Benefits page
**When** I view Annual Summary section
**Then** I see:
- Total annual benefit value: "Your Plus tier provides $145/year in benefits"
- Breakdown by benefit:
  - APY Boost: $58.75 (40%)
  - Fee Waiver: $60 (41%)
  - Third-Party Rewards: $26.25 (18%)
- Calculation basis (transparent):
  - APY: Actual 3-month average balance
  - Fee Waiver: Historical transfer frequency
  - Rewards: Partner API calculation
- Comparison to other tiers:
  - Classic: $50/year
  - Plus: $145/year (current)
  - Premium: $280/year
- Visual: Pie chart or bar chart showing benefit mix

**And** member understands each benefit type contributes to overall value

---

## 4. States

- **Default**: All benefits fully loaded with calculations
- **Loading**: Skeleton screens for benefit cards
- **Error**: "Unable to calculate your benefits. Please contact support."
- **No data**: "Your benefit data is processing. Please check back soon."

---

## 5. Information Architecture

**Benefit Overview Region**:
- Heading: "Your Benefits in Plus Tier"
- Total annual value prominently displayed: "$145/year in benefits"

**APY Boost Benefit Card**:
- Icon + Name + Description
- Member-specific calculation with transparentformula
- Comparison to other tiers
- Real-dollar proof from past year
- Visual chart (optional): Interest earned over 12 months

**Fee Waiver Benefit Card**:
- Icon + Name + Description
- Rules (which fees apply)
- Member-specific calculation (transfer frequency-based)
- Real-world recent example (actual transaction with fee waived)
- Comparison to other tiers

**Third-Party Rewards Benefit Card**:
- Icon + Name + Description
- Partner details
- Member-specific calculation (purchase history-based)
- Example: "Earn 2X points on eligible purchases"
- Comparison to other tiers

**Annual Summary Region**:
- Total annual value: "$145/year"
- Pie chart or bar chart: Benefit mix
- Tier comparison: Show value for Classic, Plus, Premium side-by-side
- Calculation methodology: "How we calculate your benefits"

**Action Section**:
- Primary CTA: "Maximize your benefits. Review your accounts and autopay." → Account Status or Autopay Management
- Secondary CTA: "Explore Premium tier" → Tier Details

---

## 6. Components & Responsibilities

**Page Component** (`app/loyalty/benefits/page.tsx`):
- Server-render: Fetch getBenefits() with member-specific calculations
- Pass data to client component regions
- Handle loading state with skeleton screens for benefit cards
- Handle error state with support escalation CTA
- Implement telemetry: `benefits_page_view` on load

**BenefitCard** (reused, variant="detail"):
- **Purpose**: Display individual benefit with full calculation transparency and tier comparison
- **Props**:
  - `benefit: Benefit` (benefit object with name, description, rules, calculations)
  - `memberBalance?: number` (member's qualifying balance for APY calculation context)
  - `historicalData?: { pastYearValue, period }` (real-world proof: actual earnings/savings)
  - `variant: 'summary' | 'primary' | 'comparison' | 'detail'` (detail shows full calculation + proof)
  - `onLearnMoreClick?: () => void` (for FAQ link interaction)
- **States**:
  - Default: Full card visible with benefit icon, name, description
  - Expanded (variant="detail" only): Show full calculation breakdown, comparison, historical proof
  - Loading: Skeleton card placeholder (16:9 aspect ratio)
  - Empty: "No data available for this benefit"
- **Rendering**: Full-width mobile, 2-column desktop (for APY and Fee Waiver side-by-side)
- **Accessibility**: `aria-label` describing benefit and annual value: "APY Boost benefit, provides $58.75 annually based on your balance"
- **Telemetry**: Fire `benefit_card_expand` when expanded

**BenefitCalculationBreakdown** (new):
- **Purpose**: Display transparent calculation formula with member-specific values and step-by-step math
- **Props**:
  - `calculationType: 'apy' | 'fee_waiver' | 'third_party_rewards'` (which benefit type)
  - `formula: string` (formula text, e.g., "Balance × APY % ÷ 100")
  - `memberValues: { balance?: number, transferCount?: number, purchaseAmount?: number }` (values used in calculation)
  - `result: number` (calculated annual benefit value)
  - `steps?: Array<{ label, value }>` (optional detailed calculation steps for display)
- **States**:
  - Default: Show formula in monospace font (16pt), member values highlighted, result in bold
  - With Steps: Display step-by-step calculation below formula (e.g., "$23,500 × 0.25 ÷ 100 = $58.75")
- **Rendering**: Monospace font for formula, color-coded values (member values in blue, formula operators in gray, result in green)
- **Example Output**:
  ```
  Your calculation:
  Balance × APY % ÷ 100
  $23,500 × 0.25 ÷ 100 = $58.75 annual value
  ```
- **Accessibility**: Alt text or aria-label for formula image/SVG; text version always available

**BenefitComparisonChart** (new):
- **Purpose**: Display benefit value across tiers in visual chart format (pie, bar, or table)
- **Props**:
  - `benefits: Array<Benefit>` (all benefits for current member)
  - `tiers: Array<{ tier, benefits }>` (benefit structure for each tier)
  - `chartType?: 'pie' | 'bar' | 'table'` (default: 'pie' for annual summary, 'bar' for tier comparison)
  - `selectedTier?: string` (highlight specific tier, default current tier)
  - `onTierSelect?: (tier: string) => void` (for interactive tier selection)
- **States**:
  - Default (Pie Chart): Show current member's benefit mix
    - Each segment labeled with benefit name and percentage
    - Legend below chart with color codes
    - Hover: Tooltip showing exact dollar value and percentage
  - Tier Comparison (Bar Chart): Show benefit values for Classic, Plus, Premium side-by-side
    - X-axis: Tier names
    - Y-axis: Annual benefit value ($)
    - Bars color-coded by tier
  - Table View: Alternative if charts not feasible
    - Rows: Benefit types
    - Columns: Classic | Plus | Premium values
- **Rendering**: Responsive; pie chart maintains aspect ratio on mobile, bar chart switches to horizontal on mobile
- **Accessibility**: Chart accompanied by data table for screen readers; all values readable as text
- **Telemetry**: Fire `comparison_viewed` when chart type changes

**AnnualSummaryCard** (new):
- **Purpose**: Display total annual benefit value with breakdown by benefit type and tier comparison
- **Props**:
  - `totalValue: number` (total annual benefit for current member)
  - `breakdown: { apy?: number, feeWaiver?: number, rewards?: number }` (value breakdown by benefit)
  - `tiers: Array<{ tier: 'classic' | 'plus' | 'premium', totalValue: number }>` (benefit values for comparison)
  - `memberTier: 'classic' | 'plus' | 'premium'` (current member tier for highlighting)
- **States**:
  - Default: Show total value prominently ($145/year), breakdown below, tier comparison at bottom
  - Loading: Skeleton card with placeholder values
  - Error: "Unable to load annual summary. Please contact support."
- **Rendering**:
  - Desktop: Side-by-side layout (left: breakdown, right: tier comparison table)
    - Breakdown: 3 rows (APY Boost | $58.75 (40%), Fee Waiver | $60 (41%), Third-Party Rewards | $26.25 (18%))
    - Tier comparison: Simple table (Classic $50 | Plus $145 | Premium $280) with current tier highlighted
  - Tablet: Stacked vertically, full-width layout
  - Mobile: Single-column, vertical stacking, benefit breakdown as list with visual progress bars (width = percentage)
- **Visual Elements**:
  - Total value in 24pt Bold, green (#10B981), prominent at card top
  - Percentage breakdown using horizontal progress bars (width proportional to %)
  - Tier comparison table with tier colors (Classic gray, Plus gold, Premium silver)
- **Accessibility**: `aria-label` summarizing total: "Your Plus tier provides $145 annually in benefits: $58.75 from APY Boost, $60 from Fee Waiver, $26.25 from Third-Party Rewards"
- **Example Output**:
  ```
  Your Benefits This Year: $145

  APY Boost          $58.75 (40%) ████░
  Fee Waiver         $60.00 (41%) ████░
  Third-Party Rewards $26.25 (18%) ██░░

  Compare to other tiers:
  Classic tier:  $50/year
  Plus tier:     $145/year (current)
  Premium tier:  $280/year
  ```

---

## 7. Interactions

**Benefit Card Interactions**:
- Click benefit card (variant="detail"): Expand to show full calculation breakdown, formula, comparison, and historical proof
  - Animation: Smooth 200ms height transition
  - Keyboard: Tab to card, Enter to expand/collapse
  - Only one card expanded at a time (accordion pattern)
- Click "Learn more about this benefit" link: Navigate to `/loyalty/faq?search=<benefit-name>` (search FAQ for related topic)
  - Example: "Learn more about APY Boost" → `/loyalty/faq?search=apy-boost`
- Telemetry: Fire `benefit_card_expand` when expanded

**Chart Interactions**:
- Pie Chart (Annual Summary):
  - Hover over segment: Show tooltip with benefit name, dollar value, and percentage
  - Tooltip position: Above segment, within viewport bounds
  - Tooltip content: "APY Boost: $58.75 (40.5%)"
  - Click segment (optional): Navigate to learn more (Phase 2)
- Bar Chart (Tier Comparison):
  - Hover over bar: Show tooltip with tier name and annual value
  - Tooltip: "Plus tier: $145/year"
  - Click tier bar (optional): Highlight comparison row in table below (Phase 2)
- Table View: Click row to show historical transactions for that benefit (optional; Phase 2)

**Navigation Interactions**:
- Click "Explore Premium tier" CTA: Navigate to `/loyalty/tier-details` with Premium tab pre-selected
- Click "Maximize your benefits" link: Navigate to `/loyalty/account-status` (review accounts and autopay)
- Click partner link (Third-Party Rewards): Open partner retail network page in new tab

**Keyboard Navigation**:
- Tab through: All benefit cards, Learn more links, CTAs, chart (if interactive)
- Enter/Space: Expand/collapse benefit card, activate links and buttons
- Escape: Close expanded card (optional; allows collapse)
- Focus indicators: 4px outline border with tier-color
- Arrow keys: Cycle through tier bars in comparison chart (if interactive; Phase 2)

**Touch/Mobile Interactions**:
- Single tap to expand/collapse benefit card
- Tap to show chart tooltip (not hover-based)
- All buttons and interactive elements: ≥48×48px tap targets

---

## 8. Data Contracts

### GET /api/member/:memberId/benefits

```json
{
  "memberId": "MEMBER-001",
  "tier": "plus",
  "totalAnnualBenefitValue": 145,
  "benefits": [
    {
      "benefitId": "apy-boost-plus",
      "benefitName": "APY Boost",
      "description": "Earn +0.25% annual interest",
      "tier": "plus",
      "rules": "Applies to savings and money market accounts",
      "apyPercentage": 0.25,
      "memberBalance": 23500,
      "calculatedAnnualValue": 58.75,
      "formula": "Balance × APY % ÷ 100",
      "comparisonToOtherTiers": {
        "classic": { "apyPercentage": 0.1, "value": 23.50 },
        "premium": { "apyPercentage": 0.5, "value": 117.50 }
      },
      "proofData": {
        "pastYearEarnings": 58.75,
        "period": "2025-02-21 to 2026-02-21"
      }
    },
    {
      "benefitId": "fee-waiver-plus",
      "benefitName": "Fee Waiver",
      "description": "Waived transfer fees",
      "tier": "plus",
      "rules": "All transfers between your accounts and to other members",
      "estimatedTransfersPerMonth": 2,
      "feePerTransfer": 2.50,
      "calculatedAnnualValue": 60,
      "formula": "Transfers/month × 12 months × Fee per transfer",
      "recentExamples": [
        {
          "transactionId": "TXN-1000",
          "date": "2026-02-19",
          "description": "Transfer to savings",
          "feeWaived": 2.50
        }
      ]
    },
    {
      "benefitId": "third-party-rewards-plus",
      "benefitName": "Third-Party Rewards",
      "description": "Earn bonus points with partner retailers",
      "tier": "plus",
      "partner": "RetailPoints Partnership Network",
      "partnerURL": "https://example.com/partners",
      "rules": "Earn 2X points on qualifying purchases at partner retailers (groceries, gas, dining). Points redeemable for cash back, gift cards, or charitable donations.",
      "pointsMultiplier": 2.0,
      "estimatedMonthlySpend": 500,
      "pointsPerDollar": 2.0,
      "cashValuePerPoint": 0.01,
      "calculatedAnnualValue": 26.25,
      "formula": "Monthly spend × Points/dollar × Multiplier × 12 months × Cash value/point × (1 - Redemption friction)",
      "calculationBasis": "Estimated based on your historical spending patterns",
      "comparisonToOtherTiers": {
        "classic": { "pointsMultiplier": 1.0, "value": 0 },
        "premium": { "pointsMultiplier": 3.0, "value": 52.50 }
      },
      "proofData": {
        "pastYearEarnings": 26.25,
        "pointsEarned": 2625,
        "recentTransactions": [
          {
            "date": "2026-02-15",
            "merchant": "Whole Foods Market",
            "amount": 145.32,
            "pointsEarned": 290,
            "multiplier": "2X",
            "category": "groceries"
          },
          {
            "date": "2026-02-12",
            "merchant": "Shell Gas Station",
            "amount": 65.00,
            "pointsEarned": 130,
            "multiplier": "2X",
            "category": "gas"
          }
        ]
      },
      "activationStatus": "active",
      "partnerDataRefreshDate": "2026-02-21"
    }
  ]
}
```

---

## 9. Validation Rules

**APY Boost Benefit**:
- APY percentage must be positive (> 0.0)
- Member balance must be ≥ $0
- Calculated annual value = `(memberBalance × apyPercentage) / 100`, must match API response ± $0.01 (rounding tolerance)
- Comparison values must exist for all tiers (classic, plus, premium)
- Past year earnings proof must be dated within 365 days
- Display formula must be transparent: "Balance × APY % ÷ 100"

**Fee Waiver Benefit**:
- Transfer frequency must be ≥ 0 (can be 0 if member makes no transfers)
- Fee per transfer must match tier specifications (typically $2.50 for Plus)
- Annual value = `estimatedTransfersPerMonth × 12 × feePerTransfer`, must match API response ± $0.01
- Recent example transaction must exist and show fee waived = fee per transfer amount
- Recent example must be dated within 30-90 days of current date (proof must be recent)
- Rules must specify which transfer types qualify (account transfers, third-party transfers, ACH, etc.)

**Third-Party Rewards Benefit**:
- Partner name and URL must be present and valid
- Points multiplier must be positive (> 0.0)
- Estimated monthly spend must be ≥ $0 (can be 0 if no recent activity)
- Cash value per point must be positive (typically $0.01)
- Calculated annual value = `(monthlySpend × pointsPerDollar × multiplier × 12) × cashValuePerPoint`, must match API ± $0.05
- Comparison values must exist for all tiers (classic, plus, premium)
- Recent transaction examples must exist and show correct point calculation
- Recent transactions must be dated within 30-60 days (proof must be current)
- **Partner API Availability**: If partner API is unavailable, system must:
  - Return cached value from previous successful calculation (max 7 days old)
  - Append note to benefit: "Third-party rewards calculation is estimated based on [date]. Updated data will be available soon."
  - Do NOT show $0 or hide benefit entirely
- **Partner Data Freshness**: `partnerDataRefreshDate` must be within 24 hours; if older, show disclaimer: "Third-party rewards data is being updated. Check back soon for latest calculations."

**Annual Summary Validation**:
- Total annual value must equal sum of individual benefit values ± $0.01 (rounding tolerance)
- Percentage breakdown must sum to 100% ± 1% (rounding tolerance)
- Tier comparison values must be ≥ $0
- Tier comparison must show exactly 3 tiers (classic, plus, premium)
- Member's current tier must be highlighted/distinguished in tier comparison

**Cross-Benefit Validation**:
- If any benefit calculation fails (e.g., partner API error):
  - Show other benefits normally
  - Show failed benefit with error message: "Third-party rewards calculation unavailable. This benefit may be updated."
  - Do NOT block page render
  - Telemetry: Log `benefits_partial_load` error
- If ALL benefits fail to load:
  - Show error page with retry button and support CTA
  - Telemetry: Log `benefits_load_failed` error

**General Rules**:
- All currency values must be formatted as USD ($X.XX)
- All percentages must be displayed with at least 1 decimal place (e.g., 40.5%, not 40%)
- All dollar amounts must be ≥ $0.00 (no negative values)
- Formula display must use consistent monospace font (16pt minimum)
- All benefit cards must be visually distinct (different icons, colors, or spacing)

---

## 10. Visual & Responsive Rules

- Benefit cards: Full-width mobile, 2-column desktop
- Calculation formula: 16pt monospace font for clarity
- Dollar amounts: 18pt Bold, green color (#10B981)
- Pie chart: Responsive, legend for tier colors
- Comparison table: Scrollable on mobile

---

## 11. Accessibility Checklist

- Pie chart: Accompanying data table for screen readers
- Formula text: 16pt+ monospace, high contrast
- Currency amounts: 18pt+ Bold, semantic `<strong>` tags
- Expandable sections: `aria-expanded` attributes
- Comparison tables: Semantic `<table>` with proper headers

---

## 12. Telemetry

**Event 1: Page View**
- `event: "benefits_page_view"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "tier": "plus",
    "benefitCount": 3,
    "totalAnnualBenefitValue": 145,
    "timestamp": "2026-02-21T14:30:00Z"
  }
  ```
- Fired: On page load (server-side or client hydration)
- Use case: Track benefits page engagement by tier and member count

**Event 2: Benefit Card Expanded**
- `event: "benefit_card_expand"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "tier": "plus",
    "benefitName": "APY Boost" | "Fee Waiver" | "Third-Party Rewards",
    "benefitId": "apy-boost-plus",
    "annualValue": 58.75,
    "timestamp": "2026-02-21T14:30:10Z"
  }
  ```
- Fired: When member clicks on benefit card to expand details
- Use case: Track which benefits members explore (shows interest/skepticism areas)

**Event 3: Comparison Chart Viewed**
- `event: "comparison_viewed"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "tier": "plus",
    "comparisonType": "tier" | "benefit_mix",
    "chartType": "pie" | "bar" | "table",
    "timestamp": "2026-02-21T14:30:15Z"
  }
  ```
- Fired: When member engages with tier comparison chart or switches chart type
- Use case: Track visualization preference and tier comparison interest

**Event 4: Learn More Click**
- `event: "benefit_learn_more_click"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "benefitName": "APY Boost",
    "targetRoute": "/loyalty/faq?search=apy-boost",
    "timestamp": "2026-02-21T14:30:20Z"
  }
  ```
- Fired: When member clicks "Learn more about this benefit" link
- Use case: Track FAQ escalation rate; if high, indicates need for better benefit explanations

**Event 5: CTA Action Click**
- `event: "benefits_action_cta_click"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "tier": "plus",
    "action": "explore_premium" | "maximize_benefits" | "manage_partner",
    "targetRoute": "/loyalty/tier-details" | "/loyalty/account-status" | "https://example.com/partners",
    "timestamp": "2026-02-21T14:30:25Z"
  }
  ```
- Fired: When member clicks primary/secondary CTAs
- Use case: Measure conversion from understanding to action (e.g., exploration → account review → tier advancement)

**Event 6: Tier Comparison Interaction**
- `event: "tier_comparison_selected"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "currentTier": "plus",
    "selectedTier": "premium",
    "tierValueDifference": 135,
    "timestamp": "2026-02-21T14:30:30Z"
  }
  ```
- Fired: When member selects/highlights different tier in comparison
- Use case: Track tier comparison interest; identifies members considering tier upgrade

**Event 7: Partner Click**
- `event: "partner_click"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "partnerName": "RetailPoints Partnership Network",
    "partnerURL": "https://example.com/partners",
    "benefitType": "third-party-rewards",
    "timestamp": "2026-02-21T14:30:35Z"
  }
  ```
- Fired: When member clicks partner URL in Third-Party Rewards benefit
- Use case: Track partner engagement; valuable for partner ROI calculations

**Event 8: Error Occurred**
- `event: "benefits_page_error"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "errorType": "partial_load" | "full_load_failure" | "partner_api_unavailable",
    "failedBenefits": ["third-party-rewards"],
    "timestamp": "2026-02-21T14:30:40Z"
  }
  ```
- Fired: When benefit calculations fail to load
- Use case: Track system health; identify partner API reliability issues

---

## 13. Open Questions & Assumptions

1. Should partner rewards be shown if partner API unavailable? (Current: assume cached data)
2. How far back should real-world proof data go? (Current: assume past 30-90 days)

---

## 14. Design Rationale

**UX Lead**: Transparent calculations demystify benefit value; real-world proof (actual transactions, past earnings) builds trust for skeptics; comparison to other tiers shows advancement incentive.

**Frontend Architect**: Server-renders benefit calculations with member-specific data; reuses BenefitCard component; optional charts enhance understanding without being required.

**Product/Delivery**: Benefits page supports PERSONA-04 skeptic goal (authentic value validation); reduces support questions ("how is my benefit calculated?"); increases engagement with loyalty program.

---

## 15. Cursor-Claude Ready Build Plan

### File Structure

```
app/loyalty/benefits/
├── page.tsx                          # Server component (main page)
└── components/
    ├── BenefitCalculationBreakdown.tsx # Calculation formula display
    ├── BenefitComparisonChart.tsx      # Pie/bar chart for comparison
    └── AnnualSummaryCard.tsx           # Total value + tier comparison

lib/
├── api/
│   └── benefits.ts                   # getBenefits() API call wrapper
├── hooks/
│   └── useBenefits.ts                # Custom hook for benefits data fetching/caching
├── components/
│   └── BenefitCard.tsx               # Reusable BenefitCard (variant support)
└── types/
    └── benefits.ts                   # TypeScript interfaces for benefits data
```

### Implementation Checklist

**Phase 1: Data & API Layer**
- [ ] Create `lib/types/benefits.ts`:
  - [ ] `Benefit` interface (benefit object with all fields from mock data)
  - [ ] `BenefitCalculation` type
  - [ ] `ThirdPartyRewardsData` type (with partner info, point calculations, proof transactions)
  - [ ] `BenefitComparison` type (tier-based comparison data)
  - [ ] `AnnualSummary` type (total value, breakdown, tiers)
- [ ] Create `lib/api/benefits.ts`:
  - [ ] `getBenefits(memberId: string): Promise<{ totalAnnualBenefitValue, benefits }>` function
  - [ ] Error handling: If partner API fails, return cached benefit data with fallback message
  - [ ] Timeout handling: 5-second timeout per API call with retry (3 attempts, exponential backoff)

**Phase 2: Server Component**
- [ ] Create `app/loyalty/benefits/page.tsx`:
  - [ ] Fetch benefits server-side using `getBenefits()`
  - [ ] Handle loading state (skeleton screens for benefit cards)
  - [ ] Handle error state (show available benefits, fallback message for failed benefits)
  - [ ] Handle partial load (some benefits succeeded, some failed)
  - [ ] Pass data to client components
  - [ ] Implement telemetry: `benefits_page_view` on load

**Phase 3: Component Implementation**

**BenefitCard Component** (reuse from other shards, add variant="detail"):
- [ ] Create/update `lib/components/BenefitCard.tsx`
- [ ] Implement variant="detail" state (full expansion with calculation + proof)
- [ ] Add expandable detail section:
  - [ ] Calculation breakdown (formula + member values + result)
  - [ ] Real-world proof (past year earnings or transactions)
  - [ ] Tier comparison (show value for classic/plus/premium)
  - [ ] "Learn more" link to FAQ
- [ ] Add 200ms smooth height animation for expand/collapse
- [ ] Props validation (benefit object structure, values positive)
- [ ] Test: Render with APY, Fee Waiver, Third-Party Rewards variants

**BenefitCalculationBreakdown Component**:
- [ ] Create `components/loyalty/benefits/BenefitCalculationBreakdown.tsx`
- [ ] Display formula in monospace font (16pt+, high contrast)
- [ ] Highlight member-specific values (blue color)
- [ ] Show step-by-step calculation if provided
- [ ] Example format:
  ```
  Formula: Balance × APY % ÷ 100
  Your values: $23,500 × 0.25 ÷ 100
  Result: $58.75 annual value
  ```
- [ ] For APY: Show calculation with balance, percentage, and annual value
- [ ] For Fee Waiver: Show calculation with transfer count, fee per transfer, annual savings
- [ ] For Rewards: Show calculation with spend, points, multiplier, cash conversion
- [ ] Accessibility: Formula in semantic HTML or SVG with alt text; always have text fallback
- [ ] Test: Verify calculations for each benefit type; test with extreme values (0 balance, high spend)

**BenefitComparisonChart Component**:
- [ ] Create `components/loyalty/benefits/BenefitComparisonChart.tsx`
- [ ] Implement pie chart (default, for benefit mix):
  - [ ] Use recharts or similar charting library
  - [ ] Show current member's benefit breakdown (APY, Fee Waiver, Rewards)
  - [ ] Segments labeled with benefit name and percentage
  - [ ] Legend below chart with colors
  - [ ] Hover tooltip: shows exact dollar value and percentage
  - [ ] Responsive: scales to container on mobile
- [ ] Implement bar chart (tier comparison):
  - [ ] X-axis: Tier names (Classic, Plus, Premium)
  - [ ] Y-axis: Annual benefit value ($)
  - [ ] Bars color-coded by tier (gray, gold, silver)
  - [ ] Current tier highlighted/distinguished
  - [ ] Hover tooltip: shows tier name and annual value
  - [ ] Mobile: Switch to horizontal bar chart or stacked bars
- [ ] Implement table view (fallback/alternative):
  - [ ] Rows: Benefit types (APY, Fee, Rewards)
  - [ ] Columns: Classic | Plus | Premium
  - [ ] Current tier highlighted
  - [ ] Accessible to screen readers
- [ ] Props: Allow switching between pie/bar/table with `chartType` prop
- [ ] Telemetry: Fire `comparison_viewed` when chart type changes
- [ ] Test: Verify chart renders with sample data; test all three chart types; test responsive behavior

**AnnualSummaryCard Component**:
- [ ] Create `components/loyalty/benefits/AnnualSummaryCard.tsx`
- [ ] Display total annual value prominently (24pt+ Bold, green color #10B981)
- [ ] Show benefit breakdown:
  - [ ] Desktop: Side-by-side (left: breakdown, right: tier comparison)
  - [ ] Tablet/Mobile: Stacked vertically
- [ ] Implement breakdown display:
  - [ ] 3-4 rows (one per benefit type)
  - [ ] Each row: Benefit name | Amount | Percentage
  - [ ] Optional: Visual progress bar (width = percentage)
- [ ] Implement tier comparison table:
  - [ ] 3 columns: Classic | Plus | Premium
  - [ ] 1 row: Annual value for each tier
  - [ ] Current tier highlighted (bold, colored background)
  - [ ] Values color-coded (gray for classic, gold for plus, silver for premium)
- [ ] Example output:
  ```
  Your Benefits This Year: $145

  APY Boost          $58.75 (40%)  ████░░░░░░
  Fee Waiver         $60.00 (41%)  ████░░░░░░
  Third-Party Rewards $26.25 (18%) ██░░░░░░░░

  Compare to other tiers:
  Classic:  $50/year
  Plus:     $145/year  (current)
  Premium:  $280/year
  ```
- [ ] Props validation (total value = sum of breakdown ± $0.01, percentages sum to 100% ± 1%)
- [ ] Accessibility: aria-label describing total and breakdown
- [ ] Test: Verify calculations; test with different tier values; test responsive layouts

**Phase 4: Styling & Responsiveness**
- [ ] Apply Tailwind classes matching UX spec:
  - [ ] Calculation formula: Monospace font (16pt+), high contrast (7:1)
  - [ ] Dollar amounts: 18pt+ Bold, green (#10B981)
  - [ ] Percentages: 16pt, gray secondary color
  - [ ] Buttons/CTAs: Tier-color background, white text, 48×48px minimum
  - [ ] Chart: Responsive, scales to container, legend readable at all sizes
- [ ] Desktop layout:
  - [ ] 1-column layout for benefit cards (can be 2-column if space)
  - [ ] Pie chart + tier comparison side-by-side
  - [ ] Full-width CTA buttons at bottom
  - [ ] Max-width 1200px container with padding
- [ ] Tablet layout:
  - [ ] 1-column benefit cards
  - [ ] Pie chart full-width, tier comparison below
  - [ ] Stacked CTA buttons
  - [ ] Touch-friendly spacing
- [ ] Mobile layout:
  - [ ] 100% width with 16px side padding
  - [ ] Single-column stacked layout
  - [ ] Pie chart scales to full-width
  - [ ] Tier comparison: 3 columns if space, else horizontal scroll or stacked
  - [ ] 48×48px minimum tap targets verified

**Phase 5: Testing**

**Unit Tests** (`BenefitCalculationBreakdown.test.tsx`):
- [ ] Renders formula in monospace font (16pt+)
- [ ] Highlights member values correctly
- [ ] Calculates result correctly for APY, Fee Waiver, and Rewards
- [ ] Displays step-by-step calculation if provided
- [ ] Aria-label present and describes calculation

**Unit Tests** (`BenefitComparisonChart.test.tsx`):
- [ ] Pie chart renders with correct segments and labels
- [ ] Pie chart percentages sum to 100% ± 1%
- [ ] Bar chart renders with correct tier values and colors
- [ ] Table view renders with correct data
- [ ] Chart type prop switches between pie/bar/table
- [ ] Hover tooltips display correct values
- [ ] Responsive layout switches on mobile

**Unit Tests** (`AnnualSummaryCard.test.tsx`):
- [ ] Displays total annual value prominently in green
- [ ] Breakdown sums to total value ± $0.01
- [ ] Percentages sum to 100% ± 1%
- [ ] Tier comparison shows all three tiers with values
- [ ] Current tier highlighted/distinguished
- [ ] Desktop: Breakdown and tier comparison side-by-side
- [ ] Mobile: Breakdown and tier comparison stacked

**Integration Tests** (`benefits.integration.test.tsx`):
- [ ] Page loads benefits from API successfully
- [ ] All benefit cards render with correct data (APY, Fee, Rewards)
- [ ] Error handling: If one benefit fails, others still show
- [ ] Error handling: If all benefits fail, error message displays with retry
- [ ] Partial load: Show "data updating" message for unavailable partner data
- [ ] All CTAs navigate to correct routes
- [ ] Telemetry events fire for expand, comparison view, CTA click

**E2E Tests** (`benefits.e2e.test.ts`):
- [ ] Navigate to `/loyalty/benefits` and page loads
- [ ] All benefit cards visible with icons, names, and values
- [ ] Click benefit card → Expands to show calculation breakdown
- [ ] Click "Learn more about APY Boost" → Navigate to `/loyalty/faq?search=apy-boost`
- [ ] Pie chart displays with correct segment sizes
- [ ] Tier comparison table shows classic/plus/premium values with Plus highlighted
- [ ] Click "Explore Premium tier" → Navigate to `/loyalty/tier-details`
- [ ] Click "Maximize your benefits" → Navigate to `/loyalty/account-status`
- [ ] Click partner URL (Third-Party Rewards) → Opens in new tab
- [ ] All text readable at 16pt+ font size
- [ ] All buttons/interactive elements ≥48×48px tap targets
- [ ] Verify layout on mobile (480px), tablet (768px), desktop (1024px+)

**Phase 6: Accessibility & Performance**
- [ ] Lighthouse Accessibility audit: 90+ score
- [ ] Keyboard navigation: Tab through all benefit cards, CTAs, chart elements
- [ ] Screen reader: All benefit values, calculations, and comparisons announced
- [ ] Color contrast: All text 4.5:1 minimum (amounts 7:1 minimum)
- [ ] Focus indicators: 4px outline on all focusable elements
- [ ] Charts: Data table accompanying every chart (alternative text representation)
- [ ] Performance:
  - [ ] First Contentful Paint (FCP): < 1.5s
  - [ ] Largest Contentful Paint (LCP): < 2.5s
  - [ ] Cumulative Layout Shift (CLS): < 0.1
- [ ] Bundle size: All components and charting library < 100KB gzipped

**Phase 7: Documentation & Deployment**
- [ ] Add JSDoc comments to all component functions
- [ ] Document prop types, defaults, and validation rules
- [ ] Add usage examples in component files (especially chart types)
- [ ] Document error handling strategy (partner API failures, partial load)
- [ ] Update project README with Benefits page integration notes
- [ ] Document third-party rewards fallback behavior (cached data, update window)
- [ ] Test in staging environment with real API
- [ ] Deploy to production with feature flag (if using)

---

✅ **SHARD 05 COMPLETE**
