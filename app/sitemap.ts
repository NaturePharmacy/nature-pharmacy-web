import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Blog from '@/models/Blog';
import Category from '@/models/Category';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const locales = ['fr', 'en', 'es'];

  try {
    await connectDB();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [];
    const staticRoutes = ['', '/products', '/blog', '/about', '/contact'];

    for (const locale of locales) {
      for (const route of staticRoutes) {
        staticPages.push({
          url: `${baseUrl}/${locale}${route}`,
          lastModified: new Date(),
          changeFrequency: route === '/blog' ? 'daily' : 'weekly',
          priority: route === '' ? 1 : 0.8,
        });
      }
    }

    // Products
    const products = await Product.find({ isActive: true })
      .select('slug updatedAt')
      .lean();

    const productPages: MetadataRoute.Sitemap = [];
    for (const locale of locales) {
      for (const product of products) {
        productPages.push({
          url: `${baseUrl}/${locale}/products/${product.slug}`,
          lastModified: product.updatedAt || new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }

    // Blog articles
    const articles = await Blog.find({ isPublished: true })
      .select('slug updatedAt')
      .lean();

    const blogPages: MetadataRoute.Sitemap = [];
    for (const locale of locales) {
      for (const article of articles) {
        blogPages.push({
          url: `${baseUrl}/${locale}/blog/${article.slug}`,
          lastModified: article.updatedAt || new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }

    // Categories
    const categories = await Category.find({ isActive: true })
      .select('slug updatedAt')
      .lean();

    const categoryPages: MetadataRoute.Sitemap = [];
    for (const locale of locales) {
      for (const category of categories) {
        categoryPages.push({
          url: `${baseUrl}/${locale}/products?category=${category.slug}`,
          lastModified: category.updatedAt || new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }

    return [...staticPages, ...productPages, ...blogPages, ...categoryPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least the static pages if database connection fails
    const fallbackPages: MetadataRoute.Sitemap = [];
    const staticRoutes = ['', '/products', '/blog', '/about', '/contact'];

    for (const locale of locales) {
      for (const route of staticRoutes) {
        fallbackPages.push({
          url: `${baseUrl}/${locale}${route}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: route === '' ? 1 : 0.8,
        });
      }
    }

    return fallbackPages;
  }
}
