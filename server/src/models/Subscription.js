import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', required: true, unique: true },
    startedAt: { type: Date, default: () => new Date() },
    nextDueAt: { type: Date },
    status: { type: String, enum: ['trial', 'active', 'past_due', 'cancelled'], default: 'trial' },
    priceInrPerYear: { type: Number, default: 500 }
  },
  { timestamps: true }
);

export const Subscription = mongoose.model('Subscription', subscriptionSchema);


