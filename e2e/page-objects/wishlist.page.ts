import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class WishlistPage extends BasePage {
  readonly wishlistItems: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.wishlistItems = page.locator('[class*="product"], [class*="wishlist-item"], .grid > div.bg-white, a[href*="/products/"]');
  }

  async navigate(): Promise<void> { await this.goto('/wishlist'); }
}
