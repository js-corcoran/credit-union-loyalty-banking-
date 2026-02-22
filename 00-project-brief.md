# Project Brief

**Project Name**: Credit Union Loyalty Banking Experience
**Project Slug**: credit-union-loyalty-banking
**Created**: 2026-02-21

## Vision
Design a best-in-class everyday banking experience (account summary, transaction details, move money, notifications, loans, autopay) for a credit union's digital web and mobile app, with a loyalty rewards program seamlessly integrated — anchored by a centralized Loyalty Hub — that delivers immediate value to members without disrupting familiar banking workflows.

## Target Users
Credit union members who are an older demographic, change-averse, with strong financial positioning and resources. These are established members who rely on everyday banking tasks and expect stability, clarity, and simplicity in their digital experience. They are not early adopters and value familiarity over novelty.

## Problem Statement
The credit union is introducing a new 3-tier loyalty rewards program into existing digital banking experiences. The core challenge is integrating loyalty in a way that:
- Does not create transitional volatility — members are change-averse and any disruption to familiar banking flows risks confusion, frustration, and increased support calls
- Surfaces loyalty value strategically within everyday banking moments without impeding task-oriented goals
- Makes complex tier qualification rules (rolling balances, autopay requirements, retrogression) understandable and actionable
- Replaces an existing loyalty program with lower qualifying limits ($500), which may feel like a downgrade for some members
- Demonstrates immediate, tangible value (better APY boosts, fee waivers, third-party rewards) to drive adoption
- Minimizes day-2 customer service calls through clear, self-service information architecture

## Success Criteria
- Members can complete everyday banking tasks (check balances, view transactions, move money, manage autopay) with zero added friction from loyalty integration
- Members understand their loyalty tier, benefits, and qualification requirements without needing to call customer service
- Transitional volatility is minimized — measured by support call volume, task completion rates, and member satisfaction scores post-launch
- Loyalty program adoption rates meet organizational targets
- Low-cost deposit growth, increased product penetration, reduced origination costs, higher engagement, lower attrition, reduced credit losses

## Scope
Full product design — everyday banking flows (account summary, account transaction details, move money, notifications, loans, autopay) plus the Loyalty Hub as a primary destination. Web and mobile app experiences. This is a design/specification effort preparing for AI-assisted development.

## Tech Stack
Default: Next.js 14 + Tailwind CSS + Shadcn UI (design-first mode, with Mode B recommendation in dev spec)

## Constraints
- **Demographic**: Older, change-averse members — requires large tap targets, readable type, high contrast, simple linear flows, plain language, error prevention, forgiving recovery
- **Transitional Volatility**: Must preserve familiar banking patterns; loyalty integration should feel additive, not disruptive
- **Complexity Management**: Tier qualification rules are deceptively complex (rolling balances, autopay requirements with specific credit card limits, retrogression rules, grace periods)
- **Legacy Program Migration**: Some members will be moved from an existing loyalty program with $500 qualifying limits to new tiers with $2,500+ requirements — requires careful communication
- **Platform**: Web and mobile app (responsive design)
- **Accessibility**: WCAG 2.1 AA minimum, with special attention to older demographic needs

## Reference Products / Benchmarks
- **Bank of America** — recent redesign pivot, loyalty integration patterns
- **Chase** — everyday banking UX, rewards integration
- **Capital One** — banking + rewards experience, tier management
- Other best-in-class banking apps with loyalty/rewards programs
- Research focus on credit union member expectations vs. large bank experiences
- Research focus on older demographic digital banking patterns and preferences

## Loyalty Program Structure

### Three Tiers
1. **Classic** — 3-month rolling balance of $2,500 in a qualified account + 1 loan or credit card on autopay
2. **Plus** — 3-month rolling balance of $10,000 in a qualified account + 2 items on autopay for loans or credit cards (only 1 can be a credit card)
3. **Premium** — [Higher thresholds, details to be determined based on research]

### Primary Member Value Drivers
- Better APY on credit cards (boost)
- Fee waivers
- Third-party rewards provider (currently a link-out, aspiration to integrate into Loyalty Hub)

### Key Challenges to Address in Design
1. **Tier Complexity**: Simple on surface, complex in details (rolling balances, autopay rules, credit card limits per tier)
2. **Retrogression**: Members can drop tiers if qualifying criteria lapse (e.g., loan paid off without replacement autopay). Need grace period communication and gentle nudging
3. **Retrogression Nudging**: Alert without alarming — needs careful tone and urgency calibration
4. **Legacy Program Migration**: Some members may perceive new program as a downgrade due to higher qualifying thresholds ($500 → $2,500+). Members qualifying for Plus/Premium may see better benefits
5. **Day-2 Call Reduction**: Self-service information architecture must answer all common questions
6. **Progression Display**: Showing progress toward next tier should be contextually intelligent — avoid showing daunting gaps early, show momentum when close
7. **Value Demonstration**: Accumulated benefits (cash back, fee waivers, APY savings) should be visible and compelling

## Design Principles
1. **Seamless Integration into Everyday Banking** — Surface loyalty subtly into existing banking moments (account summary, transactions, move money, communicate) with an easily accessible robust Loyalty Hub. Keep current task-oriented user goals unimpeded.
2. **Foundational UX for Older Demographic** — Readable type, high contrast, large tap targets, simple linear flows, plain language, error prevention and forgiving recovery.
3. **Minimizing Transitional Volatility** — De-risk the change by caring for familiar experiences members are used to and making strategic improvements that "do no harm."
4. **Immediate Value Demonstration** — Make loyalty benefits clear, demonstrated upfront, and quickly realized.
5. **Progressive Disclosure & Simplification** — Simple for most, with easy access to deeper details for those who want them.

## Organizational Goals
- Growing low-cost deposits
- Increase product penetration & reduce cost of originations
- Driving engagement / lowering attrition
- Reduce credit losses

## Additional Context
- The Loyalty Hub should be easy to find in the information architecture and within everyday banking flows
- Users should see the connection to loyalty within banking tasks and access the Hub when more details are needed
- The third-party rewards provider is currently a link-out but the aspiration is to bring this into the Loyalty Hub
- Research should address all key challenges listed above
- Experience design should address all key challenges listed above
- This is a credit union context — members (not customers), community-oriented, trust-based relationships
