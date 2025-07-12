'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requirePermissions?: string[];
  fallbackPath?: string;
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  requirePermissions = [], 
  fallbackPath = '/' 
}: AuthGuardProps) {
  const auth = useAuth();
  const router = useRouter();

  // Update activity when accessing dashboard
  useEffect(() => {
    if (auth.isAuthenticated) {
      auth.updateActivity?.();
    }
  }, [auth.isAuthenticated, auth.updateActivity]);

  // Handle authentication loading state
  if (!auth.isInitialized || auth.isLoading) {
    return (
      <div 
        data-testid="auth-loading" 
        className="flex items-center justify-center min-h-screen bg-background"
      >
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle authentication errors
  if (auth.error) {
    return (
      <div 
        data-testid="auth-error"
        className="flex items-center justify-center min-h-screen bg-background"
      >
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="text-red-500 text-lg font-semibold">Authentication Error</div>
          <p className="text-sm text-muted-foreground">{auth.error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !auth.isAuthenticated) {
    return (
      <div 
        data-testid="auth-redirect"
        className="flex items-center justify-center min-h-screen bg-background"
      >
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="text-lg font-semibold">Authentication Required</div>
          <p className="text-sm text-muted-foreground">
            You need to be logged in to access the dashboard.
          </p>
          <button 
            onClick={() => router.push(fallbackPath)} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Check permissions if specified
  if (requirePermissions.length > 0 && auth.isAuthenticated) {
    const hasRequiredPermissions = requirePermissions.every(permission => 
      auth.hasPermission?.(permission as any)
    );

    if (!hasRequiredPermissions) {
      return (
        <div 
          data-testid="auth-insufficient-permissions"
          className="flex items-center justify-center min-h-screen bg-background"
        >
          <div className="max-w-md mx-auto text-center space-y-4">
            <div className="text-lg font-semibold">Insufficient Permissions</div>
            <p className="text-sm text-muted-foreground">
              You don&apos;t have the required permissions to access this area.
            </p>
            <button 
              onClick={() => router.back()} 
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  // All checks passed, render children
  return <>{children}</>;
}