import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

export default function AdminPanel({ token }) {
  const { familyId } = useParams();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [fields, setFields] = useState([]);
  const [keyLabel, setKeyLabel] = useState({ key: '', label: '' });

  async function assignRole() {
    const ures = await fetch(`${API_BASE}/users/lookup?email=${encodeURIComponent(email)}`, { headers: { Authorization: `Bearer ${token}` } });
    if (!ures.ok) return alert('User not found');
    const u = await ures.json();
    const res = await fetch(`${API_BASE}/families/${familyId}/assign-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId: u.user._id, role })
    });
    if (res.ok) alert('Role assigned'); else alert('Failed to assign');
  }

  async function addField() {
    const next = [...fields, { key: keyLabel.key, label: keyLabel.label }].slice(0, 10);
    setFields(next);
    setKeyLabel({ key: '', label: '' });
    await fetch(`${API_BASE}/families/${familyId}/custom-fields`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ customFields: next })
    });
  }

  return (
    <div className="space-y-8">
      <section>
        <h4 className="text-lg font-semibold mb-2">Assign Roles</h4>
        <div className="flex flex-wrap gap-2 items-center">
          <input className="px-3 py-2 border rounded-md" placeholder="User email (placeholder)" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <select className="px-3 py-2 border rounded-md" value={role} onChange={(e)=>setRole(e.target.value)}>
            <option value="viewer">viewer</option>
            <option value="admin2">admin2</option>
            <option value="admin3">admin3</option>
          </select>
          <button onClick={assignRole} className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm">Assign</button>
        </div>
      </section>
      <section>
        <h4 className="text-lg font-semibold mb-2">Custom Fields (max 10)</h4>
        <div className="flex gap-2 mb-2">
          <input className="px-3 py-2 border rounded-md" placeholder="key" value={keyLabel.key} onChange={(e)=>setKeyLabel({ ...keyLabel, key: e.target.value })} />
          <input className="px-3 py-2 border rounded-md" placeholder="label" value={keyLabel.label} onChange={(e)=>setKeyLabel({ ...keyLabel, label: e.target.value })} />
          <button onClick={addField} className="px-3 py-2 rounded-md border text-sm">Add</button>
        </div>
        <ul className="list-disc pl-6 text-slate-600">
          {fields.map((f, idx) => (
            <li key={`${f.key}-${idx}`}>{f.key} — {f.label}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}


