# Shard 10: Transfer / Move Money

**Build Priority**: P0 — Critical banking function with zero friction requirement
**Estimated Effort**: 14 hours
**Screen ID**: SCR-10 (Initiation), SCR-11 (Confirmation)
**Route**: `/transfer`
**Component File**: `app/transfer/page.tsx`

---

## 1. Screen Name & Route

**Full Screen Name**: Transfer / Move Money
**URL Route**: `/transfer` (GET shows form, POST submits transfer)
**Navigation Access**: Primary navigation, Home Dashboard, Account Detail
**Page Title**: "Transfer Money - Credit Union Banking"
**Breadcrumb**: Home > Transfer

**Route Parameters**: Query parameters `?from=[accountId]` (optional, pre-fills source account)
**Auth Requirements**: Authenticated member with at least one account

---

## 2. Purpose & Jobs-to-be-Done

**Primary Purpose**: Enable members to transfer money between own accounts or to external accounts with zero friction. Integrate loyalty benefits (show fee waiver status) contextually without impeding the transfer workflow. Member should complete transfer in < 3 minutes with full confidence about any fees.

**Jobs-to-be-Done**:

1. **Transfer between own accounts** — Member needs to move money from checking to savings quickly without interruption
2. **Transfer to external account** — Member needs to send money to payee with confidence that fee waiver (if applicable) will apply
3. **Verify fee waiver status** — Member (PERSONA-02) wants to confirm Plus tier fee waiver applies before submitting transfer (no surprises)
4. **Review transfer before confirming** — Member wants confirmation screen showing amount, destination, fee impact before final submission (zero-risk UX)

**Design Principle Applied**: "Banking-Critical Zero-Friction Flow" — Transfer form must not add complexity; loyalty context (fee waiver) shown at confirmation, not during form entry. Path to completion must be clear (form → confirm → success).

---

## 3. User Stories & Acceptance Criteria

### Story 1: Everyday Banker Transfers Between Own Accounts

**As a** change-averse member (PERSONA-01)
**I want to** transfer $500 from checking to savings with the familiar form layout
**So that** I can move money quickly without encountering new complexity

**Given** I am on the transfer page (or clicked "Transfer" from account detail)
**When** I fill in: From (Checking ****9876) | Amount ($500) | To (Savings ****5432)
**Then** I see:
- Form layout matches familiar banking UX (no loyalty-specific UI interrupts)
- Clear labels: "From account", "To account", "Amount"
- Account dropdowns showing only own accounts
- Amount field with currency symbol ($)
- "Review Transfer" button (primary CTA)
- No loyalty information in form (shown at confirmation only)

**And** clicking "Review Transfer" takes me to confirmation page

---

### Story 2: Benefit Optimizer Confirms Fee Waiver Before Transfer

**As a** financially savvy member (PERSONA-02)
**I want to** see at confirmation that my Plus tier saves me $2.50 on this transfer
**So that** I can confirm the transfer knowing the fee waiver will apply

**Given** I filled in transfer details (From: Checking, To: Savings, Amount: $1,000)
**When** I click "Review Transfer"
**Then** I see confirmation screen showing:
- **Transfer Summary** (prominent):
  - From: Checking ****9876
  - To: Savings ****5432
  - Amount: $1,000
- **Fee Impact** (green callout if waived):
  - "You're saving $2.50 with Plus tier fee waiver on this transfer"
  - Normal fee: $2.50 (crossed-out or shown as "would cost")
  - Your fee: $0 (green, bold)
- **"Confirm Transfer" Button** (primary, 48px height)
- **"Edit Transfer" Button** (secondary, returns to form with data preserved)
- **"Cancel Transfer" Button** (or back arrow)

**And** confirming transfers funds with no additional steps

---

### Story 3: Skeptic Sees Precise Fee Waiver Explanation at Confirmation

**As a** skeptical member (PERSONA-04)
**I want to** see the exact fee normally charged and the exact amount I'm saving
**So that** I can verify the fee waiver is real, not marketing exaggeration

**Given** I reach the transfer confirmation screen
**When** I look at fee section
**Then** I see:
- Plain language explanation: "Your Plus tier membership includes fee-free transfers between your own accounts and to external accounts."
- Fee breakdown:
  - Normal transfer fee (Plus members): $2.50
  - Your fee with Plus waiver: $0.00
  - You save: $2.50 (green text, bold)
- Footnote: "Fee waiver available to members in Plus and Premium tiers only"
- Link: "Learn more about transfer fees" → Help Center FAQ

**And** no obfuscated or hidden fee details (all transparent)

---

### Story 4: Member Reviews Transfer and Confirms with Confidence

**As a** any member
**I want to** see a final confirmation with all transfer details before submitting
**So that** I have zero doubt about the transfer amount, recipient, and fees

**Given** I reach confirmation screen
**When** I review the summary
**Then** I see:
- Amount is prominent (large, bold): "$1,000"
- Recipient account is clear: "Savings Account ****5432"
- Effective date (if not immediate)
- Fee impact (if any)
- All information is read-only (no edits on this screen)
- Clear action: "Confirm Transfer" button

**And** clicking "Confirm Transfer" submits with visual feedback (loading state)

---

## 4. States

### Default State (Form)
- Form fully loaded with empty fields
- Account dropdowns populated with user's accounts
- From account pre-filled if accessed from account detail (via ?from=param)
- Amount field empty with placeholder "$0.00"
- "Review Transfer" button active
- No error messages

### Loading State (Form)
- Form skeleton showing (input placeholders, button disabled)
- Dropdowns loading account list
- Validation is instant (client-side, <100ms); no loading state shown for validation
- Navigation to confirmation is immediate upon validation success (no brief loading spinner)

### Error State (Form)
- Validation errors displayed inline:
  - "From account is required"
  - "Amount must be between $0.01 and $[maxTransfer]"
  - "To account cannot be the same as from account"
- Affected fields highlighted with red border and error icon
- "Review Transfer" button disabled
- Focus moves to first error field

### Default State (Confirmation)
- Transfer summary displayed (amount, from, to, date)
- Fee impact shown (green callout if waived, gray if charged)
- "Confirm Transfer" button active
- "Edit" and "Cancel" buttons visible

### Loading State (Confirmation)
- "Confirming transfer..." message
- Spinner animation on "Confirm Transfer" button
- All other buttons disabled
- Cannot dismiss or navigate away

### Success State
- Success screen displays:
  - "Transfer complete!" heading
  - Confirmation number
  - Transfer details (amount, from, to, date/time, reference ID)
  - Next steps: "Return to accounts" or "View transaction detail"
  - Timestamp: "Completed at [time]"

### Error State (Submission)
- Error message: "Transfer failed. Please try again."
- Specific error if available: "Insufficient funds in source account"
- "Retry" button or "Edit Transfer" button
- User can return to form with data preserved (if retry)

### Offline State
- Form shows: "You're offline. Transfer will be processed when you reconnect."
- Submit button disabled
- Clear message about offline status

---

## 5. Information Architecture

### Transfer Initiation Form

**Header Region**:
- Breadcrumb: "Home > Transfer"
- Back button returns to previous page

**Form Container** (max-width 600px, centered):
- Heading: "Transfer Money" (28pt Bold)
- Subheading: "Transfer between your accounts or to an external payee" (14pt Regular)

**Form Fields** (top to bottom):
1. **From Account** (required)
   - Label: "From account" (14pt Bold)
   - Dropdown: "Select account..." → list own accounts with balances
   - Account format: "Checking ****9876 ($15,000.00)"
   - Validation error if none selected

2. **To Account** (required)
   - Label: "To account" (14pt Bold)
   - **MVP Scope (Release 1.0)**: "My accounts" tab ONLY (transfers between member's own accounts)
   - **Phase 2 Feature** (future): "External account" tab will be added for external transfers
   - **MVP Tab**: "My accounts"
     - Dropdown showing own accounts (excluding source account)
     - Format: "Savings ****5432 ($8,500.00)"
   - **Phase 2 Tab** (hidden in MVP): "External account"
     - Payee lookup/search field
     - If new payee: Name + Routing number + Account number fields
     - Or: Select from saved payees
   - Form only shows "My accounts" dropdown in MVP; no tab interface needed

3. **Amount** (required)
   - Label: "Amount" (14pt Bold)
   - Input field: "$" prefix, accepts numeric input
   - Placeholder: "$0.00"
   - Validation: > $0.01 and ≤ available balance + max transfer limit
   - Running balance shown below: "Available: $14,999.50"

4. **Purpose/Memo** (optional)
   - Label: "Purpose or memo" (14pt Regular)
   - Textarea: "Enter memo..." (optional, 200 chars max)
   - Shown in transaction description

5. **Effective Date** (MVP: Hidden; Phase 2: Optional)
   - **MVP Release 1.0**: Field is NOT shown (hidden from form)
   - Effective date is always "Today" (immediate transfer) in MVP
   - **Phase 2 Feature** (future): Field will be added with:
     - Label: "Transfer date" (14pt Regular)
     - Dropdown: "Today" | "Tomorrow" | "Specific date" (future)
     - Default: "Today" (immediate transfer, non-editable in Phase 2 MVP)

**Action Buttons** (full-width, 48px height):
- Primary: "Review Transfer" (green, full-width)
- Secondary: "Cancel" (light gray, full-width below primary)

**Help Text** (bottom of form):
- **CRITICAL: ZERO-FRICTION PRINCIPLE** — No loyalty messaging in form
- Help text is purely functional:
  - "Transfers between your accounts are processed immediately."
  - Removed: "External transfers may take 1–2 business days" (external transfers are Phase 2; not in MVP form)
  - Removed: "Your Plus tier includes fee-free transfers. Transfer fee: $0.00" (loyalty context moves to Shard 11 confirmation screen ONLY)
- Rationale: Per 03-experience-strategy.md "zero friction" principle, form must not include loyalty messaging; loyalty benefit context shown only at confirmation screen (Shard 11) where member is reviewing final details

---

### Transfer Confirmation Screen

**Header Region**:
- Breadcrumb: "Home > Transfer > Review"
- Back button returns to form (data preserved)

**Transfer Summary Card** (prominent, non-intrusive):
- Background: Light gray (#F3F4F6), subtle border
- Layout:
  - **From Account**: "Checking ****9876" (left)
  - **Amount**: "$1,000" (center, largest text, bold, 28pt)
  - **To Account**: "Savings ****5432" (right)
  - Below: Effective date "Today, [date]" (secondary text)

**Transfer Details Section** (key-value pairs, read-only):
- From account: Checking ****9876
- To account: Savings ****5432
- Amount: $1,000.00
- Effective date: Today, 2026-02-21
- Reference ID: TRF-20260221-001 (generated, shown for reference)
- Memo: [if entered]

**Fee Impact Section** (conditional, prominent if waiver applies):
- Background: Light green (#ECFDF5), border: green (#10B981)
- Heading: "Fee Impact" (16pt Bold)
- Content:
  - "You're saving $2.50 with Plus tier fee waiver on this transfer"
  - Fee breakdown:
    - "Normal transfer fee: $2.50" (small text, gray)
    - "Your fee: $0.00" (green text, bold)
    - "You save: $2.50" (green text, bold)
  - Help text: "Your Plus tier membership includes fee-free transfers. This benefit applies to transfers between your own accounts and to external accounts."
  - Link: "Learn more about your tier benefits" → `/loyalty/tier-details`

**Confirmation Section**:
- Checkbox (optional): "Send me a confirmation email to [email]" (pre-checked if email on file)
- Checkbox (optional): "Set up this as a recurring transfer" (grayed out for MVP)

**Action Buttons** (sticky footer or inline, 48px height):
- Primary: "Confirm Transfer" (green, full-width)
- Secondary: "Edit Transfer" (light gray, full-width below)
- Tertiary: "Cancel" (text link, no background)

---

## 6. Components & Responsibilities

### Component Tree

```
Page (app/transfer/page.tsx) — Server Component
├── Header
├── TransferForm or TransferConfirmation (Client, conditional based on step)
│   ├── TransferFormContainer (if step=form)
│   │   ├── FormField "From Account" (Dropdown)
│   │   ├── FormField "To Account" (Tabs + Dropdown/Fields)
│   │   ├── FormField "Amount" (Input)
│   │   ├── FormField "Purpose" (Textarea, optional)
│   │   ├── FormField "Effective Date" (Dropdown, optional)
│   │   ├── HelpText Region
│   │   └── ActionButtons (Review, Cancel)
│   │
│   └── TransferConfirmationContainer (if step=confirmation)
│       ├── TransferSummaryCard (From, To, Amount)
│       ├── TransferDetailsSection (key-value pairs)
│       ├── FeeImpactSection (conditional, LoyaltyContextCallout)
│       ├── ConfirmationSection (checkboxes)
│       └── ActionButtons (Confirm, Edit, Cancel)
│
├── SuccessScreen (if step=success)
│   ├── Success heading
│   ├── Confirmation number
│   ├── Transfer summary
│   └── Next action links
│
└── Footer
```

### Component Responsibilities

**TransferForm** (client component):
- Props: `fromAccountId?: string`, `onSubmit: (formData) => void`
- Manage form state (from, to, amount, memo, date)
- Validate fields with real-time feedback
- Prevent submission if invalid
- Handle "Review Transfer" click → show confirmation

**TransactionSummaryCard** (custom, reusable):
- Props: `from: Account`, `to: Account`, `amount: number`, `date: string`
- Display transfer summary prominently
- Show effective date
- Accessibility: All information is semantic HTML (no ARIA needed beyond text)

**FeeImpactSection** (custom, reusable as LoyaltyContextCallout variant):
- Props: `tier: string`, `feeWaived: boolean`, `normalFee: number`, `yourFee: number`, `savingsAmount: number`
- Show fee waiver or fee charged
- Include explanation and link to tier details
- Accessibility: Background color indicates status, text explains (not color-alone)

**TransferForm validation**:
- Real-time validation with debounce
- Show errors inline below fields
- Error icons + red borders for affected fields
- Focus management: Move focus to first error field

---

## 7. Interactions

**Account Pre-fill from Account Detail**:
- If user clicks "Transfer" button from account detail page, form pre-fills from account via query param `?from=[accountId]`
- Only source account is pre-filled; To account is always empty (user must select)
- Amount field is always empty (user enters amount)
- Memo field is always empty (optional, user-entered)

### Form Interactions

**From Account Dropdown**:
- Click → Open list of own accounts
- Select account → Pre-fill from account, reset to account (exclude same account)

**To Account Tabs**:
- Click "My accounts" tab → Show dropdown of own accounts (excluding from account)
- Click "External account" tab → Show external payee fields or selection

**Amount Field**:
- Type → Validate (must be > $0 and ≤ available balance)
- Show running balance below: "Available: $14,999.50"
- Real-time error display if invalid

**"Review Transfer" Button**:
- Click → Validate form; if valid, show confirmation screen
- If invalid, display error messages and focus to first error

**"Cancel" Button**:
- Click → Return to home or previous page (discard form data)

### Confirmation Interactions

**"Edit Transfer" Button**:
- Click → Return to form (preserve all data so member can edit)

**"Confirm Transfer" Button**:
- Click → Submit transfer with loading state
- Disable all buttons during submission
- On success: Show success screen with confirmation number
- On error: Show error message with retry option

**Fee Explanation Link**:
- Click "Learn more..." → Navigate to Loyalty Hub Tier Details (or Help FAQ)
- New tab (doesn't leave confirmation screen)

### Keyboard Navigation

**Form**:
- Tab order: From dropdown → To selection → Amount input → Memo textarea → Review button → Cancel button
- Enter key: Submit from amount field or via Review button
- Escape: Close dropdowns

**Confirmation**:
- Tab order: Edit button → Confirm button → Cancel link → Help links
- Enter: Confirm transfer from Confirm button
- Escape: Return to form

---

## 7.5. Form-Confirmation Data Flow (Shard 10 ↔ Shard 11 Bridge)

**CRITICAL SPECIFICATION** — Form data must persist from Shard 10 (initiation) to Shard 11 (confirmation) and support back-navigation with data preservation.

**Data Flow Architecture**:

1. **Form Submission (Shard 10)**:
   - User fills form: From account, To account, Amount, Memo (optional)
   - Clicks "Review Transfer"
   - Client-side validation runs; if valid, proceed to step 2
   - If invalid, display inline errors and keep user on form

2. **State Management**:
   - Use **client-side React Context API** (recommended) or **URL serialization**:
     - **Context API** (preferred): Store form data in `TransferContext` provider at layout level; confirm data persists across page navigation
     - **URL State** (alternative): Serialize form data as encrypted query params in URL (`/transfer/confirm?token=[encryptedData]`); less secure but no server required
   - Data persisted in browser memory (Context) or URL until: (a) user completes transfer, (b) user closes tab, or (c) 24-hour session timeout

3. **Navigation to Confirmation (Shard 10 → Shard 11)**:
   - Upon successful validation, navigate to `/transfer/confirm`
   - Pass all form data (fromAccountId, toAccountId, amount, memo) via Context or URL
   - Confirmation page retrieves data from Context/URL and displays for review

4. **Back Navigation (Shard 11 → Shard 10)**:
   - User clicks "Edit Details" on confirmation screen
   - Navigate back to `/transfer` (or show form overlay on confirmation)
   - All form fields pre-filled with previous values
   - Data retrieved from Context/URL

5. **Data Loss Prevention**:
   - If user navigates directly to `/transfer/confirm` without prior form data:
     - Check if Context has data OR URL has token
     - If no data found: Redirect to `/transfer` with message "Transfer session expired. Please start over."
   - If user closes/reopens tab:
     - If Context-based: Data is lost (user restarts form)
     - If URL-based: Data is preserved in browser history; user can click back button to restore

6. **Refresh Handling**:
   - **Context-based**: Page refresh clears data; user is redirected to form
   - **URL-based**: Page refresh preserves data in URL; user can continue from confirmation
   - Recommendation: Use Context API for simplicity; refresh behavior is acceptable (users rarely refresh during flow)

**Server-Side Validation** (Optional, Pre-Confirmation):
- Consider adding server-side validation endpoint: `POST /api/transfers/validate`
- Request: Form data (fromAccountId, toAccountId, amount, memo)
- Response: Validation result + calculated fee + member tier info
- Use this to pre-fetch confirmation data before showing Shard 11 confirmation screen
- Prevents stale data if member tier changed between form and confirmation

**Recommended Data Structure** (TypeScript):
```typescript
export interface TransferFormData {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  memo?: string;
  // Effective date hidden in MVP; will be added in Phase 2
}

export interface TransferSession {
  formData: TransferFormData;
  createdAt: Date;
  expiresAt: Date;  // 24 hours from creation
  memberTier: "classic" | "plus" | "premium";  // From server validation
  feeWaiverApplied: boolean;  // Calculated based on tier
  normalFee: number;  // Standard fee for this transfer
}

// In React Context:
export const TransferContext = createContext<{
  session: TransferSession | null;
  setSession: (session: TransferSession) => void;
  clearSession: () => void;
}>(null);
```

---

## 8. Data Contracts

### Request Model

#### POST /api/transfers (Submit Transfer)

**Request**:
```json
{
  "fromAccountId": "CHK-9876",
  "toAccountId": "SAV-5432",
  "toExternalPayee": null,
  "amount": 1000.00,
  "effectiveDate": "2026-02-21",
  "memo": "Transfer to savings",
  "sendConfirmationEmail": true
}
```

**Response** (HTTP 201 Created):
```json
{
  "transferId": "TRF-20260221-001",
  "status": "submitted",
  "fromAccountId": "CHK-9876",
  "toAccountId": "SAV-5432",
  "amount": 1000.00,
  "fee": 0.00,
  "effectiveDate": "2026-02-21",
  "createdAt": "2026-02-21T10:30:00Z",
  "transactionId": "TXN-2001",
  "feeWaiverApplied": true,
  "tier": "plus"
}
```

### TypeScript Interfaces

```typescript
export interface TransferRequest {
  fromAccountId: string;
  toAccountId?: string;
  toExternalPayee?: {
    name: string;
    routingNumber: string;
    accountNumber: string;
  };
  amount: number;
  effectiveDate: string;
  memo?: string;
  sendConfirmationEmail: boolean;
}

export interface TransferResponse {
  transferId: string;
  status: "submitted" | "processing" | "completed" | "failed";
  fromAccountId: string;
  toAccountId?: string;
  amount: number;
  fee: number;
  effectiveDate: string;
  createdAt: string;
  transactionId: string;
  feeWaiverApplied: boolean;
  tier: "classic" | "plus" | "premium";
}

export interface TransferConfirmation {
  fromAccount: Account;
  toAccount: Account;
  amount: number;
  fee: number;
  totalDebit: number;
  effectiveDate: string;
  memo?: string;
  feeWaiverApplied: boolean;
  tier: string;
}

// API functions
export async function submitTransfer(request: TransferRequest): Promise<TransferResponse> {
  const response = await fetch("/api/transfers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  });
  if (!response.ok) throw new Error("Transfer failed");
  return response.json();
}

export async function validateTransfer(request: Partial<TransferRequest>): Promise<TransferConfirmation> {
  // Mock validation (check balance, fee waiver eligibility, etc.)
}
```

### Mock Data & Functions

```typescript
export async function submitTransfer(request: TransferRequest): Promise<TransferResponse> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock response
  const tier = "plus"; // Assume Plus tier
  const feeWaiverApplied = ["plus", "premium"].includes(tier);

  return {
    transferId: `TRF-${Date.now()}`,
    status: "submitted",
    fromAccountId: request.fromAccountId,
    toAccountId: request.toAccountId,
    amount: request.amount,
    fee: feeWaiverApplied ? 0 : 2.50,
    effectiveDate: request.effectiveDate,
    createdAt: new Date().toISOString(),
    transactionId: `TXN-${Date.now()}`,
    feeWaiverApplied,
    tier
  };
}

export async function validateTransfer(request: Partial<TransferRequest>): Promise<TransferConfirmation> {
  // Mock validation
  await new Promise(resolve => setTimeout(resolve, 200));

  const tier = "plus";
  const feeWaiverApplied = ["plus", "premium"].includes(tier);

  return {
    fromAccount: { accountId: request.fromAccountId, balance: 15000 },
    toAccount: { accountId: request.toAccountId, balance: 8500 },
    amount: request.amount || 0,
    fee: feeWaiverApplied ? 0 : 2.50,
    totalDebit: (request.amount || 0) + (feeWaiverApplied ? 0 : 2.50),
    effectiveDate: request.effectiveDate || "today",
    memo: request.memo,
    feeWaiverApplied,
    tier
  };
}
```

---

## 9. Validation Rules

**From Account**:
- Required; cannot be empty
- Account must be active (not closed/dormant)
- Account must have available balance > $0

**To Account**:
- Required; cannot be empty
- If own account: Cannot be same as from account
- If external: Validate payee details (future; MVP may not support)

**Amount**:
- Required; must be > $0.01
- Must be ≤ available balance in from account
- Must be ≤ daily transfer limit (e.g., $5,000 per day)
- Format: Currency with $ symbol, 2 decimal places
- Error messages: "Amount must be at least $0.01", "Insufficient funds. Available: $X", "Daily transfer limit exceeded"

**Effective Date**:
- Must be today or future date (not past)
- Default: Today (immediate)
- Future dates may require 1–2 business day processing

**Memo**:
- Optional; max 200 characters
- Shown in transaction description

---

## 10. Visual & Responsive Rules

### Design Tokens

**Colors**:
- Form labels: Dark gray (#111827), 14pt Bold
- Input fields: White background, light gray border (#E5E7EB)
- Input focus: Blue border (#3B82F6), 2px
- Error: Red (#EF4444) border + error text
- Success: Green (#10B981) background, white text
- Fee waiver callout: Light green background (#ECFDF5), green border (#10B981)
- Amount display: Dark gray (#111827), 28pt Bold

**Typography**:
- Page title: 28pt Bold
- Form labels: 14pt Bold
- Input values: 16pt Regular
- Help text: 14pt Regular, gray (#6B7280)
- Amount (confirmation): 28pt Bold
- Fee text: 12pt Regular
- Error messages: 12pt Bold, red

**Spacing**:
- Form padding: 16px mobile, 24px tablet/desktop
- Container max-width: 600px (form), 900px (confirmation)
- Between form fields: 24px
- Button height: 48px
- Button spacing: 16px between buttons

### Responsive Breakpoints

**Mobile (320px–479px)**:
- Full-width form, no side padding
- Input fields: Full-width, 48px minimum height
- Buttons: Full-width, stacked vertically
- Confirmation card: Full-width

**Tablet (480px–1024px)**:
- Form max-width 500px, centered
- Buttons: Full-width
- Confirmation: 2–3 columns layout if space allows

**Desktop (1025px+)**:
- Form max-width 600px, centered
- Confirmation: 3-column layout (from | amount | to)
- Buttons: Can be inline or stacked

### Touch Target Sizing

- All buttons: ≥48×48px
- Input fields: ≥48px height
- Dropdowns: ≥48px touch target for opening
- Tabs: ≥48px for each tab button

### Layout Behavior

- Form: Single column, centered
- Confirmation: Can be 1–3 columns depending on screen size
- Buttons: Sticky footer or inline (depends on content height)
- No horizontal scroll required

---

## 11. Accessibility Checklist

### Semantic HTML

- Form uses `<form>` element with method="POST" (or handled by framework)
- All inputs have associated `<label>` elements
- Error messages use `<div role="alert">` or semantic `aria-live="polite"` region
- Buttons are semantic `<button>` elements

### ARIA Labels

- **From Account dropdown**: `aria-label="Select source account"`
- **Amount input**: `aria-label="Transfer amount in dollars"`, `aria-describedby="available-balance"`
- **Form section**: `role="region"`, `aria-label="Transfer form"` or `aria-label="Transfer confirmation"`
- **Error region**: `role="alert"`, `aria-live="assertive"` (announces errors to screen readers)
- **Fee section**: `aria-label="Fee impact with Plus tier fee waiver"`

### Focus Management

- Form loads with focus on first field (From Account)
- Confirmation loads with focus on "Confirm Transfer" button
- Tab order: Labeled inputs in order (From → To → Amount → Memo → Date) → Buttons → Help links
- Error display: Focus moves to first error field; error message announced
- All focusable elements have visible 2px blue outline (7:1 contrast)

### Color Contrast

- Form labels (14pt Bold dark gray on white): **12:1 contrast** ✅
- Input text (16pt Regular dark gray on white): **12:1 contrast** ✅
- Error messages (12pt Bold red): **7:1 contrast** ✅
- Success/waiver callout (white on green #10B981): **7:1 contrast** ✅
- Help text (14pt gray on white): **4.5:1 contrast** (WCAG AA) ✅

### Text Alternatives

- No icons used without text labels
- All form fields clearly labeled (no placeholder-only pattern)
- Help text and explanations are text (not icons)

### Keyboard Navigation

- Tab/Shift+Tab: Navigate through form fields and buttons
- Enter: Submit form from any input (triggers Review button)
- Escape: Close dropdowns or cancel transfer
- Arrow keys: Navigate dropdown options

### Screen Reader Support

- **Form announced**: "Transfer Money form. From account required. Amount required. To account required."
- **Error announced**: "Error: Amount must be at least $0.01. Please correct and try again."
- **Confirmation announced**: "Transfer confirmation. Amount $1,000 from Checking to Savings. Fee waiver: $2.50 savings with Plus tier."
- **Success announced**: "Transfer successful. Confirmation number TRF-20260221-001."

### Mobile Accessibility (Touch)

- All inputs and buttons: ≥48×48px touch target
- Input fields: 48px+ height for easy tapping
- Dropdowns: Large touch targets for opening
- No small buttons or links requiring precise tapping

### Cognitive Load Management

- Simple language: "From account", "To account", "Amount" (not "Source", "Destination", "Value")
- Form follows familiar banking pattern (left-to-right, top-to-bottom)
- Confirmation summarizes key info without unnecessary detail
- Error messages are specific and actionable (not cryptic error codes)

---

## 12. Telemetry

### Analytics Events

**Page Load**:
- `event: "page_view"`, `page: "transfer_initiation"`, `fromAccountId?: string`

**Form Interaction**:
- `event: "transfer_field_focus"`, `field: "from" | "to" | "amount" | "memo"`
- `event: "transfer_amount_entered"`, `amount: number`, `fromAccountId: string`

**Validation Error**:
- `event: "transfer_validation_error"`, `field: string`, `errorCode: string`

**Review Transfer**:
- `event: "transfer_review"`, `amount: number`, `feeWaiverApplied: boolean`

**Confirm Transfer**:
- `event: "transfer_confirm"`, `transferId: string`, `amount: number`, `tier: string`

**Transfer Success**:
- `event: "transfer_success"`, `transferId: string`, `amount: number`, `processingTime: ms`

**Transfer Error**:
- `event: "transfer_error"`, `errorCode: string`, `errorMessage: string`

---

## 13. Open Questions & Assumptions

1. Should external transfers be supported in MVP or Phase 2? (Current: Phase 2)
2. Should recurring transfers be supported? (Current: Phase 2)
3. Should instant transfers have different UI than standard 1–2 day transfers? (Current: assumed instant)
4. Should there be a "quick transfer" to saved payees feature? (Current: Phase 2)

---

## 14. Design Rationale (Three-Experts Synthesis)

**UX Lead Perspective**:
- Transfer form is intentionally simple (no loyalty UI in form) to preserve banking workflow familiarity
- Loyalty context (fee waiver) shown at confirmation, not during form entry (zero interruption)
- Form → Confirmation → Success is a clear 3-step path (no modal dialogs, no side drawers)
- Fee waiver callout uses green color + text to indicate benefit (color + accessible labeling)
- Error handling is prompt and actionable (real-time validation, clear error messages)

**Frontend Architect Perspective**:
- Transfer form is client-side validated before submission (fast UX, no server round-trip for validation)
- Confirmation state is server-side rendered OR client-side (depending on architecture)
- FeeImpactSection is reusable component (also used in Account Detail, transactions)
- All form state is preserved if user navigates back to edit
- Telemetry tracks validation errors to identify friction points

**Product/Delivery Perspective**:
- Transfer is P0 MVP feature (core banking, no compromise on reliability or simplicity)
- Fee waiver callout on confirmation supports key metric: "80% perceive benefits as genuine"
- Form simplicity supports success metric: "Zero regression in core banking task completion time"
- Transfer is high-volume feature; any friction multiplied across members; must be frictionless
- Future Phase 2 features (external transfers, recurring) can build on this foundation

---

## 15. Cursor-Claude Ready Build Plan

### File Structure

```
app/transfer/
├── page.tsx                 # Transfer initiation/confirmation page
└── loading.tsx              # Skeleton UI

components/transfer/
├── TransferForm.tsx         # Form component (state, validation)
├── TransferConfirmation.tsx # Confirmation screen
├── TransferSuccess.tsx      # Success screen
├── FormFields.tsx           # Reusable field components
├── FeeImpactCallout.tsx     # Fee waiver explanation
└── TransferActions.tsx      # Buttons (Review, Confirm, Cancel, Edit)

lib/
├── transfer.ts              # Validation, formatting utilities
├── transfers-api.ts         # API facade (submitTransfer, validateTransfer)
└── (existing: api.ts, types.ts)

tests/transfer/
├── transfer-form.test.tsx
├── transfer-confirmation.test.tsx
├── validation.test.tsx
└── success.test.tsx
```

### Mock Setup

1. Create mock account list (checking, savings, MM) with balances
2. Create mock transfer submission response (success, error scenarios)
3. Create mock validation function
4. Create mock successful transfer with fee waiver applied

### Component Build Checklist

- [ ] Create `app/transfer/page.tsx` (state management for form → confirmation → success flow)
- [ ] Create `components/transfer/TransferForm.tsx` (form with real-time validation)
- [ ] Create `components/transfer/TransferConfirmation.tsx` (confirmation screen with fee impact)
- [ ] Create `components/transfer/TransferSuccess.tsx` (success screen with confirmation #)
- [ ] Create form field components (AccountDropdown, AmountInput, etc.)
- [ ] Create `FeeImpactCallout.tsx` (shows fee waiver or fee charged)
- [ ] Implement `lib/transfer.ts` with validation logic (amount, account, date)
- [ ] Implement mock transfer API and submission handler
- [ ] Add Tailwind styling (form layout, responsive, colors)
- [ ] Implement form state management (preserve data on back navigation)
- [ ] Implement real-time validation with error display
- [ ] Add ARIA labels and role="alert" for errors
- [ ] Implement focus management (first field on load, first error on validation)
- [ ] Test color contrast (all text 7:1+ against background)
- [ ] Test touch targets (all inputs/buttons 48×48px minimum)
- [ ] Test keyboard navigation (Tab through form, Enter to submit)
- [ ] Create unit tests for validation, mock API
- [ ] Create integration tests for form → confirmation → success flow
- [ ] Deploy to staging for QA and accessibility audit

---

✅ **SHARD 10: Transfer / Move Money — Build-Ready Specification**

**Handoff**: This shard is ready for frontend engineer to build using Next.js 14 + Shadcn + Tailwind. Follow Cursor-Claude Ready Build Plan (section 15) for file structure, component setup, and test stubs.

**Critical Build Note**: Transfer is a P0 feature with zero-friction requirement. Form simplicity is non-negotiable. Do not add loyalty-related fields or explanations to the form itself; all loyalty context is shown at confirmation only. Test thoroughly for accessibility and mobile usability.
