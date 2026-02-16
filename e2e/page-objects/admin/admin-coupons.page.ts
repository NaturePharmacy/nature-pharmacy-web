import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class AdminCouponsPage extends BasePage {
  readonly couponRows: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.couponRows = page.locator('table tbody tr');
  }

  async navigate(): Promise<void> { await this.goto('/admin/coupons'); }
}
