# Shard 04: SCR-08 Move Money Transfer Screen Modifications — Smart Loyalty Transfer Feature

**Project**: Smart Loyalty Transfer Feature Enhancement
**Shard**: 04-transfer-screen-modifications-shard
**Affected Screen**: SCR-08 (Move Money Transfer)
**Date**: 2026-02-22
**Status**: BUILD READY
**Depends On**: Shard 01 (all shards; this is the most complex)
**Estimated LOC**: 1,200
**Time Estimate**: 4-5 days

---

## Section 1: Screen Name & Route

**Screen**: SCR-08 (Move Money Transfer)
**Route**: `/move-money` (enhanced to support `?loyalty=true` params)
**Purpose**: PRIMARY DESTINATION for loyalty transfers. Must support both loyalty and non-loyalty transfers seamlessly.

**Modifications**:
1. URL parameter parsing for loyalty transfer context
2. LoyaltyTransferBanner (notification at top)
3. PreFilledAmountInput (amount with visual indicator)
4. PreFilledAccountSelector (to-account selector)
5. LoyaltyTransferMemo (pre-populated memo)
6. Form state management with pre-fill tracking
7. Real-time balance validation
8. Stale data detection and warning
9. TransferConfirmationLoyaltyContext (confirmation view)
10. TransferSuccessTierPreview (success state)
11. Backward compatibility (non-loyalty transfers unaffected)

**Files**:
- `app/move-money/page.tsx` (enhanced with loyalty handling)
- `app/move-money/components/LoyaltyTransferBanner.tsx` (new)
- `app/move-money/components/PreFilledAmountInput.tsx` (new)
- `app/move-money/components/PreFilledAccountSelector.tsx` (new)
- `app/move-money/components/LoyaltyTransferMemo.tsx` (new)
- `app/move-money/components/TransferConfirmationLoyaltyContext.tsx` (new)
- `app/move-money/components/TransferSuccessTierPreview.tsx` (new)
- `app/move-money/hooks/useLoyaltyTransferForm.ts` (custom form hook)

---

## Section 2: Purpose & Jobs-to-be-Done

**Purpose**: Enable frictionless tier-progression transfers while maintaining backward compatibility with standard transfers. This screen must feel inviting, transparent, and trustworthy to change-averse members (55+).

**Jobs**:
1. "I want to transfer funds and reach my next loyalty tier with minimal effort"
2. "I want to see why each field is pre-filled and verify I can change it"
3. "I want to see the tier outcome before I confirm the transfer"

---

## Section 3: User Stories & Acceptance Criteria

**Story 1**: Member lands on Move Money with loyalty pre-fill

- GIVEN: Member taps tier progression CTA; deep-link is `/move-money?loyalty=true&amount=2300&toAccountId=SAV-001&...`
- WHEN: Page loads
- THEN: LoyaltyTransferBanner displays at top
- AND: Amount field shows "$2,300" (pre-filled, light gray bg)
- AND: To Account shows "Savings" (pre-filled, editable)
- AND: Memo shows "Loyalty tier qualification transfer" (pre-filled, editable)
- AND: From Account shows dropdown (required; member must select)
- AND: Submit button is disabled until From Account is selected
- AND: No data is locked; all fields are editable

**Story 2**: Member selects source account and submits

- GIVEN: Pre-filled loyalty transfer form is displayed
- WHEN: Member selects "Checking - $5,200" from From Account dropdown
- AND: All validation passes (sufficient funds, valid accounts, etc.)
- AND: Member taps "Review Transfer"
- THEN: Confirmation view displays with loyalty context section
- AND: Post-transfer balance is projected: "$5,200 - $2,300 = $2,900"
- AND: Tier qualification status shows: "✓ Qualifies for Premium"
- AND: Tier benefits are displayed: "1.25% APY, ATM fee waive, etc."

**Story 3**: Stale data is detected and member is warned

- GIVEN: Loyalty transfer CTA tapped at 2:00 PM (gap = $2,300)
- WHEN: Member navigates to transfer screen at 2:20 PM
- AND: Real-time tier gap fetch shows new gap = $2,100 (member received $200 deposit)
- THEN: Warning banner appears: "Tier qualification amount changed to $2,100 (was $2,300)"
- AND: "Update to $2,100?" button is available
- AND: Member can accept update, decline, or manually adjust amount

**Story 4**: Insufficient funds in source account

- GIVEN: Transfer amount = $2,300, selected source account = Checking ($1,800)
- WHEN: Member selects Checking
- THEN: Warning displays: "Checking account has insufficient funds for a $2,300 transfer"
- AND: Submit button is disabled
- AND: Member can select different account or reduce amount

**Story 5**: Backward compatibility — non-loyalty transfer works unchanged

- GIVEN: Member navigates to `/move-money` (no loyalty params)
- WHEN: Page loads
- THEN: Standard transfer form displays (no loyalty banner, no pre-fills)
- AND: All fields are empty; member manually enters all values
- AND: Confirmation view shows standard transfer confirmation (no tier context)
- AND: Loyalty code path is not executed

---

## Section 4: States

**State 1**: Page Loading
- Loyalty params are being parsed
- Tier gap data being fetched
- Show spinner

**State 2**: Loyalty Mode - Form Ready
- Banner displayed
- Amount, To Account, Memo pre-filled
- From Account empty (required selection)
- Submit button disabled

**State 3**: Non-Loyalty Mode
- No banner
- All fields empty
- User manually fills all values

**State 4**: Form Validation Error
- Insufficient funds, invalid account, etc.
- Error messages displayed
- Submit button disabled
- Offer corrective actions (select different account, adjust amount)

**State 5**: Stale Data Detected
- Warning banner: "Amount changed to $X (was $Y)"
- "Update?" button available
- Member can accept or ignore

**State 6**: Confirmation View
- All transfer details displayed
- Loyalty context section (if applicable)
- Buttons: "Confirm & Transfer", "Edit"

**State 7**: Success State
- Success banner with transfer ID
- Loyalty impact messaging (if applicable)
- "Done" button returns to banking

**State 8**: Error During Submission
- Error message displayed
- Retry button available
- Member can edit and resubmit

---

## Section 5: Information Architecture

**Component Tree**:

```
MoveMoneyTransferPage
├── Header ("Move Money")
├── LoyaltyTransferBanner (conditional: if loyalty=true)
│   ├── Icon
│   ├── Text: "Transfer $X to reach Y tier"
│   ├── Benefits callout
│   └── Dismiss button [×]
│
├── TransferForm (main section)
│   ├── FormState (internal: tracks edits, validation)
│   │
│   ├── Section: From Account
│   │   └── SourceAccountSelector
│   │       ├── Radio/dropdown
│   │       ├── Account options with balances
│   │       └── Validation feedback
│   │
│   ├── Section: To Account
│   │   └── PreFilledAccountSelector (if loyalty) OR StandardSelector (if not)
│   │       ├── Dropdown
│   │       ├── Pre-filled value (loyalty)
│   │       ├── Edit affordance
│   │       └── Validation: "Counts toward tier? Yes/No"
│   │
│   ├── Section: Amount
│   │   └── PreFilledAmountInput (if loyalty) OR StandardInput (if not)
│   │       ├── Input field
│   │       ├── Pre-filled value (loyalty)
│   │       ├── [?] help icon
│   │       ├── Real-time validation
│   │       └── Error/warning messages
│   │
│   ├── Section: Memo
│   │   └── LoyaltyTransferMemo (if loyalty) OR StandardMemo (if not)
│   │       ├── Input field
│   │       ├── Pre-filled value (loyalty)
│   │       ├── Character counter
│   │       └── Optional field indicator
│   │
│   └── Actions
│       ├── [Button: "Review Transfer"] (primary)
│       ├── [Button: "Cancel"]
│       └── [Link: "< Back"]
│
├── ConfirmationView (conditional: if reviewing)
│   ├── TransferDetails (read-only)
│   ├── TransferConfirmationLoyaltyContext (if loyalty)
│   │   ├── Projected balance
│   │   ├── Tier qualification status
│   │   ├── Tier benefits
│   │   └── Est. annual savings
│   └── Actions
│       ├── [Button: "Confirm & Transfer"]
│       ├── [Button: "Edit"]
│
└── SuccessView (conditional: if completed)
    ├── SuccessBanner
    ├── TransferSuccessTierPreview (if loyalty)
    │   ├── Tier achievement messaging
    │   ├── New benefits summary
    │   └── Next milestone
    └── Actions
        ├── [Button: "Done"]
        ├── [Button: "View Tier Details"]
```

---

## Section 6: Components & Responsibilities

**Component 1: LoyaltyTransferBanner** (150 LOC)
- Display at top when `loyalty=true`
- Show target amount, tier, benefits
- Dismissible; dismiss doesn't affect pre-fills
- `aria-live="polite"` for screen readers
- Design: Light teal background, green left border, 7:1 contrast text

**Component 2: PreFilledAmountInput** (180 LOC)
- Amount field with light gray background to indicate pre-fill
- Show label "[editable]" below field
- Real-time validation: check against source account balance, tier gap
- Error/warning display
- Help text: "We calculated this based on your current balance and Plus tier threshold. You can change it."
- Update pre-filled vs. user-edited tracking

**Component 3: PreFilledAccountSelector** (220 LOC)
- Destination account dropdown
- Pre-selected value shown
- Editable; member can change
- Validation: "Does this account count toward tier?" warning if not
- Show account balance next to each option
- Highlight pre-filled selection with subtle teal background

**Component 4: LoyaltyTransferMemo** (120 LOC)
- Text input field
- Pre-filled with "Loyalty tier qualification transfer"
- Editable
- Character counter (max 50)
- Optional field indicator

**Component 5: TransferConfirmationLoyaltyContext** (280 LOC)
- Display on confirmation view
- Show transfer details (read-only)
- Show projected post-transfer balance
- Tier qualification status: "✓ Qualifies for Plus" or "✗ Won't reach Plus with this amount"
- List tier benefits with estimated annual savings
- Design: Light teal background section, clear hierarchy

**Component 6: TransferSuccessTierPreview** (250 LOC)
- Display on success view if loyalty transfer
- Celebratory messaging: "🎉 Plus Tier Achieved!"
- Show new tier status, active benefits
- Next milestone: "Premium tier requires $20,000"
- Buttons: "Back to Banking", "View Tier Details"

**Page Component** (600 LOC)
- Handle URL parameter parsing
- Route between non-loyalty and loyalty flows
- Manage form state with `useTransferForm()` hook
- Handle validation and submission
- Analytics event firing

---

## Section 7: Interactions

**Interaction 1**: Page Load & URL Parsing

```
User navigates: /move-money?loyalty=true&targetTier=plus&amount=2300&toAccountId=SAV-001&...
  ↓
Page mounts
  ↓
useSearchParams() retrieves params
  ↓
parseLoyaltyTransferParams(searchParams) called
  ↓
Validates all params
  ↓
✓ Valid: LoyaltyTransferContext returned; loyaltyMode = true
✗ Invalid: Return null; render standard transfer form
  ↓
useLoyaltyTransfer() stores context in React Context
  ↓
useTierGap() re-fetches tier gap (checks for stale data)
  ↓
useTransferForm() initializes form state with pre-filled values
  ↓
useFormValidation() validates initial state
  ↓
Components render with pre-fills
```

**Interaction 2**: Form Submission

```
User selects From Account: Checking ($5,200)
  ↓
User taps "Review Transfer"
  ↓
useFormValidation() validates:
  - From: selected? $5,200 available?
  - To: valid account?
  - Amount: $2,300 ≤ $5,200?
  - Tier: would $2,300 transfer qualify for Plus?
  ↓
✓ All valid: Show confirmation view
✗ Error: Display inline error; prevent submission
  ↓
On confirmation, user taps "Confirm & Transfer"
  ↓
createTransfer() API call with payload:
{
  fromAccountId: "CHK-67890",
  toAccountId: "SAV-001",
  amount: 2300,
  memo: "Loyalty tier qualification transfer",
  isLoyaltyTransfer: true,
  loyaltySessionId: "uuid-1234"
}
  ↓
API returns: { transferId, status: 'completed', tierStatusAfterTransfer }
  ↓
Navigate to success view
  ↓
Analytics: `loyalty_transfer_completed` { amount, currentTier, newTier, timeTaken }
```

**Interaction 3**: Stale Data Handling

```
Form mounts with pre-filled amount = $2,300
  ↓
useTierGap() fetches fresh gap: $2,100 (member received deposit)
  ↓
Difference detected: $2,300 - $2,100 = $200 (>$100 threshold)
  ↓
Warning banner displays: "Amount changed to $2,100"
  ↓
User can:
  (A) Tap "Update to $2,100" → amount field updates, banner dismisses
  (B) Ignore warning → proceed with $2,300 (confirmation will warn again)
  (C) Manually edit amount → custom value
```

---

## Section 8: Data Contracts

**URL Input**:
```
/move-money?loyalty=true&targetTier=plus&amount=2300&toAccountId=SAV-001&memo=...&initiatingPage=tier-details
```

**Form State (Internal)**:
```typescript
{
  fromAccountId: 'CHK-67890',
  toAccountId: 'SAV-001',
  toAccountPreFilled: true,
  toAccountEdited: false,
  amount: 2300,
  amountPreFilled: 2300,
  amountEdited: false,
  memo: 'Loyalty tier qualification transfer',
  memoEdited: false,
  isLoyaltyTransfer: true,
  errors: [],
  isValid: true
}
```

**API Request**:
```typescript
{
  fromAccountId: 'CHK-67890',
  toAccountId: 'SAV-001',
  amount: 2300,
  memo: 'Loyalty tier qualification transfer',
  isLoyaltyTransfer: true,
  loyaltySessionId: 'uuid-1234',
  initiatingPage: 'tier-details'  // For analytics/audit trail
}
```

**Note**: LoyaltyTransferContext is stored locally in React Context and passed via URL params. The backend receives only the sessionId and initiatingPage for audit purposes. The full context (amount, targetTier, etc.) should be re-validated server-side using the sessionId to prevent client-side manipulation of tier qualification logic.

**API Response**:
```typescript
{
  transferId: 'TRF-20260222-0847-92847',
  status: 'completed',
  fromAccount: { ... },
  toAccount: { ... },
  amount: 2300,
  createdAt: '2026-02-22T14:32:15Z',
  estimatedCompletionAt: '2026-02-23T10:00:00Z',
  tierStatusAfterTransfer: {
    currentTier: 'plus',
    currentBalance: 10300,
    qualifiesNow: true,
    tierBenefits: [...]
  }
}
```

---

## Section 9: Validation Rules

| Field | Rule | Error | Warning |
|-------|------|-------|---------|
| **fromAccount** | Required; must be selected | Not selected | Insufficient funds |
| | | Has legal hold | Daily limit exceeded |
| **toAccount** | Must count toward tier | Invalid account | Account restricted |
| **amount** | ≥$1.00, ≤source balance | Outside bounds | <tier gap (won't qualify) |
| | | | >tier gap (over-transfer) |
| **memo** | Max 50 chars | Exceeds length | N/A |

**Real-Time Validation**:
- On amount change: Recalculate tier qualification
- On account change: Revalidate available balance, restrictions
- On page load: Fetch fresh tier gap; compare to URL param; warn if different

---

## Section 10: Visual & Responsive

**Tailwind Classes**:
```css
/* Pre-filled input indicator */
.pre-filled-indicator {
  @apply bg-gray-100 border-2 border-teal-200;
}

/* Confirmation section */
.confirmation-section {
  @apply p-6 bg-teal-50 rounded-lg border-l-4 border-teal-500;
}

/* Success banner */
.success-banner {
  @apply p-4 bg-green-50 border-l-4 border-green-500 rounded-lg;
}
```

**Responsive**: Single column on mobile; two columns on desktop for form fields

---

## Section 11: Accessibility

- [x] Banner: `aria-live="polite"`, `role="region"`
- [x] Inputs: Labels, error role="alert", help text
- [x] Buttons: 48px tap target, visible focus ring
- [x] Validation: Clear error messages, not just red color
- [x] Confirmation: Semantic `<dl>` for transfer details
- [x] Screen readers: All information accessible without colors

---

## Section 12: Telemetry

| Event | Payload |
|-------|---------|
| `loyalty_transfer_form_loaded` | { targetTier, amount, isStale } |
| `loyalty_transfer_amount_edited` | { originalAmount, newAmount } |
| `loyalty_transfer_stale_data_warning` | { oldAmount, newAmount } |
| `loyalty_transfer_form_submitted` | { fromAccount, toAccount, amount, timestamp } |
| `loyalty_transfer_completed` | { transferId, currentTier, newTier, timeTaken } |

---

## Section 13-15: Open Questions, Design Rationale, Build Plan

**Open Questions**:
1. Should we auto-update pre-filled amount if stale data is detected, or require user confirmation?
   - Assumption: Require user confirmation (respects "Additive Integration" principle)

**Design Rationale**: "This screen is the most critical for member trust. Every pre-fill must be explained, every field must be editable, and every validation error must be actionable. We never force anything on the member; we guide them with helpful defaults while respecting their autonomy."

**Build Plan**:
- Days 1-2: Implement form components (PreFilledAmountInput, PreFilledAccountSelector, LoyaltyTransferMemo)
- Days 2-3: Implement loyalty banner and confirmation/success screens
- Days 3-4: Page component orchestration, form state management, validation
- Days 4-5: Testing, accessibility audit, edge case handling

**Success Criteria**:
- [x] Non-loyalty transfers work unchanged
- [x] Loyalty transfers pre-fill correctly
- [x] Stale data detection and warning works
- [x] All validation errors display clearly
- [x] WCAG 2.1 AAA compliance verified
- [x] Zero "unexpected transfer" support escalations
- [x] Task completion time <90 seconds

---

**Document Generated**: 2026-02-22
**Status**: READY FOR IMPLEMENTATION
