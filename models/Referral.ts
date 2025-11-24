import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReferral extends Document {
  _id: string;
  referrer: mongoose.Types.ObjectId; // User who refers
  referralCode: string; // Unique referral code
  referred: mongoose.Types.ObjectId[]; // Users who signed up with this code
  stats: {
    totalReferred: number;
    totalEarned: number; // Total rewards earned in CFA
    conversions: number; // Number of referred users who made a purchase
  };
  rewards: Array<{
    referredUser: mongoose.Types.ObjectId;
    order: mongoose.Types.ObjectId;
    amount: number;
    status: 'pending' | 'paid';
    createdAt: Date;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralSchema = new Schema<IReferral>(
  {
    referrer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Referrer is required'],
      unique: true,
      index: true,
    },
    referralCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    referred: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    stats: {
      totalReferred: {
        type: Number,
        default: 0,
        min: [0, 'Total referred cannot be negative'],
      },
      totalEarned: {
        type: Number,
        default: 0,
        min: [0, 'Total earned cannot be negative'],
      },
      conversions: {
        type: Number,
        default: 0,
        min: [0, 'Conversions cannot be negative'],
      },
    },
    rewards: [
      {
        referredUser: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        order: {
          type: Schema.Types.ObjectId,
          ref: 'Order',
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: [0, 'Amount cannot be negative'],
        },
        status: {
          type: String,
          enum: ['pending', 'paid'],
          default: 'pending',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique referral code before saving
ReferralSchema.pre('save', async function (next) {
  if (!this.referralCode) {
    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let code = generateCode();
    let exists = await mongoose.models.Referral.findOne({ referralCode: code });

    while (exists) {
      code = generateCode();
      exists = await mongoose.models.Referral.findOne({ referralCode: code });
    }

    this.referralCode = code;
  }
  next();
});

// Method to add a referred user
ReferralSchema.methods.addReferred = function (userId: string): void {
  if (!this.referred.includes(userId)) {
    this.referred.push(userId);
    this.stats.totalReferred += 1;
  }
};

// Method to add a reward
ReferralSchema.methods.addReward = function (
  referredUserId: string,
  orderId: string,
  amount: number
): void {
  this.rewards.push({
    referredUser: referredUserId,
    order: orderId,
    amount,
    status: 'pending',
    createdAt: new Date(),
  });
  this.stats.totalEarned += amount;
  this.stats.conversions += 1;
};

// Indexes for efficient queries
ReferralSchema.index({ referrer: 1 });
ReferralSchema.index({ referralCode: 1 });
ReferralSchema.index({ isActive: 1 });

const Referral: Model<IReferral> =
  mongoose.models.Referral || mongoose.model<IReferral>('Referral', ReferralSchema);

export default Referral;
