import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class AdminShippingPage extends BasePage {
  readonly zoneRows: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.zoneRows = page.locator('table tbody tr, [class*="zone"]');
  }

  async navigate(): Promise<void> { await this.goto('/admin/shipping'); }
}
