'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProductFormData {
  name: { fr: string; en: string; es: string };
  description: { fr: string; en: string; es: string };
  slug: string;
  seller: string;
  category: string;
  images: string[];
  basePrice: number;
  compareAtPrice?: number;
  stock: number;
  sku?: string;
  weight?: number;
  isOrganic: boolean;
  isFeatured: boolean;
  isActive: boolean;
  tags?: string[];
}

interface Category {
  _id: string;
  name: { fr: string; en: string; es: string };
}

interface Seller {
  _id: string;
  name: string;
  email: string;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  initialData?: Partial<ProductFormData>;
  categories: Category[];
  sellers: Seller[];
  locale: 'fr' | 'en' | 'es';
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
  sellers,
  locale,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: { fr: '', en: '', es: '' },
    description: { fr: '', en: '', es: '' },
    slug: '',
    seller: '',
    category: '',
    images: [],
    basePrice: 0,
    compareAtPrice: undefined,
    stock: 0,
    sku: '',
    weight: undefined,
    isOrganic: false,
    isFeatured: false,
    isActive: true,
    tags: [],
  });

  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'nature-pharmacy/products');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();

      if (res.ok) {
        setFormData((prev) => ({ ...prev, images: [...prev.images, data.url] }));
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  if (!isOpen) return null;

  const t = {
    fr: {
      title: initialData ? 'Modifier le produit' : 'Créer un produit',
      nameFr: 'Nom (FR)',
      nameEn: 'Nom (EN)',
      nameEs: 'Nom (ES)',
      descFr: 'Description (FR)',
      descEn: 'Description (EN)',
      descEs: 'Description (ES)',
      slug: 'Slug',
      seller: 'Vendeur',
      category: 'Catégorie',
      images: 'Images',
      basePrice: 'Prix de base (CFA)',
      compareAtPrice: 'Prix barré (CFA)',
      stock: 'Stock',
      sku: 'SKU',
      weight: 'Poids (kg)',
      organic: 'Produit bio',
      featured: 'Produit vedette',
      active: 'Actif',
      tags: 'Tags',
      addTag: 'Ajouter',
      uploadImage: 'Télécharger une image',
      save: 'Enregistrer',
      cancel: 'Annuler',
    },
    en: {
      title: initialData ? 'Edit Product' : 'Create Product',
      nameFr: 'Name (FR)',
      nameEn: 'Name (EN)',
      nameEs: 'Name (ES)',
      descFr: 'Description (FR)',
      descEn: 'Description (EN)',
      descEs: 'Description (ES)',
      slug: 'Slug',
      seller: 'Seller',
      category: 'Category',
      images: 'Images',
      basePrice: 'Base Price (CFA)',
      compareAtPrice: 'Compare Price (CFA)',
      stock: 'Stock',
      sku: 'SKU',
      weight: 'Weight (kg)',
      organic: 'Organic',
      featured: 'Featured',
      active: 'Active',
      tags: 'Tags',
      addTag: 'Add',
      uploadImage: 'Upload Image',
      save: 'Save',
      cancel: 'Cancel',
    },
    es: {
      title: initialData ? 'Editar Producto' : 'Crear Producto',
      nameFr: 'Nombre (FR)',
      nameEn: 'Nombre (EN)',
      nameEs: 'Nombre (ES)',
      descFr: 'Descripción (FR)',
      descEn: 'Descripción (EN)',
      descEs: 'Descripción (ES)',
      slug: 'Slug',
      seller: 'Vendedor',
      category: 'Categoría',
      images: 'Imágenes',
      basePrice: 'Precio base (CFA)',
      compareAtPrice: 'Precio tachado (CFA)',
      stock: 'Stock',
      sku: 'SKU',
      weight: 'Peso (kg)',
      organic: 'Orgánico',
      featured: 'Destacado',
      active: 'Activo',
      tags: 'Etiquetas',
      addTag: 'Añadir',
      uploadImage: 'Subir imagen',
      save: 'Guardar',
      cancel: 'Cancelar',
    },
  };

  const tr = t[locale];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-6xl w-full my-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">{tr.title}</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Names */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tr.nameFr} *
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
                  {tr.nameEn} *
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
                  {tr.nameEs} *
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

            {/* Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tr.descFr} *
                </label>
                <textarea
                  required
                  value={formData.description.fr}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: { ...formData.description, fr: e.target.value },
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tr.descEn} *
                </label>
                <textarea
                  required
                  value={formData.description.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: { ...formData.description, en: e.target.value },
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tr.descEs} *
                </label>
                <textarea
                  required
                  value={formData.description.es}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: { ...formData.description, es: e.target.value },
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Slug, Seller, Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tr.seller} *
                </label>
                <select
                  required
                  value={formData.seller}
                  onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select seller...</option>
                  {sellers.map((seller) => (
                    <option key={seller._id} value={seller._id}>
                      {seller.name} ({seller.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tr.category} *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name[locale]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prices and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tr.basePrice} *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, basePrice: parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tr.compareAtPrice}
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.compareAtPrice || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      compareAtPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tr.stock} *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{tr.sku}</label>
                <input
                  type="text"
                  value={formData.sku || ''}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{tr.images}</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative w-full h-32">
                    <Image src={image} alt={`Product ${index + 1}`} fill className="object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{tr.tags}</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {(formData.tags || []).map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add tag..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {tr.addTag}
                </button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isOrganic"
                  checked={formData.isOrganic}
                  onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="isOrganic" className="ml-2 text-sm font-medium text-gray-700">
                  {tr.organic}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="isFeatured" className="ml-2 text-sm font-medium text-gray-700">
                  {tr.featured}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                  {tr.active}
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                {tr.cancel}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {tr.save}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
