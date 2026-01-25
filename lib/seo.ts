/**
 * SEO Utilities
 * Helper functions for generating SEO metadata
 */

import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.naturepharmacy.com';

interface ProductSEOData {
  name: string;
  description: string;
  price: number;
  currency?: string;
  images: string[];
  category: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  slug: string;
  locale: string;
}

interface BlogSEOData {
  title: string;
  description: string;
  image?: string;
  author?: string;
  publishedAt: string;
  updatedAt?: string;
  slug: string;
  locale: string;
  tags?: string[];
}

/**
 * Generate metadata for product pages
 */
export function generateProductMetadata(product: ProductSEOData): Metadata {
  const url = `${BASE_URL}/${product.locale}/products/${product.slug}`;
  const image = product.images[0] || `${BASE_URL}/og-image.jpg`;

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    keywords: `${product.name}, ${product.category}, nature pharmacy, bio, naturel`,
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      url,
      type: 'website',
      images: [
        {
          url: image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description.slice(0, 160),
      images: [image],
    },
    alternates: {
      canonical: url,
      languages: {
        'fr': `${BASE_URL}/fr/products/${product.slug}`,
        'en': `${BASE_URL}/en/products/${product.slug}`,
        'es': `${BASE_URL}/es/products/${product.slug}`,
      },
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': product.currency || 'EUR',
      'product:availability': product.inStock ? 'in stock' : 'out of stock',
      'product:category': product.category,
    },
  };
}

/**
 * Generate metadata for blog posts
 */
export function generateBlogMetadata(post: BlogSEOData): Metadata {
  const url = `${BASE_URL}/${post.locale}/blog/${post.slug}`;
  const image = post.image || `${BASE_URL}/og-image.jpg`;

  return {
    title: post.title,
    description: post.description.slice(0, 160),
    keywords: post.tags?.join(', '),
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      title: post.title,
      description: post.description.slice(0, 160),
      url,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author] : undefined,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description.slice(0, 160),
      images: [image],
    },
    alternates: {
      canonical: url,
      languages: {
        'fr': `${BASE_URL}/fr/blog/${post.slug}`,
        'en': `${BASE_URL}/en/blog/${post.slug}`,
        'es': `${BASE_URL}/es/blog/${post.slug}`,
      },
    },
  };
}

/**
 * Generate JSON-LD structured data for products
 */
export function generateProductJsonLd(product: ProductSEOData): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Nature Pharmacy',
    },
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/${product.locale}/products/${product.slug}`,
      priceCurrency: product.currency || 'EUR',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Nature Pharmacy',
      },
    },
    aggregateRating: product.rating && product.reviewCount
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        }
      : undefined,
  };
}

/**
 * Generate JSON-LD structured data for blog posts
 */
export function generateBlogJsonLd(post: BlogSEOData): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author || 'Nature Pharmacy',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nature Pharmacy',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${post.locale}/blog/${post.slug}`,
    },
  };
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nature Pharmacy',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [
      'https://www.facebook.com/naturepharmacy',
      'https://www.instagram.com/naturepharmacy',
      'https://twitter.com/naturepharmacy',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+221-XX-XXX-XX-XX',
      contactType: 'customer service',
      availableLanguage: ['French', 'English', 'Spanish'],
    },
  };
}

/**
 * Generate breadcrumb JSON-LD
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
