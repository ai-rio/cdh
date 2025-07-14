import { describe, it, expect, vi } from 'vitest';
import { performance } from 'perf_hooks';

// Helper function to measure performance
const measurePerformance = async (fn: () => Promise<void> | void, label: string) => {
  const start = performance.now();
  await fn();
  const end = performance.now();
  const duration = end - start;
  
  console.log(`${label}: ${duration.toFixed(2)}ms`);
  return duration;
};

describe('Collection Management Performance Tests', () => {
  describe('Data Processing Performance', () => {
    it('should process large arrays efficiently', async () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => ({
        id: `item-${i}`,
        title: `Item ${i}`,
        data: Math.random(),
      }));

      const duration = await measurePerformance(async () => {
        // Simulate data processing operations
        const filtered = largeArray.filter(item => item.data > 0.5);
        const mapped = filtered.map(item => ({ ...item, processed: true }));
        const sorted = mapped.sort((a, b) => a.title.localeCompare(b.title));
        
        expect(sorted.length).toBeGreaterThan(0);
      }, 'Process 10k items');

      // Should process 10k items under 100ms
      expect(duration).toBeLessThan(100);
    });

    it('should handle search operations efficiently', async () => {
      const documents = Array.from({ length: 1000 }, (_, i) => ({
        id: `doc-${i}`,
        title: `Document ${i}`,
        content: `This is content for document ${i}`,
        tags: [`tag-${i % 10}`, `category-${i % 5}`],
      }));

      const duration = await measurePerformance(async () => {
        const searchTerm = 'Document 123';
        const results = documents.filter(doc => 
          doc.title.includes(searchTerm) || 
          doc.content.includes(searchTerm)
        );
        
        expect(Array.isArray(results)).toBe(true);
      }, 'Search through 1k documents');

      // Should search under 50ms
      expect(duration).toBeLessThan(50);
    });

    it('should handle bulk operations efficiently', async () => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        id: `item-${i}`,
        status: 'draft',
        data: Math.random(),
      }));

      const duration = await measurePerformance(async () => {
        // Simulate bulk update
        const updated = items.map(item => ({
          ...item,
          status: 'published',
          updatedAt: new Date().toISOString(),
        }));

        expect(updated).toHaveLength(100);
        expect(updated.every(item => item.status === 'published')).toBe(true);
      }, 'Bulk update 100 items');

      // Should bulk update under 10ms
      expect(duration).toBeLessThan(10);
    });
  });

  describe('Memory Usage', () => {
    it('should not cause memory leaks with repeated operations', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Perform multiple operations
      for (let i = 0; i < 100; i++) {
        const data = Array.from({ length: 100 }, (_, j) => ({
          id: `${i}-${j}`,
          value: Math.random(),
        }));
        
        // Process and dispose
        const processed = data.map(item => item.value * 2);
        expect(processed.length).toBe(100);
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });

  describe('Async Operations', () => {
    it('should handle concurrent operations efficiently', async () => {
      const mockAsyncOperation = (delay: number) => 
        new Promise(resolve => setTimeout(resolve, delay));

      const duration = await measurePerformance(async () => {
        // Run 10 concurrent operations
        const operations = Array.from({ length: 10 }, (_, i) => 
          mockAsyncOperation(10 + Math.random() * 10)
        );

        const results = await Promise.all(operations);
        expect(results).toHaveLength(10);
      }, 'Concurrent async operations');

      // Should complete all in roughly the time of the longest operation
      expect(duration).toBeLessThan(100); // Should be ~20ms plus overhead
    });

    it('should handle sequential operations with proper timing', async () => {
      const mockOperation = vi.fn().mockResolvedValue('success');

      const duration = await measurePerformance(async () => {
        for (let i = 0; i < 5; i++) {
          await mockOperation(`operation-${i}`);
        }
      }, 'Sequential operations');

      expect(mockOperation).toHaveBeenCalledTimes(5);
      expect(duration).toBeLessThan(50); // Mock operations should be fast
    });
  });

  describe('Form Validation Performance', () => {
    it('should validate forms quickly', async () => {
      const formData = {
        title: 'Test Document',
        content: 'This is a test document content',
        status: 'published',
        tags: ['test', 'performance'],
        metadata: {
          author: 'Test User',
          createdAt: new Date().toISOString(),
        },
      };

      const validationRules = {
        title: { required: true, minLength: 3, maxLength: 100 },
        content: { required: true, minLength: 10 },
        status: { required: true, enum: ['draft', 'published', 'archived'] },
        tags: { required: false, type: 'array' },
      };

      const duration = await measurePerformance(async () => {
        // Simulate validation
        const errors: string[] = [];

        Object.entries(validationRules).forEach(([field, rules]) => {
          const value = formData[field as keyof typeof formData];
          
          if (rules.required && (!value || value === '')) {
            errors.push(`${field} is required`);
          }
          
          if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
            errors.push(`${field} must be at least ${rules.minLength} characters`);
          }
          
          if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
            errors.push(`${field} must be no more than ${rules.maxLength} characters`);
          }
          
          if (rules.enum && !rules.enum.includes(value as string)) {
            errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
          }
        });

        expect(errors).toHaveLength(0);
      }, 'Form validation');

      // Form validation should be very fast
      expect(duration).toBeLessThan(20);
    });
  });
});