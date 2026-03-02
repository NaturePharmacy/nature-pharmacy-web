'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import ImageUpload from '@/components/upload/ImageUpload';
import { useCurrency, CURRENCY_SYMBOLS, CURRENCY_RATES } from '@/contexts/CurrencyContext';
import MedicalFieldsForm from '@/components/seller/MedicalFieldsForm';

interface Category {
  _id: string;
  name: { fr: string; en: string; es: string };
  slug: string;
}

interface Product {
  _id: string;
  name: { fr: string; en: string; es: string };
  description: { fr: string; en: string; es: string };
  slug: string;
  price: number;
  basePrice: number;
  compareAtPrice?: number;
  stock: number;
  category: { _id: string; name: { fr: string; en: string; es: string }; slug: string } | string;
  images: string[];
  isOrganic: boolean;
  isFeatured: boolean;
  isActive: boolean;
  weight?: string;
  ingredients?: { fr: string; en: string; es: string };
  usage?: { fr: string; en: string; es: string };
  traditionalUses?: { fr: string; en: string; es: string };
  dosage?: { fr: string; en: string; es: string };
  seller: { _id: string } | string;
  // Champs médicaux
  therapeuticCategory?: string;
  form?: string;
  indications?: { fr: string[]; en: string[]; es: string[] };
  contraindications?: { fr: string[]; en: string[]; es: string[] };
  activeIngredients?: { fr: string[]; en: string[]; es: string[] };
  preparationMethod?: { fr: string; en: string; es: string };
  origin?: string;
  harvestMethod?: string;
  certifications?: string[];
  warnings?: {
    pregnancy?: boolean;
    breastfeeding?: boolean;
    children?: boolean;
    minAge?: number;
    prescriptionRequired?: boolean;
  };
}

export default function EditProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const productId = params.id as string;
  const t = useTranslations('sellerDashboard');
  const { currency } = useCurrency();
  const currencySymbol = CURRENCY_SYMBOLS[currency];

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'medical'>('general');

  const [formData, setFormData] = useState({
    // Informations générales
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    stock: '',
    category: '',
    images: [] as string[],
    isOrganic: false,
    isFeatured: false,
    isActive: true,
    weight: '',
    weightUnit: 'g',
    ingredients: '',
    usage: '',
    // Informations médicales
    therapeuticCategory: '',
    form: '',
    indications: { fr: [] as string[], en: [] as string[], es: [] as string[] },
    contraindications: { fr: [] as string[], en: [] as string[], es: [] as string[] },
    activeIngredients: { fr: [] as string[], en: [] as string[], es: [] as string[] },
    traditionalUses: { fr: '', en: '', es: '' },
    dosage: { fr: '', en: '', es: '' },
    preparationMethod: { fr: '', en: '', es: '' },
    origin: '',
    harvestMethod: '',
    certifications: [] as string[],
    warnings: {
      pregnancy: false,
      breastfeeding: false,
      children: false,
      minAge: undefined as number | undefined,
      prescriptionRequired: false,
    },
  });

  const labels = {
    fr: {
      tabGeneral: 'Informations générales',
      tabMedical: 'Informations médicales',
      pageTitle: 'Modifier le produit',
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
      isOrganic: 'Produit biologique',
      isFeatured: 'Mettre en avant',
      isActive: 'Produit actif (visible)',
      images: 'Images du produit',
      imagesHelp: 'Ajoutez jusqu\'à 5 images de votre produit. La première image sera l\'image principale.',
      additionalInfo: 'Informations complémentaires',
      ingredients: 'Ingrédients / Composition',
      ingredientsPlaceholder: 'Listez les ingrédients du produit...',
      usage: 'Mode d\'emploi / Conseils d\'utilisation',
      usagePlaceholder: 'Comment utiliser ce produit...',
      saving: 'Enregistrement...',
      saveProduct: 'Enregistrer les modifications',
      cancel: 'Annuler',
      backToProducts: 'Retour aux produits',
      loadError: 'Erreur lors du chargement du produit',
      notFound: 'Produit introuvable',
      unauthorized: 'Vous n\'êtes pas autorisé à modifier ce produit',
      successMessage: 'Produit mis à jour avec succès',
    },
    en: {
      tabGeneral: 'General information',
      tabMedical: 'Medical information',
      pageTitle: 'Edit product',
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
      isOrganic: 'Organic product',
      isFeatured: 'Featured',
      isActive: 'Active product (visible)',
      images: 'Product images',
      imagesHelp: 'Add up to 5 images of your product. The first image will be the main image.',
      additionalInfo: 'Additional information',
      ingredients: 'Ingredients / Composition',
      ingredientsPlaceholder: 'List the product ingredients...',
      usage: 'How to use / Usage instructions',
      usagePlaceholder: 'How to use this product...',
      saving: 'Saving...',
      saveProduct: 'Save changes',
      cancel: 'Cancel',
      backToProducts: 'Back to products',
      loadError: 'Error loading product',
      notFound: 'Product not found',
      unauthorized: 'You are not authorized to edit this product',
      successMessage: 'Product updated successfully',
    },
    es: {
      tabGeneral: 'Información general',
      tabMedical: 'Información médica',
      pageTitle: 'Editar producto',
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
      isOrganic: 'Producto orgánico',
      isFeatured: 'Destacado',
      isActive: 'Producto activo (visible)',
      images: 'Imágenes del producto',
      imagesHelp: 'Agrega hasta 5 imágenes de tu producto. La primera imagen será la imagen principal.',
      additionalInfo: 'Información adicional',
      ingredients: 'Ingredientes / Composición',
      ingredientsPlaceholder: 'Lista los ingredientes del producto...',
      usage: 'Modo de uso / Instrucciones',
      usagePlaceholder: 'Cómo usar este producto...',
      saving: 'Guardando...',
      saveProduct: 'Guardar cambios',
      cancel: 'Cancelar',
      backToProducts: 'Volver a productos',
      loadError: 'Error al cargar el producto',
      notFound: 'Producto no encontrado',
      unauthorized: 'No estás autorizado a editar este producto',
      successMessage: 'Producto actualizado con éxito',
    },
  };

  const l = labels[locale as keyof typeof labels] || labels.fr;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    } else if (status === 'authenticated' && session?.user?.role !== 'seller' && session?.user?.role !== 'admin') {
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
          setError(res.status === 404 ? l.notFound : l.loadError);
          return;
        }

        const data = await res.json();
        const product: Product = data.product;

        const sellerId = typeof product.seller === 'string' ? product.seller : product.seller?._id;
        if (session?.user?.role !== 'admin' && sellerId !== session?.user?.id) {
          setError(l.unauthorized);
          return;
        }

        const rate = CURRENCY_RATES[currency] || 1;
        const priceInCurrency = product.price * rate;
        const compareAtPriceInCurrency = product.compareAtPrice ? product.compareAtPrice * rate : '';
        const categoryId = typeof product.category === 'string' ? product.category : product.category?._id;

        setFormData({
          name: product.name[locale as keyof typeof product.name] || product.name.fr,
          description: product.description[locale as keyof typeof product.description] || product.description.fr,
          price: Math.round(priceInCurrency).toString(),
          compareAtPrice: compareAtPriceInCurrency ? Math.round(Number(compareAtPriceInCurrency)).toString() : '',
          stock: product.stock.toString(),
          category: categoryId || '',
          images: product.images || [],
          isOrganic: product.isOrganic || false,
          isFeatured: product.isFeatured || false,
          isActive: product.isActive !== false,
          weight: product.weight ? product.weight.replace(/[a-zA-Z]+$/, '') : '',
          weightUnit: product.weight ? (product.weight.match(/[a-zA-Z]+$/)?.[0] || 'g') : 'g',
          ingredients: product.ingredients?.[locale as keyof typeof product.ingredients] || product.ingredients?.fr || '',
          usage: product.usage?.[locale as keyof typeof product.usage] || product.usage?.fr || '',
          // Champs médicaux
          therapeuticCategory: product.therapeuticCategory || '',
          form: product.form || '',
          indications: product.indications || { fr: [], en: [], es: [] },
          contraindications: product.contraindications || { fr: [], en: [], es: [] },
          activeIngredients: product.activeIngredients || { fr: [], en: [], es: [] },
          traditionalUses: product.traditionalUses || { fr: '', en: '', es: '' },
          dosage: product.dosage || { fr: '', en: '', es: '' },
          preparationMethod: product.preparationMethod || { fr: '', en: '', es: '' },
          origin: product.origin || '',
          harvestMethod: product.harvestMethod || '',
          certifications: product.certifications || [],
          warnings: {
            pregnancy: product.warnings?.pregnancy || false,
            breastfeeding: product.warnings?.breastfeeding || false,
            children: product.warnings?.children || false,
            minAge: product.warnings?.minAge,
            prescriptionRequired: product.warnings?.prescriptionRequired || false,
          },
        });
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(l.loadError);
      } finally {
        setLoadingProduct(false);
      }
    };

    if (session?.user && productId) {
      fetchProduct();
    }
  }, [session, productId, currency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const name = { fr: formData.name, en: formData.name, es: formData.name };
      const description = { fr: formData.description, en: formData.description, es: formData.description };
      const ingredients = { fr: formData.ingredients, en: formData.ingredients, es: formData.ingredients };
      const usage = { fr: formData.usage, en: formData.usage, es: formData.usage };

      const rate = CURRENCY_RATES[currency] || 1;
      const priceInUSD = parseFloat(formData.price) / rate;
      const compareAtPriceInUSD = formData.compareAtPrice ? parseFloat(formData.compareAtPrice) / rate : undefined;

      const productData: any = {
        name,
        description,
        ingredients,
        usage,
        price: Math.round(priceInUSD * 100) / 100,
        basePrice: Math.round(priceInUSD * 100) / 100,
        compareAtPrice: compareAtPriceInUSD ? Math.round(compareAtPriceInUSD * 100) / 100 : undefined,
        stock: parseInt(formData.stock),
        category: formData.category,
        images: formData.images.filter(img => img.trim() !== ''),
        isOrganic: formData.isOrganic,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        weight: formData.weight ? `${formData.weight}${formData.weightUnit}` : undefined,
        // Champs médicaux
        therapeuticCategory: formData.therapeuticCategory || undefined,
        form: formData.form || undefined,
        indications: formData.indications.fr.length ? formData.indications : undefined,
        contraindications: formData.contraindications.fr.length ? formData.contraindications : undefined,
        activeIngredients: formData.activeIngredients.fr.length ? formData.activeIngredients : undefined,
        traditionalUses: formData.traditionalUses.fr ? formData.traditionalUses : undefined,
        dosage: formData.dosage.fr ? formData.dosage : undefined,
        preparationMethod: formData.preparationMethod.fr ? formData.preparationMethod : undefined,
        origin: formData.origin || undefined,
        harvestMethod: formData.harvestMethod || undefined,
        certifications: formData.certifications.length ? formData.certifications : undefined,
        warnings: formData.warnings,
      };

      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        setSuccess(l.successMessage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const data = await res.json();
        const rawError = data.error || '';
        if (rawError.includes('validation failed')) {
          const fieldErrors = rawError.split(': ').slice(1).join(': ');
          setError(locale === 'fr' ? `Veuillez vérifier les champs du formulaire: ${fieldErrors}` :
                   locale === 'es' ? `Por favor verifique los campos: ${fieldErrors}` :
                   `Please check the form fields: ${fieldErrors}`);
        } else {
          setError(data.error || (locale === 'fr' ? 'Erreur lors de la mise à jour du produit' :
                                  locale === 'es' ? 'Error al actualizar el producto' :
                                  'Error updating product'));
        }
      }
    } catch (error) {
      setError(locale === 'fr' ? 'Erreur lors de la mise à jour du produit' :
               locale === 'es' ? 'Error al actualizar el producto' :
               'Error updating product');
    } finally {
      setLoading(false);
    }
  };

  const handleImagesChange = (urls: string[]) => {
    setFormData(prev => ({ ...prev, images: urls }));
  };

  if (status === 'loading' || loadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
          <Link href={`/${locale}/seller/products`} className="text-green-600 hover:text-green-700 inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {l.backToProducts}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/${locale}/seller/products`} className="text-green-600 hover:text-green-700 inline-flex items-center gap-2 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {l.backToProducts}
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{l.pageTitle}</h1>
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{success}</div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'general'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {l.tabGeneral}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('medical')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'medical'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {l.tabMedical}
              {formData.therapeuticCategory && (
                <span className="ml-1 w-2 h-2 bg-green-500 rounded-full inline-block" />
              )}
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── ONGLET 1 : Informations générales ── */}
          <div className={activeTab === 'general' ? 'block' : 'hidden'}>
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">{l.basicInfo}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{l.name} *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{l.category} *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{l.description} *</label>
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
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">{l.pricingStock}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{l.price} ({currencySymbol}) *</label>
                  <input type="number" step="0.01" min="0" value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{l.compareAtPrice}</label>
                  <input type="number" step="0.01" min="0" value={formData.compareAtPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, compareAtPrice: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{l.stock} *</label>
                  <input type="number" min="0" value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{l.weight}</label>
                <div className="flex gap-2">
                  <input type="number" min="0" step="any" value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="250"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  <select value={formData.weightUnit}
                    onChange={(e) => setFormData(prev => ({ ...prev, weightUnit: e.target.value }))}
                    className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white">
                    <option value="mg">mg</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="cl">cl</option>
                    <option value="L">L</option>
                    <option value="oz">oz</option>
                    <option value="lb">lb</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex gap-6 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isOrganic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isOrganic: e.target.checked }))}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                  <span className="text-sm text-gray-700">{l.isOrganic}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                  <span className="text-sm text-gray-700">{l.isFeatured}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                  <span className="text-sm text-gray-700">{l.isActive}</span>
                </label>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{l.images}</h2>
              <p className="text-sm text-gray-500 mb-4">{l.imagesHelp}</p>
              <ImageUpload value={formData.images} onChange={handleImagesChange}
                maxImages={5} folder="nature-pharmacy/products" disabled={loading} />
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">{l.additionalInfo}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{l.ingredients}</label>
                  <textarea value={formData.ingredients}
                    onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                    rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={l.ingredientsPlaceholder} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{l.usage}</label>
                  <textarea value={formData.usage}
                    onChange={(e) => setFormData(prev => ({ ...prev, usage: e.target.value }))}
                    rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={l.usagePlaceholder} />
                </div>
              </div>
            </div>
          </div>

          {/* ── ONGLET 2 : Informations médicales ── */}
          <div className={activeTab === 'medical' ? 'block' : 'hidden'}>
            <MedicalFieldsForm formData={formData} setFormData={setFormData} />
          </div>

          {/* Submit — toujours visible */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? l.saving : l.saveProduct}
            </button>
            <Link href={`/${locale}/seller/products`}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-center">
              {l.cancel}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
