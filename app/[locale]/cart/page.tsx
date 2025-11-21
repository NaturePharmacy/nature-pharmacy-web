'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function CartPage() {
  const t = useTranslations('cart');
  const locale = useLocale() as 'fr' | 'en' | 'es';
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

          {items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg
                className="mx-auto h-24 w-24 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-xl text-gray-600 mb-6">{t('empty')}</p>
              <Link
                href={`/${locale}/products`}
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-medium"
              >
                {t('continueShopping')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row gap-4"
                  >
                    {/* Product image */}
                    <Link href={`/${locale}/products/${item.slug}`} className="flex-shrink-0">
                      <div className="relative w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name[locale]}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product details */}
                    <div className="flex-1">
                      <Link
                        href={`/${locale}/products/${item.slug}`}
                        className="font-semibold text-lg hover:text-green-600 transition"
                      >
                        {item.name[locale]}
                      </Link>
                      <p className="text-gray-600 mt-1">${item.price.toFixed(2)} each</p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="px-3 py-2 hover:bg-gray-100 transition"
                          >
                            -
                          </button>
                          <span className="px-4 py-2 border-x border-gray-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="px-3 py-2 hover:bg-gray-100 transition"
                            disabled={item.quantity >= item.stock}
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          {t('removeItem')}
                        </button>
                      </div>

                      {item.quantity >= item.stock && (
                        <p className="text-sm text-orange-600 mt-2">
                          Maximum stock reached ({item.stock} available)
                        </p>
                      )}
                    </div>

                    {/* Item total */}
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-700">
                      <span>{t('subtotal')}</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>{t('shipping')}</span>
                      <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    {shipping === 0 && (
                      <p className="text-sm text-green-600">
                        ✓ Free shipping on orders over $50
                      </p>
                    )}
                    <div className="flex justify-between text-gray-700">
                      <span>{t('tax')} (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                      <span>{t('total')}</span>
                      <span className="text-green-600">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link
                    href={`/${locale}/checkout`}
                    className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition font-medium mb-3"
                  >
                    {t('proceedToCheckout')}
                  </Link>

                  <Link
                    href={`/${locale}/products`}
                    className="block w-full text-center py-3 text-green-600 hover:text-green-700 transition font-medium"
                  >
                    {t('continueShopping')}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
