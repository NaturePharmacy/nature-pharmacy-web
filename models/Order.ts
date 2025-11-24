import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  productImage: string;
  seller: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  _id: string;
  orderNumber: string;
  buyer: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  shippingZone?: mongoose.Types.ObjectId;
  coupon?: {
    code: string;
    discount: number;
    couponId: mongoose.Types.ObjectId;
  };
  loyaltyPointsUsed?: number;
  loyaltyPointsEarned?: number;
  paymentMethod: 'stripe' | 'paypal' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  discount: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  deliveredAt?: Date;
  cancelledAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Buyer is required'],
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        productImage: {
          type: String,
          required: true,
        },
        seller: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
        },
        price: {
          type: Number,
          required: true,
          min: [0, 'Price cannot be negative'],
        },
      },
    ],
    shippingAddress: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },
    shippingZone: {
      type: Schema.Types.ObjectId,
      ref: 'ShippingZone',
    },
    coupon: {
      code: {
        type: String,
        uppercase: true,
      },
      discount: {
        type: Number,
        min: [0, 'Discount cannot be negative'],
      },
      couponId: {
        type: Schema.Types.ObjectId,
        ref: 'Coupon',
      },
    },
    loyaltyPointsUsed: {
      type: Number,
      default: 0,
      min: [0, 'Loyalty points used cannot be negative'],
    },
    loyaltyPointsEarned: {
      type: Number,
      default: 0,
      min: [0, 'Loyalty points earned cannot be negative'],
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'paypal', 'cash_on_delivery'],
      required: [true, 'Payment method is required'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentId: {
      type: String,
    },
    itemsPrice: {
      type: Number,
      required: true,
      min: [0, 'Items price cannot be negative'],
    },
    shippingPrice: {
      type: Number,
      required: true,
      min: [0, 'Shipping price cannot be negative'],
      default: 0,
    },
    taxPrice: {
      type: Number,
      required: true,
      min: [0, 'Tax price cannot be negative'],
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
OrderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `NP${year}${month}${day}${random}`;
  }
  next();
});

// Indexes for faster queries
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ buyer: 1 });
OrderSchema.index({ 'items.seller': 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
