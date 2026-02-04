'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import ProductPrice from '@/components/ProductPrice';

interface Product {
  _id: string;
  name: { fr: string; en: string; es: string };
  slug: string;
  price: number;
  images?: string[];
}

interface NewProductsSliderProps {
  products: Product[];
  locale: string;
}

export default function NewProductsSlider({ products, locale }: NewProductsSliderProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} locale={locale} />
      ))}
    </div>
  );
}

function ProductCard({ product, locale }: { product: Product; locale: string }) {
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
      className="flex-shrink-0 w-48 bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
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
          <div className="flex items-center justify-center h-full text-gray-300 text-4xl">🌿</div>
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
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : added ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )}
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-green-600 transition-colors mb-2">
          {product.name[locale as 'fr' | 'en' | 'es'] || product.name.fr}
        </h3>
        <ProductPrice price={product.price || 0} />
      </div>
    </Link>
  );
}
