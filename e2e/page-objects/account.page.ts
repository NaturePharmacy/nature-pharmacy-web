import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class AccountPage extends BasePage {
  readonly nameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    // The account page has input[name="name"] for the profile name field
    this.nameInput = page.locator('input[name="name"]').first();
    // Use role+name to target the profile "Save Changes" button specifically
    // (the SearchBar in the header also has a type="submit" button, so .first() would be wrong)
    this.saveButton = page.getByRole('button', { name: /save changes|enregistrer|guardar/i });
  }

  async navigate(): Promise<void> {
    await this.goto('/account');
    // Wait for the page to load and API data to populate
    await this.page.waitForLoadState('networkidle');
    // Wait for the name input to be populated with user data
    await this.nameInput.waitFor({ state: 'visible', timeout: 15000 });
  }
}
