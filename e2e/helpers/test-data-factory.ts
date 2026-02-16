import { randomUUID } from 'crypto';

export const TestData = {
  uniqueEmail(prefix: string = 'test'): string {
    return `${prefix}-${Date.now()}-${randomUUID().slice(0, 8)}@test.com`;
  },

  buyerRegistration(overrides: Partial<any> = {}) {
    return {
      name: 'Test Buyer',
      email: this.uniqueEmail('buyer'),
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!',
      phone: '+221771234567',
      ...overrides,
    };
  },

  shippingAddress(overrides: Partial<any> = {}) {
    return {
      fullName: 'Test Buyer',
      phone: '+221771234567',
      address: '123 Rue Test',
      city: 'Dakar',
      country: 'SN',
      postalCode: '12000',
      ...overrides,
    };
  },

  product(overrides: Partial<any> = {}) {
    const id = randomUUID().slice(0, 8);
    return {
      name: `Produit Test ${id}`,
      description: `Description du produit test ${id}`,
      price: '5000',
      stock: '100',
      isOrganic: true,
      weight: '250g',
      ...overrides,
    };
  },

  coupon(overrides: Partial<any> = {}) {
    return {
      code: `TEST${Date.now()}`,
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 20,
      maxUses: 100,
      isActive: true,
      ...overrides,
    };
  },

  /** Test user credentials (must match createTestUsers.ts seed) */
  users: {
    admin: { email: 'admin@test.com', password: 'password123', name: 'Admin Test' },
    seller: { email: 'seller@test.com', password: 'password123', name: 'Vendeur Test' },
    buyer: { email: 'buyer@test.com', password: 'password123', name: 'Acheteur Test' },
  },
};
