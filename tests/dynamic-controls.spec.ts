import { test, expect } from '@playwright/test';
import { DynamicControlsPage } from '../pages/DynamicControlsPage';
import { suggestSelector } from '../ai/ai-helper';

test.describe('Dynamic Controls', () => {

  test('should remove and re-add checkbox', async ({ page }) => {
    const dynamicPage = new DynamicControlsPage(page);
    await dynamicPage.goto();

    // Checkbox starts visible
    await expect(dynamicPage.checkbox).toBeVisible();

    // Remove it
    await dynamicPage.toggleCheckbox();
    const removeMsg = await dynamicPage.getMessage();
    expect(removeMsg).toContain("It's gone!");

    // Add it back
    await dynamicPage.toggleCheckbox();
    const addMsg = await dynamicPage.getMessage();
    expect(addMsg).toContain("It's back!");
  });

  test('should enable and disable text input', async ({ page }) => {
    const dynamicPage = new DynamicControlsPage(page);
    await dynamicPage.goto();

    // Input starts disabled
    await expect(dynamicPage.textInput).toBeDisabled();

    // Enable it
    await dynamicPage.toggleInput();
    await expect(dynamicPage.textInput).toBeEnabled();
    const enableMsg = await dynamicPage.getMessage();
    expect(enableMsg).toContain("It's enabled!");

    // Type in the now-enabled input
    await dynamicPage.textInput.fill('Hello Playwright + AI!');

    // Disable it again
    await dynamicPage.toggleInput();
    await expect(dynamicPage.textInput).toBeDisabled();
    const disableMsg = await dynamicPage.getMessage();
    expect(disableMsg).toContain("It's disabled!");
  });

  // ─── AI Selector Healing Demo ─────────────────────────────────────────────
  test('AI selector suggestion demo', async ({ page }) => {
    if (!process.env.ANTHROPIC_API_KEY) {
      test.skip(true, 'Set ANTHROPIC_API_KEY to enable AI selector suggestions');
    }

    await page.goto('/dynamic_controls');

    // Simulate a "broken" selector scenario
    const brokenSelector = '#checkbox-example > form > div > input';
    const htmlSnippet = await page.locator('#checkbox-example').innerHTML();

    const suggestion = await suggestSelector(
      brokenSelector,
      htmlSnippet,
      'Checkbox that can be removed/added dynamically'
    );

    console.log('\n🤖 AI Selector Suggestion:\n', suggestion);
    expect(suggestion).toBeTruthy();
  });
});
