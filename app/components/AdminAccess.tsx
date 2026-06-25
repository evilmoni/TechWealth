'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  Eye, 
  X 
} from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, onSnapshot, doc, updateDoc, orderBy, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDUDQti3a-SnstsakWSB6vTppsxDV_gh2Q",
  authDomain: "techwealth-website.firebaseapp.com",
  projectId: "techwealth-website",
  storageBucket: "techwealth-website.appspot.com",
  messagingSenderId: "36453865287",
  appId: "1:36453865287:web:22bef340b02a7b8e385e62",
  measurementId: "G-HLRMJ3E11E"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Application {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  tier: string;
  status: 'pending' | 'active' | 'rejected';
  paymentStatus?: string;
  paymentAmount?: number;
  paymentMethod?: string;
  appliedDate?: Date;
  notes?: string;
  verified?: boolean;
  telegramHandle?: string;
  linkedinUrl?: string;
  phone?: string;
  transactionId?: string;
}

interface AdminAccessProps {
  onClose: () => void;
}

export default function AdminAccess({ onClose }: AdminAccessProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'active' | 'rejected'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const ADMIN_PASSWORD = 'techwealth2026';

  useEffect(() => {
    const isLoggedIn = typeof window !== 'undefined' ? sessionStorage.getItem('tw_admin_auth') : null;
    if (isLoggedIn === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const q = query(
      collection(db, 'membership_applications'),
      orderBy('appliedDate', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        appliedDate: (doc.data().appliedDate as any)?.toDate?.() || new Date()
      })) as Application[];
      setApplications(apps);
      setIsLoading(false);
    }, (error) => {
      console.error('Error loading applications:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tw_admin_auth', 'true');
      }
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Invalid password');
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('tw_admin_auth');
    }
    setIsAuthenticated(false);
    onClose();
  };

  const updateApplication = async (id: string, updates: Record<string, any>) => {
    setIsUpdating(true);
    try {
      const appRef = doc(db, 'membership_applications', id);
      await updateDoc(appRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      setSelectedApp(null);
    } catch (error) {
      console.error('Error updating:', error);
      alert('Failed to update');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleApprove = async (app: Application) => {
    if (!confirm(`Approve ${app.name}?`)) return;
    await updateApplication(app.id, { status: 'active', verified: true });
  };

  const handleReject = async (app: Application) => {
    const reason = prompt('Rejection reason (optional):') || '';
    if (!confirm(`Reject ${app.name}?`)) return;
    await updateApplication(app.id, { 
      status: 'rejected',
      notes: `${app.notes || ''}\n\nRejected: ${reason}`.trim()
    });
  };

  const stats = {
    pending: applications.filter(a => a.status === 'pending').length,
    active: applications.filter(a => a.status === 'active').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    revenue: applications
      .filter(a => a.status === 'active' && a.paymentStatus === 'paid')
      .reduce((sum, a) => sum + (a.paymentAmount || 0), 0)
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="text-center mb-6">
            <ShieldCheck className="mx-auto text-amber-400 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
            <p className="text-zinc-500 text-sm">Restricted - Authorized Personnel Only</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400"
            >
              Login
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 text-zinc-500 hover:text-white"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-amber-400" size={28} />
          <div>
            <h1 className="text-xl font-bold text-white">科富商會 Admin</h1>
            <p className="text-xs text-zinc-500">Membership Management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white border border-zinc-800 rounded-lg"
          >
            Back to Site
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600/20 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-600/30"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <Clock className="text-amber-400" size={24} />
              <span className="text-3xl font-bold text-amber-400">{stats.pending}</span>
            </div>
            <p className="text-sm text-zinc-400 mt-2">Pending</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <CheckCircle className="text-emerald-400" size={24} />
              <span className="text-3xl font-bold text-emerald-400">{stats.active}</span>
            </div>
            <p className="text-sm text-zinc-400 mt-2">Active Members</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <XCircle className="text-red-400" size={24} />
              <span className="text-3xl font-bold text-red-400">{stats.rejected}</span>
            </div>
            <p className="text-sm text-zinc-400 mt-2">Rejected</p>
          </div>
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <DollarSign className="text-emerald-400" size={24} />
              <span className="text-3xl font-bold text-emerald-400">HK$ {(stats.revenue / 1000000).toFixed(2)}M</span>
            </div>
            <p className="text-sm text-zinc-400 mt-2">Revenue (Paid)</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="rejected">Rejected</option>
          </select>
          <span className="text-zinc-500 text-sm">
            {applications.filter(a => filterStatus === 'all' ? true : a.status === filterStatus).length} applications
          </span>
        </div>

        {/* Table */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-900 border-b border-zinc-800">
              <tr>
                <th className="text-left text-xs text-zinc-500 uppercase px-6 py-4">Member</th>
                <th className="text-left text-xs text-zinc-500 uppercase px-6 py-4">Company</th>
                <th className="text-left text-xs text-zinc-500 uppercase px-6 py-4">Tier</th>
                <th className="text-left text-xs text-zinc-500 uppercase px-6 py-4">Status</th>
                <th className="text-left text-xs text-zinc-500 uppercase px-6 py-4">Payment</th>
                <th className="text-left text-xs text-zinc-500 uppercase px-6 py-4">Amount</th>
                <th className="text-right text-xs text-zinc-500 uppercase px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-zinc-500">Loading...</td></tr>
              ) : applications
                .filter(a => filterStatus === 'all' ? true : a.status === filterStatus)
                .map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-800/30">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{app.name}</div>
                      <div className="text-sm text-zinc-500">{app.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{app.company}</div>
                      <div className="text-xs text-zinc-500">{app.title}</div>
                    </td>
                    <td className="px-6 py-4 text-sm capitalize">{app.tier}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs border ${
                        app.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        app.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs ${
                        app.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400' :
                        app.paymentStatus === 'partial' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-zinc-500/20 text-zinc-400'
                      }`}>
                        {app.paymentStatus || 'unpaid'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {app.paymentAmount ? `HK$ ${app.paymentAmount.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/30"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Application Details</h2>
                <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-zinc-800 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm border ${
                    selectedApp.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    selectedApp.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {selectedApp.status.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedApp.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-zinc-500/20 text-zinc-400'
                  }`}>
                    {selectedApp.paymentStatus?.toUpperCase() || 'UNPAID'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-500 uppercase mb-3">Personal Info</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-zinc-600">Name:</span> <span className="text-white">{selectedApp.name}</span></div>
                      <div><span className="text-zinc-600">Email:</span> <span className="text-white">{selectedApp.email}</span></div>
                      <div><span className="text-zinc-600">Phone:</span> <span className="text-white">{selectedApp.phone}</span></div>
                      {selectedApp.telegramHandle && (
                        <div><span className="text-zinc-600">Telegram:</span> <span className="text-blue-400">{selectedApp.telegramHandle}</span></div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-500 uppercase mb-3">Business Info</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-zinc-600">Company:</span> <span className="text-white">{selectedApp.company}</span></div>
                      <div><span className="text-zinc-600">Title:</span> <span className="text-white">{selectedApp.title}</span></div>
                      {selectedApp.linkedinUrl && (
                        <div><span className="text-zinc-600">LinkedIn:</span> <a href={selectedApp.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">View Profile</a></div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-500 uppercase mb-3">Membership</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-zinc-600">Tier:</span> <span className="text-white capitalize">{selectedApp.tier}</span></div>
                      <div><span className="text-zinc-600">Applied:</span> <span className="text-white">{selectedApp.appliedDate?.toLocaleString()}</span></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-500 uppercase mb-3">Payment</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-zinc-600">Amount:</span> <span className="text-white font-bold">HK$ {selectedApp.paymentAmount?.toLocaleString() || '0'}</span></div>
                      <div><span className="text-zinc-600">Method:</span> <span className="text-white">{selectedApp.paymentMethod || '-'}</span></div>
                      {selectedApp.transactionId && (
                        <div><span className="text-zinc-600">Transaction ID:</span> <span className="text-white font-mono text-xs">{selectedApp.transactionId}</span></div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedApp.notes && (
                  <div>
                    <h3 className="text-sm font-bold text-zinc-500 uppercase mb-3">Admin Notes</h3>
                    <div className="bg-black/50 border border-zinc-800 rounded-lg p-4">
                      <p className="text-zinc-300 whitespace-pre-wrap text-sm">{selectedApp.notes}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-xl">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={selectedApp.verified ?? false}
                    onChange={async (e) => {
                      await updateApplication(selectedApp.id, { verified: e.target.checked });
                      setSelectedApp({ ...selectedApp, verified: e.target.checked });
                    }}
                    disabled={isUpdating}
                    className="w-5 h-5 rounded border-zinc-600 text-emerald-500"
                  />
                  <label htmlFor="verified" className="text-sm text-white">✅ Verified (Asset/Income Check)</label>
                </div>
              </div>

              <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 px-6 py-4 flex items-center justify-between">
                <button
                  onClick={() => handleReject(selectedApp)}
                  disabled={isUpdating}
                  className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 disabled:opacity-50"
                >
                  Reject
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      const amount = prompt('Payment amount (HKD):', selectedApp.paymentAmount?.toString() || '');
                      const method = prompt('Payment method (bank_transfer/stripe/paypal/crypto/manual):', selectedApp.paymentMethod || 'manual');
                      if (amount && method) {
                        await updateApplication(selectedApp.id, { 
                          paymentAmount: parseInt(amount),
                          paymentMethod: method
                        });
                      }
                    }}
                    disabled={isUpdating}
                    className="px-6 py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 disabled:opacity-50"
                  >
                    Update Payment
                  </button>
                  <button
                    onClick={() => handleApprove(selectedApp)}
                    disabled={isUpdating}
                    className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 disabled:opacity-50"
                  >
                    Approve Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
