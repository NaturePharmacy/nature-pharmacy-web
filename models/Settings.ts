import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
  _id: string;
  commissionRate: number; // Pourcentage de commission (ex: 10 pour 10%)
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    commissionRate: {
      type: Number,
      required: true,
      default: 10,
      min: [0, 'Commission rate cannot be negative'],
      max: [100, 'Commission rate cannot exceed 100%'],
    },
  },
  {
    timestamps: true,
  }
);

const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
