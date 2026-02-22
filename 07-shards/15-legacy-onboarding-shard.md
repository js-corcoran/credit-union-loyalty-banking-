# Shard 15: Legacy Migration Onboarding

**Build Priority**: P1
**Estimated Effort**: 20 hours
**Screen ID**: SCR-15
**Route**: `/loyalty/migration` (also triggered as first-login modal post-launch)
**Component File**: `app/loyalty/migration/page.tsx`

---

## 1. Screen Name & Route

**Full Screen Name**: Legacy Migration Onboarding Wizard
**URL Route**: `/loyalty/migration`
**Navigation Access**: First login after loyalty launch (automatic modal trigger) | Loyalty Hub → "What's Changed?" | Navigation → Help → Legacy Migration
**Page Title**: "Welcome to Your New Loyalty Program"
**Breadcrumb**: Home > Loyalty > Migration Guide

**Route Parameters**: None (member context determined by auth)
**Auth Requirements**: Authenticated member (redirect to login if not authenticated)
**Deep Link Format**: `https://[domain]/loyalty/migration?source=email` (optional tracking param)

---

## 2. Purpose & Jobs-to-be-Done

**Primary Purpose**: Educate existing loyalty members about the transition from legacy program (unnamed, implied simple structure) to new 3-tier program, explain what they keep/gain/lose, show their mapped new tier, and reassure them the change is fair and positive. This is the most critical screen for managing adoption anxiety among change-averse members (PERSONA-01, PERSONA-03).

**Jobs-to-be-Done**:
1. **Understand change narrative** — Member needs clear explanation of "what's different" without jargon; fear reduction through transparent communication
2. **Learn personal tier mapping** — Member needs to know their new tier and why they qualify for it based on existing holdings
3. **See benefit comparison** — Member needs to understand benefits they keep, gain, and (transparently) lose in tier migration
4. **Reduce transitional anxiety** — Member needs reassurance program is fair, benefits are real, and they have support available
5. **Provide step-by-step guidance** — Member needs optional walk-through explanation if they want deeper understanding

---

## 3. User Stories & Acceptance Criteria

### Story 0: Member Receives Pre-Launch Communication (Email, 1 week before launch)

**As a** any existing loyalty member
**I want to** receive personalized email explaining tier mapping before I see the modal
**So that** I have time to prepare and feel confident about the transition

**Given** loyalty program migration is scheduled for [date]
**When** I receive email 7 days before launch
**Then** I see:
- Subject: "Your Loyalty Program is Changing — Here's What It Means for You" (personalized with member name)
- Email content (plain language, 16pt minimum):
  - "We're simplifying our loyalty program to give you better benefits. You're automatically part of the new program."
  - Personal tier mapping (prominently displayed):
    - "Your New Tier: [Plus]" with tier color badge
    - "You automatically qualify based on your current account activity"
    - Qualification explanation: "Your $14,500 balance + 2 autopays = Plus Tier"
  - Benefit comparison (table format or visual):
    - Column 1: "What You Keep" — Legacy benefits that continue
    - Column 2: "What You Gain" — New benefits added
    - Column 3: "What You Lose" (if applicable) — Any discontinued benefits with replacement value shown
    - Real-dollar values for each benefit
  - Call-to-action: "Learn more" link → First-login modal (if not already completed); "Ask questions" link → FAQ
  - Tone: Reassuring, transparent, framing as positive change

**If member downgrades** (legacy Gold maps to new Classic):
- Explicit acknowledgment: "Your legacy Gold tier maps to our new Classic tier. Here's why and what you still get..."
- Transparent comparison: Show dollar value of lost benefits + dollar value of gained benefits
- Recovery path: "To reach Plus tier, you just need to [specific action with dollar amount or autopay count]"

**And** email is personalized by member segment:
- PERSONA-01 (change-averse): Emphasize "automatically" and "no action needed"
- PERSONA-03 (overwhelmed): Use simpler language, shorter paragraphs, clearer structure
- PERSONA-04 (skeptical): Lead with transparent benefit comparison, real-dollar values

**And** members who completed migration via modal already won't receive this email (migration status checked server-side)

---

### Story 1: Member Understands Migration Narrative and New Program

**As a** change-averse everyday banker (PERSONA-01)
**I want to** see clear explanation of what's changing and why
**So that** I understand the loyalty program transition is transparent and fair

**Given** I log into banking app for first time post-launch
**When** migration modal appears automatically
**Then** I see:
- Modal title: "Welcome to Your New Loyalty Program"
- One-paragraph narrative (3–4 sentences, plain language, 16pt): "We've simplified our loyalty rewards program to make it easier to earn benefits. You're automatically part of our new program based on your account activity. Here's what that means for you."
- Progress indicator: "Step 1 of 3" (confirms wizard format)
- Visual: Graphic showing "Legacy Program" → "New 3-Tier Program" (simple arrow, not complex diagram)
- Three-tier tier names + colors displayed as visual reference
- "Continue" button (primary action)
- "Learn more" link (navigates to /loyalty/tier-details for deeper understanding)
- "Skip for now" link (allows dismissal; reminder available from help menu)

**And** tone is reassuring, not alarming; uses word "automatically" to remove anxiety about requalification

---

### Story 2: Member Sees Personal Tier Mapping and Qualification Basis

**As a** confused member needing reassurance (PERSONA-03)
**I want to** know my new tier and understand why I qualify
**So that** I feel confident the transition is fair to my account

**Given** I continue past migration welcome screen
**When** step 2 of wizard appears
**Then** I see:
- Large tier badge (120×120px): Shows new tier (e.g., "Plus" with color background)
- Headline: "Your New Tier: Plus"
- Subheading: "You automatically qualify based on your current account activity"
- Qualification explanation (plain language):
  - "Your account balance: $14,500 (required: $10,000+) ✓"
  - "Your active autopays: 2 (required: 2) ✓"
  - "No action needed — you're already set!"
- Visual confirmation: Green checkmarks for both requirements met
- If member **does not** qualify for tier they previously qualified for in legacy program:
  - Transparent message: "Your legacy program tier was [Legacy Tier], which is similar to our new [Mapped Tier]. Here's how we mapped your benefits."
  - Table: Legacy Tier | New Tier | Benefit Mapping (transparent about any downgrades)
  - **Downgrade-specific messaging template** (if member downgrades):
    - Example: "Your legacy Gold tier qualifies for our new Classic tier. We simplified benefits to focus on what matters most to you. Here's what changes:"
    - Show side-by-side comparison: Old annual benefits value vs. New annual benefits value
    - Emphasize replacement value: "Legacy referral bonus ($50/year) is replaced with [New Benefit] ($60/year) = net +$10 annual value"
    - Recovery path: "To reach Plus tier, just [specific action]: increase balance by $7,500 OR set up 1 autopay"
- "Next: See Your Benefits" button (primary action)
- "Have questions?" link (navigates to FAQ with pre-filtered migration questions)

**And** no negative language; frame as "automatically qualifies" not "dropped to lower tier"

**And** if member immediately at retrogression risk after migration (e.g., balance dropped to $9,500):
- Supportive note appears below tier badge: "We also noticed your balance is approaching the tier minimum. You have 30 days to increase it. [Link: Learn about maintaining your tier]"
- This prevents surprise retrogression alert immediately after migration onboarding

---

### Story 3: Member Sees Benefit Comparison (Keep, Gain, Lose)

**As a** benefit-conscious member (PERSONA-02, PERSONA-04)
**I want to** see what benefits I keep, gain, and lose in migration
**So that** I trust the new program provides real value

**Given** I reach step 3 of migration wizard
**When** benefit comparison section displays
**Then** I see three columns:
- **Column 1: Benefits You Keep** — List of benefits from legacy program that continue in new program
  - Example: "APY Boost on Savings (same rate: +0.1% for your $14,500 = ~$14.50/year)"
  - Real-dollar calculation personalized to member's balance
  - Checkmark icon, green text
  - For PERSONA-01 (change-averse): Emphasize "continues" and "no change to your experience"
- **Column 2: Benefits You Gain** — Benefits added in new program
  - Example: "Fee Waiver on Transfers (estimated annual value: $60–$72 based on your historical transfer frequency)"
  - "NEW" badge
  - Real-dollar calculation showing member's likely value
  - Example: "Third-Party Rewards (automated cash back on partner purchases: $0–$25/year estimated)"
  - For PERSONA-03 (overwhelmed): Show simplified list (max 3 benefits) and link to "Full benefits list"
- **Column 3: Benefits You Lose** (if applicable) — Transparent about any reductions
  - Example: "Legacy Referral Bonus (discontinued but replaced with fee waiver)"
  - Red/neutral text, honest tone: "We simplified rewards; this benefit replaced with higher-value fee waiver"
  - Real-dollar comparison if applicable: "Old referral max: $50/year | New fee waiver: $60/year = net +$10 value"

**And** if member loses benefit, frame transparently: "We replaced [X] with [Y] because it's more valuable for your account"

**And** for PERSONA-04 (skeptical): Include footnote with benefit calculation methodology: "How we calculated value: [link to FAQ explaining APY boost calculation, fee waiver assumptions, etc.]"

---

### Story 4: Member Completes Wizard and Receives Confirmation

**As a** any member
**I want to** complete migration understanding and get confirmation
**So that** I can proceed to banking with confidence

**Given** I reach final step of wizard
**When** completion screen displays
**Then** I see:
- Checkmark icon + success message: "You're All Set!"
- Summary (text): "You're now enrolled in our Plus Tier loyalty program. You don't need to do anything — benefits start immediately."
- Key next steps (3 bullet points):
  1. "Explore your benefits" → Link to `/loyalty` (Loyalty Hub)
  2. "Learn the full program" → Link to `/loyalty/tier-details` (Tier Details Page)
  3. "Set up your first autopay" → Link to `/autopay/add` (if member has <2 autopays, otherwise skip)
- Primary CTA: "Get Started" (navigates to Loyalty Hub)
- Secondary CTA: "Go to Home" (navigates to home dashboard)
- Info box: "Have questions about your benefits? Visit our FAQ or call us at [support number]"

**And** wizard can be dismissed and re-accessed anytime from Help menu

---

## 4. States

### Default State
- Three-step wizard fully loaded
- Current step displayed with progress indicator
- Member's tier, qualification status, and benefit comparison pre-populated with real data
- All CTAs functional
- Skip/dismiss option available at each step

### Loading State
- Skeleton screens for tier badge and benefit cards
- Placeholder text for qualification explanation
- Progress indicator visible but content areas showing loading indicators

### Error State

**Error Scenario 1: Legacy data missing or unavailable**
- Condition: Member's legacy program data (tier, benefits) cannot be retrieved
- User message: "We couldn't load your legacy program information. No problem — here's your new loyalty program details:"
- Recovery: Show generic onboarding (all three tiers explained, no personalization) with next-step option: "Continue to your new benefits" or "Contact us for help matching your tier"
- Tooltip/help link: "Why don't I see my legacy tier?" → Explains member is new post-launch or data unavailable

**Error Scenario 2: Tier mapping calculation fails**
- Condition: Server cannot map legacy tier to new tier (algorithm error or ambiguous legacy data)
- User message: "We're having trouble determining your exact tier match. Let us help you get set up right."
- Recovery: Offer two options:
  - "Call us for a quick setup (5 min)" → Link to call button with expected wait time
  - "Start with Classic tier and adjust later" → Auto-assign to lowest tier, explain member can contact support to re-map
- Telemetry: Track this error to identify legacy data quality issues

**Error Scenario 3: Benefit comparison data incomplete**
- Condition: Can load tier mapping but some benefit values cannot calculate (e.g., historical transaction data missing)
- User message: "Your benefits are ready, but some values are estimated:"
- Recovery: Show benefits with confidence labels:
  - "APY Boost: $21.75/year (exact)" — green indicator
  - "Fee Waiver: $60–$75/year (estimated based on similar members)" — yellow indicator with link to FAQ
- Allow member to proceed; note appears: "Your actual savings may differ. We'll send you an updated comparison after 30 days."

**Error Scenario 4: API timeout or network error**
- Condition: Request exceeds 5 seconds or server returns 5xx error
- User message: "We're taking longer than usual. Please try again or contact support."
- Recovery: Show retry button; if retry fails, offer: "Try again later" or "Contact us immediately"
- Fallback: Allow member to skip wizard with message: "You can complete migration details anytime from Help → Legacy Program FAQ"

### Offline State
- Banner at top: "Some information is not available offline. Please reconnect to see your personalized benefits."
- Allow progression through wizard; mark benefit values as "pending update"
- Skip option available with message: "You'll need to go online to complete this. Check back when you have internet."

### Completed State
- Post-wizard: Confirmation screen with "Get Started" CTA
- Subsequent logins: No modal trigger (tracked in database via `hasCompletedMigration` flag); access via Help menu
- If member completed early but logs back in before launch deadline: Show "Migration already completed" message, link to Loyalty Hub (skip modal entirely)

---

## 5. Information Architecture

### Visual Regions (Top to Bottom)

**Header Region (Mobile: Sticky)**:
- Progress indicator: "Step 1 of 3" | "Step 2 of 3" | "Step 3 of 3" (visual bar + text)
- Title: "Welcome to Your New Loyalty Program" (20pt Bold)
- Subheading (optional): Contextual (e.g., "See Your New Tier")

**Body Region** (three variants per step):
- **Step 1 (Change Narrative)**:
  - One-paragraph narrative (plain language, 16pt)
  - Visual: Simple "before/after" graphic (legacy program silhouette → 3-tier program)
  - Information: Why change was made (simplification, transparency, member value)

- **Step 2 (Personal Tier Mapping)**:
  - Large tier badge (120×120px, centered)
  - Tier name (24pt Bold)
  - Qualification explanation (16pt)
  - Visual checklist: Balance requirement ✓ | Autopay requirement ✓
  - Optional mapping table (if tier changed from legacy)

- **Step 3 (Benefit Comparison)**:
  - Three-column layout (responsive: cards stacked mobile, side-by-side desktop)
  - Column headers: "Benefits You Keep" | "Benefits You Gain" | "Benefits You Lose"
  - Benefit cards with real-dollar values
  - Visual icons (checkmark, new badge, info icon)

**Action Region**:
- Primary CTA: "Continue" (Step 1-2) | "Get Started" (Step 3)
- Secondary link: "Learn more" (Step 1) | "Have questions?" (Step 2) | "Go to Home" (Step 3)
- Tertiary link: "Skip for now" (Step 1-2, not Step 3)

**Footer Region** (optional):
- Support contact info: "Questions? Call [number] or visit Help"
- FAQ link: "Explore migration FAQ"

---

## 6. Components & Responsibilities

### Component Tree

```
Page (app/loyalty/migration/page.tsx) — Server Component
├── MigrationWizardContainer (Client)
│   ├── ProgressIndicator
│   │   ├── Step 1 indicator
│   │   ├── Step 2 indicator
│   │   └── Step 3 indicator
│   ├── [STEP 1: Change Narrative]
│   │   ├── Header "Welcome to Your New Loyalty Program"
│   │   ├── WelcomeNarrative (text component)
│   │   ├── ProgramComparisonGraphic (SVG)
│   │   └── ActionButtons
│   │       ├── Button "Continue"
│   │       ├── Link "Learn more"
│   │       └── Link "Skip for now"
│   │
│   ├── [STEP 2: Personal Tier Mapping]
│   │   ├── Header "Your New Tier"
│   │   ├── TierBadge (large, 120×120px)
│   │   ├── TierName (24pt Bold)
│   │   ├── QualificationExplainer
│   │   │   ├── Balance requirement (with status)
│   │   │   ├── Autopay requirement (with status)
│   │   │   └── Green checkmarks + plain language
│   │   ├── [Optional] LegacyMappingTable
│   │   │   └── Legacy Tier | New Tier | Notes
│   │   └── ActionButtons
│   │       ├── Button "Next: See Your Benefits"
│   │       └── Link "Have questions?"
│   │
│   ├── [STEP 3: Benefit Comparison]
│   │   ├── Header "Your Benefits"
│   │   ├── BenefitComparisonGrid (3 columns responsive)
│   │   │   ├── KeepBenefitsColumn
│   │   │   │   └── BenefitCard × 2–3 (Keep benefits)
│   │   │   ├── GainBenefitsColumn
│   │   │   │   └── BenefitCard × 2–3 (Gain benefits)
│   │   │   └── LoseBenefitsColumn (conditional)
│   │   │       └── BenefitCard × 0–2 (Lose benefits)
│   │   └── ActionButtons
│   │       ├── Button "Get Started"
│   │       └── Link "Go to Home"
│   │
│   └── [COMPLETION: Confirmation Screen]
│       ├── SuccessIcon (checkmark)
│       ├── Header "You're All Set!"
│       ├── ConfirmationMessage
│       ├── NextStepsList
│       │   ├── "Explore your benefits" → Link
│       │   ├── "Learn the full program" → Link
│       │   └── "Set up your first autopay" → Link (conditional)
│       ├── SupportCallout
│       └── ActionButtons
│           ├── Button "Get Started" (→ /loyalty)
│           └── Button "Go to Home" (→ /)
```

### Component Responsibilities

**MigrationWizardContainer**:
- Props: None (member context from auth)
- Responsibility: Manage wizard step state, load member data, orchestrate step transitions
- State: `currentStep` (1-3), `memberData`, `isLoading`, `error`
- Accessibility: `role="region"`, announce step changes with `aria-live="polite"`

**ProgressIndicator**:
- Props: `currentStep: 1 | 2 | 3`, `totalSteps: 3`
- Responsibility: Display visual progress bar and numeric indicator
- Accessibility: `role="progressbar"`, `aria-valuenow`, `aria-valuemin="1"`, `aria-valuemax="3"`

**WelcomeNarrative**:
- Props: `text: string`
- Responsibility: Display narrative paragraph in plain language, 16pt or larger
- Accessibility: Semantic `<p>`, plain language

**ProgramComparisonGraphic**:
- Props: None (static SVG)
- Responsibility: Display before/after visual showing legacy program → 3-tier program
- Accessibility: `<svg aria-label="Legacy program transitions to new 3-tier loyalty program"`

**TierBadge** (reused from prior shards):
- Props: `tier: "classic" | "plus" | "premium"`, `size: "large"` (120×120px)
- Responsibility: Display tier with color, icon, name
- Accessibility: Already accessible from prior implementation

**QualificationExplainer**:
- Props: `memberStatus: { balanceQualified: boolean, autopayQualified: boolean, qualifyingBalance: number, autopayCount: number }`
- Responsibility: Display member's specific qualification requirements with status indicators
- Accessibility: List items with `aria-label` for each requirement

**BenefitCard** (variant for migration):
- Props: `benefit: { name, description, value }, variant: "keep" | "gain" | "lose"`, `memberValue: number`
- Responsibility: Display single benefit with keep/gain/lose styling
- Accessibility: Card with semantic structure, real-dollar value clearly stated

**BenefitComparisonGrid**:
- Props: `keepBenefits`, `gainBenefits`, `loseBenefits`
- Responsibility: Layout three columns (responsive) with benefit cards
- Accessibility: Grid role, proper column headers, semantic structure

---

## 7. Interactions

### Wizard Navigation

- **Click "Continue"**: Move from Step 1 → Step 2 (scroll to top of wizard, announce progress)
- **Click "Next: See Your Benefits"**: Move from Step 2 → Step 3
- **Click "Get Started"**: Move to completion screen, then auto-navigate to `/loyalty` (Loyalty Hub)
- **Click "Go to Home"**: Close wizard, navigate to `/` (home dashboard)
- **Click "Skip for now"**: Dismiss wizard, track as dismissed in localStorage; show reminder in Help menu

### Keyboard Navigation

- **Tab**: Cycle through focusable elements (buttons, links) in tab order
- **Shift+Tab**: Reverse tab order
- **Enter**: Activate focused button or link
- **Escape** (optional): Close wizard and dismiss (same as "Skip for now" or X button)

### Step-Change Behavior

- **Announce step change**: Use `aria-live="polite"` to announce "Step 2 of 3: Your New Tier"
- **Scroll behavior**: Auto-scroll to top of wizard when step changes
- **Focus management**: Set focus to new step heading for keyboard users

### Mobile Interactions

- **Swipe left**: Next step (optional, nice-to-have for mobile UX)
- **Swipe right**: Previous step (only if user navigates backward)
- **Full-width cards**: Benefit comparison cards stack vertically on mobile

### Focus Management

- **Initial focus**: "Continue" button (Step 1)
- **Step change focus**: First focusable element in new step (usually heading or primary CTA)
- **Completion focus**: "Get Started" button

---

## 8. Data Contracts

### GET /api/member/:memberId/legacy-migration

**Request**:
```
GET /api/member/MEMBER-001/legacy-migration
Authorization: Bearer [authToken]
```

**Response**:
```json
{
  "memberId": "MEMBER-001",
  "migrationStatus": "pending",
  "legacyProgram": {
    "tierName": "Silver Member",
    "benefitsList": [
      {
        "benefitId": "legacy-apy-boost",
        "name": "APY Boost",
        "description": "Earn +0.1% on savings",
        "annualValue": 14.50
      },
      {
        "benefitId": "legacy-referral",
        "name": "Referral Bonus",
        "description": "Earn $25 per successful referral",
        "annualValue": 50
      }
    ]
  },
  "newProgram": {
    "mappedTier": "plus",
    "tierName": "Plus",
    "displayColor": "#D4A574",
    "qualificationStatus": {
      "balanceQualified": true,
      "autopayQualified": true,
      "qualifyingBalance": 14500,
      "autopayCount": 2
    },
    "benefits": [
      {
        "benefitId": "apy-boost-plus",
        "name": "APY Boost",
        "description": "Earn +0.15% on savings",
        "annualValue": 21.75
      },
      {
        "benefitId": "fee-waiver-transfer",
        "name": "Transfer Fee Waiver",
        "description": "Unlimited transfers with zero fee",
        "annualValue": 60
      },
      {
        "benefitId": "rewards-plus",
        "name": "Partner Rewards",
        "description": "Cash back on partner purchases",
        "annualValue": 8
      }
    ]
  },
  "benefitComparison": {
    "keep": [
      {
        "benefitId": "apy-boost-plus",
        "legacyName": "APY Boost",
        "newName": "APY Boost",
        "legacyValue": 14.50,
        "newValue": 21.75,
        "change": "upgrade"
      }
    ],
    "gain": [
      {
        "benefitId": "fee-waiver-transfer",
        "name": "Transfer Fee Waiver",
        "newValue": 60,
        "change": "new"
      }
    ],
    "lose": [
      {
        "benefitId": "legacy-referral",
        "name": "Referral Bonus",
        "oldValue": 50,
        "replacement": "Fee waiver ($60 annual value)",
        "change": "discontinued"
      }
    ]
  },
  "narrativeText": "We've simplified our loyalty rewards program to make it easier to earn benefits. You're automatically part of our new program based on your account activity. Here's what that means for you.",
  "hasCompletedMigration": false,
  "completionTimestamp": null
}
```

### TypeScript Service Facade

```typescript
export async function getMigrationData(
  memberId: string
): Promise<LegacyMigrationResponse> {
  const response = await fetch(`/api/member/${memberId}/legacy-migration`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });
  if (!response.ok) throw new Error("Failed to fetch migration data");
  return response.json();
}

export async function markMigrationComplete(
  memberId: string
): Promise<void> {
  const response = await fetch(`/api/member/${memberId}/legacy-migration/complete`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });
  if (!response.ok) throw new Error("Failed to mark migration complete");
}

interface LegacyMigrationResponse {
  memberId: string;
  migrationStatus: "pending" | "completed";
  legacyProgram: LegacyProgramData;
  newProgram: NewProgramData;
  benefitComparison: BenefitComparisonData;
  narrativeText: string;
  hasCompletedMigration: boolean;
  completionTimestamp: string | null;
}
```

### Mock Data

```typescript
const mockMigrationData: LegacyMigrationResponse = {
  memberId: "MEMBER-001",
  migrationStatus: "pending",
  legacyProgram: {
    tierName: "Silver Member",
    benefitsList: [
      {
        benefitId: "legacy-apy-boost",
        name: "APY Boost",
        description: "Earn +0.1% on savings",
        annualValue: 14.50
      },
      {
        benefitId: "legacy-referral",
        name: "Referral Bonus",
        description: "Earn $25 per successful referral",
        annualValue: 50
      }
    ]
  },
  newProgram: {
    mappedTier: "plus",
    tierName: "Plus",
    displayColor: "#D4A574",
    qualificationStatus: {
      balanceQualified: true,
      autopayQualified: true,
      qualifyingBalance: 14500,
      autopayCount: 2
    },
    benefits: [
      {
        benefitId: "apy-boost-plus",
        name: "APY Boost",
        description: "Earn +0.15% on savings",
        annualValue: 21.75
      },
      {
        benefitId: "fee-waiver-transfer",
        name: "Transfer Fee Waiver",
        description: "Unlimited transfers with zero fee",
        annualValue: 60
      },
      {
        benefitId: "rewards-plus",
        name: "Partner Rewards",
        description: "Cash back on partner purchases",
        annualValue: 8
      }
    ]
  },
  benefitComparison: {
    keep: [...],
    gain: [...],
    lose: [...]
  },
  narrativeText: "We've simplified our loyalty rewards program to make it easier to earn benefits. You're automatically part of our new program based on your account activity. Here's what that means for you.",
  hasCompletedMigration: false,
  completionTimestamp: null
};
```

---

## 9. Validation Rules

- Member must be authenticated (redirect to login if not)
- Legacy program data must exist (if not, show generic onboarding, not migration-specific)
- Tier mapping must be accurate (validate against tier qualification rules in `/lib/calculations.ts`)
- Benefit comparison must be transparent (if member loses benefit, must explain replacement or rationale)
- Step progression requires at least loading step 1 before advancing
- All real-dollar values must be calculated using member-specific data (balance, historical transactions, etc.)

---

## 10. Visual & Responsive Rules

### Design Tokens

**Colors**:
- Tier badges: Classic (#5B7C99), Plus (#D4A574), Premium (#E8E8E8) — with 7:1 contrast against white background
- Success: #10B981 (green checkmarks)
- Neutral: #6B7280 (gray for legacy program visual)
- Gain column: Light green background (5% opacity)
- Lose column: Light red background (5% opacity)

**Typography**:
- Page title: 24pt Bold
- Section heading: 20pt Bold
- Body text: 16pt Regular (minimum for older demographic)
- Benefit name: 18pt Bold
- Benefit value: 16pt Bold (real-dollar amounts in green)
- Labels: 14pt Regular (minimum, with high contrast)

**Spacing**:
- Step spacing: 32px top margin
- Card padding: 20px
- Button spacing: 12px between buttons
- Column gap: 20px (desktop)

### Responsive Breakpoints

**Mobile (< 768px)**:
- Full-width card layout
- Wizard title: 20pt Bold
- Benefit comparison: Stack vertically (3 rows)
- Tier badge: 100×100px
- Single-column navigation (no sidebar)
- Touch targets: 48×48px minimum

**Tablet (768px – 1024px)**:
- Centered container (max-width 600px)
- Tier badge: 120×120px
- Benefit comparison: 2 columns on first row, 1 column on second
- Typography: 16pt base

**Desktop (> 1024px)**:
- Centered wizard container (max-width 900px)
- Benefit comparison: 3 columns side-by-side
- Tier badge: 120×120px
- Full typography scale

---

## 11. Accessibility Checklist

- **Page title & heading**: Semantic `<h1>`, visible and programmatic
- **Progress indicator**: `role="progressbar"`, `aria-valuenow="1"`, `aria-valuemin="1"`, `aria-valuemax="3"`
- **Step announcements**: `aria-live="polite"` on wizard region for step change announcements
- **Tier badge**: `aria-label="You qualify for Plus Tier"` (descriptive text)
- **Requirement checkmarks**: Accompanied by text (not icon-only); checkmark + "Balance requirement met" text
- **Benefit cards**: Semantic card structure, benefit name as `<h3>`, value clearly stated
- **All buttons/links**: 48×48px minimum touch target, clear focus indicator (2px outline, 2px offset)
- **Color contrast**: 7:1 for all text (including small text like labels)
- **Focus order**: Top-to-bottom, left-to-right; logical flow matching visual layout
- **Keyboard navigation**: All interactive elements reachable via Tab/Shift+Tab
- **Form inputs** (if any): Associated labels, error messages announced to screen readers
- **Links**: Descriptive link text (not "Click here"); underlined for visibility
- **Language**: Plain English, no jargon; financial terms defined on first use

---

## 12. Telemetry

**Event Tracking**:

- `event: "migration_wizard_start"` — First time user sees wizard
  - `payload: { step: 1, memberId, timestamp }`

- `event: "migration_step_view"` — User reaches new step
  - `payload: { step: 1 | 2 | 3, memberId, duration_seconds }`

- `event: "migration_step_skip"` — User skips wizard
  - `payload: { step: 1 | 2, memberId, reason: "skip_button" }`

- `event: "migration_complete"` — User finishes wizard
  - `payload: { memberId, tier_mapped: "plus", benefits_count: 3, timestamp }`

- `event: "migration_cta_click"` — User clicks action CTA
  - `payload: { step: 1 | 2 | 3, cta: "continue" | "learn_more" | "next_benefits" | "get_started" | "go_home" }`

- `event: "migration_learn_more_click"` — User navigates to tier details from wizard
  - `payload: { step: 1, source: "learn_more_link" }`

**Pre-Launch Email Events**:

- `event: "migration_email_sent"` — Pre-launch email sent 7 days before launch
  - `payload: { memberId, tier_mapped, segment: "upgrade" | "same" | "downgrade", timestamp }`

- `event: "migration_email_opened"` — Member opens pre-launch email
  - `payload: { memberId, timestamp, time_to_open_hours }`

- `event: "migration_email_clicked"` — Member clicks link in email (learn more, FAQ, etc.)
  - `payload: { memberId, link_type: "learn_more" | "faq" | "contact", timestamp }`

- `event: "migration_email_modal_not_shown"` — Member completed migration via email link before first-login modal would show
  - `payload: { memberId, completed_via: "email_link", timestamp }`

---

## 13. Open Questions & Assumptions

1. **Legacy program structure**: Assumption — Credit union has legacy loyalty data (tier names, benefits, annual values) available for mapping. If not, use generic onboarding (show all tiers, no personalized mapping).

2. **Migration timing**: Assumption — Wizard triggered on first login post-launch; can be dismissed and re-accessed from Help. If credit union prefers mandatory viewing, remove skip/dismiss options.

3. **Tier downgrade handling**: Assumption — Most members will map to same or higher tier in new program. If member downgrades, UI handles with transparent explanation and benefit comparison highlighting net value (e.g., "Old benefit $50, new benefit $60").

4. **Benefit calculation precision**: Assumption — Real-dollar benefit values calculated using member's historical balance and transaction data. If insufficient history, use conservative estimates (e.g., "up to $60/year" instead of "$62.50/year").

5. **Multiple legacy tiers**: Assumption — Legacy program had multiple tiers (e.g., Silver, Gold, Platinum). New program has Classic, Plus, Premium with mapping table showing equivalences.

6. **Pre-launch email timing**: Assumption — Pre-launch email sent 7 days before scheduled migration launch. Email campaign must complete QA 2 weeks before launch. If email system unavailable, fallback is first-login modal (no email pre-communication).

7. **Post-migration retrogression risk**: Assumption — If member enters retrogression risk immediately after completing legacy migration (balance drops below tier minimum within 30 days of migration completion), wizard Story 2 detects and displays supportive message linking to retrogression alert. This prevents jarring experience of tier gain followed by tier loss notice.

---

## 14. Design Rationale

**UX Lead Perspective**:
- Wizard format reduces cognitive load by breaking complex migration story into three small steps (narrative → personal impact → benefit comparison).
- Automatic tier mapping and "you're already set" messaging removes anxiety about requalification.
- Three-column benefit comparison (keep/gain/lose) is transparent about any downgrades while highlighting net value gain.
- Real-dollar calculations build trust (members see concrete savings, not percentages).
- Skip option allows members who prefer email communication to skip wizard and complete migration education separately, respecting different learning styles.
- **Persona-specific messaging addresses core pain points**:
  - PERSONA-01 (change-averse): Word choice emphasizes "automatically" (no action needed), "continues" (no disruption), "you're already set" (no requalification). Checkmarks and green text provide visual reassurance.
  - PERSONA-03 (overwhelmed): Simplified language in Story 3 (max 3 benefits per column), progressive disclosure (link to full list), shorter paragraphs. Pre-launch email uses clear structure with tier mapping upfront.
  - PERSONA-04 (skeptical): Real-dollar values and transparency about downgrades. Benefit calculation methodology link addresses "how is this value calculated?" Downgrade messaging shows net value comparison.
- **Immediate retrogression risk detection**: If member is assigned Plus tier but balance is near minimum, Story 2 shows gentle warning + link, preventing harsh retrogression alert immediately after positive migration experience.

**Frontend Architect Perspective**:
- Server-renders member tier mapping and benefit comparison on initial load (zero client-side calculation).
- Client component manages wizard step state and transitions.
- Reuses TierBadge, BenefitCard components from prior shards.
- Tracks migration completion status in database (POST /complete endpoint) to suppress wizard on subsequent logins.
- localStorage backup tracks dismissed status locally in case sync fails.
- Responsive card-stacking approach works across all device sizes without complex media query logic.

**Product/Delivery Perspective**:
- Legacy Migration Onboarding is critical day-1 adoption blocker. First-impression design must reduce anxiety and build confidence (failure = high support volume, low engagement).
- Transparent benefit comparison (including any downgrades) addresses PERSONA-04 skepticism and positions credit union as trustworthy.
- FAQ link on each step ("Have questions?") drives self-service adoption and reduces support calls.
- Wizard completion tracked via telemetry; if >30% skip rate, indicates communication gap requiring follow-up email campaign or phone support scripting.

---

## 15. Cursor-Claude Ready Build Plan

### File Structure

```
app/loyalty/migration/
├── page.tsx                         # Server component, entry point
└── components/
    ├── MigrationWizardContainer.tsx # Wizard state management
    ├── ProgressIndicator.tsx        # Step indicator
    ├── Step1Welcome.tsx             # Narrative + graphics
    ├── Step2TierMapping.tsx         # Personal tier + qualifications
    ├── Step3Benefits.tsx            # Benefit comparison (keep/gain/lose)
    ├── CompletionScreen.tsx         # Success confirmation
    ├── ProgramComparisonGraphic.tsx # SVG: legacy → new program
    ├── QualificationExplainer.tsx   # Balance + autopay status
    └── BenefitComparisonCard.tsx    # Individual benefit card (keep/gain/lose)

lib/
├── api.ts                          # Add GET /member/:id/legacy-migration
└── types.ts                        # Add LegacyMigrationResponse type

tests/
├── migration.test.tsx              # Wizard flow (step progression, data loading)
├── benefit-comparison.test.tsx     # Benefit comparison logic (keep/gain/lose categorization)
└── integration/
    └── migration-flow.test.tsx     # Full wizard flow (start → complete)
```

### Mock Data Setup

Create `/lib/mock-data/migration.ts`:
```typescript
export const mockMigrationMembers = {
  "MEMBER-001": { /* migration data */ },
  "MEMBER-002": { /* migration data */ }
};
```

### Component Build Order

1. **ProgressIndicator** — Simple UI component, no dependencies
2. **ProgramComparisonGraphic** — Static SVG, no dependencies
3. **QualificationExplainer** — Display component, uses member data props
4. **BenefitComparisonCard** — Display component, reuses BenefitCard
5. **Step1Welcome, Step2TierMapping, Step3Benefits** — Content components
6. **CompletionScreen** — Final step component
7. **MigrationWizardContainer** — Orchestrator component (depends on all step components)
8. **page.tsx** — Entry point (depends on container)

### Test Stubs

```typescript
// migration.test.tsx
describe("Legacy Migration Wizard", () => {
  test("renders step 1 on initial load");
  test("advances from step 1 to step 2 on Continue");
  test("advances from step 2 to step 3 on Next");
  test("navigates to Loyalty Hub on Get Started");
  test("announces step change to screen readers");
  test("displays member's actual tier and qualifications");
  test("shows benefit comparison (keep/gain/lose)");
  test("allows skip on step 1");
  test("marks migration complete and suppresses wizard on next login");
});
```

### Key Decisions for Build

1. Use React Context (MemberContext) to access authenticated member data; no prop drilling
2. Wizard step state managed locally in MigrationWizardContainer (useState)
3. All real-dollar calculations happen server-side; component just displays values
4. Navigation (router.push) handled by CTA buttons, not internal step management
5. Accessibility: Use aria-live for step announcements; focus management on step change
6. Mobile-first responsive design: Card-stacking layout, 16pt base typography

