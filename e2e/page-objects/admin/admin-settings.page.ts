import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class AdminSettingsPage extends BasePage {
  readonly commissionInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.commissionInput = page.locator('#commissionRate, input[name="commissionRate"]');
    this.saveButton = page.locator('button[type="submit"]');
  }

  async navigate(): Promise<void> { await this.goto('/admin/settings'); }
}
