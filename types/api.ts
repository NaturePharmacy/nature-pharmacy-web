/**
 * API Request and Response Types
 * Type definitions for all API endpoints
 */

import type {
  Product,
  ProductSummary,
  User,
  Order,
  Review,
  ReviewStats,
  Category,
  ShippingZone,
  Notification,
  Coupon,
} from './models';

// ============================================================================
// COMMON API TYPES
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  total: number;
  page: number;
  pages: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
}

// ============================================================================
// PRODUCT API
// ============================================================================

export interface ProductsQuery extends PaginationParams {
  search?: string;
  category?: string;
  seller?: string;
  minPrice?: number;
  maxPrice?: number;
  isOrganic?: boolean;
  isFeatured?: boolean;
  sort?: string; // 'newest', 'price-asc', 'price-desc', 'rating', 'popular'

  // Traditional medicine filters
  therapeuticCategory?: string;
  form?: string;
  certifications?: string[];
  origin?: string;
}

export interface ProductsResponse {
  products: ProductSummary[];
  pagination: PaginationResponse;
  filters?: {
    categories: Array<{ _id: string; name: string; count: number }>;
    priceRange: { min: number; max: number };
    therapeuticCategories: string[];
    forms: string[];
  };
}

export interface ProductResponse {
  product: Product;
  relatedProducts?: ProductSummary[];
}

export interface CreateProductRequest {
  name: { fr: string; en: string; es: string };
  description: { fr: string; en: string; es: string };
  category: string;
  images: string[];
  basePrice: number;
  stock: number;
  isOrganic: boolean;
  therapeuticCategory?: string;
  form?: string;
  // ... other optional fields
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  _id: string;
}

// ============================================================================
// USER API
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  avatar?: string;
}

export interface UpgradeToSellerRequest {
  storeName: string;
  storeDescription: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
  };
}

// ============================================================================
// ORDER API
// ============================================================================

export interface CreateOrderRequest {
  items: Array<{
    product: string;
    quantity: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
  };
  paymentMethod: string;
  customerNotes?: string;
  couponCode?: string;
}

export interface OrdersQuery extends PaginationParams {
  status?: string;
  customer?: string;
  seller?: string;
  startDate?: string;
  endDate?: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: PaginationResponse;
  stats?: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

export interface OrderResponse {
  order: Order;
}

export interface UpdateOrderStatusRequest {
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  carrier?: string;
  adminNotes?: string;
}

// ============================================================================
// REVIEW API
// ============================================================================

export interface CreateReviewRequest {
  product: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export interface ReviewsQuery extends PaginationParams {
  product?: string;
  user?: string;
  rating?: number;
  verified?: boolean;
  sort?: 'recent' | 'helpful' | 'rating-high' | 'rating-low';
}

export interface ReviewsResponse {
  reviews: Review[];
  stats: ReviewStats;
  pagination: PaginationResponse;
}

export interface ReviewResponse {
  review: Review;
}

// ============================================================================
// CART API
// ============================================================================

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  productId: string;
  quantity: number;
}

export interface CartResponse {
  items: Array<{
    product: Product;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  itemCount: number;
}

// ============================================================================
// WISHLIST API
// ============================================================================

export interface WishlistResponse {
  products: ProductSummary[];
  total: number;
}

// ============================================================================
// SEARCH API
// ============================================================================

export interface SearchQuery {
  q: string;
  limit?: number;
  category?: string;
}

export interface SearchResponse {
  products: ProductSummary[];
  categories: Category[];
  total: number;
}

// ============================================================================
// CATEGORY API
// ============================================================================

export interface CategoriesResponse {
  categories: Category[];
  total: number;
}

export interface CategoryResponse {
  category: Category;
  products?: ProductSummary[];
}

// ============================================================================
// SHIPPING API
// ============================================================================

export interface CalculateShippingRequest {
  country: string;
  region?: string;
  weight?: number;
  subtotal: number;
}

export interface CalculateShippingResponse {
  zones: ShippingZone[];
  recommended: ShippingZone;
}

// ============================================================================
// SELLER API
// ============================================================================

export interface SellerStatsResponse {
  stats: {
    totalProducts: number;
    activeProducts: number;
    outOfStockProducts: number;
    lowStockProducts: number;
    totalRevenue: number;
    totalSales: number;
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
  };
  recentOrders: Order[];
  topProducts: Array<{
    _id: string;
    name: { fr: string; en: string; es: string };
    slug: string;
    image: string;
    sold: number;
    revenue: number;
  }>;
}

// ============================================================================
// ADMIN API
// ============================================================================

export interface AdminDashboardResponse {
  stats: {
    totalUsers: number;
    totalCustomers: number;
    totalSellers: number;
    totalAdmins: number;
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    totalRevenue: number;
    platformRevenue: number; // Total commission earned
  };
  recentOrders: Order[];
  recentUsers: User[];
  topProducts: ProductSummary[];
  topSellers: User[];
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'customer' | 'seller' | 'admin';
  isActive?: boolean;
  isVerified?: boolean;
}

// ============================================================================
// NOTIFICATION API
// ============================================================================

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: PaginationResponse;
}

export interface MarkNotificationReadRequest {
  notificationId: string;
}

// ============================================================================
// COUPON API
// ============================================================================

export interface ValidateCouponRequest {
  code: string;
  subtotal: number;
  items?: Array<{ product: string; quantity: number }>;
}

export interface ValidateCouponResponse {
  valid: boolean;
  coupon?: Coupon;
  discount: number;
  message?: string;
}

// ============================================================================
// FILE UPLOAD API
// ============================================================================

export interface UploadResponse {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface UploadMultipleResponse {
  urls: string[];
  files: UploadResponse[];
}
