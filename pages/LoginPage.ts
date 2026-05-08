import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for https://the-internet.herokuapp.com/login
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly flashMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.flashMessage = page.locator('#flash');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getFlashMessage(): Promise<string> {
    await this.flashMessage.waitFor({ state: 'visible' });
    return (await this.flashMessage.textContent()) ?? '';
  }

  async isLoggedIn(): Promise<boolean> {
    return this.page.url().includes('/secure');
  }
}
