/**
 * Constantes pour la médecine traditionnelle
 */

// Catégories thérapeutiques
export const THERAPEUTIC_CATEGORIES = {
  DIGESTIVE: 'digestive',
  RESPIRATORY: 'respiratory',
  IMMUNE: 'immune',
  CARDIOVASCULAR: 'cardiovascular',
  NERVOUS: 'nervous',
  MUSCULOSKELETAL: 'musculoskeletal',
  SKIN: 'skin',
  URINARY: 'urinary',
  REPRODUCTIVE: 'reproductive',
  METABOLIC: 'metabolic',
  HEPATIC: 'hepatic',
  ANTI_INFLAMMATORY: 'anti_inflammatory',
  ANTIMICROBIAL: 'antimicrobial',
  ANALGESIC: 'analgesic',
} as const;

export type TherapeuticCategory = typeof THERAPEUTIC_CATEGORIES[keyof typeof THERAPEUTIC_CATEGORIES];

// Noms des catégories thérapeutiques
export const THERAPEUTIC_CATEGORY_NAMES = {
  digestive: {
    fr: 'Système digestif',
    en: 'Digestive system',
    es: 'Sistema digestivo',
  },
  respiratory: {
    fr: 'Système respiratoire',
    en: 'Respiratory system',
    es: 'Sistema respiratorio',
  },
  immune: {
    fr: 'Système immunitaire',
    en: 'Immune system',
    es: 'Sistema inmunológico',
  },
  cardiovascular: {
    fr: 'Système cardiovasculaire',
    en: 'Cardiovascular system',
    es: 'Sistema cardiovascular',
  },
  nervous: {
    fr: 'Système nerveux',
    en: 'Nervous system',
    es: 'Sistema nervioso',
  },
  musculoskeletal: {
    fr: 'Système musculo-squelettique',
    en: 'Musculoskeletal system',
    es: 'Sistema musculoesquelético',
  },
  skin: {
    fr: 'Peau et phanères',
    en: 'Skin and appendages',
    es: 'Piel y faneras',
  },
  urinary: {
    fr: 'Système urinaire',
    en: 'Urinary system',
    es: 'Sistema urinario',
  },
  reproductive: {
    fr: 'Système reproducteur',
    en: 'Reproductive system',
    es: 'Sistema reproductivo',
  },
  metabolic: {
    fr: 'Métabolisme',
    en: 'Metabolism',
    es: 'Metabolismo',
  },
  hepatic: {
    fr: 'Fonction hépatique',
    en: 'Hepatic function',
    es: 'Función hepática',
  },
  anti_inflammatory: {
    fr: 'Anti-inflammatoire',
    en: 'Anti-inflammatory',
    es: 'Antiinflamatorio',
  },
  antimicrobial: {
    fr: 'Antimicrobien',
    en: 'Antimicrobial',
    es: 'Antimicrobiano',
  },
  analgesic: {
    fr: 'Analgésique',
    en: 'Analgesic',
    es: 'Analgésico',
  },
} as const;

// Formes de produits
export const PRODUCT_FORMS = {
  POWDER: 'powder',
  CAPSULE: 'capsule',
  DRIED_PLANT: 'dried_plant',
  OIL: 'oil',
  SYRUP: 'syrup',
  TINCTURE: 'tincture',
  CREAM: 'cream',
  BALM: 'balm',
  TEA: 'tea',
  EXTRACT: 'extract',
  ROOT: 'root',
  BARK: 'bark',
  LEAVES: 'leaves',
  SEEDS: 'seeds',
  FLOWERS: 'flowers',
} as const;

export type ProductForm = typeof PRODUCT_FORMS[keyof typeof PRODUCT_FORMS];

// Noms des formes de produits
export const PRODUCT_FORM_NAMES = {
  powder: {
    fr: 'Poudre',
    en: 'Powder',
    es: 'Polvo',
  },
  capsule: {
    fr: 'Gélules',
    en: 'Capsules',
    es: 'Cápsulas',
  },
  dried_plant: {
    fr: 'Plante séchée',
    en: 'Dried plant',
    es: 'Planta seca',
  },
  oil: {
    fr: 'Huile',
    en: 'Oil',
    es: 'Aceite',
  },
  syrup: {
    fr: 'Sirop',
    en: 'Syrup',
    es: 'Jarabe',
  },
  tincture: {
    fr: 'Teinture',
    en: 'Tincture',
    es: 'Tintura',
  },
  cream: {
    fr: 'Crème',
    en: 'Cream',
    es: 'Crema',
  },
  balm: {
    fr: 'Baume',
    en: 'Balm',
    es: 'Bálsamo',
  },
  tea: {
    fr: 'Tisane',
    en: 'Tea',
    es: 'Té',
  },
  extract: {
    fr: 'Extrait',
    en: 'Extract',
    es: 'Extracto',
  },
  root: {
    fr: 'Racine',
    en: 'Root',
    es: 'Raíz',
  },
  bark: {
    fr: 'Écorce',
    en: 'Bark',
    es: 'Corteza',
  },
  leaves: {
    fr: 'Feuilles',
    en: 'Leaves',
    es: 'Hojas',
  },
  seeds: {
    fr: 'Graines',
    en: 'Seeds',
    es: 'Semillas',
  },
  flowers: {
    fr: 'Fleurs',
    en: 'Flowers',
    es: 'Flores',
  },
} as const;

// Certifications
export const CERTIFICATIONS = {
  ORGANIC: 'organic',
  FAIR_TRADE: 'fair_trade',
  TRADITIONAL: 'traditional',
  WILDCRAFTED: 'wildcrafted',
  SUSTAINABLE: 'sustainable',
  GMP: 'gmp', // Good Manufacturing Practice
  HALAL: 'halal',
  KOSHER: 'kosher',
} as const;

export type Certification = typeof CERTIFICATIONS[keyof typeof CERTIFICATIONS];

// Noms des certifications
export const CERTIFICATION_NAMES = {
  organic: {
    fr: 'Biologique',
    en: 'Organic',
    es: 'Orgánico',
  },
  fair_trade: {
    fr: 'Commerce équitable',
    en: 'Fair trade',
    es: 'Comercio justo',
  },
  traditional: {
    fr: 'Traditionnel authentique',
    en: 'Authentic traditional',
    es: 'Tradicional auténtico',
  },
  wildcrafted: {
    fr: 'Récolte sauvage',
    en: 'Wildcrafted',
    es: 'Cosecha silvestre',
  },
  sustainable: {
    fr: 'Durable',
    en: 'Sustainable',
    es: 'Sostenible',
  },
  gmp: {
    fr: 'BPF (Bonnes Pratiques de Fabrication)',
    en: 'GMP (Good Manufacturing Practice)',
    es: 'BPF (Buenas Prácticas de Fabricación)',
  },
  halal: {
    fr: 'Halal',
    en: 'Halal',
    es: 'Halal',
  },
  kosher: {
    fr: 'Casher',
    en: 'Kosher',
    es: 'Kosher',
  },
} as const;

// Indications communes
export const COMMON_INDICATIONS = {
  // Digestif
  DIGESTION: { fr: 'Digestion difficile', en: 'Difficult digestion', es: 'Digestión difícil' },
  BLOATING: { fr: 'Ballonnements', en: 'Bloating', es: 'Hinchazón' },
  CONSTIPATION: { fr: 'Constipation', en: 'Constipation', es: 'Estreñimiento' },
  DIARRHEA: { fr: 'Diarrhée', en: 'Diarrhea', es: 'Diarrea' },
  NAUSEA: { fr: 'Nausées', en: 'Nausea', es: 'Náuseas' },

  // Respiratoire
  COUGH: { fr: 'Toux', en: 'Cough', es: 'Tos' },
  BRONCHITIS: { fr: 'Bronchite', en: 'Bronchitis', es: 'Bronquitis' },
  ASTHMA: { fr: 'Asthme', en: 'Asthma', es: 'Asma' },
  SINUSITIS: { fr: 'Sinusite', en: 'Sinusitis', es: 'Sinusitis' },

  // Immunitaire
  IMMUNITY: { fr: 'Renforcement immunitaire', en: 'Immune support', es: 'Apoyo inmunológico' },
  INFECTION: { fr: 'Infections', en: 'Infections', es: 'Infecciones' },

  // Douleur
  JOINT_PAIN: { fr: 'Douleurs articulaires', en: 'Joint pain', es: 'Dolor articular' },
  MUSCLE_PAIN: { fr: 'Douleurs musculaires', en: 'Muscle pain', es: 'Dolor muscular' },
  HEADACHE: { fr: 'Maux de tête', en: 'Headache', es: 'Dolor de cabeza' },

  // Nerveux
  STRESS: { fr: 'Stress', en: 'Stress', es: 'Estrés' },
  ANXIETY: { fr: 'Anxiété', en: 'Anxiety', es: 'Ansiedad' },
  INSOMNIA: { fr: 'Insomnie', en: 'Insomnia', es: 'Insomnio' },
  DEPRESSION: { fr: 'Dépression légère', en: 'Mild depression', es: 'Depresión leve' },

  // Peau
  ECZEMA: { fr: 'Eczéma', en: 'Eczema', es: 'Eczema' },
  ACNE: { fr: 'Acné', en: 'Acne', es: 'Acné' },
  WOUND_HEALING: { fr: 'Cicatrisation', en: 'Wound healing', es: 'Cicatrización' },

  // Cardiovasculaire
  HYPERTENSION: { fr: 'Hypertension', en: 'Hypertension', es: 'Hipertensión' },
  CIRCULATION: { fr: 'Circulation sanguine', en: 'Blood circulation', es: 'Circulación sanguínea' },

  // Métabolique
  DIABETES: { fr: 'Diabète (support)', en: 'Diabetes (support)', es: 'Diabetes (apoyo)' },
  WEIGHT_LOSS: { fr: 'Perte de poids', en: 'Weight loss', es: 'Pérdida de peso' },
  CHOLESTEROL: { fr: 'Cholestérol', en: 'Cholesterol', es: 'Colesterol' },
} as const;
