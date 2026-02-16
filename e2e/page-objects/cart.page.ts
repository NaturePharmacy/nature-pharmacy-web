import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly totalPrice: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    // Cart items are bg-white rounded-lg shadow-md divs with product info
    this.cartItems = page.locator('[data-testid="cart-item"], .bg-white.rounded-lg.shadow-md').filter({
      has: page.locator('img, a[href*="/products/"]'),
    });
    // Checkout link is an <a> tag with href to /checkout, or a button with checkout text
    this.checkoutButton = page.locator('a[href*="checkout"], button:has-text("commander"), button:has-text("checkout"), button:has-text("Commander"), button:has-text("Checkout")').first();
    // Total price appears in a bold span near the "Total" text
    this.totalPrice = page.getByText(/Total/i).first();
  }

  async navigate(): Promise<void> {
    await this.goto('/cart');
    await this.page.waitForLoadState('networkidle');
  }
}
