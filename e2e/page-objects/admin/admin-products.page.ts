import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class AdminProductsPage extends BasePage {
  readonly productRows: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.productRows = page.locator('table tbody tr');
  }

  async navigate(): Promise<void> { await this.goto('/admin/products'); }
}
