'use client';

import { useLocale } from 'next-intl';
import {
  THERAPEUTIC_CATEGORY_NAMES,
  PRODUCT_FORM_NAMES,
} from '@/lib/medical-constants';
import CertificationBadges from './CertificationBadges';
import SafetyWarnings from './SafetyWarnings';

interface MedicalInformationProps {
  product: {
    therapeuticCategory?: string;
    form?: string;
    indications?: {
      fr: string[];
      en: string[];
      es: string[];
    };
    traditionalUses?: {
      fr: string;
      en: string;
      es: string;
    };
    contraindications?: {
      fr: string[];
      en: string[];
      es: string[];
    };
    dosage?: {
      fr: string;
      en: string;
      es: string;
    };
    preparationMethod?: {
      fr: string;
      en: string;
      es: string;
    };
    activeIngredients?: {
      fr: string[];
      en: string[];
      es: string[];
    };
    origin?: string;
    harvestMethod?: string;
    certifications?: string[];
    concentration?: string;
    warnings?: {
      pregnancy?: boolean;
      breastfeeding?: boolean;
      children?: boolean;
      minAge?: number;
      prescriptionRequired?: boolean;
    };
  };
}

export default function MedicalInformation({ product }: MedicalInformationProps) {
  const locale = useLocale() as 'fr' | 'en' | 'es';

  const labels = {
    fr: {
      title: 'Informations Thérapeutiques',
      therapeuticCategory: 'Catégorie Thérapeutique',
      form: 'Forme',
      indications: 'Indications Thérapeutiques',
      traditionalUses: 'Utilisation Traditionnelle',
      dosage: 'Posologie Recommandée',
      preparation: 'Méthode de Préparation',
      activeIngredients: 'Principes Actifs',
      contraindications: 'Contre-indications',
      origin: 'Origine',
      harvestMethod: 'Méthode de Récolte',
      concentration: 'Concentration',
      certifications: 'Certifications',
      disclaimer: 'Ces informations sont fournies à titre informatif uniquement et ne remplacent pas un avis médical professionnel.',
    },
    en: {
      title: 'Therapeutic Information',
      therapeuticCategory: 'Therapeutic Category',
      form: 'Form',
      indications: 'Therapeutic Indications',
      traditionalUses: 'Traditional Uses',
      dosage: 'Recommended Dosage',
      preparation: 'Preparation Method',
      activeIngredients: 'Active Ingredients',
      contraindications: 'Contraindications',
      origin: 'Origin',
      harvestMethod: 'Harvest Method',
      concentration: 'Concentration',
      certifications: 'Certifications',
      disclaimer: 'This information is provided for informational purposes only and does not replace professional medical advice.',
    },
    es: {
      title: 'Información Terapéutica',
      therapeuticCategory: 'Categoría Terapéutica',
      form: 'Forma',
      indications: 'Indicaciones Terapéuticas',
      traditionalUses: 'Usos Tradicionales',
      dosage: 'Posología Recomendada',
      preparation: 'Método de Preparación',
      activeIngredients: 'Ingredientes Activos',
      contraindications: 'Contraindicaciones',
      origin: 'Origen',
      harvestMethod: 'Método de Cosecha',
      concentration: 'Concentración',
      certifications: 'Certificaciones',
      disclaimer: 'Esta información se proporciona únicamente con fines informativos y no reemplaza el consejo médico profesional.',
    },
  };

  const t = labels[locale];

  // Check if there's any medical information to display
  const hasMedicalInfo =
    product.therapeuticCategory ||
    product.form ||
    product.indications?.[locale]?.length ||
    product.traditionalUses?.[locale] ||
    product.dosage?.[locale] ||
    product.preparationMethod?.[locale] ||
    product.activeIngredients?.[locale]?.length ||
    product.contraindications?.[locale]?.length ||
    product.origin ||
    product.harvestMethod ||
    product.certifications?.length ||
    product.concentration;

  if (!hasMedicalInfo && !product.warnings) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b-2 border-green-300">
        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-2xl">🏥</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t.title}</h2>
      </div>

      {/* Safety Warnings - Priority Display */}
      {product.warnings && (
        <div className="mb-6">
          <SafetyWarnings warnings={product.warnings} />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Therapeutic Category */}
        {product.therapeuticCategory && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <span className="text-green-600">📋</span>
              {t.therapeuticCategory}
            </h3>
            <p className="text-gray-900 font-medium">
              {THERAPEUTIC_CATEGORY_NAMES[product.therapeuticCategory as keyof typeof THERAPEUTIC_CATEGORY_NAMES]?.[locale] ||
                product.therapeuticCategory}
            </p>
          </div>
        )}

        {/* Form */}
        {product.form && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <span className="text-blue-600">💊</span>
              {t.form}
            </h3>
            <p className="text-gray-900 font-medium">
              {PRODUCT_FORM_NAMES[product.form as keyof typeof PRODUCT_FORM_NAMES]?.[locale] || product.form}
            </p>
          </div>
        )}

        {/* Origin */}
        {product.origin && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-200">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <span className="text-amber-600">🌍</span>
              {t.origin}
            </h3>
            <p className="text-gray-900 font-medium">{product.origin}</p>
          </div>
        )}

        {/* Harvest Method */}
        {product.harvestMethod && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-emerald-200">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <span className="text-emerald-600">🌾</span>
              {t.harvestMethod}
            </h3>
            <p className="text-gray-900 font-medium">{product.harvestMethod}</p>
          </div>
        )}

        {/* Concentration */}
        {product.concentration && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-200 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <span className="text-purple-600">⚗️</span>
              {t.concentration}
            </h3>
            <p className="text-gray-900 font-medium">{product.concentration}</p>
          </div>
        )}
      </div>

      {/* Certifications */}
      {product.certifications && product.certifications.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-indigo-200">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
            <span className="text-indigo-600">✓</span>
            {t.certifications}
          </h3>
          <CertificationBadges certifications={product.certifications} />
        </div>
      )}

      {/* Indications */}
      {product.indications?.[locale] && product.indications[locale].length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-green-600">✅</span>
            {t.indications}
          </h3>
          <ul className="space-y-2">
            {product.indications[locale].map((indication, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-800">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{indication}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Traditional Uses */}
      {product.traditionalUses?.[locale] && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 shadow-sm border-l-4 border-amber-500">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-amber-600">🌿</span>
            {t.traditionalUses}
          </h3>
          <p className="text-gray-800 leading-relaxed">{product.traditionalUses[locale]}</p>
        </div>
      )}

      {/* Active Ingredients */}
      {product.activeIngredients?.[locale] && product.activeIngredients[locale].length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-purple-600">⚗️</span>
            {t.activeIngredients}
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.activeIngredients[locale].map((ingredient, index) => (
              <span
                key={index}
                className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dosage */}
      {product.dosage?.[locale] && (
        <div className="bg-blue-50 rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-blue-600">💊</span>
            {t.dosage}
          </h3>
          <p className="text-gray-800 font-medium">{product.dosage[locale]}</p>
        </div>
      )}

      {/* Preparation Method */}
      {product.preparationMethod?.[locale] && (
        <div className="bg-indigo-50 rounded-lg p-4 shadow-sm border-l-4 border-indigo-500">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-indigo-600">🔥</span>
            {t.preparation}
          </h3>
          <p className="text-gray-800 leading-relaxed">{product.preparationMethod[locale]}</p>
        </div>
      )}

      {/* Contraindications */}
      {product.contraindications?.[locale] && product.contraindications[locale].length > 0 && (
        <div className="bg-red-50 rounded-lg p-4 shadow-sm border-2 border-red-300">
          <h3 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
            <span className="text-red-600">⚠️</span>
            {t.contraindications}
          </h3>
          <ul className="space-y-2">
            {product.contraindications[locale].map((contra, index) => (
              <li key={index} className="flex items-start gap-2 text-red-800">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{contra}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-gray-100 border-l-4 border-gray-400 p-4 rounded">
        <p className="text-xs text-gray-700 leading-relaxed flex items-start gap-2">
          <svg className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            <strong>⚖️ Mention légale :</strong> {t.disclaimer}
          </span>
        </p>
      </div>
    </div>
  );
}
