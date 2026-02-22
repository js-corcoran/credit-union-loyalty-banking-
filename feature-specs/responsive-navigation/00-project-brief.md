# Project Brief — Responsive Navigation System

**Project Name**: Responsive Navigation System
**Project Slug**: responsive-navigation
**Created**: 2026-02-22
**Type**: Feature Enhancement (additive to Credit Union Loyalty Banking Experience)

## Vision
Provide a clear, familiar, and accessible primary navigation system that adapts seamlessly between a top navigation bar on larger screens and a bottom tabbed navigation on mobile — giving older credit union members a consistent, confident way to move through the app regardless of device or screen size.

## Parent Project Context

### Application: Credit Union Loyalty Banking Experience
An everyday banking app for a credit union with a 3-tier loyalty program (Classic, Plus, Premium). The app currently has 17 screens organized into logical groups:

**Existing Screen Inventory (SCR-01 through SCR-17):**
1. SCR-01: Home Dashboard (account summary, quick actions)
2. SCR-02: Transaction History (filterable transaction list)
3. SCR-03: Loyalty Hub Landing (tier overview, next steps, rewards)
4. SCR-04: Tier Details (tier qualification rules, progress, benefits)
5. SCR-05: Rewards Catalog (available rewards, redemption)
6. SCR-06: Reward Redemption (redeem specific reward)
7. SCR-07: Benefits Comparison (side-by-side tier comparison)
8. SCR-08: Move Money Transfer (transfer between accounts)
9. SCR-09: Move Money Confirmation (transfer confirmation)
10. SCR-10: Bill Pay Dashboard (autopay, scheduled payments)
11. SCR-11: Bill Pay Setup (new bill pay configuration)
12. SCR-12: Loan Overview (loan accounts, balances, payments)
13. SCR-13: Loan Payment (make loan payment)
14. SCR-14: Account Settings (profile, preferences, security)
15. SCR-15: Notification Center (alerts, loyalty notifications)
16. SCR-16: Notification Settings (notification preferences)
17. SCR-17: Help & FAQ (support, FAQ, contact)

### What Already Works (Do NOT Modify)
- **Breadcrumbs** — already implemented and working well for hierarchical wayfinding
- **In-page navigation** — already working well within screens
- The app itself does NOT need modifications — this is purely adding the primary navigation shell

### Target Demographic
- Older, change-averse credit union members (55+)
- Many are not digital natives — familiar patterns are essential
- WCAG 2.1 AAA accessibility requirements (16pt+ font, 7:1 contrast, 48px tap targets)
- Trust-first, transparency-focused design
- Members use a mix of devices: desktop at home, tablets, smartphones

### Existing Personas
- **PERSONA-01**: Change-Averse Everyday Banker — needs familiar, predictable navigation
- **PERSONA-02**: Financially Savvy Benefit Optimizer — needs efficient access to all features
- **PERSONA-03**: Overwhelmed/Confused Member — needs simple, clear navigation with few choices
- **PERSONA-04**: Digitally Engaged Skeptic — expects modern patterns, finds outdated UI frustrating

### Experience Principles (from parent project)
1. **Additive Integration** — navigation enhances, never disrupts existing banking experience
2. **Trust-Based Transparency** — member always knows where they are and can get back
3. **Cognitive Load Preservation** — limited top-level nav items, progressive disclosure
4. **Multi-Layer Communication** — nav labels at summary level, breadcrumbs for detail
5. **Proactive Retrogression Prevention** — clear path back, no dead ends
6. **Real-Dollar Benefits** — loyalty status visible in nav for constant value reinforcement
7. **Self-Service Mastery** — member feels confident navigating independently

## Problem Statement
The app currently lacks a primary navigation system. While breadcrumbs and in-page navigation work well for within-screen wayfinding, there is no persistent way for members to move between major sections of the app (Home, Transactions, Loyalty, Move Money, More). Members must rely on back buttons and in-page links, which creates confusion for older users who expect a familiar, always-visible navigation pattern.

## Feature Description

### Desktop / Large Screen (≥1024px): Top Navigation Bar
A horizontal top navigation bar with:
- Credit union logo/branding on the left
- Primary nav items as horizontal text links with icons
- Active state indicator (selected section)
- Member tier badge/status indicator visible
- Notification bell with unread count
- Profile/settings access

### Tablet (768px–1023px): Adaptive Top Navigation
Same top navigation pattern but:
- Condensed spacing
- Potentially collapsed into hamburger menu at narrower tablet widths
- Or remains as icon+label horizontal nav with tighter spacing

### Mobile (< 768px): Bottom Tab Navigation
A fixed bottom tab bar with:
- 4-5 primary nav items as icon + short label
- Active state indicator
- Badge for notifications count
- Thumb-friendly placement (bottom of screen for easy one-handed reach)
- Familiar pattern (like banking apps members already use: Chase, BofA)

### Information Architecture for Navigation
The 17 screens should be grouped into 4-5 primary nav sections:

**Proposed grouping (to be refined by pipeline):**
1. **Home** — SCR-01 (Dashboard), SCR-02 (Transactions)
2. **Loyalty** — SCR-03 (Hub), SCR-04 (Tier Details), SCR-05 (Rewards), SCR-06 (Redemption), SCR-07 (Comparison)
3. **Move Money** — SCR-08 (Transfer), SCR-09 (Confirmation), SCR-10 (Bill Pay), SCR-11 (Bill Pay Setup)
4. **Loans** — SCR-12 (Overview), SCR-13 (Payment)
5. **More** — SCR-14 (Settings), SCR-15 (Notifications), SCR-16 (Notification Settings), SCR-17 (Help/FAQ)

## Success Criteria
- Members can reach any screen in ≤ 3 taps/clicks from any other screen
- Navigation pattern feels immediately familiar (no learning curve)
- Zero confusion about current location (active state + breadcrumbs working together)
- Consistent experience across desktop, tablet, and mobile
- No increase in support calls about "can't find" issues
- Full WCAG 2.1 AAA compliance
- Performance: navigation renders in <100ms, no layout shift on page transitions

## Design Constraints
- **Must not modify existing breadcrumbs or in-page navigation** — these work and should be preserved
- **Must complement, not replace** existing wayfinding
- WCAG 2.1 AAA: 48px tap targets, 7:1 contrast, 16pt+ labels, focus management
- Must work with Next.js App Router (layout-level component)
- Bottom tab nav on mobile must not obscure page content (proper spacing/padding)
- Top nav must be sticky/fixed on scroll
- Active state must be unambiguous (not just color — use underline, background, or weight)
- Labels must be clear, short, and use everyday language (not banking jargon)
- Icons must be universally recognizable and paired with text labels (never icon-only for this demographic)

## Competitive References
- **Chase Mobile**: Bottom tab nav with 5 items (Home, Explore, Cards, Payments, Profile)
- **Bank of America**: Bottom tab nav with 5 items (Home, Transfer, Bill Pay, Zelle, More)
- **Capital One**: Bottom tab with 4 items (Home, Accounts, Payments, Manage)
- **USAA**: Top nav (desktop) / bottom tab (mobile) with clear icons + labels
- **Navy Federal**: Traditional top nav (desktop) / hamburger + bottom tabs (mobile)

## Tech Stack
- Next.js 14 (App Router) — navigation lives in root layout
- Tailwind CSS
- Shadcn UI (NavigationMenu, Tabs, Sheet for mobile drawer)
- TypeScript
- Design-First mode (dummy JSON data)
