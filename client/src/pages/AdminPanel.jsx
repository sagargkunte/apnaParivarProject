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
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Assign Roles Section */}
      <section className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">👑</span>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-slate-800">Assign Roles</h4>
            <p className="text-slate-600">Grant access to family members</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-slate-700">Family Member Email</label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
              placeholder="Enter email address..."
              value={email} 
              onChange={(e)=>setEmail(e.target.value)} 
            />
          </div>
          
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-slate-700">Role Type</label>
            <select 
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none bg-white"
              value={role} 
              onChange={(e)=>setRole(e.target.value)}
            >
              <option value="viewer">👀 Viewer</option>
              <option value="admin2">🛠️ Admin 2</option>
              <option value="admin3">⚡ Admin 3</option>
            </select>
          </div>
          
          <button 
            onClick={assignRole} 
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>✨</span>
            Assign Role
          </button>
        </div>
      </section>

      {/* Custom Fields Section */}
      <section className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">📋</span>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-semibold text-slate-800">Custom Fields</h4>
            <p className="text-slate-600">Add custom information fields (max 10)</p>
          </div>
          <div className="bg-slate-100 px-3 py-1 rounded-full text-sm font-medium text-slate-700">
            {fields.length}/10
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-slate-700">Field Key</label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none"
              placeholder="e.g., birth_place"
              value={keyLabel.key} 
              onChange={(e)=>setKeyLabel({ ...keyLabel, key: e.target.value })} 
            />
          </div>
          
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-slate-700">Display Label</label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none"
              placeholder="e.g., Birth Place"
              value={keyLabel.label} 
              onChange={(e)=>setKeyLabel({ ...keyLabel, label: e.target.value })} 
            />
          </div>
          
          <button 
            onClick={addField} 
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 mt-6 lg:mt-0"
          >
            <span>➕</span>
            Add Field
          </button>
        </div>

        {/* Fields List */}
        {fields.length > 0 && (
          <div className="border-t border-slate-200 pt-6">
            <h5 className="font-semibold text-slate-800 mb-4">Current Fields:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fields.map((f, idx) => (
                <div 
                  key={`${f.key}-${idx}`}
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                    <span className="text-slate-600 text-sm">📌</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">{f.label}</div>
                    <div className="text-sm text-slate-500 font-mono">{f.key}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}