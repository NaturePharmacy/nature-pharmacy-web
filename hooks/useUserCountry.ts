import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const COUNTRY_NAMES: Record<string, Record<string, string>> = {
  US: { fr: 'États-Unis', en: 'United States', es: 'Estados Unidos' },
  FR: { fr: 'France', en: 'France', es: 'Francia' },
  GB: { fr: 'Royaume-Uni', en: 'United Kingdom', es: 'Reino Unido' },
  DE: { fr: 'Allemagne', en: 'Germany', es: 'Alemania' },
  ES: { fr: 'Espagne', en: 'Spain', es: 'España' },
  IT: { fr: 'Italie', en: 'Italy', es: 'Italia' },
  PT: { fr: 'Portugal', en: 'Portugal', es: 'Portugal' },
  BE: { fr: 'Belgique', en: 'Belgium', es: 'Bélgica' },
  NL: { fr: 'Pays-Bas', en: 'Netherlands', es: 'Países Bajos' },
  CH: { fr: 'Suisse', en: 'Switzerland', es: 'Suiza' },
  SN: { fr: 'Sénégal', en: 'Senegal', es: 'Senegal' },
  CI: { fr: 'Côte d\'Ivoire', en: 'Ivory Coast', es: 'Costa de Marfil' },
  ML: { fr: 'Mali', en: 'Mali', es: 'Malí' },
  BF: { fr: 'Burkina Faso', en: 'Burkina Faso', es: 'Burkina Faso' },
  BJ: { fr: 'Bénin', en: 'Benin', es: 'Benín' },
  TG: { fr: 'Togo', en: 'Togo', es: 'Togo' },
  NE: { fr: 'Niger', en: 'Niger', es: 'Níger' },
  CM: { fr: 'Cameroun', en: 'Cameroon', es: 'Camerún' },
  GA: { fr: 'Gabon', en: 'Gabon', es: 'Gabón' },
  MA: { fr: 'Maroc', en: 'Morocco', es: 'Marruecos' },
  DZ: { fr: 'Algérie', en: 'Algeria', es: 'Argelia' },
  TN: { fr: 'Tunisie', en: 'Tunisia', es: 'Túnez' },
  CA: { fr: 'Canada', en: 'Canada', es: 'Canadá' },
  BR: { fr: 'Brésil', en: 'Brazil', es: 'Brasil' },
  MX: { fr: 'Mexique', en: 'Mexico', es: 'México' },
  JP: { fr: 'Japon', en: 'Japan', es: 'Japón' },
  CN: { fr: 'Chine', en: 'China', es: 'China' },
  IN: { fr: 'Inde', en: 'India', es: 'India' },
  AU: { fr: 'Australie', en: 'Australia', es: 'Australia' },
  AE: { fr: 'Émirats arabes unis', en: 'United Arab Emirates', es: 'Emiratos Árabes Unidos' },
  SA: { fr: 'Arabie Saoudite', en: 'Saudi Arabia', es: 'Arabia Saudita' },
};

export function useUserCountry(locale: 'fr' | 'en' | 'es' = 'fr') {
  const { data: session } = useSession();
  const [country, setCountry] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectCountry = async () => {
      // 1. Essayer de récupérer le pays depuis le localStorage
      const savedCountry = localStorage.getItem('userCountry');
      if (savedCountry) {
        setCountry(savedCountry);
        setIsLoading(false);
        return;
      }

      // 2. Essayer de détecter automatiquement via l'API Vercel geo
      try {
        const response = await fetch('/api/geo');
        if (response.ok) {
          const data = await response.json();
          if (data.country) {
            setCountry(data.country);
            localStorage.setItem('userCountry', data.country);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log('Geo detection failed, using default');
      }

      // 3. Fallback: essayer de détecter via la langue du navigateur
      const browserLang = navigator.language || navigator.languages?.[0] || '';
      const langToCountry: Record<string, string> = {
        'fr-FR': 'FR',
        'fr-SN': 'SN',
        'fr-CI': 'CI',
        'fr-CA': 'CA',
        'fr-BE': 'BE',
        'fr-CH': 'CH',
        'en-US': 'US',
        'en-GB': 'GB',
        'en-CA': 'CA',
        'en-AU': 'AU',
        'es-ES': 'ES',
        'es-MX': 'MX',
        'de-DE': 'DE',
        'it-IT': 'IT',
        'pt-PT': 'PT',
        'pt-BR': 'BR',
        'ar-MA': 'MA',
        'ar-SA': 'SA',
        'ar-AE': 'AE',
      };

      const detectedCountry = langToCountry[browserLang] ||
                              langToCountry[browserLang.split('-')[0] + '-' + browserLang.split('-')[0].toUpperCase()] ||
                              'US'; // Défaut USD si rien ne marche

      setCountry(detectedCountry);
      setIsLoading(false);
    };

    detectCountry();
  }, [session]);

  const setUserCountry = (countryCode: string) => {
    setCountry(countryCode);
    localStorage.setItem('userCountry', countryCode);
  };

  const countryName = country ? (COUNTRY_NAMES[country]?.[locale] || country) : '';

  return {
    country,
    countryName,
    setUserCountry,
    isLoading,
  };
}
