import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Per-vendor shipping settings.
 * If a vendor has no settings, the global ShippingZone rules apply.
 * shippingCost is stored in USD (same convention as product prices).
 */
export interface IVendorShippingSettings extends Document {
  seller: mongoose.Types.ObjectId;
  // Default flat-rate applied when no country-specific rule matches
  defaultShippingCost: number; // USD
  freeShippingThreshold?: number; // USD — 0 means always free
  // Country-specific overrides
  countryRules: Array<{
    country: string; // ISO 3166-1 alpha-2
    shippingCost: number; // USD
    freeShippingThreshold?: number; // USD
    estimatedDeliveryDays?: { min: number; max: number };
  }>;
  // Whether this vendor offers free shipping globally
  globalFreeShipping: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VendorShippingSettingsSchema = new Schema<IVendorShippingSettings>(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    defaultShippingCost: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    freeShippingThreshold: {
      type: Number,
      min: 0,
    },
    countryRules: [
      {
        country: { type: String, required: true, uppercase: true },
        shippingCost: { type: Number, required: true, min: 0, default: 0 },
        freeShippingThreshold: { type: Number, min: 0 },
        estimatedDeliveryDays: {
          min: { type: Number, min: 0 },
          max: { type: Number, min: 0 },
        },
      },
    ],
    globalFreeShipping: {
      type: Boolean,
      default: false,
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

const VendorShippingSettings: Model<IVendorShippingSettings> =
  mongoose.models.VendorShippingSettings ||
  mongoose.model<IVendorShippingSettings>('VendorShippingSettings', VendorShippingSettingsSchema);

export default VendorShippingSettings;
