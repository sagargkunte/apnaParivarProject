// import { Router } from 'express';
// import Razorpay from 'razorpay';
// import crypto from 'crypto';
// import { requireAuth, requireFamilyRole } from '../middleware/auth.js';
// import { Payment } from '../models/Payment.js';
// import { Subscription } from '../models/Subscription.js';

// const router = Router();

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID || '',
//   key_secret: process.env.RAZORPAY_KEY_SECRET || ''
// });

// router.post('/create-order', requireAuth, await requireFamilyRole(['admin1', 'admin2', 'admin3']), async (req, res) => {
//   const { familyId, amountInr } = req.body;
//   const amountPaise = (amountInr || 500) * 100;
//   const order = await razorpay.orders.create({ amount: amountPaise, currency: 'INR' });
//   const payment = await Payment.create({ familyId, userId: req.user.userId, amountInr: amountPaise / 100, razorpayOrderId: order.id });
//   return res.json({ orderId: order.id, amount: amountPaise, currency: 'INR', paymentId: payment._id });
// });

// router.post('/verify', requireAuth, await requireFamilyRole(['admin1', 'admin2', 'admin3']), async (req, res) => {
//   const { familyId, razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;
//   const body = razorpay_order_id + '|' + razorpay_payment_id;
//   const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '').update(body).digest('hex');
//   const isValid = expectedSignature === razorpay_signature;
//   const payment = await Payment.findById(paymentId);
//   if (!payment) return res.status(404).json({ error: 'Payment not found' });
//   if (!isValid) {
//     payment.status = 'failed';
//     await payment.save();
//     return res.status(400).json({ error: 'Signature mismatch' });
//   }
//   payment.status = 'paid';
//   payment.razorpayPaymentId = razorpay_payment_id;
//   payment.razorpaySignature = razorpay_signature;
//   await payment.save();

//   const sub = await Subscription.findOne({ familyId });
//   const now = new Date();
//   const next = new Date(now);
//   next.setFullYear(now.getFullYear() + 1);
//   if (!sub) {
//     await Subscription.create({ familyId, startedAt: now, nextDueAt: next, status: 'active' });
//   } else {
//     sub.status = 'active';
//     sub.nextDueAt = next;
//     await sub.save();
//   }
//   return res.json({ success: true });
// });

// export default router;


