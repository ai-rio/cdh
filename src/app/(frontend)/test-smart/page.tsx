'use client';

import { useAuth } from '@/contexts/AuthContext';
import SmartUserManagement from '@/app/(frontend)/components/admin/SmartUserManagement';
import { API_CONFIG } from '@/lib/smartAPI';

export default function TestSmartPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-lime-400 mb-8">🧪 Smart API Test Page</h1>
        
        {/* API Configuration Info */}
        <div className="mb-8 p-4 bg-gray-900 border border-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold text-lime-400 mb-4">🔧 API Configuration</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Environment:</strong> {API_CONFIG.isDevelopment ? 'Development' : 'Production'}</p>
              <p><strong>Mode:</strong> {API_CONFIG.mode}</p>
            </div>
            <div>
              <p><strong>Use Local API:</strong> {API_CONFIG.useLocalAPI ? 'Yes' : 'No'}</p>
              <p><strong>Force Local:</strong> {API_CONFIG.forceLocalAPI ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="mb-8 p-4 bg-gray-900 border border-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold text-lime-400 mb-4">👤 Current User</h2>
          {user ? (
            <div className="text-sm">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Is Admin:</strong> {user.role === 'admin' ? 'Yes' : 'No'}</p>
            </div>
          ) : (
            <p className="text-gray-400">Not logged in</p>
          )}
        </div>

        {/* Smart User Management Component */}
        {user?.role === 'admin' ? (
          <SmartUserManagement />
        ) : (
          <div className="p-4 bg-red-900/20 border border-red-600 rounded-lg">
            <p className="text-red-400">Please login as admin to test the Smart User Management component.</p>
            <p className="text-gray-400 mt-2">
              Go to <a href="/" className="text-lime-400 hover:underline">homepage</a> and login with admin credentials.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
