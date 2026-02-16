import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly heroSection: Locator;
  readonly productLinks: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.heroSection = page.locator('section, .bg-gradient-to-r, [class*="hero"], h1').first();
    this.productLinks = page.locator('a[href*="/products"]');
  }

  async navigate(): Promise<void> { await this.goto('/'); }
}
