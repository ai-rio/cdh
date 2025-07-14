import { performance } from 'perf_hooks';
import { renderHook, act } from '@testing-library/react';
import { useCollectionManager } from '@/app/(dashboard)/hooks/use-collection-manager';
import { useCollectionSchema } from '@/app/(dashboard)/hooks/use-collection-schema';
import type { CollectionConfig } from '@/types/collection-management';

// Mock dependencies
jest.mock('@/hooks/use-payload');
jest.mock('@/hooks/use-auth');
jest.mock('@/app/(dashboard)/hooks/use-collaboration');

const mockPayload = {
  find: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
  getCollectionConfig: jest.fn(),
  updateCollectionConfig: jest.fn(),
};

const mockUser = {
  id: 'user1',
  email: 'test@example.com',
  role: 'admin',
};

// Mock the hooks
require('@/hooks/use-payload').usePayload = jest.fn(() => ({ payload: mockPayload }));
require('@/hooks/use-auth').useAuth = jest.fn(() => ({ user: mockUser }));
require('@/app/(dashboard)/hooks/use-collaboration').useCollaboration = jest.fn(() => ({
  lockDocument: jest.fn(),
  unlockDocument: jest.fn(),
  subscribeToChanges: jest.fn(() => ({ unsubscribe: jest.fn() })),
  broadcastChange: jest.fn(),
}));

// Helper functions
const generateLargeDataset = (size: number) => {
  return Array.from({ length: size }, (_, i) => ({
    id: `doc-${i}`,
    title: `Document ${i}`,
    content: `This is the content for document ${i}. `.repeat(10),
    status: i % 3 === 0 ? 'published' : i % 3 === 1 ? 'draft' : 'archived',
    tags: [`tag-${i % 10}`, `category-${i % 5}`],
    metadata: {
      views: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 50),
    },
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
    updatedAt: new Date(Date.now() - i * 1000 * 60 * 30).toISOString(),
  }));
};

const generateComplexSchema = (): CollectionConfig => {
  return {
    slug: 'complex-collection',
    labels: {
      singular: 'Complex Document',
      plural: 'Complex Documents',
    },
    fields: Array.from({ length: 50 }, (_, i) => ({
      name: `field_${i}`,
      type: i % 10 === 0 ? 'richText' : 
            i % 9 === 0 ? 'relationship' :
            i % 8 === 0 ? 'upload' :
            i % 7 === 0 ? 'array' :
            i % 6 === 0 ? 'blocks' :
            i % 5 === 0 ? 'group' :
            i % 4 === 0 ? 'select' :
            i % 3 === 0 ? 'number' :
            i % 2 === 0 ? 'textarea' : 'text',
      label: `Field ${i}`,
      required: i % 5 === 0,
      admin: {
        position: i % 3 === 0 ? 'sidebar' : 'main',
        hidden: i % 20 === 0,
      },
      ...(i % 4 === 0 && {
        options: Array.from({ length: 20 }, (_, j) => ({
          label: `Option ${j}`,
          value: `option_${j}`,
        })),
      }),
      ...(i % 9 === 0 && {
        relationTo: 'related-collection',
        hasMany: true,
      }),
    })),
    admin: {
      useAsTitle: 'field_0',
      defaultColumns: ['field_0', 'field_1', 'field_2', 'createdAt'],
    },
  };
};

const measurePerformance = async (fn: () => Promise<void>, label: string) => {
  const start = performance.now();
  await fn();
  const end = performance.now();
  const duration = end - start;
  
  console.log(`${label}: ${duration.toFixed(2)}ms`);
  return duration;
};

describe('Collection Management Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset performance marks
    performance.clearMarks();
    performance.clearMeasures();
  });

  describe('Data Loading Performance', () => {
    it('should load 1000 documents within 2 seconds', async () => {
      const largeDataset = generateLargeDataset(1000);
      
      mockPayload.find.mockResolvedValue({
        docs: largeDataset,
        totalDocs: 1000,
        totalPages: 40,
        page: 1,
        limit: 25,
        hasNextPage: true,
        hasPrevPage: false,
        pagingCounter: 1,
      });

      const duration = await measurePerformance(async () => {
        const { result } = renderHook(() => useCollectionManager({
          collection: 'posts',
          initialPageSize: 25,
          enableRealTime: false,
        }));

        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.documents).toHaveLength(1000);
      }, 'Load 1000 documents');

      expect(duration).toBeLessThan(2000); // Should be under 2 seconds
    });

    it('should load 10000 documents with virtual scrolling within 3 seconds', async () => {
      const largeDataset = generateLargeDataset(10000);
      
      mockPayload.find.mockResolvedValue({
        docs: largeDataset.slice(0, 100), // Virtual scrolling loads in chunks
        totalDocs: 10000,
        totalPages: 400,
        page: 1,
        limit: 100,
        hasNextPage: true,
        hasPrevPage: false,
        pagingCounter: 1,
      });

      const duration = await measurePerformance(async () => {
        const { result } = renderHook(() => useCollectionManager({
          collection: 'posts',
          initialPageSize: 100,
          enableVirtualScrolling: true,
          enableRealTime: false,
        }));

        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.totalCount).toBe(10000);
        expect(result.current.documents).toHaveLength(100); // Only loaded chunk
      }, 'Load 10000 documents with virtual scrolling');

      expect(duration).toBeLessThan(3000); // Should be under 3 seconds
    });

    it('should handle pagination efficiently', async () => {
      const dataset = generateLargeDataset(5000);
      
      mockPayload.find.mockImplementation(({ page = 1, limit = 25 }) => {
        const start = (page - 1) * limit;
        const end = start + limit;
        
        return Promise.resolve({
          docs: dataset.slice(start, end),
          totalDocs: 5000,
          totalPages: Math.ceil(5000 / limit),
          page,
          limit,
          hasNextPage: end < 5000,
          hasPrevPage: page > 1,
          pagingCounter: start + 1,
        });
      });

      const { result } = renderHook(() => useCollectionManager({
        collection: 'posts',
        initialPageSize: 50,
        enableRealTime: false,
      }));

      // Test rapid page changes
      const duration = await measurePerformance(async () => {
        for (let page = 1; page <= 10; page++) {
          await act(async () => {
            result.current.goToPage(page);
            await new Promise(resolve => setTimeout(resolve, 10));
          });
        }
      }, 'Rapid pagination through 10 pages');

      expect(duration).toBeLessThan(1000); // Should be under 1 second for 10 page changes
    });
  });

  describe('Search and Filtering Performance', () => {
    it('should search through large datasets within 1 second', async () => {
      const largeDataset = generateLargeDataset(5000);
      
      mockPayload.find.mockImplementation(({ search }) => {
        const filteredDocs = search 
          ? largeDataset.filter(doc => 
              doc.title.toLowerCase().includes(search.toLowerCase()) ||
              doc.content.toLowerCase().includes(search.toLowerCase())
            )
          : largeDataset;

        return Promise.resolve({
          docs: filteredDocs.slice(0, 25),
          totalDocs: filteredDocs.length,
          totalPages: Math.ceil(filteredDocs.length / 25),
          page: 1,
          limit: 25,
        });
      });

      const { result } = renderHook(() => useCollectionManager({
        collection: 'posts',
        initialPageSize: 25,
        enableRealTime: false,
      }));

      const duration = await measurePerformance(async () => {
        await act(async () => {
          result.current.search('Document 123');
          await new Promise(resolve => setTimeout(resolve, 0));
        });
      }, 'Search through 5000 documents');

      expect(duration).toBeLessThan(1000); // Should be under 1 second
    });

    it('should apply complex filters efficiently', async () => {
      const largeDataset = generateLargeDataset(3000);
      
      mockPayload.find.mockImplementation(({ where }) => {
        let filteredDocs = largeDataset;
        
        if (where?.status) {
          filteredDocs = filteredDocs.filter(doc => doc.status === where.status);
        }
        if (where?.tags) {
          filteredDocs = filteredDocs.filter(doc => 
            doc.tags.some(tag => where.tags.includes(tag))
          );
        }
        if (where?.createdAt) {
          const date = new Date(where.createdAt.$gte);
          filteredDocs = filteredDocs.filter(doc => 
            new Date(doc.createdAt) >= date
          );
        }

        return Promise.resolve({
          docs: filteredDocs.slice(0, 25),
          totalDocs: filteredDocs.length,
          totalPages: Math.ceil(filteredDocs.length / 25),
          page: 1,
          limit: 25,
        });
      });

      const { result } = renderHook(() => useCollectionManager({
        collection: 'posts',
        initialPageSize: 25,
        enableRealTime: false,
      }));

      const duration = await measurePerformance(async () => {
        await act(async () => {
          result.current.filter({
            where: {
              status: 'published',
              tags: ['tag-1', 'tag-2'],
              createdAt: { $gte: new Date(Date.now() - 86400000).toISOString() },
            },
          });
          await new Promise(resolve => setTimeout(resolve, 0));
        });
      }, 'Apply complex filters to 3000 documents');

      expect(duration).toBeLessThan(800); // Should be under 800ms
    });
  });

  describe('CRUD Operations Performance', () => {
    it('should create documents quickly', async () => {
      mockPayload.create.mockImplementation((data) => 
        Promise.resolve({
          id: `new-${Date.now()}`,
          ...data.data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      );

      const { result } = renderHook(() => useCollectionManager({
        collection: 'posts',
        enableRealTime: false,
      }));

      const duration = await measurePerformance(async () => {
        for (let i = 0; i < 10; i++) {
          await act(async () => {
            await result.current.create({
              title: `Performance Test ${i}`,
              content: 'Test content',
              status: 'draft',
            });
          });
        }
      }, 'Create 10 documents');

      expect(duration).toBeLessThan(2000); // Should be under 2 seconds for 10 creates
    });

    it('should handle bulk operations efficiently', async () => {
      const bulkData = Array.from({ length: 100 }, (_, i) => ({
        id: `bulk-${i}`,
        title: `Bulk Document ${i}`,
        status: 'draft',
      }));

      mockPayload.update.mockImplementation(() => Promise.resolve({ success: true }));
      mockPayload.delete.mockImplementation(() => Promise.resolve({ success: true }));

      const { result } = renderHook(() => useCollectionManager({
        collection: 'posts',
        enableRealTime: false,
      }));

      // Test bulk update
      const updateDuration = await measurePerformance(async () => {
        await act(async () => {
          await result.current.bulkUpdate(
            bulkData.map(item => item.id),
            { status: 'published' }
          );
        });
      }, 'Bulk update 100 documents');

      expect(updateDuration).toBeLessThan(5000); // Should be under 5 seconds

      // Test bulk delete
      const deleteDuration = await measurePerformance(async () => {
        await act(async () => {
          await result.current.bulkDelete(bulkData.map(item => item.id));
        });
      }, 'Bulk delete 100 documents');

      expect(deleteDuration).toBeLessThan(3000); // Should be under 3 seconds
    });
  });

  describe('Schema Operations Performance', () => {
    it('should load complex schemas within 500ms', async () => {
      const complexSchema = generateComplexSchema();
      
      mockPayload.getCollectionConfig.mockResolvedValue(complexSchema);

      const duration = await measurePerformance(async () => {
        const { result } = renderHook(() => useCollectionSchema({
          collection: 'complex-collection',
        }));

        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.fields).toHaveLength(50);
      }, 'Load complex schema with 50 fields');

      expect(duration).toBeLessThan(500); // Should be under 500ms
    });

    it('should handle schema validation efficiently', async () => {
      const complexSchema = generateComplexSchema();
      
      mockPayload.getCollectionConfig.mockResolvedValue(complexSchema);

      const { result } = renderHook(() => useCollectionSchema({
        collection: 'complex-collection',
      }));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const duration = await measurePerformance(async () => {
        const validation = result.current.validateSchema(complexSchema);
        expect(validation.isValid).toBe(true);
      }, 'Validate complex schema');

      expect(duration).toBeLessThan(200); // Should be under 200ms
    });

    it('should perform field operations quickly', async () => {
      const schema = generateComplexSchema();
      
      mockPayload.getCollectionConfig.mockResolvedValue(schema);
      mockPayload.updateCollectionConfig.mockResolvedValue(schema);

      const { result } = renderHook(() => useCollectionSchema({
        collection: 'complex-collection',
      }));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const duration = await measurePerformance(async () => {
        // Add field
        await act(async () => {
          await result.current.addField({
            name: 'new_field',
            type: 'text',
            label: 'New Field',
          });
        });

        // Update field
        await act(async () => {
          await result.current.updateField('field_0', {
            label: 'Updated Field',
            required: true,
          });
        });

        // Remove field
        await act(async () => {
          await result.current.removeField('field_49');
        });
      }, 'Perform multiple field operations');

      expect(duration).toBeLessThan(1000); // Should be under 1 second
    });
  });

  describe('Real-time Performance', () => {
    it('should handle high-frequency real-time updates', async () => {
      const updates = Array.from({ length: 100 }, (_, i) => ({
        collection: 'posts',
        documentId: `doc-${i % 10}`, // 10 documents getting updates
        fieldPath: 'title',
        oldValue: `Old Title ${i}`,
        newValue: `New Title ${i}`,
        userId: `user-${i % 3}`, // 3 users making changes
        timestamp: new Date(),
        changeType: 'update' as const,
      }));

      let changeCallback: any;
      require('@/app/(dashboard)/hooks/use-collaboration').useCollaboration.mockReturnValue({
        subscribeToChanges: jest.fn((collection, callback) => {
          changeCallback = callback;
          return { unsubscribe: jest.fn() };
        }),
        broadcastChange: jest.fn(),
        lockDocument: jest.fn(),
        unlockDocument: jest.fn(),
      });

      const { result } = renderHook(() => useCollectionManager({
        collection: 'posts',
        enableRealTime: true,
      }));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const duration = await measurePerformance(async () => {
        // Simulate rapid updates
        for (const update of updates) {
          act(() => {
            changeCallback(update);
          });
        }
        
        // Allow processing
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 10));
        });
      }, 'Process 100 real-time updates');

      expect(duration).toBeLessThan(1000); // Should process all updates under 1 second
    });
  });

  describe('Memory Usage', () => {
    it('should not cause memory leaks with large datasets', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Simulate multiple large operations
      for (let round = 0; round < 5; round++) {
        const largeDataset = generateLargeDataset(1000);
        
        mockPayload.find.mockResolvedValue({
          docs: largeDataset,
          totalDocs: 1000,
          totalPages: 40,
          page: 1,
          limit: 25,
        });

        const { result, unmount } = renderHook(() => useCollectionManager({
          collection: `posts-${round}`,
          enableRealTime: false,
        }));

        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.documents).toHaveLength(1000);
        
        // Cleanup
        unmount();
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('Network Performance', () => {
    it('should batch API calls efficiently', async () => {
      let apiCallCount = 0;
      
      mockPayload.find.mockImplementation(() => {
        apiCallCount++;
        return Promise.resolve({
          docs: generateLargeDataset(25),
          totalDocs: 1000,
          totalPages: 40,
          page: 1,
          limit: 25,
        });
      });

      const { result } = renderHook(() => useCollectionManager({
        collection: 'posts',
        enableRealTime: false,
      }));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Multiple rapid operations
      await act(async () => {
        result.current.search('test');
        result.current.filter({ where: { status: 'published' } });
        result.current.sort('title', 'asc');
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Should batch calls efficiently (not make 3 separate calls)
      expect(apiCallCount).toBeLessThanOrEqual(2);
    });
  });
});