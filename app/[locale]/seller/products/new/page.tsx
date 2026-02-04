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

  // Formulaire simplifié - une seule langue (celle du vendeur)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    stock: '',
    category: '',
    images: [] as string[],
    isOrganic: false,
    isFeatured: false,
    weight: '',
    ingredients: '',
    usage: '',
  });

  const labels = {
    fr: {
      pageTitle: 'Ajouter un produit',
      basicInfo: 'Informations de base',
      name: 'Nom du produit',
      namePlaceholder: 'Ex: Huile de baobab bio',
      category: 'Catégorie',
      selectCategory: 'Sélectionner une catégorie',
      description: 'Description',
      descriptionPlaceholder: 'Décrivez votre produit en détail...',
      pricingStock: 'Prix et stock',
      price: 'Prix de vente',
      compareAtPrice: 'Prix barré (optionnel)',
      stock: 'Quantité en stock',
      weight: 'Poids / Contenance',
      weightPlaceholder: 'Ex: 100g, 250ml',
      isOrganic: 'Produit biologique',
      isFeatured: 'Mettre en avant',
      images: 'Images du produit',
      imagesHelp: 'Ajoutez jusqu\'à 5 images de votre produit. La première image sera l\'image principale.',
      additionalInfo: 'Informations complémentaires',
      ingredients: 'Ingrédients / Composition',
      ingredientsPlaceholder: 'Listez les ingrédients du produit...',
      usage: 'Mode d\'emploi / Conseils d\'utilisation',
      usagePlaceholder: 'Comment utiliser ce produit...',
      creating: 'Création en cours...',
      createProduct: 'Créer le produit',
      cancel: 'Annuler',
      backToProducts: 'Retour aux produits',
      translationNote: 'Les traductions seront générées automatiquement pour les autres langues.',
    },
    en: {
      pageTitle: 'Add a product',
      basicInfo: 'Basic information',
      name: 'Product name',
      namePlaceholder: 'Ex: Organic baobab oil',
      category: 'Category',
      selectCategory: 'Select a category',
      description: 'Description',
      descriptionPlaceholder: 'Describe your product in detail...',
      pricingStock: 'Pricing and stock',
      price: 'Selling price',
      compareAtPrice: 'Compare at price (optional)',
      stock: 'Stock quantity',
      weight: 'Weight / Volume',
      weightPlaceholder: 'Ex: 100g, 250ml',
      isOrganic: 'Organic product',
      isFeatured: 'Featured',
      images: 'Product images',
      imagesHelp: 'Add up to 5 images of your product. The first image will be the main image.',
      additionalInfo: 'Additional information',
      ingredients: 'Ingredients / Composition',
      ingredientsPlaceholder: 'List the product ingredients...',
      usage: 'How to use / Usage instructions',
      usagePlaceholder: 'How to use this product...',
      creating: 'Creating...',
      createProduct: 'Create product',
      cancel: 'Cancel',
      backToProducts: 'Back to products',
      translationNote: 'Translations will be automatically generated for other languages.',
    },
    es: {
      pageTitle: 'Agregar un producto',
      basicInfo: 'Información básica',
      name: 'Nombre del producto',
      namePlaceholder: 'Ej: Aceite de baobab orgánico',
      category: 'Categoría',
      selectCategory: 'Seleccionar una categoría',
      description: 'Descripción',
      descriptionPlaceholder: 'Describe tu producto en detalle...',
      pricingStock: 'Precio y stock',
      price: 'Precio de venta',
      compareAtPrice: 'Precio tachado (opcional)',
      stock: 'Cantidad en stock',
      weight: 'Peso / Contenido',
      weightPlaceholder: 'Ej: 100g, 250ml',
      isOrganic: 'Producto orgánico',
      isFeatured: 'Destacado',
      images: 'Imágenes del producto',
      imagesHelp: 'Agrega hasta 5 imágenes de tu producto. La primera imagen será la imagen principal.',
      additionalInfo: 'Información adicional',
      ingredients: 'Ingredientes / Composición',
      ingredientsPlaceholder: 'Lista los ingredientes del producto...',
      usage: 'Modo de uso / Instrucciones',
      usagePlaceholder: 'Cómo usar este producto...',
      creating: 'Creando...',
      createProduct: 'Crear producto',
      cancel: 'Cancelar',
      backToProducts: 'Volver a productos',
      translationNote: 'Las traducciones se generarán automáticamente para otros idiomas.',
    },
  };

  const l = labels[locale as keyof typeof labels] || labels.fr;

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
      // Le vendeur entre dans sa langue, on copie dans toutes les langues
      // Les traductions externes seront implémentées plus tard
      const name = {
        fr: formData.name,
        en: formData.name,
        es: formData.name,
      };

      const description = {
        fr: formData.description,
        en: formData.description,
        es: formData.description,
      };

      const ingredients = {
        fr: formData.ingredients,
        en: formData.ingredients,
        es: formData.ingredients,
      };

      const usage = {
        fr: formData.usage,
        en: formData.usage,
        es: formData.usage,
      };

      // Générer le slug à partir du nom
      const slug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const productData = {
        name,
        description,
        ingredients,
        usage,
        slug,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        stock: parseInt(formData.stock),
        category: formData.category,
        images: formData.images.filter(img => img.trim() !== ''),
        isOrganic: formData.isOrganic,
        isFeatured: formData.isFeatured,
        weight: formData.weight,
        // Marquer la langue originale pour la traduction future
        originalLocale: locale,
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}/seller/products`}
            className="text-green-600 hover:text-green-700 inline-flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {l.backToProducts}
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{l.pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">{l.translationNote}</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{l.basicInfo}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {l.name} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={l.namePlaceholder}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {l.category} *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">{l.selectCategory}</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name[locale as keyof typeof cat.name] || cat.name.fr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {l.description} *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={l.descriptionPlaceholder}
                  required
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{l.pricingStock}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {l.price} ({currencySymbol}) *
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
                  {l.compareAtPrice}
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
                  {l.stock} *
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
                {l.weight}
              </label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                placeholder={l.weightPlaceholder}
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
                <span className="text-sm text-gray-700">{l.isOrganic}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{l.isFeatured}</span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{l.images}</h2>
            <p className="text-sm text-gray-500 mb-4">{l.imagesHelp}</p>

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
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{l.additionalInfo}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {l.ingredients}
                </label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={l.ingredientsPlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {l.usage}
                </label>
                <textarea
                  value={formData.usage}
                  onChange={(e) => setFormData(prev => ({ ...prev, usage: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={l.usagePlaceholder}
                />
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
              {loading ? l.creating : l.createProduct}
            </button>
            <Link
              href={`/${locale}/seller/products`}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-center"
            >
              {l.cancel}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
