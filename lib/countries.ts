/**
 * Liste complète des pays avec leurs devises
 * Organisée par zones géographiques pour une meilleure UX
 */

export interface CountryData {
  fr: string;
  en: string;
  es: string;
  flag: string;
  currency: 'USD' | 'EUR' | 'XOF' | 'GBP';
  region: 'africa' | 'europe' | 'americas' | 'asia' | 'oceania' | 'middle-east';
}

export const ALL_COUNTRIES: Record<string, CountryData> = {
  // ========== AFRIQUE ==========
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
  CD: { fr: 'RD Congo', en: 'DR Congo', es: 'RD Congo', flag: '🇨🇩', currency: 'USD', region: 'africa' },
  TD: { fr: 'Tchad', en: 'Chad', es: 'Chad', flag: '🇹🇩', currency: 'XOF', region: 'africa' },
  CF: { fr: 'Centrafrique', en: 'Central African Republic', es: 'República Centroafricana', flag: '🇨🇫', currency: 'XOF', region: 'africa' },
  GQ: { fr: 'Guinée Équatoriale', en: 'Equatorial Guinea', es: 'Guinea Ecuatorial', flag: '🇬🇶', currency: 'XOF', region: 'africa' },

  // Afrique du Nord
  MA: { fr: 'Maroc', en: 'Morocco', es: 'Marruecos', flag: '🇲🇦', currency: 'USD', region: 'africa' },
  DZ: { fr: 'Algérie', en: 'Algeria', es: 'Argelia', flag: '🇩🇿', currency: 'USD', region: 'africa' },
  TN: { fr: 'Tunisie', en: 'Tunisia', es: 'Túnez', flag: '🇹🇳', currency: 'USD', region: 'africa' },
  EG: { fr: 'Égypte', en: 'Egypt', es: 'Egipto', flag: '🇪🇬', currency: 'USD', region: 'africa' },
  LY: { fr: 'Libye', en: 'Libya', es: 'Libia', flag: '🇱🇾', currency: 'USD', region: 'africa' },
  SD: { fr: 'Soudan', en: 'Sudan', es: 'Sudán', flag: '🇸🇩', currency: 'USD', region: 'africa' },

  // Afrique de l'Ouest (hors CFA)
  GH: { fr: 'Ghana', en: 'Ghana', es: 'Ghana', flag: '🇬🇭', currency: 'USD', region: 'africa' },
  NG: { fr: 'Nigeria', en: 'Nigeria', es: 'Nigeria', flag: '🇳🇬', currency: 'USD', region: 'africa' },
  GN: { fr: 'Guinée', en: 'Guinea', es: 'Guinea', flag: '🇬🇳', currency: 'USD', region: 'africa' },
  SL: { fr: 'Sierra Leone', en: 'Sierra Leone', es: 'Sierra Leona', flag: '🇸🇱', currency: 'USD', region: 'africa' },
  LR: { fr: 'Liberia', en: 'Liberia', es: 'Liberia', flag: '🇱🇷', currency: 'USD', region: 'africa' },
  GM: { fr: 'Gambie', en: 'Gambia', es: 'Gambia', flag: '🇬🇲', currency: 'USD', region: 'africa' },
  CV: { fr: 'Cap-Vert', en: 'Cape Verde', es: 'Cabo Verde', flag: '🇨🇻', currency: 'EUR', region: 'africa' },
  MR: { fr: 'Mauritanie', en: 'Mauritania', es: 'Mauritania', flag: '🇲🇷', currency: 'USD', region: 'africa' },

  // Afrique de l'Est
  KE: { fr: 'Kenya', en: 'Kenya', es: 'Kenia', flag: '🇰🇪', currency: 'USD', region: 'africa' },
  ET: { fr: 'Éthiopie', en: 'Ethiopia', es: 'Etiopía', flag: '🇪🇹', currency: 'USD', region: 'africa' },
  TZ: { fr: 'Tanzanie', en: 'Tanzania', es: 'Tanzania', flag: '🇹🇿', currency: 'USD', region: 'africa' },
  UG: { fr: 'Ouganda', en: 'Uganda', es: 'Uganda', flag: '🇺🇬', currency: 'USD', region: 'africa' },
  RW: { fr: 'Rwanda', en: 'Rwanda', es: 'Ruanda', flag: '🇷🇼', currency: 'USD', region: 'africa' },
  BI: { fr: 'Burundi', en: 'Burundi', es: 'Burundi', flag: '🇧🇮', currency: 'USD', region: 'africa' },
  SO: { fr: 'Somalie', en: 'Somalia', es: 'Somalia', flag: '🇸🇴', currency: 'USD', region: 'africa' },
  DJ: { fr: 'Djibouti', en: 'Djibouti', es: 'Yibuti', flag: '🇩🇯', currency: 'USD', region: 'africa' },
  ER: { fr: 'Érythrée', en: 'Eritrea', es: 'Eritrea', flag: '🇪🇷', currency: 'USD', region: 'africa' },
  SS: { fr: 'Soudan du Sud', en: 'South Sudan', es: 'Sudán del Sur', flag: '🇸🇸', currency: 'USD', region: 'africa' },

  // Afrique Australe
  ZA: { fr: 'Afrique du Sud', en: 'South Africa', es: 'Sudáfrica', flag: '🇿🇦', currency: 'USD', region: 'africa' },
  ZW: { fr: 'Zimbabwe', en: 'Zimbabwe', es: 'Zimbabue', flag: '🇿🇼', currency: 'USD', region: 'africa' },
  ZM: { fr: 'Zambie', en: 'Zambia', es: 'Zambia', flag: '🇿🇲', currency: 'USD', region: 'africa' },
  BW: { fr: 'Botswana', en: 'Botswana', es: 'Botsuana', flag: '🇧🇼', currency: 'USD', region: 'africa' },
  NA: { fr: 'Namibie', en: 'Namibia', es: 'Namibia', flag: '🇳🇦', currency: 'USD', region: 'africa' },
  MZ: { fr: 'Mozambique', en: 'Mozambique', es: 'Mozambique', flag: '🇲🇿', currency: 'USD', region: 'africa' },
  MW: { fr: 'Malawi', en: 'Malawi', es: 'Malaui', flag: '🇲🇼', currency: 'USD', region: 'africa' },
  AO: { fr: 'Angola', en: 'Angola', es: 'Angola', flag: '🇦🇴', currency: 'USD', region: 'africa' },
  LS: { fr: 'Lesotho', en: 'Lesotho', es: 'Lesoto', flag: '🇱🇸', currency: 'USD', region: 'africa' },
  SZ: { fr: 'Eswatini', en: 'Eswatini', es: 'Esuatini', flag: '🇸🇿', currency: 'USD', region: 'africa' },

  // Îles africaines
  MG: { fr: 'Madagascar', en: 'Madagascar', es: 'Madagascar', flag: '🇲🇬', currency: 'USD', region: 'africa' },
  MU: { fr: 'Maurice', en: 'Mauritius', es: 'Mauricio', flag: '🇲🇺', currency: 'USD', region: 'africa' },
  SC: { fr: 'Seychelles', en: 'Seychelles', es: 'Seychelles', flag: '🇸🇨', currency: 'USD', region: 'africa' },
  KM: { fr: 'Comores', en: 'Comoros', es: 'Comoras', flag: '🇰🇲', currency: 'USD', region: 'africa' },
  RE: { fr: 'La Réunion', en: 'Réunion', es: 'Reunión', flag: '🇷🇪', currency: 'EUR', region: 'africa' },

  // ========== EUROPE ==========
  // Zone Euro
  FR: { fr: 'France', en: 'France', es: 'Francia', flag: '🇫🇷', currency: 'EUR', region: 'europe' },
  BE: { fr: 'Belgique', en: 'Belgium', es: 'Bélgica', flag: '🇧🇪', currency: 'EUR', region: 'europe' },
  DE: { fr: 'Allemagne', en: 'Germany', es: 'Alemania', flag: '🇩🇪', currency: 'EUR', region: 'europe' },
  ES: { fr: 'Espagne', en: 'Spain', es: 'España', flag: '🇪🇸', currency: 'EUR', region: 'europe' },
  IT: { fr: 'Italie', en: 'Italy', es: 'Italia', flag: '🇮🇹', currency: 'EUR', region: 'europe' },
  PT: { fr: 'Portugal', en: 'Portugal', es: 'Portugal', flag: '🇵🇹', currency: 'EUR', region: 'europe' },
  NL: { fr: 'Pays-Bas', en: 'Netherlands', es: 'Países Bajos', flag: '🇳🇱', currency: 'EUR', region: 'europe' },
  LU: { fr: 'Luxembourg', en: 'Luxembourg', es: 'Luxemburgo', flag: '🇱🇺', currency: 'EUR', region: 'europe' },
  AT: { fr: 'Autriche', en: 'Austria', es: 'Austria', flag: '🇦🇹', currency: 'EUR', region: 'europe' },
  GR: { fr: 'Grèce', en: 'Greece', es: 'Grecia', flag: '🇬🇷', currency: 'EUR', region: 'europe' },
  IE: { fr: 'Irlande', en: 'Ireland', es: 'Irlanda', flag: '🇮🇪', currency: 'EUR', region: 'europe' },
  FI: { fr: 'Finlande', en: 'Finland', es: 'Finlandia', flag: '🇫🇮', currency: 'EUR', region: 'europe' },
  SK: { fr: 'Slovaquie', en: 'Slovakia', es: 'Eslovaquia', flag: '🇸🇰', currency: 'EUR', region: 'europe' },
  SI: { fr: 'Slovénie', en: 'Slovenia', es: 'Eslovenia', flag: '🇸🇮', currency: 'EUR', region: 'europe' },
  EE: { fr: 'Estonie', en: 'Estonia', es: 'Estonia', flag: '🇪🇪', currency: 'EUR', region: 'europe' },
  LV: { fr: 'Lettonie', en: 'Latvia', es: 'Letonia', flag: '🇱🇻', currency: 'EUR', region: 'europe' },
  LT: { fr: 'Lituanie', en: 'Lithuania', es: 'Lituania', flag: '🇱🇹', currency: 'EUR', region: 'europe' },
  MT: { fr: 'Malte', en: 'Malta', es: 'Malta', flag: '🇲🇹', currency: 'EUR', region: 'europe' },
  CY: { fr: 'Chypre', en: 'Cyprus', es: 'Chipre', flag: '🇨🇾', currency: 'EUR', region: 'europe' },
  HR: { fr: 'Croatie', en: 'Croatia', es: 'Croacia', flag: '🇭🇷', currency: 'EUR', region: 'europe' },

  // Europe hors Euro
  GB: { fr: 'Royaume-Uni', en: 'United Kingdom', es: 'Reino Unido', flag: '🇬🇧', currency: 'GBP', region: 'europe' },
  CH: { fr: 'Suisse', en: 'Switzerland', es: 'Suiza', flag: '🇨🇭', currency: 'EUR', region: 'europe' },
  SE: { fr: 'Suède', en: 'Sweden', es: 'Suecia', flag: '🇸🇪', currency: 'EUR', region: 'europe' },
  DK: { fr: 'Danemark', en: 'Denmark', es: 'Dinamarca', flag: '🇩🇰', currency: 'EUR', region: 'europe' },
  NO: { fr: 'Norvège', en: 'Norway', es: 'Noruega', flag: '🇳🇴', currency: 'EUR', region: 'europe' },
  PL: { fr: 'Pologne', en: 'Poland', es: 'Polonia', flag: '🇵🇱', currency: 'EUR', region: 'europe' },
  CZ: { fr: 'République Tchèque', en: 'Czech Republic', es: 'República Checa', flag: '🇨🇿', currency: 'EUR', region: 'europe' },
  RO: { fr: 'Roumanie', en: 'Romania', es: 'Rumania', flag: '🇷🇴', currency: 'EUR', region: 'europe' },
  HU: { fr: 'Hongrie', en: 'Hungary', es: 'Hungría', flag: '🇭🇺', currency: 'EUR', region: 'europe' },
  BG: { fr: 'Bulgarie', en: 'Bulgaria', es: 'Bulgaria', flag: '🇧🇬', currency: 'EUR', region: 'europe' },
  RS: { fr: 'Serbie', en: 'Serbia', es: 'Serbia', flag: '🇷🇸', currency: 'EUR', region: 'europe' },
  UA: { fr: 'Ukraine', en: 'Ukraine', es: 'Ucrania', flag: '🇺🇦', currency: 'EUR', region: 'europe' },
  BY: { fr: 'Biélorussie', en: 'Belarus', es: 'Bielorrusia', flag: '🇧🇾', currency: 'EUR', region: 'europe' },
  MD: { fr: 'Moldavie', en: 'Moldova', es: 'Moldavia', flag: '🇲🇩', currency: 'EUR', region: 'europe' },
  AL: { fr: 'Albanie', en: 'Albania', es: 'Albania', flag: '🇦🇱', currency: 'EUR', region: 'europe' },
  MK: { fr: 'Macédoine du Nord', en: 'North Macedonia', es: 'Macedonia del Norte', flag: '🇲🇰', currency: 'EUR', region: 'europe' },
  BA: { fr: 'Bosnie-Herzégovine', en: 'Bosnia and Herzegovina', es: 'Bosnia y Herzegovina', flag: '🇧🇦', currency: 'EUR', region: 'europe' },
  ME: { fr: 'Monténégro', en: 'Montenegro', es: 'Montenegro', flag: '🇲🇪', currency: 'EUR', region: 'europe' },
  XK: { fr: 'Kosovo', en: 'Kosovo', es: 'Kosovo', flag: '🇽🇰', currency: 'EUR', region: 'europe' },
  IS: { fr: 'Islande', en: 'Iceland', es: 'Islandia', flag: '🇮🇸', currency: 'EUR', region: 'europe' },
  RU: { fr: 'Russie', en: 'Russia', es: 'Rusia', flag: '🇷🇺', currency: 'USD', region: 'europe' },
  TR: { fr: 'Turquie', en: 'Turkey', es: 'Turquía', flag: '🇹🇷', currency: 'USD', region: 'europe' },

  // ========== AMÉRIQUES ==========
  // Amérique du Nord
  US: { fr: 'États-Unis', en: 'United States', es: 'Estados Unidos', flag: '🇺🇸', currency: 'USD', region: 'americas' },
  CA: { fr: 'Canada', en: 'Canada', es: 'Canadá', flag: '🇨🇦', currency: 'USD', region: 'americas' },
  MX: { fr: 'Mexique', en: 'Mexico', es: 'México', flag: '🇲🇽', currency: 'USD', region: 'americas' },

  // Amérique Centrale
  GT: { fr: 'Guatemala', en: 'Guatemala', es: 'Guatemala', flag: '🇬🇹', currency: 'USD', region: 'americas' },
  HN: { fr: 'Honduras', en: 'Honduras', es: 'Honduras', flag: '🇭🇳', currency: 'USD', region: 'americas' },
  SV: { fr: 'Salvador', en: 'El Salvador', es: 'El Salvador', flag: '🇸🇻', currency: 'USD', region: 'americas' },
  NI: { fr: 'Nicaragua', en: 'Nicaragua', es: 'Nicaragua', flag: '🇳🇮', currency: 'USD', region: 'americas' },
  CR: { fr: 'Costa Rica', en: 'Costa Rica', es: 'Costa Rica', flag: '🇨🇷', currency: 'USD', region: 'americas' },
  PA: { fr: 'Panama', en: 'Panama', es: 'Panamá', flag: '🇵🇦', currency: 'USD', region: 'americas' },
  BZ: { fr: 'Belize', en: 'Belize', es: 'Belice', flag: '🇧🇿', currency: 'USD', region: 'americas' },

  // Caraïbes
  CU: { fr: 'Cuba', en: 'Cuba', es: 'Cuba', flag: '🇨🇺', currency: 'USD', region: 'americas' },
  DO: { fr: 'République Dominicaine', en: 'Dominican Republic', es: 'República Dominicana', flag: '🇩🇴', currency: 'USD', region: 'americas' },
  HT: { fr: 'Haïti', en: 'Haiti', es: 'Haití', flag: '🇭🇹', currency: 'USD', region: 'americas' },
  JM: { fr: 'Jamaïque', en: 'Jamaica', es: 'Jamaica', flag: '🇯🇲', currency: 'USD', region: 'americas' },
  PR: { fr: 'Porto Rico', en: 'Puerto Rico', es: 'Puerto Rico', flag: '🇵🇷', currency: 'USD', region: 'americas' },
  TT: { fr: 'Trinité-et-Tobago', en: 'Trinidad and Tobago', es: 'Trinidad y Tobago', flag: '🇹🇹', currency: 'USD', region: 'americas' },
  BB: { fr: 'Barbade', en: 'Barbados', es: 'Barbados', flag: '🇧🇧', currency: 'USD', region: 'americas' },
  BS: { fr: 'Bahamas', en: 'Bahamas', es: 'Bahamas', flag: '🇧🇸', currency: 'USD', region: 'americas' },
  GP: { fr: 'Guadeloupe', en: 'Guadeloupe', es: 'Guadalupe', flag: '🇬🇵', currency: 'EUR', region: 'americas' },
  MQ: { fr: 'Martinique', en: 'Martinique', es: 'Martinica', flag: '🇲🇶', currency: 'EUR', region: 'americas' },
  GF: { fr: 'Guyane française', en: 'French Guiana', es: 'Guayana Francesa', flag: '🇬🇫', currency: 'EUR', region: 'americas' },

  // Amérique du Sud
  BR: { fr: 'Brésil', en: 'Brazil', es: 'Brasil', flag: '🇧🇷', currency: 'USD', region: 'americas' },
  AR: { fr: 'Argentine', en: 'Argentina', es: 'Argentina', flag: '🇦🇷', currency: 'USD', region: 'americas' },
  CL: { fr: 'Chili', en: 'Chile', es: 'Chile', flag: '🇨🇱', currency: 'USD', region: 'americas' },
  CO: { fr: 'Colombie', en: 'Colombia', es: 'Colombia', flag: '🇨🇴', currency: 'USD', region: 'americas' },
  PE: { fr: 'Pérou', en: 'Peru', es: 'Perú', flag: '🇵🇪', currency: 'USD', region: 'americas' },
  VE: { fr: 'Venezuela', en: 'Venezuela', es: 'Venezuela', flag: '🇻🇪', currency: 'USD', region: 'americas' },
  EC: { fr: 'Équateur', en: 'Ecuador', es: 'Ecuador', flag: '🇪🇨', currency: 'USD', region: 'americas' },
  BO: { fr: 'Bolivie', en: 'Bolivia', es: 'Bolivia', flag: '🇧🇴', currency: 'USD', region: 'americas' },
  PY: { fr: 'Paraguay', en: 'Paraguay', es: 'Paraguay', flag: '🇵🇾', currency: 'USD', region: 'americas' },
  UY: { fr: 'Uruguay', en: 'Uruguay', es: 'Uruguay', flag: '🇺🇾', currency: 'USD', region: 'americas' },
  GY: { fr: 'Guyana', en: 'Guyana', es: 'Guyana', flag: '🇬🇾', currency: 'USD', region: 'americas' },
  SR: { fr: 'Suriname', en: 'Suriname', es: 'Surinam', flag: '🇸🇷', currency: 'USD', region: 'americas' },

  // ========== ASIE ==========
  // Asie de l'Est
  CN: { fr: 'Chine', en: 'China', es: 'China', flag: '🇨🇳', currency: 'USD', region: 'asia' },
  JP: { fr: 'Japon', en: 'Japan', es: 'Japón', flag: '🇯🇵', currency: 'USD', region: 'asia' },
  KR: { fr: 'Corée du Sud', en: 'South Korea', es: 'Corea del Sur', flag: '🇰🇷', currency: 'USD', region: 'asia' },
  KP: { fr: 'Corée du Nord', en: 'North Korea', es: 'Corea del Norte', flag: '🇰🇵', currency: 'USD', region: 'asia' },
  TW: { fr: 'Taïwan', en: 'Taiwan', es: 'Taiwán', flag: '🇹🇼', currency: 'USD', region: 'asia' },
  MN: { fr: 'Mongolie', en: 'Mongolia', es: 'Mongolia', flag: '🇲🇳', currency: 'USD', region: 'asia' },
  HK: { fr: 'Hong Kong', en: 'Hong Kong', es: 'Hong Kong', flag: '🇭🇰', currency: 'USD', region: 'asia' },
  MO: { fr: 'Macao', en: 'Macau', es: 'Macao', flag: '🇲🇴', currency: 'USD', region: 'asia' },

  // Asie du Sud-Est
  TH: { fr: 'Thaïlande', en: 'Thailand', es: 'Tailandia', flag: '🇹🇭', currency: 'USD', region: 'asia' },
  VN: { fr: 'Vietnam', en: 'Vietnam', es: 'Vietnam', flag: '🇻🇳', currency: 'USD', region: 'asia' },
  SG: { fr: 'Singapour', en: 'Singapore', es: 'Singapur', flag: '🇸🇬', currency: 'USD', region: 'asia' },
  MY: { fr: 'Malaisie', en: 'Malaysia', es: 'Malasia', flag: '🇲🇾', currency: 'USD', region: 'asia' },
  PH: { fr: 'Philippines', en: 'Philippines', es: 'Filipinas', flag: '🇵🇭', currency: 'USD', region: 'asia' },
  ID: { fr: 'Indonésie', en: 'Indonesia', es: 'Indonesia', flag: '🇮🇩', currency: 'USD', region: 'asia' },
  MM: { fr: 'Myanmar', en: 'Myanmar', es: 'Myanmar', flag: '🇲🇲', currency: 'USD', region: 'asia' },
  KH: { fr: 'Cambodge', en: 'Cambodia', es: 'Camboya', flag: '🇰🇭', currency: 'USD', region: 'asia' },
  LA: { fr: 'Laos', en: 'Laos', es: 'Laos', flag: '🇱🇦', currency: 'USD', region: 'asia' },
  BN: { fr: 'Brunei', en: 'Brunei', es: 'Brunéi', flag: '🇧🇳', currency: 'USD', region: 'asia' },
  TL: { fr: 'Timor oriental', en: 'East Timor', es: 'Timor Oriental', flag: '🇹🇱', currency: 'USD', region: 'asia' },

  // Asie du Sud
  IN: { fr: 'Inde', en: 'India', es: 'India', flag: '🇮🇳', currency: 'USD', region: 'asia' },
  PK: { fr: 'Pakistan', en: 'Pakistan', es: 'Pakistán', flag: '🇵🇰', currency: 'USD', region: 'asia' },
  BD: { fr: 'Bangladesh', en: 'Bangladesh', es: 'Bangladés', flag: '🇧🇩', currency: 'USD', region: 'asia' },
  LK: { fr: 'Sri Lanka', en: 'Sri Lanka', es: 'Sri Lanka', flag: '🇱🇰', currency: 'USD', region: 'asia' },
  NP: { fr: 'Népal', en: 'Nepal', es: 'Nepal', flag: '🇳🇵', currency: 'USD', region: 'asia' },
  BT: { fr: 'Bhoutan', en: 'Bhutan', es: 'Bután', flag: '🇧🇹', currency: 'USD', region: 'asia' },
  MV: { fr: 'Maldives', en: 'Maldives', es: 'Maldivas', flag: '🇲🇻', currency: 'USD', region: 'asia' },
  AF: { fr: 'Afghanistan', en: 'Afghanistan', es: 'Afganistán', flag: '🇦🇫', currency: 'USD', region: 'asia' },

  // Asie Centrale
  KZ: { fr: 'Kazakhstan', en: 'Kazakhstan', es: 'Kazajistán', flag: '🇰🇿', currency: 'USD', region: 'asia' },
  UZ: { fr: 'Ouzbékistan', en: 'Uzbekistan', es: 'Uzbekistán', flag: '🇺🇿', currency: 'USD', region: 'asia' },
  TM: { fr: 'Turkménistan', en: 'Turkmenistan', es: 'Turkmenistán', flag: '🇹🇲', currency: 'USD', region: 'asia' },
  TJ: { fr: 'Tadjikistan', en: 'Tajikistan', es: 'Tayikistán', flag: '🇹🇯', currency: 'USD', region: 'asia' },
  KG: { fr: 'Kirghizistan', en: 'Kyrgyzstan', es: 'Kirguistán', flag: '🇰🇬', currency: 'USD', region: 'asia' },

  // ========== MOYEN-ORIENT ==========
  AE: { fr: 'Émirats Arabes Unis', en: 'United Arab Emirates', es: 'Emiratos Árabes Unidos', flag: '🇦🇪', currency: 'USD', region: 'middle-east' },
  SA: { fr: 'Arabie Saoudite', en: 'Saudi Arabia', es: 'Arabia Saudita', flag: '🇸🇦', currency: 'USD', region: 'middle-east' },
  QA: { fr: 'Qatar', en: 'Qatar', es: 'Catar', flag: '🇶🇦', currency: 'USD', region: 'middle-east' },
  KW: { fr: 'Koweït', en: 'Kuwait', es: 'Kuwait', flag: '🇰🇼', currency: 'USD', region: 'middle-east' },
  BH: { fr: 'Bahreïn', en: 'Bahrain', es: 'Baréin', flag: '🇧🇭', currency: 'USD', region: 'middle-east' },
  OM: { fr: 'Oman', en: 'Oman', es: 'Omán', flag: '🇴🇲', currency: 'USD', region: 'middle-east' },
  YE: { fr: 'Yémen', en: 'Yemen', es: 'Yemen', flag: '🇾🇪', currency: 'USD', region: 'middle-east' },
  IQ: { fr: 'Irak', en: 'Iraq', es: 'Irak', flag: '🇮🇶', currency: 'USD', region: 'middle-east' },
  IR: { fr: 'Iran', en: 'Iran', es: 'Irán', flag: '🇮🇷', currency: 'USD', region: 'middle-east' },
  IL: { fr: 'Israël', en: 'Israel', es: 'Israel', flag: '🇮🇱', currency: 'USD', region: 'middle-east' },
  PS: { fr: 'Palestine', en: 'Palestine', es: 'Palestina', flag: '🇵🇸', currency: 'USD', region: 'middle-east' },
  JO: { fr: 'Jordanie', en: 'Jordan', es: 'Jordania', flag: '🇯🇴', currency: 'USD', region: 'middle-east' },
  LB: { fr: 'Liban', en: 'Lebanon', es: 'Líbano', flag: '🇱🇧', currency: 'USD', region: 'middle-east' },
  SY: { fr: 'Syrie', en: 'Syria', es: 'Siria', flag: '🇸🇾', currency: 'USD', region: 'middle-east' },
  GE: { fr: 'Géorgie', en: 'Georgia', es: 'Georgia', flag: '🇬🇪', currency: 'USD', region: 'middle-east' },
  AM: { fr: 'Arménie', en: 'Armenia', es: 'Armenia', flag: '🇦🇲', currency: 'USD', region: 'middle-east' },
  AZ: { fr: 'Azerbaïdjan', en: 'Azerbaijan', es: 'Azerbaiyán', flag: '🇦🇿', currency: 'USD', region: 'middle-east' },

  // ========== OCÉANIE ==========
  AU: { fr: 'Australie', en: 'Australia', es: 'Australia', flag: '🇦🇺', currency: 'USD', region: 'oceania' },
  NZ: { fr: 'Nouvelle-Zélande', en: 'New Zealand', es: 'Nueva Zelanda', flag: '🇳🇿', currency: 'USD', region: 'oceania' },
  FJ: { fr: 'Fidji', en: 'Fiji', es: 'Fiyi', flag: '🇫🇯', currency: 'USD', region: 'oceania' },
  PG: { fr: 'Papouasie-Nouvelle-Guinée', en: 'Papua New Guinea', es: 'Papúa Nueva Guinea', flag: '🇵🇬', currency: 'USD', region: 'oceania' },
  NC: { fr: 'Nouvelle-Calédonie', en: 'New Caledonia', es: 'Nueva Caledonia', flag: '🇳🇨', currency: 'EUR', region: 'oceania' },
  PF: { fr: 'Polynésie française', en: 'French Polynesia', es: 'Polinesia Francesa', flag: '🇵🇫', currency: 'EUR', region: 'oceania' },
  WS: { fr: 'Samoa', en: 'Samoa', es: 'Samoa', flag: '🇼🇸', currency: 'USD', region: 'oceania' },
  TO: { fr: 'Tonga', en: 'Tonga', es: 'Tonga', flag: '🇹🇴', currency: 'USD', region: 'oceania' },
  VU: { fr: 'Vanuatu', en: 'Vanuatu', es: 'Vanuatu', flag: '🇻🇺', currency: 'USD', region: 'oceania' },
  SB: { fr: 'Îles Salomon', en: 'Solomon Islands', es: 'Islas Salomón', flag: '🇸🇧', currency: 'USD', region: 'oceania' },
  GU: { fr: 'Guam', en: 'Guam', es: 'Guam', flag: '🇬🇺', currency: 'USD', region: 'oceania' },
};

export const REGION_NAMES = {
  africa: { fr: 'Afrique', en: 'Africa', es: 'África' },
  europe: { fr: 'Europe', en: 'Europe', es: 'Europa' },
  americas: { fr: 'Amériques', en: 'Americas', es: 'Américas' },
  asia: { fr: 'Asie', en: 'Asia', es: 'Asia' },
  'middle-east': { fr: 'Moyen-Orient', en: 'Middle East', es: 'Oriente Medio' },
  oceania: { fr: 'Océanie', en: 'Oceania', es: 'Oceanía' },
};

// Regrouper les pays par région pour l'affichage
export function getCountriesByRegion() {
  const regions: Record<string, Record<string, CountryData>> = {
    africa: {},
    europe: {},
    americas: {},
    asia: {},
    'middle-east': {},
    oceania: {},
  };

  Object.entries(ALL_COUNTRIES).forEach(([code, data]) => {
    regions[data.region][code] = data;
  });

  return regions;
}

// Pays les plus populaires (affichés en premier)
export const POPULAR_COUNTRIES = ['US', 'GB', 'FR', 'DE', 'CA', 'AU', 'ES', 'IT', 'BR', 'IN', 'JP', 'MX', 'NL', 'BE', 'CH'];
