'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  isEmailVerified: boolean;
  createdAt: string;
  sellerInfo?: {
    storeName?: string;
    verified?: boolean;
  };
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ role: '', search: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  const t = {
    fr: {
      title: 'Gestion des utilisateurs',
      search: 'Rechercher...',
      allRoles: 'Tous les rôles',
      buyer: 'Acheteur',
      seller: 'Vendeur',
      admin: 'Admin',
      name: 'Nom',
      email: 'Email',
      role: 'Rôle',
      verified: 'Vérifié',
      actions: 'Actions',
      edit: 'Modifier',
      delete: 'Supprimer',
      save: 'Enregistrer',
      cancel: 'Annuler',
      confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
      noUsers: 'Aucun utilisateur trouvé',
      back: 'Retour',
      yes: 'Oui',
      no: 'Non',
      editUser: 'Modifier l\'utilisateur',
    },
    en: {
      title: 'User Management',
      search: 'Search...',
      allRoles: 'All roles',
      buyer: 'Buyer',
      seller: 'Seller',
      admin: 'Admin',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      verified: 'Verified',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      confirmDelete: 'Are you sure you want to delete this user?',
      noUsers: 'No users found',
      back: 'Back',
      yes: 'Yes',
      no: 'No',
      editUser: 'Edit User',
    },
  };

  const tr = t[locale as keyof typeof t] || t.fr;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    } else if (session?.user?.role !== 'admin') {
      router.push(`/${locale}`);
    }
  }, [status, session, router, locale]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchUsers();
    }
  }, [session, filter, pagination.page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '10',
      });
      if (filter.role) params.append('role', filter.role);
      if (filter.search) params.append('search', filter.search);

      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();

      if (res.ok) {
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const res = await fetch(`/api/admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: editingUser.role,
          isEmailVerified: editingUser.isEmailVerified,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(tr.confirmDelete)) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const roleColors = {
    buyer: 'bg-gray-100 text-gray-700',
    seller: 'bg-blue-100 text-blue-700',
    admin: 'bg-red-100 text-red-700',
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
              <p className="text-gray-500 text-sm">{pagination.total} utilisateurs</p>
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
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={filter.role}
              onChange={(e) => setFilter({ ...filter, role: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">{tr.allRoles}</option>
              <option value="buyer">{tr.buyer}</option>
              <option value="seller">{tr.seller}</option>
              <option value="admin">{tr.admin}</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{tr.name}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{tr.email}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{tr.role}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{tr.verified}</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">{tr.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        {tr.noUsers}
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-semibold">{user.name?.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              {user.sellerInfo?.storeName && (
                                <p className="text-xs text-gray-500">{user.sellerInfo.storeName}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                            {tr[user.role]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${user.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {user.isEmailVerified ? tr.yes : tr.no}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => { setEditingUser(user); setShowModal(true); }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium mr-3"
                          >
                            {tr.edit}
                          </button>
                          {user._id !== session?.user?.id && (
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              {tr.delete}
                            </button>
                          )}
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

      {/* Edit Modal */}
      {showModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{tr.editUser}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{tr.name}</label>
                <input
                  type="text"
                  value={editingUser.name}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{tr.email}</label>
                <input
                  type="email"
                  value={editingUser.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{tr.role}</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="buyer">{tr.buyer}</option>
                  <option value="seller">{tr.seller}</option>
                  <option value="admin">{tr.admin}</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={editingUser.isEmailVerified}
                  onChange={(e) => setEditingUser({ ...editingUser, isEmailVerified: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="verified" className="text-sm text-gray-700">{tr.verified}</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setShowModal(false); setEditingUser(null); }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                {tr.cancel}
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {tr.save}
              </button>
            </div>
          </div>
        </div>
      )}

          </div>
  );
}
