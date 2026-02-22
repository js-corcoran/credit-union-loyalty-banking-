# Shard 04: More Menu & Utilities
**Responsive Navigation System — Phase 4 (Desktop + Mobile Utilities)**

**Document Version**: 1.0
**Created**: 2026-02-22
**Status**: Implementation Ready
**Audience**: Frontend Engineers, Component Developers

---

## 1. Component Name & Location

**Primary Components**:
- `MoreMenuDrawer` — Mobile half-sheet drawer for More menu
- `MoreMenuDropdown` — Desktop dropdown for More menu (alternative)
- `MoreMenuItem` — Individual menu item in More menu
- `NotificationBadge` — Unread count badge (refactored from desktop)
- `TierBadgeIndicator` — Tier display (refactored from desktop)
- `ProfileDropdown` — User profile menu (refactored from desktop)

**Locations**:
- `components/navigation/more/MoreMenuDrawer.tsx`
- `components/navigation/more/MoreMenuDropdown.tsx`
- `components/navigation/more/MoreMenuItem.tsx`
- `components/navigation/utilities/NotificationBadge.tsx`
- `components/navigation/utilities/TierBadgeIndicator.tsx`
- `components/navigation/utilities/ProfileDropdown.tsx`
- `lib/hooks/useMoreMenuKeyboard.ts`

**Type**: Modal overlay (drawer on mobile, dropdown on desktop)
**Parent**: Both desktop TopNav and mobile BottomNav use More menu variants
**Visibility**: Rendered conditionally based on "More" button tap or click

---

## 2. Purpose & Jobs-to-be-Done

**Primary Purpose**: Provide secondary navigation options (Settings, Help, Notifications, Logout) that don't warrant primary nav items but are essential for app usability. Support both desktop dropdown and mobile drawer patterns, each optimized for their respective input method (mouse vs. touch).

**Jobs-to-be-Done**:
1. **Access Secondary Features** — Link to Settings, Help/FAQ, Notifications, Logout without cluttering primary nav
2. **Responsive Patterns** — Use native patterns (dropdown on desktop, sheet on mobile) that feel natural for each device
3. **Focus Management** — Handle focus correctly when menu opens/closes, support keyboard navigation with Escape key
4. **Accessibility** — Screen reader users can navigate menu items; keyboard users can select via arrow keys and Enter
5. **Dismiss Menu** — Close menu via Escape key, backdrop click, or item selection
6. **Notification Badge** — Show unread notification count in utility area (not just in More menu)

---

## 3. User Stories & Acceptance Criteria

### Story 1: Desktop User Opens More Menu
**As** a member on desktop
**I want** to click the "More" nav item and see a dropdown with Settings, Help, Logout
**So that** I can access secondary features without cluttering the top nav

**Acceptance Criteria**:
- GIVEN I'm viewing the desktop top nav
- WHEN I click the "More" nav item
- THEN a dropdown appears below it showing Settings, Help, Logout
- AND the dropdown closes if I click outside or press Escape
- AND clicking an item (e.g., Settings) navigates and closes the dropdown
- AND keyboard users can navigate with arrow keys and select with Enter
- AND the dropdown doesn't overlap critical page content

### Story 2: Mobile User Opens More Menu
**As** a member on mobile
**I want** to tap the "More" tab and see a drawer slide up with all secondary options
**So that** I can access features in a mobile-native way

**Acceptance Criteria**:
- GIVEN I'm viewing the mobile bottom nav
- WHEN I tap the "More" tab
- THEN a half-sheet drawer slides up from the bottom
- AND the drawer shows Settings, Notifications, Help, Logout
- AND the drawer has a backdrop overlay (semi-transparent)
- AND I can close it by pressing Escape, tapping the overlay, or tapping a close button
- AND tapping an item (e.g., Settings) navigates to /settings and closes the drawer
- AND focus is trapped in the drawer while open (Tab cycles within drawer)

### Story 3: See Notification Badge Without Opening Menu
**As** a member
**I want** to see my unread notification count in the top-right (desktop) or badge area
**So that** I know if I have new alerts without tapping the bell icon

**Acceptance Criteria**:
- GIVEN I have 3 unread notifications
- WHEN I view the top nav (desktop) or bottom nav (mobile)
- THEN a notification badge appears showing "3"
- AND if count exceeds 99, it shows "99+"
- AND the badge has sufficient contrast (7:1 minimum)
- AND screen reader announces "Notifications, 3 unread"
- AND if count is 0, no badge appears
- AND clicking the badge navigates to /notifications

### Story 4: Keyboard User Navigates More Menu
**As** a keyboard-only user
**I want** to navigate the More menu with arrow keys
**So that** I can access secondary features without a mouse

**Acceptance Criteria**:
- GIVEN the More menu is open
- WHEN I press Arrow Down
- THEN focus moves to the next item in the menu
- AND I can press Arrow Down repeatedly to cycle through all items
- AND I can press Arrow Up to reverse
- AND pressing Enter activates the focused item
- AND pressing Escape closes the menu and returns focus to the More button
- AND there's no keyboard trap

### Story 5: Tier Badge Displayed in Navigation
**As** a member
**I want** my loyalty tier (Plus, Classic, Premium) visible in the nav
**So that** I'm reminded of my benefits and motivated to advance tiers

**Acceptance Criteria**:
- GIVEN I have a tier (Plus, Classic, Premium)
- WHEN I view the navigation
- THEN my tier appears in a badge or indicator
- AND the tier is color-coded (gold for Plus, silver for Classic, platinum for Premium)
- AND the tier label is readable (not icon-only)
- AND if my tier changes, the nav updates immediately
- AND screen reader announces my tier

---

## 4. States (Open/Closed, Hover, Focus, Loading)

### MoreMenuDrawer/Dropdown: Closed State
- **Display**: Hidden (display: none or opacity: 0)
- **Backdrop**: Not visible
- **Focus**: Outside menu (in page content)
- **Pointer events**: None (menu not interactive)
- **Content**: Not rendered (or rendered but hidden for performance)

### MoreMenuDrawer/Dropdown: Open State
- **Display**: Visible
- **Backdrop**: Semi-transparent overlay (#00000033 or similar)
- **Focus**: First menu item focused (auto-focus)
- **Pointer events**: All interactive
- **Animation**: Slide up (mobile drawer) or fade in (desktop dropdown)
- **Z-index**: High (50–100, above other content)

### MoreMenuItem: Default State
- **Background**: Transparent
- **Text color**: #1F2937 (gray-900)
- **Icon color**: #6B7280 (gray-700)
- **Font weight**: 500 (medium)
- **Cursor**: Pointer
- **Padding**: 12–16px

### MoreMenuItem: Hover State (Desktop Only)
- **Background**: #F3F4F6 (light gray)
- **Text color**: #1F2937 (darker)
- **Icon color**: #1F2937
- **Transition**: 150ms

### MoreMenuItem: Focus State (Keyboard)
- **Background**: #EBF8FF (light blue)
- **Outline**: 2px solid #2563EB (blue-600) inside (not using outline property)
- **Text color**: #2563EB (blue-600)
- **Icon color**: #2563EB
- **Cursor**: Pointer

### MoreMenuItem: Active/Selected State
- **Background**: #DBEAFE (blue-100)
- **Text color**: #2563EB (blue-600)
- **Font weight**: 600 (semibold)
- **Icon style**: Filled (if supported)

### NotificationBadge: Default (0 unread)
- **Display**: Hidden (no badge)
- **Count**: 0

### NotificationBadge: With Unread (1–99)
- **Display**: Visible
- **Background**: #DC2626 (red-600)
- **Text**: #FFFFFF (white)
- **Size**: 20px diameter
- **Font size**: 11px
- **Font weight**: 600
- **Position**: Absolute, top-right of bell icon
- **Contrast**: 8.6:1 (exceeds AAA)

### NotificationBadge: Overflow (100+)
- **Display**: "99+"
- **Same styling as 1–99**
- **Prevents unbounded growth**

### TierBadgeIndicator: Not Visible
- **Display**: Hidden (if no tier or tier is "classic" with no special display)
- **Opacity**: 0 or display: none

### TierBadgeIndicator: Classic Tier
- **Display**: Hidden (optional; often not displayed)
- **Or: Silver badge** (subtle indicator)
- **Color**: #888888 (silver)
- **Text**: "CLASSIC" (optional)

### TierBadgeIndicator: Plus Tier
- **Display**: Visible
- **Background**: #FFD700 (gold)
- **Text**: "PLUS"
- **Text color**: #1F2937 (dark for contrast)
- **Contrast**: 13.5:1 ✓

### TierBadgeIndicator: Premium Tier
- **Display**: Visible
- **Background**: #E5E4E2 (platinum/light gray)
- **Text**: "PREMIUM"
- **Text color**: #1F2937 (dark for contrast)
- **Contrast**: 8.1:1 ✓

---

## 5. Information Architecture

### More Menu Structure (5 Items)

```
MoreMenu
├── Settings (route: /settings, icon: settings)
├── Notifications (route: /notifications, icon: bell)
├── Help & FAQ (route: /help, icon: help-circle)
├── About (optional, route: /about, icon: info)
└── Logout (route: /auth/logout, icon: log-out)
```

### Desktop Dropdown Layout

```
[More ▼]
    ┌─────────────┐
    │ ⚙ Settings  │
    │ 🔔 Notifs   │
    │ ❓ Help     │
    │ ℹ About     │
    │ 🚪 Logout   │
    └─────────────┘
```

### Mobile Drawer Layout

```
┌─────────────────────────┐
│ ⋯ More Options        ✕ │ ← Header with close button
├─────────────────────────┤
│ ⚙ Settings              │
│ 🔔 Notifications        │
│ ❓ Help & FAQ           │
│ ℹ About the App        │
│ 🚪 Logout               │
└─────────────────────────┘
```

### Drawer vs. Dropdown Comparison

| Aspect | Desktop Dropdown | Mobile Drawer |
|---|---|---|
| **Opening** | Click "More" nav item | Tap "More" tab |
| **Position** | Below "More" nav item | Slides up from bottom |
| **Size** | 200–250px width | Full width, half-screen height |
| **Dismiss** | Click outside, Escape, or selection | Tap outside, Escape, X button, or selection |
| **Focus** | Stays in dropdown while open | Trap focus in drawer (no page content accessible) |
| **Animation** | Fade in (quick) | Slide up (250ms) |
| **Backdrop** | Optional light overlay | Semi-transparent overlay (#00000033) |

---

## 6. Components & Responsibilities (Component Tree)

### MoreMenuDrawer (Mobile)

```
MoreMenuDrawer
├── Props: isOpen, onClose, moreMenuItems, user
├── Renders: Backdrop + Sheet
│   ├── Backdrop overlay (semi-transparent, tap to close)
│   ├── Sheet header (title + close button X)
│   ├── Sheet content (scrollable list of items)
│   │   └── MoreMenuItem × N (Settings, Notifications, Help, About, Logout)
│   └── Focus trap (Tab cycles within drawer only)
└── Keyboard listeners: Escape to close, Arrow Up/Down to navigate
```

### MoreMenuDropdown (Desktop)

```
MoreMenuDropdown
├── Props: isOpen, onClose, moreMenuItems, user
├── Renders: Dropdown container
│   └── Positioned absolutely below "More" nav item
│   └── MoreMenuItem × N
└── Keyboard listeners: Escape to close, Arrow Up/Down to navigate
```

### MoreMenuItem

```
MoreMenuItem
├── Props: item (MoreMenuItem), onSelect, isFocused
├── Renders: Link or button
│   ├── Icon (24px)
│   ├── Label (12–14px)
│   └── Optional description
└── Behavior: Click/tap to navigate and close parent menu
```

### NotificationBadge (Utility Component)

```
NotificationBadge
├── Props: unreadCount (number)
├── Renders: Badge container (if count > 0)
│   ├── Red background circle
│   ├── White text (count or "99+")
│   └── Positioned absolutely top-right of parent
└── Behavior: Show/hide based on count
```

### TierBadgeIndicator (Utility Component)

```
TierBadgeIndicator
├── Props: tier ('classic' | 'plus' | 'premium')
├── Renders: Badge container (if tier is Plus or Premium)
│   ├── Colored background (gold, platinum, etc.)
│   ├── Text label ("PLUS", "PREMIUM")
│   └── Positioned in nav or utilities area
└── Behavior: Show/hide based on tier
```

### ProfileDropdown (Utility Component)

```
ProfileDropdown
├── Props: user (UserData), onLogout, moreMenuItems
├── Renders: Button (avatar/initials) + dropdown menu
│   ├── Avatar button (24–32px circle)
│   ├── Dropdown (on click)
│   │   └── Profile items (Profile, Settings, Help, Logout)
│   └── Focus management
└── Behavior: Show/hide menu on click
```

---

## 7. Interactions (Event List → Behavior, Focus Management)

### Desktop: Click "More" to Open Dropdown

| Event | Trigger | Behavior | Focus |
|---|---|---|---|
| **Click "More" nav item** | User clicks | Dropdown appears below nav item | First menu item auto-focused |
| **Hover menu item** | Mouse over item | Background highlights | No change to focus |
| **Click menu item** | User clicks | Navigate to route + close dropdown | Focus moves to main content |
| **Escape key** | Keyboard | Close dropdown | Focus returns to "More" nav item |
| **Click outside** | User clicks page | Close dropdown | Focus remains on clicked element |

### Mobile: Tap "More" to Open Drawer

| Event | Trigger | Behavior | Focus |
|---|---|---|---|
| **Tap "More" tab** | User taps | Drawer slides up + backdrop appears | First menu item auto-focused |
| **Tap menu item** | User taps item | Navigate to route + close drawer | Focus moves to main content |
| **Tap backdrop** | User taps outside | Close drawer | Focus returns to "More" tab |
| **Escape key** | Keyboard | Close drawer | Focus returns to "More" tab |
| **Tap X button** | User taps close | Close drawer | Focus returns to "More" tab |
| **Tab key in drawer** | Keyboard | Focus cycles within drawer items | Tab trap (doesn't escape drawer) |

### Keyboard Navigation (Both Desktop & Mobile)

| Key | Trigger | Behavior | Focus |
|---|---|---|---|
| **Arrow Down** | When menu open | Move focus to next item | Next menu item |
| **Arrow Up** | When menu open | Move focus to previous item | Previous menu item |
| **Home** | When menu open | Move focus to first item | First menu item |
| **End** | When menu open | Move focus to last item | Last menu item |
| **Enter** | On focused item | Activate item (navigate) | Page content after navigation |
| **Escape** | When menu open | Close menu | Return to "More" button |
| **Tab** | In drawer | Stay within drawer (focus trap) | Next item in drawer, then wrap to first |
| **Shift+Tab** | In drawer | Reverse through drawer items | Previous item in drawer, then wrap to last |

### Focus Restoration

| Scenario | Behavior | Focus Restored To |
|---|---|---|
| **Close via Escape** | Menu closes | "More" nav item or tab |
| **Close via backdrop click** | Menu closes | "More" nav item or tab |
| **Close via X button** | Menu closes | "More" nav item or tab |
| **Close via item selection** | Navigate to new page | Main content (#main-content) |

---

## 8. Data Contracts (TypeScript Interfaces, JSON Examples)

### TypeScript Interfaces

```typescript
// Imported from Shard 01:
import { MoreMenuItem as BaseMoreMenuItem } from '@lib/types/navigation';

// Extended/desktop-specific:
interface MoreMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: string) => void;
  moreMenuItems: BaseMoreMenuItem[];
  user?: UserData;
}

interface MoreMenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: string) => void;
  moreMenuItems: BaseMoreMenuItem[];
  triggerRef?: React.RefObject<HTMLButtonElement>;
}

interface MoreMenuItemProps {
  item: BaseMoreMenuItem;
  onSelect: (route: string) => void;
  isFocused?: boolean;
  index: number;
}

interface NotificationBadgeProps {
  unreadCount: number;
  onBadgeClick?: () => void;
}

interface TierBadgeIndicatorProps {
  tier: 'classic' | 'plus' | 'premium';
  className?: string;
  showAlways?: boolean; // Default: only show Plus/Premium
}

interface ProfileDropdownProps {
  user: UserData;
  onLogout: () => Promise<void>;
  onNavigate?: (route: string) => void;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  tier: 'classic' | 'plus' | 'premium';
  avatar?: string;
  initials?: string;
}
```

### JSON Example: MoreMenuDrawerProps

```json
{
  "isOpen": true,
  "moreMenuItems": [
    {
      "id": "settings",
      "label": "Settings",
      "route": "/settings",
      "icon": "settings",
      "description": "Account preferences and security"
    },
    {
      "id": "notifications",
      "label": "Notifications",
      "route": "/notifications",
      "icon": "bell",
      "description": "Alerts and notification preferences"
    },
    {
      "id": "help",
      "label": "Help & FAQ",
      "route": "/help",
      "icon": "help-circle",
      "description": "Support and frequently asked questions"
    },
    {
      "id": "about",
      "label": "About the App",
      "route": "/about",
      "icon": "info",
      "description": "Version and information"
    },
    {
      "id": "logout",
      "label": "Logout",
      "route": "/auth/logout",
      "icon": "log-out",
      "description": "Sign out of your account"
    }
  ],
  "user": {
    "id": "user_123",
    "name": "Dorothy Thompson",
    "email": "dorothy@example.com",
    "tier": "plus",
    "initials": "DT"
  }
}
```

### Hook: useMoreMenuKeyboard

```typescript
interface UseMoreMenuKeyboardOptions {
  isOpen: boolean;
  onClose: () => void;
  itemCount: number;
  onItemSelect?: (index: number) => void;
  focusRef?: React.RefObject<HTMLElement>;
}

// Usage:
const { focusedIndex, handleKeyDown } = useMoreMenuKeyboard({
  isOpen,
  onClose,
  itemCount: moreMenuItems.length,
});

// Listen to keydown in drawer:
// <div onKeyDown={handleKeyDown}>...</div>
```

---

## 9. Validation Rules

### MoreMenuDrawer/Dropdown Validation

| Rule | Implementation | Error Handling |
|---|---|---|
| **isOpen is boolean** | Validate isOpen type | Default to false if invalid |
| **moreMenuItems is array** | Check Array.isArray | Default to empty array |
| **onClose is function** | Validate callback | Provide no-op if missing |
| **Each item has required fields** | id, label, route, icon | Log warning; skip invalid item |
| **Route is valid URL** | Route starts with "/" | Prepend "/" if missing |

### NotificationBadge Validation

| Rule | Implementation | Error Handling |
|---|---|---|
| **unreadCount is number ≥ 0** | Validate type and range | Default to 0 |
| **unreadCount ≤ 9999** | Clamp to "99+" | Show "99+" for large numbers |

### TierBadgeIndicator Validation

| Rule | Implementation | Error Handling |
|---|---|---|
| **tier is valid enum** | tier in ['classic', 'plus', 'premium'] | Default to 'classic' |
| **showAlways is boolean** | Validate type | Default to false |

---

## 10. Visual & Responsive Rules (Design Tokens, Tailwind Classes)

### MoreMenuDrawer (Mobile) Styling

```typescript
const drawerClasses = {
  backdrop: 'fixed inset-0 z-40 bg-black bg-opacity-20',
  sheet: 'fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-lg shadow-lg pb-[env(safe-area-inset-bottom)]',
  header: 'flex justify-between items-center px-4 py-3 border-b border-gray-200',
  title: 'text-lg font-semibold text-gray-900',
  closeButton: 'text-gray-500 hover:text-gray-700 focus:outline-2 focus:outline-blue-600',
  content: 'overflow-y-auto max-h-[70vh]',
};
```

### MoreMenuDropdown (Desktop) Styling

```typescript
const dropdownClasses = {
  container: 'absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 py-1',
  item: 'px-4 py-2 text-sm font-medium hover:bg-gray-100 focus:bg-blue-50 focus:outline-none',
};
```

### MoreMenuItem Styling

```typescript
const menuItemClasses = {
  container: 'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150',
  default: 'text-gray-900 hover:bg-gray-100 focus:bg-blue-50',
  focused: 'bg-blue-50 text-blue-600',
  active: 'bg-blue-100 text-blue-600 font-semibold',
  icon: 'w-6 h-6 flex-shrink-0',
  label: 'text-sm font-medium',
  description: 'text-xs text-gray-600',
};
```

### NotificationBadge Styling

```typescript
const badgeClasses = {
  container: 'absolute -top-1 -right-1 inline-flex items-center justify-center',
  badge: 'w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center',
};
```

### TierBadgeIndicator Styling

```typescript
const tierClasses = {
  container: 'inline-flex items-center px-2 py-1 rounded-full font-semibold text-xs',
  classic: 'bg-gray-400 text-gray-900',
  plus: 'bg-yellow-400 text-gray-900',
  premium: 'bg-gray-200 text-gray-900',
};
```

### Safe Area Handling (Mobile Drawer)

```css
.drawer-sheet {
  padding-bottom: env(safe-area-inset-bottom, 0px);
  /* iOS home indicator: ~24px; Android gesture pill: ~16px; fallback: 0px */
}
```

---

## 11. Accessibility Checklist (ARIA, Focus, Keyboard)

### Semantic HTML

- [ ] Drawer has `role="dialog"` and `aria-modal="true"`
- [ ] Drawer has title/heading for `aria-labelledby`
- [ ] Menu items are `<button>` or `<a>` (not generic `<div>`)
- [ ] Menu items have `role="menuitem"` if in `role="menu"` container
- [ ] Notification badge has `aria-label="Notifications, 3 unread"`
- [ ] Tier badge has `aria-label="Plus tier"` or similar
- [ ] Close button in drawer has `aria-label="Close menu"`

### ARIA Attributes

```html
<!-- Mobile drawer -->
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="drawer-title"
  class="drawer"
>
  <h2 id="drawer-title">More Options</h2>
  <ul role="menu">
    <li>
      <button role="menuitem" onclick="navigate('/settings')">
        <SettingsIcon aria-hidden="true" />
        Settings
      </button>
    </li>
  </ul>
</div>

<!-- Notification badge -->
<button
  aria-label="Notifications, 3 unread"
  title="3 unread notifications"
>
  <BellIcon aria-hidden="true" />
  <span aria-hidden="true" class="badge">3</span>
</button>

<!-- Tier badge -->
<span aria-label="Plus tier" class="tier-badge">PLUS</span>
```

### Focus Management

- [ ] When drawer opens, focus moves to first menu item
- [ ] Focus is trapped in drawer (Tab cycles within drawer)
- [ ] When drawer closes, focus returns to "More" button
- [ ] Tab cycles through items in order
- [ ] Focus outline visible on all items (3px blue)
- [ ] Focus outline has 3:1 contrast
- [ ] No content behind drawer receives focus

### Keyboard Navigation

- [ ] Tab advances through menu items (if not using ARIA menu pattern)
- [ ] Arrow Down moves focus to next item (if ARIA menu pattern)
- [ ] Arrow Up moves focus to previous item
- [ ] Enter activates focused item
- [ ] Escape closes drawer and returns focus to "More"
- [ ] No keyboard trap (focus doesn't get stuck)

### Screen Reader Support

- [ ] Drawer announced as dialog
- [ ] Drawer title announced
- [ ] Menu items announced with labels
- [ ] Escape key functionality documented or obvious
- [ ] Notification badge announces unread count
- [ ] Tier badge announces tier name
- [ ] Close button announced

### Testing Checklist

- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Test keyboard navigation (Tab, Arrow, Enter, Escape)
- [ ] Test focus management (restoration)
- [ ] Verify color contrast (7:1 minimum)
- [ ] Run axe-core accessibility audit
- [ ] Test on actual mobile device

---

## 12. Telemetry (Analytics Events)

### More Menu Events

```typescript
// Drawer/dropdown opened
event: 'more_menu_open'
payload: {
  device_type: 'mobile' | 'desktop',
  trigger: 'tap' | 'click' | 'keyboard',
  timestamp: number,
}

// Menu item selected
event: 'more_menu_click'
payload: {
  menu_item_id: 'settings' | 'notifications' | 'help' | 'about' | 'logout',
  menu_item_label: string,
  target_route: string,
  source_route: string,
  device_type: 'mobile' | 'desktop',
  timestamp: number,
}

// Drawer/dropdown closed
event: 'more_menu_close'
payload: {
  reason: 'escape' | 'backdrop' | 'selection' | 'button',
  duration_open_ms: number,
  item_selected: string | null, // If selection triggered close
  device_type: 'mobile' | 'desktop',
  timestamp: number,
}
```

---

## 13. Open Questions & Assumptions

### Design Decisions Pending

| Question | Current Assumption | Risk | Resolution |
|---|---|---|---|
| Should "About" item be in More menu? | Yes, optional item | If omitted: users can't see app version | Design review |
| Drawer height on mobile — 50%, 70%, or full-screen? | 70% of viewport | If full-screen: page context lost; if 50%: text gets cut off | Design review |
| Should tier badge always be visible or only Plus/Premium? | Only Plus/Premium | If always shown: "Classic" badge might confuse users | Product decision |
| Should More dropdown have backdrop overlay on desktop? | No (not standard) | Unclear if needed; desktop doesn't need focus trap | Design review |

### Assumptions About Data

| Assumption | Validation | Risk |
|---|---|---|
| More menu items are always the same (Settings, Help, Logout) | Static MoreMenuItem array | If items change: need API integration |
| User tier is always present | User object includes tier field | If missing: tier badge doesn't render |

---

## 14. Design Rationale (Three-Experts Synthesis)

### Expert 1: Interaction Designer

**Why Drawer on Mobile, Dropdown on Desktop**:
- **Mobile**: Touches take full-screen interaction models; half-sheet drawer is native to iOS/Android
- **Desktop**: Mouse allows hovering and precise positioning; dropdown below nav item is standard
- **Consistency**: Both patterns feel native to their device; users don't feel confused
- **Accessibility**: Both patterns have well-established keyboard patterns (focus management, Escape to close)

**Why Focus Trap in Drawer**:
- **Safety**: Prevents accidental interaction with page content behind drawer
- **WCAG compliance**: Dialog pattern requires focus management
- **User expectation**: Modals trap focus; users expect this behavior

### Expert 2: Frontend Engineer

**Why useMoreMenuKeyboard Hook**:
- **Reusability**: Both drawer and dropdown can use same keyboard logic
- **Testability**: Hook logic tested independently from component rendering
- **Performance**: Keyboard listeners centralized; no duplicate listeners
- **Maintainability**: Single source of truth for keyboard behavior

**Why Separate Components (Drawer vs. Dropdown)**:
- **Device-specific logic**: Mobile drawer uses sheet from Shadcn; desktop dropdown uses popover
- **Different closing behaviors**: Drawer has backdrop overlay, dropdown doesn't
- **Independent testing**: Each component tested against its target device

### Expert 3: Accessibility Specialist

**Why ARIA Menu Pattern**:
- **Standard**: ARIA menu pattern is well-supported by screen readers
- **Keyboard support**: Arrow keys expected in menu pattern
- **Focus management**: Menu pattern includes focus restoration on close
- **Testing**: Well-defined test criteria for menu accessibility

**Why Notification Badge Separate from More Menu**:
- **Visibility**: Badge visible without opening menu
- **Actionable**: Users can tap badge to go directly to Notifications
- **Accessibility**: Badge announced by screen reader, so users aware of unread count
- **Performance**: Badge independent; can update without re-rendering entire menu

---

## 15. Build Plan (Implementation Order, Files, Tests)

### Files to Create

```
components/navigation/more/
├── MoreMenuDrawer.tsx
├── MoreMenuDropdown.tsx
└── MoreMenuItem.tsx

components/navigation/utilities/
├── NotificationBadge.tsx
├── TierBadgeIndicator.tsx
└── ProfileDropdown.tsx

lib/hooks/
└── useMoreMenuKeyboard.ts

tests/
├── unit/
│   └── more-menu.test.tsx
├── integration/
│   └── more-menu-integration.test.tsx
└── a11y/
    └── more-menu-a11y.test.tsx
```

### Implementation Order

1. **useMoreMenuKeyboard hook** (no dependencies)
2. **MoreMenuItem** (atomic)
3. **NotificationBadge** (atomic)
4. **TierBadgeIndicator** (atomic)
5. **ProfileDropdown** (uses utilities)
6. **MoreMenuDropdown** (desktop)
7. **MoreMenuDrawer** (mobile, more complex)
8. **Integration into TopNav and BottomNav**

### Example Implementation: MoreMenuItem

```typescript
'use client';

import { MoreMenuItem as MoreMenuItemType } from '@lib/types/navigation';
import { ICON_MAP } from '@lib/constants/navigation';

interface MoreMenuItemProps {
  item: MoreMenuItemType;
  onSelect: (route: string) => void;
  isFocused?: boolean;
  index: number;
}

export function MoreMenuItem({
  item,
  onSelect,
  isFocused = false,
  index,
}: MoreMenuItemProps) {
  const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP];

  return (
    <button
      role="menuitem"
      onClick={() => onSelect(item.route)}
      className={`
        w-full flex items-center gap-3 px-4 py-3 text-sm font-medium
        transition-colors duration-150 text-left
        ${
          isFocused
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-900 hover:bg-gray-100'
        }
        focus:outline-none focus:bg-blue-50 focus:text-blue-600
      `}
    >
      {Icon && <Icon className="w-6 h-6 flex-shrink-0" aria-hidden="true" />}
      <div className="flex-1">
        <div>{item.label}</div>
        {item.description && (
          <div className="text-xs text-gray-600">{item.description}</div>
        )}
      </div>
    </button>
  );
}
```

### Example Implementation: NotificationBadge

```typescript
'use client';

interface NotificationBadgeProps {
  unreadCount: number;
}

export function NotificationBadge({ unreadCount }: NotificationBadgeProps) {
  if (unreadCount === 0) return null;

  const displayCount = unreadCount > 99 ? '99+' : String(unreadCount);

  return (
    <span
      className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full"
      aria-label={`${unreadCount} unread notifications`}
    >
      {displayCount}
    </span>
  );
}
```

### Build Checklist for Phase 4

- [ ] Create useMoreMenuKeyboard hook
- [ ] Create MoreMenuItem component
- [ ] Create NotificationBadge component
- [ ] Create TierBadgeIndicator component
- [ ] Create ProfileDropdown component
- [ ] Create MoreMenuDropdown (desktop)
- [ ] Create MoreMenuDrawer (mobile)
- [ ] Integrate into TopNavigationBar
- [ ] Integrate into BottomTabBar
- [ ] Test keyboard navigation (Arrow, Enter, Escape)
- [ ] Test focus management (trap, restoration)
- [ ] Test accessibility (axe-core, screen reader)
- [ ] Test on desktop (dropdown)
- [ ] Test on mobile (drawer + safe area)
- [ ] Verify contrast ratios (7:1 minimum)
- [ ] Test backdrop overlay behavior
- [ ] Performance testing (<100ms open)

---

## Completion Signal

**Shard 04 Complete**: More Menu & Utilities component suite ready for integration.

**Depends On**: Shards 01–03 (Foundation, Desktop, Mobile) ✓ Complete
**Ready For**: Phase 5 (Integration & Accessibility)

**Status**: ✓ Implementation Ready

---

**END OF SHARD 04**
