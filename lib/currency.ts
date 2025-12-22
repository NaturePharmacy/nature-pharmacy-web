// Configuration des devises
// NOTE: Les prix sont stockés en USD dans la base de données
export const CURRENCY_CONFIG = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    position: 'before',
    rate: 1, // Devise de base
    decimals: 2,
  },
  XOF: {
    code: 'XOF',
    symbol: 'FCFA',
    name: 'Franc CFA',
    position: 'after',
    rate: 625, // 1 USD = 625 FCFA (environ)
    decimals: 0,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    position: 'after',
    rate: 0.92, // 1 USD = 0.92 EUR (environ)
    decimals: 2,
  },
} as const;

// Mapping pays → devise
export const COUNTRY_TO_CURRENCY = {
  SN: 'XOF', // Sénégal → Franc CFA
  CI: 'XOF', // Côte d'Ivoire → Franc CFA
  ML: 'XOF', // Mali → Franc CFA
  BF: 'XOF', // Burkina Faso → Franc CFA
  NE: 'XOF', // Niger → Franc CFA
  TG: 'XOF', // Togo → Franc CFA
  BJ: 'XOF', // Bénin → Franc CFA
  FR: 'EUR', // France → Euro
  BE: 'EUR', // Belgique → Euro
  DE: 'EUR', // Allemagne → Euro
  ES: 'EUR', // Espagne → Euro
  IT: 'EUR', // Italie → Euro
  US: 'USD', // États-Unis → Dollar
  CA: 'USD', // Canada → Dollar
  GB: 'USD', // Royaume-Uni → Dollar (par défaut)
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
