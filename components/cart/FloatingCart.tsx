'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useLocale } from 'next-intl';
import { useCurrency } from '@/hooks/useCurrency';
import Link from 'next/link';
import Image from 'next/image';

export default function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const locale = useLocale();
  const { formatPrice } = useCurrency();

  const total = getCartTotal();
  const itemCount = getCartCount();

  if (itemCount === 0) return null;

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
        aria-label="Voir le panier"
      >
        <div className="relative p-4">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>

          {/* Badge count */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            {itemCount}
          </span>
        </div>

        {/* Tooltip */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Voir le panier ({itemCount})
        </span>
      </button>

      {/* Sliding Cart Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Cart Panel */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
            {/* Header */}
            <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <div>
                  <h2 className="text-xl font-bold">Mon Panier</h2>
                  <p className="text-sm text-green-100">{itemCount} article{itemCount > 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-green-700 rounded-full p-2 transition-colors"
                aria-label="Fermer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <svg className="w-20 h-20 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-lg font-medium">Votre panier est vide</p>
                  <p className="text-sm">Ajoutez des produits pour commencer</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.productId} className="bg-gray-50 rounded-lg p-4 relative group">
                      {/* Remove button */}
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Retirer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name.fr}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate mb-1">
                            {item.name.fr}
                          </h3>
                          <p className="text-green-600 font-bold text-lg">
                            {formatPrice(item.price)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                              className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>

                            <span className="w-10 text-center font-semibold text-gray-900">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                              disabled={item.quantity >= item.stock}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>

                            <span className="text-xs text-gray-500 ml-2">
                              {item.stock > 0 ? `${item.stock} en stock` : 'Rupture'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Total and Actions */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 bg-white px-6 py-4 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg">
                  <span className="text-gray-700 font-medium">Sous-total</span>
                  <span className="text-gray-900 font-bold">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Shipping info */}
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Frais de livraison calculés au paiement
                </p>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link
                    href={`/${locale}/checkout`}
                    onClick={() => setIsOpen(false)}
                    className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
                  >
                    Passer la commande
                  </Link>

                  <Link
                    href={`/${locale}/cart`}
                    onClick={() => setIsOpen(false)}
                    className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-center py-3 rounded-lg font-medium transition-colors"
                  >
                    Voir le panier complet
                  </Link>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full text-gray-600 hover:text-gray-900 text-center py-2 text-sm transition-colors"
                  >
                    Continuer mes achats
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
