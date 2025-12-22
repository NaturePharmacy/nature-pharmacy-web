'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useCurrency } from '@/hooks/useCurrency';
import Link from 'next/link';

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  totalPrice: number;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  items: Array<{
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    product: { _id: string; slug: string };
  }>;
  deliveredAt?: string;
  cancelledAt?: string;
  notes?: string;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('orders');
  const tCheckout = useTranslations('checkout');
  const { formatPrice } = useCurrency();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    params.then(({ id }) => setOrderId(id));
  }, [params]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  useEffect(() => {
    if (status === 'authenticated' && orderId) {
      fetchOrder();
    }
  }, [status, orderId]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();

      if (res.ok) {
        setOrder(data.order);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchOrder(); // Refresh order data
        alert('Order cancelled successfully');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg
          className="animate-spin h-12 w-12 text-green-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
                <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Order not found</h1>
            <Link href={`/${locale}/orders`} className="text-green-600 hover:underline">
              Back to orders
            </Link>
          </div>
        </main>
              </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button */}
          <Link
            href={`/${locale}/orders`}
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to orders
          </Link>

          {/* Order header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {t('orderNumber')}{order.orderNumber}
                </h1>
                <p className="text-gray-600">
                  {t('orderPlaced')}: {new Date(order.createdAt).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {t(order.status)}
              </span>
            </div>

            {/* Order Timeline */}
            {order.status !== 'cancelled' && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                  {locale === 'fr' ? 'Suivi de la commande' : 'Order Tracking'}
                </h3>
                <div className="flex items-center justify-between">
                  {['pending', 'processing', 'shipped', 'delivered'].map((step, index) => {
                    const steps = ['pending', 'processing', 'shipped', 'delivered'];
                    const currentIndex = steps.indexOf(order.status);
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    const stepIcons = {
                      pending: '📋',
                      processing: '📦',
                      shipped: '🚚',
                      delivered: '✅',
                    };

                    return (
                      <div key={step} className="flex-1 flex flex-col items-center relative">
                        {index > 0 && (
                          <div
                            className={`absolute left-0 right-1/2 top-5 h-1 -translate-y-1/2 ${
                              isCompleted ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                          />
                        )}
                        {index < 3 && (
                          <div
                            className={`absolute left-1/2 right-0 top-5 h-1 -translate-y-1/2 ${
                              index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                          />
                        )}
                        <div
                          className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}
                        >
                          {isCompleted ? stepIcons[step as keyof typeof stepIcons] : (index + 1)}
                        </div>
                        <p className={`mt-2 text-xs text-center font-medium ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                          {t(step)}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {order.deliveredAt && (
                  <p className="text-center text-sm text-green-600 mt-4">
                    {locale === 'fr' ? 'Livré le' : 'Delivered on'} {new Date(order.deliveredAt).toLocaleDateString(locale)}
                  </p>
                )}
              </div>
            )}

            {order.status === 'cancelled' && order.cancelledAt && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <p className="text-red-700">
                  {locale === 'fr' ? 'Commande annulée le' : 'Order cancelled on'} {new Date(order.cancelledAt).toLocaleDateString(locale)}
                </p>
              </div>
            )}

            {order.status === 'pending' && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : t('cancelOrder')}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Shipping address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">{t('shippingAddress')}</h2>
              <div className="text-gray-700 space-y-1">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">{t('paymentMethod')}</h2>
              <p className="text-gray-700 mb-2 capitalize">
                {order.paymentMethod.replace('_', ' ')}
              </p>
              <p className="text-sm">
                <span className="text-gray-600">{t('paymentStatus')}:</span>{' '}
                <span className={`font-medium ${
                  order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {t(order.paymentStatus)}
                </span>
              </p>
            </div>
          </div>

          {/* Order items */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">{tCheckout('items')}</h2>
            <div className="divide-y">
              {order.items.map((item, index) => (
                <div key={index} className="py-4 flex items-center gap-4">
                  <img
                    src={item.productImage || '/placeholder.png'}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{item.productName}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatPrice(item.quantity * item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">{tCheckout('orderSummary')}</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>{formatPrice(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>{formatPrice(order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span>{formatPrice(order.taxPrice)}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
                <span>{t('total')}</span>
                <span className="text-green-600">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>

            {order.notes && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600 mb-1">Notes:</p>
                <p className="text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </main>

          </div>
  );
}
