import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class AdminBlogPage extends BasePage {
  readonly blogRows: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.blogRows = page.locator('table tbody tr, [class*="blog-item"]');
  }

  async navigate(): Promise<void> { await this.goto('/admin/blog'); }
}
