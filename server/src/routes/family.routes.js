import { Router } from 'express';
import { Family } from '../models/Family.js';
import { FamilyRole } from '../models/FamilyRole.js';
import { Subscription } from '../models/Subscription.js';
import { requireAuth, requireFamilyRole } from '../middleware/auth.js';

const router = Router();

// Create a family; creator becomes admin1
router.post('/', requireAuth, async (req, res) => {
  const { name, customFields } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  // Enforce one family per admin1 (creator)
  const existingAdmin1 = await FamilyRole.findOne({ userId: req.user.userId, role: 'admin1' });
  if (existingAdmin1) return res.status(400).json({ error: 'You already own a family as admin1' });
  const family = await Family.create({ name, ownerUserId: req.user.userId, customFields });
  await FamilyRole.create({ familyId: family._id, userId: req.user.userId, role: 'admin1' });
  const trialEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  await Subscription.create({ familyId: family._id, nextDueAt: trialEnd, status: 'trial' });
  return res.status(201).json({ family });
});

// List my families
router.get('/', requireAuth, async (req, res) => {
  const roles = await FamilyRole.find({ userId: req.user.userId }).lean();
  const familyIds = roles.map((r) => r.familyId);
  const families = await Family.find({ _id: { $in: familyIds } }).lean();
  return res.json({ families, roles });
});

// Assign admin2/admin3/viewer (only admin1 can assign)
router.post('/:familyId/assign-role', requireAuth, requireFamilyRole(['admin1']), async (req, res) => {
  const { userId, role } = req.body;
  if (!['admin2', 'admin3', 'viewer'].includes(role)) return res.status(400).json({ error: 'invalid role' });
  // Only two additional admins allowed (admin2/admin3 any combination, total 2 max)
  const currentAdmins = await FamilyRole.countDocuments({ familyId: req.params.familyId, role: { $in: ['admin2', 'admin3'] } });
  if (['admin2', 'admin3'].includes(role) && currentAdmins >= 2) {
    return res.status(400).json({ error: 'Maximum of two additional admins allowed' });
  }
  const fr = await FamilyRole.findOneAndUpdate(
    { familyId: req.params.familyId, userId },
    { $set: { role } },
    { upsert: true, new: true }
  );
  return res.json({ familyRole: fr });
});

export default router;

// Update custom fields (admin1 only)
router.put('/:familyId/custom-fields', requireAuth, requireFamilyRole(['admin1']), async (req, res) => {
  const { customFields } = req.body;
  if (!Array.isArray(customFields) || customFields.length > 10) {
    return res.status(400).json({ error: 'customFields must be array with max 10 items' });
  }
  const family = await Family.findByIdAndUpdate(req.params.familyId, { $set: { customFields } }, { new: true });
  return res.json({ family });
});


