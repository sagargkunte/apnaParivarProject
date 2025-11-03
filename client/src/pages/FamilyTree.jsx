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
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Link to={`/family/${familyId}/admin`} className="px-3 py-2 rounded-md border text-sm">Admin</Link>
        <input className="px-3 py-2 border rounded-md" placeholder="Search name/keyword" value={q} onChange={(e)=>setQ(e.target.value)} />
        <button className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm" onClick={search}>Search</button>
        <button className="px-3 py-2 rounded-md border text-sm" onClick={load}>Reset</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 h-[70vh]">
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
        <div className="lg:col-span-1 space-y-4">
          <Subscription token={token} familyId={familyId} />
        </div>
      </div>
    </div>
  );
}


