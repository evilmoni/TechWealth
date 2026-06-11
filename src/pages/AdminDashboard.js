import React, { useState, useEffect } from 'react';
import { 
  getFirestore, 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  orderBy, 
  where,
  serverTimestamp
} from 'firebase/firestore';
import { Users, Clock, CheckCircle, XCircle, DollarSign, Search, Filter, Download, LogOut, Eye, Edit3, Phone, Mail, Building, Link as LinkIcon } from 'lucide-react';
import { firebaseApp } from '../firebase/config';

const db = getFirestore(firebaseApp);

const AdminDashboard = ({ onLogout }) => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, active, rejected
  const [filterTier, setFilterTier] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Stats
  const stats = {
    pending: applications.filter(a => a.status === 'pending').length,
    active: applications.filter(a => a.status === 'active').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    revenue: applications
      .filter(a => a.status === 'active' && a.paymentStatus === 'paid')
      .reduce((sum, a) => sum + (a.paymentAmount || 0), 0)
  };

  // Load applications from Firestore
  useEffect(() => {
    const q = query(
      collection(db, 'membership_applications'),
      orderBy('appliedDate', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        appliedDate: doc.data().appliedDate?.toDate?.() || new Date()
      }));
      setApplications(apps);
      setIsLoading(false);
    }, (error) => {
      console.error('Error loading applications:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter applications
  useEffect(() => {
    let filtered = [...applications];

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(a => a.status === filterStatus);
    }

    // Tier filter
    if (filterTier !== 'all') {
      filtered = filtered.filter(a => a.tier === filterTier);
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.name?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.company?.toLowerCase().includes(q)
      );
    }

    setFilteredApps(filtered);
  }, [applications, filterStatus, filterTier, searchQuery]);

  // Update application status
  const updateApplication = async (id, updates) => {
    setIsUpdating(true);
    try {
      const appRef = doc(db, 'membership_applications', id);
      await updateDoc(appRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      setSelectedApp(null); // Close detail view
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Approve application
  const handleApprove = async (app) => {
    if (!confirm(`Approve ${app.name}'s application?`)) return;

    await updateApplication(app.id, {
      status: 'active',
      verified: true,
      paymentStatus: app.paymentStatus || 'unpaid'
    });
  };

  // Reject application
  const handleReject = async (app) => {
    const reason = prompt('Reason for rejection (optional):');
    if (!confirm(`Reject ${app.name}'s application?`)) return;

    await updateApplication(app.id, {
      status: 'rejected',
      notes: reason ? `${app.notes || ''}\n\nRejection reason: ${reason}` : app.notes
    });
  };

  // Export to CSV
  const exportToCSV = (filter = 'all') => {
    let dataToExport = applications;
    if (filter === 'pending') dataToExport = applications.filter(a => a.status === 'pending');
    if (filter === 'active') dataToExport = applications.filter(a => a.status === 'active');
    if (filter === 'paid') dataToExport = applications.filter(a => a.paymentStatus === 'paid');

    const headers = [
      'Name', 'Email', 'Phone', 'Company', 'Title', 'Tier', 
      'Status', 'Payment Status', 'Amount (HKD)', 'Payment Method',
      'Telegram', 'LinkedIn', 'Applied Date', 'Notes'
    ];

    const csvContent = [
      headers.join(','),
      ...dataToExport.map(app => [
        `"${app.name}"`,
        `"${app.email}"`,
        `"${app.phone}"`,
        `"${app.company}"`,
        `"${app.title}"`,
        app.tier,
        app.status,
        app.paymentStatus,
        app.paymentAmount,
        app.paymentMethod,
        `"${app.telegramHandle || ''}"`,
        `"${app.linkedinUrl || ''}"`,
        `"${app.appliedDate.toISOString()}"`,
        `"${(app.notes || '').replace(/\n/g, ' ')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `techwealth-applications-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const tierLabels = {
    bronze: '🥉 Bronze',
    silver: '🥈 Silver',
    gold: '🥇 Gold',
    platinum: '💎 Platinum',
    diamond: '👑 Diamond'
  };

  const statusColors = {
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    suspended: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
  };

  const paymentStatusColors = {
    unpaid: 'bg-zinc-500/20 text-zinc-400',
    paid: 'bg-emerald-500/20 text-emerald-400',
    partial: 'bg-amber-500/20 text-amber-400',
    refunded: 'bg-red-500/20 text-red-400'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-40">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-amber-400" size={28} />
              <div>
                <h1 className="text-xl font-bold">TechWealth Admin</h1>
                <p className="text-xs text-zinc-500">Membership Management Dashboard</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1800px] mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="text-amber-400" size={24} />
              <span className="text-3xl font-bold text-amber-400">{stats.pending}</span>
            </div>
            <p className="text-sm text-zinc-400">Pending Applications</p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="text-emerald-400" size={24} />
              <span className="text-3xl font-bold text-emerald-400">{stats.active}</span>
            </div>
            <p className="text-sm text-zinc-400">Active Members</p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="text-red-400" size={24} />
              <span className="text-3xl font-bold text-red-400">{stats.rejected}</span>
            </div>
            <p className="text-sm text-zinc-400">Rejected</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/20 to-black border border-emerald-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="text-emerald-400" size={24} />
              <span className="text-3xl font-bold text-emerald-400">HK$ {(stats.revenue / 1000000).toFixed(2)}M</span>
            </div>
            <p className="text-sm text-zinc-400">Total Revenue (Paid)</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-zinc-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Status</option>
                <option value="pending">⏳ Pending</option>
                <option value="active">✅ Active</option>
                <option value="rejected">❌ Rejected</option>
              </select>
            </div>

            {/* Tier Filter */}
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Tiers</option>
              <option value="bronze">🥉 Bronze</option>
              <option value="silver">🥈 Silver</option>
              <option value="gold">🥇 Gold</option>
              <option value="platinum">💎 Platinum</option>
              <option value="diamond">👑 Diamond</option>
            </select>

            {/* Export */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors"
              >
                <Download size={18} />
                Export
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50">
                  <button
                    onClick={() => { exportToCSV('all'); setShowExportMenu(false); }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-800 first:rounded-t-xl"
                  >
                    📊 All Applications
                  </button>
                  <button
                    onClick={() => { exportToCSV('pending'); setShowExportMenu(false); }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-800"
                  >
                    ⏳ Pending Only
                  </button>
                  <button
                    onClick={() => { exportToCSV('active'); setShowExportMenu(false); }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-800"
                  >
                    ✅ Active Members
                  </button>
                  <button
                    onClick={() => { exportToCSV('paid'); setShowExportMenu(false); }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-800 rounded-b-xl"
                  >
                    💰 Paid Only
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900 border-b border-zinc-800">
                <tr>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Member</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Company</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Tier</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Payment</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Amount</th>
                  <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Applied</th>
                  <th className="text-right text-xs text-zinc-500 uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-zinc-500">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-white">{app.name}</div>
                          <div className="text-sm text-zinc-500">{app.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{app.company}</div>
                        <div className="text-xs text-zinc-500">{app.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm">{tierLabels[app.tier]}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs border ${statusColors[app.status]}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs ${paymentStatusColors[app.paymentStatus || 'unpaid']}`}>
                          {app.paymentStatus || 'unpaid'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium">
                          {app.paymentAmount ? `HK$ ${app.paymentAmount.toLocaleString()}` : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-zinc-500">
                          {app.appliedDate.toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/30 transition-colors"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Application Detail Modal */}
        {selectedApp && (
          <ApplicationDetailModal
            app={selectedApp}
            onClose={() => setSelectedApp(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            onUpdate={updateApplication}
            isUpdating={isUpdating}
            tierLabels={tierLabels}
            statusColors={statusColors}
            paymentStatusColors={paymentStatusColors}
          />
        )}
      </div>
    </div>
  );
};

// Detail Modal Component
const ApplicationDetailModal = ({ app, onClose, onApprove, onReject, onUpdate, isUpdating, tierLabels, statusColors, paymentStatusColors }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedApp, setEditedApp] = useState({ ...app });

  const handleSave = async () => {
    await onUpdate(app.id, editedApp);
    setEditMode(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold">Application Details</h2>
          <div className="flex items-center gap-2">
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                <Edit3 size={14} />
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <XCircle size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badges */}
          <div className="flex gap-3">
            <span className={`inline-flex px-3 py-1 rounded-full text-sm border ${statusColors[app.status]}`}>
              {app.status.toUpperCase()}
            </span>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm ${paymentStatusColors[app.paymentStatus || 'unpaid']}`}>
              {app.paymentStatus?.toUpperCase() || 'UNPAID'}
            </span>
            {app.verified && (
              <span className="inline-flex px-3 py-1 rounded-full text-sm bg-emerald-500/20 text-emerald-400">
                ✓ VERIFIED
              </span>
            )}
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-600">Full Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedApp.name}
                      onChange={(e) => setEditedApp({ ...editedApp, name: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white">{app.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-zinc-600">Email</label>
                  {editMode ? (
                    <input
                      type="email"
                      value={editedApp.email}
                      onChange={(e) => setEditedApp({ ...editedApp, email: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-white">
                      <Mail size={14} className="text-zinc-500" />
                      {app.email}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs text-zinc-600">Phone / WhatsApp</label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={editedApp.phone}
                      onChange={(e) => setEditedApp({ ...editedApp, phone: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-white">
                      <Phone size={14} className="text-zinc-500" />
                      {app.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div>
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Business Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-600">Company</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedApp.company}
                      onChange={(e) => setEditedApp({ ...editedApp, company: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-white">
                      <Building size={14} className="text-zinc-500" />
                      {app.company}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs text-zinc-600">Job Title</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedApp.title}
                      onChange={(e) => setEditedApp({ ...editedApp, title: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white">{app.title}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-zinc-600">LinkedIn</label>
                  {editMode ? (
                    <input
                      type="url"
                      value={editedApp.linkedinUrl || ''}
                      onChange={(e) => setEditedApp({ ...editedApp, linkedinUrl: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                    />
                  ) : app.linkedinUrl ? (
                    <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-amber-400 hover:underline">
                      <LinkIcon size={14} />
                      View Profile
                    </a>
                  ) : (
                    <p className="text-zinc-500">Not provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Membership Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Membership</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-600">Tier</label>
                  {editMode ? (
                    <select
                      value={editedApp.tier}
                      onChange={(e) => setEditedApp({ ...editedApp, tier: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="bronze">Bronze</option>
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                      <option value="platinum">Platinum</option>
                      <option value="diamond">Diamond</option>
                    </select>
                  ) : (
                    <p className="text-white text-lg">{tierLabels[app.tier]}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-zinc-600">Status</label>
                  {editMode ? (
                    <select
                      value={editedApp.status}
                      onChange={(e) => setEditedApp({ ...editedApp, status: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="rejected">Rejected</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  ) : (
                    <p className="text-white">{app.status}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div>
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Payment Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-600">Payment Amount (HKD)</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={editedApp.paymentAmount || ''}
                      onChange={(e) => setEditedApp({ ...editedApp, paymentAmount: parseInt(e.target.value) || 0 })}
                      className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white text-lg font-bold">HK$ {app.paymentAmount?.toLocaleString() || '0'}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-zinc-600">Payment Status</label>
                  {editMode ? (
                    <select
                      value={editedApp.paymentStatus || 'unpaid'}
                      onChange={(e) => setEditedApp({ ...editedApp, paymentStatus: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                      <option value="partial">Partial</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  ) : (
                    <p className="text-white">{app.paymentStatus || 'unpaid'}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-zinc-600">Payment Method</label>
                  <p className="text-white">{app.paymentMethod || '-'}</p>
                </div>
                {app.transactionId && (
                  <div>
                    <label className="text-xs text-zinc-600">Transaction ID</label>
                    <p className="text-white font-mono text-sm">{app.transactionId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Social Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-600">Telegram</label>
                {editMode ? (
                  <input
                    type="text"
                    value={editedApp.telegramHandle || ''}
                    onChange={(e) => setEditedApp({ ...editedApp, telegramHandle: e.target.value })}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                    placeholder="@username"
                  />
                ) : app.telegramHandle ? (
                  <a href={`https://t.me/${app.telegramHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {app.telegramHandle}
                  </a>
                ) : (
                  <p className="text-zinc-500">Not provided</p>
                )}
              </div>
              <div>
                <label className="text-xs text-zinc-600">Applied Date</label>
                <p className="text-white">{app.appliedDate?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Admin Notes</h3>
            {editMode ? (
              <textarea
                value={editedApp.notes || ''}
                onChange={(e) => setEditedApp({ ...editedApp, notes: e.target.value })}
                rows={4}
                className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                placeholder="Internal notes (not visible to member)"
              />
            ) : (
              <div className="bg-black/50 border border-zinc-800 rounded-lg p-4">
                <p className="text-zinc-300 whitespace-pre-wrap">{app.notes || 'No notes'}</p>
              </div>
            )}
          </div>

          {/* Verified Toggle */}
          <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-xl">
            <input
              type="checkbox"
              id="verified"
              checked={editMode ? (editedApp.verified ?? false) : (app.verified ?? false)}
              onChange={(e) => setEditedApp({ ...editedApp, verified: e.target.checked })}
              disabled={!editMode}
              className="w-5 h-5 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="verified" className="text-sm text-white">
              ✅ Verified (Asset/Income Check Completed)
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 px-6 py-4 flex items-center justify-between">
          {editMode ? (
            <>
              <button
                onClick={() => { setEditMode(false); setEditedApp(app); }}
                className="px-6 py-3 text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="px-6 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onReject(app)}
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition-colors"
              >
                Reject Application
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-colors"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => onApprove(app)}
                  className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors"
                >
                  Approve Application
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
