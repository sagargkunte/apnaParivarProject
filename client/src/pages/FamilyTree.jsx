import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Subscription from './Subscription.jsx';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

export default function FamilyTree({ token }) {
  const { familyId } = useParams();
  const [members, setMembers] = useState([]);
  const [q, setQ] = useState('');

  async function load() {
    const res = await fetch(`${API_BASE}/members/by-family/${familyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setMembers(data.members || []);
  }
  useEffect(() => { if (token && familyId) load(); }, [token, familyId]);

  const nodes = useMemo(() => members.map(m => ({ id: m._id, data: { label: m.name }, position: { x: Math.random()*600, y: Math.random()*400 } })), [members]);
  const edges = useMemo(() => {
    const es = [];
    members.forEach(m => {
      if (m.fatherId) es.push({ id: `f-${m._id}`, source: m.fatherId, target: m._id });
      if (m.motherId) es.push({ id: `m-${m._id}`, source: m.motherId, target: m._id });
      (m.spouseIds||[]).forEach(sid => es.push({ id: `s-${m._id}-${sid}`, source: m._id, target: sid, type: 'smoothstep' }));
    });
    return es;
  }, [members]);

  async function search() {
    const url = new URL(`${API_BASE}/members/search`);
    url.searchParams.set('familyId', familyId);
    url.searchParams.set('q', q);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setMembers(data.members || []);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">🌳</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Family Tree</h1>
            <p className="text-slate-600">Explore your family connections</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          <Link 
            to={`/family/${familyId}/admin`} 
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 text-white text-sm font-semibold hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>⚙️</span>
            Admin Panel
          </Link>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-slate-700">Search Family Members</label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
              placeholder="Search by name or keyword..."
              value={q} 
              onChange={(e)=>setQ(e.target.value)} 
            />
          </div>
          <div className="flex gap-3">
            <button 
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
              onClick={search}
            >
              <span>🔍</span>
              Search
            </button>
            <button 
              className="px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
              onClick={load}
            >
              <span>🔄</span>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Family Tree Visualization */}
        <div className="lg:col-span-3 h-[70vh] bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <MiniMap 
              style={{ backgroundColor: '#f8fafc' }}
              nodeColor="#3b82f6"
              maskColor="rgba(59, 130, 246, 0.1)"
            />
            <Controls 
              style={{ display: 'flex', gap: '4px' }}
            />
            <Background 
              color="#94a3b8"
              gap={20}
              size={1}
              variant="dots"
            />
          </ReactFlow>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Subscription token={token} familyId={familyId} />
          
          {/* Stats Card */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <h3 className="font-semibold text-lg mb-4">Family Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Total Members</span>
                <span className="font-bold text-xl">{members.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Generations</span>
                <span className="font-bold text-xl">-</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Last Updated</span>
                <span className="font-bold text-xl">Now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}