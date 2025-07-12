'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { dashboardService } from './dashboard-service';
import { 
  DashboardOverview, 
  CollectionStats, 
  UserAnalytics, 
  SystemHealth,
  PerformanceMetrics,
  DashboardError,
} from './dashboard-types';

// Query keys for React Query
export const queryKeys = {
  dashboard: ['dashboard'] as const,
  overview: ['dashboard', 'overview'] as const,
  collectionStats: ['dashboard', 'collection-stats'] as const,
  userAnalytics: ['dashboard', 'user-analytics'] as const,
  systemHealth: ['dashboard', 'system-health'] as const,
  performanceMetrics: ['dashboard', 'performance-metrics'] as const,
  recentErrors: ['dashboard', 'recent-errors'] as const,
} as const;

// Hook for dashboard overview
export function useDashboardOverview(
  options?: UseQueryOptions<DashboardOverview, DashboardError>
) {
  return useQuery({
    queryKey: queryKeys.overview,
    queryFn: () => dashboardService.getDashboardData(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    refetchInterval: 60 * 1000, // 1 minute
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error?.code === 'AuthenticationError') {
        return false;
      }
      return failureCount < 3;
    },
    ...options,
  });
}

// Hook for collection statistics
export function useCollectionStats(
  options?: UseQueryOptions<CollectionStats[], DashboardError>
) {
  return useQuery({
    queryKey: queryKeys.collectionStats,
    queryFn: () => dashboardService.getCollectionStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    ...options,
  });
}

// Hook for user analytics
export function useUserAnalytics(
  options?: UseQueryOptions<UserAnalytics, DashboardError>
) {
  return useQuery({
    queryKey: queryKeys.userAnalytics,
    queryFn: () => dashboardService.getUserAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    ...options,
  });
}

// Hook for system health
export function useSystemHealth(
  options?: UseQueryOptions<SystemHealth, DashboardError>
) {
  return useQuery({
    queryKey: queryKeys.systemHealth,
    queryFn: () => dashboardService.getSystemHealth(),
    staleTime: 15 * 1000, // 15 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // 30 seconds
    retry: 3,
    ...options,
  });
}

// Hook for performance metrics
export function usePerformanceMetrics(
  options?: UseQueryOptions<Map<string, PerformanceMetrics>, DashboardError>
) {
  return useQuery({
    queryKey: queryKeys.performanceMetrics,
    queryFn: () => dashboardService.getPerformanceMetrics(),
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // 30 seconds
    retry: 1,
    ...options,
  });
}

// Hook for recent errors
export function useRecentErrors(
  limit = 10,
  options?: UseQueryOptions<DashboardError[], DashboardError>
) {
  return useQuery({
    queryKey: [...queryKeys.recentErrors, limit],
    queryFn: () => dashboardService.getRecentErrors(limit),
    staleTime: 5 * 1000, // 5 seconds
    gcTime: 30 * 1000, // 30 seconds
    refetchInterval: 15 * 1000, // 15 seconds
    retry: 1,
    ...options,
  });
}

// Mutation for clearing cache
export function useClearCache() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pattern?: string) => {
      dashboardService.clearCache(pattern);
      return true;
    },
    onSuccess: (_, pattern) => {
      if (pattern) {
        // Invalidate specific queries based on pattern
        queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey.some(key => 
              typeof key === 'string' && key.includes(pattern)
            );
          },
        });
      } else {
        // Clear all dashboard queries
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard,
        });
      }
    },
  });
}

// Mutation for refreshing all dashboard data
export function useRefreshDashboard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // Clear cache and refetch all queries
      dashboardService.clearCache();
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard,
      });
      return true;
    },
  });
}

// Hook for dashboard service initialization
export function useDashboardInitialization() {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['dashboard', 'initialization'],
    queryFn: async () => {
      await dashboardService.initialize();
      return true;
    },
    staleTime: Infinity, // Only initialize once
    gcTime: Infinity,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Combined hook for all dashboard data with optimized fetching
export function useDashboardData() {
  const overview = useDashboardOverview();
  const collectionStats = useCollectionStats();
  const userAnalytics = useUserAnalytics();
  const systemHealth = useSystemHealth();
  
  return {
    overview,
    collectionStats,
    userAnalytics,
    systemHealth,
    isLoading: overview.isLoading || collectionStats.isLoading || userAnalytics.isLoading || systemHealth.isLoading,
    isError: overview.isError || collectionStats.isError || userAnalytics.isError || systemHealth.isError,
    errors: [
      overview.error,
      collectionStats.error,
      userAnalytics.error,
      systemHealth.error,
    ].filter(Boolean),
  };
}

// Hook for cache statistics
export function useCacheStats() {
  return useQuery({
    queryKey: ['dashboard', 'cache-stats'],
    queryFn: () => dashboardService.getCacheStats(),
    staleTime: 5 * 1000, // 5 seconds
    gcTime: 30 * 1000, // 30 seconds
    refetchInterval: 10 * 1000, // 10 seconds
  });
}

// Utility hooks for performance optimization
export function usePrefetchDashboardData() {
  const queryClient = useQueryClient();
  
  return {
    prefetchOverview: () => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.overview,
        queryFn: () => dashboardService.getDashboardData(),
        staleTime: 30 * 1000,
      });
    },
    prefetchCollectionStats: () => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.collectionStats,
        queryFn: () => dashboardService.getCollectionStats(),
        staleTime: 2 * 60 * 1000,
      });
    },
    prefetchUserAnalytics: () => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.userAnalytics,
        queryFn: () => dashboardService.getUserAnalytics(),
        staleTime: 5 * 60 * 1000,
      });
    },
    prefetchSystemHealth: () => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.systemHealth,
        queryFn: () => dashboardService.getSystemHealth(),
        staleTime: 15 * 1000,
      });
    },
    prefetchAll: () => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.overview,
        queryFn: () => dashboardService.getDashboardData(),
      });
      queryClient.prefetchQuery({
        queryKey: queryKeys.collectionStats,
        queryFn: () => dashboardService.getCollectionStats(),
      });
      queryClient.prefetchQuery({
        queryKey: queryKeys.userAnalytics,
        queryFn: () => dashboardService.getUserAnalytics(),
      });
      queryClient.prefetchQuery({
        queryKey: queryKeys.systemHealth,
        queryFn: () => dashboardService.getSystemHealth(),
      });
    },
  };
}

// Hook for optimistic updates
export function useOptimisticDashboardUpdates() {
  const queryClient = useQueryClient();
  
  return {
    updateOverview: (updater: (old: DashboardOverview | undefined) => DashboardOverview) => {
      queryClient.setQueryData(queryKeys.overview, updater);
    },
    updateCollectionStats: (updater: (old: CollectionStats[] | undefined) => CollectionStats[]) => {
      queryClient.setQueryData(queryKeys.collectionStats, updater);
    },
    updateUserAnalytics: (updater: (old: UserAnalytics | undefined) => UserAnalytics) => {
      queryClient.setQueryData(queryKeys.userAnalytics, updater);
    },
    updateSystemHealth: (updater: (old: SystemHealth | undefined) => SystemHealth) => {
      queryClient.setQueryData(queryKeys.systemHealth, updater);
    },
  };
}

// Hook for background refresh
export function useBackgroundRefresh() {
  const queryClient = useQueryClient();
  
  return {
    enableBackgroundRefresh: () => {
      // Enable background refetching for all dashboard queries
      queryClient.setDefaultOptions({
        queries: {
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          refetchOnMount: true,
        },
      });
    },
    disableBackgroundRefresh: () => {
      // Disable background refetching
      queryClient.setDefaultOptions({
        queries: {
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          refetchOnMount: false,
        },
      });
    },
  };
}