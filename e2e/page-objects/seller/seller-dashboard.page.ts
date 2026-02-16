import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class SellerDashboardPage extends BasePage {
  readonly statsCards: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.statsCards = page.locator('[class*="bg-white"][class*="rounded"]');
  }

  async navigate(): Promise<void> { await this.goto('/seller'); }
}
