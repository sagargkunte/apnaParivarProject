import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

export default function Members({ token }) {
  const { familyId } = useParams();
  const [members, setMembers] = useState([]);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [relation, setRelation] = useState('');
  const [fatherId, setFatherId] = useState('');
  const [motherId, setMotherId] = useState('');
  const [msg, setMsg] = useState('');

  async function load() {
    const res = await fetch(`${API_BASE}/members/by-family/${familyId}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setMembers(data.members || []);
  }
  useEffect(() => { if (token && familyId) load(); }, [token, familyId]);

  async function add() {
    try {
      setMsg('');
      const res = await fetch(`${API_BASE}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ familyId, name, gender, relation, fatherId: fatherId || undefined, motherId: motherId || undefined })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setName(''); setGender(''); setRelation(''); setFatherId(''); setMotherId('');
      await load();
      setMsg('Member added');
    } catch (e) { setMsg(e.message); }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <h2 className="text-2xl font-semibold">Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3 bg-white p-4 rounded-xl border">
          <input className="w-full px-3 py-2 border rounded" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <select className="w-full px-3 py-2 border rounded" value={gender} onChange={(e)=>setGender(e.target.value)}>
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input className="w-full px-3 py-2 border rounded" placeholder="Relation (e.g., father, mother, daughter)" value={relation} onChange={(e)=>setRelation(e.target.value)} />
          <select className="w-full px-3 py-2 border rounded" value={fatherId} onChange={(e)=>setFatherId(e.target.value)}>
            <option value="">Father</option>
            {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
          <select className="w-full px-3 py-2 border rounded" value={motherId} onChange={(e)=>setMotherId(e.target.value)}>
            <option value="">Mother</option>
            {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
          <button onClick={add} className="px-4 py-2 rounded bg-blue-600 text-white">Add Member</button>
          {msg && <div className="text-sm text-slate-600">{msg}</div>}
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <ul className="divide-y">
            {members.map(m => (
              <li key={m._id} className="py-2 flex items-center justify-between">
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-slate-500">{m.relation}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


