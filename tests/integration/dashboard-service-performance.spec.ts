import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DashboardService } from '@/lib/dashboard-service';
import { PayloadClient } from '@/lib/payload-client';

// Mock PayloadClient
vi.mock('@/lib/payload-client');

const MockedPayloadClient = vi.mocked(PayloadClient);

describe('Dashboard Service Performance Integration Tests', () => {
  let dashboardService: DashboardService;
  let mockPayloadClient: vi.Mocked<PayloadClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockPayloadClient = {
      getCollections: vi.fn(),
      getUsers: vi.fn(),
      getMedia: vi.fn(),
      getCollection: vi.fn(),
      getDashboardStats: vi.fn(),
      getCollectionCounts: vi.fn(),
      getRecentDocuments: vi.fn(),
    } as any;

    dashboardService = new DashboardService(mockPayloadClient);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Caching Performance', () => {
    beforeEach(async () => {
      // Initialize service
      mockPayloadClient.getCollections.mockResolvedValue(['users', 'media']);
      mockPayloadClient.getUsers.mockResolvedValue({ 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      });
      mockPayloadClient.getMedia.mockResolvedValue({ 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      });
      mockPayloadClient.getCollection.mockResolvedValue({ 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      });
      
      await dashboardService.initialize();
    });

    it('should achieve >50% cache hit ratio after multiple requests', async () => {
      // Setup mock data
      const mockUsers = { 
        docs: [{ id: '1', email: 'test@example.com' }], 
        totalDocs: 10, 
        totalPages: 1, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      };
      const mockMedia = { 
        docs: [{ id: '1', filename: 'test.jpg' }], 
        totalDocs: 5, 
        totalPages: 1, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      };

      mockPayloadClient.getUsers.mockResolvedValue(mockUsers);
      mockPayloadClient.getMedia.mockResolvedValue(mockMedia);

      // First request - should hit API
      await dashboardService.getDashboardData();
      expect(mockPayloadClient.getUsers).toHaveBeenCalledTimes(1);
      expect(mockPayloadClient.getMedia).toHaveBeenCalledTimes(1);

      // Reset call counts
      vi.clearAllMocks();

      // Multiple subsequent requests - should use cache
      const requests = [];
      for (let i = 0; i < 10; i++) {
        requests.push(dashboardService.getDashboardData());
      }
      
      await Promise.all(requests);

      // Should not have called API again due to caching
      expect(mockPayloadClient.getUsers).not.toHaveBeenCalled();
      expect(mockPayloadClient.getMedia).not.toHaveBeenCalled();

      // Check cache stats
      const cacheStats = dashboardService.getCacheStats();
      expect(cacheStats.size).toBeGreaterThan(0);
    });

    it('should respect cache TTL and refresh data when expired', async () => {
      // Use short TTL for testing
      const shortTTLService = new DashboardService(mockPayloadClient, {
        cache: {
          defaultTTL: 50, // 50ms
          maxSize: 100,
          strategy: 'TTL',
        },
      });

      // Initialize service
      mockPayloadClient.getCollections.mockResolvedValue(['users', 'media']);
      mockPayloadClient.getUsers.mockResolvedValue({ 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      });
      mockPayloadClient.getMedia.mockResolvedValue({ 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      });
      mockPayloadClient.getCollection.mockResolvedValue({ 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      });

      await shortTTLService.initialize();

      // First request
      await shortTTLService.getDashboardData();
      expect(mockPayloadClient.getUsers).toHaveBeenCalledTimes(1);

      // Wait for cache to expire
      await new Promise(resolve => setTimeout(resolve, 100));

      // Reset mocks
      vi.clearAllMocks();

      // Second request after expiration - should hit API again
      await shortTTLService.getDashboardData();
      expect(mockPayloadClient.getUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe('Response Time Performance', () => {
    beforeEach(async () => {
      // Initialize service
      mockPayloadClient.getCollections.mockResolvedValue(['users', 'media']);
      mockPayloadClient.getUsers.mockResolvedValue({ 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      });
      mockPayloadClient.getMedia.mockResolvedValue({ 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      });
      mockPayloadClient.getCollection.mockResolvedValue({ 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      });
      
      await dashboardService.initialize();
    });

    it('should complete cached requests in <200ms', async () => {
      // Prime the cache
      await dashboardService.getDashboardData();

      // Measure cached request performance
      const start = Date.now();
      await dashboardService.getDashboardData();
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(200);
    });

    it('should handle concurrent requests efficiently', async () => {
      const concurrentRequests = 10;
      const start = Date.now();
      
      const requests = Array(concurrentRequests).fill(null).map(() => 
        dashboardService.getDashboardData()
      );
      
      await Promise.all(requests);
      const duration = Date.now() - start;

      // All concurrent requests should complete reasonably quickly
      expect(duration).toBeLessThan(5000); // 5 seconds for 10 concurrent requests
      
      // Should have only made one set of API calls due to request deduplication
      expect(mockPayloadClient.getUsers).toHaveBeenCalledTimes(1);
      expect(mockPayloadClient.getMedia).toHaveBeenCalledTimes(1);
    });

    it('should track performance metrics accurately', async () => {
      // Make several requests to generate metrics
      await dashboardService.getDashboardData();
      await dashboardService.getCollectionStats();
      await dashboardService.getUserAnalytics();
      await dashboardService.getSystemHealth();

      const metrics = dashboardService.getPerformanceMetrics();
      expect(metrics.size).toBeGreaterThan(0);

      // Check that metrics contain expected data
      for (const [endpoint, metric] of metrics) {
        expect(metric.requestCount).toBeGreaterThan(0);
        expect(metric.averageResponseTime).toBeGreaterThanOrEqual(0);
        expect(metric.errorRate).toBeGreaterThanOrEqual(0);
        expect(metric.lastUpdated).toBeDefined();
      }
    });
  });

  describe('Request Batching Performance', () => {
    beforeEach(async () => {
      // Initialize service
      mockPayloadClient.getCollections.mockResolvedValue(['users', 'media']);
      mockPayloadClient.getUsers.mockResolvedValue({ 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      });
      mockPayloadClient.getMedia.mockResolvedValue({ 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      });
      mockPayloadClient.getCollection.mockResolvedValue({ 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      });
      
      await dashboardService.initialize();
    });

    it('should execute batch requests more efficiently than individual requests', async () => {
      const batchRequest = {
        id: 'performance-test',
        requests: [
          {
            key: 'overview',
            fn: () => dashboardService.getDashboardData(),
            priority: 'high' as const,
          },
          {
            key: 'stats',
            fn: () => dashboardService.getCollectionStats(),
            priority: 'medium' as const,
          },
          {
            key: 'analytics',
            fn: () => dashboardService.getUserAnalytics(),
            priority: 'medium' as const,
          },
          {
            key: 'health',
            fn: () => dashboardService.getSystemHealth(),
            priority: 'low' as const,
          },
        ],
      };

      const start = Date.now();
      const result = await dashboardService.batchRequests(batchRequest);
      const batchDuration = Date.now() - start;

      expect(result.executionTime).toBeGreaterThan(0);
      expect(batchDuration).toBeLessThan(10000); // Should complete within 10 seconds
      expect(Object.keys(result.results)).toHaveLength(4);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should respect concurrency limits', async () => {
      const maxConcurrent = 3;
      const serviceWithLimits = new DashboardService(mockPayloadClient, {
        performance: {
          maxConcurrentRequests: maxConcurrent,
          requestTimeout: 30000,
          retryAttempts: 3,
        },
      });

      // Initialize service
      mockPayloadClient.getCollections.mockResolvedValue(['users', 'media']);
      await serviceWithLimits.initialize();

      // Create more requests than the concurrency limit
      const requests = [];
      for (let i = 0; i < 10; i++) {
        requests.push({
          key: `request-${i}`,
          fn: async () => {
            await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
            return `result-${i}`;
          },
          priority: 'medium' as const,
        });
      }

      const batchRequest = {
        id: 'concurrency-test',
        requests,
      };

      const start = Date.now();
      const result = await serviceWithLimits.batchRequests(batchRequest);
      const duration = Date.now() - start;

      // With concurrency limits, this should take longer than if all executed at once
      expect(duration).toBeGreaterThan(200); // At least 2 chunks of 100ms each
      expect(Object.keys(result.results)).toHaveLength(10);
    });
  });

  describe('Memory Usage Performance', () => {
    beforeEach(async () => {
      // Initialize service
      mockPayloadClient.getCollections.mockResolvedValue(['users', 'media']);
      mockPayloadClient.getUsers.mockResolvedValue({ 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      });
      mockPayloadClient.getMedia.mockResolvedValue({ 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      });
      mockPayloadClient.getCollection.mockResolvedValue({ 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      });
      
      await dashboardService.initialize();
    });

    it('should maintain stable cache size under load', async () => {
      const maxCacheSize = 10;
      const serviceWithLimits = new DashboardService(mockPayloadClient, {
        cache: {
          defaultTTL: 5000,
          maxSize: maxCacheSize,
          strategy: 'LRU',
        },
      });

      // Initialize service
      mockPayloadClient.getCollections.mockResolvedValue(['users', 'media']);
      await serviceWithLimits.initialize();

      // Generate many different cache keys
      for (let i = 0; i < 50; i++) {
        mockPayloadClient.getUsers.mockResolvedValueOnce({ 
          docs: [{ id: `user-${i}` }], 
          totalDocs: i, 
          totalPages: 1, 
          page: 1, 
          limit: 1, 
          hasPrevPage: false, 
          hasNextPage: false, 
          prevPage: null, 
          nextPage: null, 
          pagingCounter: 1 
        });
        
        try {
          await serviceWithLimits.getDashboardData();
        } catch {
          // Ignore errors for this test
        }
      }

      const cacheStats = serviceWithLimits.getCacheStats();
      expect(cacheStats.size).toBeLessThanOrEqual(maxCacheSize);
    });

    it('should limit error storage to prevent memory leaks', async () => {
      // Generate many errors
      for (let i = 0; i < 100; i++) {
        mockPayloadClient.getUsers.mockRejectedValueOnce(new Error(`Error ${i}`));
        
        try {
          await dashboardService.getDashboardData();
        } catch {
          // Expected to fail
        }
      }

      const recentErrors = dashboardService.getRecentErrors(100);
      expect(recentErrors.length).toBeLessThanOrEqual(50); // Should be limited
    });

    it('should cleanup performance metrics to prevent unbounded growth', async () => {
      // Generate many different metric keys
      const performanceMonitor = (dashboardService as any).performanceMonitor;
      
      for (let i = 0; i < 200; i++) {
        performanceMonitor.recordRequest(`/api/test-${i}`, 100, true);
      }

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.size).toBeLessThanOrEqual(100); // Should be limited
    });
  });

  describe('Error Recovery Performance', () => {
    beforeEach(async () => {
      // Initialize service
      mockPayloadClient.getCollections.mockResolvedValue(['users', 'media']);
      mockPayloadClient.getUsers.mockResolvedValue({ 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      });
      mockPayloadClient.getMedia.mockResolvedValue({ 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      });
      mockPayloadClient.getCollection.mockResolvedValue({ 
        docs: [], 
        totalDocs: 0, 
        totalPages: 0, 
        page: 1, 
        limit: 1, 
        hasPrevPage: false, 
        hasNextPage: false, 
        prevPage: null, 
        nextPage: null, 
        pagingCounter: 1 
      });
      
      await dashboardService.initialize();
    });

    it('should gracefully handle partial failures in batch requests', async () => {
      const batchRequest = {
        id: 'error-recovery-test',
        requests: [
          {
            key: 'success1',
            fn: async () => 'success',
            priority: 'high' as const,
          },
          {
            key: 'failure',
            fn: async () => { throw new Error('Simulated failure'); },
            priority: 'medium' as const,
          },
          {
            key: 'success2',
            fn: async () => 'success',
            priority: 'low' as const,
          },
        ],
      };

      const result = await dashboardService.batchRequests(batchRequest);

      expect(result.results.success1).toBe('success');
      expect(result.results.success2).toBe('success');
      expect(result.errors.failure).toBeDefined();
      expect(result.errors.failure.message).toBe('Simulated failure');
    });

    it('should maintain performance even with frequent errors', async () => {
      // Simulate alternating success and failure
      let callCount = 0;
      mockPayloadClient.getUsers.mockImplementation(() => {
        callCount++;
        if (callCount % 2 === 0) {
          throw new Error('Intermittent failure');
        }
        return Promise.resolve({ 
          docs: [], 
          totalDocs: 0, 
          totalPages: 0, 
          page: 1, 
          limit: 1, 
          hasPrevPage: false, 
          hasNextPage: false, 
          prevPage: null, 
          nextPage: null, 
          pagingCounter: 1 
        });
      });

      const requests = [];
      const start = Date.now();

      // Make multiple requests, some will fail
      for (let i = 0; i < 10; i++) {
        requests.push(
          dashboardService.getDashboardData().catch(() => null)
        );
      }

      await Promise.all(requests);
      const duration = Date.now() - start;

      // Should complete within reasonable time despite errors
      expect(duration).toBeLessThan(5000);

      // Should have recorded both successes and failures
      const metrics = dashboardService.getPerformanceMetrics();
      const dashboardMetrics = metrics.get('getDashboardData');
      if (dashboardMetrics) {
        expect(dashboardMetrics.requestCount).toBeGreaterThan(0);
        expect(dashboardMetrics.errorRate).toBeGreaterThan(0);
        expect(dashboardMetrics.errorRate).toBeLessThan(1);
      }
    });
  });
});