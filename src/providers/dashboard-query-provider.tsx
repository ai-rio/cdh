'use client';

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client with optimized settings for dashboard
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: how long data stays fresh
        staleTime: 30 * 1000, // 30 seconds
        // Cache time: how long data stays in cache when not in use
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
        // Retry failed requests
        retry: (failureCount, error: any) => {
          // Don't retry on authentication errors
          if (error?.code === 'AuthenticationError' || error?.status === 401) {
            return false;
          }
          // Don't retry on client errors (4xx), but retry on server errors (5xx)
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return failureCount < 3;
        },
        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on window focus
        refetchOnWindowFocus: true,
        // Refetch on reconnect
        refetchOnReconnect: true,
        // Don't refetch on mount if data exists and is not stale
        refetchOnMount: 'stale',
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
        retryDelay: 1000,
      },
    },
  });
}

interface DashboardQueryProviderProps {
  children: React.ReactNode;
}

export function DashboardQueryProvider({ children }: DashboardQueryProviderProps) {
  // Create a stable query client instance
  const [queryClient] = useState(() => createQueryClient());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}

// Hook to access the query client
export function useDashboardQueryClient() {
  const client = queryClient;
  if (!client) {
    throw new Error('useDashboardQueryClient must be used within DashboardQueryProvider');
  }
  return client;
}

// Utility to invalidate all dashboard data
export function invalidateAllDashboardData(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: ['dashboard'],
  });
}

// Utility to clear all dashboard cache
export function clearAllDashboardCache(queryClient: QueryClient) {
  return queryClient.removeQueries({
    queryKey: ['dashboard'],
  });
}

// Performance monitoring for React Query
export function setupQueryClientPerformanceMonitoring(queryClient: QueryClient) {
  // Add global error handler
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'queryUpdated' && event.query.state.error) {
      console.error('Query error:', {
        queryKey: event.query.queryKey,
        error: event.query.state.error,
        failureCount: event.query.state.failureCount,
      });
    }
  });

  // Add global success handler for performance tracking
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'queryUpdated' && event.query.state.data && !event.query.state.error) {
      const queryKey = event.query.queryKey.join(':');
      const dataUpdatedAt = event.query.state.dataUpdatedAt;
      const fetchStartTime = event.query.state.fetchStartTime;
      
      if (fetchStartTime && dataUpdatedAt) {
        const duration = dataUpdatedAt - fetchStartTime;
        console.debug('Query performance:', {
          queryKey,
          duration: `${duration}ms`,
          cacheHit: !event.query.state.isFetching,
        });
      }
    }
  });

  // Monitor mutation performance
  queryClient.getMutationCache().subscribe((event) => {
    if (event.type === 'mutationUpdated') {
      const mutation = event.mutation;
      
      if (mutation.state.error) {
        console.error('Mutation error:', {
          mutationKey: mutation.options.mutationKey,
          error: mutation.state.error,
          failureCount: mutation.state.failureCount,
        });
      }
      
      if (mutation.state.data && !mutation.state.error) {
        console.debug('Mutation success:', {
          mutationKey: mutation.options.mutationKey,
          variables: mutation.state.variables,
        });
      }
    }
  });
}

// Create a singleton query client for the dashboard
let queryClient: QueryClient | null = null;

export function getGlobalQueryClient() {
  if (!queryClient) {
    queryClient = createQueryClient();
    
    // Set up performance monitoring in development
    if (process.env.NODE_ENV === 'development') {
      setupQueryClientPerformanceMonitoring(queryClient);
    }
  }
  
  return queryClient;
}