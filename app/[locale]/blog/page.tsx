'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

interface BlogArticle {
  _id: string;
  title: { fr: string; en: string; es: string };
  slug: string;
  excerpt: { fr: string; en: string; es: string };
  featuredImage: string;
  author: { name: string; avatar?: string };
  category: string;
  tags: string[];
  publishedAt: string;
  views: number;
}

export default function BlogPage() {
  const locale = useLocale() as 'fr' | 'en' | 'es';
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const categories = [
    { value: 'health', label: { fr: 'Santé', en: 'Health', es: 'Salud' } },
    { value: 'nutrition', label: { fr: 'Nutrition', en: 'Nutrition', es: 'Nutrición' } },
    { value: 'wellness', label: { fr: 'Bien-être', en: 'Wellness', es: 'Bienestar' } },
    { value: 'herbal', label: { fr: 'Herbes', en: 'Herbal', es: 'Hierbas' } },
    { value: 'skincare', label: { fr: 'Soins de la peau', en: 'Skincare', es: 'Cuidado de la piel' } },
    { value: 'news', label: { fr: 'Actualités', en: 'News', es: 'Noticias' } },
    { value: 'tips', label: { fr: 'Conseils', en: 'Tips', es: 'Consejos' } },
  ];

  const t = {
    fr: {
      title: 'Blog Nature Pharmacy',
      subtitle: 'Conseils santé, nutrition et bien-être naturel',
      allCategories: 'Toutes les catégories',
      search: 'Rechercher un article...',
      readMore: 'Lire la suite',
      by: 'Par',
      views: 'vues',
      noArticles: 'Aucun article trouvé',
      loading: 'Chargement...',
    },
    en: {
      title: 'Nature Pharmacy Blog',
      subtitle: 'Health, nutrition and natural wellness tips',
      allCategories: 'All categories',
      search: 'Search articles...',
      readMore: 'Read more',
      by: 'By',
      views: 'views',
      noArticles: 'No articles found',
      loading: 'Loading...',
    },
    es: {
      title: 'Blog Nature Pharmacy',
      subtitle: 'Consejos de salud, nutrición y bienestar natural',
      allCategories: 'Todas las categorías',
      search: 'Buscar artículo...',
      readMore: 'Leer más',
      by: 'Por',
      views: 'vistas',
      noArticles: 'No se encontraron artículos',
      loading: 'Cargando...',
    },
  };

  const tr = t[locale] || t.fr;

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, selectedTag, searchTerm, pagination.page]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '12',
      });

      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedTag) params.append('tag', selectedTag);
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`/api/blog?${params}`);
      const data = await res.json();

      if (res.ok) {
        setArticles(data.articles);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">{tr.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{tr.title}</h1>
          <p className="text-xl text-green-100">{tr.subtitle}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder={tr.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">{tr.allCategories}</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label[locale]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl text-gray-600">{tr.noArticles}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article._id}
                href={`/${locale}/blog/${article.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Featured Image */}
                <div className="relative h-48 w-full">
                  <Image
                    src={article.featuredImage}
                    alt={article.title[locale]}
                    fill
                    className="object-cover"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                      {categories.find((c) => c.value === article.category)?.label[locale]}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-green-600 transition-colors">
                    {article.title[locale]}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt[locale]}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {article.author.avatar && (
                        <div className="relative w-6 h-6">
                          <Image
                            src={article.author.avatar}
                            alt={article.author.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                      )}
                      <span>{article.author.name}</span>
                    </div>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>

                  {/* Tags */}
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {article.tags.slice(0, 3).map((tag) => (
                        <button
                          key={tag}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedTag(tag);
                          }}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-green-100 hover:text-green-700 transition-colors"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Read More */}
                  <div className="mt-4 pt-4 border-t">
                    <span className="text-green-600 font-semibold hover:text-green-700">
                      {tr.readMore} →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {pagination.page > 1 && (
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ←
              </button>
            )}
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPagination({ ...pagination, page: i + 1 })}
                className={`px-4 py-2 rounded-lg ${
                  pagination.page === i + 1
                    ? 'bg-green-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            {pagination.page < pagination.pages && (
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
