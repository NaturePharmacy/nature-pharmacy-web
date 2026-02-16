import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class OrdersPage extends BasePage {
  readonly orderRows: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.orderRows = page.locator('tr, a[href*="/orders/"]');
  }

  async navigate(): Promise<void> { await this.goto('/orders'); }
}
