/**
 * Liste complète des pays avec leurs devises
 * Organisée par zones géographiques pour une meilleure UX
 */

export interface CountryData {
  fr: string;
  en: string;
  es: string;
  flag: string;
  currency: 'USD' | 'EUR' | 'XOF';
  region: 'africa' | 'europe' | 'americas' | 'asia' | 'oceania';
}

export const ALL_COUNTRIES: Record<string, CountryData> = {
  // Zone CFA - Afrique de l'Ouest (FCFA)
  SN: { fr: 'Sénégal', en: 'Senegal', es: 'Senegal', flag: '🇸🇳', currency: 'XOF', region: 'africa' },
  CI: { fr: 'Côte d\'Ivoire', en: 'Ivory Coast', es: 'Costa de Marfil', flag: '🇨🇮', currency: 'XOF', region: 'africa' },
  ML: { fr: 'Mali', en: 'Mali', es: 'Malí', flag: '🇲🇱', currency: 'XOF', region: 'africa' },
  BF: { fr: 'Burkina Faso', en: 'Burkina Faso', es: 'Burkina Faso', flag: '🇧🇫', currency: 'XOF', region: 'africa' },
  BJ: { fr: 'Bénin', en: 'Benin', es: 'Benín', flag: '🇧🇯', currency: 'XOF', region: 'africa' },
  TG: { fr: 'Togo', en: 'Togo', es: 'Togo', flag: '🇹🇬', currency: 'XOF', region: 'africa' },
  NE: { fr: 'Niger', en: 'Niger', es: 'Níger', flag: '🇳🇪', currency: 'XOF', region: 'africa' },
  GW: { fr: 'Guinée-Bissau', en: 'Guinea-Bissau', es: 'Guinea-Bisáu', flag: '🇬🇼', currency: 'XOF', region: 'africa' },

  // Zone CFA - Afrique Centrale (FCFA)
  CM: { fr: 'Cameroun', en: 'Cameroon', es: 'Camerún', flag: '🇨🇲', currency: 'XOF', region: 'africa' },
  GA: { fr: 'Gabon', en: 'Gabon', es: 'Gabón', flag: '🇬🇦', currency: 'XOF', region: 'africa' },
  CG: { fr: 'Congo', en: 'Congo', es: 'Congo', flag: '🇨🇬', currency: 'XOF', region: 'africa' },
  TD: { fr: 'Tchad', en: 'Chad', es: 'Chad', flag: '🇹🇩', currency: 'XOF', region: 'africa' },
  CF: { fr: 'Centrafrique', en: 'Central African Republic', es: 'República Centroafricana', flag: '🇨🇫', currency: 'XOF', region: 'africa' },
  GQ: { fr: 'Guinée Équatoriale', en: 'Equatorial Guinea', es: 'Guinea Ecuatorial', flag: '🇬🇶', currency: 'XOF', region: 'africa' },

  // Autres pays d'Afrique (USD par défaut)
  MA: { fr: 'Maroc', en: 'Morocco', es: 'Marruecos', flag: '🇲🇦', currency: 'USD', region: 'africa' },
  DZ: { fr: 'Algérie', en: 'Algeria', es: 'Argelia', flag: '🇩🇿', currency: 'USD', region: 'africa' },
  TN: { fr: 'Tunisie', en: 'Tunisia', es: 'Túnez', flag: '🇹🇳', currency: 'USD', region: 'africa' },
  EG: { fr: 'Égypte', en: 'Egypt', es: 'Egipto', flag: '🇪🇬', currency: 'USD', region: 'africa' },
  GH: { fr: 'Ghana', en: 'Ghana', es: 'Ghana', flag: '🇬🇭', currency: 'USD', region: 'africa' },
  NG: { fr: 'Nigeria', en: 'Nigeria', es: 'Nigeria', flag: '🇳🇬', currency: 'USD', region: 'africa' },
  KE: { fr: 'Kenya', en: 'Kenya', es: 'Kenia', flag: '🇰🇪', currency: 'USD', region: 'africa' },
  ZA: { fr: 'Afrique du Sud', en: 'South Africa', es: 'Sudáfrica', flag: '🇿🇦', currency: 'USD', region: 'africa' },
  ET: { fr: 'Éthiopie', en: 'Ethiopia', es: 'Etiopía', flag: '🇪🇹', currency: 'USD', region: 'africa' },

  // Europe (EUR)
  FR: { fr: 'France', en: 'France', es: 'Francia', flag: '🇫🇷', currency: 'EUR', region: 'europe' },
  BE: { fr: 'Belgique', en: 'Belgium', es: 'Bélgica', flag: '🇧🇪', currency: 'EUR', region: 'europe' },
  DE: { fr: 'Allemagne', en: 'Germany', es: 'Alemania', flag: '🇩🇪', currency: 'EUR', region: 'europe' },
  ES: { fr: 'Espagne', en: 'Spain', es: 'España', flag: '🇪🇸', currency: 'EUR', region: 'europe' },
  IT: { fr: 'Italie', en: 'Italy', es: 'Italia', flag: '🇮🇹', currency: 'EUR', region: 'europe' },
  PT: { fr: 'Portugal', en: 'Portugal', es: 'Portugal', flag: '🇵🇹', currency: 'EUR', region: 'europe' },
  NL: { fr: 'Pays-Bas', en: 'Netherlands', es: 'Países Bajos', flag: '🇳🇱', currency: 'EUR', region: 'europe' },
  LU: { fr: 'Luxembourg', en: 'Luxembourg', es: 'Luxemburgo', flag: '🇱🇺', currency: 'EUR', region: 'europe' },
  CH: { fr: 'Suisse', en: 'Switzerland', es: 'Suiza', flag: '🇨🇭', currency: 'EUR', region: 'europe' },
  AT: { fr: 'Autriche', en: 'Austria', es: 'Austria', flag: '🇦🇹', currency: 'EUR', region: 'europe' },
  GR: { fr: 'Grèce', en: 'Greece', es: 'Grecia', flag: '🇬🇷', currency: 'EUR', region: 'europe' },
  IE: { fr: 'Irlande', en: 'Ireland', es: 'Irlanda', flag: '🇮🇪', currency: 'EUR', region: 'europe' },
  GB: { fr: 'Royaume-Uni', en: 'United Kingdom', es: 'Reino Unido', flag: '🇬🇧', currency: 'EUR', region: 'europe' },
  SE: { fr: 'Suède', en: 'Sweden', es: 'Suecia', flag: '🇸🇪', currency: 'EUR', region: 'europe' },
  DK: { fr: 'Danemark', en: 'Denmark', es: 'Dinamarca', flag: '🇩🇰', currency: 'EUR', region: 'europe' },
  NO: { fr: 'Norvège', en: 'Norway', es: 'Noruega', flag: '🇳🇴', currency: 'EUR', region: 'europe' },
  FI: { fr: 'Finlande', en: 'Finland', es: 'Finlandia', flag: '🇫🇮', currency: 'EUR', region: 'europe' },
  PL: { fr: 'Pologne', en: 'Poland', es: 'Polonia', flag: '🇵🇱', currency: 'EUR', region: 'europe' },
  CZ: { fr: 'République Tchèque', en: 'Czech Republic', es: 'República Checa', flag: '🇨🇿', currency: 'EUR', region: 'europe' },
  RO: { fr: 'Roumanie', en: 'Romania', es: 'Rumania', flag: '🇷🇴', currency: 'EUR', region: 'europe' },

  // Amérique du Nord (USD)
  US: { fr: 'États-Unis', en: 'United States', es: 'Estados Unidos', flag: '🇺🇸', currency: 'USD', region: 'americas' },
  CA: { fr: 'Canada', en: 'Canada', es: 'Canadá', flag: '🇨🇦', currency: 'USD', region: 'americas' },
  MX: { fr: 'Mexique', en: 'Mexico', es: 'México', flag: '🇲🇽', currency: 'USD', region: 'americas' },

  // Amérique du Sud (USD)
  BR: { fr: 'Brésil', en: 'Brazil', es: 'Brasil', flag: '🇧🇷', currency: 'USD', region: 'americas' },
  AR: { fr: 'Argentine', en: 'Argentina', es: 'Argentina', flag: '🇦🇷', currency: 'USD', region: 'americas' },
  CL: { fr: 'Chili', en: 'Chile', es: 'Chile', flag: '🇨🇱', currency: 'USD', region: 'americas' },
  CO: { fr: 'Colombie', en: 'Colombia', es: 'Colombia', flag: '🇨🇴', currency: 'USD', region: 'americas' },
  PE: { fr: 'Pérou', en: 'Peru', es: 'Perú', flag: '🇵🇪', currency: 'USD', region: 'americas' },
  VE: { fr: 'Venezuela', en: 'Venezuela', es: 'Venezuela', flag: '🇻🇪', currency: 'USD', region: 'americas' },

  // Asie (USD)
  CN: { fr: 'Chine', en: 'China', es: 'China', flag: '🇨🇳', currency: 'USD', region: 'asia' },
  JP: { fr: 'Japon', en: 'Japan', es: 'Japón', flag: '🇯🇵', currency: 'USD', region: 'asia' },
  IN: { fr: 'Inde', en: 'India', es: 'India', flag: '🇮🇳', currency: 'USD', region: 'asia' },
  KR: { fr: 'Corée du Sud', en: 'South Korea', es: 'Corea del Sur', flag: '🇰🇷', currency: 'USD', region: 'asia' },
  TH: { fr: 'Thaïlande', en: 'Thailand', es: 'Tailandia', flag: '🇹🇭', currency: 'USD', region: 'asia' },
  VN: { fr: 'Vietnam', en: 'Vietnam', es: 'Vietnam', flag: '🇻🇳', currency: 'USD', region: 'asia' },
  SG: { fr: 'Singapour', en: 'Singapore', es: 'Singapur', flag: '🇸🇬', currency: 'USD', region: 'asia' },
  MY: { fr: 'Malaisie', en: 'Malaysia', es: 'Malasia', flag: '🇲🇾', currency: 'USD', region: 'asia' },
  PH: { fr: 'Philippines', en: 'Philippines', es: 'Filipinas', flag: '🇵🇭', currency: 'USD', region: 'asia' },
  ID: { fr: 'Indonésie', en: 'Indonesia', es: 'Indonesia', flag: '🇮🇩', currency: 'USD', region: 'asia' },
  AE: { fr: 'Émirats Arabes Unis', en: 'United Arab Emirates', es: 'Emiratos Árabes Unidos', flag: '🇦🇪', currency: 'USD', region: 'asia' },
  SA: { fr: 'Arabie Saoudite', en: 'Saudi Arabia', es: 'Arabia Saudita', flag: '🇸🇦', currency: 'USD', region: 'asia' },

  // Océanie (USD)
  AU: { fr: 'Australie', en: 'Australia', es: 'Australia', flag: '🇦🇺', currency: 'USD', region: 'oceania' },
  NZ: { fr: 'Nouvelle-Zélande', en: 'New Zealand', es: 'Nueva Zelanda', flag: '🇳🇿', currency: 'USD', region: 'oceania' },
};

export const REGION_NAMES = {
  africa: { fr: 'Afrique', en: 'Africa', es: 'África' },
  europe: { fr: 'Europe', en: 'Europe', es: 'Europa' },
  americas: { fr: 'Amériques', en: 'Americas', es: 'Américas' },
  asia: { fr: 'Asie', en: 'Asia', es: 'Asia' },
  oceania: { fr: 'Océanie', en: 'Oceania', es: 'Oceanía' },
};

// Regrouper les pays par région pour l'affichage
export function getCountriesByRegion() {
  const regions: Record<string, Record<string, CountryData>> = {
    africa: {},
    europe: {},
    americas: {},
    asia: {},
    oceania: {},
  };

  Object.entries(ALL_COUNTRIES).forEach(([code, data]) => {
    regions[data.region][code] = data;
  });

  return regions;
}

// Pays les plus populaires (affichés en premier)
export const POPULAR_COUNTRIES = ['SN', 'CI', 'FR', 'US', 'MA', 'BF', 'ML', 'BE', 'CA', 'GB'];
