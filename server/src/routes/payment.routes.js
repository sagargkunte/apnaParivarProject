import { Router } from 'express';
import { requireAuth, requireFamilyRole } from '../middleware/auth.js';
import { Payment } from '../models/Payment.js';
import { Subscription } from '../models/Subscription.js';

const router = Router();

const PAYPAL_BASE = process.env.PAYPAL_BASE || 'https://api-m.sandbox.paypal.com';

async function getPayPalAccessToken() {
  const client = (process.env.PAYPAL_CLIENT_ID || '').trim();
  const secret = (process.env.PAYPAL_CLIENT_SECRET || '').trim();
  if (!client || !secret) {
    throw new Error('PayPal credentials missing. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET');
  }
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${client}:${secret}`).toString('base64')
    },
    body: 'grant_type=client_credentials'
  });
  if (!res.ok) {
    const text = await res.text();
    let detail = '';
    try {
      const json = JSON.parse(text);
      detail = json?.error_description || json?.error || JSON.stringify(json);
    } catch {
      detail = text;
    }
    const envInfo = PAYPAL_BASE.includes('sandbox') ? 'sandbox' : 'live';
    const cid = client ? `${client.slice(0,8)}…` : 'missing';
    throw new Error(`PayPal token failed: ${res.status} ${detail} (env=${envInfo}, client=${cid})`);
  }
  const data = await res.json();
  return data.access_token;
}

router.post('/create-order', requireAuth, await requireFamilyRole(['admin1', 'admin2', 'admin3']), async (req, res) => {
  try {
    const { familyId, amountInr } = req.body;
    if (!familyId) return res.status(400).json({ error: 'familyId required' });
    const amount = (amountInr || 500).toFixed(2);
    const accessToken = await getPayPalAccessToken();
    // Create a placeholder payment record to track return
    const placeholder = await Payment.create({ familyId, userId: req.user.userId, amountInr: Number(amount), status: 'created' });
    const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
    const returnUrl = new URL('/payments/return', origin);
    returnUrl.searchParams.set('familyId', familyId);
    returnUrl.searchParams.set('paymentId', placeholder._id.toString());

    const createRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: process.env.PAYPAL_CURRENCY || 'INR',
              value: amount
            }
          }
        ],
        application_context: {
          brand_name: 'ApnaParivar',
          landing_page: 'LOGIN',
          user_action: 'PAY_NOW',
          return_url: returnUrl.toString(),
          cancel_url: `${origin}/payments/cancel`
        }
      })
    });
    const order = await createRes.json();
    if (!createRes.ok) return res.status(400).json(order);
    const approveUrl = order.links?.find(l => l.rel === 'approve')?.href;
    placeholder.paypalOrderId = order.id;
    await placeholder.save();
    return res.json({ orderId: order.id, approveUrl, paymentId: placeholder._id });
  } catch (e) {
    console.error('Create PayPal order error:', e);
    return res.status(500).json({ error: e.message || 'PayPal create order failed' });
  }
});

router.post('/capture', requireAuth, await requireFamilyRole(['admin1', 'admin2', 'admin3']), async (req, res) => {
  try {
    const { orderId, familyId, paymentId } = req.body;
    if (!orderId || !familyId || !paymentId) return res.status(400).json({ error: 'orderId, familyId, paymentId required' });
    const accessToken = await getPayPalAccessToken();
    const capRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });
    const capture = await capRes.json();
    if (!capRes.ok) return res.status(400).json(capture);
    const id = capture?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    payment.status = 'paid';
    payment.paypalCaptureId = id;
    await payment.save();

    const sub = await Subscription.findOne({ familyId });
    const now = new Date();
    const next = new Date(now);
    next.setFullYear(now.getFullYear() + 1);
    if (!sub) {
      await Subscription.create({ familyId, startedAt: now, nextDueAt: next, status: 'active' });
    } else {
      sub.status = 'active';
      sub.nextDueAt = next;
      await sub.save();
    }
    return res.json({ success: true, captureId: id });
  } catch (e) {
    console.error('Capture PayPal order error:', e);
    return res.status(500).json({ error: e.message || 'PayPal capture failed' });
  }
});

export default router;


