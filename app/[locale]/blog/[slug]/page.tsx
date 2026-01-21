import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    await connectDB();
    const article = await Blog.findOne({ slug, isPublished: true })
      .populate('author', 'name')
      .lean();

    if (!article) {
      return {
        title: 'Article not found',
      };
    }

    const localeKey = locale as 'fr' | 'en' | 'es';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return {
      title: article.seo.metaTitle[localeKey] || article.title[localeKey],
      description: article.seo.metaDescription[localeKey] || article.excerpt[localeKey],
      keywords: article.seo.metaKeywords.join(', '),
      authors: [{ name: article.author.name }],
      openGraph: {
        title: article.seo.metaTitle[localeKey] || article.title[localeKey],
        description: article.seo.metaDescription[localeKey] || article.excerpt[localeKey],
        images: [
          {
            url: article.seo.ogImage || article.featuredImage,
            width: 1200,
            height: 630,
            alt: article.title[localeKey],
          },
        ],
        type: 'article',
        publishedTime: article.publishedAt?.toISOString(),
        authors: [article.author.name],
        tags: article.tags,
        url: `${baseUrl}/${locale}/blog/${slug}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.seo.metaTitle[localeKey] || article.title[localeKey],
        description: article.seo.metaDescription[localeKey] || article.excerpt[localeKey],
        images: [article.seo.ogImage || article.featuredImage],
      },
      alternates: {
        canonical: article.seo.canonicalUrl || `${baseUrl}/${locale}/blog/${slug}`,
        languages: {
          'fr': `${baseUrl}/fr/blog/${slug}`,
          'en': `${baseUrl}/en/blog/${slug}`,
          'es': `${baseUrl}/es/blog/${slug}`,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Article',
    };
  }
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const localeKey = locale as 'fr' | 'en' | 'es';

  await connectDB();

  const article = await Blog.findOne({ slug, isPublished: true })
    .populate('author', 'name avatar')
    .lean();

  if (!article) {
    notFound();
  }

  const categories = {
    health: { fr: 'Santé', en: 'Health', es: 'Salud' },
    nutrition: { fr: 'Nutrition', en: 'Nutrition', es: 'Nutrición' },
    wellness: { fr: 'Bien-être', en: 'Wellness', es: 'Bienestar' },
    herbal: { fr: 'Herbes', en: 'Herbal', es: 'Hierbas' },
    skincare: { fr: 'Soins de la peau', en: 'Skincare', es: 'Cuidado de la piel' },
    news: { fr: 'Actualités', en: 'News', es: 'Noticias' },
    tips: { fr: 'Conseils', en: 'Tips', es: 'Consejos' },
  };

  const t = {
    fr: {
      by: 'Par',
      publishedOn: 'Publié le',
      views: 'vues',
      readingTime: 'min de lecture',
      shareArticle: 'Partager l\'article',
      relatedArticles: 'Articles similaires',
      backToBlog: '← Retour au blog',
    },
    en: {
      by: 'By',
      publishedOn: 'Published on',
      views: 'views',
      readingTime: 'min read',
      shareArticle: 'Share article',
      relatedArticles: 'Related articles',
      backToBlog: '← Back to blog',
    },
    es: {
      by: 'Por',
      publishedOn: 'Publicado el',
      views: 'vistas',
      readingTime: 'min de lectura',
      shareArticle: 'Compartir artículo',
      relatedArticles: 'Artículos relacionados',
      backToBlog: '← Volver al blog',
    },
  };

  const tr = t[localeKey] || t.fr;

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(localeKey, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate reading time (assuming 200 words per minute)
  const wordCount = article.content[localeKey].split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Get related articles (same category, excluding current)
  const relatedArticles = await Blog.find({
    category: article.category,
    _id: { $ne: article._id },
    isPublished: true,
  })
    .select('title slug featuredImage excerpt')
    .limit(3)
    .lean();

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title[localeKey],
    description: article.excerpt[localeKey],
    image: article.featuredImage,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nature Pharmacy',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/blog/${slug}`,
    },
    keywords: article.tags.join(', '),
    articleSection: categories[article.category as keyof typeof categories]?.[localeKey],
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-gray-50">
        {/* Back to Blog */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Link
              href={`/${locale}/blog`}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              {tr.backToBlog}
            </Link>
          </div>
        </div>

        {/* Article Header */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded-full">
                {categories[article.category as keyof typeof categories]?.[localeKey]}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {article.title[localeKey]}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-8">{article.excerpt[localeKey]}</p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8">
              {/* Author */}
              <div className="flex items-center gap-2">
                {article.author.avatar && (
                  <div className="relative w-10 h-10">
                    <Image
                      src={article.author.avatar}
                      alt={article.author.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="text-xs text-gray-500">{tr.by}</div>
                  <div className="font-medium text-gray-900">{article.author.name}</div>
                </div>
              </div>

              {/* Published Date */}
              <div>
                <div className="text-xs text-gray-500">{tr.publishedOn}</div>
                <div className="font-medium text-gray-900">
                  {formatDate(article.publishedAt!)}
                </div>
              </div>

              {/* Reading Time */}
              <div>
                <div className="font-medium text-gray-900">
                  {readingTime} {tr.readingTime}
                </div>
              </div>

              {/* Views */}
              <div>
                <div className="font-medium text-gray-900">
                  {article.views} {tr.views}
                </div>
              </div>
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/${locale}/blog?tag=${tag}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-green-100 hover:text-green-700 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative w-full h-96 md:h-[500px]">
          <Image
            src={article.featuredImage}
            alt={article.title[localeKey]}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div
              className="prose prose-lg max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900
                prose-ul:text-gray-700
                prose-ol:text-gray-700
                prose-img:rounded-lg prose-img:shadow-md
                prose-blockquote:border-green-600 prose-blockquote:bg-green-50 prose-blockquote:p-4 prose-blockquote:rounded
              "
              dangerouslySetInnerHTML={{ __html: article.content[localeKey] }}
            />
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-gray-100 border-t border-b">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{tr.shareArticle}</h3>
            <div className="flex gap-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/blog/${slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/blog/${slug}`
                )}&text=${encodeURIComponent(article.title[localeKey])}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/blog/${slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="bg-white">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">{tr.relatedArticles}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link
                    key={related._id.toString()}
                    href={`/${locale}/blog/${related.slug}`}
                    className="group"
                  >
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={related.featuredImage}
                        alt={related.title[localeKey]}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                      {related.title[localeKey]}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {related.excerpt[localeKey]}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>
    </>
  );
}
