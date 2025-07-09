'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  userGrowth: {
    total: number;
    growth: number;
    data: { month: string; users: number }[];
  };
  revenue: {
    total: number;
    growth: number;
    data: { month: string; revenue: number }[];
  };
  engagement: {
    activeUsers: number;
    avgSessionTime: string;
    bounceRate: number;
  };
  deals: {
    total: number;
    completed: number;
    pending: number;
    value: number;
  };
}

export default function PlatformAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockData: AnalyticsData = {
          userGrowth: {
            total: 1234,
            growth: 12.5,
            data: [
              { month: 'Jan', users: 800 },
              { month: 'Feb', users: 950 },
              { month: 'Mar', users: 1100 },
              { month: 'Apr', users: 1234 }
            ]
          },
          revenue: {
            total: 45600,
            growth: 8.3,
            data: [
              { month: 'Jan', revenue: 32000 },
              { month: 'Feb', revenue: 38000 },
              { month: 'Mar', revenue: 42000 },
              { month: 'Apr', revenue: 45600 }
            ]
          },
          engagement: {
            activeUsers: 892,
            avgSessionTime: '12m 34s',
            bounceRate: 23.4
          },
          deals: {
            total: 156,
            completed: 89,
            pending: 67,
            value: 234500
          }
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAnalytics(mockData);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting analytics data...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8 text-gray-400">
        Failed to load analytics data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-white">Platform Analytics</CardTitle>
              <CardDescription className="text-gray-400">
                Monitor platform performance and user engagement
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={timeRange === range ? 'bg-blue-600' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
              >
                {range}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.userGrowth.total.toLocaleString()}</div>
            <div className="flex items-center text-xs">
              {analytics.userGrowth.growth > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
              )}
              <span className={analytics.userGrowth.growth > 0 ? 'text-green-400' : 'text-red-400'}>
                {Math.abs(analytics.userGrowth.growth)}%
              </span>
              <span className="text-gray-400 ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${analytics.revenue.total.toLocaleString()}</div>
            <div className="flex items-center text-xs">
              {analytics.revenue.growth > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
              )}
              <span className={analytics.revenue.growth > 0 ? 'text-green-400' : 'text-red-400'}>
                {Math.abs(analytics.revenue.growth)}%
              </span>
              <span className="text-gray-400 ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.engagement.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-gray-400">Currently online</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Deal Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${analytics.deals.value.toLocaleString()}</div>
            <p className="text-xs text-gray-400">{analytics.deals.total} total deals</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
            User Analytics
          </TabsTrigger>
          <TabsTrigger value="revenue" className="data-[state=active]:bg-blue-600">
            Revenue
          </TabsTrigger>
          <TabsTrigger value="engagement" className="data-[state=active]:bg-blue-600">
            Engagement
          </TabsTrigger>
          <TabsTrigger value="deals" className="data-[state=active]:bg-blue-600">
            Deals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">User Growth</CardTitle>
              <CardDescription className="text-gray-400">
                Track user registration and growth trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border border-gray-700 rounded-lg">
                <div className="text-center text-gray-400">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                  <p>User Growth Chart</p>
                  <p className="text-sm">(Chart component would be implemented here)</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {analytics.userGrowth.data.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-lg font-semibold text-white">{item.users}</div>
                    <div className="text-sm text-gray-400">{item.month}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Revenue Analytics</CardTitle>
              <CardDescription className="text-gray-400">
                Monitor platform revenue and financial performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border border-gray-700 rounded-lg">
                <div className="text-center text-gray-400">
                  <DollarSign className="h-12 w-12 mx-auto mb-2" />
                  <p>Revenue Chart</p>
                  <p className="text-sm">(Chart component would be implemented here)</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {analytics.revenue.data.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-lg font-semibold text-white">${item.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">{item.month}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">User Engagement</CardTitle>
              <CardDescription className="text-gray-400">
                Analyze user behavior and platform engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border border-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-white mb-2">{analytics.engagement.activeUsers}</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                  <Badge className="mt-2 bg-green-600">Online Now</Badge>
                </div>
                <div className="text-center p-4 border border-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-white mb-2">{analytics.engagement.avgSessionTime}</div>
                  <div className="text-sm text-gray-400">Avg Session Time</div>
                  <Badge className="mt-2 bg-blue-600">Good</Badge>
                </div>
                <div className="text-center p-4 border border-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-white mb-2">{analytics.engagement.bounceRate}%</div>
                  <div className="text-sm text-gray-400">Bounce Rate</div>
                  <Badge className="mt-2 bg-yellow-600">Acceptable</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Deal Analytics</CardTitle>
              <CardDescription className="text-gray-400">
                Track deal performance and completion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 border border-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-white mb-2">{analytics.deals.total}</div>
                  <div className="text-sm text-gray-400">Total Deals</div>
                </div>
                <div className="text-center p-4 border border-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-2">{analytics.deals.completed}</div>
                  <div className="text-sm text-gray-400">Completed</div>
                </div>
                <div className="text-center p-4 border border-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400 mb-2">{analytics.deals.pending}</div>
                  <div className="text-sm text-gray-400">Pending</div>
                </div>
                <div className="text-center p-4 border border-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-2">${analytics.deals.value.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Total Value</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-4">Deal Completion Rate</h4>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(analytics.deals.completed / analytics.deals.total) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>0%</span>
                  <span>{Math.round((analytics.deals.completed / analytics.deals.total) * 100)}% Complete</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}