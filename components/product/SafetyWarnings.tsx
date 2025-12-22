'use client';

import { useLocale } from 'next-intl';

interface SafetyWarningsProps {
  warnings?: {
    pregnancy?: boolean;
    breastfeeding?: boolean;
    children?: boolean;
    minAge?: number;
    prescriptionRequired?: boolean;
  };
}

export default function SafetyWarnings({ warnings }: SafetyWarningsProps) {
  const locale = useLocale() as 'fr' | 'en' | 'es';

  if (!warnings) return null;

  const hasWarnings =
    warnings.pregnancy ||
    warnings.breastfeeding ||
    warnings.children ||
    warnings.minAge ||
    warnings.prescriptionRequired;

  if (!hasWarnings) return null;

  const warningTexts = {
    fr: {
      pregnancy: 'Déconseillé pendant la grossesse',
      breastfeeding: 'Déconseillé pendant l\'allaitement',
      children: 'Déconseillé aux enfants',
      minAge: 'Âge minimum',
      prescriptionRequired: 'Prescription médicale requise',
      title: 'Avertissements de Sécurité',
    },
    en: {
      pregnancy: 'Not recommended during pregnancy',
      breastfeeding: 'Not recommended during breastfeeding',
      children: 'Not recommended for children',
      minAge: 'Minimum age',
      prescriptionRequired: 'Medical prescription required',
      title: 'Safety Warnings',
    },
    es: {
      pregnancy: 'No recomendado durante el embarazo',
      breastfeeding: 'No recomendado durante la lactancia',
      children: 'No recomendado para niños',
      minAge: 'Edad mínima',
      prescriptionRequired: 'Receta médica requerida',
      title: 'Advertencias de Seguridad',
    },
  };

  const t = warningTexts[locale];

  return (
    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-yellow-900 mb-3">{t.title}</h3>
          <ul className="space-y-2">
            {warnings.pregnancy && (
              <li className="flex items-center gap-2 text-yellow-900">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{t.pregnancy}</span>
              </li>
            )}
            {warnings.breastfeeding && (
              <li className="flex items-center gap-2 text-yellow-900">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{t.breastfeeding}</span>
              </li>
            )}
            {warnings.children && (
              <li className="flex items-center gap-2 text-yellow-900">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{t.children}</span>
              </li>
            )}
            {warnings.minAge && (
              <li className="flex items-center gap-2 text-yellow-900">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">
                  {t.minAge}: {warnings.minAge} {locale === 'fr' ? 'ans' : locale === 'en' ? 'years' : 'años'}
                </span>
              </li>
            )}
            {warnings.prescriptionRequired && (
              <li className="flex items-center gap-2 text-red-800 bg-red-100 p-2 rounded border border-red-300">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-bold">{t.prescriptionRequired}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
