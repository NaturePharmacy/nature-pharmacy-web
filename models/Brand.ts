import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBrand extends Document {
  _id: string;
  name: string;
  slug: string;
  description?: {
    fr: string;
    en: string;
    es: string;
  };
  logo?: string;
  website?: string;
  country?: string;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      fr: String,
      en: String,
      es: String,
    },
    logo: String,
    website: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

BrandSchema.index({ slug: 1 });
BrandSchema.index({ name: 1 });

const Brand: Model<IBrand> =
  mongoose.models.Brand || mongoose.model<IBrand>('Brand', BrandSchema);

export default Brand;
