import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDispute extends Document {
  _id: string;
  disputeNumber: string;
  order: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  reason: 'not_received' | 'not_as_described' | 'defective' | 'wrong_item' | 'other';
  description: string;
  status: 'open' | 'under_review' | 'resolved_buyer' | 'resolved_seller' | 'closed';
  resolution?: string;
  refundAmount?: number;
  messages: Array<{
    sender: mongoose.Types.ObjectId;
    senderRole: 'buyer' | 'seller' | 'admin';
    message: string;
    createdAt: Date;
  }>;
  evidence: string[];
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DisputeSchema = new Schema<IDispute>(
  {
    disputeNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order is required'],
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Buyer is required'],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller is required'],
    },
    reason: {
      type: String,
      enum: ['not_received', 'not_as_described', 'defective', 'wrong_item', 'other'],
      required: [true, 'Reason is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['open', 'under_review', 'resolved_buyer', 'resolved_seller', 'closed'],
      default: 'open',
    },
    resolution: {
      type: String,
      maxlength: [2000, 'Resolution cannot exceed 2000 characters'],
    },
    refundAmount: {
      type: Number,
      min: [0, 'Refund amount cannot be negative'],
    },
    messages: [
      {
        sender: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        senderRole: {
          type: String,
          enum: ['buyer', 'seller', 'admin'],
          required: true,
        },
        message: {
          type: String,
          required: true,
          maxlength: [2000, 'Message cannot exceed 2000 characters'],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    evidence: [
      {
        type: String,
        trim: true,
      },
    ],
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Generate dispute number before validation
DisputeSchema.pre('validate', function (next) {
  if (!this.disputeNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.disputeNumber = `DSP${year}${month}${day}${random}`;
  }
  next();
});

// Indexes for faster queries
DisputeSchema.index({ order: 1 });
DisputeSchema.index({ buyer: 1 });
DisputeSchema.index({ seller: 1 });
DisputeSchema.index({ status: 1 });
DisputeSchema.index({ createdAt: -1 });

const Dispute: Model<IDispute> =
  mongoose.models.Dispute || mongoose.model<IDispute>('Dispute', DisputeSchema);

export default Dispute;
