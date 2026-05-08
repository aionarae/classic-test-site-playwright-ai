import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { summarizeFailure } from '../ai/ai-helper';
import * as fs from 'fs';
import * as path from 'path';

// Valid credentials for https://the-internet.herokuapp.com/login
const VALID_USER = 'tomsmith';
const VALID_PASS = 'SuperSecretPassword!';

test.describe('Login Page', () => {

  test('should log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER, VALID_PASS);

    expect(await loginPage.isLoggedIn()).toBe(true);
    const flash = await loginPage.getFlashMessage();
    expect(flash).toContain('You logged into a secure area');
  });

  test('should show error for invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER, 'wrongpassword');

    const flash = await loginPage.getFlashMessage();
    expect(flash).toContain('Your password is invalid');
  });

  test('should show error for invalid username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('baduser', VALID_PASS);

    const flash = await loginPage.getFlashMessage();
    expect(flash).toContain('Your username is invalid');
  });

  test('should log out successfully after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER, VALID_PASS);

    await page.getByRole('link', { name: /logout/i }).click();
    expect(page.url()).toContain('/login');
  });

  // ─── AI-Assisted Failure Analysis Demo ───────────────────────────────────
  // This test intentionally fails so AI can analyze and summarize the failure.
  test('AI failure summary demo (intentionally fails)', async ({ page }, testInfo) => {
    if (!process.env.ANTHROPIC_API_KEY) {
      test.skip(true, 'Set ANTHROPIC_API_KEY to enable AI failure analysis');
    }

    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Intentionally use wrong credentials to trigger a failure scenario
    await loginPage.login('wronguser', 'wrongpass');

    let screenshotBase64: string | undefined;
    try {
      const screenshotPath = path.join(testInfo.outputDir, 'failure.png');
      await page.screenshot({ path: screenshotPath });
      screenshotBase64 = fs.readFileSync(screenshotPath).toString('base64');
    } catch {
      // screenshot optional
    }

    // Simulate an assertion failure and ask AI to summarize it
    const flash = await loginPage.getFlashMessage();
    const expectedText = 'Welcome back!'; // intentionally wrong expectation

    if (!flash.includes(expectedText)) {
      const aiSummary = await summarizeFailure(
        `Expected flash message to contain "${expectedText}" but got: "${flash}"`,
        page.url(),
        await page.title(),
        screenshotBase64
      );
      console.log('\n🤖 AI Failure Analysis:\n', aiSummary);
    }

    // This will fail — that's expected for the demo
    expect(flash).toContain(expectedText);
  });
});
