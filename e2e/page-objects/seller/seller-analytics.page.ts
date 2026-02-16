import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class SellerAnalyticsPage extends BasePage {
  readonly revenueCard: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.revenueCard = page.locator('[class*="bg-white"]').first();
  }

  async navigate(): Promise<void> { await this.goto('/seller/analytics'); }
}
