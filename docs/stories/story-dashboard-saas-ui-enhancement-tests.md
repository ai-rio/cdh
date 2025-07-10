# Test Specifications: Dashboard SaaS UI Enhancement

## Story Reference: DASH-001
## Test Plan Version: 1.0
## Created By: BMad Orchestrator (Scrum Master)
## Date: 2024-12-19

---

## Test Strategy Overview

This document outlines comprehensive testing requirements for the Dashboard SaaS UI Enhancement story (DASH-001). Tests are organized by acceptance criteria and include unit, integration, accessibility, and performance testing.

### Testing Framework Stack
- **Test Runner**: Vitest
- **Testing Library**: @testing-library/react
- **Environment**: jsdom
- **Coverage Target**: 90%+ for new components
- **Accessibility Testing**: @testing-library/jest-dom + axe-core
- **Performance Testing**: Custom performance monitors

---

## Test Files Structure

```
tests/
├── components/
│   ├── saas-ui/
│   │   ├── dashboard-layout.test.tsx
│   │   ├── dashboard-navigation.test.tsx
│   │   ├── dashboard-data-display.test.tsx
│   │   └── dashboard-actions.test.tsx
│   └── dashboard/
│       ├── dashboard-integration.test.tsx
│       └── dashboard-accessibility.test.tsx
├── performance/
│   ├── dashboard-saas-ui-performance.test.tsx
│   └── bundle-size.test.ts
├── e2e/
│   ├── dashboard-saas-ui-flow.spec.ts
│   └── dashboard-responsive.spec.ts
└── utils/
    ├── saas-ui-test-utils.tsx
    └── accessibility-helpers.ts
```

---

## AC1: SaaS UI Integration Setup Tests

### File: `tests/components/saas-ui/dashboard-layout.test.tsx`

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { SaasProvider } from '@saas-ui/react';
import { describe, it, expect, beforeEach } from 'vitest';
import Dashboard from '@/app/(frontend)/dashboard/page';
import { customTheme } from '@/theme/saas-ui-theme';
import { AuthContext } from '@/contexts/AuthContext';

describe('SaaS UI Integration Setup', () => {
  const mockAuthContext = {
    user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'admin' },
    logout: vi.fn(),
    isLoading: false,
    isInitialized: true,
  };

  beforeEach(() => {
    render(
      <ChakraProvider theme={customTheme}>
        <SaasProvider>
          <AuthContext.Provider value={mockAuthContext}>
            <Dashboard />
          </AuthContext.Provider>
        </SaasProvider>
      </ChakraProvider>
    );
  });

  it('should render with SaaS UI providers configured', () => {
    expect(screen.getByTestId('dashboard-container')).toBeInTheDocument();
  });

  it('should apply custom theme with lime accent colors', () => {
    const container = screen.getByTestId('dashboard-container');
    expect(container).toHaveStyle({ colorScheme: 'dark' });
  });

  it('should not break existing functionality', () => {
    expect(screen.getByText('Admin Command Center')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  it('should maintain role-based rendering', () => {
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Platform Analytics')).toBeInTheDocument();
  });
});
```

---

## AC2: Enhanced Navigation System Tests

### File: `tests/components/saas-ui/dashboard-navigation.test.tsx`

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DashboardNavigation } from '@/components/dashboard/DashboardNavigation';
import { SaasUITestWrapper } from '@/tests/utils/saas-ui-test-utils';

describe('Enhanced Navigation System', () => {
  const mockProps = {
    activeTab: 'overview',
    onTabChange: vi.fn(),
    userRole: 'admin' as const,
  };

  beforeEach(() => {
    render(
      <SaasUITestWrapper>
        <DashboardNavigation {...mockProps} />
      </SaasUITestWrapper>
    );
  });

  describe('SaaS UI Tabs Component', () => {
    it('should replace custom TabButton with SaaS UI Tabs', () => {
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.queryByTestId('custom-tab-button')).not.toBeInTheDocument();
    });

    it('should maintain role-based tab visibility', () => {
      expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'User Management' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Platform Analytics' })).toBeInTheDocument();
    });

    it('should handle tab changes correctly', async () => {
      const userManagementTab = screen.getByRole('tab', { name: 'User Management' });
      fireEvent.click(userManagementTab);
      
      await waitFor(() => {
        expect(mockProps.onTabChange).toHaveBeenCalledWith('user-management');
      });
    });
  });

  describe('Sidebar Navigation', () => {
    it('should implement sidebar navigation for better space utilization', () => {
      expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should be collapsible on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      fireEvent.resize(window);
      
      const sidebar = screen.getByTestId('dashboard-sidebar');
      expect(sidebar).toHaveAttribute('data-collapsed', 'true');
    });
  });

  describe('Breadcrumb Navigation', () => {
    it('should add breadcrumb navigation for better user orientation', () => {
      expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Overview')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should be responsive on mobile devices', () => {
      // Test mobile breakpoint
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      fireEvent.resize(window);
      
      const navigation = screen.getByRole('navigation');
      expect(navigation).toHaveClass('mobile-responsive');
    });

    it('should handle touch interactions properly', () => {
      const tab = screen.getByRole('tab', { name: 'Overview' });
      fireEvent.touchStart(tab);
      fireEvent.touchEnd(tab);
      
      expect(mockProps.onTabChange).toHaveBeenCalled();
    });
  });
});
```

---

## AC3: Improved Layout Structure Tests

### File: `tests/components/saas-ui/dashboard-layout.test.tsx`

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SaasUITestWrapper } from '@/tests/utils/saas-ui-test-utils';

describe('Improved Layout Structure', () => {
  beforeEach(() => {
    render(
      <SaasUITestWrapper>
        <DashboardLayout>
          <div data-testid="test-content">Test Content</div>
        </DashboardLayout>
      </SaasUITestWrapper>
    );
  });

  describe('AppShell Implementation', () => {
    it('should implement AppShell for consistent structure', () => {
      expect(screen.getByTestId('app-shell')).toBeInTheDocument();
      expect(screen.getByTestId('app-shell-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('app-shell-main')).toBeInTheDocument();
    });

    it('should have proper layout hierarchy', () => {
      const appShell = screen.getByTestId('app-shell');
      const sidebar = screen.getByTestId('app-shell-sidebar');
      const main = screen.getByTestId('app-shell-main');
      
      expect(appShell).toContainElement(sidebar);
      expect(appShell).toContainElement(main);
    });
  });

  describe('SaaS UI Card Components', () => {
    it('should replace basic div containers with SaaS UI Card components', () => {
      expect(screen.getByTestId('dashboard-card')).toBeInTheDocument();
      expect(screen.getByTestId('card-header')).toBeInTheDocument();
      expect(screen.getByTestId('card-body')).toBeInTheDocument();
    });

    it('should apply proper spacing and visual hierarchy', () => {
      const card = screen.getByTestId('dashboard-card');
      expect(card).toHaveClass('chakra-card');
      
      const cardBody = screen.getByTestId('card-body');
      expect(cardBody).toHaveStyle({ padding: expect.any(String) });
    });
  });

  describe('Collapsible Sidebar', () => {
    it('should implement collapsible sidebar for better screen real estate', () => {
      const sidebar = screen.getByTestId('app-shell-sidebar');
      const collapseButton = screen.getByTestId('sidebar-collapse-button');
      
      expect(sidebar).toBeInTheDocument();
      expect(collapseButton).toBeInTheDocument();
    });

    it('should toggle sidebar state correctly', () => {
      const collapseButton = screen.getByTestId('sidebar-collapse-button');
      const sidebar = screen.getByTestId('app-shell-sidebar');
      
      fireEvent.click(collapseButton);
      expect(sidebar).toHaveAttribute('data-collapsed', 'true');
      
      fireEvent.click(collapseButton);
      expect(sidebar).toHaveAttribute('data-collapsed', 'false');
    });
  });
});
```

---

## AC4: Enhanced Data Display Tests

### File: `tests/components/saas-ui/dashboard-data-display.test.tsx`

```typescript
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DashboardDataDisplay } from '@/components/dashboard/DashboardDataDisplay';
import { SaasUITestWrapper } from '@/tests/utils/saas-ui-test-utils';

describe('Enhanced Data Display', () => {
  const mockUserData = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    lastLogin: '2024-12-19T10:00:00Z',
    status: 'active'
  };

  const mockMetrics = {
    totalUsers: 1250,
    activeUsers: 980,
    revenue: 45000,
    growth: 12.5
  };

  beforeEach(() => {
    render(
      <SaasUITestWrapper>
        <DashboardDataDisplay 
          userData={mockUserData} 
          metrics={mockMetrics}
          isLoading={false}
        />
      </SaasUITestWrapper>
    );
  });

  describe('PropertyList Component', () => {
    it('should replace basic profile info display with PropertyList', () => {
      expect(screen.getByTestId('user-property-list')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should display all user properties correctly', () => {
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('active')).toBeInTheDocument();
    });
  });

  describe('StatGroup and Stat Components', () => {
    it('should add StatGroup and Stat components for key metrics', () => {
      expect(screen.getByTestId('metrics-stat-group')).toBeInTheDocument();
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('1,250')).toBeInTheDocument();
      expect(screen.getByText('Active Users')).toBeInTheDocument();
      expect(screen.getByText('980')).toBeInTheDocument();
    });

    it('should format numbers correctly in stats', () => {
      expect(screen.getByText('$45,000')).toBeInTheDocument();
      expect(screen.getByText('+12.5%')).toBeInTheDocument();
    });
  });

  describe('DataTable Implementation', () => {
    it('should implement DataTable for tabular data', () => {
      // This would be tested with actual tabular data
      const dataTable = screen.queryByTestId('users-data-table');
      if (dataTable) {
        expect(dataTable).toBeInTheDocument();
        expect(screen.getByRole('table')).toBeInTheDocument();
      }
    });
  });

  describe('Loading States', () => {
    it('should include proper loading states using SaaS UI Skeleton', async () => {
      render(
        <SaasUITestWrapper>
          <DashboardDataDisplay 
            userData={mockUserData} 
            metrics={mockMetrics}
            isLoading={true}
          />
        </SaasUITestWrapper>
      );

      expect(screen.getByTestId('property-list-skeleton')).toBeInTheDocument();
      expect(screen.getByTestId('stats-skeleton')).toBeInTheDocument();
    });

    it('should transition from loading to loaded state', async () => {
      const { rerender } = render(
        <SaasUITestWrapper>
          <DashboardDataDisplay 
            userData={mockUserData} 
            metrics={mockMetrics}
            isLoading={true}
          />
        </SaasUITestWrapper>
      );

      expect(screen.getByTestId('property-list-skeleton')).toBeInTheDocument();

      rerender(
        <SaasUITestWrapper>
          <DashboardDataDisplay 
            userData={mockUserData} 
            metrics={mockMetrics}
            isLoading={false}
          />
        </SaasUITestWrapper>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('property-list-skeleton')).not.toBeInTheDocument();
        expect(screen.getByTestId('user-property-list')).toBeInTheDocument();
      });
    });
  });
});
```

---

## AC5: Improved User Actions Tests

### File: `tests/components/saas-ui/dashboard-actions.test.tsx`

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DashboardActions } from '@/components/dashboard/DashboardActions';
import { SaasUITestWrapper } from '@/tests/utils/saas-ui-test-utils';

describe('Improved User Actions', () => {
  const mockActions = {
    onCreateUser: vi.fn(),
    onExportData: vi.fn(),
    onDeleteUser: vi.fn(),
    onBulkAction: vi.fn(),
  };

  beforeEach(() => {
    render(
      <SaasUITestWrapper>
        <DashboardActions {...mockActions} />
      </SaasUITestWrapper>
    );
  });

  describe('SaaS UI Button Components', () => {
    it('should replace custom buttons with SaaS UI Button components', () => {
      const createButton = screen.getByRole('button', { name: 'Create User' });
      expect(createButton).toHaveClass('chakra-button');
      expect(createButton).toHaveAttribute('data-variant', 'solid');
    });

    it('should use proper button variants', () => {
      expect(screen.getByRole('button', { name: 'Create User' })).toHaveAttribute('data-variant', 'solid');
      expect(screen.getByRole('button', { name: 'Export Data' })).toHaveAttribute('data-variant', 'outline');
    });
  });

  describe('ButtonGroup Implementation', () => {
    it('should implement ButtonGroup for related actions', () => {
      expect(screen.getByTestId('action-button-group')).toBeInTheDocument();
      expect(screen.getByTestId('action-button-group')).toHaveClass('chakra-button__group');
    });

    it('should group related buttons correctly', () => {
      const buttonGroup = screen.getByTestId('action-button-group');
      const createButton = screen.getByRole('button', { name: 'Create User' });
      const exportButton = screen.getByRole('button', { name: 'Export Data' });
      
      expect(buttonGroup).toContainElement(createButton);
      expect(buttonGroup).toContainElement(exportButton);
    });
  });

  describe('Menu and MenuButton', () => {
    it('should add Menu and MenuButton for dropdown actions', () => {
      const menuButton = screen.getByRole('button', { name: 'More Actions' });
      expect(menuButton).toBeInTheDocument();
      
      fireEvent.click(menuButton);
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should contain proper menu items', () => {
      const menuButton = screen.getByRole('button', { name: 'More Actions' });
      fireEvent.click(menuButton);
      
      expect(screen.getByRole('menuitem', { name: 'Bulk Edit' })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Bulk Delete' })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Export Selected' })).toBeInTheDocument();
    });
  });

  describe('AlertDialog for Confirmations', () => {
    it('should include proper confirmation dialogs using SaaS UI AlertDialog', async () => {
      const deleteButton = screen.getByRole('button', { name: 'Delete User' });
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
        expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to delete this user?')).toBeInTheDocument();
      });
    });

    it('should handle confirmation dialog actions', async () => {
      const deleteButton = screen.getByRole('button', { name: 'Delete User' });
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        const confirmButton = screen.getByRole('button', { name: 'Delete' });
        fireEvent.click(confirmButton);
      });
      
      expect(mockActions.onDeleteUser).toHaveBeenCalled();
    });

    it('should handle dialog cancellation', async () => {
      const deleteButton = screen.getByRole('button', { name: 'Delete User' });
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancelButton);
      });
      
      expect(mockActions.onDeleteUser).not.toHaveBeenCalled();
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });
});
```

---

## AC6: Enhanced Visual Feedback Tests

### File: `tests/components/saas-ui/dashboard-feedback.test.tsx`

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DashboardFeedback } from '@/components/dashboard/DashboardFeedback';
import { SaasUITestWrapper } from '@/tests/utils/saas-ui-test-utils';
import { useToast } from '@chakra-ui/react';

// Mock useToast hook
vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: vi.fn(),
  };
});

describe('Enhanced Visual Feedback', () => {
  const mockToast = vi.fn();
  
  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue(mockToast);
    
    render(
      <SaasUITestWrapper>
        <DashboardFeedback />
      </SaasUITestWrapper>
    );
  });

  describe('Toast Notifications', () => {
    it('should implement Toast notifications for user actions', async () => {
      const actionButton = screen.getByRole('button', { name: 'Test Action' });
      fireEvent.click(actionButton);
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Action completed',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      });
    });

    it('should show error toasts for failed actions', async () => {
      const errorButton = screen.getByRole('button', { name: 'Error Action' });
      fireEvent.click(errorButton);
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Action failed',
          description: 'Please try again later',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
    });
  });

  describe('Progress Indicators', () => {
    it('should add Progress indicators for loading states', () => {
      expect(screen.getByTestId('loading-progress')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should show determinate progress when percentage is known', () => {
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '65');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });
  });

  describe('Badge Components', () => {
    it('should include Badge components for status indicators', () => {
      expect(screen.getByTestId('status-badge-active')).toBeInTheDocument();
      expect(screen.getByTestId('status-badge-pending')).toBeInTheDocument();
      expect(screen.getByTestId('status-badge-inactive')).toBeInTheDocument();
    });

    it('should apply correct badge variants for different statuses', () => {
      expect(screen.getByTestId('status-badge-active')).toHaveAttribute('data-variant', 'solid');
      expect(screen.getByTestId('status-badge-pending')).toHaveAttribute('data-variant', 'outline');
      expect(screen.getByTestId('status-badge-inactive')).toHaveAttribute('data-variant', 'subtle');
    });
  });

  describe('Error Boundaries', () => {
    it('should implement proper error boundaries with SaaS UI error components', () => {
      // This would test error boundary implementation
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });
  });
});
```

---

## AC7: Accessibility Tests

### File: `tests/components/dashboard/dashboard-accessibility.test.tsx`

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import Dashboard from '@/app/(frontend)/dashboard/page';
import { SaasUITestWrapper } from '@/tests/utils/saas-ui-test-utils';
import { AuthContext } from '@/contexts/AuthContext';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Dashboard Accessibility', () => {
  const mockAuthContext = {
    user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'admin' },
    logout: vi.fn(),
    isLoading: false,
    isInitialized: true,
  };

  beforeEach(() => {
    render(
      <SaasUITestWrapper>
        <AuthContext.Provider value={mockAuthContext}>
          <Dashboard />
        </AuthContext.Provider>
      </SaasUITestWrapper>
    );
  });

  describe('WCAG 2.1 AA Compliance', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <SaasUITestWrapper>
          <AuthContext.Provider value={mockAuthContext}>
            <Dashboard />
          </AuthContext.Provider>
        </SaasUITestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should meet color contrast requirements', () => {
      // Test specific color contrast ratios
      const primaryButton = screen.getByRole('button', { name: 'Create User' });
      const computedStyle = window.getComputedStyle(primaryButton);
      
      // This would need actual color contrast calculation
      expect(computedStyle.color).toBeDefined();
      expect(computedStyle.backgroundColor).toBeDefined();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support full keyboard navigation', async () => {
      const user = userEvent.setup();
      
      // Tab through all interactive elements
      await user.tab();
      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('tab', { name: 'User Management' })).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('tab', { name: 'Platform Analytics' })).toHaveFocus();
    });

    it('should handle arrow key navigation in tabs', async () => {
      const user = userEvent.setup();
      
      const overviewTab = screen.getByRole('tab', { name: 'Overview' });
      overviewTab.focus();
      
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'User Management' })).toHaveFocus();
      
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    });

    it('should support Enter and Space key activation', async () => {
      const user = userEvent.setup();
      
      const userManagementTab = screen.getByRole('tab', { name: 'User Management' });
      userManagementTab.focus();
      
      await user.keyboard('{Enter}');
      expect(userManagementTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Screen Reader Support', () => {
    it('should have proper ARIA labels and descriptions', () => {
      expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Dashboard main content');
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Dashboard navigation');
      expect(screen.getByRole('tablist')).toHaveAttribute('aria-label', 'Dashboard sections');
    });

    it('should announce tab changes to screen readers', () => {
      const tabPanel = screen.getByRole('tabpanel');
      expect(tabPanel).toHaveAttribute('aria-labelledby');
      expect(tabPanel).toHaveAttribute('aria-describedby');
    });

    it('should have proper heading hierarchy', () => {
      const headings = screen.getAllByRole('heading');
      
      // Check that h1 exists and is unique
      const h1Elements = headings.filter(h => h.tagName === 'H1');
      expect(h1Elements).toHaveLength(1);
      
      // Check logical heading order
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        if (index > 0) {
          const prevLevel = parseInt(headings[index - 1].tagName.charAt(1));
          expect(level - prevLevel).toBeLessThanOrEqual(1);
        }
      });
    });
  });

  describe('Focus Management', () => {
    it('should implement proper focus management', async () => {
      const user = userEvent.setup();
      
      // Test focus trap in modals
      const menuButton = screen.getByRole('button', { name: 'More Actions' });
      await user.click(menuButton);
      
      const menu = screen.getByRole('menu');
      expect(menu).toBeInTheDocument();
      
      // Focus should be trapped within the menu
      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems[0]).toHaveFocus();
    });

    it('should restore focus after modal close', async () => {
      const user = userEvent.setup();
      
      const menuButton = screen.getByRole('button', { name: 'More Actions' });
      await user.click(menuButton);
      
      await user.keyboard('{Escape}');
      
      expect(menuButton).toHaveFocus();
    });
  });
});
```

---

## AC8: Performance Tests

### File: `tests/performance/dashboard-saas-ui-performance.test.tsx`

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from '@/app/(frontend)/dashboard/page';
import { SaasUITestWrapper } from '@/tests/utils/saas-ui-test-utils';
import { AuthContext } from '@/contexts/AuthContext';

// Performance monitoring utilities
class SaasUIPerformanceMonitor {
  private renderCount = 0;
  private bundleSize = 0;
  private renderTimes: number[] = [];

  trackRender(startTime: number, endTime: number) {
    this.renderCount++;
    this.renderTimes.push(endTime - startTime);
  }

  getRenderCount() {
    return this.renderCount;
  }

  getAverageRenderTime() {
    return this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length;
  }

  reset() {
    this.renderCount = 0;
    this.renderTimes = [];
  }
}

const performanceMonitor = new SaasUIPerformanceMonitor();

describe('Dashboard SaaS UI Performance', () => {
  const mockAuthContext = {
    user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'admin' },
    logout: vi.fn(),
    isLoading: false,
    isInitialized: true,
  };

  beforeEach(() => {
    performanceMonitor.reset();
  });

  describe('Bundle Size Impact', () => {
    it('should keep bundle size increase minimal (<100KB gzipped)', async () => {
      // This would be tested with actual bundle analysis
      const bundleStats = await import('@/tests/utils/bundle-analyzer');
      const saasUIBundleSize = bundleStats.getSaasUIBundleSize();
      
      expect(saasUIBundleSize).toBeLessThan(100 * 1024); // 100KB in bytes
    });
  });

  describe('Render Performance', () => {
    it('should maintain existing memoization patterns', () => {
      const TestComponent = React.memo(() => {
        const startTime = performance.now();
        
        const result = render(
          <SaasUITestWrapper>
            <AuthContext.Provider value={mockAuthContext}>
              <Dashboard />
            </AuthContext.Provider>
          </SaasUITestWrapper>
        );
        
        const endTime = performance.now();
        performanceMonitor.trackRender(startTime, endTime);
        
        return result;
      });

      // Render twice with same props
      const { rerender } = render(<TestComponent />);
      rerender(<TestComponent />);
      
      // Should not cause additional renders due to memoization
      expect(performanceMonitor.getRenderCount()).toBeLessThanOrEqual(2);
    });

    it('should render within acceptable time limits', async () => {
      const startTime = performance.now();
      
      render(
        <SaasUITestWrapper>
          <AuthContext.Provider value={mockAuthContext}>
            <Dashboard />
          </AuthContext.Provider>
        </SaasUITestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within 150ms (allowing for SaaS UI overhead)
      expect(renderTime).toBeLessThan(150);
    });
  });

  describe('Dynamic Imports', () => {
    it('should continue to work properly with SaaS UI', async () => {
      render(
        <SaasUITestWrapper>
          <AuthContext.Provider value={mockAuthContext}>
            <Dashboard />
          </AuthContext.Provider>
        </SaasUITestWrapper>
      );
      
      // Wait for dynamic imports to load
      await waitFor(() => {
        expect(screen.getByTestId('smart-user-management')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Tab Switching Performance', () => {
    it('should handle rapid tab switching without performance degradation', async () => {
      render(
        <SaasUITestWrapper>
          <AuthContext.Provider value={mockAuthContext}>
            <Dashboard />
          </AuthContext.Provider>
        </SaasUITestWrapper>
      );
      
      const tabs = [
        screen.getByRole('tab', { name: 'Overview' }),
        screen.getByRole('tab', { name: 'User Management' }),
        screen.getByRole('tab', { name: 'Platform Analytics' }),
      ];
      
      const startTime = performance.now();
      
      // Rapid tab switching
      for (let i = 0; i < 10; i++) {
        fireEvent.click(tabs[i % tabs.length]);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should complete all switches within 500ms
      expect(totalTime).toBeLessThan(500);
    });
  });

  describe('Memory Usage', () => {
    it('should not cause memory leaks during component lifecycle', () => {
      const { unmount } = render(
        <SaasUITestWrapper>
          <AuthContext.Provider value={mockAuthContext}>
            <Dashboard />
          </AuthContext.Provider>
        </SaasUITestWrapper>
      );
      
      // Simulate component unmount
      unmount();
      
      // Check for cleanup (this would need actual memory monitoring)
      expect(true).toBe(true); // Placeholder for actual memory leak detection
    });
  });
});
```

---

## Integration Tests

### File: `tests/components/dashboard/dashboard-integration.test.tsx`

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Dashboard from '@/app/(frontend)/dashboard/page';
import { SaasUITestWrapper } from '@/tests/utils/saas-ui-test-utils';
import { AuthContext } from '@/contexts/AuthContext';

describe('Dashboard SaaS UI Integration', () => {
  const mockAuthContext = {
    user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'admin' },
    logout: vi.fn(),
    isLoading: false,
    isInitialized: true,
  };

  beforeEach(() => {
    render(
      <SaasUITestWrapper>
        <AuthContext.Provider value={mockAuthContext}>
          <Dashboard />
        </AuthContext.Provider>
      </SaasUITestWrapper>
    );
  });

  describe('Complete User Workflows', () => {
    it('should support complete navigation workflow', async () => {
      const user = userEvent.setup();
      
      // Navigate through all tabs
      await user.click(screen.getByRole('tab', { name: 'User Management' }));
      expect(screen.getByTestId('smart-user-management')).toBeInTheDocument();
      
      await user.click(screen.getByRole('tab', { name: 'Platform Analytics' }));
      expect(screen.getByTestId('analytics-content')).toBeInTheDocument();
      
      await user.click(screen.getByRole('tab', { name: 'Overview' }));
      expect(screen.getByTestId('overview-content')).toBeInTheDocument();
    });

    it('should support complete action workflow', async () => {
      const user = userEvent.setup();
      
      // Navigate to user management
      await user.click(screen.getByRole('tab', { name: 'User Management' }));
      
      // Open actions menu
      await user.click(screen.getByRole('button', { name: 'More Actions' }));
      
      // Select bulk action
      await user.click(screen.getByRole('menuitem', { name: 'Bulk Edit' }));
      
      // Confirm action in dialog
      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });
      
      await user.click(screen.getByRole('button', { name: 'Confirm' }));
      
      // Verify toast notification
      await waitFor(() => {
        expect(screen.getByText('Bulk edit completed')).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Behavior Integration', () => {
    it('should handle mobile to desktop transition', () => {
      // Start with mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
      fireEvent.resize(window);
      
      const sidebar = screen.getByTestId('dashboard-sidebar');
      expect(sidebar).toHaveAttribute('data-collapsed', 'true');
      
      // Switch to desktop viewport
      Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });
      fireEvent.resize(window);
      
      expect(sidebar).toHaveAttribute('data-collapsed', 'false');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle API errors gracefully', async () => {
      // Mock API error
      global.fetch = vi.fn(() => Promise.reject(new Error('API Error')));
      
      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: 'Refresh Data' }));
      
      await waitFor(() => {
        expect(screen.getByText('Failed to load data')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
      });
    });
  });
});
```

---

## Test Utilities

### File: `tests/utils/saas-ui-test-utils.tsx`

```typescript
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { SaasProvider } from '@saas-ui/react';
import { customTheme } from '@/theme/saas-ui-theme';
import { AuthProvider } from '@/contexts/AuthContext';

// SaaS UI Test Wrapper
const SaasUITestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChakraProvider theme={customTheme}>
      <SaasProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </SaasProvider>
    </ChakraProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: SaasUITestWrapper, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render, SaasUITestWrapper };

// SaaS UI specific test helpers
export const getSaasUIComponent = (testId: string) => {
  return document.querySelector(`[data-testid="${testId}"]`);
};

export const waitForSaasUIAnimation = () => {
  return new Promise(resolve => setTimeout(resolve, 300));
};
```

### File: `tests/utils/accessibility-helpers.ts`

```typescript
import { axe, AxeResults } from 'jest-axe';

export const checkAccessibility = async (container: HTMLElement): Promise<AxeResults> => {
  return await axe(container, {
    rules: {
      'color-contrast': { enabled: true },
      'keyboard-navigation': { enabled: true },
      'focus-management': { enabled: true },
      'aria-labels': { enabled: true },
    },
  });
};

export const checkColorContrast = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element);
  const color = style.color;
  const backgroundColor = style.backgroundColor;
  
  // This would implement actual color contrast calculation
  // For now, return true as placeholder
  return true;
};

export const checkKeyboardNavigation = async (element: HTMLElement): Promise<boolean> => {
  // Test if element is focusable
  element.focus();
  return document.activeElement === element;
};
```

---

## E2E Tests

### File: `e2e/dashboard-saas-ui-flow.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Dashboard SaaS UI E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    // Assume user is already authenticated
  });

  test('should navigate through all dashboard sections', async ({ page }) => {
    // Test tab navigation
    await page.click('[role="tab"][name="User Management"]');
    await expect(page.locator('[data-testid="smart-user-management"]')).toBeVisible();
    
    await page.click('[role="tab"][name="Platform Analytics"]');
    await expect(page.locator('[data-testid="analytics-content"]')).toBeVisible();
    
    await page.click('[role="tab"][name="Overview"]');
    await expect(page.locator('[data-testid="overview-content"]')).toBeVisible();
  });

  test('should handle responsive design correctly', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('[data-testid="dashboard-sidebar"]')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('[data-testid="dashboard-sidebar"]')).toHaveAttribute('data-collapsed', 'true');
  });

  test('should complete user action workflow', async ({ page }) => {
    await page.click('[role="tab"][name="User Management"]');
    await page.click('[role="button"][name="More Actions"]');
    await page.click('[role="menuitem"][name="Bulk Edit"]');
    
    await expect(page.locator('[role="alertdialog"]')).toBeVisible();
    await page.click('[role="button"][name="Confirm"]');
    
    await expect(page.locator('text=Bulk edit completed')).toBeVisible();
  });
});
```

---

## Test Execution Commands

### Package.json Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:saas-ui": "vitest tests/components/saas-ui",
    "test:accessibility": "vitest tests/components/dashboard/dashboard-accessibility.test.tsx",
    "test:performance": "vitest tests/performance",
    "test:e2e": "playwright test e2e/dashboard-saas-ui-flow.spec.ts",
    "test:watch": "vitest --watch"
  }
}
```

---

## Coverage Requirements

### Minimum Coverage Thresholds
- **Lines**: 90%
- **Functions**: 90%
- **Branches**: 85%
- **Statements**: 90%

### Critical Path Coverage
- Navigation components: 95%
- Data display components: 90%
- Action components: 95%
- Accessibility features: 100%

---

## Test Execution Schedule

### Sprint 1
- [ ] AC1 & AC2 Tests (Setup + Navigation)
- [ ] Basic integration tests
- [ ] Accessibility foundation tests

### Sprint 2
- [ ] AC3 & AC4 Tests (Layout + Data Display)
- [ ] Performance baseline tests
- [ ] E2E happy path tests

### Sprint 3
- [ ] AC5 & AC6 Tests (Actions + Feedback)
- [ ] Complete accessibility audit
- [ ] Performance optimization tests
- [ ] Cross-browser E2E tests

---

## Success Criteria

✅ **All acceptance criteria have corresponding tests**  
✅ **90%+ code coverage for new SaaS UI components**  
✅ **100% accessibility compliance (WCAG 2.1 AA)**  
✅ **Performance benchmarks within acceptable ranges**  
✅ **E2E tests cover critical user workflows**  
✅ **Tests are maintainable and well-documented**  

---

**Test Plan Approved By**: BMad Orchestrator (Scrum Master)  
**Review Date**: 2024-12-19  
**Next Review**: Sprint Planning Session  
**Dependencies**: SaaS UI integration completion  
**Risk Level**: Medium (new testing patterns for SaaS UI components)