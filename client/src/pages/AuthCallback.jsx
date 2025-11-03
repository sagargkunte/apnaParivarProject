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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative">
          {/* Animated spinner */}
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-8"></div>
          
          {/* Floating elements */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute top-4 -right-6 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-800 mb-4">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">ApnaParivar</span>
        </h2>
        
        <p className="text-lg text-slate-600 mb-2">Completing your sign in...</p>
        <p className="text-sm text-slate-500">Please wait while we secure your session</p>
        
        {/* Progress bar */}
        <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden mt-6 mx-auto">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}