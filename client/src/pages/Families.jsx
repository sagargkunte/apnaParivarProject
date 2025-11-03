import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function Families({ token }) {
  const [families, setFamilies] = useState([]);
  const [name, setName] = useState('');

  async function load() {
    const res = await fetch(`${API_BASE}/families`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setFamilies(data.families || []);
  }

  useEffect(() => { if (token) load(); }, [token]);

  async function createFamily() {
    const res = await fetch(`${API_BASE}/families`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name })
    });
    if (res.ok) { setName(''); load(); }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">My Families</h3>
      <div className="flex gap-2">
        <input className="px-3 py-2 border rounded-md w-64" placeholder="New family name" value={name} onChange={(e)=>setName(e.target.value)} />
        <button className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-500" onClick={createFamily}>Create</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {families.map(f => (
          <Link key={f._id} to={`/family/${f._id}`} className="border rounded-lg p-4 hover:shadow-sm bg-white">
            <div className="font-medium">{f.name}</div>
            <div className="text-xs text-slate-500">Open family</div>
          </Link>
        ))}
      </div>
    </div>
  );
}


