'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'creator' | 'brand';
  createdAt: string;
  updatedAt: string;
}

export default function FullUserManagement() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
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

  const fetchUsers = async () => {
    if (!token || currentUser?.role !== 'admin') {
      setError('Admin access required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.docs || []);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch users');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
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
        fetchUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create user');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async () => {
    if (!selectedUser || !token) return;

    setLoading(true);
    setError(null);

    try {
      const updateData: any = {
        name: formData.name,
        role: formData.role,
      };

      // Only include password if it's provided
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
        fetchUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update user');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    if (!selectedUser || !token) return;

    // Prevent admin from deleting themselves
    if (selectedUser.id === currentUser?.id) {
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
        fetchUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete user');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  useEffect(() => {
    if (currentUser?.role === 'admin' && token) {
      fetchUsers();
    }
  }, [currentUser, token]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  if (currentUser?.role !== 'admin') {
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
        <h2 className="text-xl font-semibold text-lime-400">👥 User Management</h2>
        <div className="flex space-x-3">
          <button 
            onClick={fetchUsers}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors font-medium"
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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-lime-400 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading...</p>
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
              {users.map((user) => (
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
                      {user.id !== currentUser?.id && (
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
              ))}
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
                className="bg-lime-600 hover:bg-lime-700 text-black px-4 py-2 rounded transition-colors font-medium"
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors font-medium"
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
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors font-medium"
              >
                {loading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Actions Summary */}
      <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded">
        <h4 className="text-white font-medium mb-2">🔧 Available Admin Actions:</h4>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <p>✅ <strong>Create Users</strong> - Add new users with any role</p>
            <p>✅ <strong>Edit Users</strong> - Update names, passwords, and roles</p>
            <p>✅ <strong>Delete Users</strong> - Remove users (except yourself)</p>
          </div>
          <div>
            <p>✅ <strong>Role Management</strong> - Promote/demote user roles</p>
            <p>✅ <strong>Real-time Data</strong> - Live updates from database</p>
            <p>✅ <strong>Security</strong> - Protected admin-only operations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
