'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

import SimpleUserManagement from '@/app/(frontend)/components/admin/SimpleUserManagement';

export default function SimpleAdminTest() {
  const { user, token } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');

  console.log('SimpleAdminTest rendering:', { user, token, activeSection });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🔧 Simple Admin Test</h1>
          <p className="text-gray-400">Testing admin dashboard functionality</p>
        </div>

        {/* User Info */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Current User Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-white space-y-2">
              <p><strong>User:</strong> {user ? `${user.name} (${user.email})` : 'Not logged in'}</p>
              <p><strong>Role:</strong> {user?.role || 'None'}</p>
              <p><strong>Has Token:</strong> {token ? 'Yes' : 'No'}</p>
              <p><strong>Is Admin:</strong> {user?.role === 'admin' ? '✅ YES' : '❌ NO'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex space-x-4 mb-6">
          <Button 
            onClick={() => setActiveSection('overview')}
            variant={activeSection === 'overview' ? 'default' : 'outline'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Overview
          </Button>
          <Button 
            onClick={() => setActiveSection('users')}
            variant={activeSection === 'users' ? 'default' : 'outline'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            User Management
          </Button>
          <Button 
            onClick={() => setActiveSection('test')}
            variant={activeSection === 'test' ? 'default' : 'outline'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Test Section
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeSection === 'overview' && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">📊 Overview Section</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-white space-y-4">
                  <h2 className="text-xl font-bold text-green-400">✅ Overview is Working!</h2>
                  <p>This is the overview section content.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-900/20 p-4 rounded border border-blue-600">
                      <h3 className="font-semibold text-blue-400">Total Users</h3>
                      <p className="text-2xl font-bold">5</p>
                    </div>
                    <div className="bg-green-900/20 p-4 rounded border border-green-600">
                      <h3 className="font-semibold text-green-400">Admin Users</h3>
                      <p className="text-2xl font-bold">2</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'users' && (
            <SimpleUserManagement />
          )}

          {activeSection === 'test' && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">🧪 Test Section</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-white space-y-4">
                  <h2 className="text-xl font-bold text-purple-400">✅ Test Section is Working!</h2>
                  <p>This proves that the component rendering system is functional.</p>
                  <div className="bg-purple-900/20 p-4 rounded border border-purple-600">
                    <h3 className="font-semibold text-purple-400">Component Test Results</h3>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>✅ React components rendering</li>
                      <li>✅ State management working</li>
                      <li>✅ Event handlers functional</li>
                      <li>✅ UI components displaying</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
