'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShareButtons from '@/components/social/ShareButtons';

interface SellerData {
  seller: {
    _id: string;
    name: string;
    email: string;
    storeName: string;
    description?: string;
    logo?: string;
    banner?: string;
    phone?: string;
    address?: string;
    memberSince: string;
  };
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalSales: number;
    averageRating: number;
    totalReviews: number;
  };
  recentProducts: any[];
}

interface Product {
  _id: string;
  name: { fr: string; en: string; es: string };
  slug: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
}

export default function SellerProfilePage() {
  const params = useParams();
  const locale = useLocale() as 'fr' | 'en' | 'es';
  const sellerId = params.id as string;

  const [sellerData, setSellerData] = useState<SellerData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSellerData();
  }, [sellerId]);

  useEffect(() => {
    fetchProducts();
  }, [sellerId, selectedCategory, sortBy, page]);

  const fetchSellerData = async () => {
    try {
      const res = await fetch(`/api/sellers/${sellerId}`);
      if (res.ok) {
        const data = await res.json();
        setSellerData(data);
        setProducts(data.recentProducts);
      }
    } catch (error) {
      console.error('Error fetching seller data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sort: sortBy,
      });

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      const res = await fetch(`/api/sellers/${sellerId}/products?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!sellerData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Seller Not Found</h2>
            <p className="text-gray-600">The seller you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Banner */}
        <div className="relative h-64 bg-gradient-to-r from-green-600 to-green-700">
          {sellerData.seller.banner && (
            <Image
              src={sellerData.seller.banner}
              alt="Store banner"
              fill
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Seller Info */}
        <div className="max-w-7xl mx-auto px-4 -mt-20 relative">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-white rounded-lg shadow-md overflow-hidden border-4 border-white">
                  {sellerData.seller.logo ? (
                    <Image
                      src={sellerData.seller.logo}
                      alt={sellerData.seller.storeName}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-4xl font-bold">
                      {sellerData.seller.storeName.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {sellerData.seller.storeName}
                  </h1>
                  <ShareButtons
                    url={`${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}/sellers/${sellerId}`}
                    title={sellerData.seller.storeName}
                    description={sellerData.seller.description || `Shop from ${sellerData.seller.storeName} on Nature Pharmacy`}
                  />
                </div>
                {sellerData.seller.description && (
                  <p className="text-gray-600 mb-4">{sellerData.seller.description}</p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {sellerData.stats.totalProducts}
                    </p>
                    <p className="text-sm text-gray-600">Products</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {sellerData.stats.averageRating.toFixed(1)}★
                    </p>
                    <p className="text-sm text-gray-600">Rating</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {sellerData.stats.totalOrders}
                    </p>
                    <p className="text-sm text-gray-600">Orders</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {sellerData.stats.totalReviews}
                    </p>
                    <p className="text-sm text-gray-600">Reviews</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                  {sellerData.seller.phone && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{sellerData.seller.phone}</span>
                    </div>
                  )}
                  {sellerData.seller.address && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{sellerData.seller.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Member since {new Date(sellerData.seller.memberSince).getFullYear()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div>
            {/* Filters and Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Products</h2>
              <div className="flex gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="createdAt">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {products.map((product) => (
                    <Link
                      key={product._id}
                      href={`/${locale}/products/${product.slug}`}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="relative h-48 bg-gray-100">
                        {product.images && product.images[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name[locale]}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        )}
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                            -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.name[locale]}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({product.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-green-600">
                            {product.price.toLocaleString()} CFA
                          </span>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              {product.compareAtPrice.toLocaleString()} CFA
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
