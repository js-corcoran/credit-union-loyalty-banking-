# Screen Inventory: Responsive Navigation System
**Build Order & Component Dependency Graph**

**Document Version**: 1.0
**Created**: 2026-02-22
**Status**: Implementation Ready

---

## Overview

This is NOT a traditional screen inventory. Navigation is a **cross-cutting concern** that wraps all 17 screens in a layout-level component shell. This inventory defines the **component build order** — which building blocks must be created first because all other components depend on them.

**Key Principle**: The Navigation System is a **layout wrapper**, not a screen itself. It lives in `app/layout.tsx` and surrounds all page content (`{children}`).

---

## Build Phases & Dependency Graph

### Phase 1: Foundation (BUILD FIRST — Everything Depends On This)

**Shard 01: Navigation Foundation & Configuration**

These components and utilities are prerequisites for all other navigation work:

| Component/Module | Purpose | Depends On | Phase |
|---|---|---|---|
| **TypeScript Types & Interfaces** | NavigationItem, NavigationConfig, NavigationState, MoreMenuItem | None | 1 |
| **NAVIGATION_CONFIG constant** | All 17 screens mapped to 5 nav sections | Types | 1 |
| **Route-to-Nav Mapping Utility** | `getActiveNavItem()` function | NAVIGATION_CONFIG | 1 |
| **useNavigationState Hook** | React hook for active item state management | Types, NAVIGATION_CONFIG | 1 |
| **SkipToContentLink Component** | Accessibility component (screen reader only) | None | 1 |
| **Design Tokens** | CSS custom properties for colors, spacing, typography | None | 1 |
| **Icon Mapping** | Lucide icon name → component map | None | 1 |
| **NavigationShell Component** | Root layout wrapper (responsive container) | All of above | 1 |

**Why Phase 1 First?**
- All downstream components consume types, config, hooks, and utilities
- Establishing the design token system prevents later rework
- The NavigationShell must render before TopNav and BottomNav can be added
- Route mapping must be stable before screen implementations begin

**Files Created in Phase 1**:
- `lib/types/navigation.ts` — All TypeScript interfaces
- `lib/constants/navigation.ts` — NAVIGATION_CONFIG, icon mapping
- `lib/hooks/useNavigationState.ts` — Active item hook
- `lib/utils/navigation.ts` — getActiveNavItem(), route utilities
- `lib/tokens/navigation-tokens.ts` — Design tokens (colors, spacing, typography)
- `components/navigation/SkipToContentLink.tsx` — Accessibility component
- `components/navigation/NavigationShell.tsx` — Root wrapper
- `app/layout.tsx` — Integrate NavigationShell

---

### Phase 2: Desktop Top Navigation

**Shard 02: Desktop Top Navigation**

Builds on Phase 1 foundation to create desktop-specific components:

| Component | Purpose | Depends On | Phase |
|---|---|---|---|
| **TopNavigationBar** | Fixed top bar container (sticky, 64px desktop / 56px tablet) | NavigationShell, NAVIGATION_CONFIG, Design Tokens | 2 |
| **TopNavLogo** | Credit union branding (clickable → home) | Design Tokens | 2 |
| **TopNavItemGroup** | Container for nav items (horizontal flex layout) | None | 2 |
| **TopNavItem** | Icon + label link with active/hover/focus states | Design Tokens, Icon Mapping | 2 |
| **TopNavUtilities** | Container for notification bell, tier badge, profile | Design Tokens | 2 |
| **NotificationBell** | Unread notification count badge | None | 2 |
| **TierBadgeIndicator** | Classic/Plus/Premium indicator | Design Tokens | 2 |
| **ProfileDropdown** | Avatar/initials + dropdown menu (Settings, Logout, etc.) | Shadcn Sheet component | 2 |

**Why Phase 2 After Phase 1?**
- Phase 1 provides navigation config, hooks, and utilities that TopNav consumes
- Design tokens must exist before styling components
- All components need access to active nav item state (from useNavigationState)
- Icon mapping is required before TopNavItem can render icons

**Files Created in Phase 2**:
- `components/navigation/desktop/TopNavigationBar.tsx`
- `components/navigation/desktop/TopNavLogo.tsx`
- `components/navigation/desktop/TopNavItemGroup.tsx`
- `components/navigation/desktop/TopNavItem.tsx`
- `components/navigation/desktop/TopNavUtilities.tsx`
- `components/navigation/desktop/NotificationBell.tsx`
- `components/navigation/desktop/TierBadgeIndicator.tsx`
- `components/navigation/desktop/ProfileDropdown.tsx`

**Tailwind Classes Established in This Phase**:
- Responsive visibility: `hidden md:block` (top nav appears on tablet+)
- Sticky positioning: `sticky top-0 z-40`
- Layout: `flex justify-between items-center`
- Typography: 16px labels on desktop, 14px on tablet
- Contrast: 7:1 minimum for text/icon against background

---

### Phase 3: Mobile Bottom Tab Navigation

**Shard 03: Mobile Bottom Tab Navigation**

Creates mobile-specific components, builds on Phase 1 foundation:

| Component | Purpose | Depends On | Phase |
|---|---|---|---|
| **BottomTabBar** | Fixed bottom bar container (56px + safe area padding) | NavigationShell, NAVIGATION_CONFIG, Design Tokens | 3 |
| **BottomTabItem** | Icon + label vertical stack (48px+ tap targets) | Design Tokens, Icon Mapping | 3 |
| **MobileNavSpacer** | Padding component (prevents content hidden under tab bar) | None | 3 |
| **MoreMenuButton** | Tap target to open More drawer | None | 3 |
| **MoreMenuDrawer** | Shadcn Sheet (half-sheet from bottom on mobile) | Shadcn Sheet, MoreMenuItem | 3 |
| **MoreMenuItem** | Icon + label + description for secondary options | Design Tokens | 3 |
| **SafeAreaInsets** | CSS handling for notch/gesture bar (iOS/Android) | None | 3 |

**Why Phase 3 After Phase 1 & 2?**
- Phase 1 provides config and utilities
- Phase 2 establishes design token system
- Bottom nav and desktop nav are independent implementations of same structure
- Safe area handling can be standardized across both nav types once tokens are set

**Files Created in Phase 3**:
- `components/navigation/mobile/BottomTabBar.tsx`
- `components/navigation/mobile/BottomTabItem.tsx`
- `components/navigation/mobile/MobileNavSpacer.tsx`
- `components/navigation/mobile/MoreMenuDrawer.tsx`
- `components/navigation/mobile/MoreMenuItem.tsx`
- `components/navigation/mobile/SafeAreaWrapper.tsx`

**Tailwind Classes Established in This Phase**:
- Responsive visibility: `block md:hidden` (bottom nav appears only on mobile)
- Fixed positioning: `fixed bottom-0 z-40`
- Safe area: `pb-[env(safe-area-inset-bottom)]`
- Tap targets: `min-h-[56px] flex flex-col items-center justify-center`
- Typography: 12px labels on mobile

---

### Phase 4: More Menu & Utilities

**Shard 04: More Menu & Utilities**

Creates secondary navigation components and utility patterns:

| Component | Purpose | Depends On | Phase |
|---|---|---|---|
| **MoreMenuDrawer (Mobile)** | Shadcn Sheet with Settings, Notifications, Help, Logout | Shadcn UI components, Design Tokens | 4 |
| **MoreMenuDropdown (Desktop)** | Desktop version of More (dropdown vs. sheet) | Design Tokens | 4 |
| **TopNavUtilities (Refined)** | Notification bell with badge, tier indicator, profile menu | TierBadgeIndicator, NotificationBell, ProfileDropdown | 4 |
| **FocusTrapLayer** | Keyboard focus management for modal/sheet | None | 4 |
| **BackdropOverlay** | Semi-transparent overlay behind More drawer/dropdown | Design Tokens | 4 |
| **MoreMenuKeyboardHandler** | Escape key to close, arrow key navigation | None | 4 |

**Why Phase 4 After Phases 1–3?**
- Builds on top-nav utilities (Phase 2) and bottom tab structure (Phase 3)
- The More menu pattern integrates both desktop and mobile implementations
- Keyboard and focus management can build on established patterns from earlier phases
- All components exist before More menu is integrated

**Files Created in Phase 4**:
- `components/navigation/more/MoreMenuDrawer.tsx` (mobile)
- `components/navigation/more/MoreMenuDropdown.tsx` (desktop)
- `components/navigation/more/MoreMenuItem.tsx`
- `components/navigation/more/MoreMenuFocusManager.tsx`
- `lib/hooks/useMoreMenuKeyboard.ts`

---

### Phase 5: Integration & Accessibility Pass

**Shard 05: Integration & Accessibility Pass**

Final integration, testing, and hardening:

| Task | Purpose | Depends On | Phase |
|---|---|---|---|
| **Integrate TopNav + BottomTab in NavigationShell** | Ensure both render correctly with CSS visibility control | Phases 1–4 complete | 5 |
| **Breakpoint Transition Testing** | Verify no FOUC, no layout shift on resize | All nav components | 5 |
| **Focus Management Testing** | Tab order, focus trap, restoration after navigation | All interactive elements | 5 |
| **Screen Reader Testing Checklist** | NVDA, JAWS, VoiceOver compatibility | All components with ARIA | 5 |
| **Keyboard Navigation E2E** | Tab, Arrow, Enter, Escape all work correctly | All nav components | 5 |
| **axe-core Integration** | Automated accessibility testing in CI/CD | All components | 5 |
| **Performance Verification** | No CLS from nav, <100ms render time | All components | 5 |
| **Breadcrumb Coexistence** | Verify nav + existing breadcrumbs work together | Phases 1–4 + existing breadcrumbs | 5 |
| **Dark Mode (if applicable)** | Ensure nav adapts to dark theme | Design tokens | 5 |
| **RTL Considerations (future-proofing)** | Directional CSS ready for RTL | All components | 5 |
| **Complete Test Suite** | Unit, integration, e2e, a11y tests | All components | 5 |

**Files Created/Modified in Phase 5**:
- `tests/unit/navigation.test.ts` — Unit tests for hooks, utilities
- `tests/integration/navigation.integration.test.ts` — Component integration tests
- `tests/e2e/navigation.e2e.test.ts` — Full user flow tests
- `tests/a11y/navigation-a11y.test.ts` — Accessibility tests
- `cypress/e2e/navigation.cy.ts` — E2E tests with Cypress
- `app/layout.tsx` — Final integration
- Accessibility audit checklist document

---

## Build Order Summary Table

| Phase | Components | Dependencies | Timeline |
|---|---|---|---|
| **1: Foundation** | Types, Config, Hooks, Utilities, Design Tokens, NavigationShell | None | Week 1 (Days 1–2) |
| **2: Desktop Nav** | TopNav, Logo, Items, Utilities, Bell, Badge, Profile | Phase 1 | Week 1 (Days 2–3) |
| **3: Mobile Nav** | BottomTab, TabItem, Spacer, MoreButton, MoreDrawer, SafeArea | Phase 1 | Week 1 (Days 3–4) |
| **4: More Menu** | MoreDrawer (mobile), MoreDropdown (desktop), Focus Management | Phases 1–3 | Week 1 (Days 4–5) |
| **5: Integration & A11y** | Testing, A11y Hardening, Performance Verification, Final Integration | Phases 1–4 | Week 2 (Days 5–10) |

---

## Parallel Work Opportunities

**These can be done in parallel:**
- Phase 2 (Desktop Nav) and Phase 3 (Mobile Nav) can be built simultaneously once Phase 1 is complete — they don't depend on each other
- Phase 4 (More Menu) has minimal dependency on Phases 2 & 3 — can start once Phase 1 is done, finish after Phases 2 & 3
- Phase 5 (Testing) can begin during Phase 4, accelerating final integration

**Sequential Dependencies (Cannot Parallelize):**
- Phase 1 must complete first
- Phases 2, 3, 4 all depend on Phase 1
- Phase 5 must follow Phases 2, 3, 4

---

## Cross-Cutting Concerns (Not Phase-Specific)

These run throughout all phases:

| Concern | Ownership | Integration Points |
|---|---|---|
| **Responsive CSS** | All phases | Tailwind configuration, media queries |
| **Accessibility** | All phases | Types, components, testing |
| **TypeScript Strictness** | Phase 1 + all downstream | Type safety throughout |
| **Icon Library** | Phase 1 (mapping) + Phases 2 & 3 (rendering) | Lucide React |
| **Design Tokens** | Phase 1 + all downstream | Tailwind config or CSS custom properties |
| **State Management** | Phase 1 (hook) + Phases 2–3 (consumption) | useNavigationState, usePathname |

---

## Files to Create by End of All Phases

### Type Definitions & Constants
- `lib/types/navigation.ts` — NavigationItem, NavigationConfig, NavigationState, MoreMenuItem
- `lib/constants/navigation.ts` — NAVIGATION_CONFIG with all 17 screens, icon mapping
- `lib/tokens/navigation-tokens.ts` — Design tokens (colors, spacing, type scales)

### Hooks & Utilities
- `lib/hooks/useNavigationState.ts` — Active item detection
- `lib/hooks/useMoreMenuKeyboard.ts` — Escape/arrow key handling
- `lib/utils/navigation.ts` — getActiveNavItem(), route helpers

### Navigation Components (Desktop)
- `components/navigation/desktop/TopNavigationBar.tsx`
- `components/navigation/desktop/TopNavLogo.tsx`
- `components/navigation/desktop/TopNavItemGroup.tsx`
- `components/navigation/desktop/TopNavItem.tsx`
- `components/navigation/desktop/TopNavUtilities.tsx`
- `components/navigation/desktop/NotificationBell.tsx`
- `components/navigation/desktop/TierBadgeIndicator.tsx`
- `components/navigation/desktop/ProfileDropdown.tsx`

### Navigation Components (Mobile)
- `components/navigation/mobile/BottomTabBar.tsx`
- `components/navigation/mobile/BottomTabItem.tsx`
- `components/navigation/mobile/MobileNavSpacer.tsx`
- `components/navigation/mobile/SafeAreaWrapper.tsx`
- `components/navigation/mobile/MoreMenuButton.tsx`

### Navigation Components (More Menu)
- `components/navigation/more/MoreMenuDrawer.tsx`
- `components/navigation/more/MoreMenuDropdown.tsx`
- `components/navigation/more/MoreMenuItem.tsx`
- `components/navigation/more/MoreMenuFocusManager.tsx`

### Shared/Root Components
- `components/navigation/SkipToContentLink.tsx`
- `components/navigation/NavigationShell.tsx`

### Tests
- `tests/unit/navigation.test.ts`
- `tests/integration/navigation.integration.test.ts`
- `tests/e2e/navigation.e2e.test.ts`
- `tests/a11y/navigation-a11y.test.ts`
- `cypress/e2e/navigation.cy.ts`

### Root Layout Integration
- `app/layout.tsx` — Modified to include NavigationShell

---

## Dependency Matrix (Quick Reference)

```
Phase 1 (Foundation)
├── Types & Config
├── Hooks & Utils
├── Design Tokens
├── SkipToContentLink
└── NavigationShell
    │
    ├── Phase 2 (Desktop)
    │   ├── TopNavigationBar
    │   ├── TopNavLogo
    │   ├── TopNavItem (×5)
    │   └── TopNavUtilities
    │       ├── NotificationBell
    │       ├── TierBadgeIndicator
    │       └── ProfileDropdown
    │
    ├── Phase 3 (Mobile)
    │   ├── BottomTabBar
    │   ├── BottomTabItem (×5)
    │   ├── MobileNavSpacer
    │   ├── SafeAreaWrapper
    │   └── MoreMenuButton
    │
    └── Phase 4 (More Menu)
        ├── MoreMenuDrawer (mobile)
        ├── MoreMenuDropdown (desktop)
        ├── MoreMenuItem (×4)
        └── FocusManagement Hooks

Phase 5 (Integration & A11y) — Depends on all Phases 1–4 complete
```

---

## Implementation Checklist

Use this to track progress across all phases:

### Phase 1 (Foundation)
- [ ] Create `lib/types/navigation.ts` with all interfaces
- [ ] Create `lib/constants/navigation.ts` with NAVIGATION_CONFIG
- [ ] Create design token system (`lib/tokens/`)
- [ ] Create `useNavigationState` hook
- [ ] Create navigation utilities (`lib/utils/navigation.ts`)
- [ ] Create `SkipToContentLink` component
- [ ] Create `NavigationShell` component
- [ ] Update `app/layout.tsx` to include NavigationShell

### Phase 2 (Desktop)
- [ ] Create `TopNavigationBar` component
- [ ] Create `TopNavLogo` component
- [ ] Create `TopNavItem` component
- [ ] Create `TopNavItemGroup` component
- [ ] Create `NotificationBell` component
- [ ] Create `TierBadgeIndicator` component
- [ ] Create `ProfileDropdown` component
- [ ] Create `TopNavUtilities` component
- [ ] Test on desktop (≥1024px) and tablet (768px–1023px)

### Phase 3 (Mobile)
- [ ] Create `BottomTabBar` component
- [ ] Create `BottomTabItem` component
- [ ] Create `MobileNavSpacer` component
- [ ] Create `SafeAreaWrapper` component
- [ ] Create `MoreMenuButton` component
- [ ] Test safe area handling (iOS notch, Android gesture bar)
- [ ] Verify MobileNavSpacer prevents content obscuring
- [ ] Test on mobile (<768px)

### Phase 4 (More Menu)
- [ ] Create `MoreMenuDrawer` (mobile version)
- [ ] Create `MoreMenuDropdown` (desktop version)
- [ ] Create `MoreMenuItem` component
- [ ] Implement focus trap in More drawer
- [ ] Implement Escape key close
- [ ] Create backdrop overlay
- [ ] Test focus management
- [ ] Test keyboard navigation

### Phase 5 (Integration & A11y)
- [ ] Verify no layout shift on breakpoint transition
- [ ] Verify no FOUC (flash of unstyled content)
- [ ] Test focus management across all breakpoints
- [ ] Run axe-core accessibility testing
- [ ] Test with NVDA screen reader
- [ ] Test with JAWS screen reader
- [ ] Keyboard navigation E2E testing
- [ ] Performance testing (<100ms nav load)
- [ ] Verify dark mode (if applicable)
- [ ] Create comprehensive test suite
- [ ] Final accessibility audit

---

## Next Steps

1. **Review this inventory with engineering team** — Confirm Phase 1 scope and timeline
2. **Create Phase 1 files first** — These are prerequisites for everything else
3. **Begin Phase 2 and 3 in parallel** — Can work on desktop and mobile simultaneously once Phase 1 is done
4. **Integrate Phase 4 during Phases 2–3** — More menu patterns can be finalized as main nav components near completion
5. **Execute Phase 5 testing** — Begin toward end of Phase 4, accelerate integration

---

**END OF SCREEN INVENTORY**
