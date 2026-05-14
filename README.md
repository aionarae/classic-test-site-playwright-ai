# classic-test-site-playwright-ai

A test automation framework using [Playwright](https://playwright.dev/) and [Anthropic Claude](https://www.anthropic.com/) — built against [The Internet](https://the-internet.herokuapp.com/), a classic test practice site.

---
 
## Prerequisites
 
- [Node.js](https://nodejs.org/) v18+
- An [Anthropic API key](https://console.anthropic.com/)

---
 
## Setup
 
```bash
# 1. Clone the repo
git clone https://github.com/your-username/classic-test-site-playwright-ai.git
cd classic-test-site-playwright-ai
 
# 2. Install dependencies
npm install
npx playwright install
 
# 3. Add your API key
cp .env.example .env
# Open .env and set ANTHROPIC_API_KEY=your_key_here
```
 
---

---
 
## Running Tests
 
```bash
npm test                  # Run all tests (headless)
npm run test:headed       # Run with browser visible
npm run test:ui           # Open Playwright UI mode
npm run test:login        # Login tests only
npm run test:forms        # Dynamic controls tests only
npm run test:report       # Open HTML report after a run
```

---
 
## Recommended Workflow
 
```
1. Pick a page to test — e.g. https://the-internet.herokuapp.com/upload
2. Generate a Page Object  →  save to pages/UploadPage.ts
3. Generate test cases     →  use as your test plan
4. Write the spec file     →  import your new page object
5. Run the tests           →  AI failure analysis explains any failures
6. If selectors break      →  AI selector healing suggests fixes
```
 
---