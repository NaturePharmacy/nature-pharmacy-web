'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  newUsersThisMonth: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  buyer: { name: string; email: string };
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface RecentUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();

  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  const t = {
    fr: {
      title: 'Tableau de bord Admin',
      welcome: 'Bienvenue',
      stats: {
        users: 'Utilisateurs',
        products: 'Produits',
        orders: 'Commandes',
        revenue: 'Chiffre d\'affaires',
        pending: 'En attente',
        newUsers: 'Nouveaux ce mois',
      },
      recentOrders: 'Commandes récentes',
      recentUsers: 'Nouveaux utilisateurs',
      viewAll: 'Voir tout',
      quickActions: 'Actions rapides',
      manageUsers: 'Gérer les utilisateurs',
      manageProducts: 'Gérer les produits',
      manageOrders: 'Gérer les commandes',
      settings: 'Paramètres',
      noAccess: 'Accès non autorisé',
      noAccessDesc: 'Vous n\'avez pas les permissions pour accéder à cette page.',
      goHome: 'Retour à l\'accueil',
    },
    en: {
      title: 'Admin Dashboard',
      welcome: 'Welcome',
      stats: {
        users: 'Users',
        products: 'Products',
        orders: 'Orders',
        revenue: 'Revenue',
        pending: 'Pending',
        newUsers: 'New this month',
      },
      recentOrders: 'Recent Orders',
      recentUsers: 'New Users',
      viewAll: 'View all',
      quickActions: 'Quick Actions',
      manageUsers: 'Manage Users',
      manageProducts: 'Manage Products',
      manageOrders: 'Manage Orders',
      settings: 'Settings',
      noAccess: 'Access Denied',
      noAccessDesc: 'You do not have permission to access this page.',
      goHome: 'Go to Home',
    },
  };

  const tr = t[locale as keyof typeof t] || t.fr;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/orders?limit=5'),
        fetch('/api/admin/users?limit=5'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setRecentOrders(ordersData.orders || []);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setRecentUsers(usersData.users || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <svg className="animate-spin h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (session?.user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{tr.noAccess}</h1>
            <p className="text-gray-600 mb-6">{tr.noAccessDesc}</p>
            <Link href={`/${locale}`} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
              {tr.goHome}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{tr.title}</h1>
            <p className="text-gray-600 mt-1">{tr.welcome}, {session?.user?.name}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{tr.stats.users}</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">+{stats?.newUsersThisMonth || 0} {tr.stats.newUsers}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{tr.stats.products}</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{tr.stats.orders}</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-yellow-600 mt-2">{stats?.pendingOrders || 0} {tr.stats.pending}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{tr.stats.revenue}</p>
                  <p className="text-3xl font-bold text-gray-900">${(stats?.totalRevenue || 0).toFixed(0)}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{tr.quickActions}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              <Link href={`/${locale}/admin/users`} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:border-green-200 border border-transparent transition group">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">{tr.manageUsers}</span>
              </Link>

              <Link href={`/${locale}/admin/products`} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:border-green-200 border border-transparent transition group">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-200 transition">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">{tr.manageProducts}</span>
              </Link>

              <Link href={`/${locale}/admin/orders`} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:border-green-200 border border-transparent transition group">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 transition">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">{tr.manageOrders}</span>
              </Link>

              <Link href={`/${locale}/admin/tickets`} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:border-green-200 border border-transparent transition group">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-200 transition">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Support Tickets</span>
              </Link>

              <Link href={`/${locale}/admin/coupons`} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:border-green-200 border border-transparent transition group">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-pink-200 transition">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Coupons</span>
              </Link>

              <Link href={`/${locale}/admin/shipping`} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:border-green-200 border border-transparent transition group">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Shipping</span>
              </Link>

              <Link href={`/${locale}/admin/settings`} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:border-green-200 border border-transparent transition group">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3 group-hover:bg-gray-300 transition">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">{tr.settings}</span>
              </Link>
            </div>
          </div>

          {/* Recent Data */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{tr.recentOrders}</h2>
                <Link href={`/${locale}/admin/orders`} className="text-sm text-green-600 hover:text-green-700 font-medium">
                  {tr.viewAll} →
                </Link>
              </div>
              <div className="space-y-3">
                {recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No orders yet</p>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{order.buyer?.name || 'Unknown'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${order.totalPrice.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{tr.recentUsers}</h2>
                <Link href={`/${locale}/admin/users`} className="text-sm text-green-600 hover:text-green-700 font-medium">
                  {tr.viewAll} →
                </Link>
              </div>
              <div className="space-y-3">
                {recentUsers.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No users yet</p>
                ) : (
                  recentUsers.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold">{user.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.role === 'admin' ? 'bg-red-100 text-red-700' :
                        user.role === 'seller' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
