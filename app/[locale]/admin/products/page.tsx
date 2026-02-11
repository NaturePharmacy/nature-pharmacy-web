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
  seller?: { name: string; email: string };
  category?: { name: { fr: string; en: string } };
  createdAt: string;
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale() as 'fr' | 'en' | 'es';
  const { formatPrice } = useCurrency();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ search: '', category: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const t = {
    fr: {
      title: 'Gestion des produits',
      search: 'Rechercher un produit...',
      allCategories: 'Toutes les catégories',
      product: 'Produit',
      price: 'Prix',
      stock: 'Stock',
      status: 'Statut',
      seller: 'Vendeur',
      actions: 'Actions',
      active: 'Actif',
      inactive: 'Inactif',
      featured: 'Mis en avant',
      organic: 'Bio',
      edit: 'Modifier',
      view: 'Voir',
      toggle: 'Basculer',
      noProducts: 'Aucun produit trouvé',
      back: 'Retour',
      outOfStock: 'Rupture',
      lowStock: 'Stock faible',
    },
    en: {
      title: 'Product Management',
      search: 'Search for a product...',
      allCategories: 'All categories',
      product: 'Product',
      price: 'Price',
      stock: 'Stock',
      status: 'Status',
      seller: 'Seller',
      actions: 'Actions',
      active: 'Active',
      inactive: 'Inactive',
      featured: 'Featured',
      organic: 'Organic',
      edit: 'Edit',
      view: 'View',
      toggle: 'Toggle',
      noProducts: 'No products found',
      back: 'Back',
      outOfStock: 'Out of stock',
      lowStock: 'Low stock',
    },
  };

  const tr = t[locale as keyof typeof t] || t.fr;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push(`/${locale}`);
    }
  }, [status, session, router, locale]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchProducts();
    }
  }, [session, filter, pagination.page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '10',
      });
      if (filter.search) params.append('search', filter.search);
      if (filter.category) params.append('category', filter.category);

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      if (res.ok) {
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (productId: string, field: 'isActive' | 'isFeatured') => {
    try {
      const product = products.find(p => p._id === productId);
      if (!product) return;

      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !product[field] }),
      });

      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link href={`/${locale}/admin`} className="text-green-600 hover:text-green-700 text-sm mb-2 inline-flex items-center">
                ← {tr.back}
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{tr.title}</h1>
              <p className="text-gray-500 text-sm">{pagination.total} produits</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={tr.search}
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">{tr.allCategories}</option>
              <option value="herbs">Herbs</option>
              <option value="oils">Oils</option>
              <option value="cosmetics">Cosmetics</option>
              <option value="foods">Foods</option>
            </select>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{tr.product}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{tr.price}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{tr.stock}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{tr.status}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{tr.seller}</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">{tr.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        {tr.noProducts}
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {product.images?.[0] ? (
                                <Image
                                  src={product.images[0]}
                                  alt={product.name[locale]}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">🌿</div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate max-w-[200px]">{product.name[locale]}</p>
                              <div className="flex gap-1 mt-1">
                                {product.isOrganic && (
                                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">Bio</span>
                                )}
                                {product.isFeatured && (
                                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">★</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{formatPrice(product.price)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            product.stock === 0 ? 'bg-red-100 text-red-700' :
                            product.stock < 10 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {product.stock === 0 ? tr.outOfStock : product.stock < 10 ? `${product.stock} (${tr.lowStock})` : product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(product._id, 'isActive')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                              product.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {product.isActive ? tr.active : tr.inactive}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">{product.seller?.name || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleStatus(product._id, 'isFeatured')}
                              className={`p-2 rounded-lg transition ${
                                product.isFeatured ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                              title={tr.featured}
                            >
                              ★
                            </button>
                            <Link
                              href={`/${locale}/products/${product.slug}`}
                              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                              title={tr.view}
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

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 p-4 border-t">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setPagination({ ...pagination, page })}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === pagination.page
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

          </div>
  );
}
