import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.getByRole('button', { name: /connecter|sign in|iniciar/i });
    this.errorMessage = page.locator('.bg-red-50');
  }

  async navigate(): Promise<void> { await this.goto('/login'); }
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
  async expectError(): Promise<void> { await expect(this.errorMessage).toBeVisible(); }
}
