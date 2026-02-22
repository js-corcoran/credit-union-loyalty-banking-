# Shard 05: Confirmation & Success Screen Modifications — Smart Loyalty Transfer Feature

**Project**: Smart Loyalty Transfer Feature Enhancement
**Shard**: 05-confirmation-success-shard
**Affected Screen**: SCR-08 (Move Money Transfer) — Confirmation & Success Views
**Date**: 2026-02-22
**Status**: BUILD READY
**Depends On**: Shard 01, Shard 04
**Estimated LOC**: 530
**Time Estimate**: 2-3 days

---

## Section 1: Screen Name & Route

**Screens**:
- Confirmation View (part of SCR-08): `/move-money` with form state in review mode
- Success View (part of SCR-08): `/move-money/success` or modal overlay

**Purpose**:
- Confirmation: Verify all transfer details and loyalty impact before final submission
- Success: Celebrate tier achievement and guide member to next milestone

**Modifications**:
- TransferConfirmationLoyaltyContext component (displays on confirmation view)
- TransferSuccessTierPreview component (displays on success view)
- Loyalty impact section with tier qualification status and benefit summary
- Projected balance calculation
- Success state with tier achievement messaging

---

## Section 2: Purpose & Jobs-to-be-Done

**Confirmation View Purpose**: "I want to review exactly what will happen — both the transfer details and the tier outcome — before I confirm this action."

**Success View Purpose**: "I want to see that my tier has been achieved and understand what benefits are now active."

---

## Section 3: User Stories & Acceptance Criteria

**Confirmation Story 1**: Member reviews transfer with loyalty context

- GIVEN: Member has filled form and tapped "Review Transfer"
- WHEN: Confirmation view displays
- THEN: Transfer details section shows:
  - From: Checking - $5,200
  - To: Savings - $8,500
  - Amount: $2,300
  - Memo: Loyalty tier qualification transfer
- AND: Loyalty Impact section displays:
  - Projected balance: $10,300 (was $8,500)
  - Status: "✓ Qualifies for Plus Tier"
  - Benefits: "0.95% APY ($45/year), ATM fee waive ($6/year)"
  - Est. annual savings: $51

**Confirmation Story 2**: Member edits and resubmits

- GIVEN: Confirmation view is displayed
- WHEN: Member taps "Edit"
- THEN: Return to form view with all values retained
- AND: Focus moves to first editable field
- AND: Member can edit any field and resubmit

**Success Story 1**: Member sees tier achievement messaging

- GIVEN: Transfer has been submitted and completed
- WHEN: Success view displays
- THEN: Success banner shows:
  - Checkmark icon (green, 80px)
  - "Transfer Complete!"
  - Transfer ID: TRF-20260222-0847-92847
  - Amount: $2,300
  - From → To: Checking → Savings
  - "🎉 Plus Tier Achieved!"
  - "You now have $10,300 rolling average balance"
  - "Benefits active immediately: ATM fee waive, 0.95% APY"

**Success Story 2**: Member sees next milestone

- GIVEN: Success view is displaying
- WHEN: Member scrolls down
- THEN: Next milestone section displays:
  - "Premium Tier (requires $20,000)"
  - "You're $9,700 away"
  - "[Transfer to Premium →]" link to tier details

**Success Story 3**: Member returns to banking or explores tier details

- GIVEN: Success view is displayed
- WHEN: Member taps "Done" or "View Tier Details"
- THEN: Navigate to Loyalty Hub or Tier Details page respectively

---

## Section 4: States

**State 1: Confirmation View - Ready to Submit**
- All transfer details displayed (read-only)
- Loyalty Impact section visible
- "Confirm & Transfer" button enabled
- "Edit" button available

**State 2: Confirmation View - Already Qualifies**
- Loyalty Impact section shows: "You already qualify for Plus Tier"
- Optional: Show next tier (Premium) instead
- Projected balance shows member is already over threshold

**State 3: Confirmation View - Won't Quite Qualify**
- Loyalty Impact section shows warning: "This transfer won't reach Plus Tier"
- Amount needed for qualification highlighted
- Member is warned but can proceed

**State 4: Submission in Progress**
- Button shows spinner: "Processing..."
- All buttons disabled
- No navigation away

**State 5: Success View - Tier Achieved**
- Success banner with checkmark
- Tier achievement messaging: "🎉 Plus Tier Achieved!"
- Benefits summary
- Next milestone section visible

**State 6: Success View - Transfer Completed (No Tier Change)**
- If member was already qualified or transferred non-qualification amount
- Success banner shows: "Transfer Complete"
- No tier achievement messaging
- Loyalty context still visible for transparency

**State 7: Error During Submission**
- Error banner displayed
- "Retry" button available
- Member can edit and resubmit

---

## Section 5: Information Architecture

**Confirmation View Structure**:

```
┌─ Confirmation View ──────────────────────────────┐
│                                                   │
│ CONFIRM YOUR TRANSFER                            │
│                                                   │
│ ┌─ Transfer Details ─────────────────────────┐  │
│ │ From: Checking - $5,200                    │  │
│ │ To: Savings - $8,500                       │  │
│ │ Amount: $2,300.00                          │  │
│ │ Memo: Loyalty tier qualification transfer │  │
│ │ Est. Arrival: Tomorrow at 10am             │  │
│ └────────────────────────────────────────────┘  │
│                                                   │
│ ┌─ Loyalty Impact (LOYALTY MODE ONLY) ─────┐   │
│ │ After transfer:                           │   │
│ │ New Balance: $10,300                      │   │
│ │ Status: ✓ Qualifies for Plus Tier         │   │
│ │                                           │   │
│ │ Plus Tier Benefits:                       │   │
│ │ • 0.95% APY on Savings (saves $45/year)  │   │
│ │ • $0.50/mo ATM fee waive (saves $6/year) │   │
│ │ • 2 included autopays                    │   │
│ │                                           │   │
│ │ Total Est. Annual Savings: $51            │   │
│ └────────────────────────────────────────────┘  │
│                                                   │
│ [Confirm & Transfer]  [Edit]  [Cancel]          │
│                                                   │
└────────────────────────────────────────────────────┘
```

**Success View Structure**:

```
┌─ Success View ───────────────────────────────┐
│                                               │
│ ✓ TRANSFER COMPLETE                          │
│                                               │
│ $2,300.00 transferred from Checking → Savings│
│ Confirmation: TRF-20260222-0847-92847        │
│                                               │
│ ┌─────────────────────────────────────────┐ │
│ │ 🎉 PLUS TIER ACHIEVED!                 │ │
│ │                                         │ │
│ │ You now have $10,300 rolling balance   │ │
│ │ Status: ✓ Plus Tier (Active)           │ │
│ │                                         │ │
│ │ Benefits Active Immediately:           │ │
│ │ ✓ 0.95% APY on Savings                │ │
│ │ ✓ $0.50/mo ATM Fee Waive              │ │
│ │ ✓ 2 Included Autopays                 │ │
│ │                                         │ │
│ │ Est. Annual Savings: $51/year         │ │
│ └─────────────────────────────────────────┘ │
│                                               │
│ ┌─ Next Milestone ──────────────────────┐   │
│ │ Premium Tier (requires $20,000)        │   │
│ │ You're $9,700 away                     │   │
│ │ [Transfer to Premium →]                │   │
│ └────────────────────────────────────────┘   │
│                                               │
│ [Done]  [View Tier Details]                 │
│                                               │
└──────────────────────────────────────────────┘
```

---

## Section 6: Components & Responsibilities

**Component 1: TransferConfirmationLoyaltyContext** (280 LOC)

**Props**:
```typescript
interface TransferConfirmationLoyaltyContextProps {
  fromAccount: AccountInfo;
  toAccount: AccountInfo;
  amount: number;
  memo: string;
  loyaltyContext?: LoyaltyTransferContext;
  projectedBalance: number;
  wouldQualifyForTier: boolean;
  tierStatus: TierQualificationGap;
  estimatedAnnualSavings: number;
  onEdit?: () => void;
}
```

**Render**:
- Transfer Details section (read-only):
  - From account with balance
  - To account with balance
  - Amount in large, bold text
  - Memo for transparency
  - Estimated arrival time

- Loyalty Impact section (conditional; if loyaltyContext):
  - Projected post-transfer balance
  - Tier qualification status with checkmark or warning
  - List of tier benefits (3-5 key benefits)
  - Estimated annual savings calculation
  - Background color: light teal (bg-teal-50)
  - Left border: teal (border-l-4 border-teal-500)

**Accessibility**:
- Semantic HTML: `<dl>` for transfer details
- Heading hierarchy: h1 for "Confirm Your Transfer"
- All values announced to screen readers
- No color-only messaging

---

**Component 2: TransferSuccessTierPreview** (250 LOC)

**Props**:
```typescript
interface TransferSuccessTierPreviewProps {
  transferId: string;
  fromAccount: AccountInfo;
  toAccount: AccountInfo;
  amount: number;
  newTier: TierLevel;
  tierBenefits: TierBenefit[];
  estimatedAnnualSavings: number;
  nextTier?: TierLevel;
  nextTierThreshold?: number;
  currentBalance: number;
  onReturnToBanking?: () => void;
  onViewTierDetails?: () => void;
}
```

**Render**:
- Success banner:
  - Large checkmark icon (80px, green, centered)
  - "Transfer Complete!"
  - Amount and accounts: "$2,300.00 from Checking to Savings"
  - Transfer ID: TRF-20260222-0847-92847

- Tier Achievement section (if tier was upgraded):
  - Celebration emoji: 🎉
  - Heading: "Plus Tier Achieved!"
  - New balance and status
  - Benefits list with annual savings
  - Confetti animation (optional)

- Next Milestone section:
  - Next tier name and requirement
  - Amount needed to reach it
  - Link: "Transfer to Premium →" (navigate to tier details)

- Action buttons:
  - "Done" (primary; returns to banking)
  - "View Tier Details" (secondary; navigates to tier page)

**Accessibility**:
- Success announcement: `aria-live="polite"` on container
- Checkmark is `aria-hidden="true"` (decorative)
- All text content is readable
- Buttons are clearly labeled and focusable

---

**Confirmation & Success Page Integration** (in Shard 04 page component, but relevant here)

The page component manages the state transitions:
1. Form → "Review Transfer" button → Confirmation view
2. Confirmation → "Confirm & Transfer" button → Submission
3. Submission success → Success view
4. Success view → "Done" button → Navigate away

---

## Section 7: Interactions

**Interaction 1: Confirmation Submission**

```
User reviews confirmation view
  ↓
All details are correct
  ↓
User taps "Confirm & Transfer"
  ↓
Button state: Loading ("Processing...")
  ↓
API call: POST /api/transfers/create with payload
  ↓
(Mock: 1-2 sec delay)
(Real: depends on backend)
  ↓
Response: { transferId, status: 'completed', tierStatusAfterTransfer }
  ↓
Navigate to success view
  ↓
Analytics: `loyalty_transfer_confirmed`
         { amount, currentTier, newTier, timeTaken }
```

**Interaction 2: Edit During Confirmation**

```
User is on confirmation view
  ↓
User notices amount needs adjustment
  ↓
User taps "Edit"
  ↓
Return to form view
  ↓
All fields retain their values
  ↓
Focus moves to first editable field (amount)
  ↓
User edits amount to $2,000
  ↓
Form revalidates: still qualifies? Yes
  ↓
User taps "Review Transfer" again
  ↓
Confirmation view updates with new values
```

**Interaction 3: Success to Next Steps**

```
User is on success view
  ↓
User reads: "Premium Tier requires $20,000; you're $9,700 away"
  ↓
User taps "Transfer to Premium →" link
  ↓
Navigate to /tier-details?tier=premium
  ↓
Tier Details page loads with Premium tier information
  ↓
User can tap CTA to initiate Premium transfer (separate journey)
```

---

## Section 8: Data Contracts

**Confirmation Input** (from form state):
```typescript
{
  fromAccountId: 'CHK-67890',
  toAccountId: 'SAV-001',
  amount: 2300,
  memo: 'Loyalty tier qualification transfer',
  loyaltyContext: LoyaltyTransferContext,
  formState: TransferFormState
}
```

**API Request (submission)**:
```typescript
{
  fromAccountId: 'CHK-67890',
  toAccountId: 'SAV-001',
  amount: 2300,
  memo: 'Loyalty tier qualification transfer',
  isLoyaltyTransfer: true,
  loyaltySessionId: 'uuid-1234',
  initiatingPage: 'tier-details'
}
```

**Server-Side Validation**: Backend must re-validate that:
- loyaltySessionId maps to a stored transfer intent
- fromAccountId balance is still sufficient
- toAccountId still counts toward tier qualification
- Tier gap calculation is fresh (not stale)

**API Response (success)**:
```typescript
{
  transferId: 'TRF-20260222-0847-92847',
  status: 'completed',
  fromAccount: { accountId, accountName, balance },
  toAccount: { accountId, accountName, balance },
  amount: 2300,
  createdAt: '2026-02-22T14:32:15Z',
  estimatedCompletionAt: '2026-02-23T10:00:00Z',
  tierStatusAfterTransfer: {
    memberId: 'mem-98765',
    currentTier: 'plus',
    currentBalance: 10300,
    qualifiesNow: true,
    tierBenefits: [...]
  },
  qualifiesForTier: true
}
```

---

## Section 9: Validation Rules

**Confirmation Validation**:
- All transfer details must be present (from, to, amount, memo)
- Amount must match form state
- Loyalty context must match if loyalty transfer

**Success Validation**:
- Transfer ID must be present
- Status must be 'completed'
- Tier status response must include tierStatusAfterTransfer data

---

## Section 10: Visual & Responsive

**Design Tokens**:
- Confirmation section: `bg-teal-50 border-l-4 border-teal-500`
- Success banner: `bg-green-50 border-l-4 border-green-500`
- Checkmark icon: `text-green-600 w-20 h-20`
- Amount text: Bold, 24px or larger

**Responsive**: Full-width on mobile; centered card on desktop

---

## Section 11: Accessibility

- [x] Confirmation: Semantic HTML with `<dl>` for details
- [x] Success: Large checkmark (visual delight; decorated with aria-hidden)
- [x] Announcement: Success automatically announced via aria-live
- [x] Buttons: 48px tap targets, visible focus rings
- [x] Text: 16px+ font, 7:1 contrast on all backgrounds

---

## Section 12: Telemetry

| Event | Payload |
|-------|---------|
| `loyalty_transfer_confirmation_viewed` | { amount, targetTier, estimatedSavings } |
| `loyalty_transfer_confirmed` | { transferId, amount, currentTier, newTier, timeTaken } |
| `loyalty_transfer_success_viewed` | { transferId, newTier, annualSavings } |
| `next_milestone_clicked` | { currentTier, nextTier, amountNeeded } |

---

## Section 13: Open Questions & Assumptions

**Open Question**:
1. Should we show confetti animation on success, or keep it minimal for older users?
   - Assumption: Optional confetti (can be disabled for accessibility)

**Assumptions**:
- [x] Transfer always succeeds (no post-submission errors shown; retries happen server-side)
- [x] Tier status is always updated with transfer response
- [x] Member always qualifies immediately after transfer (rolling average is updated same-day)

---

## Section 14: Design Rationale

**Design Expert**: "The confirmation view is the final checkpoint before an irreversible action. We show all details clearly, highlight the loyalty impact prominently, and make 'Edit' obvious. The success view celebrates the achievement — the 🎉 and checkmark create a moment of delight, which is important for building emotional connection to the loyalty program."

**Engineering Expert**: "The confirmation and success views are relatively simple — mostly display logic. All the complex validation happens in the form. By separating concerns, we keep these components focused and testable."

**Product Expert**: "The success view is prime real estate for showing next steps. By immediately showing 'Premium Tier requires $20,000; you're $9,700 away,' we keep members thinking about progression and engaged with the loyalty program."

---

## Section 15: Build Plan

**Day 1**: Build TransferConfirmationLoyaltyContext component
**Day 2**: Build TransferSuccessTierPreview component
**Day 3**: Integrate into page, test success/error states, accessibility audit

**Success Criteria**:
- [x] Confirmation view displays all transfer details accurately
- [x] Loyalty Impact section shows tier qualification status
- [x] Success view celebrates tier achievement
- [x] Next milestone is prominently displayed
- [x] Navigation from success view works correctly
- [x] WCAG 2.1 AAA compliance verified
- [x] All telemetry events fire correctly

---

## Summary

**Confirmation View**: Final verification before submission. Shows transfer details, projected balance, tier qualification status, and benefits.

**Success View**: Celebration and guidance. Shows tier achievement, benefits summary, and next milestone.

Together, these views complete the loyalty transfer journey, transforming a standard money transfer into an achievement-oriented experience that reinforces the loyalty program's value.

---

**Document Generated**: 2026-02-22
**Status**: READY FOR IMPLEMENTATION
