'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { usePayloadAuth } from '@/app/(dashboard)/hooks/use-payload-auth';
import type { 
  AuthUser, 
  Permission, 
  Role, 
  AuthSession,
  PermissionContext 
} from '@/lib/auth-types';

// Enhanced interface that maintains backward compatibility while adding new features
interface AuthContextType {
  // Legacy properties for backward compatibility
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  verifyTokenIfNeeded: (forceVerify?: boolean) => Promise<{ isValid: boolean; user: AuthUser | null }>;
  
  // Enhanced properties for role-based access control
  isAuthenticated: boolean;
  permissions: Permission[];
  roles: Role[];
  lastActivity: Date;
  
  // Enhanced methods for permission checking
  hasPermission: (permission: Permission, context?: PermissionContext) => boolean;
  hasRole: (role: Role) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  checkPermission: (permission: Permission, context?: PermissionContext) => boolean;
  
  // Session management
  getSession: () => AuthSession | null;
  updateActivity: () => void;
  
  // Token utilities
  isTokenExpired: () => boolean;
  getTokenExpiryTime: () => Date | null;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Use the unified auth hook as the single source of truth
  const payloadAuth = usePayloadAuth();
  
  // Local state for error handling (for backward compatibility)
  const [error, setError] = useState<string | null>(null);

  // Enhanced login with error handling
  const enhancedLogin = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      await payloadAuth.login(email, password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    }
  }, [payloadAuth]);

  // Enhanced register with error handling  
  const enhancedRegister = useCallback(async (name: string, email: string, password: string): Promise<void> => {
    try {
      setError(null);
      await payloadAuth.register({ name, email, password });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  }, [payloadAuth]);

  // Enhanced logout with error handling
  const enhancedLogout = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await payloadAuth.logout();
    } catch (err) {
      console.error('Logout error:', err);
      // Even if logout fails, clear error state
      setError(null);
    }
  }, [payloadAuth]);

  // Token verification for backward compatibility
  const verifyTokenIfNeeded = useCallback(async (forceVerify = false): Promise<{ isValid: boolean; user: AuthUser | null }> => {
    try {
      if (forceVerify || payloadAuth.isTokenExpired()) {
        await payloadAuth.refreshToken();
      }
      return { isValid: !payloadAuth.isTokenExpired(), user: payloadAuth.user };
    } catch (err) {
      console.error('Token verification failed:', err);
      return { isValid: false, user: null };
    }
  }, [payloadAuth]);

  // Get token from localStorage for backward compatibility
  const getStoredToken = useCallback((): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }, []);

  // Create the enhanced context value
  const value: AuthContextType = {
    // Legacy properties for backward compatibility
    user: payloadAuth.user,
    token: getStoredToken(),
    login: enhancedLogin,
    register: enhancedRegister,
    logout: enhancedLogout,
    isLoading: payloadAuth.isLoading,
    error,
    isInitialized: true, // Always initialized since usePayloadAuth handles this
    verifyTokenIfNeeded,
    
    // Enhanced properties from usePayloadAuth
    isAuthenticated: payloadAuth.isAuthenticated,
    permissions: payloadAuth.permissions,
    roles: payloadAuth.roles,
    lastActivity: payloadAuth.lastActivity,
    
    // Enhanced methods for permission checking
    hasPermission: payloadAuth.hasPermission,
    hasRole: payloadAuth.hasRole,
    hasAnyPermission: payloadAuth.hasAnyPermission,
    hasAllPermissions: payloadAuth.hasAllPermissions,
    checkPermission: payloadAuth.hasPermission, // Alias for backward compatibility
    
    // Session management
    getSession: payloadAuth.getSession,
    updateActivity: payloadAuth.updateActivity,
    
    // Token utilities
    isTokenExpired: payloadAuth.isTokenExpired,
    getTokenExpiryTime: payloadAuth.getTokenExpiryTime,
    refreshToken: payloadAuth.refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
