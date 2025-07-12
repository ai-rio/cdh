'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Mail, 
  Settings, 
  Activity,
  Shield,
  Database,
  BarChart3,
  AlertTriangle,
  Clock,
  TrendingUp,
  CheckCircle,
  Monitor
} from "lucide-react";
import dynamic from 'next/dynamic';

// Import our Payload CMS integration components
const CollectionManager = dynamic(
  () => import('./collection-manager'),
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

// Email management component using Payload CMS
const PayloadEmailManager = dynamic(
  () => import('./payload-email-manager'),
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

  // Enhanced admin statistics from control panel integration
  const adminStats = useMemo(() => ({
    totalUsers: 1234,
    activeUsers: 892,
    emailsSent: 5678,
    systemHealth: 'healthy' as const,
    pendingTasks: 12,
    errorCount: 3,
    campaigns: 56,
    revenue: 45678,
    partnerships: 89,
    uptime: 99.9,
    responseTime: 234
  }), []);

  // Performance metrics for enhanced overview
  const performanceMetrics = useMemo(() => ({
    cpuUsage: 45,
    memoryUsage: 67,
    diskUsage: 23,
    networkLatency: 12
  }), []);

  // Recent admin actions from control panel
  const recentActions = useMemo(() => [
    { action: 'User Created', details: 'john.doe@example.com', time: '2 minutes ago', status: 'success' },
    { action: 'Email Campaign Sent', details: 'Newsletter #42', time: '15 minutes ago', status: 'success' },
    { action: 'System Backup', details: 'Completed successfully', time: '1 hour ago', status: 'success' },
    { action: 'Settings Updated', details: 'SMTP configuration', time: '2 hours ago', status: 'info' },
    { action: 'User Login Failed', details: 'Multiple attempts blocked', time: '3 hours ago', status: 'warning' }
  ], []);

  // Tab change handler
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

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
          {/* Enhanced Admin Overview Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-green-600">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.campaigns}</div>
                <p className="text-xs text-green-600">
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${adminStats.revenue.toLocaleString()}</div>
                <p className="text-xs text-green-600">
                  +15% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Partnerships</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.partnerships}</div>
                <p className="text-xs text-green-600">
                  +5% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <Monitor className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.uptime}%</div>
                <p className="text-xs text-green-600">
                  All systems operational
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Performance Indicators */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">CPU Usage</span>
                  <span className="text-sm text-muted-foreground">{performanceMetrics.cpuUsage}%</span>
                </div>
                <Progress value={performanceMetrics.cpuUsage} className="h-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Memory Usage</span>
                  <span className="text-sm text-muted-foreground">{performanceMetrics.memoryUsage}%</span>
                </div>
                <Progress value={performanceMetrics.memoryUsage} className="h-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Disk Usage</span>
                  <span className="text-sm text-muted-foreground">{performanceMetrics.diskUsage}%</span>
                </div>
                <Progress value={performanceMetrics.diskUsage} className="h-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Response Time</span>
                  <span className="text-sm text-muted-foreground">{performanceMetrics.networkLatency}ms</span>
                </div>
                <Progress value={Math.min(performanceMetrics.networkLatency / 5, 100)} className="h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleTabChange('users')}
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleTabChange('email')}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Admin
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleTabChange('settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleTabChange('overview')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Platform Analytics
            </Button>
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Activity Log
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Admin Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
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
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Database Connection</span>
                  <Badge variant="default" className="bg-green-600">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>API Gateway</span>
                  <Badge variant="default" className="bg-green-600">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Background Jobs</span>
                  <Badge variant="secondary" className="bg-blue-600 text-white">Processing</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email Service</span>
                  <Badge variant="outline" className="border-green-600 text-green-600">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payload CMS</span>
                  <Badge variant="default" className="bg-green-600">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>File Storage</span>
                  <Badge variant="default" className="bg-green-600">Available</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Recent Admin Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActions.map((action, index) => {
                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case 'success': return 'text-green-600';
                      case 'warning': return 'text-yellow-600';
                      case 'error': return 'text-red-600';
                      default: return 'text-blue-600';
                    }
                  };

                  return (
                    <div key={index} className="text-sm border-l-2 border-l-muted pl-3">
                      <div className="font-medium flex items-center gap-2">
                        {action.action}
                        <span className={`text-xs ${getStatusColor(action.status)}`}>
                          • {action.status}
                        </span>
                      </div>
                      <div className="text-muted-foreground">{action.details}</div>
                      <div className="text-xs text-muted-foreground">{action.time}</div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Platform Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{adminStats.totalUsers}</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{adminStats.campaigns}</div>
                    <div className="text-sm text-muted-foreground">Active Campaigns</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">${adminStats.revenue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{adminStats.partnerships}</div>
                    <div className="text-sm text-muted-foreground">Partnerships</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>User Growth</span>
                  <span className="text-green-600 font-medium">+12% MoM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Campaign Growth</span>
                  <span className="text-green-600 font-medium">+8% MoM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Revenue Growth</span>
                  <span className="text-green-600 font-medium">+15% MoM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Partnership Growth</span>
                  <span className="text-green-600 font-medium">+5% MoM</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <CollectionManager 
            collection="users"
            title="User Management"
            description="Manage users, roles, and permissions"
          />
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <PayloadEmailManager />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Platform Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    General Settings
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Registration</span>
                      <Button size="sm" variant="outline" className="bg-green-600 text-white border-green-600 hover:bg-green-700">
                        Enabled
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Notifications</span>
                      <Button size="sm" variant="outline" className="bg-green-600 text-white border-green-600 hover:bg-green-700">
                        Enabled
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Maintenance Mode</span>
                      <Button size="sm" variant="outline">
                        Disabled
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Configuration
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>• SMTP server: smtp.gmail.com</div>
                    <div>• Port: 587 (TLS enabled)</div>
                    <div>• Daily limit: 10,000 emails</div>
                    <div>• Templates: 12 active</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Security & Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security Settings
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Two-Factor Auth</span>
                      <Button size="sm" variant="outline" className="bg-green-600 text-white border-green-600 hover:bg-green-700">
                        Required
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Rate Limiting</span>
                      <Button size="sm" variant="outline" className="bg-green-600 text-white border-green-600 hover:bg-green-700">
                        Active
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Password Policy</span>
                      <Button size="sm" variant="outline" className="bg-green-600 text-white border-green-600 hover:bg-green-700">
                        Strong
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Performance
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>• Cache enabled (Redis)</div>
                    <div>• CDN active (Cloudflare)</div>
                    <div>• Compression: Gzip enabled</div>
                    <div>• Database optimization: Active</div>
                  </div>
                </div>

                <Button className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced System Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default IntegratedAdminPanel;
