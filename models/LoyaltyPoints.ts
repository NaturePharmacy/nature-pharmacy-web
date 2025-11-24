import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILoyaltyTransaction {
  type: 'earned' | 'redeemed' | 'expired' | 'bonus';
  points: number;
  description: string;
  order?: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface ILoyaltyPoints extends Document {
  _id: string;
  user: mongoose.Types.ObjectId;
  totalPoints: number; // Current available points
  lifetimePoints: number; // Total points ever earned
  transactions: ILoyaltyTransaction[];
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'; // Loyalty tier based on lifetime points
  createdAt: Date;
  updatedAt: Date;
}

const LoyaltyTransactionSchema = new Schema<ILoyaltyTransaction>({
  type: {
    type: String,
    enum: ['earned', 'redeemed', 'expired', 'bonus'],
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LoyaltyPointsSchema = new Schema<ILoyaltyPoints>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      unique: true,
      index: true,
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: [0, 'Total points cannot be negative'],
    },
    lifetimePoints: {
      type: Number,
      default: 0,
      min: [0, 'Lifetime points cannot be negative'],
    },
    transactions: [LoyaltyTransactionSchema],
    tier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Method to add points
LoyaltyPointsSchema.methods.addPoints = function (
  points: number,
  description: string,
  orderId?: string
): void {
  this.totalPoints += points;
  this.lifetimePoints += points;
  this.transactions.push({
    type: 'earned',
    points,
    description,
    order: orderId,
    createdAt: new Date(),
  });
  this.updateTier();
};

// Method to redeem points
LoyaltyPointsSchema.methods.redeemPoints = function (
  points: number,
  description: string,
  orderId?: string
): boolean {
  if (this.totalPoints < points) {
    return false;
  }
  this.totalPoints -= points;
  this.transactions.push({
    type: 'redeemed',
    points: -points,
    description,
    order: orderId,
    createdAt: new Date(),
  });
  return true;
};

// Method to add bonus points
LoyaltyPointsSchema.methods.addBonus = function (
  points: number,
  description: string
): void {
  this.totalPoints += points;
  this.lifetimePoints += points;
  this.transactions.push({
    type: 'bonus',
    points,
    description,
    createdAt: new Date(),
  });
  this.updateTier();
};

// Method to update tier based on lifetime points
LoyaltyPointsSchema.methods.updateTier = function (): void {
  if (this.lifetimePoints >= 100000) {
    this.tier = 'platinum';
  } else if (this.lifetimePoints >= 50000) {
    this.tier = 'gold';
  } else if (this.lifetimePoints >= 20000) {
    this.tier = 'silver';
  } else {
    this.tier = 'bronze';
  }
};

// Calculate points value in CFA (1 point = 1 CFA)
LoyaltyPointsSchema.methods.getPointsValue = function (): number {
  return this.totalPoints;
};

// Get tier multiplier for earning points
LoyaltyPointsSchema.methods.getTierMultiplier = function (): number {
  switch (this.tier) {
    case 'platinum':
      return 2.0; // 2x points
    case 'gold':
      return 1.5; // 1.5x points
    case 'silver':
      return 1.25; // 1.25x points
    case 'bronze':
    default:
      return 1.0; // 1x points
  }
};

// Index for efficient queries
LoyaltyPointsSchema.index({ user: 1 });
LoyaltyPointsSchema.index({ tier: 1, lifetimePoints: -1 });

const LoyaltyPoints: Model<ILoyaltyPoints> =
  mongoose.models.LoyaltyPoints ||
  mongoose.model<ILoyaltyPoints>('LoyaltyPoints', LoyaltyPointsSchema);

export default LoyaltyPoints;
