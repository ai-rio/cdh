import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePayloadAuth } from '@/app/(dashboard)/hooks/use-payload-auth';
import { authService } from '@/lib/auth-service';
import { PayloadClient } from '@/lib/payload-client';

// Mock dependencies
vi.mock('@/lib/auth-service');
vi.mock('@/lib/payload-client');

const mockAuthService = vi.mocked(authService);
const MockedPayloadClient = vi.mocked(PayloadClient);

describe('usePayloadAuth Hook', () => {
  let mockPayloadClient: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock PayloadClient instance
    mockPayloadClient = {
      login: vi.fn(),
      logout: vi.fn(),
      me: vi.fn(),
      initializeAuth: vi.fn(),
    };
    
    MockedPayloadClient.mockImplementation(() => mockPayloadClient);
    
    // Mock auth service methods
    mockAuthService.login.mockReset();
    mockAuthService.logout.mockReset();
    mockAuthService.refreshToken.mockReset();
    mockAuthService.register.mockReset();
    mockAuthService.getCurrentUser.mockReset();
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => usePayloadAuth());

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.permissions).toEqual([]);
      expect(result.current.roles).toEqual([]);
      expect(typeof result.current.login).toBe('function');
      expect(typeof result.current.logout).toBe('function');
      expect(typeof result.current.refreshToken).toBe('function');
      expect(typeof result.current.hasPermission).toBe('function');
      expect(typeof result.current.hasRole).toBe('function');
    });

    it('should initialize auth from localStorage if available', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user' as const,
        permissions: ['read:dashboard', 'read:media'], // Include expected permissions for user role
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      (window.localStorage.getItem as any).mockImplementation((key: string) => {
        if (key === 'auth_token') return 'stored.jwt.token';
        if (key === 'auth_user') return JSON.stringify(mockUser);
        return null;
      });

      mockPayloadClient.me.mockResolvedValue(mockUser);

      const { result } = renderHook(() => usePayloadAuth());

      await waitFor(() => {
        expect(result.current.user).toMatchObject({
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
          isActive: true,
        });
        expect(result.current.user?.permissions).toEqual(['read:dashboard', 'read:media']);
        expect(result.current.isAuthenticated).toBe(true);
      });
    });
  });

  describe('Login Function', () => {
    it('should handle successful login', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user' as const,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const loginResponse = {
        user: mockUser,
        token: 'new.jwt.token',
        exp: Date.now() + 3600000
      };

      mockAuthService.login.mockResolvedValue(loginResponse);
      mockPayloadClient.login.mockResolvedValue({
        user: mockUser,
        token: 'new.jwt.token'
      });

      const { result } = renderHook(() => usePayloadAuth());

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(result.current.user).toMatchObject({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        isActive: true,
      });
      expect(result.current.user?.permissions).toEqual(['read:dashboard', 'read:media']);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockPayloadClient.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should handle login failure', async () => {
      const loginError = new Error('Invalid credentials');
      mockAuthService.login.mockRejectedValue(loginError);

      const { result } = renderHook(() => usePayloadAuth());

      await act(async () => {
        await expect(result.current.login('test@example.com', 'wrongpassword'))
          .rejects.toThrow('Invalid credentials');
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should set loading state during login', async () => {
      let resolveLogin: (value: any) => void;
      const loginPromise = new Promise(resolve => {
        resolveLogin = resolve;
      });

      mockAuthService.login.mockReturnValue(loginPromise);

      const { result } = renderHook(() => usePayloadAuth());

      act(() => {
        result.current.login('test@example.com', 'password123');
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveLogin!({
          user: { id: '1', email: 'test@example.com', role: 'user', permissions: [] },
          token: 'token'
        });
        await loginPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Logout Function', () => {
    it('should handle logout correctly', async () => {
      // Set up successful login first
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user' as const,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const loginResponse = {
        user: mockUser,
        token: 'new.jwt.token',
        exp: Date.now() + 3600000
      };

      mockAuthService.login.mockResolvedValue(loginResponse);
      mockPayloadClient.login.mockResolvedValue({
        user: mockUser,
        token: 'new.jwt.token'
      });

      // Mock logout methods
      mockAuthService.logout.mockResolvedValue(undefined);
      mockPayloadClient.logout.mockResolvedValue(undefined);

      const { result } = renderHook(() => usePayloadAuth());

      // First set a user
      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      // Verify user is logged in
      expect(result.current.user).toBeTruthy();
      expect(result.current.isAuthenticated).toBe(true);

      // Now test logout
      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(mockPayloadClient.logout).toHaveBeenCalled();
    });
  });

  describe('Token Refresh', () => {
    it('should refresh token successfully', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user' as const,
        permissions: ['read:dashboard'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const refreshResponse = {
        user: mockUser,
        token: 'refreshed.jwt.token',
        exp: Date.now() + 3600000
      };

      mockAuthService.refreshToken.mockResolvedValue(refreshResponse);
      (window.localStorage.getItem as any).mockReturnValue('old.jwt.token');

      const { result } = renderHook(() => usePayloadAuth());

      await act(async () => {
        await result.current.refreshToken();
      });

      expect(mockAuthService.refreshToken).toHaveBeenCalledWith('old.jwt.token');
    });

    it('should handle refresh token failure', async () => {
      const refreshError = new Error('Token expired');
      mockAuthService.refreshToken.mockRejectedValue(refreshError);
      (window.localStorage.getItem as any).mockReturnValue('expired.jwt.token');

      const { result } = renderHook(() => usePayloadAuth());

      await act(async () => {
        await expect(result.current.refreshToken()).rejects.toThrow('Token expired');
      });
    });
  });

  describe('Permission Checking', () => {
    it('should check permissions correctly', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin' as const,
        permissions: ['read:dashboard', 'write:users'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockAuthService.login.mockResolvedValue({
        user: mockUser,
        token: 'jwt.token'
      });

      const { result } = renderHook(() => usePayloadAuth());

      await act(async () => {
        await result.current.login('admin@example.com', 'password123');
      });

      expect(result.current.hasPermission('read:dashboard')).toBe(true);
      expect(result.current.hasPermission('write:users')).toBe(true);
      expect(result.current.hasPermission('admin:system')).toBe(false);
    });

    it('should check roles correctly', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin' as const,
        permissions: ['read:dashboard', 'write:users'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockAuthService.login.mockResolvedValue({
        user: mockUser,
        token: 'jwt.token'
      });

      const { result } = renderHook(() => usePayloadAuth());

      await act(async () => {
        await result.current.login('admin@example.com', 'password123');
      });

      expect(result.current.hasRole('admin')).toBe(true);
      expect(result.current.hasRole('user')).toBe(false);
      expect(result.current.hasRole('super_admin')).toBe(false);
    });
  });

  describe('Session Management', () => {
    it('should update last activity on user actions', async () => {
      const { result } = renderHook(() => usePayloadAuth());

      const initialActivity = result.current.lastActivity;
      
      // Simulate some delay
      await new Promise(resolve => setTimeout(resolve, 10));

      await act(async () => {
        result.current.updateActivity();
      });

      expect(result.current.lastActivity).not.toEqual(initialActivity);
    });

    it('should handle token expiration gracefully', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user' as const,
        permissions: ['read:dashboard'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Mock expired token
      (window.localStorage.getItem as any).mockImplementation((key: string) => {
        if (key === 'auth_token') return 'expired.jwt.token';
        if (key === 'auth_user') return JSON.stringify(mockUser);
        return null;
      });

      mockPayloadClient.me.mockRejectedValue(new Error('Token expired'));

      const { result } = renderHook(() => usePayloadAuth());

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network error');
      mockAuthService.login.mockRejectedValue(networkError);

      const { result } = renderHook(() => usePayloadAuth());

      await act(async () => {
        await expect(result.current.login('test@example.com', 'password123'))
          .rejects.toThrow('Network error');
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle invalid user data gracefully', async () => {
      mockAuthService.login.mockResolvedValue({
        user: null,
        token: 'token'
      });

      const { result } = renderHook(() => usePayloadAuth());

      await act(async () => {
        await expect(result.current.login('test@example.com', 'password123'))
          .rejects.toThrow();
      });
    });
  });
});