/**
 * Common shared types used across the application
 */

// ============================================================================
// LOCALE & I18N
// ============================================================================

export type Locale = 'fr' | 'en' | 'es';

export const LOCALES: Locale[] = ['fr', 'en', 'es'];

export interface LocalizedText {
  fr: string;
  en: string;
  es: string;
}

export interface LocaleConfig {
  code: Locale;
  name: string;
  flag: string;
  currency: string;
  direction: 'ltr' | 'rtl';
}

// ============================================================================
// PAGINATION
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// ============================================================================
// SORTING
// ============================================================================

export type SortOrder = 'asc' | 'desc';

export interface SortOption {
  field: string;
  order: SortOrder;
}

export type ProductSortBy =
  | 'newest'
  | 'oldest'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'popular'
  | 'name-asc'
  | 'name-desc';

// ============================================================================
// FILTERING
// ============================================================================

export interface PriceRange {
  min: number;
  max: number;
}

export interface ProductFilters {
  search?: string;
  category?: string | string[];
  seller?: string;
  priceRange?: PriceRange;
  isOrganic?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
  rating?: number; // Minimum rating

  // Traditional medicine specific
  therapeuticCategory?: string | string[];
  form?: string | string[];
  certifications?: string[];
  origin?: string;
}

export interface OrderFilters {
  status?: string | string[];
  customer?: string;
  seller?: string;
  dateRange?: {
    start: string | Date;
    end: string | Date;
  };
  minAmount?: number;
  maxAmount?: number;
}

// ============================================================================
// FORM STATE
// ============================================================================

export interface FormError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: FormError[];
  isSubmitting: boolean;
  isValid: boolean;
}

// ============================================================================
// API STATE
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  error?: string | null;
}

export interface ApiState<T> extends LoadingState {
  data: T | null;
}

// ============================================================================
// MEDICAL CONSTANTS
// ============================================================================

export type TherapeuticCategory =
  | 'digestive'
  | 'respiratory'
  | 'cardiovascular'
  | 'nervous-system'
  | 'musculoskeletal'
  | 'immune-system'
  | 'skin-care'
  | 'metabolic'
  | 'reproductive'
  | 'urinary'
  | 'detox'
  | 'general-wellness';

export type ProductForm =
  | 'powder'
  | 'capsule'
  | 'tablet'
  | 'dried-plant'
  | 'fresh-plant'
  | 'oil'
  | 'tincture'
  | 'syrup'
  | 'tea'
  | 'cream'
  | 'balm'
  | 'extract';

export type Certification =
  | 'organic'
  | 'fair-trade'
  | 'traditional'
  | 'eco-cert'
  | 'halal'
  | 'kosher'
  | 'gmp'
  | 'wildcrafted';

// ============================================================================
// UI STATE
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export type ModalType = 'confirm' | 'alert' | 'custom';

export interface ModalState {
  isOpen: boolean;
  type: ModalType;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// ============================================================================
// ROUTE PARAMS
// ============================================================================

export interface LocaleParams {
  locale: Locale;
}

export interface ProductParams extends LocaleParams {
  slug: string;
}

export interface CategoryParams extends LocaleParams {
  slug: string;
}

export interface SellerParams extends LocaleParams {
  id: string;
}

export interface OrderParams extends LocaleParams {
  id: string;
}

// ============================================================================
// SEARCH PARAMS
// ============================================================================

export interface ProductSearchParams {
  q?: string;
  category?: string;
  sort?: ProductSortBy;
  page?: string;
  limit?: string;
  minPrice?: string;
  maxPrice?: string;
  isOrganic?: string;
  therapeuticCategory?: string;
  form?: string;
}

export interface OrderSearchParams {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingComponentProps extends BaseComponentProps {
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

// ============================================================================
// FILE UPLOAD
// ============================================================================

export interface FileUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[]; // MIME types
  maxFiles?: number;
}

export interface UploadedFile {
  url: string;
  publicId: string;
  filename: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
}

// ============================================================================
// CURRENCY & PRICING
// ============================================================================

export type Currency = 'XOF' | 'EUR' | 'USD';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
  decimals: number;
  symbolPosition: 'before' | 'after';
}

export interface PriceInfo {
  amount: number;
  currency: Currency;
  formatted: string;
}

// ============================================================================
// ANALYTICS & STATS
// ============================================================================

export interface DateRange {
  start: string | Date;
  end: string | Date;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface StatsComparison {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: number | string | RegExp;
  message: string;
  validator?: (value: unknown) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// ============================================================================
// HTTP
// ============================================================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
}

// ============================================================================
// METADATA (SEO)
// ============================================================================

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  canonical?: string;
  noindex?: boolean;
}
