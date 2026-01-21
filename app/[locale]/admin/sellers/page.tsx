'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';

interface Seller {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isEmailVerified: boolean;
  sellerInfo?: {
    storeName?: string;
    storeDescription?: string;
    storeLogo?: string;
    verified: boolean;
    rating: number;
    totalSales: number;
  };
  createdAt: string;
}

export default function AdminSellers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const t = {
    fr: {
      title: 'Gestion des vendeurs',
      search: 'Rechercher...',
      all: 'Tous',
      verified: 'Vérifiés',
      unverified: 'Non vérifiés',
      seller: 'Vendeur',
      email: 'Email',
      store: 'Boutique',
      sales: 'Ventes totales',
      rating: 'Note',
      status: 'Statut',
      actions: 'Actions',
      verify: 'Vérifier',
      suspend: 'Suspendre',
      viewDetails: 'Voir détails',
      loading: 'Chargement...',
      noSellers: 'Aucun vendeur trouvé',
      noAccess: 'Accès non autorisé',
      totalSellers: 'Vendeurs totaux',
      verifiedSellers: 'Vendeurs vérifiés',
      avgRating: 'Note moyenne',
    },
    en: {
      title: 'Seller Management',
      search: 'Search...',
      all: 'All',
      verified: 'Verified',
      unverified: 'Unverified',
      seller: 'Seller',
      email: 'Email',
      store: 'Store',
      sales: 'Total Sales',
      rating: 'Rating',
      status: 'Status',
      actions: 'Actions',
      verify: 'Verify',
      suspend: 'Suspend',
      viewDetails: 'View Details',
      loading: 'Loading...',
      noSellers: 'No sellers found',
      noAccess: 'Access Denied',
      totalSellers: 'Total Sellers',
      verifiedSellers: 'Verified Sellers',
      avgRating: 'Average Rating',
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
      fetchSellers();
    }
  }, [session]);

  const fetchSellers = async () => {
    try {
      const res = await fetch('/api/admin/users?role=seller');
      const data = await res.json();

      if (res.ok) {
        setSellers(data.users);
      }
    } catch (err) {
      console.error('Error fetching sellers:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (sellerId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${sellerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerInfo: { verified: !currentStatus },
        }),
      });

      if (res.ok) {
        fetchSellers();
      }
    } catch (err) {
      console.error('Error updating seller:', err);
    }
  };

  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.sellerInfo?.storeName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'verified' && seller.sellerInfo?.verified) ||
      (filter === 'unverified' && !seller.sellerInfo?.verified);

    return matchesSearch && matchesFilter;
  });

  const totalSellers = sellers.length;
  const verifiedSellers = sellers.filter((s) => s.sellerInfo?.verified).length;
  const avgRating =
    sellers.reduce((sum, s) => sum + (s.sellerInfo?.rating || 0), 0) / (totalSellers || 1);

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">{tr.loading}</div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">{tr.noAccess}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{tr.title}</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">{tr.totalSellers}</div>
          <div className="text-3xl font-bold text-gray-900">{totalSellers}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">{tr.verifiedSellers}</div>
          <div className="text-3xl font-bold text-green-600">{verifiedSellers}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">{tr.avgRating}</div>
          <div className="text-3xl font-bold text-yellow-600">{avgRating.toFixed(1)} ⭐</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder={tr.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tr.all}
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'verified'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tr.verified}
            </button>
            <button
              onClick={() => setFilter('unverified')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'unverified'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tr.unverified}
            </button>
          </div>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {tr.seller}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {tr.email}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {tr.store}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  {tr.sales}
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  {tr.rating}
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  {tr.status}
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  {tr.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    {tr.noSellers}
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller) => (
                  <tr key={seller._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {seller.avatar ? (
                          <div className="relative w-10 h-10 flex-shrink-0">
                            <Image
                              src={seller.avatar}
                              alt={seller.name}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-500 font-semibold">
                              {seller.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{seller.name}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(seller.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{seller.email}</td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">
                        {seller.sellerInfo?.storeName || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-gray-600">
                      {(seller.sellerInfo?.totalSales || 0).toLocaleString()} CFA
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-gray-600">
                      {seller.sellerInfo?.rating?.toFixed(1) || '0.0'} ⭐
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          seller.sellerInfo?.verified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {seller.sellerInfo?.verified ? tr.verified : tr.unverified}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() =>
                          toggleVerification(seller._id, seller.sellerInfo?.verified || false)
                        }
                        className={`px-3 py-1 text-xs rounded ${
                          seller.sellerInfo?.verified
                            ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {seller.sellerInfo?.verified ? tr.suspend : tr.verify}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
