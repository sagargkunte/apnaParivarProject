import React, { useState } from 'react';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

export default function Subscription({ token, familyId }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function pay() {
    try {
      setLoading(true);
      setMessage('');
      const res = await fetch(`${API_BASE}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ familyId, amountInr: 500 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to create order');
      alert('Order created. Integrate Razorpay Checkout widget here.');
      setMessage('Order created: ' + data.orderId);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="font-medium mb-2">Subscription</div>
      <div className="text-sm text-slate-600 mb-3">Free for the first year, then ₹500/year.</div>
      <button disabled={loading} onClick={pay} className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-500 disabled:opacity-50">Pay ₹500</button>
      {message && <div className="text-sm text-slate-600 mt-2">{message}</div>}
    </div>
  );
}


