import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AuthCallback from './pages/AuthCallback.jsx';
import Families from './pages/Families.jsx';
import FamilyTree from './pages/FamilyTree.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import PaymentsReturn from './pages/PaymentsReturn.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadMe() {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/auth/me`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading ApnaParivar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-lg">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-6">
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🌳</span>
            </div>
            <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
              ApnaParivar
            </span>
          </Link>
          
          <nav className="flex items-center gap-2 ml-8">
            {user && (
              <>
                <Link 
                  to="/families" 
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-medium px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-100"
                >
                  <span>🏠</span>
                  My Families
                </Link>
              </>
            )}
          </nav>
          
          <div className="ml-auto flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={logout} 
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 text-white text-sm font-semibold hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-slate-600/20 flex items-center gap-2"
                >
                  <span>🚪</span>
                  Logout
                </button>
              </>
            ) : (
              <button 
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 flex items-center gap-3 group"
                onClick={startGoogleLogin}
              >
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                Continue with Google
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/auth/callback" element={<AuthCallback onToken={(t)=>{ localStorage.setItem('token', t); setToken(t); }} />} />
          <Route path="/families" element={<Families token={token} />} />
          <Route path="/family/:familyId" element={<FamilyTree token={token} />} />
          <Route path="/family/:familyId/admin" element={<AdminPanel token={token} />} />
          <Route path="/payments/return" element={<PaymentsReturn token={token} />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 border-t border-slate-200/60 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🌳</span>
                </div>
                <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  ApnaParivar
                </span>
              </div>
              <p className="text-slate-600 text-lg max-w-md">
                Preserving your family legacy for generations to come. Connect, discover, and celebrate your roots.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-800 mb-4">Features</h4>
              <ul className="space-y-2 text-slate-600">
                <li>Family Tree Builder</li>
                <li>Photo Archives</li>
                <li>Story Preservation</li>
                <li>DNA Integration</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-800 mb-4">Support</h4>
              <ul className="space-y-2 text-slate-600">
                <li>Help Center</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200/60 mt-8 pt-8 text-center text-slate-500">
            <p>&copy; 2025 ApnaParivar. Preserving family histories, one generation at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Home({ user }) {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    {
      icon: "🌳",
      title: "Interactive Family Trees",
      description: "Build beautiful, interactive family trees with drag-and-drop functionality"
    },
    {
      icon: "📸",
      title: "Photo Archives",
      description: "Upload and preserve family photos with automatic face recognition"
    },
    {
      icon: "📖",
      title: "Family Stories",
      description: "Record and share precious family stories and memories"
    },
    {
      icon: "🔍",
      title: "Smart Discovery",
      description: "Discover unknown relatives and expand your family network"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-20 space-y-8">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200">
            <span>✨</span>
            Preserving Family Legacies Since 2024
          </div>
          
          <h1 className="text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">ApnaParivar</span>
          </h1>
          
          <p className="text-2xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Where every branch of your family tree tells a story. Connect generations, 
            preserve memories, and discover your roots in one beautiful platform.
          </p>

          {user ? (
            <div className="space-y-6">
              <Link 
                to="/families" 
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="text-2xl">🚀</span>
                Continue to My Dashboard
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-slate-500 text-lg">
                Ready to explore your family connections?
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-xl text-slate-500 font-medium">
                  Join thousands of families preserving their heritage
                </p>
                <div className="animate-bounce text-3xl">👇</div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60 shadow-xl max-w-md mx-auto">
                <h3 className="font-semibold text-slate-800 mb-4 text-lg">Get Started in Seconds</h3>
                <p className="text-slate-600 mb-6">Sign in with your Google account to begin your family journey</p>
                <button className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  🚀 Start Your Family Tree
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      {!user && (
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Everything You Need to Preserve Your Legacy
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful tools designed to help you capture, organize, and share your family's unique story
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Animated Feature Showcase */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border-2 transition-all duration-500 ${
                    index === currentFeature
                      ? 'bg-white border-blue-200 shadow-2xl scale-105'
                      : 'bg-slate-50/50 border-slate-100 shadow-lg opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                      index === currentFeature 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className={`font-semibold text-lg transition-colors ${
                        index === currentFeature ? 'text-slate-800' : 'text-slate-600'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className={`transition-colors ${
                        index === currentFeature ? 'text-slate-600' : 'text-slate-500'
                      }`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Demo */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">👨‍👩‍👧‍👦</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Sample Family Tree</h4>
                      <p className="text-blue-100">3 generations connected</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {['Grandparents', 'Parents', 'You'].map((gen, idx) => (
                      <div key={idx} className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                        <div className="text-sm font-medium">{gen}</div>
                        <div className="text-2xl mt-2">{['👴👵', '👨👩', '👦👧'][idx]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-2xl shadow-lg animate-float">
                📸
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-green-400 rounded-full flex items-center justify-center text-xl shadow-lg animate-float" style={{animationDelay: '1s'}}>
                📖
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {!user && (
        <section className="py-16 bg-white/50 rounded-3xl border border-slate-200/60">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
            {[
              { number: '50K+', label: 'Families Connected' },
              { number: '2M+', label: 'Relationships Mapped' },
              { number: '500K+', label: 'Photos Preserved' },
              { number: '99.9%', label: 'Uptime Reliability' }
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!user && (
        <section className="text-center py-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Begin Your Family Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join ApnaParivar today and start preserving your family's legacy for future generations
            </p>
            <button className="px-12 py-4 rounded-xl bg-white text-blue-600 font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1">
              🌟 Start Free Today
            </button>
            <p className="text-blue-200 mt-4 text-sm">No credit card required • Free forever for basic plan</p>
          </div>
        </section>
      )}
    </div>
  );
}