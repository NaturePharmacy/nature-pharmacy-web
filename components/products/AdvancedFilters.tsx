'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import {
  THERAPEUTIC_CATEGORY_NAMES,
  PRODUCT_FORM_NAMES,
  COMMON_INDICATIONS,
} from '@/lib/medical-constants';

interface AdvancedFiltersProps {
  filters: {
    therapeuticCategory: string;
    form: string;
    indication: string;
    certifications: string[];
    safePregnancy: boolean;
    safeChildren: boolean;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
}

export default function AdvancedFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: AdvancedFiltersProps) {
  const locale = useLocale() as 'fr' | 'en' | 'es';
  const [isOpen, setIsOpen] = useState(false);

  const labels = {
    fr: {
      title: 'Filtres Avancés',
      subtitle: 'Trouvez le remède adapté à vos besoins',
      therapeuticCategory: 'Catégorie Thérapeutique',
      allCategories: 'Toutes catégories',
      form: 'Forme du Produit',
      allForms: 'Toutes formes',
      indication: 'Rechercher par Indication',
      selectIndication: 'Sélectionner une indication',
      safety: 'Sécurité',
      safePregnancy: 'Adapté grossesse',
      safeChildren: 'Adapté enfants',
      certifications: 'Certifications',
      organic: 'Bio',
      traditional: 'Traditionnel',
      fairTrade: 'Commerce équitable',
      clearAll: 'Effacer tout',
      apply: 'Appliquer',
      results: 'résultats',
    },
    en: {
      title: 'Advanced Filters',
      subtitle: 'Find the right remedy for your needs',
      therapeuticCategory: 'Therapeutic Category',
      allCategories: 'All categories',
      form: 'Product Form',
      allForms: 'All forms',
      indication: 'Search by Indication',
      selectIndication: 'Select an indication',
      safety: 'Safety',
      safePregnancy: 'Pregnancy safe',
      safeChildren: 'Child safe',
      certifications: 'Certifications',
      organic: 'Organic',
      traditional: 'Traditional',
      fairTrade: 'Fair trade',
      clearAll: 'Clear all',
      apply: 'Apply',
      results: 'results',
    },
    es: {
      title: 'Filtros Avanzados',
      subtitle: 'Encuentre el remedio adecuado para sus necesidades',
      therapeuticCategory: 'Categoría Terapéutica',
      allCategories: 'Todas categorías',
      form: 'Forma del Producto',
      allForms: 'Todas formas',
      indication: 'Buscar por Indicación',
      selectIndication: 'Seleccionar una indicación',
      safety: 'Seguridad',
      safePregnancy: 'Seguro embarazo',
      safeChildren: 'Seguro niños',
      certifications: 'Certificaciones',
      organic: 'Orgánico',
      traditional: 'Tradicional',
      fairTrade: 'Comercio justo',
      clearAll: 'Limpiar todo',
      apply: 'Aplicar',
      results: 'resultados',
    },
  };

  const t = labels[locale];

  const handleCheckboxChange = (field: string, value: boolean) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleSelectChange = (field: string, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const activeFiltersCount =
    (filters.therapeuticCategory ? 1 : 0) +
    (filters.form ? 1 : 0) +
    (filters.indication ? 1 : 0) +
    filters.certifications.length +
    (filters.safePregnancy ? 1 : 0) +
    (filters.safeChildren ? 1 : 0);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-gray-900">{t.title}</h2>
            <p className="text-xs text-gray-600">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
          <svg
            className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Filters Content */}
      {isOpen && (
        <div className="border-t border-gray-200 p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Therapeutic Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                {t.therapeuticCategory}
              </label>
              <select
                value={filters.therapeuticCategory}
                onChange={(e) => handleSelectChange('therapeuticCategory', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
              >
                <option value="">{t.allCategories}</option>
                {Object.entries(THERAPEUTIC_CATEGORY_NAMES).map(([key, names]) => (
                  <option key={key} value={key}>
                    {names[locale]}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Form */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">{t.form}</label>
              <select
                value={filters.form}
                onChange={(e) => handleSelectChange('form', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
              >
                <option value="">{t.allForms}</option>
                {Object.entries(PRODUCT_FORM_NAMES).map(([key, names]) => (
                  <option key={key} value={key}>
                    {names[locale]}
                  </option>
                ))}
              </select>
            </div>

            {/* Indication */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                {t.indication}
              </label>
              <select
                value={filters.indication}
                onChange={(e) => handleSelectChange('indication', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
              >
                <option value="">{t.selectIndication}</option>
                {Object.entries(COMMON_INDICATIONS).map(([key, names]) => (
                  <option key={key} value={names[locale]}>
                    {names[locale]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Safety Filters */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              {t.safety}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.safePregnancy}
                  onChange={(e) => handleCheckboxChange('safePregnancy', e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-900">{t.safePregnancy}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.safeChildren}
                  onChange={(e) => handleCheckboxChange('safeChildren', e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-900">{t.safeChildren}</span>
              </label>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              {t.certifications}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.certifications.includes('organic')}
                  onChange={(e) => {
                    const newCerts = e.target.checked
                      ? [...filters.certifications, 'organic']
                      : filters.certifications.filter((c) => c !== 'organic');
                    onFilterChange({ ...filters, certifications: newCerts });
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900">🌱 {t.organic}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.certifications.includes('traditional')}
                  onChange={(e) => {
                    const newCerts = e.target.checked
                      ? [...filters.certifications, 'traditional']
                      : filters.certifications.filter((c) => c !== 'traditional');
                    onFilterChange({ ...filters, certifications: newCerts });
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900">🏺 {t.traditional}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.certifications.includes('fair_trade')}
                  onChange={(e) => {
                    const newCerts = e.target.checked
                      ? [...filters.certifications, 'fair_trade']
                      : filters.certifications.filter((c) => c !== 'fair_trade');
                    onFilterChange({ ...filters, certifications: newCerts });
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900">🤝 {t.fairTrade}</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={onClearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t.clearAll}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors shadow-md"
            >
              {t.apply}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
