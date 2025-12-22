'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useCurrency } from '@/hooks/useCurrency';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  _id: string;
  name: { fr: string; en: string; es: string };
  slug: string;
  description: { fr: string; en: string; es: string };
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: {
    _id: string;
    name: { fr: string; en: string; es: string };
    slug: string;
  };
  seller: {
    _id: string;
    name: string;
  };
  stock: number;
  isOrganic: boolean;
  rating: number;
  reviewCount: number;
}

export default function DealsPage() {
  const locale = useLocale() as 'fr' | 'en' | 'es';
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const translations = {
    fr: {
      title: 'Ventes Flash',
      subtitle: 'Profitez de nos meilleures offres et réductions limitées',
      discount: 'de réduction',
      addToCart: 'Ajouter au panier',
      viewProduct: 'Voir le produit',
      noDeals: 'Aucune vente flash en cours',
      noDealsDesc: 'Revenez plus tard pour découvrir nos prochaines offres exceptionnelles !',
      organic: 'Bio',
      inStock: 'En stock',
      limitedStock: 'Stock limité',
    },
    en: {
      title: 'Flash Sales',
      subtitle: 'Take advantage of our best offers and limited-time discounts',
      discount: 'off',
      addToCart: 'Add to cart',
      viewProduct: 'View product',
      noDeals: 'No flash sales available',
      noDealsDesc: 'Come back later to discover our next exceptional offers!',
      organic: 'Organic',
      inStock: 'In stock',
      limitedStock: 'Limited stock',
    },
    es: {
      title: 'Ofertas Relámpago',
      subtitle: 'Aprovecha nuestras mejores ofertas y descuentos por tiempo limitado',
      discount: 'de descuento',
      addToCart: 'Añadir al carrito',
      viewProduct: 'Ver producto',
      noDeals: 'No hay ofertas relámpago disponibles',
      noDealsDesc: '¡Vuelve más tarde para descubrir nuestras próximas ofertas excepcionales!',
      organic: 'Orgánico',
      inStock: 'En stock',
      limitedStock: 'Stock limitado',
    },
  };

  const t = translations[locale] || translations.fr;

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      // Fetch products with discounts (compareAtPrice exists)
      const res = await fetch('/api/products?hasDiscount=true&limit=20');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (product: Product) => {
    if (!product.compareAtPrice) return 0;
    return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              ⚡ {t.title}
            </h1>
            <p className="text-lg text-gray-600">{t.subtitle}</p>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const discount = calculateDiscount(product);
                return (
                  <Link
                    key={product._id}
                    href={`/${locale}/products/${product.slug}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
                  >
                    <div className="relative aspect-square bg-gray-100">
                      {product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name[locale]}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isOrganic && (
                          <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {t.organic}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                            -{discount}%
                          </span>
                        )}
                      </div>

                      {/* Stock indicator */}
                      <div className="absolute bottom-3 right-3">
                        {product.stock > 0 && product.stock <= 10 && (
                          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {t.limitedStock}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 min-h-[2.5rem]">
                        {product.name[locale]}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs text-gray-500">
                          {product.rating.toFixed(1)} ({product.reviewCount})
                        </span>
                      </div>

                      {/* Prices */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-xl font-bold text-green-600">
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>

                      {/* Savings */}
                      {discount > 0 && (
                        <div className="bg-red-50 text-red-700 text-xs font-semibold px-2 py-1 rounded mb-3">
                          {t.discount}: {formatPrice((product.compareAtPrice || 0) - product.price)}
                        </div>
                      )}

                      {/* View Product Button */}
                      <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                        {t.viewProduct}
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.noDeals}</h3>
              <p className="text-gray-600 mb-6">{t.noDealsDesc}</p>
              <Link
                href={`/${locale}/products`}
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Voir tous les produits
              </Link>
            </div>
          )}
        </div>
      </main>

          </div>
  );
}
