import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─────────────────────────────────────────────
// 1. GENERATE TEST CASES from a plain description
// ─────────────────────────────────────────────
export async function generateTestCases(featureDescription: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a senior QA engineer. Given the following feature description, generate a comprehensive list of test cases in Gherkin-style (Given/When/Then).

Feature: ${featureDescription}

Return ONLY the test cases, no preamble. Format each test case with a title and steps.`,
      },
    ],
  });

  return (message.content[0] as { type: string; text: string }).text;
}

// ─────────────────────────────────────────────
// 2. SUMMARIZE FAILURE from error + page context
// ─────────────────────────────────────────────
export async function summarizeFailure(
  errorMessage: string,
  pageUrl: string,
  pageTitle: string,
  screenshotBase64?: string
): Promise<string> {
  const contentBlocks: Anthropic.MessageParam['content'] = [
    {
      type: 'text',
      text: `You are a QA assistant. A Playwright test failed. Analyze the failure and give:
1. A plain-English summary of what went wrong (1-2 sentences)
2. The most likely root cause
3. A suggested fix

Test context:
- Page URL: ${pageUrl}
- Page Title: ${pageTitle}
- Error: ${errorMessage}`,
    },
  ];

  if (screenshotBase64) {
    contentBlocks.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: 'image/png',
        data: screenshotBase64,
      },
    });
  }

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 512,
    messages: [{ role: 'user', content: contentBlocks }],
  });

  return (message.content[0] as { type: string; text: string }).text;
}

// ─────────────────────────────────────────────
// 3. SUGGEST SELECTOR for a broken locator
// ─────────────────────────────────────────────
export async function suggestSelector(
  brokenSelector: string,
  pageHtmlSnippet: string,
  elementDescription: string
): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `You are a Playwright expert. A test selector is broken. Suggest a better, more resilient locator.

Broken selector: ${brokenSelector}
Element purpose: ${elementDescription}
Relevant HTML:
\`\`\`html
${pageHtmlSnippet}
\`\`\`

Reply with ONLY the Playwright locator expression (e.g. page.getByRole(...) or page.locator(...)). No explanation.`,
      },
    ],
  });

  return (message.content[0] as { type: string; text: string }).text.trim();
}

// ─────────────────────────────────────────────
// 4. GENERATE PAGE OBJECT from a URL description
// ─────────────────────────────────────────────
export async function generatePageObject(
  pageName: string,
  pageDescription: string,
  htmlSnippet: string
): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: `You are a Playwright automation expert. Generate a TypeScript Page Object Model class for the following page.

Page name: ${pageName}
Description: ${pageDescription}
HTML snippet:
\`\`\`html
${htmlSnippet}
\`\`\`

Requirements:
- Use Playwright best practices (getByRole, getByLabel, getByText preferred over CSS)
- Include typed methods for all major actions
- Add JSDoc comments
- Export the class

Return ONLY the TypeScript code, no markdown fences.`,
      },
    ],
  });

  return (message.content[0] as { type: string; text: string }).text;
}
