import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoupon extends Document {
  _id: string;
  code: string;
  description: {
    fr: string;
    en: string;
    es: string;
  };
  type: 'percentage' | 'fixed'; // Percentage off or fixed amount
  value: number; // Percentage (0-100) or fixed amount in CFA
  minPurchase?: number; // Minimum purchase amount required
  maxDiscount?: number; // Maximum discount amount (for percentage coupons)
  usageLimit?: number; // Total number of times coupon can be used
  usageCount: number; // Current usage count
  perUserLimit?: number; // Max uses per user
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  applicableCategories?: mongoose.Types.ObjectId[]; // If empty, applies to all
  applicableProducts?: mongoose.Types.ObjectId[]; // Specific products
  excludedCategories?: mongoose.Types.ObjectId[];
  excludedProducts?: mongoose.Types.ObjectId[];
  firstPurchaseOnly?: boolean; // Only for first-time buyers
  createdBy: mongoose.Types.ObjectId; // Admin who created it
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
      es: { type: String, required: true },
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: [true, 'Coupon type is required'],
    },
    value: {
      type: Number,
      required: [true, 'Coupon value is required'],
      min: [0, 'Value cannot be negative'],
    },
    minPurchase: {
      type: Number,
      min: [0, 'Minimum purchase cannot be negative'],
    },
    maxDiscount: {
      type: Number,
      min: [0, 'Maximum discount cannot be negative'],
    },
    usageLimit: {
      type: Number,
      min: [1, 'Usage limit must be at least 1'],
    },
    usageCount: {
      type: Number,
      default: 0,
      min: [0, 'Usage count cannot be negative'],
    },
    perUserLimit: {
      type: Number,
      min: [1, 'Per user limit must be at least 1'],
      default: 1,
    },
    validFrom: {
      type: Date,
      required: [true, 'Valid from date is required'],
    },
    validUntil: {
      type: Date,
      required: [true, 'Valid until date is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    applicableCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    applicableProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    excludedCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    excludedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    firstPurchaseOnly: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
CouponSchema.index({ code: 1, isActive: 1 });
CouponSchema.index({ validFrom: 1, validUntil: 1 });
CouponSchema.index({ isActive: 1, validUntil: 1 });

// Method to check if coupon is currently valid
CouponSchema.methods.isValid = function (): boolean {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    (!this.usageLimit || this.usageCount < this.usageLimit)
  );
};

// Method to calculate discount for a given amount
CouponSchema.methods.calculateDiscount = function (amount: number): number {
  if (this.minPurchase && amount < this.minPurchase) {
    return 0;
  }

  let discount = 0;
  if (this.type === 'percentage') {
    discount = (amount * this.value) / 100;
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else {
    discount = this.value;
  }

  return Math.min(discount, amount); // Discount cannot exceed total amount
};

const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
