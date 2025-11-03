import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

export default function AuthCallback({ onToken }) {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const tokenParam = params.get('token');
    console.log(tokenParam);
    async function resolveToken() {
      if (tokenParam) {
        onToken?.(tokenParam);
        return navigate('/families', { replace: true });
      }
      const res = await fetch(`${API_BASE}/auth/session`, { credentials: 'include' });
      const data = await res.json();
      if (data?.token) {
        onToken?.(data.token);
        return navigate('/families', { replace: true });
      }
      return navigate('/', { replace: true });
    }
    resolveToken();
  }, [search]);

  return <div>Signing in...</div>;
}


