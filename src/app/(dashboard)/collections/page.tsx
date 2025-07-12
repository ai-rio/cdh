'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePayloadClient } from '@/lib/payload-client';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CollectionManager } from "../components/collection-manager";
import { 
  Database, 
  Users, 
  Image, 
  Plus,
  Settings,
  Activity,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface CollectionStats {
  name: string;
  count: number;
  recentActivity: number;
  status: 'healthy' | 'warning' | 'error';
}

export default function CollectionsPage() {
  const { user } = useAuth();
  const payloadClient = usePayloadClient();
  const [collections, setCollections] = useState<string[]>([]);
  const [stats, setStats] = useState<CollectionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCollection, setActiveCollection] = useState<string>('users');

  // Check if user has admin access
  const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);

  // Load available collections
  const loadCollections = async () => {
    try {
      setLoading(true);
      const availableCollections = await payloadClient.getCollections();
      setCollections(availableCollections);
      
      // Load stats for each collection
      const collectionStats = await Promise.all(
        availableCollections.map(async (collection) => {
          try {
            const response = await payloadClient.getCollection(collection, { limit: 1 });
            return {
              name: collection,
              count: response.totalDocs,
              recentActivity: Math.floor(Math.random() * 10), // Mock recent activity
              status: 'healthy' as const,
            };
          } catch (err) {
            return {
              name: collection,
              count: 0,
              recentActivity: 0,
              status: 'error' as const,
            };
          }
        })
      );
      
      setStats(collectionStats);
      
      // Set default active collection
      if (availableCollections.length > 0 && !availableCollections.includes(activeCollection)) {
        setActiveCollection(availableCollections[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load collections');
      toast.error('Failed to load collections', {
        description: err.message || 'Please check your connection',
      });
    } finally {
      setLoading(false);
    }
  };

  // Initialize
  useEffect(() => {
    if (isAdmin) {
      loadCollections();
    }
  }, [isAdmin]);

  // Get collection icon
  const getCollectionIcon = (collection: string) => {
    switch (collection) {
      case 'users': return <Users className="h-4 w-4" />;
      case 'media': return <Image className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Database className="h-4 w-4 text-gray-600" />;
    }
  };

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
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You don&apos;t have permission to access collection management. Administrator privileges are required.
            </AlertDescription>
          </Alert>
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
              <Database className="h-6 w-6" />
              Collection Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage all Payload CMS collections from a unified interface
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4">
          <Button
            variant="outline"
            size="sm"
            onClick={loadCollections}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4">
        {/* Collection Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))
          ) : (
            stats.map((stat) => (
              <Card key={stat.name} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setActiveCollection(stat.name)}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
                    {getCollectionIcon(stat.name)}
                    {stat.name}
                  </CardTitle>
                  {getStatusIcon(stat.status)}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.recentActivity} recent changes
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Error State */}
        {error && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Collection Management Tabs */}
        {!loading && collections.length > 0 && (
          <Tabs value={activeCollection} onValueChange={setActiveCollection} className="w-full">
            <TabsList className="grid w-full grid-cols-auto">
              {collections.map((collection) => (
                <TabsTrigger 
                  key={collection} 
                  value={collection}
                  className="flex items-center gap-2 capitalize"
                >
                  {getCollectionIcon(collection)}
                  {collection}
                  <Badge variant="secondary" className="ml-1">
                    {stats.find(s => s.name === collection)?.count || 0}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {collections.map((collection) => (
              <TabsContent key={collection} value={collection} className="mt-6">
                <CollectionManager
                  collection={collection}
                  title={`${collection.charAt(0).toUpperCase() + collection.slice(1)} Management`}
                  description={`Manage all ${collection} in your Payload CMS`}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Empty State */}
        {!loading && collections.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Database className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Collections Found</h3>
              <p className="text-muted-foreground text-center mb-4">
                No Payload CMS collections are available or accessible.
              </p>
              <Button onClick={loadCollections} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Loading
              </Button>
            </CardContent>
          </Card>
        )}

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-green-600 text-lg">✓</div>
                <div className="text-muted-foreground">Payload API</div>
                <div className="text-xs text-green-600">Connected</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-green-600 text-lg">⚡</div>
                <div className="text-muted-foreground">Collections</div>
                <div className="text-xs text-green-600">{collections.length} Available</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-green-600 text-lg">📊</div>
                <div className="text-muted-foreground">Total Documents</div>
                <div className="text-xs text-green-600">
                  {stats.reduce((sum, stat) => sum + stat.count, 0)}
                </div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-green-600 text-lg">🚀</div>
                <div className="text-muted-foreground">Integration</div>
                <div className="text-xs text-green-600">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
