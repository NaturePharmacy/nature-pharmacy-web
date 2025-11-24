import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IShippingZone extends Document {
  _id: string;
  name: {
    fr: string;
    en: string;
    es: string;
  };
  description?: {
    fr: string;
    en: string;
    es: string;
  };
  countries: string[]; // ISO country codes
  regions?: string[]; // Specific regions/cities
  shippingCost: number; // Base shipping cost
  freeShippingThreshold?: number; // Minimum order amount for free shipping
  estimatedDeliveryDays: {
    min: number;
    max: number;
  };
  isActive: boolean;
  priority: number; // Lower number = higher priority (for overlapping zones)
  createdAt: Date;
  updatedAt: Date;
}

const ShippingZoneSchema = new Schema<IShippingZone>(
  {
    name: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
      es: { type: String, required: true },
    },
    description: {
      fr: { type: String },
      en: { type: String },
      es: { type: String },
    },
    countries: {
      type: [String],
      required: true,
      index: true,
    },
    regions: {
      type: [String],
      default: [],
    },
    shippingCost: {
      type: Number,
      required: true,
      min: 0,
    },
    freeShippingThreshold: {
      type: Number,
      min: 0,
    },
    estimatedDeliveryDays: {
      min: {
        type: Number,
        required: true,
        min: 0,
      },
      max: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    priority: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
ShippingZoneSchema.index({ countries: 1, isActive: 1, priority: 1 });

// Virtual to calculate if order qualifies for free shipping
ShippingZoneSchema.methods.calculateShippingCost = function(orderTotal: number): number {
  if (this.freeShippingThreshold && orderTotal >= this.freeShippingThreshold) {
    return 0;
  }
  return this.shippingCost;
};

const ShippingZone: Model<IShippingZone> =
  mongoose.models.ShippingZone || mongoose.model<IShippingZone>('ShippingZone', ShippingZoneSchema);

export default ShippingZone;
