# Shard 13: Autopay Setup

**Build Priority**: P1 — Critical tier advancement driver
**Estimated Effort**: 16 hours
**Screen ID**: SCR-13
**Route**: `/autopay/add` (create) and `/autopay/[id]/edit` (edit)
**Component File**: `app/autopay/add/page.tsx` and `app/autopay/[id]/edit/page.tsx`

---

## 1. Screen Name & Route

**Full Screen Name**: Autopay Setup with Tier Impact Messaging
**URL Routes**:
- Create: `/autopay/add`
- Edit: `/autopay/[id]/edit`
**Navigation Access**: Autopay Management List → "Add New Autopay" or "Edit"
**Page Title**: "Add Autopay" or "Edit Autopay"
**Breadcrumb**: Home > Autopay > Add (or Edit)
**Auth Requirements**: Authenticated member with eligible accounts and payment targets

---

## 2. Purpose & Jobs-to-be-Done

**Primary Purpose**: Guide member through adding new autopay (or editing existing) with proactive tier impact messaging. Must explain how this specific autopay affects tier qualification without overwhelming with complex rules. Use progressive disclosure to avoid cognitive overload while ensuring understanding.

**Jobs-to-be-Done**:
1. **Set up autopay quickly** — Member wants smooth setup flow without excessive questions
2. **Understand tier impact** — Member wants to know immediately how adding this autopay moves them toward (or maintains) tier qualification
3. **Navigate complex rules** — Member needs rules explained in context (e.g., "Only 1 credit card autopay counts per tier") without requiring separate learning
4. **Make confident decision** — Member feels supported in deciding whether to proceed based on tier benefit

**Design Principle Applied**: "Progressive Disclosure" — Show essential tier impact information upfront; detailed rules available on demand; "Supportive Framing" — Emphasize advancement opportunity, not obligation; "Cognitive Load Management" — Break complex tier rules into simple per-autopay explanation.

---

## 3. User Stories & Acceptance Criteria

### Story 1: Member Adds First Autopay with Clear Tier Context

**As a** Classic tier member (PERSONA-01, PERSONA-03)
**I want to** add my first autopay and understand how it moves me toward Plus tier
**So that** I feel motivated to complete the setup and lock in the benefit

**Given** I navigate to `/autopay/add` (no prior autopays)
**When** the page loads
**Then** I see:
- Page heading: "Add Autopay"
- **NEW Tier Impact Context** (prominent, above form):
  - Alert/info box with gold background (Plus tier color)
  - Icon: Arrow up or advancement icon
  - Title: "Unlock Plus Tier Benefits"
  - Message: "Adding an autopay moves you toward Plus tier. You'll qualify with 2 autopays and $2,500 balance."
  - CTA link: "Learn about Plus tier benefits" → `/loyalty/benefits`
- Setup form with fields for payment type, account, amount, frequency
- CTA: "Add Autopay" button
- Secondary: "Cancel" link

**And** the tier context remains visible as member fills form

---

### Story 2: Member Adds Second Autopay to Reach Plus Tier

**As a** benefit optimizer (PERSONA-02)
**I want to** add a second autopay that will push me into Plus tier
**So that** I immediately gain the tier benefits

**Given** I navigate to `/autopay/add` with 1 existing autopay
**When** the page loads
**Then** I see:
- Updated tier context: "One More Autopay to Plus Tier!"
- Message: "You have 1 of 2 required autopays. Adding this will move you to Plus tier."
- If I select credit card: Rule explanation "Note: Only 1 credit card autopay per tier level"
- After successful setup: "Autopay added! You've reached Plus tier."

**And** the tier advancement is confirmed with visual celebration

---

### Story 3: Member Edits Autopay with Tier Lock-In Messaging

**As a** member managing existing autopay (PERSONA-02)
**I want to** edit my autopay but understand retrogression risk
**So that** I don't accidentally drop my tier

**Given** I navigate to `/autopay/[id]/edit` for required autopay
**When** the page loads
**Then** I see:
- **Tier Lock-In Context** (yellow warning): "Important: This Autopay Supports Your Plus Tier"
- Message: "Removing this autopay will drop you to Classic tier. You can edit the amount or frequency."
- Edit form with current values
- CTA: "Save Changes"
- Secondary: "Remove This Autopay" link (red, goes to SCR-14)

**And** the warning remains visible during editing

---

### Story 4: Member Understands Credit Card Autopay Rule

**As a** rule-aware member (PERSONA-02, PERSONA-04)
**I want to** understand the credit card autopay limit
**So that** I don't try to add a second one and get confused

**Given** I'm adding autopay and select "Credit Card"
**When** the form shows rule context
**Then** I see:
- **Progressive Rule Explanation**:
  - "Credit card autopays: 1 per tier level (max 1 for Plus tier)"
  - "You have 0 credit card autopays. This will be your 1 allowed."
  - Or: "You have 1 credit card autopay. Only 1 is allowed per tier. Remove the existing one first."
- Form submission:
  - If valid: Proceed with submission
  - If violates rule: Inline error with link to manage autopays

**And** the explanation is contextual to user's specific situation

---

## 4. States

### Default State
- Setup form fully loaded with empty fields (create) or pre-filled values (edit)
- Tier context message visible and relevant
- All form fields enabled
- CTA button enabled
- No error messages

### Loading State
- Form loading with spinner
- "Creating your autopay..." message during submission
- Button disabled after submission
- Form fields disabled to prevent double-submit

### Success State
- Navigate to success confirmation or return to autopay list
- Success message: "Autopay created!" or "Autopay updated!"
- If tier advancement: "Congratulations! You've reached Plus tier"
- CTA: "View Your Tier Benefits" or "Return to Autopay List"

### Error State
- **Validation errors**: Inline field errors
  - "Please select a payment type"
  - "Amount must be greater than $0"
- **Business rule violations**: Clear explanation + recovery
  - "Only 1 credit card autopay per tier level"
  - Link: "Manage your autopays"
  - Option to choose different type
- **API errors**: User-friendly message + retry
  - "Unable to create autopay. Please try again."

### Permission Denied State
- "You don't have permission to set up autopay for this account."
- Support CTA

### Offline State
- "You're offline. Cannot create autopay now."

---

## 5. Information Architecture

### Visual Regions (Top to Bottom) — Create

**Header Region**:
- Page title: "Add Autopay" (20pt Bold)
- Breadcrumb: Home > Autopay > Add

**Tier Impact Context** (prominent callout, full-width):
- Background: Tier color at 10% opacity (Plus: gold tint)
- Icon: Advancement or tier badge
- Heading: Context-dependent
  - If 0 autopays: "Unlock Plus Tier Benefits"
  - If 1 autopay: "One More Step to Plus Tier"
  - If already Plus: "Advance Your Tier"
- Message: How this autopay moves user toward tier
- Benefit preview: "You'll earn +0.25% APY and fee-free transfers"
- Link: "Learn about tier benefits" → `/loyalty/benefits`

**Setup Form Region**:
- Section heading: "Autopay Details"
- Form fields:
  1. Payment Type: Loan, Credit Card, Bill Payment
  2. Target Account/Bill: Dropdown or searchable list
  3. Amount: Text input with currency formatting
  4. Frequency: Weekly, Bi-weekly, Monthly
  5. Day/Date: Day of week or day of month
  6. Review: Checkbox confirming understanding

**Rule Explanation Section** (conditional):
- Heading: "Important Details" or "How This Affects Your Tier"
- Content varies by payment type + tier
- "Learn more" link to detailed tier rules

**Action Region**:
- Primary CTA: "Add Autopay" button
  - Tier color (Plus: #D4A574)
  - Disabled if form invalid
- Secondary: "Cancel" link

### Edit Flow Additions

- **Tier Lock-In Context** (if removing would cause retrogression)
  - Yellow/warning background
  - Title: "This Autopay Supports Your Plus Tier"
  - Message: "Removing this autopay will drop you to Classic tier."
- Remove option available as separate link to SCR-14

### Content Priority

1. **Tier impact** — What does this do for member's tier
2. **Payment details** — Which account, amount, frequency
3. **Rule explanations** — Complex rules in context
4. **Confirmation action** — Clear CTA
5. **Learn more links** — Optional deep dives

---

## 6. Components & Responsibilities

### Component Tree

```
Page (app/autopay/add/page.tsx or [id]/edit/page.tsx) — Server
├── Header
├── TierImpactContext (Client) — NEW
│   ├── Icon
│   ├── Heading
│   ├── Message
│   ├── Benefit preview
│   └── "Learn more" link
├── AutopaySetupForm (Client) — NEW
│   ├── PaymentTypeSelector
│   ├── TargetAccountSelect
│   ├── AmountInput
│   ├── FrequencySelector
│   ├── DaySelector
│   └── ReviewCheckbox
├── RuleExplanationSection (Client, conditional) — NEW
│   ├── Heading
│   ├── Rule content
│   └── "Learn more" link
├── TierLockInContext (Client, edit only) — NEW
│   ├── Warning icon
│   ├── Title
│   ├── Message
│   └── Remove link
├── ActionRegion (Client)
│   ├── PrimaryButton "Add Autopay"
│   ├── SecondaryLink "Cancel"
│   └── (edit) TertiaryLink "Remove"
└── Footer
```

### Component Responsibilities

**TierImpactContext** (NEW):
- Props: `currentTier`, `autopayCount`, `nextTierThreshold`
- Responsibility: Display tier advancement context
- Accessibility: `role="alert"`

**AutopaySetupForm** (NEW):
- Props: `autopay` (for edit), `onSubmit`, `errors`, `validation`
- Responsibility: Handle form state, validation, submission
- Accessibility: Proper labels, ARIA error announcements

**RuleExplanationSection** (NEW):
- Props: `paymentType`, `memberTier`, `autopayCount`, `rule`
- Responsibility: Display contextual rule explanation
- Variants: Credit card limit, tier advancement, tier requirement

**TierLockInContext** (NEW, edit only):
- Props: `autopay`, `currentTier`, `wouldCauseTierLoss`
- Responsibility: Warn about retrogression risk
- Accessibility: `role="alert"`

---

## 7. Interactions

### Click Interactions

**Payment Type Radio**:
- Select → Form shows appropriate fields
- Credit Card → Rule explanation appears

**Target Account Dropdown**:
- Click → List of eligible accounts
- Select → Pre-fill amount if applicable

**"Add Autopay" Button**:
- Click → Validate form
- Valid: Submit, disable button, show loading
- Success: Navigate to confirmation
- Error: Show error message, re-enable button

**"Cancel" Link**:
- Click → Navigate back to `/autopay`
- Confirm if unsaved changes

### Keyboard Navigation

- **Tab order**: Payment type → Account → Amount → Frequency → Day → Review → Add button → Cancel
- **Enter/Space**: Activate radios, buttons
- **Escape**: Cancel (optional)

### Touch Interactions (Mobile)

- **Radio/checkbox**: ≥48×48px target
- **Dropdown**: Native select or accessible custom
- **Button**: ≥48×48px with visual feedback

### Focus Management

- **Page load**: Focus to payment type (first field)
- **Error**: Focus to first error field
- **Success**: Navigate away; focus managed by destination

---

## 8. Data Contracts

### POST /api/member/:memberId/autopay (Create)

**Request**:
```json
{
  "paymentType": "loan",
  "targetAccountId": "LN-5555",
  "amount": 450.00,
  "frequency": "monthly",
  "dayOfMonth": 15
}
```

**Response** (HTTP 201 Created):
```json
{
  "autopayId": "AP-003",
  "paymentType": "loan",
  "targetAccountName": "Auto Loan",
  "amount": 450.00,
  "frequency": "monthly",
  "dayOfMonth": 15,
  "status": "active",
  "nextPaymentDate": "2026-03-15",
  "tierChangeOccurred": false,
  "newTier": "plus"
}
```

### TypeScript Service Facade

```typescript
export async function createAutopay(
  memberId: string,
  autopayData: CreateAutopayRequest
): Promise<AutopayResponse> {
  const response = await fetch(`/api/member/${memberId}/autopay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(autopayData)
  });
  if (!response.ok) throw new Error("Failed to create autopay");
  return response.json();
}

export async function updateAutopay(
  memberId: string,
  autopayId: string,
  autopayData: UpdateAutopayRequest
): Promise<AutopayResponse> {
  const response = await fetch(`/api/member/${memberId}/autopay/${autopayId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(autopayData)
  });
  if (!response.ok) throw new Error("Failed to update autopay");
  return response.json();
}

interface CreateAutopayRequest {
  paymentType: "loan" | "credit_card" | "bill_payment";
  targetAccountId: string;
  amount: number;
  frequency: "weekly" | "bi-weekly" | "monthly";
  dayOfMonth?: number;
  dayOfWeek?: string;
}

interface AutopayResponse {
  autopayId: string;
  paymentType: string;
  targetAccountName: string;
  amount: number;
  frequency: string;
  status: string;
  nextPaymentDate: string;
  tierChangeOccurred?: boolean;
  newTier?: string;
}
```

### Mock Data

```typescript
const mockCreateAutopayResponse: AutopayResponse = {
  autopayId: "AP-003",
  paymentType: "loan",
  targetAccountName: "Auto Loan",
  amount: 450.00,
  frequency: "monthly",
  status: "active",
  nextPaymentDate: "2026-03-15",
  tierChangeOccurred: true,
  newTier: "plus"
};
```

---

## 9. Validation Rules

- **Payment type**: Required, must be "loan", "credit_card", or "bill_payment"
- **Target account**: Required, must belong to member
- **Amount**: Required, >0, ≤ account balance, reasonable max
- **Frequency**: Required, valid value
- **Day**: Required, valid 1–31 for month, 0–6 for week
- **Credit card limit**: Max 1 credit card autopay per tier (validation error if violated)
- **Minimum payment**: For loans, meet minimum required payment

---

## 10. Visual & Responsive Rules

### Design Tokens

**Colors**:
- Tier context background: Tier color at 10% (Plus: #FEF3C7)
- Rule explanation background: #F3F4F6
- Tier lock-in background: #FEF3C7
- Button: Tier color (Plus: #D4A574)
- Button disabled: #9CA3AF
- Error text: #DC2626 (7:1 contrast)

**Typography**:
- Page title: 20pt Bold
- Form label: 16pt Bold
- Form input: 16pt Regular
- Helper text: 14pt Regular
- Error text: 14pt Regular
- Button: 16pt Bold, white

**Spacing**:
- Form field spacing: 16px
- Section margin: 24px top
- Button margin: 24px top
- Tier context padding: 20px

### Responsive Breakpoints

**Mobile (320px–479px)**:
- Single-column
- Full-width fields
- Full-width button (48px height)
- Tier context full-width at top

**Tablet (480px–1024px)**:
- Single or two-column form
- Full-width tier context
- Button ~50% or full-width

**Desktop (1025px+)**:
- Single column (max 600px)
- Tier context full-width above
- Button auto-width with min 200px

---

## 11. Accessibility Checklist

- Page heading: Semantic `<h1>`
- Form labels: Associated via `<label for>`
- Tier context: `role="alert"` for prominence
- Radio/checkbox: Semantic `<input>` elements
- Dropdown: Native `<select>` or accessible custom
- Error messages: `aria-live="polite"`, `aria-describedby`
- Buttons: Semantic `<button>`, ≥48×48px, visible focus (2px outline)
- Links: Underline or icon supplement
- Currency input: Proper screen reader formatting
- Color contrast: All text ≥7:1
- Focus order: Logical top to bottom, Tab traversal
- Tier lock-in: `role="alert"` if appears during edit

---

## 12. Telemetry

- `event: "autopay_setup_view"` — Page load (create)
  - `properties: { currentTier, existingAutopayCount }`
- `event: "autopay_edit_view"` — Page load (edit)
  - `properties: { autopayId, isRequiredForTier }`
- `event: "payment_type_selected"` — User selects type
  - `properties: { paymentType, tierContext }`
- `event: "autopay_created"` — Successfully created
  - `properties: { autopayId, paymentType, amount, tierChange: boolean, newTier }`
- `event: "autopay_updated"` — Successfully updated
  - `properties: { autopayId, changedFields }`
- `event: "autopay_creation_error"` — Error during creation
  - `properties: { errorType, errorMessage }`

---

## 13. Open Questions & Assumptions

1. **Credit Card Limits**: Strict rejection or soft warning? (Assumption: Strict rejection with explanation)
2. **Amount Pre-population**: Pre-populate from loan minimum? (Assumption: Yes, for loans)
3. **Tier Changes During Setup**: Refresh context if tier changes while user filling form? (Assumption: No)

---

## 14. Design Rationale (Three-Experts Synthesis)

**UX Lead**: Tier context always visible ensures member understands benefit. Progressive disclosure reveals rules only when relevant. Edit flow includes lock-in warning to prevent accidental tier loss.

**Frontend Architect**: Form uses controlled components with client-side validation; server-side validation redundant. Tier context fetched server-side. Edit pre-populates from existing autopay.

**Product/Delivery**: Autopay setup is primary driver of autopay penetration; target 40% of Classic-eligible members add autopay within 60 days. Tier context messaging is conversion lever.

---

## 15. Cursor-Claude Ready Build Plan

### File Structure

```
app/autopay/
├── add/page.tsx                # Create (server)
└── [id]/edit/page.tsx          # Edit (server)

components/autopay/
├── TierImpactContext.tsx       # NEW
├── AutopaySetupForm.tsx        # NEW
├── RuleExplanationSection.tsx  # NEW
├── TierLockInContext.tsx       # NEW (edit)
├── PaymentTypeSelector.tsx     # NEW
├── TargetAccountSelect.tsx     # NEW
└── DaySelector.tsx             # NEW

lib/
├── api.ts                      # Add createAutopay(), updateAutopay()
├── validation.ts               # Autopay validation rules
```

### Test Stubs

```typescript
describe("Autopay Setup (SCR-13)", () => {
  test("displays tier context for first autopay", () => {
    // Render create form with 0 existing autopays
    // Assert: "Unlock Plus Tier Benefits" context visible
  });

  test("validates form and shows errors", () => {
    // Render form, click "Add Autopay" without filling
    // Assert: Inline errors for required fields
  });

  test("enforces credit card autopay limit", async () => {
    // Render with existing credit card autopay
    // Select "Credit Card" for new autopay
    // Assert: Error "Only 1 credit card autopay per tier level"
  });

  test("creates autopay and advances tier", async () => {
    // Render with 1 existing autopay (Classic tier)
    // Fill form and click "Add Autopay"
    // Assert: API POST called
    // Assert: Navigate to success with "Reached Plus Tier" message
  });

  test("shows tier lock-in warning on edit", () => {
    // Render edit form for required autopay
    // Assert: "This Autopay Supports Your Plus Tier" warning visible
    // Assert: Remove link available
  });
});
```

---

✅ **SHARD 13 COMPLETE — Autopay Setup Ready for Build**
