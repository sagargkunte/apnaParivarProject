import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    caption: { type: String }
  },
  { _id: false }
);

const customValueSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed }
  },
  { _id: false }
);

const memberSchema = new mongoose.Schema(
  {
    familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', required: true, index: true },
    name: { type: String, required: true, index: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    birthDate: { type: Date },
    relation: { type: String },
    // graph relationships
    fatherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    motherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    spouseIds: { type: [mongoose.Schema.Types.ObjectId], ref: 'Member', default: [] },
    siblingIds: { type: [mongoose.Schema.Types.ObjectId], ref: 'Member', default: [] },
    photos: { type: [photoSchema], default: [] },
    customValues: { type: [customValueSchema], default: [] }
  },
  { timestamps: true }
);

memberSchema.index({ familyId: 1, name: 'text' });

export const Member = mongoose.model('Member', memberSchema);


