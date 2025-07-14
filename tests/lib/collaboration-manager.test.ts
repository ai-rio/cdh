import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { CollaborationManager } from '@/lib/collaboration-manager';
import type { 
  CollaborationSession,
  UserPresence,
  DocumentLock,
  ChangeEvent,
  Comment,
  User
} from '@/types/collection-management';

// Mock WebSocket for testing
class MockWebSocket {
  readyState = WebSocket.OPEN;
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  constructor(public url: string) {
    setTimeout(() => {
      if (this.onopen) {
        this.onopen(new Event('open'));
      }
    }, 10);
  }

  send(data: string) {
    // Echo messages back for testing
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage({
          data,
          type: 'message'
        } as MessageEvent);
      }
    }, 10);
  }

  close() {
    this.readyState = WebSocket.CLOSED;
    setTimeout(() => {
      if (this.onclose) {
        this.onclose({
          code: 1000,
          reason: 'Normal closure'
        } as CloseEvent);
      }
    }, 10);
  }
}

// @ts-ignore
global.WebSocket = MockWebSocket;

const mockPayload = {
  find: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn()
};

describe('CollaborationManager - TDD Implementation', () => {
  let collaborationManager: CollaborationManager;
  let mockUser: User;

  beforeEach(() => {
    collaborationManager = new CollaborationManager(mockPayload as any);
    mockUser = { 
      id: 'user1', 
      email: 'test@example.com',
      name: 'Test User'
    } as User;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Session Management', () => {
    it('should create collaboration session successfully', async () => {
      const session = await collaborationManager.createSession({
        documentId: 'doc1',
        collection: 'posts',
        user: mockUser
      });

      expect(session).toMatchObject({
        id: expect.any(String),
        documentId: 'doc1',
        collection: 'posts',
        participants: expect.arrayContaining([
          expect.objectContaining({ userId: 'user1' })
        ]),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        isActive: true
      });
    });

    it('should join existing collaboration session', async () => {
      // Create initial session
      const session = await collaborationManager.createSession({
        documentId: 'doc1',
        collection: 'posts',
        user: mockUser
      });

      const anotherUser = { 
        id: 'user2', 
        email: 'user2@example.com',
        name: 'User Two'
      } as User;

      // Join session
      const updatedSession = await collaborationManager.joinSession(session.id, anotherUser);

      expect(updatedSession.participants).toHaveLength(2);
      expect(updatedSession.participants.some(p => p.userId === 'user2')).toBe(true);
    });

    it('should leave collaboration session', async () => {
      const session = await collaborationManager.createSession({
        documentId: 'doc1',
        collection: 'posts',
        user: mockUser
      });

      const updatedSession = await collaborationManager.leaveSession(session.id, 'user1');

      expect(updatedSession.participants).toHaveLength(0);
      expect(updatedSession.isActive).toBe(false);
    });

    it('should get active sessions for document', async () => {
      await collaborationManager.createSession({
        documentId: 'doc1',
        collection: 'posts',
        user: mockUser
      });

      const sessions = await collaborationManager.getActiveSessions('doc1');

      expect(sessions).toHaveLength(1);
      expect(sessions[0].documentId).toBe('doc1');
      expect(sessions[0].isActive).toBe(true);
    });

    it('should handle session creation errors', async () => {
      // Test with invalid document ID
      await expect(
        collaborationManager.createSession({
          documentId: '',
          collection: 'posts',
          user: mockUser
        })
      ).rejects.toThrow('Document ID is required');
    });

    it('should handle joining non-existent session', async () => {
      await expect(
        collaborationManager.joinSession('non-existent', mockUser)
      ).rejects.toThrow('Session not found');
    });
  });

  describe('User Presence', () => {
    it('should update user presence in session', async () => {
      const session = await collaborationManager.createSession({
        documentId: 'doc1',
        collection: 'posts',
        user: mockUser
      });

      const presence: UserPresence = {
        userId: 'user1',
        cursor: { line: 10, column: 5 },
        selection: { start: { line: 10, column: 5 }, end: { line: 10, column: 15 } },
        isActive: true,
        lastSeen: new Date()
      };

      await collaborationManager.updatePresence(session.id, presence);

      const updatedSession = await collaborationManager.getSession(session.id);
      const participant = updatedSession.participants.find(p => p.userId === 'user1');
      
      expect(participant?.presence).toMatchObject({
        cursor: { line: 10, column: 5 },
        selection: expect.any(Object),
        isActive: true
      });
    });

    it('should get all user presences for session', async () => {
      const session = await collaborationManager.createSession({
        documentId: 'doc1',
        collection: 'posts',
        user: mockUser
      });

      const presences = await collaborationManager.getPresences(session.id);

      expect(presences).toHaveLength(1);
      expect(presences[0].userId).toBe('user1');
    });

    it('should handle presence updates for non-participant users', async () => {
      const session = await collaborationManager.createSession({
        documentId: 'doc1',
        collection: 'posts',
        user: mockUser
      });

      const presence: UserPresence = {
        userId: 'user2', // Not a participant
        cursor: { line: 10, column: 5 },
        isActive: true,
        lastSeen: new Date()
      };

      await expect(
        collaborationManager.updatePresence(session.id, presence)
      ).rejects.toThrow('User is not a participant in this session');
    });

    it('should clean up inactive presences', async () => {
      const session = await collaborationManager.createSession({
        documentId: 'doc1',
        collection: 'posts',
        user: mockUser
      });

      // Set user as inactive
      const oldPresence: UserPresence = {
        userId: 'user1',
        cursor: { line: 10, column: 5 },
        isActive: false,
        lastSeen: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
      };

      await collaborationManager.updatePresence(session.id, oldPresence);
      await collaborationManager.cleanupInactivePresences(session.id);

      const presences = await collaborationManager.getPresences(session.id);
      expect(presences.every(p => p.isActive)).toBe(true);
    });
  });

  describe('Document Locking', () => {
    it('should acquire document lock successfully', async () => {
      const lock = await collaborationManager.acquireLock({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        lockType: 'exclusive'
      });

      expect(lock).toMatchObject({
        id: expect.any(String),
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        lockType: 'exclusive',
        acquiredAt: expect.any(Date),
        isActive: true
      });
    });

    it('should prevent conflicting exclusive locks', async () => {
      // First user acquires lock
      await collaborationManager.acquireLock({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        lockType: 'exclusive'
      });

      // Second user tries to acquire conflicting lock
      await expect(
        collaborationManager.acquireLock({
          documentId: 'doc1',
          collection: 'posts',
          userId: 'user2',
          lockType: 'exclusive'
        })
      ).rejects.toThrow('Document is already locked exclusively');
    });

    it('should allow multiple shared locks', async () => {
      const lock1 = await collaborationManager.acquireLock({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        lockType: 'shared'
      });

      const lock2 = await collaborationManager.acquireLock({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user2',
        lockType: 'shared'
      });

      expect(lock1.isActive).toBe(true);
      expect(lock2.isActive).toBe(true);
    });

    it('should release document lock', async () => {
      const lock = await collaborationManager.acquireLock({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        lockType: 'exclusive'
      });

      await collaborationManager.releaseLock(lock.id);

      const activeLocks = await collaborationManager.getActiveLocks('doc1');
      expect(activeLocks).toHaveLength(0);
    });

    it('should auto-expire locks after timeout', async () => {
      const lock = await collaborationManager.acquireLock({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        lockType: 'exclusive',
        expiresAt: new Date(Date.now() + 1000) // 1 second
      });

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));
      await collaborationManager.cleanupExpiredLocks();

      const activeLocks = await collaborationManager.getActiveLocks('doc1');
      expect(activeLocks).toHaveLength(0);
    });

    it('should get active locks for document', async () => {
      await collaborationManager.acquireLock({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        lockType: 'shared'
      });

      await collaborationManager.acquireLock({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user2',
        lockType: 'shared'
      });

      const locks = await collaborationManager.getActiveLocks('doc1');
      expect(locks).toHaveLength(2);
      expect(locks.every(lock => lock.lockType === 'shared')).toBe(true);
    });
  });

  describe('Change History', () => {
    it('should track document changes', async () => {
      const change: ChangeEvent = {
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        changeType: 'update',
        field: 'title',
        oldValue: 'Old Title',
        newValue: 'New Title',
        timestamp: new Date()
      };

      await collaborationManager.recordChange(change);

      const history = await collaborationManager.getChangeHistory('doc1');
      expect(history).toHaveLength(1);
      expect(history[0]).toMatchObject({
        documentId: 'doc1',
        userId: 'user1',
        changeType: 'update',
        field: 'title'
      });
    });

    it('should get change history with pagination', async () => {
      // Create multiple changes
      for (let i = 0; i < 15; i++) {
        await collaborationManager.recordChange({
          documentId: 'doc1',
          collection: 'posts',
          userId: 'user1',
          changeType: 'update',
          field: 'content',
          oldValue: `Content ${i}`,
          newValue: `Content ${i + 1}`,
          timestamp: new Date()
        });
      }

      const page1 = await collaborationManager.getChangeHistory('doc1', { limit: 10, offset: 0 });
      const page2 = await collaborationManager.getChangeHistory('doc1', { limit: 10, offset: 10 });

      expect(page1).toHaveLength(10);
      expect(page2).toHaveLength(5);
    });

    it('should filter change history by user', async () => {
      await collaborationManager.recordChange({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        changeType: 'update',
        field: 'title',
        oldValue: 'Old',
        newValue: 'New',
        timestamp: new Date()
      });

      await collaborationManager.recordChange({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user2',
        changeType: 'update',
        field: 'content',
        oldValue: 'Old Content',
        newValue: 'New Content',
        timestamp: new Date()
      });

      const user1Changes = await collaborationManager.getChangeHistory('doc1', { userId: 'user1' });
      expect(user1Changes).toHaveLength(1);
      expect(user1Changes[0].userId).toBe('user1');
    });

    it('should filter change history by date range', async () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      await collaborationManager.recordChange({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        changeType: 'update',
        field: 'title',
        oldValue: 'Old',
        newValue: 'New',
        timestamp: yesterday
      });

      await collaborationManager.recordChange({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        changeType: 'update',
        field: 'content',
        oldValue: 'Old Content',
        newValue: 'New Content',
        timestamp: now
      });

      const todayChanges = await collaborationManager.getChangeHistory('doc1', {
        fromDate: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        toDate: now
      });

      expect(todayChanges).toHaveLength(1);
    });
  });

  describe('Comments System', () => {
    it('should add comment to document', async () => {
      const comment = await collaborationManager.addComment({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        content: 'This needs revision',
        field: 'title',
        position: { line: 5, column: 10 }
      });

      expect(comment).toMatchObject({
        id: expect.any(String),
        documentId: 'doc1',
        userId: 'user1',
        content: 'This needs revision',
        field: 'title',
        createdAt: expect.any(Date),
        isResolved: false
      });
    });

    it('should get comments for document', async () => {
      await collaborationManager.addComment({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        content: 'Comment 1',
        field: 'title'
      });

      await collaborationManager.addComment({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user2',
        content: 'Comment 2',
        field: 'content'
      });

      const comments = await collaborationManager.getComments('doc1');
      expect(comments).toHaveLength(2);
    });

    it('should reply to existing comment', async () => {
      const parentComment = await collaborationManager.addComment({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        content: 'Parent comment',
        field: 'title'
      });

      const reply = await collaborationManager.addComment({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user2',
        content: 'Reply to comment',
        field: 'title',
        parentId: parentComment.id
      });

      expect(reply.parentId).toBe(parentComment.id);
    });

    it('should resolve comment', async () => {
      const comment = await collaborationManager.addComment({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        content: 'Issue found',
        field: 'title'
      });

      await collaborationManager.resolveComment(comment.id, 'user1');

      const resolvedComment = await collaborationManager.getComment(comment.id);
      expect(resolvedComment.isResolved).toBe(true);
      expect(resolvedComment.resolvedBy).toBe('user1');
      expect(resolvedComment.resolvedAt).toBeInstanceOf(Date);
    });

    it('should filter comments by field', async () => {
      await collaborationManager.addComment({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        content: 'Title comment',
        field: 'title'
      });

      await collaborationManager.addComment({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        content: 'Content comment',
        field: 'content'
      });

      const titleComments = await collaborationManager.getComments('doc1', { field: 'title' });
      expect(titleComments).toHaveLength(1);
      expect(titleComments[0].field).toBe('title');
    });

    it('should filter comments by resolution status', async () => {
      const comment1 = await collaborationManager.addComment({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        content: 'Unresolved comment',
        field: 'title'
      });

      const comment2 = await collaborationManager.addComment({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        content: 'Resolved comment',
        field: 'content'
      });

      await collaborationManager.resolveComment(comment2.id, 'user1');

      const unresolvedComments = await collaborationManager.getComments('doc1', { isResolved: false });
      expect(unresolvedComments).toHaveLength(1);
      expect(unresolvedComments[0].id).toBe(comment1.id);
    });
  });

  describe('WebSocket Integration', () => {
    it('should establish WebSocket connection', async () => {
      const wsUrl = 'ws://localhost:3000/collaboration';
      const connection = await collaborationManager.connectWebSocket(wsUrl, mockUser);

      expect(connection.readyState).toBe(WebSocket.OPEN);
    });

    it('should broadcast presence updates via WebSocket', async () => {
      const session = await collaborationManager.createSession({
        documentId: 'doc1',
        collection: 'posts',
        user: mockUser
      });

      const wsUrl = 'ws://localhost:3000/collaboration';
      await collaborationManager.connectWebSocket(wsUrl, mockUser);

      let messageCount = 0;
      const messagePromise = new Promise<any>((resolve) => {
        collaborationManager.onMessage((data) => {
          messageCount++;
          if (messageCount === 2) { // Skip auth message, get presence update
            resolve(data);
          }
        });
      });

      const presence: UserPresence = {
        userId: 'user1',
        cursor: { line: 15, column: 8 },
        isActive: true,
        lastSeen: new Date()
      };

      await collaborationManager.broadcastPresence(session.id, presence);

      const message = await messagePromise;
      expect(message.type).toBe('presence_update');
      expect(message.data.cursor).toEqual({ line: 15, column: 8 });
    });

    it('should broadcast document changes via WebSocket', async () => {
      const wsUrl = 'ws://localhost:3000/collaboration';
      await collaborationManager.connectWebSocket(wsUrl, mockUser);

      let messageCount = 0;
      const messagePromise = new Promise<any>((resolve) => {
        collaborationManager.onMessage((data) => {
          messageCount++;
          if (messageCount === 2) { // Skip auth message, get document change
            resolve(data);
          }
        });
      });

      const change: ChangeEvent = {
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        changeType: 'update',
        field: 'title',
        oldValue: 'Old Title',
        newValue: 'New Title',
        timestamp: new Date()
      };

      await collaborationManager.broadcastChange(change);

      const message = await messagePromise;
      expect(message.type).toBe('document_change');
      expect(message.data.field).toBe('title');
    });

    it('should handle WebSocket disconnection gracefully', async () => {
      const wsUrl = 'ws://localhost:3000/collaboration';
      const connection = await collaborationManager.connectWebSocket(wsUrl, mockUser);

      connection.close();

      // Should handle disconnection without throwing errors
      expect(() => {
        collaborationManager.broadcastPresence('session1', {
          userId: 'user1',
          cursor: { line: 1, column: 1 },
          isActive: true,
          lastSeen: new Date()
        });
      }).not.toThrow();
    });

    it('should reconnect WebSocket automatically', async () => {
      const wsUrl = 'ws://localhost:3000/collaboration';
      await collaborationManager.connectWebSocket(wsUrl, mockUser);

      // Simulate connection loss
      collaborationManager.disconnect();

      // Should attempt to reconnect
      const reconnected = await collaborationManager.reconnect();
      expect(reconnected).toBe(true);
    });
  });

  describe('Conflict Resolution', () => {
    it('should detect concurrent edits to same field', async () => {
      const change1: ChangeEvent = {
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        changeType: 'update',
        field: 'title',
        oldValue: 'Original Title',
        newValue: 'User 1 Title',
        timestamp: new Date()
      };

      const change2: ChangeEvent = {
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user2',
        changeType: 'update',
        field: 'title',
        oldValue: 'Original Title',
        newValue: 'User 2 Title',
        timestamp: new Date(Date.now() + 1000)
      };

      await collaborationManager.recordChange(change1);
      
      const conflict = await collaborationManager.detectConflict(change2);
      expect(conflict).toBeTruthy();
      expect(conflict.conflictType).toBe('concurrent_edit');
    });

    it('should resolve conflicts with user choice', async () => {
      const change1: ChangeEvent = {
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        changeType: 'update',
        field: 'title',
        oldValue: 'Original',
        newValue: 'Version A',
        timestamp: new Date()
      };

      const change2: ChangeEvent = {
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user2',
        changeType: 'update',
        field: 'title',
        oldValue: 'Original',
        newValue: 'Version B',
        timestamp: new Date(Date.now() + 1000)
      };

      await collaborationManager.recordChange(change1);
      const conflict = await collaborationManager.detectConflict(change2);

      const resolution = await collaborationManager.resolveConflict(conflict.id, {
        resolutionType: 'keep_latest',
        selectedValue: 'Version B',
        resolvedBy: 'user2'
      });

      expect(resolution.selectedValue).toBe('Version B');
      expect(resolution.isResolved).toBe(true);
    });

    it('should merge compatible changes automatically', async () => {
      const change1: ChangeEvent = {
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        changeType: 'update',
        field: 'title',
        oldValue: 'Original',
        newValue: 'Updated Title',
        timestamp: new Date()
      };

      const change2: ChangeEvent = {
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user2',
        changeType: 'update',
        field: 'content',
        oldValue: 'Original Content',
        newValue: 'Updated Content',
        timestamp: new Date(Date.now() + 1000)
      };

      await collaborationManager.recordChange(change1);
      
      const conflict = await collaborationManager.detectConflict(change2);
      expect(conflict).toBeNull(); // No conflict - different fields
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle multiple concurrent sessions efficiently', async () => {
      const sessions = await Promise.all(
        Array.from({ length: 10 }, (_, i) =>
          collaborationManager.createSession({
            documentId: `doc${i}`,
            collection: 'posts',
            user: { ...mockUser, id: `user${i}` }
          })
        )
      );

      expect(sessions).toHaveLength(10);
      expect(sessions.every(s => s.isActive)).toBe(true);
    });

    it('should cleanup inactive sessions periodically', async () => {
      // Create sessions with old timestamps
      await collaborationManager.createSession({
        documentId: 'doc1',
        collection: 'posts',
        user: mockUser
      });

      // Simulate old session
      const oldSession = await collaborationManager.createSession({
        documentId: 'doc2',
        collection: 'posts',
        user: mockUser
      });

      // Mock old timestamp
      oldSession.updatedAt = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago

      await collaborationManager.cleanupInactiveSessions();

      const activeSessions = await collaborationManager.getAllActiveSessions();
      expect(activeSessions.every(s => 
        Date.now() - s.updatedAt.getTime() < 60 * 60 * 1000
      )).toBe(true);
    });

    it('should batch WebSocket messages for performance', async () => {
      const wsUrl = 'ws://localhost:3000/collaboration';
      await collaborationManager.connectWebSocket(wsUrl, mockUser);

      const messages = Array.from({ length: 50 }, (_, i) => ({
        type: 'presence_update',
        data: { userId: 'user1', cursor: { line: i, column: 0 } }
      }));

      // Should batch messages instead of sending individually
      const batchPromise = await collaborationManager.batchBroadcast(messages);
      expect(batchPromise).toBeTruthy();
    });

    it('should complete collaboration operations within reasonable time', async () => {
      const startTime = Date.now();
      
      await collaborationManager.createSession({
        documentId: 'doc1',
        collection: 'posts',
        user: mockUser
      });

      await collaborationManager.addComment({
        documentId: 'doc1',
        collection: 'posts',
        userId: 'user1',
        content: 'Performance test comment',
        field: 'title'
      });

      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});