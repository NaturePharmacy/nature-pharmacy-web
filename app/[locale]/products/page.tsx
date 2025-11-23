'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';

interface Product {
  _id: string;
  name: { fr: string; en: string; es: string };
  slug: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  isOrganic: boolean;
}

export default function ProductsPage() {
  const t = useTranslations('products');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  });

  // Filters
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    sort: '-createdAt',
    minPrice: '',
    maxPrice: '',
    isOrganic: searchParams.get('organic') === 'true',
    category: searchParams.get('category') || '',
  });

  const [searchInput, setSearchInput] = useState(filters.search);

  const categories = [
    { key: 'herbs', slug: 'herbs' },
    { key: 'oils', slug: 'oils' },
    { key: 'cosmetics', slug: 'cosmetics' },
    { key: 'foods', slug: 'foods' },
  ];

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        sort: filters.sort,
      });

      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.isOrganic) params.append('isOrganic', 'true');
      if (filters.category) params.append('category', filters.category);

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      if (res.ok) {
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchInput }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      sort: '-createdAt',
      minPrice: '',
      maxPrice: '',
      isOrganic: false,
      category: '',
    });
    setSearchInput('');
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.pages) {
      fetchProducts(pagination.page + 1);
    }
  };

  const FiltersSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
          {tNav('categories.title')}
        </h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setFilters({ ...filters, category: '' })}
              className={`text-sm hover:text-green-600 transition-colors ${
                !filters.category ? 'text-green-600 font-medium' : 'text-gray-600'
              }`}
            >
              {tNav('allCategories')}
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.key}>
              <button
                onClick={() => setFilters({ ...filters, category: cat.slug })}
                className={`text-sm hover:text-green-600 transition-colors ${
                  filters.category === cat.slug ? 'text-green-600 font-medium' : 'text-gray-600'
                }`}
              >
                {tNav(`categories.${cat.key}`)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price range */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
          {t('priceRange')}
        </h3>
        <div className="space-y-2">
          <input
            type="number"
            placeholder={t('minPrice')}
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            min="0"
          />
          <input
            type="number"
            placeholder={t('maxPrice')}
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            min="0"
          />
        </div>
      </div>

      {/* Organic filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
          {locale === 'fr' ? 'Certification' : locale === 'es' ? 'Certificación' : 'Certification'}
        </h3>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.isOrganic}
            onChange={(e) => setFilters({ ...filters, isOrganic: e.target.checked })}
            className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-600 group-hover:text-green-600 transition-colors">
            {t('organicOnly')}
          </span>
        </label>
      </div>

      {/* Clear filters */}
      <button
        onClick={clearFilters}
        className="w-full py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors font-medium"
      >
        {t('clearFilters')}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb & Title */}
          <div className="mb-6">
            <nav className="text-sm text-gray-500 mb-2">
              <span className="hover:text-green-600 cursor-pointer">{locale === 'fr' ? 'Accueil' : locale === 'es' ? 'Inicio' : 'Home'}</span>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{t('title')}</span>
            </nav>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-sm text-gray-500">
                {pagination.total} {t('products')}
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-5 sticky top-28">
                <h2 className="font-bold text-lg text-gray-900 mb-4 pb-3 border-b">
                  {t('filters')}
                </h2>
                <FiltersSidebar />
              </div>
            </aside>

            {/* Products Area */}
            <div className="flex-1 min-w-0">
              {/* Top Bar */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1 max-w-md">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t('search')}
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </form>

                <div className="flex items-center gap-3">
                  {/* Mobile Filters Button */}
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    {t('filters')}
                  </button>

                  {/* Sort */}
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                    className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white cursor-pointer"
                  >
                    <option value="-createdAt">{t('sortNewest')}</option>
                    <option value="price">{t('sortPriceLow')}</option>
                    <option value="-price">{t('sortPriceHigh')}</option>
                    <option value="-rating">{t('sortRating')}</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(filters.category || filters.isOrganic || filters.minPrice || filters.maxPrice) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {filters.category && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {tNav(`categories.${filters.category}`)}
                      <button onClick={() => setFilters({ ...filters, category: '' })} className="hover:text-green-900">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  )}
                  {filters.isOrganic && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      Bio
                      <button onClick={() => setFilters({ ...filters, isOrganic: false })} className="hover:text-green-900">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      ${filters.minPrice || '0'} - ${filters.maxPrice || '...'}
                      <button onClick={() => setFilters({ ...filters, minPrice: '', maxPrice: '' })} className="hover:text-green-900">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Products Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500 text-sm">{locale === 'fr' ? 'Chargement...' : locale === 'es' ? 'Cargando...' : 'Loading...'}</p>
                  </div>
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-lg text-gray-600 mb-2">{t('noProducts')}</p>
                  <button
                    onClick={clearFilters}
                    className="text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    {t('clearFilters')}
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>

                  {/* Load more */}
                  {pagination.page < pagination.pages && (
                    <div className="text-center mt-8">
                      <button
                        onClick={handleLoadMore}
                        className="bg-amber-400 hover:bg-amber-500 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors shadow-sm hover:shadow"
                      >
                        {t('loadMore')}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-bold text-lg">{t('filters')}</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-full pb-24">
              <FiltersSidebar />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
