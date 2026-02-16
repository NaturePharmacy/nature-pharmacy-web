import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class AdminOrdersPage extends BasePage {
  readonly orderRows: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.orderRows = page.locator('table tbody tr');
  }

  async navigate(): Promise<void> { await this.goto('/admin/orders'); }
}
