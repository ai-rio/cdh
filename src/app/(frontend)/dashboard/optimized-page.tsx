'use client';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, lazy, Suspense } from 'react';

// Lazy load heavy components
const OptimizedUserManagement = lazy(() => import('@/app/(frontend)/components/admin/OptimizedUserManagement'));

// Loading component for lazy-loaded components
const ComponentLoader = ({ name }: { name: string }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400 mx-auto mb-4"></div>
      <p className="text-gray-400">Loading {name}...</p>
    </div>
  </div>
);

export default function OptimizedDashboard() {
  const { user, logout, isLoading, isInitialized } = useOptimizedAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Memoized role checks to prevent recalculation
  const userRoles = useMemo(() => ({
    isAdmin: user?.role === 'admin',
    isCreator: user?.role === 'creator',
    isBrand: user?.role === 'brand'
  }), [user?.role]);

  const { isAdmin, isCreator, isBrand } = userRoles;

  // Memoized dashboard title
  const dashboardTitle = useMemo(() => {
    if (isAdmin) return 'Admin Command Center';
    if (isCreator) return 'Creator Dashboard';
    return 'Brand Dashboard';
  }, [isAdmin, isCreator]);

  // Optimized redirect logic
  useEffect(() => {
    if (isInitialized && !isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, isInitialized, router]);

  // Memoized quick actions to prevent re-renders
  const quickActions = useMemo(() => {
    if (isCreator) {
      return (
        <>
          <button className="w-full bg-lime-600 hover:bg-lime-700 text-black px-4 py-2 rounded transition-colors">
            Update Portfolio
          </button>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
            Browse Opportunities
          </button>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">
            View Earnings
          </button>
        </>
      );
    }
    
    if (isBrand) {
      return (
        <>
          <button className="w-full bg-lime-600 hover:bg-lime-700 text-black px-4 py-2 rounded transition-colors">
            Create Campaign
          </button>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
            Find Creators
          </button>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">
            Campaign Analytics
          </button>
        </>
      );
    }
    
    if (isAdmin) {
      return (
        <>
          <button 
            className="w-full bg-lime-600 hover:bg-lime-700 text-black px-4 py-2 rounded transition-colors"
            onClick={() => setActiveTab('users')}
          >
            Manage Users
          </button>
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            onClick={() => setActiveTab('analytics')}
          >
            Platform Analytics
          </button>
          <button 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
            onClick={() => setActiveTab('settings')}
          >
            System Settings
          </button>
        </>
      );
    }
    
    return null;
  }, [isCreator, isBrand, isAdmin]);

  // Memoized getting started content
  const gettingStartedContent = useMemo(() => {
    if (isCreator) {
      return (
        <div>
          <h3 className="text-lg font-medium text-white mb-2">Creator Checklist</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Complete your creator profile</li>
            <li>• Upload your portfolio and showcase your work</li>
            <li>• Set your rates and availability</li>
            <li>• Browse brand partnerships and opportunities</li>
            <li>• Connect your social media accounts</li>
          </ul>
        </div>
      );
    }
    
    if (isBrand) {
      return (
        <div>
          <h3 className="text-lg font-medium text-white mb-2">Brand Checklist</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Set up your brand profile and company information</li>
            <li>• Define your campaign goals and target audience</li>
            <li>• Set your budget and campaign parameters</li>
            <li>• Search for creators that match your brand</li>
            <li>• Launch your first campaign</li>
          </ul>
        </div>
      );
    }
    
    if (isAdmin) {
      return (
        <div>
          <h3 className="text-lg font-medium text-white mb-2">Admin Dashboard</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Monitor platform activity and user engagement</li>
            <li>• Manage user accounts and permissions</li>
            <li>• Review and moderate content</li>
            <li>• Analyze platform performance metrics</li>
            <li>• Configure system settings and features</li>
          </ul>
        </div>
      );
    }
    
    return null;
  }, [isCreator, isBrand, isAdmin]);

  // Show optimized loading state
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading your command center...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-lime-400 mb-2">
                {dashboardTitle}
              </h1>
              <p className="text-gray-300">
                Hello, <span className="text-lime-400">{user.name}</span>
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                  {user.role?.toUpperCase()}
                </span>
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
          
          {/* Navigation Tabs */}
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-lime-400 text-lime-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Overview
              </button>
              
              {isCreator && (
                <>
                  <button
                    onClick={() => setActiveTab('portfolio')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'portfolio'
                        ? 'border-lime-400 text-lime-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Portfolio
                  </button>
                  <button
                    onClick={() => setActiveTab('opportunities')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'opportunities'
                        ? 'border-lime-400 text-lime-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Opportunities
                  </button>
                </>
              )}
              
              {isBrand && (
                <>
                  <button
                    onClick={() => setActiveTab('campaigns')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'campaigns'
                        ? 'border-lime-400 text-lime-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Campaigns
                  </button>
                  <button
                    onClick={() => setActiveTab('creators')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'creators'
                        ? 'border-lime-400 text-lime-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Find Creators
                  </button>
                </>
              )}
              
              {isAdmin && (
                <>
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'users'
                        ? 'border-lime-400 text-lime-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    User Management
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'analytics'
                        ? 'border-lime-400 text-lime-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Platform Analytics
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'settings'
                        ? 'border-lime-400 text-lime-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    System Settings
                  </button>
                </>
              )}
            </nav>
          </div>
        </header>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-lime-400 mb-4">Profile Info</h2>
                  <div className="space-y-2">
                    <p><span className="text-gray-400">Name:</span> {user.name}</p>
                    <p><span className="text-gray-400">Email:</span> {user.email}</p>
                    <p><span className="text-gray-400">Role:</span> {user.role || 'Creator'}</p>
                    <p><span className="text-gray-400">ID:</span> {user.id}</p>
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-lime-400 mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    {quickActions}
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-lime-400 mb-4">Recent Activity</h2>
                  <div className="space-y-3 text-sm text-gray-300">
                    <p>• Account created successfully</p>
                    <p>• Profile setup completed</p>
                    <p>• Welcome to {isAdmin ? 'Admin Panel' : isCreator ? "Creator's Deal Hub" : 'Brand Portal'}!</p>
                    {isAdmin && <p>• Admin privileges granted</p>}
                  </div>
                </div>
              </div>

              {/* Role-specific getting started section */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-lime-400 mb-4">Getting Started</h2>
                {gettingStartedContent}
              </div>
            </div>
          )}

          {/* User Management Tab - For Admins (Lazy Loaded) */}
          {activeTab === 'users' && isAdmin && (
            <div className="space-y-6">
              <Suspense fallback={<ComponentLoader name="User Management" />}>
                <OptimizedUserManagement />
              </Suspense>
            </div>
          )}

          {/* Other tabs remain the same but can be lazy loaded if needed */}
          {activeTab === 'analytics' && isAdmin && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-lime-400 mb-2">Total Users</h3>
                  <p className="text-3xl font-bold text-white">1,234</p>
                  <p className="text-green-400 text-sm">+12% this month</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-lime-400 mb-2">Active Campaigns</h3>
                  <p className="text-3xl font-bold text-white">56</p>
                  <p className="text-green-400 text-sm">+8% this month</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-lime-400 mb-2">Revenue</h3>
                  <p className="text-3xl font-bold text-white">$45,678</p>
                  <p className="text-green-400 text-sm">+15% this month</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-lime-400 mb-2">Partnerships</h3>
                  <p className="text-3xl font-bold text-white">89</p>
                  <p className="text-green-400 text-sm">+5% this month</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings tab content */}
          {activeTab === 'settings' && isAdmin && (
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-lime-400 mb-4">System Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Platform Configuration</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">User Registration</span>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
                          Enabled
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Email Notifications</span>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
                          Enabled
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Performance indicator */}
        <div className="mt-8 p-4 bg-gray-900 border border-gray-800 rounded-lg">
          <h4 className="text-lime-400 font-medium mb-2">⚡ Performance Optimizations Active:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
            <div>✅ Lazy Loading</div>
            <div>✅ Data Caching</div>
            <div>✅ Memoization</div>
            <div>✅ Request Optimization</div>
          </div>
        </div>
      </div>
    </div>
  );
}
