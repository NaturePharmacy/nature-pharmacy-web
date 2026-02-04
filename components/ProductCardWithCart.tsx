'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import ProductPrice from '@/components/ProductPrice';

interface ProductCardWithCartProps {
  product: {
    _id: string;
    name: { fr: string; en: string; es: string };
    slug: string;
    price: number;
    compareAtPrice?: number;
    images?: string[];
    isOrganic?: boolean;
    rating?: number;
    reviewCount?: number;
  };
  locale: string;
  showRating?: boolean;
}

export default function ProductCardWithCart({ product, locale, showRating = true }: ProductCardWithCartProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);

    addItem({
      productId: product._id,
      name: product.name[locale as 'fr' | 'en' | 'es'] || product.name.fr,
      price: product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      quantity: 1,
      slug: product.slug,
    });

    setLoading(false);
    setAdded(true);

    setTimeout(() => setAdded(false), 2000);
  };

  const addToCartText = locale === 'fr' ? 'Ajouter au panier' : locale === 'es' ? 'Añadir al carrito' : 'Add to cart';

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
    >
      <div className="relative aspect-square bg-gray-50">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name[locale as 'fr' | 'en' | 'es'] || product.name.fr}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 text-5xl">🌿</div>
        )}
        {product.isOrganic && (
          <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
            Bio
          </span>
        )}
        {product.compareAtPrice && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
          </span>
        )}
        {/* Quick Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={loading || added}
          className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100 ${
            added
              ? 'bg-green-500 text-white opacity-100'
              : 'bg-white text-gray-700 hover:bg-green-600 hover:text-white'
          }`}
          title={addToCartText}
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : added ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )}
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-green-600 transition-colors mb-2">
          {product.name[locale as 'fr' | 'en' | 'es'] || product.name.fr}
        </h3>
        {showRating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className={`w-3 h-3 ${star <= Math.round(product.rating || 0) ? 'fill-current' : 'fill-gray-200'}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
          </div>
        )}
        <ProductPrice
          price={product.price || 0}
          compareAtPrice={product.compareAtPrice}
        />
      </div>
    </Link>
  );
}
