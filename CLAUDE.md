# Credit Union Loyalty Banking Experience — Developer Quick Start

**Project**: Credit Union Loyalty Banking Experience
**Version**: 1.0
**Created**: February 21, 2026
**Status**: READY FOR DEVELOPMENT

---

## Project Overview

A seamlessly integrated, three-tier loyalty program (Classic, Plus, Premium) for credit union members aged 55+. The experience preserves familiar banking workflows while introducing transparent tier qualification, real-dollar benefit visualization, and proactive retrogression prevention through a centralized Loyalty Hub.

**Vision**: Members experience loyalty as an additive feature that rewards their financial actions (maintaining balances, setting up autopay) with immediate, tangible value—without disrupting the core banking experience they rely on.

---

## Quick Start Reading Order

1. **THIS FILE** — Project vision, tech stack, key decisions
2. **00-project-brief.md** — Project goals, success criteria, constraints
3. **01-research-report.md** — Research foundation (48+ sources, 8 dimensions)
4. **02-qualitative-insights.md** — 7 themes, 7 priority insights from research
5. **03-experience-strategy.md** — Strategic framework, personas, principles, journey maps
6. **04-prd.md** — Feature requirements (10 features, 17 screens)
7. **05-ux-spec.md** — UX specifications (flows, components, accessibility)
8. **06-dev-spec.md** — Technical specifications (architecture, data models, implementation)
9. **07-shards/00-screen-inventory.md** — Build order, design tokens, shared infrastructure
10. **08-gap-analysis.md** — Consistency audit and remaining decisions

---

## Project Vision Statement

**Members experience banking as seamlessly integrated with loyalty**—where everyday financial actions (maintaining balances, setting up autopay, moving money) are recognized and rewarded transparently, and tier status feels like earned recognition rather than an opaque qualification game.

**The Loyalty Hub is a trusted resource** for understanding personal tier status and maximizing benefit value, integrated naturally into the banking experience without disrupting the familiar patterns members rely on.

**Every interaction delivers immediate clarity**: members always know their current tier, understand their next milestone, and see tangible dollar value from their loyalty—because trust, stability, and real financial benefit are what matter most to credit union members.

---

## Tech Stack

### Frontend (Mode A: Design-First — Default)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + CSS modules
- **UI Components**: Shadcn UI (Button, Card, Accordion, Tabs, Alert, Badge, Progress)
- **State Management**: React Context API (MemberContext, TierContext, NotificationContext)
- **Data**: Mock data (`/lib/mock-data.ts`) initially; all API calls abstracted in `/lib/api.ts`
- **Testing**: Jest + React Testing Library + axe-core for accessibility
- **Accessibility**: WCAG 2.1 AAA baseline (16pt+ font, 7:1 contrast, 48px tap targets)

### Backend (Mode B: Production-Ready — Recommended for Launch)
- **API**: Node.js/Express or Python/FastAPI
- **Database**: PostgreSQL (member data, tier status, notifications, audit logs)
- **Caching**: Redis (tier calculation, benefit calculation cache)
- **Job Queue**: Bull/RabbitMQ (daily rolling balance recalculation, proactive alerts)
- **Real-Time**: WebSocket (Socket.io) or Server-Sent Events for tier notifications
- **Monitoring**: Prometheus/Grafana metrics, Sentry error tracking

**Recommendation**: Start with Mode A to validate UX. Build Mode B backend in parallel for production launch (rolling balance complexity, real-time tier calculation, notification reliability).

---

## Target Users

### PERSONA-01: Change-Averse Everyday Banker
- **Profile**: 62-year-old retired, $85K–$120K income, 15+ years with credit union
- **Behavior**: 2–3 logins/week, basic banking (check balance, transfers, bill pay)
- **Core Need**: Stability, clarity, no friction to familiar workflows
- **Design for**: Preserve core banking flows completely; layer loyalty as optional enhancement

### PERSONA-02: Financially Savvy Benefit Optimizer
- **Profile**: 58-year-old professional, $150K+ income, multiple accounts, daily app usage
- **Behavior**: Actively manages balances, compares financial products, wants to optimize
- **Core Need**: Transparent benefit calculations, detailed rules, "what-if" scenarios
- **Design for**: Detailed tier rules, real-dollar benefit display, comparison tools

### PERSONA-03: Overwhelmed/Confused Member Needing Hand-Holding
- **Profile**: 71-year-old retired, $65K–$85K income, recent smartphone banking immigrant
- **Behavior**: 1–2 logins/week, anxious about digital banking, prefers phone support
- **Core Need**: Simple explanations, reassurance, abundant help and guidance
- **Design for**: Plain language, visual explanations, accessible support options

### PERSONA-04: Digitally Engaged Loyalty Skeptic
- **Profile**: 52-year-old digitally native, $120K–$160K income, early fintech adopter
- **Behavior**: Daily login, multiple financial institutions, critical of banking UX
- **Core Need**: Authentic value (not marketing gimmicks), transparent rules, no manipulation
- **Design for**: Clean UX, transparent calculations, honest communication, easy opt-out

---

## Experience Principles (7 Core Design Constraints)

### 1. **Additive Integration, Never Disruptive Reorganization**
Core banking flows (account summary, transfers, autopay) remain unchanged. Loyalty layers on top through new entry points (Loyalty Hub, tier badges). Zero friction to core tasks.

### 2. **Trust-Based Transparency Over Simplified Inaccuracy**
Tier rules are complex (rolling balance, autopay criteria, retrogression). Provide accurate summaries at top level, full details with examples for those seeking deep understanding. Never oversimplify to the point of inaccuracy.

### 3. **Cognitive Load Preservation as Design Constraint**
Older demographic users have fixed cognitive budgets. Every loyalty UI element must pass the test: "Does it help the member understand/act on their tier, or create mental burden?" If it doesn't serve, remove it.

### 4. **Multi-Layer Communication for Complexity Management**
Structure complex tier rules in layers (Hub main → Tier Details → Account Status → FAQ). Max 1–2 navigation levels for any single task. Progressive disclosure without forcing deep hierarchies.

### 5. **Proactive Prevention of Loss Aversion Through Supportive Framing**
Retrogression (tier loss) triggers loss-aversion psychology. Prevent through proactive alerts before threshold, supportive framing ("maintain tier" not "losing tier"), grace periods, and recovery paths.

### 6. **Real-Dollar Benefit Demonstration Over Abstract Percentages**
APY boost expressed as "+0.25%" means nothing. Expressed as "+$25/year based on your $10,000 balance" demonstrates real value. Personalized calculations essential.

### 7. **Self-Service Information Architecture as Launch Prerequisite**
Success metric: "Minimize day-2 support calls." Requires FAQ (25–30 questions) designed and integrated BEFORE launch. Target 11:1 self-service-to-support ratio (LendingClub benchmark).

---

## 10 Key Features

| # | Feature Name | Purpose | Primary Persona | Status |
|---|---|---|---|---|
| 1 | **Account Summary with Loyalty Integration** | Show tier badge + progress on home dashboard | PERSONA-01 | P0 |
| 2 | **Loyalty Hub (Main)** | Central destination for tier, benefits, progress, FAQ | PERSONA-02, 04 | P0 |
| 3 | **Tier Details Page** | Tab-based comparison of all three tiers with rules | PERSONA-02 | P1 |
| 4 | **Account Status Detail** | Member's precise tier calculation with projected dates | PERSONA-02, 03 | P1 |
| 5 | **Benefit Details & Real-Dollar Calculator** | Personalized annual benefit value breakdown | PERSONA-02, 04 | P1 |
| 6 | **FAQ & Search** | 25–30 questions covering qualification, benefits, retrogression | All | P1 |
| 7 | **Contextual Loyalty Surfacing** | Tier benefits in transfers, transactions, autopay flows | All | P0 |
| 8 | **Retrogression Prevention System** | Proactive alerts when approaching tier-loss thresholds | All | P0 |
| 9 | **Notifications & Communication** | Tier achievement, threshold alerts, recovery guidance | All | P0 |
| 10 | **Legacy Program Migration** | Onboarding explaining program change and new tier assignment | All | P2 |

---

## 17 Screens in Build Order

| Priority | Screen | Purpose | Key Components |
|----------|--------|---------|---|
| **P0** | SCR-01: Home / Dashboard | Account summary + tier badges | TierBadge, TierProgressBar, AccountCard |
| **P0** | SCR-02: Loyalty Hub Main | Central loyalty destination | BenefitCard, TierProgressBar, ActionCTA |
| **P0** | SCR-10: Transfer Initiation | Move money with fee waiver context | FeeWaiverCallout, TransferForm |
| **P0** | SCR-11: Transfer Confirmation | Confirmation with fee savings display | FeeWaiverHighlight |
| **P0** | SCR-16: Retrogression Alert | Proactive tier-loss warning | RetrogressionAlert, ActionCTA |
| **P1** | SCR-03: Tier Details | Tab-based tier comparison | TierRulesAccordion, BenefitCard |
| **P1** | SCR-04: Account Status | Member's precise qualification data | TierCalculationViz, ProgressBar |
| **P1** | SCR-05: Benefit Details | Deep-dive into APY, fee waivers, rewards | BenefitCalculationCard, RealDollarDisplay |
| **P1** | SCR-06: FAQ & Search | Searchable Q&A | SearchBar, FAQList, VisualExplanations |
| **P1** | SCR-08: Account Detail | Account card with tier benefit context | TierBadge, BenefitCallout |
| **P1** | SCR-09: Transaction Detail | Transaction with benefit earned display | BenefitEarnedContext |
| **P1** | SCR-12: Autopay List | List with tier contribution info | AutopayItem, TierContributionLabel |
| **P1** | SCR-13: Autopay Setup | Setup flow with tier impact messaging | TierImpactMessaging, ActionCTA |
| **P1** | SCR-14: Autopay Removal | Confirmation with tier impact warning | TierLossWarning |
| **P2** | SCR-07: Help / Support | Support contact options | ContactForm, SupportLinks |
| **P2** | SCR-15: Legacy Migration | First-login onboarding | BenefitComparison, OnboardingFlow |
| **P2** | SCR-17: Notification Settings | Notification preferences | PreferenceToggle, FrequencySelect |

---

## Tier System

### Three Tiers

#### **Classic Tier**
- **Qualification**: 3-month rolling balance of $2,500 + 1 autopay (loan or credit card)
- **Benefits**:
  - APY Boost: +0.10% on savings
  - Fee Waiver: Standard fee waivers
  - Third-party Rewards: Access to rewards program

#### **Plus Tier**
- **Qualification**: 3-month rolling balance of $10,000 + 2 autopays (max 1 credit card)
- **Benefits**:
  - APY Boost: +0.25% on savings
  - Fee Waiver: Premium fee waivers
  - Third-party Rewards: Enhanced rewards (2X points on selected categories)

#### **Premium Tier**
- **Qualification**: 3-month rolling balance of $25,000 + 3 autopays (max 2 credit cards)
- **Benefits**:
  - APY Boost: +0.50% on savings
  - Fee Waiver: Premium fee waivers
  - Third-party Rewards: Premium rewards (3X points, priority support)

### Rolling Balance Calculation
- **Definition**: Average of balance on the last day of each month for the past 3 months
- **Example**: Oct 31: $2,600, Nov 30: $2,500, Dec 31: $2,400 → Average = $2,500
- **Update Frequency**: Daily batch job recalculates; member sees current rolling balance in app

### Retrogression Rules
- **Grace Period**: 30 days after qualification criteria lapse before tier officially changes
- **Triggers**: Balance drops below tier minimum OR required autopays expire
- **Communication**: Proactive alert at 30-day threshold, then 14-day, then 7-day
- **Recovery Path**: If tier drops, member can re-qualify by restoring criteria

---

## Design System

### Colors
- **Classic Tier**: `#6B7280` (gray)
- **Plus Tier**: `#D4A574` (gold)
- **Premium Tier**: `#E8E8E8` (platinum)
- **Success**: `#10B981` (emerald)
- **Warning**: `#F59E0B` (amber)
- **Urgent**: `#EF4444` (red, only for immediate 14-day tier loss)

### Typography
- **Body**: 16pt (WCAG 2.1 AAA baseline for all demographics)
- **Headings**: 28pt (H1), 24pt (H2), 20pt (H3)
- **Small**: 14pt minimum (never smaller)
- **Font Family**: Sans-serif (Tailwind default or custom)

### Spacing
- **Base Unit**: 8px
- **Small**: 8px, **Medium**: 16px, **Large**: 24px, **XL**: 32px+

### Touch Targets
- **Minimum**: 44×44px (WCAG 2.1 AA)
- **Target**: 48×48px (WCAG 2.1 AAA, recommended for older demographics)

### Breakpoints
- **Mobile**: 320–479px (primary for older adults)
- **Tablet**: 480–1024px
- **Desktop**: 1025px+
- **Container Max-Width**: 900px (readability for longer text)

---

## Project Structure (Mode A)

```
credit-union-loyalty/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout + MemberContext
│   ├── page.tsx                   # Home / Dashboard (SCR-01)
│   ├── loyalty/
│   │   ├── page.tsx               # Loyalty Hub Main (SCR-02)
│   │   ├── tier-details/page.tsx  # Tier Details (SCR-03)
│   │   ├── account-status/page.tsx # Account Status (SCR-04)
│   │   ├── benefits/page.tsx      # Benefit Details (SCR-05)
│   │   └── faq/page.tsx           # FAQ & Search (SCR-06)
│   ├── accounts/[id]/page.tsx     # Account Detail (SCR-08)
│   ├── transactions/[id]/page.tsx # Transaction Detail (SCR-09)
│   ├── transfer/page.tsx          # Transfer Initiation (SCR-10)
│   ├── autopay/page.tsx           # Autopay List (SCR-12)
│   ├── settings/page.tsx          # Notification Settings (SCR-17)
│   └── ...
│
├── components/
│   ├── loyalty/                   # Loyalty-specific components
│   │   ├── TierBadge.tsx
│   │   ├── TierProgressBar.tsx
│   │   ├── BenefitCard.tsx
│   │   ├── BenefitValueCalculator.tsx
│   │   ├── RetrogressionAlert.tsx
│   │   └── ...
│   ├── ui/                        # Shadcn components
│   └── layout/
│
├── lib/
│   ├── api.ts                     # Mock API layer (real API signatures)
│   ├── calculations.ts            # Tier calc, benefit calc logic
│   ├── types.ts                   # TypeScript interfaces
│   ├── constants.ts               # Tier config, feature flags
│   └── hooks.ts                   # Custom React hooks
│
├── context/
│   ├── MemberContext.tsx          # Member profile, current tier
│   ├── TierContext.tsx            # Tier configuration
│   └── NotificationContext.tsx    # Notification state
│
├── styles/
│   ├── globals.css                # Global Tailwind
│   ├── variables.css              # CSS custom properties
│   └── accessibility.css          # A11y styles
│
└── tests/
    ├── components/
    └── lib/
```

---

## Key Implementation Decisions

### 1. Mock Data First (Mode A)
All components built against `/lib/api.ts` which exports mock-data functions. Real API integration happens by replacing mock calls, not refactoring components.

### 2. React Context for State
Use Context API for Member, Tier, Notification state. No Redux/Zustand for this scope complexity.

### 3. Calculations in Library
All tier qualification logic, benefit calculation, date thresholds centralized in `/lib/calculations.ts`. Components call these functions; tests verify accuracy.

### 4. Shadcn UI Foundation
Leverage Shadcn for accessibility baseline. Custom theming via Tailwind variables.

### 5. Two-Mode Architecture
**Mode A (MVP)**: Design-first, Next.js + mock data. Validate UX with real users.
**Mode B (Production)**: Full backend with PostgreSQL, Redis, job queues. Required for:
- Rolling balance calculation at scale
- Real-time tier updates across devices
- Proactive alert system reliability
- Audit trail for compliance

---

## Accessibility Requirements (WCAG 2.1 AAA)

### Non-Negotiable
- **Font Size**: 16pt minimum for body text (all ages benefit)
- **Contrast**: 7:1 minimum for all text on background
- **Touch Targets**: 48×48px minimum for interactive elements
- **Navigation Depth**: Max 1–2 levels for any critical task
- **Color**: Never convey information through color alone (use icon + color + text)

### Testing Checklist
- [ ] Manual WCAG 2.1 AAA review (paid accessibility auditor pre-launch)
- [ ] Automated axe-core testing in unit tests
- [ ] User testing with 55–75 age demographic (15–20% of cohort)
- [ ] Keyboard navigation testing (tab, enter, escape)
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)

---

## Success Metrics & Acceptance Criteria

### For Development Phase
- [ ] All 17 screens implemented and component-testable
- [ ] 100% of accessibility requirements met (WCAG 2.1 AAA audit pass)
- [ ] 100% of tier calculation logic tested (unit tests for edge cases)
- [ ] Zero regression in core banking task completion time
- [ ] Mock data API layer fully functional

### For Launch
- [ ] 70%+ Loyalty Hub adoption within 30 days
- [ ] 11:1 self-service-to-support ratio (FAQ answers 80%+ of support questions)
- [ ] 80%+ member understanding of tier qualification ("I understand how my tier is calculated")
- [ ] Zero increase in day-1/day-2 support volume (vs. normal baseline)
- [ ] 80%+ member satisfaction with loyalty program fairness

### Business Outcomes (3–6 months post-launch)
- [ ] 30% average balance increase for members advancing to Plus/Premium
- [ ] 20%+ increase in new loan originations
- [ ] 40% increase in Loyalty Hub engagement
- [ ] 25% improvement in 12-month member retention

---

## Do Not Touch (Critical Boundaries)

### Core Banking Workflows
- ❌ **DO NOT** reorganize account summary, transactions, or transfer flows
- ❌ **DO NOT** add required steps to core banking tasks
- ❌ **DO NOT** change autopay setup beyond adding tier context
- ✅ **DO** layer loyalty information contextually without disruption

### Tier Rules
- ❌ **DO NOT** change tier qualification thresholds without Product approval
- ❌ **DO NOT** modify autopay counting rules or product limits
- ❌ **DO NOT** add new benefit types without full specification
- ✅ **DO** implement exactly as specified in PRD/Experience Strategy

### Member Privacy & Security
- ❌ **DO NOT** expose tier information to other members
- ❌ **DO NOT** collect financial data beyond account balances and autopay status
- ❌ **DO NOT** share member data with third parties without consent
- ✅ **DO** implement standard auth/authorization patterns

---

## How to Start Building

### Week 1: Foundation
1. Clone project, install dependencies
2. Set up Next.js 14 + Tailwind + Shadcn
3. Create MemberContext, TierContext
4. Build `/lib/calculations.ts` (tier qualification logic)
5. Build `/lib/api.ts` (mock data layer)

### Week 2: Core Screens (P0)
1. SCR-01: Home / Dashboard with tier badges
2. SCR-02: Loyalty Hub Main
3. SCR-10/11: Transfer with fee waiver display
4. SCR-16: Retrogression alert

### Weeks 3–4: Learning Screens (P1)
1. SCR-03: Tier Details (tab navigation)
2. SCR-04: Account Status (calculations display)
3. SCR-05: Benefit Details (real-dollar values)
4. SCR-06: FAQ & Search

### Weeks 5–6: Management Screens (P1)
1. SCR-12/13/14: Autopay flows with tier messaging
2. SCR-08/09: Enhanced account/transaction detail
3. Testing and accessibility audit

### Week 7: Launch Prep (P2)
1. SCR-15: Legacy migration onboarding
2. SCR-07: Help/Support
3. SCR-17: Notification settings
4. Pre-launch communication templates

---

## Testing Strategy

### Unit Tests
- **Tier Calculations**: Edge cases (rolling balance thresholds, grace periods, retrogression)
- **Benefit Calculations**: APY boost, fee waiver, third-party rewards personalization
- **API Layer**: Mock API functions return correct shapes

### Integration Tests
- **User Flows**: Everyday banking → Hub exploration → tier understanding
- **Retrogression Flow**: Alert trigger → action → confirmation
- **Legacy Migration**: Program change communication → new tier assignment

### Accessibility Tests
- **Automated**: axe-core in CI/CD pipeline
- **Manual**: WCAG 2.1 AAA checklist review pre-launch
- **User Testing**: 15–20% of test cohort aged 55+

### E2E Tests
- **Happy Paths**: Complete everyday banking tasks with zero friction
- **Sad Paths**: Member at tier-loss threshold receives correct alert

---

## How to Test

### Cognitive Load Audit (Critical for Older Demographics)
1. **Baseline**: Measure core banking task completion time BEFORE loyalty integration
2. **Post-Integration**: Measure same tasks AFTER loyalty is added
3. **Success Criteria**: Zero regression (same time/effort)
4. **Test Cohort**: Mix of ages 55–75, various tech comfort levels

### Self-Service Efficiency
1. **Metric**: FAQ usage / support call volume
2. **Target**: 11:1 ratio (11 FAQ visitors per 1 support ticket)
3. **Test**: Search for common questions, measure answer findability

### Member Comprehension
1. **Survey**: "I understand how my tier is calculated" (agreement ≥80%)
2. **Task**: "Correctly state your tier and one benefit" (success ≥90%)
3. **Interview**: Qualitative feedback on clarity, fairness, perceived value

---

## Deployment Checklist

### Pre-Launch (2 Weeks Before)
- [ ] All P0 + P1 screens tested and reviewed
- [ ] Accessibility audit passed (WCAG 2.1 AAA)
- [ ] Mode A (design-first) fully functional with mock data
- [ ] Pre-launch communication drafted and scheduled
- [ ] Tier configuration loaded into system (Classic, Plus, Premium rules)
- [ ] Legacy member migration mapping complete

### Launch Week
- [ ] Member communication deployed (2–3 weeks before, 1 week before)
- [ ] FAQ content finalized and integrated
- [ ] Customer service trained on tier rules and support scripts
- [ ] Production database seeded with current members and tier assignments
- [ ] Monitoring/alerting configured (tier calculation errors, notification failures)

### Post-Launch (First 30 Days)
- [ ] Monitor support call volume and reasons (target: no increase)
- [ ] Track Loyalty Hub adoption (target: 70% within 30 days)
- [ ] Analyze FAQ usage (identify gaps)
- [ ] Run member satisfaction survey (CSAT ≥4/5)
- [ ] Iterate based on feedback

---

## Key Constraints & Assumptions

### Constraints
- **Older Demographic**: Design baseline for 55+, not younger users
- **No Disruption**: Zero friction to core banking tasks
- **Transparency**: Tier rules accurate at all disclosure levels (no oversimplification)
- **Self-Service**: 80%+ of support questions answered in FAQ/Hub before launch

### Assumptions
- Credit union has historical data on member balances, autopay patterns, transactions
- Legacy program migration can occur via clean cutover (no parallel operation)
- Staff training and support scripting completed before launch
- Pre-launch communication delivered on schedule
- Member testing includes older demographic cohort (55+)
- Technology stack (Next.js 14, Shadcn, Tailwind) approved and available

---

## Open Decisions (Require Product Owner Input)

1. **Third-Party Rewards Provider**: Which provider selected? API available? Real or mock integration in Phase 1?
2. **Email/SMS Service**: Existing infrastructure or new procurement (Twilio, SendGrid)?
3. **Tier Calculation Latency**: Real-time tier display or daily batch? Acceptable lag for alerts?
4. **Legacy Migration Cutover**: Simultaneous all-members or phased rollout? How map old tiers to new?

---

## Useful References

- **PRD** (04-prd.md): Feature specifications, acceptance criteria
- **UX Spec** (05-ux-spec.md): Screen flows, component hierarchy, content
- **Dev Spec** (06-dev-spec.md): Data models, API contracts, technical details
- **Experience Strategy** (03-experience-strategy.md): Design principles, persona deep-dives
- **Research Report** (01-research-report.md): Evidence foundation (48+ sources)
- **Qualitative Insights** (02-qualitative-insights.md): 7 themes, design implications
- **Gap Analysis** (08-gap-analysis.md): Consistency check, open decisions

---

## Support & Contact

**Questions about design/UX**: Refer to 05-ux-spec.md and 03-experience-strategy.md

**Questions about features/requirements**: Refer to 04-prd.md

**Questions about technical implementation**: Refer to 06-dev-spec.md

**Questions about accessibility/older demographic design**: Refer to 02-qualitative-insights.md Theme 6

**Questions about tier rules/calculations**: Refer to 00-project-brief.md and 04-prd.md Section 3.7

---

## ✅ Ready to Build

All specifications are complete, consistent, and production-ready. Begin with Mode A (design-first, mock data) to validate UX. Parallelize Mode B backend for production launch.

**Good luck, team!** 🚀
