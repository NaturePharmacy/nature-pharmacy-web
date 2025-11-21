import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  _id: string;
  name: {
    fr: string;
    en: string;
    es: string;
  };
  slug: string;
  description?: {
    fr?: string;
    en?: string;
    es?: string;
  };
  image?: string;
  icon?: string;
  parent?: mongoose.Types.ObjectId | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      fr: {
        type: String,
        required: [true, 'French name is required'],
        trim: true,
      },
      en: {
        type: String,
        required: [true, 'English name is required'],
        trim: true,
      },
      es: {
        type: String,
        required: [true, 'Spanish name is required'],
        trim: true,
      },
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
    image: {
      type: String,
    },
    icon: {
      type: String,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
CategorySchema.index({ slug: 1 });
CategorySchema.index({ parent: 1 });

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
