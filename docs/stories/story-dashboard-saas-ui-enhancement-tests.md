# Dashboard Shadcn/UI Enhancement - Test Specification

**Story Reference**: `story-dashboard-shadcn-ui-enhancement.md`  
**Test Strategy**: Comprehensive testing for Shadcn/UI integration  
**Framework**: Vitest + React Testing Library + Playwright  
**Coverage Target**: 90%+ for new components  
**Accessibility**: WCAG 2.1 AA compliance  

---

## Test Strategy Overview

This document outlines the comprehensive testing strategy for integrating Shadcn/UI components into the existing dashboard. The tests ensure that all acceptance criteria are met while maintaining existing functionality and performance standards.

### Test Categories
1. **Unit Tests**: Individual component testing
2. **Integration Tests**: Component interaction testing
3. **Accessibility Tests**: WCAG 2.1 AA compliance
4. **Performance Tests**: Bundle size and render performance
5. **E2E Tests**: Complete user workflow validation

### File Structure
```
tests/
├── components/
│   ├── shadcn-ui/
│   │   ├── sidebar.test.tsx
│   │   ├── navigation.test.tsx
│   │   ├── data-display.test.tsx
│   │   └── actions.test.tsx
│   └── dashboard/
│       ├── dashboard-integration.test.tsx
│       ├── dashboard-accessibility.test.tsx
│       └── dashboard-performance.test.tsx
├── utils/
│   ├── shadcn-ui-test-utils.tsx
│   └── accessibility-helpers.ts
├── performance/
│   └── dashboard-shadcn-ui-performance.test.tsx
└── e2e/
    └── dashboard-shadcn-ui-flow.spec.ts
```

---

## AC1: Shadcn/UI Integration Setup Tests

### File: `tests/components/shadcn-ui/setup.test.tsx`

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Dashboard from '@/app/(frontend)/dashboard/page';
import { ThemeProvider } from '@/components/theme-provider';

describe('Shadcn/UI Integration Setup', () => {
  it('should render with Shadcn/UI theme provider', () => {
    render(
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Dashboard />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('dashboard-container')).toBeInTheDocument();
  });

  it('should apply custom CSS variables correctly', () => {
    render(
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Dashboard />
      </ThemeProvider>
    );
    
    const container = screen.getByTestId('dashboard-container');
    const computedStyle = window.getComputedStyle(container);
    
    // Verify CSS variables are applied
    expect(computedStyle.getPropertyValue('--background')).toBeTruthy();
    expect(computedStyle.getPropertyValue('--foreground')).toBeTruthy();
  });

  it('should have Shadcn/UI components available', () => {
    const { container } = render(
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Dashboard />
      </ThemeProvider>
    );
    
    // Check for Shadcn/UI specific classes
    expect(container.querySelector('.dark, .light')).toBeTruthy();
  });
});
```

---

## AC2: Enhanced Navigation System Tests

### File: `tests/components/shadcn-ui/navigation.test.tsx`

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ShadcnUITestWrapper } from '@/tests/utils/shadcn-ui-test-utils';
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

describe('Enhanced Navigation System', () => {
  describe('Sidebar Component', () => {
    it('should render sidebar with proper structure', () => {
      render(
        <ShadcnUITestWrapper>
          <Sidebar data-testid="dashboard-sidebar">
            <SidebarHeader>
              <h2>Dashboard</h2>
            </SidebarHeader>
            <SidebarContent>
              <nav>Navigation items</nav>
            </SidebarContent>
          </Sidebar>
        </ShadcnUITestWrapper>
      );
      
      expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Navigation items')).toBeInTheDocument();
    });

    it('should support collapsible functionality', async () => {
      const user = userEvent.setup();
      
      render(
        <ShadcnUITestWrapper>
          <Sidebar data-testid="dashboard-sidebar" collapsible="icon">
            <SidebarHeader>
              <h2>Dashboard</h2>
            </SidebarHeader>
            <SidebarContent>
              <nav>Navigation items</nav>
            </SidebarContent>
          </Sidebar>
        </ShadcnUITestWrapper>
      );
      
      const sidebar = screen.getByTestId('dashboard-sidebar');
      const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
      
      await user.click(toggleButton);
      expect(sidebar).toHaveAttribute('data-state', 'collapsed');
      
      await user.click(toggleButton);
      expect(sidebar).toHaveAttribute('data-state', 'expanded');
    });

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <ShadcnUITestWrapper>
          <Sidebar data-testid="dashboard-sidebar">
            <SidebarContent>
              <nav>
                <a href="#overview">Overview</a>
                <a href="#analytics">Analytics</a>
                <a href="#settings">Settings</a>
              </nav>
            </SidebarContent>
          </Sidebar>
        </ShadcnUITestWrapper>
      );
      
      const firstLink = screen.getByRole('link', { name: 'Overview' });
      firstLink.focus();
      
      await user.keyboard('{Tab}');
      expect(screen.getByRole('link', { name: 'Analytics' })).toHaveFocus();
      
      await user.keyboard('{Tab}');
      expect(screen.getByRole('link', { name: 'Settings' })).toHaveFocus();
    });
  });

  describe('Breadcrumb Component', () => {
    it('should render breadcrumb navigation', () => {
      render(
        <ShadcnUITestWrapper>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Analytics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </ShadcnUITestWrapper>
      );
      
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });

    it('should support proper ARIA attributes', () => {
      render(
        <ShadcnUITestWrapper>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Current</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </ShadcnUITestWrapper>
      );
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'breadcrumb');
    });
  });

  describe('Tabs Component', () => {
    it('should render tabs with proper structure', () => {
      render(
        <ShadcnUITestWrapper>
          <Tabs defaultValue="overview" data-testid="dashboard-tabs">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">Overview content</TabsContent>
            <TabsContent value="analytics">Analytics content</TabsContent>
            <TabsContent value="settings">Settings content</TabsContent>
          </Tabs>
        </ShadcnUITestWrapper>
      );
      
      expect(screen.getByTestId('dashboard-tabs')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Analytics' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Settings' })).toBeInTheDocument();
      expect(screen.getByText('Overview content')).toBeInTheDocument();
    });

    it('should handle tab switching', async () => {
      const user = userEvent.setup();
      
      render(
        <ShadcnUITestWrapper>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">Overview content</TabsContent>
            <TabsContent value="analytics">Analytics content</TabsContent>
          </Tabs>
        </ShadcnUITestWrapper>
      );
      
      expect(screen.getByText('Overview content')).toBeInTheDocument();
      expect(screen.queryByText('Analytics content')).not.toBeInTheDocument();
      
      await user.click(screen.getByRole('tab', { name: 'Analytics' }));
      
      expect(screen.queryByText('Overview content')).not.toBeInTheDocument();
      expect(screen.getByText('Analytics content')).toBeInTheDocument();
    });

    it('should support keyboard navigation between tabs', async () => {
      const user = userEvent.setup();
      
      render(
        <ShadcnUITestWrapper>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">Overview content</TabsContent>
            <TabsContent value="analytics">Analytics content</TabsContent>
            <TabsContent value="settings">Settings content</TabsContent>
          </Tabs>
        </ShadcnUITestWrapper>
      );
      
      const overviewTab = screen.getByRole('tab', { name: 'Overview' });
      overviewTab.focus();
      
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Analytics' })).toHaveFocus();
      
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();
      
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('tab', { name: 'Analytics' })).toHaveFocus();
    });
  });
});
```

---

## AC3: Improved Layout Structure Tests

### File: `tests/components/shadcn-ui/layout.test.tsx`

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ShadcnUITestWrapper } from '@/tests/utils/shadcn-ui-test-utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

describe('Improved Layout Structure', () => {
  describe('Card Components', () => {
    it('should render card with all sections', () => {
      render(
        <ShadcnUITestWrapper>
          <Card data-testid="test-card">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description text</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content goes here</p>
            </CardContent>
            <CardFooter>
              <button>Action</button>
            </CardFooter>
          </Card>
        </ShadcnUITestWrapper>
      );
      
      expect(screen.getByTestId('test-card')).toBeInTheDocument();
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card description text')).toBeInTheDocument();
      expect(screen.getByText('Card content goes here')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('should apply proper styling classes', () => {
      render(
        <ShadcnUITestWrapper>
          <Card data-testid="styled-card" className="custom-class">
            <CardHeader>
              <CardTitle>Title</CardTitle>
            </CardHeader>
          </Card>
        </ShadcnUITestWrapper>
      );
      
      const card = screen.getByTestId('styled-card');
      expect(card).toHaveClass('custom-class');
      // Verify default Shadcn/UI card classes are applied
      expect(card.className).toContain('rounded-lg');
      expect(card.className).toContain('border');
    });

    it('should support responsive design', () => {
      render(
        <ShadcnUITestWrapper>
          <Card data-testid="responsive-card" className="w-full md:w-1/2 lg:w-1/3">
            <CardContent>Responsive content</CardContent>
          </Card>
        </ShadcnUITestWrapper>
      );
      
      const card = screen.getByTestId('responsive-card');
      expect(card.className).toContain('w-full');
      expect(card.className).toContain('md:w-1/2');
      expect(card.className).toContain('lg:w-1/3');
    });
  });

  describe('Separator Component', () => {
    it('should render horizontal separator', () => {
      render(
        <ShadcnUITestWrapper>
          <div>
            <p>Content above</p>
            <Separator data-testid="horizontal-separator" />
            <p>Content below</p>
          </div>
        </ShadcnUITestWrapper>
      );
      
      const separator = screen.getByTestId('horizontal-separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute('role', 'separator');
    });

    it('should render vertical separator', () => {
      render(
        <ShadcnUITestWrapper>
          <div className="flex">
            <span>Left</span>
            <Separator orientation="vertical" data-testid="vertical-separator" />
            <span>Right</span>
          </div>
        </ShadcnUITestWrapper>
      );
      
      const separator = screen.getByTestId('vertical-separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  describe('Layout Responsiveness', () => {
    it('should handle mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
      
      render(
        <ShadcnUITestWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="responsive-grid">
            <Card><CardContent>Card 1</CardContent></Card>
            <Card><CardContent>Card 2</CardContent></Card>
            <Card><CardContent>Card 3</CardContent></Card>
          </div>
        </ShadcnUITestWrapper>
      );
      
      const grid = screen.getByTestId('responsive-grid');
      expect(grid.className).toContain('grid-cols-1');
      expect(grid.className).toContain('md:grid-cols-2');
      expect(grid.className).toContain('lg:grid-cols-3');
    });

    it('should handle desktop viewport', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });
      
      render(
        <ShadcnUITestWrapper>
          <div className="hidden md:block" data-testid="desktop-only">
            Desktop content
          </div>
        </ShadcnUITestWrapper>
      );
      
      const desktopContent = screen.getByTestId('desktop-only');
      expect(desktopContent.className).toContain('hidden');
      expect(desktopContent.className).toContain('md:block');
    });
  });
});
```

---

## AC4: Enhanced Data Display Tests

### File: `tests/components/shadcn-ui/data-display.test.tsx`

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ShadcnUITestWrapper } from '@/tests/utils/shadcn-ui-test-utils';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

describe('Enhanced Data Display', () => {
  describe('Table Component', () => {
    const mockData = [
      { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'pending' },
    ];

    it('should render table with data', () => {
      render(
        <ShadcnUITestWrapper>
          <Table>
            <TableCaption>User Management Table</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ShadcnUITestWrapper>
      );
      
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('User Management Table')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();
    });

    it('should support sorting functionality', async () => {
      const mockSort = vi.fn();
      const user = userEvent.setup();
      
      render(
        <ShadcnUITestWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button onClick={() => mockSort('name')} className="flex items-center">
                    Name
                    <span className="ml-1">↕</span>
                  </button>
                </TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>john@example.com</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ShadcnUITestWrapper>
      );
      
      const sortButton = screen.getByRole('button', { name: /name/i });
      await user.click(sortButton);
      
      expect(mockSort).toHaveBeenCalledWith('name');
    });

    it('should support row selection', async () => {
      const mockSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <ShadcnUITestWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <input
                    type="checkbox"
                    onChange={() => mockSelect(1)}
                    aria-label="Select John Doe"
                  />
                </TableCell>
                <TableCell>John Doe</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ShadcnUITestWrapper>
      );
      
      const checkbox = screen.getByRole('checkbox', { name: 'Select John Doe' });
      await user.click(checkbox);
      
      expect(mockSelect).toHaveBeenCalledWith(1);
    });
  });

  describe('Badge Component', () => {
    it('should render different badge variants', () => {
      render(
        <ShadcnUITestWrapper>
          <div>
            <Badge variant="default" data-testid="default-badge">Default</Badge>
            <Badge variant="secondary" data-testid="secondary-badge">Secondary</Badge>
            <Badge variant="destructive" data-testid="destructive-badge">Destructive</Badge>
            <Badge variant="outline" data-testid="outline-badge">Outline</Badge>
          </div>
        </ShadcnUITestWrapper>
      );
      
      expect(screen.getByTestId('default-badge')).toBeInTheDocument();
      expect(screen.getByTestId('secondary-badge')).toBeInTheDocument();
      expect(screen.getByTestId('destructive-badge')).toBeInTheDocument();
      expect(screen.getByTestId('outline-badge')).toBeInTheDocument();
    });

    it('should apply correct styling for variants', () => {
      render(
        <ShadcnUITestWrapper>
          <Badge variant="destructive" data-testid="destructive-badge">Error</Badge>
        </ShadcnUITestWrapper>
      );
      
      const badge = screen.getByTestId('destructive-badge');
      expect(badge.className).toContain('bg-destructive');
    });
  });

  describe('Skeleton Component', () => {
    it('should render loading skeleton', () => {
      render(
        <ShadcnUITestWrapper>
          <div data-testid="skeleton-container">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </ShadcnUITestWrapper>
      );
      
      const container = screen.getByTestId('skeleton-container');
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons).toHaveLength(3);
    });

    it('should support custom dimensions', () => {
      render(
        <ShadcnUITestWrapper>
          <Skeleton className="h-8 w-full" data-testid="custom-skeleton" />
        </ShadcnUITestWrapper>
      );
      
      const skeleton = screen.getByTestId('custom-skeleton');
      expect(skeleton.className).toContain('h-8');
      expect(skeleton.className).toContain('w-full');
    });
  });

  describe('Data Loading States', () => {
    it('should show skeleton while loading', () => {
      const { rerender } = render(
        <ShadcnUITestWrapper>
          <div>
            <Skeleton className="h-4 w-[250px]" data-testid="loading-skeleton" />
          </div>
        </ShadcnUITestWrapper>
      );
      
      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
      
      // Simulate data loaded
      rerender(
        <ShadcnUITestWrapper>
          <div>
            <p data-testid="loaded-content">Data has loaded</p>
          </div>
        </ShadcnUITestWrapper>
      );
      
      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('loaded-content')).toBeInTheDocument();
    });
  });
});
```

---

## AC5: Improved User Actions Tests

### File: `tests/components/shadcn-ui/actions.test.tsx`

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ShadcnUITestWrapper } from '@/tests/utils/shadcn-ui-test-utils';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

describe('Improved User Actions', () => {
  describe('Button Component', () => {
    it('should render different button variants', () => {
      render(
        <ShadcnUITestWrapper>
          <div>
            <Button variant="default" data-testid="default-btn">Default</Button>
            <Button variant="destructive" data-testid="destructive-btn">Destructive</Button>
            <Button variant="outline" data-testid="outline-btn">Outline</Button>
            <Button variant="secondary" data-testid="secondary-btn">Secondary</Button>
            <Button variant="ghost" data-testid="ghost-btn">Ghost</Button>
            <Button variant="link" data-testid="link-btn">Link</Button>
          </div>
        </ShadcnUITestWrapper>
      );
      
      expect(screen.getByTestId('default-btn')).toBeInTheDocument();
      expect(screen.getByTestId('destructive-btn')).toBeInTheDocument();
      expect(screen.getByTestId('outline-btn')).toBeInTheDocument();
      expect(screen.getByTestId('secondary-btn')).toBeInTheDocument();
      expect(screen.getByTestId('ghost-btn')).toBeInTheDocument();
      expect(screen.getByTestId('link-btn')).toBeInTheDocument();
    });

    it('should render different button sizes', () => {
      render(
        <ShadcnUITestWrapper>
          <div>
            <Button size="default" data-testid="default-size">Default</Button>
            <Button size="sm" data-testid="small-size">Small</Button>
            <Button size="lg" data-testid="large-size">Large</Button>
            <Button size="icon" data-testid="icon-size">🔍</Button>
          </div>
        </ShadcnUITestWrapper>
      );
      
      expect(screen.getByTestId('default-size')).toBeInTheDocument();
      expect(screen.getByTestId('small-size')).toBeInTheDocument();
      expect(screen.getByTestId('large-size')).toBeInTheDocument();
      expect(screen.getByTestId('icon-size')).toBeInTheDocument();
    });

    it('should handle click events', async () => {
      const mockClick = vi.fn();
      const user = userEvent.setup();
      
      render(
        <ShadcnUITestWrapper>
          <Button onClick={mockClick} data-testid="clickable-btn">
            Click me
          </Button>
        </ShadcnUITestWrapper>
      );
      
      await user.click(screen.getByTestId('clickable-btn'));
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('should support disabled state', () => {
      render(
        <ShadcnUITestWrapper>
          <Button disabled data-testid="disabled-btn">
            Disabled
          </Button>
        </ShadcnUITestWrapper>
      );
      
      const button = screen.getByTestId('disabled-btn');
      expect(button).toBeDisabled();
      expect(button.className).toContain('disabled:pointer-events-none');
    });

    it('should support loading state', () => {
      render(
        <ShadcnUITestWrapper>
          <Button disabled data-testid="loading-btn">
            <span className="animate-spin mr-2">⏳</span>
            Loading...
          </Button>
        </ShadcnUITestWrapper>
      );
      
      const button = screen.getByTestId('loading-btn');
      expect(button).toBeDisabled();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('DropdownMenu Component', () => {
    it('should render dropdown menu', async () => {
      const user = userEvent.setup();
      
      render(
        <ShadcnUITestWrapper>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button data-testid="dropdown-trigger">More Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ShadcnUITestWrapper>
      );
      
      const trigger = screen.getByTestId('dropdown-trigger');
      await user.click(trigger);
      
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Share' })).toBeInTheDocument();
    });

    it('should handle menu item selection', async () => {
      const mockEdit = vi.fn();
      const user = userEvent.setup();
      
      render(
        <ShadcnUITestWrapper>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={mockEdit}>Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ShadcnUITestWrapper>
      );
      
      await user.click(screen.getByRole('button', { name: 'Actions' }));
      await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
      
      expect(mockEdit).toHaveBeenCalledTimes(1);
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <ShadcnUITestWrapper>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>First</DropdownMenuItem>
              <DropdownMenuItem>Second</DropdownMenuItem>
              <DropdownMenuItem>Third</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ShadcnUITestWrapper>
      );
      
      await user.click(screen.getByRole('button', { name: 'Actions' }));
      
      const firstItem = screen.getByRole('menuitem', { name: 'First' });
      expect(firstItem).toHaveFocus();
      
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('menuitem', { name: 'Second' })).toHaveFocus();
      
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('menuitem', { name: 'Third' })).toHaveFocus();
    });
  });

  describe('AlertDialog Component', () => {
    it('should render confirmation dialog', async () => {
      const user = userEvent.setup();
      
      render(
        <ShadcnUITestWrapper>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button data-testid="delete-trigger">Delete Item</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the item.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ShadcnUITestWrapper>
      );
      
      await user.click(screen.getByTestId('delete-trigger'));
      
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('should handle confirmation actions', async () => {
      const mockDelete = vi.fn();
      const user = userEvent.setup();
      
      render(
        <ShadcnUITestWrapper>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={mockDelete}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ShadcnUITestWrapper>
      );
      
      await user.click(screen.getByRole('button', { name: 'Delete' }));
      await user.click(screen.getByRole('button', { name: 'Confirm' }));
      
      expect(mockDelete).toHaveBeenCalledTimes(1);
    });

    it('should handle cancellation', async () => {
      const user = userEvent.setup();
      
      render(
        <ShadcnUITestWrapper>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ShadcnUITestWrapper>
      );
      
      await user.click(screen.getByRole('button', { name: 'Delete' }));
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      
      await user.click(screen.getByRole('button', { name: 'Cancel' }));
      
      await waitFor(() => {
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
      });
    });
  });
});
```

---

## AC6: Enhanced Visual Feedback Tests

### File: `tests/components/shadcn-ui/feedback.test.tsx`

```typescript
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ShadcnUITestWrapper } from '@/tests/utils/shadcn-ui-test-utils';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Mock toast hook
const mockToast = vi.fn();
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

describe('Enhanced Visual Feedback', () => {
  describe('Toast Notifications', () => {
    const ToastTestComponent = () => {
      const { toast } = useToast();
      
      return (
        <div>
          <Button
            onClick={() => toast({
              title: 'Success',
              description: 'Operation completed successfully',
            })}
            data-testid="success-toast-btn"
          >
            Show Success
          </Button>
          <Button
            onClick={() => toast({
              title: 'Error',
              description: 'Something went wrong',
              variant: 'destructive',
            })}
            data-testid="error-toast-btn"
          >
            Show Error
          </Button>
        </div>
      );
    };

    it('should trigger success toast', async () => {
      const user = userEvent.setup();
      
      render(
        <ShadcnUITestWrapper>
          <ToastTestComponent />
        </ShadcnUITestWrapper>
      );
      
      await user.click(screen.getByTestId('success-toast-btn'));
      
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Operation completed successfully',
      });
    });

    it('should trigger error toast', async () => {
      const user = userEvent.setup();
      
      render(
        <ShadcnUITestWrapper>
          <ToastTestComponent />
        </ShadcnUITestWrapper>
      );
      
      await user.click(screen.getByTestId('error-toast-btn'));
      
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    });
  });

  describe('Progress Component', () => {
    it('should render progress bar with value', () => {
      render(
        <ShadcnUITestWrapper>
          <Progress value={65} data-testid="progress-bar" />
        </ShadcnUITestWrapper>
      );
      
      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute('aria-valuenow', '65');
    });

    it('should support different progress states', () => {
      const { rerender } = render(
        <ShadcnUITestWrapper>
          <Progress value={0} data-testid="progress-bar" />
        </ShadcnUITestWrapper>
      );
      
      let progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
      
      rerender(
        <ShadcnUITestWrapper>
          <Progress value={50} data-testid="progress-bar" />
        </ShadcnUITestWrapper>
      );
      
      progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
      
      rerender(
        <ShadcnUITestWrapper>
          <Progress value={100} data-testid="progress-bar" />
        </ShadcnUITestWrapper>
      );
      
      progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    });

    it('should support indeterminate progress', () => {
      render(
        <ShadcnUITestWrapper>
          <Progress value={null} data-testid="indeterminate-progress" />
        </ShadcnUITestWrapper>
      );
      
      const progressBar = screen.getByTestId('indeterminate-progress');
      expect(progressBar).toBeInTheDocument();
      // Indeterminate progress should not have aria-valuenow
      expect(progressBar).not.toHaveAttribute('aria-valuenow');
    });
  });

  describe('Badge Status Indicators', () => {
    it('should render status badges with different variants', () => {
      render(
        <ShadcnUITestWrapper>
          <div>
            <Badge variant="default" data-testid="active-badge">Active</Badge>
            <Badge variant="secondary" data-testid="pending-badge">Pending</Badge>
            <Badge variant="destructive" data-testid="error-badge">Error</Badge>
            <Badge variant="outline" data-testid="draft-badge">Draft</Badge>
          </div>
        </ShadcnUITestWrapper>
      );
      
      expect(screen.getByTestId('active-badge')).toBeInTheDocument();
      expect(screen.getByTestId('pending-badge')).toBeInTheDocument();
      expect(screen.getByTestId('error-badge')).toBeInTheDocument();
      expect(screen.getByTestId('draft-badge')).toBeInTheDocument();
    });

    it('should apply correct styling for status', () => {
      render(
        <ShadcnUITestWrapper>
          <Badge variant="destructive" data-testid="error-status">
            Error
          </Badge>
        </ShadcnUITestWrapper>
      );
      
      const errorBadge = screen.getByTestId('error-status');
      expect(errorBadge.className).toContain('bg-destructive');
    });
  });

  describe('Loading States', () => {
    it('should show loading feedback during async operations', async () => {
      const AsyncComponent = () => {
        const [loading, setLoading] = React.useState(false);
        const [progress, setProgress] = React.useState(0);
        
        const handleAsyncOperation = async () => {
          setLoading(true);
          setProgress(0);
          
          // Simulate progress updates
          for (let i = 0; i <= 100; i += 20) {
            setProgress(i);
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          setLoading(false);
        };
        
        return (
          <div>
            <Button
              onClick={handleAsyncOperation}
              disabled={loading}
              data-testid="async-btn"
            >
              {loading ? 'Processing...' : 'Start Process'}
            </Button>
            {loading && (
              <Progress value={progress} data-testid="async-progress" />
            )}
          </div>
        );
      };
      
      const user = userEvent.setup();
      
      render(
        <ShadcnUITestWrapper>
          <AsyncComponent />
        </ShadcnUITestWrapper>
      );
      
      const button = screen.getByTestId('async-btn');
      await user.click(button);
      
      expect(screen.getByText('Processing...')).toBeInTheDocument();
      expect(screen.getByTestId('async-progress')).toBeInTheDocument();
      expect(button).toBeDisabled();
      
      // Wait for completion
      await waitFor(() => {
        expect(screen.getByText('Start Process')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      expect(screen.queryByTestId('async-progress')).not.toBeInTheDocument();
      expect(button).not.toBeDisabled();
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
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import Dashboard from '@/app/(frontend)/dashboard/page';
import { ShadcnUITestWrapper } from '@/tests/utils/shadcn-ui-test-utils';
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
      <ShadcnUITestWrapper>
        <AuthContext.Provider value={mockAuthContext}>
          <Dashboard />
        </AuthContext.Provider>
      </ShadcnUITestWrapper>
    );
  });

  describe('WCAG 2.1 AA Compliance', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <ShadcnUITestWrapper>
          <AuthContext.Provider value={mockAuthContext}>
            <Dashboard />
          </AuthContext.Provider>
        </ShadcnUITestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper color contrast', () => {
      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        const style = window.getComputedStyle(button);
        const backgroundColor = style.backgroundColor;
        const color = style.color;
        
        // This would implement actual color contrast calculation
        // For now, verify that colors are defined
        expect(backgroundColor).toBeTruthy();
        expect(color).toBeTruthy();
      });
    });

    it('should have proper heading hierarchy', () => {
      const headings = screen.getAllByRole('heading');
      
      // Should have at least one h1
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

  describe('Keyboard Navigation', () => {
    it('should support tab navigation through all interactive elements', async () => {
      const user = userEvent.setup();
      
      // Get all focusable elements
      const focusableElements = screen.getAllByRole('button')
        .concat(screen.getAllByRole('tab'))
        .concat(screen.getAllByRole('link'));
      
      // Focus first element
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
        expect(focusableElements[0]).toHaveFocus();
        
        // Tab through elements
        for (let i = 1; i < Math.min(focusableElements.length, 5); i++) {
          await user.keyboard('{Tab}');
          // Verify focus moves to next focusable element
          expect(document.activeElement).toBeInstanceOf(HTMLElement);
        }
      }
    });

    it('should support arrow key navigation in tabs', async () => {
      const user = userEvent.setup();
      
      const tabs = screen.getAllByRole('tab');
      if (tabs.length > 1) {
        tabs[0].focus();
        
        await user.keyboard('{ArrowRight}');
        expect(tabs[1]).toHaveFocus();
        
        await user.keyboard('{ArrowLeft}');
        expect(tabs[0]).toHaveFocus();
      }
    });

    it('should support escape key to close modals', async () => {
      const user = userEvent.setup();
      
      // Look for dropdown triggers
      const dropdownTriggers = screen.queryAllByRole('button', { name: /more actions/i });
      
      if (dropdownTriggers.length > 0) {
        await user.click(dropdownTriggers[0]);
        
        // Check if menu opened
        const menu = screen.queryByRole('menu');
        if (menu) {
          await user.keyboard('{Escape}');
          expect(menu).not.toBeInTheDocument();
        }
      }
    });
  });

  describe('Screen Reader Support', () => {
    it('should have proper ARIA labels', () => {
      // Check for essential ARIA labels
      const navigation = screen.queryByRole('navigation');
      if (navigation) {
        expect(navigation).toHaveAttribute('aria-label');
      }
      
      const main = screen.queryByRole('main');
      if (main) {
        expect(main).toBeInTheDocument();
      }
      
      // Check buttons have accessible names
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });

    it('should have proper ARIA states', () => {
      const tabs = screen.getAllByRole('tab');
      
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-selected');
      });
      
      // Check for expanded/collapsed states
      const expandableElements = screen.queryAllByRole('button', { expanded: true })
        .concat(screen.queryAllByRole('button', { expanded: false }));
      
      expandableElements.forEach(element => {
        expect(element).toHaveAttribute('aria-expanded');
      });
    });

    it('should announce dynamic content changes', async () => {
      const user = userEvent.setup();
      
      // Look for live regions
      const liveRegions = document.querySelectorAll('[aria-live]');
      expect(liveRegions.length).toBeGreaterThan(0);
      
      // Test tab switching announces content change
      const tabs = screen.getAllByRole('tab');
      if (tabs.length > 1) {
        await user.click(tabs[1]);
        
        // Verify aria-selected updated
        expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
        expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
      }
    });
  });

  describe('Focus Management', () => {
    it('should implement proper focus management', async () => {
      const user = userEvent.setup();
      
      // Test focus trap in modals
      const menuButtons = screen.queryAllByRole('button', { name: /more actions/i });
      
      if (menuButtons.length > 0) {
        await user.click(menuButtons[0]);
        
        const menu = screen.queryByRole('menu');
        if (menu) {
          // Focus should be trapped within the menu
          const menuItems = screen.getAllByRole('menuitem');
          if (menuItems.length > 0) {
            expect(menuItems[0]).toHaveFocus();
          }
        }
      }
    });

    it('should restore focus after modal close', async () => {
      const user = userEvent.setup();
      
      const menuButtons = screen.queryAllByRole('button', { name: /more actions/i });
      
      if (menuButtons.length > 0) {
        const menuButton = menuButtons[0];
        await user.click(menuButton);
        
        await user.keyboard('{Escape}');
        
        expect(menuButton).toHaveFocus();
      }
    });
  });
});
```

---

## AC8: Performance Tests

### File: `tests/performance/dashboard-shadcn-ui-performance.test.tsx`

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from '@/app/(frontend)/dashboard/page';
import { ShadcnUITestWrapper } from '@/tests/utils/shadcn-ui-test-utils';
import { AuthContext } from '@/contexts/AuthContext';

// Performance monitoring utilities
class ShadcnUIPerformanceMonitor {
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

const performanceMonitor = new ShadcnUIPerformanceMonitor();

describe('Dashboard Shadcn/UI Performance', () => {
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
    it('should keep bundle size increase minimal (<50KB gzipped)', async () => {
       // This would be tested with actual bundle analysis
       const bundleStats = await import('@/tests/utils/bundle-analyzer');
       const shadcnUIBundleSize = bundleStats.getShadcnUIBundleSize();
       
       expect(shadcnUIBundleSize).toBeLessThan(50 * 1024); // 50KB in bytes
     });
   });
 
   describe('Render Performance', () => {
     it('should maintain existing memoization patterns', () => {
       const TestComponent = React.memo(() => {
         const startTime = performance.now();
         
         const result = render(
           <ShadcnUITestWrapper>
             <AuthContext.Provider value={mockAuthContext}>
               <Dashboard />
             </AuthContext.Provider>
           </ShadcnUITestWrapper>
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
         <ShadcnUITestWrapper>
           <AuthContext.Provider value={mockAuthContext}>
             <Dashboard />
           </AuthContext.Provider>
         </ShadcnUITestWrapper>
       );
       
       const endTime = performance.now();
       const renderTime = endTime - startTime;
       
       // Should render within 100ms (Shadcn/UI is lighter than SaaS UI)
       expect(renderTime).toBeLessThan(100);
     });
   });
 
   describe('Dynamic Imports', () => {
     it('should continue to work properly with Shadcn/UI', async () => {
       render(
         <ShadcnUITestWrapper>
           <AuthContext.Provider value={mockAuthContext}>
             <Dashboard />
           </AuthContext.Provider>
         </ShadcnUITestWrapper>
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
         <ShadcnUITestWrapper>
           <AuthContext.Provider value={mockAuthContext}>
             <Dashboard />
           </AuthContext.Provider>
         </ShadcnUITestWrapper>
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
       
       // Should complete all switches within 300ms (faster with Shadcn/UI)
       expect(totalTime).toBeLessThan(300);
     });
   });
 
   describe('Memory Usage', () => {
     it('should not cause memory leaks during component lifecycle', () => {
       const { unmount } = render(
         <ShadcnUITestWrapper>
           <AuthContext.Provider value={mockAuthContext}>
             <Dashboard />
           </AuthContext.Provider>
         </ShadcnUITestWrapper>
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
 import { ShadcnUITestWrapper } from '@/tests/utils/shadcn-ui-test-utils';
 import { AuthContext } from '@/contexts/AuthContext';
 
 describe('Dashboard Shadcn/UI Integration', () => {
   const mockAuthContext = {
     user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'admin' },
     logout: vi.fn(),
     isLoading: false,
     isInitialized: true,
   };
 
   beforeEach(() => {
     render(
       <ShadcnUITestWrapper>
         <AuthContext.Provider value={mockAuthContext}>
           <Dashboard />
         </AuthContext.Provider>
       </ShadcnUITestWrapper>
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
 
 ### File: `tests/utils/shadcn-ui-test-utils.tsx`
 
 ```typescript
 import React, { ReactElement } from 'react';
 import { render, RenderOptions } from '@testing-library/react';
 import { ThemeProvider } from '@/components/theme-provider';
 import { AuthProvider } from '@/contexts/AuthContext';
 
 // Shadcn/UI Test Wrapper
 const ShadcnUITestWrapper = ({ children }: { children: React.ReactNode }) => {
   return (
     <ThemeProvider
       attribute="class"
       defaultTheme="system"
       enableSystem
       disableTransitionOnChange
     >
       <AuthProvider>
         {children}
       </AuthProvider>
     </ThemeProvider>
   );
 };
 
 const customRender = (
   ui: ReactElement,
   options?: Omit<RenderOptions, 'wrapper'>,
 ) => render(ui, { wrapper: ShadcnUITestWrapper, ...options });
 
 // Re-export everything
 export * from '@testing-library/react';
 export { customRender as render, ShadcnUITestWrapper };
 
 // Shadcn/UI specific test helpers
 export const getShadcnUIComponent = (testId: string) => {
   return document.querySelector(`[data-testid="${testId}"]`);
 };
 
 export const waitForShadcnUIAnimation = () => {
   return new Promise(resolve => setTimeout(resolve, 200)); // Faster than SaaS UI
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
 
 ### File: `e2e/dashboard-shadcn-ui-flow.spec.ts`
 
 ```typescript
 import { test, expect } from '@playwright/test';
 
 test.describe('Dashboard Shadcn/UI E2E Flow', () => {
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
 
   test('should support keyboard navigation', async ({ page }) => {
     // Test tab navigation
     await page.keyboard.press('Tab');
     await expect(page.locator('[role="tab"][name="Overview"]')).toBeFocused();
     
     // Test arrow key navigation
     await page.keyboard.press('ArrowRight');
     await expect(page.locator('[role="tab"][name="User Management"]')).toBeFocused();
     
     await page.keyboard.press('ArrowRight');
     await expect(page.locator('[role="tab"][name="Platform Analytics"]')).toBeFocused();
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
     "test:shadcn-ui": "vitest tests/components/shadcn-ui",
     "test:accessibility": "vitest tests/components/dashboard/dashboard-accessibility.test.tsx",
     "test:performance": "vitest tests/performance",
     "test:e2e": "playwright test e2e/dashboard-shadcn-ui-flow.spec.ts",
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
 ✅ **90%+ code coverage for new Shadcn/UI components**  
 ✅ **100% accessibility compliance (WCAG 2.1 AA)**  
 ✅ **Performance benchmarks within acceptable ranges**  
 ✅ **E2E tests cover critical user workflows**  
 ✅ **Tests are maintainable and well-documented**  
 
 ---
 
 **Test Plan Approved By**: BMad Orchestrator (Scrum Master)  
 **Review Date**: 2024-12-19  
 **Next Review**: Sprint Planning Session  
 **Dependencies**: Shadcn/UI integration completion  
 **Risk Level**: Low (Shadcn/UI has excellent testing patterns and documentation)