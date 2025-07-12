import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Mock the unified auth hook first
vi.mock('@/app/(dashboard)/hooks/use-payload-auth', () => ({
  usePayloadAuth: vi.fn(() => ({
    user: {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
      permissions: ['read:dashboard'],
      isActive: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    token: 'valid-jwt-token',
    isAuthenticated: true,
    isLoading: false,
    error: null,
    isInitialized: true,
    permissions: ['read:dashboard'],
    roles: ['user'],
    lastActivity: new Date(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    hasPermission: vi.fn(() => true),
    hasRole: vi.fn(() => true),
    hasAnyPermission: vi.fn(() => true),
    hasAllPermissions: vi.fn(() => true),
    getSession: vi.fn(),
    updateActivity: vi.fn(),
    isTokenExpired: vi.fn(() => false),
    getTokenExpiryTime: vi.fn(),
    refreshToken: vi.fn(),
  })),
}));

// Mock the auth context
vi.mock('@/contexts/AuthContext');

// Mock next/navigation
const mockPush = vi.fn();
const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

// Mock dashboard components
vi.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: any) => <div data-testid="sidebar-provider">{children}</div>,
  SidebarInset: ({ children }: any) => <div data-testid="sidebar-inset">{children}</div>,
}));

vi.mock('@/app/(dashboard)/components/app-sidebar', () => ({
  AppSidebar: () => <div data-testid="app-sidebar">Sidebar</div>,
}));

vi.mock('@/app/(dashboard)/components/dashboard-header', () => ({
  DashboardHeader: () => <div data-testid="dashboard-header">Header</div>,
}));

vi.mock('@/components/ui/sonner', () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

vi.mock('@/app/(dashboard)/components/kbar', () => ({
  KBar: ({ children }: any) => <div data-testid="kbar">{children}</div>,
}));

vi.mock('@/app/(dashboard)/components/theme-provider', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="theme-provider">{children}</div>,
}));

// Mock CSS import
vi.mock('@/app/(dashboard)/styles.css', () => ({}));

// Create a test wrapper that simulates the actual dashboard layout client
import { DashboardLayoutClient } from '@/app/(dashboard)/components/dashboard-layout-client';

const mockUseAuth = vi.mocked(useAuth);

describe('Dashboard Layout with Authentication Guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPush.mockClear();
    mockBack.mockClear();
    
    // Default mock - authenticated user
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        permissions: ['read:dashboard'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token: 'valid-jwt-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
      isInitialized: true,
      permissions: ['read:dashboard'],
      roles: ['user'],
      lastActivity: new Date(),
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      verifyTokenIfNeeded: vi.fn(),
      hasPermission: vi.fn(() => true),
      hasRole: vi.fn(() => true),
      hasAnyPermission: vi.fn(() => true),
      hasAllPermissions: vi.fn(() => true),
      checkPermission: vi.fn(() => true),
      getSession: vi.fn(),
      updateActivity: vi.fn(),
      isTokenExpired: vi.fn(() => false),
      getTokenExpiryTime: vi.fn(),
      refreshToken: vi.fn(),
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Authentication Guards', () => {
    it('should render dashboard when user is authenticated', async () => {
      const TestChildren = () => <div data-testid="dashboard-content">Dashboard Content</div>;
      
      // Add error boundary to catch rendering errors
      class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error?: Error}> {
        constructor(props: {children: React.ReactNode}) {
          super(props);
          this.state = { hasError: false };
        }

        static getDerivedStateFromError(error: Error) {
          return { hasError: true, error };
        }

        componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
          console.error('Error in component:', error, errorInfo);
        }

        render() {
          if (this.state.hasError) {
            return <div data-testid="error-boundary">Something went wrong: {this.state.error?.message}</div>;
          }

          return this.props.children;
        }
      }
      
      await act(async () => {
        render(
          <ErrorBoundary>
            <DashboardLayoutClient>
              <TestChildren />
            </DashboardLayoutClient>
          </ErrorBoundary>
        );
      });

      // Debug: Print the actual DOM
      console.log('Rendered DOM:', document.body.innerHTML);

      // Check if error boundary caught anything
      const errorBoundary = screen.queryByTestId('error-boundary');
      if (errorBoundary) {
        console.error('Error boundary triggered:', errorBoundary.textContent);
        throw new Error(`Component failed to render: ${errorBoundary.textContent}`);
      }

      expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
      expect(screen.getByTestId('kbar')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar-provider')).toBeInTheDocument();
      expect(screen.getByTestId('app-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
    });

    it('should show loading state when authentication is initializing', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        isInitialized: false,
        permissions: [],
        roles: [],
        lastActivity: new Date(),
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        verifyTokenIfNeeded: vi.fn(),
        hasPermission: vi.fn(() => false),
        hasRole: vi.fn(() => false),
        hasAnyPermission: vi.fn(() => false),
        hasAllPermissions: vi.fn(() => false),
        checkPermission: vi.fn(() => false),
        getSession: vi.fn(),
        updateActivity: vi.fn(),
        isTokenExpired: vi.fn(() => true),
        getTokenExpiryTime: vi.fn(),
        refreshToken: vi.fn(),
      });

      const TestChildren = () => <div data-testid="dashboard-content">Dashboard Content</div>;
      
      await act(async () => {
        render(
          <DashboardLayoutClient>
            <TestChildren />
          </DashboardLayoutClient>
        );
      });

      expect(screen.getByTestId('auth-loading')).toBeInTheDocument();
      expect(screen.queryByTestId('dashboard-content')).not.toBeInTheDocument();
    });

    it('should redirect to login when user is not authenticated', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isInitialized: true,
        permissions: [],
        roles: [],
        lastActivity: new Date(),
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        verifyTokenIfNeeded: vi.fn(),
        hasPermission: vi.fn(() => false),
        hasRole: vi.fn(() => false),
        hasAnyPermission: vi.fn(() => false),
        hasAllPermissions: vi.fn(() => false),
        checkPermission: vi.fn(() => false),
        getSession: vi.fn(),
        updateActivity: vi.fn(),
        isTokenExpired: vi.fn(() => true),
        getTokenExpiryTime: vi.fn(),
        refreshToken: vi.fn(),
      });

      const TestChildren = () => <div data-testid="dashboard-content">Dashboard Content</div>;
      
      await act(async () => {
        render(
          <DashboardLayoutClient>
            <TestChildren />
          </DashboardLayoutClient>
        );
      });

      expect(screen.getByTestId('auth-redirect')).toBeInTheDocument();
      expect(screen.queryByTestId('dashboard-content')).not.toBeInTheDocument();
    });
  });
});