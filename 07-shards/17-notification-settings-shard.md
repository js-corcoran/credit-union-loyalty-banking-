# Shard 17: Notification Center / Settings

**Build Priority**: P1
**Estimated Effort**: 16 hours
**Screen ID**: SCR-17
**Route**: `/notifications` (notification center) + `/settings/notifications` (preferences)
**Component File**: `app/notifications/page.tsx` + `app/settings/notifications/page.tsx`

---

## 1. Screen Name & Route

**Full Screen Name**: Notification Center & Preferences
**URL Routes**:
- Notification history: `/notifications`
- Notification preferences: `/settings/notifications`
**Navigation Access**: Main navigation → Notifications (bell icon) | Settings → Notification Preferences
**Page Title**: "Notifications" (center) | "Notification Settings" (preferences)
**Breadcrumb**: Home > Notifications (center) | Home > Settings > Notifications (preferences)

**Auth Requirements**: Authenticated member (redirect to login if not)

---

## 2. Purpose & Jobs-to-be-Done

**Primary Purpose**: Centralize all loyalty and banking notifications in one location (notification center) and give members granular control over which notifications they receive, how often, and via which channels (in-app, email, SMS). This addresses PERSONA-01 (overwhelmed by clutter) and PERSONA-04 (skeptical of spam) needs. Success: members feel informed without being interrupted, and trust credit union respects their preferences.

**Jobs-to-be-Done**:
1. **View notification history** — Member wants to review past loyalty alerts, tier changes, benefit updates
2. **Manage notification preferences** — Member wants to control which notifications arrive, frequency, and delivery channels
3. **Understand notification purpose** — Member needs plain-language descriptions of what each notification is for and why it matters
4. **Stop spam** — Member wants ability to opt-out of non-critical notifications without losing important alerts
5. **Restore notifications** — Member who previously turned off notifications wants to re-enable them

---

## 3. User Stories & Acceptance Criteria

### Story 1: Member Views Notification History

**As a** any member
**I want to** see my past notifications in one place
**So that** I can review past alerts and tier changes

**Given** I navigate to Notifications center
**When** the page loads
**Then** I see:
- List of recent notifications (last 30 days, most recent first)
- Each notification shows:
  - Icon (tier change, retrogression alert, benefit earned, system message)
  - Title: "Your Plus Tier is Secure" | "You Earned $2.45 in Fee Waivers"
  - Timestamp: "Feb 14, 2026 at 10:30 AM"
  - Brief description (1–2 lines): "Your balance exceeded the Plus tier minimum"
  - Category badge: "Tier Status" | "Benefits" | "Account" | "System"
  - Read/unread status indicator (blue dot if unread)
- Filter options (optional):
  - By category: All | Tier Status | Benefits | Account | System
  - By date: Last 7 days | Last 30 days | All time
- Search box: "Search notifications..."
- Mark all as read: "Mark all as read" link
- Archive/delete option: Swipe to delete (mobile), trash icon (desktop)

**And** timestamps use member's local timezone

---

### Story 2: Member Sees Notification Categories with Descriptions

**As a** confused member (PERSONA-01, PERSONA-03)
**I want to** understand each type of notification before deciding whether to enable it
**So that** I can make informed choices

**Given** I navigate to Notification Preferences
**When** I view the settings page
**Then** I see organized sections:
- **Tier Status Notifications** (always enabled for critical tiers changes)
  - "Tier Achievement" (When you reach a new tier) — Enabled
  - "Tier at Risk" (When your tier is at risk — 30/14 day warning) — Toggle
  - "Tier Lost" (When you drop to lower tier) — Toggle
- **Benefits Notifications**
  - "Benefit Earned" (You saved money via fee waivers, APY, etc.) — Toggle
  - "New Benefits Added" (Credit union launches new benefits) — Toggle
  - "Benefit Expiration" (Limited-time benefits about to end) — Toggle
- **Account Notifications**
  - "Autopay Expiring Soon" (When autopay expires in 30 days) — Toggle
  - "Unusual Activity" (Potential fraud alerts) — Toggle
- **Migration & Updates** (one-time during legacy migration)
  - "Program Change Explanations" — Toggle (or gray out if no longer relevant)
- **Marketing & News** (optional, low-priority)
  - "New Products" (New credit union offerings) — Toggle (default OFF)
  - "Promotions" (Limited-time promotions) — Toggle (default OFF)

Each section shows:
- Clear heading (16pt Bold)
- Per-notification description (14pt Regular): "When your rolling balance drops below the tier minimum, we'll alert you with 30 days' notice"
- Toggle button (enabled/disabled state)
- Help link: "Why is this important?" → FAQ

---

### Story 3: Member Selects Delivery Channels and SMS Opt-In Flow

**As a** technically comfortable member (PERSONA-02, PERSONA-04)
**I want to** choose how I receive notifications (in-app, email, SMS)
**So that** I get alerts on my preferred device

**Given** I open notification preferences
**When** I scroll to "Delivery Channels" section
**Then** I see:
- Heading: "How would you like to receive notifications?"
- Three channel options with toggles:
  - "In-App Notifications" (toggle for on/off) — Recommended on (default)
    - Sub-options (only if toggled on):
      - Checkbox: "Show notification badges on bell icon" (checked by default)
      - Checkbox: "Show in-app banner alerts for urgent notifications" (checked by default)
  - "Email" (toggle for on/off) — Recommended on (default)
    - Display: "Email address: [member@example.com]"
    - Link: "Change email address" (navigates to email settings modal)
  - "SMS Text Message" (toggle for on/off) — Optional (default off)
    - Display (if SMS not yet enabled): "Enable SMS to receive urgent alerts on your phone. Standard message rates may apply."
    - Link: "Enable SMS" button (triggers opt-in flow, see below)
    - Display (if SMS already enabled): "Phone number: [XXX] XXX-1234"
    - Link: "Change phone" (navigates to phone settings modal)

**SMS Opt-In Flow** (triggered when member toggles SMS to ON for first time):
- Modal appears with heading: "Enable SMS Notifications?"
- Consent message: "Standard message and data rates may apply according to your mobile carrier plan. You'll only receive notifications you've chosen below. Reply STOP to any message to unsubscribe."
- Input field: "Phone number: [ ]" (pre-filled if phone on file, otherwise empty)
- Phone verification message: "We'll send a verification code to confirm your phone number."
- CTA buttons:
  - "Continue to verification" (primary, disabled if phone field empty)
  - "Cancel" (secondary)
- After clicking "Continue":
  - Verification code sent via SMS to entered phone
  - Modal transitions to: "Enter the verification code we sent to [XXX] XXX-1234"
  - Input field: "Verification code: [ ]" (6 digits)
  - Timer: "Code expires in 10 minutes"
  - CTA buttons:
    - "Verify & Enable SMS" (primary)
    - "Resend code" (secondary, visible after 30 seconds)
    - "Cancel" (tertiary)
- Success state:
  - Modal shows checkmark + "SMS enabled!"
  - Message: "You'll now receive notifications on [XXX] XXX-1234"
  - CTA: "Back to settings" (closes modal, returns to notification preferences with SMS toggle now ON)
- Error states:
  - Invalid code: "That code doesn't match. Please try again." (allow 3 attempts)
  - Code expired: "Your code expired. We've sent a new one." (auto-send new code)
  - Phone already on file: Skip verification, directly enable SMS toggle

**Frequency control** (applies to non-urgent notifications only):
- "How often would you like summary emails?"
- Options (radio buttons): "As it happens" | "Daily summary" | "Weekly summary"
- Note: "Critical alerts (tier changes, security) are always sent immediately, regardless of your frequency preference"
- Frequency setting only applies when email channel enabled (grayed out if email toggle off)

**Critical alert notice** (always visible, prominent):
- Background: Light yellow (#FEF3C7)
- Icon: Shield or exclamation
- Text: "Important: We always send tier-at-risk alerts and security notifications via at least one enabled channel. You can't disable these for your safety."

**And** member can enable multiple channels; critical alerts sent via all enabled channels

**And** validation occurs in real-time:
- If user tries to toggle off all three channels: Show inline error message (see Story 3a below)

---

### Story 3a: Member Attempts to Disable All Channels (Safety Check)

**As a** any member
**I want to** manage my notification channels
**So that** I receive alerts on my preferred device

**Given** I have multiple channels enabled
**When** I try to toggle off the last enabled channel
**Then** I see:
- Inline error message (appears below the toggle): "At least one notification channel must be enabled for critical alerts"
- Toggle snaps back to ON (prevents being disabled)
- Background color of toggle: Briefly flashes yellow to draw attention
- Optional: Helpful text: "Critical alerts help you protect your account and maintain your tier. To completely stop notifications, contact support."

**And** this validation happens at the toggle level (immediate feedback), not on "Save Settings" button

---

### Story 4: Member Saves Preferences with Auto-Save Clarity and Confirmation

**As a** any member
**I want to** save my notification preferences and get confirmation
**So that** I know my choices are applied

**Given** I adjust toggles or change frequency/channels
**When** I interact with the settings
**Then** I experience:
- **Notification type toggles**: Auto-save with debounce (300ms)
  - Visual feedback: Toggle switches immediately (optimistic UI)
  - Toast notification appears (bottom right): "Preference saved" (2-second auto-dismiss)
  - If save fails: Toast becomes red error: "We couldn't save that change. Try again." with retry button
- **Delivery channel toggles**: Auto-save with debounce (300ms)
  - Same behavior as above
  - If attempting to disable last channel: Block save, show inline error (see Story 3a)
- **Frequency selector (email)**: Auto-save with debounce (300ms)
  - Visual feedback: "Saving..." briefly shown below dropdown, then "Daily summaries enabled"
- **SMS verification**: Save only on successful verification (see Story 3)

**Manual save behavior** (for confirmation and bulk changes):
- "Save Settings" button (always visible at bottom of form)
- Button state:
  - Enabled if any changes made since page load
  - Disabled if no changes (gray text)
- On click:
  - Button becomes loading state: "Saving..." (spinner visible)
  - All changes posted to server in one request (bulk save)
  - Success: Modal or banner appears: "Your notification preferences have been saved"
  - Success message includes summary: "You've disabled Benefits notifications, switched to daily email summaries, and enabled SMS"
  - Options after success:
    - "Send me a test notification" button (secondary CTA)
    - "Done" button (dismisses message, returns to form)
    - X to close message

**Changes take effect immediately** (server-side update happens synchronously; no delay)

---

### Story 4b: Notification Link Navigation Contexts

**As a** member receiving notifications
**I want to** click a notification and navigate to relevant content
**So that** I can take action on the alert

**Given** I receive a notification and click it (from notification center or banner)
**When** the app navigates
**Then** I arrive at the appropriate page:

| Notification Type | Trigger/Example | Navigation Destination | Context |
|------------------|-----------------|----------------------|---------|
| **Tier Achieved** | "You reached Plus Tier" | `/loyalty` (Loyalty Hub main page) | Shows tier badge, benefits, tier status |
| **Tier at Risk** | "Your tier is at risk (30-day warning)" | `/loyalty/retrogression` (Retrogression alert page) | Shows countdown, benefits at risk, recovery actions |
| **Tier Lost** | "You dropped to Classic tier" | `/loyalty` (Loyalty Hub, tier section highlighted) | Shows new tier with recovery path to higher tier |
| **Benefit Earned** | "You saved $2.45 in fee waivers" | `/loyalty/benefits` (Benefits page, benefits tab active) | Shows all benefits with their value |
| **New Benefits Available** | "We added new rewards program" | `/loyalty/benefits?highlight=new` (Benefits page, new benefits highlighted) | Shows new benefits with explanation |
| **Benefit Expiration** | "Your APY boost expires in 30 days" | `/loyalty/tier-details` (Tier details, benefits section scrolled to) | Shows tier details with benefit expiration dates |
| **Autopay Expiring Soon** | "Your autopay renews in 30 days" | `/autopay/[id]` (Specific autopay detail) | Shows autopay details with renewal date |
| **Unusual Activity** | "Sign-in from new device detected" | `/settings/security` (Security/privacy settings) | Shows recent activity and security options |
| **Program Change Explanation** | "Learn more about legacy migration" | `/loyalty/migration` (Legacy migration wizard, can re-access from history) | Shows migration details if user didn't complete |
| **Migration Complete** | "You're set up on the new loyalty program" | `/loyalty` (Loyalty Hub, migration wizard auto-completes if not done) | Confirms migration is complete, shows new tier |

**Implementation details**:
- URL params for highlighting: Use `?highlight=new` or `?section=benefits` to tell UI which section to scroll to/highlight
- Pre-filled context: If notification contains object data (e.g., autopay ID), pass as URL param to auto-load specific item
- Fallback: If linked page doesn't exist or member doesn't have permission, show error: "This notification link is no longer available. Here's your [related page] instead."

---

## 4. States

### Default State (Notification Center)
- Recent notifications loaded (last 30 days)
- List displayed in reverse chronological order
- Unread notifications marked with blue dot
- Filter/search options available
- No notifications message: "You're all caught up! No new notifications."

### Default State (Settings)
- Preference toggles loaded with member's current settings
- Delivery channels pre-populated with known addresses (email, phone)
- Frequency dropdown set to current preference
- Save button enabled

### Loading State
- Skeleton screens for notification list or preference toggles
- Placeholder text for notification content

### Error State
- If notifications can't load: "Unable to load your notifications. Please try again."
- If preferences can't save: "We couldn't save your preferences. Please try again or contact support."

### Empty State
- Notification center: "You have no notifications yet. You'll see tier updates, benefits earned, and important alerts here."
- With icon and link to notification settings

---

## 5. Information Architecture

### Notification Center Layout (Top to Bottom)

**Header Region**:
- Heading: "Notifications"
- Subheading: "Your loyalty and account alerts"
- Bell icon in header

**Action Bar**:
- Filter dropdown: "All Categories" | "Tier Status" | "Benefits" | "Account"
- Date range selector: "Last 7 days" | "Last 30 days" | "All time"
- Search box: "Search notifications..."
- Mark all as read: "Mark all as read" link

**Notification List**:
- Each notification: Icon + Title + Timestamp + Category badge + Read/unread indicator
- Sorted by date (newest first)
- Swipe to delete (mobile) or trash icon (desktop)

**Footer**:
- "Go to Settings" link (to notification preferences)
- Pagination (if >20 notifications): "Load more" button

### Notification Settings Layout (Top to Bottom)

**Header Region**:
- Heading: "Notification Preferences"
- Subheading: "Control which notifications you receive and how"

**Content Sections**:
- **Tier Status Notifications** (section 1)
  - Per-notification toggle with description
- **Benefits Notifications** (section 2)
  - Per-notification toggle with description
- **Account Notifications** (section 3)
  - Per-notification toggle with description
- **Marketing & News** (section 4, collapsible)
  - Per-notification toggle (default OFF)
- **Delivery Channels** (section 5)
  - In-App, Email, SMS toggles
  - Frequency selector
  - Critical alert notice
- **Action Section**:
  - "Save Settings" button (primary)
  - "Send test notification" button (secondary)
  - "Reset to defaults" link (tertiary)

---

## 6. Components & Responsibilities

### Component Tree

```
NotificationCenter (Client)
├── Header
│   └── "Notifications" title + bell icon
├── ActionBar
│   ├── FilterDropdown (by category)
│   ├── DateRangeSelector
│   └── SearchInput
├── NotificationsList
│   ├── NotificationItem × N (most recent first)
│   │   ├── Icon (notification type)
│   │   ├── Title
│   │   ├── Timestamp
│   │   ├── Category badge
│   │   ├── Read/unread indicator
│   │   └── Delete button (swipe mobile, icon desktop)
│   └── PaginationControl (if >20)
└── Footer
    └── "Go to Settings" link

NotificationSettings (Client)
├── Header
│   └── "Notification Preferences" title
├── NotificationCategory × 4 (Tier, Benefits, Account, Marketing)
│   ├── CategoryHeading
│   ├── NotificationToggle × N per category
│   │   ├── Checkbox/toggle
│   │   ├── Label
│   │   ├── Description (14pt)
│   │   └── "Why?" link → FAQ
│   └── [Optional expandable for advanced options]
├── DeliveryChannelsSection
│   ├── Heading: "How would you like to receive notifications?"
│   ├── ChannelToggle (In-App) with sub-options
│   ├── ChannelToggle (Email) with address + change link
│   ├── ChannelToggle (SMS) with phone + change link
│   ├── FrequencySelector (As it happens | Daily | Weekly)
│   └── CriticalAlertNotice
├── ActionSection
│   ├── Button "Save Settings" (primary)
│   ├── Button "Send test" (secondary)
│   └── Link "Reset to defaults" (tertiary)
└── SuccessMessage (conditional, appears after save)
```

### Component Responsibilities

**NotificationItem**:
- Props: `notification: Notification`, `isUnread: boolean`, `onDelete: fn`
- Responsibility: Render single notification with icon, title, timestamp, category
- Accessibility: `role="listitem"`, title is `<h3>`, timestamp is `<time>`

**NotificationToggle**:
- Props: `label: string`, `description: string`, `isEnabled: boolean`, `onChange: fn`
- Responsibility: Render checkbox/toggle with label and description
- Accessibility: `<input type="checkbox">` with `<label>`, description via `aria-describedby`

**FrequencySelector**:
- Props: `current: "as-it-happens" | "daily" | "weekly"`, `onChange: fn`
- Responsibility: Render dropdown with frequency options
- Accessibility: Semantic `<select>` or radio buttons

---

## 7. Interactions

### Notification Center Interactions

- **Click notification**: Navigate to context (e.g., "Tier achieved" → Loyalty Hub; "Autopay expiring" → Autopay settings)
- **Swipe left (mobile)**: Delete notification
- **Click trash icon (desktop)**: Delete notification with confirmation
- **Click category filter**: Show only notifications in selected category
- **Click "Mark all as read"**: Dismiss blue dots on all notifications
- **Search**: Real-time filter by notification title/content

### Settings Interactions

**Notification Type Toggles (auto-save)**:
- Click toggle → State changes immediately (optimistic UI)
- After 300ms debounce: Toast appears "Preference saved" (green, auto-dismiss after 2 seconds)
- If save fails: Toast becomes red error with "Retry" button; toggle reverts to previous state
- No explicit "Save Settings" required for these toggles

**Delivery Channel Toggles (auto-save with validation)**:
- Click toggle → State changes immediately
- If attempting to disable last enabled channel:
  - Toggle snaps back to ON (preventing disable)
  - Inline error message appears: "At least one channel must be enabled"
  - Optional: Brief yellow background flash on toggle for visibility
- If successfully toggling on: Toast "Channel enabled"
- If successfully toggling off: Toast "Channel disabled"
- SMS toggle special case: First toggle ON → SMS opt-in modal flow (see Story 3)

**Frequency Selector (auto-save)**:
- Click dropdown → Options appear (As it happens | Daily | Weekly)
- Select option → Dropdown closes, selection takes effect
- After 300ms debounce: Toast appears "Frequency updated to: Daily summaries"
- Frequency selector only functional if email channel is enabled (grayed out if email off)

**Toggle + Frequency Save Behavior Summary**:
- All toggles and frequency: Save individually with auto-save (300ms debounce)
- No need to click "Save Settings" for these to take effect
- BUT "Save Settings" button serves two purposes:
  1. Manual confirmation (if user prefers explicit save vs. auto-save)
  2. Bulk validation (server confirms all changes valid before final save)

**Manual "Save Settings" Button (explicit save for peace of mind)**:
- Click → All current preferences POSTed to server in single request
- Button becomes loading state: "Saving..."
- On success: Success banner appears with summary: "Preferences saved: Benefits notifications disabled, daily email summaries enabled"
- Options: "Send test notification" button or "Done"
- On failure: Error message: "We couldn't save your preferences. Please try again."

**Click "Why?" (on each notification type)**:
- Opens tooltip or navigates to FAQ with pre-filtered search
- Example: "Why is this important?" for "Tier at Risk" → Shows FAQ section explaining grace period and recovery actions

**Click "Send test"**:
- Triggers test notification to all enabled channels
- Test uses current preference settings (frequency, channels, etc.)
- In-app: Notification appears in bell icon and notification center
- Email: Test email sent immediately (not throttled by frequency setting)
- SMS: Test SMS sent immediately
- Success message: "Test notification sent. Check your [email/SMS/in-app]" (lists which channels)

**Click "Reset to defaults"**:
- Confirmation modal appears: "Reset all notification preferences to default? This will re-enable notifications you've previously disabled."
- Options: "Reset" (primary) or "Cancel"
- On confirm: All toggles reset to default state (most on, marketing off)
- Success toast: "Preferences reset to defaults"

### Keyboard Navigation

- **Tab**: Cycle through toggles, buttons, dropdowns
- **Space/Enter**: Activate toggle or button
- **Arrow keys** (dropdown): Select frequency option
- **Escape**: Close dropdown or modal

---

## 8. Data Contracts

### GET /api/member/:memberId/notifications

**Response**:
```json
{
  "memberId": "MEMBER-001",
  "notifications": [
    {
      "notificationId": "NOTIF-001",
      "type": "tier_achievement",
      "title": "Congratulations! You reached Plus Tier",
      "message": "Your balance exceeded the Plus tier minimum. You now qualify for APY boost and fee waivers.",
      "category": "tier_status",
      "timestamp": "2026-02-14T10:30:00Z",
      "isRead": false,
      "actionUrl": "/loyalty/tier-details",
      "icon": "tier-badge"
    },
    {
      "notificationId": "NOTIF-002",
      "type": "benefit_earned",
      "title": "You saved $2.45 in fee waivers",
      "message": "Your transfer fee was waived as a Plus tier member.",
      "category": "benefits",
      "timestamp": "2026-02-13T14:15:00Z",
      "isRead": true,
      "actionUrl": "/loyalty/benefits",
      "icon": "dollar-sign"
    }
  ],
  "unreadCount": 1
}
```

### GET /api/member/:memberId/notification-preferences

**Response**:
```json
{
  "memberId": "MEMBER-001",
  "preferences": {
    "tierStatus": {
      "tierAchievement": { "enabled": true, "channels": ["in_app", "email"] },
      "tierAtRisk": { "enabled": true, "channels": ["in_app", "email", "sms"] },
      "tierLost": { "enabled": true, "channels": ["in_app", "email"] }
    },
    "benefits": {
      "benefitEarned": { "enabled": true, "channels": ["in_app", "email"] },
      "newBenefitsAdded": { "enabled": false, "channels": [] },
      "benefitExpiration": { "enabled": true, "channels": ["in_app", "email"] }
    },
    "account": {
      "autopayExpiring": { "enabled": true, "channels": ["in_app", "email"] },
      "unusualActivity": { "enabled": true, "channels": ["in_app", "email", "sms"] }
    },
    "marketing": {
      "newProducts": { "enabled": false, "channels": [] },
      "promotions": { "enabled": false, "channels": [] }
    }
  },
  "deliveryChannels": {
    "inApp": { "enabled": true },
    "email": { "enabled": true, "address": "member@example.com" },
    "sms": { "enabled": false, "phone": "+1-555-1234" }
  },
  "emailFrequency": "daily",
  "updatedAt": "2026-02-10T15:30:00Z"
}
```

### POST /api/member/:memberId/notification-preferences

**Request**:
```json
{
  "preferences": { /* preferences object */ },
  "deliveryChannels": { /* channels object */ },
  "emailFrequency": "daily"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Your notification preferences have been saved.",
  "updatedAt": "2026-02-21T10:00:00Z"
}
```

### TypeScript Service Facades

```typescript
export async function getNotifications(memberId: string): Promise<NotificationListResponse> {
  const response = await fetch(`/api/member/${memberId}/notifications`);
  if (!response.ok) throw new Error("Failed to fetch notifications");
  return response.json();
}

export async function getNotificationPreferences(memberId: string): Promise<NotificationPreferencesResponse> {
  const response = await fetch(`/api/member/${memberId}/notification-preferences`);
  if (!response.ok) throw new Error("Failed to fetch preferences");
  return response.json();
}

export async function updateNotificationPreferences(
  memberId: string,
  preferences: NotificationPreferencesInput
): Promise<void> {
  const response = await fetch(`/api/member/${memberId}/notification-preferences`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(preferences)
  });
  if (!response.ok) throw new Error("Failed to save preferences");
}

export async function sendTestNotification(memberId: string): Promise<void> {
  const response = await fetch(`/api/member/${memberId}/notification-test`, {
    method: "POST"
  });
  if (!response.ok) throw new Error("Failed to send test notification");
}
```

---

## 9. Validation Rules

- At least one delivery channel must be enabled (critical: system enforces this)
- Email address and phone number must be valid before saving
- Tier-at-risk, tier-lost, unusual-activity notifications cannot be disabled (critical, enforced server-side)
- Frequency option only applies when email channel is enabled
- Notification preferences saved immediately on change (no manual save required for toggles)
- Test notification uses member's current delivery channel settings

---

## 10. Visual & Responsive Rules

### Design Tokens

**Colors**:
- Unread indicator: Blue (#3B82F6)
- Category badges: Tier Status (purple #8B5CF6) | Benefits (green #10B981) | Account (blue #0EA5E9) | System (gray #6B7280)
- Toggle enabled: Green (#10B981)
- Toggle disabled: Gray (#D1D5DB)
- Text: Dark gray (#1F2937)

**Typography**:
- Page title: 24pt Bold
- Section heading: 18pt Bold
- Notification title: 16pt Bold
- Notification description/message: 14pt Regular
- Labels: 14pt Regular
- Helper text: 12pt Regular

**Spacing**:
- Notification item padding: 16px
- Section margin: 24px top
- Toggle spacing: 12px between toggles
- Channel toggle margin: 20px top

### Responsive Breakpoints

**Mobile (< 768px)**:
- Full-width layout
- Single-column notification list
- Stacked toggles
- Swipe to delete (UX best practice for mobile)
- Channel toggles stack vertically

**Tablet (768px – 1024px)**:
- Max-width 600px centered container
- Two-column layout for toggles (optional)
- Click to delete (no swipe)

**Desktop (> 1024px)**:
- Max-width 900px centered container
- Multi-column layout for channels
- Horizontal layout for toggles and descriptions side-by-side

---

## 11. Accessibility Checklist

- **Notification list**: Semantic `<ul>/<li>`, each item has `role="listitem"`
- **Toggles**: Semantic `<input type="checkbox">` with associated `<label>`
- **Descriptions**: Associated via `aria-describedby` with toggle
- **Critical alert notice**: `role="alert"` or prominent background color + text
- **Timestamps**: Semantic `<time>` element with ISO format in `datetime` attribute
- **Icons**: Always accompanied by text; not icon-only
- **Focus visible**: 2px outline, 2px offset on all buttons and toggles
- **Touch targets**: 48×48px minimum for toggles and delete buttons
- **Color contrast**: 7:1 for all text
- **Language**: Plain English, define "frequency", "channels", "preferences"
- **Skip links**: "Skip to main content", "Skip to settings"

---

## 12. Telemetry

**Event Tracking**:

- `event: "notifications_page_view"` — User opens notification center
  - `payload: { memberId, unreadCount, totalNotifications }`

- `event: "notification_preferences_view"` — User opens settings
  - `payload: { memberId }`

- `event: "notification_toggle_change"` — User toggles notification type
  - `payload: { notificationType: "tier_achievement", enabled: true }`

- `event: "notification_channel_change"` — User toggles delivery channel
  - `payload: { channel: "sms", enabled: false }`

- `event: "notification_frequency_change"` — User changes email frequency
  - `payload: { frequency: "daily" }`

- `event: "notification_preferences_saved"` — User clicks save
  - `payload: { memberId, changes: { channel_added: "sms", types_disabled: 2 } }`

- `event: "notification_read"` — User clicks notification (or opens it)
  - `payload: { notificationId: "NOTIF-001", type: "tier_achievement" }`

- `event: "notification_deleted"` — User deletes notification
  - `payload: { notificationId, type }`

---

## 13. Open Questions & Assumptions

1. **Notification history retention**: Assumption — Notifications stored for 90 days; older notifications archived. If different, adjust.

2. **SMS opt-in and consent**: Assumption — SMS requires explicit opt-in with consent modal ("Standard message rates may apply") and phone number verification (6-digit code sent via SMS). Email and in-app default to enabled. SMS defaults to disabled.
   - **Verification**: Phone verification required to prevent accidental SMS spam
   - **Phone on file**: If phone already on member's profile, offer to use it (skip verification); member can change phone in settings modal

3. **Toggle auto-save vs. manual save**:
   - **Decision**: Notification type and delivery channel toggles are auto-save (300ms debounce) to reduce friction
   - **User feedback**: Toast notifications confirm each save ("Preference saved") so user knows change took effect
   - **"Save Settings" button**: Serves as manual confirmation and bulk validation option (not required for toggles, but available for peace of mind)
   - **Consistency**: All toggles and frequency use same auto-save approach for consistent UX

4. **Channel safety validation**:
   - **Last channel protection**: If user attempts to disable the last enabled channel, toggle snaps back to ON with inline error
   - **Server-side enforcement**: Backend also validates at least one channel always enabled (prevents clever API calls that might bypass UI)
   - **Error message**: "At least one channel must be enabled for critical alerts"

5. **SMS opt-in modal specifics**:
   - **Trigger**: When member toggles SMS to ON for first time (not already enabled)
   - **Consent text**: "Standard message and data rates may apply according to your mobile carrier plan. You'll only receive notifications you've chosen below. Reply STOP to any message to unsubscribe."
   - **Verification flow**: Modal transitions to verification screen after user enters phone and clicks "Continue"
   - **Error handling**: 3 failed attempts → allow resend; code expires after 10 minutes
   - **Skip verification**: If phone already verified on file, SMS toggle enable skips modal entirely

6. **Test notification behavior**:
   - **Channels**: Test uses all currently enabled channels (reflects current settings)
   - **Frequency ignored**: Test sends immediately (not throttled by frequency setting)
   - **Timing**: Sent within 2-3 seconds of click for immediate visibility
   - **Content**: Generic test message (not tied to specific notification type)
   - **Success feedback**: Toast or banner confirms test sent and which channels received it

7. **Notification link contexts** (see Story 4b for full mapping):
   - **Implementation**: Each notification type has associated URL destination (e.g., tier alert → /loyalty/retrogression)
   - **URL params**: Use `?highlight=section` or `?id=object-id` to pre-populate/scroll to relevant content
   - **Fallback**: If page doesn't exist, show error and link to related page instead

8. **Migration notifications**:
   - **Appearance**: During first 30 days post-launch, legacy migration-related notifications appear in notification center
   - **Auto-archive**: After 30 days, migration notifications no longer appear in history (archived but retrievable if user searches)
   - **Shard coordination**: Shard 15 (Legacy Migration) coordinates with Shard 17 to suppress migration notifications once wizard completed

9. **Frequency granularity**:
   - **Options**: As it happens | Daily summary | Weekly summary (only three options, not custom)
   - **Time of day**: Daily/Weekly summaries sent at member's preferred time (default: 6:00 AM based on member's timezone)
   - **Future enhancement**: Custom schedules (e.g., "Every Tuesday at 2 PM") deferred to Phase 2

---

## 14. Design Rationale

**UX Lead Perspective**:
- Notification center (history) and settings (preferences) are separate to reduce cognitive load; users don't confuse viewing past alerts with changing future ones.
- Clear per-notification descriptions ("When your rolling balance drops below the tier minimum...") help older demographic understand purpose; reduces anxiety about "spam".
- Unread indicator (blue dot) provides at-a-glance status; searchable by category helps power users find specific alerts quickly.
- Critical alerts cannot be disabled; this protects both member (they always know if tier is at risk) and credit union (member engagement, risk mitigation).

**Frontend Architect Perspective**:
- Notification fetching happens server-side; preferences loaded on settings page and cached in React Context.
- Toggle changes: Auto-save with 300ms debounce (avoid excessive API calls), immediate visual feedback via optimistic UI, toast confirmation after save.
- Last channel protection: Client-side prevents disabling last channel (toggle snaps back ON); server-side validation as defense-in-depth.
- SMS verification: Uses SMS API to send 6-digit code; member enters code in modal to confirm number; prevents SMS spam/wrong number
- Notification deletion uses optimistic UI (remove from list immediately, revert if API fails).
- Test notification uses same email/SMS services as production to ensure deliverability; ignores frequency preference to send immediately.
- Preferences API validates at least one channel always enabled (server-side enforcement prevents bad states even if client validation bypassed).

**Product/Delivery Perspective**:
- Notification settings control member retention; 35%+ of churn caused by notification spam from financial institutions.
- Clear opt-out (without losing critical alerts) positions credit union as respectful, builds trust.
- Frequency selector ("daily summary") reduces email volume for less engaged members while keeping critical alerts real-time.
- Telemetry tracks opt-out rates by notification type; if >40% disable specific notification, indicates messaging gap (e.g., "benefit earned" might be too frequent).

---

## 15. Cursor-Claude Ready Build Plan

### File Structure

```
app/notifications/
├── page.tsx                         # Notification center (server)
└── components/
    ├── NotificationCenter.tsx       # Client container
    ├── NotificationList.tsx         # List of notifications
    ├── NotificationItem.tsx         # Single notification
    ├── NotificationFilters.tsx      # Category/date filters
    └── NotificationSearch.tsx       # Search input

app/settings/notifications/
├── page.tsx                         # Settings page (server)
└── components/
    ├── NotificationPreferences.tsx  # Client container
    ├── NotificationCategory.tsx     # Category section (tier, benefits, etc.)
    ├── NotificationToggle.tsx       # Individual toggle
    ├── DeliveryChannels.tsx         # Channel selection
    ├── FrequencySelector.tsx        # Email frequency
    └── SaveConfirmation.tsx         # Success message

lib/
├── api.ts                          # Add notifications API endpoints
└── types.ts                        # Add Notification, NotificationPreferences types

tests/
├── notification-center.test.tsx    # List, filter, search
├── notification-settings.test.tsx  # Toggle, save, validation
└── integration/
    └── notification-flow.test.tsx  # Full flow (view → change → save)
```

### Mock Data

```typescript
// lib/mock-data/notifications.ts
export const mockNotifications = [
  {
    notificationId: "NOTIF-001",
    type: "tier_achievement",
    title: "You reached Plus Tier!",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    isRead: false
  },
  // ... more notifications
];

export const mockNotificationPreferences = {
  tierStatus: {
    tierAchievement: { enabled: true, channels: ["in_app", "email"] },
    // ... more
  },
  // ... preferences
};
```

### Component Build Order

1. **NotificationItem** — Simple display component
2. **NotificationToggle** — Reusable toggle component
3. **NotificationList** — List container
4. **NotificationFilters** — Filter UI
5. **NotificationSearch** — Search input
6. **NotificationCenter** — Orchestrator for notification center
7. **NotificationCategory** — Category section for preferences
8. **DeliveryChannels** — Channel selection for preferences
9. **FrequencySelector** — Frequency dropdown
10. **NotificationPreferences** — Orchestrator for settings
11. **page.tsx** (both routes) — Entry points

### Test Stubs

```typescript
// notification-center.test.tsx
describe("Notification Center", () => {
  test("renders list of recent notifications");
  test("filters by category");
  test("searches by title/message");
  test("marks notification as read on click");
  test("deletes notification with confirmation");
});

// notification-settings.test.tsx
describe("Notification Settings", () => {
  test("renders all notification types");
  test("toggles notification type");
  test("requires at least one delivery channel");
  test("saves preferences on button click");
  test("sends test notification");
  test("resets to defaults");
});
```

### Key Decisions for Build

1. Notification toggles save individually (no manual save); delivery channels and frequency require explicit save
2. Unread count computed client-side from notifications array (no separate API call)
3. Test notification sent via all enabled channels (demonstrates member's current settings)
4. Notification deletion is optimistic (remove immediately, revert if API fails)
5. Critical alerts display with `role="alert"` for screen reader urgency
6. Category descriptions fetched from FAQ database (single source of truth, reduces localization burden)
