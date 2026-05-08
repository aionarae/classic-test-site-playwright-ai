/**
 * CLI script: generates a Page Object Model using AI from a page description
 * Usage: ts-node ai/generate-page-object.ts "Drag and Drop page" "/drag_and_drop"
 */
import * as dotenv from 'dotenv';
dotenv.config();

import { chromium } from '@playwright/test';
import { generatePageObject } from './ai-helper';

const pageName = process.argv[2] || 'Drag and Drop Page';
const pagePath = process.argv[3] || '/drag_and_drop';
const baseURL = process.env.BASE_URL || 'https://the-internet.herokuapp.com';

(async () => {
  console.log(`\n🤖 Generating Page Object for: "${pageName}" (${pagePath})\n`);

  // Scrape HTML from the actual page
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${baseURL}${pagePath}`);
  const htmlSnippet = await page.locator('body').innerHTML();
  await browser.close();

  const pageObject = await generatePageObject(
    pageName,
    `Page at ${baseURL}${pagePath}`,
    htmlSnippet.slice(0, 3000) // limit tokens
  );

  console.log(pageObject);
})();
