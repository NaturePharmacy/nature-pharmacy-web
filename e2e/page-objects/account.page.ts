import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class AccountPage extends BasePage {
  readonly nameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    // The account page has input[name="name"] for the profile name field
    this.nameInput = page.locator('input[name="name"]').first();
    // The first submit button on the page is the profile form's "Save Changes" button
    this.saveButton = page.locator('button[type="submit"]').first();
  }

  async navigate(): Promise<void> {
    await this.goto('/account');
    // Wait for the page to load and API data to populate
    await this.page.waitForLoadState('networkidle');
    // Wait for the name input to be populated with user data
    await this.nameInput.waitFor({ state: 'visible', timeout: 15000 });
  }
}
