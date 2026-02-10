'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useCurrency } from '@/contexts/CurrencyContext';

interface OrderItem {
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  totalPrice: number;
  items: OrderItem[];
  paymentStatus: string;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('orders');
  const { formatPrice } = useCurrency();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);

      const res = await fetch(`/api/orders?${params}`);
      const data = await res.json();

      if (res.ok) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      case 'refunded':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
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

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>

            {/* Status filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setFilterStatus('')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  filterStatus === ''
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                    filterStatus === status
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t(status)}
                </button>
              ))}
            </div>
          </div>

          {orders.length === 0 ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-xl text-gray-600 mb-4">{t('noOrders')}</p>
              <Link
                href={`/${locale}/products`}
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          {t('orderNumber')}{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {t('date')}: {new Date(order.createdAt).toLocaleDateString(locale)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {t(order.status)}
                        </span>
                        <span className={`text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {t(order.paymentStatus)}
                        </span>
                      </div>
                    </div>

                    {/* Order items preview */}
                    <div className="border-t border-b border-gray-200 py-4 my-4">
                      <div className="flex items-center gap-4 overflow-x-auto">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex-shrink-0">
                            <img
                              src={item.productImage || '/placeholder.png'}
                              alt={item.productName}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="text-sm text-gray-600">
                            +{order.items.length - 3} more
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {order.items.length} {t('items')}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-600">{t('total')}</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatPrice(order.totalPrice)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/${locale}/orders/${order._id}`}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          {t('viewDetails')}
                        </Link>
                        {order.status === 'shipped' && (
                          <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition">
                            {t('trackOrder')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

          </div>
  );
}
