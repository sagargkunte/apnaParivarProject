import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

export default function CreateFamily({ token, onCreated }) {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function create() {
    try {
      setLoading(true);
      setMsg('');
      const res = await fetch(`${API_BASE}/families`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setMsg('Family created.');
      onCreated?.(data.family);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-4 p-6">
      <h2 className="text-2xl font-semibold">Create Your Family</h2>
      <input className="w-full px-4 py-3 rounded-xl border" placeholder="Family name" value={name} onChange={(e)=>setName(e.target.value)} />
      <button disabled={loading || !name} onClick={create} className="px-6 py-3 rounded-xl bg-blue-600 text-white disabled:opacity-50">Create</button>
      {msg && <div className="text-sm text-slate-600">{msg}</div>}
    </div>
  );
}


