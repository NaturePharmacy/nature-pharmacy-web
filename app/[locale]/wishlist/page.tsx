'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/hooks/useCurrency';
import WishlistButton from '@/components/wishlist/WishlistButton';

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
  category: {
    _id: string;
    name: { fr: string; en: string; es: string };
    slug: string;
  };
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const tCommon = useTranslations('common');
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    } else if (session) {
      fetchWishlist();
    }
  }, [session, status]);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.wishlist.products || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || '',
      price: product.price,
      quantity: 1,
      stock: product.stock,
    });
  };

  const handleRemove = () => {
    // Refresh wishlist after removal
    fetchWishlist();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {locale === 'fr' ? 'Ma liste de souhaits' : locale === 'es' ? 'Mi lista de deseos' : 'My Wishlist'}
          </h1>
          <p className="text-gray-600 mt-2">
            {products.length} {locale === 'fr' ? 'produit(s)' : locale === 'es' ? 'producto(s)' : 'product(s)'}
          </p>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {locale === 'fr' ? 'Votre liste de souhaits est vide' : locale === 'es' ? 'Tu lista de deseos está vacía' : 'Your wishlist is empty'}
            </h2>
            <p className="text-gray-600 mb-6">
              {locale === 'fr'
                ? 'Ajoutez des produits à vos favoris en cliquant sur le cœur'
                : locale === 'es'
                ? 'Añade productos a tus favoritos haciendo clic en el corazón'
                : 'Add products to your favorites by clicking the heart'}
            </p>
            <Link
              href={`/${locale}/products`}
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              {locale === 'fr' ? 'Découvrir les produits' : locale === 'es' ? 'Descubrir productos' : 'Discover products'}
            </Link>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                <Link href={`/${locale}/products/${product.slug}`} className="block">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100">
                    {product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name[locale as keyof typeof product.name]}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.isOrganic && (
                        <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Bio
                        </span>
                      )}
                      {product.compareAtPrice && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <div className="absolute top-3 right-3">
                      <WishlistButton productId={product._id} size="md" />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
                      {product.name[locale as keyof typeof product.name]}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs text-gray-500">{product.rating.toFixed(1)} ({product.reviewCount})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-lg font-bold text-green-600">{formatPrice(product.price)}</span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
                      )}
                    </div>

                    {/* Stock Status */}
                    {product.stock > 0 ? (
                      <span className="text-xs text-green-600">
                        {locale === 'fr' ? 'En stock' : locale === 'es' ? 'En stock' : 'In stock'}
                      </span>
                    ) : (
                      <span className="text-xs text-red-600">
                        {locale === 'fr' ? 'Rupture de stock' : locale === 'es' ? 'Agotado' : 'Out of stock'}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Add to Cart Button */}
                <div className="px-4 pb-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {product.stock > 0
                      ? locale === 'fr'
                        ? 'Ajouter au panier'
                        : locale === 'es'
                        ? 'Añadir al carrito'
                        : 'Add to cart'
                      : locale === 'fr'
                      ? 'Rupture de stock'
                      : locale === 'es'
                      ? 'Agotado'
                      : 'Out of stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
