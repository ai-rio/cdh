'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Mail, 
  Settings, 
  Activity,
  Shield,
  Database,
  BarChart3,
  AlertTriangle
} from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import components to prevent SSR issues
const SmartUserManagement = dynamic(
  () => import('@/app/(frontend)/components/admin/SmartUserManagement'),
  { 
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
);

const ResendAdminUI = dynamic(
  () => import('@/app/(frontend)/components/admin/ResendAdminUI'),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-40" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
);

interface IntegratedAdminPanelProps {
  className?: string;
}

export function IntegratedAdminPanel({ className }: IntegratedAdminPanelProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Check if user has admin access
  const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);

  // Mock admin statistics
  const adminStats = useMemo(() => ({
    totalUsers: 1234,
    activeUsers: 892,
    emailsSent: 5678,
    systemHealth: 'healthy' as const,
    pendingTasks: 12,
    errorCount: 3
  }), []);

  if (!isAdmin) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Shield className="h-5 w-5" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You don&apos;t have permission to access the admin panel. Administrator privileges are required.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Admin Control Panel
            <Badge variant="secondary">Administrator</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Admin Overview Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.emailsSent}</div>
                <p className="text-xs text-muted-foreground">
                  +25% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant={adminStats.systemHealth === 'healthy' ? 'default' : 'destructive'}>
                    {adminStats.systemHealth}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  All systems operational
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              View All Users
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Send Broadcast
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Admin
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Database Connection</span>
                  <Badge variant="default">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>API Gateway</span>
                  <Badge variant="default">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Background Jobs</span>
                  <Badge variant="secondary">Processing</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email Service</span>
                  <Badge variant="outline">Monitoring</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">User Created</div>
                  <div className="text-muted-foreground">john.doe@example.com - 2 minutes ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Email Campaign Sent</div>
                  <div className="text-muted-foreground">Newsletter #42 - 15 minutes ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">System Backup</div>
                  <div className="text-muted-foreground">Completed successfully - 1 hour ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Settings Updated</div>
                  <div className="text-muted-foreground">SMTP configuration - 2 hours ago</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <SmartUserManagement />
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <ResendAdminUI />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">General Settings</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>• Site configuration and branding</div>
                    <div>• User registration settings</div>
                    <div>• Default user roles and permissions</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Email Configuration</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>• SMTP server settings</div>
                    <div>• Email templates and branding</div>
                    <div>• Notification preferences</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Security Settings</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>• Password policies</div>
                    <div>• Two-factor authentication</div>
                    <div>• API rate limiting</div>
                  </div>
                </div>

                <Button className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Open Advanced Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default IntegratedAdminPanel;
