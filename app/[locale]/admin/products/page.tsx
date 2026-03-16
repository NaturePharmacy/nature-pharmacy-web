'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrency } from '@/contexts/CurrencyContext';

interface Product {
  _id: string;
  name: { fr: string; en: string; es: string };
  slug: string;
  images: string[];
  price: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isOrganic: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  seller?: { name: string; email: string };
  category?: { name: { fr: string; en: string } };
  createdAt: string;
}

type Tab = 'all' | 'pending' | 'rejected';

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale() as 'fr' | 'en' | 'es';
  const { formatPrice } = useCurrency();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('all');
  const [filter, setFilter] = useState({ search: '', category: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [pendingCount, setPendingCount] = useState(0);
  const [toast, setToast] = useState('');
  const [approvalModal, setApprovalModal] = useState<{
    open: boolean;
    product: Product | null;
    action: 'approve' | 'reject';
    reason: string;
    loading: boolean;
  }>({ open: false, product: null, action: 'approve', reason: '', loading: false });

  useEffect(() => {
    if (status === 'unauthenticated') router.push(`/${locale}/login`);
    else if (status === 'authenticated' && session?.user?.role !== 'admin') router.push(`/${locale}`);
  }, [status, session, router, locale]);

  useEffect(() => {
    if (session?.user?.role === 'admin') fetchProducts();
  }, [session, filter, pagination.page, tab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pagination.page.toString(), limit: '15' });
      if (filter.search) params.append('search', filter.search);
      if (filter.category) params.append('category', filter.category);
      if (tab === 'pending') params.append('approvalStatus', 'pending');
      if (tab === 'rejected') params.append('approvalStatus', 'rejected');

      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products);
        setPagination(data.pagination);
        if (tab === 'pending') setPendingCount(data.pagination.total);
      }
    } finally {
      setLoading(false);
    }

    // Always refresh pending count
    if (tab !== 'pending') {
      fetch('/api/admin/products?approvalStatus=pending&limit=1')
        .then(r => r.json())
        .then(d => setPendingCount(d.pagination?.total || 0))
        .catch(() => {});
    }
  };

  const handleToggleStatus = async (productId: string, field: 'isActive' | 'isFeatured') => {
    const product = products.find(p => p._id === productId);
    if (!product) return;
    await fetch(`/api/admin/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !product[field] }),
    });
    fetchProducts();
  };

  const openApproval = (product: Product, action: 'approve' | 'reject') => {
    setApprovalModal({ open: true, product, action, reason: '', loading: false });
  };

  const handleApproval = async () => {
    if (!approvalModal.product) return;
    setApprovalModal(m => ({ ...m, loading: true }));

    const res = await fetch(`/api/admin/products/${approvalModal.product._id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: approvalModal.action, reason: approvalModal.reason }),
    });

    if (res.ok) {
      const label = approvalModal.action === 'approve' ? 'Produit approuvé' : 'Produit refusé';
      showToast(label);
      setApprovalModal({ open: false, product: null, action: 'approve', reason: '', loading: false });
      fetchProducts();
    } else {
      const d = await res.json();
      showToast(d.error || 'Erreur');
      setApprovalModal(m => ({ ...m, loading: false }));
    }
  };

  const exportCSV = () => {
    const rows = [
      ['Nom', 'Slug', 'Prix (USD)', 'Stock', 'Statut', 'Validation', 'Vendeur'],
      ...products.map(p => [
        p.name?.fr || p.name?.en || '',
        p.slug,
        p.price.toFixed(2),
        p.stock.toString(),
        p.isActive ? 'Actif' : 'Inactif',
        p.approvalStatus || 'approved',
        p.seller?.name || '',
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `produits_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const approvalBadge = (s?: string) => {
    if (!s || s === 'approved') return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Approuvé</span>;
    if (s === 'pending') return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">En attente</span>;
    return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Refusé</span>;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <svg className="animate-spin h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium">
          {toast}
        </div>
      )}

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <Link href={`/${locale}/admin`} className="text-green-600 hover:text-green-700 text-sm mb-1 inline-flex items-center gap-1">
                ← Retour
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des produits</h1>
              <p className="text-gray-500 text-sm">{pagination.total} produits</p>
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exporter CSV
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-white rounded-xl shadow-sm p-1 w-fit">
            {(['all', 'pending', 'rejected'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setPagination(p => ({ ...p, page: 1 })); }}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors relative ${tab === t ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {t === 'all' ? 'Tous' : t === 'pending' ? 'En attente' : 'Refusés'}
                {t === 'pending' && pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
              <option value="">Toutes catégories</option>
              <option value="herbs">Herbes</option>
              <option value="oils">Huiles</option>
              <option value="cosmetics">Cosmétiques</option>
              <option value="foods">Alimentaire</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produit</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prix</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Validation</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendeur</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                        {tab === 'pending' ? 'Aucun produit en attente de validation' : 'Aucun produit trouvé'}
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {product.images?.[0] ? (
                                <Image src={product.images[0]} alt={product.name[locale]} fill className="object-cover" sizes="40px" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">🌿</div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate max-w-[180px]">{product.name[locale] || product.name.fr}</p>
                              <div className="flex gap-1 mt-0.5">
                                {product.isOrganic && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">Bio</span>}
                                {product.isFeatured && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">★ Vedette</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-800 text-sm">{formatPrice(product.price)}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            product.stock === 0 ? 'bg-red-100 text-red-700' :
                            product.stock < 10 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {product.stock === 0 ? 'Rupture' : product.stock < 10 ? `${product.stock} (faible)` : product.stock}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1">
                            {approvalBadge(product.approvalStatus)}
                            <button
                              onClick={() => handleToggleStatus(product._id, 'isActive')}
                              className={`px-2 py-0.5 rounded-full text-xs font-medium transition w-fit ${
                                product.isActive ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                            >
                              {product.isActive ? 'Visible' : 'Masqué'}
                            </button>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-600">{product.seller?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-400">{product.seller?.email}</p>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 flex-wrap">
                            {(product.approvalStatus === 'pending' || product.approvalStatus === 'rejected') && (
                              <button
                                onClick={() => openApproval(product, 'approve')}
                                className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium transition-colors"
                              >
                                Approuver
                              </button>
                            )}
                            {(product.approvalStatus === 'pending' || product.approvalStatus === 'approved' || !product.approvalStatus) && (
                              <button
                                onClick={() => openApproval(product, 'reject')}
                                className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium transition-colors"
                              >
                                Refuser
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleStatus(product._id, 'isFeatured')}
                              className={`p-1.5 rounded-lg transition text-sm ${product.isFeatured ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                              title="Vedette"
                            >
                              ★
                            </button>
                            <Link
                              href={`/${locale}/products/${product.slug}`}
                              className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                              title="Voir"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 p-4 border-t">
                <button disabled={pagination.page === 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 text-sm">← Préc.</button>
                {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPagination(pag => ({ ...pag, page: p }))} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === pagination.page ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{p}</button>
                ))}
                <button disabled={pagination.page === pagination.pages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 text-sm">Suiv. →</button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Approval Modal */}
      {approvalModal.open && approvalModal.product && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className={`p-6 border-b ${approvalModal.action === 'approve' ? 'bg-green-50' : 'bg-red-50'} rounded-t-2xl`}>
              <h2 className="text-lg font-bold text-gray-900">
                {approvalModal.action === 'approve' ? 'Approuver le produit' : 'Refuser le produit'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {approvalModal.product.name?.fr || approvalModal.product.name?.en}
              </p>
            </div>
            <div className="p-6 space-y-4">
              {approvalModal.action === 'reject' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Raison du refus (envoyée au vendeur)
                  </label>
                  <textarea
                    rows={3}
                    value={approvalModal.reason}
                    onChange={(e) => setApprovalModal(m => ({ ...m, reason: e.target.value }))}
                    placeholder="Ex: Images de mauvaise qualité, description incomplète..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
                  />
                </div>
              )}
              {approvalModal.action === 'approve' && (
                <p className="text-sm text-gray-600">
                  Le produit sera rendu visible sur la marketplace et le vendeur en sera notifié.
                </p>
              )}
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => setApprovalModal({ open: false, product: null, action: 'approve', reason: '', loading: false })}
                className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleApproval}
                disabled={approvalModal.loading}
                className={`px-5 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2 ${
                  approvalModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {approvalModal.loading && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {approvalModal.action === 'approve' ? 'Confirmer l\'approbation' : 'Confirmer le refus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
