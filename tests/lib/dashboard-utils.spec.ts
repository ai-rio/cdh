import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  PerformanceMonitor, 
  ErrorHandler, 
  Logger, 
  CacheManager,
  DataTransformer,
  Validators,
  RequestBatcher,
} from '@/lib/dashboard-utils';
import { DashboardError } from '@/lib/dashboard-types';

describe('Dashboard Utils', () => {
  describe('PerformanceMonitor', () => {
    let monitor: PerformanceMonitor;

    beforeEach(() => {
      monitor = new PerformanceMonitor();
    });

    it('should record request performance metrics', () => {
      monitor.recordRequest('/api/test', 150, true);
      
      const metrics = monitor.getMetrics('/api/test');
      expect(metrics.requestCount).toBe(1);
      expect(metrics.averageResponseTime).toBe(150);
      expect(metrics.errorRate).toBe(0);
    });

    it('should calculate average response time correctly', () => {
      monitor.recordRequest('/api/test', 100, true);
      monitor.recordRequest('/api/test', 200, true);
      
      const metrics = monitor.getMetrics('/api/test');
      expect(metrics.averageResponseTime).toBe(150);
    });

    it('should track error rate correctly', () => {
      monitor.recordRequest('/api/test', 100, true);
      monitor.recordRequest('/api/test', 200, false);
      
      const metrics = monitor.getMetrics('/api/test');
      expect(metrics.errorRate).toBe(0.5);
    });

    it('should record cache hits', () => {
      monitor.recordRequest('/api/test', 100, true);
      monitor.recordCacheHit('/api/test');
      
      const metrics = monitor.getMetrics('/api/test');
      expect(metrics.cacheHitRate).toBeGreaterThan(0);
    });

    it('should reset metrics', () => {
      monitor.recordRequest('/api/test', 100, true);
      monitor.reset();
      
      const metrics = monitor.getMetrics('/api/test');
      expect(metrics.requestCount).toBe(0);
    });

    it('should return all metrics when no endpoint specified', () => {
      monitor.recordRequest('/api/test1', 100, true);
      monitor.recordRequest('/api/test2', 200, true);
      
      const allMetrics = monitor.getMetrics();
      expect(allMetrics).toBeInstanceOf(Map);
      expect(allMetrics.size).toBe(2);
    });

    it('should cleanup old metrics to prevent memory leaks', () => {
      // Record more than the max limit
      for (let i = 0; i < 150; i++) {
        monitor.recordRequest(`/api/test${i}`, 100, true);
      }
      
      const allMetrics = monitor.getMetrics() as Map<string, any>;
      expect(allMetrics.size).toBeLessThanOrEqual(100);
    });
  });

  describe('ErrorHandler', () => {
    let errorHandler: ErrorHandler;
    let consoleErrorSpy: any;
    let consoleWarnSpy: any;
    let consoleInfoSpy: any;

    beforeEach(() => {
      errorHandler = new ErrorHandler();
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
      consoleWarnSpy.mockRestore();
      consoleInfoSpy.mockRestore();
    });

    it('should handle Error objects correctly', () => {
      const error = new Error('Test error');
      const result = errorHandler.handleError(error);
      
      expect(result.code).toBe('Error');
      expect(result.message).toBe('Test error');
      expect(result.severity).toBe('low');
    });

    it('should handle string errors', () => {
      const result = errorHandler.handleError('String error');
      
      expect(result.code).toBe('GenericError');
      expect(result.message).toBe('String error');
    });

    it('should handle unknown errors', () => {
      const result = errorHandler.handleError({ unknown: 'object' });
      
      expect(result.code).toBe('GenericError');
      expect(result.message).toBe('An unknown error occurred');
    });

    it('should classify network errors as high severity', () => {
      const error = new Error('Network connection failed');
      const result = errorHandler.handleError(error);
      
      expect(result.severity).toBe('high');
    });

    it('should classify auth errors as critical severity', () => {
      const error = new Error('Authentication failed');
      const result = errorHandler.handleError(error);
      
      expect(result.severity).toBe('critical');
    });

    it('should classify validation errors as medium severity', () => {
      const error = new Error('Validation error occurred');
      const result = errorHandler.handleError(error);
      
      expect(result.severity).toBe('medium');
    });

    it('should return recent errors', () => {
      errorHandler.handleError(new Error('Error 1'));
      errorHandler.handleError(new Error('Error 2'));
      
      const recentErrors = errorHandler.getRecentErrors(5);
      expect(recentErrors).toHaveLength(2);
      expect(recentErrors[0].message).toBe('Error 2'); // Most recent first
    });

    it('should clear errors', () => {
      errorHandler.handleError(new Error('Test error'));
      errorHandler.clearErrors();
      
      const recentErrors = errorHandler.getRecentErrors();
      expect(recentErrors).toHaveLength(0);
    });

    it('should limit stored errors to prevent memory leaks', () => {
      // Add more than the max limit
      for (let i = 0; i < 60; i++) {
        errorHandler.handleError(new Error(`Error ${i}`));
      }
      
      const recentErrors = errorHandler.getRecentErrors(100);
      expect(recentErrors.length).toBeLessThanOrEqual(50);
    });

    it('should log errors with appropriate levels', () => {
      const criticalError = new Error('auth error');
      const highError = new Error('network error');
      const mediumError = new Error('validation error');
      const lowError = new Error('normal error');

      errorHandler.handleError(criticalError);
      errorHandler.handleError(highError);
      errorHandler.handleError(mediumError);
      errorHandler.handleError(lowError);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(2); // critical and high
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1); // medium
      expect(consoleInfoSpy).toHaveBeenCalledTimes(1); // low
    });
  });

  describe('Logger', () => {
    let logger: Logger;
    let consoleDebugSpy: any;
    let consoleInfoSpy: any;
    let consoleWarnSpy: any;
    let consoleErrorSpy: any;

    beforeEach(() => {
      consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleDebugSpy.mockRestore();
      consoleInfoSpy.mockRestore();
      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should log at correct levels based on configuration', () => {
      logger = new Logger('warn');
      
      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warn message');
      logger.error('Error message');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith('[DASHBOARD WARN] Warn message', undefined);
      expect(consoleErrorSpy).toHaveBeenCalledWith('[DASHBOARD ERROR] Error message', undefined);
    });

    it('should log performance when enabled', () => {
      logger = new Logger('info', true);
      
      logger.performance('test operation', 150, true);
      
      expect(consoleInfoSpy).toHaveBeenCalledWith('[DASHBOARD PERF] test operation - 150ms - SUCCESS');
    });

    it('should not log performance when disabled', () => {
      logger = new Logger('info', false);
      
      logger.performance('test operation', 150, true);
      
      expect(consoleInfoSpy).not.toHaveBeenCalled();
    });

    it('should log performance failures', () => {
      logger = new Logger('info', true);
      
      logger.performance('test operation', 150, false);
      
      expect(consoleInfoSpy).toHaveBeenCalledWith('[DASHBOARD PERF] test operation - 150ms - FAILURE');
    });
  });

  describe('CacheManager', () => {
    let cache: CacheManager<string>;

    beforeEach(() => {
      cache = new CacheManager(1000, 5); // 1 second TTL, max 5 items
    });

    it('should store and retrieve data', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('should return null for non-existent keys', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });

    it('should respect TTL and expire data', async () => {
      cache.set('key1', 'value1', 10); // 10ms TTL
      expect(cache.get('key1')).toBe('value1');
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 20));
      expect(cache.get('key1')).toBeNull();
    });

    it('should check if key exists', () => {
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('nonexistent')).toBe(false);
    });

    it('should delete keys', () => {
      cache.set('key1', 'value1');
      expect(cache.delete('key1')).toBe(true);
      expect(cache.get('key1')).toBeNull();
      expect(cache.delete('nonexistent')).toBe(false);
    });

    it('should clear all data', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.clear();
      expect(cache.size()).toBe(0);
    });

    it('should respect max size and evict oldest entries', () => {
      // Add more than max size
      for (let i = 0; i < 10; i++) {
        cache.set(`key${i}`, `value${i}`);
      }
      
      expect(cache.size()).toBeLessThanOrEqual(5);
      // Newest entries should still be there
      expect(cache.get('key9')).toBe('value9');
      expect(cache.get('key8')).toBe('value8');
    });

    it('should return cache stats', () => {
      const stats = cache.getStats();
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('hitRate');
      expect(stats).toHaveProperty('totalRequests');
    });
  });

  describe('DataTransformer', () => {
    describe('transformUserData', () => {
      it('should transform user data correctly', () => {
        const users = [
          { id: '1', role: 'admin', lastLogin: new Date().toISOString() },
          { id: '2', role: 'user', lastLogin: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString() },
          { id: '3', role: 'user', lastLogin: new Date().toISOString() },
          { id: '4', role: 'admin' }, // No lastLogin
        ];

        const result = DataTransformer.transformUserData(users);

        expect(result.totalUsers).toBe(4);
        expect(result.activeUsers).toBe(2); // Users with recent login
        expect(result.roleDistribution).toEqual([
          { role: 'admin', count: 2, percentage: 50 },
          { role: 'user', count: 2, percentage: 50 },
        ]);
      });

      it('should handle empty user array', () => {
        const result = DataTransformer.transformUserData([]);
        expect(result.totalUsers).toBe(0);
        expect(result.activeUsers).toBe(0);
        expect(result.roleDistribution).toEqual([]);
      });

      it('should handle users without roles', () => {
        const users = [
          { id: '1' },
          { id: '2' },
        ];

        const result = DataTransformer.transformUserData(users);
        expect(result.roleDistribution).toEqual([
          { role: 'user', count: 2, percentage: 100 },
        ]);
      });
    });

    describe('transformMediaData', () => {
      it('should transform media data correctly', () => {
        const media = [
          { id: '1', createdAt: new Date().toISOString(), filesize: 1024 },
          { id: '2', createdAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(), filesize: 2048 },
          { id: '3', createdAt: new Date().toISOString() }, // No filesize
        ];

        const result = DataTransformer.transformMediaData(media);

        expect(result.totalMedia).toBe(3);
        expect(result.recentMedia).toBe(2); // Created in last 30 days
        expect(result.sizeStats.totalSize).toBe(3072);
        expect(result.sizeStats.averageSize).toBe(1024);
      });

      it('should handle empty media array', () => {
        const result = DataTransformer.transformMediaData([]);
        expect(result.totalMedia).toBe(0);
        expect(result.recentMedia).toBe(0);
        expect(result.sizeStats.totalSize).toBe(0);
        expect(result.sizeStats.averageSize).toBe(0);
      });
    });

    describe('generateSystemHealth', () => {
      it('should generate healthy status for good metrics', () => {
        const metrics = {
          averageResponseTime: 100,
          errorRate: 0.01,
        };

        const result = DataTransformer.generateSystemHealth(metrics);
        expect(result.status).toBe('healthy');
        expect(result.responseTime).toBe(100);
        expect(result.errorRate).toBe(0.01);
      });

      it('should generate warning status for concerning metrics', () => {
        const metrics = {
          averageResponseTime: 1500,
          errorRate: 0.07,
        };

        const result = DataTransformer.generateSystemHealth(metrics);
        expect(result.status).toBe('warning');
      });

      it('should generate critical status for bad metrics', () => {
        const metrics = {
          averageResponseTime: 6000,
          errorRate: 0.15,
        };

        const result = DataTransformer.generateSystemHealth(metrics);
        expect(result.status).toBe('critical');
      });
    });
  });

  describe('Validators', () => {
    describe('isValidId', () => {
      it('should validate valid IDs', () => {
        expect(Validators.isValidId('123')).toBe(true);
        expect(Validators.isValidId('abc-123')).toBe(true);
      });

      it('should reject invalid IDs', () => {
        expect(Validators.isValidId('')).toBe(false);
        expect(Validators.isValidId(null)).toBe(false);
        expect(Validators.isValidId(undefined)).toBe(false);
        expect(Validators.isValidId(123)).toBe(false);
      });
    });

    describe('isValidEmail', () => {
      it('should validate valid emails', () => {
        expect(Validators.isValidEmail('test@example.com')).toBe(true);
        expect(Validators.isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      });

      it('should reject invalid emails', () => {
        expect(Validators.isValidEmail('invalid')).toBe(false);
        expect(Validators.isValidEmail('test@')).toBe(false);
        expect(Validators.isValidEmail('@example.com')).toBe(false);
        expect(Validators.isValidEmail('')).toBe(false);
        expect(Validators.isValidEmail(null)).toBe(false);
      });
    });

    describe('isValidDate', () => {
      it('should validate valid dates', () => {
        expect(Validators.isValidDate(new Date())).toBe(true);
        expect(Validators.isValidDate(new Date('2023-01-01'))).toBe(true);
      });

      it('should reject invalid dates', () => {
        expect(Validators.isValidDate(new Date('invalid'))).toBe(false);
        expect(Validators.isValidDate('2023-01-01')).toBe(false);
        expect(Validators.isValidDate(null)).toBe(false);
      });
    });

    describe('sanitizeInput', () => {
      it('should sanitize string input', () => {
        expect(Validators.sanitizeInput('  test  ')).toBe('test');
        expect(Validators.sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      });

      it('should return non-string input unchanged', () => {
        expect(Validators.sanitizeInput(123)).toBe(123);
        expect(Validators.sanitizeInput(null)).toBe(null);
      });
    });
  });

  describe('RequestBatcher', () => {
    let batcher: RequestBatcher;

    beforeEach(() => {
      batcher = new RequestBatcher(10); // 10ms delay
    });

    afterEach(() => {
      batcher.clear();
    });

    it('should batch requests and execute them together', async () => {
      const executor = vi.fn().mockResolvedValue(['result1', 'result2']);
      
      const promise1 = batcher.batch('test', 'data1', executor);
      const promise2 = batcher.batch('test', 'data2', executor);
      
      const [result1, result2] = await Promise.all([promise1, promise2]);
      
      expect(result1).toBe('result1');
      expect(result2).toBe('result2');
      expect(executor).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledWith(['data1', 'data2']);
    });

    it('should handle executor errors', async () => {
      const executor = vi.fn().mockRejectedValue(new Error('Batch error'));
      
      const promise1 = batcher.batch('test', 'data1', executor);
      const promise2 = batcher.batch('test', 'data2', executor);
      
      await expect(promise1).rejects.toThrow('Batch error');
      await expect(promise2).rejects.toThrow('Batch error');
    });

    it('should clear batches and reject pending requests', async () => {
      const executor = vi.fn().mockImplementation(() => new Promise(() => {})); // Never resolves
      
      const promise = batcher.batch('test', 'data', executor);
      batcher.clear();
      
      await expect(promise).rejects.toThrow('Batch cleared');
    });

    it('should handle separate batch keys independently', async () => {
      const executor1 = vi.fn().mockResolvedValue(['result1']);
      const executor2 = vi.fn().mockResolvedValue(['result2']);
      
      const promise1 = batcher.batch('batch1', 'data1', executor1);
      const promise2 = batcher.batch('batch2', 'data2', executor2);
      
      const [result1, result2] = await Promise.all([promise1, promise2]);
      
      expect(result1).toBe('result1');
      expect(result2).toBe('result2');
      expect(executor1).toHaveBeenCalledWith(['data1']);
      expect(executor2).toHaveBeenCalledWith(['data2']);
    });
  });
});