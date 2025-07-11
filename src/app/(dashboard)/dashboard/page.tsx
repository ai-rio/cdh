'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const { user, isLoading, isInitialized } = useAuth();

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

  // Show loading state
  if (!isInitialized || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading your command center...</p>
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
                Welcome back, <span className="text-primary">{userInfo.name}</span>
              </p>
              <Badge variant="secondary">
                {userInfo.role.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {/* Dashboard Cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Welcome Card
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is your dashboard. The sidebar should now be working properly.
              </p>
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm">
                  ✅ Sidebar functionality restored
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                User Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-medium">Name:</span> {userInfo.name}</p>
                <p className="text-sm"><span className="font-medium">Email:</span> {userInfo.email}</p>
                <p className="text-sm"><span className="font-medium">Role:</span> {userInfo.role}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md transition-colors">
                  Primary Action
                </button>
                <button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-md transition-colors">
                  Secondary Action
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status indicator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              ⚡ Dashboard Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-semibold text-primary">✓</div>
                <div className="text-muted-foreground">Styles Loaded</div>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-semibold text-primary">⚡</div>
                <div className="text-muted-foreground">Fast Loading</div>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-semibold text-primary">🎨</div>
                <div className="text-muted-foreground">Styled Components</div>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-semibold text-primary">🚀</div>
                <div className="text-muted-foreground">Ready to Go</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
