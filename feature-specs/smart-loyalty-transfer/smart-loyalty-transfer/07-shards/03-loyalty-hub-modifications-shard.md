# Shard 03: SCR-03 Loyalty Hub Modifications — Smart Loyalty Transfer Feature

**Project**: Smart Loyalty Transfer Feature Enhancement
**Shard**: 03-loyalty-hub-modifications-shard
**Affected Screen**: SCR-03 (Loyalty Hub Landing Page)
**Date**: 2026-02-22
**Status**: BUILD READY
**Depends On**: Shard 01, Shard 02 (TierProgressionCTA component)
**Estimated LOC**: 400
**Time Estimate**: 1-2 days

---

## Section 1: Screen Name & Route

**Screen**: SCR-03 (Loyalty Hub Landing Page)
**Route**: `/loyalty-hub` or `/loyalty`
**Purpose**: Overview of member's current tier, benefits, and next steps toward progression

**Modifications**:
- Enhanced "Next Steps" section with TierProgressionCTA buttons
- Added LoyaltyAmountBadge to tier summary
- Real-time tier gap updates
- Deep-linking support for Move Money transfers

**Files**:
- `app/loyalty-hub/page.tsx` (enhanced)
- `app/loyalty-hub/components/NextStepsSection.tsx` (new)
- `app/loyalty-hub/components/TierSummaryCard.tsx` (enhanced)

---

## Section 2: Purpose & Jobs-to-be-Done

**Purpose**: Show members their current tier status, benefits they're currently enjoying, and clear action items to reach the next tier.

**Jobs-to-be-Done**:
1. "I want a quick summary of my tier benefits without diving into details"
2. "I want to see the next milestone and what I need to do to reach it"
3. "I want a quick way to initiate a tier progression transfer from this overview page"

---

## Section 3: User Stories & Acceptance Criteria

**Story**: Member sees next tier progression opportunity and can tap to initiate transfer

- GIVEN: Member is viewing Loyalty Hub with current tier = Classic
- WHEN: Page loads
- THEN: "Next Steps" section displays: "Transfer $1,500 to reach Plus Tier"
- AND: CTA button "Transfer $1,500 to Plus" is visible and clickable
- AND: Member taps button
- AND: Browser navigates to `/move-money?loyalty=true&targetTier=plus&...`
- AND: Analytics event `loyalty_hub_cta_tapped` is fired

---

## Section 4-6: States, Architecture, Components

**Page Structure**:

```
┌─ Loyalty Hub Landing ─────────────────────┐
│                                            │
│ YOUR CURRENT TIER                          │
│ ┌──────────────────────────────────────┐  │
│ │ Classic Tier ✓                       │  │
│ │ You're enjoying:                     │  │
│ │ • Standard APY (0.25%)               │  │
│ │ • Online Banking                     │  │
│ └──────────────────────────────────────┘  │
│                                            │
│ NEXT STEPS                                 │
│ ┌──────────────────────────────────────┐  │
│ │ Gap: $1,500 to reach Plus            │  │
│ │ Plus Tier includes:                  │  │
│ │ • Higher APY (0.95%)                 │  │
│ │ • ATM Fee Waive ($0.50/mo)           │  │
│ │ • 2 Included Autopays                │  │
│ │                                      │  │
│ │ [Transfer $1,500 to reach Plus] ←CTA │  │
│ │ [Learn More About Plus →]            │  │
│ └──────────────────────────────────────┘  │
│                                            │
│ FAQ & SUPPORT                              │
│ ...                                        │
└────────────────────────────────────────────┘
```

**Component Tree**:

```
LoyaltyHubPage
├── TierSummaryCard (current tier)
│   ├── TierName
│   ├── CurrentBenefits
│   └── LoyaltyAmountBadge (gap to next tier)
└── NextStepsSection
    ├── NextTierCard
    │   ├── TierName
    │   ├── TierGap Display
    │   ├── BenefitsList
    │   └── TierProgressionCTA (main action)
    └── SecondaryActions
        └── "Learn More →" link
```

**TierProgressionCTA** (reused from Shard 02): Same component, same deep-linking behavior

**LoyaltyAmountBadge** (reused from Shard 02): Same inline gap display

**NextStepsSection** (new): Container for next tier progression information and CTA

---

## Section 7-9: Interactions, Data, Validation

**Interaction**: Hub Load → CTA Display

```
User navigates to /loyalty-hub
  ↓
Page loads
  ↓
useTierGap(memberId) fetches:
  currentTier: 'classic'
  nextTier: 'plus'
  tierGapAmount: 1500
  ↓
TierSummaryCard renders with:
  - Tier name: "Classic"
  - Benefits: [APY, Online Banking]
  ↓
NextStepsSection renders with:
  - Next tier: "Plus"
  - Gap: "$1,500"
  - TierProgressionCTA: "Transfer $1,500 to reach Plus"
  ↓
Analytics: `loyalty_hub_viewed` { currentTier: 'classic', nextTier: 'plus' }
```

**Data Contracts** (same as Shard 02):
- Input: memberId from auth context
- Output: TierQualificationGap with currentTier, nextTier, tierGapAmount
- Deep-link: `/move-money?loyalty=true&targetTier=plus&amount=1500&...`

**Validation**:
- Tier gap must be valid (≥0)
- If gap = 0: Don't show NextStepsSection; show "You've maximized your tier"
- Tier benefits must be non-empty

---

## Section 10: Visual & Responsive

**Responsive Behavior**:
- Mobile: Single column; full-width cards
- Tablet: Side-by-side summary and next steps
- Desktop: Multi-section layout

**Design Tokens** (inherited from Shard 01):
- Banner background: `bg-teal-50`
- CTA button: `bg-teal-600` hover:`bg-teal-700`
- Amount badge: `border-l-4 border-teal-500`

---

## Section 11: Accessibility

- [x] CTA: 48px tap target, 16px font, 7:1 contrast
- [x] ARIA labels: Describe next tier and amount
- [x] Keyboard nav: Tab to reach CTA, Enter/Space to activate
- [x] Screen reader: Announce tier gap and benefits
- [x] Focus ring: Visible on all interactive elements

---

## Section 12: Telemetry

| Event | Trigger | Payload |
|-------|---------|---------|
| `loyalty_hub_viewed` | Page loads | { currentTier: 'classic', nextTier: 'plus', tierGap: 1500 } |
| `loyalty_hub_cta_tapped` | CTA clicked | { currentTier: 'classic', targetTier: 'plus', amount: 1500 } |
| `loyalty_hub_learn_more_clicked` | "Learn More" link tapped | { targetTier: 'plus' } |

---

## Section 13-15: Open Questions, Design Rationale, Build Plan

**Open Questions**:
1. Should we show all tier levels in a carousel, or focus on next tier only?
   - Assumption: Focus on next tier only (less cognitive load)

**Design Rationale**: "The Loyalty Hub is the dashboard; Next Steps is the action lane. By surfacing the next tier opportunity prominently with a clear CTA, we make tier progression a top-of-mind action. The hub becomes not just informational, but transactional."

**Build Plan**:
- Day 1: Create NextStepsSection component, integrate TierProgressionCTA
- Day 2: Testing and accessibility audit

**Success Criteria**:
- [x] CTA taps navigate to Move Money with correct params
- [x] Tier gap displays correctly
- [x] WCAG 2.1 AAA compliance verified

---

**Document Generated**: 2026-02-22
**Status**: READY FOR IMPLEMENTATION
