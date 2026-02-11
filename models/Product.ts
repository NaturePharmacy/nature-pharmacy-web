import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
  name: {
    fr: string;
    en: string;
    es: string;
  };
  description: {
    fr: string;
    en: string;
    es: string;
  };
  slug: string;
  seller: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  images: string[];
  basePrice: number; // Prix de base du vendeur (sans commission)
  price: number; // Prix final affiché au client (basePrice + commission)
  commission: number; // Montant de la commission calculé
  compareAtPrice?: number;
  stock: number;
  sku?: string;
  weight?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  isOrganic: boolean;
  isFeatured: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  tags?: string[];

  // Champs spécifiques médecine traditionnelle
  therapeuticCategory?: string; // Catégorie thérapeutique (Digestif, Respiratoire, etc.)
  indications?: {
    fr: string[];
    en: string[];
    es: string[];
  }; // Indications thérapeutiques
  traditionalUses?: {
    fr: string;
    en: string;
    es: string;
  }; // Utilisations traditionnelles
  contraindications?: {
    fr: string[];
    en: string[];
    es: string[];
  }; // Contre-indications
  dosage?: {
    fr: string;
    en: string;
    es: string;
  }; // Posologie recommandée
  preparationMethod?: {
    fr: string;
    en: string;
    es: string;
  }; // Méthode de préparation
  activeIngredients?: {
    fr: string[];
    en: string[];
    es: string[];
  }; // Principes actifs

  // Origine et authenticité
  origin?: string; // Pays/région d'origine
  harvestMethod?: string; // Méthode de récolte
  certifications?: string[]; // Bio, équitable, traditionnelle, etc.

  // Forme et format
  form?: string; // "powder", "capsule", "dried_plant", "oil", "syrup", etc.
  concentration?: string; // Pour extraits et concentrés

  // Sécurité et avertissements
  warnings?: {
    pregnancy?: boolean; // Déconseillé pendant la grossesse
    breastfeeding?: boolean; // Déconseillé pendant l'allaitement
    children?: boolean; // Déconseillé aux enfants
    minAge?: number; // Âge minimum
    prescriptionRequired?: boolean; // Prescription requise
  };

  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      fr: {
        type: String,
        required: [true, 'French name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters'],
      },
      en: {
        type: String,
        required: [true, 'English name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters'],
      },
      es: {
        type: String,
        required: [true, 'Spanish name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters'],
      },
    },
    description: {
      fr: {
        type: String,
        required: [true, 'French description is required'],
      },
      en: {
        type: String,
        required: [true, 'English description is required'],
      },
      es: {
        type: String,
        required: [true, 'Spanish description is required'],
      },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller is required'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    images: {
      type: [String],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Base price cannot be negative'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    commission: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Commission cannot be negative'],
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare at price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    weight: {
      type: String,
    },
    dimensions: {
      length: {
        type: Number,
        min: [0, 'Length cannot be negative'],
      },
      width: {
        type: Number,
        min: [0, 'Width cannot be negative'],
      },
      height: {
        type: Number,
        min: [0, 'Height cannot be negative'],
      },
    },
    isOrganic: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative'],
    },
    tags: {
      type: [String],
      default: [],
    },

    // Champs médecine traditionnelle
    therapeuticCategory: {
      type: String,
      trim: true,
    },
    indications: {
      fr: [String],
      en: [String],
      es: [String],
    },
    traditionalUses: {
      fr: String,
      en: String,
      es: String,
    },
    contraindications: {
      fr: [String],
      en: [String],
      es: [String],
    },
    dosage: {
      fr: String,
      en: String,
      es: String,
    },
    preparationMethod: {
      fr: String,
      en: String,
      es: String,
    },
    activeIngredients: {
      fr: [String],
      en: [String],
      es: [String],
    },

    // Origine et authenticité
    origin: {
      type: String,
      trim: true,
    },
    harvestMethod: {
      type: String,
      trim: true,
    },
    certifications: {
      type: [String],
      default: [],
    },

    // Forme et format
    form: {
      type: String,
      enum: ['powder', 'capsule', 'dried_plant', 'oil', 'syrup', 'tincture', 'cream', 'balm', 'tea', 'extract', 'root', 'bark', 'leaves', 'seeds', 'flowers'],
      trim: true,
    },
    concentration: {
      type: String,
      trim: true,
    },

    // Sécurité et avertissements
    warnings: {
      pregnancy: {
        type: Boolean,
        default: false,
      },
      breastfeeding: {
        type: Boolean,
        default: false,
      },
      children: {
        type: Boolean,
        default: false,
      },
      minAge: {
        type: Number,
        min: [0, 'Minimum age cannot be negative'],
      },
      prescriptionRequired: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries (slug index created automatically by unique: true)
ProductSchema.index({ seller: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ isActive: 1, createdAt: -1 });
ProductSchema.index({ isActive: 1, category: 1, createdAt: -1 });
ProductSchema.index({ isOrganic: 1, isActive: 1 });

// Indexes pour médecine traditionnelle
ProductSchema.index({ therapeuticCategory: 1 });
ProductSchema.index({ form: 1 });
ProductSchema.index({ origin: 1 });
ProductSchema.index({ 'warnings.pregnancy': 1 });
ProductSchema.index({ 'warnings.children': 1 });
ProductSchema.index({ therapeuticCategory: 1, isActive: 1 });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
