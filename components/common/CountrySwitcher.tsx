'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useUserCountry } from '@/hooks/useUserCountry';
import { COUNTRY_TO_CURRENCY } from '@/lib/currency';

const COUNTRY_NAMES = {
  SN: { fr: 'Sénégal', en: 'Senegal', es: 'Senegal', flag: '🇸🇳' },
  CI: { fr: 'Côte d\'Ivoire', en: 'Ivory Coast', es: 'Costa de Marfil', flag: '🇨🇮' },
  ML: { fr: 'Mali', en: 'Mali', es: 'Malí', flag: '🇲🇱' },
  BF: { fr: 'Burkina Faso', en: 'Burkina Faso', es: 'Burkina Faso', flag: '🇧🇫' },
  FR: { fr: 'France', en: 'France', es: 'Francia', flag: '🇫🇷' },
  US: { fr: 'États-Unis', en: 'United States', es: 'Estados Unidos', flag: '🇺🇸' },
};

const CURRENCY_NAMES = {
  XOF: { fr: 'Franc CFA (FCFA)', en: 'CFA Franc (FCFA)', es: 'Franco CFA (FCFA)' },
  EUR: { fr: 'Euro (€)', en: 'Euro (€)', es: 'Euro (€)' },
  USD: { fr: 'Dollar US ($)', en: 'US Dollar ($)', es: 'Dólar US ($)' },
};

export default function CountrySwitcher() {
  const locale = useLocale() as 'fr' | 'en' | 'es';
  const { country, countryName, setUserCountry } = useUserCountry(locale);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCountry = COUNTRY_NAMES[country as keyof typeof COUNTRY_NAMES];
  const currentCurrency = COUNTRY_TO_CURRENCY[country as keyof typeof COUNTRY_TO_CURRENCY] || 'XOF';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountryChange = (countryCode: string) => {
    setUserCountry(countryCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
        aria-label="Changer de pays"
      >
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <div className="text-left hidden lg:block">
          <p className="text-xs text-gray-600">
            {locale === 'fr' ? 'Livrer à' : locale === 'en' ? 'Deliver to' : 'Entregar a'}
          </p>
          <p className="font-semibold text-gray-900 flex items-center gap-1">
            <span>{currentCountry?.flag}</span>
            <span>{countryName}</span>
          </p>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900">
              {locale === 'fr' ? 'Choisissez votre pays' : locale === 'en' ? 'Choose your country' : 'Elige tu país'}
            </p>
            <p className="text-xs text-gray-600">
              {locale === 'fr' ? 'Les prix seront affichés dans la devise locale' : locale === 'en' ? 'Prices will be displayed in local currency' : 'Los precios se mostrarán en moneda local'}
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {Object.entries(COUNTRY_NAMES).map(([code, data]) => {
              const currency = COUNTRY_TO_CURRENCY[code as keyof typeof COUNTRY_TO_CURRENCY];
              const currencyName = CURRENCY_NAMES[currency as keyof typeof CURRENCY_NAMES]?.[locale];
              const isSelected = code === country;

              return (
                <button
                  key={code}
                  onClick={() => handleCountryChange(code)}
                  className={`w-full px-4 py-3 text-left hover:bg-green-50 transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-green-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{data.flag}</span>
                    <div>
                      <p className={`text-sm font-medium ${isSelected ? 'text-green-600' : 'text-gray-900'}`}>
                        {data[locale]}
                      </p>
                      <p className="text-xs text-gray-600">{currencyName}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
