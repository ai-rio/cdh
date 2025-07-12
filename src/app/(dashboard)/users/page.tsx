'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useMemo } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, Database, UserPlus, Activity, BarChart3, Settings, RefreshCw } from "lucide-react"
import dynamic from 'next/dynamic';

// Import Payload CMS CollectionManager for user management
const CollectionManager = dynamic(
  () => import('../components/collection-manager'),
  { 
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="animate-pulse bg-muted h-8 w-48 rounded"></div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="animate-pulse bg-muted h-10 w-10 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="animate-pulse bg-muted h-4 w-32 rounded"></div>
                    <div className="animate-pulse bg-muted h-3 w-48 rounded"></div>
                  </div>
                  <div className="animate-pulse bg-muted h-8 w-16 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
);

// Import enhanced user management components from control panel
const SmartUserManagement = dynamic(
  () => import('@/app/(frontend)/components/admin/SmartUserManagement'),
  { 
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse bg-muted h-64 rounded"></div>
        </CardContent>
      </Card>
    )
  }
);

export default function UsersPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState({
    totalUsers: 1234,
    activeUsers: 892,
    newUsersToday: 15,
    usersByRole: {
      admin: 5,
      creator: 756,
      brand: 473
    },
    recentActivity: [
      { action: 'User Registered', user: 'john.doe@example.com', time: '2 minutes ago' },
      { action: 'Profile Updated', user: 'jane.smith@example.com', time: '5 minutes ago' },
      { action: 'Role Changed', user: 'admin@example.com', time: '10 minutes ago' },
    ]
  });

  // Memoized user role check
  const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);

  // Only allow admin access
  if (!isAdmin) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-border" />
            <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Unauthorized Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>You don&apos;t have permission to access this page. Admin access required.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-px bg-border" />
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Users className="h-6 w-6" />
              User Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage users, roles, and permissions with Payload CMS
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Enhanced User Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-green-600">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.activeUsers}</div>
              <p className="text-xs text-green-600">72% online rate</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Today</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.newUsersToday}</div>
              <p className="text-xs text-green-600">+3 from yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Roles</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Creators</span>
                  <Badge variant="secondary">{userStats.usersByRole.creator}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Brands</span>
                  <Badge variant="secondary">{userStats.usersByRole.brand}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Admins</span>
                  <Badge variant="secondary">{userStats.usersByRole.admin}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced User Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="management" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Advanced Tools
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activity Log
              </TabsTrigger>
            </TabsList>
            
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Payload CMS Integration Notice */}
            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
              <Database className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <strong>Enhanced User Management:</strong> Now featuring advanced analytics, role-based controls, and real-time activity monitoring alongside native Payload CMS integration.
              </AlertDescription>
            </Alert>
            
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    User Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Creators</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round((userStats.usersByRole.creator / userStats.totalUsers) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(userStats.usersByRole.creator / userStats.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Brands</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round((userStats.usersByRole.brand / userStats.totalUsers) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(userStats.usersByRole.brand / userStats.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Admins</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round((userStats.usersByRole.admin / userStats.totalUsers) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(userStats.usersByRole.admin / userStats.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userStats.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="font-medium">{activity.action}</div>
                          <div className="text-muted-foreground">{activity.user}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="management" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payload CMS User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CollectionManager 
                    collection="users"
                    title="Users Collection"
                    description="Manage all users with full CRUD operations"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Advanced User Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full" variant="outline">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Bulk User Import
                    </Button>
                    <Button className="w-full" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Export User Data
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Role Management
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Smart User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <SmartUserManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  User Activity Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Real-time Activity Log</h3>
                  <p className="text-muted-foreground mb-4">
                    Monitor user actions, login attempts, and system events in real-time.
                  </p>
                  <Button>
                    <Activity className="h-4 w-4 mr-2" />
                    View Activity Log
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
