# Shard 16: Retrogression Alert / Prevention

**Build Priority**: P1
**Estimated Effort**: 18 hours
**Screen ID**: SCR-16
**Routes**: `/loyalty/retrogression` (standalone page) + modal/banner variants
**Component File**: `app/loyalty/retrogression/page.tsx` + `components/RetrogressionAlert.tsx`

---

## 1. Screen Name & Route

**Full Screen Name**: Retrogression Alert & Prevention Center
**URL Routes**:
- Standalone: `/loyalty/retrogression`
- Modal trigger: `?alert=retrogression&severity=30-day|14-day|final`
**Navigation Access**: Triggered proactively via in-app banner/notification | Loyalty Hub → "Tier at Risk" (if applicable) | Account Status Detail → "Learn about grace period"
**Page Title**: "Your Tier Is At Risk"
**Breadcrumb**: Home > Loyalty > Tier at Risk

**Route Parameters**:
- `severity: "30-day" | "14-day" | "final"` (alert level)
- `reason: "balance" | "autopay" | "both"` (which qualification is failing)
**Auth Requirements**: Authenticated member (redirect to login if not)

---

## 2. Purpose & Jobs-to-be-Done

**Primary Purpose**: Proactively alert members when they're at risk of losing their tier qualification due to declining balance, expiring/missing autopay, or both. Frame as supportive guidance ("you have time to act") not alarm ("you're losing benefits"). Show exactly what will be lost (real-dollar values), when (grace period countdown), and specific actions to maintain tier. This prevents silent tier drops and maintains member engagement, especially important for older demographic (PERSONA-01, PERSONA-03) who value stability and dislike surprises.

**Jobs-to-be-Done**:
1. **Understand tier-loss risk** — Member needs to know which qualification is failing and why
2. **Know consequences** — Member needs to see real-dollar value of benefits at risk, not abstract percentages
3. **See grace period** — Member needs to know they have time (30 days, 14 days, final notice) to take action
4. **Get actionable steps** — Member needs specific, easy-to-execute actions (e.g., "Add $1,500 to account" or "Activate autopay before [date]")
5. **Feel supported, not alarmed** — Tone must be "we're here to help you keep your benefits" not "you're failing"

---

## 3. User Stories & Acceptance Criteria

### Story 1: Member at 30-Day Warning Understands Balance Risk

**As a** member with declining balance (PERSONA-01)
**I want to** understand my balance is approaching the tier minimum
**So that** I can take action before losing my tier

**Given** my rolling balance is $500 below Plus tier minimum
**When** I view the 30-day retrogression alert
**Then** I see:
- Alert title: "Your Plus Tier is at Risk"
- Alert color/icon: Warning yellow (not urgent red); exclamation icon
- Qualification status: "Your balance is $500 below the Plus tier minimum ($10,000)"
- Current status: "Your rolling balance: $9,500 | Required: $10,000"
- Grace period: "You have 30 days to increase your balance. After 30 days, you'll drop to Classic tier (if balance remains below $10,000)"
- Benefits at risk: "You'll lose these Plus tier benefits:" → List with real-dollar annual values
  - "APY Boost: $21.75/year"
  - "Transfer Fee Waiver: $60/year"
  - "Partner Rewards: $8/year"
  - Total: "$89.75/year"
- Countdown timer: "Days to action: 28" (live count down as days pass)
- Actionable steps:
  - "Option 1: Add $500 to checking" → Link to Transfer Initiation
  - "Option 2: Set up an autopay (if you have <2)" → Link to Autopay Setup
- Success confirmation: "If you bring your balance to $10,000 by [date], your Plus tier will be maintained"
- Help link: "Why is my balance below the minimum?"

**And** tone is supportive; uses "you have time" framing, not "you're failing"

---

### Story 2: Member at 14-Day Warning Needs Urgent Action

**As a** member nearing grace period end (PERSONA-02)
**I want to** see urgent but still supportive messaging about impending tier loss
**So that** I prioritize action before benefits are lost

**Given** my retrogression grace period is 14 days away from ending
**When** I view the 14-day alert (in banner, modal, or dedicated page)
**Then** I see:
- Alert title: "Your Plus Tier Ends in 14 Days"
- Alert color/icon: Amber/orange (elevated urgency); warning icon
- Status: "Your balance is still $1,200 below Plus minimum. You have 14 days left."
- Grace period: "Tier change scheduled for [specific date]"
- Benefits loss preview: "You'll lose $89.75/year in Plus tier benefits"
- Breakdown: "Unless you increase your balance by $1,200 before [date]..."
- Specific action (required):
  - "Transfer $1,200 to your checking account now" → Link to Transfer Initiation (with pre-filled amount)
  - Or "Set up autopay to automatically maintain your balance" → Link to Autopay Setup
- Alternative actions:
  - "Contact us to discuss your options" → Link to support
- Impact message: "Your tier change is not automatic — you can prevent it by acting today"

**And** countdown timer shows exact days remaining; tone shifts from "supportive" to "time-sensitive but still helpful"

---

### Story 3: Member at Final Grace Period Sees Last-Chance Alert

**As a** member on the last day of grace period
**I want to** see final alert that my tier change is imminent
**So that** I understand consequences are real if I don't act

**Given** my grace period expires tomorrow
**When** I view the final alert (high-prominence banner, modal, notification)
**Then** I see:
- Alert title: "Your Plus Tier Ends Tomorrow"
- Alert color/icon: Red; urgent icon
- Status: "After today, your tier will change to Classic. Your balance: $8,800 | Plus minimum: $10,000"
- What changes tomorrow: "At midnight, you'll be moved to Classic tier"
- Benefits lost: "$89.75/year in Plus tier benefits will be removed"
- Last actions available:
  - "Deposit $1,200 right now" → Option to initiate transfer or visit branch
  - "Call us immediately" → Phone number with "Call" button
- If you wait: "Once your tier changes, it takes 30 days of maintaining Plus qualifications to move back up"
- Reassurance: "We're here to help. Reach out if you have questions or need help taking action"

**And** this alert appears on all screens (not just dedicated page); urgent but still empathetic tone

---

### Story 4: Member Completes Recovery Action and Sees Confirmation

**As a** member who takes action to maintain their tier
**I want to** see confirmation their action will prevent tier loss
**So that** I have peace of mind my tier is secured

**Given** I complete a transfer or add an autopay from the retrogression alert
**When** the action is confirmed
**Then** I see:
- Success message: "Great! Your action will help maintain your Plus tier."
- Confirmation details: "You transferred $1,500 to your checking account. Your new balance: $11,300."
- Grace period impact: "This brings you above the Plus tier minimum ($10,000). Your Plus tier is now secure."
- Next steps: "Your tier qualification will be recalculated in 3-5 business days. You'll receive confirmation when it's complete."
- Optional: "View your tier details" → Link to Tier Details page
- Dismiss: "Got it" button

**And** telemetry tracks successful recovery action for product analytics

---

## 4. States

### Default State (30-Day Alert)
- Alert displayed (banner on home/loyalty hub, or dedicated page)
- Tier at risk clearly identified
- Qualification gap quantified ($500 below minimum, e.g.)
- Benefits value shown with real-dollar amounts
- Grace period countdown active
- Action CTAs prominent and easy to execute
- Support link visible

### Loading State
- Skeleton for benefit value calculation
- Placeholder for grace period countdown
- Placeholder for current balance/autopay count

### Error State
- If balance data unavailable: "Unable to load your account information. Please try again or contact support."
- If grace period calculation fails: "We're unable to confirm your tier status. Please call us for help."

### No Alert State
- Member's tier is secure (not at risk)
- Small preventive message: "Your Plus tier is secure. You're $2,500+ above the minimum balance."
- Link to Account Status Detail for member's specific qualification data

### Offline State
- Banner: "Alert information may not be current. Please reconnect to confirm your tier status."
- Allow basic alert display; mark values as pending update

### Completed State (Post-Recovery)
- Success confirmation screen
- Alert dismissed from home/hub (but still accessible from Account Status Detail)
- Confirmation email sent to member

---

## 5. Information Architecture

### Context 1: Standalone Page (`/loyalty/retrogression`)

**Visual Regions (Top to Bottom)**:

**Header Region**:
- Alert title (24pt Bold, color-coded by severity): "Your Plus Tier is at Risk" (30-day) | "Your Plus Tier Ends in 14 Days" (14-day) | "Your Plus Tier Ends Tomorrow" (final)
- Alert icon (warning, exclamation, or alarm based on severity)
- Breadcrumb: Home > Loyalty > Tier at Risk

**Status Section**:
- Current tier badge (with color, 100×100px)
- Qualification status: "Balance: $9,500 | Required: $10,000 | Gap: $500"
- Grace period countdown: "Days remaining: 28" or "Days remaining: 1" (prominent, 24pt for visibility)

**Benefits at Risk Section**:
- Heading: "You'll Lose These Benefits"
- Full list of benefits with annual values:
  - APY Boost: $21.75/year ✓
  - Transfer Fee Waiver: $60/year ✓
  - Partner Rewards: $8/year ✓
  - (Show all benefits, not shortened)
- Total: "$89.75/year at risk" (prominent, in green for readability)

**Action Section**:
- Heading: "What You Can Do"
- Primary action (specific to failure reason):
  - If balance: "Transfer $[amount] to your account" → CTA button (primary color, full width on mobile)
  - If autopay: "Add autopay before [date]" → CTA button
  - If both: Show both options (radio buttons for member to select)
- Secondary action: "Call us for options" → Phone button (secondary styling)
- Specific deadline: "Action required by: [specific date at 11:59 PM]" (red text, bold)

**Grace Period Explanation** (expandable):
- Heading: "How much time do I have?"
- Timeline: "Today (Day 0) → [X] days later → Your tier changes to Classic"
- Explanation: "Once your tier changes, it takes 30 days of maintaining Plus qualifications to move back up"

**Support Footer**:
- FAQ link: "Why is my balance below the minimum?" (blue text, underlined)
- Phone number: "Call [number] to discuss options"
- Chat link: "Start a chat with support"

---

### Context 2: Banner Variant (Home/Hub/Banking Screens)

**Visual appearance**:
- Fixed-position bar at top of page (below main navigation, above content)
- Severity color background (amber #F59E0B for 30-day, orange #FF9500 for 14-day, red #EF4444 for final)
- Height: 60px desktop, 48px mobile
- Full-width with responsive padding (20px desktop, 16px mobile)

**Content layout**:
- Left side: Icon + title + countdown (flex, aligned left)
  - Icon: Warning/exclamation (24px)
  - Title: "Your Plus Tier is at Risk" (16pt Bold) or "Ends in 14 Days" (condensed)
  - Countdown: "14 days left" (14pt Regular, gray text within colored background)
- Right side: Action CTA button
  - Button text: "See Details" (14pt, white text, primary action button)
  - Click → Navigate to `/loyalty/retrogression`
  - Close button (X): Dark gray, 48px touch target, right-aligned

**Desktop appearance**:
- Full-width sticky bar
- Title and countdown on one line (flex row)
- Banner stays visible as user scrolls
- Shows on: Home dashboard, Loyalty Hub, Account Summary page, Transfer flow

**Mobile appearance**:
- Full-width, adapt height as needed
- Title and countdown may stack on separate lines if space constrained
- Close button always visible
- Swipe to dismiss: Optional (nice-to-have, allow 24hr re-show)

**Dismissal behavior**:
- Click X → Dismiss banner (remove from view)
- localStorage: Store `lastRetrogressionBannerDismissed: timestamp`
- Re-show logic: After 24 hours, banner reappears on page reload or navigation
- If severity escalates (30-day → 14-day), banner always shows on next page load

---

### Context 3: Modal Variant (Contextual Trigger During Actions)

**Visual appearance** (covered above in Components section):
- Centered modal overlay
- Responsive width: 90vw (mobile), 500px (tablet), 600px (desktop)
- Max-height: 70vh with scrollable content
- Condensed content (not full page detail)

**Trigger conditions**:
- When user navigates to `/autopay/add` and is at-risk → Show modal before form
- When user navigates to `/transfer` and is at-risk → Show modal before form
- On Account Summary page load if at-risk → Show modal once per day
- On Loyalty Hub load if at-risk and no modal shown today → Show once per session

**Content variation by context**:
- **During autopay flow**: "Complete this autopay to help maintain your Plus tier" (contextual messaging)
- **During transfer flow**: "Complete this transfer to recover your Plus tier" (contextual messaging)
- **On Account Summary**: "Your tier is at risk. Take action today." (generic)

**Interaction**:
- User can close modal and continue with original action (modal doesn't block flow)
- Primary CTA in modal: "Transfer" or "Add Autopay" (context-specific)
- Dismiss: Close modal, remember preference for 24 hours
- If user completes recovery action, modal doesn't re-show on same session

---

## 5b. Alert Display Summary Table

| Context | Trigger | Content Level | Dismissal | Re-show Rules | Pages |
|---------|---------|---------------|-----------|---------------|-------|
| **Standalone Page** | Direct navigation to `/retrogression` | Full (all benefits, full grace period explainer) | N/A | Always shows when navigating to page | `/loyalty/retrogression` only |
| **Banner** | Member at-risk on specific pages | Condensed (title + countdown + see details CTA) | X button → dismiss 24hrs | Reappears after 24hrs or on severity escalation | Home, Hub, Account Summary, Transfer |
| **Modal** | Member at-risk on form pages | Condensed (status + top 2 benefits + primary action) | Close/Dismiss button → dismiss 24hrs | Reappears next day or if severity escalates | Autopay, Transfer, Account Summary, Loyalty Hub |

---

## 6. Components & Responsibilities

### Component Tree

```
Page (app/loyalty/retrogression/page.tsx) — Server Component
├── RetrogressionAlertContainer (Client)
│   ├── AlertHeader
│   │   ├── Title (dynamic based on severity)
│   │   └── Icon (warning/exclamation/alarm)
│   ├── StatusSection
│   │   ├── TierBadge (at-risk tier)
│   │   ├── QualificationStatus
│   │   │   ├── Current balance/autopay
│   │   │   ├── Required minimum
│   │   │   └── Gap calculation
│   │   └── CountdownTimer
│   │       └── "Days remaining: [X]"
│   ├── BenefitsAtRiskSection
│   │   ├── Heading
│   │   ├── BenefitsList
│   │   │   └── BenefitCard × 3 (APY, fee waiver, rewards)
│   │   └── TotalAnnualValue
│   ├── ActionSection
│   │   ├── Heading
│   │   ├── PrimaryAction
│   │   │   ├── "Transfer $500" button (if balance issue)
│   │   │   └── "Add Autopay" button (if autopay issue)
│   │   ├── SecondaryAction
│   │   │   └── "Call us" button
│   │   └── Deadline text
│   ├── GracePeriodExplainer (expandable)
│   │   ├── Timeline visualization
│   │   └── What happens if no action
│   └── SupportFooter
│       ├── FAQ link
│       └── Phone number
```

### Variant 1: Banner Alert (appears on home, hub, and other banking screens)

```
RetrogressionAlertBanner (Client)
├── AlertBar (sticky at top of page, position: fixed or sticky)
│   ├── Severity color background (amber/orange/red per severity)
│   ├── Icon (warning/exclamation based on severity)
│   ├── Content region (flex layout)
│   │   ├── Title: "Your [Tier] Tier is at Risk" (16pt Bold)
│   │   ├── Countdown: "14 days left" (14pt Regular, slightly smaller than title)
│   │   └── [Responsive: title and countdown stack on mobile]
│   └── Action button: "See Details" (primary CTA, 14pt)
│       └── Click → Navigates to `/loyalty/retrogression` (full page)
│
├── Desktop behavior:
│   ├── Banner height: 60px (fits comfortably in header)
│   ├── Width: Full width, stays sticky as user scrolls
│   ├── Close button (X): Visible, dismissal tracked
│   ├── Re-show logic: After 24hrs dismissal expires, banner reappears automatically
│   └── Shows on pages: Home dashboard, Loyalty Hub main page, Account Summary, Transfer flow
│
└── Mobile behavior:
    ├── Banner height: 48px (smaller for mobile)
    ├── Title shortened: "Your Tier is at Risk" (remove tier name if space constrained)
    ├── Countdown visible but smaller (12pt)
    ├── CTA button adapts: Either "Details" (short) or full "See Details" depending on space
    └── First view: Show full banner; on second scroll/view, allow collapse to compact badge
```

### Variant 2: Modal Alert (triggered contextually during banking actions)

```
RetrogressionAlertModal (Client) — Position: absolute or dialog element
├── Modal overlay (semi-transparent dark background, 70% opacity)
├── Modal card (centered, responsive width: mobile 90vw, tablet 500px, desktop 600px)
│
│   ├── Modal header (20px padding, border-bottom light gray)
│   │   ├── Title: "Your [Tier] Tier is at Risk" (18pt Bold)
│   │   ├── Severity icon (warning/exclamation)
│   │   └── Close button (X): Top-right corner, 48px touch target
│   │
│   ├── Modal body (24px padding, max-height 70vh with scroll if needed)
│   │   ├── Severity-condensed content:
│   │   │   ├── Status section (what's at risk):
│   │   │   │   └── "Your balance: $9,500 | Required: $10,000 | Gap: $500"
│   │   │   ├── Countdown: "Days remaining: 28"
│   │   │   ├── Benefits summary: "You'll lose $89.75/year in benefits"
│   │   │   │   └── (List shortened to top 2–3 benefits only; link to full details)
│   │   │   └── Recovery action: Primary action only (no secondary options in modal)
│   │   │       └── "Transfer $500" button (16pt, 48px height)
│   │   │
│   │   └── Grace period explainer: HIDDEN by default (saves space)
│   │       ├── Expandable section: "How much time do I have?" (link styled, blue text)
│   │       └── On expand: Show timeline + deadline date
│   │
│   ├── Modal footer (24px padding, border-top light gray)
│   │   ├── Primary action: "Transfer $500" button (full width, primary color)
│   │   ├── Secondary action: "Contact Us" link (left-aligned, secondary text color)
│   │   └── Tertiary action: "Dismiss" link (left-aligned, gray text, smallest)
│   │
│   └── Responsive behavior:
│       ├── Mobile: Full-screen modal (100% width, max-height 100vh)
│       ├── Tablet: 500px width, centered
│       └── Desktop: 600px width, centered (max 80% of viewport height)

Modal trigger conditions:
├── Triggered on navigation to specific screens (not intrusive):
│   ├── `/autopay/add` — Shows if member at-risk and adding autopay (context: "Complete this autopay to maintain tier")
│   ├── `/transfer` — Shows if member at-risk and initiating transfer (context: "Complete this transfer to recover tier")
│   ├── Account Summary page — Shows once per day if at-risk (prominent but not blocking)
│   └── Loyalty Hub — Shows once per session if at-risk (at top of page before benefits)
│
├── NOT triggered on:
│   ├── Marketing pages, Help center, Settings (avoid modal fatigue)
│   └── During checkout or critical transactions (let user complete action first)
│
├── Dismissal behavior:
│   ├── Click X, "Dismiss", or click outside modal → Close modal (not permanently hidden)
│   ├── localStorage flag: `lastRetrogressionModalDismissed: timestamp`
│   ├── Re-show logic: After 24 hours, modal can show again on eligible pages
│   └── If severity escalates (30-day → 14-day), modal always shows on next eligible page
│
└── Interaction with flow:
    ├── If user on `/autopay/add` page and modal shows:
    │   ├── Modal overlays autopay form (not blocking, can still see form behind)
    │   ├── Primary CTA "Transfer" navigates to `/transfer` in new tab/window (allows user to complete original action later)
    │   └── OR primary CTA: "Add this autopay to recover tier" (if autopay alone sufficient to recover)
    │
    └── If user closes modal and returns to `/autopay/add`:
        └── Form remains in state (not reset), allowing user to continue after closing modal
```

### Component Responsibilities

**RetrogressionAlertContainer**:
- Props: `memberId`, `severity: "30-day" | "14-day" | "final"`, `reason: "balance" | "autopay" | "both"`
- Responsibility: Fetch member's retrogression data, render appropriate alert level
- State: `memberData`, `isLoading`, `error`
- Accessibility: `role="alert"` or `role="region"`, `aria-live="polite"`

**CountdownTimer**:
- Props: `endDate: ISO string`
- Responsibility: Display days remaining; update in real-time
- Accessibility: `aria-label="[X] days remaining until your tier changes"`

**QualificationStatus**:
- Props: `current: number`, `required: number`, `metric: "balance" | "autopay"`
- Responsibility: Display clear gap (e.g., "$500 below minimum")
- Accessibility: Semantic structure, clear numeric labels

**BenefitsAtRiskSection**:
- Props: `benefits: BenefitData[]`
- Responsibility: List benefits with annual values, show total
- Accessibility: Semantic list, value clearly stated for each benefit

**PrimaryAction**:
- Props: `reason: "balance" | "autopay"`, `gap: number`, `deadline: string`
- Responsibility: Render contextual CTA (Transfer or Autopay setup)
- Accessibility: Button with clear action text, focus visible

---

## 7. Interactions

### Alert Dismissal

- **Click X or "Dismiss"**: Dismiss banner/modal but continue showing reminder (not permanently hidden)
- **Interaction**: localStorage flag tracks last dismissal; re-show if not dismissed in 24 hours or severity escalates

### Action CTAs

- **Click "Transfer $500"**: Navigate to `/transfer?amount=500&source=retrogression`
- **Click "Add Autopay"**: Navigate to `/autopay/add?source=retrogression`
- **Click "Call us"**: Initiate phone call (href="tel:+1-800-CREDIT1")

### Countdown Timer

- **Real-time update**: Client-side countdown updates every minute; re-fetch grace period from server once daily to sync
- **Severity escalation**: If countdown reaches 14 days, re-render alert at higher severity level

### Expandable Grace Period Section

- **Click to expand**: Show timeline and consequences
- **Accessibility**: `aria-expanded="true/false"`

### Support Links

- **Click "Why is my balance below minimum?"**: Open FAQ (search results for "balance requirement")
- **Click "Call us"**: Phone button (opens tel: link)

---

## 8. Data Contracts

### GET /api/member/:memberId/retrogression-status

**Response**:
```json
{
  "memberId": "MEMBER-001",
  "isAtRisk": true,
  "severity": "30-day",
  "currentTier": "plus",
  "riskReason": "balance",
  "qualificationStatus": {
    "balanceQualified": false,
    "autopayQualified": true,
    "currentBalance": 9500,
    "requiredBalance": 10000,
    "balanceGap": -500,
    "currentAutopayCount": 2,
    "requiredAutopayCount": 2
  },
  "gracePeriod": {
    "startDate": "2026-02-10",
    "endDate": "2026-03-12",
    "daysRemaining": 28,
    "qualificationLossDate": "2026-03-13"
  },
  "benefitsAtRisk": [
    {
      "benefitId": "apy-boost-plus",
      "name": "APY Boost",
      "annualValue": 21.75,
      "description": "Earn +0.15% on savings"
    },
    {
      "benefitId": "fee-waiver-transfer",
      "name": "Transfer Fee Waiver",
      "annualValue": 60,
      "description": "Unlimited transfers with zero fee"
    }
  ],
  "totalAnnualValueAtRisk": 89.75,
  "recoveryActions": [
    {
      "action": "transfer",
      "amountNeeded": 500,
      "description": "Transfer $500 to your checking account"
    },
    {
      "action": "autopay",
      "slotsAvailable": 0,
      "description": "You already have 2 autopays (sufficient for Plus)"
    }
  ],
  "lastNotificationDate": "2026-02-14",
  "hasNotificationConsent": true
}
```

### TypeScript Service Facade

```typescript
export async function getRetrogressionStatus(
  memberId: string
): Promise<RetrogressionStatusResponse> {
  const response = await fetch(`/api/member/${memberId}/retrogression-status`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });
  if (!response.ok) throw new Error("Failed to fetch retrogression status");
  return response.json();
}

export async function markRetrogressionNotificationRead(
  memberId: string
): Promise<void> {
  await fetch(`/api/member/${memberId}/retrogression-status/acknowledged`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });
}

interface RetrogressionStatusResponse {
  memberId: string;
  isAtRisk: boolean;
  severity: "30-day" | "14-day" | "final";
  currentTier: "classic" | "plus" | "premium";
  riskReason: "balance" | "autopay" | "both";
  qualificationStatus: QualificationStatus;
  gracePeriod: GracePeriodData;
  benefitsAtRisk: BenefitData[];
  totalAnnualValueAtRisk: number;
  recoveryActions: RecoveryAction[];
}
```

### Mock Data

```typescript
const mockRetrogressionStatuses = {
  "MEMBER-001": {
    memberId: "MEMBER-001",
    isAtRisk: true,
    severity: "30-day",
    currentTier: "plus",
    riskReason: "balance",
    qualificationStatus: {
      balanceQualified: false,
      autopayQualified: true,
      currentBalance: 9500,
      requiredBalance: 10000,
      balanceGap: -500,
      currentAutopayCount: 2,
      requiredAutopayCount: 2
    },
    gracePeriod: {
      startDate: "2026-02-10",
      endDate: "2026-03-12",
      daysRemaining: 28,
      qualificationLossDate: "2026-03-13"
    },
    benefitsAtRisk: [
      {
        benefitId: "apy-boost-plus",
        name: "APY Boost",
        annualValue: 21.75,
        description: "Earn +0.15% on savings"
      },
      {
        benefitId: "fee-waiver-transfer",
        name: "Transfer Fee Waiver",
        annualValue: 60,
        description: "Unlimited transfers with zero fee"
      }
    ],
    totalAnnualValueAtRisk: 89.75,
    recoveryActions: [
      {
        action: "transfer",
        amountNeeded: 500,
        description: "Transfer $500 to your checking account"
      }
    ]
  }
};
```

---

## 9. Validation Rules

- Grace period calculation must be accurate (based on date member lost qualification, not current date)
- Benefit values must match those displayed on Tier Details page (single source of truth)
- Countdown timer must update in real-time (no stale "days remaining")
- Recovery action amounts must be specific and actionable (e.g., "Transfer $500" not "Add some money")
- Severity escalation logic: 30-day → 14-day → final (no skipping levels)
- All messaging must be transparent and supportive (never accusatory or alarming tone)

---

## 10. Visual & Responsive Rules

### Design Tokens

**Colors**:
- 30-day alert: Amber/yellow (#F59E0B) background at 10% opacity, amber border
- 14-day alert: Orange (#FF9500) background at 10% opacity, orange border
- Final alert: Red (#EF4444) background at 10% opacity, red border
- Benefits value: Green (#10B981) for positive framing of "at risk"
- Text: Dark gray (#1F2937) for clarity

**Typography**:
- Alert title: 20pt Bold
- Status text: 16pt Regular
- Benefit names: 16pt Bold
- Values: 16pt Bold (green)
- Countdown: 24pt Bold (time-sensitive)
- Labels: 14pt Regular

**Spacing**:
- Alert padding: 24px (desktop), 16px (mobile)
- Section spacing: 20px between sections
- Button spacing: 12px between buttons
- List item spacing: 12px

### Responsive Breakpoints

**Mobile (< 768px)**:
- Full-width alert
- Stacked action buttons (primary on top)
- Countdown large (24pt) for visibility
- Benefits list single-column
- No sidebar (if applicable)

**Tablet (768px – 1024px)**:
- Centered alert (max-width 600px)
- Side-by-side action buttons
- Countdown prominent
- Two-column benefits layout

**Desktop (> 1024px)**:
- Centered container (max-width 900px)
- Full layout with optional sidebar (Account Status Detail)
- Countdown as prominent element
- Three-column benefits if space allows

---

## 11. Accessibility Checklist

- **Alert role**: `role="alert"` for high-priority alerts; `role="region"` for informational alerts
- **Countdown timer**: `aria-live="polite"`, `aria-label="28 days remaining until your tier changes"`
- **Color contrast**: 7:1 for all text; don't rely on color alone to convey urgency
- **Icon + text**: Icons accompanied by text (e.g., warning icon + "Your tier is at risk")
- **Button text**: Clear, action-oriented (e.g., "Transfer $500", not just "Action")
- **Focus visible**: 2px outline on all buttons/links, 2px offset
- **Touch targets**: 48×48px minimum for buttons
- **Expandable sections**: `aria-expanded="true/false"` on expand button
- **List structure**: Semantic `<ul>/<li>` for benefits list
- **Language**: Plain English, 16pt minimum, define financial terms

---

## 12. Telemetry

**Event Tracking**:

- `event: "retrogression_alert_view"` — User sees alert
  - `payload: { severity: "30-day" | "14-day" | "final", memberId, tier_at_risk: "plus", reason: "balance" }`

- `event: "retrogression_alert_dismissed"` — User dismisses banner/modal
  - `payload: { severity, memberId, timestamp }`

- `event: "retrogression_action_initiated"` — User clicks action CTA
  - `payload: { action: "transfer" | "autopay", memberId, severity }`

- `event: "retrogression_action_completed"` — User completes recovery action
  - `payload: { action: "transfer" | "autopay", memberId, severity, amount_transferred, new_balance }`

- `event: "retrogression_support_contacted"` — User clicks "Call us"
  - `payload: { memberId, severity, reason_contacted: "retrogression" }`

- `event: "retrogression_severity_escalated"` — Alert escalates from 30-day to 14-day
  - `payload: { memberId, old_severity: "30-day", new_severity: "14-day" }`

- `event: "retrogression_alert_expires_without_escalation"` — Member completes full grace period without escalating or recovering
  - `payload: { memberId, severity_started: "30-day", duration_full_grace_period: 30, action_count: 0 }`
  - **Note**: Tracks members who actively maintained their tier throughout grace period (success case); used for calculating retention/success rate

---

## 13. Open Questions & Assumptions

1. **Grace period trigger and mechanics**:
   - **Assumption**: Grace period triggered when member's rolling balance drops below minimum (based on last-day-of-month snapshot) OR autopay count drops below requirement.
   - **Grace period length**: Fixed 30 days from date qualification lapsed (not end-of-month, not tier-specific)
   - **Example**: If member's balance falls below $10,000 on Feb 10, grace period runs Feb 10 → Mar 12 (30 days)
   - **Qualification recalculation**: Member's qualification status rechecked daily; if member recovers before grace period ends, tier maintained; if grace period expires without recovery, tier changes at next daily recalculation

2. **Notification channels**: Assumption — Alert shown in-app (banner/modal/page) and via email/SMS (if opted in). UX spec covers in-app only; email/SMS handled by notification system (Shard 17).

3. **Tier recovery**: Assumption — If member recovers (e.g., adds $500), tier is maintained. If member loses qualification again within 30 days of recovery, new grace period starts (not extending old one).

4. **Multiple failure scenarios** (both balance AND autopay failing):
   - **Single alert behavior**: Show single alert with both failures listed
   - **Example messaging**: "Your balance is $500 below minimum AND you have 0 autopays (need 2). Take action on either requirement to maintain tier."
   - **Recovery paths**: Primary CTA focuses on easiest recovery path (e.g., if balance near minimum, show "Transfer $500" first; if autopay count near requirement, show "Add 2 autopays")
   - **Severity escalation**: If both failing, severity level escalates by 1 tier (30-day → 14-day, 14-day → final). Rationale: member has multiple vulnerabilities, higher urgency.
   - **Separate alerts**: Do NOT show separate "Balance Alert" and "Autopay Alert" (reduces confusion). Consolidate into single alert with sub-actions.

5. **Offline behavior**: Assumption — Members can see alert offline, but grace period countdown shows "pending update" until reconnected (to prevent inaccurate countdown). Banner still visible with last-known countdown.

6. **Member benefit value consistency**: Assumption — Benefit values shown in retrogression alert match those displayed in Tier Details page (Shard 14). Both use same calculation method (server-side, based on member's actual balance + transaction history). If member sees different values, bug needs investigation.

---

## 14. Design Rationale

**UX Lead Perspective**:
- Alert severity escalation (yellow → orange → red) provides visual urgency without alarming older demographic.
- Real-dollar benefit values make consequences tangible (members see "$89.75/year at risk", not abstract "APY boost").
- Specific, actionable steps (e.g., "Transfer $500" not "Add money") reduce member friction and increase recovery rate.
- Supportive tone ("you have time to act") vs. alarming tone ("you're losing benefits") improves member perception of credit union as helpful, not punitive.
- Countdown timer creates gentle urgency without manipulation; transparent deadline shows member exactly how much time remains.

**Frontend Architect Perspective**:
- Alert displays as banner (home/hub), dedicated page, and modal (contextual). Components reuse across contexts using props for severity/reason.
- CountdownTimer component updates client-side (no server polling); re-syncs with server once daily for accuracy.
- Real-dollar calculations happen server-side; component only displays values.
- Retrogression check runs nightly (batch process) or on-demand (API call) to identify at-risk members.
- Modal variant allows alert to surface in banking flows (e.g., during autopay setup) without breaking user flow.

**Product/Delivery Perspective**:
- Retrogression prevention is critical to loyalty program success metric: "90%+ autopay persistence, 35% lower attrition vs. baseline."
- Proactive alerts prevent silent tier drops (members don't discover tier loss until month later, damaging trust).
- Recovery action tracking (telemetry) shows conversion rate (% who take action before grace period ends); target: 60%+.
- If recovery action rate < 40%, indicates messaging gap; product team may need to increase email cadence or phone support outreach.
- Alert tone and design A/B tested with older demographic (55+, 65+, 75+) to ensure supportive framing resonates.

---

## 15. Cursor-Claude Ready Build Plan

### File Structure

```
app/loyalty/retrogression/
├── page.tsx                         # Standalone retrogression page
└── components/
    ├── RetrogressionAlertContainer.tsx # Main logic
    ├── AlertHeader.tsx              # Title + icon
    ├── StatusSection.tsx            # Balance/autopay status
    ├── CountdownTimer.tsx           # Days remaining
    ├── BenefitsAtRiskSection.tsx    # Benefit list + total
    ├── ActionSection.tsx            # Recovery actions
    ├── GracePeriodExplainer.tsx     # Timeline + explanation
    ├── RetrogressionAlertBanner.tsx # Home/hub banner variant
    └── RetrogressionAlertModal.tsx  # Modal variant

components/loyalty/
├── RetrogressionAlert.tsx           # Reusable alert (exported for other contexts)

lib/
├── api.ts                          # Add GET /member/:id/retrogression-status
└── types.ts                        # Add RetrogressionStatusResponse

tests/
├── retrogression.test.tsx          # Alert render, countdown, severity levels
├── recovery-action.test.tsx        # Recovery action logic (transfer, autopay)
└── integration/
    └── retrogression-flow.test.tsx # Full flow (alert → action → confirmation)
```

### Mock Data Setup

Create `/lib/mock-data/retrogression.ts`:
```typescript
export const mockRetrogressionStatuses = {
  "MEMBER-001": { /* 30-day balance alert */ },
  "MEMBER-002": { /* 14-day autopay alert */ },
  "MEMBER-003": { /* final notice */ }
};
```

### Component Build Order

1. **CountdownTimer** — Pure display component, independent
2. **AlertHeader** — Simple text/icon component
3. **QualificationStatus** — Display component with props
4. **BenefitsAtRiskSection** — List component, reuses BenefitCard
5. **ActionSection** — Button group with CTAs
6. **GracePeriodExplainer** — Expandable section component
7. **RetrogressionAlertContainer** — Orchestrator (composes all above)
8. **RetrogressionAlertBanner, RetrogressionAlertModal** — Variants
9. **page.tsx** — Standalone page entry point

### Test Stubs

```typescript
// retrogression.test.tsx
describe("Retrogression Alert", () => {
  test("renders 30-day alert with correct severity color");
  test("displays benefits at risk with real-dollar values");
  test("countdown timer updates in real-time");
  test("escalates from 30-day to 14-day severity when 14 days remain");
  test("displays correct recovery action (transfer vs. autopay)");
  test("navigates to transfer flow on primary CTA");
  test("tracks alert dismissal in telemetry");
});

describe("Recovery Action", () => {
  test("marks retrogression as acknowledged after action");
  test("recalculates tier qualification after transfer");
  test("shows success confirmation with new balance");
});
```

### Key Decisions for Build

1. Alert severity determined by `daysRemaining` calculation (server-side); UI re-renders as countdown approaches thresholds
2. CountdownTimer updates client-side but re-syncs with server daily (prevents stale data)
3. Recovery actions pre-populate transfer/autopay flows with amount/reason (utm-style tracking)
4. Tone controlled via copy variants per severity level (supportive → time-sensitive → urgent)
5. Modal variant allows contextual display (e.g., "Your tier is at risk — add autopay now" during autopay setup)
6. Telemetry tracks recovery action conversion rate for product success metrics
