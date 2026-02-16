/**
 * i18n / locale helpers for E2E tests
 */

export const LOCALES = ['fr', 'en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];

export function localizedUrl(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/** Common route paths for testing */
export const ROUTES = {
  home: '/',
  products: '/products',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  cart: '/cart',
  checkout: '/checkout',
  orders: '/orders',
  wishlist: '/wishlist',
  account: '/account',
  messages: '/messages',
  support: '/support',
  blog: '/blog',
  about: '/about',
  contact: '/contact',
  faq: '/faq',
  seller: {
    dashboard: '/seller',
    products: '/seller/products',
    newProduct: '/seller/products/new',
    orders: '/seller/orders',
    analytics: '/seller/analytics',
  },
  admin: {
    dashboard: '/admin',
    users: '/admin/users',
    products: '/admin/products',
    orders: '/admin/orders',
    categories: '/admin/categories',
    coupons: '/admin/coupons',
    blog: '/admin/blog',
    shipping: '/admin/shipping',
    settings: '/admin/settings',
    reviews: '/admin/reviews',
    tickets: '/admin/tickets',
    sellers: '/admin/sellers',
  },
} as const;
