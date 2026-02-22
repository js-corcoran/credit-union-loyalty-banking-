# Screen Inventory — Smart Loyalty Transfer Feature

**Project**: Smart Loyalty Transfer Feature Enhancement
**Pipeline Stage**: Step 7 - Shard Decomposition
**Date**: 2026-02-22
**Status**: BUILD READY

---

## Build Order Summary

This feature touches **3 existing screens** and adds **shared infrastructure** that must be built first. The build order is strict: shared infrastructure → screen-specific shards.

| Build Order | Component | Screen | Type | Dependency | Est. Lines |
|-------------|-----------|--------|------|-----------|-----------|
| **1st (FOUNDATION)** | LoyaltyTransferContext types, interfaces, URL schema | Shared | TypeScript Interfaces | None | 400 |
| **1st (FOUNDATION)** | URL parameter parsing utility (`parseLoyaltyTransferParams`) | Shared | Utility | Types |150 |
| **1st (FOUNDATION)** | ITierService, IAccountService facades | Shared | Service Interfaces | Types | 200 |
| **1st (FOUNDATION)** | Mock service implementations (MockTierService, MockAccountService) | Shared | Mock Services | Interfaces | 600 |
| **1st (FOUNDATION)** | Design tokens for loyalty transfer (colors, spacing, typography) | Shared | Design System | None | 100 |
| **1st (FOUNDATION)** | React Context provider (`LoyaltyTransferProvider`) | Shared | Context | Types, Services | 250 |
| **1st (FOUNDATION)** | Custom hooks (`useLoyaltyTransfer`, `useTransferForm`, `useTierGap`) | Shared | Hooks | Context, Services | 500 |
| **2nd** | TierProgressionCTA (enhanced for deep-linking) | SCR-04 | Component | Shared foundation | 350 |
| **2nd** | LoyaltyAmountBadge (inline tier gap display) | SCR-04 | Component | Shared foundation | 200 |
| **2nd** | Tier Details page modifications | SCR-04 | Page | SCR-04 components | 300 |
| **2nd** | LoyaltyTransferBanner (notification at top) | SCR-08 | Component | Shared foundation | 250 |
| **2nd** | PreFilledAmountInput (amount field with indicator) | SCR-08 | Component | Shared foundation | 180 |
| **2nd** | PreFilledAccountSelector (to-account selector) | SCR-08 | Component | Shared foundation | 220 |
| **2nd** | LoyaltyTransferMemo (pre-populated memo field) | SCR-08 | Component | Shared foundation | 120 |
| **2nd** | Move Money Transfer page modifications | SCR-08 | Page | SCR-08 components + shared foundation | 600 |
| **3rd** | TransferConfirmationLoyaltyContext (confirmation view) | SCR-08 | Component | Shared foundation, form state | 280 |
| **3rd** | TransferSuccessTierPreview (success screen) | SCR-08 | Component | Shared foundation | 250 |
| **3rd** | Confirmation & Success screen modifications | SCR-08 | Page | All components | 400 |
| **4th (OPTIONAL)** | Next Steps section enhancement | SCR-03 | Component | TierProgressionCTA | 250 |
| **4th (OPTIONAL)** | Loyalty Hub Landing modifications | SCR-03 | Page | SCR-03 component | 200 |

---

## Affected Screens Detail

### SCR-03: Loyalty Hub Landing Page

**Purpose**: Overview of member's current tier status, benefits, and next-tier progression path

**Modifications**:
- Enhance "Next Steps" section with TierProgressionCTA buttons
- Add LoyaltyAmountBadge to tier summary area
- Support deep-linking to Move Money with loyalty params
- Show contextual messaging about tier progression opportunities

**Current State**: Shows static tier overview, generic "Learn More" links
**Future State**: Dynamic CTAs that initiate loyalty transfers with pre-fill

**Components Involved**:
- TierProgressionCTA (deep-link generation)
- LoyaltyAmountBadge (visual indicator)
- useTransferContext hook (loyalty state)

**Build Dependencies**:
- Shared foundation (types, services, context)
- TierProgressionCTA component

---

### SCR-04: Tier Details Page

**Purpose**: Deep dive into tier requirements, benefits, qualification gap, and path to next tier

**Modifications**:
- Enhance tier progression CTA button with deep-linking
- Real-time calculation of tierGapAmount
- Visual display of amount needed (LoyaltyAmountBadge)
- CTA click handler to generate deep-link params
- Accessibility: 48px tap target, 7:1 contrast, ARIA labels

**Current State**: Shows tier info, generic "Learn more" or "Upgrade now" buttons
**Future State**: Smart CTA that calculates gap and deep-links to pre-filled transfer screen

**Components Involved**:
- TierProgressionCTA (main CTA with deep-link generation)
- LoyaltyAmountBadge (gap amount display)
- useTierGap hook (real-time gap calculation)
- useTransferContext hook (loyalty state)

**Build Dependencies**:
- Shared foundation (types, services, context, hooks)
- TierProgressionCTA component

---

### SCR-08: Move Money Transfer Screen

**Purpose**: Primary destination for loyalty transfers. Must support both loyalty and non-loyalty transfers seamlessly.

**Modifications** (Most complex shard):

1. **Top notification banner**: LoyaltyTransferBanner
   - Shows when `loyalty=true` in URL params
   - Dismissible, ARIA-live announcements
   - Displays target tier, amount, and key benefits

2. **Amount field**: PreFilledAmountInput
   - Pre-filled from URL param `amount`
   - Editable; visual indicator of pre-fill state
   - Real-time validation against source account balance
   - Stale data detection and warning

3. **Destination account**: PreFilledAccountSelector
   - Pre-selected from URL param `toAccountId`
   - Editable dropdown; no locked fields
   - Warning if selected account doesn't count toward tier
   - Validation against account restrictions

4. **Memo field**: LoyaltyTransferMemo
   - Pre-populated with "Loyalty tier qualification transfer"
   - Editable; max 50 characters
   - Helps member track purpose

5. **Source account**: Manual selection (NOT pre-filled)
   - Member must choose where funds come from
   - Respects "Additive Integration" principle (member in control)
   - Dropdown or radio selector
   - Validation: sufficient funds, no holds, active account

6. **Form state management**:
   - Track what was pre-filled vs. user-edited
   - Detect stale data (e.g., balance changed since CTA was tapped)
   - Real-time validation (amount vs. source balance, tier qualification)
   - Pre-submission balance refresh

7. **Confirmation view** (part of SCR-08):
   - TransferConfirmationLoyaltyContext component
   - Shows transfer details + loyalty impact section
   - Projects post-transfer balance and tier qualification
   - Lists benefits member will unlock
   - Estimated annual savings calculation

8. **Success view** (part of SCR-08):
   - TransferSuccessTierPreview component
   - Celebratory messaging for tier achievement
   - Shows new tier status, active benefits
   - Next-tier progression suggestion
   - Tier Details button for continued exploration

**Current State**: Standard money transfer form, no loyalty context
**Future State**: Loyalty-aware transfer form with pre-fill, contextual messaging, and tier outcome prediction

**Components Involved**:
- LoyaltyTransferBanner
- PreFilledAmountInput
- PreFilledAccountSelector
- LoyaltyTransferMemo
- TransferConfirmationLoyaltyContext
- TransferSuccessTierPreview
- All custom hooks

**Build Dependencies**:
- Shared foundation (types, services, context, hooks)
- All loyalty-specific components

---

## Shared Infrastructure Requirements

### Types & Interfaces (TypeScript)

**File**: `lib/types/loyalty.ts`

```typescript
// Main context
export interface LoyaltyTransferContext {
  sourceTier: TierLevel;
  targetTier: TierLevel;
  currentBalance: number;
  tierThreshold: number;
  tierGapAmount: number;
  destinationAccountId: string;
  destinationAccountName: string;
  destinationBalance: number;
  tierBenefits: TierBenefit[];
  calculatedAt: ISO8601Timestamp;
  isStale: boolean;
  initiatingPage: 'tier-details' | 'loyalty-hub' | 'unknown';
  sessionId: string;
}

export type TierLevel = 'classic' | 'plus' | 'premium';

export interface TierBenefit {
  label: string;
  value: string;
  annualSavings?: number;
}

export interface TierQualificationGap {
  memberId: string;
  currentTier: TierLevel;
  nextTier: TierLevel | null;
  currentBalance: number;
  nextTierThreshold: number;
  tierGapAmount: number;
  destinationAccountId: string;
  activeAutopays: number;
  requiredAutopays: number;
  activeCreditCards: number;
  maxCreditCards: number;
  calculatedAt: ISO8601Timestamp;
  qualifiesNow: boolean;
  wouldQualifyWith: (amount: number) => boolean;
}

export interface TransferFormState {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  memo: string;
  amountPreFilled: number;
  amountEdited: boolean;
  loyaltyTransferContext?: LoyaltyTransferContext;
  isLoyaltyTransfer: boolean;
  errors: TransferFormError[];
  isValid: boolean;
}

export interface TransferFormError {
  field: 'fromAccount' | 'toAccount' | 'amount' | 'memo';
  message: string;
  severity: 'error' | 'warning';
}
```

### Service Facades

**File**: `lib/services/interfaces.ts`

```typescript
export interface ITierService {
  getTierGap(memberId: string, options?: { forceRefresh?: boolean }): Promise<TierQualificationGap>;
  getTierConfig(tierLevel: TierLevel): Promise<TierSpecification>;
  getAllTierConfigs(): Promise<Record<TierLevel, TierSpecification>>;
}

export interface IAccountService {
  listAccounts(memberId: string): Promise<AccountInfo[]>;
  getAccount(accountId: string): Promise<AccountInfo>;
  getBalance(accountId: string): Promise<{ balance: number; lastUpdatedAt: ISO8601Timestamp }>;
}
```

### Mock Implementations

**File**: `lib/services/mocks/MockTierService.ts`, `lib/services/mocks/MockAccountService.ts`

Mock implementations use dummy data for design-first development:
- Tier configurations: Classic ($2,500), Plus ($10,000), Premium ($20,000)
- Mock member balance: $8,500
- Mock tier gap: $1,500 (to Plus)
- Mock tier benefits: APY rates, fee waivers, etc.

### React Context & Hooks

**File**: `lib/context/LoyaltyTransferContext.tsx`

```typescript
export const LoyaltyTransferProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Manages loyalty transfer state across screens
  // Provides hooks: useLoyaltyTransfer, useTransferForm, useTierGap
};

export const useLoyaltyTransfer = () => {
  // Hook for accessing loyalty transfer context
};

export const useTransferForm = () => {
  // Hook for managing form state with pre-fill tracking
};

export const useTierGap = (memberId: string) => {
  // Hook for real-time tier gap calculation
};
```

### Design Tokens

**File**: `lib/design-tokens/loyalty-transfer.ts`

```typescript
export const loyaltyTransferTokens = {
  colors: {
    bannerBg: '#f0fdf4',    // light green/teal
    bannerBorder: '#16a34a', // green primary
    preFilledBg: '#f3f4f6',  // light gray
    preFilledBorder: '#0891b2', // teal
  },
  typography: {
    bannerFont: '16px',
    fieldLabelFont: '14px',
  },
  spacing: {
    bannerPadding: '16px 20px',
    fieldGap: '12px',
  },
};
```

### URL Parameter Schema

**File**: `lib/utils/loyalty-transfer-params.ts`

```typescript
export interface LoyaltyTransferQueryParams {
  loyalty: string;              // "true" | "false"
  targetTier: string;           // "classic" | "plus" | "premium"
  amount: string;               // Numeric string
  toAccountId: string;          // Account ID
  memo?: string;                // Optional memo (URL-encoded)
  initiatingPage?: string;      // "tier-details" | "loyalty-hub"
}

export function parseLoyaltyTransferParams(searchParams: URLSearchParams): LoyaltyTransferContext | null {
  // Parse and validate URL params
  // Return LoyaltyTransferContext or null if invalid
}

export function generateLoyaltyTransferUrl(context: LoyaltyTransferContext): string {
  // Generate /move-money?... URL from context
}
```

---

## Build Order Rationale

**Why Shared Foundation First?**

All three screens depend on:
1. TypeScript types (LoyaltyTransferContext, TierQualificationGap, etc.)
2. Service facades (ITierService, IAccountService)
3. Mock implementations (allows design-first development without backend)
4. React Context (manages state across screens)
5. Custom hooks (reusable logic for tier gap, form state, etc.)
6. Design tokens (consistent styling across components)

Building these first allows screen-specific shards to reference them without forward dependencies.

**Why SCR-04 & SCR-03 Before SCR-08?**

The Tier Details and Loyalty Hub pages are the *entry points* for loyalty transfers. They generate the deep-links that SCR-08 consumes. However:
- These can be built in parallel with shared infrastructure
- SCR-08 has the most complexity and can benefit from seeing how data is passed via URL params

**Why SCR-08 Last?**

Most complexity lives here:
- URL parameter parsing and validation
- Form state management with pre-fill tracking
- Real-time balance and tier validation
- Stale data detection
- Confirmation and success views
- Analytics instrumentation
- Edge case handling

Building it last allows the team to understand the full context from the earlier shards.

---

## Component Dependency Graph

```
Shared Foundation
├── Types (lib/types/loyalty.ts)
├── Service Facades (lib/services/interfaces.ts)
├── Mock Services (lib/services/mocks/)
├── Design Tokens (lib/design-tokens/)
├── React Context (lib/context/LoyaltyTransferContext.tsx)
└── Custom Hooks (lib/hooks/)

SCR-04: Tier Details
├── TierProgressionCTA (uses: types, hooks, services)
└── LoyaltyAmountBadge (uses: types, hooks)

SCR-03: Loyalty Hub
├── Next Steps section (uses: TierProgressionCTA)
└── Tier summary (uses: LoyaltyAmountBadge)

SCR-08: Move Money Transfer
├── LoyaltyTransferBanner (uses: types, hooks, tokens)
├── PreFilledAmountInput (uses: types, hooks, tokens)
├── PreFilledAccountSelector (uses: types, hooks, tokens)
├── LoyaltyTransferMemo (uses: types, tokens)
├── TransferConfirmationLoyaltyContext (uses: types, hooks)
└── TransferSuccessTierPreview (uses: types, hooks)
```

---

## Testing Strategy by Shard

| Shard | Unit Tests | Integration Tests | E2E Tests |
|-------|------------|------------------|-----------|
| Shared Foundation | 40+ (types, utils, hooks) | 20+ (context, services) | 0 |
| SCR-04 | 15+ (components) | 5+ (integration with hooks) | 3+ (CTA tap → navigate) |
| SCR-03 | 10+ (components) | 3+ (Next Steps rendering) | 2+ (CTA discovery, tap) |
| SCR-08 | 50+ (components, form logic) | 15+ (form + validation) | 5+ (full loyalty transfer journey) |

**Total Test Count**: 150+ unit + 40+ integration + 10+ E2E

---

## File Structure

```
app/
├── move-money/
│   ├── page.tsx (enhanced with loyalty handling)
│   ├── components/
│   │   ├── LoyaltyTransferBanner.tsx
│   │   ├── PreFilledAmountInput.tsx
│   │   ├── PreFilledAccountSelector.tsx
│   │   ├── LoyaltyTransferMemo.tsx
│   │   ├── TransferConfirmationLoyaltyContext.tsx
│   │   └── TransferSuccessTierPreview.tsx
│   └── hooks/
│       └── useTransferForm.ts (if not in shared)
├── tier-details/
│   ├── page.tsx (enhanced with CTA)
│   └── components/
│       ├── TierProgressionCTA.tsx
│       └── LoyaltyAmountBadge.tsx
└── loyalty-hub/
    ├── page.tsx (enhanced with Next Steps)
    └── components/
        └── NextStepsSection.tsx

lib/
├── types/
│   ├── loyalty.ts
│   ├── tier.ts
│   ├── account.ts
│   ├── transfer.ts
│   └── enums.ts
├── services/
│   ├── interfaces.ts
│   ├── tier-service.ts
│   ├── account-service.ts
│   └── mocks/
│       ├── MockTierService.ts
│       └── MockAccountService.ts
├── context/
│   └── LoyaltyTransferContext.tsx
├── hooks/
│   ├── useLoyaltyTransfer.ts
│   ├── useTransferForm.ts
│   ├── useTierGap.ts
│   └── useFormValidation.ts
├── utils/
│   ├── loyalty-transfer-params.ts
│   ├── tier-gap-calculator.ts
│   └── transfer-validation.ts
└── design-tokens/
    └── loyalty-transfer.ts

__tests__/
├── unit/
│   ├── hooks/
│   ├── utils/
│   └── services/
├── integration/
│   ├── context/
│   └── services/
└── e2e/
    └── loyalty-transfer-journey.spec.ts
```

---

## Shard Files Generated

1. **01-shared-infrastructure-shard.md** — Build first (foundation)
2. **02-tier-details-modifications-shard.md** — Build second
3. **03-loyalty-hub-modifications-shard.md** — Build second (parallel with 02)
4. **04-transfer-screen-modifications-shard.md** — Build third (depends on 01-03)
5. **05-confirmation-success-shard.md** — Build fourth (depends on 01-04)

Each shard contains all 15 standard sections and 3,000+ words of build-ready content.

---

**Document Generated**: 2026-02-22
**Status**: READY FOR IMPLEMENTATION
