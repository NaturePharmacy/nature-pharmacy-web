import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  _id: string;
  user: mongoose.Types.ObjectId;
  type: 'order' | 'message' | 'review' | 'product' | 'system';
  title: { fr: string; en: string; es: string };
  message: { fr: string; en: string; es: string };
  link?: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    type: {
      type: String,
      enum: ['order', 'message', 'review', 'product', 'system'],
      required: [true, 'Type is required'],
    },
    title: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
      es: { type: String, required: true },
    },
    message: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
      es: { type: String, required: true },
    },
    link: {
      type: String,
      trim: true,
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
