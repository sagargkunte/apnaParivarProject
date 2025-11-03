import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    pictureUrl: { type: String },
    provider: { type: String, enum: ['google'], default: 'google' },
    // global roles
    isSuperAdmin: { type: Boolean, default: false },
    // per-family roles will be in FamilyRole collection
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);


