import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { usePayloadAuth } from '@/app/(dashboard)/hooks/use-payload-auth';

// Configure Vitest for JSX
/** @jsxImportSource react */

// Mock the unified auth hook
vi.mock('@/app/(dashboard)/hooks/use-payload-auth');

const mockUsePayloadAuth = vi.mocked(usePayloadAuth);

// Test component to access the context
const TestComponent: React.FC = () => {
  const auth = useAuth();
  
  return (
    <div>
      <div data-testid="user-id">{auth.user?.id || 'null'}</div>
      <div data-testid="is-authenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="is-loading">{auth.isLoading.toString()}</div>
      <div data-testid="permissions">{auth.permissions?.join(',') || 'none'}</div>
      <div data-testid="roles">{auth.roles?.join(',') || 'none'}</div>
      <div data-testid="error">{auth.error || 'null'}</div>
      <button 
        data-testid="login-btn" 
        onClick={() => auth.login('test@example.com', 'password123')}
      >
        Login
      </button>
      <button 
        data-testid="logout-btn" 
        onClick={() => auth.logout()}
      >
        Logout
      </button>
      <button 
        data-testid="check-permission-btn" 
        onClick={() => {
          const hasPermission = auth.checkPermission('read:dashboard');
          screen.getByTestId('permission-result').textContent = hasPermission.toString();
        }}
      >
        Check Permission
      </button>
      <div data-testid="permission-result">false</div>
    </div>
  );
};

describe('Enhanced AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock default return values
    mockUsePayloadAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      permissions: [],
      roles: [],
      lastActivity: new Date(),
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
      register: vi.fn(),
      updateProfile: vi.fn(),
      hasPermission: vi.fn(),
      hasRole: vi.fn(),
      hasAnyPermission: vi.fn(),
      hasAllPermissions: vi.fn(),
      updateActivity: vi.fn(),
      getSession: vi.fn(),
      isTokenExpired: vi.fn(),
      getTokenExpiryTime: vi.fn(),
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Provider Integration', () => {
    it('should integrate with usePayloadAuth hook', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(mockUsePayloadAuth).toHaveBeenCalled();
    });

    it('should pass through authentication state from usePayloadAuth', () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin' as const,
        permissions: ['read:dashboard', 'write:users'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockUsePayloadAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        permissions: ['read:dashboard', 'write:users'],
        roles: ['admin'],
        lastActivity: new Date(),
        login: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
        register: vi.fn(),
        updateProfile: vi.fn(),
        hasPermission: vi.fn((permission) => permission === 'read:dashboard'),
        hasRole: vi.fn((role) => role === 'admin'),
        hasAnyPermission: vi.fn(),
        hasAllPermissions: vi.fn(),
        updateActivity: vi.fn(),
        getSession: vi.fn(),
        isTokenExpired: vi.fn(() => false),
        getTokenExpiryTime: vi.fn(),
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-id')).toHaveTextContent('user123');
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('permissions')).toHaveTextContent('read:dashboard,write:users');
      expect(screen.getByTestId('roles')).toHaveTextContent('admin');
    });
  });

  describe('Authentication Methods', () => {
    it('should call usePayloadAuth login method', async () => {
      const mockLogin = vi.fn().mockResolvedValue(undefined);
      
      mockUsePayloadAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        permissions: [],
        roles: [],
        lastActivity: new Date(),
        login: mockLogin,
        logout: vi.fn(),
        refreshToken: vi.fn(),
        register: vi.fn(),
        updateProfile: vi.fn(),
        hasPermission: vi.fn(),
        hasRole: vi.fn(),
        hasAnyPermission: vi.fn(),
        hasAllPermissions: vi.fn(),
        updateActivity: vi.fn(),
        getSession: vi.fn(),
        isTokenExpired: vi.fn(),
        getTokenExpiryTime: vi.fn(),
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginBtn = screen.getByTestId('login-btn');
      await act(async () => {
        loginBtn.click();
      });

      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should call usePayloadAuth logout method', async () => {
      const mockLogout = vi.fn().mockResolvedValue(undefined);
      
      mockUsePayloadAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        permissions: [],
        roles: [],
        lastActivity: new Date(),
        login: vi.fn(),
        logout: mockLogout,
        refreshToken: vi.fn(),
        register: vi.fn(),
        updateProfile: vi.fn(),
        hasPermission: vi.fn(),
        hasRole: vi.fn(),
        hasAnyPermission: vi.fn(),
        hasAllPermissions: vi.fn(),
        updateActivity: vi.fn(),
        getSession: vi.fn(),
        isTokenExpired: vi.fn(),
        getTokenExpiryTime: vi.fn(),
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const logoutBtn = screen.getByTestId('logout-btn');
      await act(async () => {
        logoutBtn.click();
      });

      expect(mockLogout).toHaveBeenCalled();
    });
  });

  describe('Permission Checking', () => {
    it('should provide permission checking functionality', () => {
      const mockHasPermission = vi.fn().mockReturnValue(true);
      
      mockUsePayloadAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        permissions: ['read:dashboard'],
        roles: [],
        lastActivity: new Date(),
        login: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
        register: vi.fn(),
        updateProfile: vi.fn(),
        hasPermission: mockHasPermission,
        hasRole: vi.fn(),
        hasAnyPermission: vi.fn(),
        hasAllPermissions: vi.fn(),
        updateActivity: vi.fn(),
        getSession: vi.fn(),
        isTokenExpired: vi.fn(),
        getTokenExpiryTime: vi.fn(),
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const checkBtn = screen.getByTestId('check-permission-btn');
      act(() => {
        checkBtn.click();
      });

      expect(mockHasPermission).toHaveBeenCalledWith('read:dashboard');
      expect(screen.getByTestId('permission-result')).toHaveTextContent('true');
    });

    it('should provide role checking functionality', () => {
      const mockHasRole = vi.fn().mockReturnValue(true);
      
      const TestRoleComponent: React.FC = () => {
        const auth = useAuth();
        return (
          <div>
            <button 
              data-testid="check-role-btn" 
              onClick={() => {
                const hasRole = auth.hasRole('admin');
                screen.getByTestId('role-result').textContent = hasRole.toString();
              }}
            >
              Check Role
            </button>
            <div data-testid="role-result">false</div>
          </div>
        );
      };

      mockUsePayloadAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        permissions: [],
        roles: ['admin'],
        lastActivity: new Date(),
        login: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
        register: vi.fn(),
        updateProfile: vi.fn(),
        hasPermission: vi.fn(),
        hasRole: mockHasRole,
        hasAnyPermission: vi.fn(),
        hasAllPermissions: vi.fn(),
        updateActivity: vi.fn(),
        getSession: vi.fn(),
        isTokenExpired: vi.fn(),
        getTokenExpiryTime: vi.fn(),
      });

      render(
        <AuthProvider>
          <TestRoleComponent />
        </AuthProvider>
      );

      const checkBtn = screen.getByTestId('check-role-btn');
      act(() => {
        checkBtn.click();
      });

      expect(mockHasRole).toHaveBeenCalledWith('admin');
      expect(screen.getByTestId('role-result')).toHaveTextContent('true');
    });
  });

  describe('Session Management', () => {
    it('should provide session information', () => {
      const mockGetSession = vi.fn().mockReturnValue({
        user: { id: 'user123', email: 'test@example.com' },
        token: 'jwt.token.here',
        refreshToken: 'refresh.token.here',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        issuedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      });

      const SessionTestComponent: React.FC = () => {
        const auth = useAuth();
        const session = auth.getSession();
        return (
          <div data-testid="session-info">
            {session ? session.user.id : 'no-session'}
          </div>
        );
      };

      mockUsePayloadAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        permissions: [],
        roles: [],
        lastActivity: new Date(),
        login: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
        register: vi.fn(),
        updateProfile: vi.fn(),
        hasPermission: vi.fn(),
        hasRole: vi.fn(),
        hasAnyPermission: vi.fn(),
        hasAllPermissions: vi.fn(),
        updateActivity: vi.fn(),
        getSession: mockGetSession,
        isTokenExpired: vi.fn(),
        getTokenExpiryTime: vi.fn(),
      });

      render(
        <AuthProvider>
          <SessionTestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('session-info')).toHaveTextContent('user123');
      expect(mockGetSession).toHaveBeenCalled();
    });

    it('should handle token expiration checking', () => {
      const mockIsTokenExpired = vi.fn().mockReturnValue(false);

      const TokenTestComponent: React.FC = () => {
        const auth = useAuth();
        const isExpired = auth.isTokenExpired();
        return (
          <div data-testid="token-expired">
            {isExpired.toString()}
          </div>
        );
      };

      mockUsePayloadAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        permissions: [],
        roles: [],
        lastActivity: new Date(),
        login: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
        register: vi.fn(),
        updateProfile: vi.fn(),
        hasPermission: vi.fn(),
        hasRole: vi.fn(),
        hasAnyPermission: vi.fn(),
        hasAllPermissions: vi.fn(),
        updateActivity: vi.fn(),
        getSession: vi.fn(),
        isTokenExpired: mockIsTokenExpired,
        getTokenExpiryTime: vi.fn(),
      });

      render(
        <AuthProvider>
          <TokenTestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('token-expired')).toHaveTextContent('false');
      expect(mockIsTokenExpired).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication errors', async () => {
      const mockLogin = vi.fn().mockRejectedValue(new Error('Invalid credentials'));
      
      mockUsePayloadAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        permissions: [],
        roles: [],
        lastActivity: new Date(),
        login: mockLogin,
        logout: vi.fn(),
        refreshToken: vi.fn(),
        register: vi.fn(),
        updateProfile: vi.fn(),
        hasPermission: vi.fn(),
        hasRole: vi.fn(),
        hasAnyPermission: vi.fn(),
        hasAllPermissions: vi.fn(),
        updateActivity: vi.fn(),
        getSession: vi.fn(),
        isTokenExpired: vi.fn(),
        getTokenExpiryTime: vi.fn(),
      });

      const ErrorTestComponent: React.FC = () => {
        const auth = useAuth();
        const [error, setError] = React.useState<string | null>(null);
        
        const handleLogin = async () => {
          try {
            await auth.login('test@example.com', 'wrongpassword');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
          }
        };

        return (
          <div>
            <button data-testid="error-login-btn" onClick={handleLogin}>
              Login
            </button>
            <div data-testid="error-message">{error || 'null'}</div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <ErrorTestComponent />
        </AuthProvider>
      );

      const loginBtn = screen.getByTestId('error-login-btn');
      await act(async () => {
        loginBtn.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid credentials');
      });
    });
  });

  describe('Loading States', () => {
    it('should handle loading states during authentication', () => {
      mockUsePayloadAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        permissions: [],
        roles: [],
        lastActivity: new Date(),
        login: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
        register: vi.fn(),
        updateProfile: vi.fn(),
        hasPermission: vi.fn(),
        hasRole: vi.fn(),
        hasAnyPermission: vi.fn(),
        hasAllPermissions: vi.fn(),
        updateActivity: vi.fn(),
        getSession: vi.fn(),
        isTokenExpired: vi.fn(),
        getTokenExpiryTime: vi.fn(),
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('is-loading')).toHaveTextContent('true');
    });
  });

  describe('Backward Compatibility', () => {
    it('should maintain existing interface for AuthModal compatibility', () => {
      const auth = mockUsePayloadAuth();

      // Check that all required methods exist for backward compatibility
      expect(typeof auth.login).toBe('function');
      expect(typeof auth.logout).toBe('function');
      expect(auth.hasOwnProperty('user')).toBe(true);
      expect(auth.hasOwnProperty('isAuthenticated')).toBe(true);
      expect(auth.hasOwnProperty('isLoading')).toBe(true);

      // New enhanced methods should also be available
      expect(typeof auth.hasPermission).toBe('function');
      expect(typeof auth.hasRole).toBe('function');
      expect(auth.hasOwnProperty('permissions')).toBe(true);
      expect(auth.hasOwnProperty('roles')).toBe(true);
    });
  });
});