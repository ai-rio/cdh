'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SmartAPI, API_CONFIG } from '@/lib/smartAPI';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'creator' | 'brand';
  createdAt: string;
  updatedAt: string;
}

export default function SmartUserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiSource, setApiSource] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'creator' as 'admin' | 'creator' | 'brand'
  });

  // Refs to prevent unnecessary re-renders
  const hasInitializedRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const FETCH_COOLDOWN = 1000; // 1 second cooldown between fetches

  // Memoized admin check to prevent recalculation
  const isAdmin = useMemo(() => currentUser?.role === 'admin', [currentUser?.role]);
  const currentUserId = useMemo(() => currentUser?.id, [currentUser?.id]);

  // Get token function (memoized)
  const getToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }, []);

  // Stable fetchUsers function with cooldown protection
  const fetchUsers = useCallback(async (forceRefresh = false) => {
    // Prevent multiple rapid calls
    const now = Date.now();
    if (!forceRefresh && (now - lastFetchTimeRef.current) < FETCH_COOLDOWN) {
      console.log('🔄 Fetch cooldown active, skipping API call');
      return;
    }

    const token = getToken();
    
    if (!token || !isAdmin) {
      if (!isAdmin) {
        setError('Admin access required');
      }
      return;
    }

    // Update last fetch time
    lastFetchTimeRef.current = now;

    setLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      console.log('📡 Making API call to fetch users');
      const { data, error: apiError, source } = await SmartAPI.getUsers(token);
      
      if (apiError) {
        throw apiError;
      }

      setUsers(data?.docs || []);
      setApiSource(source || 'unknown');
      setResponseTime(Math.round(performance.now() - startTime));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      setApiSource('error');
    } finally {
      setLoading(false);
    }
  }, [getToken, isAdmin]); // Stable dependencies only

  // Create user function (optimized)
  const createUser = useCallback(async () => {
    const token = getToken();
    if (!token || !formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('User created successfully!');
        setShowCreateModal(false);
        setFormData({ name: '', email: '', password: '', role: 'creator' });
        await fetchUsers(true); // Force refresh after creation
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create user');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }, [getToken, formData, fetchUsers]);

  // Update user function (optimized)
  const updateUser = useCallback(async () => {
    const token = getToken();
    if (!selectedUser || !token) return;

    setLoading(true);
    setError(null);

    try {
      const updateData: any = {
        name: formData.name,
        role: formData.role,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        setSuccess('User updated successfully!');
        setShowEditModal(false);
        setSelectedUser(null);
        setFormData({ name: '', email: '', password: '', role: 'creator' });
        await fetchUsers(true); // Force refresh after update
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update user');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }, [getToken, selectedUser, formData, fetchUsers]);

  // Delete user function (optimized)
  const deleteUser = useCallback(async () => {
    const token = getToken();
    if (!selectedUser || !token) return;

    if (String(selectedUser.id) === String(currentUserId)) {
      setError('You cannot delete your own account');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setSuccess('User deleted successfully!');
        setShowDeleteModal(false);
        setSelectedUser(null);
        await fetchUsers(true); // Force refresh after deletion
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete user');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }, [getToken, selectedUser, currentUserId, fetchUsers]);

  // Modal handlers (memoized)
  const openEditModal = useCallback((user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setShowEditModal(true);
  }, []);

  const openDeleteModal = useCallback((user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  // Initial fetch - only once when component mounts and user is admin
  useEffect(() => {
    if (isAdmin && !hasInitializedRef.current) {
      console.log('🚀 Initial fetch for admin user');
      hasInitializedRef.current = true;
      fetchUsers();
    }
  }, [isAdmin, fetchUsers]);

  // Auto-clear messages (optimized)
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, clearMessages]);

  // Memoized user rows to prevent unnecessary re-renders
  const userRows = useMemo(() => {
    return users.map((user) => (
      <tr key={user.id} className="border-b border-gray-800">
        <td className="py-3 text-white">{user.name}</td>
        <td className="py-3 text-gray-300">{user.email}</td>
        <td className="py-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            user.role === 'admin' 
              ? 'bg-red-900/20 text-red-400' 
              : user.role === 'creator'
              ? 'bg-blue-900/20 text-blue-400'
              : 'bg-green-900/20 text-green-400'
          }`}>
            {user.role.toUpperCase()}
          </span>
        </td>
        <td className="py-3 text-gray-300">
          {new Date(user.createdAt).toLocaleDateString()}
        </td>
        <td className="py-3">
          <div className="flex space-x-2">
            <button 
              onClick={() => openEditModal(user)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Edit
            </button>
            {String(user.id) !== String(currentUserId) && (
              <button 
                onClick={() => openDeleteModal(user)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </td>
      </tr>
    ));
  }, [users, currentUserId, openEditModal, openDeleteModal]);

  if (!isAdmin) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-lime-400 mb-4">👥 User Management</h2>
        <div className="text-center py-8">
          <p className="text-red-400 mb-2">❌ Access Denied</p>
          <p className="text-gray-400 text-sm">Admin privileges required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-lime-400">👥 User Management</h2>
          <div className="flex items-center space-x-4 mt-2 text-sm">
            <span className="text-gray-400">
              Mode: <span className={`font-medium ${API_CONFIG.useLocalAPI ? 'text-blue-400' : 'text-green-400'}`}>
                {API_CONFIG.mode}
              </span>
            </span>
            {apiSource && (
              <span className="text-gray-400">
                Source: <span className={`font-medium ${
                  apiSource === 'edge-function' ? 'text-green-400' : 
                  apiSource === 'local-api' ? 'text-blue-400' : 'text-red-400'
                }`}>
                  {apiSource.toUpperCase()}
                </span>
              </span>
            )}
            {responseTime && (
              <span className="text-gray-400">
                Time: <span className={`font-medium ${
                  responseTime < 200 ? 'text-green-400' : 
                  responseTime < 1000 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {responseTime}ms
                </span>
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => fetchUsers(true)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button 
            onClick={() => {
              setFormData({ name: '', email: '', password: '', role: 'creator' });
              setShowCreateModal(true);
            }}
            className="bg-lime-600 hover:bg-lime-700 text-black px-4 py-2 rounded transition-colors font-medium"
          >
            Create User
          </button>
        </div>
      </div>

      {/* Development Info Panel */}
      {API_CONFIG.isDevelopment && (
        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-600 rounded">
          <h4 className="text-blue-400 font-medium mb-2">🔧 Development Mode - Performance Optimized</h4>
          <div className="text-sm text-blue-300 space-y-1">
            <p>• Using {API_CONFIG.useLocalAPI ? 'Local API' : 'Edge Functions'} for requests</p>
            <p>• API call cooldown: {FETCH_COOLDOWN}ms to prevent rapid calls</p>
            <p>• Memoized components to prevent unnecessary re-renders</p>
            <p>• Stable dependencies to avoid useEffect loops</p>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {error && (
        <div className="bg-red-900/20 border border-red-600 rounded p-3 mb-4">
          <p className="text-red-400">❌ {error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-900/20 border border-green-600 rounded p-3 mb-4">
          <p className="text-green-400">✅ {success}</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-lime-400 mx-auto"></div>
          <p className="text-gray-400 mt-2">
            Loading via {API_CONFIG.useLocalAPI ? 'Local API' : 'Smart API'}...
          </p>
        </div>
      )}

      {/* Users Table */}
      {!loading && users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="pb-3 text-gray-300">Name</th>
                <th className="pb-3 text-gray-300">Email</th>
                <th className="pb-3 text-gray-300">Role</th>
                <th className="pb-3 text-gray-300">Created</th>
                <th className="pb-3 text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userRows}
            </tbody>
          </table>
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No users found</p>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Create New User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="Enter user name"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'creator' | 'brand' })}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  <option value="creator">Creator</option>
                  <option value="brand">Brand</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createUser}
                disabled={loading}
                className="bg-lime-600 hover:bg-lime-700 text-black px-4 py-2 rounded transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-400"
                  title="Email cannot be changed"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">New Password (optional)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'creator' | 'brand' })}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  <option value="creator">Creator</option>
                  <option value="brand">Brand</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateUser}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Delete User</h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete <strong>{selectedUser.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteUser}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Performance & API Info */}
      <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded">
        <h4 className="text-lime-400 font-medium mb-2">
          ⚡ Performance Optimized - {API_CONFIG.useLocalAPI ? 'Local Development' : 'Edge Functions'}
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <p>✅ <strong>API Call Cooldown</strong> - {FETCH_COOLDOWN}ms protection</p>
            <p>✅ <strong>Memoized Components</strong> - Prevent re-renders</p>
            <p>✅ <strong>Stable Dependencies</strong> - No useEffect loops</p>
          </div>
          <div>
            <p>✅ <strong>Smart Caching</strong> - Intelligent data management</p>
            <p>✅ <strong>Performance Monitoring</strong> - Real-time metrics</p>
            <p>✅ <strong>Optimized Callbacks</strong> - Efficient event handling</p>
          </div>
        </div>
      </div>
    </div>
  );
}
