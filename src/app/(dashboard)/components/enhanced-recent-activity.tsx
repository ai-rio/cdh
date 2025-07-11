'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityTimeline } from "@/components/ui/timeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Clock, 
  Filter, 
  RefreshCw, 
  User, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Settings,
  Mail,
  Database,
  Eye,
  EyeOff
} from "lucide-react";

// Mock activity data - in real app this would come from API
const generateMockActivities = (userRole: string) => {
  const baseActivities = [
    {
      id: '1',
      title: 'Profile Updated',
      description: 'Updated profile information and preferences',
      timestamp: '2 minutes ago',
      type: 'user' as const,
      user: {
        name: 'John Doe',
        avatar: undefined,
        initials: 'JD'
      },
      metadata: {
        fields: 'name, email, bio',
        ip: '192.168.1.1'
      }
    },
    {
      id: '2',
      title: 'Login Successful',
      description: 'Successful authentication from new device',
      timestamp: '15 minutes ago',
      type: 'success' as const,
      user: {
        name: 'John Doe',
        avatar: undefined,
        initials: 'JD'
      },
      metadata: {
        device: 'Chrome on macOS',
        location: 'San Francisco, CA'
      }
    },
    {
      id: '3',
      title: 'Email Sent',
      description: 'Welcome email sent to new user',
      timestamp: '1 hour ago',
      type: 'system' as const,
      metadata: {
        recipient: 'user@example.com',
        template: 'welcome-email'
      }
    },
    {
      id: '4',
      title: 'Database Backup',
      description: 'Automated database backup completed successfully',
      timestamp: '2 hours ago',
      type: 'system' as const,
      metadata: {
        size: '2.4 GB',
        duration: '45 seconds'
      }
    }
  ];

  // Add admin-specific activities
  if (userRole === 'admin') {
    return [
      {
        id: 'admin-1',
        title: 'User Created',
        description: 'New user account created via admin panel',
        timestamp: '5 minutes ago',
        type: 'admin' as const,
        user: {
          name: 'Admin User',
          avatar: undefined,
          initials: 'AU'
        },
        metadata: {
          newUser: 'jane.smith@example.com',
          role: 'creator'
        }
      },
      {
        id: 'admin-2',
        title: 'System Settings Updated',
        description: 'Modified email configuration settings',
        timestamp: '30 minutes ago',
        type: 'admin' as const,
        user: {
          name: 'Admin User',
          avatar: undefined,
          initials: 'AU'
        },
        metadata: {
          setting: 'SMTP Configuration',
          previous: 'smtp.old.com',
          current: 'smtp.new.com'
        }
      },
      {
        id: 'error-1',
        title: 'API Rate Limit Exceeded',
        description: 'Rate limit exceeded for external API calls',
        timestamp: '45 minutes ago',
        type: 'error' as const,
        metadata: {
          endpoint: '/api/external/data',
          limit: '1000/hour',
          current: '1001'
        }
      },
      ...baseActivities
    ];
  }

  // Add creator-specific activities
  if (userRole === 'creator') {
    return [
      {
        id: 'creator-1',
        title: 'Portfolio Updated',
        description: 'Added new project to portfolio showcase',
        timestamp: '10 minutes ago',
        type: 'user' as const,
        user: {
          name: 'Creator User',
          avatar: undefined,
          initials: 'CU'
        },
        metadata: {
          project: 'E-commerce Website',
          category: 'Web Development'
        }
      },
      {
        id: 'creator-2',
        title: 'Opportunity Applied',
        description: 'Applied for new brand collaboration opportunity',
        timestamp: '1 hour ago',
        type: 'success' as const,
        user: {
          name: 'Creator User',
          avatar: undefined,
          initials: 'CU'
        },
        metadata: {
          brand: 'TechCorp Inc.',
          campaign: 'Product Launch 2024'
        }
      },
      ...baseActivities
    ];
  }

  return baseActivities;
};

interface EnhancedRecentActivityProps {
  maxItems?: number;
  showFilters?: boolean;
  showRefresh?: boolean;
  className?: string;
}

export function EnhancedRecentActivity({ 
  maxItems = 10, 
  showFilters = true, 
  showRefresh = true,
  className 
}: EnhancedRecentActivityProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'user' | 'system' | 'admin' | 'error' | 'success'>('all');
  const [showAvatars, setShowAvatars] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Generate activities based on user role
  const allActivities = useMemo(() => {
    if (!user?.role) return [];
    return generateMockActivities(user.role);
  }, [user?.role]);

  // Filter activities based on selected filter
  const filteredActivities = useMemo(() => {
    if (filter === 'all') return allActivities;
    return allActivities.filter(activity => activity.type === filter);
  }, [allActivities, filter]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Get filter counts
  const filterCounts = useMemo(() => {
    const counts = {
      all: allActivities.length,
      user: 0,
      system: 0,
      admin: 0,
      error: 0,
      success: 0
    };

    allActivities.forEach(activity => {
      counts[activity.type]++;
    });

    return counts;
  }, [allActivities]);

  // Get filter icon
  const getFilterIcon = (filterType: string) => {
    switch (filterType) {
      case 'user': return <User className="h-3 w-3" />;
      case 'system': return <Settings className="h-3 w-3" />;
      case 'admin': return <Shield className="h-3 w-3" />;
      case 'error': return <AlertTriangle className="h-3 w-3" />;
      case 'success': return <CheckCircle className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activity
            <Badge variant="secondary" className="ml-2">
              {filteredActivities.length}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAvatars(!showAvatars)}
              className="h-8 w-8 p-0"
            >
              {showAvatars ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            {showRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="mb-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all" className="flex items-center gap-1 text-xs">
                <Activity className="h-3 w-3" />
                All ({filterCounts.all})
              </TabsTrigger>
              <TabsTrigger value="user" className="flex items-center gap-1 text-xs">
                <User className="h-3 w-3" />
                User ({filterCounts.user})
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-1 text-xs">
                <Settings className="h-3 w-3" />
                System ({filterCounts.system})
              </TabsTrigger>
              {user?.role === 'admin' && (
                <TabsTrigger value="admin" className="flex items-center gap-1 text-xs">
                  <Shield className="h-3 w-3" />
                  Admin ({filterCounts.admin})
                </TabsTrigger>
              )}
              <TabsTrigger value="success" className="flex items-center gap-1 text-xs">
                <CheckCircle className="h-3 w-3" />
                Success ({filterCounts.success})
              </TabsTrigger>
              <TabsTrigger value="error" className="flex items-center gap-1 text-xs">
                <AlertTriangle className="h-3 w-3" />
                Errors ({filterCounts.error})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {filteredActivities.length > 0 ? (
          <ActivityTimeline 
            activities={filteredActivities.slice(0, maxItems)}
            showAvatars={showAvatars}
            className="max-h-96 overflow-y-auto"
          />
        ) : (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Activity Found</h3>
            <p className="text-muted-foreground mb-4">
              No activities match the selected filter.
            </p>
            <Button variant="outline" onClick={() => setFilter('all')}>
              Show All Activities
            </Button>
          </div>
        )}

        {filteredActivities.length > maxItems && (
          <div className="mt-4 pt-4 border-t text-center">
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              View All {filteredActivities.length} Activities
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default EnhancedRecentActivity;
