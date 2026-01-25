/**
 * Dynamic Sitemap Generator
 * Generates sitemap.xml for SEO
 */

import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.naturepharmacy.com';

// Static pages that don't change frequently
const staticPages = [
  '',
  '/about',
  '/contact',
  '/blog',
  '/products',
  '/deals',
  '/careers',
  '/terms',
  '/privacy',
  '/terms-of-sale',
  '/terms-of-use',
  '/cookies',
  '/legal',
  '/shipping',
  '/returns',
  '/loyalty',
  '/referral',
  '/become-seller',
];

// Supported locales
const locales = ['fr', 'en', 'es'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      });
    }
  }

  // Fetch dynamic products
  try {
    const response = await fetch(`${BASE_URL}/api/products?limit=1000`, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const data = await response.json();
      const products = data.products || [];

      for (const product of products) {
        for (const locale of locales) {
          sitemapEntries.push({
            url: `${BASE_URL}/${locale}/products/${product.slug}`,
            lastModified: new Date(product.updatedAt || product.createdAt),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // Fetch blog posts
  try {
    const response = await fetch(`${BASE_URL}/api/blog?limit=500`, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const data = await response.json();
      const posts = data.posts || [];

      for (const post of posts) {
        for (const locale of locales) {
          sitemapEntries.push({
            url: `${BASE_URL}/${locale}/blog/${post.slug}`,
            lastModified: new Date(post.updatedAt || post.createdAt),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Fetch seller profiles
  try {
    const response = await fetch(`${BASE_URL}/api/sellers?limit=500`, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const data = await response.json();
      const sellers = data.sellers || [];

      for (const seller of sellers) {
        for (const locale of locales) {
          sitemapEntries.push({
            url: `${BASE_URL}/${locale}/sellers/${seller._id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching sellers for sitemap:', error);
  }

  return sitemapEntries;
}
