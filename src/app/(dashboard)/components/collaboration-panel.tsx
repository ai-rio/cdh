'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  MessageSquare, 
  History, 
  Lock, 
  Unlock,
  Send,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Edit3,
  FileText
} from 'lucide-react';
import { CollaborationManager } from '@/lib/collaboration-manager';
import type { 
  CollaborationSession,
  UserPresence,
  Comment,
  ChangeEvent,
  DocumentLock,
  User as UserType
} from '@/types/collection-management';

export interface CollaborationPanelProps {
  documentId: string;
  collection: string;
  user: UserType;
  className?: string;
}

export function CollaborationPanel({ 
  documentId, 
  collection, 
  user, 
  className 
}: CollaborationPanelProps) {
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [presences, setPresences] = useState<UserPresence[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [changeHistory, setChangeHistory] = useState<ChangeEvent[]>([]);
  const [locks, setLocks] = useState<DocumentLock[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedField, setSelectedField] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [collaborationManager] = useState(() => new CollaborationManager({} as any));

  // Initialize collaboration session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Check for existing sessions
        const existingSessions = await collaborationManager.getActiveSessions(documentId);
        
        if (existingSessions.length > 0) {
          const existingSession = existingSessions[0];
          await collaborationManager.joinSession(existingSession.id, user);
          setSession(existingSession);
        } else {
          // Create new session
          const newSession = await collaborationManager.createSession({
            documentId,
            collection,
            user
          });
          setSession(newSession);
        }

        // Connect WebSocket
        const wsUrl = `ws://${window.location.host}/api/collaboration`;
        await collaborationManager.connectWebSocket(wsUrl, user);
        setIsConnected(true);

        // Set up message handlers
        collaborationManager.onMessage(handleWebSocketMessage);

        // Load initial data
        await loadCollaborationData();

      } catch (error) {
        console.error('Failed to initialize collaboration:', error);
      }
    };

    initializeSession();

    return () => {
      if (session) {
        collaborationManager.leaveSession(session.id, user.id);
      }
      collaborationManager.disconnect();
    };
  }, [documentId, collection, user]);

  const handleWebSocketMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'presence_update':
        updatePresenceData();
        break;
      case 'document_change':
        loadChangeHistory();
        break;
      case 'comment_added':
        loadComments();
        break;
      case 'lock_acquired':
      case 'lock_released':
        loadLocks();
        break;
    }
  }, []);

  const loadCollaborationData = async () => {
    if (!session) return;

    try {
      await Promise.all([
        updatePresenceData(),
        loadComments(),
        loadChangeHistory(),
        loadLocks()
      ]);
    } catch (error) {
      console.error('Failed to load collaboration data:', error);
    }
  };

  const updatePresenceData = async () => {
    if (!session) return;
    
    try {
      const currentPresences = await collaborationManager.getPresences(session.id);
      setPresences(currentPresences);
    } catch (error) {
      console.error('Failed to load presences:', error);
    }
  };

  const loadComments = async () => {
    try {
      const documentComments = await collaborationManager.getComments(documentId);
      setComments(documentComments);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const loadChangeHistory = async () => {
    try {
      const history = await collaborationManager.getChangeHistory(documentId, {
        limit: 20
      });
      setChangeHistory(history);
    } catch (error) {
      console.error('Failed to load change history:', error);
    }
  };

  const loadLocks = async () => {
    try {
      const activeLocks = await collaborationManager.getActiveLocks(documentId);
      setLocks(activeLocks);
    } catch (error) {
      console.error('Failed to load locks:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await collaborationManager.addComment({
        documentId,
        collection,
        userId: user.id,
        content: newComment,
        field: selectedField || undefined
      });

      setNewComment('');
      setSelectedField('');
      await loadComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleResolveComment = async (commentId: string) => {
    try {
      await collaborationManager.resolveComment(commentId, user.id);
      await loadComments();
    } catch (error) {
      console.error('Failed to resolve comment:', error);
    }
  };

  const handleAcquireLock = async (lockType: 'shared' | 'exclusive') => {
    try {
      await collaborationManager.acquireLock({
        documentId,
        collection,
        userId: user.id,
        lockType
      });
      await loadLocks();
    } catch (error) {
      console.error('Failed to acquire lock:', error);
    }
  };

  const handleReleaseLock = async (lockId: string) => {
    try {
      await collaborationManager.releaseLock(lockId);
      await loadLocks();
    } catch (error) {
      console.error('Failed to release lock:', error);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getPresenceColor = (userId: string) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
    const index = userId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const unresolvedComments = comments.filter(c => !c.isResolved);
  const resolvedComments = comments.filter(c => c.isResolved);
  const myLocks = locks.filter(l => l.userId === user.id);
  const otherLocks = locks.filter(l => l.userId !== user.id);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <Badge variant="secondary">
          {presences.filter(p => p.isActive).length} active
        </Badge>
      </div>

      <Tabs defaultValue="presence" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="presence">
            <Users className="h-4 w-4 mr-1" />
            Users
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="h-4 w-4 mr-1" />
            Comments
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-1" />
            History
          </TabsTrigger>
          <TabsTrigger value="locks">
            <Lock className="h-4 w-4 mr-1" />
            Locks
          </TabsTrigger>
        </TabsList>

        {/* User Presence Tab */}
        <TabsContent value="presence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active Users</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {presences.filter(p => p.isActive).map((presence) => (
                <div key={presence.userId} className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={getPresenceColor(presence.userId)}>
                        {presence.userId.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {presence.userId === user.id ? 'You' : `User ${presence.userId}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {presence.cursor ? 
                        `Line ${presence.cursor.line}, Col ${presence.cursor.column}` : 
                        'No cursor position'
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {presence.isActive ? (
                      <Eye className="h-3 w-3 text-green-500" />
                    ) : (
                      <EyeOff className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
              
              {presences.filter(p => p.isActive).length === 0 && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No active users
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments" className="space-y-4">
          {/* Add Comment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Add Comment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Field (optional)"
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
              />
              <Textarea
                placeholder="Enter your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                size="sm"
                className="w-full"
              >
                <Send className="h-4 w-4 mr-1" />
                Add Comment
              </Button>
            </CardContent>
          </Card>

          {/* Comments List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                Comments
                <Badge variant="secondary">
                  {unresolvedComments.length} unresolved
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {/* Unresolved Comments */}
                  {unresolvedComments.map((comment) => (
                    <div key={comment.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            <span className="text-xs font-medium">
                              {comment.userId === user.id ? 'You' : `User ${comment.userId}`}
                            </span>
                            {comment.field && (
                              <Badge variant="outline" className="text-xs">
                                {comment.field}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm mt-1">{comment.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTimeAgo(comment.createdAt)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleResolveComment(comment.id)}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Resolved Comments */}
                  {resolvedComments.length > 0 && (
                    <>
                      <Separator />
                      <div className="text-xs text-muted-foreground font-medium">
                        Resolved ({resolvedComments.length})
                      </div>
                      {resolvedComments.slice(0, 3).map((comment) => (
                        <div key={comment.id} className="p-3 border rounded-lg opacity-60 space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs">
                              {comment.userId === user.id ? 'You' : `User ${comment.userId}`}
                            </span>
                            {comment.field && (
                              <Badge variant="outline" className="text-xs">
                                {comment.field}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      ))}
                    </>
                  )}

                  {comments.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No comments yet
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Change History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {changeHistory.map((change, index) => (
                    <div key={`${change.documentId}-${index}`} className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                      <div className="mt-1">
                        {change.changeType === 'create' && <FileText className="h-4 w-4 text-green-500" />}
                        {change.changeType === 'update' && <Edit3 className="h-4 w-4 text-blue-500" />}
                        {change.changeType === 'delete' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">
                            {change.userId === user.id ? 'You' : `User ${change.userId}`}
                          </span>
                          {' '}
                          {change.changeType}d the {change.field} field
                        </p>
                        {change.oldValue !== change.newValue && (
                          <div className="text-xs text-muted-foreground mt-1">
                            <span className="line-through">{String(change.oldValue)}</span>
                            {' → '}
                            <span>{String(change.newValue)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(change.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {changeHistory.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No changes recorded
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Document Locks Tab */}
        <TabsContent value="locks" className="space-y-4">
          {/* Lock Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Lock Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={() => handleAcquireLock('shared')}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={locks.some(l => l.lockType === 'exclusive')}
              >
                <Lock className="h-4 w-4 mr-1" />
                Acquire Shared Lock
              </Button>
              <Button
                onClick={() => handleAcquireLock('exclusive')}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={locks.length > 0}
              >
                <Lock className="h-4 w-4 mr-1" />
                Acquire Exclusive Lock
              </Button>
            </CardContent>
          </Card>

          {/* Active Locks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active Locks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* My Locks */}
                {myLocks.map((lock) => (
                  <div key={lock.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <Lock className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Your {lock.lockType} lock</p>
                        <p className="text-xs text-muted-foreground">
                          Acquired {formatTimeAgo(lock.acquiredAt)}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleReleaseLock(lock.id)}
                    >
                      <Unlock className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {/* Other User Locks */}
                {otherLocks.map((lock) => (
                  <div key={lock.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <Lock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">
                          User {lock.userId} - {lock.lockType} lock
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Acquired {formatTimeAgo(lock.acquiredAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {locks.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No active locks
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CollaborationPanel;