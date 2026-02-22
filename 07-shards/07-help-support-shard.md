# Shard 07: Help / Support Center

**Build Priority**: P1 — Critical for reducing support volume and enabling self-service
**Estimated Effort**: 14 hours
**Screen ID**: SCR-07
**Route**: `/help`
**Component File**: `app/help/page.tsx`

---

## 1. Screen Name & Route

**Full Screen Name**: Help / Support Center
**URL Route**: `/help` (Next.js app/help/page.tsx)
**Navigation Access**: Primary navigation ("Help" link), contextual help links from all screens, in-app notifications
**Page Title**: "Help & Support - Credit Union Loyalty"
**Breadcrumb**: Home > Help

**Route Parameters**: None (single destination)
**Auth Requirements**: Authenticated member (same as other screens)

---

## 2. Purpose & Jobs-to-be-Done

**Primary Purpose**: Self-service FAQ and support center designed to answer 80% of anticipated loyalty program questions without human support contact. Critical for older demographic (PERSONA-01) requiring clear, accessible explanations of complex tier rules, tier qualification, retrogression mechanics, and program changes.

**Jobs-to-be-Done**:

1. **Find answer to loyalty question** — Member (especially PERSONA-01) has confusion about tier qualification, tier benefits, autopay requirements, or retrogression; needs searchable FAQ to find answer within 3 minutes without calling support
2. **Understand tier rules in detail** — Member (PERSONA-02) wants complete explanation of tier qualification including edge cases, rolling balance windows, autopay limits per tier; needs expandable rules with examples and scenarios
3. **Verify program fairness** — Member (PERSONA-04 Skeptic) wants transparent explanation that loyalty program is not designed to trick or punish them; needs clear benefit calculations with real-dollar examples
4. **Access support contact information** — Member cannot find answer in FAQ; needs escalation path to phone, email, or chat without friction

**Design Principle Applied**: "Support Portal as FAQ-First Self-Service" — comprehensive searchable FAQ covers 25-30 anticipated questions; human support escalation available but positioned as secondary option. Accessibility baseline ensures older demographic can read and understand content without barriers.

---

## 3. User Stories & Acceptance Criteria

### Story 1: Change-Averse Banker Searches FAQ by Keyword

**As a** retired member (PERSONA-01)
**I want to** search for an answer using simple keywords (e.g., "autopay", "tier", "fee")
**So that** I can find the answer without navigating through categories or menus

**Given** I am on the Help Center page
**When** I enter "autopay" in the search box
**Then** I see:
- Search results appear immediately (within 1 second)
- Results show matching FAQ questions with highlighted keywords
- Each result shows question title, brief preview text (2-3 lines), and link to full answer
- Results are sorted by relevance (exact match first, then partial matches)
- No results state: "No results found. Try different keywords or contact support below."

**And** the search box remains visible as I scroll (sticky header with search)

---

### Story 2: Benefit Optimizer Reads Detailed Tier Rules with Examples

**As a** financially savvy member (PERSONA-02)
**I want to** read detailed tier qualification rules with real examples and edge cases
**So that** I can make informed decisions about optimizing my balances or autopay

**Given** I am on the Help Center page
**When** I click "How do I qualify for each tier?" (first FAQ item)
**Then** I see:
- Question text in large 18pt Bold
- Answer broken into clear sections: Classic tier rules, Plus tier rules, Premium tier rules
- Each section includes:
  - Minimum balance requirement (rolling 3-month average)
  - Autopay requirement (number of active autopays)
  - Examples: "If your balance is $8,000 and you have 1 autopay, you're in Classic. Add $2,000 to reach Plus."
  - Linked term definitions (click "rolling balance" for tooltip)
- Expandable "Edge Cases" section showing retrogression logic, account combination rules, legacy migration
- Accessible expandable sections with ARIA controls

**And** the answer remains readable on mobile (text doesn't require horizontal scroll)

---

### Story 3: Skeptic Validates Benefit Calculations with Transparent Examples

**As a** skeptical member (PERSONA-04)
**I want to** see real-dollar benefit calculations for each tier based on realistic scenarios
**So that** I can verify that loyalty benefits are genuine, not marketing exaggeration

**Given** I am on the Help Center page
**When** I click "What's the real value of APY boost?" (FAQ item)
**Then** I see:
- Scenario table showing three realistic cases:
  - Case 1: $10,000 balance in Classic tier (0% APY boost, $0 annual value)
  - Case 2: $15,000 balance in Plus tier (0.25% APY boost = $37.50 annual value)
  - Case 3: $25,000 balance in Premium tier (0.50% APY boost = $125 annual value)
- Calculation shown step-by-step: "$15,000 × 0.25% = $37.50"
- Fee waiver benefit example: "Plus tier saves $2.50 per transfer = $30/year if you transfer monthly"
- Disclaimer: "Benefits are estimates based on current product offerings and rates; actual rates may vary"

**And** each scenario is clearly labeled "Example" with realistic member names (not generic "Account A")

---

### Story 4: Member Escalates to Support After FAQ Search Fails

**As a** any member
**I want to** easily contact support after I cannot find my answer in FAQ
**So that** I can get help without abandoning the help flow

**Given** I search FAQ for "custom tier" and get no results
**When** I see "No results found" message
**Then** I can immediately see:
- "Can't find your answer?" heading (16pt Bold)
- Three support options displayed prominently:
  - "Call us at 1-800-BANK-CU (available 8am-6pm weekdays)"
  - "Email us at support@creditunion.org (response within 24 hours)"
  - "Chat with a representative (available Mon-Fri 9am-5pm)" with enabled/disabled status
- Each option includes a large (48×48px minimum) button or link
- Pre-filled context in contact form: "I'm asking about: [search term they used]"

**And** the escalation section is accessible from any point in the FAQ (not buried)

---

## 4. States

### Default State
- Page fully loaded with searchable FAQ
- Search box is empty and focused (cursor visible)
- All 25-30 FAQ questions displayed in collapsible sections (first 2-3 expanded, rest collapsed by default)
- Support contact section visible at bottom
- Search results panel is empty (hidden until user types)

### Loading State
- Page skeleton shows: Search box (placeholder shimmer), Accordion skeleton rows, Contact section skeleton
- Search input is disabled until page fully loads
- Message: "Loading help center..."

### Empty Search State
- User typed search term but no results match
- Display: "No results found for '[search term]'. Try different keywords or browse FAQs below."
- Search box highlighted with light yellow background (attention, not error)
- All FAQ questions re-displayed below (fallback to full list)

### Error State
- FAQ content fails to load (API timeout/error)
- Display alert: "Unable to load help content. Please try again."
- "Retry" button visible
- "Contact support" section still displayed (functional escalation path)

### Empty State (No FAQs Available)
- Unlikely, but handled: "No FAQs currently available. Please contact support below."
- Contact information prominently displayed

### Permission Denied State
- Not applicable (no authentication required for help center)

### Offline State
- Browser detects no network connection
- Display cached FAQ data (if available from previous session)
- Show "You're offline. Displaying cached help content." indicator at top
- Disable search functionality (search requires live data)
- Keep "Contact support" information visible

---

## 5. Information Architecture

### Visual Regions (Top to Bottom)

**Header Region** (sticky, 56px height):
- Left: Logo / "Help Center" breadcrumb
- Right: Notifications icon, Settings icon, User menu

**Search Region** (prominent, sticky):
- Background: Light gray or tier-colored accent
- Content: Large search input (400px+ width, 48px height)
- Placeholder text: "Search FAQs... e.g., 'autopay', 'tier rules', 'APY'"
- Magnifying glass icon (left of input) + Clear button (right, if search has text)
- Helper text below: "25-30 frequently asked questions about loyalty tiers, benefits, and qualification"

**Search Results Region** (appears dynamically):
- Show 1-10 matching FAQ items
- Each result shows:
  - Question title (bold, 16pt) with keyword highlighting
  - Question preview (2-3 lines of answer, 14pt Regular)
  - "View full answer" link
- Results section has clear border/background to distinguish from FAQs below

**FAQ Accordion Region** (main content):
- Heading: "Frequently Asked Questions"
- Organized by 4 categories (if applicable):
  - **Tier Qualification** (5-8 questions): "How do I qualify?", "What's a rolling balance?", "Can I combine accounts?", etc.
  - **Benefits & Value** (4-6 questions): "What's the APY boost?", "How much can I save?", etc.
  - **Changes & Retrogression** (5-7 questions): "What happens if my balance drops?", "Can I get my old tier back?", etc.
  - **Billing & Technical** (4-6 questions): "When are benefits applied?", "How are transactions recorded?", etc.
- Each section is collapsible (Accordion component)
- By default: First section expanded, others collapsed (balance between discovery and cognitive load)
- Each FAQ item has:
  - Question text (16pt Bold, full width, clickable)
  - Expand/collapse icon (chevron, right-aligned, 24×24px minimum)
  - Answer text (16pt Regular, expandable)
  - Related FAQ links at bottom: "Also see: [related question]"

**Support Escalation Region** (bottom, prominent):
- Heading: "Still need help?"
- Three large cards or buttons:
  1. **Phone Support**: "Call us at 1-800-BANK-CU" with clock icon (shows hours: "Mon-Fri 8am-6pm ET")
  2. **Email Support**: "Email us at support@creditunion.org" with envelope icon (shows estimated response time: "Response within 24 hours")
  3. **Live Chat**: "Chat with a representative" with chat icon (shows availability: "Online now" or "Available Mon-Fri 9am-5pm")
- Minimum button size: 100×60px (preferably larger for accessibility)
- Optional: Pre-filled contact form inline (name, email, message) with "Send" button

**Footer Region**:
- Privacy policy, Terms, Accessibility statement links

### Content Priority

1. **Search box** (new entry point, supports discoverability) — most accessible feature
2. **Quick FAQ snippets** (first 3-5 questions) — supports time-constrained users
3. **Full FAQ accordion** (expandable details) — supports deep understanding
4. **Support escalation** (contact options) — safety net if FAQ insufficient
5. **Related links** (cross-references) — supports exploration

### Progressive Disclosure

- **Search box** is visible and active on page load (primary interaction)
- **FAQ questions** are listed but most answers collapsed (don't overwhelm with text)
- **Answer text** expands on click (user controls information flow)
- **Related links** shown at bottom of expanded answers (optional exploration)
- **Support contact** progressively revealed as user scrolls (not hidden, but secondary)
- **Nested definitions** (rolling balance, autopay) are tooltips or inline definitions (hover/click to expand)

---

## 6. Components & Responsibilities

### Component Tree

```
Page (app/help/page.tsx) — Server Component
├── Header (reused from layout)
├── HelpSearchRegion (Client)
│   ├── SearchInput (Client)
│   ├── SearchResultsList (Client, conditional)
│   │   └── SearchResultItem × N (Client)
│   └── Helper text
├── FAQAccordionRegion (Client)
│   ├── Heading "Frequently Asked Questions"
│   ├── FAQCategory × 4 (Accordion Item, Client)
│   │   └── FAQItem × N (Accordion Item, Client)
│   │       ├── Question text (clickable header)
│   │       ├── Answer text (expandable)
│   │       ├── Definition links (hover tooltips)
│   │       └── Related links
│   └── Note: "Can't find your answer?" with support CTA
├── SupportEscalationRegion (Client)
│   ├── Heading "Still need help?"
│   ├── PhoneSupport card
│   ├── EmailSupport card
│   └── LiveChatSupport card (conditionally enabled based on hours)
├── ContactForm (Client, optional)
│   ├── Name input
│   ├── Email input
│   ├── Message textarea (pre-filled with search context)
│   └── Submit button
└── Footer
```

### Component Responsibilities

**SearchInput** (custom component):
- Props: `onSearch: (query: string) => void`, `isLoading: boolean`, `placeholder?: string`
- Responsibility: Accept search query, debounce input (300ms), trigger search handler
- Accessibility: Input has `aria-label="Search help topics"`; clear button has accessible label

**SearchResultsList** (custom component):
- Props: `results: FAQItem[]`, `query: string`, `loading: boolean`
- Responsibility: Display search results with highlighting, show "No results" state, render each result
- Accessibility: Results list has `role="region"`, `aria-live="polite"` for dynamic updates

**FAQAccordion** (custom component using Shadcn Accordion):
- Props: `categories: FAQCategory[]`, `onOpen: (questionId) => void`
- Responsibility: Render collapsible FAQ sections with ARIA controls
- Accessibility: Accordion implements ARIA `aria-expanded`, `aria-controls`

**FAQItem** (custom component):
- Props: `question: string`, `answer: string`, `category: string`, `relatedQuestions?: string[]`
- Responsibility: Render question as button/header, answer as expandable content
- Accessibility: Question is button with semantic button element; answer has `role="region"`

**DefinitionTooltip** (custom component, reusable):
- Props: `term: string`, `definition: string`
- Responsibility: Display term with optional tooltip or inline definition
- Accessibility: Tooltip triggered on hover/focus; accessible via keyboard

**SupportCard** (custom component):
- Props: `icon: ReactNode`, `title: string`, `description: string`, `action: "phone" | "email" | "chat"`, `href?: string`, `isAvailable: boolean`
- Responsibility: Display support option with icon, description, and action button/link
- Accessibility: Card is semantic, with sufficient color contrast (not relying on icon color alone)

**Page (app/help/page.tsx)** (server component):
- Responsibility: Fetch FAQ data (getFAQItems), determine support availability (hours of operation)
- Pass FAQ categories and support status to client components
- Handle API errors gracefully with fallback content

---

## 7. Interactions

### Click Interactions

**Search Input**:
- Type → Debounce 300ms → Trigger search handler (filter FAQs by keyword)
- Click X (clear) button → Clear search input → Reset to full FAQ list
- Focus → Highlight input border (blue, 2px)

**FAQ Question Header**:
- Click → Toggle answer expansion (Accordion controlled by client state)
- Click related link within answer → Scroll to that FAQ item (or open if collapsed)
- Keyboard: Enter or Space on focused header

**Support Card**:
- Click phone number → Initiate tel: link (mobile) or show dialer prompt
- Click email → Initiate mailto: link or open contact form with email pre-filled
- Click "Chat" → Open live chat widget (if available) or disable button if offline
- Keyboard: Tab to button, Enter to activate

**Search Result Item**:
- Click → Collapse all FAQs, expand matching FAQ, scroll to answer, highlight keyword
- Keyboard: Enter on focused result

### Keyboard Navigation

- **Tab order**: Search input → Clear button (if visible) → FAQ headers (top to bottom) → Related links within expanded answers → Support cards → Footer links
- **Focus indicators**: All interactive elements show 2px blue outline (7:1 contrast)
- **Enter/Space**: Toggle FAQ expansion, activate buttons, follow links
- **Escape**: Close any open dropdowns or modals (chat widget)
- **Arrow keys**: If search results visible, Down/Up arrow to navigate results (optional enhancement)

### Touch Interactions (Mobile)

- **Search input tap**: Focus input, show mobile keyboard
- **FAQ header tap**: Toggle expansion (full-width tap target)
- **Support card tap**: Activate action (call, email, chat) on 48×48px+ button
- **Swipe**: No specific swipe interactions (standard scroll behavior)

### Focus Management

- **Page load**: Focus on search input (primary interaction point)
- **Search results appear**: Focus moves to first result (user can read results sequentially)
- **FAQ expand**: Focus remains on clicked header (user can see expanded answer below)
- **Support card interaction**: After clicking, focus may move to opened link or modal (e.g., chat widget)
- **Back navigation**: Focus returns to search input (page state preserved)

---

## 8. Data Contracts

### Request / Response Models

#### GET /api/help/faq (Fetch All FAQ Items)

**Request**:
```typescript
{
  // No parameters required; returns all FAQs
}
```

**Response** (HTTP 200 OK):
```json
{
  "faqs": [
    {
      "faqId": "FAQ-001",
      "category": "tier-qualification",
      "categoryLabel": "Tier Qualification",
      "question": "How do I qualify for each tier?",
      "answer": "Your tier is determined by your rolling 3-month average balance and active autopays...",
      "answerHtml": "<p>Your tier is determined by...</p><h3>Classic Tier</h3><p>Minimum: $2,500...</p>",
      "relatedFaqIds": ["FAQ-002", "FAQ-005"],
      "searchKeywords": ["qualify", "tier", "balance", "autopay", "rolling", "classic", "plus", "premium"],
      "updatedDate": "2026-02-01",
      "helpfulCount": 245,
      "unhelpfulCount": 12
    },
    {
      "faqId": "FAQ-002",
      "category": "tier-qualification",
      "categoryLabel": "Tier Qualification",
      "question": "What is a rolling 3-month average balance?",
      "answer": "Your rolling balance is calculated as the average of your account balance on the last day of each of the past 3 months...",
      "answerHtml": "<p>Your rolling balance is calculated...</p><table><tr><td>Month</td><td>Ending Balance</td></tr>...</table>",
      "relatedFaqIds": ["FAQ-001", "FAQ-003"],
      "searchKeywords": ["rolling balance", "average", "calculation", "3-month"],
      "updatedDate": "2026-02-01",
      "helpfulCount": 189,
      "unhelpfulCount": 8
    }
  ],
  "categories": [
    {
      "categoryId": "tier-qualification",
      "categoryLabel": "Tier Qualification",
      "faqCount": 8,
      "description": "How to qualify for each tier and understand tier requirements"
    },
    {
      "categoryId": "benefits-value",
      "categoryLabel": "Benefits & Value",
      "faqCount": 5,
      "description": "Understanding what benefits you get at each tier"
    }
  ]
}
```

#### GET /api/help/faq/search?q={query} (Search FAQ)

**Request**:
```typescript
{
  query: string;  // e.g., "autopay", "tier"
  limit?: number;  // default 10
}
```

**Response** (HTTP 200 OK):
```json
{
  "query": "autopay",
  "resultCount": 7,
  "results": [
    {
      "faqId": "FAQ-010",
      "question": "How many autopays do I need for each tier?",
      "preview": "Classic tier requires 0 active autopays. Plus tier requires 1 active autopay (loan, credit card, or bill payment). Premium tier requires 2 active autopays...",
      "relevanceScore": 0.95,
      "matchedKeywords": ["autopay"]
    }
  ]
}
```

#### GET /api/help/support-status (Check Support Availability)

**Response** (HTTP 200 OK):
```json
{
  "phone": {
    "number": "+1-800-BANK-CU",
    "isAvailable": true,
    "hoursToday": "8am-6pm ET",
    "nextAvailability": "8am ET"
  },
  "email": {
    "address": "support@creditunion.org",
    "isAvailable": true,
    "avgResponseTime": "24 hours"
  },
  "chat": {
    "isAvailable": false,
    "hoursToday": "9am-5pm ET",
    "nextAvailability": "tomorrow at 9am ET"
  }
}
```

### TypeScript Service Facade

**File**: `/lib/api.ts`

```typescript
export interface FAQItem {
  faqId: string;
  category: string;
  categoryLabel: string;
  question: string;
  answer: string;
  answerHtml: string;
  relatedFaqIds: string[];
  searchKeywords: string[];
  updatedDate: string;
  helpfulCount: number;
  unhelpfulCount: number;
}

export interface FAQCategory {
  categoryId: string;
  categoryLabel: string;
  faqCount: number;
  description: string;
}

export interface FAQResponse {
  faqs: FAQItem[];
  categories: FAQCategory[];
}

export interface SearchResult {
  faqId: string;
  question: string;
  preview: string;
  relevanceScore: number;
  matchedKeywords: string[];
}

export interface SearchResponse {
  query: string;
  resultCount: number;
  results: SearchResult[];
}

export interface SupportStatus {
  phone: {
    number: string;
    isAvailable: boolean;
    hoursToday: string;
    nextAvailability: string;
  };
  email: {
    address: string;
    isAvailable: boolean;
    avgResponseTime: string;
  };
  chat: {
    isAvailable: boolean;
    hoursToday: string;
    nextAvailability: string;
  };
}

// API functions
export async function getFAQItems(): Promise<FAQResponse> {
  const response = await fetch(`/api/help/faq`, { method: "GET" });
  if (!response.ok) throw new Error("Failed to fetch FAQs");
  return response.json();
}

export async function searchFAQ(query: string, limit: number = 10): Promise<SearchResponse> {
  const response = await fetch(
    `/api/help/faq/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    { method: "GET" }
  );
  if (!response.ok) throw new Error("Failed to search FAQs");
  return response.json();
}

export async function getSupportStatus(): Promise<SupportStatus> {
  const response = await fetch(`/api/help/support-status`, { method: "GET" });
  if (!response.ok) throw new Error("Failed to fetch support status");
  return response.json();
}
```

### Mock Data (Initial Development)

**File**: `/lib/api.ts` (mock implementation)

```typescript
const mockFAQs: FAQItem[] = [
  {
    faqId: "FAQ-001",
    category: "tier-qualification",
    categoryLabel: "Tier Qualification",
    question: "How do I qualify for each tier?",
    answer: "Your tier is determined by your rolling 3-month average balance and active autopays...",
    answerHtml: "<p>Your tier is determined...</p>",
    relatedFaqIds: ["FAQ-002"],
    searchKeywords: ["qualify", "tier", "balance", "autopay"],
    updatedDate: "2026-02-01",
    helpfulCount: 245,
    unhelpfulCount: 12
  }
];

export async function getFAQItems(): Promise<FAQResponse> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    faqs: mockFAQs,
    categories: [
      {
        categoryId: "tier-qualification",
        categoryLabel: "Tier Qualification",
        faqCount: 8,
        description: "How to qualify for each tier"
      }
    ]
  };
}

export async function searchFAQ(query: string): Promise<SearchResponse> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const results = mockFAQs.filter(faq =>
    faq.question.toLowerCase().includes(query.toLowerCase()) ||
    faq.searchKeywords.some(kw => kw.includes(query.toLowerCase()))
  );
  return {
    query,
    resultCount: results.length,
    results: results.map(r => ({
      faqId: r.faqId,
      question: r.question,
      preview: r.answer.substring(0, 150) + "...",
      relevanceScore: 0.9,
      matchedKeywords: r.searchKeywords.filter(kw => kw.includes(query.toLowerCase()))
    }))
  };
}

export async function getSupportStatus(): Promise<SupportStatus> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const now = new Date();
  const hour = now.getHours();
  return {
    phone: {
      number: "+1-800-BANK-CU",
      isAvailable: hour >= 8 && hour < 18,
      hoursToday: "8am-6pm ET",
      nextAvailability: hour < 8 ? "8am ET today" : "8am ET tomorrow"
    },
    email: {
      address: "support@creditunion.org",
      isAvailable: true,
      avgResponseTime: "24 hours"
    },
    chat: {
      isAvailable: hour >= 9 && hour < 17,
      hoursToday: "9am-5pm ET",
      nextAvailability: hour < 9 ? "9am ET today" : "9am ET tomorrow"
    }
  };
}
```

### Future API Endpoints (Production)

- **GET `/api/v1/help/faq`** — List all FAQs with categories
- **GET `/api/v1/help/faq/:faqId`** — Get single FAQ with related items
- **GET `/api/v1/help/faq/search`** — Full-text search across FAQs
- **POST `/api/v1/help/faq/:faqId/feedback`** — Record helpful/unhelpful votes for analytics
- **GET `/api/v1/help/support-status`** — Real-time support availability
- **POST `/api/v1/help/contact`** — Submit contact form (escalates to support system)

---

## 9. Validation Rules

### Search Input Validation

- **Query**: 2-50 characters, alphanumeric + spaces + hyphens
- **Query too short**: "Please enter at least 2 characters" warning
- **Query too long**: "Search limited to 50 characters" warning (auto-truncate)
- **Special characters**: Strip or replace (e.g., "&" → "and")
- **Empty search**: Clear input, reset to full FAQ list

### Contact Form Validation (if implemented)

- **Name**: Required, 2-50 characters
- **Email**: Required, valid email format (RFC 5322)
- **Message**: Required, 10-1000 characters
- **Submission**: Show success message "Thank you! We'll respond within 24 hours."

### Display Validation

- **FAQ answer**: If missing, show "Answer not available. Please contact support."
- **Related links**: If target FAQ doesn't exist, don't display link (remove silently)
- **Support availability**: If API fails, assume all channels available (display "Available now or during business hours")

---

## 10. Visual & Responsive Rules

### Design Tokens Applied

**Colors**:
- Search box: White background, light gray border (`#E5E7EB`), focus border blue (`#3B82F6`)
- FAQ headers: Dark text (`#111827`), light gray background on hover (`#F3F4F6`)
- Expanded answers: White background, subtle top border (`#D1D5DB`)
- Support cards: Background tier-color (gray, gold, silver depending on prominence), white text
- Links: Blue (`#3B82F6`), underline on hover
- Helpful/unhelpful feedback: Green (`#10B981`) and gray (`#6B7280`)

**Typography**:
- Page title: 28pt Bold
- Section headings (FAQ categories): 20pt Bold
- FAQ question: 16pt Bold (makes questions scannable)
- FAQ answer: 16pt Regular (WCAG AAA baseline)
- Support card heading: 18pt Bold
- Support card description: 14pt Regular
- Search placeholder: 16pt Regular, gray (`#6B7280`)

**Spacing**:
- Page padding: 16px mobile, 24px tablet/desktop
- Search box height: 48px (touch target)
- FAQ section margin-bottom: 24px
- FAQ item padding: 12px (vertical), 16px (horizontal) per item
- Support card margin: 12px bottom
- Between major sections: 32px

**Shadows**:
- Search box: Subtle shadow `0 1px 2px rgba(0,0,0,0.05)` (light elevation)
- Support cards: Medium shadow `0 4px 6px rgba(0,0,0,0.1)` (interactive feedback)
- FAQ expanded: Subtle top border `1px solid #D1D5DB` (visual separation)

### Responsive Breakpoints

**Mobile (320px–479px)**:
- Full-width search box (minus 16px padding)
- FAQ items displayed in single column
- Support cards stacked vertically
- FAQ question text: 16pt (may wrap to multiple lines)
- Section headings: 18pt

**Tablet (480px–1024px)**:
- Search box max-width 500px, centered
- FAQ items in single column (wider text lines)
- Support cards in 2-column grid (2 cards per row)
- Section headings: 20pt

**Desktop (1025px+)**:
- Search box max-width 700px, centered
- FAQ items in single column (constrained to 900px max-width)
- Support cards in 3-column grid
- Section headings: 20pt
- Answer text max-width 900px (prevents long lines)

### Touch Target Sizing

- **Search input**: 48px height minimum
- **Clear button**: 32×32px (within input, on right edge)
- **FAQ question header**: Full width, 48px+ height (clickable area)
- **Expand/collapse chevron**: 24×24px minimum
- **Support card button**: 48px height minimum
- **Link tap targets**: 44×44px minimum (adjacent links spaced 8px apart)

### Layout Behavior

- **Search box**: Sticky at top (fixed on scroll)
- **FAQ list**: Scrollable, search results overlay (not replace) FAQs
- **Support section**: Scrollable to, not sticky
- **Helpful/unhelpful votes**: Inline below answer (optional, doesn't interfere with reading)
- **Mobile overflow**: No horizontal scroll; all content fits viewport width

---

## 11. Accessibility Checklist

### Semantic HTML

- Page uses `<header>`, `<main>`, `<section>`, `<footer>` landmarks
- FAQ accordion uses `<details>` and `<summary>` OR custom div with button (with ARIA)
- Search input is semantic `<input type="search">`
- Support cards use semantic `<article>` or `<section>` with button CTAs
- FAQ answer contains `<h3>`, `<p>`, `<table>`, `<ul>` for structured content
- Links use semantic `<a>` tags (not styled `<div>`)

### ARIA Labels & Roles

- **Search input**: `aria-label="Search help topics"`, `aria-describedby="search-helper"`
- **Clear button**: `aria-label="Clear search"`, `aria-hidden="true"` if icon-only
- **FAQ accordion**: Implemented with Shadcn Accordion which provides `aria-expanded`, `aria-controls`
- **Search results region**: `role="region"`, `aria-live="polite"`, `aria-label="Search results"`
- **FAQ answer region**: `role="region"`, `aria-label="Answer for: [question text]"`
- **Support availability status**: `aria-label="Chat support is offline until 9am tomorrow"` (if not available)

### Focus Management & Indicators

- **Search input**: Focus on page load; blue 2px outline on focus
- **FAQ headers**: Keyboard accessible (Enter/Space to expand)
- **Search results**: Focus moves to first result when results appear
- **Support cards**: All buttons focusable with visible outline
- **Focus order**: Search → Results (if visible) → FAQ headers → Support cards → Footer links
- **Focus trap**: None; user can tab through entire page

### Color Contrast

- **FAQ question text**: 16pt Bold dark gray on white = **12:1 contrast** (WCAG AAA) ✅
- **FAQ answer text**: 16pt Regular dark gray on white = **12:1 contrast** ✅
- **Support card text**: White text on tier-colored background = **7:1 minimum** ✅
- **Links**: Blue (#3B82F6) on white = **4.5:1 contrast** (WCAG AA) ✅
- **Helpful/unhelpful icons**: Not color-alone; accompanied by text labels ✅
- **Search box border**: Gray (#E5E7EB) on white = **3.5:1 contrast** (acceptable for borders) ✅

### Text Alternatives

- **Search icon**: `aria-label="Search"` in button or hidden via CSS
- **Clear icon**: `aria-label="Clear search input"`
- **Expand/collapse chevron**: No alt needed (semantic button with text label)
- **Support category icons**: `aria-label="Phone support"`, etc.
- **PDF/document links**: `aria-label="Download FAQ as PDF (2.3 MB)"` if applicable

### Keyboard Navigation

- **Tab**: Move forward through focusable elements (search, FAQ headers, support cards)
- **Shift+Tab**: Move backward
- **Enter/Space**: Expand FAQ, activate buttons, follow links
- **Escape**: Close any open dropdowns or modals
- **No keyboard traps**: User can always tab away from any element

### Screen Reader Support

- **Page title**: "Help & Support - Credit Union Loyalty"
- **Landmarks announced**: "Navigation", "Main", "Region: Search results", "Region: Frequently Asked Questions", "Complementary"
- **Search input announced**: "Search help topics, search box"
- **FAQ header announced**: "How do I qualify for each tier?, button, expanded" (or "collapsed" if not expanded)
- **FAQ answer announced**: "Answer for How do I qualify for each tier?. Your tier is determined by... (full text)"
- **Support card announced**: "Phone support. Call us at 1-800-BANK-CU. Available 8am-6pm ET. Button"

### Mobile Accessibility (Touch)

- **Minimum tap target**: 48×48px (all buttons, FAQ headers, support cards)
- **Spacing between targets**: 8px minimum (no adjacent tiny buttons)
- **No hover-only content**: Mobile users can't hover; all interactive states accessible via tap
- **Search input**: Large 48px height, easy to tap on mobile
- **FAQ headers**: Full-width tap target (easy to expand/collapse)

### Cognitive Load Management

- **Simple language**: "Tier" not "Loyalty level", "autopay" not "automatic payment enrollment"
- **Short paragraphs**: FAQ answers broken into 2-3 line paragraphs (not dense walls of text)
- **Examples before rules**: Show "Example: You have $10K balance" before "Rolling balance calculation"
- **Visual hierarchy**: Question is largest, answer is readable but not overwhelming
- **One idea per section**: Don't combine multiple concepts in single answer (break into multiple FAQs if needed)

---

## 12. Telemetry

### Analytics Events

**Page Load**:
- `event: "page_view"`
- `page: "help"`
- `timestamp: ISO 8601`
- `userId: memberId`

**Search Initiated**:
- `event: "help_search"`
- `query: searchQuery`
- `timestamp: ISO 8601`

**Search Result Clicked**:
- `event: "help_search_result_click"`
- `faqId: selectedFAQ.id`
- `query: searchQuery`
- `resultPosition: 1-10` (which result in list was clicked)

**FAQ Expanded**:
- `event: "help_faq_expand"`
- `faqId: faqId`
- `category: categoryId`
- `timestamp: ISO 8601`

**FAQ Marked Helpful**:
- `event: "help_faq_helpful"`
- `faqId: faqId`
- `helpful: true`

**FAQ Marked Unhelpful**:
- `event: "help_faq_unhelpful"`
- `faqId: faqId`
- `helpful: false`

**Support Escalation**:
- `event: "help_escalation_click"`
- `escalationType: "phone" | "email" | "chat"`
- `faqSearchPrior: boolean` (did user search FAQ first?)
- `timestamp: ISO 8601`

**Contact Form Submitted**:
- `event: "help_contact_form_submit"`
- `channel: "email" | "form"`
- `timestamp: ISO 8601`

**Error State**:
- `event: "help_faq_load_error"`
- `errorCode: error.code`
- `timestamp: ISO 8601`

### Error Tracking

- Sentry or equivalent: Log API failures, search failures, malformed FAQ data
- Monitoring: Track FAQ load time (alert if > 1 second), search latency
- Dashboard: Monitor search query patterns (identify frequently searched topics, missing FAQs)
- Feedback: Track helpful/unhelpful votes to identify poor-quality answers

---

## 13. Open Questions & Assumptions

### Questions for Product/Design

1. **Search Result Highlighting**: Should matching keywords be highlighted in yellow/bold in search results? (Current: assumption yes)
2. **Related FAQ Links**: Should related FAQs open in same view or new tab? (Current: same view, scroll to item)
3. **FAQ Feedback Impact**: Should unhelpful votes trigger escalation to support, or just track analytics? (Current: assumption just track)
4. **Chat Widget Integration**: Should live chat be embedded in page or open in new window? (Current: assumption embedded if available)
5. **Detailed Examples**: Should tier qualification examples use real member scenarios or generic examples? (Current: generic to avoid privacy concerns)

### Assumptions

1. **FAQ content is static**: Content updated manually by admins; doesn't change during member session
2. **Search is full-text**: Search indexes question, answer, and keywords (not just titles)
3. **Support hours are fixed**: Assume 8am-6pm ET phone, 9am-5pm ET chat (configurable in API)
4. **Member is authenticated**: Help page visible to authenticated members (not anonymous)
5. **Mobile-first design**: Assume 375px width as primary breakpoint; support older phones (320px)
6. **English language only**: Initial launch English only (internationalization in Phase 2)
7. **No real-time search**: Search is not real-time autocomplete; results appear after debounce

---

## 14. Design Rationale (Three-Experts Synthesis)

**UX Lead Perspective**:
- FAQ search is prominently placed to maximize discoverability (first interaction on page)
- Search results overlay FAQs rather than replace them (user can switch between search and browse contexts)
- Expandable FAQ structure manages cognitive load (user controls information flow, not overwhelmed)
- Support escalation is visible but not dominant (self-service is primary, escalation is safety net)
- Real-dollar benefit examples in FAQ validate loyalty program (address PERSONA-04 skepticism)
- Accessibility baseline (16pt text, 7:1 contrast, 48px targets) ensures older demographic can access without barriers

**Frontend Architect Perspective**:
- FAQ data fetched server-side (page renders faster, improves SEO)
- Search is client-side filtering of FAQ data (no backend search call needed; faster user experience)
- Accordion component implemented with Shadcn (battle-tested, accessible, composable)
- FAQ answer content can include HTML (for tables, nested lists; sanitized on backend)
- Telemetry tracked for all search/click events to identify FAQ gaps
- Error states handled gracefully (fallback to contact support if FAQ load fails)

**Product/Delivery Perspective**:
- Help Center is P1 priority; launched in MVP to reduce support volume by 60-80% (target)
- FAQ content must be carefully written (subject-matter expert review required before launch)
- Search analytics will identify which topics members are searching for (informs Phase 2 FAQ updates)
- Helpful/unhelpful votes provide feedback on answer quality; low scores trigger review/rewrite
- Help Center supports key success metric: "11:1 self-service-to-support ratio" (70% of members find answer without calling)
- Help page is low-traffic relative to home/loyalty hub (secondary entry point), but high-value for retention

---

## 15. Cursor-Claude Ready Build Plan

### File Structure (to create)

```
app/help/
├── page.tsx                     # Help Center server component
├── layout.tsx                   # Help section layout (optional)
└── loading.tsx                  # Streaming skeleton UI

components/help/
├── HelpSearchRegion.tsx        # Search box + results region
├── SearchInput.tsx             # Search input with clear button
├── SearchResultsList.tsx       # List of search results
├── SearchResultItem.tsx        # Single search result item
├── FAQAccordionRegion.tsx      # FAQ accordion container
├── FAQCategory.tsx             # Collapsible FAQ category
├── FAQItem.tsx                 # Single FAQ item (question + expandable answer)
├── DefinitionTooltip.tsx       # Inline term definition tooltip
├── SupportEscalationRegion.tsx # Support contact cards
├── SupportCard.tsx             # Single support option card (phone, email, chat)
└── ContactForm.tsx             # Optional: Contact form for escalation

lib/
├── faq.ts                       # FAQ-specific utilities (search, filter, related items)
└── (existing: api.ts, types.ts, utils.ts)

tests/help/
├── search.test.tsx             # Search input and results
├── faq-accordion.test.tsx      # FAQ expand/collapse
├── support-cards.test.tsx      # Support card rendering and availability
└── help-page.test.tsx          # Full page integration test
```

### Mock Setup

1. **Create mock FAQ data** in `lib/api.ts` with 25-30 hardcoded FAQItem objects
2. **Create mock search function** that filters FAQs by keyword matching (client-side)
3. **Create mock support status** that returns availability based on current hour
4. **Provide 2 scenarios**: All support channels available (business hours), some offline (after hours)

### Test Stubs (to implement)

```typescript
// tests/help/help-page.test.tsx
describe("Help Center", () => {
  test("renders search input with placeholder", () => {
    // Render <Page />
    // Assert: search input visible
    // Assert: placeholder text "Search FAQs..."
  });

  test("displays FAQ accordion with categories expanded/collapsed", () => {
    // Render page
    // Assert: first FAQ category expanded by default
    // Assert: other categories collapsed
    // Assert: expand/collapse icons visible
  });

  test("searches FAQs by keyword", async () => {
    // Render page
    // Type "autopay" in search
    // Assert: results appear within 500ms
    // Assert: only matching FAQs shown
    // Assert: keyword highlighted in results
  });

  test("expands FAQ item on click", async () => {
    // Render page
    // Click on FAQ question
    // Assert: answer text visible
    // Assert: expand icon changes direction
  });

  test("shows support escalation options at bottom", () => {
    // Render page
    // Assert: phone support card visible
    // Assert: email support card visible
    // Assert: chat support card visible (enabled/disabled based on hours)
  });

  test("handles FAQ load error gracefully", () => {
    // Mock API to return error
    // Render page
    // Assert: error message displayed
    // Assert: support escalation still visible
  });

  test("navigates to related FAQ on link click", () => {
    // Expand FAQ with related links
    // Click related link
    // Assert: page scrolls to related FAQ
    // Assert: related FAQ expands
  });

  test("marks FAQ as helpful", () => {
    // Render expanded FAQ
    // Click "Helpful" button
    // Assert: button changes state (e.g., filled heart)
    // Assert: telemetry event tracked
  });
});
```

### Component Build Checklist

- [ ] Create `app/help/page.tsx` (server component, fetch FAQs and support status)
- [ ] Create `components/help/HelpSearchRegion.tsx` (search + results container)
- [ ] Create `components/help/SearchInput.tsx` (search input with debounce and clear)
- [ ] Create `components/help/SearchResultsList.tsx` (results list with no-results state)
- [ ] Create `components/help/FAQAccordionRegion.tsx` (accordion container with categories)
- [ ] Create `components/help/FAQItem.tsx` (question + expandable answer)
- [ ] Create `components/help/DefinitionTooltip.tsx` (hover/click tooltip for terms)
- [ ] Create `components/help/SupportEscalationRegion.tsx` (support cards container)
- [ ] Create `components/help/SupportCard.tsx` (phone/email/chat card)
- [ ] Implement `lib/faq.ts` with search, filter, related FAQ logic
- [ ] Implement mock FAQ data in `lib/api.ts` (25-30 items)
- [ ] Add Tailwind styling (colors, spacing, responsive breakpoints)
- [ ] Implement keyboard navigation (Tab, Enter, Escape)
- [ ] Add ARIA labels and roles (search region, FAQ regions, buttons)
- [ ] Implement focus management (search input focus on load)
- [ ] Test color contrast (all text 7:1+ against background)
- [ ] Test touch targets (all clickable areas 48×48px minimum)
- [ ] Create unit tests for search, FAQ expansion, support status
- [ ] Create integration tests for full page flow
- [ ] Deploy to staging for QA and accessibility audit

---

✅ **SHARD 07: Help / Support Center — Build-Ready Specification**

**Full specification document**: See [04-prd.md](../04-prd.md) (Feature Requirements), [05-ux-spec.md](../05-ux-spec.md) (Interaction Design), [06-dev-spec.md](../06-dev-spec.md) (Technical Architecture)

**Handoff**: This shard is ready for frontend engineer to build using Next.js 14 + Shadcn + Tailwind. Follow Cursor-Claude Ready Build Plan (section 15) for file structure, component setup, and test stubs.
