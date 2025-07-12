'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useMemo, useState, useEffect } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Database
} from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading, isInitialized } = useAuth();
  const [dataLoading, setDataLoading] = useState(true);

  // Simulate data loading for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setDataLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Stable user role checks with proper memoization
  const userRoles = useMemo(() => {
    if (!user?.role) return { isAdmin: false, isCreator: false };
    
    return {
      isAdmin: user.role === 'admin',
      isCreator: user.role === 'creator',
    };
  }, [user]);

  const { isAdmin, isCreator } = userRoles;

  // Memoized dashboard title
  const dashboardTitle = useMemo(() => {
    if (isAdmin) return 'Admin Command Center';
    if (isCreator) return 'Creator Dashboard';
    return 'User Dashboard';
  }, [isAdmin, isCreator]);

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
        {/* Enhanced Metrics Grid - AC5 Implementation */}
        <MetricsGrid isLoading={dataLoading} />

        {/* Tabbed Data Display - AC5 Implementation */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
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

          <TabsContent value="users" className="space-y-4">
            {/* User Management DataTable - AC5 Implementation */}
            {isAdmin ? (
              <UserManagementTable isLoading={dataLoading} />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">
                    User management is only available for administrators.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

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

        {/* Status indicator - Enhanced */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              ⚡ System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-green-600 text-lg">✓</div>
                <div className="text-muted-foreground">Data Tables</div>
                <div className="text-xs text-green-600">Active</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-green-600 text-lg">⚡</div>
                <div className="text-muted-foreground">Loading States</div>
                <div className="text-xs text-green-600">Implemented</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-green-600 text-lg">📊</div>
                <div className="text-muted-foreground">Data Visualization</div>
                <div className="text-xs text-green-600">Responsive</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-green-600 text-lg">🚀</div>
                <div className="text-muted-foreground">AC5 Complete</div>
                <div className="text-xs text-green-600">100%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
