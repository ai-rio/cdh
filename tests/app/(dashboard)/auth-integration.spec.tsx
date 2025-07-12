import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';

// Create a minimal test for auth guard in isolation
const mockUseAuth = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
  AuthProvider: ({ children }: any) => <div data-testid="auth-provider">{children}</div>,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock('lucide-react', () => ({
  Loader2: () => <div data-testid="loader">Loading...</div>,
}));

import { AuthGuard } from '@/app/(dashboard)/components/auth-guard';

describe('AuthGuard Component Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render children when user is authenticated', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      error: null,
      isInitialized: true,
      hasPermission: vi.fn(() => true),
      updateActivity: vi.fn(),
    });

    const TestChildren = () => <div data-testid="dashboard-content">Dashboard Content</div>;
    
    await act(async () => {
      render(
        <AuthGuard requireAuth={true} requirePermissions={['read:dashboard']} fallbackPath="/">
          <TestChildren />
        </AuthGuard>
      );
    });

    expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
  });

  it('should show loading state when authentication is initializing', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      error: null,
      isInitialized: false,
      hasPermission: vi.fn(() => false),
      updateActivity: vi.fn(),
    });

    const TestChildren = () => <div data-testid="dashboard-content">Dashboard Content</div>;
    
    await act(async () => {
      render(
        <AuthGuard requireAuth={true} requirePermissions={['read:dashboard']} fallbackPath="/">
          <TestChildren />
        </AuthGuard>
      );
    });

    expect(screen.getByTestId('auth-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('dashboard-content')).not.toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: true,
      hasPermission: vi.fn(() => false),
      updateActivity: vi.fn(),
    });

    const TestChildren = () => <div data-testid="dashboard-content">Dashboard Content</div>;
    
    await act(async () => {
      render(
        <AuthGuard requireAuth={true} requirePermissions={['read:dashboard']} fallbackPath="/">
          <TestChildren />
        </AuthGuard>
      );
    });

    expect(screen.getByTestId('auth-redirect')).toBeInTheDocument();
    expect(screen.queryByTestId('dashboard-content')).not.toBeInTheDocument();
  });
});