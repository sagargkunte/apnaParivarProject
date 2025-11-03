import React, { useState } from 'react';

export default function Subscription({ token, familyId }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function pay() {
    try {
      setLoading(true);
      setMessage('');
      
      // Fixed: Use API_BASE consistently and proper error handling
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';
      
      const res = await fetch(`${API_BASE}/payments/create-order`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          familyId: familyId || '', // Ensure familyId is provided
          amountInr: 500 
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.approveUrl) {
        window.location.href = data.approveUrl;
        return;
      }
      setMessage('Order created: ' + data.orderId);
    } catch (e) {
      setMessage(e.message || 'Payment failed. Please try again.');
      console.error('Payment error:', e);
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
        disabled={loading || !familyId} 
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
      
      {!familyId && (
        <div className="mt-4 p-3 bg-yellow-500/20 rounded-xl backdrop-blur-sm border border-yellow-300/30">
          <div className="text-sm text-yellow-100 text-center">Family ID is required</div>
        </div>
      )}
      
      {message && (
        <div className={`mt-4 p-3 rounded-xl backdrop-blur-sm border ${
          message.includes('error') || message.includes('failed') 
            ? 'bg-red-500/20 border-red-300/30' 
            : 'bg-white/20 border-white/30'
        }`}>
          <div className={`text-sm text-center ${
            message.includes('error') || message.includes('failed')
              ? 'text-red-100'
              : 'text-emerald-100'
          }`}>{message}</div>
        </div>
      )}
    </div>
  );
}