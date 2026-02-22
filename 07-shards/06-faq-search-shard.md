# Shard 06: FAQ & Search

**Build Priority**: P1 | **Estimated Effort**: 14 hours | **Screen ID**: SCR-06 | **Route**: `/loyalty/faq`

## 1. Screen Name & Route

FAQ & Search | `/loyalty/faq` | Breadcrumb: Home > Loyalty > FAQ

## 2. Purpose & Jobs-to-be-Done

Provide self-service access to 25–30 FAQ questions across categories (Qualification, Benefits, Retrogression, Legacy Migration, Troubleshooting) with full-text search, visual explanations, and progressive disclosure (expandable answers).

**Jobs**: (1) Find answers without contacting support, (2) Understand complex concepts (rolling balance, tier calculation), (3) Reduce cognitive load

## 3. User Stories & Acceptance Criteria

### Story 1: Overwhelmed Member Searches for Quick Answer

**As an** overwhelmed member (PERSONA-03)
**I want to** search "rolling balance" and see answer immediately
**So that** I don't get confused or have to navigate

**Given** I navigate to FAQ page
**When** I type "rolling balance" in search
**Then** I see:
- Search results: 3–5 questions containing "rolling balance"
- Example result: "What is a rolling balance?" with preview of answer
- Click result → Answer expands inline
- Answer includes plain-language explanation + visual diagram (3-month example)
- Related questions shown at bottom: "How is my tier calculated?", "When does my tier change?"

**And** search is full-text (searches question + answer + keywords)

---

### Story 2: Member Browses FAQ by Category

**As a** member wanting to explore FAQ without search
**I want to** see categories (Qualification, Benefits, etc.) and browse questions
**So that** I discover answers I didn't know to ask

**Given** I navigate to FAQ page
**When** I click category "Tier Qualification"
**Then** I see:
- Filtered list of 5–8 questions in category:
  - "How is my tier calculated?"
  - "What's a rolling balance?"
  - "Can I have multiple autopays?"
  - "What happens if I remove an autopay?"
  - "When does my tier change?"
- Each question shows preview of answer (first 2 sentences)
- Click question → Answer expands inline with full details

**And** categories are visually distinct (tabs or buttons)

---

### Story 3: Member Finds Visual Explanation for Complex Concept

**As a** visual learner (PERSONA-03)
**I want to** see diagram explaining rolling balance calculation
**So that** I understand the concept without reading dense text

**Given** I view answer to "What is a rolling balance?"
**When** I expand the answer
**Then** I see:
- Text answer: Plain language explanation
- Visual diagram: 3-month calendar showing last-day-of-month balances
  - Jan 31: $2,600
  - Feb 28: $2,500
  - Mar 31: $2,400
  - Average: $2,500 ✓ Qualifies for Classic
- Example with member's actual data (if available): "Your rolling balance is $14,500"
- Link to detailed example: "See how your rolling balance is calculated" → Account Status Detail

**And** diagram uses actual member data when available

---

### Story 4: Legacy Member Finds Program Change Explanation

**As a** member migrated from old program
**I want to** understand what changed and why threshold is higher
**So that** I don't feel the program is unfair

**Given** I navigate to FAQ page and select category "Legacy Program Migration"
**When** I view questions
**Then** I see:
- "Why did the program change?" — Explanation of improvements
- "Why are the new tier thresholds higher?" — Explanation of tier redesign with real-dollar benefit comparison
  - Old: $500 → New: $2,500 (higher, but benefits worth $145/year vs. $25/year)
- "Am I losing any benefits?" — Comparison table showing old vs. new benefits
- "What if I don't qualify for my old tier level?" — Guidance on re-qualifying or staying in Classic
- "Can I go back to the old program?" — Clear "no, program migrated" answer with reassurance

**And** tone is transparent and supportive (acknowledges perception of "downgrade")

---

## 4. States

- **Default**: All FAQs loaded, search box ready for input, categories visible (e.g., "All" selected)
- **Search Active**: User typing in search box, live results appearing below
  - Search loading (if using API): Show spinner next to search input ("Searching...", max 500ms then results shown)
  - Search instant (if using fuse.js): Results appear immediately (< 50ms latency, no loading state needed for MVP)
- **Search Results**: Filtered FAQ list displayed with search terms highlighted, no. of results shown ("X results for 'query'")
- **No Results**: "No FAQs match 'xyz'. Try different keywords or browse by category."
- **Empty Category**: If category selected but no FAQs in it (should not happen with current categories): "No FAQs in this category yet."
- **Loading FAQ List** (on page load): Skeleton screens for 5-8 accordion items (animated placeholder bars)
- **Error Loading FAQs**: "Unable to load FAQs. Please contact support." with retry button
- **Helpful Vote Success**: "Thanks for your feedback!" (optional 2-second toast notification)
- **Offline**: If localStorage cleared and offline, show cached FAQ list with "Offline mode" badge (Phase 2)

---

## 5. Information Architecture

**Search Region** (prominent, at top):
- Search input: "Search FAQs..." (48px height, ≥48×48px tap target)
- Live results: As user types, matching questions appear below
- Clear button: "X" to clear search and show all FAQs

**Category Navigation** (tabs or buttons):
- "All" (default) | "Tier Qualification" | "Benefits" | "Retrogression" | "Legacy Migration" | "Troubleshooting"
- Active category highlighted
- Mobile: Scrollable tab bar or dropdown selector

**FAQ List Region** (expandable accordion):
- For each question in selected category:
  - Question text (16pt Bold, clickable)
  - Preview of answer (2 sentences, secondary text)
  - Expand/collapse icon (chevron)
  - Number of votes: "[●●●●●] 47 people found this helpful"
- Click question → Answer expands inline
- Expanded answer can include:
  - Plain-language explanation
  - Visual diagram (if applicable)
  - Real-world example (with member data if available)
  - Related questions link

**Related Questions Section** (at bottom of expanded answer):
- "People also ask:"
- List 3 related questions as links
- Click → Jump to that question in same page

**Support CTA Section** (at bottom):
- "Didn't find your answer?"
- "Contact Support" button → Help / Support Page (SCR-07)
- "Email us" or "Chat with us" options

---

## 6. Components & Responsibilities

**Page Component** (`app/loyalty/faq/page.tsx`):
- Server-render: Load FAQ list from `/lib/faqData.ts` (static JSON, no API call needed for MVP)
- Pass FAQ data to SearchFAQ component
- Handle loading state (skeleton accordion items)
- Implement telemetry: Track page view

**SearchFAQ** (client):
- **Purpose**: Full-text search input with live results as user types
- **Props**:
  - `faqs: FAQItem[]` (all FAQs to search against)
  - `searchQuery: string` (current search value)
  - `onSearch: (query: string) => void` (callback when search input changes)
  - `searchResults: FAQItem[]` (results from search)
  - `loading: boolean` (search is executing; for MVP this is instant)
- **Search Implementation** (CRITICAL FOR MVP):
  - **Recommended**: Client-side full-text search using **fuse.js** library
    - Load all FAQs in JSON on page load (typically < 50KB)
    - Use Fuse.js options: `{ keys: ['question', 'answer', 'keywords'], threshold: 0.3 }`
    - Search latency: < 50ms for instant user feedback
    - Pros: Fast, no server dependency, works offline
    - Cons: All FAQs must fit in browser memory (not scalable beyond 10,000+ questions)
  - **Alternative**: Backend API search (for future scale)
    - POST `/api/faqs/search` with `{ query, category? }`
    - Return top 10 results with highlighting
    - Latency: 200-500ms (needs debouncing at 300ms)
    - Pros: Scalable, can use Elasticsearch
    - Cons: Requires server component/API integration
  - **MVP Decision**: Use client-side fuse.js (fast, simple, offline-capable)
- **States**:
  - Default: Empty search input, shows category navigation and full FAQ list
  - Typing: Input focused, live results appear below input as user types (no Enter required)
  - Results: Display matching FAQs, highlight search terms
  - No Results: "No FAQs match 'xyz'. Try different keywords or browse by category."
  - Loading (optional, MVP = instant): Show spinner while search executes
- **UI/UX**:
  - Input: Full-width on mobile, max-width 600px on desktop, 48px height with padding
  - Results: Appear below input in same page (not modal)
  - Highlighting: Search terms highlighted in yellow or bold in results
  - Clear button: "X" icon clears search and shows full FAQ list
  - Result limit: Show up to 10 results; if more, show "See more results" link (optional; Phase 2)
- **Keyboard Navigation**:
  - Tab: Focus search input
  - Type: Live results appear
  - Down arrow: Navigate through results (optional; Tab works too)
  - Enter: Jump to selected result or first result
  - Escape: Clear search and focus input
- **Accessibility**:
  - Input: Semantic `<input type="search">` with `aria-label="Search FAQs"`
  - Live region: `aria-live="polite" aria-label="Search results"` announces results as user types
  - Results: Use semantic `<ul>` with proper heading hierarchy
- **Telemetry**: Fire `faq_search` event with searchTerm and resultCount

**FAQAccordion** (client):
- **Purpose**: Display list of FAQ items as expandable accordion with state management
- **Props**:
  - `faqItems: FAQItem[]` (FAQ items to display)
  - `categoryFilter: string` (current selected category: "all" | "qualification" | "benefits" | "retrogression" | "legacy-migration" | "troubleshooting")
  - `expandedItems: Set<string>` (set of expanded FAQ IDs for state management)
  - `onToggleExpand: (faqId: string) => void` (callback when item expanded/collapsed)
  - `searchTerm?: string` (if from search, for result highlighting)
- **States**:
  - Default: All items collapsed, preview of answer showing (first 2 sentences)
  - Expanded: Full answer visible, related questions shown, helpful voting UI visible
  - Empty category: "No FAQs in this category yet."
- **Rendering**:
  - Desktop: Single-column list, full-width
  - Mobile: Single-column, stacked
  - Each item: Question heading (16pt Bold, clickable), preview text (14pt, gray), expand icon (chevron)
- **Animation**:
  - Expand: 200ms smooth height transition, no layout shift
  - Chevron: Rotate 180° on expand
- **Accessibility**:
  - Items use semantic HTML: `<details>` and `<summary>` elements (native, accessible)
  - Fallback: If not using `<details>`, use `aria-expanded` on button role items
  - All FAQ items focusable with Tab
  - Enter/Space to expand/collapse
- **Telemetry**: Fire `faq_expand` when item expanded

**FAQItem** (client):
- **Purpose**: Single FAQ item with question, expandable answer, visual diagrams, and helpful voting
- **Props**:
  - `faq: FAQItem` (full FAQ object: question, answer, category, visualization, relatedFaqIds)
  - `expanded: boolean` (is this item expanded?)
  - `onToggle: () => void` (callback to toggle expand)
  - `onHelpful: (faqId: string, isHelpful: boolean) => void` (callback for helpful voting)
  - `searchTerm?: string` (for highlighting search terms in answer)
- **States**:
  - Collapsed: Show question only, preview of answer (first 2 sentences), expand icon
  - Expanded: Show full answer, visualization (if applicable), related questions, helpful voting UI
  - Voting: "Was this helpful?" with thumbs up/down or yes/no buttons
- **Helpful Voting UI** (CRITICAL - was missing in original):
  - **UI Pattern**: Thumbs up/down buttons (visually simpler than yes/no for older demographic)
    - Thumbs up: Green color (#10B981)
    - Thumbs down: Red color (#EF4444)
    - Button size: 48×48px (meets touch target minimum)
  - **Location**: At bottom of expanded answer, after "Related questions" section
  - **Label**: "Was this FAQ helpful?" (plain language)
  - **Behavior**:
    - Member clicks thumbs up or down
    - Selected button highlights (filled/solid state)
    - Button becomes disabled (one vote per session)
    - Show feedback: "Thanks for your feedback!" (optional)
  - **Persistence**:
    - Vote stored in localStorage under key `faq_helpful_${faqId}` (session-scoped for MVP; can add server sync in Phase 2)
    - On page reload, show voted state (disable buttons if already voted in this session)
    - Server-side: Aggregate votes for analytics (show "X people found this helpful" count, sent via telemetry)
  - **Data Sent to Backend**: Via telemetry event `faq_helpful_vote` with faqId and isHelpful flag
  - **Example UI**:
    ```
    Was this FAQ helpful?
    [👍] [👎]
    ```
- **Visual Diagram** (if applicable):
  - Render FAQVisualization component if FAQ has visualization type
  - Example: "What is a rolling balance?" includes 3-month calendar diagram
  - Link: Optional "See diagram" or "View example" link if diagram is collapsible
- **Related Questions**:
  - Show at bottom of expanded answer
  - Label: "People also ask:"
  - List: 3 related FAQs as links
  - Click related FAQ: Jump to that FAQ on same page (scroll + auto-expand)
  - Related FAQ IDs come from `faq.relatedFaqIds` array
- **Rendering**:
  - Desktop: Full-width card or list item with padding
  - Mobile: Full-width, stacked with other items
  - Answer text: 16pt, high contrast (7:1)
  - Visualization: Responsive, scales to container
- **Accessibility**:
  - Semantic HTML: `<details>`/`<summary>` or `<button>` with `aria-expanded`
  - All buttons (expand, helpful voting, related links) have aria-label
  - Visualization has alt text or aria-label
  - Diagram: Accompanied by text description for screen readers
  - Focus indicators: 4px outline on all focusable elements
- **Telemetry**:
  - `faq_expand`: Fire when item expanded
  - `faq_helpful_vote`: Fire when thumbs up/down clicked with isHelpful and faqId
  - `faq_related_click`: Fire when member clicks related question link

**FAQVisualization** (client, conditional):
- **Purpose**: Render visual diagrams and explanations (rolling balance, tier flowchart, autopay rules)
- **Props**:
  - `type: 'rolling-balance' | 'tier-flowchart' | 'autopay-rules'` (diagram type; extensible for future types)
  - `data: object` (diagram-specific data: e.g., { months, balances } for rolling-balance)
  - `memberData?: object` (optional: member's actual data to show in example: e.g., { memberBalance, rollingBalance })
- **Supported Types**:
  - **rolling-balance-diagram**:
    - Shows 3-month calendar with last-day-of-month balances
    - Example: Jan 31 $2,600 | Feb 28 $2,500 | Mar 31 $2,400 → Average $2,500
    - If memberData provided, show member's actual rolling balance: "Your rolling balance: $14,500"
    - Rendering: SVG or semantic HTML table (accessible)
  - **tier-flowchart** (future):
    - Shows tier progression: Balance + Autopay → Tier
    - Example: "$10,000+ balance + 2 autopays → Plus tier"
    - Rendering: SVG flowchart or simple HTML boxes
  - **autopay-rules** (future):
    - Shows autopay limits by tier: Classic (no limit), Plus (2 max), Premium (3 max)
    - Rendering: Table or icon grid
- **Accessibility**:
  - SVG: Must have `role="img"` and descriptive `aria-label` or `<title>` element
  - Text description: Always provide text alternative (e.g., "3-month rolling balance is the average of end-of-month balances")
  - Color: Not sole distinguishing feature; use patterns or labels too
  - Contrast: Diagram background and foreground must meet 4.5:1 minimum
- **Responsiveness**:
  - Desktop: Maintain aspect ratio, centered
  - Mobile: Scale to full-width, adjust layout if needed (e.g., calendar becomes stacked)
  - Diagram should never overflow or require horizontal scroll
- **Example Implementation**:
  ```html
  <figure aria-label="Rolling balance calculation diagram">
    <svg><!-- 3-month calendar visualization --></svg>
    <figcaption>
      Your rolling balance is the average of your balance on the last day
      of each month for the past 3 months.
      Jan 31: $2,600 | Feb 28: $2,500 | Mar 31: $2,400
      Average: $2,500 (qualifies for Classic tier)
    </figcaption>
  </figure>
  ```
- **Telemetry**: Fire `faq_visualization_viewed` when diagram first rendered

---

## 7. Interactions

**Search Interactions**:
- Type in search input → Live results appear immediately (no Enter required; MVP uses fuse.js with < 50ms latency)
  - Results update on every keystroke
  - Search is full-text: searches question + answer + keywords fields
  - Search is case-insensitive and matches partial words (e.g., "rolling" matches "rolling balance")
  - Search terms are highlighted in yellow or bold in results
  - Example: Type "autopay" → Results: "Can I have multiple autopays?", "What happens if I remove an autopay?", etc.
  - Results appear below search input in same page (not modal)
  - Limit to 10 results on initial display; if more, show "[See X more results]" link (optional; Phase 2)
- Clear search:
  - Click "X" button in search input → Clear search, show full FAQ list again
  - Keyboard Escape: Clear search, refocus input
  - Keyboard Backspace (if empty): Clear search
- Search result selection:
  - Click result FAQ → Expand that FAQ in accordion below
  - Keyboard Down Arrow: Navigate through results (optional; Tab also works)
  - Keyboard Enter: Jump to and expand first result
- No results state:
  - If no FAQs match search: Show "No FAQs match 'xyz'. Try different keywords or browse by category."
  - Suggest: Browse by category instead

**Category Navigation Interactions**:
- Click category tab (Qualification, Benefits, Retrogression, Legacy Migration, Troubleshooting):
  - Filter FAQ list to show only FAQs in that category
  - Clear any active search (or filter search results by category if both active)
  - Scroll to FAQ list region
  - Animation: Smooth content transition (200ms fade)
- Active category: Highlighted tab (bold, underline, or background color)
- Mobile: Tabs may scroll horizontally if space limited, or dropdown selector

**FAQ Accordion Interactions**:
- Click question (or expand icon chevron):
  - Expand to show full answer, diagram (if applicable), related questions, helpful voting
  - Animation: 200ms smooth height transition
  - Chevron icon rotates 180°
- Click expanded question again:
  - Collapse answer, return to preview view
  - Animation: 200ms collapse height transition
- Keyboard:
  - Tab: Navigate through questions (focus on question text or expand button)
  - Enter/Space: Expand/collapse question
  - Escape: Collapse all expanded items (optional; user can collapse individually)
- Touch:
  - Single tap: Expand/collapse question
  - Min 48×48px tap target for expand area

**Helpful Voting Interactions**:
- Question is expanded, answer visible
- At bottom of answer, see: "Was this FAQ helpful?"
- Click thumbs up (👍) button:
  - Button highlights/fills (green, #10B981)
  - Button becomes disabled (grayed out)
  - Show feedback: "Thanks for your feedback!" (optional, 2-second toast)
  - Vote stored in localStorage under `faq_helpful_${faqId}`
  - Telemetry: Fire `faq_helpful_vote: { faqId, isHelpful: true }`
- Click thumbs down (👎) button:
  - Button highlights/fills (red, #EF4444)
  - Button becomes disabled
  - Show optional feedback: "We'll use your feedback to improve." (optional)
  - Vote stored in localStorage
  - Telemetry: Fire `faq_helpful_vote: { faqId, isHelpful: false }`
- Already voted in session:
  - Buttons remain disabled/filled, showing previous vote
  - Tooltip on hover: "You've already voted on this question"
- Page reload:
  - Recover vote from localStorage, show same disabled state
  - Allow new vote if localStorage cleared or new session

**Related Questions Interactions**:
- At bottom of expanded answer, see: "People also ask:"
- Listed as links (blue, underline on hover)
- Click related question link:
  - Scroll to that FAQ item in accordion (smooth scroll)
  - Auto-expand that FAQ item
  - Telemetry: Fire `faq_related_click: { relatedFaqId }`

**Support Escalation**:
- At bottom of FAQ page, see: "Didn't find your answer?" section
- Click "Contact Support" button:
  - Navigate to `/help` or support page (SCR-07)
  - Optional: Pass referrer context: `/help?from=faq&category=qualification`
- Click "Email us" or "Chat with us" (if available):
  - Open email client or chat widget
  - Pre-populate subject: "Question about [category]" (optional)

**Keyboard Navigation Summary**:
- Tab: Move focus through search input, category tabs, FAQ questions, helpful buttons, related links, support CTA
- Enter: Activate buttons, expand FAQs, navigate to results
- Space: Expand/collapse FAQs, vote helpful
- Escape: Clear search or collapse FAQ
- Down arrow: Navigate search results (optional)
- Ctrl+F: Browser find-in-page (standard behavior; our search supplements this)

---

## 8. Data Contracts

### GET /api/faqs?category=qualification&search=rolling

```json
{
  "faqs": [
    {
      "faqId": "FAQ-001",
      "question": "What is a rolling balance?",
      "answer": "Your rolling balance is the average of your account balance on the last day of each month for the past 3 months...",
      "category": "qualification",
      "keywords": ["rolling", "balance", "calculation", "3-month"],
      "visualization": {
        "type": "rolling-balance-diagram",
        "description": "3-month calendar showing last-day-of-month balances"
      },
      "relatedFaqIds": ["FAQ-002", "FAQ-003"],
      "helpfulVotes": 47,
      "totalVotes": 50
    }
  ],
  "totalResults": 5,
  "category": "qualification"
}
```

---

## 9. Validation Rules

**FAQ Content Validation**:
- All FAQ questions must have non-empty text (min 10 characters)
- All FAQ answers must have non-empty text (min 20 characters)
- Category must be one of: "qualification" | "benefits" | "retrogression" | "legacy-migration" | "troubleshooting"
- Keywords array must have at least 1 keyword, max 10 (too many = poor search relevance)
- relatedFaqIds must reference valid FAQ IDs (cross-references must exist)
- relatedFaqIds should not include self-reference (FAQ should not be related to itself)
- visualizationType must be one of: "rolling-balance-diagram" | "tier-flowchart" | "autopay-rules" | null (if no visualization)

**Search Validation**:
- Search query must be 1-100 characters (trim whitespace)
- Search is case-insensitive (always convert to lowercase before matching)
- Search matches partial words (e.g., "rolling" matches "rolling balance")
- Search matches both question and answer text (not just question)
- Search matches keywords field (custom search terms added by content team)
- Fuse.js threshold: 0.3 (allows ~30% character difference; tune if needed)
- Results must be ordered by relevance score (Fuse.js default; highest scores first)
- Results limit: Show 10 on initial display; if > 10, show "[See X more results]" link (Phase 2)

**Category Filtering Validation**:
- Category filter must be one of defined categories OR "all" (show all FAQs)
- If category is "all", show FAQs from all categories
- If category is specific, show only FAQs with that category value
- Category filter can be combined with search (search within category results)

**Helpful Voting Validation**:
- Vote must be boolean (true = helpful, false = not helpful)
- Vote is stored per FAQ per session (localStorage key: `faq_helpful_${faqId}`)
- One vote per FAQ per session (buttons disabled after vote)
- Votes are persisted in localStorage (survive page reload within same session)
- Votes are cleared on new browser session (localStorage not permanent for votes; optional server sync Phase 2)
- Helpful vote count (aggregated): Must be ≤ totalVotes (sanity check on API data)

**Visualization Validation**:
- If visualization type is "rolling-balance-diagram", data must include: months (array), balances (array)
  - months array must have 3 elements (Jan, Feb, Mar or equivalent)
  - balances array must have 3 elements (one per month)
  - Balances must be ≥ $0
- If visualization type is "tier-flowchart", data must be parseable and render without errors
- If visualization type is "autopay-rules", data must define rules for each tier
- All visualization SVGs must have alt text or aria-label (accessibility requirement)
- Visualization data should not contain member PII (only aggregated or anonymized examples)

**Content Format Validation** (FAQ answer format):
- **Recommended Format**: Markdown (plan to support; not required for MVP)
  - Answer text can be plain text, Markdown, or HTML
  - For MVP: Plain text + optional Markdown emphasis (bold, italic, links)
  - Render as: HTML (convert Markdown to HTML safely; use markdown-it or similar)
  - Links in answers: Must be safe (no javascript: protocol)
  - Code blocks: If included, must be syntax-highlighted (optional; not critical for FAQ)
- **HTML Safety**: If answers contain HTML, sanitize (use DOMPurify or similar)
  - Allow: `<b>`, `<i>`, `<a>`, `<p>`, `<ul>`, `<li>`, `<table>`, `<tr>`, `<td>`
  - Disallow: `<script>`, `<iframe>`, event handlers (onclick, etc.)
  - Links must have `rel="noopener noreferrer"` and open in new tab

**Cross-Validation**:
- Total FAQ count must be 25-30 (scope target; alert if < 20 or > 50)
- Each category must have 4-8 FAQs (distribution check):
  - Qualification: 5-6 FAQs (core tier concept)
  - Benefits: 5-6 FAQs (explain 3 benefit types)
  - Retrogression: 4-5 FAQs (grace period, recovery)
  - Legacy Migration: 3-4 FAQs (program change education)
  - Troubleshooting: 4-5 FAQs (common issues)
- If a category has < 3 FAQs, flag as underserved

**Data Freshness** (future consideration):
- FAQ content should be reviewed/updated quarterly
- FAQ helpful voting should be monitored: if FAQ has < 30% helpful rate, flag for review
- Related FAQ links should be verified (no broken references)

---

## 10. Visual & Responsive Rules

- Search input: Full-width on mobile, constrained to 600px on desktop
- FAQ list: Single column mobile, 2 columns optional on desktop
- Expanded answer: Smooth animation (250ms), no layout shift
- Diagram: Responsive SVG, scales to container
- Links in answers: Blue (#3B82F6), underline on hover

---

## 11. Accessibility Checklist

- Search input: Semantic `<input type="search">` with `aria-label`
- Live region: `aria-live="polite"` announces results as user types
- Expandable items: `aria-expanded`, `aria-controls`
- Diagrams: Accompanied by `alt` text or `aria-label` (not visual-only)
- All text: ≥16pt, 4.5:1 contrast minimum
- Keyboard: Tab through questions, Enter to expand, Escape to collapse

---

## 12. Telemetry

**Event 1: Page View**
- `event: "faq_page_view"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "timestamp": "2026-02-21T14:30:00Z"
  }
  ```
- Fired: On page load
- Use case: Track FAQ page traffic

**Event 2: Search**
- `event: "faq_search"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "searchTerm": "rolling balance",
    "resultCount": 3,
    "searchDuration_ms": 45,
    "timestamp": "2026-02-21T14:30:10Z"
  }
  ```
- Fired: After user types search query and results are displayed (debounced; fire ~500ms after last keystroke)
- Use case: Track search queries to identify FAQ gaps and user question patterns

**Event 3: Category Filter**
- `event: "faq_category_filter"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "category": "qualification" | "benefits" | "retrogression" | "legacy-migration" | "troubleshooting" | "all",
    "faqCountInCategory": 6,
    "timestamp": "2026-02-21T14:30:15Z"
  }
  ```
- Fired: When user clicks category tab
- Use case: Track category popularity; identify if certain categories are overused/underused

**Event 4: FAQ Expanded**
- `event: "faq_expand"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "faqId": "FAQ-001",
    "question": "What is a rolling balance?",
    "category": "qualification",
    "expandedFromSearch": true,
    "expandedFromCategory": false,
    "timestamp": "2026-02-21T14:30:20Z"
  }
  ```
- Fired: When user clicks to expand FAQ answer
- Use case: Track which FAQs are most viewed; identify if members find answers efficiently

**Event 5: Helpful Vote**
- `event: "faq_helpful_vote"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "faqId": "FAQ-001",
    "isHelpful": true,
    "question": "What is a rolling balance?",
    "category": "qualification",
    "timestamp": "2026-02-21T14:30:25Z"
  }
  ```
- Fired: When user clicks thumbs up or thumbs down
- Use case: Aggregate helpful votes to identify high-quality FAQs; flag low-helpful FAQs for review

**Event 6: Related FAQ Click**
- `event: "faq_related_click"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "fromFaqId": "FAQ-001",
    "toFaqId": "FAQ-002",
    "timestamp": "2026-02-21T14:30:30Z"
  }
  ```
- Fired: When user clicks "People also ask" related question link
- Use case: Track FAQ discovery patterns; validate that related FAQ links are relevant

**Event 7: Support Escalation**
- `event: "faq_to_support_click"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "lastSearchTerm": "rolling balance",
    "escalationReason": "did_not_find_answer" | "wanted_to_chat",
    "timestamp": "2026-02-21T14:30:35Z"
  }
  ```
- Fired: When user clicks "Contact Support" or "Chat with us"
- Use case: Track support escalation rate; identify when FAQ coverage is insufficient

**Event 8: Visualization Viewed**
- `event: "faq_visualization_viewed"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "faqId": "FAQ-001",
    "visualizationType": "rolling-balance-diagram",
    "timestamp": "2026-02-21T14:30:40Z"
  }
  ```
- Fired: When FAQ with visualization is expanded and diagram is rendered
- Use case: Track which visualizations help members understand complex concepts

**Event 9: Error Occurred**
- `event: "faq_page_error"`
- Payload:
  ```json
  {
    "userId": "MEMBER-001",
    "errorType": "search_failed" | "faq_load_failed" | "visualization_render_failed",
    "errorMessage": "Failed to render rolling balance diagram",
    "timestamp": "2026-02-21T14:30:45Z"
  }
  ```
- Fired: When FAQ data fails to load or diagram fails to render
- Use case: Track system health and technical issues

---

## 13. Open Questions & Assumptions

1. Should FAQ items have helpful voting? (Current: yes, supports iterative improvement)
2. How many categories is too many? (Current: 5 categories, manageable)

---

## 14. Design Rationale

**UX Lead**: Self-service FAQ reduces support volume and member frustration; full-text search enables quick discovery; visual diagrams support multiple learning styles; helpful voting informs content prioritization.

**Frontend Architect**: FAQ list server-renders from content database; search is client-side (JSON dataset or API call); accordion component is reusable from Tier Details page.

**Product/Delivery**: FAQ page supports PERSONA-03 overwhelmed goal (self-service support without friction); target 80% of common questions answerable from FAQ (measure via support escalation rate); helpful voting data informs phase 2 content expansion.

---

## 15. Cursor-Claude Ready Build Plan

### File Structure

```
app/loyalty/faq/
├── page.tsx                          # Server component (main page)
└── components/
    ├── SearchFAQ.tsx                 # Search input + live results
    ├── FAQAccordion.tsx              # FAQ list with accordion
    ├── FAQItem.tsx                   # Single FAQ item with expand/vote
    └── FAQVisualization.tsx          # Diagrams (rolling balance, tier flowchart, autopay rules)

lib/
├── faqData.ts                        # FAQ dataset (25-30 questions, static JSON)
├── search/
│   └── faqSearch.ts                  # Fuse.js search implementation
├── hooks/
│   ├── useFAQSearch.ts               # Search state management hook
│   └── useFAQHelpful.ts              # Helpful voting localStorage management hook
└── types/
    └── faq.ts                        # TypeScript interfaces for FAQ data
```

### Implementation Checklist

**Phase 1: Data & Types**
- [ ] Create `lib/types/faq.ts`:
  - [ ] `FAQItem` interface: faqId, question, answer, category, keywords, relatedFaqIds, visualization, helpfulVotes, totalVotes
  - [ ] `FAQVisualization` type: type, description, data (type-specific structure)
  - [ ] `FAQCategory` type: 'qualification' | 'benefits' | 'retrogression' | 'legacy-migration' | 'troubleshooting'
- [ ] Create `lib/faqData.ts` — FAQ dataset with 25-30 questions:
  - [ ] **Qualification Category** (5-6 questions):
    - [ ] "What is a rolling balance?" (with rolling-balance-diagram visualization)
    - [ ] "How do I qualify for Plus tier?"
    - [ ] "Can I have multiple autopays?"
    - [ ] "What happens if I remove an autopay?"
    - [ ] "When does my tier change?"
    - [ ] "How is my tier calculated?"
  - [ ] **Benefits Category** (5-6 questions):
    - [ ] "What is the APY boost benefit?"
    - [ ] "How much will I save with fee waivers?"
    - [ ] "What are third-party rewards?"
    - [ ] "How do partner rewards work?"
    - [ ] "Which benefits apply to my tier?"
    - [ ] "Do my benefits change if I downgrade?"
  - [ ] **Retrogression Category** (4-5 questions):
    - [ ] "What is a grace period?" (with grace-period explanation)
    - [ ] "What happens if I lose my tier?"
    - [ ] "Can I recover my tier status?"
    - [ ] "How long is the grace period?"
    - [ ] "Do I lose my benefits during grace period?"
  - [ ] **Legacy Migration Category** (3-4 questions):
    - [ ] "Why did the program change?"
    - [ ] "Why are the new thresholds higher?"
    - [ ] "How do new benefits compare to old program?"
    - [ ] "Can I go back to the old program?"
  - [ ] **Troubleshooting Category** (4-5 questions):
    - [ ] "My tier is showing incorrectly. Why?"
    - [ ] "I think my balance was miscalculated. What do I do?"
    - [ ] "Why can't I add more autopays?"
    - [ ] "How do I verify my rolling balance?"
    - [ ] "What if I have a question not in the FAQ?"
  - [ ] All questions must have non-empty answers (min 20 characters)
  - [ ] All questions must have keywords array (1-10 keywords each)
  - [ ] All questions must have relatedFaqIds (3 related FAQs linked)
  - [ ] Some questions must have visualization type (at least rolling-balance-diagram for qualification questions)

**Phase 2: Search Implementation (CRITICAL)**
- [ ] Install Fuse.js library: `npm install fuse.js`
- [ ] Create `lib/search/faqSearch.ts`:
  - [ ] `initializeFAQSearch(faqs: FAQItem[])` — Load FAQs into Fuse.js index
    - [ ] Configure keys: `['question', 'answer', 'keywords']` (search these fields)
    - [ ] Configure threshold: `0.3` (allow ~30% character difference)
    - [ ] Store Fuse instance for reuse (singleton pattern)
  - [ ] `searchFAQs(query: string, category?: string): FAQItem[]` — Execute search
    - [ ] Trim whitespace from query
    - [ ] Convert to lowercase
    - [ ] Call Fuse.search(query)
    - [ ] Filter results by category if provided (optional)
    - [ ] Limit to 10 results (or return full list; Phase 2 adds pagination)
    - [ ] Return results sorted by Fuse.js relevance score (descending)
  - [ ] `highlightSearchTerms(text: string, query: string): string` — Highlight search terms in results
    - [ ] Return text with search terms wrapped in `<mark>` tags (or inline styling)

**Phase 3: Custom Hooks**
- [ ] Create `lib/hooks/useFAQSearch.ts`:
  - [ ] State: `searchQuery`, `searchResults`, `isSearching`
  - [ ] Initialize Fuse.js index on mount with faqData
  - [ ] `handleSearch(query: string)` — Update searchQuery, execute search, update searchResults
  - [ ] Debounce search at 300ms (optional; MVP uses instant fuse.js, so no debounce needed)
  - [ ] Return: `{ searchQuery, searchResults, isSearching, handleSearch, clearSearch }`
- [ ] Create `lib/hooks/useFAQHelpful.ts`:
  - [ ] State: `votedFaqIds` (Set of FAQ IDs already voted on)
  - [ ] Load from localStorage on mount (key: `faq_helpful_${faqId}`)
  - [ ] `voteHelpful(faqId: string, isHelpful: boolean)` — Record vote, save to localStorage, fire telemetry
  - [ ] `hasVoted(faqId: string)` — Check if user already voted on this FAQ
  - [ ] `getVote(faqId: string)` — Get vote value (true/false) if voted
  - [ ] Return: `{ votedFaqIds, voteHelpful, hasVoted, getVote }`

**Phase 4: Server Component**
- [ ] Create `app/loyalty/faq/page.tsx`:
  - [ ] Server-render: Import faqData from `/lib/faqData.ts` (static, no API call)
  - [ ] Pass faqData to SearchFAQ component
  - [ ] Implement telemetry: `faq_page_view` on load
  - [ ] Handle error state (should not occur for static data, but good practice)

**Phase 5: Component Implementation**

**SearchFAQ Component**:
- [ ] Create `components/loyalty/faq/SearchFAQ.tsx`
- [ ] Props:
  - [ ] `faqs: FAQItem[]` (all FAQs to search)
  - [ ] `onSearch: (results: FAQItem[], query: string) => void` (callback to update parent with results)
  - [ ] `onCategoryChange?: (category: string) => void` (callback when category tab clicked)
- [ ] Implement search input:
  - [ ] Input type="search" with aria-label="Search FAQs"
  - [ ] Placeholder: "Search FAQs..."
  - [ ] 48px height with padding
  - [ ] Full-width mobile, max-width 600px desktop
  - [ ] Clear "X" button (appears when input has text)
- [ ] Implement category tabs:
  - [ ] 6 tabs: "All" | "Qualification" | "Benefits" | "Retrogression" | "Legacy Migration" | "Troubleshooting"
  - [ ] "All" selected by default
  - [ ] Active tab: Bold or underlined
  - [ ] Mobile: Scrollable horizontal tab bar (or dropdown select)
- [ ] Implement search results display:
  - [ ] Below search input, show list of matching FAQs
  - [ ] For each result: Question text (search terms highlighted in yellow or bold), preview of answer (first 2 sentences, grayed)
  - [ ] Result count: "X results for 'query'"
  - [ ] No results: "No FAQs match 'xyz'. Try different keywords or browse by category."
  - [ ] Empty search: Show category-filtered FAQ list
- [ ] Keyboard navigation:
  - [ ] Tab: Focus search input, category tabs, results
  - [ ] Type: Search updates live (instant with fuse.js)
  - [ ] Down arrow: Navigate through results (optional; Tab works too)
  - [ ] Enter: Expand first result
  - [ ] Escape: Clear search
- [ ] Accessibility:
  - [ ] Input has aria-label and aria-live region
  - [ ] Results announced to screen reader: aria-live="polite"
  - [ ] Search results as semantic list (ul/li)
- [ ] Telemetry:
  - [ ] Fire `faq_search` event with searchTerm, resultCount, searchDuration
  - [ ] Fire `faq_category_filter` event when category tab clicked
- [ ] Test: Search for "rolling balance" → 3-5 results; search for "xyz" → no results; click category → results filter

**FAQAccordion Component**:
- [ ] Create `components/loyalty/faq/FAQAccordion.tsx`
- [ ] Props:
  - [ ] `faqItems: FAQItem[]` (FAQs to display)
  - [ ] `categoryFilter: string` (current category filter)
  - [ ] `expandedItems: Set<string>` (expanded FAQ IDs)
  - [ ] `onToggleExpand: (faqId: string) => void` (callback when expanding/collapsing)
  - [ ] `searchTerm?: string` (for highlighting search terms in display)
- [ ] Implement accordion:
  - [ ] List of FAQ items, each with question heading and optional answer below
  - [ ] Use semantic HTML `<details>` and `<summary>` (native, accessible)
  - [ ] Fallback: If not using `<details>`, use buttons with `aria-expanded`
- [ ] Implement expand/collapse animation:
  - [ ] 200ms smooth height transition (CSS transition or React Spring)
  - [ ] Chevron icon rotates 180° on expand
- [ ] Render empty state:
  - [ ] If no FAQs in category: "No FAQs in this category."
  - [ ] If search returns no results: "No FAQs match your search."
- [ ] Accessibility:
  - [ ] Use `<details>` for native semantics
  - [ ] All items focusable with Tab
  - [ ] Enter/Space to expand/collapse
- [ ] Test: Expand 1 item; verify 200ms animation; verify chevron rotates; test empty state

**FAQItem Component**:
- [ ] Create `components/loyalty/faq/FAQItem.tsx`
- [ ] Props:
  - [ ] `faq: FAQItem` (the FAQ data)
  - [ ] `expanded: boolean` (is expanded?)
  - [ ] `onToggle: () => void` (callback to toggle)
  - [ ] `onHelpful: (isHelpful: boolean) => void` (callback for helpful vote)
  - [ ] `hasVoted: boolean` (did user already vote?)
  - [ ] `userVote?: boolean` (what did user vote if hasVoted?)
  - [ ] `searchTerm?: string` (for highlighting)
- [ ] Implement collapsed view:
  - [ ] Question text (16pt Bold, clickable)
  - [ ] Preview of answer (first 2 sentences, 14pt gray)
  - [ ] Expand icon (chevron down)
  - [ ] Helpful vote count (optional): "[●●●●●] X people found this helpful" (can show just vote count)
- [ ] Implement expanded view:
  - [ ] Full answer text
  - [ ] Visualization (if FAQ has visualization type)
  - [ ] Related questions section: "People also ask:" with 3 related FAQ links
  - [ ] Helpful voting UI:
    - [ ] Label: "Was this FAQ helpful?"
    - [ ] Thumbs up button (👍 or text): Green color, 48×48px
    - [ ] Thumbs down button (👎 or text): Red color, 48×48px
    - [ ] If already voted: Show selected state (filled), disable buttons
    - [ ] If voted, show: "Thanks for your feedback!" (optional 2-second toast)
  - [ ] Button behavior:
    - [ ] Click thumbs up: Call `onHelpful(true)`, update UI, fire telemetry
    - [ ] Click thumbs down: Call `onHelpful(false)`, update UI, fire telemetry
    - [ ] Already voted: Buttons disabled (grayed out), show tooltip on hover
- [ ] Animation:
  - [ ] Expand: 200ms smooth height transition
  - [ ] Chevron: 200ms rotate animation
- [ ] Accessibility:
  - [ ] Summary/button with aria-expanded
  - [ ] All buttons (expand, helpful, related links) have aria-label
  - [ ] Expand/collapse with Enter/Space
  - [ ] Helpful vote buttons: aria-label="Mark as helpful" and "Mark as not helpful"
  - [ ] Related questions as semantic links
- [ ] Telemetry:
  - [ ] Fire `faq_expand` when expanded
  - [ ] Fire `faq_helpful_vote` when user votes
  - [ ] Fire `faq_related_click` when related question clicked
- [ ] Test: Expand/collapse animation; vote helpful; see disabled buttons after vote; click related FAQ

**FAQVisualization Component**:
- [ ] Create `components/loyalty/faq/FAQVisualization.tsx`
- [ ] Props:
  - [ ] `type: 'rolling-balance' | 'tier-flowchart' | 'autopay-rules'` (diagram type)
  - [ ] `data: object` (diagram-specific data)
  - [ ] `memberData?: object` (optional: member's actual data to show in example)
- [ ] Implement rolling-balance-diagram:
  - [ ] Display 3-month calendar with month labels and balances
  - [ ] Example:
    ```
    Jan 31:  $2,600
    Feb 28:  $2,500
    Mar 31:  $2,400
    Average: $2,500 ✓ Qualifies for Classic Tier
    ```
  - [ ] Rendering: SVG or semantic HTML table (must be accessible)
  - [ ] If memberData provided: Show member's actual rolling balance at bottom
  - [ ] Responsive: Scales to full-width on mobile, centered on desktop
- [ ] Implement tier-flowchart (future):
  - [ ] Show flow: Balance → Tier, Autopay → Tier
  - [ ] Rendering: SVG flowchart or boxes with arrows
- [ ] Implement autopay-rules (future):
  - [ ] Show autopay limits by tier
  - [ ] Rendering: Table or icon grid
- [ ] Accessibility:
  - [ ] SVG has role="img" and descriptive aria-label
  - [ ] Text alternative always provided (figcaption or aria-description)
  - [ ] Color not sole distinguishing feature (use patterns/labels too)
  - [ ] Contrast meets 4.5:1 minimum
- [ ] Telemetry: Fire `faq_visualization_viewed` on mount
- [ ] Test: Render rolling-balance-diagram; verify SVG accessibility; test responsiveness

**Phase 6: Styling & Responsiveness**
- [ ] Apply Tailwind classes:
  - [ ] Search input: Full-width mobile, max-width 600px desktop, 48px height, padding 12px
  - [ ] Category tabs: Overflow-x auto on mobile (scrollable), normal on desktop
  - [ ] FAQ question: 16pt Bold, clickable, 4px outline focus
  - [ ] FAQ answer: 16pt, high contrast (7:1)
  - [ ] Helpful buttons: 48×48px, tier colors (green/red), 4px outline focus
  - [ ] Results: Single-column, 16px spacing between items
  - [ ] Visualization: Responsive, SVG scales to container
- [ ] Mobile (320-479px):
  - [ ] Full-width search input (16px padding on sides)
  - [ ] Category tabs: Horizontal scroll or dropdown
  - [ ] FAQ list: Single column, stacked vertically
  - [ ] Helpful buttons: Full-width or side-by-side
  - [ ] All buttons: ≥48×48px
- [ ] Tablet (480-1024px):
  - [ ] Search input: Max-width 600px, centered
  - [ ] Category tabs: Horizontal, no scroll
  - [ ] FAQ list: Single column or 2 columns (if space)
  - [ ] Visualization: Scales to tablet width
- [ ] Desktop (1025px+):
  - [ ] Search input: Max-width 600px, centered
  - [ ] Category tabs: Horizontal
  - [ ] FAQ list: Single column (or optional 2-column for density)
  - [ ] Visualization: Maintains aspect ratio

**Phase 7: Testing**

**Unit Tests** (`SearchFAQ.test.tsx`):
- [ ] Search input focuses on mount
- [ ] Typing in search updates results (live search)
- [ ] Search for "rolling balance" returns 3-5 results
- [ ] Search for "nonexistent" returns 0 results with "No results" message
- [ ] Click clear "X" button → clears search and shows full list
- [ ] Click category tab → filters results by category
- [ ] Category + search combined: Search within category results

**Unit Tests** (`FAQAccordion.test.tsx`):
- [ ] Renders all FAQ items
- [ ] Expand item → answer shows, chevron rotates
- [ ] Collapse item → answer hidden, chevron rotates back
- [ ] 200ms animation on expand/collapse
- [ ] Empty category → "No FAQs" message

**Unit Tests** (`FAQItem.test.tsx`):
- [ ] Renders collapsed view: question, preview, chevron
- [ ] Expand → shows full answer
- [ ] Collapse → hides answer
- [ ] Visualization renders if present
- [ ] Related questions show as links
- [ ] Helpful vote buttons: Click thumbs up → filled, disabled, telemetry fired
- [ ] Already voted → buttons disabled, show previous vote
- [ ] Search highlighting: Search terms highlighted in question/answer

**Unit Tests** (`FAQVisualization.test.tsx`):
- [ ] Rolling balance diagram renders with 3 months and average
- [ ] SVG has aria-label and text alternative
- [ ] Responsive: Scales on mobile
- [ ] With memberData: Shows member's rolling balance

**Integration Tests** (`faq.integration.test.tsx`):
- [ ] Page loads FAQ list
- [ ] Search works: Type "rolling balance" → 3-5 results
- [ ] Category filter: Click "Qualification" → 5-6 FAQs shown
- [ ] Expand FAQ → Answer + visualization visible
- [ ] Vote helpful → Button fills, disables, telemetry fires
- [ ] Related FAQ click → Scrolls and expands related FAQ
- [ ] Support CTA → "Contact Support" visible and clickable
- [ ] Error handling: If FAQ load fails, shows error + retry

**E2E Tests** (`faq.e2e.test.ts`):
- [ ] Navigate to `/loyalty/faq` and page loads
- [ ] Search for "rolling balance" → 3-5 results displayed
- [ ] Click result → Expands in FAQ list below
- [ ] Click category "Benefits" → Filters to 5-6 benefits questions
- [ ] Click "Learn more" or "See diagram" → Visualization expands
- [ ] Vote helpful: Click thumbs up → Button fills, shows "Thanks"
- [ ] Vote second time: Button disabled, tooltip shows
- [ ] Click related question → Page scrolls and expands related FAQ
- [ ] Click "Contact Support" → Navigate to `/help` page
- [ ] All text readable at 16pt+ font
- [ ] All buttons ≥48×48px tap targets
- [ ] Keyboard navigation: Tab through search, tabs, FAQs, buttons; Enter to expand; Escape to collapse

**Phase 8: Accessibility & Performance**
- [ ] Lighthouse Accessibility: 90+ score
- [ ] Keyboard navigation: Full tab navigation, Enter/Escape/Arrow keys working
- [ ] Screen reader: All FAQs, searches, votes announced correctly
- [ ] Color contrast: All text 4.5:1 minimum (buttons 7:1 for touch targets)
- [ ] Focus indicators: 4px outline on all focusable elements
- [ ] ARIA: aria-live for search results, aria-expanded for FAQs, aria-label for all buttons
- [ ] Diagrams: Always have text alternative (figcaption or aria-description)
- [ ] Performance:
  - [ ] First Contentful Paint (FCP): < 1.5s
  - [ ] Largest Contentful Paint (LCP): < 2.5s
  - [ ] Cumulative Layout Shift (CLS): < 0.1
  - [ ] Bundle size: All components + Fuse.js < 80KB gzipped
  - [ ] Search latency: < 50ms (Fuse.js instant)

**Phase 9: Documentation & Deployment**
- [ ] JSDoc comments on all components and hooks
- [ ] Document Fuse.js search configuration (threshold, keys, etc.)
- [ ] Document FAQ content format (Markdown support, HTML safety)
- [ ] Document helpful voting data flow (localStorage → telemetry)
- [ ] Update project README with FAQ page integration notes
- [ ] Add FAQ troubleshooting section to dev docs (how to add new FAQ, visualizations, etc.)
- [ ] Test in staging with real FAQ data (25-30 questions)
- [ ] Deploy to production with feature flag (if using)
- [ ] Monitor helpful vote data for insights (which FAQs need improvement)

---

✅ **SHARD 06 COMPLETE**
