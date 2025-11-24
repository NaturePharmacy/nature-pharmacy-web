import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITicketMessage {
  sender: mongoose.Types.ObjectId;
  senderType: 'user' | 'admin';
  message: string;
  attachments?: string[];
  createdAt: Date;
}

export interface ITicket extends Document {
  _id: string;
  ticketNumber: string;
  user: mongoose.Types.ObjectId;
  subject: string;
  category: 'order' | 'product' | 'payment' | 'shipping' | 'account' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed';
  messages: ITicketMessage[];
  assignedTo?: mongoose.Types.ObjectId;
  relatedOrder?: mongoose.Types.ObjectId;
  relatedProduct?: mongoose.Types.ObjectId;
  tags?: string[];
  lastResponseAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TicketMessageSchema = new Schema<ITicketMessage>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderType: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [5000, 'Message cannot exceed 5000 characters'],
  },
  attachments: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TicketSchema = new Schema<ITicket>(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    category: {
      type: String,
      enum: ['order', 'product', 'payment', 'shipping', 'account', 'technical', 'other'],
      required: [true, 'Category is required'],
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'waiting_user', 'resolved', 'closed'],
      default: 'open',
      index: true,
    },
    messages: [TicketMessageSchema],
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    relatedOrder: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    relatedProduct: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    tags: [
      {
        type: String,
      },
    ],
    lastResponseAt: {
      type: Date,
    },
    resolvedAt: {
      type: Date,
    },
    closedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Generate ticket number before saving
TicketSchema.pre('save', async function (next) {
  if (!this.ticketNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    this.ticketNumber = `TKT${year}${month}${random}`;
  }
  next();
});

// Update lastResponseAt when message is added
TicketSchema.pre('save', function (next) {
  if (this.isModified('messages') && this.messages.length > 0) {
    this.lastResponseAt = this.messages[this.messages.length - 1].createdAt;
  }
  next();
});

// Indexes for efficient queries
TicketSchema.index({ user: 1, status: 1 });
TicketSchema.index({ assignedTo: 1, status: 1 });
TicketSchema.index({ category: 1, status: 1 });
TicketSchema.index({ priority: 1, status: 1 });
TicketSchema.index({ createdAt: -1 });

const Ticket: Model<ITicket> =
  mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);

export default Ticket;
