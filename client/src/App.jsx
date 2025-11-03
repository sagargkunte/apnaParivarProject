import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AuthCallback from './pages/AuthCallback.jsx';
import Families from './pages/Families.jsx';
import FamilyTree from './pages/FamilyTree.jsx';
import AdminPanel from './pages/AdminPanel.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadMe() {
      if (!token) return setUser(null);
      const res = await fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setUser(data.user);
    }
    loadMe();
  }, [token]);

  function startGoogleLogin() {
    window.location.href = `${API_BASE}/auth/google`;
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/');
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <Link to="/" className="font-semibold text-slate-800">ApnaParivar</Link>
          <nav className="flex items-center gap-3 text-sm">
            {user && <Link to="/families" className="text-slate-600 hover:text-slate-900">Families</Link>}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-slate-600">Hi, {user.name}</span>
                <button onClick={logout} className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-sm hover:bg-slate-800">Logout</button>
              </>
            ) : (
              <button className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-500" onClick={startGoogleLogin}>Login with Google (Gmail)</button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/auth/callback" element={<AuthCallback onToken={(t)=>{ localStorage.setItem('token', t); setToken(t); }} />} />
          <Route path="/families" element={<Families token={token} />} />
          <Route path="/family/:familyId" element={<FamilyTree token={token} />} />
          <Route path="/family/:familyId/admin" element={<AdminPanel token={token} />} />
        </Routes>
      </main>
    </div>
  );
}

function Home({ user }) {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">ApnaParivar</h2>
      {user ? (
        <Link to="/families" className="inline-flex px-3 py-1.5 rounded-md bg-slate-900 text-white text-sm hover:bg-slate-800">Go to my families</Link>
      ) : (
        <p className="text-slate-600">Please login with your Gmail account.</p>
      )}
    </div>
  );
}


