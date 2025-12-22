'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/hooks/useCurrency';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const t = useTranslations('cart');
  const locale = useLocale() as 'fr' | 'en' | 'es';
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { formatPrice } = useCurrency();

  const [shippingCost, setShippingCost] = useState<number>(0);
  const [shippingZone, setShippingZone] = useState<any>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('SN');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + shippingCost + tax - couponDiscount;

  // Calculate shipping when cart or country changes
  useEffect(() => {
    if (subtotal > 0) {
      calculateShipping();
    }
  }, [subtotal, selectedCountry]);

  const calculateShipping = async () => {
    setLoadingShipping(true);
    try {
      const res = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: selectedCountry,
          orderTotal: subtotal,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setShippingCost(data.shippingCost);
        setShippingZone(data.zone);
      } else {
        // If no shipping zone found, set default
        setShippingCost(0);
        setShippingZone(null);
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
      setShippingCost(0);
    } finally {
      setLoadingShipping(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode,
          orderTotal: subtotal,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setAppliedCoupon(data.coupon);
        setCouponDiscount(data.discount);
        setCouponError('');
      } else {
        setCouponError(data.error || 'Invalid coupon code');
        setAppliedCoupon(null);
        setCouponDiscount(0);
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponError('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponError('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('title')}</h1>

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
                        className="font-semibold text-lg text-gray-900 hover:text-green-600 transition"
                      >
                        {item.name[locale]}
                      </Link>
                      <p className="text-gray-700 font-medium mt-1">{formatPrice(item.price)} each</p>

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
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                  {/* Country Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Shipping Country
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 font-medium"
                    >
                      <option value="SN">Sénégal</option>
                      <option value="FR">France</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="DE">Germany</option>
                      <option value="ES">Spain</option>
                    </select>
                  </div>

                  {/* Coupon Section */}
                  <div className="mb-4 pb-4 border-b">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Have a coupon code?
                    </label>
                    {!appliedCoupon ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                          placeholder="Enter code"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 uppercase text-gray-900 placeholder:text-gray-500"
                        />
                        <button
                          onClick={applyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {couponLoading ? 'Checking...' : 'Apply'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div>
                          <p className="font-mono font-bold text-green-700">{appliedCoupon.code}</p>
                          <p className="text-sm text-green-600">
                            {appliedCoupon.description[locale as keyof typeof appliedCoupon.description]}
                          </p>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    {couponError && (
                      <p className="text-sm text-red-600 mt-2">{couponError}</p>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-800">
                      <span className="font-medium">{t('subtotal')}</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-800">
                      <span className="font-medium">{t('shipping')}</span>
                      {loadingShipping ? (
                        <span className="text-sm text-gray-600">Calculating...</span>
                      ) : (
                        <span className="font-semibold">{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                      )}
                    </div>
                    {shippingCost === 0 && shippingZone?.freeShippingThreshold && (
                      <p className="text-sm text-green-600">
                        ✓ Free shipping on orders over {formatPrice(shippingZone.freeShippingThreshold)}
                      </p>
                    )}
                    {shippingZone?.amountUntilFreeShipping > 0 && (
                      <p className="text-sm text-orange-600">
                        Add {formatPrice(shippingZone.amountUntilFreeShipping)} more for free shipping
                      </p>
                    )}
                    {shippingZone && (
                      <p className="text-xs text-gray-600">
                        Estimated delivery: {shippingZone.estimatedDeliveryDays.min}-{shippingZone.estimatedDeliveryDays.max} days
                      </p>
                    )}
                    <div className="flex justify-between text-gray-800">
                      <span className="font-medium">{t('tax')} (10%)</span>
                      <span className="font-semibold">{formatPrice(tax)}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-green-600 font-semibold">
                        <span>Discount</span>
                        <span>-{formatPrice(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                      <span className="text-gray-900">{t('total')}</span>
                      <span className="text-green-600">{formatPrice(total)}</span>
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

          </div>
  );
}
