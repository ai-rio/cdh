# End-to-End Test Plan - Dashboard Migration

## Overview

This document outlines the end-to-end (E2E) testing strategy for the Payload CMS Dashboard Integration project. E2E tests simulate real user interactions and verify complete workflows from the user's perspective.

## Testing Framework Setup

### Required Dependencies
```bash
# E2E testing dependencies
pnpm add -D @playwright/test
pnpm add -D @axe-core/playwright
pnpm add -D playwright-lighthouse
```

### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] }
    }
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
});
```

## Test Structure and Organization

### Directory Structure
```
tests/e2e/
├── fixtures/                    # Test data and utilities
│   ├── auth.ts
│   ├── test-data.ts
│   └── page-objects/
├── specs/                       # Test specifications
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── role-based-access.spec.ts
│   ├── collections/
│   │   ├── user-management.spec.ts
│   │   ├── media-management.spec.ts
│   │   └── bulk-operations.spec.ts
│   ├── dashboard/
│   │   ├── overview.spec.ts
│   │   ├── navigation.spec.ts
│   │   └── real-time-updates.spec.ts
│   ├── admin/
│   │   ├── system-monitoring.spec.ts
│   │   ├── user-analytics.spec.ts
│   │   └── admin-actions.spec.ts
│   └── performance/
│       ├── page-load-times.spec.ts
│       └── large-datasets.spec.ts
├── utils/                       # Test utilities
│   ├── auth-helpers.ts
│   ├── data-helpers.ts
│   └── performance-helpers.ts
└── global-setup.ts             # Global test setup
```

## Page Object Model

### Base Page Object
```typescript
// tests/e2e/fixtures/page-objects/base-page.ts
import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly header: Locator;
  readonly sidebar: Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('[data-testid="dashboard-header"]');
    this.sidebar = page.locator('[data-testid="dashboard-sidebar"]');
    this.mainContent = page.locator('[data-testid="main-content"]');
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.header.waitFor();
  }

  async navigateToSection(section: string) {
    await this.sidebar.locator(`[data-testid="nav-${section}"]`).click();
    await this.waitForPageLoad();
  }
}
```

### Login Page Object
```typescript
// tests/e2e/fixtures/page-objects/login-page.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoginError(message: string) {
    await this.errorMessage.waitFor();
    await expect(this.errorMessage).toContainText(message);
  }
}
```

### Collection Manager Page Object
```typescript
// tests/e2e/fixtures/page-objects/collection-manager-page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class CollectionManagerPage extends BasePage {
  readonly createButton: Locator;
  readonly searchInput: Locator;
  readonly dataTable: Locator;
  readonly bulkActionsBar: Locator;

  constructor(page: Page) {
    super(page);
    this.createButton = page.locator('[data-testid="create-button"]');
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.dataTable = page.locator('[data-testid="data-table"]');
    this.bulkActionsBar = page.locator('[data-testid="bulk-actions"]');
  }

  async createNewDocument(data: Record<string, any>) {
    await this.createButton.click();
    
    // Fill form fields based on data
    for (const [field, value] of Object.entries(data)) {
      await this.page.locator(`[data-testid="field-${field}"]`).fill(String(value));
    }
    
    await this.page.locator('[data-testid="save-button"]').click();
    await this.waitForPageLoad();
  }

  async searchDocuments(query: string) {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
    await this.waitForPageLoad();
  }

  async selectAllDocuments() {
    await this.page.locator('[data-testid="select-all-checkbox"]').check();
  }

  async bulkDelete() {
    await this.selectAllDocuments();
    await this.bulkActionsBar.locator('[data-testid="bulk-delete"]').click();
    await this.page.locator('[data-testid="confirm-delete"]').click();
    await this.waitForPageLoad();
  }
}
```

## Story-Specific E2E Tests

### Story 1: Core Dashboard Service
```typescript
// tests/e2e/specs/dashboard/overview.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../fixtures/page-objects/login-page';
import { DashboardPage } from '../fixtures/page-objects/dashboard-page';

test.describe('Dashboard Overview', () => {
  test('should display dashboard overview with metrics', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Login as admin user
    await page.goto('/login');
    await loginPage.login('admin@example.com', 'password123');

    // Verify dashboard loads
    await dashboardPage.waitForPageLoad();
    
    // Check overview cards are displayed
    await expect(dashboardPage.overviewCards).toBeVisible();
    await expect(dashboardPage.userStatsCard).toContainText('Total Users');
    await expect(dashboardPage.mediaStatsCard).toContainText('Media Files');
    
    // Check recent activity is displayed
    await expect(dashboardPage.recentActivity).toBeVisible();
  });

  test('should handle dashboard loading errors gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('/api/dashboard/overview', route => 
      route.fulfill({ status: 500, body: 'Server Error' })
    );

    const dashboardPage = new DashboardPage(page);
    await page.goto('/dashboard');

    // Should show error state
    await expect(dashboardPage.errorMessage).toBeVisible();
    await expect(dashboardPage.retryButton).toBeVisible();
  });
});
```

### Story 2: Authentication Integration
```typescript
// tests/e2e/specs/auth/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../fixtures/page-objects/login-page';

test.describe('Authentication Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto('/login');
    await loginPage.login('admin@example.com', 'password123');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto('/login');
    await loginPage.login('invalid@example.com', 'wrongpassword');

    await loginPage.expectLoginError('Invalid email or password');
  });

  test('should persist authentication across page refreshes', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Login
    await page.goto('/login');
    await loginPage.login('admin@example.com', 'password123');
    await expect(page).toHaveURL('/dashboard');

    // Refresh page
    await page.reload();
    
    // Should still be authenticated
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });
});
```

### Story 3: Collection Management
```typescript
// tests/e2e/specs/collections/user-management.spec.ts
import { test, expect } from '@playwright/test';
import { CollectionManagerPage } from '../fixtures/page-objects/collection-manager-page';
import { authenticateAsAdmin } from '../fixtures/auth';

test.describe('User Collection Management', () => {
  test.beforeEach(async ({ page }) => {
    await authenticateAsAdmin(page);
    await page.goto('/dashboard/collections/users');
  });

  test('should create a new user', async ({ page }) => {
    const collectionPage = new CollectionManagerPage(page);

    await collectionPage.createNewDocument({
      name: 'Test User',
      email: 'testuser@example.com',
      role: 'creator'
    });

    // Verify user appears in list
    await expect(collectionPage.dataTable).toContainText('Test User');
    await expect(collectionPage.dataTable).toContainText('testuser@example.com');
  });

  test('should search for users', async ({ page }) => {
    const collectionPage = new CollectionManagerPage(page);

    await collectionPage.searchDocuments('admin');
    
    // Should show only matching results
    await expect(collectionPage.dataTable).toContainText('admin');
    await expect(collectionPage.dataTable).not.toContainText('creator');
  });

  test('should perform bulk delete operation', async ({ page }) => {
    const collectionPage = new CollectionManagerPage(page);

    // Get initial count
    const initialRows = await collectionPage.dataTable.locator('tbody tr').count();

    await collectionPage.bulkDelete();

    // Verify deletion
    const finalRows = await collectionPage.dataTable.locator('tbody tr').count();
    expect(finalRows).toBeLessThan(initialRows);
  });
});
```

### Story 4: Real-time Updates
```typescript
// tests/e2e/specs/dashboard/real-time-updates.spec.ts
import { test, expect } from '@playwright/test';
import { DashboardPage } from '../fixtures/page-objects/dashboard-page';
import { authenticateAsAdmin } from '../fixtures/auth';

test.describe('Real-time Updates', () => {
  test('should receive real-time notifications', async ({ page, context }) => {
    await authenticateAsAdmin(page);
    
    // Open dashboard in first tab
    const dashboardPage = new DashboardPage(page);
    await page.goto('/dashboard');
    await dashboardPage.waitForPageLoad();

    // Open second tab to simulate another user
    const secondPage = await context.newPage();
    await authenticateAsAdmin(secondPage);
    await secondPage.goto('/dashboard/collections/users');

    // Create user in second tab
    await secondPage.locator('[data-testid="create-button"]').click();
    await secondPage.locator('[data-testid="field-name"]').fill('Real-time Test User');
    await secondPage.locator('[data-testid="field-email"]').fill('realtime@example.com');
    await secondPage.locator('[data-testid="save-button"]').click();

    // Check for notification in first tab
    await expect(dashboardPage.notificationToast).toBeVisible();
    await expect(dashboardPage.notificationToast).toContainText('New user created');
  });

  test('should show connection status indicator', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await authenticateAsAdmin(page);
    await page.goto('/dashboard');

    // Should show connected status
    await expect(dashboardPage.connectionStatus).toBeVisible();
    await expect(dashboardPage.connectionStatus).toContainText('Connected');

    // Simulate connection loss
    await page.setOfflineMode(true);
    
    // Should show disconnected status
    await expect(dashboardPage.connectionStatus).toContainText('Disconnected');
  });
});
```

### Story 5: Admin Panel Enhancement
```typescript
// tests/e2e/specs/admin/system-monitoring.spec.ts
import { test, expect } from '@playwright/test';
import { AdminPanelPage } from '../fixtures/page-objects/admin-panel-page';
import { authenticateAsAdmin } from '../fixtures/auth';

test.describe('Admin Panel System Monitoring', () => {
  test('should display system health metrics', async ({ page }) => {
    const adminPage = new AdminPanelPage(page);
    await authenticateAsAdmin(page);
    await page.goto('/dashboard/admin');

    await adminPage.navigateToTab('monitoring');

    // Check system health indicators
    await expect(adminPage.systemHealthCard).toBeVisible();
    await expect(adminPage.apiHealthIndicator).toBeVisible();
    await expect(adminPage.databaseHealthIndicator).toBeVisible();

    // Check performance metrics
    await expect(adminPage.performanceMetrics).toBeVisible();
    await expect(adminPage.responseTimeChart).toBeVisible();
  });

  test('should display user analytics', async ({ page }) => {
    const adminPage = new AdminPanelPage(page);
    await authenticateAsAdmin(page);
    await page.goto('/dashboard/admin');

    await adminPage.navigateToTab('analytics');

    // Check user analytics charts
    await expect(adminPage.userGrowthChart).toBeVisible();
    await expect(adminPage.userEngagementMetrics).toBeVisible();
    await expect(adminPage.activeUsersCount).toBeVisible();
  });
});
```

## Performance E2E Tests

### Page Load Performance
```typescript
// tests/e2e/specs/performance/page-load-times.spec.ts
import { test, expect } from '@playwright/test';
import { authenticateAsAdmin } from '../fixtures/auth';

test.describe('Page Load Performance', () => {
  test('dashboard should load within 2 seconds', async ({ page }) => {
    await authenticateAsAdmin(page);

    const startTime = Date.now();
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(2000);
  });

  test('collection pages should load within 3 seconds', async ({ page }) => {
    await authenticateAsAdmin(page);

    const startTime = Date.now();
    await page.goto('/dashboard/collections/users');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });
});
```

## Accessibility E2E Tests

### Accessibility Testing
```typescript
// tests/e2e/specs/accessibility/dashboard-a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { authenticateAsAdmin } from '../fixtures/auth';

test.describe('Dashboard Accessibility', () => {
  test('dashboard should be accessible', async ({ page }) => {
    await authenticateAsAdmin(page);
    await page.goto('/dashboard');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('collection manager should be accessible', async ({ page }) => {
    await authenticateAsAdmin(page);
    await page.goto('/dashboard/collections/users');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

## Test Data Management

### Test Data Setup
```typescript
// tests/e2e/fixtures/test-data.ts
export const testUsers = {
  admin: {
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  creator: {
    email: 'creator@example.com',
    password: 'creator123',
    role: 'creator'
  },
  brand: {
    email: 'brand@example.com',
    password: 'brand123',
    role: 'brand'
  }
};

export const testCollectionData = {
  users: [
    { name: 'Test User 1', email: 'user1@example.com', role: 'creator' },
    { name: 'Test User 2', email: 'user2@example.com', role: 'brand' }
  ],
  media: [
    { filename: 'test-image-1.jpg', alt: 'Test Image 1' },
    { filename: 'test-image-2.jpg', alt: 'Test Image 2' }
  ]
};
```

## Test Execution Commands

### Basic E2E Tests
```bash
# Run all E2E tests
pnpm test:e2e

# Run E2E tests in headed mode
pnpm test:e2e --headed

# Run specific test file
pnpm test:e2e tests/e2e/specs/auth/login.spec.ts

# Run tests on specific browser
pnpm test:e2e --project=chromium
```

### CI/CD Integration
```bash
# Run E2E tests in CI mode
pnpm test:e2e --reporter=junit

# Run E2E tests with video recording
pnpm test:e2e --video=on

# Run E2E tests with trace
pnpm test:e2e --trace=on
```

## Quality Gates

### E2E Test Requirements
- All critical user workflows must pass
- Tests must run in under 10 minutes
- Cross-browser compatibility verified
- Accessibility standards met (WCAG 2.1 AA)
- Performance benchmarks achieved

### Success Criteria
- 100% pass rate for critical workflows
- < 5% flaky test rate
- All browsers supported
- Zero accessibility violations
- Performance targets met
