import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWishlist extends Document {
  _id: string;
  user: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      unique: true,
      index: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
WishlistSchema.index({ user: 1, products: 1 });

const Wishlist: Model<IWishlist> =
  mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema);

export default Wishlist;
