/**
 * Centralized category definitions
 * Single source of truth for all category data across the application
 */

import type { LocalizedText } from '@/types';

// ============================================================================
// CATEGORY TYPES
// ============================================================================

export interface CategoryDefinition {
  key: string;
  slug: string;
  icon: string;
  image?: string;
  order: number;
}

export interface CategoryWithName extends CategoryDefinition {
  name: LocalizedText;
  description: LocalizedText;
}

// ============================================================================
// CATEGORY SLUGS (for type safety)
// ============================================================================

export type CategorySlug =
  | 'medicinal-plants'
  | 'essential-oils'
  | 'natural-cosmetics'
  | 'herbal-teas'
  | 'traditional-remedies'
  | 'supplements';

// ============================================================================
// MAIN CATEGORIES DATA
// ============================================================================

/**
 * Core category data (minimal, for navigation and quick access)
 * Use this when you only need slug, icon, and image
 */
export const CATEGORIES: CategoryDefinition[] = [
  {
    key: 'medicinal-plants',
    slug: 'medicinal-plants',
    icon: '🌿',
    image: '/1.jpeg',
    order: 1,
  },
  {
    key: 'essential-oils',
    slug: 'essential-oils',
    icon: '💧',
    image: '/2.jpeg',
    order: 2,
  },
  {
    key: 'natural-cosmetics',
    slug: 'natural-cosmetics',
    icon: '✨',
    image: '/3.jpeg',
    order: 3,
  },
  {
    key: 'herbal-teas',
    slug: 'herbal-teas',
    icon: '🍵',
    image: '/4.jpeg',
    order: 4,
  },
  {
    key: 'traditional-remedies',
    slug: 'traditional-remedies',
    icon: '🏺',
    image: '/5.jpeg',
    order: 5,
  },
  {
    key: 'supplements',
    slug: 'supplements',
    icon: '💊',
    image: '/6.jpeg',
    order: 6,
  },
];

/**
 * Full category data with translations
 * Use this when you need localized names and descriptions
 */
export const CATEGORIES_WITH_NAMES: CategoryWithName[] = [
  {
    key: 'medicinal-plants',
    slug: 'medicinal-plants',
    icon: '🌿',
    image: '/1.jpeg',
    order: 1,
    name: {
      fr: 'Plantes Médicinales',
      en: 'Medicinal Plants',
      es: 'Plantas Medicinales',
    },
    description: {
      fr: 'Plantes aux vertus thérapeutiques reconnues',
      en: 'Plants with recognized therapeutic properties',
      es: 'Plantas con propiedades terapéuticas reconocidas',
    },
  },
  {
    key: 'essential-oils',
    slug: 'essential-oils',
    icon: '💧',
    image: '/2.jpeg',
    order: 2,
    name: {
      fr: 'Huiles Essentielles',
      en: 'Essential Oils',
      es: 'Aceites Esenciales',
    },
    description: {
      fr: 'Huiles essentielles pures et naturelles',
      en: 'Pure and natural essential oils',
      es: 'Aceites esenciales puros y naturales',
    },
  },
  {
    key: 'natural-cosmetics',
    slug: 'natural-cosmetics',
    icon: '✨',
    image: '/3.jpeg',
    order: 3,
    name: {
      fr: 'Cosmétiques Naturels',
      en: 'Natural Cosmetics',
      es: 'Cosméticos Naturales',
    },
    description: {
      fr: 'Produits de beauté 100% naturels',
      en: '100% natural beauty products',
      es: 'Productos de belleza 100% naturales',
    },
  },
  {
    key: 'herbal-teas',
    slug: 'herbal-teas',
    icon: '🍵',
    image: '/4.jpeg',
    order: 4,
    name: {
      fr: 'Tisanes',
      en: 'Herbal Teas',
      es: 'Infusiones',
    },
    description: {
      fr: 'Mélanges de plantes pour infusions bienfaisantes',
      en: 'Plant blends for beneficial infusions',
      es: 'Mezclas de plantas para infusiones beneficiosas',
    },
  },
  {
    key: 'traditional-remedies',
    slug: 'traditional-remedies',
    icon: '🏺',
    image: '/5.jpeg',
    order: 5,
    name: {
      fr: 'Remèdes Traditionnels',
      en: 'Traditional Remedies',
      es: 'Remedios Tradicionales',
    },
    description: {
      fr: 'Préparations ancestrales de médecine traditionnelle',
      en: 'Ancestral traditional medicine preparations',
      es: 'Preparaciones ancestrales de medicina tradicional',
    },
  },
  {
    key: 'supplements',
    slug: 'supplements',
    icon: '💊',
    image: '/6.jpeg',
    order: 6,
    name: {
      fr: 'Compléments Alimentaires',
      en: 'Dietary Supplements',
      es: 'Suplementos Alimenticios',
    },
    description: {
      fr: 'Compléments naturels pour votre bien-être',
      en: 'Natural supplements for your well-being',
      es: 'Suplementos naturales para tu bienestar',
    },
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find((cat) => cat.slug === slug);
}

/**
 * Get category with name by slug
 */
export function getCategoryWithNameBySlug(slug: string): CategoryWithName | undefined {
  return CATEGORIES_WITH_NAMES.find((cat) => cat.slug === slug);
}

/**
 * Get localized category name
 */
export function getCategoryName(slug: string, locale: 'fr' | 'en' | 'es'): string {
  const category = getCategoryWithNameBySlug(slug);
  return category?.name[locale] || slug;
}

/**
 * Get categories for navigation (icon only, no images)
 */
export function getCategoriesForNav(): Omit<CategoryDefinition, 'image'>[] {
  return CATEGORIES.map(({ key, slug, icon, order }) => ({
    key,
    slug,
    icon,
    order,
  }));
}

/**
 * Get categories for display (with images)
 */
export function getCategoriesWithImages(): CategoryDefinition[] {
  return CATEGORIES.filter((cat) => cat.image);
}

/**
 * Get categories sorted by order
 */
export function getSortedCategories(): CategoryDefinition[] {
  return [...CATEGORIES].sort((a, b) => a.order - b.order);
}

/**
 * Check if a slug is a valid category
 */
export function isValidCategory(slug: string): slug is CategorySlug {
  return CATEGORIES.some((cat) => cat.slug === slug);
}

// ============================================================================
// CATEGORY MAPPINGS (for filters, etc.)
// ============================================================================

/**
 * Map of category slugs to icons (useful for UI components)
 */
export const CATEGORY_ICONS: Record<CategorySlug, string> = {
  'medicinal-plants': '🌿',
  'essential-oils': '💧',
  'natural-cosmetics': '✨',
  'herbal-teas': '🍵',
  'traditional-remedies': '🏺',
  supplements: '💊',
};

/**
 * Map of category slugs to images
 */
export const CATEGORY_IMAGES: Record<CategorySlug, string> = {
  'medicinal-plants': '/1.jpeg',
  'essential-oils': '/2.jpeg',
  'natural-cosmetics': '/3.jpeg',
  'herbal-teas': '/4.jpeg',
  'traditional-remedies': '/5.jpeg',
  supplements: '/6.jpeg',
};

// ============================================================================
// VARIANTS (different views of the same data)
// ============================================================================

/**
 * Categories without images (for header/navigation)
 */
export const CATEGORIES_NAV = CATEGORIES.map(({ key, slug, icon }) => ({
  key,
  slug,
  icon,
}));

/**
 * Categories with all data (for category pages)
 */
export const CATEGORIES_FULL = CATEGORIES_WITH_NAMES;

/**
 * Category slugs only (for validation)
 */
export const CATEGORY_SLUGS: CategorySlug[] = CATEGORIES.map((cat) => cat.slug as CategorySlug);
