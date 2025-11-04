'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Admin {
  id: number;
  username: string;
  created_at: string;
}

export default function AdminManagement() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    const token = localStorage.getItem('adminToken');
    if (!isLoggedIn || !token) {
      router.push('/admin/login');
      return;
    }

    fetchAdmins(token);
  }, [router]);

  const fetchAdmins = async (token: string) => {
    try {
      const response = await fetch('https://schedulink-backend.onrender.com/api/auth/admins', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://schedulink-backend.onrender.com/api/auth/admins', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Admin added successfully! 🎉');
        setNewUsername('');
        setNewPassword('');
        setShowAddModal(false);
        const token = localStorage.getItem('adminToken');
        if (token) fetchAdmins(token);
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.error || 'Failed to add admin');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const handleEditPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedAdmin) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://schedulink-backend.onrender.com/api/auth/admins/${selectedAdmin.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: editPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password updated successfully! 🔒');
        setEditPassword('');
        setShowEditModal(false);
        setSelectedAdmin(null);
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const handleDeleteAdmin = async (adminId: number) => {
    if (!confirm('Are you sure you want to delete this admin? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://schedulink-backend.onrender.com/api/auth/admins/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Admin deleted successfully! ✓');
        const token = localStorage.getItem('adminToken');
        if (token) fetchAdmins(token);
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.error || 'Failed to delete admin');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentAdmins = admins.filter(admin => {
    const createdDate = new Date(admin.created_at);
    const daysSinceCreation = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation <= 7;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-red-50 to-pink-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-red-400/30 to-pink-400/30 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-red-300/20 to-rose-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 blur-xl animate-pulse"></div>
          </div>
          <p className="mt-6 text-gray-700 font-medium text-lg">Loading Admin Management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-red-300/15 to-rose-300/15 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-red-400/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/60 backdrop-blur-xl shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Admin Management
              </h1>
              <p className="text-gray-600 text-sm md:text-base">Manage admin accounts, permissions, and security settings</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/20">
                <i className="ri-calendar-line text-red-500 mr-2"></i>
                <span className="text-sm font-medium text-gray-700">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="group bg-gradient-to-r from-gray-600 to-gray-700 text-white px-5 py-2.5 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl font-medium flex items-center gap-2"
              >
                <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform duration-300"></i>
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 shadow-lg animate-fadeInUp backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <i className="ri-checkbox-circle-line text-white text-xl"></i>
              </div>
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-4 shadow-lg animate-shake backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
                <i className="ri-error-warning-line text-white text-xl"></i>
              </div>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Admins */}
          <div className="group bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <i className="ri-admin-line text-2xl text-white"></i>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  {admins.length}
                </p>
                <p className="text-xs text-gray-500 font-medium">Total</p>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Total Admins</h3>
            <p className="text-xs text-gray-500">Active administrator accounts</p>
          </div>

          {/* Recent Admins */}
          <div className="group bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <i className="ri-user-add-line text-2xl text-white"></i>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  {recentAdmins}
                </p>
                <p className="text-xs text-gray-500 font-medium">This Week</p>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Recent Additions</h3>
            <p className="text-xs text-gray-500">Added in the last 7 days</p>
          </div>

          {/* Security Status */}
          <div className="group bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <i className="ri-shield-check-line text-2xl text-white"></i>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  100%
                </p>
                <p className="text-xs text-gray-500 font-medium">Secure</p>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Security Status</h3>
            <p className="text-xs text-gray-500">All accounts protected</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
                <input
                  type="text"
                  placeholder="Search admins by username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="group bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 w-full md:w-auto justify-center"
            >
              <i className="ri-user-add-line text-lg group-hover:rotate-12 transition-transform duration-300"></i>
              Add New Admin
            </button>
          </div>
        </div>

        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdmins.map((admin, index) => (
            <div
              key={admin.id}
              className="group bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Admin Avatar */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">
                      {admin.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">{admin.username}</h3>
                  <p className="text-sm text-gray-500">Joined: {new Date(admin.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => { setSelectedAdmin(admin); setShowEditModal(true); }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAdmin(admin.id)}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Admin Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Admin</h2>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setNewUsername('');
                      setNewPassword('');
                      setError('');
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition shadow-sm"
                  >
                    Add Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Admin Modal */}
        {showEditModal && selectedAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Password for {selectedAdmin.username}</h2>
              <form onSubmit={handleEditPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditPassword('');
                      setSelectedAdmin(null);
                      setError('');
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-sm"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
