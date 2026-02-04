'use client';

import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

interface QuickAddToCartProps {
  product: {
    _id: string;
    name: { fr: string; en: string; es: string };
    price: number;
    images?: string[];
    slug: string;
  };
  locale: string;
}

export default function QuickAddToCart({ product, locale }: QuickAddToCartProps) {
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

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || added}
      className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition-all transform hover:scale-110 ${
        added
          ? 'bg-green-500 text-white'
          : 'bg-white text-gray-700 hover:bg-green-600 hover:text-white'
      }`}
      title={locale === 'fr' ? 'Ajouter au panier' : locale === 'es' ? 'Añadir al carrito' : 'Add to cart'}
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
  );
}
