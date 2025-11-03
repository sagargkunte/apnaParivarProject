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
    <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <span className="text-xl">⭐</span>
        </div>
        <div>
          <div className="font-semibold text-lg">Premium Subscription</div>
          <div className="text-emerald-100 text-sm">Unlock full features</div>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-emerald-100">
          <span className="text-sm">✓</span>
          <span className="text-sm">Free for first year</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-100">
          <span className="text-sm">✓</span>
          <span className="text-sm">Then ₹500/year</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-100">
          <span className="text-sm">✓</span>
          <span className="text-sm">Premium features</span>
        </div>
      </div>

      <button 
        disabled={loading} 
        onClick={pay} 
        className="w-full px-6 py-3 rounded-xl bg-white text-emerald-600 font-semibold hover:bg-emerald-50 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </>
        ) : (
          <>
            <span>💎</span>
            Pay ₹500 / year
          </>
        )}
      </button>
      
      {message && (
        <div className="mt-4 p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
          <div className="text-sm text-emerald-100 text-center">{message}</div>
        </div>
      )}
    </div>
  );
}