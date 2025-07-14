import type { Payload } from 'payload';
import type { 
  CollaborationSession,
  UserPresence,
  DocumentLock,
  ChangeEvent,
  Comment,
  User,
  ConflictResolution,
  DocumentConflict
} from '@/types/collection-management';

export class CollaborationManager {
  private sessions: Map<string, CollaborationSession> = new Map();
  private locks: Map<string, DocumentLock> = new Map();
  private changeHistory: Map<string, ChangeEvent[]> = new Map();
  private comments: Map<string, Comment[]> = new Map();
  private websocket: WebSocket | null = null;
  private messageHandlers: Set<(data: any) => void> = new Set();
  private reconnectInterval: NodeJS.Timeout | null = null;
  private lastWsUrl: string = '';
  private currentUser: User | null = null;

  constructor(private payload: Payload) {}

  // Session Management
  async createSession(options: {
    documentId: string;
    collection: string;
    user: User;
  }): Promise<CollaborationSession> {
    const { documentId, collection, user } = options;

    if (!documentId) {
      throw new Error('Document ID is required');
    }

    const sessionId = this.generateId();
    const now = new Date();

    const session: CollaborationSession = {
      id: sessionId,
      documentId,
      collection,
      participants: [{
        userId: user.id,
        joinedAt: now,
        presence: {
          userId: user.id,
          isActive: true,
          lastSeen: now
        }
      }],
      createdAt: now,
      updatedAt: now,
      isActive: true
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  async joinSession(sessionId: string, user: User): Promise<CollaborationSession> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Check if user is already in session
    const existingParticipant = session.participants.find(p => p.userId === user.id);
    if (!existingParticipant) {
      session.participants.push({
        userId: user.id,
        joinedAt: new Date(),
        presence: {
          userId: user.id,
          isActive: true,
          lastSeen: new Date()
        }
      });
    }

    session.updatedAt = new Date();
    this.sessions.set(sessionId, session);
    return session;
  }

  async leaveSession(sessionId: string, userId: string): Promise<CollaborationSession> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.participants = session.participants.filter(p => p.userId !== userId);
    session.updatedAt = new Date();
    
    if (session.participants.length === 0) {
      session.isActive = false;
    }

    this.sessions.set(sessionId, session);
    return session;
  }

  async getSession(sessionId: string): Promise<CollaborationSession> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    return session;
  }

  async getActiveSessions(documentId: string): Promise<CollaborationSession[]> {
    return Array.from(this.sessions.values()).filter(
      session => session.documentId === documentId && session.isActive
    );
  }

  async getAllActiveSessions(): Promise<CollaborationSession[]> {
    return Array.from(this.sessions.values()).filter(session => session.isActive);
  }

  // User Presence
  async updatePresence(sessionId: string, presence: UserPresence): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const participant = session.participants.find(p => p.userId === presence.userId);
    if (!participant) {
      throw new Error('User is not a participant in this session');
    }

    participant.presence = { ...presence, lastSeen: new Date() };
    session.updatedAt = new Date();
    this.sessions.set(sessionId, session);

    // Broadcast presence update
    if (this.websocket) {
      this.broadcastPresence(sessionId, presence);
    }
  }

  async getPresences(sessionId: string): Promise<UserPresence[]> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    return session.participants
      .map(p => p.presence)
      .filter(Boolean) as UserPresence[];
  }

  async cleanupInactivePresences(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    // Remove participants with inactive presence
    session.participants = session.participants.filter(participant => {
      if (participant.presence && 
          (!participant.presence.isActive || 
           participant.presence.lastSeen < fiveMinutesAgo)) {
        return false; // Remove inactive participants
      }
      return true; // Keep active participants
    });

    this.sessions.set(sessionId, session);
  }

  // Document Locking
  async acquireLock(options: {
    documentId: string;
    collection: string;
    userId: string;
    lockType: 'shared' | 'exclusive';
    expiresAt?: Date;
  }): Promise<DocumentLock> {
    const { documentId, collection, userId, lockType, expiresAt } = options;

    // Check for existing locks
    const existingLocks = Array.from(this.locks.values()).filter(
      lock => lock.documentId === documentId && lock.isActive
    );

    if (lockType === 'exclusive') {
      if (existingLocks.length > 0) {
        throw new Error('Document is already locked exclusively');
      }
    } else if (lockType === 'shared') {
      const exclusiveLock = existingLocks.find(lock => lock.lockType === 'exclusive');
      if (exclusiveLock) {
        throw new Error('Document has an exclusive lock');
      }
    }

    const lockId = this.generateId();
    const now = new Date();
    const defaultExpiry = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes

    const lock: DocumentLock = {
      id: lockId,
      documentId,
      collection,
      userId,
      lockType,
      acquiredAt: now,
      expiresAt: expiresAt || defaultExpiry,
      isActive: true
    };

    this.locks.set(lockId, lock);
    return lock;
  }

  async releaseLock(lockId: string): Promise<void> {
    const lock = this.locks.get(lockId);
    if (lock) {
      lock.isActive = false;
      lock.releasedAt = new Date();
      this.locks.set(lockId, lock);
    }
  }

  async getActiveLocks(documentId: string): Promise<DocumentLock[]> {
    return Array.from(this.locks.values()).filter(
      lock => lock.documentId === documentId && lock.isActive
    );
  }

  async cleanupExpiredLocks(): Promise<void> {
    const now = new Date();
    
    for (const lock of this.locks.values()) {
      if (lock.isActive && lock.expiresAt < now) {
        lock.isActive = false;
        lock.releasedAt = now;
      }
    }
  }

  // Change History
  async recordChange(change: ChangeEvent): Promise<void> {
    const documentChanges = this.changeHistory.get(change.documentId) || [];
    documentChanges.push({
      ...change,
      id: this.generateId(),
      timestamp: change.timestamp || new Date()
    });
    
    this.changeHistory.set(change.documentId, documentChanges);

    // Broadcast change
    if (this.websocket) {
      this.broadcastChange(change);
    }
  }

  async getChangeHistory(
    documentId: string, 
    options?: {
      limit?: number;
      offset?: number;
      userId?: string;
      fromDate?: Date;
      toDate?: Date;
    }
  ): Promise<ChangeEvent[]> {
    let changes = this.changeHistory.get(documentId) || [];

    // Apply filters
    if (options?.userId) {
      changes = changes.filter(change => change.userId === options.userId);
    }

    if (options?.fromDate) {
      changes = changes.filter(change => change.timestamp >= options.fromDate!);
    }

    if (options?.toDate) {
      changes = changes.filter(change => change.timestamp <= options.toDate!);
    }

    // Sort by timestamp (newest first)
    changes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply pagination
    const offset = options?.offset || 0;
    const limit = options?.limit || changes.length;
    
    return changes.slice(offset, offset + limit);
  }

  // Comments System
  async addComment(options: {
    documentId: string;
    collection: string;
    userId: string;
    content: string;
    field?: string;
    position?: { line: number; column: number };
    parentId?: string;
  }): Promise<Comment> {
    const { documentId, collection, userId, content, field, position, parentId } = options;

    const commentId = this.generateId();
    const now = new Date();

    const comment: Comment = {
      id: commentId,
      documentId,
      collection,
      userId,
      content,
      field,
      position,
      parentId,
      createdAt: now,
      updatedAt: now,
      isResolved: false
    };

    const documentComments = this.comments.get(documentId) || [];
    documentComments.push(comment);
    this.comments.set(documentId, documentComments);

    return comment;
  }

  async getComment(commentId: string): Promise<Comment> {
    for (const comments of this.comments.values()) {
      const comment = comments.find(c => c.id === commentId);
      if (comment) return comment;
    }
    throw new Error('Comment not found');
  }

  async getComments(
    documentId: string,
    options?: {
      field?: string;
      isResolved?: boolean;
      userId?: string;
    }
  ): Promise<Comment[]> {
    let comments = this.comments.get(documentId) || [];

    // Apply filters
    if (options?.field) {
      comments = comments.filter(comment => comment.field === options.field);
    }

    if (options?.isResolved !== undefined) {
      comments = comments.filter(comment => comment.isResolved === options.isResolved);
    }

    if (options?.userId) {
      comments = comments.filter(comment => comment.userId === options.userId);
    }

    // Sort by creation date (newest first)
    return comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async resolveComment(commentId: string, resolvedBy: string): Promise<void> {
    const comment = await this.getComment(commentId);
    
    comment.isResolved = true;
    comment.resolvedBy = resolvedBy;
    comment.resolvedAt = new Date();
    comment.updatedAt = new Date();

    // Update in storage
    const documentComments = this.comments.get(comment.documentId) || [];
    const index = documentComments.findIndex(c => c.id === commentId);
    if (index >= 0) {
      documentComments[index] = comment;
      this.comments.set(comment.documentId, documentComments);
    }
  }

  // WebSocket Integration
  async connectWebSocket(url: string, user: User): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      try {
        this.lastWsUrl = url;
        this.currentUser = user;
        this.websocket = new WebSocket(url);

        this.websocket.onopen = () => {
          // Send authentication
          this.websocket?.send(JSON.stringify({
            type: 'auth',
            data: { userId: user.id, email: user.email }
          }));
          resolve(this.websocket!);
        };

        this.websocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.messageHandlers.forEach(handler => handler(data));
          } catch (error) {
            console.warn('Failed to parse WebSocket message:', error);
          }
        };

        this.websocket.onclose = () => {
          this.websocket = null;
          this.scheduleReconnect();
        };

        this.websocket.onerror = (error) => {
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
      this.reconnectInterval = null;
    }
  }

  async reconnect(): Promise<boolean> {
    if (!this.lastWsUrl || !this.currentUser) return false;

    try {
      await this.connectWebSocket(this.lastWsUrl, this.currentUser);
      return true;
    } catch (error) {
      console.error('Reconnection failed:', error);
      return false;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectInterval) return;

    this.reconnectInterval = setTimeout(async () => {
      this.reconnectInterval = null;
      const success = await this.reconnect();
      
      if (!success) {
        this.scheduleReconnect(); // Try again
      }
    }, 5000); // 5 second delay
  }

  onMessage(handler: (data: any) => void): void {
    this.messageHandlers.add(handler);
  }

  offMessage(handler: (data: any) => void): void {
    this.messageHandlers.delete(handler);
  }

  async broadcastPresence(sessionId: string, presence: UserPresence): Promise<void> {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) return;

    const message = {
      type: 'presence_update',
      sessionId,
      data: presence
    };

    this.websocket.send(JSON.stringify(message));
  }

  async broadcastChange(change: ChangeEvent): Promise<void> {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) return;

    const message = {
      type: 'document_change',
      data: change
    };

    this.websocket.send(JSON.stringify(message));
  }

  async batchBroadcast(messages: any[]): Promise<boolean> {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) return false;

    const batchMessage = {
      type: 'batch',
      data: messages
    };

    this.websocket.send(JSON.stringify(batchMessage));
    return true;
  }

  // Conflict Resolution
  async detectConflict(change: ChangeEvent): Promise<DocumentConflict | null> {
    const recentChanges = await this.getChangeHistory(change.documentId, {
      limit: 10,
      fromDate: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
    });

    // Check for concurrent edits to same field
    const conflictingChange = recentChanges.find(existing => 
      existing.field === change.field &&
      existing.userId !== change.userId &&
      existing.oldValue === change.oldValue &&
      existing.changeType === change.changeType
    );

    if (conflictingChange) {
      return {
        id: this.generateId(),
        documentId: change.documentId,
        field: change.field!,
        conflictType: 'concurrent_edit',
        changes: [conflictingChange, change],
        detectedAt: new Date(),
        isResolved: false
      };
    }

    return null;
  }

  async resolveConflict(
    conflictId: string, 
    resolution: {
      resolutionType: 'keep_original' | 'keep_latest' | 'merge' | 'manual';
      selectedValue?: any;
      resolvedBy: string;
    }
  ): Promise<ConflictResolution> {
    const now = new Date();

    const conflictResolution: ConflictResolution = {
      id: this.generateId(),
      conflictId,
      resolutionType: resolution.resolutionType,
      selectedValue: resolution.selectedValue,
      resolvedBy: resolution.resolvedBy,
      resolvedAt: now,
      isResolved: true
    };

    return conflictResolution;
  }

  // Cleanup Operations
  async cleanupInactiveSessions(): Promise<void> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.updatedAt < oneHourAgo) {
        session.isActive = false;
        this.sessions.set(sessionId, session);
      }
    }
  }

  // Utility Methods
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}