import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = Router();

router.get('/lookup', requireAuth, async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'email required' });
  const user = await User.findOne({ email }).lean();
  if (!user) return res.status(404).json({ error: 'not found' });
  return res.json({ user: { _id: user._id, email: user.email, name: user.name } });
});

export default router;


