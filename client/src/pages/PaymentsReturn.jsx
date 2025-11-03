import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

export default function PaymentsReturn({ token }) {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [msg, setMsg] = useState('Completing payment...');

  useEffect(() => {
    const params = new URLSearchParams(search);
    const orderId = params.get('token');
    const familyId = params.get('familyId');
    const paymentId = params.get('paymentId');
    async function capture() {
      try {
        const res = await fetch(`${API_BASE}/payments/capture`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ orderId, familyId, paymentId })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Capture failed');
        setMsg('Payment successful.');
        setTimeout(() => navigate(-1), 1500);
      } catch (e) {
        setMsg(e.message);
      }
    }
    if (orderId) capture();
  }, [search]);

  return <div className="p-6 text-slate-700">{msg}</div>;
}


