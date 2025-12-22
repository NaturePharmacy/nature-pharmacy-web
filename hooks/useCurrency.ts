import { useLocale } from 'next-intl';
import {
  formatPrice,
  getCurrencySymbol,
  getCurrencyCode,
  convertPrice,
  getCurrencyForCountry,
  type Locale,
  type CurrencyCode
} from '@/lib/currency';
import { useUserCountry } from './useUserCountry';

/**
 * Hook pour gérer les devises selon le pays de l'utilisateur
 */
export function useCurrency() {
  const locale = useLocale() as Locale;
  const { country } = useUserCountry(locale);

  // Obtenir la devise basée sur le pays de l'utilisateur
  const currencyCode: CurrencyCode = getCurrencyForCountry(country);

  return {
    /**
     * Formate un prix selon le pays de l'utilisateur
     * @param price Prix en FCFA (monnaie de base)
     * @returns Prix formaté avec symbole
     */
    formatPrice: (price: number) => formatPrice(price, currencyCode, locale),

    /**
     * Symbole de devise pour le pays actuel
     */
    currencySymbol: getCurrencySymbol(currencyCode),

    /**
     * Code ISO 4217 de la devise
     */
    currencyCode: getCurrencyCode(currencyCode),

    /**
     * Convertit un prix de FCFA vers la devise du pays
     * @param price Prix en FCFA
     * @returns Prix converti (sans formatage)
     */
    convertPrice: (price: number) => convertPrice(price, currencyCode),

    /**
     * Locale actuelle
     */
    locale,

    /**
     * Code du pays actuel
     */
    country,
  };
}
