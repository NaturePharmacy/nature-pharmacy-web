// Configuration des devises
// NOTE: Les prix sont stockés en USD dans la base de données
export const CURRENCY_CONFIG = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    position: 'before' as const,
    rate: 1, // Devise de base
    decimals: 2,
  },
  XOF: {
    code: 'XOF',
    symbol: 'FCFA',
    name: 'Franc CFA',
    position: 'after' as const,
    rate: 615, // 1 USD = 615 FCFA (taux moyen 2024-2025)
    decimals: 0,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    position: 'after' as const,
    rate: 0.92, // 1 USD = 0.92 EUR
    decimals: 2,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    position: 'before' as const,
    rate: 0.79, // 1 USD = 0.79 GBP
    decimals: 2,
  },
  MAD: {
    code: 'MAD',
    symbol: 'DH',
    name: 'Moroccan Dirham',
    position: 'after' as const,
    rate: 10.0, // 1 USD = 10 MAD
    decimals: 2,
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    position: 'before' as const,
    rate: 1.36, // 1 USD = 1.36 CAD
    decimals: 2,
  },
} as const;

// Mapping pays → devise
export const COUNTRY_TO_CURRENCY = {
  // Zone CFA - Afrique de l'Ouest (UEMOA)
  SN: 'XOF', CI: 'XOF', ML: 'XOF', BF: 'XOF', BJ: 'XOF', TG: 'XOF', NE: 'XOF', GW: 'XOF',
  // Zone CFA - Afrique Centrale (CEMAC)
  CM: 'XOF', GA: 'XOF', CG: 'XOF', TD: 'XOF', CF: 'XOF', GQ: 'XOF',
  // Maroc (MAD)
  MA: 'MAD',
  // Autres pays d'Afrique (USD)
  DZ: 'USD', TN: 'USD', EG: 'USD', GH: 'USD', NG: 'USD', KE: 'USD', ZA: 'USD', ET: 'USD',
  // Zone Euro
  FR: 'EUR', BE: 'EUR', DE: 'EUR', ES: 'EUR', IT: 'EUR', PT: 'EUR', NL: 'EUR', LU: 'EUR',
  AT: 'EUR', GR: 'EUR', IE: 'EUR', FI: 'EUR', SK: 'EUR', SI: 'EUR', EE: 'EUR', LV: 'EUR',
  LT: 'EUR', CY: 'EUR', MT: 'EUR', MC: 'EUR', AD: 'EUR', SM: 'EUR', VA: 'EUR',
  // Europe hors zone Euro
  GB: 'GBP', // Royaume-Uni
  CH: 'EUR', SE: 'EUR', DK: 'EUR', NO: 'EUR', PL: 'EUR', CZ: 'EUR', RO: 'EUR', HU: 'EUR',
  // Amérique du Nord
  US: 'USD',
  CA: 'CAD', // Canada
  MX: 'USD',
  // Amérique du Sud (USD)
  BR: 'USD', AR: 'USD', CL: 'USD', CO: 'USD', PE: 'USD', VE: 'USD', EC: 'USD', UY: 'USD',
  // Asie (USD)
  CN: 'USD', JP: 'USD', IN: 'USD', KR: 'USD', TH: 'USD', VN: 'USD', SG: 'USD',
  MY: 'USD', PH: 'USD', ID: 'USD', AE: 'USD', SA: 'USD', QA: 'USD', KW: 'USD',
  // Océanie (USD)
  AU: 'USD', NZ: 'USD',
} as const;

export type CurrencyCode = keyof typeof CURRENCY_CONFIG;
export type CountryCode = keyof typeof COUNTRY_TO_CURRENCY;
export type Locale = 'fr' | 'en' | 'es';

/**
 * Obtient la devise pour un pays donné
 * @param countryCode Code du pays (ex: 'SN', 'FR', 'US')
 * @returns Code de la devise (ex: 'XOF', 'EUR', 'USD')
 */
export function getCurrencyForCountry(countryCode: string): CurrencyCode {
  return COUNTRY_TO_CURRENCY[countryCode as CountryCode] || 'USD'; // Par défaut USD
}

/**
 * Formate un prix selon la devise du pays
 * @param price Prix en USD (monnaie de base dans la BD)
 * @param currencyCode Code de devise (ex: 'USD', 'XOF', 'EUR')
 * @param locale Locale pour le formatage des nombres
 * @returns Prix formaté avec symbole de devise
 */
export function formatPrice(price: number, currencyCode: CurrencyCode = 'USD', locale: Locale = 'fr'): string {
  const config = CURRENCY_CONFIG[currencyCode];
  const convertedPrice = price * config.rate;

  // Arrondir selon le nombre de décimales configurées
  const roundedPrice = Math.round(convertedPrice * Math.pow(10, config.decimals)) / Math.pow(10, config.decimals);

  // Formater le nombre avec séparateurs de milliers
  const formattedNumber = roundedPrice.toLocaleString(locale, {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  });

  // Placer le symbole selon la configuration
  if (config.position === 'before') {
    return `${config.symbol}${formattedNumber}`;
  } else {
    return `${formattedNumber} ${config.symbol}`;
  }
}

/**
 * Formate un prix en utilisant le pays de l'utilisateur
 * @param price Prix en USD (monnaie de base)
 * @param countryCode Code du pays de l'utilisateur
 * @param locale Locale pour le formatage
 * @returns Prix formaté avec symbole de devise
 */
export function formatPriceByCountry(price: number, countryCode: string, locale: Locale = 'fr'): string {
  const currencyCode = getCurrencyForCountry(countryCode);
  return formatPrice(price, currencyCode, locale);
}

/**
 * Obtient le symbole de devise pour un code de devise
 * @param currencyCode Code de devise
 * @returns Symbole de devise
 */
export function getCurrencySymbol(currencyCode: CurrencyCode = 'USD'): string {
  return CURRENCY_CONFIG[currencyCode].symbol;
}

/**
 * Obtient le code de devise pour un code de devise (retourne le code lui-même)
 * @param currencyCode Code de devise
 * @returns Code de devise (ISO 4217)
 */
export function getCurrencyCode(currencyCode: CurrencyCode = 'USD'): string {
  return CURRENCY_CONFIG[currencyCode].code;
}

/**
 * Convertit un prix de USD vers une autre devise
 * @param price Prix en USD
 * @param currencyCode Code de devise cible
 * @returns Prix converti (sans formatage)
 */
export function convertPrice(price: number, currencyCode: CurrencyCode = 'USD'): number {
  return price * CURRENCY_CONFIG[currencyCode].rate;
}
