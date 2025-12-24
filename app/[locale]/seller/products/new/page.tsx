'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import ImageUpload from '@/components/upload/ImageUpload';
import { useCurrency, CURRENCY_SYMBOLS } from '@/contexts/CurrencyContext';

interface Category {
  _id: string;
  name: { fr: string; en: string; es: string };
  slug: string;
}

export default function NewProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('sellerDashboard');
  const { currency } = useCurrency();
  const currencySymbol = CURRENCY_SYMBOLS[currency];

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: { fr: '', en: '', es: '' },
    description: { fr: '', en: '', es: '' },
    price: '',
    compareAtPrice: '',
    stock: '',
    category: '',
    images: [] as string[],
    isOrganic: false,
    isFeatured: false,
    weight: '',
    ingredients: { fr: '', en: '', es: '' },
    usage: { fr: '', en: '', es: '' },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    } else if (session?.user?.role !== 'seller' && session?.user?.role !== 'admin') {
      router.push(`/${locale}`);
    }
  }, [session, status, router, locale]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use French as fallback for empty translations
      const name = {
        fr: formData.name.fr,
        en: formData.name.en || formData.name.fr,
        es: formData.name.es || formData.name.fr,
      };

      const description = {
        fr: formData.description.fr,
        en: formData.description.en || formData.description.fr,
        es: formData.description.es || formData.description.fr,
      };

      const ingredients = {
        fr: formData.ingredients.fr,
        en: formData.ingredients.en || formData.ingredients.fr,
        es: formData.ingredients.es || formData.ingredients.fr,
      };

      const usage = {
        fr: formData.usage.fr,
        en: formData.usage.en || formData.usage.fr,
        es: formData.usage.es || formData.usage.fr,
      };

      // Générer le slug à partir du nom (use EN if available, otherwise FR)
      const slug = (name.en)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const productData = {
        ...formData,
        name,
        description,
        ingredients,
        usage,
        slug,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        stock: parseInt(formData.stock),
        images: formData.images.filter(img => img.trim() !== ''),
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        router.push(`/${locale}/seller/products`);
      } else {
        const data = await res.json();
        setError(data.error || 'Error creating product');
      }
    } catch (error) {
      setError('Error creating product');
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (lang: 'fr' | 'en' | 'es', value: string) => {
    setFormData(prev => ({
      ...prev,
      name: { ...prev.name, [lang]: value }
    }));
  };

  const handleDescriptionChange = (lang: 'fr' | 'en' | 'es', value: string) => {
    setFormData(prev => ({
      ...prev,
      description: { ...prev.description, [lang]: value }
    }));
  };

  const handleIngredientsChange = (lang: 'fr' | 'en' | 'es', value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: { ...prev.ingredients, [lang]: value }
    }));
  };

  const handleUsageChange = (lang: 'fr' | 'en' | 'es', value: string) => {
    setFormData(prev => ({
      ...prev,
      usage: { ...prev.usage, [lang]: value }
    }));
  };

  const handleImagesChange = (urls: string[]) => {
    setFormData(prev => ({ ...prev, images: urls }));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}/seller/products`}
            className="text-green-600 hover:text-green-700 inline-flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('backToProducts')}
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{t('productForm.createTitle')}</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('productForm.basicInfo')}</h2>

            {/* Product Names */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('productForm.nameFr')} *
                </label>
                <input
                  type="text"
                  value={formData.name.fr}
                  onChange={(e) => handleNameChange('fr', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Requis - Ce nom sera utilisé si les traductions ne sont pas fournies</p>
              </div>

              {/* Optional translations */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Traductions (optionnel)
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      {t('productForm.nameEn')} (optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.name.en}
                      onChange={(e) => handleNameChange('en', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Laissez vide pour utiliser le nom français"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      {t('productForm.nameEs')} (optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.name.es}
                      onChange={(e) => handleNameChange('es', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Laissez vide pour utiliser le nom français"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('productForm.category')} *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">{t('productForm.selectCategory')}</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name[locale as keyof typeof cat.name]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Descriptions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('productForm.descriptions')}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('productForm.descriptionFr')} *
                </label>
                <textarea
                  value={formData.description.fr}
                  onChange={(e) => handleDescriptionChange('fr', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Requis - Cette description sera utilisée si les traductions ne sont pas fournies</p>
              </div>

              {/* Optional translations */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Traductions (optionnel)
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      {t('productForm.descriptionEn')} (optionnel)
                    </label>
                    <textarea
                      value={formData.description.en}
                      onChange={(e) => handleDescriptionChange('en', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Laissez vide pour utiliser la description française"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      {t('productForm.descriptionEs')} (optionnel)
                    </label>
                    <textarea
                      value={formData.description.es}
                      onChange={(e) => handleDescriptionChange('es', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Laissez vide pour utiliser la description française"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('productForm.pricingStock')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('productForm.price')} ({currencySymbol}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('productForm.compareAtPrice')} ({currencySymbol})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, compareAtPrice: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('productForm.stock')} *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('productForm.weight')}
              </label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="e.g., 100g, 250ml"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="mt-4 flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isOrganic}
                  onChange={(e) => setFormData(prev => ({ ...prev, isOrganic: e.target.checked }))}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{t('productForm.isOrganic')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{t('productForm.isFeatured')}</span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('productForm.images')}</h2>
            <p className="text-sm text-gray-500 mb-4">
              {locale === 'fr'
                ? 'Téléchargez les images de votre produit (max 5 images)'
                : locale === 'es'
                ? 'Sube las imágenes de tu producto (máx. 5 imágenes)'
                : 'Upload your product images (max 5 images)'}
            </p>

            <ImageUpload
              value={formData.images}
              onChange={handleImagesChange}
              maxImages={5}
              folder="nature-pharmacy/products"
              disabled={loading}
            />
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('productForm.additionalInfo')}</h2>

            {/* Ingredients */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('productForm.ingredientsFr')} *
                </label>
                <input
                  type="text"
                  value={formData.ingredients.fr}
                  onChange={(e) => handleIngredientsChange('fr', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Requis - Ces ingrédients seront utilisés si les traductions ne sont pas fournies
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Traductions (optionnel)
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.ingredients.en}
                    onChange={(e) => handleIngredientsChange('en', e.target.value)}
                    placeholder="Laissez vide pour utiliser les ingrédients français"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={formData.ingredients.es}
                    onChange={(e) => handleIngredientsChange('es', e.target.value)}
                    placeholder="Laissez vide pour utiliser les ingrédients français"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Usage */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('productForm.usageFr')} *
                </label>
                <input
                  type="text"
                  value={formData.usage.fr}
                  onChange={(e) => handleUsageChange('fr', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Requis - Ces instructions seront utilisées si les traductions ne sont pas fournies
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Traductions (optionnel)
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.usage.en}
                    onChange={(e) => handleUsageChange('en', e.target.value)}
                    placeholder="Laissez vide pour utiliser les instructions françaises"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={formData.usage.es}
                    onChange={(e) => handleUsageChange('es', e.target.value)}
                    placeholder="Laissez vide pour utiliser les instructions françaises"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('productForm.creating') : t('productForm.createProduct')}
            </button>
            <Link
              href={`/${locale}/seller/products`}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t('productForm.cancel')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
