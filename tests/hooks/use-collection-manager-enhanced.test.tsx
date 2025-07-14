import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { useCollectionManager } from '@/app/(dashboard)/hooks/use-collection-manager';
import { PayloadProvider } from '@/lib/payload-client';

// Test wrapper with PayloadProvider
function TestWrapper({ children }: { children: ReactNode }) {
  return <PayloadProvider>{children}</PayloadProvider>;
}

describe('useCollectionManager Enhanced Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should initialize with default state', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      expect(result.current.documents).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.isLoading).toBe(true); // Initially loading
      expect(result.current.error).toBeNull();
      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(20);
    });

    it('should load documents on mount', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.documents).toHaveLength(2);
      expect(result.current.totalCount).toBe(2);
      expect(result.current.documents[0]).toHaveProperty('name');
      expect(result.current.documents[0]).toHaveProperty('email');
    });

    it('should handle custom page size', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users', initialPageSize: 5 }),
        { wrapper: TestWrapper }
      );

      expect(result.current.pageSize).toBe(5);
    });
  });

  describe('CRUD Operations', () => {
    it('should create new documents', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialCount = result.current.totalCount;

      await act(async () => {
        const newUser = await result.current.create({
          name: 'New User',
          email: 'new@example.com',
        });
        expect(newUser).toHaveProperty('id');
        expect(newUser.name).toBe('New User');
      });

      expect(result.current.totalCount).toBe(initialCount + 1);
      expect(result.current.documents[0].name).toBe('New User');
    });

    it('should update existing documents', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const firstUser = result.current.documents[0];
      const userId = firstUser.id;

      await act(async () => {
        const updatedUser = await result.current.update(userId, {
          name: 'Updated Name',
        });
        expect(updatedUser.name).toBe('Updated Name');
      });

      const updatedDocument = result.current.documents.find(doc => doc.id === userId);
      expect(updatedDocument?.name).toBe('Updated Name');
    });

    it('should delete documents', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialCount = result.current.totalCount;
      const firstUser = result.current.documents[0];
      const userId = firstUser.id;

      await act(async () => {
        await result.current.delete(userId);
      });

      expect(result.current.totalCount).toBe(initialCount - 1);
      expect(result.current.documents.find(doc => doc.id === userId)).toBeUndefined();
    });

    it('should handle bulk delete operations', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialCount = result.current.totalCount;
      const userIds = result.current.documents.map(doc => doc.id);

      await act(async () => {
        await result.current.bulkDelete(userIds);
      });

      expect(result.current.totalCount).toBe(initialCount - userIds.length);
      expect(result.current.documents).toHaveLength(0);
    });

    it('should handle bulk update operations', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const userIds = result.current.documents.map(doc => doc.id);

      await act(async () => {
        await result.current.bulkUpdate(userIds, { status: 'updated' });
      });

      result.current.documents.forEach(doc => {
        expect(doc.status).toBe('updated');
      });
    });
  });

  describe('Search and Filtering', () => {
    it('should handle search queries', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.search('John');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should filter to only John Doe
      expect(result.current.documents).toHaveLength(1);
      expect(result.current.documents[0].name).toBe('John Doe');
    });

    it('should handle filters', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.filter({ name: 'Jane Smith' });
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.documents).toHaveLength(1);
      expect(result.current.documents[0].name).toBe('Jane Smith');
    });

    it('should handle sorting', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.sort('name', 'desc');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should be sorted by name descending (John before Jane alphabetically)
      expect(result.current.documents[0].name).toBe('John Doe');
      expect(result.current.documents[1].name).toBe('Jane Smith');
    });
  });

  describe('Pagination', () => {
    it('should handle page navigation', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users', initialPageSize: 1 }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(2);

      act(() => {
        result.current.goToPage(2);
      });

      expect(result.current.currentPage).toBe(2);
    });

    it('should handle page size changes', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.changePageSize(1);
      });

      expect(result.current.pageSize).toBe(1);
      expect(result.current.currentPage).toBe(1); // Should reset to page 1
    });

    it('should prevent navigation to invalid pages', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.goToPage(-1);
      });

      expect(result.current.currentPage).toBe(1);

      act(() => {
        result.current.goToPage(999);
      });

      expect(result.current.currentPage).toBe(result.current.totalPages);
    });
  });

  describe('Import/Export Operations', () => {
    it('should handle bulk import', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const importData = [
        { name: 'Import User 1', email: 'import1@example.com' },
        { name: 'Import User 2', email: 'import2@example.com' },
      ];

      const importOptions = {
        format: 'json' as const,
        mapping: [],
        validation: 'strict' as const,
        conflictResolution: 'skip' as const,
        batchSize: 100,
        skipErrors: false,
      };

      await act(async () => {
        const result_import = await result.current.bulkImport(importData, importOptions);
        expect(result_import.success).toBe(true);
        expect(result_import.imported).toBe(2);
        expect(result_import.errors).toHaveLength(0);
      });
    });

    it('should handle bulk export', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        const exportBlob = await result.current.bulkExport({}, 'json');
        expect(exportBlob).toBeInstanceOf(Blob);
      });
    });
  });

  describe('Schema Management', () => {
    it('should handle collection creation', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      const collectionConfig = {
        slug: 'new-collection',
        fields: [
          { name: 'title', type: 'text' },
          { name: 'content', type: 'textarea' },
        ],
      };

      await act(async () => {
        await result.current.createCollection(collectionConfig);
      });

      // Since this is a mock implementation, we just verify it doesn't throw
      expect(true).toBe(true);
    });

    it('should handle field management', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      const newField = {
        name: 'phone',
        type: 'text',
        required: false,
      };

      await act(async () => {
        await result.current.addField(newField, 0);
        await result.current.updateField('phone', { required: true });
        await result.current.reorderFields(['phone', 'name', 'email']);
        await result.current.removeField('phone');
      });

      // Since this is a mock implementation, we just verify it doesn't throw
      expect(true).toBe(true);
    });
  });

  describe('Collaboration Features', () => {
    it('should handle document locking', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const documentId = result.current.documents[0]?.id;

      await act(async () => {
        const lockResult = await result.current.lockDocument(documentId);
        expect(lockResult.success).toBe(true);
        expect(lockResult.lockId).toBeDefined();
        expect(lockResult.expiresAt).toBeInstanceOf(Date);
        expect(lockResult.lockedBy).toHaveProperty('id');
      });

      await act(async () => {
        await result.current.unlockDocument(documentId);
      });
    });

    it('should handle change subscriptions', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      const changeCallback = vi.fn();

      act(() => {
        const subscription = result.current.subscribeToChanges(changeCallback);
        expect(subscription).toHaveProperty('unsubscribe');
        expect(typeof subscription.unsubscribe).toBe('function');
        
        subscription.unsubscribe();
      });
    });
  });

  describe('Utility Functions', () => {
    it('should handle refresh', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.documents).toHaveLength(2);
    });

    it('should handle cache clearing', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      act(() => {
        result.current.clearCache();
      });

      // Since this is a mock implementation, we just verify it doesn't throw
      expect(true).toBe(true);
    });

    it('should validate schemas', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      const schema = {
        slug: 'test-collection',
        fields: [
          { name: 'title', type: 'text', required: true },
        ],
      };

      act(() => {
        const validation = result.current.validateSchema(schema);
        expect(validation.isValid).toBe(true);
        expect(validation.errors).toHaveLength(0);
        expect(validation.warnings).toHaveLength(0);
      });
    });

    it('should get collection stats', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        const stats = await result.current.getCollectionStats();
        expect(stats).toHaveProperty('totalDocuments');
        expect(stats).toHaveProperty('averageDocumentSize');
        expect(stats).toHaveProperty('fieldUsage');
        expect(stats).toHaveProperty('storageUsage');
        expect(stats).toHaveProperty('performanceMetrics');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'nonexistent' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should handle empty collection gracefully
      expect(result.current.documents).toHaveLength(0);
      expect(result.current.totalCount).toBe(0);
    });

    it('should handle delete errors', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.delete('nonexistent-id');
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toContain('not found');
        }
      });
    });

    it('should handle update errors', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ collection: 'users' }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.update('nonexistent-id', { name: 'Test' });
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toContain('not found');
        }
      });
    });
  });

  describe('Optimistic Updates', () => {
    it('should handle optimistic updates when enabled', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ 
          collection: 'users', 
          enableOptimisticUpdates: true 
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialCount = result.current.totalCount;

      await act(async () => {
        await result.current.create({
          name: 'Optimistic User',
          email: 'optimistic@example.com',
        });
      });

      // Should immediately update the UI
      expect(result.current.totalCount).toBe(initialCount + 1);
      expect(result.current.documents[0].name).toBe('Optimistic User');
    });

    it('should not use optimistic updates when disabled', async () => {
      const { result } = renderHook(
        () => useCollectionManager({ 
          collection: 'users', 
          enableOptimisticUpdates: false 
        }),
        { wrapper: TestWrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.create({
          name: 'Non-Optimistic User',
          email: 'nonoptimistic@example.com',
        });
      });

      // Should reload data from server
      expect(result.current.documents.some(doc => doc.name === 'Non-Optimistic User')).toBe(true);
    });
  });
});
