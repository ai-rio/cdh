'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function SimpleUserManagement() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('SimpleUserManagement rendering:', { currentUser, token: !!token });

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
        console.log('Users fetched:', data.docs?.length || 0);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch users');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin' && token) {
      fetchUsers();
    }
  }, [currentUser, token]);

  if (currentUser?.role !== 'admin') {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-lime-400 mb-4">👥 User Management</h2>
        <div className="text-center py-8">
          <p className="text-red-400 mb-2">❌ Access Denied</p>
          <p className="text-gray-400 text-sm">Admin privileges required</p>
          <div className="mt-4 text-xs text-gray-500">
            <p>Current user: {currentUser?.name || 'Not logged in'}</p>
            <p>Current role: {currentUser?.role || 'No role'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-lime-400 mb-4">👥 User Management</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">System Users</h3>
          <button 
            onClick={fetchUsers}
            disabled={loading}
            className="bg-lime-600 hover:bg-lime-700 text-black px-4 py-2 rounded transition-colors font-medium"
          >
            {loading ? 'Loading...' : 'Refresh Users'}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-600 rounded p-3">
            <p className="text-red-400">❌ Error: {error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-lime-400 mx-auto"></div>
            <p className="text-gray-400 mt-2">Loading users...</p>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No users found</p>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="space-y-3">
            <p className="text-lime-400 font-medium">✅ Found {users.length} users:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-3 text-gray-300">Name</th>
                    <th className="pb-3 text-gray-300">Email</th>
                    <th className="pb-3 text-gray-300">Role</th>
                    <th className="pb-3 text-gray-300">Status</th>
                    <th className="pb-3 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id || index} className="border-b border-gray-800">
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
                          {user.role?.toUpperCase() || 'NO ROLE'}
                        </span>
                      </td>
                      <td className="py-3 text-green-400">Active</td>
                      <td className="py-3">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded">
          <h4 className="text-white font-medium mb-2">🔧 Admin Actions Available:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>✅ View all users with real-time data</li>
            <li>✅ See user roles and status</li>
            <li>✅ Refresh user data on demand</li>
            <li>🔄 Create/Edit/Delete users (API ready)</li>
            <li>🔄 Role promotion/demotion (API ready)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
