/**
 * Shared TypeScript types for domain models
 * This file contains all core business entity types used across the application
 */

// ============================================================================
// LOCALIZATION
// ============================================================================

export interface LocalizedText {
  fr: string;
  en: string;
  es: string;
}

export type Locale = 'fr' | 'en' | 'es';

// ============================================================================
// ADDRESS
// ============================================================================

export interface Address {
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
}

// ============================================================================
// PRODUCT
// ============================================================================

export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
}

export interface ProductWarnings {
  pregnancy?: boolean;
  breastfeeding?: boolean;
  children?: boolean;
  minAge?: number;
  prescriptionRequired?: boolean;
}

export interface Product {
  _id: string;
  name: LocalizedText;
  description: LocalizedText;
  slug: string;
  seller: string | User; // Can be populated
  category: string | Category; // Can be populated
  images: string[];

  // Pricing
  basePrice: number;
  price: number;
  commission: number;
  compareAtPrice?: number;

  // Inventory
  stock: number;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;

  // Status
  isOrganic: boolean;
  isFeatured: boolean;
  isActive: boolean;

  // Reviews
  rating: number;
  reviewCount: number;
  tags?: string[];

  // Traditional medicine specific fields
  therapeuticCategory?: string;
  indications?: {
    fr: string[];
    en: string[];
    es: string[];
  };
  traditionalUses?: LocalizedText;
  contraindications?: {
    fr: string[];
    en: string[];
    es: string[];
  };
  dosage?: LocalizedText;
  preparationMethod?: LocalizedText;
  activeIngredients?: {
    fr: string[];
    en: string[];
    es: string[];
  };

  // Origin and authenticity
  origin?: string;
  harvestMethod?: string;
  certifications?: string[];

  // Form and format
  form?: string; // "powder", "capsule", "dried_plant", "oil", "syrup"
  concentration?: string;

  // Safety
  warnings?: ProductWarnings;

  // Timestamps
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Lighter version for lists
export interface ProductSummary {
  _id: string;
  name: LocalizedText;
  slug: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  isOrganic: boolean;
  stock: number;
  category?: {
    _id: string;
    name: LocalizedText;
    slug: string;
  };
}

// ============================================================================
// CATEGORY
// ============================================================================

export interface Category {
  _id: string;
  name: LocalizedText;
  description?: LocalizedText;
  slug: string;
  icon?: string;
  image?: string;
  parent?: string | Category;
  isActive: boolean;
  order: number;
  productCount?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// ============================================================================
// USER
// ============================================================================

export interface SellerInfo {
  storeName?: string;
  storeDescription?: string;
  phone?: string;
  address?: Address;
  verified: boolean;
  rating?: number;
  totalSales?: number;
  commission: number; // Commission percentage (default 20%)
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'seller' | 'admin';
  avatar?: string;
  phone?: string;
  address?: Address;

  // Seller specific
  sellerInfo?: SellerInfo;

  // Customer specific
  wishlist?: string[]; // Product IDs
  cart?: CartItem[];

  // Account status
  isVerified: boolean;
  isActive: boolean;

  // Timestamps
  createdAt: string | Date;
  updatedAt: string | Date;
  lastLogin?: string | Date;
}

// ============================================================================
// CART
// ============================================================================

export interface CartItem {
  product: string | Product; // Can be populated
  quantity: number;
  price: number; // Price at the time of adding to cart
  addedAt: Date;
}

// ============================================================================
// ORDER
// ============================================================================

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface OrderItem {
  product: string | Product; // Can be populated
  seller: string | User; // Can be populated
  quantity: number;
  price: number; // Price at the time of order
  basePrice: number; // Seller's base price
  commission: number; // Platform commission amount
}

export interface ShippingInfo {
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string | Date;
  actualDelivery?: string | Date;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: string | User; // Can be populated
  items: OrderItem[];

  // Pricing
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;

  // Status
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;

  // Addresses
  shippingAddress: Address;
  billingAddress?: Address;

  // Shipping
  shippingZone?: string;
  shippingInfo?: ShippingInfo;

  // Notes
  customerNotes?: string;
  adminNotes?: string;

  // Timestamps
  createdAt: string | Date;
  updatedAt: string | Date;
  paidAt?: string | Date;
  shippedAt?: string | Date;
  deliveredAt?: string | Date;
}

// ============================================================================
// REVIEW
// ============================================================================

export interface Review {
  _id: string;
  product: string | Product; // Can be populated
  user: string | User; // Can be populated
  rating: number; // 1-5
  title: string;
  comment: string;
  images?: string[];
  helpful: number; // Count of helpful votes
  verified: boolean; // Verified purchase
  response?: {
    text: string;
    seller: string | User;
    createdAt: string | Date;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ReviewStats {
  average: number;
  total: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// ============================================================================
// SHIPPING ZONE
// ============================================================================

export interface ShippingZone {
  _id: string;
  name: LocalizedText;
  code: string;
  countries: string[];
  regions?: string[];
  rates: {
    standard: number;
    express?: number;
    free_threshold?: number; // Free shipping above this amount
  };
  estimatedDays: {
    min: number;
    max: number;
  };
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// ============================================================================
// NOTIFICATION
// ============================================================================

export type NotificationType =
  | 'order'
  | 'product'
  | 'account'
  | 'promotion'
  | 'system';

export interface Notification {
  _id: string;
  user: string | User;
  type: NotificationType;
  title: LocalizedText;
  message: LocalizedText;
  link?: string;
  isRead: boolean;
  createdAt: string | Date;
}

// ============================================================================
// COUPON
// ============================================================================

export type DiscountType = 'percentage' | 'fixed';

export interface Coupon {
  _id: string;
  code: string;
  description?: LocalizedText;
  discountType: DiscountType;
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: string | Date;
  validUntil: string | Date;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  applicableCategories?: string[]; // Category IDs
  applicableProducts?: string[]; // Product IDs
  createdAt: string | Date;
  updatedAt: string | Date;
}
