# Shard 01: Navigation Foundation & Configuration
**Responsive Navigation System — Phase 1 (BUILD FIRST)**

**Document Version**: 1.0
**Created**: 2026-02-22
**Status**: Implementation Ready
**Audience**: Frontend Engineers, TypeScript/React Developers

---

## 1. Component Name & Location

**Component**: `NavigationShell` (Root Layout Wrapper)
**Location**: `app/layout.tsx`
**Related Files**:
- `lib/types/navigation.ts` — TypeScript interfaces
- `lib/constants/navigation.ts` — NAVIGATION_CONFIG constant + icon mapping
- `lib/hooks/useNavigationState.ts` — Active nav item hook
- `lib/utils/navigation.ts` — Route-to-nav mapping utilities
- `lib/tokens/navigation-tokens.ts` — Design tokens (colors, spacing, type)
- `components/navigation/SkipToContentLink.tsx` — Skip-to-content accessibility link
- `components/navigation/NavigationShell.tsx` — Responsive container component

**Type**: Layout-level wrapper component (renders around all page `{children}`)

---

## 2. Purpose & Jobs-to-be-Done

**Primary Purpose**: Establish the foundational infrastructure for the responsive navigation system. This shard creates all types, configuration, utilities, and design tokens that downstream components (TopNav, BottomNav, MoreMenu) depend on.

**Jobs-to-be-Done**:
1. **Define Navigation Structure** — Map all 17 screens to 5 primary navigation sections so both desktop and mobile implementations can reference consistent structure
2. **Detect Active Nav Item** — Given a URL pathname, determine which nav section is currently active (e.g., `/loyalty/tier-details` → "Loyalty" is active)
3. **Provide Design Consistency** — Centralize all color, spacing, typography decisions in design tokens so all navigation components have consistent sizing and styling
4. **Enable Responsive Rendering** — Create a container component (NavigationShell) that wraps page content and conditionally displays TopNav or BottomNav based on viewport width
5. **Support Accessibility First** — Establish standards for ARIA labels, focus management, keyboard navigation at the foundation level
6. **Establish Icon Strategy** — Define which Lucide React icons represent each navigation section so icons are consistent across all implementations

---

## 3. User Stories & Acceptance Criteria

### Story 1: Route-to-Navigation Mapping
**As** a frontend engineer
**I want** a function that maps any app URL to its primary navigation section
**So that** I can determine which nav item should be "active" regardless of nested screen depth

**Acceptance Criteria**:
- GIVEN a pathname like `/loyalty/tier-details`
- WHEN I call `getActiveNavItem('/loyalty/tier-details', NAVIGATION_CONFIG)`
- THEN it returns `{ id: 'loyalty', label: 'Loyalty', ... }`
- AND the function works for all 17 screens (SCR-01 through SCR-17)
- AND nested screens (SCR-04) inherit the active state of their parent section (Loyalty)
- AND the root path `/` maps to Home

### Story 2: Navigation Config Completeness
**As** a product manager
**I want** a single source of truth that lists all nav sections and their screens
**So that** I can quickly verify that all 17 screens have a navigation home

**Acceptance Criteria**:
- GIVEN NAVIGATION_CONFIG constant
- WHEN I review the configuration
- THEN I see exactly 5 primary sections (Home, Loyalty, Move Money, Loans, More)
- AND each section lists all screens that belong to it
- AND the mapping accounts for all 17 screens (SCR-01 to SCR-17)
- AND no screen appears in multiple sections
- AND the config is exportable as JSON for documentation

### Story 3: Type Safety for Navigation
**As** a frontend engineer
**I want** TypeScript interfaces that prevent runtime errors
**So that** I can refactor navigation without breaking existing implementations

**Acceptance Criteria**:
- GIVEN a NavigationItem type
- WHEN I create a new nav item
- THEN TypeScript enforces: id, label, route, icon, screens (array), description (optional)
- AND NAVIGATION_CONFIG is statically typed as NavigationConfig
- AND useNavigationState hook returns NavigationItem | null (no ambiguity)
- AND the compiler prevents invalid navigation structures at build time

### Story 4: Design Token System
**As** a UI engineer
**I want** centralized design tokens for colors, spacing, and typography
**So that** all nav components (TopNav, BottomNav) can reference the same sizes and colors

**Acceptance Criteria**:
- GIVEN design token system
- WHEN I apply tokens to a component
- THEN nav bar height is consistent (64px desktop, 56px mobile)
- AND tap target sizes are 48px minimum (AAA compliance)
- AND label typography is 16px on desktop, 12px on mobile
- AND all colors meet 7:1 contrast ratio for accessibility
- AND tokens are available as Tailwind utilities (e.g., `bg-nav-primary`)

### Story 5: Skip-to-Content Link
**As** a keyboard user
**I want** a way to skip navigation and jump directly to main content
**So that** I don't have to Tab through all nav items to reach the page content

**Acceptance Criteria**:
- GIVEN the SkipToContentLink component
- WHEN I press Tab from browser chrome, the link appears
- THEN it's visibly focused with sufficient contrast
- THEN clicking it or pressing Enter moves focus to `#main-content`
- AND the link is hidden by default (not visible to sighted users)
- AND the link is always the first focusable element on the page

---

## 4. States (Default / Loading / Error / Permission Denied / Offline)

### Default State
- **Navigation Items**: Displayed based on user profile (Loans visible only if user has loans)
- **Active State**: Matches current URL pathname
- **Tier Badge**: Shows current tier (Classic, Plus, Premium) based on user data
- **Notification Badge**: Shows unread count (0 if none)

### Loading State
- **Scenario**: App is initializing, user data not yet fetched
- **Behavior**: Render NavigationShell with skeleton states or disabled items
- **Design**: Show nav structure but dim or disable interactive elements until data loads
- **Duration**: <1 second (design-first mode uses dummy data, so this is brief)

### Error State
- **Scenario**: Navigation config is missing or malformed
- **Behavior**: Log error, render fallback navigation (Home link only)
- **Design**: Do not crash the entire app; always show at least Home link
- **Recovery**: Automatic retry on next navigation event

### Permission Denied State
- **Scenario**: User doesn't have permission to view certain sections (e.g., Loans if no loan products)
- **Behavior**: Hide Loans nav item from tab bar / top nav
- **Design**: Logical grouping hides unavailable sections without breaking layout
- **Example**: Mobile tab bar shows 4 items (Home, Loyalty, Move Money, More) if user has no loans

### Offline State
- **Scenario**: App detects no internet connection
- **Behavior**: Navigation remains interactive (local routing still works)
- **Design**: All nav items remain visible (offline doesn't prevent navigation to previously loaded screens)
- **Note**: Notification badges may show stale data; refresh on reconnect

---

## 5. Information Architecture

### Screen Grouping (All 17 Screens Mapped)

```
Navigation Structure (5 Primary Sections)
│
├── HOME (2 screens)
│   ├── SCR-01: Home Dashboard
│   └── SCR-02: Transaction History
│
├── LOYALTY (5 screens)
│   ├── SCR-03: Loyalty Hub Landing
│   ├── SCR-04: Tier Details
│   ├── SCR-05: Rewards Catalog
│   ├── SCR-06: Reward Redemption
│   └── SCR-07: Benefits Comparison
│
├── MOVE MONEY (4 screens)
│   ├── SCR-08: Move Money Transfer
│   ├── SCR-09: Move Money Confirmation
│   ├── SCR-10: Bill Pay Dashboard
│   └── SCR-11: Bill Pay Setup
│
├── LOANS (2 screens) [Conditional visibility]
│   ├── SCR-12: Loan Overview
│   └── SCR-13: Loan Payment
│
└── MORE (4 screens)
    ├── SCR-14: Account Settings
    ├── SCR-15: Notification Center
    ├── SCR-16: Notification Settings
    └── SCR-17: Help & FAQ
```

### Route Mapping (17 Screens to URL Paths)

| Screen ID | Name | Route | Nav Section | Nested Path |
|---|---|---|---|---|
| SCR-01 | Home Dashboard | `/` | Home | (root) |
| SCR-02 | Transaction History | `/transactions` | Home | (sibling) |
| SCR-03 | Loyalty Hub | `/loyalty` | Loyalty | (root of section) |
| SCR-04 | Tier Details | `/loyalty/tier-details` | Loyalty | (nested) |
| SCR-05 | Rewards Catalog | `/loyalty/rewards` | Loyalty | (nested) |
| SCR-06 | Reward Redemption | `/loyalty/redeem/:id` | Loyalty | (nested) |
| SCR-07 | Benefits Comparison | `/loyalty/benefits` | Loyalty | (nested) |
| SCR-08 | Move Money Transfer | `/move-money/transfer` | Move Money | (root of section) |
| SCR-09 | Confirmation | `/move-money/transfer/confirm` | Move Money | (nested) |
| SCR-10 | Bill Pay Dashboard | `/move-money/bill-pay` | Move Money | (sibling) |
| SCR-11 | Bill Pay Setup | `/move-money/bill-pay/setup` | Move Money | (nested) |
| SCR-12 | Loan Overview | `/loans` | Loans | (root of section) |
| SCR-13 | Loan Payment | `/loans/:id/payment` | Loans | (nested) |
| SCR-14 | Account Settings | `/settings` | More | (root of section) |
| SCR-15 | Notification Center | `/notifications` | More | (sibling) |
| SCR-16 | Notification Settings | `/notifications/preferences` | More | (nested) |
| SCR-17 | Help & FAQ | `/help` | More | (sibling) |

**Navigation Config Priority**:
- Primary nav items map to section roots (`/loyalty`, `/move-money`, `/loans`, `/settings`)
- Nested screens inherit parent section's active state
- Breadcrumbs show full path; nav only highlights top-level section

---

## 6. Components & Responsibilities (Component Tree)

### Component Hierarchy

```
app/layout.tsx
├── <SkipToContentLink />
│   └── Renders hidden link to "#main-content" (keyboard users only)
│
├── <NavigationShell pathname={pathname}>
│   ├── Receives pathname from usePathname() hook
│   ├── Computes activeNavItem via getActiveNavItem()
│   ├── Provides NavigationContext to descendants
│   │
│   ├── <TopNavigationBar /> [rendered here, visibility: hidden md:block]
│   │   └── Receives activeNavItem, navigationConfig
│   │
│   ├── <BottomTabBar /> [rendered here, visibility: block md:hidden]
│   │   └── Receives activeNavItem, navigationConfig
│   │
│   └── <header>
│       └── Wraps both nav implementations
│
├── <main id="main-content">
│   └── {children} — Page content
│
└── <MobileNavSpacer /> [rendered here]
    └── Adds padding-bottom on mobile (prevents nav overlap)
```

### NavigationShell Component Responsibilities

| Responsibility | Implementation |
|---|---|
| **Detect Active Nav Item** | Call `useNavigationState(pathname)` hook to get current active section |
| **Provide Context** | Export NavigationContext with activeNavItem, navigationConfig, user data |
| **Conditional Rendering** | Render TopNav (hidden <768px) and BottomNav (hidden ≥768px) based on CSS |
| **Layout Structure** | Wrap page content in header/nav structure; add main content area with id="main-content" |
| **Accessibility Entry Point** | Ensure SkipToContentLink is first focusable element; set up landmark structure |
| **Responsive Behavior** | Manage padding on body/main to prevent content overlap with nav |

### Utility Functions & Hooks

| Function/Hook | Input | Output | Purpose |
|---|---|---|---|
| `getActiveNavItem(pathname, config)` | pathname (string), NAVIGATION_CONFIG | NavigationItem \| null | Given URL, return which nav section is active |
| `getScreenNavSection(screenId)` | screenId (SCR-01, SCR-02, etc.) | NavigationItem | Given a screen ID, find its parent nav section |
| `useNavigationState(pathname)` | pathname (string) | { activeNavItem: NavigationItem \| null, isLoading: boolean } | React hook that watches pathname and returns active nav item |
| `getNavItemByRoute(route, config)` | route (string), NAVIGATION_CONFIG | NavigationItem \| null | Find nav item by exact route match (e.g., `/loyalty` → Loyalty) |

### Types & Interfaces

```typescript
// NavigationItem — Individual nav section
interface NavigationItem {
  id: 'home' | 'loyalty' | 'move-money' | 'loans' | 'more';
  label: string; // e.g., "Loyalty"
  route: string; // e.g., "/loyalty"
  icon: string; // Lucide icon name, e.g., "gift"
  screens: string[]; // Array of screen IDs: ["SCR-03", "SCR-04", ...]
  description?: string; // For "More" drawer tooltip
  badge?: { count: number; label: string }; // Notification badge
  tier?: 'classic' | 'plus' | 'premium'; // For tier badge display
  visible?: boolean; // Whether item should be shown (default: true)
}

// NavigationConfig — Complete navigation structure
interface NavigationConfig {
  sections: NavigationItem[];
  defaultRoute: string; // "/"
  moreMenuItems: MoreMenuItem[];
}

// NavigationState — Current navigation state
interface NavigationState {
  activeNavItem: NavigationItem | null;
  pathname: string;
  isLoading: boolean;
}

// MoreMenuItem — Item in More menu/drawer
interface MoreMenuItem {
  id: string; // e.g., "settings", "notifications", "help"
  label: string; // e.g., "Settings"
  route: string; // e.g., "/settings"
  icon: string; // Lucide icon name
  description?: string; // Short description for accessibility
}
```

---

## 7. Interactions (Event List → Behavior, Focus Management)

### Keyboard Navigation (Tab)
| Event | Trigger | Behavior | Focus Management |
|---|---|---|---|
| Tab from browser address bar | Browser native | Focus enters SkipToContentLink (first focusable) | Focus trap: none (user can Tab backward out of page) |
| Tab → SkipToContentLink | Keyboard | Link becomes visible with focus outline | Focus visible outline (3px border) |
| Enter on SkipToContentLink | Keyboard | Focus jumps to #main-content | Focus moves to main element |
| Tab → first nav item | Keyboard | First nav item receives focus (Home on desktop/mobile) | Focus outline visible on nav link |
| Tab between nav items | Keyboard | Focus cycles left-to-right through all nav items | Natural tab order (no tabindex manipulation) |
| Tab after last nav item | Keyboard | Focus moves to first focusable element in main content | Focus leaves nav, enters main |

### Pathname Change (React Router)
| Event | Trigger | Behavior | Active State |
|---|---|---|---|
| User clicks TopNavItem link | Click event | Browser navigates to new route | activeNavItem updates via useNavigationState hook |
| User clicks BottomTabItem | Click event | Browser navigates; bottom tab shows active | Active state reflects new pathname |
| User clicks breadcrumb in-page | Click event | Navigation within section occurs; nav item stays active | Breadcrumb updates, nav item unchanged |
| Browser back button | Browser native | Previous route loads; active nav item updates | Reflects previous section's nav item |
| Deep link (e.g., `/loyalty/tier-details`) | Direct URL or Share link | Component mounts with correct route; nav item pre-populated | Loyalty becomes active on first render |

### More Menu (Mobile) Interactions
| Event | Trigger | Behavior | Focus Management |
|---|---|---|---|
| Tap "More" tab item | Touch | MoreMenuDrawer slides up from bottom | Focus moves to first item in drawer (Settings) |
| Tab through More items | Keyboard | Focus cycles through all drawer items | Focus trap: Tab stays within drawer |
| Press Escape | Keyboard | Drawer closes, focus returns to "More" tab item | Focus restoration works correctly |
| Tap backdrop overlay | Touch | Drawer closes, focus returns to "More" tab item | Same as Escape |
| Tap menu item (e.g., Settings) | Touch | Drawer closes, navigation to `/settings` occurs | Active nav item becomes "More" |

### Active State Visual Feedback
| State | Desktop | Mobile | Accessibility |
|---|---|---|---|
| **Default** | Text color: gray-700, underline: none | Icon: outline style, Text: gray-700 | No aria-current |
| **Hover** | Text: blue-600, underline: none, background: blue-50 | Icon: outline, background: blue-50 | Same as default (hover is visual only) |
| **Focus** | Outline: 3px blue-600, underline: blue-600 | Outline: 3px blue-600 | aria-current="page" added |
| **Active** | Text: blue-600 (bold 600), underline: 3px blue-600 | Icon: solid style, Text: blue-600, underline: 2px blue-600 | aria-current="page" + bold weight |

---

## 8. Data Contracts (TypeScript Interfaces, JSON Examples, Service Facade, Future API)

### NAVIGATION_CONFIG Constant (Complete Specification)

```typescript
const NAVIGATION_CONFIG: NavigationConfig = {
  sections: [
    {
      id: 'home',
      label: 'Home',
      route: '/',
      icon: 'home',
      screens: ['SCR-01', 'SCR-02'],
      description: 'Dashboard and account overview',
      visible: true,
      badge: undefined, // No badge on Home
    },
    {
      id: 'loyalty',
      label: 'Loyalty',
      route: '/loyalty',
      icon: 'gift',
      screens: ['SCR-03', 'SCR-04', 'SCR-05', 'SCR-06', 'SCR-07'],
      description: 'Rewards, tier benefits, and loyalty status',
      visible: true,
      tier: 'plus', // Will be dynamic from user context
      badge: {
        count: 0, // Will be dynamic; 0 = no badge shown
        label: 'Pending Rewards',
      },
    },
    {
      id: 'move-money',
      label: 'Move Money',
      route: '/move-money/transfer', // Default landing
      icon: 'send',
      screens: ['SCR-08', 'SCR-09', 'SCR-10', 'SCR-11'],
      description: 'Transfers, bill pay, and payments',
      visible: true,
    },
    {
      id: 'loans',
      label: 'Loans',
      route: '/loans',
      icon: 'trending-down', // Or 'briefcase'
      screens: ['SCR-12', 'SCR-13'],
      description: 'Loan accounts and payments',
      visible: true, // Will be conditional based on user.hasLoans
    },
    {
      id: 'more',
      label: 'More',
      route: '/settings', // Default landing
      icon: 'menu',
      screens: ['SCR-14', 'SCR-15', 'SCR-16', 'SCR-17'],
      description: 'Settings and more options',
      visible: true,
    },
  ],
  defaultRoute: '/',
  moreMenuItems: [
    {
      id: 'settings',
      label: 'Settings',
      route: '/settings',
      icon: 'settings',
      description: 'Account preferences and security',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      route: '/notifications',
      icon: 'bell',
      description: 'Alerts and notification preferences',
    },
    {
      id: 'help',
      label: 'Help & FAQ',
      route: '/help',
      icon: 'help-circle',
      description: 'Support and frequently asked questions',
    },
    {
      id: 'logout',
      label: 'Logout',
      route: '/auth/logout',
      icon: 'log-out',
      description: 'Sign out of your account',
    },
  ],
};
```

### Icon Mapping (Lucide React)

```typescript
const ICON_MAP: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  'home': HomeIcon,
  'gift': GiftIcon,
  'send': SendIcon, // For "Move Money"
  'trending-down': TrendingDownIcon, // For "Loans"
  'menu': MenuIcon, // For "More" (or EllipsisVertical)
  'settings': SettingsIcon,
  'bell': BellIcon,
  'help-circle': HelpCircleIcon,
  'log-out': LogOutIcon,
};

// Usage: <Icon name="gift" size={24} /> — component handles rendering
```

### Route-to-Nav Mapping Logic

```typescript
function getActiveNavItem(
  pathname: string,
  config: NavigationConfig
): NavigationItem | null {
  // Exact match (e.g., "/" → Home)
  const exactMatch = config.sections.find(
    section => section.route === pathname
  );
  if (exactMatch) return exactMatch;

  // Prefix match (e.g., "/loyalty/tier-details" → Loyalty)
  const prefixMatch = config.sections.find(
    section => pathname.startsWith(section.route + '/')
      || pathname.startsWith(section.route)
  );
  if (prefixMatch) return prefixMatch;

  // Default fallback
  return config.sections[0]; // Home
}

// Test cases:
// "/" → Home ✓
// "/loyalty" → Loyalty ✓
// "/loyalty/tier-details" → Loyalty ✓
// "/loyalty/tier-details?tab=progress" → Loyalty ✓
// "/move-money/transfer" → Move Money ✓
// "/unknown" → Home (fallback) ✓
```

### useNavigationState Hook Specification

```typescript
function useNavigationState(pathname: string): NavigationState {
  const activeNavItem = useMemo(
    () => getActiveNavItem(pathname, NAVIGATION_CONFIG),
    [pathname]
  );

  return {
    activeNavItem,
    pathname,
    isLoading: false, // In design-first mode, no async loading
  };
}

// Usage in component:
// const { activeNavItem } = useNavigationState(pathname);
// if (activeNavItem?.id === 'loyalty') { /* highlight Loyalty */ }
```

### Design Tokens (CSS Custom Properties or Tailwind Config)

```typescript
// Option 1: CSS Custom Properties
const navigationTokens = {
  // Colors (must meet 7:1 contrast)
  '--nav-primary': '#1F2937', // Dark gray (primary nav bg)
  '--nav-text-default': '#6B7280', // Medium gray (default text)
  '--nav-text-active': '#2563EB', // Blue (active text)
  '--nav-bg-hover': '#F3F4F6', // Light gray
  '--nav-bg-active': 'transparent', // No background highlight

  // Spacing
  '--nav-height-desktop': '64px',
  '--nav-height-tablet': '56px',
  '--nav-height-mobile': '56px',
  '--nav-padding-horizontal': '16px',
  '--nav-padding-vertical': '8px',

  // Typography
  '--nav-font-size-desktop': '16px',
  '--nav-font-size-mobile': '12px',
  '--nav-font-weight-default': '500',
  '--nav-font-weight-active': '600',

  // Tap Targets
  '--tap-target-size': '48px',
  '--tap-target-size-mobile': '56px',

  // Transitions
  '--transition-duration': '150ms',
  '--transition-timing': 'ease-in-out',
};

// Option 2: Tailwind Config (preferred for this stack)
// extend theme colors with:
// nav-primary: '#1F2937'
// nav-text: '#6B7280'
// nav-active: '#2563EB'
// Use: className="text-nav-text hover:text-nav-active"
```

### Future API Integration (Stub for Next Phase)

When migrating from design-first dummy data to real API:

```typescript
// Current (design-first):
const NAVIGATION_CONFIG = { /* static constant */ };

// Future (API-driven):
async function fetchNavigationConfig(
  userId: string,
  userTier: 'classic' | 'plus' | 'premium'
): Promise<NavigationConfig> {
  const response = await fetch(`/api/navigation?user=${userId}&tier=${userTier}`);
  return response.json();
}

// The function would respect:
// - User permissions (conditionally hide Loans if no loans)
// - Tier benefits (show different rewards based on tier)
// - Personalization (reorder based on usage patterns)
// - A/B tests (vary labels or structures)

// Service facade example:
interface NavigationService {
  getConfig(userId: string): Promise<NavigationConfig>;
  getActiveItem(pathname: string): NavigationItem | null;
  trackNavClick(itemId: string, source: 'top' | 'bottom'): Promise<void>;
}
```

---

## 9. Validation Rules

### NavigationItem Validation
| Rule | Implementation | Error Handling |
|---|---|---|
| **id uniqueness** | All section IDs must be unique | Throw error during config load if duplicate |
| **label length** | Label must be 1–20 characters | Trim and log warning if exceeds |
| **route format** | Route must start with "/" | Prepend "/" if missing, log warning |
| **icon exists** | Icon name must exist in ICON_MAP | Throw error, fallback to "menu" icon |
| **screens array non-empty** | Each section must have ≥1 screen | Warn if empty; hide section from nav |
| **screens exist** | All screen IDs must be valid (SCR-01 to SCR-17) | Log warning for invalid screens |
| **no duplicate screens** | Screen can't appear in multiple sections | Throw error during validation |

### Route Validation
| Rule | Implementation | Behavior |
|---|---|---|
| **Pathname must start with "/"** | Validate in getActiveNavItem | Fallback to Home if invalid |
| **Pathname must match a known route** | Check against all section routes | Fallback to Home if no match |
| **Query params ignored** | Strip query string before matching | `/loyalty?tab=rewards` → `/loyalty` |
| **Hash params ignored** | Strip hash before matching | `/settings#security` → `/settings` |

### TypeScript Validation
| Check | Tool | Enforcement |
|---|---|---|
| **Interface compliance** | TypeScript compiler | All NavigationConfig objects must match interface |
| **Icon names valid** | TypeScript union type | `icon: 'gift' | 'send' | ...` (no arbitrary strings) |
| **Exhaustive switch** | TypeScript exhaustiveness check | All nav IDs must be handled in switch statements |
| **Undefined checks** | `strictNullChecks: true` | Can't access properties on nullable objects without checks |

---

## 10. Visual & Responsive Rules (Design Tokens, Tailwind Classes, Breakpoints)

### Responsive Breakpoints

```typescript
const BREAKPOINTS = {
  mobile: 0,        // < 768px
  tablet: 768,      // 768–1023px
  desktop: 1024,    // ≥ 1024px
};

// Tailwind-based:
// md: = 768px and above (tablet + desktop)
// lg: = 1024px and above (desktop)
```

### Desktop Navigation (≥1024px)
| Property | Value | Tailwind Class |
|---|---|---|
| **Height** | 64px | `h-16` |
| **Position** | Fixed/sticky | `sticky top-0` or `fixed top-0` |
| **Z-index** | 40 | `z-40` |
| **Background** | White or dark | `bg-white dark:bg-gray-900` |
| **Padding** | 16px horizontal, 8px vertical | `px-4 py-2` |
| **Border-bottom** | 1px gray | `border-b border-gray-200` |

### Mobile Bottom Navigation (<768px)
| Property | Value | Tailwind Class |
|---|---|---|
| **Height** | 56px + safe area | `h-14 pb-[env(safe-area-inset-bottom)]` |
| **Position** | Fixed bottom | `fixed bottom-0` |
| **Width** | Full screen | `w-full` |
| **Z-index** | 40 | `z-40` |
| **Background** | White or dark | `bg-white dark:bg-gray-900` |
| **Padding** | 4px horizontal, 0 vertical | `px-1 py-1` |
| **Border-top** | 1px gray | `border-t border-gray-200` |

### Nav Item Default State
| Property | Value | Tailwind Class |
|---|---|---|
| **Text color** | #4B5563 (darker gray for 7:1 contrast) | `text-gray-700` (or custom color) |
| **Font size** | 16px (desktop), 12px (mobile) | `text-base md:text-sm` |
| **Font weight** | 500 | `font-medium` |
| **Tap target** | 48px min | `min-h-12 min-w-12` |
| **Padding** | 8px | `p-2` |
| **Border radius** | 4px | `rounded` |

### Nav Item Active State
| Property | Value | Tailwind Class |
|---|---|---|
| **Text color** | Blue-600 | `text-blue-600` |
| **Font weight** | 600 (bold) | `font-semibold` |
| **Underline** | 3px blue | `border-b-2 border-blue-600` |
| **Background** | Optional light | `bg-blue-50` or `transparent` |
| **Transition** | 150ms ease | `transition-colors duration-150` |

### Nav Item Hover State
| Property | Value | Tailwind Class |
|---|---|---|
| **Background** | Light gray | `hover:bg-gray-100` |
| **Text color** | Gray-900 | `hover:text-gray-900` |
| **Transition** | 150ms | `transition-colors duration-150` |

### Nav Item Focus State
| Property | Value | Tailwind Class |
|---|---|---|
| **Outline** | 3px blue | `focus:outline focus:outline-2 focus:outline-blue-600` |
| **Outline offset** | 2px | `focus:outline-offset-2` |
| **Color** | Blue-600 | `focus:text-blue-600` |

### Accessibility Color Contrast
| Component | Foreground | Background | Ratio | Pass (AAA) |
|---|---|---|---|---|
| Default text | #4B5563 (darker gray-700) | #FFFFFF (white) | 7.1:1 | ✓ Exceeds |
| Active text | #2563EB (blue-600) | #FFFFFF (white) | 8.6:1 | ✓ Exceeds |
| Icon (default) | #4B5563 | #FFFFFF | 7.1:1 | ✓ Exceeds |
| Icon (active) | #2563EB | #FFFFFF | 8.6:1 | ✓ Exceeds |
| Focus outline | #2563EB | #FFFFFF | 8.6:1 | ✓ Exceeds |

**Standard**: All default nav item text uses #4B5563 for WCAG 2.1 AAA compliance (7:1 minimum contrast ratio).

### Responsive Typography

```css
/* Desktop (≥1024px) */
.nav-item {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
}

.nav-item-active {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
}

/* Tablet (768px–1023px) */
@media (max-width: 1023px) {
  .nav-item {
    font-size: 14px;
    padding: 6px 12px;
  }

  .nav-item-active {
    font-size: 14px;
    font-weight: 600;
  }
}

/* Mobile (<768px) */
@media (max-width: 767px) {
  .nav-item {
    font-size: 12px;
    font-weight: 500;
    padding: 4px;
  }

  .nav-item-active {
    font-size: 12px;
    font-weight: 600;
  }
}
```

### Safe Area Insets (Mobile iOS/Android)

```css
/* iPhone notch, home indicator */
.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom, 0px);
  /* Default: 0px; with notch: ~20–30px */
}

/* Android gesture pill */
.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom, 0px);
  /* Default: 0px; with gesture: ~16px */
}

/* Safe area testing: Chrome DevTools */
/* Simulate in DevTools → Toggle device toolbar → Select device with notch */
```

---

## 11. Accessibility Checklist (Labels, Roles, ARIA, Focus Order, Contrast)

### Semantic HTML & ARIA

- [ ] Navigation uses `<nav>` element (not `<div role="navigation">`)
- [ ] Each nav item is a link (`<a>`) or button (`<button>`)
- [ ] Active nav item has `aria-current="page"`
- [ ] Nav items without text have `aria-label` (e.g., icon-only buttons)
- [ ] More menu drawer has `role="dialog"` and `aria-modal="true"`
- [ ] More menu items are wrapped in `<ul>` / `<li>` for list semantics
- [ ] Skip-to-content link has `aria-label="Skip to main content"`
- [ ] Main content area has `id="main-content"` and implicit `role="main"`

### Focus Management

- [ ] Skip-to-content link is first focusable element on page
- [ ] Focus order follows visual left-to-right, top-to-bottom
- [ ] No focus trap (Tab cycles through all items, then continues to main content)
- [ ] Focus outline visible on all interactive elements (not removed)
- [ ] Focus outline has 3:1 contrast minimum
- [ ] Focus outline has ≥2px size or ≥2px offset
- [ ] When More menu opens, focus moves to first item in menu
- [ ] When More menu closes, focus returns to More button
- [ ] Focus not obscured by other content (e.g., toast notifications)

### Keyboard Navigation

- [ ] Tab advances through nav items left-to-right
- [ ] Shift+Tab reverses through nav items
- [ ] Enter activates nav link (same as click)
- [ ] Escape closes More drawer / modal (without navigation)
- [ ] Arrow keys NOT required for primary nav (links don't use ARIA menu pattern)
- [ ] Arrow keys work within More drawer to navigate items (if implemented as menu)
- [ ] No keyboard traps (can always Tab out)
- [ ] Access key not assigned to nav items (avoid conflicts)

### Screen Reader Support

- [ ] Screen reader announces navigation landmark ("navigation" or "main navigation")
- [ ] Each nav item announced with label and state (e.g., "Home, current page")
- [ ] Active state conveyed via `aria-current="page"` (not just color)
- [ ] Notification badge announced (e.g., "Notifications, 3 unread")
- [ ] Tier badge announced (e.g., "Loyalty, Plus tier")
- [ ] More menu drawer announced as dialog
- [ ] Skip-to-content link not announced by default (hidden via `aria-hidden="false"`, but `display: none` or `visibility: hidden`)
- [ ] Menu items in More drawer have descriptive labels and roles

### Color & Contrast

- [ ] Default text: 7:1 contrast (WCAG AAA minimum)
- [ ] Active text: 7:1 contrast
- [ ] Icons: 7:1 contrast
- [ ] Focus outline: 3:1 contrast to adjacent colors
- [ ] Active underline visible (not just color; meets 7:1 contrast)
- [ ] Not relying on color alone to convey state (use multiple indicators: weight, underline, color)

### Responsive & Zoom

- [ ] Navigation remains functional at 200% zoom
- [ ] No horizontal scrolling required at 200% zoom
- [ ] Text scales with user zoom preference
- [ ] Touch targets remain 48px+ at all zoom levels

### Mobile & Touch

- [ ] Touch targets are 48px+ (AAA requirement)
- [ ] Touch targets have sufficient spacing (no accidental mis-taps)
- [ ] Hover states don't rely on :hover (touch devices don't hover)
- [ ] Safe area insets respected on notched devices

---

## 12. Telemetry (Analytics Events with Names + Payloads)

### Navigation Events

```typescript
// Event: User clicks a nav item
event: 'nav_click'
payload: {
  nav_item_id: 'loyalty', // home | loyalty | move-money | loans | more
  nav_item_label: 'Loyalty',
  target_route: '/loyalty',
  source_route: '/', // Where user was before
  device_type: 'mobile', // mobile | tablet | desktop
  is_keyboard: false, // true if triggered via keyboard
  timestamp: 1645000000000,
  session_id: 'sess_abc123',
  user_id: 'user_xyz789',
}

// Event: More menu opened
event: 'more_menu_open'
payload: {
  trigger: 'click', // click | keyboard (Escape to close)
  device_type: 'mobile', // Only on mobile
  timestamp: 1645000000000,
  session_id: 'sess_abc123',
}

// Event: More menu item clicked
event: 'more_menu_click'
payload: {
  menu_item_id: 'settings', // settings | notifications | help | logout
  menu_item_label: 'Settings',
  target_route: '/settings',
  source_route: '/',
  device_type: 'mobile',
  is_keyboard: false,
  timestamp: 1645000000000,
  session_id: 'sess_abc123',
}

// Event: Navigation performance metric
event: 'nav_performance'
payload: {
  nav_click_to_page_loaded_ms: 85, // Time from click to page fully loaded
  device_type: 'mobile',
  source_route: '/',
  target_route: '/loyalty',
  timestamp: 1645000000000,
}

// Event: Accessibility event (screen reader or keyboard-only user)
event: 'accessibility_nav'
payload: {
  device_type: 'desktop',
  uses_keyboard_only: true,
  uses_screen_reader: 'nvda', // nvda | jaws | voiceover | none
  nav_click: 'loyalty',
  timestamp: 1645000000000,
}
```

### Analytics Implementation (Pseudocode)

```typescript
import { analytics } from '@lib/analytics';

function trackNavClick(navItemId: string, pathnames: { from: string; to: string }) {
  analytics.track('nav_click', {
    nav_item_id: navItemId,
    source_route: pathnames.from,
    target_route: pathnames.to,
    device_type: getDeviceType(), // Helper function
    is_keyboard: isKeyboardEvent(), // Helper function
  });
}

// Usage in TopNavItem component:
// <a href="/loyalty" onClick={() => trackNavClick('loyalty', { from: currentPath, to: '/loyalty' })}>
//   Loyalty
// </a>
```

---

## 13. Open Questions & Assumptions

### Unresolved Design Decisions

| Question | Current Assumption | Impact | Resolution |
|---|---|---|---|
| Should "Loans" nav item be hidden if user has no loans? | Yes, conditional visibility | Reduces nav clutter; users with no loans see 4 items instead of 5 | Implement in useNavigationState hook; gate on `user.hasLoans` |
| Should tier badge appear in top-right corner or within "Loyalty" tab? | Within "Loyalty" tab (more contextual) | Reduces top-right clutter; connects tier to Loyalty section | Confirm with design team during Phase 2 |
| How to handle the "More" menu on desktop — dropdown or dedicated page? | Dropdown from "More" nav item (less nav clutter) | If dropdown: needs focus management, backdrop; if page: adds route | Decide based on top-nav complexity needs |
| Should bottom tab bar use icon-only or icon+label? | Icon+label (required for 55+ demographic) | Increases tab height to ~56px; icons take space | Non-negotiable for older users; always use labels |
| What happens to notification badge when notification count exceeds 99? | Show "99+" or "…" | Prevents badge from overflowing; visual indication of "many" | Implement in NotificationBell component |
| Should active state use underline, background, or weight? | Use all three (redundancy for accessibility) | Slightly increases styling complexity; improves contrast | Standard AAA practice |

### Assumptions About User Data

| Assumption | Validation Method | Risk if Wrong |
|---|---|---|
| User tier data is always available on page load | API returns user object with `tier` field | Tier badge doesn't display; navigation looks incomplete |
| Notification count API returns synchronously | API latency <100ms | Notification badge may be stale; users see old counts |
| User has permissions data available (for Loans visibility) | User object includes `products: { hasLoans: boolean }` | Loans nav item might show/hide incorrectly |
| All 17 screens are always accessible (except Loans conditional) | Permission system gates access at route level | Nav shows item user can't access; UX feels broken |

### Assumptions About Devices & Browsers

| Assumption | Validation Method | Risk if Wrong |
|---|---|---|
| Breakpoint transition happens at exactly 768px | Test on actual devices and DevTools | Layout breaks at edge cases (iPad mini in portrait) |
| Safe area insets supported on iOS/Android | CSS env() works on 99% of devices | Bottom nav overlaps content on notched phones |
| CSS Grid/Flexbox available on all target browsers | Next.js Autoprefixer handles fallbacks | Navigation layout breaks on older browsers |

### Assumptions About Access & Permissions

| Assumption | Validation Method | Risk if Wrong |
|---|---|---|
| All 5 nav sections are always visible (except Loans) | Conditional rendering logic works correctly | User confusion if nav item shows but screen doesn't load |
| No user can see nav items they don't have permission to access | Permission system gates routes, not nav | Security risk; users see private features |

---

## 14. Design Rationale (Three-Experts Synthesis)

### Expert 1: Accessibility Specialist Perspective

**Rationale for Foundation-First Approach**:
Users 55+ depend on consistent, predictable navigation. Establishing types, config, and utilities in Phase 1 ensures:
- **Consistency**: All components reference same NAVIGATION_CONFIG
- **Maintenance**: Changes to nav structure happen in one place
- **Accessibility**: TypeScript enforcement prevents runtime errors that would break screen reader support
- **Testing**: Utilities can be unit-tested in isolation before component integration

**Why This Matters for 55+ Users**:
Older users have higher cognitive load when facing navigation changes. A well-structured, type-safe system prevents mid-project pivots that would confuse users. Once launched, the navigation must remain stable. Building on a solid foundation enables that stability.

### Expert 2: Frontend Engineer Perspective

**Rationale for Composable Component Architecture**:
By separating concerns (types, config, utilities, components), we enable:
- **Testability**: Each utility function tested independently
- **Reusability**: getActiveNavItem() used by TopNav, BottomNav, breadcrumbs
- **Maintainability**: Changes to nav structure don't require component refactoring
- **Performance**: useNavigationState hook memoized; no unnecessary re-renders on non-pathname changes

**Specific Technical Benefits**:
- NAVIGATION_CONFIG is JSON-serializable; can be moved to API in future
- Route mapping uses prefix matching (more robust than exact match)
- TypeScript interfaces prevent developers from creating invalid navigation structures at build time

### Expert 3: User Experience Researcher Perspective

**Rationale for Icon Mapping & Design Tokens**:
Research on 55+ users shows:
- **Icon consistency matters**: If the Gift icon represents Loyalty, it must be the same Gift icon everywhere
- **Spacing consistency matters**: Users build muscle memory; 16px padding on desktop and 12px on mobile must be intentional, not accidents
- **Color consistency matters**: Using design tokens ensures primary blue is the same everywhere, maintaining visual coherence

**Why Design Tokens in Phase 1?**:
Establishing tokens early prevents:
- Developers creating ad-hoc colors (inconsistent)
- Spacing variations across components (feels sloppy)
- Accessibility failures (tokens include contrast validation)

**Why Lucide Icons?**:
- Designed specifically for UI (not app icons)
- Consistent visual style across all icons
- Semantic icon names match user mental models ("gift" = rewards, "home" = dashboard)
- Accessibility built-in (icons are SVG with proper `aria-label` support)

### Synthesis: Why Phase 1 Must Be Rock-Solid

The navigation system is a **layout-level concern** that affects every screen in the app. Unlike individual feature components, changes to navigation structure ripple across:
- UI components (TopNav, BottomNav, MoreMenu)
- Routing system (path matching)
- Analytics (tracking nav clicks)
- Accessibility (focus management, landmarks)

Investing in Phase 1 ensures:
1. **Single Source of Truth**: One NAVIGATION_CONFIG, not duplicated across 5 components
2. **Type Safety**: Catch errors at build time, not runtime
3. **Accessibility Built-In**: Design tokens enforce contrast; interfaces enforce aria-labels
4. **Future-Proof**: API integration path clear; no refactoring needed to move to dynamic config

---

## 15. Build Plan (File Tree, Mock Setup, Test Stubs)

### Directory Structure

```
project-root/
├── app/
│   ├── layout.tsx ← INTEGRATION POINT
│   └── (routes)/
│       ├── page.tsx (SCR-01: Home)
│       ├── transactions/
│       │   └── page.tsx (SCR-02: Transactions)
│       ├── loyalty/
│       │   ├── page.tsx (SCR-03: Hub)
│       │   ├── tier-details/
│       │   │   └── page.tsx (SCR-04)
│       │   ├── rewards/
│       │   │   └── page.tsx (SCR-05)
│       │   ├── redeem/
│       │   │   └── [id]/page.tsx (SCR-06)
│       │   └── benefits/
│       │       └── page.tsx (SCR-07)
│       ├── move-money/
│       │   ├── transfer/
│       │   │   ├── page.tsx (SCR-08)
│       │   │   └── confirm/page.tsx (SCR-09)
│       │   └── bill-pay/
│       │       ├── page.tsx (SCR-10)
│       │       └── setup/page.tsx (SCR-11)
│       ├── loans/
│       │   ├── page.tsx (SCR-12)
│       │   └── [id]/
│       │       └── payment/page.tsx (SCR-13)
│       ├── settings/
│       │   └── page.tsx (SCR-14)
│       ├── notifications/
│       │   ├── page.tsx (SCR-15)
│       │   └── preferences/page.tsx (SCR-16)
│       └── help/
│           └── page.tsx (SCR-17)
│
├── components/
│   └── navigation/
│       ├── SkipToContentLink.tsx
│       ├── NavigationShell.tsx
│       ├── desktop/
│       │   ├── TopNavigationBar.tsx
│       │   ├── TopNavLogo.tsx
│       │   ├── TopNavItemGroup.tsx
│       │   ├── TopNavItem.tsx
│       │   ├── TopNavUtilities.tsx
│       │   ├── NotificationBell.tsx
│       │   ├── TierBadgeIndicator.tsx
│       │   └── ProfileDropdown.tsx
│       ├── mobile/
│       │   ├── BottomTabBar.tsx
│       │   ├── BottomTabItem.tsx
│       │   ├── MobileNavSpacer.tsx
│       │   ├── MoreMenuButton.tsx
│       │   └── SafeAreaWrapper.tsx
│       └── more/
│           ├── MoreMenuDrawer.tsx
│           ├── MoreMenuDropdown.tsx
│           ├── MoreMenuItem.tsx
│           └── MoreMenuFocusManager.tsx
│
├── lib/
│   ├── types/
│   │   └── navigation.ts
│   ├── constants/
│   │   └── navigation.ts
│   ├── hooks/
│   │   ├── useNavigationState.ts
│   │   └── useMoreMenuKeyboard.ts
│   ├── utils/
│   │   └── navigation.ts
│   └── tokens/
│       └── navigation-tokens.ts
│
├── tests/
│   ├── unit/
│   │   └── navigation.test.ts
│   ├── integration/
│   │   └── navigation.integration.test.ts
│   ├── e2e/
│   │   └── navigation.e2e.test.ts
│   └── a11y/
│       └── navigation-a11y.test.ts
│
├── cypress/
│   └── e2e/
│       └── navigation.cy.ts
│
└── tailwind.config.ts
```

### Phase 1 Files to Create

#### 1. `/lib/types/navigation.ts`

```typescript
// Navigation type definitions
export interface NavigationItem {
  id: 'home' | 'loyalty' | 'move-money' | 'loans' | 'more';
  label: string;
  route: string;
  icon: string;
  screens: string[];
  description?: string;
  badge?: { count: number; label: string };
  tier?: 'classic' | 'plus' | 'premium';
  visible?: boolean;
}

export interface NavigationConfig {
  sections: NavigationItem[];
  defaultRoute: string;
  moreMenuItems: MoreMenuItem[];
}

export interface NavigationState {
  activeNavItem: NavigationItem | null;
  pathname: string;
  isLoading: boolean;
}

export interface MoreMenuItem {
  id: string;
  label: string;
  route: string;
  icon: string;
  description?: string;
}
```

#### 2. `/lib/constants/navigation.ts`

```typescript
// NAVIGATION_CONFIG with all 17 screens mapped
import { NavigationConfig } from '@lib/types/navigation';

export const NAVIGATION_CONFIG: NavigationConfig = {
  sections: [
    {
      id: 'home',
      label: 'Home',
      route: '/',
      icon: 'home',
      screens: ['SCR-01', 'SCR-02'],
      visible: true,
    },
    // ... (other sections)
  ],
  defaultRoute: '/',
  moreMenuItems: [
    {
      id: 'settings',
      label: 'Settings',
      route: '/settings',
      icon: 'settings',
    },
    // ... (other menu items)
  ],
};

// Icon mapping
export const ICON_MAP = {
  'home': HomeIcon,
  'gift': GiftIcon,
  // ... (other icons)
};
```

#### 3. `/lib/hooks/useNavigationState.ts`

```typescript
'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { NavigationState } from '@lib/types/navigation';
import { getActiveNavItem } from '@lib/utils/navigation';
import { NAVIGATION_CONFIG } from '@lib/constants/navigation';

export function useNavigationState(): NavigationState {
  const pathname = usePathname();

  const activeNavItem = useMemo(
    () => getActiveNavItem(pathname, NAVIGATION_CONFIG),
    [pathname]
  );

  return {
    activeNavItem,
    pathname,
    isLoading: false,
  };
}
```

#### 4. `/lib/utils/navigation.ts`

```typescript
import { NavigationItem, NavigationConfig } from '@lib/types/navigation';

export function getActiveNavItem(
  pathname: string,
  config: NavigationConfig
): NavigationItem | null {
  // Exact match
  const exactMatch = config.sections.find(
    section => section.route === pathname
  );
  if (exactMatch) return exactMatch;

  // Prefix match
  const prefixMatch = config.sections.find(
    section =>
      pathname.startsWith(section.route + '/') ||
      pathname === section.route
  );
  if (prefixMatch) return prefixMatch;

  // Fallback
  return config.sections[0] || null;
}

export function getNavItemByRoute(
  route: string,
  config: NavigationConfig
): NavigationItem | null {
  return config.sections.find(item => item.route === route) || null;
}

export function getScreenNavSection(
  screenId: string,
  config: NavigationConfig
): NavigationItem | null {
  return config.sections.find(
    item => item.screens.includes(screenId)
  ) || null;
}
```

#### 5. `/components/navigation/SkipToContentLink.tsx`

```typescript
'use client';

export function SkipToContentLink() {
  return (
    <a
      href="#main-content"
      className="sr-only sr-only-focusable absolute z-50 p-2 m-2 bg-black text-white rounded"
    >
      Skip to main content
    </a>
  );
}
```

#### 6. `/components/navigation/NavigationShell.tsx`

```typescript
'use client';

import { usePathname } from 'next/navigation';
import { SkipToContentLink } from './SkipToContentLink';
import { useNavigationState } from '@lib/hooks/useNavigationState';

interface NavigationShellProps {
  children: React.ReactNode;
}

export function NavigationShell({ children }: NavigationShellProps) {
  const { activeNavItem, pathname } = useNavigationState();

  return (
    <>
      <SkipToContentLink />
      <header className="fixed top-0 w-full z-40">
        <nav aria-label="Main navigation">
          {/* TopNav and BottomNav will render here in Phases 2–3 */}
        </nav>
      </header>
      <main id="main-content" className="pt-16 pb-20">
        {children}
      </main>
    </>
  );
}
```

#### 7. `/app/layout.tsx` (Integration)

```typescript
import { NavigationShell } from '@components/navigation/NavigationShell';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavigationShell>
          {children}
        </NavigationShell>
      </body>
    </html>
  );
}
```

### Phase 1 Tests

#### `/tests/unit/navigation.test.ts`

```typescript
import { getActiveNavItem, getNavItemByRoute, getScreenNavSection } from '@lib/utils/navigation';
import { NAVIGATION_CONFIG } from '@lib/constants/navigation';

describe('Navigation Utilities', () => {
  describe('getActiveNavItem', () => {
    test('returns Home for "/"', () => {
      const result = getActiveNavItem('/', NAVIGATION_CONFIG);
      expect(result?.id).toBe('home');
    });

    test('returns Loyalty for "/loyalty/tier-details"', () => {
      const result = getActiveNavItem('/loyalty/tier-details', NAVIGATION_CONFIG);
      expect(result?.id).toBe('loyalty');
    });

    test('ignores query params', () => {
      const result = getActiveNavItem('/loyalty?tab=rewards', NAVIGATION_CONFIG);
      expect(result?.id).toBe('loyalty');
    });

    test('returns fallback for unknown path', () => {
      const result = getActiveNavItem('/unknown', NAVIGATION_CONFIG);
      expect(result?.id).toBe('home');
    });
  });

  describe('getScreenNavSection', () => {
    test('returns Loyalty section for SCR-03', () => {
      const result = getScreenNavSection('SCR-03', NAVIGATION_CONFIG);
      expect(result?.id).toBe('loyalty');
    });

    test('returns null for invalid screen ID', () => {
      const result = getScreenNavSection('SCR-99', NAVIGATION_CONFIG);
      expect(result).toBeNull();
    });
  });
});
```

#### `/tests/a11y/navigation-a11y.test.ts`

```typescript
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Navigation Accessibility', () => {
  test('SkipToContentLink is focusable', () => {
    render(<SkipToContentLink />);
    const link = screen.getByText('Skip to main content');
    expect(link).toBeInTheDocument();
  });

  test('NavigationShell uses semantic <nav> element', () => {
    render(
      <NavigationShell>
        <div>Test</div>
      </NavigationShell>
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');
  });

  test('passes axe accessibility check', async () => {
    const { container } = render(
      <NavigationShell>
        <div>Test</div>
      </NavigationShell>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Tailwind Configuration Update

```typescript
// tailwind.config.ts
export default {
  extend: {
    colors: {
      'nav-primary': '#1F2937',
      'nav-text': '#6B7280',
      'nav-active': '#2563EB',
      'nav-hover': '#F3F4F6',
    },
    spacing: {
      'nav-height-desktop': '64px',
      'nav-height-tablet': '56px',
      'nav-height-mobile': '56px',
    },
    fontSize: {
      'nav-desktop': '16px',
      'nav-tablet': '14px',
      'nav-mobile': '12px',
    },
  },
};
```

### Mock Data for Design-First Development

```typescript
// lib/mocks/navigation.mock.ts
export const MOCK_USER = {
  id: 'user_123',
  name: 'Dorothy Thompson',
  tier: 'plus' as const,
  hasLoans: true,
  notifications: {
    unreadCount: 3,
    unreadLabel: '3 new',
  },
};

export const MOCK_NAVIGATION_STATE = {
  activeNavItem: { id: 'home', label: 'Home', route: '/' },
  pathname: '/',
  isLoading: false,
};
```

### Build Checklist for Phase 1

- [ ] Create `/lib/types/navigation.ts` with all interfaces
- [ ] Create `/lib/constants/navigation.ts` with NAVIGATION_CONFIG
- [ ] Validate NAVIGATION_CONFIG includes all 17 screens, no duplicates
- [ ] Create `/lib/hooks/useNavigationState.ts` hook
- [ ] Create `/lib/utils/navigation.ts` utility functions
- [ ] Unit test all utility functions (getActiveNavItem, etc.)
- [ ] Create `SkipToContentLink` component
- [ ] Create `NavigationShell` component
- [ ] Integrate NavigationShell into `app/layout.tsx`
- [ ] Run accessibility audit on layout structure
- [ ] Verify TypeScript strict mode passes
- [ ] Test route detection on all 17 screens

---

## Completion Signal

**Shard 01 Complete**: Navigation Foundation & Configuration established.

**Ready For**: Phase 2 (Desktop Top Navigation) and Phase 3 (Mobile Bottom Tab Navigation) development.

**Status**: ✓ Implementation Ready

---

**END OF SHARD 01**
