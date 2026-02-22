# Shard 11: Transfer Confirmation

**Build Priority**: P1 — Critical banking flow enhancement
**Estimated Effort**: 12 hours
**Screen ID**: SCR-11
**Route**: `/transfer/confirm`
**Component File**: `app/transfer/confirm/page.tsx`

---

## 1. Screen Name & Route

**Full Screen Name**: Transfer Confirmation with Fee Waiver Display
**URL Route**: `/transfer/confirm`
**Navigation Access**: Transfer Initiation (SCR-10) → Confirm
**Page Title**: "Confirm Transfer"
**Breadcrumb**: Home > Transfer > Confirm
**Auth Requirements**: Authenticated member with access to source account

---

## 2. Purpose & Jobs-to-be-Done

**Primary Purpose**: Final confirmation screen for transfer/move money transactions, displaying standard transfer details alongside real-time fee waiver benefit context based on member's loyalty tier. Must show tangible dollar savings from fee waivers and support immediate comprehension of tier benefit value.

**Jobs-to-be-Done**:
1. **Verify transaction details** — Member needs to confirm from/to accounts, amount, and timing before irreversible commit
2. **Understand fee impact** — Member wants to see real fee savings from loyalty tier before confirming
3. **Build confidence in tier value** — Member sees concrete "$X saved" at moment of transaction completion, reinforcing loyalty program authenticity
4. **Complete transaction securely** — Member confirms or cancels with clear error recovery path

**Design Principle Applied**: "Real-Dollar Benefit Visualization" — Show actual fee waived (vs. standard fee) in prominent callout; "Contextual Integration" — Loyalty benefit appears naturally within standard banking flow without disruption.

---

## 3. User Stories & Acceptance Criteria

### Story 1: Member Confirms Transfer with Fee Waiver Recognition

**As a** loyalty-tier member (PERSONA-01 or PERSONA-02)
**I want to** see my fee waiver benefit applied before confirming a transfer
**So that** I immediately recognize the concrete value my tier provides

**Given** I've entered transfer details (from account, to account, amount) on SCR-10
**When** I click "Confirm" and arrive at `/transfer/confirm`
**Then** I see:
- Standard confirmation section: From account (e.g., "Checking - $15,000"), To account (e.g., "Savings - $8,500"), Amount ($2,500), Date/Time
- **NEW**: Prominent fee waiver callout with:
  - Checkmark icon (green) indicating benefit applied
  - Bold text: "Your Plus tier saves you $2.50"
  - Strikethrough standard fee ($2.50) in gray, $0.00 in green checkmark style
  - Explanation: "Fee-free transfers included with your tier"
- Primary action: "Confirm Transfer" (48×48px CTA button, color-coded to tier)
- Secondary action: "Cancel" or "Edit Details"

**And** the fee waiver section is placed prominently above the confirm button, with high contrast (7:1) so member can't miss it

---

### Story 2: Member Without Fee Waiver Sees Motivation to Upgrade

**As a** non-qualifying member (PERSONA-01, PERSONA-03)
**I want to** see what fee I'd avoid with a higher tier
**So that** I understand the tier progression incentive

**Given** I'm a Classic tier member initiating a transfer (fee applies)
**When** I reach confirmation screen
**Then** I see:
- Standard confirmation section (unchanged)
- **NEW**: Fee context callout (non-waived path):
  - Yellow alert icon (not alarming, informational)
  - Text: "This transfer costs $2.50"
  - Supportive text: "With Plus tier, you'd save $2.50 on transfers. You're $3,000 away from Plus — consider transferring more to your savings."
  - Optional CTA: "Learn about Plus tier" → `/loyalty/tier-details`
- Primary action: "Confirm Transfer" (proceeds with fee)
- Secondary action: "Cancel"

**And** the tone is supportive, not punitive; no artificial urgency or dark patterns

---

### Story 3: Member Confirms Transfer Successfully

**As a** member completing a transfer
**I want to** confirm my transfer and receive confirmation of success
**So that** I know the transaction was processed correctly

**Given** I'm on the transfer confirmation screen
**When** I click "Confirm Transfer"
**Then** the system:
- Disables confirm button (prevents double-click)
- Shows loading state: "Processing transfer..."
- Submits transfer request to backend
- On success: Navigate to success screen (or close modal if modal-based) with:
  - Checkmark icon
  - "Transfer complete" message
  - Transaction receipt: From, To, Amount, Fee (with waiver applied if applicable), Timestamp
  - CTA: "Return to accounts" or "View transfer details"
- On error: Stay on confirmation screen, display error message with retry option

**And** no data is lost if user navigates back during processing

---

### Story 4: Member Encounters Error During Confirmation

**As a** member experiencing a failed transfer attempt
**I want to** understand what went wrong and how to retry
**So that** I can complete my transaction or seek help

**Given** I click "Confirm Transfer" and the system encounters an error (insufficient funds, system timeout, etc.)
**When** the transfer processing fails
**Then** I see:
- Error state screen with clear error message: "Unable to process transfer: [specific reason]"
- Explanation text: "Your account may not have sufficient funds, or a system error occurred."
- Retry button: "Try Again" (maintains all entered details)
- Alternative: "Cancel and Edit Details" (return to form)
- Support CTA: "Contact Support" → Help page

**And** all form data is preserved so member doesn't re-enter details

---

## 4. States

### Default State
- Confirmation screen fully loaded with transfer details
- Fee waiver callout visible (if applicable) showing real-dollar savings
- Standard confirmation section with from/to accounts, amount, timestamp
- Primary "Confirm Transfer" button enabled and ready for interaction
- All text clearly visible, high contrast, readable

### Loading State
- Primary button shows spinner + "Processing..." text
- Button disabled (prevent double-click)
- Screen background slightly dimmed
- "Please do not close this window" message (if applicable)
- Loading state expected duration: 1–5 seconds for typical transfer
- Spinner is indefinite animation (no progress bar)
- Timeout handling: After 30 seconds without response, show error state with retry option

### Success State
- **Shard 11 Scope Clarification**: Shard 11 is the confirmation page; success handling is as follows:
  - Option A (In-Page Success): Show success state as new view within `/transfer/confirm` route; no page navigation
    - Display: "Transfer Complete" heading, confirmation number, receipt details, CTAs
    - Allow user to stay on confirmation page and navigate to accounts/home via CTA
  - Option B (Separate Success Page): Navigate to `/transfer/success` route with receipt display
- Recommended: Option A (in-page success) to reduce route complexity
- Receipt displayed: From account, To account, Amount, Fee (with waiver applied if applicable), Timestamp, Confirmation number
- Fee waiver callout remains visible: "You saved $2.50 with your loyalty tier"
- CTA to return to accounts (`/accounts`) or view transaction details (`/transactions/[id]`)

### Error State
- Error message displayed prominently: "Transfer Failed"
- Specific error reason: "Insufficient funds" or "System timeout"
- All entered details preserved
- Retry button and Cancel button available
- Support contact CTA

### Permission Denied State
- User not authenticated: Redirect to login
- User lacks permission to transfer from account: "You don't have permission to transfer from this account"

### Offline State
- "You're offline. Cannot complete transfer now."
- Save draft: "Save this transfer to complete later?"
- Option to save and sync when connection restored

---

## 5. Information Architecture

### Visual Regions (Top to Bottom)

**Header Region**:
- Page title: "Confirm Transfer" (20pt Bold)
- Breadcrumb: Home > Transfer > Confirm (optional, mobile may omit)

**Transfer Details Region** (standard banking, unchanged):
- Section heading: "Transfer Details"
- From Account card: Account type (e.g., "Checking"), Account name/number, Current balance (grayed)
- Transfer arrow icon
- To Account card: Account type, Account name/number
- Amount: Large text (24pt Bold), prominent "$2,500.00"
- Date/Time: "Today, 2:45 PM" or "Scheduled for [future date]"

**Fee Impact Region** (loyalty benefit highlight):
- Section heading: "Your Fee"
- **If fee-waived** (member qualifies):
  - Green checkmark icon (48×48px)
  - Bold text (18pt): "Your Plus tier saves you $2.50"
  - Standard fee strikethrough: "Fee $2.50" (gray strikethrough text)
  - Actual fee in green: "$0.00" (18pt Bold)
  - Explanation: "Fee-free transfers are included with your tier"
  - Optional: "Learn more" link → `/loyalty/benefits` (tertiary style)
- **If fee applies** (member doesn't qualify):
  - Alert icon (yellow, non-threatening)
  - Text (16pt): "This transfer costs $2.50"
  - Fee amount: "$2.50" (16pt Bold)
  - Supportive text: "With Plus tier, you'd save this fee. You're $3,000 away from Plus — [CTA]"
  - Optional CTA: "See how to reach Plus" → `/loyalty/tier-details`

**Action Region**:
- Primary CTA: "Confirm Transfer" button (full-width mobile, auto-width desktop)
  - Button size: ≥48×48px tap target
  - Background: Tier-specific color (Plus: #D4A574, Premium: #E8E8E8, Classic: #6B7280)
  - Text: White, 16pt Bold
  - Hover state: Darker shade of tier color
  - Disabled state: Gray, pointer-events: none
- Secondary CTA: "Cancel" or "Edit Details" link (below primary, tertiary style)

**Security/Compliance Region** (optional):
- Small text (12pt): "Your transfer is secure. We use encryption to protect your information."

### Content Priority

1. **Transfer Details** — Confirmation of from/to accounts, amount
2. **Fee Impact** — Real-dollar savings or cost
3. **Confirmation Action** — Clear path to commit
4. **Support/Help** — Secondary if member needs assistance

### Progressive Disclosure

- Confirmation screen shows essential fee context
- Detailed benefit rules available via "Learn more" link to Loyalty Hub
- No third-level navigation required; one-click access to contextual help

---

## 6. Components & Responsibilities

### Component Tree

```
Page (app/transfer/confirm/page.tsx) — Server Component
├── Header (from layout)
├── TransferDetailsRegion (Client)
│   ├── Heading "Transfer Details"
│   ├── FromAccountCard
│   │   ├── Account type icon
│   │   ├── Account name/number
│   │   └── Current balance (grayed)
│   ├── TransferArrowIcon
│   ├── ToAccountCard
│   │   ├── Account type icon
│   │   ├── Account name/number
│   ├── AmountDisplay (24pt bold)
│   └── DateTimeDisplay
├── FeeImpactRegion (Client) — NEW
│   ├── Heading "Your Fee"
│   └── FeeWaiverCallout (variant: waived OR not-waived)
│       ├── Icon (checkmark if waived, alert if not)
│       ├── Bold savings text
│       ├── Fee display (strikethrough standard, bold actual)
│       ├── Explanation text
│       └── Optional "Learn more" link
├── ActionRegion (Client)
│   ├── PrimaryButton "Confirm Transfer"
│   ├── SecondaryButton "Cancel"
│   └── TertiaryLink "Edit Details"
├── SecurityMessageRegion (optional)
│   └── Small security disclaimer text
└── Footer (from layout)
```

### Component Responsibilities

**FeeImpactRegion** (NEW):
- Props: `memberTier`, `feeAmount`, `isFeeWaived`, `balanceGapToNextTier`
- Responsibility: Display fee waiver benefit or fee cost with tier-appropriate messaging
- Variants: `waived` (green checkmark, savings), `not-waived` (alert, upgrade incentive)
- Accessibility: `aria-label="Fee impact of this transfer: [waived/charged]"`

**FeeWaiverCallout** (NEW):
- Props: `variant`, `feeAmount`, `tier`, `balanceGap`
- Responsibility: Render fee waiver or non-waiver callout with appropriate messaging
- Used in: SCR-11 (transfer confirmation)

**Page (app/transfer/confirm/page.tsx)**:
- Responsibility: Fetch transfer details from session, fetch member tier, render all regions
- Server-side: Fetch `getMemberTier()`, retrieve transfer session data
- Error handling: If transfer data missing or tier fetch fails, show error state

---

## 6.5. Form-Confirmation Data Handoff (Shard 10 → Shard 11)

**CRITICAL SPECIFICATION** — Shard 11 (confirmation) receives data from Shard 10 (form) and manages data persistence during confirmation flow and back-navigation.

**Data Reception (Shard 10 → Shard 11)**:
- Shard 10 form submits with validation; if valid, navigates to `/transfer/confirm`
- Shard 11 receives transfer data via:
  - **React Context API** (preferred): Retrieves `TransferSession` from `TransferContext` provider
  - **URL State** (alternative): Retrieves encrypted token from query param and decrypts
- If no data received: Redirect to `/transfer` with message "Transfer session expired. Please start over."

**Data Storage During Confirmation Flow**:
- Data persisted in Context (memory) or URL state; not committed to backend until "Confirm Transfer" button clicked
- Session timeout: 24 hours from initial form submission
- Tab close: Data is lost (if Context-based) or recoverable via browser history (if URL-based)

**Back-Navigation (Edit Details)**:
- User clicks "Edit Details" button on confirmation screen
- Navigate back to `/transfer` with all form data preserved
- Shard 10 form loads with pre-filled values from Context/URL
- User can edit any field and click "Review Transfer" again
- Data is updated in Context/URL
- User re-navigates to confirmation screen (`/transfer/confirm`)
- Shard 11 loads with updated data

**Session Refresh Handling**:
- If user refreshes confirmation page while on `/transfer/confirm`:
  - **Context-based**: Data is lost; browser navigates to `/transfer` with redirect message
  - **URL-based**: Data is preserved in URL; page reloads with same data
- If user uses browser back button:
  - Returns to form page (`/transfer`) with data preserved (if URL-based)
  - Or shows redirect to form (if Context-based)

**Data Validation at Confirmation**:
- Shard 11 receives transfer data from Shard 10
- Before displaying confirmation, Shard 11 should:
  1. Validate data is still current (check tier hasn't changed)
  2. Re-fetch member tier info from server (in case tier changed since form)
  3. Recalculate fee waiver eligibility based on current tier
  4. If tier changed: Display alert "Your tier status changed. Please review." and recalculate fee impact
- This prevents displaying stale fee information

**TypeScript Interface** (shared between Shards 10 and 11):
```typescript
export interface TransferSession {
  id: string;  // Unique session ID
  formData: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    memo?: string;
  };
  createdAt: Date;
  expiresAt: Date;  // 24 hours from creation
  memberTier: "classic" | "plus" | "premium";
  feeWaiverApplied: boolean;
  normalFee: number;
  actualFee: number;  // $0 if waived, normalFee otherwise
  lastValidatedAt: Date;  // When tier was last fetched
}
```

---

## 7. Interactions

### Click Interactions

**"Confirm Transfer" Button**:
- Click → Disable button, show loading spinner
- Submit transfer request to backend
- On success: Navigate to success screen or show success banner
- On error: Display error state, re-enable button for retry

**"Cancel" Button**:
- Click → Navigate back to transfer initiation form (SCR-10)
- Preserve form data in case member wants to retry

**"Edit Details" Button**:
- Click → Navigate back to `/transfer` (Shard 10 form)
- All form fields pre-filled with current transfer data (from account, to account, amount, memo)
- Data retrieved from Context or URL state
- User can modify any field
- Upon "Review Transfer" click, updated data is validated and confirmation screen reloads with new data

**"Learn more" Link** (in fee context):
- Click → Navigate to `/loyalty/benefits` or `/loyalty/tier-details`

### Keyboard Navigation

- **Tab order**: Transfer details → Amount → Date → Confirm button → Cancel link
- **Enter**: Activate confirm button
- **Escape**: Cancel (optional; secondary path via Cancel button)

### Touch Interactions (Mobile)

- **Confirm button tap**: ≥48×48px target, clear visual feedback
- **Fee callout**: Static display, no interaction

### Focus Management

- **Page load**: Focus moves to confirm button (primary action)
- **Error state**: Focus moves to error message heading for screen reader announcement
- **Success**: Navigation to success page; focus managed per success screen

---

## 8. Data Contracts

### Transfer Session Data (from SCR-10)

```json
{
  "transferSessionId": "TXN-20260221-001",
  "fromAccount": {
    "accountId": "CHK-9876",
    "accountType": "Checking",
    "accountName": "My Checking",
    "balance": 15000.00
  },
  "toAccount": {
    "accountId": "SAV-5432",
    "accountType": "Savings",
    "accountName": "Emergency Fund",
    "balance": 8500.00
  },
  "amount": 2500.00,
  "scheduledDate": "2026-02-21",
  "feeApplicable": 2.50,
  "notes": ""
}
```

### GET /api/member/:memberId/tier-for-transfer

**Response** (HTTP 200 OK):
```json
{
  "memberId": "MEMBER-001",
  "currentTier": "plus",
  "feeWaiverBenefit": {
    "available": true,
    "transferFeeWaiverAmount": 2.50,
    "description": "Fee-free transfers included with Plus tier"
  },
  "nextTierThreshold": {
    "tier": "premium",
    "minimumBalance": 25000,
    "currentBalance": 23500,
    "balanceGap": 1500
  }
}
```

### TypeScript Service Facade

```typescript
export async function getTierForTransfer(
  memberId: string
): Promise<TierForTransferResponse> {
  const response = await fetch(`/api/member/${memberId}/tier-for-transfer`);
  if (!response.ok) throw new Error("Failed to fetch tier for transfer");
  return response.json();
}

export async function submitTransfer(
  transferData: TransferRequest
): Promise<TransferResponse> {
  const response = await fetch("/api/transfer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transferData)
  });
  if (!response.ok) throw new Error("Transfer failed");
  return response.json();
}

interface TierForTransferResponse {
  memberId: string;
  currentTier: "classic" | "plus" | "premium";
  feeWaiverBenefit: {
    available: boolean;
    transferFeeWaiverAmount: number;
    description: string;
  };
  nextTierThreshold: TierThreshold;
}

interface TransferRequest {
  transferSessionId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  scheduledDate: string;
}

interface TransferResponse {
  transactionId: string;
  status: "completed" | "scheduled" | "pending";
  timestamp: string;
  feeApplied: number;
  feeWaiverApplied: number;
}
```

### Mock Data

```typescript
const mockTierForTransfer: TierForTransferResponse = {
  memberId: "MEMBER-001",
  currentTier: "plus",
  feeWaiverBenefit: {
    available: true,
    transferFeeWaiverAmount: 2.50,
    description: "Fee-free transfers included with Plus tier"
  },
  nextTierThreshold: {
    tier: "premium",
    minimumBalance: 25000,
    currentBalance: 23500,
    balanceGap: 1500
  }
};
```

---

## 9. Validation Rules

- **Transfer amount**: Must be >0, ≤ from account balance
- **From/To accounts**: Must be different accounts, must belong to member
- **Scheduled date**: Must be today or future date (no backdated transfers)
- **Fee calculation**: Fee only applies if member tier does NOT qualify for fee waiver
- **Tier status**: Must be validated at confirmation time (not at initiation) in case tier changed
- **Session data integrity**: Transfer session must exist and match current request

---

## 10. Visual & Responsive Rules

### Design Tokens

**Colors**:
- Fee waiver background: #F0FDF4 (very light green)
- Fee waiver icon: #10B981 (success green, 7:1 contrast)
- Savings amount text: #10B981 (bold, scannable)
- Standard fee (strikethrough): #9CA3AF (gray, 6:1 contrast)
- Button (Plus tier): #D4A574 (tier color)
- Button disabled: #9CA3AF (gray)

**Typography**:
- Page title: 20pt Bold
- Amount: 24pt Bold
- Fee amount: 18pt Bold
- Fee explanation: 14pt Regular
- Button text: 16pt Bold, white

**Spacing**:
- Section padding: 20px
- Fee callout padding: 16px (internal)
- Button margin top: 24px

### Responsive Breakpoints

**Mobile (320px–479px)**:
- Single-column layout
- Account cards stack vertically
- Transfer arrow full-width
- Fee callout full-width
- Button full-width (48px height)

**Tablet (480px–1024px)**:
- Account cards may display side-by-side if space allows
- Fee callout full-width
- Button ~50% width or full-width if touch-optimized

**Desktop (1025px+)**:
- Account cards side-by-side with arrow between
- Fee callout full-width below details
- Button auto-width with min 200px
- Container max-width: 600px

---

## 11. Accessibility Checklist

- Transfer details: Semantic structure with clear headings
- Amount: Large text (24pt), 7:1 contrast
- Fee callout: `aria-live="polite"` region for screen reader announcement
- Fee icon: `aria-label="Fee waived"` or `"Fee applies: $2.50"`
- Button: Semantic `<button>`, ≥48×48px tap target, visible focus indicator (2px outline)
- Links: Underline or icon supplement (not color alone)
- Color contrast: All text ≥7:1 against background
- Focus order: Logical (details → fee → button → cancel)

---

## 12. Telemetry

- `event: "transfer_confirm_view"` — Page load
  - `properties: { fromAccountType, toAccountType, amount, tier, feeWaiverApplied }`
- `event: "fee_waiver_displayed"` — Fee waiver callout visible
  - `properties: { tier, feeAmount, waived: boolean }`
- `event: "transfer_confirmed"` — User clicked confirm
  - `properties: { amount, fee, feeWaiverApplied, tier }`
- `event: "transfer_completed"` — Transfer successful
  - `properties: { transactionId, amount, feeWaived }`
- `event: "transfer_failed"` — Transfer failed
  - `properties: { errorReason, amount }`

---

## 13. Open Questions & Assumptions

1. **Fee Waiver Messaging**: Should fee waiver callout always display (even for Classic tier with fee), or only display when fee-waived OR approaching next tier? (Current: Always display to maintain transparency)
2. **Scheduled vs. Immediate**: Does system support scheduled transfers? If yes, should fee waiver status be confirmed at scheduling time or execution time? (Assumption: Real-time at confirmation; if future-dated, include caveat "Fee waiver status at time of transfer execution")
3. **Insufficient Funds Error**: Should system prevent confirmation if from account lacks sufficient balance? (Assumption: Client-side validation + server-side redundancy)

---

## 14. Design Rationale (Three-Experts Synthesis)

**UX Lead**: Confirmation screen mirrors standard banking flow with fee context layered naturally. Real-dollar fee savings visualized at moment of transaction commitment drives engagement and loyalty program credibility. Fee callout is primary driver of perceived program value.

**Frontend Architect**: Page receives transfer session from prior screen; fetches tier data server-side; FeeWaiverCallout component encapsulates waiver logic. Loading state prevents race conditions during submission.

**Product/Delivery**: Fee waiver demonstration on confirmation screen is primary driver of perceived program value (vs. abstract tier concepts). Telemetry tracks fee-waived confirmations to measure engagement and inform tier incentive structure.

---

## 15. Cursor-Claude Ready Build Plan

### File Structure

```
app/transfer/confirm/
├── page.tsx                    # Transfer confirmation (server)

components/banking/
├── FeeImpactRegion.tsx         # NEW — Conditional fee waiver display
├── FeeWaiverCallout.tsx        # NEW — Waived fee display (icon, savings)
└── TransferConfirmation.tsx    # NEW — Action region

lib/
├── api.ts                      # Add getTierForTransfer(), submitTransfer()
```

### Test Stubs

```typescript
describe("Transfer Confirmation (SCR-11)", () => {
  test("displays fee waiver when member qualifies", () => {
    // Render with Plus tier member
    // Assert: Fee waiver callout visible with green checkmark
    // Assert: Savings amount displayed ("You save $2.50")
  });

  test("displays fee charge when member doesn't qualify", () => {
    // Render with Classic tier member
    // Assert: Fee charge callout visible
    // Assert: Fee amount displayed ("This costs $2.50")
    // Assert: Upgrade incentive visible
  });

  test("submits transfer and handles success", async () => {
    // Click "Confirm Transfer"
    // Assert: Button disabled, loading spinner shown
    // Wait for API response
    // Assert: Navigate to success page
  });

  test("handles transfer error with retry", async () => {
    // Mock API to return error
    // Click "Confirm Transfer"
    // Assert: Error message displayed
    // Assert: Retry button available
  });
});
```

---

✅ **SHARD 11 COMPLETE — Transfer Confirmation Ready for Build**
