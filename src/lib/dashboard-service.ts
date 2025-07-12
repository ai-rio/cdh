'use client';

import { PayloadClient } from './payload-client';
import { 
  DashboardOverview, 
  CollectionStats, 
  UserAnalytics, 
  SystemHealth, 
  DashboardServiceConfig,
  PerformanceMetrics,
  ActivityItem,
  QuickStats,
  DashboardError,
  BatchRequest,
  BatchResponse,
} from './dashboard-types';
import { 
  PerformanceMonitor, 
  ErrorHandler, 
  Logger, 
  CacheManager,
  DataTransformer,
  RequestBatcher,
} from './dashboard-utils';

export class DashboardService {
  private payloadClient: PayloadClient;
  private performanceMonitor: PerformanceMonitor;
  private errorHandler: ErrorHandler;
  private logger: Logger;
  private cache: CacheManager;
  private requestBatcher: RequestBatcher;
  private config: DashboardServiceConfig;
  private initialized = false;

  constructor(payloadClient?: PayloadClient, config?: Partial<DashboardServiceConfig>) {
    this.payloadClient = payloadClient || new PayloadClient();
    
    // Default configuration
    this.config = {
      cache: {
        defaultTTL: 5 * 60 * 1000, // 5 minutes
        maxSize: 100,
        strategy: 'LRU',
      },
      refreshIntervals: {
        overview: 30000, // 30 seconds
        stats: 60000, // 1 minute
        health: 15000, // 15 seconds
      },
      performance: {
        maxConcurrentRequests: 10,
        requestTimeout: 30000, // 30 seconds
        retryAttempts: 3,
      },
      logging: {
        level: 'info',
        enablePerformanceLogging: true,
      },
      ...config,
    };

    this.performanceMonitor = new PerformanceMonitor();
    this.errorHandler = new ErrorHandler();
    this.logger = new Logger(this.config.logging.level, this.config.logging.enablePerformanceLogging);
    this.cache = new CacheManager(this.config.cache.defaultTTL, this.config.cache.maxSize);
    this.requestBatcher = new RequestBatcher();
  }

  // Core functionality
  async initialize(): Promise<void> {
    if (this.initialized) {
      this.logger.warn('Dashboard service already initialized');
      return;
    }

    const startTime = Date.now();
    
    try {
      this.logger.info('Initializing Dashboard Service...');
      
      // Test connection to Payload CMS
      await this.testConnection();
      
      // Pre-warm cache with essential data
      await this.preWarmCache();
      
      this.initialized = true;
      const duration = Date.now() - startTime;
      
      this.logger.performance('Service initialization', duration, true);
      this.logger.info(`Dashboard Service initialized successfully in ${duration}ms`);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      const dashboardError = this.errorHandler.handleError(error, { operation: 'initialize' });
      
      this.logger.performance('Service initialization', duration, false);
      this.logger.error('Failed to initialize Dashboard Service', dashboardError);
      
      throw error;
    }
  }

  async getDashboardData(): Promise<DashboardOverview> {
    this.ensureInitialized();
    
    const cacheKey = 'dashboard-overview';
    const cached = this.cache.get<DashboardOverview>(cacheKey);
    
    if (cached) {
      this.performanceMonitor.recordCacheHit('getDashboardData');
      this.logger.debug('Returning cached dashboard data');
      return cached;
    }

    const startTime = Date.now();
    
    try {
      this.logger.info('Fetching dashboard overview data...');
      
      // Batch requests for better performance
      const [users, media, collections, systemHealth] = await Promise.all([
        this.getUsersData(),
        this.getMediaData(),
        this.getCollectionStats(),
        this.getSystemHealth(),
      ]);

      const recentActivity = await this.getRecentActivity();
      const quickStats = this.generateQuickStats(users, media);

      const overview: DashboardOverview = {
        totalUsers: users.totalDocs,
        totalMedia: media.totalDocs,
        recentActivity,
        systemHealth,
        quickStats,
      };

      this.cache.set(cacheKey, overview);
      
      const duration = Date.now() - startTime;
      this.performanceMonitor.recordRequest('getDashboardData', duration, true);
      this.logger.performance('Dashboard data fetch', duration, true);
      
      return overview;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.performanceMonitor.recordRequest('getDashboardData', duration, false);
      this.logger.performance('Dashboard data fetch', duration, false);
      
      const dashboardError = this.errorHandler.handleError(error, { operation: 'getDashboardData' });
      throw dashboardError;
    }
  }

  // Data aggregation methods
  async getCollectionStats(): Promise<CollectionStats[]> {
    this.ensureInitialized();
    
    const cacheKey = 'collection-stats';
    const cached = this.cache.get<CollectionStats[]>(cacheKey);
    
    if (cached) {
      this.performanceMonitor.recordCacheHit('getCollectionStats');
      return cached;
    }

    const startTime = Date.now();
    
    try {
      this.logger.info('Aggregating collection statistics...');
      
      const collections = await this.payloadClient.getCollections();
      const stats: CollectionStats[] = [];

      for (const collection of collections) {
        try {
          const data = await this.payloadClient.getCollection(collection, { limit: 1 });
          const recentData = await this.payloadClient.getCollection(collection, {
            limit: 1,
            where: {
              createdAt: {
                greater_than: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              },
            },
          });

          stats.push({
            collection,
            totalDocuments: data.totalDocs,
            recentDocuments: recentData.totalDocs,
            lastUpdated: new Date().toISOString(),
          });
        } catch (error) {
          this.logger.warn(`Failed to get stats for collection ${collection}`, error);
        }
      }

      this.cache.set(cacheKey, stats, this.config.refreshIntervals.stats);
      
      const duration = Date.now() - startTime;
      this.performanceMonitor.recordRequest('getCollectionStats', duration, true);
      this.logger.performance('Collection stats aggregation', duration, true);
      
      return stats;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.performanceMonitor.recordRequest('getCollectionStats', duration, false);
      this.logger.performance('Collection stats aggregation', duration, false);
      
      const dashboardError = this.errorHandler.handleError(error, { operation: 'getCollectionStats' });
      throw dashboardError;
    }
  }

  async getUserAnalytics(): Promise<UserAnalytics> {
    this.ensureInitialized();
    
    const cacheKey = 'user-analytics';
    const cached = this.cache.get<UserAnalytics>(cacheKey);
    
    if (cached) {
      this.performanceMonitor.recordCacheHit('getUserAnalytics');
      return cached;
    }

    const startTime = Date.now();
    
    try {
      this.logger.info('Calculating user analytics...');
      
      const [allUsers, todayUsers, weekUsers] = await Promise.all([
        this.payloadClient.getUsers({ limit: 1000 }),
        this.payloadClient.getUsers({
          limit: 1000,
          where: {
            createdAt: {
              greater_than: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            },
          },
        }),
        this.payloadClient.getUsers({
          limit: 1000,
          where: {
            createdAt: {
              greater_than: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
        }),
      ]);

      const transformedData = DataTransformer.transformUserData(allUsers.docs);
      
      const analytics: UserAnalytics = {
        totalUsers: transformedData.totalUsers,
        activeUsers: transformedData.activeUsers,
        newUsersToday: todayUsers.docs.length,
        newUsersThisWeek: weekUsers.docs.length,
        userRoles: transformedData.roleDistribution,
        userActivity: {
          loginCount: 0, // This would need to be tracked separately
          averageSessionTime: 0, // This would need to be tracked separately
          mostActiveUsers: allUsers.docs.slice(0, 5),
        },
      };

      this.cache.set(cacheKey, analytics, this.config.refreshIntervals.stats);
      
      const duration = Date.now() - startTime;
      this.performanceMonitor.recordRequest('getUserAnalytics', duration, true);
      this.logger.performance('User analytics calculation', duration, true);
      
      return analytics;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.performanceMonitor.recordRequest('getUserAnalytics', duration, false);
      this.logger.performance('User analytics calculation', duration, false);
      
      const dashboardError = this.errorHandler.handleError(error, { operation: 'getUserAnalytics' });
      throw dashboardError;
    }
  }

  async getSystemHealth(): Promise<SystemHealth> {
    this.ensureInitialized();
    
    const cacheKey = 'system-health';
    const cached = this.cache.get<SystemHealth>(cacheKey);
    
    if (cached) {
      this.performanceMonitor.recordCacheHit('getSystemHealth');
      return cached;
    }

    const startTime = Date.now();
    
    try {
      this.logger.info('Checking system health...');
      
      // Get performance metrics
      const metrics = this.performanceMonitor.getMetrics() as Map<string, PerformanceMetrics>;
      const aggregatedMetrics = this.aggregateMetrics(metrics);
      
      const health = DataTransformer.generateSystemHealth(aggregatedMetrics);
      
      this.cache.set(cacheKey, health, this.config.refreshIntervals.health);
      
      const duration = Date.now() - startTime;
      this.performanceMonitor.recordRequest('getSystemHealth', duration, true);
      this.logger.performance('System health check', duration, true);
      
      return health;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.performanceMonitor.recordRequest('getSystemHealth', duration, false);
      this.logger.performance('System health check', duration, false);
      
      const dashboardError = this.errorHandler.handleError(error, { operation: 'getSystemHealth' });
      throw dashboardError;
    }
  }

  // Performance optimization methods
  async batchRequests<T>(requests: BatchRequest): Promise<BatchResponse<T>> {
    this.ensureInitialized();
    
    const startTime = Date.now();
    
    try {
      this.logger.info(`Executing batch request with ${requests.requests.length} operations`);
      
      const results: Record<string, T> = {};
      const errors: Record<string, DashboardError> = {};
      
      // Sort requests by priority
      const sortedRequests = requests.requests.sort((a, b) => {
        const priority = { high: 3, medium: 2, low: 1 };
        return priority[b.priority] - priority[a.priority];
      });
      
      // Execute requests with concurrency limit
      const chunks = this.chunkArray(sortedRequests, this.config.performance.maxConcurrentRequests);
      
      for (const chunk of chunks) {
        const chunkPromises = chunk.map(async (request) => {
          try {
            const result = await request.fn();
            results[request.key] = result;
          } catch (error) {
            errors[request.key] = this.errorHandler.handleError(error, { 
              operation: 'batchRequest',
              requestKey: request.key,
            });
          }
        });
        
        await Promise.all(chunkPromises);
      }
      
      const duration = Date.now() - startTime;
      this.logger.performance('Batch request execution', duration, true);
      
      return {
        results,
        errors,
        executionTime: duration,
      };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.performance('Batch request execution', duration, false);
      
      const dashboardError = this.errorHandler.handleError(error, { operation: 'batchRequests' });
      throw dashboardError;
    }
  }

  // Cache management
  clearCache(pattern?: string): void {
    if (pattern) {
      this.logger.info(`Clearing cache with pattern: ${pattern}`);
      // Implementation would depend on pattern matching logic
    } else {
      this.logger.info('Clearing entire cache');
      this.cache.clear();
    }
  }

  getCacheStats() {
    return this.cache.getStats();
  }

  // Performance monitoring
  getPerformanceMetrics(): Map<string, PerformanceMetrics> {
    return this.performanceMonitor.getMetrics() as Map<string, PerformanceMetrics>;
  }

  getRecentErrors(limit = 10): DashboardError[] {
    return this.errorHandler.getRecentErrors(limit);
  }

  // Private helper methods
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('Dashboard service not initialized. Call initialize() first.');
    }
  }

  private async testConnection(): Promise<void> {
    try {
      await this.payloadClient.getCollections();
      this.logger.info('Payload CMS connection test successful');
    } catch (error) {
      this.logger.error('Payload CMS connection test failed', error);
      throw new Error('Failed to connect to Payload CMS');
    }
  }

  private async preWarmCache(): Promise<void> {
    this.logger.info('Pre-warming cache with essential data...');
    
    try {
      // Pre-load frequently accessed data
      await Promise.all([
        this.getCollectionStats(),
        this.getSystemHealth(),
      ]);
      
      this.logger.info('Cache pre-warming completed');
    } catch (error) {
      this.logger.warn('Cache pre-warming failed, continuing anyway', error);
    }
  }

  private async getUsersData() {
    return this.payloadClient.getUsers({ limit: 1 });
  }

  private async getMediaData() {
    return this.payloadClient.getMedia({ limit: 1 });
  }

  private async getRecentActivity(): Promise<ActivityItem[]> {
    // This would need to be implemented based on actual activity tracking
    // For now, return mock data
    return [
      {
        id: '1',
        type: 'user',
        action: 'New user registered',
        timestamp: new Date().toISOString(),
      },
    ];
  }

  private generateQuickStats(users: any, media: any): QuickStats {
    // This would calculate actual stats based on date ranges
    // For now, return basic structure
    return {
      todayStats: {
        newUsers: 0,
        newMedia: 0,
        totalActions: 0,
      },
      weekStats: {
        newUsers: 0,
        newMedia: 0,
        totalActions: 0,
      },
      monthStats: {
        newUsers: users.totalDocs,
        newMedia: media.totalDocs,
        totalActions: 0,
      },
    };
  }

  private aggregateMetrics(metrics: Map<string, PerformanceMetrics>): PerformanceMetrics {
    if (metrics.size === 0) {
      return {
        requestCount: 0,
        averageResponseTime: 0,
        cacheHitRate: 0,
        errorRate: 0,
        activeRequests: 0,
        lastUpdated: new Date().toISOString(),
      };
    }

    let totalRequests = 0;
    let totalResponseTime = 0;
    let totalCacheHits = 0;
    let totalErrors = 0;

    for (const metric of metrics.values()) {
      totalRequests += metric.requestCount;
      totalResponseTime += metric.averageResponseTime * metric.requestCount;
      totalCacheHits += metric.cacheHitRate * metric.requestCount;
      totalErrors += metric.errorRate * metric.requestCount;
    }

    return {
      requestCount: totalRequests,
      averageResponseTime: totalRequests > 0 ? totalResponseTime / totalRequests : 0,
      cacheHitRate: totalRequests > 0 ? totalCacheHits / totalRequests : 0,
      errorRate: totalRequests > 0 ? totalErrors / totalRequests : 0,
      activeRequests: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

// Singleton instance
export const dashboardService = new DashboardService();

// React hook for using Dashboard service
export function useDashboardService() {
  return dashboardService;
}