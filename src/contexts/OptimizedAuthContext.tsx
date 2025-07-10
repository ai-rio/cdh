'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { User } from '../payload-types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Cache for session validation to prevent repeated API calls
let sessionValidationCache: {
  token: string | null;
  user: User | null;
  timestamp: number;
  isValid: boolean;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const SESSION_CHECK_INTERVAL = 30 * 1000; // 30 seconds

export const OptimizedAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Memoized clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Optimized session validation with caching
  const validateSession = useCallback(async (storedToken: string): Promise<{ user: User | null; token: string | null }> => {
    const now = Date.now();
    
    // Check cache first
    if (sessionValidationCache && 
        sessionValidationCache.token === storedToken && 
        (now - sessionValidationCache.timestamp) < CACHE_DURATION &&
        sessionValidationCache.isValid) {
      return {
        user: sessionValidationCache.user,
        token: sessionValidationCache.token
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        
        // Update cache
        sessionValidationCache = {
          token: data.token || storedToken,
          user: data.user,
          timestamp: now,
          isValid: true
        };

        return {
          user: data.user,
          token: data.token || storedToken
        };
      } else {
        // Invalid session
        sessionValidationCache = {
          token: null,
          user: null,
          timestamp: now,
          isValid: false
        };
        
        // Clear invalid stored data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        
        return { user: null, token: null };
      }
    } catch (err) {
      console.error('Session validation error:', err);
      
      // On error, clear cache and stored data
      sessionValidationCache = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      return { user: null, token: null };
    }
  }, []);

  // Optimized initialization with immediate local data loading
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      
      // Immediately set local data if available (optimistic loading)
      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
          setIsInitialized(true); // Set initialized immediately for better UX
          
          // Validate in background
          const { user: validatedUser, token: validatedToken } = await validateSession(storedToken);
          
          if (validatedUser && validatedToken) {
            setUser(validatedUser);
            setToken(validatedToken);
            
            // Update stored data if changed
            if (validatedToken !== storedToken) {
              localStorage.setItem('auth_token', validatedToken);
            }
            localStorage.setItem('auth_user', JSON.stringify(validatedUser));
          } else {
            // Session invalid, clear state
            setUser(null);
            setToken(null);
          }
        } catch (err) {
          console.error('Auth initialization error:', err);
          setUser(null);
          setToken(null);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      } else {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [validateSession]);

  // Optimized login function with better error handling
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        
        setUser(data.user);
        setToken(data.token);
        
        // Store in localStorage
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        
        // Update cache
        sessionValidationCache = {
          token: data.token,
          user: data.user,
          timestamp: Date.now(),
          isValid: true
        };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimized register function
  const register = useCallback(async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        
        setUser(data.user);
        setToken(data.token);
        
        // Store in localStorage
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        
        // Update cache
        sessionValidationCache = {
          token: data.token,
          user: data.user,
          timestamp: Date.now(),
          isValid: true
        };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimized logout function
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    
    // Clear all stored data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    // Clear cache
    sessionValidationCache = null;
    
    // Optional: Call logout API endpoint
    fetch('/api/users/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {
      // Ignore logout API errors
    });
  }, []);

  // Periodic session validation (less frequent)
  useEffect(() => {
    if (!token || !user) return;

    const interval = setInterval(async () => {
      if (token) {
        const { user: validatedUser } = await validateSession(token);
        if (!validatedUser) {
          logout();
        }
      }
    }, SESSION_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [token, user, validateSession, logout]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    error,
    isInitialized,
    clearError,
  }), [user, token, login, register, logout, isLoading, error, isInitialized, clearError]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useOptimizedAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useOptimizedAuth must be used within an OptimizedAuthProvider');
  }
  return context;
};
