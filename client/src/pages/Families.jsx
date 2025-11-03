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
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-3">My Families</h1>
        <p className="text-lg text-slate-600">Manage and explore your family trees</p>
      </div>

      {/* Create Family Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">🏠</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800">Create New Family</h3>
            <p className="text-slate-600">Start building your family tree</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-slate-700">Family Name</label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
              placeholder="Enter your family name..."
              value={name} 
              onChange={(e)=>setName(e.target.value)} 
            />
          </div>
          <button 
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
            onClick={createFamily}
          >
            <span>✨</span>
            Create Family
          </button>
        </div>
      </div>

      {/* Families Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {families.map(f => (
          <Link 
            key={f._id} 
            to={`/family/${f._id}`} 
            className="group bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">🌳</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 text-lg group-hover:text-blue-600 transition-colors duration-200">
                  {f.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1">Family Tree</p>
              </div>
              <div className="text-2xl group-hover:translate-x-2 transition-transform duration-300">
                →
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
              <span>👥 Members</span>
              <span>Click to explore</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {families.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🌳</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No Families Yet</h3>
          <p className="text-slate-500 mb-6">Create your first family to start building your tree</p>
        </div>
      )}
    </div>
  );
}