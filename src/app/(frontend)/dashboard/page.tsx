'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, logout, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after auth is initialized and user is not authenticated
    if (isInitialized && !isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, isInitialized, router]);

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
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-lime-400 mb-2">
              Welcome to Command Center
            </h1>
            <p className="text-gray-300">
              Hello, <span className="text-lime-400">{user.name}</span>
            </p>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </header>

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
              <button className="w-full bg-lime-600 hover:bg-lime-700 text-black px-4 py-2 rounded transition-colors">
                Create New Deal
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                Browse Opportunities
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">
                View Analytics
              </button>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-lime-400 mb-4">Recent Activity</h2>
            <div className="space-y-3 text-sm text-gray-300">
              <p>• Account created successfully</p>
              <p>• Profile setup completed</p>
              <p>• Welcome to Creator&apos;s Deal Hub!</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-lime-400 mb-4">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">For Creators</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Complete your creator profile</li>
                <li>• Upload your portfolio</li>
                <li>• Set your rates and availability</li>
                <li>• Browse brand partnerships</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">For Brands</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Set up your brand profile</li>
                <li>• Define your campaign goals</li>
                <li>• Search for creators</li>
                <li>• Launch your first campaign</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
