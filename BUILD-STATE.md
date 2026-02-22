# Credit Union Loyalty Banking — Build State

**Last Updated**: 2026-02-22
**Status**: All features built, committed, pushed to origin/main
**Build**: Passes with zero errors (`npx next build`)
**Dev Server**: `npm run dev` on port 3000

---

## Quick Context for New Sessions

This is a **Next.js 14 App Router** credit union banking app with a three-tier loyalty program (Classic/Plus/Premium) for members aged 55+. Everything uses **mock data** (Mode A: design-first). There is no backend — all API calls go to `/lib/api.ts` which returns mock data.

**Mock member**: Patricia Johnson, Plus tier, member since 2019, 3-month rolling balance $10,500.

**Key constraint**: WCAG 2.1 AAA accessibility (16px+ body text, 48px touch targets, 7:1 contrast). Design for 55+ demographic.

---

## Git History

```
5cda9e0 Add responsive navigation system with desktop top nav and mobile bottom tabs
f890fb4 Add Smart Loyalty Transfer feature with deep-link tier progression
875e0b0 Merge remote gitignore with local additions
2684f80 Initial commit
9cc0ae5 Implement all 17 screens for Credit Union Loyalty Banking Experience
```

**Remote**: `https://github.com/js-corcoran/credit-union-loyalty-banking-.git` (origin/main)

---

## Tech Stack

- **Framework**: Next.js 14, App Router, TypeScript
- **Styling**: Tailwind CSS + CSS custom properties (`styles/variables.css`)
- **UI**: Custom shared components (Button, Card, Accordion, Tabs, Modal) — NOT using Shadcn imports
- **State**: React Context API (5 providers)
- **Icons**: Inline SVGs (no external icon library)
- **Data**: Mock data in `/lib/api.ts` and `/lib/mock-data.ts`

---

## Architecture Overview

### Root Layout (`app/layout.tsx`)

```
<html>
  <body>
    <MemberProvider>
      <TierProvider>
        <NotificationProvider>
          <TransferProvider>
            <LoyaltyTransferProvider>
              <NavigationShell>        ← Wraps ALL pages
                {children}
              </NavigationShell>
            </LoyaltyTransferProvider>
          </TransferProvider>
        </NotificationProvider>
      </TierProvider>
    </MemberProvider>
  </body>
</html>
```

### NavigationShell (`components/navigation/NavigationShell.tsx`)

Provides responsive navigation for every page:
- **Desktop (>=768px)**: Sticky top nav bar with logo, 4 nav items, notification bell, tier badge, profile dropdown
- **Mobile (<768px)**: Fixed bottom tab bar with 4 tabs + "More" button opening a half-sheet drawer
- **SkipToContentLink**: Keyboard accessibility (first focusable element)
- **`<main id="main-content">`**: All page content wrapped here

### Navigation Sections (5 primary)

| Section | Route | Matches (prefix) |
|---------|-------|-------------------|
| **Home** | `/` | `/accounts`, `/transactions` |
| **Loyalty** | `/loyalty` | `/loyalty/*` |
| **Move Money** | `/transfer` | `/transfer/*`, `/autopay/*` |
| **Loans** | `/loans` | `/loans/*` |
| **More** (menu) | — | Opens drawer: Settings, Notifications, Help |

Route matching uses `getActiveNavItem()` in `lib/navigation/utils.ts` with exact match → prefix match → fallback to Home.

---

## All 24 Pages/Routes

### P0 — Core Screens
| Route | File | Screen | Status |
|-------|------|--------|--------|
| `/` | `app/page.tsx` | Home Dashboard (SCR-01) | Built |
| `/loyalty` | `app/loyalty/page.tsx` | Loyalty Hub (SCR-02) | Built |
| `/transfer` | `app/transfer/page.tsx` | Transfer Initiation (SCR-10) | Built + Loyalty enhanced |
| `/transfer/confirm` | `app/transfer/confirm/page.tsx` | Transfer Confirmation (SCR-11) | Built + Loyalty enhanced |
| `/loyalty/retrogression` | `app/loyalty/retrogression/page.tsx` | Retrogression Alert (SCR-16) | Built |

### P1 — Learning & Management Screens
| Route | File | Screen | Status |
|-------|------|--------|--------|
| `/loyalty/tier-details` | `app/loyalty/tier-details/page.tsx` | Tier Details (SCR-03) | Built + Loyalty enhanced |
| `/loyalty/account-status` | `app/loyalty/account-status/page.tsx` | Account Status (SCR-04) | Built |
| `/loyalty/benefits` | `app/loyalty/benefits/page.tsx` | Benefit Details (SCR-05) | Built |
| `/loyalty/faq` | `app/loyalty/faq/page.tsx` | FAQ & Search (SCR-06) | Built |
| `/accounts/[id]` | `app/accounts/[id]/page.tsx` | Account Detail (SCR-08) | Built |
| `/transactions/[id]` | `app/transactions/[id]/page.tsx` | Transaction Detail (SCR-09) | Built |
| `/autopay` | `app/autopay/page.tsx` | Autopay List (SCR-12) | Built |
| `/autopay/add` | `app/autopay/add/page.tsx` | Autopay Setup (SCR-13) | Built |
| `/autopay/[id]/remove` | `app/autopay/[id]/remove/page.tsx` | Autopay Removal (SCR-14) | Built |
| `/autopay/[id]/edit` | `app/autopay/[id]/edit/page.tsx` | Autopay Edit | Built |

### P2 — Support & Migration
| Route | File | Screen | Status |
|-------|------|--------|--------|
| `/help` | `app/help/page.tsx` | Help/Support (SCR-07) | Built |
| `/loyalty/migration` | `app/loyalty/migration/page.tsx` | Legacy Migration (SCR-15) | Built |
| `/settings` | `app/settings/page.tsx` | Notification Settings (SCR-17) | Built |

### Additional Pages
| Route | File | Purpose |
|-------|------|---------|
| `/accounts` | `app/accounts/page.tsx` | Account list (redirects) |
| `/loans` | `app/loans/page.tsx` | Loans list |
| `/loans/[id]` | `app/loans/[id]/page.tsx` | Loan detail |
| `/transactions` | `app/transactions/page.tsx` | Transaction list |
| `/notifications` | `app/notifications/page.tsx` | Notification center |
| `/legacy-migration` | `app/legacy-migration/page.tsx` | Alt migration route |

---

## Feature #1: Core 17 Screens (Commit: 9cc0ae5)

All 17 screens from the PRD built with mock data. Each page previously imported `<Header />` individually — this was replaced by NavigationShell in the navigation feature.

---

## Feature #2: Smart Loyalty Transfer (Commit: f890fb4)

Deep-link tier progression allowing members to transfer money to qualify for the next tier, initiated from the Loyalty Hub or Tier Details page.

### Files Created
| File | Purpose |
|------|---------|
| `lib/loyalty-transfer/types.ts` | TypeScript interfaces (LoyaltyTransferContext, TierQualificationGap, etc.) |
| `lib/loyalty-transfer/services.ts` | MockTierService (Plus tier, $23.5K balance, $1.5K gap to Premium), MockAccountService |
| `lib/loyalty-transfer/utils.ts` | URL param parsing, transfer URL generation, tier gap calculation, validation |
| `lib/loyalty-transfer/design-tokens.ts` | WCAG AAA tokens for banner, pre-fill, warning, success states |
| `lib/loyalty-transfer/index.ts` | Barrel export |
| `context/LoyaltyTransferContext.tsx` | Provider + hooks: `useLoyaltyTransfer()`, `useTransferForm()`, `useTierGap()` |
| `components/loyalty/TierProgressionCTA.tsx` | Smart CTA button generating deep-link to `/transfer` with loyalty params |
| `components/loyalty/LoyaltyAmountBadge.tsx` | Inline tier gap display with stale data warning, refresh button |
| `components/loyalty/ActionSection.tsx` | Enhanced "Next Steps" in Loyalty Hub with real-time gap + CTA |

### Files Modified
| File | Changes |
|------|---------|
| `app/loyalty/tier-details/page.tsx` | Added TierProgressionSection with gap display and CTA |
| `app/transfer/page.tsx` | Loyalty URL param parsing, dismissible banner, pre-filled amount/account/memo |
| `app/transfer/confirm/page.tsx` | LoyaltyImpactSection (projected balance, qualification status) + TierAchievementSection (celebration) |
| `app/layout.tsx` | Added LoyaltyTransferProvider |

### How the Flow Works
1. Member sees tier gap on Loyalty Hub or Tier Details
2. Clicks "Transfer to qualify" CTA
3. Navigated to `/transfer?loyaltyTransfer=true&amount=1500&toAccount=SAV-5432&memo=...&targetTier=premium`
4. Transfer page pre-fills from URL params, shows loyalty banner
5. Confirmation page shows tier impact (projected balance, qualification status)
6. Success state shows celebration with new tier benefits

---

## Feature #3: Responsive Navigation (Commit: 5cda9e0)

Cross-cutting navigation system replacing per-page Header component.

### Files Created
| File | Purpose |
|------|---------|
| `lib/navigation/types.ts` | NavigationItem, NavigationConfig, NavigationState, MoreMenuItem, NavigationUserData |
| `lib/navigation/config.ts` | NAVIGATION_CONFIG: 4 sections + 3 more-menu items, route prefixes for matching |
| `lib/navigation/utils.ts` | `getActiveNavItem()` — 3-pass route matching (exact → prefix → fallback) |
| `lib/navigation/hooks.ts` | `useNavigationState()` — memoized hook returning active nav state |
| `lib/navigation/icons.tsx` | 11 SVG icon components + ICON_MAP lookup |
| `lib/navigation/index.ts` | Barrel export |
| `components/navigation/SkipToContentLink.tsx` | sr-only skip link, visible on focus |
| `components/navigation/NavigationShell.tsx` | Root wrapper: TopNav + main + BottomTabBar + MobileNavSpacer |
| `components/navigation/desktop/TopNavigationBar.tsx` | Sticky desktop header: logo, nav items, utilities |
| `components/navigation/desktop/TopNavItem.tsx` | Nav link with 3-cue active state (color + weight + underline) |
| `components/navigation/desktop/TopNavUtilities.tsx` | Bell, tier badge, profile dropdown with Escape-to-close |
| `components/navigation/mobile/BottomTabBar.tsx` | Fixed bottom bar with tab items + More button |
| `components/navigation/mobile/BottomTabItem.tsx` | Tab with icon + label, 56px height |
| `components/navigation/mobile/MoreMenuButton.tsx` | Opens More drawer |
| `components/navigation/mobile/MobileNavSpacer.tsx` | Prevents content overlap with fixed bottom bar |
| `components/navigation/more/MoreMenuDrawer.tsx` | Half-sheet with backdrop, focus trap, keyboard nav |
| `components/navigation/more/MoreMenuItem.tsx` | Menu item with icon, label, description |
| `components/navigation/utilities/NotificationBadge.tsx` | Red badge, "99+" overflow |
| `components/navigation/utilities/TierBadgeIndicator.tsx` | Gold (Plus) / Platinum (Premium) pill |

### Files Modified
| File | Changes |
|------|---------|
| `app/layout.tsx` | Added NavigationShell wrapping children |
| `styles/globals.css` | Added `@keyframes slide-up` animation for drawer |
| 20 page files | Removed `import { Header }` and `<Header />` usage |

### Key Design Decisions
- Desktop breakpoint: `md` (768px) — uses Tailwind `hidden md:block` / `block md:hidden`
- Mobile safe area: `env(safe-area-inset-bottom)` for notched devices
- Profile dropdown: Click to toggle, Escape/outside-click to close, focus restoration
- More drawer: Modal with backdrop, focus trap, body scroll lock
- Active state matching: Longest prefix wins (e.g., `/loyalty/tier-details` matches Loyalty section)

---

## Complete File Tree

```
credit-union-loyalty-banking/
├── app/
│   ├── layout.tsx                          # Root layout + providers + NavigationShell
│   ├── page.tsx                            # Home Dashboard
│   ├── accounts/
│   │   ├── page.tsx                        # Account list
│   │   └── [id]/page.tsx                   # Account detail
│   ├── autopay/
│   │   ├── page.tsx                        # Autopay list
│   │   ├── add/page.tsx                    # Autopay setup
│   │   └── [id]/
│   │       ├── edit/page.tsx               # Autopay edit
│   │       └── remove/page.tsx             # Autopay removal
│   ├── help/page.tsx                       # Help/Support
│   ├── legacy-migration/page.tsx           # Alt migration route
│   ├── loans/
│   │   ├── page.tsx                        # Loans list
│   │   └── [id]/page.tsx                   # Loan detail
│   ├── loyalty/
│   │   ├── page.tsx                        # Loyalty Hub
│   │   ├── account-status/page.tsx         # Account Status
│   │   ├── benefits/page.tsx               # Benefit Details
│   │   ├── faq/page.tsx                    # FAQ & Search
│   │   ├── migration/page.tsx              # Legacy Migration
│   │   ├── retrogression/page.tsx          # Retrogression Alert
│   │   └── tier-details/page.tsx           # Tier Details
│   ├── notifications/page.tsx              # Notification Center
│   ├── settings/page.tsx                   # Settings
│   ├── transactions/
│   │   ├── page.tsx                        # Transaction list
│   │   └── [id]/page.tsx                   # Transaction detail
│   └── transfer/
│       ├── page.tsx                        # Transfer (loyalty-aware)
│       └── confirm/page.tsx                # Transfer confirm (loyalty-aware)
│
├── components/
│   ├── account/
│   │   ├── AccountSelectorRegion.tsx
│   │   ├── AccountSummaryRegion.tsx
│   │   └── TierContributionRegion.tsx
│   ├── banking/
│   │   ├── AccountCard.tsx
│   │   ├── AccountDetail.tsx
│   │   ├── AutopayForm.tsx
│   │   ├── AutopayList.tsx
│   │   ├── AutopayRemovalConfirm.tsx
│   │   ├── TransactionDetail.tsx
│   │   ├── TransactionItem.tsx
│   │   ├── TransferConfirmation.tsx
│   │   └── TransferForm.tsx
│   ├── faq/
│   │   ├── FAQCategoryBrowse.tsx
│   │   ├── FAQItem.tsx
│   │   ├── FAQList.tsx
│   │   └── FAQSearch.tsx
│   ├── help/
│   │   └── SupportCard.tsx
│   ├── home/
│   │   ├── AccountSummaryRegion.tsx
│   │   ├── RecentTransactionsRegion.tsx
│   │   └── TierStatusRegion.tsx
│   ├── layout/
│   │   ├── Header.tsx                      # DEPRECATED — replaced by NavigationShell
│   │   ├── MobileNav.tsx                   # Old mobile nav (unused)
│   │   ├── Navigation.tsx                  # Old nav (unused)
│   │   └── Sidebar.tsx                     # Old sidebar (unused)
│   ├── loyalty/
│   │   ├── AccountStatusRegion.tsx
│   │   ├── ActionSection.tsx               # Enhanced: tier gap + CTA
│   │   ├── AdvancementPathCard.tsx
│   │   ├── AnnualSummaryCard.tsx
│   │   ├── AutopayRulesTable.tsx
│   │   ├── AutopayStatusList.tsx
│   │   ├── BenefitCalculationBreakdown.tsx
│   │   ├── BenefitCard.tsx
│   │   ├── BenefitComparisonChart.tsx
│   │   ├── BenefitValueCalculator.tsx
│   │   ├── BenefitsSummaryRegion.tsx
│   │   ├── FAQItemCard.tsx
│   │   ├── FAQSection.tsx
│   │   ├── FAQVisualization.tsx
│   │   ├── GracePeriodExplainer.tsx
│   │   ├── LoyaltyAmountBadge.tsx          # Smart Transfer feature
│   │   ├── LoyaltyContextCallout.tsx
│   │   ├── LoyaltyHubNavigation.tsx
│   │   ├── ProgressRegion.tsx
│   │   ├── QualifyingAccountsList.tsx
│   │   ├── RequirementsChecklist.tsx
│   │   ├── RollingBalanceDiagram.tsx
│   │   ├── SupportSection.tsx
│   │   ├── TierActionCTA.tsx
│   │   ├── TierBadge.tsx
│   │   ├── TierCalculationVisual.tsx
│   │   ├── TierLossRiskAlert.tsx
│   │   ├── TierProgressBar.tsx
│   │   ├── TierProgressionCTA.tsx          # Smart Transfer feature
│   │   ├── TierRulesAccordion.tsx
│   │   └── TierTabs.tsx
│   ├── navigation/                         # Responsive Navigation System
│   │   ├── NavigationShell.tsx             # Root wrapper
│   │   ├── SkipToContentLink.tsx           # A11y skip link
│   │   ├── desktop/
│   │   │   ├── TopNavigationBar.tsx        # Desktop header
│   │   │   ├── TopNavItem.tsx              # Nav link
│   │   │   └── TopNavUtilities.tsx         # Bell, badge, profile
│   │   ├── mobile/
│   │   │   ├── BottomTabBar.tsx            # Mobile bottom bar
│   │   │   ├── BottomTabItem.tsx           # Tab item
│   │   │   ├── MobileNavSpacer.tsx         # Content overlap prevention
│   │   │   └── MoreMenuButton.tsx          # Opens drawer
│   │   ├── more/
│   │   │   ├── MoreMenuDrawer.tsx          # Half-sheet modal
│   │   │   └── MoreMenuItem.tsx            # Drawer item
│   │   └── utilities/
│   │       ├── NotificationBadge.tsx       # Red count badge
│   │       └── TierBadgeIndicator.tsx      # Tier pill
│   ├── notifications/
│   │   ├── NotificationBanner.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── NotificationModal.tsx
│   │   ├── NotificationSettings.tsx
│   │   └── RetrogressionAlert.tsx
│   ├── shared/
│   │   ├── Accordion.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Modal.tsx
│   │   └── Tabs.tsx
│   └── transactions/
│       └── TransactionBenefitBadge.tsx
│
├── context/
│   ├── MemberContext.tsx                   # Member profile + tier
│   ├── TierContext.tsx                     # Tier configurations
│   ├── NotificationContext.tsx             # Notification state
│   ├── TransferContext.tsx                 # Transfer form data
│   ├── LoyaltyTransferContext.tsx          # Loyalty transfer flow
│   └── LayoutContext.tsx                   # Layout state (unused)
│
├── lib/
│   ├── api.ts                              # Mock API layer (~1500 lines)
│   ├── calculations.ts                     # Tier calc, benefit calc, rolling balance
│   ├── constants.ts                        # TIER_CONFIGURATIONS, FEATURE_FLAGS, DESIGN_TOKENS
│   ├── formatting.ts                       # formatCurrency, formatDate, etc.
│   ├── hooks.ts                            # useMember(), useTiers(), useNotifications()
│   ├── mock-data.ts                        # Raw mock data
│   ├── types.ts                            # Core TypeScript types
│   ├── loyalty-transfer/                   # Smart Transfer feature
│   │   ├── types.ts
│   │   ├── services.ts
│   │   ├── utils.ts
│   │   ├── design-tokens.ts
│   │   └── index.ts
│   └── navigation/                         # Responsive Navigation
│       ├── types.ts
│       ├── config.ts                       # NAVIGATION_CONFIG
│       ├── utils.ts                        # getActiveNavItem()
│       ├── hooks.ts                        # useNavigationState()
│       ├── icons.tsx                       # SVG icons + ICON_MAP
│       └── index.ts
│
├── styles/
│   ├── globals.css                         # Tailwind + slide-up animation
│   ├── variables.css                       # CSS custom properties
│   └── accessibility.css                   # A11y utility styles
│
├── feature-specs/                          # Shard spec documents
│   ├── smart-loyalty-transfer/             # 5 shards + QC report
│   └── responsive-navigation/             # 5 shards + screen inventory + QC report
│
├── CLAUDE.md                               # Project instructions (read this first!)
├── BUILD-STATE.md                          # THIS FILE
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

---

## Context Providers (Dependency Order)

1. **MemberProvider** — Fetches mock member "Patricia Johnson" (Plus tier). Provides `useMember()`.
2. **TierProvider** — Tier configurations (Classic $2.5K, Plus $10K, Premium $25K). Provides `useTiers()`.
3. **NotificationProvider** — Notification list + unread count. Provides `useNotifications()`.
4. **TransferProvider** — Transfer form state. Provides `useTransfer()`.
5. **LoyaltyTransferProvider** — Loyalty transfer context with gap calculation. Provides `useLoyaltyTransfer()`, `useTransferForm()`, `useTierGap()`.

All providers are in `context/` and hooks are in `lib/hooks.ts` (core) or `context/LoyaltyTransferContext.tsx` (loyalty-specific).

---

## Tier System Quick Reference

| Tier | Rolling Balance | Autopays | APY Boost | Color |
|------|----------------|----------|-----------|-------|
| Classic | $2,500 | 1 (any) | +0.10% | Gray #6B7280 |
| Plus | $10,000 | 2 (max 1 CC) | +0.25% | Gold #D4A574 |
| Premium | $25,000 | 3 (max 2 CC) | +0.50% | Platinum #E8E8E8 |

- **Rolling balance**: Average of last-day-of-month balance for past 3 months
- **Grace period**: 30 days after criteria lapse before tier drops
- **Retrogression alerts**: At 30, 14, and 7 days before tier loss

---

## Design System Quick Reference

- **Body text**: 16px minimum (WCAG AAA)
- **Touch targets**: 48px minimum
- **Contrast**: 7:1 minimum (WCAG AAA)
- **Container**: max-width 900px
- **Breakpoints**: Mobile <768px, Tablet 768-1024, Desktop 1025+
- **Font sizes**: H1 28px, H2 24px, H3 20px, Body 16px, Small 14px (never smaller)

---

## Known Deprecated/Unused Files

These files exist from the initial build but are no longer used:
- `components/layout/Header.tsx` — Replaced by NavigationShell
- `components/layout/Navigation.tsx` — Replaced by NavigationShell
- `components/layout/MobileNav.tsx` — Replaced by BottomTabBar
- `components/layout/Sidebar.tsx` — Never integrated
- `context/LayoutContext.tsx` — Never integrated

These can be safely deleted in a cleanup pass.

---

## How to Add New Features

### New feature spec workflow:
1. Place shard specs in `feature-specs/<feature-name>/07-shards/`
2. Read `00-screen-inventory.md` first for build order
3. Build shards in order, running `npx next build` after each
4. Adapt spec routes to match actual codebase routes (specs may use idealized routes)

### Adding a new page:
1. Create `app/<route>/page.tsx`
2. Page will automatically get navigation from NavigationShell
3. If it belongs to an existing section, add its route prefix to `lib/navigation/config.ts`
4. If it's a new section, add to `NAVIGATION_CONFIG.sections`
5. Use `'use client'` directive (all pages are client-rendered)

### Adding a new component:
1. Place in appropriate folder under `components/`
2. Use inline SVGs for icons (see `lib/navigation/icons.tsx` for pattern)
3. Follow 48px minimum touch targets, 7:1 contrast
4. Use existing shared components (Button, Card, etc.) from `components/shared/`

---

## Commands

```bash
npm run dev          # Start dev server (port 3000)
npx next build       # Production build (verify zero errors)
git push origin main # Push to remote
```
