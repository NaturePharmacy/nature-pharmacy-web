# 🔧 Refactoring Examples - Quick Reference Guide

This document provides concrete code examples for the refactoring recommendations from the Architecture Audit Report.

---

## 📋 Table of Contents

1. [Type Definitions](#1-type-definitions)
2. [API Client Layer](#2-api-client-layer)
3. [Component Refactoring](#3-component-refactoring)
4. [Business Logic Extraction](#4-business-logic-extraction)
5. [Constants Centralization](#5-constants-centralization)

---

## 1. Type Definitions

### ❌ BEFORE - Duplicated Types Everywhere

```typescript
// app/[locale]/products/page.tsx
interface Product {
  _id: string;
  name: { fr: string; en: string; es: string };
  price: number;
  stock: number;
}

// app/[locale]/wishlist/page.tsx
interface Product {
  _id: string;
  name: { fr: string; en: string; es: string };
  slug: string;
  images: string[];
  price: number;
}

// components/products/ProductCard.tsx
interface Product {
  _id: string;
  name: { fr: string; en: string; es: string };
  slug: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  rating: number;
}
```

### ✅ AFTER - Centralized Type Definitions

```typescript
// types/models.ts
export interface LocalizedText {
  fr: string;
  en: string;
  es: string;
}

export interface Product {
  _id: string;
  name: LocalizedText;
  description: LocalizedText;
  slug: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  basePrice: number;
  commission: number;
  stock: number;
  rating: number;
  reviewCount: number;
  isOrganic: boolean;
  isFeatured: boolean;
  category: string;
  seller: string | User;

  // Medical fields
  therapeuticCategory?: string[];
  form?: string;
  activeIngredients?: LocalizedText;
  dosage?: LocalizedText;
  contraindications?: LocalizedText;
  sideEffects?: LocalizedText;
  safePregnancy?: boolean;
  safeChildren?: boolean;
  certifications?: string[];

  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
  phone?: string;
  address?: Address;
  sellerInfo?: SellerInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
}

export interface SellerInfo {
  storeName: string;
  storeDescription: string;
  verified: boolean;
  rating: number;
  totalSales: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  items: OrderItem[];
  totalPrice: number;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  product: string | Product;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type Locale = 'fr' | 'en' | 'es';
```

```typescript
// types/api.ts
import { Product, Order, User, Locale } from './models';

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Product API
export interface ProductsQuery extends PaginationParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isOrganic?: boolean;
  sort?: string;
  therapeuticCategory?: string;
  form?: string;
  certifications?: string[];
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationResponse;
}

export interface ProductResponse {
  product: Product;
}

// Order API
export interface CreateOrderRequest {
  items: { productId: string; quantity: number }[];
  shippingAddress: Address;
  paymentMethod: string;
}

export interface OrderResponse {
  order: Order;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: PaginationResponse;
}

// Error Response
export interface ErrorResponse {
  error: string;
  message?: string;
  details?: any;
}
```

```typescript
// types/common.ts
export type { Locale } from './models';

export interface Filters {
  search: string;
  sort: string;
  minPrice: string;
  maxPrice: string;
  isOrganic: boolean;
  category: string;
  therapeuticCategory: string;
  form: string;
  indication: string;
  certifications: string[];
  safePregnancy: boolean;
  safeChildren: boolean;
}

export interface CartItem {
  productId: string;
  name: LocalizedText;
  slug: string;
  price: number;
  quantity: number;
  stock: number;
  image: string;
}
```

```typescript
// types/index.ts - Re-export everything
export * from './models';
export * from './api';
export * from './common';
```

**Usage in components**:
```typescript
// app/[locale]/products/page.tsx
import { Product, ProductsResponse, Filters } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters>({...});
  // Type-safe!
}
```

---

## 2. API Client Layer

### ❌ BEFORE - Raw fetch() in every component

```typescript
// app/[locale]/products/page.tsx
const fetchProducts = async () => {
  try {
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    if (res.ok) {
      setProducts(data.products);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// app/[locale]/orders/page.tsx
const fetchOrders = async () => {
  try {
    const res = await fetch('/api/orders');
    const data = await res.json();
    if (res.ok) {
      setOrders(data.orders);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### ✅ AFTER - Typed API Client

```typescript
// lib/api/client.ts
import { ErrorResponse } from '@/types';

class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ErrorResponse;
        throw new ApiError(
          response.status,
          errorData.error || 'Request failed',
          errorData.details
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Network error', error);
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return this.request<T>(`${endpoint}${searchParams}`, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
export { ApiError };
```

```typescript
// lib/api/products.ts
import { apiClient } from './client';
import {
  Product,
  ProductsResponse,
  ProductResponse,
  ProductsQuery,
} from '@/types';

export const productsApi = {
  getAll: (query: Partial<ProductsQuery> = {}) => {
    return apiClient.get<ProductsResponse>('/products', query);
  },

  getBySlug: (slug: string) => {
    return apiClient.get<ProductResponse>(`/products/slug/${slug}`);
  },

  getById: (id: string) => {
    return apiClient.get<ProductResponse>(`/products/${id}`);
  },

  getFeatured: () => {
    return apiClient.get<ProductsResponse>('/products', { isFeatured: true });
  },

  search: (query: string) => {
    return apiClient.get<ProductsResponse>('/products', { search: query });
  },
};
```

```typescript
// lib/api/orders.ts
import { apiClient } from './client';
import { Order, OrdersResponse, CreateOrderRequest } from '@/types';

export const ordersApi = {
  getAll: (page = 1, limit = 10) => {
    return apiClient.get<OrdersResponse>('/orders', { page, limit });
  },

  getById: (id: string) => {
    return apiClient.get<{ order: Order }>(`/orders/${id}`);
  },

  create: (data: CreateOrderRequest) => {
    return apiClient.post<{ order: Order }>('/orders', data);
  },

  cancel: (id: string) => {
    return apiClient.put<{ order: Order }>(`/orders/${id}`, {
      status: 'cancelled',
    });
  },
};
```

```typescript
// lib/api/index.ts
export * from './client';
export * from './products';
export * from './orders';
export * from './users';
```

**Usage in components**:
```typescript
// app/[locale]/products/page.tsx
import { productsApi, ApiError } from '@/lib/api';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>('');

  const fetchProducts = async () => {
    try {
      const { products, pagination } = await productsApi.getAll({
        page: 1,
        limit: 12,
        category: 'medicinal-plants',
      });
      setProducts(products);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      }
    }
  };

  // Much cleaner!
}
```

---

## 3. Component Refactoring

### ❌ BEFORE - Massive 421-line Header.tsx

```typescript
// components/layout/Header.tsx (421 lines)
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  return (
    <header>
      {/* Logo */}
      <Link href="/">...</Link>

      {/* Categories Dropdown */}
      <div>...</div>

      {/* Search Bar */}
      <SearchBar />

      {/* User Menu */}
      <div>...</div>

      {/* Cart */}
      <div>...</div>

      {/* Mobile Menu */}
      {mobileMenuOpen && <div>...</div>}
    </header>
  );
}
```

### ✅ AFTER - Modular Header Components

```typescript
// components/layout/Header/index.tsx (< 100 lines)
import HeaderLogo from './HeaderLogo';
import HeaderCategories from './HeaderCategories';
import HeaderSearch from './HeaderSearch';
import HeaderActions from './HeaderActions';
import HeaderMobile from './HeaderMobile';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16 gap-4">
            <HeaderLogo />

            <div className="hidden md:flex flex-1 gap-4">
              <HeaderCategories />
              <HeaderSearch />
            </div>

            <HeaderActions
              onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>
        </div>
      </div>

      <HeaderMobile
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
```

```typescript
// components/layout/Header/HeaderLogo.tsx
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

export default function HeaderLogo() {
  const locale = useLocale();

  return (
    <Link href={`/${locale}`} className="flex-shrink-0 flex items-center gap-2">
      <Image
        src={locale === 'en' ? '/logo-en.jpg' : '/logo-fr.jpg'}
        alt="Nature Pharmacy"
        width={200}
        height={64}
        className="h-14 w-auto"
      />
    </Link>
  );
}
```

```typescript
// components/layout/Header/HeaderCategories.tsx
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { CATEGORIES } from '@/lib/constants/categories';

export default function HeaderCategories() {
  const t = useTranslations('nav.categories');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg"
      >
        <span>📋 Categories</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg p-4 min-w-[200px]">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/${locale}/products?category=${category.slug}`}
              className="block px-4 py-2 hover:bg-gray-50 rounded"
              onClick={() => setIsOpen(false)}
            >
              {category.icon} {t(category.key)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

```typescript
// components/layout/Header/HeaderActions.tsx
import { useSession } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import HeaderUserMenu from './HeaderUserMenu';
import Link from 'next/link';

interface HeaderActionsProps {
  onMobileMenuToggle: () => void;
}

export default function HeaderActions({ onMobileMenuToggle }: HeaderActionsProps) {
  const { data: session } = useSession();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <div className="flex items-center gap-3">
      {/* Cart */}
      <Link href="/cart" className="relative p-2">
        🛒
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Link>

      {/* User Menu or Login */}
      {session ? (
        <HeaderUserMenu user={session.user} />
      ) : (
        <Link href="/login" className="px-4 py-2 text-green-600 font-medium">
          Login
        </Link>
      )}

      {/* Mobile Menu Toggle */}
      <button
        onClick={onMobileMenuToggle}
        className="md:hidden p-2"
      >
        ☰
      </button>
    </div>
  );
}
```

**Benefits**:
- Each component < 100 lines
- Easy to test
- Reusable
- Clear responsibilities
- Better performance (less re-renders)

---

## 4. Business Logic Extraction

### ❌ BEFORE - Business Logic in Components

```typescript
// app/[locale]/cart/page.tsx
export default function CartPage() {
  const { items, getCartTotal } = useCart();

  // ❌ Business logic in component
  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;  // Hardcoded 10%
  const total = subtotal + shippingCost + tax - couponDiscount;

  return <div>...</div>;
}
```

### ✅ AFTER - Pure Business Logic Functions

```typescript
// lib/business/pricing.ts
export const TAX_RATE = 0.1; // 10%
export const FREE_SHIPPING_THRESHOLD = 50; // $50 USD

export interface PriceCalculation {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export function calculateCartPricing(
  subtotal: number,
  shippingCost: number,
  couponDiscount: number = 0
): PriceCalculation {
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shippingCost + tax - couponDiscount;

  return {
    subtotal,
    tax,
    shipping: shippingCost,
    discount: couponDiscount,
    total: Math.max(0, total), // Never negative
  };
}

export function calculateShipping(
  subtotal: number,
  baseShipping: number
): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return baseShipping;
}

export function applyCoupon(
  subtotal: number,
  couponType: 'percentage' | 'fixed',
  couponValue: number
): number {
  if (couponType === 'percentage') {
    return subtotal * (couponValue / 100);
  }
  return Math.min(couponValue, subtotal); // Can't discount more than subtotal
}
```

```typescript
// lib/business/cart.ts
import { CartItem } from '@/types';

export function calculateItemTotal(item: CartItem): number {
  return item.price * item.quantity;
}

export function calculateCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
}

export function isItemInStock(item: CartItem): boolean {
  return item.quantity <= item.stock;
}

export function validateCart(items: CartItem[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (items.length === 0) {
    errors.push('Cart is empty');
  }

  items.forEach((item) => {
    if (!isItemInStock(item)) {
      errors.push(`${item.name.en} is out of stock`);
    }
    if (item.quantity <= 0) {
      errors.push(`${item.name.en} has invalid quantity`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

**Usage in components**:
```typescript
// app/[locale]/cart/page.tsx
import { calculateCartPricing, calculateShipping } from '@/lib/business/pricing';
import { calculateCartSubtotal, validateCart } from '@/lib/business/cart';

export default function CartPage() {
  const { items } = useCart();
  const [shippingCost, setShippingCost] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const subtotal = calculateCartSubtotal(items);
  const pricing = calculateCartPricing(subtotal, shippingCost, couponDiscount);
  const { valid, errors } = validateCart(items);

  // Clean, testable, reusable!

  return (
    <div>
      <p>Subtotal: ${pricing.subtotal}</p>
      <p>Tax: ${pricing.tax}</p>
      <p>Shipping: ${pricing.shipping}</p>
      <p>Discount: ${pricing.discount}</p>
      <p>Total: ${pricing.total}</p>

      {!valid && errors.map(error => <p key={error}>{error}</p>)}
    </div>
  );
}
```

---

## 5. Constants Centralization

### ❌ BEFORE - Hardcoded Everywhere

```typescript
// app/[locale]/page.tsx
const categories = [
  { key: 'medicinal-plants', slug: 'medicinal-plants', icon: '🌿', image: '...' },
  { key: 'essential-oils', slug: 'essential-oils', icon: '💧', image: '...' },
  // ...
];

// app/[locale]/products/page.tsx
const categories = [
  { key: 'medicinal-plants', slug: 'medicinal-plants' },
  { key: 'essential-oils', slug: 'essential-oils' },
  // ...
];

// components/layout/Header.tsx
const categories = [
  { key: 'medicinal-plants', icon: '🌿' },
  { key: 'essential-oils', icon: '💧' },
  // ...
];
```

### ✅ AFTER - Single Source of Truth

```typescript
// lib/constants/categories.ts
export interface Category {
  key: string;
  slug: string;
  icon: string;
  image?: string;
}

export const CATEGORIES: Category[] = [
  {
    key: 'medicinal-plants',
    slug: 'medicinal-plants',
    icon: '🌿',
    image: 'https://images.unsplash.com/photo-1498654200943-1088dd4438ae',
  },
  {
    key: 'essential-oils',
    slug: 'essential-oils',
    icon: '💧',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108',
  },
  {
    key: 'natural-cosmetics',
    slug: 'natural-cosmetics',
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273',
  },
  {
    key: 'herbal-teas',
    slug: 'herbal-teas',
    icon: '🍵',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9',
  },
  {
    key: 'traditional-remedies',
    slug: 'traditional-remedies',
    icon: '🏺',
    image: 'https://images.unsplash.com/photo-1507281549322-7bd535a1a486',
  },
  {
    key: 'supplements',
    slug: 'supplements',
    icon: '💊',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2',
  },
];

// Helper functions
export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.slug === slug);
}

export function getCategoryIcon(slug: string): string {
  return getCategoryBySlug(slug)?.icon || '📦';
}

// Variants for different use cases
export const categoriesWithImages = () => CATEGORIES;
export const categoriesIconsOnly = () =>
  CATEGORIES.map(({ key, slug, icon }) => ({ key, slug, icon }));
export const categoriesSlugsOnly = () =>
  CATEGORIES.map(({ key, slug }) => ({ key, slug }));
```

```typescript
// lib/constants/routes.ts
export const ROUTES = {
  home: (locale: string) => `/${locale}`,
  products: (locale: string) => `/${locale}/products`,
  productDetail: (locale: string, slug: string) => `/${locale}/products/${slug}`,
  cart: (locale: string) => `/${locale}/cart`,
  checkout: (locale: string) => `/${locale}/checkout`,
  account: (locale: string) => `/${locale}/account`,
  orders: (locale: string) => `/${locale}/orders`,
  orderDetail: (locale: string, id: string) => `/${locale}/orders/${id}`,

  // Seller routes
  sellerDashboard: (locale: string) => `/${locale}/seller`,
  sellerProducts: (locale: string) => `/${locale}/seller/products`,
  sellerOrders: (locale: string) => `/${locale}/seller/orders`,

  // Admin routes
  adminDashboard: (locale: string) => `/${locale}/admin`,
  adminProducts: (locale: string) => `/${locale}/admin/products`,
  adminUsers: (locale: string) => `/${locale}/admin/users`,

  // Auth routes
  login: (locale: string) => `/${locale}/login`,
  register: (locale: string) => `/${locale}/register`,
  becomeSeller: (locale: string) => `/${locale}/become-seller`,
} as const;
```

```typescript
// lib/constants/config.ts
export const APP_CONFIG = {
  name: 'Nature Pharmacy',
  description: 'Traditional Medicine Marketplace',
  supportedLocales: ['fr', 'en', 'es'] as const,
  defaultLocale: 'fr' as const,

  pagination: {
    defaultLimit: 12,
    maxLimit: 100,
  },

  cart: {
    maxQuantity: 99,
  },

  pricing: {
    taxRate: 0.1,
    freeShippingThreshold: 50,
  },

  features: {
    enableReviews: true,
    enableWishlist: true,
    enableLoyalty: true,
    enableCoupons: true,
  },
} as const;
```

**Usage**:
```typescript
// app/[locale]/page.tsx
import { CATEGORIES } from '@/lib/constants/categories';
import { ROUTES } from '@/lib/constants/routes';

export default function HomePage() {
  const locale = useLocale();

  return (
    <div>
      {CATEGORIES.map(category => (
        <Link key={category.slug} href={ROUTES.products(locale)}>
          {category.icon} {category.key}
        </Link>
      ))}
    </div>
  );
}
```

---

## 📝 Summary

These refactoring examples show how to:

1. ✅ **Eliminate type duplication** with centralized type definitions
2. ✅ **Create type-safe API layer** for consistent data fetching
3. ✅ **Break down large components** into focused, testable pieces
4. ✅ **Extract business logic** into pure, reusable functions
5. ✅ **Centralize constants** for easier maintenance

**Benefits**:
- Type safety throughout the codebase
- Easier to test (pure functions)
- Better code reuse
- Clearer separation of concerns
- Faster onboarding for new developers
- Easier to refactor safely

**Next Steps**: Follow the 5-phase plan in `ARCHITECTURE_AUDIT_REPORT.md`
