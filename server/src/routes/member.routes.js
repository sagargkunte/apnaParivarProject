import { Router } from 'express';
import { Member } from '../models/Member.js';
import { requireAuth, requireFamilyRole } from '../middleware/auth.js';

const router = Router();

// Create member (admins only)
router.post('/', requireAuth, await requireFamilyRole(['admin1', 'admin2', 'admin3']), async (req, res) => {
  const member = await Member.create(req.body);
  return res.status(201).json({ member });
});

// Update member (admins only)
router.put('/:memberId', requireAuth, async (req, res) => {
  const member = await Member.findById(req.params.memberId);
  if (!member) return res.status(404).json({ error: 'Not found' });
  // access control
  req.params.familyId = member.familyId.toString();
  const guard = await requireFamilyRole(['admin1', 'admin2', 'admin3']);
  await guard(req, res, async () => {});
  if (res.headersSent) return; // guard rejected
  Object.assign(member, req.body);
  await member.save();
  return res.json({ member });
});

// Get members by family (viewers can see)
router.get('/by-family/:familyId', requireAuth, await requireFamilyRole(['admin1', 'admin2', 'admin3', 'viewer']), async (req, res) => {
  const members = await Member.find({ familyId: req.params.familyId }).lean();
  return res.json({ members });
});

// Search members by name or keyword in custom values
router.get('/search', requireAuth, async (req, res) => {
  const { familyId, q } = req.query;
  if (!familyId || !q) return res.status(400).json({ error: 'familyId and q required' });
  const guard = await requireFamilyRole(['admin1', 'admin2', 'admin3', 'viewer']);
  await guard(req, res, async () => {});
  if (res.headersSent) return;
  const members = await Member.find({
    familyId,
    $or: [
      { $text: { $search: q } },
      { 'customValues.value': { $regex: q, $options: 'i' } }
    ]
  }).lean();
  return res.json({ members });
});

export default router;


