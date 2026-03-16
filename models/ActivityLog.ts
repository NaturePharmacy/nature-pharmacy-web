import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityLog extends Document {
  adminId: mongoose.Types.ObjectId;
  adminEmail: string;
  adminName: string;
  action: string; // e.g. 'product.approve', 'order.refund', 'user.role_change'
  resourceType: string; // 'product' | 'order' | 'user' | 'ticket' | 'review' | 'coupon' | 'settings'
  resourceId?: string;
  resourceLabel?: string; // human-readable identifier (order number, product name, email...)
  before?: Record<string, any>;
  after?: Record<string, any>;
  meta?: Record<string, any>; // extra context (refund amount, rejection reason...)
  ipAddress?: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    adminEmail: { type: String, required: true },
    adminName: { type: String, required: true },
    action: { type: String, required: true, trim: true },
    resourceType: { type: String, required: true, trim: true },
    resourceId: { type: String, trim: true },
    resourceLabel: { type: String, trim: true },
    before: { type: Schema.Types.Mixed },
    after: { type: Schema.Types.Mixed },
    meta: { type: Schema.Types.Mixed },
    ipAddress: { type: String, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ActivityLogSchema.index({ adminId: 1 });
ActivityLogSchema.index({ action: 1 });
ActivityLogSchema.index({ resourceType: 1, resourceId: 1 });
ActivityLogSchema.index({ createdAt: -1 });

const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

export default ActivityLog;
