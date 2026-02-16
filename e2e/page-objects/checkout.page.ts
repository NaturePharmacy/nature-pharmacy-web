import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  readonly fullNameInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly postalCodeInput: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.fullNameInput = page.locator('#name, input[name="name"]').first();
    this.phoneInput = page.locator('#phone, input[name="phone"]').first();
    // The checkout form uses "street" not "address"
    this.addressInput = page.locator('#street, input[name="street"], #address, input[name="address"]').first();
    this.cityInput = page.locator('#city, input[name="city"]').first();
    this.stateInput = page.locator('#state, input[name="state"]').first();
    this.postalCodeInput = page.locator('#postalCode, input[name="postalCode"]').first();
    this.placeOrderButton = page.locator('button[type="submit"]').first();
  }

  async navigate(): Promise<void> { await this.goto('/checkout'); }

  async selectPaymentMethod(method: string): Promise<void> {
    // Map test method names to actual form values
    const methodMap: Record<string, string> = {
      cod: 'cash_on_delivery',
      stripe: 'stripe',
      paypal: 'paypal',
    };
    const value = methodMap[method] || method;
    await this.page.locator(`input[name="paymentMethod"][value="${value}"]`).check();
  }

  async fillShippingForm(address: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    country?: string;
    postalCode?: string;
  }): Promise<void> {
    await this.fullNameInput.fill(address.fullName);
    await this.phoneInput.fill(address.phone);
    await this.addressInput.fill(address.address);
    await this.cityInput.fill(address.city);
    // Also fill required fields: state and postalCode
    await this.stateInput.fill('Dakar');
    await this.postalCodeInput.fill(address.postalCode || '12000');
  }
}
