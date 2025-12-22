'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/hooks/useCurrency';

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale() as 'fr' | 'en' | 'es';
  const t = useTranslations('checkout');
  const tCart = useTranslations('cart');
  const { items, getCartTotal, clearCart } = useCart();
  const { formatPrice } = useCurrency();

  const [loading, setLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [shippingZone, setShippingZone] = useState<any>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: 'SN',
    postalCode: '',
    paymentMethod: 'stripe',
    notes: '',
  });

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + shippingCost + tax;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login?redirect=/checkout`);
    }
  }, [status, router, locale]);

  useEffect(() => {
    if (items.length === 0 && status === 'authenticated') {
      router.push(`/${locale}/products`);
    }
  }, [items, status, router, locale]);

  // Calculate shipping when country or cart changes
  useEffect(() => {
    if (formData.country && subtotal > 0) {
      calculateShipping();
    }
  }, [formData.country, subtotal]);

  const calculateShipping = async () => {
    setLoadingShipping(true);
    try {
      const res = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: formData.country,
          region: formData.city,
          orderTotal: subtotal,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setShippingCost(data.shippingCost);
        setShippingZone(data.zone);
      } else {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
        },
        shippingCost: shippingCost,
        shippingZone: shippingZone?._id,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        router.push(`/${locale}/orders/${data.order._id}?success=true`);
      } else {
        alert(data.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg
          className="animate-spin h-12 w-12 text-green-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping address */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">{t('shippingAddress')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('fullName')} *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('phone')} *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('street')} *
                      </label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        required
                        value={formData.street}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('city')} *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('state')} *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('country')} *
                      </label>
                      <select
                        id="country"
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="SN">Sénégal</option>
                        <option value="FR">France</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="DE">Germany</option>
                        <option value="ES">Spain</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('postalCode')} *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment method */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">{t('paymentMethod')}</h2>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={formData.paymentMethod === 'stripe'}
                        onChange={handleChange}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="ml-3 font-medium">{t('creditCard')}</span>
                    </label>

                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleChange}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="ml-3 font-medium">{t('paypal')}</span>
                    </label>

                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash_on_delivery"
                        checked={formData.paymentMethod === 'cash_on_delivery'}
                        onChange={handleChange}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="ml-3 font-medium">{t('cashOnDelivery')}</span>
                    </label>
                  </div>
                </div>

                {/* Order notes */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('notes')}
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder={t('notesPlaceholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  ></textarea>
                </div>
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">{t('orderSummary')}</h2>

                  {/* Items */}
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.productId} className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name[locale]}
                              fill
                              className="object-cover rounded"
                              sizes="64px"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name[locale]}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-gray-800">
                      <span className="font-medium">{tCart('subtotal')}</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-800">
                      <span className="font-medium">{tCart('shipping')}</span>
                      {loadingShipping ? (
                        <span className="text-sm text-gray-600">Calculating...</span>
                      ) : (
                        <span className="font-semibold">{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                      )}
                    </div>
                    {shippingCost === 0 && shippingZone?.freeShippingThreshold && (
                      <p className="text-xs text-green-600 font-medium">
                        ✓ Free shipping on orders over {formatPrice(shippingZone.freeShippingThreshold)}
                      </p>
                    )}
                    {shippingZone && (
                      <p className="text-xs text-gray-600">
                        Est. delivery: {shippingZone.estimatedDeliveryDays.min}-{shippingZone.estimatedDeliveryDays.max} days
                      </p>
                    )}
                    <div className="flex justify-between text-gray-800">
                      <span className="font-medium">{tCart('tax')}</span>
                      <span className="font-semibold">{formatPrice(tax)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span className="text-gray-900">{tCart('total')}</span>
                      <span className="text-green-600">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {loading ? t('processing') : t('placeOrder')}
                  </button>

                  <Link
                    href={`/${locale}/cart`}
                    className="block text-center mt-4 text-green-600 hover:text-green-700 transition"
                  >
                    ← Back to cart
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

          </div>
  );
}
