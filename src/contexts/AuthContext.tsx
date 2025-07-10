'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { User } from '../payload-types'; // Import the User type from payload-types

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  verifyTokenIfNeeded: (forceVerify?: boolean) => Promise<{ isValid: boolean; user: User | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // Refs to prevent infinite loops
  const initializationAttempted = useRef(false);
  const isVerifyingToken = useRef(false);
  const lastVerificationTime = useRef<number>(0);

  // Load user session from localStorage on mount - ONLY ONCE
  useEffect(() => {
    if (initializationAttempted.current) return;
    initializationAttempted.current = true;

    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');
        
        if (storedToken && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            
            // Set user immediately from localStorage
            setUser(parsedUser);
            setToken(storedToken);
            
            console.log('Auth initialized from localStorage:', { userId: parsedUser.id, email: parsedUser.email });
          } catch (err) {
            console.error('Session restoration error:', err);
            // Clear invalid stored data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            setUser(null);
            setToken(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []); // Empty dependency array - run only once

  // Smart token verification - only when user tries to access protected resources
  const verifyTokenIfNeeded = async (forceVerify = false) => {
    if (!token || isVerifyingToken.current) return { isValid: true, user };
    
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    // Only verify if forced or if it's been more than 5 minutes since last verification
    if (!forceVerify && (now - lastVerificationTime.current) < fiveMinutes) {
      return { isValid: true, user };
    }
    
    isVerifyingToken.current = true;
    lastVerificationTime.current = now;
    
    try {
      const response = await fetch('/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        // Only update if data is significantly different
        if (data.user && data.user.id !== user?.id) {
          setUser(data.user);
          localStorage.setItem('auth_user', JSON.stringify(data.user));
        }
        return { isValid: true, user: data.user };
      } else if (response.status === 401) {
        // Token is invalid, clear stored data
        console.log('Token expired, clearing auth data');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setUser(null);
        setToken(null);
        return { isValid: false, user: null };
      }
    } catch (err) {
      console.error('Token verification error:', err);
      // Don't clear data on network errors, assume token is still valid
      return { isValid: true, user };
    } finally {
      isVerifyingToken.current = false;
    }
    
    return { isValid: true, user };
  };

  // Store user session in localStorage and cookies when user/token changes - but prevent loops
  useEffect(() => {
    if (isInitialized && user && token) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      // Set cookie for middleware to read (non-httpOnly for client access)
      // Use more explicit cookie setting
      const cookieValue = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure=${process.env.NODE_ENV === 'production'}`;
      document.cookie = cookieValue;
      
      console.log('🍪 Setting auth cookie:', { 
        token: token.substring(0, 10) + '...', 
        cookieSet: document.cookie.includes('auth_token') 
      });
    } else if (isInitialized && !user && !token) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Clear both cookies
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'payload-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      console.log('🍪 Cleared auth cookies');
    }
  }, [user, token, isInitialized]);

  const login = async (email: string, password: string): Promise<void> => {
    if (isLoading) return; // Prevent multiple simultaneous login attempts
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        setError(null);
        // Update last verification time to prevent immediate re-verification
        lastVerificationTime.current = Date.now();
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    if (isLoading) return; // Prevent multiple simultaneous register attempts
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.doc);
        setToken(data.token);
        setError(null);
        // Update last verification time to prevent immediate re-verification
        lastVerificationTime.current = Date.now();
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    console.log('🚪 Logging out user');
    
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    // Clear both cookies with explicit settings
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    document.cookie = 'payload-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    
    // Reset verification tracking
    lastVerificationTime.current = 0;
    isVerifyingToken.current = false;
    
    // Call logout API endpoint to clear server-side session
    fetch('/api/users/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch((error) => {
      console.log('Logout API call failed (non-critical):', error);
    });
    
    console.log('🚪 Logout complete');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    error,
    isInitialized,
    verifyTokenIfNeeded,
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
