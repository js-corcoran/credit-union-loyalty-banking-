# Project Brief — Smart Loyalty Transfer Feature

**Project Name**: Smart Loyalty Transfer
**Project Slug**: smart-loyalty-transfer
**Created**: 2026-02-22
**Type**: Feature Enhancement (additive to Credit Union Loyalty Banking Experience)

## Vision
Enable one-tap loyalty-driven transfers by connecting tier progression CTAs directly to the Move Money transfer screen with pre-filled amounts, pre-selected accounts, and contextual loyalty messaging — eliminating cognitive load and reducing the steps between "I want to reach the next tier" and "done."

## Parent Project Context
This feature enhances the **Credit Union Loyalty Banking Experience** — an everyday banking app for a credit union with a 3-tier loyalty program:
- **Classic**: $2,500 rolling avg balance + 1 active autopay
- **Plus**: $10,000 rolling avg balance + 2 active autopays + max 1 credit card
- **Premium**: Higher thresholds (exact TBD)

### Target Demographic
- Older, change-averse credit union members (55+)
- WCAG 2.1 AAA accessibility requirements (16pt+ font, 7:1 contrast, 48px tap targets)
- Trust-first, transparency-focused design

### Existing Personas
- **PERSONA-01**: Change-Averse Everyday Banker (primary)
- **PERSONA-02**: Financially Savvy Benefit Optimizer
- **PERSONA-03**: Overwhelmed/Confused Member
- **PERSONA-04**: Digitally Engaged Skeptic

### Experience Principles (from parent project)
1. **Additive Integration** — loyalty enhances, never disrupts existing banking
2. **Trust-Based Transparency** — every calculation visible and verifiable
3. **Cognitive Load Preservation** — progressive disclosure, never overwhelming
4. **Multi-Layer Communication** — information at summary, detail, and deep-dive levels
5. **Proactive Retrogression Prevention** — warn before tier drops
6. **Real-Dollar Benefits** — show actual savings, not abstract points
7. **Self-Service Mastery** — empower members to manage independently

## Problem Statement
Currently, when a member sees a tier progression CTA (e.g., "Increase balance by $2,300.00 to reach Premium") on the Tier Details page or Loyalty Hub, they must:
1. Read the amount needed
2. Remember it
3. Navigate to Move Money
4. Select the correct destination account
5. Manually type the amount
6. Submit the transfer

This 6-step process creates friction, cognitive load, and drop-off. Members (especially PERSONA-01 and PERSONA-03) may abandon the intent entirely.

## Feature Description
When a member taps a tier progression CTA on:
- **Tier Details page** — e.g., "Increase balance by $2,300.00 to reach Premium" button
- **Loyalty Hub Landing page** — e.g., "Next Steps" section actions

They are taken to the **Move Money Transfer screen** with:
1. **Notification banner at top** — explains what the transfer is for and why (e.g., "Transfer $2,300.00 to reach Premium tier and unlock 1.25% APY savings rate")
2. **To-account pre-selected** — the qualifying account is already chosen
3. **Amount pre-filled** — the exact amount needed to reach the next tier
4. **Memo pre-populated** — "Loyalty tier qualification transfer" (editable)
5. **Source account selection** — member still chooses where to transfer FROM (respecting zero-friction principle — no assumptions about source)

## Success Criteria
- Reduce tier-progression transfer completion from 6 steps to 2 (tap CTA → confirm transfer)
- Increase tier progression conversion rate by 40%+
- Zero increase in day-2 support calls related to unexpected transfers
- Member satisfaction score ≥ 4.5/5 for the transfer flow
- Full accessibility compliance (WCAG 2.1 AAA)

## Screens Affected
1. **SCR-04 Tier Details** — Add/modify CTA button behavior to deep-link with params
2. **SCR-03 Loyalty Hub Landing** — Add/modify Next Steps actions to deep-link with params
3. **SCR-08 Move Money Transfer** — Add loyalty transfer notification banner, pre-fill logic, memo field

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Shadcn UI
- TypeScript
- Design-First mode (dummy JSON data)

## Constraints
- Must not break existing transfer flow for non-loyalty transfers
- Must respect the "Additive Integration" principle — loyalty context is additive, never replacing standard transfer UI
- Pre-filled fields must be editable (member has full control)
- Amount shown must match real-time tier qualification gap (not stale data)
- Notification banner must be dismissible
- Must work for all tier transitions (Classic→Plus, Plus→Premium)
- Must handle edge case: member already qualifies (show success state instead)

## Competitive References
- **Venmo**: Pre-filled payment requests with context
- **Cash App**: One-tap payment from notifications
- **Chase**: Savings goal "quick transfer" with pre-filled amounts
- **Capital One**: Goal-based transfer nudges with contextual messaging
