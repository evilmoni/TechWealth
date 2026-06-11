import React, { useState, useEffect } from 'react';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    // Check if user is trying to access /admin
    const path = window.location.pathname;
    if (path.startsWith('/admin')) {
      setIsAdminRoute(true);
    }
  }, []);

  if (isAdminRoute) {
    return (
      <>
        <style>{`
          body { margin: 0; background: #000; }
        `}</style>
        <AdminRoutes />
      </>
    );
  }

  // Import the main app lazily to avoid bundle conflicts
  const MainApp = React.lazy(() => import('./index-original.js'));
  
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <MainApp />
    </React.Suspense>
  );
};

const AdminRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('techwealth_admin_logged_in') === 'true';
    if (loggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem('techwealth_admin_logged_in');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
};

export default App;
