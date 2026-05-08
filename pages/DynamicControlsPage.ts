import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for https://the-internet.herokuapp.com/dynamic_controls
 */
export class DynamicControlsPage {
  readonly page: Page;
  readonly checkbox: Locator;
  readonly toggleCheckboxButton: Locator;
  readonly textInput: Locator;
  readonly toggleInputButton: Locator;
  readonly message: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkbox = page.locator('#checkbox input[type="checkbox"]');
    this.toggleCheckboxButton = page.locator('#checkbox-example button');
    this.textInput = page.locator('#input-example input[type="text"]');
    this.toggleInputButton = page.locator('#input-example button');
    this.message = page.locator('#message');
  }

  async goto() {
    await this.page.goto('/dynamic_controls');
  }

  async toggleCheckbox() {
    await this.toggleCheckboxButton.click();
    await this.message.waitFor({ state: 'visible' });
  }

  async toggleInput() {
    await this.toggleInputButton.click();
    await this.message.waitFor({ state: 'visible' });
  }

  async getMessage(): Promise<string> {
    return (await this.message.textContent()) ?? '';
  }
}
