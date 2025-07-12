'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useMemo, useState, useEffect, useCallback, memo } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  MetricsGrid, 
  UserManagementTable, 
  ActivityLogTable, 
  ResponsiveDataVisualization 
} from "@/components/dashboard/dashboard-data-components"
import { EnhancedOverview } from "../components/enhanced-overview"
import { IntegratedAdminPanel } from "../components/integrated-admin-panel"
import { DeprecationNotice } from "../components/deprecation-notice"
import { 
  BarChart3, 
  Users, 
  Activity, 
  Settings,
  TrendingUp,
  Database,
  Briefcase,
  Target,
  Mail,
  Search,
  Shield
} from "lucide-react"
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import control panel components for performance
const SmartUserManagement = dynamic(
  () => import('@/app/(frontend)/components/admin/SmartUserManagement'),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-muted h-32 rounded-lg"></div>
  }
);

const ResendAdminUI = dynamic(
  () => import('@/app/(frontend)/components/admin/ResendAdminUI'),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-muted h-32 rounded-lg"></div>
  }
);

export default function DashboardPage() {
  const { user, isLoading, isInitialized } = useAuth();
  const [dataLoading, setDataLoading] = useState(true);
  const searchParams = useSearchParams();
  const showMigrationNotice = searchParams?.get('migrated') === 'true';

  // Simulate data loading for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setDataLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Stable user role checks with proper memoization
  const userRoles = useMemo(() => {
    if (!user?.role) return { isAdmin: false, isCreator: false, isBrand: false };
    
    return {
      isAdmin: user.role === 'admin',
      isCreator: user.role === 'creator',
      isBrand: user.role === 'brand'
    };
  }, [user]);

  const { isAdmin, isCreator, isBrand } = userRoles;

  // Memoized dashboard title
  const dashboardTitle = useMemo(() => {
    if (isAdmin) return 'Admin Command Center';
    if (isCreator) return 'Creator Dashboard';
    if (isBrand) return 'Brand Dashboard';
    return 'User Dashboard';
  }, [isAdmin, isCreator, isBrand]);

  // Memoized user info
  const userInfo = useMemo(() => {
    if (!user) return null;
    
    return {
      name: user.name || 'User',
      email: user.email || '',
      role: user.role || 'user',
      id: user.id || 'unknown'
    };
  }, [user]);

  // Memoized quick actions from control panel
  const quickActions = useMemo(() => {
    if (isCreator) {
      return [
        { label: 'Update Portfolio', color: 'bg-primary hover:bg-primary/90', icon: Briefcase },
        { label: 'Browse Opportunities', color: 'bg-blue-600 hover:bg-blue-700', icon: Search },
        { label: 'View Earnings', color: 'bg-purple-600 hover:bg-purple-700', icon: TrendingUp }
      ];
    }
    
    if (isBrand) {
      return [
        { label: 'Create Campaign', color: 'bg-primary hover:bg-primary/90', icon: Target },
        { label: 'Find Creators', color: 'bg-blue-600 hover:bg-blue-700', icon: Search },
        { label: 'Campaign Analytics', color: 'bg-purple-600 hover:bg-purple-700', icon: BarChart3 }
      ];
    }
    
    if (isAdmin) {
      return [
        { label: 'Manage Users', color: 'bg-primary hover:bg-primary/90', icon: Users },
        { label: 'Platform Analytics', color: 'bg-blue-600 hover:bg-blue-700', icon: BarChart3 },
        { label: 'System Settings', color: 'bg-purple-600 hover:bg-purple-700', icon: Settings }
      ];
    }
    
    return [];
  }, [isCreator, isBrand, isAdmin]);

  // Quick action handler
  const handleQuickAction = useCallback((action: string) => {
    // Add navigation logic here based on the action
    console.log('Quick action:', action);
  }, []);

  // Show loading state with skeleton
  if (!isInitialized || isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <Skeleton className="h-8 w-8" />
            <div className="h-4 w-px bg-border" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-[100px]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-[80px] mb-2" />
                  <Skeleton className="h-4 w-[60px]" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show loading if user is still being fetched
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="sidebar-trigger" />
          <div className="h-4 w-px bg-border" />
          <div>
            <h1 className="text-2xl font-bold text-primary">
              {dashboardTitle}
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Welcome back, <span className="text-primary">{userInfo?.name || 'User'}</span>
              </p>
              <Badge variant="secondary">
                {userInfo?.role?.toUpperCase() || 'USER'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4">
        {/* Migration Success Notice */}
        {showMigrationNotice && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <strong>Welcome to the Enhanced Dashboard!</strong> You've been automatically redirected from the deprecated control panel. All your familiar features are now available here with improved performance and new capabilities.
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Profile Overview */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{userInfo?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{userInfo?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Role:</span>
                <Badge variant="secondary">{userInfo?.role?.toUpperCase()}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="text-xs font-mono">{userInfo?.id}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    onClick={() => handleQuickAction(action.label)}
                    className={`w-full ${action.color} text-white`}
                    size="sm"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="text-muted-foreground">• Account created successfully</div>
              <div className="text-muted-foreground">• Profile setup completed</div>
              <div className="text-muted-foreground">
                • Welcome to {isAdmin ? 'Admin Panel' : isCreator ? "Creator's Deal Hub" : isBrand ? 'Brand Portal' : 'Dashboard'}!
              </div>
              {isAdmin && <div className="text-muted-foreground">• Admin privileges granted</div>}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Metrics Grid - AC5 Implementation */}
        <MetricsGrid isLoading={dataLoading} />

        {/* Enhanced Tabbed Interface with Role-based Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            {isCreator && (
              <>
                <TabsTrigger value="portfolio" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Portfolio
                </TabsTrigger>
                <TabsTrigger value="opportunities" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Opportunities
                </TabsTrigger>
              </>
            )}
            {isBrand && (
              <>
                <TabsTrigger value="campaigns" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Campaigns
                </TabsTrigger>
                <TabsTrigger value="creators" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Find Creators
                </TabsTrigger>
              </>
            )}
            {isAdmin && (
              <>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  User Management
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Admin
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Migration Success Notice */}
            <DeprecationNotice />
            
            {/* Enhanced Overview with Visual Feedback */}
            <EnhancedOverview />
            
            {/* Integrated Admin Panel for Admin Users */}
            {isAdmin && (
              <IntegratedAdminPanel />
            )}
          </TabsContent>

          {/* Creator-specific tabs */}
          {isCreator && (
            <>
              <TabsContent value="portfolio" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      My Portfolio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Portfolio Management</h3>
                      <p className="text-muted-foreground mb-4">
                        Showcase your work and manage your creator portfolio.
                      </p>
                      <Button>
                        <Briefcase className="h-4 w-4 mr-2" />
                        Manage Portfolio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="opportunities" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Browse Opportunities</h3>
                      <p className="text-muted-foreground mb-4">
                        Find brand partnerships and collaboration opportunities.
                      </p>
                      <Button>
                        <Search className="h-4 w-4 mr-2" />
                        Browse Opportunities
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}

          {/* Brand-specific tabs */}
          {isBrand && (
            <>
              <TabsContent value="campaigns" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      My Campaigns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Campaign Management</h3>
                      <p className="text-muted-foreground mb-4">
                        Create and manage your brand campaigns.
                      </p>
                      <Button>
                        <Target className="h-4 w-4 mr-2" />
                        Create Campaign
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="creators" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Find Creators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Creator Discovery</h3>
                      <p className="text-muted-foreground mb-4">
                        Find and connect with creators that match your brand.
                      </p>
                      <Button>
                        <Search className="h-4 w-4 mr-2" />
                        Find Creators
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}

          {/* Admin-specific tabs */}
          {isAdmin && (
            <>
              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SmartUserManagement />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="email" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Administration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResendAdminUI />
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}

          <TabsContent value="activity" className="space-y-4">
            {/* Activity Log DataTable - AC5 Implementation */}
            <ActivityLogTable isLoading={dataLoading} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {/* Advanced Analytics - Placeholder for future implementation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Advanced Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-[200px] w-full" />
                    <div className="grid grid-cols-3 gap-4">
                      <Skeleton className="h-[100px]" />
                      <Skeleton className="h-[100px]" />
                      <Skeleton className="h-[100px]" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                    <p className="text-muted-foreground mb-4">
                      Detailed analytics and reporting features coming soon.
                    </p>
                    <Button variant="outline">
                      Request Early Access
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced Status indicator with Migration Notice */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Dashboard Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <strong>Migration Complete:</strong> All control panel functionality has been successfully integrated into this enhanced dashboard.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-green-600 text-lg">✓</div>
                <div className="text-muted-foreground">Role-based UI</div>
                <div className="text-xs text-green-600">Active</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-green-600 text-lg">⚡</div>
                <div className="text-muted-foreground">Dynamic Components</div>
                <div className="text-xs text-green-600">Loaded</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-green-600 text-lg">📊</div>
                <div className="text-muted-foreground">Quick Actions</div>
                <div className="text-xs text-green-600">Integrated</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-green-600 text-lg">🔧</div>
                <div className="text-muted-foreground">Admin Tools</div>
                <div className="text-xs text-green-600">Enhanced</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-green-600 text-lg">🚀</div>
                <div className="text-muted-foreground">Migration</div>
                <div className="text-xs text-green-600">Complete</div>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-muted-foreground text-center">
              User ID: {userInfo?.id} | Role: {userInfo?.role} | Performance Optimizations: Enhanced
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
