import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlog extends Document {
  _id: string;
  title: {
    fr: string;
    en: string;
    es: string;
  };
  slug: string;
  excerpt: {
    fr: string;
    en: string;
    es: string;
  };
  content: {
    fr: string;
    en: string;
    es: string;
  };
  featuredImage: string;
  author: mongoose.Types.ObjectId;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  views: number;

  // SEO Fields
  seo: {
    metaTitle: {
      fr: string;
      en: string;
      es: string;
    };
    metaDescription: {
      fr: string;
      en: string;
      es: string;
    };
    metaKeywords: string[];
    ogImage?: string;
    canonicalUrl?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
      es: { type: String, required: true },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
      es: { type: String, required: true },
    },
    content: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
      es: { type: String, required: true },
    },
    featuredImage: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['health', 'nutrition', 'wellness', 'herbal', 'skincare', 'news', 'tips'],
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    seo: {
      metaTitle: {
        fr: { type: String, required: true },
        en: { type: String, required: true },
        es: { type: String, required: true },
      },
      metaDescription: {
        fr: { type: String, required: true },
        en: { type: String, required: true },
        es: { type: String, required: true },
      },
      metaKeywords: {
        type: [String],
        default: [],
      },
      ogImage: String,
      canonicalUrl: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
BlogSchema.index({ slug: 1 });
BlogSchema.index({ isPublished: 1, publishedAt: -1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ tags: 1 });

// Method to increment views
BlogSchema.methods.incrementViews = async function () {
  this.views += 1;
  await this.save();
};

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
