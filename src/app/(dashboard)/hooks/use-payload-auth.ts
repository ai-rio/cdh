'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { authService } from '@/lib/auth-service';
import { PayloadClient } from '@/lib/payload-client';
import { 
  hasPermission, 
  getUserPermissions, 
  isValidRole 
} from '@/lib/role-permissions';
import type { 
  AuthUser, 
  UsePayloadAuthReturn, 
  RegisterData, 
  UserProfileUpdate, 
  Permission, 
  Role, 
  PermissionContext,
  AuthSession 
} from '@/lib/auth-types';

/**
 * Unified authentication hook that bridges auth-service and payload-client
 * Provides a single interface for all authentication operations
 */
export function usePayloadAuth(): UsePayloadAuthReturn {
  // State management
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastActivity, setLastActivity] = useState(new Date());
  
  // Refs for managing async operations
  const payloadClientRef = useRef<PayloadClient>();
  const initializationAttempted = useRef(false);

  // Initialize payload client
  useEffect(() => {
    if (!payloadClientRef.current) {
      payloadClientRef.current = new PayloadClient(process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL || 'http://localhost:3000');
    }
  }, []);

  // Derived state
  const isAuthenticated = Boolean(user && user.isActive);
  const permissions = user?.permissions || [];
  const roles = user ? [user.role] : [];

  // Initialize auth from localStorage on mount
  useEffect(() => {
    if (initializationAttempted.current) return;
    initializationAttempted.current = true;

    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser && payloadClientRef.current) {
          try {
            // Verify token is still valid
            const currentUser = await payloadClientRef.current.me();
            if (currentUser) {
              const parsedUser = JSON.parse(storedUser);
              setUser({
                ...parsedUser,
                // Update with fresh data from server
                ...currentUser,
                permissions: getUserPermissions(isValidRole(currentUser.role || parsedUser.role) ? (currentUser.role || parsedUser.role) : 'user'),
              });
              setLastActivity(new Date());
            } else {
              // Token invalid, clear storage
              localStorage.removeItem('auth_token');
              localStorage.removeItem('auth_user');
            }
          } catch (error) {
            console.error('Token verification failed:', error);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      }
    };

    initializeAuth();
  }, []);

  // Update activity timestamp
  const updateActivity = useCallback(() => {
    setLastActivity(new Date());
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Login through both services for unified auth
      const [authResult, payloadResult] = await Promise.all([
        authService.login(email, password),
        payloadClientRef.current?.login(email, password)
      ]);

      if (!authResult.user || !authResult.token) {
        throw new Error('Invalid response from auth service');
      }

      // Create unified user object with permissions
      const userWithPermissions: AuthUser = {
        ...authResult.user,
        permissions: getUserPermissions(authResult.user.role),
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: authResult.user.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUser(userWithPermissions);
      updateActivity();

      // Store in localStorage for persistence
      localStorage.setItem('auth_token', authResult.token);
      localStorage.setItem('auth_user', JSON.stringify(userWithPermissions));

    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [updateActivity]);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      
      // Logout from both services
      await Promise.allSettled([
        token ? authService.logout(token) : Promise.resolve(),
        payloadClientRef.current?.logout()
      ]);

      // Clear state and storage
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Token refresh function
  const refreshToken = useCallback(async (): Promise<void> => {
    const currentToken = localStorage.getItem('auth_token');
    if (!currentToken) {
      throw new Error('No token to refresh');
    }

    try {
      const refreshResult = await authService.refreshToken(currentToken);
      
      if (refreshResult.user && refreshResult.token) {
        const userWithPermissions: AuthUser = {
          ...refreshResult.user,
          permissions: getUserPermissions(refreshResult.user.role),
          isActive: true,
          lastLogin: refreshResult.user.lastLogin || new Date().toISOString(),
          createdAt: refreshResult.user.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUser(userWithPermissions);
        updateActivity();

        // Update stored token and user
        localStorage.setItem('auth_token', refreshResult.token);
        localStorage.setItem('auth_user', JSON.stringify(userWithPermissions));
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  }, [logout, updateActivity]);

  // Register function
  const register = useCallback(async (data: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      const registerResult = await authService.register(data.name, data.email, data.password);
      
      if (!registerResult.user || !registerResult.token) {
        throw new Error('Invalid response from registration service');
      }

      const userWithPermissions: AuthUser = {
        ...registerResult.user,
        role: data.role || 'user',
        permissions: getUserPermissions(data.role || 'user'),
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profile: data.profile,
      };

      setUser(userWithPermissions);
      updateActivity();

      // Store in localStorage
      localStorage.setItem('auth_token', registerResult.token);
      localStorage.setItem('auth_user', JSON.stringify(userWithPermissions));

    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [updateActivity]);

  // Update profile function
  const updateProfile = useCallback(async (data: UserProfileUpdate): Promise<void> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    setIsLoading(true);
    try {
      // Update user profile (would call API endpoint)
      const updatedUser: AuthUser = {
        ...user,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      setUser(updatedUser);
      updateActivity();

      // Update stored user
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));

    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, updateActivity]);

  // Permission checking functions
  const checkPermission = useCallback((permission: Permission, context?: PermissionContext): boolean => {
    return hasPermission(permissions, permission, context);
  }, [permissions]);

  const checkRole = useCallback((role: Role): boolean => {
    return user?.role === role;
  }, [user?.role]);

  const hasAnyPermission = useCallback((requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.some(permission => checkPermission(permission));
  }, [checkPermission]);

  const hasAllPermissions = useCallback((requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.every(permission => checkPermission(permission));
  }, [checkPermission]);

  // Session management
  const getSession = useCallback((): AuthSession | null => {
    if (!user) return null;

    const token = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!token) return null;

    return {
      user,
      token,
      refreshToken: refreshToken || '',
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      issuedAt: new Date().toISOString(),
      lastActivity: lastActivity.toISOString(),
    };
  }, [user, lastActivity]);

  // Token utility functions
  const isTokenExpired = useCallback((): boolean => {
    const token = localStorage.getItem('auth_token');
    if (!token) return true;

    try {
      // Decode JWT token to check expiry (simplified)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }, []);

  const getTokenExpiryTime = useCallback((): Date | null => {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  }, []);

  // Return the hook interface
  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    permissions,
    roles,
    lastActivity,

    // Actions
    login,
    logout,
    refreshToken,
    register,
    updateProfile,

    // Permission checks
    hasPermission: checkPermission,
    hasRole: checkRole,
    hasAnyPermission,
    hasAllPermissions,

    // Session management
    updateActivity,
    getSession,

    // Utilities
    isTokenExpired,
    getTokenExpiryTime,
  };
}