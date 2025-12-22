import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Import real Product model
import Product from '../models/Product';

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens
}

// Sample products data - Traditional Medicine focus
// Each product has FR as base, we'll translate to EN/ES
const sampleProducts = [
  // Plantes Médicinales (8 produits)
  {
    name: 'Moringa Bio en Poudre',
    nameEn: 'Organic Moringa Powder',
    nameEs: 'Polvo de Moringa Orgánico',
    description: 'Poudre de feuilles de Moringa oleifera séchées. Riche en vitamines, minéraux et antioxydants. Idéal pour renforcer le système immunitaire et lutter contre la fatigue.',
    descriptionEn: 'Dried Moringa oleifera leaf powder. Rich in vitamins, minerals and antioxidants. Ideal for boosting the immune system and fighting fatigue.',
    descriptionEs: 'Polvo de hojas secas de Moringa oleifera. Rico en vitaminas, minerales y antioxidantes. Ideal para fortalecer el sistema inmunológico y combatir la fatiga.',
    basePrice: 14.39,
    category: 'medicinal-plants',
    therapeuticCategory: 'Immunité',
    form: 'powder',
    stock: 150,
    tags: ['bio', 'antioxydant', 'immunité', 'fatigue'],
    certifications: ['Bio', 'Commerce Équitable'],
    origin: 'Sénégal',
    isOrganic: true,
  },
  {
    name: 'Feuilles de Kinkeliba',
    nameEn: 'Kinkeliba Leaves',
    nameEs: 'Hojas de Kinkeliba',
    description: 'Plante médicinale traditionnelle africaine excellente pour la digestion et le foie. Utilisée depuis des siècles pour ses propriétés détoxifiantes.',
    descriptionEn: 'Traditional African medicinal plant excellent for digestion and liver. Used for centuries for its detoxifying properties.',
    descriptionEs: 'Planta medicinal tradicional africana excelente para la digestión y el hígado. Utilizada durante siglos por sus propiedades desintoxicantes.',
    basePrice: 7.65,
    category: 'medicinal-plants',
    therapeuticCategory: 'Digestif',
    form: 'dried_plant',
    stock: 200,
    tags: ['détox', 'digestion', 'foie', 'traditionnel'],
    certifications: ['Naturel'],
    origin: 'Mali',
  },
  {
    name: 'Racine de Vétiver',
    nameEn: 'Vetiver Root',
    nameEs: 'Raíz de Vetiver',
    description: 'Racines de vétiver séchées aux propriétés calmantes et relaxantes. Excellent pour réduire le stress et améliorer le sommeil.',
    descriptionEn: 'Dried vetiver roots with calming and relaxing properties. Excellent for reducing stress and improving sleep.',
    descriptionEs: 'Raíces de vetiver secas con propiedades calmantes y relajantes. Excelente para reducir el estrés y mejorar el sueño.',
    basePrice: 11.69,
    category: 'medicinal-plants',
    therapeuticCategory: 'Relaxation',
    form: 'root',
    stock: 80,
    tags: ['stress', 'sommeil', 'relaxation', 'naturel'],
    certifications: ['Bio'],
    origin: 'Haïti',
    isOrganic: true,
  },
  {
    name: 'Écorce de Caïlcédrat',
    nameEn: 'Khaya Bark',
    nameEs: 'Corteza de Caoba Africana',
    description: 'Écorce traditionnelle utilisée pour traiter le paludisme et les infections. Propriétés antiparasitaires reconnues.',
    descriptionEn: 'Traditional bark used to treat malaria and infections. Recognized antiparasitic properties.',
    descriptionEs: 'Corteza tradicional utilizada para tratar la malaria y las infecciones. Propiedades antiparasitarias reconocidas.',
    basePrice: 16.66,
    category: 'medicinal-plants',
    therapeuticCategory: 'Antiparasitaire',
    form: 'bark',
    stock: 60,
    tags: ['paludisme', 'infection', 'antiparasitaire', 'traditionnel'],
    certifications: ['Naturel', 'Séché au soleil'],
    origin: 'Burkina Faso',
  },
  {
    name: 'Feuilles de Neem',
    nameEn: 'Neem Leaves',
    nameEs: 'Hojas de Neem',
    description: 'Feuilles de neem aux multiples vertus médicinales. Antibactérien, antifongique et purifiant sanguin naturel.',
    descriptionEn: 'Neem leaves with multiple medicinal virtues. Antibacterial, antifungal and natural blood purifier.',
    descriptionEs: 'Hojas de neem con múltiples virtudes medicinales. Antibacteriano, antifúngico y purificador natural de la sangre.',
    basePrice: 8.99,
    category: 'medicinal-plants',
    therapeuticCategory: 'Purification',
    form: 'leaves',
    stock: 120,
    tags: ['antibactérien', 'antifongique', 'purification', 'peau'],
    certifications: ['Bio'],
    origin: 'Inde',
    isOrganic: true,
  },
  {
    name: 'Gingembre Frais Bio',
    nameEn: 'Fresh Organic Ginger',
    nameEs: 'Jengibre Fresco Orgánico',
    description: 'Rhizome de gingembre frais cultivé biologiquement. Anti-inflammatoire puissant, excellent pour la digestion et les nausées.',
    descriptionEn: 'Fresh ginger rhizome organically grown. Powerful anti-inflammatory, excellent for digestion and nausea.',
    descriptionEs: 'Rizoma de jengibre fresco cultivado orgánicamente. Antiinflamatorio potente, excelente para la digestión y las náuseas.',
    basePrice: 5.85,
    category: 'medicinal-plants',
    therapeuticCategory: 'Digestif',
    form: 'root',
    stock: 180,
    tags: ['anti-inflammatoire', 'digestion', 'nausées', 'bio'],
    certifications: ['Bio', 'Fraîcheur garantie'],
    origin: 'Côte d\'Ivoire',
    isOrganic: true,
  },
  {
    name: 'Curcuma en Poudre',
    nameEn: 'Turmeric Powder',
    nameEs: 'Polvo de Cúrcuma',
    description: 'Curcuma moulu finement, riche en curcumine. Puissant anti-inflammatoire et antioxydant naturel.',
    descriptionEn: 'Finely ground turmeric, rich in curcumin. Powerful natural anti-inflammatory and antioxidant.',
    descriptionEs: 'Cúrcuma finamente molida, rica en curcumina. Potente antiinflamatorio y antioxidante natural.',
    basePrice: 10.79,
    category: 'medicinal-plants',
    therapeuticCategory: 'Anti-inflammatoire',
    form: 'powder',
    stock: 140,
    tags: ['curcumine', 'anti-inflammatoire', 'articulations', 'antioxydant'],
    certifications: ['Bio', 'Sans additifs'],
    origin: 'Madagascar',
    isOrganic: true,
  },
  {
    name: 'Baobab en Poudre',
    nameEn: 'Baobab Powder',
    nameEs: 'Polvo de Baobab',
    description: 'Poudre de fruit de baobab, super-aliment africain. Exceptionnellement riche en vitamine C et fibres.',
    descriptionEn: 'Baobab fruit powder, African superfood. Exceptionally rich in vitamin C and fiber.',
    descriptionEs: 'Polvo de fruta de baobab, superalimento africano. Excepcionalmente rico en vitamina C y fibra.',
    basePrice: 12.15,
    category: 'medicinal-plants',
    therapeuticCategory: 'Immunité',
    form: 'powder',
    stock: 100,
    tags: ['vitamine C', 'fibres', 'énergie', 'immunité'],
    certifications: ['Bio', 'Commerce Équitable'],
    origin: 'Sénégal',
    isOrganic: true,
  },

  // Huiles Essentielles (6 produits)
  {
    name: 'Huile Essentielle de Citronnelle',
    nameEn: 'Lemongrass Essential Oil',
    nameEs: 'Aceite Esencial de Citronela',
    description: 'Huile essentielle pure de citronnelle. Répulsif naturel contre les moustiques, propriétés antiseptiques.',
    descriptionEn: 'Pure lemongrass essential oil. Natural mosquito repellent, antiseptic properties.',
    descriptionEs: 'Aceite esencial puro de citronela. Repelente natural de mosquitos, propiedades antisépticas.',
    basePrice: 13.49,
    category: 'essential-oils',
    therapeuticCategory: 'Protection',
    form: 'oil',
    stock: 90,
    tags: ['répulsif', 'antiseptique', 'moustiques', '100% pure'],
    certifications: ['100% Pure', 'Bio'],
    origin: 'Madagascar',
    isOrganic: true,
  },
  {
    name: 'Huile Essentielle d\'Eucalyptus',
    nameEn: 'Eucalyptus Essential Oil',
    nameEs: 'Aceite Esencial de Eucalipto',
    description: 'Huile essentielle d\'eucalyptus globulus. Idéale pour les voies respiratoires et décongestion.',
    descriptionEn: 'Eucalyptus globulus essential oil. Ideal for respiratory tract and decongestion.',
    descriptionEs: 'Aceite esencial de eucalipto globulus. Ideal para las vías respiratorias y la descongestión.',
    basePrice: 14.85,
    category: 'essential-oils',
    therapeuticCategory: 'Respiratoire',
    form: 'oil',
    stock: 75,
    tags: ['respiratoire', 'décongestion', 'pure', 'toux'],
    certifications: ['100% Pure', 'Thérapeutique'],
    origin: 'Maroc',
  },
  {
    name: 'Huile Essentielle de Menthe Poivrée',
    nameEn: 'Peppermint Essential Oil',
    nameEs: 'Aceite Esencial de Menta Piperita',
    description: 'Huile essentielle de menthe poivrée rafraîchissante. Soulage les maux de tête et améliore la concentration.',
    descriptionEn: 'Refreshing peppermint essential oil. Relieves headaches and improves concentration.',
    descriptionEs: 'Aceite esencial de menta piperita refrescante. Alivia los dolores de cabeza y mejora la concentración.',
    basePrice: 14.39,
    category: 'essential-oils',
    therapeuticCategory: 'Bien-être',
    form: 'oil',
    stock: 110,
    tags: ['maux de tête', 'concentration', 'rafraîchissant', 'pure'],
    certifications: ['100% Pure', 'Bio'],
    origin: 'France',
    isOrganic: true,
  },
  {
    name: 'Huile Essentielle de Lavande',
    nameEn: 'Lavender Essential Oil',
    nameEs: 'Aceite Esencial de Lavanda',
    description: 'Huile essentielle de lavande vraie. Apaisante, favorise la relaxation et le sommeil réparateur.',
    descriptionEn: 'True lavender essential oil. Soothing, promotes relaxation and restorative sleep.',
    descriptionEs: 'Aceite esencial de lavanda verdadera. Calmante, favorece la relajación y el sueño reparador.',
    basePrice: 16.19,
    category: 'essential-oils',
    therapeuticCategory: 'Relaxation',
    form: 'oil',
    stock: 95,
    tags: ['relaxation', 'sommeil', 'apaisant', 'stress'],
    certifications: ['100% Pure', 'Bio'],
    origin: 'Provence',
    isOrganic: true,
  },
  {
    name: 'Huile Essentielle de Tea Tree',
    nameEn: 'Tea Tree Essential Oil',
    nameEs: 'Aceite Esencial de Árbol de Té',
    description: 'Huile essentielle d\'arbre à thé. Antibactérienne et antifongique puissante pour les soins de la peau.',
    descriptionEn: 'Tea tree essential oil. Powerful antibacterial and antifungal for skin care.',
    descriptionEs: 'Aceite esencial de árbol de té. Antibacteriano y antifúngico potente para el cuidado de la piel.',
    basePrice: 13.05,
    category: 'essential-oils',
    therapeuticCategory: 'Soins',
    form: 'oil',
    stock: 130,
    tags: ['antibactérien', 'acné', 'peau', 'antifongique'],
    certifications: ['100% Pure', 'Thérapeutique'],
    origin: 'Australie',
  },
  {
    name: 'Huile Essentielle de Ylang-Ylang',
    nameEn: 'Ylang-Ylang Essential Oil',
    nameEs: 'Aceite Esencial de Ylang-Ylang',
    description: 'Huile essentielle florale exotique. Équilibrante émotionnelle, aphrodisiaque naturel.',
    descriptionEn: 'Exotic floral essential oil. Emotional balancing, natural aphrodisiac.',
    descriptionEs: 'Aceite esencial floral exótico. Equilibrante emocional, afrodisíaco natural.',
    basePrice: 17.99,
    category: 'essential-oils',
    therapeuticCategory: 'Équilibre',
    form: 'oil',
    stock: 65,
    tags: ['équilibre', 'relaxation', 'aphrodisiaque', 'florale'],
    certifications: ['100% Pure', 'Premium'],
    origin: 'Comores',
  },

  // Cosmétiques Naturels (5 produits)
  {
    name: 'Beurre de Karité Pur',
    nameEn: 'Pure Shea Butter',
    nameEs: 'Manteca de Karité Pura',
    description: 'Beurre de karité brut non raffiné. Hydratant intense pour peau et cheveux, riche en vitamines A et E.',
    descriptionEn: 'Raw unrefined shea butter. Intense moisturizer for skin and hair, rich in vitamins A and E.',
    descriptionEs: 'Manteca de karité cruda sin refinar. Hidratante intenso para piel y cabello, rica en vitaminas A y E.',
    basePrice: 11.69,
    category: 'natural-cosmetics',
    therapeuticCategory: 'Hydratation',
    form: 'balm',
    stock: 160,
    tags: ['hydratant', 'naturel', 'peau', 'cheveux'],
    certifications: ['Bio', 'Non raffiné', 'Commerce Équitable'],
    origin: 'Ghana',
    isOrganic: true,
  },
  {
    name: 'Savon Noir Africain',
    nameEn: 'African Black Soap',
    nameEs: 'Jabón Negro Africano',
    description: 'Savon noir traditionnel fabriqué à partir de cendres de plantain et huile de palme. Nettoyant doux et naturel.',
    descriptionEn: 'Traditional black soap made from plantain ashes and palm oil. Gentle and natural cleanser.',
    descriptionEs: 'Jabón negro tradicional hecho de cenizas de plátano y aceite de palma. Limpiador suave y natural.',
    basePrice: 8.09,
    category: 'natural-cosmetics',
    therapeuticCategory: 'Nettoyage',
    form: 'cream',
    stock: 140,
    tags: ['nettoyant', 'traditionnel', 'doux', 'naturel'],
    certifications: ['Artisanal', 'Naturel'],
    origin: 'Togo',
  },
  {
    name: 'Huile de Coco Vierge',
    nameEn: 'Virgin Coconut Oil',
    nameEs: 'Aceite de Coco Virgen',
    description: 'Huile de coco vierge pressée à froid. Multi-usage: cuisine, soins de la peau et des cheveux.',
    descriptionEn: 'Cold-pressed virgin coconut oil. Multi-purpose: cooking, skin and hair care.',
    descriptionEs: 'Aceite de coco virgen prensado en frío. Multiuso: cocina, cuidado de la piel y el cabello.',
    basePrice: 9.45,
    category: 'natural-cosmetics',
    therapeuticCategory: 'Multi-usage',
    form: 'oil',
    stock: 170,
    tags: ['vierge', 'pression à froid', 'multi-usage', 'naturel'],
    certifications: ['Bio', 'Vierge'],
    origin: 'Philippines',
    isOrganic: true,
  },
  {
    name: 'Masque Visage à l\'Argile',
    nameEn: 'Clay Face Mask',
    nameEs: 'Mascarilla Facial de Arcilla',
    description: 'Masque purifiant à l\'argile verte et plantes médicinales. Détoxifie et clarifie les pores en profondeur.',
    descriptionEn: 'Purifying mask with green clay and medicinal plants. Detoxifies and clarifies pores deeply.',
    descriptionEs: 'Mascarilla purificante con arcilla verde y plantas medicinales. Desintoxica y aclara los poros profundamente.',
    basePrice: 15.29,
    category: 'natural-cosmetics',
    therapeuticCategory: 'Soins visage',
    form: 'cream',
    stock: 85,
    tags: ['purifiant', 'argile', 'détox', 'pores'],
    certifications: ['Bio', 'Vegan'],
    origin: 'Maroc',
    isOrganic: true,
  },
  {
    name: 'Sérum Anti-âge Naturel',
    nameEn: 'Natural Anti-Aging Serum',
    nameEs: 'Sérum Antiedad Natural',
    description: 'Sérum concentré en huiles précieuses (argan, rose musquée, jojoba). Combat les signes de vieillissement.',
    descriptionEn: 'Concentrated serum with precious oils (argan, rosehip, jojoba). Fights signs of aging.',
    descriptionEs: 'Suero concentrado con aceites preciosos (argán, rosa mosqueta, jojoba). Combate los signos del envejecimiento.',
    basePrice: 22.49,
    category: 'natural-cosmetics',
    therapeuticCategory: 'Anti-âge',
    form: 'oil',
    stock: 70,
    tags: ['anti-âge', 'sérum', 'naturel', 'rides'],
    certifications: ['Bio', 'Cruelty-free'],
    origin: 'France',
    isOrganic: true,
  },

  // Tisanes Thérapeutiques (6 produits)
  {
    name: 'Tisane Digestive',
    nameEn: 'Digestive Herbal Tea',
    nameEs: 'Infusión Digestiva',
    description: 'Mélange de menthe, fenouil et anis. Favorise la digestion et réduit les ballonnements.',
    descriptionEn: 'Blend of mint, fennel and anise. Promotes digestion and reduces bloating.',
    descriptionEs: 'Mezcla de menta, hinojo y anís. Favorece la digestión y reduce la hinchazón.',
    basePrice: 7.19,
    category: 'herbal-teas',
    therapeuticCategory: 'Digestif',
    form: 'tea',
    stock: 190,
    tags: ['digestion', 'ballonnements', 'confort', 'naturel'],
    certifications: ['Bio', 'Sans additifs'],
    origin: 'France',
    isOrganic: true,
  },
  {
    name: 'Tisane Sommeil Réparateur',
    nameEn: 'Restful Sleep Herbal Tea',
    nameEs: 'Infusión para el Sueño Reparador',
    description: 'Infusion de camomille, verveine et passiflore. Favorise l\'endormissement et un sommeil de qualité.',
    descriptionEn: 'Infusion of chamomile, verbena and passionflower. Promotes falling asleep and quality sleep.',
    descriptionEs: 'Infusión de manzanilla, verbena y pasiflora. Favorece el sueño y un sueño de calidad.',
    basePrice: 8.55,
    category: 'herbal-teas',
    therapeuticCategory: 'Sommeil',
    form: 'tea',
    stock: 150,
    tags: ['sommeil', 'relaxation', 'camomille', 'stress'],
    certifications: ['Bio', 'Naturel'],
    origin: 'Allemagne',
    isOrganic: true,
  },
  {
    name: 'Tisane Détox Foie',
    nameEn: 'Liver Detox Herbal Tea',
    nameEs: 'Infusión Detox Hígado',
    description: 'Tisane kinkeliba, romarin et pissenlit. Purifie le foie et aide à l\'élimination des toxines.',
    descriptionEn: 'Kinkeliba, rosemary and dandelion tea. Purifies the liver and helps eliminate toxins.',
    descriptionEs: 'Infusión de kinkeliba, romero y diente de león. Purifica el hígado y ayuda a eliminar toxinas.',
    basePrice: 8.09,
    category: 'herbal-teas',
    therapeuticCategory: 'Détox',
    form: 'tea',
    stock: 130,
    tags: ['détox', 'foie', 'purification', 'drainage'],
    certifications: ['Bio', 'Traditionnel'],
    origin: 'Sénégal',
    isOrganic: true,
  },
  {
    name: 'Tisane Immunité',
    nameEn: 'Immunity Herbal Tea',
    nameEs: 'Infusión Inmunidad',
    description: 'Mélange d\'échinacée, gingembre et citron. Renforce le système immunitaire naturellement.',
    descriptionEn: 'Blend of echinacea, ginger and lemon. Strengthens the immune system naturally.',
    descriptionEs: 'Mezcla de equinácea, jengibre y limón. Fortalece el sistema inmunológico naturalmente.',
    basePrice: 9.89,
    category: 'herbal-teas',
    therapeuticCategory: 'Immunité',
    form: 'tea',
    stock: 120,
    tags: ['immunité', 'défenses', 'hiver', 'vitamine C'],
    certifications: ['Bio', 'Naturel'],
    origin: 'Suisse',
    isOrganic: true,
  },
  {
    name: 'Tisane Articulations',
    nameEn: 'Joint Support Herbal Tea',
    nameEs: 'Infusión Articulaciones',
    description: 'Infusion de reine-des-prés, harpagophytum et curcuma. Soulage les douleurs articulaires.',
    descriptionEn: 'Infusion of meadowsweet, devil\'s claw and turmeric. Relieves joint pain.',
    descriptionEs: 'Infusión de reina de los prados, garra del diablo y cúrcuma. Alivia el dolor articular.',
    basePrice: 10.35,
    category: 'herbal-teas',
    therapeuticCategory: 'Articulations',
    form: 'tea',
    stock: 95,
    tags: ['articulations', 'anti-inflammatoire', 'douleur', 'mobilité'],
    certifications: ['Bio', 'Thérapeutique'],
    origin: 'France',
    isOrganic: true,
  },
  {
    name: 'Tisane Circulation',
    nameEn: 'Circulation Herbal Tea',
    nameEs: 'Infusión Circulación',
    description: 'Mélange de vigne rouge, ginkgo et hamamélis. Améliore la circulation sanguine et soulage les jambes lourdes.',
    descriptionEn: 'Blend of red vine, ginkgo and witch hazel. Improves blood circulation and relieves heavy legs.',
    descriptionEs: 'Mezcla de vid roja, ginkgo y hamamelis. Mejora la circulación sanguínea y alivia las piernas pesadas.',
    basePrice: 8.99,
    category: 'herbal-teas',
    therapeuticCategory: 'Circulation',
    form: 'tea',
    stock: 110,
    tags: ['circulation', 'jambes lourdes', 'veinotonique', 'naturel'],
    certifications: ['Bio', 'Naturel'],
    origin: 'France',
    isOrganic: true,
  },

  // Remèdes Traditionnels (3 produits)
  {
    name: 'Sirop de Tamarin',
    nameEn: 'Tamarind Syrup',
    nameEs: 'Jarabe de Tamarindo',
    description: 'Sirop traditionnel à base de pulpe de tamarin. Laxatif naturel doux, riche en antioxydants.',
    descriptionEn: 'Traditional syrup made from tamarind pulp. Gentle natural laxative, rich in antioxidants.',
    descriptionEs: 'Jarabe tradicional hecho de pulpa de tamarindo. Laxante natural suave, rico en antioxidantes.',
    basePrice: 6.29,
    category: 'traditional-remedies',
    therapeuticCategory: 'Digestif',
    form: 'syrup',
    stock: 100,
    tags: ['traditionnel', 'laxatif', 'digestion', 'naturel'],
    certifications: ['Artisanal', 'Naturel'],
    origin: 'Sénégal',
  },
  {
    name: 'Baume du Tigre Rouge',
    nameEn: 'Red Tiger Balm',
    nameEs: 'Bálsamo de Tigre Rojo',
    description: 'Baume chauffant traditionnel asiatique. Soulage douleurs musculaires et tensions.',
    descriptionEn: 'Traditional Asian warming balm. Relieves muscle pain and tension.',
    descriptionEs: 'Bálsamo calentador tradicional asiático. Alivia el dolor muscular y la tensión.',
    basePrice: 11.25,
    category: 'traditional-remedies',
    therapeuticCategory: 'Douleurs',
    form: 'balm',
    stock: 140,
    tags: ['baume', 'douleurs musculaires', 'traditionnel', 'chauffant'],
    certifications: ['Traditionnel', 'Authentique'],
    origin: 'Singapour',
  },
  {
    name: 'Clous de Girofle',
    nameEn: 'Whole Cloves',
    nameEs: 'Clavos de Olor Enteros',
    description: 'Clous de girofle entiers de qualité supérieure. Antiseptique naturel, excellent pour les maux de dents.',
    descriptionEn: 'Whole cloves of superior quality. Natural antiseptic, excellent for toothaches.',
    descriptionEs: 'Clavos de olor enteros de calidad superior. Antiséptico natural, excelente para el dolor de muelas.',
    basePrice: 5.39,
    category: 'traditional-remedies',
    therapeuticCategory: 'Dentaire',
    form: 'dried_plant',
    stock: 160,
    tags: ['antiseptique', 'dents', 'traditionnel', 'naturel'],
    certifications: ['Bio', 'Qualité supérieure'],
    origin: 'Madagascar',
    isOrganic: true,
  },

  // Compléments Naturels (2 produits)
  {
    name: 'Spiruline en Comprimés',
    nameEn: 'Spirulina Tablets',
    nameEs: 'Tabletas de Espirulina',
    description: 'Comprimés de spiruline pure. Super-aliment riche en protéines, fer et vitamines B.',
    descriptionEn: 'Pure spirulina tablets. Superfood rich in protein, iron and B vitamins.',
    descriptionEs: 'Tabletas de espirulina pura. Superalimento rico en proteínas, hierro y vitaminas B.',
    basePrice: 17.99,
    category: 'supplements',
    therapeuticCategory: 'Énergie',
    form: 'capsule',
    stock: 130,
    tags: ['spiruline', 'protéines', 'fer', 'énergie'],
    certifications: ['Bio', 'Vegan', 'Sans additifs'],
    origin: 'France',
    isOrganic: true,
  },
  {
    name: 'Gélules de Chardon-Marie',
    nameEn: 'Milk Thistle Capsules',
    nameEs: 'Cápsulas de Cardo Mariano',
    description: 'Complément alimentaire au chardon-marie. Soutient la fonction hépatique et la détoxification.',
    descriptionEn: 'Milk thistle dietary supplement. Supports liver function and detoxification.',
    descriptionEs: 'Suplemento dietético de cardo mariano. Apoya la función hepática y la desintoxicación.',
    basePrice: 15.75,
    category: 'supplements',
    therapeuticCategory: 'Détox',
    form: 'capsule',
    stock: 100,
    tags: ['foie', 'détox', 'chardon-marie', 'hépatique'],
    certifications: ['Bio', 'Naturel'],
    origin: 'Allemagne',
    isOrganic: true,
  },
];

async function createSampleProducts() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get Category model
    const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({
      name: {
        fr: String,
        en: String,
        es: String,
      },
      slug: String,
    }));

    // Get a seller user
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
      email: String,
      name: String,
      role: String,
    }));

    let seller = await User.findOne({ role: 'seller' });
    if (!seller) {
      console.log('⚠️  No seller found, creating a dummy seller ID');
      seller = { _id: new mongoose.Types.ObjectId() };
    }

    console.log(`👤 Using seller ID: ${seller._id}`);

    // Fetch all categories
    const categories = await Category.find({});
    const categoryMap: { [key: string]: any } = {};

    categories.forEach((cat: any) => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log(`📂 Found ${categories.length} categories`);
    console.log(`\n📦 Creating ${sampleProducts.length} sample products...\n`);

    const images = ['/12.jpeg', '/13.jpeg', '/14.jpeg'];
    let successCount = 0;
    const COMMISSION_RATE = 0.11; // 11% commission

    // Map our category names to actual slugs in database
    const categorySlugMap: { [key: string]: string } = {
      'medicinal-plants': 'herbes-medicinales',
      'essential-oils': 'huiles-essentielles',
      'natural-cosmetics': 'cosmetiques-naturels',
      'herbal-teas': 'aliments-bio', // Map herbal teas to aliments-bio
      'traditional-remedies': 'herbes-medicinales', // Map to herbes-medicinales
      'supplements': 'aliments-bio', // Map supplements to aliments-bio
    };

    for (const productData of sampleProducts) {
      try {
        // Generate slug
        const slug = generateSlug(productData.name);

        // Check if product with this slug already exists
        const existingProduct = await Product.findOne({ slug });
        if (existingProduct) {
          console.log(`⚠️  Skipping: ${productData.name} (slug already exists)`);
          continue;
        }

        // Randomly assign 1-3 images to each product
        const numImages = Math.floor(Math.random() * 3) + 1;
        const productImages: string[] = [];
        for (let i = 0; i < numImages; i++) {
          productImages.push(images[i % images.length]);
        }

        // Get category ID - use mapping to match actual slugs
        const actualSlug = categorySlugMap[productData.category] || productData.category;
        const categoryId = categoryMap[actualSlug];
        if (!categoryId) {
          console.error(`❌ Category not found: ${productData.category} (mapped to: ${actualSlug})`);
          continue;
        }

        // Calculate commission and final price
        const basePrice = productData.basePrice;
        const commission = Math.round((basePrice * COMMISSION_RATE) * 100) / 100;
        const price = Math.round((basePrice + commission) * 100) / 100;

        const product = new Product({
          name: {
            fr: productData.name,
            en: productData.nameEn,
            es: productData.nameEs,
          },
          description: {
            fr: productData.description,
            en: productData.descriptionEn,
            es: productData.descriptionEs,
          },
          slug,
          seller: seller._id,
          category: categoryId,
          images: productImages,
          basePrice,
          price,
          commission,
          stock: productData.stock,
          isOrganic: productData.isOrganic || false,
          isFeatured: Math.random() > 0.7, // 30% chance of being featured
          isActive: true,
          rating: Math.floor(Math.random() * 15) / 10 + 4, // Random rating between 4.0-5.5, capped at 5
          reviewCount: Math.floor(Math.random() * 50) + 5,
          tags: productData.tags,
          therapeuticCategory: productData.therapeuticCategory,
          form: productData.form,
          certifications: productData.certifications,
          origin: productData.origin,
        });

        // Cap rating at 5.0
        if (product.rating > 5) product.rating = 5;

        await product.save();
        successCount++;
        console.log(`✅ Created: ${productData.name} (${productData.category}) - ${price.toFixed(2)} USD`);
      } catch (error: any) {
        console.error(`❌ Error creating ${productData.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully created ${successCount}/${sampleProducts.length} products!`);

    // Show summary by category
    const summary = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: '$categoryInfo'
      },
      {
        $group: {
          _id: '$categoryInfo.slug',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\n📊 Products by category:');
    summary.forEach((item: any) => {
      console.log(`   ${item._id}: ${item.count} products`);
    });

    // Show total products
    const totalProducts = await Product.countDocuments();
    console.log(`\n📦 Total products in database: ${totalProducts}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

createSampleProducts();
