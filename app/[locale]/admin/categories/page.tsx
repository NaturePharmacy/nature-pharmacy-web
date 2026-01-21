'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';

interface Category {
  _id: string;
  name: { fr: string; en: string; es: string };
  slug: string;
  description?: { fr?: string; en?: string; es?: string };
  image?: string;
  icon?: string;
  parent?: { _id: string; name: { fr: string; en: string; es: string }; slug: string } | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCategories() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: { fr: '', en: '', es: '' },
    slug: '',
    description: { fr: '', en: '', es: '' },
    image: '',
    icon: '',
    parent: '',
    displayOrder: 0,
    isActive: true,
  });

  const t = {
    fr: {
      title: 'Gestion des Catégories',
      addNew: 'Ajouter une catégorie',
      search: 'Rechercher...',
      name: 'Nom',
      slug: 'Slug',
      parent: 'Catégorie parente',
      noParent: 'Aucune (catégorie principale)',
      displayOrder: 'Ordre d\'affichage',
      active: 'Actif',
      actions: 'Actions',
      edit: 'Modifier',
      delete: 'Supprimer',
      save: 'Enregistrer',
      cancel: 'Annuler',
      loading: 'Chargement...',
      noCategories: 'Aucune catégorie trouvée',
      confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette catégorie ?',
      nameFr: 'Nom (FR)',
      nameEn: 'Nom (EN)',
      nameEs: 'Nom (ES)',
      descFr: 'Description (FR)',
      descEn: 'Description (EN)',
      descEs: 'Description (ES)',
      image: 'Image',
      icon: 'Icône',
      uploadImage: 'Télécharger une image',
      createCategory: 'Créer une catégorie',
      editCategory: 'Modifier la catégorie',
      noAccess: 'Accès non autorisé',
    },
    en: {
      title: 'Category Management',
      addNew: 'Add Category',
      search: 'Search...',
      name: 'Name',
      slug: 'Slug',
      parent: 'Parent Category',
      noParent: 'None (Root category)',
      displayOrder: 'Display Order',
      active: 'Active',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      loading: 'Loading...',
      noCategories: 'No categories found',
      confirmDelete: 'Are you sure you want to delete this category?',
      nameFr: 'Name (FR)',
      nameEn: 'Name (EN)',
      nameEs: 'Name (ES)',
      descFr: 'Description (FR)',
      descEn: 'Description (EN)',
      descEs: 'Description (ES)',
      image: 'Image',
      icon: 'Icon',
      uploadImage: 'Upload Image',
      createCategory: 'Create Category',
      editCategory: 'Edit Category',
      noAccess: 'Access Denied',
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
      fetchCategories();
    }
  }, [session]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();

      if (res.ok) {
        setCategories(data.categories);
      } else {
        setError(data.error || 'Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'nature-pharmacy/categories');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();

      if (res.ok) {
        setFormData((prev) => ({ ...prev, image: data.url }));
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory._id}`
        : '/api/admin/categories';

      const res = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setShowModal(false);
        fetchCategories();
        resetForm();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to save category');
      }
    } catch (err) {
      console.error('Error saving category:', err);
      setError('Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || { fr: '', en: '', es: '' },
      image: category.image || '',
      icon: category.icon || '',
      parent: category.parent?._id || '',
      displayOrder: category.displayOrder,
      isActive: category.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(tr.confirmDelete)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        fetchCategories();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category');
    }
  };

  const resetForm = () => {
    setFormData({
      name: { fr: '', en: '', es: '' },
      slug: '',
      description: { fr: '', en: '', es: '' },
      image: '',
      icon: '',
      parent: '',
      displayOrder: 0,
      isActive: true,
    });
    setEditingCategory(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setShowModal(true);
  };

  const filteredCategories = categories.filter((category) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      category.name.fr.toLowerCase().includes(searchLower) ||
      category.name.en.toLowerCase().includes(searchLower) ||
      category.name.es.toLowerCase().includes(searchLower) ||
      category.slug.toLowerCase().includes(searchLower)
    );
  });

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{tr.title}</h1>
        <button
          onClick={handleOpenModal}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {tr.addNew}
        </button>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder={tr.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {tr.image}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {tr.name}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {tr.slug}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {tr.parent}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {tr.displayOrder}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {tr.active}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {tr.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    {tr.noCategories}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      {category.image ? (
                        <div className="relative w-12 h-12">
                          <Image
                            src={category.image}
                            alt={category.name[locale as 'fr' | 'en' | 'es']}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">
                        {category.name[locale as 'fr' | 'en' | 'es']}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{category.slug}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {category.parent
                        ? category.parent.name[locale as 'fr' | 'en' | 'es']
                        : '-'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {category.displayOrder}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          category.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {tr.edit}
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          {tr.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingCategory ? tr.editCategory : tr.createCategory}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.nameFr}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name.fr}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: { ...formData.name, fr: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.nameEn}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name.en}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: { ...formData.name, en: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.nameEs}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name.es}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: { ...formData.name, es: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.slug}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value.toLowerCase() })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.parent}
                    </label>
                    <select
                      value={formData.parent}
                      onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">{tr.noParent}</option>
                      {categories
                        .filter((cat) => cat._id !== editingCategory?._id)
                        .map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name[locale as 'fr' | 'en' | 'es']}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.descFr}
                    </label>
                    <textarea
                      value={formData.description.fr}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: { ...formData.description, fr: e.target.value },
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.descEn}
                    </label>
                    <textarea
                      value={formData.description.en}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: { ...formData.description, en: e.target.value },
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.descEs}
                    </label>
                    <textarea
                      value={formData.description.es}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: { ...formData.description, es: e.target.value },
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tr.image}
                  </label>
                  {formData.image && (
                    <div className="mb-4 relative w-32 h-32">
                      <Image
                        src={formData.image}
                        alt="Category"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.displayOrder}
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) =>
                        setFormData({ ...formData, displayOrder: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center mt-8">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                      {tr.active}
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    {tr.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {tr.save}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
