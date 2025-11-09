import { Router } from 'express';
import { Member } from '../models/Member.js';
import { requireAuth, requireFamilyRole } from '../middleware/auth.js';

const router = Router();

// Create member (admins only)
router.post('/', requireAuth, requireFamilyRole(['admin1', 'admin2', 'admin3']), async (req, res) => {
  try {
    const member = await Member.create(req.body);
    return res.status(201).json({ member });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Update member (admins only) - FIXED with proper middleware chain
router.put('/:memberId', requireAuth, 
  // First, get the member and set familyId
  async (req, res, next) => {
    try {
      const member = await Member.findById(req.params.memberId);
      if (!member) return res.status(404).json({ error: 'Not found' });
      req.member = member;
      req.params.familyId = member.familyId.toString();
      next();
    } catch (error) {
      next(error);
    }
  },
  // Then check permissions
  requireFamilyRole(['admin1', 'admin2', 'admin3']),
  // Finally, update the member
  async (req, res) => {
    try {
      Object.assign(req.member, req.body);
      await req.member.save();
      return res.json({ member: req.member });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
);

// Get members by family (viewers can see)
router.get('/by-family/:familyId', requireAuth, requireFamilyRole(['admin1', 'admin2', 'admin3', 'viewer']), async (req, res) => {
  try {
    const members = await Member.find({ familyId: req.params.familyId }).lean();
    return res.json({ members });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Search members - FIXED with proper middleware chain
router.get('/search', requireAuth,
  // First, set familyId from query to params
  (req, res, next) => {
    const { familyId, q } = req.query;
    if (!familyId || !q) return res.status(400).json({ error: 'familyId and q required' });
    req.params.familyId = familyId;
    next();
  },
  // Then check permissions
  requireFamilyRole(['admin1', 'admin2', 'admin3', 'viewer']),
  // Finally, perform search
  async (req, res) => {
    try {
      const { familyId, q } = req.query;
      const members = await Member.find({
        familyId,
        $or: [
          { $text: { $search: q } },
          { 'customValues.value': { $regex: q, $options: 'i' } }
        ]
      }).lean();
      return res.json({ members });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

export default router;