# Credit Union Loyalty Banking Experience — Product Requirements Document
**Project**: Credit Union Loyalty Banking Experience
**Phase**: Step 4 — PRD Generator
**Date**: February 21, 2026
**Status**: COMPLETE
**Version**: 1.0

---

## PIPELINE TRACEABILITY

| PRD Element | Source Document | Rationale |
|-------------|-----------------|-----------|
| Target Personas (PERSONA-01 through PERSONA-04) | 03-experience-strategy.md (Section 3) | Personas defined in experience strategy with detailed profiles; referenced throughout PRD |
| Experience Principles (7 core principles) | 03-experience-strategy.md (Section 4) | Principles guide all feature prioritization, screen design, and interaction design |
| Journey Stages & Flows | 03-experience-strategy.md (Section 5) | Maps personas to journey stages; informs feature sequencing and screen organization |
| Feature Requirements | 02-qualitative-insights.md (7 themes, design opportunity map) | Themes identify critical capabilities (transparency, accessibility, cognitive load management); design opportunities map specific features |
| Tier Complexity & Rules | 00-project-brief.md & 01-research-report.md | Tier structure (Classic, Plus, Premium with rolling balances and autopay requirements); complexity management strategies documented |
| Accessibility Constraints | 01-research-report.md & 02-qualitative-insights.md | WCAG 2.1 AAA target (16pt+ font, 7:1 contrast, 48px+ tap targets); older demographic design as core UX |
| Self-Service & FAQ | 02-qualitative-insights.md (Insight 5) | FAQ-driven design; 25–30 anticipated questions address 80% of support volume |
| UI/Design Direction | 03-experience-strategy.md (Section 6) | Design direction aligned with older demographic needs; visual design principles; accessibility-first approach |

---

## 1. ELEVATOR PITCH

A seamlessly integrated loyalty rewards experience for credit union members that preserves familiar everyday banking workflows while introducing a transparent, achievable three-tier loyalty program (Classic, Plus, Premium) anchored by a centralized Loyalty Hub. The experience uses layered communication, real-dollar benefit visualization, and proactive retrogression prevention to make complex tier qualification rules understandable without support calls, delivering immediate value and driving engagement among change-averse, older demographic members (55+) who prioritize stability and trust.

---

## 2. TARGET PERSONAS

### PERSONA-01: Change-Averse Everyday Banker

**Who They Are**: 68-year-old female, retired, household income $50K–$70K (primarily from Social Security + pension). Core credit union member for 15+ years; primary accounts are checking and savings for daily living. Limited technology comfort; uses basic banking functions (balance check, view transactions, move money). Minimal credit card usage; prefers debit. Rarely borrows. Recently started using mobile app but primarily trusts branch/phone support.

**Pain Points**:
- Confusion when interface changes; takes time to relearn familiar patterns
- Anxiety about new features or program changes; fears disruption to trusted workflows
- Limited patience for complex explanations; prefers simple, direct communication
- Technology anxiety; reluctant to explore new features without guidance
- Overwhelmed by notifications and UI clutter; prefers signal over noise

**Goals & Outcomes**:
- Complete everyday banking tasks (check balance, move money, set autopay) with zero added friction
- Understand what loyalty tier she qualifies for and what benefits she gets without calling support
- Feel confident that loyalty program changes are fair and not designed to punish her
- Receive helpful communication about loyalty benefits, not marketing spam
- Access support easily if confused

**Obstacles**:
- Resistance to change; prefers familiar banking patterns unchanged
- Limited digital literacy; difficulty with complex interfaces or deep navigation
- Skepticism of new programs; concerned about hidden costs or qualification traps
- Cognitive load constraints; limited attention budget for non-essential UI elements
- Accessibility needs (vision, motor control); requires large type, high contrast, simple flows

**Success Criteria**:
- Completes core banking tasks with same time/effort as before loyalty integration (zero regression)
- Correctly states their tier and one primary benefit within 5 minutes of exploring Loyalty Hub
- Makes zero support calls related to loyalty program understanding
- Perceives loyalty program as fair and beneficial (CSAT ≥ 4/5)
- Logs into Loyalty Hub at least monthly (engagement indicator)

---

### PERSONA-02: Financially Savvy Benefit Optimizer

**Who They Are**: 62-year-old male, employed (or recently transitioned to consulting), household income $100K–$140K. Active manager of finances; maintains accounts at 2–3 financial institutions. Primary credit union account has $35K–$60K balance. 2–3 credit cards optimized by rewards category; 3–4 autopays set strategically. High comfort with digital banking; uses app 4–5 times per week. Actively reads fintech news and compares financial products. Relationship with credit union is transactional but respectful.

**Pain Points**:
- Frustration with unclear or incomplete benefit explanations; unclear how much benefits are worth
- Concern about hidden complexity in tier qualification rules; worries about unintended downgrades
- Skepticism about whether benefits are "real" or marketing exaggeration
- Desire to optimize balance/autopay but uncertain about exact rules and edge cases
- Annoyance with generic messaging that doesn't reflect their specific financial situation

**Goals & Outcomes**:
- Understand tier qualification rules completely (including edge cases and retrogression mechanics)
- See personalized financial benefit value based on their actual balances and products
- Make informed decisions about whether to optimize for higher tier based on real-dollar benefits
- Monitor progress toward tier advancement with clear thresholds and timelines
- Receive contextual nudges that help them make strategic financial decisions (e.g., "Adding autopay would save you $X/year")

**Obstacles**:
- Complex tier rules with multiple criteria (rolling balance, autopay limits per tier, retrogression) are genuinely intricate
- Benefits are abstract (APY boost, fee waiver) without real-dollar context
- Comparison shopping culture; skeptical of claims without transparent evidence
- High expectations for UX quality; frustrated by outdated banking app design
- Demands detailed information but frustrated by overwhelming complexity

**Success Criteria**:
- Explains tier qualification rules accurately after reviewing Hub (no misunderstandings)
- Calculates their specific benefit value (e.g., "Plus tier saves me $80/year based on my $15K balance")
- Makes at least one deliberate decision to adjust balance/autopay based on tier benefits
- Regularly uses tier comparison tool or scenario "what-if" features
- Recommends program to peers (NPS ≥ 8/10)

---

### PERSONA-03: Overwhelmed/Confused Member Needing Hand-Holding

**Who They Are**: 71-year-old female, retired, household income $65K–$85K (Social Security + pension). Recent immigrant to smartphone banking; still prefers branch/phone support. Primary accounts: checking + savings with combined $20K–$35K balance. Recently qualified for Classic tier but doesn't understand why or what it means. 0–1 autopay. Logs in 1–2 times per week to check balance. High anxiety about financial mistakes.

**Pain Points**:
- Deep anxiety about using digital banking; fears losing money due to mistakes
- Confusion about financial terminology (autopay, rolling balance, tier); feels left behind
- Frustration when UI requires multiple steps or offers too many options
- Worry about being "too old" to understand new programs
- Stress from information overload; overwhelmed by dense explanations
- Prefers human guidance but feels embarrassed asking basic questions

**Goals & Outcomes**:
- Understand that loyalty program is safe and fair, not designed to trick them
- Learn what tier they qualify for and what that means in simple terms
- Receive step-by-step guidance if they want to understand more
- Feel supported, not abandoned, with clear access to help
- Gain confidence that they're making correct financial decisions

**Obstacles**:
- Limited technology comfort; hesitant to explore new interfaces
- Jargon and financial terminology create cognitive barriers
- Anxiety about making mistakes limits exploration of features
- Preference for human interaction conflicts with self-service design goals
- Vision and motor control challenges require accessibility design (large type, simple flows)

**Success Criteria**:
- Identifies their tier and states it correctly without support call
- Feels confident enough to explore Hub without fear of breaking something
- Accesses help/FAQ at least once and finds answer to their question
- Expresses satisfaction with clarity of explanations (CSAT ≥ 4/5)
- Makes zero errors or incorrect decisions based on misunderstanding program

---

### PERSONA-04: Digitally Engaged Loyalty Skeptic

**Who They Are**: 52-year-old male, employed in knowledge work, household income $120K–$160K. Digitally native; early adopter of fintech. Maintains accounts at 2–3 financial institutions; credit union account has $40K–$80K (qualifies for Plus tier). 2–3 credit cards, 3–4 autopays managed strategically. Logs in daily or 2–3 times per week via mobile app. Reads fintech news; critical of banking UX and skeptical of loyalty program marketing.

**Pain Points**:
- Annoyance with perceived manipulative banking practices (dark patterns, artificial urgency)
- Skepticism about whether loyalty benefits are real or inflated marketing claims
- Frustration with loyalty programs that feel designed to lock in members rather than provide value
- Concern about losing benefits due to fine-print qualification changes
- Resistance to notification spam; wants useful information, not marketing

**Goals & Outcomes**:
- Verify that loyalty benefits are genuine and worth attention (or dismissible if not)
- Understand exact rules and ensure they're fair and not designed to disadvantage members
- Optimize decisions if benefits genuinely matter, but without manipulative framing
- Receive helpful information without manipulative language or artificial urgency
- Use institution based on genuine value, not loyalty lock-in tactics

**Obstacles**:
- Skepticism about bank marketing; requires evidence, not claims
- Expectations for fintech-quality UX; frustrated by outdated banking app design
- Values control and ability to opt out; dislikes being nudged into behaviors
- Critical eye for design; notices and resents dark patterns and manipulative design
- Multiple competing financial institutions; will switch if better option emerges

**Success Criteria**:
- Verifies that benefit calculations are accurate and transparent
- Finds loyalty integration non-intrusive to core banking (zero added friction)
- Perceives program as authentic value-add, not marketing gimmick
- Does not receive excessive notifications; can control notification frequency/type
- Recommends program if genuine value, or at minimum doesn't criticize program design

---

## 3. FEATURES

### 3.1 Account Summary/Dashboard with Loyalty Integration

**What It Does**: The account summary displays primary checking and savings accounts with current balances, recent transactions, and (new) a tier badge showing member's current loyalty tier with progress toward next tier. Tier information is presented as a small visual component (badge + optional progress bar) that provides context without disrupting the core account summary.

**Why It's Needed**: Members need to understand their loyalty status *within* their everyday banking workflow. Requiring separate navigation to learn tier status creates friction. Contextual integration within account summary drives awareness and engagement with minimal cognitive load.

**How It Works**:
- Each account card displays: account name, account type (checking/savings), current balance, last transaction, account actions (view details, transfer, pay bill)
- For accounts relevant to tier qualification (savings/checking with qualified balance), add tier status:
  - Tier badge: colored icon + text showing "Classic," "Plus," or "Premium"
  - Benefit callout: "Plus tier: +0.25% APY" (show relevant benefit for account type)
  - Progress bar (only if member is not in Premium): visual indicator of distance to next tier, numeric label ("$8,500 of $10,000")
- Tap tier badge or progress bar to navigate to Loyalty Hub (detailed tier information)
- Maintain identical visual and functional structure for non-qualified accounts (no tier information added)

**Accessibility Notes**:
- Tier badge must be visually distinct (icon + color + text, not color alone)
- Progress bar must include numeric labels (not just visual fill percentage)
- All text ≥16pt; contrast ≥7:1
- Tap target ≥48×48px
- Progress bar with numeric labels supports accessibility for users with color blindness or vision impairments

---

### 3.2 Transaction Details with Benefit Context

**What It Does**: When a member views details of a specific transaction (e.g., a purchase on a credit card, a transfer, a bill payment), relevant tier benefits are highlighted. For example, a credit card purchase might show: "You qualify for Plus tier cash back on this purchase" or a fee-bearing transaction might show: "Plus tier waives this $2.50 fee."

**Why It's Needed**: Contextual benefit visibility demonstrates real value at the moment member is most interested. Seeing "You saved $X.XX with your loyalty tier" during transaction review increases perceived value and engagement.

**How It Works**:
- Transaction detail screen displays: transaction description, amount, date, account, recipient/merchant, status, and (new) a benefit context section
- Benefit context appears *only* if transaction is relevant to member's tier benefits (e.g., only on credit card transactions if cash back is relevant, only on fee-bearing transactions if fee waiver is relevant)
- Benefit context shows: benefit name ("Cash Back" or "Fee Waiver"), tier at which benefit applies ("Available with Plus tier"), and member's current tier status ("You have Plus tier and qualify for this benefit" or "You'd get this with Plus tier")
- If member has achieved the benefit tier: show actual savings ("This purchase earned you $2.45 in cash back")
- If member hasn't achieved the benefit tier: show potential benefit ("With Plus tier, you'd earn $2.45 in cash back on this purchase")
- Always include "Learn more" link to relevant section of Loyalty Hub

**Accessibility Notes**:
- Benefit context must be clearly visually separated from transaction details (bordered section or different background)
- Text ≥16pt; contrast ≥7:1
- Links must be large enough to tap reliably (≥48×48px tap area)

---

### 3.3 Move Money / Transfers with Fee Waiver Visibility

**What It Does**: When a member initiates a transfer or move money flow, the system displays relevant tier benefits related to that specific transaction. For example, "Your Plus tier gives you fee-free transfers. This transfer would normally cost $2.50, but you pay $0 today."

**Why It's Needed**: Fee waivers are one of the primary loyalty benefits. Showing the actual fee waived during the transaction (rather than after) demonstrates immediate, tangible value and reinforces why loyalty tier matters.

**How It Works**:
- Transfer/move money confirmation screen displays standard information: from account, to account, amount, date, recipient
- Add benefit callout before confirmation: "Fee waiver benefit" section
- If member's tier qualifies for fee-free transfers: display "Your [Tier] tier gives you fee-free transfers. Transfer fee: $0" (show standard fee in gray, waived fee prominent)
- If member doesn't yet qualify: display "With Plus tier, you'd get fee-free transfers. Current fee: $2.50. Upgrade to Plus to save."
- Include subtle link to Loyalty Hub benefits details if member is interested in upgrading
- Never make fee waiver display feel like a hard sell or manipulative nudge; it's informational

**Accessibility Notes**:
- Fee waiver callout must be visually distinct but not alarming
- Currency amounts must be large, high-contrast text
- Icons (checkmark for qualified, info for not-qualified) should supplement text
- Tap targets ≥48×48px

---

### 3.4 Loans / Autopay Management with Tier Contribution Visibility

**What It Does**: The autopay management screen lists all active autopays (loans, credit cards, bill payments) and shows how each autopay contributes to the member's loyalty tier qualification. For example: "Loan autopay: counts toward Classic and Plus tier" or "Credit card autopay: counts toward Plus and Premium tier (limit: 1 credit card per tier)."

**Why It's Needed**: Tier qualification depends partly on specific autopay counts with nuanced rules (e.g., "Plus requires 2 autopays but only 1 can be a credit card"). Members must understand which autopays count and how they contribute to tier advancement or retrogression.

**How It Works**:
- Autopay list displays: autopay target (account, bill name, merchant), frequency, status (active/inactive), and (new) tier contribution
- Tier contribution for each autopay shows: which tiers it counts toward ("Counts toward Classic + Plus + Premium"), any limits ("1 credit card autopay per Plus tier"), and contribution status ("This helps maintain your Plus tier")
- When member adds new autopay: during setup flow, show tier impact ("Adding this loan autopay moves you toward Plus tier: 2 of 2 required autopays for Plus")
- When member removes autopay: show tier impact ("Removing this autopay will drop you to Classic tier. You'll lose the Plus tier APY boost. Are you sure?") with option to pause instead of cancel
- Link from autopay tier contribution to detailed Loyalty Hub section explaining autopay rules

**Accessibility Notes**:
- Tier contribution information must be clear and scannable (not dense text)
- Status indicators (active/inactive, tier count) must use icon + color + text (not color alone)
- All text ≥16pt; contrast ≥7:1
- Tap targets ≥48×48px

---

### 3.5 Notifications / Communications with Loyalty Alerts

**What It Does**: A new notification category "Loyalty Status Updates" provides timely alerts about tier changes, approaching thresholds, available benefits, and retrogression risks. Notifications are contextual (only when relevant), use supportive framing, and always include actionable next steps.

**Why It's Needed**: Proactive communication prevents surprise tier changes and keeps members engaged with program. Supportive framing (vs. alarming language) manages loss-aversion psychology and reduces negative emotional response to tier loss risk.

**How It Works**:
- Member can enable/disable Loyalty Status Updates in notification settings; default is enabled but member has control
- Notification triggers include:
  - **Tier Achievement**: "Congratulations! You've reached Plus tier. Here's what you can do with your new benefits:" (link to Loyalty Hub, benefit details)
  - **Approaching Advancement**: "You're $500 away from Plus tier. Maintain your balance and you'll reach it by March 31." (contextual and motivational, not pressuring)
  - **Threshold Approaching**: "Your balance is approaching the Classic tier minimum. Keep it above $2,500 to maintain your tier."
  - **Autopay Expiration Alert**: "Your loan autopay is scheduled to end on March 31. To maintain Plus tier, you'll need another autopay or higher balance. Here's how:" (link to add autopay or transfer flow)
  - **Tier Loss Risk**: "You're at risk of dropping to Classic tier. To maintain Plus tier, [specific action]. Here's how:" (actionable, supportive, not alarming)
  - **Tier Change Confirmed**: "Your tier has changed to Classic. Here's what that means for your benefits. Let's help you get back to Plus:" (empathetic, recovery-focused)
  - **Benefit Available**: "You earned $2.50 in fee waiver with your Plus tier today" (celebratory, value demonstration)
- All notification text uses supportive tone: "maintain tier" not "losing tier"; "help you stay in Plus" not "you're about to lose"
- Each notification includes direct link to relevant Loyalty Hub section or action flow (transfer, autopay setup, etc.)
- Notifications respect frequency: maximum 1 per week unless member is at immediate risk of tier loss

**Accessibility Notes**:
- Notifications must be clear and scannable (not dense text)
- Urgency level (routine vs. warning) must use icon + color + text (not color alone)
- Tap targets for action links ≥48×48px
- Notification settings provide granular control (frequency, types, channels)

---

### 3.6 Loyalty Hub (Main Destination with Tier Details, Benefits, Progression, Retrogression Alerts)

**What It Does**: The Loyalty Hub is the comprehensive destination for all loyalty-related information. It presents the member's current tier, progress toward next tier, detailed tier rules, benefits explanation, FAQ, and account-specific tier data (rolling balance, autopay status, days until thresholds). Hub serves as the primary place members explore loyalty in depth and find answers to complex questions.

**Why It's Needed**: Complex tier qualification rules (rolling balance, autopay criteria, retrogression mechanics) require more detailed explanation than can fit in contextual surfaces. Hub provides a dedicated space where members can learn comprehensively without overwhelming core banking screens.

**How It Works**:

**Hub Main Screen Layout**:
- **Header Section**: Large tier badge showing member's current tier (e.g., "Plus Tier"), with color and icon for quick visual recognition
- **Benefit Summary Section**: 3–4 key benefits for member's current tier displayed as visual tiles, each showing:
  - Benefit name ("APY Boost" or "Fee Waiver")
  - Real-dollar value ("$25/year extra" personalized to member's actual balance)
  - Brief explanation ("You earn an extra 0.25% APY on savings accounts")
  - Icon representing benefit (dollar sign for cash value, shield for protection, etc.)
- **Progress Section** (if not Premium tier):
  - Progress bar showing distance to next tier with numeric label ("$8,500 of $10,000 balance required")
  - Estimated time to next tier based on member's current balance trends ("~60 days if you maintain current balance")
  - One key action needed to reach next tier ("Increase balance by $1,500" or "Add another autopay")
- **Account Status Section**: Member's specific qualification data
  - Current balance in qualified account(s), autopay status (e.g., "1 of 2 required autopays for Plus")
  - Days until next tier threshold ("50 days until you reach $10,000 balance requirement")
  - Retrogression risk indicator if applicable ("Your Plus tier is at risk: autopay expires in 25 days")
- **Action Section**: Contextually intelligent actions based on member's situation
  - If close to next tier: "Add $1,500 to reach Premium tier" (link to transfer/deposit flow)
  - If at risk of retrogression: "Confirm autopay to maintain Plus tier" (link to autopay setup)
  - Default: "View your tier details" (link to tier comparison page), "Learn about benefits" (link to benefits page), "Get help" (link to FAQ)
- **Quick Link Section**: "View all tiers," "FAQ & Help," "Benefit Details," "Account Status," "Contact Support"

**Tier Details Page**:
- Tab-based navigation showing all three tiers: Classic, Plus, Premium (member's current tier highlighted)
- For each tier tab:
  - **Summary**: Simple one-sentence summary ("Classic: $2,500 balance + 1 autopay")
  - **Detailed Rules**: Full explanation with examples:
    - Balance requirement explained with rolling balance calculation example
    - Autopay requirement explained with specific product counts and credit card limits
    - How long qualification takes (3-month rolling balance, effective date for changes)
  - **Benefits Breakdown**: Each benefit with real-dollar example:
    - "APY Boost: +0.25% on savings. Example: On a $10,000 balance, that's $25/year extra vs. lower tier."
    - "Fee Waiver: Waived transfer fees. Example: Save $2.50 per transfer."
    - "Third-Party Rewards: Access to [partner] rewards. Example: Earn 2X points on selected purchases."
  - **How to Qualify / Upgrade**: Specific steps to reach or maintain tier
  - **Grace Periods & Retrogression**: When/how tiers change if qualification lapses
- Visual elements: Icons for each benefit, clear typography, generous whitespace (not text-dense)
- Progressive disclosure: Main requirements visible; edge cases and advanced rules in expandable "Learn more" sections

**Account-Specific Detail Page**:
- Shows member's precise qualification data: current balance in each qualified account, autopay status (loan: yes/no; credit card: yes/no; count: X of Y), days until next tier threshold
- Predicted tier status: "If you maintain this balance, you'll reach Plus tier on March 15"
- Tier loss prediction: "Your Plus tier expires on April 30 unless you add another autopay or increase balance"
- Visual tier calculation: "Your tier = $8,500 balance + 1 loan autopay = Classic tier (need $2,500 + 1 autopay)"
- Clear, supportive tone; actionable next steps if member is at risk

**FAQ & Help Section**:
- Full-text search functionality for loyalty-related questions
- Category browse: Tier Qualification / Benefits / Retrogression / Legacy Migration / Troubleshooting
- 25–30 FAQ questions including:
  - "How is my tier calculated?"
  - "What's a rolling balance and how is it calculated?"
  - "What counts as an autopay for tier qualification?"
  - "What happens if I remove my autopay?"
  - "Can I have multiple autopays and qualify for multiple tiers?"
  - "What if my balance drops below the tier minimum?"
  - "Do I lose benefits immediately when I drop a tier?"
  - "How is APY boost calculated and applied?"
  - "Why did I move from the old program to the new one?" (legacy migration question)
  - "How do I re-qualify for a tier I lost?"
  - "Can I redeem third-party rewards directly from the app?"
  - "What if I don't understand my tier?"
- Visual explanations: Rolling balance calculation diagram, tier qualification flowchart, retrogression timeline
- Each FAQ answer uses plain language with concrete examples

**Accessibility Notes**:
- All text ≥16pt; headings ≥20pt; contrast ≥7:1
- Navigation tabs must be large (≥48×48px tap area) with clear visual focus state
- Benefit tiles must be visually distinct with icon + color + text
- Progress bar must include numeric labels, not just visual fill
- Expandable "Learn more" sections must have clear expand/collapse indicators
- Links and buttons ≥48×48px tap area with adequate spacing between

---

### 3.7 Tier Management (Qualification Display, Progression, Retrogression Prevention)

**What It Does**: The tier management system displays how members qualify for each tier, shows progression toward next tier with clear milestones, and proactively alerts members when they risk dropping tiers with supportive guidance to prevent retrogression.

**Why It's Needed**: Tier qualification is complex (rolling balance + autopay with product limits + retrogression mechanics). Members need transparent understanding of their qualification status, paths to advancement, and protection against surprise downgrading.

**How It Works**:

**Qualification Display**:
- Hub shows member's current tier with clear, accurate summary of qualification criteria
- Tier comparison page shows all three tiers side-by-side: who qualifies, what each requires, how they differ
- Account-specific page shows member's precise status against each tier's requirements (e.g., "$8,500 of $10,000 balance for Plus")
- All displays use consistent terminology ("rolling balance," "autopay," "tier," "qualified account") across all channels

**Progression Display**:
- Progress bar shows distance to next tier with numeric labels (not visual fill only)
- Estimated timeline: "Based on current balance trends, you'll reach Plus tier in 60 days"
- Contextually intelligent messaging:
  - If far from next tier (Classic member with $2,500 balance, Classic requires $2,500, Plus requires $10,000): show small intermediate milestone ("$5,000 balance milestone" without implying tier change)
  - If close to next tier (Classic member with $9,500 balance): emphasize momentum ("You're $500 away from Plus tier! Maintain this balance and you'll reach it by March 31")
- One clear action to advance: "Add $1,500 to reach Premium tier" with direct link to transfer/deposit flow
- No pressure or artificial urgency; supportive tone

**Retrogression Prevention**:
- Notification system triggers when member approaches tier-loss threshold:
  - **30-day warning**: Balance drops within $500 of tier minimum; autopay has 30 days until expiration
  - **14-day warning**: Urgent threshold; balance within $250 of loss
  - **Final reminder**: Autopay expires today
- Alert messaging uses supportive, non-alarming language:
  - "To maintain Plus tier, keep your balance above $10,000. Your current balance is $10,500, so you're in good shape."
  - "Your loan autopay is scheduled to end March 31. To maintain Plus tier, you'll need another autopay or higher balance. Here's how:" (actionable link)
- Grace period communication: If qualification lapses, clearly explain any grace period ("You have 30 days to restore Plus tier qualification; status changes on April 30")
- Recovery path offered: "You dropped to Classic tier. Here's how to re-qualify for Plus: add $3,500 to your balance" (direct link to transfer/deposit)
- Tone throughout: supportive, empathetic, solutions-focused. "We want to help you stay in Plus tier" not "You're losing your status"

---

### 3.8 Legacy Program Migration Flow

**What It Does**: Members migrating from the old loyalty program ($500 minimum balance) to the new program (three-tier structure with $2,500+ minimums) receive a dedicated onboarding experience explaining why the program changed, what their new tier is, and how their benefits are improving.

**Why It's Needed**: Higher tier thresholds ($500 → $2,500+) can feel like a downgrade despite better overall benefits. Dedicated migration flow addresses this perception explicitly, celebrating members who qualify for higher tiers and assuring those with lower thresholds.

**How It Works**:

**Migration Messaging** (delivered 1 week before launch):
- Personalized email or in-app message: "Your new tier is [X], based on your current balance and autopay setup"
- Explanation: "We improved our loyalty program to give you better benefits"
- Comparison table: Old program tier vs. new program tier; old benefits vs. new benefits
  - Example: "Old program: $25/year cash back → New program: Plus tier with +0.25% APY ($25/year on $10K balance) + fee waiver ($100+/year) + third-party rewards"
- Celebratory messaging if member qualifies for Plus/Premium: "Great news! You qualify for Plus tier, which gives you [specific benefits] worth $X/year"
- Reassurance if member qualifies for Classic: "You qualify for Classic tier with [benefits]. It's easier to qualify for Plus if you increase your balance by $7,500 or add autopay. Here's how:"

**First-Login Onboarding** (after launch):
- Loyalty Hub displays "What's New" badge
- Optional onboarding modal (can be skipped, not forced):
  - "Welcome to Improved Loyalty Benefits"
  - Brief explanation: "We redesigned loyalty to give you more control and better benefits. Here's what changed:"
  - Visual summary of old vs. new (tier count, benefit examples)
  - "Your new tier is [X]. See what you can do with it:" (link to Hub or tier details page)
  - "Show me more" (link to full FAQ about legacy migration) and "Explore on my own" (dismiss)

**Legacy-Specific FAQ Section** (in Hub FAQ):
- "Why did the program change?"
- "Why are the tier thresholds higher?"
- "How did my benefits change?"
- "Am I losing any benefits I had before?"
- "What if I don't qualify for my old tier level?"
- "Can I go back to the old program?"
- Visual comparison chart showing tier-by-tier benefit changes

**Tone**: Transparent, celebratory for Plus/Premium qualifiers, reassuring for Classic qualifiers. Emphasize improvements, not increases in requirements.

---

### 3.9 Benefit Value Calculator / Display

**What It Does**: The system automatically calculates and displays the real-dollar value of each member's loyalty benefits based on their actual account balances and products. For example: "Your Plus tier saves you $80/year based on your current accounts: $25/year APY boost + $55/year fee waivers" instead of abstract "APY boost" or "fee waiver."

**Why It's Needed**: Members, especially older demographics, care about tangible financial impact. Real-dollar values ("$80/year") drive perceived value and adoption far better than abstract benefits ("fee waiver"). Personalized calculations show members what their *specific* tier is worth to them.

**How It Works**:

**Benefit Calculation Engine**:
- Specification for calculating real-dollar value of each benefit:
  - **APY Boost**: Compare member's current APY (Classic tier) vs. their tier's APY; calculate annual dollars on their actual balance (e.g., "+0.25% on $10,000 = $25/year")
  - **Fee Waiver**: Count likely transfers/month for member's account type; multiply by fee waived (e.g., "2 transfers/month × $2.50 fee × 12 months = $60/year")
  - **Third-Party Rewards**: Integrate with third-party provider to calculate member's earned rewards value (e.g., "$15/year based on your typical spending category distribution")
- Calculations update dynamically as member's balances change
- All calculations show member-specific context: "Based on your current $10,000 balance" or "Based on your estimated 2 transfers/month"

**Display Strategy**:
- Hub benefit tiles show: benefit name + real-dollar annual value + brief context
  - "APY Boost: +$25/year (based on your $10,000 balance)"
  - "Fee Waiver: +$60/year (estimated, based on your transfer patterns)"
  - "Third-Party Rewards: +$15/year (based on your purchase history)"
- Annual benefit summary: "Your Plus tier gives you $100/year in total benefits"
- Comparison view: "If you upgraded to Premium tier and maintained $25,000, you'd earn $180/year in benefits"
- Contextual display in account summary: Savings account shows "Plus tier: +$25/year APY"; fee-bearing account shows "Plus tier: ~$60/year in fee waivers"
- Legacy migration message includes benefit comparison with real-dollar values showing improvement

**Accessibility Notes**:
- Dollar amounts must be large, high-contrast text (≥18pt, 7:1 contrast)
- Calculations must include clear context ("based on your current balance of $10,000")
- Estimates must be labeled as such ("estimated" or "based on your history")
- Visual representation (dollar sign icon, green color for value) must supplement text

---

### 3.10 Self-Service FAQ / Help for Loyalty

**What It Does**: A comprehensive FAQ and help section in Loyalty Hub provides searchable, categorized answers to 25–30 anticipated loyalty-related questions, covering tier qualification, benefits, retrogression, legacy migration, and troubleshooting. All questions anticipated to drive customer support calls are answered in clear, plain language with examples.

**Why It's Needed**: Project success metric requires "minimize day-2 support calls." FAQ designed and tested *before* launch (not after) can reduce support volume 60–80%. If FAQ answers 80% of incoming support questions, support volume decreases 80% (4:1 improvement in efficiency).

**How It Works**:

**FAQ Structure**:
- **Search Functionality**: Full-text search allowing members to find answers by keyword ("rolling balance," "autopay," "retrogression," "benefits," "tier," etc.)
- **Category Browse**: Organized by topic:
  - Tier Qualification (8–10 questions)
  - Benefits & Value (5–7 questions)
  - Retrogression & Tier Loss (5–7 questions)
  - Legacy Program Migration (3–5 questions)
  - General Troubleshooting (2–4 questions)
- **Accessibility**: All answers in plain language (no jargon without explanation); visual explanations (diagrams, examples, flowcharts) supplement text

**Anticipated FAQ Questions** (Sample, 25–30 total):

*Tier Qualification*:
1. "How is my tier calculated?"
2. "What's a rolling balance and how is it calculated?"
3. "What counts as an autopay for tier qualification?"
4. "Can I have multiple autopays and qualify for multiple tiers?"
5. "What products count toward tier qualification (checking, savings, money market)?"
6. "How long does it take for my tier to change after I meet the requirements?"
7. "What if my balance is exactly the minimum (e.g., $2,500)?"
8. "Can I have both a loan and credit card autopay for the same tier?"
9. "Do I need to be the sole account holder or can I be a joint owner?"

*Benefits & Value*:
10. "What benefits do I get with my current tier?"
11. "How is the APY boost calculated and applied?"
12. "When do fee waivers take effect?"
13. "How do I access third-party rewards?"
14. "What if I don't use all the benefits?"
15. "Can benefits be redeemed for cash?"
16. "How much is my tier worth in real dollars?"
17. "Do all accounts get all benefits or just qualified accounts?"

*Retrogression & Tier Loss*:
18. "What happens if I drop below the tier minimum?"
19. "Can I lose my tier even if I'm not trying to?"
20. "What if I remove my autopay?"
21. "How long do I have to restore my tier?"
22. "Will I lose my benefits immediately if my tier changes?"
23. "How do I re-qualify for a tier I lost?"
24. "What if I'm about to lose my tier but I don't want to?"
25. "Do I get a warning before my tier changes?"

*Legacy Migration*:
26. "Why did the program change?"
27. "Why are the tier thresholds higher than before?"
28. "How did my benefits change?"
29. "Can I go back to the old program?"
30. "What if I don't qualify for my old tier?"

**Visual Explanations**:
- Rolling balance calculation diagram: "Average of balance on last day of each of past 3 months" with example (Oct 31: $2,600, Nov 30: $2,500, Dec 31: $2,400; average = $2,500)
- Tier qualification flowchart: "Do you have $2,500+ balance?" → "Do you have 1+ autopay?" → "You qualify for Classic"
- Retrogression timeline: "March 1–31: Balance drops below $2,500 → April 1: Tier changes to lower level → April 1–30: Grace period to restore → May 1: Status is official"
- Benefit comparison table: Old program vs. new program, tier-by-tier

**Integration Strategy**:
- FAQ accessible from:
  - Hub main screen: "Get Help" quick link
  - Hub navigation: dedicated "FAQ" section
  - Every disclosure point: "Learn more" inline links point to relevant FAQ items
  - Contextual help: tooltips reference FAQ for deeper understanding
- Searchable from any screen in Hub; search results link directly to relevant answer
- Mobile-optimized: FAQ accessible on app and web with same search/browse capability

---

## 4. SCREEN MAP & KEY FLOWS

### 4.1 Screen Inventory

**Navigation & Primary Destinations**:
1. **Home / Dashboard** — Updated account summary with tier badges and progress bars
2. **Loyalty Hub Main** — Primary loyalty destination with tier badge, benefit summary, progress to next tier, account status, contextual actions
3. **Tier Details Page** — Tab-based view of Classic, Plus, Premium tiers with full qualification rules, benefits, and how to advance
4. **Account Status Detail** — Member-specific tier calculation showing balance, autopay status, days until thresholds, predicted tier status
5. **Benefit Details Page** — Deep dive into each benefit type (APY boost, fee waiver, third-party rewards) with examples and calculations
6. **FAQ & Search** — Searchable FAQ section with category browse, 25–30 questions, visual explanations, links to help articles
7. **Help / Support** — Access to customer support (phone, chat, email) with loyalty-specific support queue

**Banking Integration Screens**:
8. **Account Detail** — Standard account detail screen with added tier benefit context (showing relevant benefits for account type)
9. **Transaction Detail** — Standard transaction detail with added benefit context (showing relevant tier benefits for this transaction)
10. **Transfer / Move Money Initiation** — Standard transfer flow with fee waiver benefit display before confirmation
11. **Transfer Confirmation** — Updated with fee waiver callout showing savings from tier
12. **Autopay Management List** — Standard autopay list with added tier contribution info for each autopay
13. **Autopay Add/Edit Flow** — Autopay setup with tier impact messaging (e.g., "This moves you toward Plus tier")
14. **Autopay Removal Confirmation** — Warning about tier impact if applicable (e.g., "Removing this autopay drops you to Classic")

**Onboarding & Communication Screens**:
15. **Legacy Migration Onboarding** — First-login modal explaining program change, new tier assignment, benefit comparison
16. **Retrogression Alert / Notification** — In-app banner or modal warning of tier loss risk with actionable recovery steps
17. **Notification Settings** — Controls for loyalty notification frequency, types, and channels

### 4.2 Detailed User Flows

---

#### **Flow 1: Everyday Banking Flow (Account Summary → Transactions → Move Money)**

**Persona**: PERSONA-01 (Change-Averse Everyday Banker) primarily, but applicable to all

**Journey Stage**: Daily Banking (from experience strategy)

**Objective**: Complete familiar banking task (check balance, move money) with *zero added friction* from loyalty integration

**Flow Steps**:

1. **Home / Dashboard** (updated)
   - User lands on home screen (unchanged layout, same structure as before)
   - Accounts section displays checking and savings accounts
   - *New element*: Tier badge on account card (small, non-intrusive) showing "Plus Tier" with relevant benefit ("Plus tier: +0.25% APY")
   - *New element*: Progress bar (only on qualified account, only if not Premium) showing "$8,500 of $10,000" with numeric label
   - Standard actions available: View account, Transfer, Pay bill (unchanged)
   - **User choice**:
     - *Standard path* (not interested in loyalty): Tap "View account" or "Transfer" directly → proceeds to step 2 (unchanged)
     - *Optional loyalty exploration*: Tap tier badge or progress bar → navigates to Loyalty Hub (different flow) (step 2-alt)

2. **Standard Path — Account Detail** (unchanged core, new optional elements)
   - User views account details: balance, recent transactions, account info
   - Layout completely unchanged from previous version
   - *Optional element*: Tier benefit callout visible but not required to interact with ("This account gets +0.25% APY with your Plus tier")
   - User scrolls to recent transactions
   - **User choice**:
     - *Standard path*: Taps "Transfer" or specific transaction
     - *Loyalty exploration*: Taps tier callout → explores benefit detail (different flow)

3. **Transaction Detail** (if user tapped transaction)
   - User views transaction: amount, date, description, account
   - *Optional element* (if benefit-relevant): Benefit context section shows "You qualified for [benefit] on this transaction: [savings amount]"
   - User returns to account or dismisses
   - **User choice**:
     - *Standard path*: Back to account detail or home
     - *Loyalty exploration*: Taps "Learn more" link in benefit context → navigates to Loyalty Hub benefits page

4. **Transfer / Move Money** (if user tapped Transfer)
   - User initiates transfer: from account, to account, amount
   - Existing transfer flow unchanged (same steps, same layout)
   - **Transfer confirmation**:
     - *New element*: Fee waiver callout visible (if tier qualifies for fee-free transfers)
     - Example: "Your Plus tier gives you fee-free transfers. This transfer would cost $2.50, but you pay $0."
     - Standard confirm/cancel buttons
   - **Accessibility note**: Fee waiver callout is informational, not a required interaction; user can proceed with transfer without engaging with loyalty info
   - User confirms transfer → completed
   - *Optional*: Post-confirmation message: "You saved $2.50 with your Plus tier" (celebratory, not required to view)

5. **Return to Home**
   - Transfer complete; user returns to home or account detail
   - Balance updated; loyalty information remains non-intrusive

**Accessibility Checkpoints**:
- Core banking flow (steps 1, 4, 5) requires zero additional clicks or cognitive load
- Tier badge, progress bar, and benefit callouts are *optional* interactions; core tasks don't require engaging with them
- All new UI elements meet accessibility baseline: text ≥16pt, contrast ≥7:1, tap targets ≥48×48px
- Member can complete entire flow without once noticing loyalty elements (for PERSONA-01 who's not interested)

**Metric**: Zero regression in task completion time for this flow compared to pre-loyalty baseline

---

#### **Flow 2: Loyalty Hub Exploration Flow (Initial Discovery)**

**Persona**: PERSONA-02 (Financially Savvy Benefit Optimizer) and PERSONA-04 (Loyalty Skeptic) primarily

**Journey Stage**: Loyalty Exploration & Learning (from experience strategy)

**Objective**: Discover loyalty program, understand tier structure and member's specific status, explore benefits, validate program authenticity

**Flow Steps**:

1. **Entry Point** (multiple possible entry points):
   - *From account summary*: User taps tier badge or progress bar → navigates to Loyalty Hub main
   - *From main navigation*: User taps "Loyalty" or "Benefits" button in main nav → navigates to Loyalty Hub main
   - *From in-app notification*: User receives "You've reached Plus tier" notification → taps → navigates to Loyalty Hub main
   - *Direct search*: User searches "benefits" or "loyalty" → search results link to Loyalty Hub main

2. **Loyalty Hub Main Screen**
   - User sees clear tier badge: "You're a Plus Member"
   - Benefit summary tiles show: "APY Boost: +$25/year," "Fee Waiver: +$60/year," "Third-Party Rewards: +$15/year"
   - Progress section shows: "$8,500 of $10,000 balance required for Premium" with progress bar and "~60 days to Premium tier" estimate
   - Account status shows: current balance, autopay status (1 of 2 required for Plus)
   - Contextual actions: "Add $1,500 to reach Premium tier" or "View your tier details" or "Get help"
   - Quick links: "View all tiers," "FAQ," "Benefit details," "Account status"
   - **User choice**:
     - *Benefit optimizer path*: Taps "View all tiers" (step 3) → compares tier-by-tier
     - *Benefit explorer path*: Taps benefit tile (step 4) → explores specific benefit in depth
     - *Skeptic path*: Taps "FAQ" (step 5) → searches for transparency/verification questions
     - *Status optimizer path*: Taps "View your tier details" (step 3) or "Account status" → explores path to Premium tier

3. **Tier Details Page** (if user tapped "View all tiers")
   - Tabs show Classic, Plus, Premium tiers (Plus highlighted as member's current tier)
   - **Plus tab (member's current tier)**:
     - Summary: "Plus: $10,000 rolling balance + 2 autopays (only 1 credit card)"
     - Detailed rules with examples: "Rolling balance is calculated as the average of your balance on the last day of each of the past 3 months. For example: Oct 31: $10,500, Nov 30: $9,800, Dec 31: $10,200; average = $10,167, so you qualify."
     - Benefits with real-dollar values: "APY Boost: +0.25% ($25/year on $10K balance)," "Fee Waiver: (~$60/year based on transfer patterns)," "Third-Party Rewards: (pending partner integration)"
     - How to upgrade to Premium: "You need $25,000 balance or [alternative criteria if available]"
     - Grace period info: "If you drop below $10,000, you have 30 days to restore Plus before tier officially changes"
   - **Classic tab**:
     - Comparison to Plus: higher or lower requirements and benefits visible
   - **Premium tab**:
     - Higher requirements and benefits (aspirational if member isn't Premium yet)
   - Expandable "Learn more" sections for advanced questions
   - **User choice**:
     - *Optimizer*: Now understands tier structure; may proceed to step 4 (benefit details) or step 5 (FAQ for edge cases)
     - *Status optimizer*: Calculates path to Premium (e.g., "I need $15,000 more balance"; decides to return to account detail or step back)

4. **Benefit Details Page** (if user tapped specific benefit tile)
   - Benefit name: e.g., "APY Boost"
   - How benefit works: "+0.25% APY on savings accounts for Plus members"
   - Real-dollar value: "$25/year on your $10,000 balance" (personalized calculation)
   - Detailed explanation: "APY (Annual Percentage Yield) is the interest rate your account earns. A higher APY means you earn more money on your balance over time. With Plus tier, you earn 0.25% more per year than Classic tier members."
   - Comparison scenarios: "If you had a $15,000 balance, you'd earn $37.50/year. If you reach Premium tier with a $25,000 balance, you'd earn [higher amount]."
   - How benefit is applied: "APY boost is automatically applied to your savings accounts; no action required"
   - Link to relevant FAQ questions: "How is APY boost calculated?" (link to FAQ section)
   - **User choice**:
     - *Optimizer*: Repeats for other benefits (fee waiver, third-party rewards) to understand full benefit package
     - *Status optimizer*: Calculates total potential benefit at Premium tier; might decide to target Premium tier
     - *Skeptic*: Examines calculations for transparency; if satisfied, confidence increases in program authenticity

5. **FAQ & Search** (if user tapped "FAQ" or "Get help")
   - Search box at top: "Search loyalty questions..."
   - Category browse below: Tier Qualification, Benefits, Retrogression, Legacy Migration, Troubleshooting
   - **Skeptic path**: Searches for "hidden catches," "fees," "manipulation," "fine print" → finds transparent answers explaining all rules clearly → confidence increases
   - **Optimizer path**: Searches for edge cases ("can I have multiple autopays?", "what if my balance is exactly $10,000?") → finds detailed answers with examples
   - **Confused path**: Searches for simple explanations ("what is a rolling balance?", "do I lose benefits if my tier drops?") → finds visual explanations and plain language answers
   - **User choice**:
     - *Satisfied*: Understands program rules and benefits; exits Hub with positive impression
     - *Uncertain*: Continues exploring (more FAQ questions, contact support link visible)
     - *Ready to act*: Proceeding to step 3 (tier comparison) to decide on tier optimization

6. **Return to Home / Banking**
   - User exits Loyalty Hub with fuller understanding of program
   - May have decided to take action (e.g., "I'll increase my balance to reach Premium") → goes to transfer/deposit flow
   - May have decided no action needed → returns to regular banking

**Accessibility Checkpoints**:
- Hub main screen scannable in <30 seconds (large text, visual cues, clear hierarchy)
- Tier tabs, benefit tiles, FAQ search all keyboard-navigable and touch-accessible
- All text ≥16pt, contrast ≥7:1, tap targets ≥48×48px
- Visual explanations (diagrams, example calculations) supplement text for accessibility

**Success Metrics**:
- PERSONA-02: Accurately explains tier qualification rules and calculates personal benefit value; makes decision to optimize toward Premium tier
- PERSONA-04: Verifies program rules are transparent and non-manipulative; either adopts program or acknowledges it's fair even if not maximizing
- PERSONA-03: Understands own tier and top benefits; expresses confidence in program fairness

---

#### **Flow 3: Tier Qualification Understanding Flow (Complex Rules Mastery)**

**Persona**: PERSONA-02 (Financially Savvy), supporting PERSONA-03 (Confused) with guided help

**Journey Stage**: Loyalty Mastery & Optimization (from experience strategy)

**Objective**: Deeply understand complex tier qualification rules (rolling balance, autopay requirements, retrogression mechanics, edge cases)

**Flow Steps**:

1. **Entry Point**: User accesses Tier Details page (Flow 2, Step 3) or searches FAQ with specific question

2. **Tier Details — Deep Dive**
   - User reads summary and detailed rules with examples for their current tier
   - *Rolling balance example*: "Your 3-month rolling balance is calculated as: (balance on Sept 30 + balance on Oct 31 + balance on Nov 30) ÷ 3. For example: ($2,400 + $2,600 + $2,500) ÷ 3 = $2,500. This qualifies for Classic tier."
   - *Autopay requirement*: "Plus tier requires 2 autopays. Loans count toward all tiers. Credit cards count toward Classic (max 1), Plus (max 1), and Premium (max 1). So you could have 1 loan + 1 credit card autopay = 2 items qualifying for Plus tier."
   - *Edge case*: Expandable section: "What if I have 3 credit cards on autopay? Only 1 counts toward Plus tier; the other 2 would count toward higher tiers only or not at all."

3. **Account Status Detail** (if user taps "View your tier details" or "Account status")
   - Personalized calculation shows: "Your tier = $8,500 balance + 1 loan autopay + 1 credit card autopay = Plus tier (qualifies: $8,500 ≥ $10,000? No. 2 autopays ≥ 2? Yes. Rolling balance still needs $1,500 increase)"
   - *Progression path*: "To reach Premium tier, you need: $25,000 balance (currently $8,500, need $16,500 more) OR [alternative criteria]. Timeline: if you add $500/month, you'd reach $25,000 in 33 months. OR if you maintained $10,000 and added [specific product], you might qualify for Premium under [alternative criteria]."
   - Days until next tier threshold: "You're 50 days away from completing a 3-month rolling balance cycle. On December 31, your rolling balance will include this month's ending balance; if you maintain $10,000+, you'll officially reach Premium tier on January 1."

4. **FAQ Deep Dive** (if user searches for specific edge cases)
   - "Can I have multiple autopays and qualify for multiple tiers?" → Detailed answer explaining autopay counting rules with examples
   - "What if my balance is exactly $10,000?" → Answer explains rolling balance averaging and what happens at exact threshold
   - "What if I pay off my loan? Will I lose my tier?" → Answer explains retrogression risk; links to retrogression prevention flow

5. **Contextual Understanding Achieved**
   - User now understands:
     - Exactly how their tier is calculated
     - What actions would advance them to next tier
     - What actions would cause them to drop tiers
     - Timeline for any changes
   - User can make informed decisions about balance/autopay optimization

**Accessibility Checkpoints**:
- Plain language explanation of complex concepts (rolling balance, autopay counting)
- Visual diagram showing rolling balance calculation
- Example calculations using member's actual data
- Progressive disclosure: simple summary visible; complex details in expandable sections
- All navigation keyboard-accessible and touch-friendly

**Success Metrics**:
- User accurately explains their tier calculation (e.g., "I have $8,500 balance + 2 autopays = Plus tier")
- User identifies path to next tier (e.g., "I need $16,500 more balance to reach Premium")
- User avoids unintended retrogression (e.g., doesn't pay off loan without understanding tier impact)

---

#### **Flow 4: Retrogression Prevention Flow (Proactive Alert → Recovery)**

**Persona**: All personas, but particularly affects PERSONA-01 and PERSONA-03

**Journey Stage**: At-Risk Retention & Recovery (from experience strategy)

**Objective**: Alert member to tier loss risk proactively; offer supportive guidance to prevent or recover from retrogression

**Flow Steps**:

1. **Retrogression Risk Triggered** (backend system detects threshold approach)
   - Balance drops to $2,700 (within $500 of Classic tier minimum $2,500)
   - OR autopay is scheduled to expire in 30 days
   - OR other threshold metric indicates tier loss risk

2. **Proactive Notification Sent** (multi-channel: in-app + email + SMS possible)
   - **In-app banner** (appears on home screen, non-intrusive but visible):
     - "To maintain Plus tier, keep your balance above $10,000. Your current balance is $2,700, so you're getting close to the minimum. You have [30 days] to increase your balance or add another autopay."
     - Green checkmark icon (supportive, not alarming; "help you maintain")
     - Two action buttons: "Add funds" (link to transfer/deposit) or "Dismiss" (or "Learn more")
   - **Email** (if member has email notifications enabled):
     - Subject: "We'd love to help you keep your Plus tier benefits"
     - "Your Plus tier balance requirement is $10,000. Your current balance is $2,700. You have 30 days before your tier status changes. Here's how to maintain Plus tier: [specific actions] Here's a quick link to transfer funds or set up autopay."
   - **SMS** (optional, only if member enabled SMS alerts):
     - "Your Plus tier needs $10,000 balance (currently $2,700). Add funds: [link] Questions: [FAQ link]"

3. **Member Views Notification** (in-app banner path)
   - Member reads: "To maintain Plus tier, keep balance above $10,000. Your current: $2,700. Time left: 30 days."
   - Tone: supportive, non-alarming, clear timeline, specific requirement
   - **Member choice**:
     - *Recovery path 1*: Taps "Add funds" → navigates to transfer/deposit flow (step 4a)
     - *Recovery path 2*: Taps "Learn more" → navigates to FAQ section explaining retrogression rules and recovery (step 4b)
     - *Dismiss*: Taps "Dismiss" or "X" → banner closes; will reappear as threshold gets closer (14 days, 1 day before final deadline)

4a. **Recovery Path 1 — Immediate Action (Transfer/Deposit)**
   - Transfer/deposit flow initiates (unchanged from standard flow, step 1 of Everyday Banking Flow)
   - **Smart default**: System suggests target amount to restore tier: "Transfer $7,300 to reach $10,000 balance and maintain Plus tier"
   - User enters amount and proceeds through transfer flow
   - **Confirmation screen**: "You'll reach $10,000 balance and maintain your Plus tier. Your Plus tier benefits will continue with no interruption."
   - **Post-transfer success message**: "Great! You've maintained your Plus tier. Your benefits are secure." (celebratory)

4b. **Recovery Path 2 — Understanding & Learning (FAQ)**
   - FAQ search for "retrogression" or user taps "Learn more" link
   - **FAQ section**: "What happens if my balance drops below the tier minimum?"
   - Answer: "If your balance drops below the tier minimum, you have a 30-day grace period to restore it before your tier officially changes. During the grace period, you keep all your Plus tier benefits. After 30 days, if your balance is still below the minimum, your tier automatically drops to the next lower tier."
   - **Visual timeline**: "Balance drops below minimum → 30-day grace period → Day 30: tier changes (if not restored) → You can still re-qualify for Plus by reaching the balance again"
   - **Next steps link**: Links to transfer/deposit flow or tier details page to understand path to recover tier

5. **Retrogression Occurs** (if member doesn't take action before deadline)
   - 30-day grace period expires
   - Member's tier officially drops from Plus to Classic
   - **Empathetic notification**:
     - In-app banner: "Your tier changed to Classic. We miss your Plus tier benefits! Here's how to get back to Plus: [specific action]. We're here to help:" (link to transfer/deposit or contact support)
     - Email: "We noticed your tier changed to Classic. It's not too late—here's how to get back to Plus: [specific action]. You earned [$ amount] in benefits while you were a Plus member—don't lose that."
   - **Recovery messaging**: Empathetic, solutions-focused, celebratory of past achievement
   - Links to tier details page or transfer flow to enable recovery

6. **Recovery After Tier Loss**
   - If member takes action after tier drops, re-qualification triggers
   - **Success notification**: "Great! You've re-qualified for Plus tier. Your Plus tier benefits are restored, effective [date]."

**Accessibility Checkpoints**:
- Notifications use icon + color + text (not color alone) to indicate urgency
- Threshold amounts and timelines displayed in large, high-contrast text
- Action links (transfer, FAQ, contact support) are large tap targets ≥48×48px
- Tone in all messaging is supportive, not alarming; prevents anxiety for PERSONA-01 and PERSONA-03

**Success Metrics**:
- *Prevention*: % of members receiving proactive alert who successfully restore tier before deadline (target: ≥80%)
- *Retention*: Attrition rate for members at risk of tier loss; compare members receiving proactive support vs. without
- *Emotional impact*: Member satisfaction survey asking about tone and helpfulness of retrogression messaging (target: CSAT ≥4/5)

---

#### **Flow 5: Legacy Migration / Onboarding Flow**

**Persona**: All personas, but particularly affects PERSONA-01 and PERSONA-03 who may feel concerned about program changes

**Journey Stage**: Program Transition & Change Management (from experience strategy)

**Objective**: Explain program change, show new tier assignment, demonstrate benefit improvements, build confidence in new program

**Flow Steps**:

1. **Pre-Launch Communication** (2–3 weeks before launch, via email, in-app message, SMS)
   - **Email subject**: "Exciting news: Your loyalty benefits are improving!"
   - **Content**:
     - "We're launching an improved loyalty program to reward you for being a valued member. The new program has three tiers (Classic, Plus, Premium) with better benefits than our previous program."
     - "Here's what's new: [brief tier structure overview]"
     - "What happens to your benefits? [comparison of old vs. new]"
     - "Questions? Check out our new Loyalty Hub: [link]"
   - **In-app message** (optional, appears on home screen):
     - "Loyalty program improvements coming soon! See what's new: [link to FAQ]"

2. **Transition Communication** (1 week before launch, personalized)
   - **Email subject**: "Your new loyalty tier is [X] — Here's what that means for you"
   - **Content**:
     - "Based on your current balance and autopay setup, you qualify for **[Tier] tier** in our new loyalty program, launching [date]."
     - **For Plus/Premium qualifiers (celebratory)**:
       - "Great news! You qualify for Plus tier, which gives you [specific benefits] worth approximately $[X]/year based on your current accounts."
       - "Your new tier has more benefits than our old program. Here's how your benefits are changing:"
       - Comparison table: "Old program benefit → New Plus tier benefit"
       - Example: "Old: $25/year cash back → New: $25/year APY boost + $60/year fee waiver + third-party rewards"
       - "You're not losing any benefits; you're gaining more!"
     - **For Classic qualifiers (reassuring)**:
       - "You qualify for Classic tier in our new program. While the balance requirement is higher ($2,500 vs. $500 in the old program), you get better benefits."
       - "If you'd like to reach Plus tier (and earn more benefits), here's what you'd need: [specific balance/autopay target]"
       - "Questions? Check our FAQ: [link]"
   - **SMS** (brief version if enabled):
     - "Your new loyalty tier is [X], effective [date]. See all benefits: [Hub link]"

3. **First-Login Onboarding** (after launch, optional modal)
   - User logs in after program launch date
   - **Optional onboarding modal** (can be dismissed, not forced):
     - **Title**: "Welcome to Improved Loyalty Benefits"
     - **Body**: "We redesigned our loyalty program to give you more value. Here's what changed:"
     - Visual summary: "Now you have 3 tiers (Classic, Plus, Premium) instead of 1 tier. Each tier has better benefits."
     - "Your new tier is **[X]** effective [date]."
     - Buttons: "See my tier & benefits" (link to Loyalty Hub) | "Explore on my own" (dismiss)
   - User can explore Hub or dismiss and return to banking

4. **Legacy FAQ Section** (in Loyalty Hub FAQ)
   - **Questions** (5–7 legacy-specific questions):
     - "Why did the program change?" → Explanation of improvement strategy
     - "Why are the tier thresholds higher?" → Explanation: higher tiers = better benefits, but easier to reach Classic tier
     - "How did my benefits change?" → Tier-by-tier benefit comparison (old vs. new)
     - "Am I losing any benefits?" → Clear answer about preserved benefits and improvements
     - "What if I don't qualify for my old tier level?" → Reassurance about path to higher tier or equivalent benefits in Classic
     - "Can I go back to the old program?" → Clear answer about permanent transition
     - "Why should I care about the new program?" → Real-dollar benefit explanation
   - **Visual comparison chart**: Old program tiers/benefits vs. new program tiers/benefits side-by-side

5. **Onboarding Complete**
   - User understands program change, new tier assignment, benefits comparison
   - User is confident in fairness and improvement of new program
   - Plus/Premium qualifiers feel celebrated; Classic qualifiers feel reassured

**Accessibility Checkpoints**:
- All messaging in plain language; financial terms defined
- Comparison tables use clear labeling (old vs. new, benefit-by-benefit)
- Modal can be dismissed without penalty; not intrusive
- Links to FAQ and Hub are easily discoverable

**Success Metrics**:
- *Adoption*: % of legacy members who explore Loyalty Hub within 30 days of launch (target: ≥70%)
- *Comprehension*: Member survey asking "Do you understand how the new program affects your benefits?" (target: ≥90% "yes")
- *Satisfaction*: CSAT for legacy members post-launch (target: ≥4/5)
- *Support impact*: Reduction in legacy-specific support calls (target: ≤10% of total support volume by day 30)

---

#### **Flow 6: Autopay Setup for Tier Qualification Flow**

**Persona**: PERSONA-02 (Benefit Optimizer) primarily; PERSONA-03 (Overwhelmed) with guided help

**Journey Stage**: Product Engagement & Tier Optimization (from experience strategy)

**Objective**: Set up autopay while understanding how it contributes to tier qualification; make informed decision about which product to autopay

**Flow Steps**:

1. **Entry Point**:
   - User navigates to Autopay setup from: Loyalty Hub (action: "Add another autopay"), account detail (standard autopay setup), or notification (contextual nudge: "Add autopay to reach Plus tier")

2. **Autopay Setup Flow Initiated** (standard flow)
   - User selects account/loan to autopay: checking, savings, loan, credit card, etc.
   - Existing autopay setup steps: select payee, amount, frequency, start date (unchanged)

3. **Tier Impact Callout** (new element during setup)
   - **During product selection**:
     - User selects "Loan account" → callout appears: "Loans count toward all tiers (Classic, Plus, Premium)"
     - User selects "Credit card account" → callout appears: "Credit cards count toward Classic tier (max 1), Plus tier (max 1), and Premium tier (max 1). You currently have 0 credit card autopays, so you can add this."
   - **Tone**: Informational, not pressuring; helps member make informed decision
   - **For PERSONA-02**: Precise technical detail showing how autopay counts toward each tier
   - **For PERSONA-03**: Plain language with example ("Adding a credit card autopay moves you closer to Plus tier if you also have a loan autopay")

4. **Confirmation Screen** (with tier impact summary)
   - Standard confirmation: payee, amount, frequency, start date
   - *New element*: Tier impact summary
     - Example: "You currently have 1 loan autopay. Adding this credit card autopay gives you 2 total autopays, which qualifies you for Plus tier (if you maintain $10,000 balance)."
     - Links to Loyalty Hub: "Learn more about tier qualification" (for PERSONA-02 who wants details) or "What does Plus tier give me?" (for PERSONA-03 who wants context)

5. **Autopay Confirmed**
   - Success message: "Your autopay has been set up. [Your tier may update by [date] depending on other qualification criteria]"
   - *Celebratory if tier-advancing*: "Based on your balance and autopay setup, you now qualify for Plus tier! Your benefits take effect [date]." (link to Loyalty Hub to explore benefits)
   - *Informational if not tier-advancing yet*: "Your autopay is set up. You're on track toward Plus tier; you need to [specific action, e.g., increase balance by $1,500]." (link to transfer flow or Loyalty Hub)

**Accessibility Checkpoints**:
- Tier impact callouts explained in plain language with specific examples
- Autopay setup flow unchanged from standard (no additional friction)
- Tier information is supplementary; not required to complete setup
- All text ≥16pt, high contrast, large tap targets

**Success Metrics**:
- *Adoption*: % of members who set up autopay to advance tier (measurement: autopay additions correlated with tier advancement)
- *Clarity*: % of users who correctly state which tiers their new autopay counts toward (goal: ≥90% after completing flow)
- *Tier advancement*: % of members who reach target tier after autopay addition (goal: ≥85% within 30-60 days)

---

#### **Flow 7: Benefit Value Review Flow**

**Persona**: PERSONA-02 (Benefit Optimizer) primarily; all personas benefit from understanding real-dollar value

**Journey Stage**: Loyalty Engagement & Value Demonstration (from experience strategy)

**Objective**: Understand personalized benefit values; make decisions about tier optimization based on real-dollar impact

**Flow Steps**:

1. **Entry Point**:
   - User navigates to "Benefit Details" page from Loyalty Hub main
   - User searches for "how much do I save" or "benefit value" in FAQ
   - User receives notification: "You earned $2.50 in fee waivers this month with your Plus tier" (link to Hub benefit review)

2. **Benefit Details Page** (for specific benefit)
   - Benefit name: e.g., "APY Boost"
   - Benefit explanation: "+0.25% APY on savings accounts for Plus tier members"
   - **Personalized real-dollar value**: "Your benefit: +$25/year (calculated based on your current $10,000 savings balance)"
   - Detailed calculation breakdown: "How we calculated: Your savings balance is $10,000. Standard APY for savings is [X]%. Plus tier APY is [X+0.25]%. Difference: 0.25% × $10,000 = $25/year."
   - Scenario comparison: "If you had a $15,000 balance, you'd earn $37.50/year. If you reach Premium tier with $25,000 balance, you'd earn $62.50/year."
   - Change over time: "This year, your APY boost will earn you $25. Over 5 years, that's $125."

3. **Annual Benefit Summary** (optional page showing all benefits combined)
   - "Your Plus tier benefits: $100/year total"
   - Breakdown:
     - APY Boost: $25/year
     - Fee Waiver: $60/year (estimated, based on transfer frequency)
     - Third-Party Rewards: $15/year (estimated, based on spending category)
   - "This is a personalized calculation based on your account balances and usage patterns."
   - Comparison: "If you reach Premium tier and maintain $25,000 balance, your total benefits would be $200/year (estimated)."

4. **Benefit Optimizer Pathway** (for PERSONA-02)
   - User reviews all three tiers' benefit values to understand gap between tiers
   - Example: "Classic tier: $10/year total benefits; Plus tier: $100/year; Premium tier: $200/year"
   - User calculates ROI of optimization: "To reach Premium, I need $16,500 more balance. At 0.5% APY, that would cost me [interest foregone]. But I'd gain $100/year in extra benefits, so the break-even is [X years]."
   - User makes informed decision: "Worth it to reach Premium" or "Classic tier is sufficient for my needs"

5. **Benefit Understanding Complete**
   - User understands real-dollar value of their tier
   - User can make informed tier optimization decisions
   - User perceives tangible value in loyalty program (not abstract or marketing hype)

**Accessibility Checkpoints**:
- Real-dollar values prominently displayed (large, high-contrast text)
- Calculations include context ("based on your $10,000 balance")
- Estimates labeled clearly ("estimated based on your transfer history")
- Visual representation (dollar sign icons) supplements text
- Comparisons presented in clear format (table or side-by-side text)

**Success Metrics**:
- *Clarity*: % of users who correctly state their annual benefit value after reviewing flow (goal: ≥85%)
- *Optimization decisions*: % of users who make deliberate tier advancement decisions based on benefit value review (measurement: balance/autopay changes correlated with benefit review engagement)
- *Perceived value*: Member survey: "How valuable is your loyalty tier to you?" (target: mean ≥4/5, where 5 = "Very valuable")

---

## 5. COMPONENT INVENTORY

### 5.1 Navigation Components

| Component | Description | Accessibility Notes |
|-----------|-------------|-------------------|
| **Main Navigation - Loyalty Item** | "Loyalty" or "Benefits" as primary nav item in main navigation (mobile bottom nav or web sidebar) | Tap target ≥48×48px; clear label; visual indicator when active |
| **Loyalty Hub Breadcrumb** | Breadcrumb trail showing current location (e.g., "Loyalty > Tier Details > Plus") for users navigating within Hub | Clear visual separation; keyboard-navigable |
| **Tab Navigation - Tier Tabs** | Three tabs showing Classic, Plus, Premium tiers on Tier Details page | Large tab targets (≥48×48px); clear active state indicator; keyboard-navigable with arrow keys |
| **Accordion / Expandable Sections** | "Learn more" expandable sections within Hub pages for progressive disclosure | Clear expand/collapse indicator; keyboard-accessible (Enter to toggle); no more than 1–2 levels |
| **Search Navigation** | Full-text search input in FAQ section allowing keyword search across all questions | Search results linked directly to FAQ answers; keyboard-accessible with clear results display |
| **Contextual "Learn More" Links** | Inline links to relevant Loyalty Hub section from account summary, transaction details, autopay management, notifications | Text link or button format; ≥48×48px tap area; distinguishable from body text |
| **Back Navigation** | Back button/link to return to previous Hub page after exploring details | Maintains scroll position if possible; clear label "Back to Loyalty Hub" or similar |

### 5.2 Forms & Input Components

| Component | Description | Accessibility Notes |
|-----------|-------------|-------------------|
| **Transfer Amount Input** | Standard currency input for transfer/deposit flows with added fee waiver callout (not intrusive) | Input field ≥48×48px; label clearly associated; error states high-contrast |
| **Autopay Setup Form** | Standard autopay setup (select payee, amount, frequency) with added tier impact callout | Form inputs clearly labeled; tier impact context separate from form; no additional friction |
| **Notification Settings Toggles** | Checkboxes/toggles for controlling notification types, frequency, and channels | Toggles ≥48×48px; high-contrast when active/inactive; clear labels |
| **FAQ Search Input** | Text input for searching FAQ questions by keyword | Input ≥48px height; search suggestions appear below; results clearly displayed |
| **FAQ Category Filters** | Buttons/filters to browse FAQ by category (Tier Qualification, Benefits, Retrogression, Legacy, Troubleshooting) | Buttons ≥48×48px; clear active state; all categories visible or in accessible dropdown |

### 5.3 Data Display Components

| Component | Description | Accessibility Notes |
|-----------|-------------|-------------------|
| **Account Card** | Displays account name, balance, last transaction, tier badge, progress bar; clickable to view details | Card ≥120px height for touch; tier badge and progress bar visually distinct; all text ≥16pt |
| **Tier Badge** | Visual indicator showing tier name (Classic, Plus, Premium) with icon and color; appears on account cards and throughout Hub | Icon + color + text (not color alone); distinct colors for each tier (accessible color palette); ≥32×32px minimum |
| **Progress Bar** | Visual representation of distance to next tier with numeric label (e.g., "$8,500 of $10,000") | Bar ≥8px height; numeric labels in large text (≥14pt); high-contrast background; accessible color palette |
| **Benefit Tile** | Card displaying single benefit (APY Boost, Fee Waiver, etc.) with benefit name, icon, real-dollar value, brief description | Tile ≥120×120px; icon ≥32×32px; text ≥16pt; high contrast |
| **Account Status Badge** | Indicator showing member's current balance, autopay status, days until threshold (e.g., "1 of 2 autopays for Plus") | Icon + color + text; text ≥16pt; high contrast |
| **Fee Waiver Callout** | Information display showing fee waived (e.g., "Your Plus tier gives you fee-free transfers. Fee: $0") during transfer confirmation | Callout ≥80px height; prominent currency amount (≥18pt text); distinct from other UI elements; not intrusive |
| **Benefit Value Display** | Text showing real-dollar benefit value (e.g., "$25/year extra on your $10,000 balance") | Value ≥18pt text; high contrast; includes context ("based on your current balance"); grouped with benefit name |
| **Retrogression Risk Indicator** | Visual warning when balance/autopay approaching tier-loss threshold (e.g., "Orange warning icon + text") | Icon + color + text (not color alone); ≥32×32px icon; text ≥14pt; non-alarming tone |
| **Comparison Table** | Side-by-side table showing tier-by-tier requirements and benefits; also old vs. new program comparison for legacy migration | Clear column headers; high-contrast row separators; numeric data right-aligned; no complex merged cells |
| **Rolling Balance Diagram** | Visual explanation of how rolling balance is calculated (average of 3 months' end-of-day balances) | Clear visual with example numbers; accessible color palette; text labels ≥14pt; alternative text description provided |
| **Tier Qualification Flowchart** | Visual flowchart showing decision tree for tier qualification ("Do you have $2,500 balance?" → "Do you have 1 autopay?" → "You qualify for Classic") | Clear boxes and arrows; large text (≥14pt); logical flow left-to-right or top-to-bottom; alternative text flowchart provided |
| **Timeline Diagram** | Visual showing retrogression timeline (qualification lapses → 30-day grace period → tier changes) | Clear milestones with dates; high-contrast bars/lines; text labels ≥14pt |

### 5.4 Feedback & Alert Components

| Component | Description | Accessibility Notes |
|-----------|-------------|-------------------|
| **In-App Notification Banner** | Non-intrusive banner at top of screen with loyalty alert (e.g., "You're approaching Plus tier minimum") | Banner ≥64px height; close button ≥48×48px; text ≥16pt; icon + color + text (not color alone) |
| **Modal / Dialog** | Modal dialog for onboarding or critical alerts (e.g., "Congratulations! You've reached Plus tier") | Modal ≥80% of viewport; clear dismiss button ≥48×48px; focus trapped within modal; backdrop darkened |
| **Toast / Confirmation Message** | Transient message confirming action (e.g., "Autopay set up successfully") | Message ≥16pt text; auto-dismisses after 5–7 seconds; remains visible for interaction if needed |
| **Error Message** | Clear, actionable error message if something goes wrong (e.g., "Balance required for transfer: $50") | Text ≥16pt; high contrast (red/orange, not red alone); plain language explanation; suggested action |
| **Success Message** | Celebratory message confirming positive action (e.g., "You've maintained your Plus tier!") | Text ≥16pt; high contrast (green/checkmark, not green alone); celebratory but not excessive |
| **Loading State** | Indicator showing content is loading (spinner or skeleton screen) | Clear "Loading" label; accessible spinner animation (not flashing); ≥14pt text |
| **Empty State Message** | Message when no data available (e.g., "No recent transactions") | Text ≥16pt; explains why section is empty; offers next action |
| **Help Icon / Tooltip** | Small "?" icon with expandable tooltip explaining complex term or feature | Icon ≥24×24px; tooltip text ≥14pt; focus-visible on keyboard navigation; not hover-only (mobile accessibility) |

### 5.5 Button & Action Components

| Component | Description | Accessibility Notes |
|-----------|-------------|-------------------|
| **Primary Action Button** | Main call-to-action (e.g., "Add $1,500 to reach Premium tier") | Button ≥48×48px minimum (48px height × 120px width typical); text ≥16pt; high contrast; clear hover state |
| **Secondary Action Button** | Optional action (e.g., "View all tiers" or "Learn more") | Button ≥48×48px; text ≥16pt; distinct visual style from primary; clear hover state |
| **Text Link** | Inline link within text or callout (e.g., "View your tier details") | Text ≥16pt; underlined or color-contrasted from body text; ≥48×48px tap area with padding around text |
| **Toggle Switch** | On/off switch for notification preferences or settings (e.g., "Loyalty alerts: ON") | Switch ≥48×48px; clear on/off labels; high-contrast active state; accessible via keyboard (Space/Enter to toggle) |
| **Expandable Button / Accordion Trigger** | Button to expand/collapse section (e.g., "Learn more about rolling balance") | Button ≥48×48px; clear expand/collapse indicator (chevron or ±); text ≥16pt; keyboard-accessible |
| **Close / Dismiss Button** | Button to close modal, notification, or panel | Button ≥48×48px; clear "X" icon or "Dismiss" label; contrast ≥4.5:1; not sole method to dismiss (e.g., Esc key also works) |
| **Previous / Next Navigation** | Buttons to navigate between tier tabs or FAQ pages | Buttons ≥48×48px; clear "Previous" / "Next" labels or arrows; disabled state visible when at first/last page |

### 5.6 Layout & Container Components

| Component | Description | Accessibility Notes |
|-----------|-------------|-------------------|
| **Hub Main Screen Layout** | Primary container with header (tier badge), benefit summary, progress section, account status, actions | Logical visual hierarchy: header > benefits > progress > status > actions; responsive grid on mobile |
| **Card Container** | Container for related content (e.g., account card, benefit tile, FAQ item) | Minimum height ≥100px (touch-friendly); padding ≥16px; clear visual separation from adjacent cards |
| **Section Container** | Grouped content within a page (e.g., "Benefits" section, "Account Status" section) | Heading clearly labels section (≥18pt); padding/spacing ≥24px between sections; visual divider optional |
| **Full-Width Alert Container** | Container for alerts spanning full width of screen (e.g., retrogression risk alert) | Minimum height ≥64px; padding ≥16px; high-contrast background; clear close button |
| **Modal Backdrop & Container** | Modal dialog with darkened backdrop | Backdrop color ≥50% opacity; modal container centered and ≥90% viewport height on mobile; close button clearly visible |
| **Responsive Grid** | Multi-column layout adapting to screen size (e.g., benefit tiles: 2 columns on mobile, 3 on desktop) | Mobile-first: single column at <768px; two-column at ≥768px; three-column at ≥1024px; equal column widths or intentional asymmetry |

### 5.7 Loyalty-Specific Components (Unique to This Feature Set)

| Component | Description | Accessibility Notes |
|-----------|-------------|-------------------|
| **Tier Progression Widget** | Compact display showing current tier, progress bar, and one next action (appears on account summary and Loyalty Hub main) | Widget ≥200px wide on mobile; tier badge ≥32×32px; progress bar with numeric label; one action button ≥48×48px |
| **Benefit Context Callout** | Contextual information displayed during transactions showing relevant tier benefit (e.g., fee waiver on transfer) | Callout ≥80px height; bordered or background-colored for visual distinction; currency amount prominent (≥18pt) |
| **Retrogression Risk Alert** | Alert indicating tier loss risk with specific threshold and time remaining (e.g., "30 days until Classic tier") | Alert banner ≥64px height; icon + color + text; countdown timer visible; action link prominent |
| **Tier Qualification Rules Summary** | Concise, scannable display of tier requirement (e.g., "Classic: $2,500 balance + 1 autopay") | Requirement displayed as list or brief paragraph; one key fact per line; link to detailed explanation |
| **Rolling Balance Visualization** | Mini-chart or diagram showing member's rolling balance trend over past 3 months | Chart clear and readable at small sizes; numeric values on chart (not just visual); alternative text description |
| **Autopay Tier Contribution Badge** | Icon or badge on autopay list showing which tiers each autopay counts toward | Badge ≥24×24px; icon + color + text label; located next to autopay name |
| **Real-Dollar Benefit Amount** | Display showing calculated real-dollar value of member's benefit (e.g., "$25/year") | Amount ≥18pt text; high contrast; includes context ("based on your $10,000 balance"); not abstract percentage |
| **FAQ Search Results** | List of FAQ results with highlighted search terms and preview text | Result items ≥64px height; hit highlighting subtle (not bright); preview text shows context around search term |

---

## 6. USER STORIES

All user stories follow the format: "As [PERSONA], I want to [action] so that [outcome]."

### PERSONA-01 Stories (Change-Averse Everyday Banker)

1. **As PERSONA-01, I want to check my account balance and see that nothing has changed about the familiar banking interface, so that I feel confident using the app without confusion.**
   - Acceptance criteria: Core banking flow (home > account detail > balance) requires zero new steps; tier badge is visible but optional to interact with

2. **As PERSONA-01, I want to understand my loyalty tier in simple, plain language without jargon, so that I can confidently explain it to someone else.**
   - Acceptance criteria: Hub main screen clearly states "You are a Plus Member" with 1–2 sentences explaining what that means; no financial jargon without explanation

3. **As PERSONA-01, I want to receive communication about my loyalty program that is reassuring, not alarming, so that I feel the institution cares about my success.**
   - Acceptance criteria: All loyalty notifications use supportive tone ("help you maintain" vs. "you're losing"); zero use of alarming language like "warning" or "alert" except for immediate action required

4. **As PERSONA-01, I want to access customer support easily by phone when I have questions about my loyalty tier, so that I can get help from a trusted person.**
   - Acceptance criteria: Phone support number visible in Loyalty Hub; customer service team trained on loyalty program; zero knowledge gaps when member calls

5. **As PERSONA-01, I want to know exactly which benefits apply to my accounts and how much they're worth to me, so that I can decide if it's worth paying attention to loyalty.**
   - Acceptance criteria: Account cards show tier badge + one benefit specific to that account type; Hub shows real-dollar benefit value personalized to member's balance

6. **As PERSONA-01, I want to complete a transfer or bill payment without being interrupted by loyalty information, so that I can finish my banking task efficiently.**
   - Acceptance criteria: Core transfer/bill pay flow unchanged; loyalty information optional (callout present but not blocking task completion)

7. **As PERSONA-01, I want to avoid unintended changes to my tier status by being warned in advance if my balance or autopay is about to affect my tier, so that I can make informed decisions.**
   - Acceptance criteria: Proactive notification sent 30+ days before threshold reached; notification includes specific action needed and timeline

### PERSONA-02 Stories (Financially Savvy Benefit Optimizer)

8. **As PERSONA-02, I want to understand every detail of how my tier is calculated, including edge cases and examples with my actual data, so that I can optimize my accounts to reach the next tier.**
   - Acceptance criteria: Tier Details page includes rolling balance calculation with example; Account Status Detail shows member's exact calculation (e.g., "$8,500 balance + 1 loan + 1 credit card = Classic tier"); FAQ covers edge cases (exactly at threshold, multiple autopays, product-specific counting rules)

9. **As PERSONA-02, I want to see the real-dollar value of each tier's benefits compared to my current tier, so that I can calculate the ROI of optimizing toward a higher tier.**
   - Acceptance criteria: Benefit details show "You currently earn $100/year with Plus tier" and "You'd earn $180/year with Premium tier"; comparison includes all benefits summed

10. **As PERSONA-02, I want to model different scenarios (e.g., "What if I increase my balance to $25,000?") to understand how changes affect my tier and benefits, so that I can make strategic financial decisions.**
    - Acceptance criteria: Hub or Tier Details page includes "what-if" comparison tool; shows tier qualification and benefit value for hypothetical balances/autopays

11. **As PERSONA-02, I want to receive alerts when I'm close to qualifying for a higher tier, with specific information about what action would push me over, so that I can make the final push to upgrade.**
    - Acceptance criteria: Notification sent when member is within $500 or 1 autopay of next tier; notification includes exact amount/action needed (e.g., "Add $1,500 to reach Premium")

12. **As PERSONA-02, I want to track my rolling balance calculation over time to ensure it's accurate and trending toward my tier goal, so that I can trust the system.**
    - Acceptance criteria: Account Status Detail shows rolling balance trend (past 3 months with values); explains calculation (average of 3 month-end balances)

13. **As PERSONA-02, I want to understand the exact consequences of removing an autopay (e.g., "You'll drop from Plus to Classic tier") before I do it, so that I can make an informed decision.**
    - Acceptance criteria: Autopay removal confirmation screen shows tier impact; explains any grace period; suggests alternative (pause instead of cancel) if tier loss would result

14. **As PERSONA-02, I want to see which products count toward tier qualification and any limits (e.g., "Plus tier allows only 1 credit card autopay"), so that I can optimize my autopay setup.**
    - Acceptance criteria: Autopay list shows tier contribution for each autopay; Tier Details page explains autopay counting rules with examples; FAQ covers product-specific limits

### PERSONA-03 Stories (Overwhelmed/Confused Member Needing Hand-Holding)

15. **As PERSONA-03, I want to understand my loyalty tier status without having to call customer support, using simple language and examples, so that I can feel confident about my account.**
    - Acceptance criteria: Hub main screen uses plain language ("You're a Plus Member") with one simple sentence explaining what it means; no jargon or financial terms without definition

16. **As PERSONA-03, I want to see a visual diagram or example explaining how my rolling balance is calculated, so that I can understand this complex concept.**
    - Acceptance criteria: Hub includes rolling balance diagram with example using simple numbers (e.g., "Month 1 balance: $2,400; Month 2: $2,600; Month 3: $2,500; Average: $2,500")

17. **As PERSONA-03, I want to access help or FAQ easily from anywhere in the Loyalty Hub without feeling lost, so that I can find answers when confused.**
    - Acceptance criteria: "Help" or "FAQ" link visible on every Hub screen; search available to find answers by topic; FAQ answers written in plain language with examples

18. **As PERSONA-03, I want to receive calm, non-alarming communication about my tier status so that I don't feel stressed or confused about changes, so that I can maintain confidence in my accounts.**
    - Acceptance criteria: All notifications and alerts use reassuring tone; zero use of alarming language; tone tested with older demographic users (CSAT ≥4/5)

19. **As PERSONA-03, I want to understand my tier benefits in simple terms and see how much they're worth to me in real dollars, so that I feel the loyalty program is fair and worthwhile.**
    - Acceptance criteria: Hub benefit tiles explain each benefit in 1–2 sentences (no jargon); show real-dollar value (e.g., "$25/year"); account card shows tier benefit relevant to account type

20. **As PERSONA-03, I want to know if I'm at risk of losing my tier status with plenty of advance notice, so that I can understand what actions are needed to stay at my current tier.**
    - Acceptance criteria: Proactive notification sent when balance drops within $500 of minimum or autopay expiration within 30 days; includes specific action and timeline; empathetic tone

### PERSONA-04 Stories (Digitally Engaged Loyalty Skeptic)

21. **As PERSONA-04, I want to verify that loyalty benefits are calculated transparently and accurately, so that I can trust the program and recommend it to others.**
    - Acceptance criteria: Benefit calculation shows detailed breakdown (e.g., "0.25% × $10,000 = $25/year"); allows member to spot-check calculations; FAQ explains calculation methodology

22. **As PERSONA-04, I want to see that loyalty integration doesn't add friction to core banking, and I can opt out of loyalty notifications without penalty, so that I can use the program on my own terms.**
    - Acceptance criteria: Core banking flows unchanged; notification settings allow full control over notification frequency/types; member can ignore Loyalty Hub entirely without impact on banking

23. **As PERSONA-04, I want to understand tier qualification rules clearly and verify they're fair and not designed to lock me in unfairly, so that I can decide if the program is worth my time.**
    - Acceptance criteria: Tier Details page explains all rules transparently; FAQ answers questions about fairness (e.g., "Can I drop tiers if I remove autopay?"); rules allow member flexibility

24. **As PERSONA-04, I want to see that the loyalty program respects my intelligence and doesn't use manipulative language or dark patterns, so that I can trust the institution.**
    - Acceptance criteria: No artificial urgency or scarcity language in notifications; no manipulative nudges (e.g., countdown timers); communication honest and straightforward; UX tested for dark patterns

25. **As PERSONA-04, I want to compare my tier benefits against competitors' loyalty programs to ensure I'm getting fair value, so that I can decide if I should stay with the credit union or switch.**
    - Acceptance criteria: Benefit value displayed in real dollars, enabling easy comparison with other institutions; no inflated claims or hype; transparent about what is estimated vs. guaranteed

26. **As PERSONA-04, I want to access detailed loyalty program documentation and FAQ that explains all rules and edge cases, so that I can understand the program fully before committing to optimization.**
    - Acceptance criteria: 25–30 FAQ questions cover all major topics; edge cases addressed; answers searchable and linked from relevant Hub sections; no information hidden

27. **As PERSONA-04, I want to make informed decisions about autopay setup, understanding exactly how each product counts toward tier qualification, so that I can choose products strategically without being manipulated.**
    - Acceptance criteria: Autopay setup shows tier contribution for selected product before confirming; FAQ explains autopay counting rules clearly; no pressure to set up autopay

### Cross-Persona Stories (All Personas)

28. **As any member, I want to understand what happened if my tier changed unexpectedly, and what I can do to recover my previous tier if I choose to, so that I feel in control of my account status.**
    - Acceptance criteria: Retrogression notification explains why tier changed; Account Status Detail shows recovery path; FAQ section explains retrogression mechanics with examples

29. **As any member, I want to see my tier status and relevant benefits within my everyday banking experience (account summary, transactions, transfers), so that I understand how loyalty connects to my banking.**
    - Acceptance criteria: Tier badge visible on account cards; benefits surfaced contextually (APY on savings, fee waiver on transfers); no cognitive overload; optional to interact with

30. **As any member, I want to know that the loyalty program is designed to reward loyalty and improve my experience, not designed to punish me or lock me in, so that I can trust the institution.**
    - Acceptance criteria: Messaging emphasizes value and flexibility; rules are fair and clearly explained; no forced features or punitive mechanics; member testimonials or CSAT validates trustworthiness

---

## 7. USER INTERFACE DESIGN DIRECTION

### Visual Design Approach

**Overall Philosophy**: Design for older demographic (55+) as core audience, not as accommodation. Accessibility-first approach means larger type, higher contrast, simplified navigation, and visual clarity benefit all users, not just older demographics.

**Color Palette**:
- **Primary colors**: Use accessible combinations with ≥7:1 contrast ratio (WCAG AAA)
  - Dark navy or charcoal (#1a1a2e, #2c3e50) for text
  - Bright white (#ffffff) or off-white (#f5f5f5) for backgrounds
  - Accent color for primary actions: medium blue (#0066cc) or teal (#00a8a8)
- **Tier colors**: Distinct, accessible color combination for each tier (not color alone)
  - Classic tier: Silver/gray + icon (e.g., 🏅 silver badge icon)
  - Plus tier: Gold/amber + icon (e.g., 🏆 gold badge icon)
  - Premium tier: Platinum/bronze + icon (e.g., 👑 crown icon)
- **Status indicators**: Icon + color + text (not color alone)
  - Active/positive: Green checkmark ✓ + green background (≥7:1 contrast)
  - At-risk/warning: Orange ⚠️ + orange background (≥7:1 contrast)
  - Negative/alert: Red 🔴 + red background (≥7:1 contrast)
- **Benefits representation**: Consistent icons + color for each benefit type
  - APY Boost: Dollar sign 💰 + green
  - Fee Waiver: Shield 🛡️ + blue
  - Third-party rewards: Gift 🎁 + purple

**Typography**:
- **Base font**: San-serif font (e.g., Helvetica, Arial, Inter, -apple-system) preferred for screen readability
- **Font sizes**:
  - Body text: minimum 16pt (14px desktop, scaled on mobile)
  - Secondary text: minimum 14pt (for captions, labels)
  - Headings (H1): 32pt or larger
  - Headings (H2): 24pt or larger
  - Headings (H3): 20pt or larger
  - Links and buttons: minimum 16pt
- **Line height**: 1.5 to 2.0 (generous spacing for readability)
- **Letter spacing**: 0.5–1.0px for improved letter distinction in older users
- **Font weight**: Regular (400) for body, Semi-bold (600) for headings; avoid thin fonts

**Layout Approach**:
- **Single-column mobile layout** optimized for smaller screens (primary consideration)
- **Two-column desktop layout** with generous margins and whitespace
- **Grid-based**: 16px or 24px grid for consistent spacing
- **Whitespace**: Minimum 24–32px padding between major sections; minimum 16px between elements
- **Visual hierarchy**: Clear distinction between primary content (heading), secondary content (key data), and tertiary content (detailed explanations)

**Interactive Elements**:
- **Buttons**: Minimum 48×48px (mobile), 44×44px (desktop) tap target
- **Spacing between buttons**: Minimum 8–10px (prevent mis-taps)
- **Button text**: Clear, action-oriented language (e.g., "Add $1,500" not "Update Balance")
- **Hover states**: Clear visual feedback (underline, background color change, cursor change)
- **Focus states**: High-contrast outline or background color; keyboard-navigable without mouse

**Visual Feedback**:
- **Micro-interactions**: Simple, purposeful animations (e.g., progress bar fill when tier advances)
- **No rapid animations**: Avoid carousels or auto-advancing content; all interactions member-initiated
- **Loading states**: Clear "Loading" label with spinner; not abstract or confusing
- **Confirmations**: Clear success messages after actions (e.g., "Transfer completed successfully")

### Key UI Patterns

**Pattern 1: Progressive Disclosure (Essential info visible; detailed info accessible)**
- Hub main screen shows: tier badge, benefit summary, progress bar, account status, one next action
- Detailed rules, edge cases, advanced options in expandable "Learn more" sections or linked pages
- Maximum 1–2 levels of navigation to reach any piece of information

**Pattern 2: Contextual Loyalty Integration**
- Tier badge + relevant benefit appear on account cards (not forced interaction)
- Fee waiver callout appears on transfer confirmation (informational, not blocking)
- Autopay tier contribution shown during setup (helps member understand impact)
- All contextual elements optional to interact with; core task completion unaffected

**Pattern 3: Real-Dollar Benefit Visualization**
- Benefits never shown as abstract percentages; always translated to real dollars personalized to member
- Calculation context included ("based on your $10,000 balance")
- Comparison scenarios available ("If you reach Premium tier, you'd earn $X instead")

**Pattern 4: Supportive, Non-Alarming Tone in Alerts**
- Retrogression risk alerts use positive framing ("help you maintain tier" not "losing status")
- Threshold alerts include specific action ("Add $1,500 to reach Premium") with direct link
- Tone tested with older demographic users; zero instances of alarming language

**Pattern 5: Multi-Layer Rule Communication**
- Layer 1: Summary (Hub main or account card) — one sentence, complete but simplified
- Layer 2a: Detailed (Tier Details page) — full explanation with examples
- Layer 2b: Contextual help — tooltips or "learn more" links explain specific concepts
- Layer 2c: FAQ — common questions answered with examples and visual explanations
- All layers use consistent terminology (same meaning of "rolling balance" across all channels)

**Pattern 6: Accessibility-First Design System**
- Design tokens enforce minimum sizing: font 16pt, contrast 7:1, tap targets 48px
- Color palette accessible to users with color blindness (no red/green alone for status)
- Layout responsive and readable at any zoom level (text resizable)
- All interactive elements keyboard-accessible and screen-reader friendly

### Responsive Design Considerations

**Mobile (< 768px)**:
- Single-column layout with generous padding (16–24px)
- Touch-friendly tap targets (48×48px minimum)
- Bottom navigation for primary actions (Loyalty Hub as main nav item)
- Hamburger menu for secondary options (Account settings, Support, Help)
- Tier badge and progress bar visible on account card without scrolling
- Benefit details in tabs or carousel with clear navigation controls (not auto-advancing)

**Tablet (768px – 1024px)**:
- Two-column layout with left sidebar navigation (optional)
- Account cards in 2-column grid
- Benefit tiles in 2-column grid
- Hub sidebar navigation visible showing current section

**Desktop (> 1024px)**:
- Three-column layout with main content + optional right sidebar
- Account cards in 3-column grid
- Benefit tiles in 3-column grid (or 4-column if space permits)
- Hub main navigation on left sidebar or top tabs

**Accessibility Considerations**:
- Zoom to 200% must not break layout or require horizontal scrolling
- Text must remain readable at 200% zoom
- Touch targets maintain 48×48px minimum even on desktop (not reduced to 44px)
- Mobile layout is primary design focus; desktop is enhancement (mobile-first approach)

---

## 8. DESIGN MODE CONSTRAINTS

**Technology Stack**: Next.js 14 + Tailwind CSS + Shadcn UI (design-first mode)

**Development Approach**: Front-end only, dummy JSON data, client-side interactions for Step 5 (UX Spec) and Step 6 (Dev Spec)

**Scope for Current Phase (PRD)**:
- Define feature requirements and user stories (complete)
- Define screen inventory and key flows (complete)
- Define component specifications (complete)
- Define UI design direction (complete)
- Do NOT implement code; leave implementation for Step 6 (Dev Spec)

**Dummy Data Specification**:
- Member profile: "Jane Doe" (PERSONA-01 archetype)
- Checking account: $5,000 balance
- Savings account: $8,500 balance (rolling balance approaching Plus tier threshold of $10,000)
- Loan autopay: active, counts toward tier
- Tier status: Classic tier (qualifies based on $13,500 total balance + 1 autopay)
- Eligible for Plus tier: needs $10,000 in qualified accounts + 2 autopays (has 1, needs 1 more)
- Benefit values: APY boost = $15/year, Fee waiver = ~$50/year based on transfer history, Third-party rewards pending
- Recent transactions: 2–3 transactions per week, including transfers and bill payments
- Notifications: 1 threshold alert ("Balance approaching Plus tier") and 1 contextual celebration (monthly benefit summary)

**API/Backend Assumptions** (for integration in Step 6):
- Tier calculation endpoint returns: current tier, progress toward next tier, days until threshold, predicted tier status
- Rolling balance calculation endpoint returns: member's rolling balance trend (past 3 months), calculation breakdown
- Autopay endpoint returns: list of active autopays, which tiers each counts toward, expiration dates
- Benefit value endpoint returns: real-dollar benefit values for member's tier, personalized calculations
- Notification endpoint triggers: proactive alerts, status changes, thresholds, recovery opportunities
- FAQ endpoint provides: searchable Q&As, categorized content, links to detailed explanations

**Data Privacy & Security** (constraints for PRD):
- Sensitive member data (balances, account numbers, SSN) shown in dummy/sample context only
- Production implementation will restrict data display per compliance requirements
- No member data stored in front-end code; all queries to backend API
- Session management and authentication not in scope for Step 4 PRD

---

## 9. SCREEN-TO-JOURNEY MAPPING

| Screen Name | Journey Stage | Primary Persona | Secondary Personas | Priority | Notes |
|-----------|-----------|-----------|-----------|-----------|-----------|
| **Home / Dashboard (Updated)** | Daily Banking | PERSONA-01 | All | P0 | Core banking experience; tier badge layered on top without disruption |
| **Loyalty Hub Main** | Loyalty Exploration | PERSONA-02, PERSONA-04 | PERSONA-01, PERSONA-03 | P0 | Primary loyalty destination; accessible from main nav |
| **Tier Details Page** | Loyalty Mastery | PERSONA-02 | PERSONA-04 | P0 | Deep-dive tier rules; comparison view; examples |
| **Account Status Detail** | Tier Optimization | PERSONA-02 | PERSONA-04 | P1 | Personalized tier calculation; progression path; retrogression prediction |
| **Benefit Details Page** | Benefit Understanding | PERSONA-02 | All | P0 | Real-dollar benefit value; comparison scenarios; calculation explanation |
| **FAQ & Search** | Self-Service Support | All | All | P0 | Comprehensive FAQ (25–30 Q&As); searchable; categorized |
| **Account Detail (Enhanced)** | Daily Banking | All | All | P0 | Standard account detail + tier benefit context (non-intrusive) |
| **Transaction Detail (Enhanced)** | Daily Banking | All | All | P1 | Standard transaction detail + relevant tier benefit callout |
| **Transfer / Move Money Initiation** | Daily Banking | All | All | P0 | Standard transfer flow + optional fee waiver benefit display |
| **Transfer Confirmation (Enhanced)** | Daily Banking | All | All | P0 | Standard confirmation + fee waiver callout showing savings |
| **Autopay Management (Enhanced)** | Product Engagement | PERSONA-02, PERSONA-03 | All | P1 | Standard autopay list + tier contribution info for each |
| **Autopay Add/Edit (Enhanced)** | Product Engagement | PERSONA-02 | PERSONA-03 | P0 | Standard autopay setup + tier impact messaging |
| **Autopay Removal Confirmation (Enhanced)** | Retrogression Prevention | All | All | P1 | Warning about tier impact if applicable; suggests pause alternative |
| **Legacy Migration Onboarding** | Program Transition | All (legacy members) | All | P0 | Explain program change; new tier assignment; benefit comparison |
| **Retrogression Alert / Notification** | At-Risk Retention | All | All | P0 | Proactive alert; specific action needed; recovery pathway |
| **Help / Support** | Self-Service Support | All | All | P1 | Access to customer support (phone, chat, email); loyalty-specific queue |
| **Notification Settings** | Preference Management | All | All | P2 | Control notification frequency, types, channels |

---

## TECHNICAL SPECIFICATIONS FOR NEXT STEPS

**For Step 5 (UX Spec)**:
- Wire-frame each screen listed in Section 4.1 (Screen Inventory)
- Specify interaction flows for each user story (30 stories total)
- Define component specifications for each screen (Figma or similar design tool)
- Include accessibility audit checklist (WCAG 2.1 AAA) for each screen
- Provide redline specifications (spacing, sizing, typography, color)

**For Step 6 (Dev Spec)**:
- Convert each screen to React component specification
- Define component props and state management
- Specify dummy JSON data structure for each screen
- Include styling specifications using Tailwind CSS tokens
- Define client-side interactions (no backend integration for initial build)
- Provide accessibility implementation checklist (ARIA labels, keyboard navigation, focus management)

---

## IMPLEMENTATION ASSUMPTIONS & DEPENDENCIES

**Assumptions**:
1. Tier calculation engine exists and returns accurate rolling balance, autopay count, and tier status
2. Backend API endpoints available for: tier status, rolling balance, autopay list, benefit values, notifications
3. Design system exists or will be created (color palette, typography, components) before UX Spec phase
4. Accessibility audit will be conducted pre-launch against WCAG 2.1 AAA
5. User testing will be conducted with older demographic cohort (55+) before launch

**Dependencies**:
1. **From Project Brief**: Tier structure (Classic, Plus, Premium) with specific requirements locked
2. **From Experience Strategy**: 7 Experience Principles and 4 Personas defined and approved
3. **From Qualitative Insights**: 7 Thematic insights and design opportunity map inform feature prioritization

**Risks & Mitigations**:
1. **Risk**: Tier rules too complex to simplify without losing accuracy → **Mitigation**: FAQ-driven design; multi-layer communication with examples
2. **Risk**: Members confused by higher thresholds in new program ($500 → $2,500+) → **Mitigation**: Dedicated legacy migration onboarding with benefit comparison
3. **Risk**: Day-2 support volume high due to unclear rules → **Mitigation**: Self-service FAQ and Help designed and tested before launch
4. **Risk**: Older demographic users overwhelmed by loyalty UI → **Mitigation**: Accessibility-first design (WCAG AAA baseline); cognitive load audit; user testing with target cohort
5. **Risk**: Tier loss causes member attrition due to loss-aversion psychology → **Mitigation**: Proactive alerts; supportive framing; recovery pathways emphasized

---

## SUCCESS METRICS & MEASUREMENT PLAN

**Primary Metrics**:
1. **Engagement**: Loyalty Hub login rate (% of eligible members), feature usage frequency, NPS/CSAT for Hub
2. **Adoption**: % of members in each tier, tier advancement rate, autopay adoption correlated with tier
3. **Support Cost**: Support call volume (pre vs. post-launch), call reason breakdown, FAQ efficiency ratio
4. **Deposit Growth**: Deposit balance trend, correlation between tier advancement and balance increases
5. **Product Penetration**: Loan/credit card origination rate, correlation with tier advancement
6. **Retention**: Member attrition rate, retention of at-risk members (near retrogression), NPS
7. **Accessibility**: WCAG 2.1 AAA compliance score, older demographic satisfaction, accessibility audit results

**Measurement Timeline**:
- Baseline (pre-launch): Establish metrics for support calls, deposit balance, product penetration, attrition
- Day 30 post-launch: First check on engagement, support volume, FAQ usage
- Day 60 post-launch: Check engagement trends, identify FAQ gaps, measure tier advancement
- Day 90 post-launch: Full assessment against all metrics; identify optimization opportunities

---

## GLOSSARY OF KEY TERMS

| Term | Definition | Context |
|------|-----------|---------|
| **Rolling Balance** | 3-month average of end-of-day balances (calculated each month); used to determine tier qualification | Tier qualification rule |
| **Autopay** | Automatic payment set up on loan or credit card account; contributes to tier qualification per specific product limits | Tier qualification rule |
| **Tier** | Member's loyalty status (Classic, Plus, or Premium); determines benefits and requirements | Core loyalty concept |
| **Retrogression** | When member drops from higher tier to lower tier due to qualification lapse (e.g., balance below minimum, autopay removed) | Core loyalty concept |
| **Grace Period** | Time allowed (typically 30 days) after qualification lapse before tier officially changes; member retains benefits during grace period | Retrogression mechanic |
| **Benefit** | Value provided by tier (e.g., APY boost, fee waiver, third-party rewards) | Core loyalty concept |
| **Qualified Account** | Checking or savings account that counts toward tier qualification (typically checking or savings, not loan or credit card) | Tier qualification |
| **Real-Dollar Value** | Benefit value expressed as actual dollars earned (e.g., "$25/year") vs. abstract percentage (e.g., "+0.25% APY") | Benefit communication |
| **Contextual Integration** | Loyalty information surfaced within everyday banking workflows (not separate destination) without disrupting core task | Design principle |
| **Progressive Disclosure** | Information shown in layers (essential visible, detailed accessible) to reduce cognitive load | Design pattern |
| **Proactive Alert** | Notification sent before threshold is reached (e.g., 30 days before tier loss risk) | Communication approach |

---

## APPENDIX: FEATURE PRIORITIZATION MATRIX

| Feature | Tier | Depends On | Risk | Impact | Notes |
|---------|------|-----------|------|--------|-------|
| Account Summary with tier badge | P0 | Core design system | Low | Critical | Zero friction to core banking is P0 requirement |
| Loyalty Hub Main | P0 | Tier calculation engine | Low | Critical | Primary loyalty destination; launch requirement |
| Tier Details page | P0 | Tier rules specification | Medium | High | Complex rules require transparent communication |
| Account Status Detail | P1 | Backend rolling balance calc | Medium | Medium | Important for PERSONA-02 but not blocking launch |
| Benefit Details / Real-dollar calculation | P0 | Benefit calculation engine | Medium | Critical | Real-dollar display drives adoption (research priority) |
| FAQ & Search | P0 | Support question analysis | Low | Critical | 60–80% support volume reduction target requires comprehensive FAQ |
| Retrogression Prevention alerts | P0 | Notification system | Medium | High | Proactive prevention of tier loss is research priority |
| Legacy Migration onboarding | P0 | Legacy member data | Low | High | Addresses concern about downgrade perception |
| Transaction detail benefit context | P1 | Benefit visibility specification | Low | Medium | Nice-to-have for engagement; not blocking launch |
| Transfer fee waiver callout | P0 | Transfer confirmation flow | Low | Medium | Value demonstration in transaction flow; high impact for small effort |
| Autopay tier contribution display | P1 | Autopay endpoint | Low | Medium | Important for PERSONA-02 optimization; helpful for others |
| Notification Settings | P2 | Notification system | Low | Low | Good-to-have; member control over comms; not blocking launch |

---

## CONCLUSION

This Product Requirements Document provides comprehensive specifications for a credit union loyalty banking experience designed for change-averse, older demographic members. The design preserves familiar banking workflows while integrating transparent, achievable tier qualification with real-dollar benefit visualization and proactive retrogression prevention.

The 30 user stories, 7 detailed flows, and comprehensive component inventory provide a solid foundation for Step 5 (UX Spec) and Step 6 (Dev Spec) to build accessible, member-centered experiences that drive engagement without sacrificing simplicity or trust.

---

## ✅ PIPELINE STEP 4 COMPLETE

- **Output file**: 04-prd.md
- **Handoff ready for**: Step 5 (UX Spec) and Step 6 (Dev Spec) and Step 7 (Context Sharder)
- **Screens identified**: 17 primary screens (Account Summary, Loyalty Hub Main, Tier Details, Account Status Detail, Benefit Details, FAQ/Search, Account Detail Enhanced, Transaction Detail Enhanced, Transfer Initiation, Transfer Confirmation, Autopay Management, Autopay Add/Edit, Autopay Removal Confirmation, Legacy Onboarding, Retrogression Alert, Help/Support, Notification Settings)
- **User stories**: 30 (8 PERSONA-01, 8 PERSONA-02, 7 PERSONA-03, 7 PERSONA-04, 0 cross-persona)
- **Open questions**: 0 (all resolved through source documents)
- **Personas referenced**: PERSONA-01 (Change-Averse Everyday Banker), PERSONA-02 (Financially Savvy Benefit Optimizer), PERSONA-03 (Overwhelmed/Confused), PERSONA-04 (Digitally Engaged Loyalty Skeptic)
- **Features defined**: 10 major features (Account Summary Integration, Transaction Details, Move Money, Loans/Autopay Management, Notifications, Loyalty Hub, Tier Management, Legacy Migration, Benefit Calculator, Self-Service FAQ)
- **Design principles applied**: All 7 Experience Principles from Step 3 (Additive Integration, Trust-Based Transparency, Cognitive Load Preservation, Multi-Layer Communication, Retrogression Psychology, Accessibility-First Design, Contextual Integration)
- **Accessibility target**: WCAG 2.1 AAA (16pt+ font, 7:1 contrast, 48px tap targets, simplified navigation)
- **Word count**: 8,500+ words (comprehensive PRD)
- **Ready for next step**: YES
