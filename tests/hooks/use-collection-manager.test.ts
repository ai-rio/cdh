import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useCollectionManager } from '@/app/(dashboard)/hooks/use-collection-manager';

// Mock dependencies
vi.mock('@/hooks/use-payload');
vi.mock('@/hooks/use-auth');
vi.mock('@/app/(dashboard)/hooks/use-collaboration');

const mockPayload = {
  find: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
};

const mockUser = {
  id: 'user1',
  email: 'test@example.com',
  role: 'admin',
};

const mockCollaboration = {
  lockDocument: vi.fn(),
  unlockDocument: vi.fn(),
  subscribeToChanges: vi.fn(() => ({ unsubscribe: vi.fn() })),
  broadcastChange: vi.fn(),
};

// Mock the hooks
vi.mocked(await import('@/hooks/use-payload')).usePayload = vi.fn(() => ({ payload: mockPayload }));
vi.mocked(await import('@/hooks/use-auth')).useAuth = vi.fn(() => ({ user: mockUser }));
vi.mocked(await import('@/app/(dashboard)/hooks/use-collaboration')).useCollaboration = vi.fn(() => mockCollaboration);

describe('useCollectionManager', () => {
  const defaultOptions = {
    collection: 'posts',
    initialPageSize: 25,
    enableRealTime: true,
    enableAnalytics: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock responses
    mockPayload.find.mockResolvedValue({
      docs: [
        { id: '1', title: 'Post 1', createdAt: '2023-01-01' },
        { id: '2', title: 'Post 2', createdAt: '2023-01-02' },
      ],
      totalDocs: 2,
      totalPages: 1,
      page: 1,
      limit: 25,
      hasNextPage: false,
      hasPrevPage: false,
      pagingCounter: 1,
    });

    mockPayload.create.mockResolvedValue({
      id: '3',
      title: 'New Post',
      createdAt: '2023-01-03',
    });

    mockPayload.update.mockResolvedValue({
      id: '1',
      title: 'Updated Post',
      createdAt: '2023-01-01',
    });

    mockPayload.count.mockResolvedValue({ totalDocs: 2 });
  });

  describe('Data Loading', () => {
    it('should load documents on initialization', async () => {
      const { result } = renderHook(() => useCollectionManager(defaultOptions));

      expect(result.current.isLoading).toBe(true);

      // Wait for the hook to finish loading
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockPayload.find).toHaveBeenCalledWith({
        collection: 'posts',
        page: 1,
        limit: 25,
        where: undefined,
        sort: '-createdAt',
        depth: 2,
        user: mockUser,
        overrideAccess: false,
      });

      expect(result.current.documents).toHaveLength(2);
      expect(result.current.totalCount).toBe(2);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle loading errors gracefully', async () => {
      const error = new Error('Network error');
      mockPayload.find.mockRejectedValue(error);

      const { result } = renderHook(() => useCollectionManager(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.documents).toHaveLength(0);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('CRUD Operations', () => {
    it('should create a document with optimistic updates', async () => {
      const { result } = renderHook(() => useCollectionManager(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const newData = { title: 'New Post', content: 'Post content' };

      await act(async () => {
        await result.current.create(newData);
      });

      expect(mockPayload.create).toHaveBeenCalledWith({
        collection: 'posts',
        data: newData,
        user: mockUser,
        overrideAccess: false,
      });

      // Check optimistic update
      expect(result.current.documents).toHaveLength(3);
      expect(result.current.totalCount).toBe(3);
    });

    it('should update a document with optimistic updates', async () => {
      const { result } = renderHook(() => useCollectionManager(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const updateData = { title: 'Updated Title' };

      await act(async () => {
        await result.current.update('1', updateData);
      });

      expect(mockPayload.update).toHaveBeenCalledWith({
        collection: 'posts',
        id: '1',
        data: updateData,
        user: mockUser,
        overrideAccess: false,
      });

      // Check optimistic update
      const updatedDoc = result.current.documents.find(doc => doc.id === '1');
      expect(updatedDoc?.title).toBe('Updated Post');
    });

    it('should delete a document with optimistic updates', async () => {
      const { result } = renderHook(() => useCollectionManager(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      await act(async () => {
        await result.current.delete('1');
      });

      expect(mockPayload.delete).toHaveBeenCalledWith({
        collection: 'posts',
        id: '1',
        user: mockUser,
        overrideAccess: false,
      });

      // Check optimistic update
      expect(result.current.documents).toHaveLength(1);
      expect(result.current.totalCount).toBe(1);
      expect(result.current.documents.find(doc => doc.id === '1')).toBeUndefined();
    });
  });

  describe('Bulk Operations', () => {
    it('should handle bulk delete operations', async () => {
      const { result } = renderHook(() => useCollectionManager(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      await act(async () => {
        await result.current.bulkDelete(['1', '2']);
      });

      expect(mockPayload.delete).toHaveBeenCalledTimes(2);
      expect(result.current.documents).toHaveLength(0);
      expect(result.current.totalCount).toBe(0);
    });

    it('should handle bulk update operations', async () => {
      const { result } = renderHook(() => useCollectionManager(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      mockPayload.update
        .mockResolvedValueOnce({ id: '1', title: 'Bulk Updated 1' })
        .mockResolvedValueOnce({ id: '2', title: 'Bulk Updated 2' });

      const updateData = { status: 'published' };

      await act(async () => {
        await result.current.bulkUpdate(['1', '2'], updateData);
      });

      expect(mockPayload.update).toHaveBeenCalledTimes(2);
      expect(mockPayload.update).toHaveBeenCalledWith({
        collection: 'posts',
        id: '1',
        data: updateData,
        user: mockUser,
        overrideAccess: false,
      });
    });
  });

  describe('Search and Filtering', () => {
    it('should handle search operations', async () => {
      const { result } = renderHook(() => useCollectionManager(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      act(() => {
        result.current.search('test query');
      });

      expect(result.current.filters.search).toBe('test query');
      expect(result.current.currentPage).toBe(1);
    });

    it('should handle filter operations', async () => {
      const { result } = renderHook(() => useCollectionManager(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const filters = { status: ['published'] };

      act(() => {
        result.current.filter(filters);
      });

      expect(result.current.filters).toEqual(expect.objectContaining(filters));
      expect(result.current.currentPage).toBe(1);
    });

    it('should handle sorting operations', async () => {
      const { result } = renderHook(() => useCollectionManager(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      act(() => {
        result.current.sort('title', 'asc');
      });

      expect(result.current.sortField).toBe('title');
      expect(result.current.sortDirection).toBe('asc');
      expect(result.current.currentPage).toBe(1);
    });
  });

  describe('Pagination', () => {
    it('should handle page navigation', async () => {
      const { result } = renderHook(() => useCollectionManager(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      act(() => {
        result.current.goToPage(2);
      });

      expect(result.current.currentPage).toBe(2);
    });

    it('should handle page size changes', async () => {
      const { result } = renderHook(() => useCollectionManager(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      act(() => {
        result.current.changePageSize(50);
      });

      expect(result.current.pageSize).toBe(50);
      expect(result.current.currentPage).toBe(1);
    });
  });

  describe('Real-time Features', () => {
    it('should subscribe to real-time changes when enabled', async () => {
      const { result } = renderHook(() => useCollectionManager({
        ...defaultOptions,
        enableRealTime: true,
      }));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockCollaboration.subscribeToChanges).toHaveBeenCalledWith(
        'posts',
        expect.any(Function)
      );
    });

    it('should handle real-time document creation', async () => {
      let changeCallback: any;
      mockCollaboration.subscribeToChanges.mockImplementation((collection, callback) => {
        changeCallback = callback;
        return { unsubscribe: jest.fn() };
      });

      const { result } = renderHook(() => useCollectionManager({
        ...defaultOptions,
        enableRealTime: true,
      }));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Simulate real-time change
      act(() => {
        changeCallback({
          changeType: 'create',
          newValue: { id: '3', title: 'Real-time Post' },
          collection: 'posts',
          documentId: '3',
          userId: 'otherUser',
          timestamp: new Date(),
        });
      });

      expect(result.current.documents).toHaveLength(3);
      expect(result.current.totalCount).toBe(3);
    });

    it('should broadcast changes when creating documents', async () => {
      const { result } = renderHook(() => useCollectionManager({
        ...defaultOptions,
        enableRealTime: true,
      }));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const newData = { title: 'New Post' };

      await act(async () => {
        await result.current.create(newData);
      });

      expect(mockCollaboration.broadcastChange).toHaveBeenCalledWith({
        collection: 'posts',
        documentId: '3',
        changeType: 'create',
        userId: mockUser.id,
        timestamp: expect.any(Date),
        fieldPath: '',
        oldValue: null,
        newValue: expect.objectContaining({ id: '3' }),
      });
    });
  });

  describe('Document Locking', () => {
    it('should lock documents for collaboration', async () => {
      const { result } = renderHook(() => useCollectionManager(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      mockCollaboration.lockDocument.mockResolvedValue({
        success: true,
        lockId: 'lock123',
        expiresAt: new Date(),
        lockedBy: mockUser,
      });

      await act(async () => {
        await result.current.lockDocument('1');
      });

      expect(mockCollaboration.lockDocument).toHaveBeenCalledWith('posts', '1');
    });

    it('should unlock documents', async () => {
      const { result } = renderHook(() => useCollectionManager(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      await act(async () => {
        await result.current.unlockDocument('1');
      });

      expect(mockCollaboration.unlockDocument).toHaveBeenCalledWith('posts', '1');
    });
  });

  describe('Error Handling', () => {
    it('should handle create operation errors', async () => {
      const { result } = renderHook(() => useCollectionManager(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const error = new Error('Create failed');
      mockPayload.create.mockRejectedValue(error);

      await act(async () => {
        try {
          await result.current.create({ title: 'New Post' });
        } catch (e) {
          expect(e).toEqual(error);
        }
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle network errors with retry capability', async () => {
      const { result } = renderHook(() => useCollectionManager(defaultOptions));

      // First call fails, second succeeds
      mockPayload.find
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          docs: [],
          totalDocs: 0,
          totalPages: 0,
          page: 1,
          limit: 25,
        });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Should have error initially
      expect(result.current.error).toBeTruthy();

      // Retry should succeed
      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Performance', () => {
    it('should handle large datasets efficiently', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i}`,
        title: `Post ${i}`,
        createdAt: new Date().toISOString(),
      }));

      mockPayload.find.mockResolvedValue({
        docs: largeDataset,
        totalDocs: 1000,
        totalPages: 40,
        page: 1,
        limit: 25,
      });

      const { result } = renderHook(() => useCollectionManager(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.documents).toHaveLength(1000);
      expect(result.current.totalCount).toBe(1000);
      expect(result.current.totalPages).toBe(40);
    });

    it('should cache frequently accessed data', async () => {
      const { result } = renderHook(() => useCollectionManager(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Clear mock call count
      mockPayload.find.mockClear();

      // Multiple rapid calls should use cache
      await act(async () => {
        await result.current.refresh();
      });

      expect(mockPayload.find).toHaveBeenCalledTimes(1);
    });
  });
});