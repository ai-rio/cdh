'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user, logout, isLoading, isInitialized } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Only redirect after auth is initialized and user is not authenticated
    if (isInitialized && !isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, isInitialized, router]);

  // Helper function to check if user has admin privileges
  const isAdmin = user?.role === 'admin';
  const isCreator = user?.role === 'creator';
  const isBrand = user?.role === 'brand';

  // Show loading while auth is initializing or loading
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-400 mx-auto mb-4"></div>
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
                {isAdmin ? 'Admin Command Center' : isCreator ? 'Creator Dashboard' : 'Brand Dashboard'}
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
                    {isCreator && (
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
                    )}
                    {isBrand && (
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
                    )}
                    {isAdmin && (
                      <>
                        <button className="w-full bg-lime-600 hover:bg-lime-700 text-black px-4 py-2 rounded transition-colors">
                          Manage Users
                        </button>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                          Platform Analytics
                        </button>
                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">
                          System Settings
                        </button>
                      </>
                    )}
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
                {isCreator && (
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
                )}
                {isBrand && (
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
                )}
                {isAdmin && (
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
                )}
              </div>
            </div>)}

          {/* Portfolio Tab - For Creators */}
          {activeTab === 'portfolio' && isCreator && (
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-lime-400 mb-4">My Portfolio</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="w-full h-32 bg-gray-700 rounded mb-3 flex items-center justify-center">
                      <span className="text-gray-400">Upload Content</span>
                    </div>
                    <button className="w-full bg-lime-600 hover:bg-lime-700 text-black px-4 py-2 rounded transition-colors">
                      Add New Work
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Opportunities Tab - For Creators */}
          {activeTab === 'opportunities' && isCreator && (
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-lime-400 mb-4">Available Opportunities</h2>
                <div className="space-y-4">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-2">Brand Partnership Opportunity</h3>
                    <p className="text-gray-300 mb-3">Looking for content creators in lifestyle and wellness niche...</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lime-400 font-semibold">$500 - $1,500</span>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Campaigns Tab - For Brands */}
          {activeTab === 'campaigns' && isBrand && (
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-lime-400">My Campaigns</h2>
                  <button className="bg-lime-600 hover:bg-lime-700 text-black px-4 py-2 rounded transition-colors">
                    Create New Campaign
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-2">Summer Collection Launch</h3>
                    <p className="text-gray-300 mb-3">Status: Active • 5 creators engaged</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lime-400 font-semibold">Budget: $5,000</span>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Find Creators Tab - For Brands */}
          {activeTab === 'find-creators' && isBrand && (
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-lime-400 mb-4">Find Creators</h2>
                <div className="mb-6">
                  <input 
                    type="text" 
                    placeholder="Search creators by niche, location, or keywords..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-full mb-3"></div>
                    <h3 className="text-lg font-medium text-white mb-1">Creator Name</h3>
                    <p className="text-gray-300 text-sm mb-3">Lifestyle • 50K followers</p>
                    <button className="w-full bg-lime-600 hover:bg-lime-700 text-black px-4 py-2 rounded transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Management Tab - For Admins */}
          {activeTab === 'user-management' && isAdmin && (
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-lime-400 mb-4">User Management</h2>
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
                      <tr className="border-b border-gray-800">
                        <td className="py-3 text-white">John Doe</td>
                        <td className="py-3 text-gray-300">john@example.com</td>
                        <td className="py-3 text-gray-300">Creator</td>
                        <td className="py-3 text-green-400">Active</td>
                        <td className="py-3">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                            Edit
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Platform Analytics Tab - For Admins */}
          {activeTab === 'platform-analytics' && isAdmin && (
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

          {/* System Settings Tab - For Admins */}
          {activeTab === 'system-settings' && isAdmin && (
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
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Maintenance Mode</span>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
                          Disabled
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
