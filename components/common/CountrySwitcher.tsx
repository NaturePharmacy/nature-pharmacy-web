'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useUserCountry } from '@/hooks/useUserCountry';
import { ALL_COUNTRIES, POPULAR_COUNTRIES, REGION_NAMES, getCountriesByRegion } from '@/lib/countries';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getCurrencyForCountry } from '@/lib/currency';

const CURRENCY_NAMES = {
  XOF: { fr: 'Franc CFA (FCFA)', en: 'CFA Franc (FCFA)', es: 'Franco CFA (FCFA)' },
  EUR: { fr: 'Euro (€)', en: 'Euro (€)', es: 'Euro (€)' },
  USD: { fr: 'Dollar US ($)', en: 'US Dollar ($)', es: 'Dólar US ($)' },
};

export default function CountrySwitcher() {
  const locale = useLocale() as 'fr' | 'en' | 'es';
  const { country, countryName, setUserCountry } = useUserCountry(locale);
  const { setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCountry = ALL_COUNTRIES[country as keyof typeof ALL_COUNTRIES];
  const currentCurrency = currentCountry?.currency || 'XOF';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountryChange = (countryCode: string) => {
    setUserCountry(countryCode);
    // Also update the currency context based on the new country
    const newCurrency = getCurrencyForCountry(countryCode);
    setCurrency(newCurrency);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Filter countries based on search query
  const getFilteredCountries = () => {
    if (!searchQuery) {
      return ALL_COUNTRIES;
    }

    const query = searchQuery.toLowerCase();
    const filtered: Record<string, typeof ALL_COUNTRIES[string]> = {};

    Object.entries(ALL_COUNTRIES).forEach(([code, data]) => {
      const countryName = data[locale].toLowerCase();
      if (countryName.includes(query) || code.toLowerCase().includes(query)) {
        filtered[code] = data;
      }
    });

    return filtered;
  };

  const filteredCountries = getFilteredCountries();
  const countriesByRegion = getCountriesByRegion();
  const popularCountries = POPULAR_COUNTRIES.map(code => ({ code, ...ALL_COUNTRIES[code] })).filter(Boolean);

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
        <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
          {/* Header with search */}
          <div className="px-4 py-3 border-b border-gray-200 space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {locale === 'fr' ? 'Choisissez votre pays' : locale === 'en' ? 'Choose your country' : 'Elige tu país'}
              </p>
              <p className="text-xs text-gray-600">
                {locale === 'fr' ? 'Les prix seront affichés dans la devise locale' : locale === 'en' ? 'Prices will be displayed in local currency' : 'Los precios se mostrarán en moneda local'}
              </p>
            </div>

            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === 'fr' ? 'Rechercher un pays...' : locale === 'en' ? 'Search for a country...' : 'Buscar un país...'}
                className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Countries list */}
          <div className="overflow-y-auto flex-1">
            {!searchQuery ? (
              <>
                {/* Popular Countries */}
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {locale === 'fr' ? 'Pays Populaires' : locale === 'en' ? 'Popular Countries' : 'Países Populares'}
                  </p>
                  {popularCountries.map((item) => {
                    const { code, ...data } = item;
                    if (!data) return null;
                    const currency = data.currency;
                    const currencyName = CURRENCY_NAMES[currency as keyof typeof CURRENCY_NAMES]?.[locale];
                    const isSelected = code === country;

                    return (
                      <button
                        key={code}
                        onClick={() => handleCountryChange(code)}
                        className={`w-full px-3 py-2.5 text-left hover:bg-green-50 transition-colors flex items-center justify-between rounded-md ${
                          isSelected ? 'bg-green-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{data.flag}</span>
                          <div>
                            <p className={`text-sm font-medium ${isSelected ? 'text-green-600' : 'text-gray-900'}`}>
                              {data[locale]}
                            </p>
                            <p className="text-xs text-gray-500">{currencyName}</p>
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

                {/* All countries by region */}
                {Object.entries(countriesByRegion).map(([region, countries]) => {
                  if (Object.keys(countries).length === 0) return null;

                  return (
                    <div key={region} className="px-4 py-2 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        {REGION_NAMES[region as keyof typeof REGION_NAMES][locale]}
                      </p>
                      {Object.entries(countries).map(([code, data]) => {
                        const currency = data.currency;
                        const currencyName = CURRENCY_NAMES[currency as keyof typeof CURRENCY_NAMES]?.[locale];
                        const isSelected = code === country;

                        return (
                          <button
                            key={code}
                            onClick={() => handleCountryChange(code)}
                            className={`w-full px-3 py-2.5 text-left hover:bg-green-50 transition-colors flex items-center justify-between rounded-md ${
                              isSelected ? 'bg-green-50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{data.flag}</span>
                              <div>
                                <p className={`text-sm font-medium ${isSelected ? 'text-green-600' : 'text-gray-900'}`}>
                                  {data[locale]}
                                </p>
                                <p className="text-xs text-gray-500">{currencyName}</p>
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
                  );
                })}
              </>
            ) : (
              /* Filtered search results */
              <div className="px-4 py-2">
                {Object.keys(filteredCountries).length > 0 ? (
                  Object.entries(filteredCountries).map(([code, data]) => {
                    const currency = data.currency;
                    const currencyName = CURRENCY_NAMES[currency as keyof typeof CURRENCY_NAMES]?.[locale];
                    const isSelected = code === country;

                    return (
                      <button
                        key={code}
                        onClick={() => handleCountryChange(code)}
                        className={`w-full px-3 py-2.5 text-left hover:bg-green-50 transition-colors flex items-center justify-between rounded-md ${
                          isSelected ? 'bg-green-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{data.flag}</span>
                          <div>
                            <p className={`text-sm font-medium ${isSelected ? 'text-green-600' : 'text-gray-900'}`}>
                              {data[locale]}
                            </p>
                            <p className="text-xs text-gray-500">{currencyName}</p>
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
                  })
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <p className="text-sm">
                      {locale === 'fr' ? 'Aucun pays trouvé' : locale === 'en' ? 'No country found' : 'No se encontró ningún país'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
