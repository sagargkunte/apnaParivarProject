import jwt from 'jsonwebtoken';
import { FamilyRole } from '../models/FamilyRole.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { userId, email, isSuperAdmin }
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export async function requireFamilyRole(allowedRoles) {
  return async (req, res, next) => {
    const familyId = req.params.familyId || req.body.familyId || req.query.familyId;
    if (!familyId) return res.status(400).json({ error: 'familyId required' });
    if (req.user?.isSuperAdmin) return next();
    const fr = await FamilyRole.findOne({ familyId, userId: req.user.userId });
    if (!fr) return res.status(403).json({ error: 'Forbidden' });
    if (!allowedRoles.includes(fr.role)) return res.status(403).json({ error: 'Forbidden' });
    req.familyRole = fr;
    return next();
  };
}


