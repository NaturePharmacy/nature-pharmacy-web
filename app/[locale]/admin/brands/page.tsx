'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: { fr: string; en: string; es: string };
  logo?: string;
  website?: string;
  country?: string;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
}

export default function AdminBrands() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale() as 'fr' | 'en' | 'es';

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: { fr: '', en: '', es: '' },
    logo: '',
    website: '',
    country: '',
    isActive: true,
    isFeatured: false,
    displayOrder: 0,
  });

  const t = {
    fr: {
      title: 'Gestion des marques',
      addNew: 'Ajouter une marque',
      search: 'Rechercher...',
      name: 'Nom',
      slug: 'Slug',
      country: 'Pays',
      website: 'Site web',
      active: 'Actif',
      featured: 'Vedette',
      actions: 'Actions',
      edit: 'Modifier',
      delete: 'Supprimer',
      save: 'Enregistrer',
      cancel: 'Annuler',
      loading: 'Chargement...',
      noBrands: 'Aucune marque trouvée',
      confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette marque ?',
      descFr: 'Description (FR)',
      descEn: 'Description (EN)',
      descEs: 'Description (ES)',
      logo: 'Logo',
      uploadLogo: 'Télécharger un logo',
      displayOrder: 'Ordre d\'affichage',
      createBrand: 'Créer une marque',
      editBrand: 'Modifier la marque',
      noAccess: 'Accès non autorisé',
    },
    en: {
      title: 'Brand Management',
      addNew: 'Add Brand',
      search: 'Search...',
      name: 'Name',
      slug: 'Slug',
      country: 'Country',
      website: 'Website',
      active: 'Active',
      featured: 'Featured',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      loading: 'Loading...',
      noBrands: 'No brands found',
      confirmDelete: 'Are you sure you want to delete this brand?',
      descFr: 'Description (FR)',
      descEn: 'Description (EN)',
      descEs: 'Description (ES)',
      logo: 'Logo',
      uploadLogo: 'Upload Logo',
      displayOrder: 'Display Order',
      createBrand: 'Create Brand',
      editBrand: 'Edit Brand',
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
      fetchBrands();
    }
  }, [session]);

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/admin/brands');
      const data = await res.json();

      if (res.ok) {
        setBrands(data.brands);
      } else {
        setError(data.error || 'Failed to fetch brands');
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError('Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      formDataUpload.append('folder', 'nature-pharmacy/brands');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();

      if (res.ok) {
        setFormData((prev) => ({ ...prev, logo: data.url }));
      } else {
        setError(data.error || 'Failed to upload logo');
      }
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const url = editingBrand
        ? `/api/admin/brands/${editingBrand._id}`
        : '/api/admin/brands';

      const res = await fetch(url, {
        method: editingBrand ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setShowModal(false);
        fetchBrands();
        resetForm();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to save brand');
      }
    } catch (err) {
      console.error('Error saving brand:', err);
      setError('Failed to save brand');
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || { fr: '', en: '', es: '' },
      logo: brand.logo || '',
      website: brand.website || '',
      country: brand.country || '',
      isActive: brand.isActive,
      isFeatured: brand.isFeatured,
      displayOrder: brand.displayOrder,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(tr.confirmDelete)) return;

    try {
      const res = await fetch(`/api/admin/brands/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        fetchBrands();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to delete brand');
      }
    } catch (err) {
      console.error('Error deleting brand:', err);
      setError('Failed to delete brand');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: { fr: '', en: '', es: '' },
      logo: '',
      website: '',
      country: '',
      isActive: true,
      isFeatured: false,
      displayOrder: 0,
    });
    setEditingBrand(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setShowModal(true);
  };

  const filteredBrands = brands.filter((brand) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      brand.name.toLowerCase().includes(searchLower) ||
      brand.slug.toLowerCase().includes(searchLower) ||
      brand.country?.toLowerCase().includes(searchLower)
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">{tr.noBrands}</div>
          ) : (
            filteredBrands.map((brand) => (
              <div key={brand._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                {brand.logo && (
                  <div className="relative w-full h-32 mb-4">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <h3 className="font-bold text-lg text-gray-900 mb-2">{brand.name}</h3>
                {brand.country && (
                  <p className="text-sm text-gray-600 mb-2">📍 {brand.country}</p>
                )}
                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mb-2 block"
                  >
                    🌐 {brand.website}
                  </a>
                )}
                <div className="flex gap-2 mb-3">
                  {brand.isActive && (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {tr.active}
                    </span>
                  )}
                  {brand.isFeatured && (
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      {tr.featured}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(brand)}
                    className="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {tr.edit}
                  </button>
                  <button
                    onClick={() => handleDelete(brand._id)}
                    className="flex-1 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    {tr.delete}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingBrand ? tr.editBrand : tr.createBrand}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.name} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.slug} *
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
                    {tr.logo}
                  </label>
                  {formData.logo && (
                    <div className="mb-4 relative w-32 h-32">
                      <Image
                        src={formData.logo}
                        alt="Brand Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.website}
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.country}
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

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

                <div className="flex gap-6">
                  <div className="flex items-center">
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
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData({ ...formData, isFeatured: e.target.checked })
                      }
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="isFeatured" className="ml-2 text-sm font-medium text-gray-700">
                      {tr.featured}
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
