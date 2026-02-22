# Shard 14: Autopay Removal Warning

**Build Priority**: P1 — Critical retrogression prevention feature
**Estimated Effort**: 10 hours
**Screen ID**: SCR-14
**Route**: `/autopay/[id]/remove`
**Component File**: `app/autopay/[id]/remove/page.tsx`

---

## 1. Screen Name & Route

**Full Screen Name**: Autopay Removal Confirmation with Retrogression Warning
**URL Route**: `/autopay/[id]/remove`
**Navigation Access**: Autopay Management List → "Remove" button, or Autopay Edit → "Remove This Autopay" link
**Page Title**: "Remove Autopay"
**Breadcrumb**: Home > Autopay > Remove
**Auth Requirements**: Authenticated member with ownership of autopay
**Route Parameter**: `id` — Autopay ID (e.g., "AP-001")

---

## 2. Purpose & Jobs-to-be-Done

**Primary Purpose**: Confirmation screen that clearly explains retrogression risk (if applicable) before member removes autopay. Must use supportive tone to prevent impulsive removal of tier-critical autopays while still respecting member's agency to remove if they choose. Show tangible benefits that will be lost and clear recovery path.

**Jobs-to-be-Done**:
1. **Confirm removal decision** — Member has decided to remove and needs final confirmation
2. **Understand retrogression impact** — Member must understand what tier they'll drop to and what benefits they'll lose
3. **Consider pause alternative** — Member should understand pause is available if they want temporary reprieve without losing tier
4. **Know recovery path** — Member should understand how to re-add autopay or recover their tier if they change mind

**Design Principle Applied**: "Supportive Framing" — Use "Help you maintain" tone, not "You're losing"; "Loss-Aversion Psychology Management" — Show concrete benefits lost to clarify stakes; "Agency & Control" — Respect member's choice while offering alternatives.

---

## 3. User Stories & Acceptance Criteria

### Story 1: Member Removes Autopay That Doesn't Impact Their Tier

**As a** member (PERSONA-01, PERSONA-02)
**I want to** remove an autopay that's not required for my tier
**So that** I can cancel a payment I no longer need

**Given** I'm removing an autopay that doesn't contribute to my current tier qualification
**When** I arrive at `/autopay/[id]/remove`
**Then** I see:
- Page heading: "Remove Autopay"
- Autopay summary: Name (e.g., "Rewards Card — $300/month"), status, next payment date
- Confirmation message: "This autopay is not required for your Plus tier, so removing it won't affect your tier status."
- Simple action buttons:
  - Primary CTA: "Remove Autopay" (red/destructive color)
  - Secondary: "Cancel" or "Keep Autopay" (neutral)
- Support link: "Questions?" → Help page

**And** the tone is straightforward without warning fatigue

---

### Story 2: Member Removes Autopay That Will Cause Tier Retrogression

**As a** Plus tier member (PERSONA-02)
**I want to** remove an autopay I've decided I don't need
**So that** I stop this payment

**Given** I'm removing an autopay that's required to maintain my Plus tier
**When** I arrive at `/autopay/[id]/remove`
**Then** I see:
- **Prominent Retrogression Warning** (yellow/warning background):
  - Alert icon (not alarming)
  - Title: "Removing This Autopay Will Drop You to Classic Tier"
  - Explanation: "Your Plus tier requires 2 autopays. Removing this one will leave you with 1, which is only enough for Classic tier."
  - Benefits lost section:
    - Icon + benefit name: "APY Boost: You'll lose +0.25% interest"
    - Dollar impact: "$58/year on your $23,500 balance"
    - Icon + benefit name: "Fee Waiver: You'll lose fee-free transfers"
    - Dollar impact: "$60/year (estimated)"
    - Total annual loss: "$118/year"
  - Recovery path: "You can restore your tier by adding another autopay or increasing your balance to $10,000."
- Action buttons:
  - Primary CTA: "Continue Removal" (red/destructive color, requires deliberate action)
  - Alternative CTA: "Keep Autopay and Pause Instead" (blue/secondary) → Date selector to pause duration
  - Tertiary: "Cancel and Go Back" (neutral)
- Support link: "Contact support if you need help" → Help page

**And** the warning is serious but not alarming; tone is supportive, not punitive

---

### Story 3: Member Pauses Autopay Instead of Removing

**As a** member at retrogression risk (PERSONA-02)
**I want to** temporarily pause an autopay without losing my tier
**So that** I get a break without the consequences of removal

**Given** I'm on the removal confirmation page and see the "Pause Instead" option
**When** I click "Keep Autopay and Pause Instead"
**Then** I see:
- Modal or new form section: "Pause Autopay"
- Message: "Your tier will remain active while paused. Autopay will resume on your selected date."
- Date selector: "Resume autopay on [date picker]"
- Suggested durations: "Until [1 month from now]", "[3 months from now]", "[6 months from now]"
- Action buttons:
  - "Confirm Pause" (blue/primary)
  - "Cancel and Return to Removal" (neutral)
- After confirmation: Success message: "Autopay paused until [date]. Your Plus tier remains active."
- CTA: "Return to Autopay List" or "View Tier Status"

**And** pausing is framed as a smart alternative to removal

---

### Story 4: Member Confirms Removal After Understanding Impact

**As a** member (PERSONA-02, PERSONA-04)
**I want to** remove an autopay despite tier consequences
**So that** I can make my own financial decision

**Given** I've reviewed the retrogression warning and understand the consequences
**When** I click "Continue Removal"
**Then** the system:
- Disables button, shows loading spinner
- "Removing autopay..." message
- Submits removal request to backend
- On success: Navigate to success confirmation page with:
  - Checkmark icon
  - "Autopay Removed" message
  - Tier change notification: "Your tier has changed to Classic. Here's what you lost:"
  - Benefits summary: List of lost benefits with dollar amounts
  - Recovery CTA: "Add Another Autopay to Return to Plus Tier" → `/autopay/add`
  - Secondary CTA: "Return to Autopay List" → `/autopay`
- On error: Stay on removal page, display error message, re-enable button

**And** the success page emphasizes recovery path, not regret

---

## 4. States

### Default State
- Removal confirmation page fully loaded
- Autopay details displayed (name, frequency, next payment date)
- Appropriate warning level (none if no tier impact, prominent if tier loss)
- Action buttons enabled and ready
- No loading indicators

### Loading State (During Removal)
- Primary button shows spinner + "Removing..."
- Button disabled to prevent double-click
- Page background slightly dimmed (optional)
- "Please do not close this window" message (optional)
- Timeout: After 30 seconds, show error state with retry

### Success State
- Navigate to success confirmation page (or return to autopay list with banner)
- Success message: "Autopay Removed"
- Tier change notification (if applicable): "Your tier has changed to [new tier]"
- Benefits lost display (if retrogression)
- Recovery CTA: "Add Another Autopay" (prominent if retrogression)
- Return CTA: "Return to Autopay List"

### Error State
- Error message: "Unable to remove autopay. Please try again."
- Retry button: "Try Again" (maintains all page state)
- Alternative: "Cancel and Go Back" (return to autopay list)
- Support link: "Contact support if problem persists"

### Permission Denied State
- "You don't have permission to remove this autopay."
- Support CTA

### Offline State
- "You're offline. Cannot remove autopay now."

---

## 5. Information Architecture

### Visual Regions (Top to Bottom)

**Header Region**:
- Page title: "Remove Autopay" (20pt Bold)
- Breadcrumb: Home > Autopay > Remove (optional)

**Autopay Summary Region**:
- Section heading: "Autopay Details"
- Autopay name: "Rewards Card" (16pt Bold)
- Frequency: "Monthly on the 1st" (14pt)
- Next payment: "March 1, 2026" (14pt)
- Current amount: "$300.00" (16pt)
- Status: "Active" (badge)

**Retrogression Warning** (conditional, if tier impact exists):
- Background: Yellow/warning color at 10% opacity
- Alert icon (48×48px)
- Bold title: "Removing This Autopay Will Drop You to Classic Tier"
- Explanation paragraph: Clear cause-and-effect relationship
- **Benefits Lost Section**:
  - Subheading: "Here's What You'll Lose"
  - Benefit line 1: Icon + name + loss amount
    - "APY Boost: $58/year on your $23,500 balance"
  - Benefit line 2: Icon + name + loss amount
    - "Fee Waiver: $60/year (estimated)"
  - Total annual loss (bold, prominent): "$118/year total"
- **Recovery Path Section**:
  - Subheading: "How to Stay in Plus Tier"
  - Option 1: "Add another autopay" (link to `/autopay/add`)
  - Option 2: "Increase your balance to $10,000"
  - Timeframe: "Both options will restore your tier within 24 hours."

**Action Region**:
- Primary CTA: "Continue Removal" button
  - Red/destructive color (#DC2626)
  - ≥48×48px tap target
  - Clear label emphasizing deliberate action
- Alternative CTA (if retrogression): "Keep Autopay and Pause Instead" button
  - Blue/secondary color
  - Same tap target size
  - Presented as a smarter option
- Tertiary CTA: "Cancel and Go Back" link
  - Gray text, no button styling
  - Subtle but accessible

**Support Section** (optional footer):
- Heading: "Need Help?"
- Message: "If you're unsure about removing this autopay, contact us."
- Link: "Contact Support" → Help page

### Content Priority

1. **Autopay details** — What is being removed
2. **Retrogression warning** — Will this impact tier (if yes, prominent)
3. **Benefits loss** — Concrete dollar impact of tier loss
4. **Recovery path** — How to restore tier
5. **Alternatives** — Pause option instead of removal
6. **Action buttons** — Final decision point
7. **Support** — Help option if uncertain

### Progressive Disclosure

- Autopay summary always visible
- Retrogression warning appears only if tier impact exists (not shown for Classic members removing non-essential autopay)
- Benefits loss breakdown shown only if tier loss occurs
- Recovery path shown only if tier loss
- No third-level navigation required

---

## 6. Components & Responsibilities

### Component Tree

```
Page (app/autopay/[id]/remove/page.tsx) — Server Component
├── Header (from layout)
├── AutopaySummaryRegion (Client)
│   ├── Heading "Autopay Details"
│   ├── AutopayName (16pt bold)
│   ├── Frequency display
│   ├── NextPaymentDate
│   ├── CurrentAmount
│   └── StatusBadge
├── RetrogressionWarning (Client, conditional) — NEW
│   ├── Alert icon
│   ├── Title "Removing This Autopay Will Drop You to Classic Tier"
│   ├── Explanation text
│   ├── BenefitsLostSection
│   │   ├── Heading "Here's What You'll Lose"
│   │   ├── BenefitLossSummary × N (icon, name, dollar amount)
│   │   └── TotalAnnualLoss (bold, prominent)
│   └── RecoveryPathSection
│       ├── Heading "How to Stay in Plus Tier"
│       ├── Option 1 (with link)
│       ├── Option 2
│       └── Timeframe message
├── ActionRegion (Client)
│   ├── PrimaryButton "Continue Removal" (red/destructive)
│   ├── AlternativeButton "Keep Autopay and Pause Instead" (blue, if retrogression)
│   ├── TertiaryLink "Cancel and Go Back"
│   └── (on Alternative click) PauseForm (Client)
│       ├── Heading "Pause Autopay"
│       ├── DateSelector
│       ├── SuggestedDurations (1 mo, 3 mo, 6 mo)
│       ├── "Confirm Pause" button
│       └── "Cancel and Return to Removal" link
├── SupportSection (optional)
│   ├── Heading "Need Help?"
│   └── "Contact Support" link
└── Footer (from layout)
```

### Component Responsibilities

**RetrogressionWarning** (NEW):
- Props: `autopay`, `currentTier`, `benefitsLost`, `recoveryActions`
- Responsibility: Display prominent warning with concrete dollar impact
- Accessibility: `role="alert"` for prominence
- Conditional rendering: Only appears if tier loss

**BenefitsLostSection** (NEW):
- Props: `benefitsLost: Benefit[]`
- Responsibility: Display benefits lost with dollar amounts, total annual impact
- Used in: SCR-14 (removal warning), potentially SCR-16 (retrogression alert)

**RecoveryPathSection** (NEW):
- Props: `currentTier`, `newTier`, `recoveryActions`
- Responsibility: Show actionable recovery path
- Links: To add autopay, to tier details, to balance info

**PauseForm** (NEW):
- Props: `autopay`, `onConfirm`, `onCancel`
- Responsibility: Handle pause date selection, submit pause request
- Accessibility: Date picker accessible, button ≥48×48px

**Page (app/autopay/[id]/remove/page.tsx)**:
- Responsibility: Fetch autopay details, member tier, calculate tier impact, render warning
- Server-side: Fetch `getAutopay(id)`, `getMemberTier()`, calculate `willCauseTierLoss()`
- Error handling: If autopay fetch fails, show error state

---

## 7. Interactions

### Click Interactions

**"Continue Removal" Button**:
- Click → Disable button, show loading spinner
- Submit removal request to backend
- On success: Navigate to success confirmation page
- On error: Display error message, re-enable button

**"Keep Autopay and Pause Instead" Button** (if available):
- Click → Show pause date selector (modal or inline)
- User selects date or duration
- Submit pause request
- On success: Close modal, show success message, return to autopay list or stay on page

**"Cancel and Go Back" Link**:
- Click → Navigate back to `/autopay` (autopay list)
- No confirmation required

**"Contact Support" Link**:
- Click → Navigate to Help page (SCR-07)

### Keyboard Navigation

- **Tab order**: Autopay summary (display only) → Primary button → Alternative button (if visible) → Cancel link → Support link
- **Enter/Space**: Activate primary button, alternative button, cancel link
- **Escape**: Cancel removal, navigate back to autopay list

### Touch Interactions (Mobile)

- **Primary button tap**: ≥48×48px target, red/destructive color
- **Alternative button tap**: ≥48×48px target, blue/secondary
- **Date picker**: Native date input or accessible custom picker
- **Modal**: Full-width on mobile, with clear dismiss option

### Focus Management

- **Page load**: Focus moves to primary action button (Continue Removal)
- **Warning appears**: Focus may be announced to screen readers via `role="alert"`
- **Pause modal opens**: Focus moves to date picker
- **Error occurs**: Focus moves to error message heading

---

## 8. Data Contracts

### DELETE /api/member/:memberId/autopay/:autopayId

**Request**: (No body)

**Response** (HTTP 200 OK):
```json
{
  "success": true,
  "message": "Autopay removed successfully",
  "autopayId": "AP-001",
  "tierChangeOccurred": true,
  "oldTier": "plus",
  "newTier": "classic",
  "benefitsLost": [
    {
      "benefitId": "apy-boost-plus",
      "benefitName": "APY Boost",
      "annualValue": 58.75,
      "description": "+0.25% annual interest"
    },
    {
      "benefitId": "fee-waiver-plus",
      "benefitName": "Fee Waiver",
      "annualValue": 60.00,
      "description": "Waived transfer fees"
    }
  ],
  "totalAnnualLoss": 118.75
}
```

### POST /api/member/:memberId/autopay/:autopayId/pause

**Request**:
```json
{
  "resumeDate": "2026-05-21"
}
```

**Response** (HTTP 200 OK):
```json
{
  "success": true,
  "message": "Autopay paused until 2026-05-21",
  "autopayId": "AP-001",
  "status": "paused",
  "resumeDate": "2026-05-21",
  "tierStatus": "plus"
}
```

### TypeScript Service Facade

```typescript
export async function removeAutopay(
  memberId: string,
  autopayId: string
): Promise<RemoveAutopayResponse> {
  const response = await fetch(
    `/api/member/${memberId}/autopay/${autopayId}`,
    { method: "DELETE" }
  );
  if (!response.ok) throw new Error("Failed to remove autopay");
  return response.json();
}

export async function pauseAutopay(
  memberId: string,
  autopayId: string,
  resumeDate: string
): Promise<PauseAutopayResponse> {
  const response = await fetch(
    `/api/member/${memberId}/autopay/${autopayId}/pause`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeDate })
    }
  );
  if (!response.ok) throw new Error("Failed to pause autopay");
  return response.json();
}

interface RemoveAutopayResponse {
  success: boolean;
  message: string;
  autopayId: string;
  tierChangeOccurred: boolean;
  oldTier: "classic" | "plus" | "premium";
  newTier: "classic" | "plus" | "premium";
  benefitsLost: BenefitLoss[];
  totalAnnualLoss: number;
}

interface BenefitLoss {
  benefitId: string;
  benefitName: string;
  annualValue: number;
  description: string;
}

interface PauseAutopayResponse {
  success: boolean;
  message: string;
  autopayId: string;
  status: "paused";
  resumeDate: string;
  tierStatus: "classic" | "plus" | "premium";
}
```

### Mock Data

```typescript
const mockRemoveAutopayResponse: RemoveAutopayResponse = {
  success: true,
  message: "Autopay removed successfully",
  autopayId: "AP-001",
  tierChangeOccurred: true,
  oldTier: "plus",
  newTier: "classic",
  benefitsLost: [
    {
      benefitId: "apy-boost-plus",
      benefitName: "APY Boost",
      annualValue: 58.75,
      description: "+0.25% annual interest"
    }
  ],
  totalAnnualLoss: 58.75
};
```

---

## 9. Validation Rules

- **Autopay exists**: Autopay must exist and belong to member
- **Member permission**: Member must have permission to remove
- **Tier impact**: Calculate tier change accurately (if applicable)
- **Benefits loss**: Calculate precise dollar impact based on member's balance and patterns
- **Pause date**: Must be future date (if pause requested)
- **Resume date**: Must be valid date ≥1 day from now, ≤12 months from now

---

## 10. Visual & Responsive Rules

### Design Tokens

**Colors**:
- Retrogression warning background: #FEF3C7 (yellow, 10% opacity)
- Primary button (Continue Removal): #DC2626 (red, destructive)
- Alternative button (Pause): #3B82F6 (blue, secondary)
- Benefits lost text: #DC2626 (red for emphasis)
- Loss amount text: #10B981 (green, for consistency with savings elsewhere)
- Alert icon: #F59E0B (amber, non-alarming)

**Typography**:
- Page title: 20pt Bold
- Autopay name: 16pt Bold
- Warning title: 18pt Bold
- Benefit loss line: 14pt Regular, $amount in 16pt Bold
- Total annual loss: 18pt Bold
- Button text: 16pt Bold, white

**Spacing**:
- Warning section padding: 20px
- Benefit line spacing: 12px vertical between items
- Button spacing: 16px between buttons
- Section margin: 24px top

### Responsive Breakpoints

**Mobile (320px–479px)**:
- Single-column layout
- Full-width warning card
- Full-width action buttons (48px height)
- Autopay details stacked vertically
- Date picker uses native mobile input

**Tablet (480px–1024px)**:
- Single-column layout
- Full-width warning
- Buttons may be ~50% width side-by-side if space allows
- Native or custom date picker

**Desktop (1025px+)**:
- Single-column (max 600px width)
- Warning card full-width
- Buttons auto-width with min 200px each
- Custom date picker with calendar UI
- Container max-width: 700px

---

## 11. Accessibility Checklist

- Page heading: Semantic `<h1>` with "Remove Autopay"
- Warning section: `role="alert"` for immediate prominence
- Alert icon: `aria-label="Warning"` or similar
- Button (Continue Removal): Semantic `<button>`, red color for destructive action, ≥48×48px, visible focus
- Button (Pause): Semantic `<button>`, ≥48×48px, visible focus
- Link (Cancel): Semantic `<a>`, underline or icon supplement
- Date picker: Accessible input or custom picker with ARIA attributes
- Benefits list: Semantic `<ul>` or `<dl>` structure
- Dollar amounts: Screen reader accessible, proper currency formatting
- Color contrast: All text ≥7:1 against background (especially warning section)
- Focus order: Logical top to bottom (summary → warning → buttons → support)
- Keyboard navigation: All interactive elements accessible via Tab/Enter/Space

---

## 12. Telemetry

- `event: "autopay_remove_view"` — Page load
  - `properties: { autopayId, paymentType, willCauseTierLoss: boolean, currentTier }`
- `event: "retrogression_warning_shown"` — Warning displayed
  - `properties: { autopayId, oldTier, newTier, totalAnnualLoss }`
- `event: "autopay_pause_initiated"` — User clicks Pause Instead
  - `properties: { autopayId, pauseDuration }`
- `event: "autopay_paused"` — Autopay successfully paused
  - `properties: { autopayId, resumeDate }`
- `event: "autopay_remove_confirmed"` — User clicks Continue Removal
  - `properties: { autopayId, willCauseTierLoss: boolean }`
- `event: "autopay_removed"` — Autopay successfully removed
  - `properties: { autopayId, tierChange: boolean, newTier }`
- `event: "autopay_remove_cancelled"` — User navigates back without removing
  - `properties: { autopayId }`

---

## 13. Open Questions & Assumptions

1. **Pause Duration**: Should pause date be selectable freely, or offer preset durations (1, 3, 6 months)? (Assumption: Both; presets + custom date picker)
2. **Tier Recalculation**: Does tier change immediately upon removal, or next daily batch? (Assumption: Immediate if all criteria met; otherwise next daily)
3. **Notification on Removal**: Should member receive email when removal causes retrogression? (Assumption: Yes)

---

## 14. Design Rationale (Three-Experts Synthesis)

**UX Lead**: Retrogression warning uses prominent placement and concrete dollar amounts to clarify stakes without alarming member. Pause option respects agency while offering smarter alternative. Recovery path emphasizes member can restore tier, reducing regret.

**Frontend Architect**: Page server-renders autopay and tier impact; RetrogressionWarning conditionally rendered. Pause form is client component with clean separation from removal logic. Success page navigates away; focus managed by destination.

**Product/Delivery**: Retrogression prevention is critical to autopay persistence (target: 90%+). Pause feature is conversion lever; members who pause instead of remove are likely to resume and maintain engagement. Telemetry tracks pause adoption as success metric.

---

## 15. Cursor-Claude Ready Build Plan

### File Structure

```
app/autopay/[id]/
├── remove/page.tsx             # Removal confirmation (server)

components/autopay/
├── RetrogressionWarning.tsx    # NEW
├── BenefitsLostSection.tsx     # NEW
├── RecoveryPathSection.tsx     # NEW
├── PauseForm.tsx               # NEW
└── AutopaySummaryRegion.tsx    # NEW

lib/
├── api.ts                      # Add removeAutopay(), pauseAutopay()
```

### Test Stubs

```typescript
describe("Autopay Removal (SCR-14)", () => {
  test("displays autopay summary without warning for non-critical autopay", () => {
    // Render removal page for non-tier-critical autopay
    // Assert: Autopay details displayed
    // Assert: No retrogression warning shown
  });

  test("displays retrogression warning for tier-critical autopay", () => {
    // Render removal page for tier-critical autopay (Plus member with 2 required)
    // Assert: Prominent warning visible
    // Assert: Benefits lost section shows dollar amounts
    // Assert: Total annual loss calculated correctly
  });

  test("shows pause alternative when applicable", () => {
    // Render removal page for tier-critical autopay
    // Assert: "Keep Autopay and Pause Instead" button visible
  });

  test("removes autopay and shows tier change", async () => {
    // Click "Continue Removal"
    // Assert: Button disabled, loading spinner shown
    // Wait for API response
    // Assert: Navigate to success page
    // Assert: "Your tier has changed to Classic" message visible
  });

  test("pauses autopay instead of removing", async () => {
    // Click "Keep Autopay and Pause Instead"
    // Select pause date
    // Click "Confirm Pause"
    // Assert: API POST called
    // Assert: Navigate to autopay list or show success banner
    // Assert: Tier status unchanged
  });

  test("allows user to cancel removal", () => {
    // Click "Cancel and Go Back"
    // Assert: Navigate back to /autopay
  });
});
```

---

✅ **SHARD 14 COMPLETE — Autopay Removal Warning Ready for Build**
