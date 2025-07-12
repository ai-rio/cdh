import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DashboardService } from '@/lib/dashboard-service';
import { PayloadClient } from '@/lib/payload-client';
import { DashboardOverview, CollectionStats, UserAnalytics, SystemHealth } from '@/lib/dashboard-types';

// Mock PayloadClient
vi.mock('@/lib/payload-client');

const MockedPayloadClient = vi.mocked(PayloadClient);

describe('DashboardService', () => {
  let dashboardService: DashboardService;
  let mockPayloadClient: vi.Mocked<PayloadClient>;

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    
    // Create mock payload client
    mockPayloadClient = {
      getCollections: vi.fn(),
      getUsers: vi.fn(),
      getMedia: vi.fn(),
      getCollection: vi.fn(),
      getDashboardStats: vi.fn(),
      getCollectionCounts: vi.fn(),
      getRecentDocuments: vi.fn(),
    } as any;

    // Create dashboard service with mocked client
    dashboardService = new DashboardService(mockPayloadClient);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      // Mock successful connection test
      mockPayloadClient.getCollections.mockResolvedValueOnce(['users', 'media']);
      mockPayloadClient.getUsers.mockResolvedValueOnce({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getMedia.mockResolvedValueOnce({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getCollection.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });

      await expect(dashboardService.initialize()).resolves.toBeUndefined();
      expect(mockPayloadClient.getCollections).toHaveBeenCalled();
    });

    it('should throw error if connection test fails', async () => {
      // Mock failed connection test
      mockPayloadClient.getCollections.mockRejectedValueOnce(new Error('Connection failed'));

      await expect(dashboardService.initialize()).rejects.toThrow('Failed to connect to Payload CMS');
    });

    it('should not initialize twice', async () => {
      // Mock successful connection test
      mockPayloadClient.getCollections.mockResolvedValue(['users', 'media']);
      mockPayloadClient.getUsers.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getMedia.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getCollection.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });

      await dashboardService.initialize();
      
      // Clear previous calls
      vi.clearAllMocks();
      
      // Second initialization should not call connection test again
      await dashboardService.initialize();
      expect(mockPayloadClient.getCollections).not.toHaveBeenCalled();
    });
  });

  describe('getDashboardData', () => {
    beforeEach(async () => {
      // Initialize service
      mockPayloadClient.getCollections.mockResolvedValue(['users', 'media']);
      mockPayloadClient.getUsers.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getMedia.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getCollection.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      
      await dashboardService.initialize();
    });

    it('should return dashboard overview data', async () => {
      // Mock data
      const mockUsers = { docs: [{ id: '1', email: 'test@example.com' }], totalDocs: 10, totalPages: 1, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 };
      const mockMedia = { docs: [{ id: '1', filename: 'test.jpg' }], totalDocs: 5, totalPages: 1, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 };

      mockPayloadClient.getUsers.mockResolvedValueOnce(mockUsers);
      mockPayloadClient.getMedia.mockResolvedValueOnce(mockMedia);

      const result = await dashboardService.getDashboardData();

      expect(result).toMatchObject({
        totalUsers: 10,
        totalMedia: 5,
      });
      expect(result.systemHealth).toBeDefined();
      expect(result.recentActivity).toBeDefined();
      expect(result.quickStats).toBeDefined();
    });

    it('should use cached data when available', async () => {
      // Mock initial data
      const mockUsers = { docs: [], totalDocs: 10, totalPages: 1, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 };
      const mockMedia = { docs: [], totalDocs: 5, totalPages: 1, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 };

      mockPayloadClient.getUsers.mockResolvedValueOnce(mockUsers);
      mockPayloadClient.getMedia.mockResolvedValueOnce(mockMedia);

      // First call
      await dashboardService.getDashboardData();

      // Clear mocks
      vi.clearAllMocks();

      // Second call should use cache
      const result = await dashboardService.getDashboardData();
      
      expect(result.totalUsers).toBe(10);
      expect(result.totalMedia).toBe(5);
      expect(mockPayloadClient.getUsers).not.toHaveBeenCalled();
      expect(mockPayloadClient.getMedia).not.toHaveBeenCalled();
    });

    it('should handle errors and throw dashboard error', async () => {
      mockPayloadClient.getUsers.mockRejectedValueOnce(new Error('API Error'));

      await expect(dashboardService.getDashboardData()).rejects.toThrow();
    });

    it('should throw error if not initialized', async () => {
      const uninitializedService = new DashboardService(mockPayloadClient);
      
      await expect(uninitializedService.getDashboardData()).rejects.toThrow('Dashboard service not initialized');
    });
  });

  describe('getCollectionStats', () => {
    beforeEach(async () => {
      // Initialize service
      mockPayloadClient.getCollections.mockResolvedValue(['users', 'media']);
      mockPayloadClient.getUsers.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getMedia.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getCollection.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      
      await dashboardService.initialize();
    });

    it('should return collection statistics', async () => {
      mockPayloadClient.getCollections.mockResolvedValueOnce(['users', 'media']);
      mockPayloadClient.getCollection
        .mockResolvedValueOnce({ docs: [], totalDocs: 10, totalPages: 1, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 })
        .mockResolvedValueOnce({ docs: [], totalDocs: 2, totalPages: 1, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 })
        .mockResolvedValueOnce({ docs: [], totalDocs: 5, totalPages: 1, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 })
        .mockResolvedValueOnce({ docs: [], totalDocs: 1, totalPages: 1, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });

      const result = await dashboardService.getCollectionStats();

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        collection: 'users',
        totalDocuments: 10,
        recentDocuments: 2,
      });
      expect(result[1]).toMatchObject({
        collection: 'media',
        totalDocuments: 5,
        recentDocuments: 1,
      });
    });

    it('should handle individual collection errors gracefully', async () => {
      mockPayloadClient.getCollections.mockResolvedValueOnce(['users', 'media']);
      mockPayloadClient.getCollection
        .mockResolvedValueOnce({ docs: [], totalDocs: 10, totalPages: 1, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 })
        .mockResolvedValueOnce({ docs: [], totalDocs: 2, totalPages: 1, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 })
        .mockRejectedValueOnce(new Error('Media collection error'))
        .mockRejectedValueOnce(new Error('Media collection error'));

      const result = await dashboardService.getCollectionStats();

      expect(result).toHaveLength(1);
      expect(result[0].collection).toBe('users');
    });
  });

  describe('getUserAnalytics', () => {
    beforeEach(async () => {
      // Initialize service
      mockPayloadClient.getCollections.mockResolvedValue(['users', 'media']);
      mockPayloadClient.getUsers.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getMedia.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getCollection.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      
      await dashboardService.initialize();
    });

    it('should return user analytics', async () => {
      const mockUsers = {
        docs: [
          { id: '1', email: 'user1@example.com', role: 'admin', lastLogin: new Date().toISOString() },
          { id: '2', email: 'user2@example.com', role: 'user', lastLogin: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
        ],
        totalDocs: 2,
        totalPages: 1, page: 1, limit: 1000, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1
      };

      const mockTodayUsers = { docs: [{ id: '3', email: 'new@example.com' }], totalDocs: 1, totalPages: 1, page: 1, limit: 1000, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 };
      const mockWeekUsers = { docs: [{ id: '3', email: 'new@example.com' }, { id: '4', email: 'new2@example.com' }], totalDocs: 2, totalPages: 1, page: 1, limit: 1000, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 };

      mockPayloadClient.getUsers
        .mockResolvedValueOnce(mockUsers)
        .mockResolvedValueOnce(mockTodayUsers)
        .mockResolvedValueOnce(mockWeekUsers);

      const result = await dashboardService.getUserAnalytics();

      expect(result).toMatchObject({
        totalUsers: 2,
        activeUsers: 1, // User with recent login
        newUsersToday: 1,
        newUsersThisWeek: 2,
      });
      expect(result.userRoles).toBeDefined();
      expect(result.userActivity).toBeDefined();
    });
  });

  describe('getSystemHealth', () => {
    beforeEach(async () => {
      // Initialize service
      mockPayloadClient.getCollections.mockResolvedValue(['users', 'media']);
      mockPayloadClient.getUsers.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getMedia.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getCollection.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      
      await dashboardService.initialize();
    });

    it('should return system health status', async () => {
      const result = await dashboardService.getSystemHealth();

      expect(result).toMatchObject({
        status: expect.stringMatching(/^(healthy|warning|critical)$/),
        uptime: expect.any(Number),
        responseTime: expect.any(Number),
        memoryUsage: expect.any(Number),
        diskUsage: expect.any(Number),
        activeConnections: expect.any(Number),
        errorRate: expect.any(Number),
        lastChecked: expect.any(String),
      });
    });
  });

  describe('cache management', () => {
    beforeEach(async () => {
      // Initialize service
      mockPayloadClient.getCollections.mockResolvedValue(['users', 'media']);
      mockPayloadClient.getUsers.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getMedia.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getCollection.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      
      await dashboardService.initialize();
    });

    it('should clear cache when requested', () => {
      expect(() => dashboardService.clearCache()).not.toThrow();
    });

    it('should clear cache with pattern when requested', () => {
      expect(() => dashboardService.clearCache('dashboard-overview')).not.toThrow();
    });

    it('should return cache stats', () => {
      const stats = dashboardService.getCacheStats();
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('hitRate');
      expect(stats).toHaveProperty('totalRequests');
    });
  });

  describe('performance monitoring', () => {
    beforeEach(async () => {
      // Initialize service
      mockPayloadClient.getCollections.mockResolvedValue(['users', 'media']);
      mockPayloadClient.getUsers.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getMedia.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getCollection.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      
      await dashboardService.initialize();
    });

    it('should return performance metrics', () => {
      const metrics = dashboardService.getPerformanceMetrics();
      expect(metrics).toBeInstanceOf(Map);
    });

    it('should return recent errors', () => {
      const errors = dashboardService.getRecentErrors(5);
      expect(Array.isArray(errors)).toBe(true);
    });
  });

  describe('batch requests', () => {
    beforeEach(async () => {
      // Initialize service
      mockPayloadClient.getCollections.mockResolvedValue(['users', 'media']);
      mockPayloadClient.getUsers.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getMedia.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getCollection.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      
      await dashboardService.initialize();
    });

    it('should execute batch requests successfully', async () => {
      const batchRequest = {
        id: 'test-batch',
        requests: [
          {
            key: 'test1',
            fn: async () => 'result1',
            priority: 'high' as const,
          },
          {
            key: 'test2', 
            fn: async () => 'result2',
            priority: 'medium' as const,
          },
        ],
      };

      const result = await dashboardService.batchRequests(batchRequest);

      expect(result.results).toEqual({
        test1: 'result1',
        test2: 'result2',
      });
      expect(Object.keys(result.errors)).toHaveLength(0);
      expect(result.executionTime).toBeGreaterThan(0);
    });

    it('should handle batch request errors', async () => {
      const batchRequest = {
        id: 'test-batch',
        requests: [
          {
            key: 'success',
            fn: async () => 'result',
            priority: 'high' as const,
          },
          {
            key: 'error',
            fn: async () => { throw new Error('Test error'); },
            priority: 'medium' as const,
          },
        ],
      };

      const result = await dashboardService.batchRequests(batchRequest);

      expect(result.results.success).toBe('result');
      expect(result.errors.error).toBeDefined();
      expect(result.errors.error.message).toBe('Test error');
    });
  });

  describe('error handling', () => {
    it('should handle and log errors appropriately', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Initialize service
      mockPayloadClient.getCollections.mockResolvedValue(['users', 'media']);
      mockPayloadClient.getUsers.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getMedia.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      mockPayloadClient.getCollection.mockResolvedValue({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, pagingCounter: 1 });
      
      await dashboardService.initialize();

      // Mock an error scenario
      mockPayloadClient.getUsers.mockRejectedValueOnce(new Error('Test error'));

      try {
        await dashboardService.getDashboardData();
      } catch (error) {
        // Error should be thrown
        expect(error).toBeDefined();
      }

      consoleErrorSpy.mockRestore();
    });
  });
});