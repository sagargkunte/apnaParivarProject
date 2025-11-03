import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })
);

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth-failed' }), async (req, res) => {
  const user = req.user;
  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email, isSuperAdmin: user.isSuperAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  // store token in session so the frontend can fetch it via /auth/session
  req.session.jwt = token;
  const client = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  return res.redirect(new URL('/auth/callback', client).toString());
});

router.get('/me', async (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : req.session?.jwt || null;
  if (!token) return res.json({ user: null });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).lean();
    return res.json({ user });
  } catch {
    return res.json({ user: null });
  }
});

router.get('/session', (req, res) => {
  return res.json({ token: req.session?.jwt || null, isAuthenticated: !!req.user });
});

router.post('/logout', (req, res) => {
  req.logout?.(()=>{});
  req.session.destroy(()=>{
    res.clearCookie('connect.sid');
    return res.json({ ok: true });
  });
});

export default router;


