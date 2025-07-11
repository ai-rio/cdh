'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback, useRef, memo } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import SmartUserManagement to prevent SSR issues
const SmartUserManagement = dynamic(
  () => import('@/app/(frontend)/components/admin/SmartUserManagement'),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-800 h-32 rounded-lg"></div>
  }
);

const ResendAdminUI = dynamic(
  () => import('@/app/(frontend)/components/admin/ResendAdminUI'),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-800 h-32 rounded-lg"></div>
  }
);

// Memoized TabButton component to prevent re-renders
const TabButton = memo(({ active, onClick, children }: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode; 
}) => (
  <button
    onClick={onClick}
    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
      active
        ? 'border-lime-400 text-lime-400'
        : 'border-transparent text-gray-400 hover:text-gray-300'
    }`}
  >
    {children}
  </button>
));

TabButton.displayName = 'TabButton';

// Memoized tab components to prevent unnecessary re-renders
const OverviewTab = memo(({ userInfo, userRoles }: { userInfo: any, userRoles: any }) => {
  const { isAdmin, isCreator, isBrand } = userRoles;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-lime-400 mb-4">Profile Info</h2>
          <div className="space-y-2">
            <p><span className="text-gray-400">Name:</span> {userInfo.name}</p>
            <p><span className="text-gray-400">Email:</span> {userInfo.email}</p>
            <p><span className="text-gray-400">Role:</span> {userInfo.role}</p>
            <p><span className="text-gray-400">ID:</span> {userInfo.id}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
});

OverviewTab.displayName = 'OverviewTab';

// Simple memoized placeholder components
const AnalyticsTab = memo(() => (
  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
    <h2 className="text-xl font-semibold text-lime-400 mb-4">Platform Analytics</h2>
    <p className="text-gray-300">Analytics content</p>
  </div>
));

AnalyticsTab.displayName = 'AnalyticsTab';

const SettingsTab = memo(() => (
  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
    <h2 className="text-xl font-semibold text-lime-400 mb-4">System Settings</h2>
    <p className="text-gray-300">Settings content</p>
  </div>
));

SettingsTab.displayName = 'SettingsTab';

const PortfolioTab = memo(() => (
  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
    <h2 className="text-xl font-semibold text-lime-400 mb-4">My Portfolio</h2>
    <p className="text-gray-300">Portfolio content</p>
  </div>
));

PortfolioTab.displayName = 'PortfolioTab';

const OpportunitiesTab = memo(() => (
  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
    <h2 className="text-xl font-semibold text-lime-400 mb-4">Opportunities</h2>
    <p className="text-gray-300">Opportunities content</p>
  </div>
));

OpportunitiesTab.displayName = 'OpportunitiesTab';

const CampaignsTab = memo(() => (
  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
    <h2 className="text-xl font-semibold text-lime-400 mb-4">My Campaigns</h2>
    <p className="text-gray-300">Campaigns content</p>
  </div>
));

CampaignsTab.displayName = 'CampaignsTab';

const FindCreatorsTab = memo(() => (
  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
    <h2 className="text-xl font-semibold text-lime-400 mb-4">Find Creators</h2>
    <p className="text-gray-300">Find creators content</p>
  </div>
));

FindCreatorsTab.displayName = 'FindCreatorsTab';

export default function Dashboard() {
  const { user, logout, isLoading, isInitialized } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Refs to prevent re-render loops and track state
  const mountedRef = useRef(false);

  // Prevent scroll-based re-renders
  useEffect(() => {
    mountedRef.current = true;
    
    // Disable scroll restoration to prevent scroll-based re-renders
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Stable user role checks with proper memoization
  const userRoles = useMemo(() => {
    if (!user?.role) return { isAdmin: false, isCreator: false, isBrand: false };
    
    return {
      isAdmin: user.role === 'admin',
      isCreator: user.role === 'creator',
      isBrand: user.role === 'brand'
    };
  }, [user?.role]); // Only depend on role, not entire user object

  const { isAdmin, isCreator, isBrand } = userRoles;

  // Memoized dashboard title with stable dependency
  const dashboardTitle = useMemo(() => {
    if (isAdmin) return 'Admin Command Center';
    if (isCreator) return 'Creator Dashboard';
    return 'Brand Dashboard';
  }, [isAdmin, isCreator]);

  // Stable user info object with null checks
  const userInfo = useMemo(() => {
    if (!user) return { name: '', email: '', role: 'creator', id: '' };
    
    return {
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'creator',
      id: user.id || ''
    };
  }, [user?.name, user?.email, user?.role, user?.id]);

  // Stable tab change handler with debouncing
  const handleTabChange = useCallback((tab: string) => {
    if (tab !== activeTab && mountedRef.current) {
      setActiveTab(tab);
    }
  }, [activeTab]);

  // Memoized tab buttons to prevent re-renders
  const tabButtons = useMemo(() => {
    const buttons = [
      <TabButton 
        key="overview"
        active={activeTab === 'overview'} 
        onClick={() => handleTabChange('overview')}
      >
        Overview
      </TabButton>
    ];

    if (isCreator) {
      buttons.push(
        <TabButton 
          key="portfolio"
          active={activeTab === 'portfolio'} 
          onClick={() => handleTabChange('portfolio')}
        >
          Portfolio
        </TabButton>,
        <TabButton 
          key="opportunities"
          active={activeTab === 'opportunities'} 
          onClick={() => handleTabChange('opportunities')}
        >
          Opportunities
        </TabButton>
      );
    }

    if (isBrand) {
      buttons.push(
        <TabButton 
          key="campaigns"
          active={activeTab === 'campaigns'} 
          onClick={() => handleTabChange('campaigns')}
        >
          Campaigns
        </TabButton>,
        <TabButton 
          key="creators"
          active={activeTab === 'creators'} 
          onClick={() => handleTabChange('creators')}
        >
          Find Creators
        </TabButton>
      );
    }

    if (isAdmin) {
      buttons.push(
        <TabButton 
          key="users"
          active={activeTab === 'users'} 
          onClick={() => handleTabChange('users')}
        >
          User Management
        </TabButton>,
        <TabButton 
          key="analytics"
          active={activeTab === 'analytics'} 
          onClick={() => handleTabChange('analytics')}
        >
          Platform Analytics
        </TabButton>,
        <TabButton 
          key="settings"
          active={activeTab === 'settings'} 
          onClick={() => handleTabChange('settings')}
        >
          System Settings
        </TabButton>,
        <TabButton 
          key="email"
          active={activeTab === 'email'} 
          onClick={() => handleTabChange('email')}
        >
          Email
        </TabButton>
      );
    }

    return buttons;
  }, [activeTab, isCreator, isBrand, isAdmin, handleTabChange]);

  // Memoized tab content to prevent unnecessary re-renders
  const tabContent = useMemo(() => {
    if (!mountedRef.current) return null;
    
    switch (activeTab) {
      case 'overview':
        return <OverviewTab userInfo={userInfo} userRoles={userRoles} />;
      case 'users':
        return isAdmin ? <SmartUserManagement /> : null;
      case 'analytics':
        return isAdmin ? <AnalyticsTab /> : null;
      case 'settings':
        return isAdmin ? <SettingsTab /> : null;
      case 'email':
        return isAdmin ? <ResendAdminUI /> : null;
      case 'portfolio':
        return isCreator ? <PortfolioTab /> : null;
      case 'opportunities':
        return isCreator ? <OpportunitiesTab /> : null;
      case 'campaigns':
        return isBrand ? <CampaignsTab /> : null;
      case 'creators':
        return isBrand ? <FindCreatorsTab /> : null;
      default:
        return <OverviewTab userInfo={userInfo} userRoles={userRoles} />;
    }
  }, [activeTab, userInfo, userRoles, isAdmin, isCreator, isBrand]);

  // Show loading state - simplified since middleware handles auth redirects
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

  // Show loading if user is still being fetched - middleware will redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ scrollBehavior: 'auto' }}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-lime-400 mb-2">
                {dashboardTitle}
              </h1>
              <p className="text-gray-300">
                Hello, <span className="text-lime-400">{userInfo.name}</span>
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                  {userInfo.role.toUpperCase()}
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
              {tabButtons}
            </nav>
          </div>
        </header>

        {/* Tab Content - Memoized to prevent unnecessary re-renders */}
        <div className="mt-8">
          {tabContent}
        </div>

        {/* Performance indicator */}
        <div className="mt-8 p-4 bg-gray-900 border border-gray-800 rounded-lg">
          <h4 className="text-lime-400 font-medium mb-2">⚡ Performance Optimizations Active:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
            <div>✅ React.memo Components</div>
            <div>✅ Dynamic Imports</div>
            <div>✅ Scroll Optimization</div>
            <div>✅ Mount Protection</div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            User ID: {userInfo.id} | Render Protection: Enhanced | Mounted: {mountedRef.current ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
    </div>
  );
}
