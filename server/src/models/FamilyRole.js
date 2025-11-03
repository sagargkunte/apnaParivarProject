import mongoose from 'mongoose';

const familyRoleSchema = new mongoose.Schema(
  {
    familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, enum: ['admin1', 'admin2', 'admin3', 'viewer'], required: true }
  },
  { timestamps: true }
);
familyRoleSchema.index({ familyId: 1, role: 1 });
familyRoleSchema.index({ familyId: 1, userId: 1 }, { unique: true });

export const FamilyRole = mongoose.model('FamilyRole', familyRoleSchema);


