'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import {
  THERAPEUTIC_CATEGORIES,
  THERAPEUTIC_CATEGORY_NAMES,
  PRODUCT_FORMS,
  PRODUCT_FORM_NAMES,
  CERTIFICATIONS,
  CERTIFICATION_NAMES,
  COMMON_INDICATIONS,
} from '@/lib/medical-constants';

interface MedicalFieldsFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function MedicalFieldsForm({ formData, setFormData }: MedicalFieldsFormProps) {
  const locale = useLocale() as 'fr' | 'en' | 'es';
  const [indicationInput, setIndicationInput] = useState({ fr: '', en: '', es: '' });
  const [contraIndicationInput, setContraIndicationInput] = useState({ fr: '', en: '', es: '' });
  const [activeIngredientInput, setActiveIngredientInput] = useState({ fr: '', en: '', es: '' });

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (field: string, lang: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const addToArray = (
    field: 'indications' | 'contraindications' | 'activeIngredients',
    input: { fr: string; en: string; es: string },
    setInput: React.Dispatch<React.SetStateAction<{ fr: string; en: string; es: string }>>
  ) => {
    if (input.fr.trim() && input.en.trim() && input.es.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        [field]: {
          fr: [...(prev[field]?.fr || []), input.fr.trim()],
          en: [...(prev[field]?.en || []), input.en.trim()],
          es: [...(prev[field]?.es || []), input.es.trim()],
        },
      }));
      setInput({ fr: '', en: '', es: '' });
    }
  };

  const removeFromArray = (
    field: 'indications' | 'contraindications' | 'activeIngredients',
    index: number
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: {
        fr: prev[field]?.fr?.filter((_: any, i: number) => i !== index) || [],
        en: prev[field]?.en?.filter((_: any, i: number) => i !== index) || [],
        es: prev[field]?.es?.filter((_: any, i: number) => i !== index) || [],
      },
    }));
  };

  const toggleCertification = (cert: string) => {
    const certifications = formData.certifications || [];
    if (certifications.includes(cert)) {
      handleChange('certifications', certifications.filter((c: string) => c !== cert));
    } else {
      handleChange('certifications', [...certifications, cert]);
    }
  };

  return (
    <div className="space-y-8 bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-300">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-2xl">🏥</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Informations Médicales Traditionnelles
          </h2>
          <p className="text-sm text-gray-600">
            Ces informations aident les clients à trouver le bon remède
          </p>
        </div>
      </div>

      {/* Catégorie Thérapeutique */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Catégorie Thérapeutique
        </label>
        <select
          value={formData.therapeuticCategory || ''}
          onChange={(e) => handleChange('therapeuticCategory', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
        >
          <option value="">Sélectionner une catégorie</option>
          {Object.entries(THERAPEUTIC_CATEGORY_NAMES).map(([key, names]) => (
            <option key={key} value={key}>
              {names[locale]}
            </option>
          ))}
        </select>
      </div>

      {/* Forme du Produit */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Forme du Produit *
        </label>
        <select
          value={formData.form || ''}
          onChange={(e) => handleChange('form', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
        >
          <option value="">Sélectionner une forme</option>
          {Object.entries(PRODUCT_FORM_NAMES).map(([key, names]) => (
            <option key={key} value={key}>
              {names[locale]}
            </option>
          ))}
        </select>
      </div>

      {/* Indications Thérapeutiques */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Indications Thérapeutiques
          <span className="text-xs font-normal text-gray-600 ml-2">
            (Pour quels problèmes de santé?)
          </span>
        </label>
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Français"
              value={indicationInput.fr}
              onChange={(e) => setIndicationInput({ ...indicationInput, fr: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="text"
              placeholder="English"
              value={indicationInput.en}
              onChange={(e) => setIndicationInput({ ...indicationInput, en: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="text"
              placeholder="Español"
              value={indicationInput.es}
              onChange={(e) => setIndicationInput({ ...indicationInput, es: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => addToArray('indications', indicationInput, setIndicationInput)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            + Ajouter indication
          </button>
        </div>
        <div className="mt-3 space-y-1">
          {formData.indications?.fr?.map((indication: string, index: number) => (
            <div key={index} className="flex items-center justify-between bg-white px-3 py-2 rounded border">
              <span className="text-sm text-gray-900">{indication}</span>
              <button
                type="button"
                onClick={() => removeFromArray('indications', index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Utilisation Traditionnelle */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Utilisation Traditionnelle
        </label>
        <div className="space-y-2">
          <textarea
            placeholder="Français"
            value={formData.traditionalUses?.fr || ''}
            onChange={(e) => handleNestedChange('traditionalUses', 'fr', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
          <textarea
            placeholder="English"
            value={formData.traditionalUses?.en || ''}
            onChange={(e) => handleNestedChange('traditionalUses', 'en', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
          <textarea
            placeholder="Español"
            value={formData.traditionalUses?.es || ''}
            onChange={(e) => handleNestedChange('traditionalUses', 'es', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
        </div>
      </div>

      {/* Posologie */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Posologie Recommandée
        </label>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Français (ex: 1 cuillère à café 2 fois par jour)"
            value={formData.dosage?.fr || ''}
            onChange={(e) => handleNestedChange('dosage', 'fr', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
          <input
            type="text"
            placeholder="English"
            value={formData.dosage?.en || ''}
            onChange={(e) => handleNestedChange('dosage', 'en', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
          <input
            type="text"
            placeholder="Español"
            value={formData.dosage?.es || ''}
            onChange={(e) => handleNestedChange('dosage', 'es', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
        </div>
      </div>

      {/* Méthode de Préparation */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Méthode de Préparation
        </label>
        <div className="space-y-2">
          <textarea
            placeholder="Français (ex: Faire bouillir dans 1L d'eau pendant 10 minutes)"
            value={formData.preparationMethod?.fr || ''}
            onChange={(e) => handleNestedChange('preparationMethod', 'fr', e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
          <textarea
            placeholder="English"
            value={formData.preparationMethod?.en || ''}
            onChange={(e) => handleNestedChange('preparationMethod', 'en', e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
          <textarea
            placeholder="Español"
            value={formData.preparationMethod?.es || ''}
            onChange={(e) => handleNestedChange('preparationMethod', 'es', e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
        </div>
      </div>

      {/* Contre-indications */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2 text-red-700">
          ⚠️ Contre-indications
        </label>
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Français"
              value={contraIndicationInput.fr}
              onChange={(e) => setContraIndicationInput({ ...contraIndicationInput, fr: e.target.value })}
              className="px-3 py-2 border border-red-300 rounded-lg text-sm"
            />
            <input
              type="text"
              placeholder="English"
              value={contraIndicationInput.en}
              onChange={(e) => setContraIndicationInput({ ...contraIndicationInput, en: e.target.value })}
              className="px-3 py-2 border border-red-300 rounded-lg text-sm"
            />
            <input
              type="text"
              placeholder="Español"
              value={contraIndicationInput.es}
              onChange={(e) => setContraIndicationInput({ ...contraIndicationInput, es: e.target.value })}
              className="px-3 py-2 border border-red-300 rounded-lg text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => addToArray('contraindications', contraIndicationInput, setContraIndicationInput)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            + Ajouter contre-indication
          </button>
        </div>
        <div className="mt-3 space-y-1">
          {formData.contraindications?.fr?.map((contra: string, index: number) => (
            <div key={index} className="flex items-center justify-between bg-red-50 px-3 py-2 rounded border border-red-200">
              <span className="text-sm text-gray-900">{contra}</span>
              <button
                type="button"
                onClick={() => removeFromArray('contraindications', index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Origine et Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Origine (Pays/Région)
          </label>
          <input
            type="text"
            placeholder="ex: Provence, France"
            value={formData.origin || ''}
            onChange={(e) => handleChange('origin', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Méthode de Récolte
          </label>
          <input
            type="text"
            placeholder="ex: Récolte sauvage traditionnelle"
            value={formData.harvestMethod || ''}
            onChange={(e) => handleChange('harvestMethod', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
        </div>
      </div>

      {/* Certifications */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          Certifications
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(CERTIFICATION_NAMES).map(([key, names]) => (
            <label
              key={key}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                formData.certifications?.includes(key)
                  ? 'bg-green-100 border-green-500'
                  : 'bg-white border-gray-300 hover:border-green-300'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.certifications?.includes(key) || false}
                onChange={() => toggleCertification(key)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-900">{names[locale]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Avertissements de Sécurité */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          ⚠️ Avertissements de Sécurité
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.warnings?.pregnancy || false}
              onChange={(e) =>
                handleChange('warnings', { ...formData.warnings, pregnancy: e.target.checked })
              }
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-900">Déconseillé pendant la grossesse</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.warnings?.breastfeeding || false}
              onChange={(e) =>
                handleChange('warnings', { ...formData.warnings, breastfeeding: e.target.checked })
              }
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-900">Déconseillé pendant l'allaitement</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.warnings?.children || false}
              onChange={(e) =>
                handleChange('warnings', { ...formData.warnings, children: e.target.checked })
              }
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-900">Déconseillé aux enfants</span>
          </label>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Âge minimum</label>
            <input
              type="number"
              min="0"
              placeholder="ex: 12 (ans)"
              value={formData.warnings?.minAge || ''}
              onChange={(e) =>
                handleChange('warnings', {
                  ...formData.warnings,
                  minAge: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.warnings?.prescriptionRequired || false}
              onChange={(e) =>
                handleChange('warnings', {
                  ...formData.warnings,
                  prescriptionRequired: e.target.checked,
                })
              }
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-900 font-semibold">
              Prescription médicale requise
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
