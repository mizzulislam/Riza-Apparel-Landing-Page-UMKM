import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { LandingPage } from './components/LandingPage';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminPortal } from './components/admin/AdminPortal';
import { OrderStatusTracker } from './components/OrderStatusTracker';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<'home' | 'admin' | 'tracking'>(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path === '/admin' || hash === '#admin') return 'admin';
    if (hash.startsWith('#status-pesanan') || window.location.search.includes('token=')) return 'tracking';
    return 'home';
  });

  const [initialTrackingToken, setInitialTrackingToken] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tokenInQuery = params.get('token');
      if (tokenInQuery) return tokenInQuery;

      const hash = window.location.hash;
      if (hash.includes('token=')) {
        return hash.split('token=')[1] || '';
      }
    }
    return '';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (path === '/admin' || hash === '#admin') {
        setCurrentRoute('admin');
      } else if (hash.startsWith('#status-pesanan') || window.location.search.includes('token=')) {
        setCurrentRoute('tracking');
        if (hash.includes('token=')) {
          setInitialTrackingToken(hash.split('token=')[1] || '');
        }
      } else {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Route 1: Admin Route (/admin or #admin)
  if (currentRoute === 'admin') {
    if (!authChecked) {
      return (
        <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-4">
          <p className="text-xs font-bold text-slate-400">Memeriksa Sesi Admin...</p>
        </div>
      );
    }

    if (user) {
      return (
        <AdminPortal
          onLogout={() => setUser(null)}
          onBackToSite={() => {
            window.location.hash = '';
            setCurrentRoute('home');
          }}
        />
      );
    }

    return (
      <AdminLogin
        onLoginSuccess={() => setCurrentRoute('admin')}
        onBackToSite={() => {
          window.location.hash = '';
          setCurrentRoute('home');
        }}
      />
    );
  }

  // Route 2: Tracking Route (#status-pesanan)
  if (currentRoute === 'tracking') {
    return (
      <OrderStatusTracker
        initialToken={initialTrackingToken}
        onBackToSite={() => {
          window.location.hash = '';
          setCurrentRoute('home');
        }}
      />
    );
  }

  // Route 3: Main Public Landing Page
  return (
    <LandingPage
      onNavigateAdmin={() => {
        window.location.hash = '#admin';
        setCurrentRoute('admin');
      }}
      onNavigateTracking={(token) => {
        setInitialTrackingToken(token || '');
        window.location.hash = token ? `#status-pesanan?token=${token}` : '#status-pesanan';
        setCurrentRoute('tracking');
      }}
    />
  );
};

export default App;
