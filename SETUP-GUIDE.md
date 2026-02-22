# Beginner Setup Guide: Cursor + Claude Code for Your Project

**For**: Credit Union Loyalty Banking Experience
**Audience**: Complete beginner
**Updated**: February 21, 2026

---

## What You're Setting Up

You have a complete project specification package (the pipeline outputs in this folder). Now you need two tools to turn those specs into a working application:

1. **Cursor** — A code editor (like VS Code) with built-in AI that reads your specs and helps write code
2. **Claude Code** — A command-line AI agent that can build entire screens from your spec files

You can use either one or both. This guide covers both.

---

## Prerequisites: What You Need First

Before anything else, you need these installed on your computer.

### 1. Node.js (Required)

Node.js is the runtime that makes JavaScript/React apps work.

**Check if you have it:**
Open Terminal (Mac) or Command Prompt (Windows) and type:
```
node --version
```

If you see a version number (like `v20.11.0`), you're good. If you get an error, install it:

- Go to https://nodejs.org
- Download the **LTS** version (the one that says "Recommended")
- Run the installer, click Next/Continue through everything
- Restart your terminal after installing

**Verify it worked:**
```
node --version
npm --version
```
Both should show version numbers.

### 2. Git (Required)

Git tracks changes to your code.

**Check if you have it:**
```
git --version
```

If you get an error:
- **Mac**: It will prompt you to install Xcode Command Line Tools. Say yes.
- **Windows**: Download from https://git-scm.com and install with default settings.

### 3. A Code Editor

You'll use **Cursor** (recommended for this project) or **VS Code**.

---

## Part 1: Setting Up Cursor

### Step 1: Download and Install Cursor

1. Go to https://www.cursor.com
2. Click "Download" — it will detect your operating system
3. Run the installer
4. Open Cursor after installation
5. It will ask if you want to import VS Code settings — choose yes if you use VS Code, otherwise skip

### Step 2: Sign In to Cursor

1. Cursor will prompt you to create an account or sign in
2. Create an account (free tier works to start)
3. The Pro plan ($20/month) gives you more AI requests — recommended for active development

### Step 3: Create Your Project Folder

Open Terminal and run these commands one at a time:

```bash
# 1. Navigate to where you want your project (pick one)
cd ~/Desktop          # puts it on your Desktop
# OR
cd ~/Documents        # puts it in Documents

# 2. Create the Next.js project with all the right settings
npx create-next-app@latest credit-union-loyalty --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

When prompted:
- "Would you like to use TypeScript?" → **Yes**
- "Would you like to use ESLint?" → **Yes**
- "Would you like to use Tailwind CSS?" → **Yes**
- "Would you like to use `src/` directory?" → **Yes**
- "Would you like to use App Router?" → **Yes**
- "Would you like to customize the default import alias?" → **No**

```bash
# 3. Go into the project folder
cd credit-union-loyalty

# 4. Install Shadcn UI (the component library)
npx shadcn@latest init
```

When prompted for Shadcn:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

```bash
# 5. Install the Shadcn components the project needs
npx shadcn@latest add button card accordion tabs alert badge progress dialog sheet input label select separator avatar toast tooltip
```

```bash
# 6. Install additional dev tools
npm install -D @faker-js/faker
```

### Step 4: Copy Your Spec Files Into the Project

This is important — your coding AI needs to read the spec files.

1. Find the pipeline output folder (the folder you selected in Cowork with all the .md files)
2. Copy the ENTIRE `pipeline-outputs/credit-union-loyalty-banking/` folder
3. Paste it inside your new project as a folder called `docs/`

Your project should now look like:
```
credit-union-loyalty/
├── docs/                          <-- YOUR SPEC FILES GO HERE
│   ├── 00-project-brief.md
│   ├── 01-research-report.md
│   ├── 02-qualitative-insights.md
│   ├── 03-experience-strategy.md
│   ├── 04-prd.md
│   ├── 05-ux-spec.md
│   ├── 06-dev-spec.md
│   ├── 07-shards/
│   │   ├── 00-screen-inventory.md
│   │   ├── 01-home-dashboard-shard.md
│   │   └── ... (all shard files)
│   ├── 08-gap-analysis.md
│   ├── 08-handoff-summary.md
│   └── CLAUDE.md
├── src/
│   ├── app/
│   └── ...
├── .cursorrules                   <-- COPY THIS FILE TO PROJECT ROOT
├── package.json
└── ...
```

**Critical step**: Copy the `.cursorrules` file from your pipeline output folder to the ROOT of your project (not inside `docs/`). This tells Cursor's AI about your project conventions.

### Step 5: Open Your Project in Cursor

1. Open Cursor
2. Go to **File > Open Folder**
3. Navigate to your `credit-union-loyalty` folder and open it
4. You should see your project files in the left sidebar

### Step 6: Set Up the Folder Structure

In Cursor's terminal (press `` Ctrl+` `` or `` Cmd+` `` to open it), run:

```bash
# Create the folder structure from the dev spec
mkdir -p src/components/loyalty
mkdir -p src/components/banking
mkdir -p src/components/layout
mkdir -p src/components/shared
mkdir -p src/lib
mkdir -p src/types
mkdir -p src/hooks
```

### Step 7: Start Building with Cursor Composer

Cursor has a feature called **Composer** that can write code across multiple files.

1. Press **Cmd+I** (Mac) or **Ctrl+I** (Windows) to open Composer
2. Type your first prompt:

```
Read docs/07-shards/00-screen-inventory.md for the build order, then read
docs/07-shards/01-home-dashboard-shard.md for the first screen to build.

Create the Home Dashboard screen following the shard specification exactly.
Include:
- All components listed in the component tree
- Mock data from the data contracts section
- Accessibility requirements (48px tap targets, 16pt+ font, 7:1 contrast)
- All interaction states

Start with the shared types in src/types/ and mock data in src/lib/,
then build the components, then the page.
```

3. Cursor will read your spec files and generate code
4. Review the code it suggests, then click "Accept All" if it looks right

### Step 8: Run Your Project

In the terminal:
```bash
npm run dev
```

Open your browser to http://localhost:3000 to see your app.

---

## Part 2: Setting Up Claude Code (Alternative or Complementary)

Claude Code is a command-line tool that can also build from your specs.

### Step 1: Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

### Step 2: Set Up Your API Key

You need an Anthropic API key:

1. Go to https://console.anthropic.com
2. Create an account or sign in
3. Go to "API Keys" in the settings
4. Click "Create Key"
5. Copy the key

Set it in your terminal:
```bash
# Mac/Linux
export ANTHROPIC_API_KEY="your-key-here"

# To make it permanent, add to your shell profile:
echo 'export ANTHROPIC_API_KEY="your-key-here"' >> ~/.zshrc
source ~/.zshrc
```

### Step 3: Copy CLAUDE.md to Project Root

Copy the `CLAUDE.md` file from your pipeline output folder to the ROOT of your project folder:

```bash
cp docs/CLAUDE.md ./CLAUDE.md
```

Claude Code automatically reads `CLAUDE.md` when it starts — this orients it to your entire project.

### Step 4: Launch Claude Code

```bash
# Make sure you're in your project folder
cd ~/Desktop/credit-union-loyalty   # or wherever you created it

# Start Claude Code
claude
```

### Step 5: Give Claude Code Its First Task

When Claude Code starts, type:

```
Read CLAUDE.md to orient yourself. Then read docs/07-shards/00-screen-inventory.md
for the build order. Start building the first screen using
docs/07-shards/01-home-dashboard-shard.md as your spec.
```

Claude Code will read the files and start building.

---

## Part 3: Using Cursor and Claude Code Together

The most powerful workflow uses both:

1. **Claude Code** builds entire screens from shard specs (fast, automated)
2. **Cursor** lets you refine, debug, and iterate on the code visually

**Workflow:**
1. Use Claude Code to generate the initial code for a screen
2. Open the files in Cursor to see them
3. Use Cursor's inline AI (select code, press Cmd+K) to refine specific parts
4. Use Cursor Composer for multi-file changes
5. Repeat for the next screen

---

## Part 4: Building Screen by Screen

Follow the build order from `docs/07-shards/00-screen-inventory.md`. For each screen:

### The Process

1. **Read the shard** — Open `docs/07-shards/[NN]-[screen]-shard.md`
2. **Tell your AI to build it** — Paste a prompt like:
   ```
   Read docs/07-shards/02-loyalty-hub-shard.md and build this screen
   following the spec exactly. Create all components, mock data,
   routes, and tests specified in the shard.
   ```
3. **Review the output** — Check it matches the spec
4. **Test it** — Run `npm run dev` and check the browser
5. **Move to next screen** — Repeat with the next shard

### Recommended Build Order

| Order | Screen | Shard File | Why This Order |
|-------|--------|------------|----------------|
| 1 | Home Dashboard | 01-home-dashboard-shard.md | Foundation — sets up shared components |
| 2 | Loyalty Hub | 02-loyalty-hub-shard.md | Core loyalty destination |
| 3 | Tier Details | 03-tier-details-shard.md | Explains tier system |
| 4 | Account Status | 04-account-status-shard.md | Shows tier contribution context |
| 5 | Benefit Details | 05-benefit-details-shard.md | Real-dollar value display |
| 6 | FAQ & Search | 06-faq-search-shard.md | Self-service support |
| 7-17 | Remaining screens | 07 through 17 | Banking flows, autopay, alerts |

---

## Part 5: Common Commands Reference

### Terminal Commands You'll Use Often

```bash
# Start the development server (see your app in browser)
npm run dev

# Stop the server
Ctrl+C

# Install a new package
npm install package-name

# Run tests
npm test

# Check for code issues
npm run lint

# Build for production
npm run build
```

### Cursor Keyboard Shortcuts

| Shortcut | What It Does |
|----------|-------------|
| Cmd+I (Mac) / Ctrl+I (Win) | Open Composer (multi-file AI) |
| Cmd+K (Mac) / Ctrl+K (Win) | Inline AI edit (select code first) |
| Cmd+L (Mac) / Ctrl+L (Win) | Open AI chat panel |
| Cmd+Shift+P | Command palette (search any action) |
| Cmd+` | Toggle terminal |
| Cmd+S | Save file |
| Cmd+Z | Undo |

### Cursor Tips for Beginners

- **@ mentions**: In Composer or Chat, type `@` to reference files. Example: `@docs/07-shards/02-loyalty-hub-shard.md build this screen`
- **Include context**: Always tell the AI which shard file to read — it produces much better code when it has the spec
- **Accept/Reject**: After Composer generates code, review each file change. You can accept individual files or all at once
- **Undo is safe**: If something breaks, Cmd+Z undoes AI changes just like any other edit

---

## Troubleshooting

### "command not found: node"
Node.js isn't installed or your terminal needs to be restarted. Close and reopen Terminal, then try again.

### "command not found: npx"
Same as above — npx comes with Node.js. Restart terminal after installing Node.

### The app shows errors in the browser
1. Check the terminal for error messages (red text)
2. Copy the error and paste it into Cursor's AI chat — ask it to fix the issue
3. Common fixes: missing imports, typos in file names, missing components

### Cursor AI gives wrong code
Be more specific in your prompts. Instead of "build the dashboard", say "Read @docs/07-shards/01-home-dashboard-shard.md and build exactly what Section 6 (Components & Responsibilities) describes, using the mock data from Section 8 (Data Contracts)."

### "Module not found" errors
```bash
# Reinstall all dependencies
rm -rf node_modules
npm install
```

### Port 3000 is already in use
```bash
# Kill whatever is using port 3000
npx kill-port 3000
# Then restart
npm run dev
```

---

## Glossary for Beginners

| Term | What It Means |
|------|--------------|
| **Terminal** | The text-based command window (Terminal on Mac, Command Prompt on Windows) |
| **npm** | Node Package Manager — installs code libraries your project needs |
| **npx** | Runs a package without permanently installing it |
| **Next.js** | The React framework your project uses — handles pages, routing, etc. |
| **Tailwind CSS** | A CSS library that uses class names like `text-lg` and `bg-blue-500` for styling |
| **Shadcn UI** | Pre-built UI components (buttons, cards, modals) that work with Tailwind |
| **Component** | A reusable piece of UI (like a TierBadge or BenefitCard) |
| **Route** | A URL path in your app (like `/loyalty` or `/autopay`) |
| **Mock data** | Fake data used during development before a real backend exists |
| **TypeScript** | JavaScript with type checking — catches errors before they happen |
| **Shard** | One of your screen spec files — contains everything needed to build one screen |
| **CLAUDE.md** | A file that tells Claude Code about your project when it starts |
| **.cursorrules** | A file that tells Cursor about your coding conventions |
| **App Router** | Next.js feature where each folder in `app/` becomes a URL route |
| **WCAG** | Web Content Accessibility Guidelines — standards for accessible websites |
| **AAA** | The highest WCAG conformance level — your project targets this |

---

## What Success Looks Like

When you've completed the setup and built your first screen, you should be able to:

1. Run `npm run dev` and see the Home Dashboard at http://localhost:3000
2. See a tier badge showing the member's loyalty status
3. See account summary cards with balance information
4. See loyalty context integrated (not disrupting the banking layout)
5. Navigate between screens using the main navigation
6. See everything rendered with large, readable text (16pt+) and high contrast

From there, you build screen by screen following the shard order until the full application is complete.
