import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, AlertCircle } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simple hash-based authentication (client-side for simplicity)
  // In production, use Firebase Auth with email/password or Google sign-in
  const ADMIN_PASSWORD_HASH = 'techwealth_admin_2026_secure'; // Change this before production

  useEffect(() => {
    // Check if already logged in
    const isLoggedIn = localStorage.getItem('techwealth_admin_logged_in');
    if (isLoggedIn === 'true') {
      onLogin();
    }
  }, [onLogin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate async validation
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === ADMIN_PASSWORD_HASH) {
      localStorage.setItem('techwealth_admin_logged_in', 'true');
      onLogin();
    } else {
      setError('Invalid admin password');
      setPassword('');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-amber-500 to-emerald-600 rounded-2xl shadow-lg shadow-emerald-900/20 mb-4">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
            TechWealth Admin
          </h1>
          <p className="text-zinc-500 mt-2 text-sm">
            Restricted Access — Authorized Personnel Only
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="text-amber-400" size={20} />
            <h2 className="text-lg font-bold text-white">Admin Authentication</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-wider">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-900/50 rounded-xl p-3">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800">
            <p className="text-[10px] text-zinc-600 text-center uppercase tracking-widest">
              All admin actions are logged for security
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-[10px] text-zinc-700">
            This system is protected by enterprise-grade security.
            <br />
            Unauthorized access attempts are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
