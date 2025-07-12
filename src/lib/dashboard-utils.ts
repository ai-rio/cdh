import { DashboardError, PerformanceMetrics, SystemHealth } from './dashboard-types';

// Performance monitoring utilities
export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private readonly maxMetricsHistory = 100;

  recordRequest(endpoint: string, responseTime: number, success: boolean): void {
    const key = endpoint;
    const existing = this.metrics.get(key) || {
      requestCount: 0,
      averageResponseTime: 0,
      cacheHitRate: 0,
      errorRate: 0,
      activeRequests: 0,
      lastUpdated: new Date().toISOString(),
    };

    existing.requestCount++;
    existing.averageResponseTime = 
      (existing.averageResponseTime * (existing.requestCount - 1) + responseTime) / existing.requestCount;
    
    if (!success) {
      existing.errorRate = ((existing.errorRate * (existing.requestCount - 1)) + 1) / existing.requestCount;
    } else {
      existing.errorRate = (existing.errorRate * (existing.requestCount - 1)) / existing.requestCount;
    }
    
    existing.lastUpdated = new Date().toISOString();
    this.metrics.set(key, existing);

    // Cleanup old metrics to prevent memory leaks
    if (this.metrics.size > this.maxMetricsHistory) {
      const firstKey = this.metrics.keys().next().value;
      this.metrics.delete(firstKey);
    }
  }

  recordCacheHit(endpoint: string): void {
    const key = endpoint;
    const existing = this.metrics.get(key);
    if (existing) {
      existing.cacheHitRate = ((existing.cacheHitRate * existing.requestCount) + 1) / (existing.requestCount + 1);
      this.metrics.set(key, existing);
    }
  }

  getMetrics(endpoint?: string): PerformanceMetrics | Map<string, PerformanceMetrics> {
    if (endpoint) {
      return this.metrics.get(endpoint) || {
        requestCount: 0,
        averageResponseTime: 0,
        cacheHitRate: 0,
        errorRate: 0,
        activeRequests: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    return new Map(this.metrics);
  }

  reset(): void {
    this.metrics.clear();
  }
}

// Error handling utilities
export class ErrorHandler {
  private errors: DashboardError[] = [];
  private readonly maxErrors = 50;

  handleError(error: unknown, context?: Record<string, any>): DashboardError {
    const dashboardError: DashboardError = {
      code: this.getErrorCode(error),
      message: this.getErrorMessage(error),
      details: {
        originalError: error,
        context,
        stack: error instanceof Error ? error.stack : undefined,
      },
      timestamp: new Date().toISOString(),
      severity: this.getErrorSeverity(error),
    };

    this.errors.push(dashboardError);

    // Cleanup old errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log error based on severity
    this.logError(dashboardError);

    return dashboardError;
  }

  private getErrorCode(error: unknown): string {
    if (error instanceof Error) {
      return error.name || 'UnknownError';
    }
    return 'GenericError';
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unknown error occurred';
  }

  private getErrorSeverity(error: unknown): 'low' | 'medium' | 'high' | 'critical' {
    if (error instanceof Error) {
      if (error.message.includes('network') || error.message.includes('fetch')) {
        return 'high';
      }
      if (error.message.includes('auth') || error.message.includes('permission')) {
        return 'critical';
      }
      if (error.message.includes('validation')) {
        return 'medium';
      }
    }
    return 'low';
  }

  private logError(error: DashboardError): void {
    const logLevel = this.getLogLevel(error.severity);
    const message = `[${error.code}] ${error.message}`;
    
    switch (logLevel) {
      case 'error':
        console.error(message, error.details);
        break;
      case 'warn':
        console.warn(message, error.details);
        break;
      case 'info':
        console.info(message, error.details);
        break;
      default:
        console.log(message, error.details);
    }
  }

  private getLogLevel(severity: DashboardError['severity']): 'debug' | 'info' | 'warn' | 'error' {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'error';
      case 'medium':
        return 'warn';
      case 'low':
        return 'info';
      default:
        return 'debug';
    }
  }

  getRecentErrors(limit = 10): DashboardError[] {
    return this.errors.slice(-limit).reverse();
  }

  clearErrors(): void {
    this.errors = [];
  }
}

// Logging utilities
export class Logger {
  private level: 'debug' | 'info' | 'warn' | 'error';
  private enablePerformanceLogging: boolean;

  constructor(level: 'debug' | 'info' | 'warn' | 'error' = 'info', enablePerformanceLogging = false) {
    this.level = level;
    this.enablePerformanceLogging = enablePerformanceLogging;
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog('debug')) {
      console.debug(`[DASHBOARD DEBUG] ${message}`, data);
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog('info')) {
      console.info(`[DASHBOARD INFO] ${message}`, data);
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog('warn')) {
      console.warn(`[DASHBOARD WARN] ${message}`, data);
    }
  }

  error(message: string, data?: any): void {
    if (this.shouldLog('error')) {
      console.error(`[DASHBOARD ERROR] ${message}`, data);
    }
  }

  performance(operation: string, duration: number, success: boolean): void {
    if (this.enablePerformanceLogging && this.shouldLog('info')) {
      const status = success ? 'SUCCESS' : 'FAILURE';
      console.info(`[DASHBOARD PERF] ${operation} - ${duration}ms - ${status}`);
    }
  }

  private shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }
}

// Cache utilities
export class CacheManager<T = any> {
  private cache = new Map<string, { data: T; timestamp: number; ttl: number }>();
  private defaultTTL: number;
  private maxSize: number;

  constructor(defaultTTL = 5 * 60 * 1000, maxSize = 100) { // 5 minutes default TTL
    this.defaultTTL = defaultTTL;
    this.maxSize = maxSize;
  }

  set(key: string, data: T, ttl?: number): void {
    const entry = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };

    this.cache.set(key, entry);
    this.cleanup();
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    this.cleanup();
    return this.cache.size;
  }

  private cleanup(): void {
    const now = Date.now();
    
    // Remove expired entries
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }

    // Remove oldest entries if cache is too large
    if (this.cache.size > this.maxSize) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = this.cache.size - this.maxSize;
      for (let i = 0; i < toRemove; i++) {
        this.cache.delete(entries[i][0]);
      }
    }
  }

  getStats(): { size: number; hitRate: number; totalRequests: number } {
    return {
      size: this.cache.size,
      hitRate: 0, // This would need to be tracked separately
      totalRequests: 0, // This would need to be tracked separately
    };
  }
}

// Data transformation utilities
export const DataTransformer = {
  // Transform raw user data for analytics
  transformUserData(users: any[]): { totalUsers: number; activeUsers: number; roleDistribution: any[] } {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.lastLogin && 
      new Date(user.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
    
    const roleDistribution = users.reduce((acc, user) => {
      const role = user.role || 'user';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalUsers,
      activeUsers,
      roleDistribution: Object.entries(roleDistribution).map(([role, count]) => ({
        role,
        count,
        percentage: Math.round((count / totalUsers) * 100),
      })),
    };
  },

  // Transform raw media data for analytics
  transformMediaData(media: any[]): { totalMedia: number; recentMedia: number; sizeStats: any } {
    const totalMedia = media.length;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentMedia = media.filter(item => 
      new Date(item.createdAt) > thirtyDaysAgo).length;

    const sizeStats = media.reduce((acc, item) => {
      if (item.filesize) {
        acc.totalSize += item.filesize;
        acc.averageSize = acc.totalSize / media.length;
      }
      return acc;
    }, { totalSize: 0, averageSize: 0 });

    return {
      totalMedia,
      recentMedia,
      sizeStats,
    };
  },

  // Generate system health based on metrics
  generateSystemHealth(metrics: any): SystemHealth {
    const now = new Date().toISOString();
    const responseTime = metrics.averageResponseTime || 0;
    const errorRate = metrics.errorRate || 0;

    let status: SystemHealth['status'] = 'healthy';
    if (responseTime > 1000 || errorRate > 0.05) {
      status = 'warning';
    }
    if (responseTime > 5000 || errorRate > 0.1) {
      status = 'critical';
    }

    return {
      status,
      uptime: 99.9, // This would come from actual system monitoring
      responseTime,
      memoryUsage: 45, // This would come from actual system monitoring
      diskUsage: 30, // This would come from actual system monitoring
      activeConnections: 5, // This would come from actual system monitoring
      errorRate,
      lastChecked: now,
    };
  },
};

// Validation utilities
export const Validators = {
  isValidId(id: any): boolean {
    return typeof id === 'string' && id.length > 0;
  },

  isValidEmail(email: any): boolean {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  },

  sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      return input.trim().replace(/[<>]/g, '');
    }
    return input;
  },
};

// Request batching utilities
export class RequestBatcher {
  private batches = new Map<string, { requests: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void; data: any }>; timer: NodeJS.Timeout }>();
  private batchDelay: number;

  constructor(batchDelay = 50) { // 50ms batch delay
    this.batchDelay = batchDelay;
  }

  batch<T>(key: string, data: any, executor: (items: any[]) => Promise<T[]>): Promise<T> {
    return new Promise((resolve, reject) => {
      let batch = this.batches.get(key);
      
      if (!batch) {
        batch = { requests: [], timer: null as any };
        this.batches.set(key, batch);
        
        batch.timer = setTimeout(async () => {
          const currentBatch = this.batches.get(key);
          if (currentBatch) {
            this.batches.delete(key);
            
            try {
              const allData = currentBatch.requests.map(req => req.data);
              const results = await executor(allData);
              
              currentBatch.requests.forEach((req, index) => {
                req.resolve(results[index]);
              });
            } catch (error) {
              currentBatch.requests.forEach(req => {
                req.reject(error);
              });
            }
          }
        }, this.batchDelay);
      }
      
      batch.requests.push({ resolve, reject, data });
    });
  }

  clear(): void {
    for (const [key, batch] of this.batches.entries()) {
      clearTimeout(batch.timer);
      batch.requests.forEach(req => {
        req.reject(new Error('Batch cleared'));
      });
    }
    this.batches.clear();
  }
}