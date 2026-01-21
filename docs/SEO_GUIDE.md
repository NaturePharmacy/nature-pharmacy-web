# SEO & Referencing Guide

This guide explains the SEO implementation in the Nature Pharmacy application and how to optimize your content for search engines.

## Table of Contents

1. [Overview](#overview)
2. [SEO Features Implemented](#seo-features-implemented)
3. [Metadata Configuration](#metadata-configuration)
4. [Structured Data (JSON-LD)](#structured-data-json-ld)
5. [Sitemap & Robots.txt](#sitemap--robotstxt)
6. [Blog SEO](#blog-seo)
7. [Product SEO](#product-seo)
8. [Google Search Console Setup](#google-search-console-setup)
9. [Best Practices](#best-practices)
10. [Monitoring & Analytics](#monitoring--analytics)

## Overview

The Nature Pharmacy application implements comprehensive SEO optimization to improve visibility in search engines across three languages (French, English, Spanish).

### Key SEO Components

- **Metadata API**: Dynamic meta tags for all pages
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Enhanced Twitter previews
- **JSON-LD**: Structured data for rich snippets
- **Sitemap**: Dynamic XML sitemap generation
- **Robots.txt**: Search engine crawling rules
- **Multilingual**: Language-specific SEO for fr/en/es
- **Canonical URLs**: Prevent duplicate content issues

## SEO Features Implemented

### 1. Page-Level Metadata

All major pages include:
- Title tags (optimized for each language)
- Meta descriptions
- Keywords
- Open Graph tags
- Twitter Card tags
- Canonical URLs
- Language alternates

### 2. Structured Data

JSON-LD structured data implemented for:
- Website (homepage)
- Organization
- Blog articles (BlogPosting)
- Products (Product schema - ready for implementation)
- Breadcrumbs (ready for implementation)

### 3. Technical SEO

- Semantic HTML5 structure
- Proper heading hierarchy (H1 → H6)
- Alt text for images
- Responsive design (mobile-friendly)
- Fast loading times
- HTTPS ready
- XML sitemap
- Robots.txt

## Metadata Configuration

### Global Metadata

Located in: `app/[locale]/layout.tsx`

The root layout provides default metadata for all pages:

```typescript
{
  title: {
    default: 'Nature Pharmacy',
    template: '%s | Nature Pharmacy', // Appends site name to page titles
  },
  description: 'Multilingual description',
  keywords: 'Relevant keywords by language',
  openGraph: { ... },
  twitter: { ... },
  robots: { ... },
}
```

### Page-Specific Metadata

Each page can override the default metadata using `generateMetadata`:

**Homepage** (`app/[locale]/page.tsx`):
- Custom title per language
- Optimized description
- Language-specific keywords
- Open Graph image

**Blog Articles** (`app/[locale]/blog/[slug]/page.tsx`):
- Article-specific title and description
- Author information
- Publication date
- Article images
- Tags as keywords

## Structured Data (JSON-LD)

### Homepage Structured Data

**WebSite Schema**:
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Nature Pharmacy",
  "url": "https://nature-pharmacy.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://nature-pharmacy.com/search?q={search_term}",
    "query-input": "required name=search_term"
  }
}
```

**Organization Schema**:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Nature Pharmacy",
  "url": "https://nature-pharmacy.com",
  "logo": "https://nature-pharmacy.com/logo.jpg",
  "description": "Natural medicine and wellness products"
}
```

### Blog Article Structured Data

**BlogPosting Schema**:
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Article Title",
  "image": "article-image.jpg",
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-20",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Nature Pharmacy",
    "logo": {
      "@type": "ImageObject",
      "url": "logo.jpg"
    }
  },
  "description": "Article description",
  "keywords": "keyword1, keyword2"
}
```

### Product Structured Data (To Implement)

For product pages, implement the Product schema:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "image": "product-image.jpg",
  "description": "Product description",
  "sku": "PROD-123",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "offers": {
    "@type": "Offer",
    "url": "product-url",
    "priceCurrency": "EUR",
    "price": "29.99",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Nature Pharmacy"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "89"
  }
}
```

## Sitemap & Robots.txt

### Dynamic Sitemap

Located in: `app/sitemap.ts`

The sitemap automatically includes:
- All static pages (home, products, blog, about, contact)
- All active products
- All published blog articles
- All active categories
- All three language versions

**Access**: `https://nature-pharmacy.com/sitemap.xml`

**Update Frequency**:
- Homepage: Daily
- Blog: Daily
- Products: Weekly
- Static pages: Weekly

### Robots.txt

Located in: `app/robots.ts`

**Configuration**:
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /messages/
Disallow: /cart
Disallow: /checkout
Disallow: /account/

Sitemap: https://nature-pharmacy.com/sitemap.xml
```

**Access**: `https://nature-pharmacy.com/robots.txt`

## Blog SEO

### Article SEO Fields

Each blog article has dedicated SEO fields:

```typescript
{
  seo: {
    metaTitle: { fr: '', en: '', es: '' },      // 50-60 characters
    metaDescription: { fr: '', en: '', es: '' }, // 150-160 characters
    metaKeywords: ['keyword1', 'keyword2'],      // 5-10 keywords
    ogImage: 'social-share-image.jpg',           // 1200x630px
    canonicalUrl: 'preferred-url'
  }
}
```

### Best Practices for Blog SEO

1. **Title Optimization**:
   - 50-60 characters
   - Include primary keyword
   - Compelling and descriptive
   - Unique per language

2. **Meta Description**:
   - 150-160 characters
   - Include primary keyword
   - Call-to-action
   - Unique per language

3. **Keywords**:
   - 5-10 relevant keywords
   - Mix of short and long-tail
   - Include multilingual variations

4. **Images**:
   - Alt text for all images
   - Optimized file size (< 200KB)
   - OG image: 1200x630px
   - Featured image: High quality

5. **Content**:
   - Minimum 300 words
   - Proper heading structure (H2, H3)
   - Internal links to products/articles
   - External authoritative links

6. **URL (Slug)**:
   - Short and descriptive
   - Include primary keyword
   - Use hyphens, not underscores
   - Lowercase only

### Automatic SEO Generation

If you don't provide SEO fields when creating a blog article, the system automatically generates:
- **metaTitle**: Uses article title
- **metaDescription**: Uses excerpt or first 160 characters of content
- **metaKeywords**: Uses tags array
- **ogImage**: Uses featured image

## Product SEO

### Current Implementation

Products inherit global metadata from the layout. To enhance product SEO:

1. Convert product detail page to Server Component
2. Implement `generateMetadata` function
3. Add Product structured data (JSON-LD)
4. Optimize product images with alt text
5. Add review schema for ratings

### Recommended Product Metadata

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug);

  return {
    title: product.name[locale],
    description: product.description[locale],
    keywords: [
      product.category.name[locale],
      ...product.tags,
      'bio', 'naturel', 'plantes médicinales'
    ].join(', '),
    openGraph: {
      title: product.name[locale],
      description: product.description[locale],
      images: [{ url: product.images[0] }],
      type: 'product',
    },
  };
}
```

## Google Search Console Setup

### 1. Verify Your Site

Add the verification code to `.env.local`:

```env
GOOGLE_SITE_VERIFICATION=your-verification-code
```

The code is already configured in `app/[locale]/layout.tsx` and will be automatically included in the HTML.

**Alternative verification methods**:
- HTML file upload
- Domain name provider
- Google Analytics
- Google Tag Manager

### 2. Submit Sitemap

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property
3. Navigate to Sitemaps
4. Submit: `https://nature-pharmacy.com/sitemap.xml`

### 3. Monitor Performance

Track in Search Console:
- Indexing status
- Search performance
- Mobile usability
- Core Web Vitals
- Security issues

## Best Practices

### 1. Content Quality

- **Unique Content**: Avoid duplicate content across languages
- **Value**: Provide informative, helpful content
- **Length**: Minimum 300 words for blog articles
- **Updates**: Keep content fresh and up-to-date
- **Expertise**: Demonstrate E-A-T (Expertise, Authoritativeness, Trustworthiness)

### 2. Technical SEO

- **Mobile-First**: Ensure mobile responsiveness
- **Page Speed**: Optimize images, minimize JS/CSS
- **HTTPS**: Use SSL certificate in production
- **Clean URLs**: Short, descriptive, keyword-rich
- **Internal Linking**: Link related products/articles

### 3. Multilingual SEO

- **hreflang tags**: Implemented via `alternates.languages`
- **Separate URLs**: Each language has unique URL (fr/, en/, es/)
- **Quality translations**: Avoid machine translations
- **Local keywords**: Use location-specific keywords

### 4. Images

- **Alt text**: Descriptive and keyword-rich
- **File names**: Descriptive (chamomile-tea.jpg not IMG_001.jpg)
- **Compression**: Use WebP format when possible
- **Responsive**: Use Next.js Image component
- **Dimensions**: Specify width and height

### 5. Links

- **Internal links**: Link related content
- **External links**: Link to authoritative sources
- **Anchor text**: Descriptive link text
- **No broken links**: Regularly audit links

## Monitoring & Analytics

### Google Analytics 4

Add GA4 tracking (recommended):

1. Create GA4 property
2. Get Measurement ID
3. Add to environment variables
4. Implement tracking code

### Key Metrics to Track

**Traffic**:
- Organic search traffic
- Direct traffic
- Referral traffic
- Social traffic

**Engagement**:
- Bounce rate
- Average session duration
- Pages per session
- Conversion rate

**SEO Performance**:
- Keyword rankings
- Click-through rate (CTR)
- Impressions vs clicks
- Average position

**Technical**:
- Core Web Vitals
- Page load time
- Mobile vs desktop traffic
- Crawl errors

### Tools

**Essential Tools**:
- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com)
- [Google PageSpeed Insights](https://pagespeed.web.dev)
- [Rich Results Test](https://search.google.com/test/rich-results)

**Optional Tools**:
- Bing Webmaster Tools
- Ahrefs / SEMrush / Moz (paid)
- Screaming Frog (crawling)
- GTmetrix (performance)

## Checklist for New Content

### Blog Article Checklist

- [ ] Title optimized (50-60 chars) in all languages
- [ ] Meta description (150-160 chars) in all languages
- [ ] 5-10 relevant keywords
- [ ] Unique, descriptive slug
- [ ] Featured image (high quality, optimized)
- [ ] OG image (1200x630px)
- [ ] Proper heading structure (H2, H3)
- [ ] Minimum 300 words
- [ ] Internal links to related content
- [ ] All images have alt text
- [ ] Content provides value
- [ ] Proofread and spell-checked

### Product Checklist

- [ ] Clear, descriptive product name
- [ ] Detailed description in all languages
- [ ] High-quality images (multiple angles)
- [ ] All images have alt text
- [ ] Category properly assigned
- [ ] Tags added
- [ ] Price and stock accurate
- [ ] Related products linked

## Additional Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Documentation](https://schema.org/docs/documents.html)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

## Support

For SEO-related questions or issues:
1. Check this documentation
2. Review the implementation in the code
3. Test with Google's Rich Results Test
4. Monitor Search Console for issues
