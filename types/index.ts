/**
 * Centralized type exports
 * Import all types from this single file: import { Product, User, ApiError } from '@/types'
 */

// Re-export all model types
export type {
  // Localization
  LocalizedText,
  Locale,

  // Address
  Address,

  // Product
  Product,
  ProductSummary,
  ProductDimensions,
  ProductWarnings,

  // Category
  Category,

  // User
  User,
  SellerInfo,

  // Cart
  CartItem,

  // Order
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  ShippingInfo,

  // Review
  Review,
  ReviewStats,

  // Shipping
  ShippingZone,

  // Notification
  Notification,
  NotificationType,

  // Coupon
  Coupon,
  DiscountType,
} from './models';

// Re-export all API types
export type {
  // Common
  PaginationParams,
  PaginationResponse,
  ApiError,
  ApiSuccess,

  // Product API
  ProductsQuery,
  ProductsResponse,
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest,

  // User API
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UpdateProfileRequest,
  UpgradeToSellerRequest,

  // Order API
  CreateOrderRequest,
  OrdersQuery,
  OrdersResponse,
  OrderResponse,
  UpdateOrderStatusRequest,

  // Review API
  CreateReviewRequest,
  ReviewsQuery,
  ReviewsResponse,
  ReviewResponse,

  // Cart API
  AddToCartRequest,
  UpdateCartItemRequest,
  CartResponse,

  // Wishlist API
  WishlistResponse,

  // Search API
  SearchQuery,
  SearchResponse,

  // Category API
  CategoriesResponse,
  CategoryResponse,

  // Shipping API
  CalculateShippingRequest,
  CalculateShippingResponse,

  // Seller API
  SellerStatsResponse,

  // Admin API
  AdminDashboardResponse,
  UpdateUserRequest,

  // Notification API
  NotificationsResponse,
  MarkNotificationReadRequest,

  // Coupon API
  ValidateCouponRequest,
  ValidateCouponResponse,

  // File Upload API
  UploadResponse,
  UploadMultipleResponse,
} from './api';

// Re-export all common types
export type {
  // Locale
  Locale as CommonLocale, // Avoid conflict with models.ts
  LocalizedText as CommonLocalizedText,
  LocaleConfig,

  // Pagination
  PaginationParams as CommonPaginationParams,
  PaginationInfo,
  PaginatedResponse,

  // Sorting
  SortOrder,
  SortOption,
  ProductSortBy,

  // Filtering
  PriceRange,
  ProductFilters,
  OrderFilters,

  // Form
  FormError,
  FormState,

  // API State
  LoadingState,
  ApiState,

  // Medical
  TherapeuticCategory,
  ProductForm,
  Certification,

  // UI
  ToastType,
  Toast,
  ModalType,
  ModalState,

  // Route Params
  LocaleParams,
  ProductParams,
  CategoryParams,
  SellerParams,
  OrderParams,

  // Search Params
  ProductSearchParams,
  OrderSearchParams,

  // Component Props
  BaseComponentProps,
  LoadingComponentProps,

  // File Upload
  FileUploadOptions,
  UploadedFile,

  // Currency
  Currency,
  CurrencyConfig,
  PriceInfo,

  // Analytics
  DateRange,
  TimeSeriesData,
  StatsComparison,

  // Validation
  ValidationRule,
  ValidationResult,

  // HTTP
  HttpMethod,
  RequestConfig,

  // SEO
  PageMetadata,
} from './common';

// Export constants
export { LOCALES } from './common';
