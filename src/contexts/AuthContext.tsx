'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  // Load user session from localStorage and verify with server on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      
      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          // Verify token with server
          const response = await fetch('/api/users/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setToken(data.token || storedToken);
            
            // Update stored data if server returned updated info
            if (data.token && data.token !== storedToken) {
              localStorage.setItem('auth_token', data.token);
            }
            localStorage.setItem('auth_user', JSON.stringify(data.user));
          } else {
            // Token is invalid, clear stored data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
          }
        } catch (err) {
          console.error('Session restoration error:', err);
          // Clear invalid stored data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }
      
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  // Store user session in localStorage when user/token changes
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }, [user, token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific HTTP errors
        if (response.status === 401) {
          throw new Error(data.message || 'Invalid email or password');
        } else if (response.status === 423) {
          throw new Error(data.message || 'Account is temporarily locked. Please try again later.');
        } else if (response.status === 429) {
          throw new Error('Too many login attempts. Please try again later.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(data.message || 'Login failed. Please check your credentials.');
        }
      }

      if (data.user && data.token) {
        setUser(data.user);
        setToken(data.token);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.message || 'An unexpected error occurred during login');
      }
      throw err; // Re-throw to allow component to handle if needed
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific HTTP errors
        if (response.status === 400) {
          throw new Error(data.message || 'Invalid registration data');
        } else if (response.status === 409) {
          throw new Error(data.message || 'An account with this email already exists');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(data.message || 'Registration failed. Please try again.');
        }
      }

      if (data.user && data.token) {
        setUser(data.user);
        setToken(data.token);
      } else if (data.user) {
        // User created but not logged in automatically
        throw new Error('Account created successfully. Please log in.');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.message || 'An unexpected error occurred during registration');
      }
      throw err; // Re-throw to allow component to handle if needed
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setError(null);
    
    // Clear token from storage immediately
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    // Call logout endpoint to invalidate token on server
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });
    } catch (error) {
      // Ignore logout endpoint errors - user is logged out locally anyway
      console.warn('Logout endpoint error (non-critical):', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      logout, 
      isLoading, 
      error, 
      isInitialized 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};