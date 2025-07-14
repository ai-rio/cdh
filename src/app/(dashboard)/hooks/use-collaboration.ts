import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { 
  DocumentChange,
  LockResult,
  LockStatus,
  UserPresence,
  ActiveUser,
  DocumentConflict,
  ChangeCallback,
  Subscription,
  User
} from '@/types';

interface CollaborationOptions {
  enableRealTime?: boolean;
  enablePresence?: boolean;
  enableLocking?: boolean;
  lockTimeout?: number; // in milliseconds
  heartbeatInterval?: number; // in milliseconds
}

export function useCollaboration(options: CollaborationOptions = {}) {
  const {
    enableRealTime = true,
    enablePresence = true,
    enableLocking = true,
    lockTimeout = 30000, // 30 seconds
    heartbeatInterval = 5000 // 5 seconds
  } = options;

  // State
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [documentLocks, setDocumentLocks] = useState<Map<string, LockStatus>>(new Map());
  const [conflicts, setConflicts] = useState<DocumentConflict[]>([]);
  const [presenceData, setPresenceData] = useState<UserPresence[]>([]);

  // Refs
  const websocketRef = useRef<WebSocket | null>(null);
  const subscriptionsRef = useRef<Map<string, Set<ChangeCallback>>>(new Map());
  const presenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();

  // WebSocket connection management
  const connect = useCallback(() => {
    if (!enableRealTime || websocketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      // In a real implementation, this would connect to your WebSocket server
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/collaboration';
      websocketRef.current = new WebSocket(wsUrl);

      websocketRef.current.onopen = () => {
        setIsConnected(true);
        
        // Send authentication message
        if (user) {
          websocketRef.current?.send(JSON.stringify({
            type: 'auth',
            userId: user.id,
            token: 'jwt-token' // Would get from auth context
          }));
        }

        // Start heartbeat
        if (heartbeatTimerRef.current) {
          clearInterval(heartbeatTimerRef.current);
        }
        heartbeatTimerRef.current = setInterval(() => {
          websocketRef.current?.send(JSON.stringify({ type: 'ping' }));
        }, heartbeatInterval);
      };

      websocketRef.current.onmessage = (event) => {
        handleWebSocketMessage(JSON.parse(event.data));
      };

      websocketRef.current.onclose = () => {
        setIsConnected(false);
        if (heartbeatTimerRef.current) {
          clearInterval(heartbeatTimerRef.current);
        }
        
        // Attempt to reconnect after a delay
        setTimeout(() => {
          connect();
        }, 3000);
      };

      websocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setIsConnected(false);
    }
  }, [enableRealTime, user, heartbeatInterval]);

  const disconnect = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
    
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
    }
    
    if (presenceTimerRef.current) {
      clearInterval(presenceTimerRef.current);
    }
    
    setIsConnected(false);
  }, []);

  const handleWebSocketMessage = useCallback((message: any) => {
    switch (message.type) {
      case 'document_change':
        handleDocumentChange(message.data);
        break;
      
      case 'presence_update':
        handlePresenceUpdate(message.data);
        break;
      
      case 'lock_status':
        handleLockStatusUpdate(message.data);
        break;
      
      case 'conflict_detected':
        handleConflictDetected(message.data);
        break;
      
      case 'user_joined':
      case 'user_left':
        handleUserPresenceChange(message.data);
        break;
      
      case 'pong':
        // Heartbeat response
        break;
      
      default:
        console.warn('Unknown message type:', message.type);
    }
  }, []);

  const handleDocumentChange = useCallback((change: DocumentChange) => {
    const subscriptions = subscriptionsRef.current.get(change.collection);
    if (subscriptions) {
      subscriptions.forEach(callback => {
        try {
          callback(change);
        } catch (error) {
          console.error('Error in change callback:', error);
        }
      });
    }
  }, []);

  const handlePresenceUpdate = useCallback((presence: UserPresence[]) => {
    setPresenceData(presence);
    
    // Update active users
    const users = presence
      .filter(p => p.isActive)
      .map(p => ({
        user: { id: p.userId } as User, // Would fetch full user data
        presence: p,
        color: generateUserColor(p.userId)
      }));
    
    setActiveUsers(users);
  }, []);

  const handleLockStatusUpdate = useCallback((lockData: { documentKey: string; status: LockStatus }) => {
    setDocumentLocks(prev => {
      const newLocks = new Map(prev);
      newLocks.set(lockData.documentKey, lockData.status);
      return newLocks;
    });
  }, []);

  const handleConflictDetected = useCallback((conflict: DocumentConflict) => {
    setConflicts(prev => [...prev, conflict]);
  }, []);

  const handleUserPresenceChange = useCallback((userData: any) => {
    // Handle user joining/leaving
    console.log('User presence changed:', userData);
  }, []);

  // Document locking
  const lockDocument = useCallback(async (collection: string, documentId: string): Promise<LockResult> => {
    if (!enableLocking || !user) {
      return { success: false, message: 'Locking not available' };
    }

    try {
      const documentKey = `${collection}:${documentId}`;
      
      // Check if already locked
      const currentLock = documentLocks.get(documentKey);
      if (currentLock?.isLocked && currentLock.lockedBy?.id !== user.id) {
        return {
          success: false,
          message: `Document is locked by ${currentLock.lockedBy?.name || 'another user'}`
        };
      }

      // Send lock request via WebSocket
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(JSON.stringify({
          type: 'lock_document',
          collection,
          documentId,
          userId: user.id,
          timeout: lockTimeout
        }));
      }

      // Simulate lock acquisition for demo
      const lockId = `lock_${Date.now()}`;
      const expiresAt = new Date(Date.now() + lockTimeout);
      
      const lockStatus: LockStatus = {
        isLocked: true,
        lockId,
        lockedBy: user,
        expiresAt,
        timeRemaining: lockTimeout
      };

      setDocumentLocks(prev => {
        const newLocks = new Map(prev);
        newLocks.set(documentKey, lockStatus);
        return newLocks;
      });

      return {
        success: true,
        lockId,
        expiresAt,
        lockedBy: user
      };
    } catch (error) {
      console.error('Error locking document:', error);
      return { success: false, message: 'Failed to lock document' };
    }
  }, [enableLocking, user, lockTimeout, documentLocks]);

  const unlockDocument = useCallback(async (collection: string, documentId: string): Promise<void> => {
    if (!enableLocking || !user) {
      return;
    }

    try {
      const documentKey = `${collection}:${documentId}`;
      
      // Send unlock request via WebSocket
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(JSON.stringify({
          type: 'unlock_document',
          collection,
          documentId,
          userId: user.id
        }));
      }

      // Remove from local state
      setDocumentLocks(prev => {
        const newLocks = new Map(prev);
        newLocks.delete(documentKey);
        return newLocks;
      });
    } catch (error) {
      console.error('Error unlocking document:', error);
    }
  }, [enableLocking, user]);

  const getLockStatus = useCallback((collection: string, documentId: string): LockStatus | null => {
    const documentKey = `${collection}:${documentId}`;
    return documentLocks.get(documentKey) || null;
  }, [documentLocks]);

  // Change broadcasting
  const broadcastChange = useCallback((change: DocumentChange) => {
    if (!enableRealTime || websocketRef.current?.readyState !== WebSocket.OPEN) {
      return;
    }

    websocketRef.current.send(JSON.stringify({
      type: 'document_change',
      data: change
    }));
  }, [enableRealTime]);

  // Subscription management
  const subscribeToChanges = useCallback((collection: string, callback: ChangeCallback): Subscription => {
    const subscriptionId = `${collection}_${Date.now()}_${Math.random()}`;
    
    if (!subscriptionsRef.current.has(collection)) {
      subscriptionsRef.current.set(collection, new Set());
    }
    
    subscriptionsRef.current.get(collection)!.add(callback);

    return {
      id: subscriptionId,
      isActive: true,
      unsubscribe: () => {
        const subscriptions = subscriptionsRef.current.get(collection);
        if (subscriptions) {
          subscriptions.delete(callback);
        }
      }
    };
  }, []);

  // Presence management
  const updatePresence = useCallback((presence: Partial<UserPresence>) => {
    if (!enablePresence || !user || websocketRef.current?.readyState !== WebSocket.OPEN) {
      return;
    }

    const fullPresence: UserPresence = {
      userId: user.id,
      collection: '',
      lastSeen: new Date(),
      isActive: true,
      ...presence
    };

    websocketRef.current.send(JSON.stringify({
      type: 'presence_update',
      data: fullPresence
    }));
  }, [enablePresence, user]);

  const getActiveUsers = useCallback((collection?: string, documentId?: string): ActiveUser[] => {
    return activeUsers.filter(activeUser => {
      if (collection && activeUser.presence.collection !== collection) {
        return false;
      }
      if (documentId && activeUser.presence.documentId !== documentId) {
        return false;
      }
      return true;
    });
  }, [activeUsers]);

  // Conflict resolution
  const resolveConflict = useCallback(async (conflictId: string, resolution: 'local' | 'remote' | 'merge'): Promise<void> => {
    try {
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(JSON.stringify({
          type: 'resolve_conflict',
          conflictId,
          resolution
        }));
      }

      // Remove resolved conflict from state
      setConflicts(prev => prev.filter(c => c.documentId !== conflictId));
    } catch (error) {
      console.error('Error resolving conflict:', error);
    }
  }, []);

  // Utility functions
  const generateUserColor = useCallback((userId: string): string => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    
    const hash = userId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    disconnect();
    subscriptionsRef.current.clear();
    setActiveUsers([]);
    setDocumentLocks(new Map());
    setConflicts([]);
    setPresenceData([]);
  }, [disconnect]);

  // Effects
  useEffect(() => {
    if (enableRealTime) {
      connect();
    }
    
    return () => {
      cleanup();
    };
  }, [connect, enableRealTime, cleanup]);

  // Auto-update presence
  useEffect(() => {
    if (!enablePresence || !user) return;

    if (presenceTimerRef.current) {
      clearInterval(presenceTimerRef.current);
    }

    presenceTimerRef.current = setInterval(() => {
      updatePresence({ lastSeen: new Date() });
    }, 10000); // Update every 10 seconds

    return () => {
      if (presenceTimerRef.current) {
        clearInterval(presenceTimerRef.current);
      }
    };
  }, [enablePresence, user, updatePresence]);

  return {
    // Connection state
    isConnected,
    
    // Document locking
    lockDocument,
    unlockDocument,
    getLockStatus,
    
    // Change management
    broadcastChange,
    subscribeToChanges,
    
    // Presence
    updatePresence,
    getActiveUsers,
    activeUsers,
    
    // Conflicts
    conflicts,
    resolveConflict,
    
    // Utility
    cleanup
  };
}