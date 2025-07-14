import { renderHook, act } from '@testing-library/react';
import { useCollaboration } from '@/app/(dashboard)/hooks/use-collaboration';
import type { 
  DocumentChange, 
  UserPresence, 
  LockResult, 
  ConflictResolution 
} from '@/types/collection-management';

// Mock WebSocket
const mockWebSocket = {
  send: jest.fn(),
  close: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  readyState: WebSocket.OPEN,
};

// Mock WebSocket constructor
global.WebSocket = jest.fn(() => mockWebSocket) as any;

// Mock dependencies
jest.mock('@/hooks/use-auth');
jest.mock('@/lib/websocket-client');

const mockUser = {
  id: 'user1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'admin',
};

const mockCollaborationService = {
  lockDocument: jest.fn(),
  unlockDocument: jest.fn(),
  getLockStatus: jest.fn(),
  extendLock: jest.fn(),
  subscribeToChanges: jest.fn(),
  broadcastChange: jest.fn(),
  subscribeToPresence: jest.fn(),
  updatePresence: jest.fn(),
  getActiveUsers: jest.fn(),
  resolveConflict: jest.fn(),
  getChangeHistory: jest.fn(),
  createSnapshot: jest.fn(),
  restoreSnapshot: jest.fn(),
};

// Mock the hooks
require('@/hooks/use-auth').useAuth = jest.fn(() => ({ user: mockUser }));
require('@/lib/websocket-client').useWebSocket = jest.fn(() => ({
  socket: mockWebSocket,
  connected: true,
  connect: jest.fn(),
  disconnect: jest.fn(),
}));

describe('useCollaboration', () => {
  const defaultOptions = {
    collection: 'posts',
    documentId: 'doc123',
    enableRealTime: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock responses
    mockCollaborationService.lockDocument.mockResolvedValue({
      success: true,
      lockId: 'lock123',
      expiresAt: new Date(Date.now() + 300000), // 5 minutes
      lockedBy: mockUser,
    });

    mockCollaborationService.unlockDocument.mockResolvedValue({
      success: true,
    });

    mockCollaborationService.getLockStatus.mockResolvedValue({
      isLocked: false,
      lockId: null,
      lockedBy: null,
      expiresAt: null,
    });

    mockCollaborationService.subscribeToChanges.mockReturnValue({
      unsubscribe: jest.fn(),
    });

    mockCollaborationService.subscribeToPresence.mockReturnValue({
      unsubscribe: jest.fn(),
    });

    mockCollaborationService.getActiveUsers.mockResolvedValue([]);
  });

  describe('Document Locking', () => {
    it('should lock a document successfully', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const lockResult = await act(async () => {
        return await result.current.lockDocument('posts', 'doc123');
      });

      expect(mockCollaborationService.lockDocument).toHaveBeenCalledWith('posts', 'doc123');
      expect(lockResult.success).toBe(true);
      expect(lockResult.lockId).toBe('lock123');
    });

    it('should handle lock acquisition failure', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      const lockError = {
        success: false,
        error: 'Document already locked',
        lockedBy: { id: 'user2', name: 'Other User' },
      };

      mockCollaborationService.lockDocument.mockResolvedValue(lockError);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const lockResult = await act(async () => {
        return await result.current.lockDocument('posts', 'doc123');
      });

      expect(lockResult.success).toBe(false);
      expect(lockResult.error).toBe('Document already locked');
    });

    it('should unlock a document successfully', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      await act(async () => {
        await result.current.unlockDocument('posts', 'doc123');
      });

      expect(mockCollaborationService.unlockDocument).toHaveBeenCalledWith('posts', 'doc123');
    });

    it('should get lock status correctly', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      const lockStatus = {
        isLocked: true,
        lockId: 'lock123',
        lockedBy: mockUser,
        expiresAt: new Date(),
      };

      mockCollaborationService.getLockStatus.mockResolvedValue(lockStatus);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const status = await act(async () => {
        return await result.current.getLockStatus('posts', 'doc123');
      });

      expect(status).toEqual(lockStatus);
    });

    it('should extend lock automatically before expiration', async () => {
      jest.useFakeTimers();

      const { result } = renderHook(() => useCollaboration(defaultOptions));

      // Mock a lock that expires soon
      const lockResult: LockResult = {
        success: true,
        lockId: 'lock123',
        expiresAt: new Date(Date.now() + 60000), // 1 minute
        lockedBy: mockUser,
      };

      mockCollaborationService.lockDocument.mockResolvedValue(lockResult);
      mockCollaborationService.extendLock.mockResolvedValue({ success: true });

      await act(async () => {
        await result.current.lockDocument('posts', 'doc123');
      });

      // Fast forward to trigger lock extension
      act(() => {
        jest.advanceTimersByTime(45000); // 45 seconds
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockCollaborationService.extendLock).toHaveBeenCalledWith('posts', 'doc123');

      jest.useRealTimers();
    });
  });

  describe('Real-time Changes', () => {
    it('should subscribe to real-time changes', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const changeCallback = jest.fn();

      act(() => {
        result.current.subscribeToChanges('posts', changeCallback);
      });

      expect(mockCollaborationService.subscribeToChanges).toHaveBeenCalledWith(
        'posts',
        changeCallback
      );
    });

    it('should broadcast document changes', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const change: DocumentChange = {
        collection: 'posts',
        documentId: 'doc123',
        fieldPath: 'title',
        oldValue: 'Old Title',
        newValue: 'New Title',
        userId: mockUser.id,
        timestamp: new Date(),
        changeType: 'update',
      };

      act(() => {
        result.current.broadcastChange(change);
      });

      expect(mockCollaborationService.broadcastChange).toHaveBeenCalledWith(change);
    });

    it('should handle incoming real-time changes', async () => {
      let changeCallback: (change: DocumentChange) => void;
      
      mockCollaborationService.subscribeToChanges.mockImplementation((collection, callback) => {
        changeCallback = callback;
        return { unsubscribe: jest.fn() };
      });

      const { result } = renderHook(() => useCollaboration(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const incomingChange: DocumentChange = {
        collection: 'posts',
        documentId: 'doc123',
        fieldPath: 'content',
        oldValue: 'Old content',
        newValue: 'New content',
        userId: 'otherUser',
        timestamp: new Date(),
        changeType: 'update',
      };

      // Simulate incoming change
      act(() => {
        changeCallback!(incomingChange);
      });

      expect(result.current.recentChanges).toContainEqual(incomingChange);
    });

    it('should batch rapid changes to prevent spam', async () => {
      jest.useFakeTimers();

      const { result } = renderHook(() => useCollaboration(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const changes = [
        { fieldPath: 'title', newValue: 'Title 1' },
        { fieldPath: 'title', newValue: 'Title 2' },
        { fieldPath: 'title', newValue: 'Title 3' },
      ];

      // Send multiple rapid changes
      changes.forEach(change => {
        act(() => {
          result.current.broadcastChange({
            collection: 'posts',
            documentId: 'doc123',
            fieldPath: change.fieldPath,
            oldValue: '',
            newValue: change.newValue,
            userId: mockUser.id,
            timestamp: new Date(),
            changeType: 'update',
          });
        });
      });

      // Should only broadcast once after debounce
      expect(mockCollaborationService.broadcastChange).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });
  });

  describe('User Presence', () => {
    it('should subscribe to user presence updates', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const presenceCallback = jest.fn();

      act(() => {
        result.current.subscribeToPresence(presenceCallback);
      });

      expect(mockCollaborationService.subscribeToPresence).toHaveBeenCalledWith(presenceCallback);
    });

    it('should update user presence', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const presence: UserPresence = {
        userId: mockUser.id,
        collection: 'posts',
        documentId: 'doc123',
        fieldPath: 'title',
        cursor: { line: 1, character: 10 },
        lastSeen: new Date(),
      };

      act(() => {
        result.current.updatePresence(presence);
      });

      expect(mockCollaborationService.updatePresence).toHaveBeenCalledWith(presence);
    });

    it('should get active users for a document', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      const activeUsers = [
        { id: 'user1', name: 'User 1', cursor: { line: 1, character: 0 } },
        { id: 'user2', name: 'User 2', cursor: { line: 5, character: 10 } },
      ];

      mockCollaborationService.getActiveUsers.mockResolvedValue(activeUsers);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const users = await act(async () => {
        return await result.current.getActiveUsers('posts', 'doc123');
      });

      expect(users).toEqual(activeUsers);
    });

    it('should automatically update presence on cursor movement', async () => {
      jest.useFakeTimers();

      const { result } = renderHook(() => useCollaboration(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Simulate cursor movement
      act(() => {
        result.current.updateCursorPosition('title', { line: 1, character: 5 });
      });

      // Should debounce presence updates
      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(mockCollaborationService.updatePresence).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUser.id,
          fieldPath: 'title',
          cursor: { line: 1, character: 5 },
        })
      );

      jest.useRealTimers();
    });
  });

  describe('Conflict Resolution', () => {
    it('should detect conflicting changes', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const localChange: DocumentChange = {
        collection: 'posts',
        documentId: 'doc123',
        fieldPath: 'title',
        oldValue: 'Original',
        newValue: 'Local Change',
        userId: mockUser.id,
        timestamp: new Date(),
        changeType: 'update',
      };

      const remoteChange: DocumentChange = {
        collection: 'posts',
        documentId: 'doc123',
        fieldPath: 'title',
        oldValue: 'Original',
        newValue: 'Remote Change',
        userId: 'otherUser',
        timestamp: new Date(Date.now() + 1000), // Slightly later
        changeType: 'update',
      };

      const conflict = result.current.detectConflict(localChange, remoteChange);

      expect(conflict).toBeTruthy();
      expect(conflict?.fieldPath).toBe('title');
      expect(conflict?.localValue).toBe('Local Change');
      expect(conflict?.remoteValue).toBe('Remote Change');
    });

    it('should resolve conflicts using different strategies', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      const mockConflict = {
        fieldPath: 'title',
        localValue: 'Local Change',
        remoteValue: 'Remote Change',
        localTimestamp: new Date(),
        remoteTimestamp: new Date(Date.now() + 1000),
      };

      const resolution: ConflictResolution = {
        strategy: 'useRemote',
        resolvedValue: 'Remote Change',
        mergedBy: mockUser.id,
        timestamp: new Date(),
      };

      mockCollaborationService.resolveConflict.mockResolvedValue(resolution);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const result_resolution = await act(async () => {
        return await result.current.resolveConflict(mockConflict);
      });

      expect(result_resolution).toEqual(resolution);
      expect(mockCollaborationService.resolveConflict).toHaveBeenCalledWith(mockConflict);
    });

    it('should handle automatic conflict resolution for non-conflicting fields', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const change1: DocumentChange = {
        collection: 'posts',
        documentId: 'doc123',
        fieldPath: 'title',
        oldValue: 'Old Title',
        newValue: 'New Title',
        userId: mockUser.id,
        timestamp: new Date(),
        changeType: 'update',
      };

      const change2: DocumentChange = {
        collection: 'posts',
        documentId: 'doc123',
        fieldPath: 'content', // Different field
        oldValue: 'Old Content',
        newValue: 'New Content',
        userId: 'otherUser',
        timestamp: new Date(),
        changeType: 'update',
      };

      const conflict = result.current.detectConflict(change1, change2);

      expect(conflict).toBeNull(); // No conflict for different fields
    });
  });

  describe('Change History', () => {
    it('should get change history for a document', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      const mockHistory = [
        {
          id: 'change1',
          fieldPath: 'title',
          oldValue: 'Original',
          newValue: 'Updated Title',
          userId: mockUser.id,
          timestamp: new Date(),
          changeType: 'update' as const,
        },
        {
          id: 'change2',
          fieldPath: 'content',
          oldValue: null,
          newValue: 'New content',
          userId: mockUser.id,
          timestamp: new Date(),
          changeType: 'create' as const,
        },
      ];

      mockCollaborationService.getChangeHistory.mockResolvedValue(mockHistory);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const history = await act(async () => {
        return await result.current.getChangeHistory('posts', 'doc123');
      });

      expect(history).toEqual(mockHistory);
    });

    it('should create document snapshots', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      const mockSnapshot = {
        id: 'snapshot123',
        documentId: 'doc123',
        data: { title: 'Test', content: 'Content' },
        createdBy: mockUser.id,
        createdAt: new Date(),
      };

      mockCollaborationService.createSnapshot.mockResolvedValue(mockSnapshot);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const snapshot = await act(async () => {
        return await result.current.createSnapshot('posts', 'doc123');
      });

      expect(snapshot).toEqual(mockSnapshot);
    });

    it('should restore from snapshots', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      mockCollaborationService.restoreSnapshot.mockResolvedValue({
        success: true,
        restoredData: { title: 'Restored Title' },
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      await act(async () => {
        await result.current.restoreSnapshot('snapshot123');
      });

      expect(mockCollaborationService.restoreSnapshot).toHaveBeenCalledWith('snapshot123');
    });
  });

  describe('Connection Management', () => {
    it('should handle WebSocket disconnection gracefully', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Simulate connection loss
      act(() => {
        Object.defineProperty(mockWebSocket, 'readyState', {
          value: WebSocket.CLOSED,
        });
      });

      expect(result.current.connectionStatus).toBe('disconnected');
    });

    it('should attempt to reconnect after connection loss', async () => {
      jest.useFakeTimers();

      const { result } = renderHook(() => useCollaboration(defaultOptions));

      const mockConnect = jest.fn();
      require('@/lib/websocket-client').useWebSocket.mockReturnValue({
        socket: mockWebSocket,
        connected: false,
        connect: mockConnect,
        disconnect: jest.fn(),
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Trigger reconnection attempt
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(mockConnect).toHaveBeenCalled();

      jest.useRealTimers();
    });

    it('should queue changes when offline and sync when reconnected', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      // Start offline
      require('@/lib/websocket-client').useWebSocket.mockReturnValue({
        socket: null,
        connected: false,
        connect: jest.fn(),
        disconnect: jest.fn(),
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const change: DocumentChange = {
        collection: 'posts',
        documentId: 'doc123',
        fieldPath: 'title',
        oldValue: 'Old',
        newValue: 'New',
        userId: mockUser.id,
        timestamp: new Date(),
        changeType: 'update',
      };

      // Broadcast while offline - should queue
      act(() => {
        result.current.broadcastChange(change);
      });

      expect(result.current.queuedChanges).toHaveLength(1);

      // Come back online
      require('@/lib/websocket-client').useWebSocket.mockReturnValue({
        socket: mockWebSocket,
        connected: true,
        connect: jest.fn(),
        disconnect: jest.fn(),
      });

      // Should sync queued changes
      await act(async () => {
        result.current.syncQueuedChanges();
      });

      expect(mockCollaborationService.broadcastChange).toHaveBeenCalledWith(change);
      expect(result.current.queuedChanges).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle lock operation errors', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      const error = new Error('Lock service unavailable');
      mockCollaborationService.lockDocument.mockRejectedValue(error);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      await act(async () => {
        try {
          await result.current.lockDocument('posts', 'doc123');
        } catch (e) {
          expect(e).toEqual(error);
        }
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle broadcast errors gracefully', async () => {
      const { result } = renderHook(() => useCollaboration(defaultOptions));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      mockCollaborationService.broadcastChange.mockImplementation(() => {
        throw new Error('Broadcast failed');
      });

      const change: DocumentChange = {
        collection: 'posts',
        documentId: 'doc123',
        fieldPath: 'title',
        oldValue: 'Old',
        newValue: 'New',
        userId: mockUser.id,
        timestamp: new Date(),
        changeType: 'update',
      };

      act(() => {
        result.current.broadcastChange(change);
      });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to broadcast change:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});