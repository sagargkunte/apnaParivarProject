import mongoose from 'mongoose';

const customFieldSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: ['text', 'date', 'number', 'url'], default: 'text' }
  },
  { _id: false }
);

const familySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customFields: { type: [customFieldSchema], default: [] },
    // billing
    createdAtMs: { type: Number, default: () => Date.now() },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Family = mongoose.model('Family', familySchema);


