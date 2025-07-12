# Unit Test Plan - Dashboard Migration

## Overview

This document outlines the comprehensive unit testing strategy for the Payload CMS Dashboard Integration project. All tests must be run using `pnpm` and achieve minimum 80% code coverage.

## Testing Framework Setup

### Required Dependencies
```bash
# Core testing dependencies
pnpm add -D vitest @vitest/ui @vitest/coverage-v8
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D jsdom happy-dom
pnpm add -D msw

# TypeScript testing support
pnpm add -D @types/jest
```

### Test Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

## Test Structure and Organization

### Directory Structure
```
tests/
├── __mocks__/                     # Global mocks
│   ├── payload-client.ts
│   ├── websocket.ts
│   └── next-router.ts
├── lib/                          # Library unit tests
│   ├── dashboard-service.test.ts
│   ├── auth-service.test.ts
│   ├── payload-client.test.ts
│   ├── cache-manager.test.ts
│   └── performance-monitor.test.ts
├── hooks/                        # Custom hooks tests
│   ├── use-payload-auth.test.ts
│   ├── use-collection-manager.test.ts
│   ├── use-realtime-data.test.ts
│   └── use-performance-monitor.test.ts
├── components/                   # Component tests
│   ├── collection-manager.test.tsx
│   ├── dynamic-form.test.tsx
│   ├── user-profile-manager.test.tsx
│   └── notification-system.test.tsx
└── utils/                        # Utility function tests
    ├── validation.test.ts
    ├── formatting.test.ts
    └── performance-utils.test.ts
```

## Story-Specific Test Plans

### Story 1: Core Dashboard Service

#### Files to Test
- `src/lib/dashboard-service.ts`
- `src/lib/dashboard-utils.ts`
- `src/lib/dashboard-types.ts`

#### Test Cases
```typescript
// tests/lib/dashboard-service.test.ts
describe('DashboardService', () => {
  describe('initialization', () => {
    it('should initialize with default configuration');
    it('should initialize with custom configuration');
    it('should handle initialization errors gracefully');
  });

  describe('data aggregation', () => {
    it('should aggregate user and media collections');
    it('should calculate dashboard metrics correctly');
    it('should handle empty collections');
    it('should handle API errors during aggregation');
  });

  describe('caching', () => {
    it('should cache API responses');
    it('should invalidate cache when data changes');
    it('should handle cache misses gracefully');
    it('should respect cache TTL settings');
  });

  describe('error handling', () => {
    it('should handle network errors');
    it('should handle authentication errors');
    it('should handle rate limiting');
    it('should provide meaningful error messages');
  });
});
```

#### Coverage Requirements
- **Minimum:** 85% line coverage
- **Functions:** 90% coverage
- **Branches:** 80% coverage

#### Test Commands
```bash
# Run dashboard service tests
pnpm test:unit src/lib/dashboard-service

# Run with coverage
pnpm test:unit --coverage src/lib/dashboard-service

# Run in watch mode
pnpm test:unit --watch src/lib/dashboard-service
```

### Story 2: Authentication Integration

#### Files to Test
- `src/app/(dashboard)/hooks/use-payload-auth.ts`
- `src/contexts/AuthContext.tsx`
- `src/lib/auth-service.ts`

#### Test Cases
```typescript
// tests/hooks/use-payload-auth.test.ts
describe('usePayloadAuth', () => {
  describe('authentication state', () => {
    it('should initialize with unauthenticated state');
    it('should update state on successful login');
    it('should clear state on logout');
    it('should persist authentication across page reloads');
  });

  describe('login functionality', () => {
    it('should login with valid credentials');
    it('should reject invalid credentials');
    it('should handle network errors during login');
    it('should validate email format');
    it('should validate password requirements');
  });

  describe('role-based access', () => {
    it('should check user permissions correctly');
    it('should handle role changes');
    it('should restrict access based on roles');
  });

  describe('token management', () => {
    it('should refresh tokens before expiration');
    it('should handle token refresh failures');
    it('should logout on token expiration');
  });
});
```

#### Mock Setup
```typescript
// tests/__mocks__/auth-service.ts
export const mockAuthService = {
  login: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
  refreshToken: vi.fn(),
  isValidEmail: vi.fn(),
  validatePassword: vi.fn()
};
```

### Story 3: Collection Management

#### Files to Test
- `src/app/(dashboard)/hooks/use-collection-manager.ts`
- `src/app/(dashboard)/components/collection-manager.tsx`
- `src/app/(dashboard)/components/dynamic-form.tsx`

#### Test Cases
```typescript
// tests/hooks/use-collection-manager.test.ts
describe('useCollectionManager', () => {
  describe('CRUD operations', () => {
    it('should create documents successfully');
    it('should read documents with pagination');
    it('should update documents with validation');
    it('should delete documents with confirmation');
    it('should handle bulk operations');
  });

  describe('search and filtering', () => {
    it('should search documents by query');
    it('should filter documents by criteria');
    it('should sort documents by fields');
    it('should combine search and filters');
  });

  describe('caching and optimization', () => {
    it('should cache collection data');
    it('should use optimistic updates');
    it('should handle cache invalidation');
  });
});

// tests/components/dynamic-form.test.tsx
describe('DynamicForm', () => {
  describe('form rendering', () => {
    it('should render all field types correctly');
    it('should handle nested field structures');
    it('should render conditional fields');
    it('should handle array fields');
  });

  describe('form validation', () => {
    it('should validate required fields');
    it('should validate field formats');
    it('should show validation errors');
    it('should prevent submission with errors');
  });

  describe('form submission', () => {
    it('should submit valid forms');
    it('should handle submission errors');
    it('should show loading states');
    it('should reset form after submission');
  });
});
```

### Story 4: Real-time Updates

#### Files to Test
- `src/lib/websocket-client.ts`
- `src/app/(dashboard)/hooks/use-realtime-data.ts`
- `src/app/(dashboard)/components/notification-system.tsx`

#### Test Cases
```typescript
// tests/lib/websocket-client.test.ts
describe('WebSocketClient', () => {
  describe('connection management', () => {
    it('should establish connection successfully');
    it('should handle connection failures');
    it('should reconnect automatically');
    it('should manage connection state');
  });

  describe('event handling', () => {
    it('should subscribe to events');
    it('should unsubscribe from events');
    it('should emit events');
    it('should handle event errors');
  });

  describe('heartbeat mechanism', () => {
    it('should send heartbeat messages');
    it('should detect connection loss');
    it('should trigger reconnection on timeout');
  });
});
```

#### Mock WebSocket
```typescript
// tests/__mocks__/websocket.ts
export class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  onopen = vi.fn();
  onclose = vi.fn();
  onmessage = vi.fn();
  onerror = vi.fn();

  constructor(url: string) {
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      this.onopen?.({} as Event);
    }, 100);
  }

  send = vi.fn();
  close = vi.fn();
}
```

### Story 5: Admin Panel Enhancement

#### Files to Test
- `src/app/(dashboard)/components/integrated-admin-panel.tsx`
- `src/app/(dashboard)/components/system-health.tsx`
- `src/lib/analytics-service.ts`

#### Test Cases
```typescript
// tests/components/system-health.test.tsx
describe('SystemHealth', () => {
  describe('health monitoring', () => {
    it('should display system status correctly');
    it('should show component health states');
    it('should update metrics in real-time');
    it('should handle health check failures');
  });

  describe('performance metrics', () => {
    it('should display response time metrics');
    it('should show resource usage');
    it('should track API performance');
    it('should identify slow queries');
  });
});
```

### Story 6: User Management

#### Files to Test
- `src/app/(dashboard)/components/user-profile-manager.tsx`
- `src/app/(dashboard)/components/user-activity-monitor.tsx`
- `src/lib/user-activity-service.ts`

#### Test Cases
```typescript
// tests/components/user-profile-manager.test.tsx
describe('UserProfileManager', () => {
  describe('profile editing', () => {
    it('should load user profile data');
    it('should validate profile updates');
    it('should save profile changes');
    it('should handle save errors');
  });

  describe('social media integration', () => {
    it('should validate social media URLs');
    it('should update social media links');
    it('should handle invalid URLs');
  });
});
```

### Story 7: Performance Optimization

#### Files to Test
- `src/lib/cache-manager.ts`
- `src/lib/performance-monitor.ts`
- `src/hooks/use-virtual-scroll.ts`

#### Test Cases
```typescript
// tests/lib/cache-manager.test.ts
describe('CacheManager', () => {
  describe('cache operations', () => {
    it('should store and retrieve cached data');
    it('should handle cache expiration');
    it('should invalidate cache entries');
    it('should clear entire cache');
  });

  describe('cache strategies', () => {
    it('should implement stale-while-revalidate');
    it('should implement cache-first strategy');
    it('should implement network-first strategy');
  });
});
```

## Test Utilities and Helpers

### Custom Render Function
```typescript
// tests/utils/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Mock Data Factories
```typescript
// tests/utils/mock-factories.ts
import { User, Media } from '@/payload-types';

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'creator',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

export const createMockMedia = (overrides?: Partial<Media>): Media => ({
  id: '1',
  filename: 'test-image.jpg',
  mimeType: 'image/jpeg',
  filesize: 1024,
  width: 800,
  height: 600,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});
```

## Test Commands

### Basic Test Commands
```bash
# Run all unit tests
pnpm test:unit

# Run tests with coverage
pnpm test:unit --coverage

# Run tests in watch mode
pnpm test:unit --watch

# Run specific test file
pnpm test:unit src/lib/dashboard-service

# Run tests matching pattern
pnpm test:unit --grep "authentication"
```

### Coverage Commands
```bash
# Generate coverage report
pnpm test:unit --coverage --reporter=html

# Check coverage thresholds
pnpm test:unit --coverage --reporter=text

# Coverage for specific directory
pnpm test:unit --coverage src/lib/
```

### CI/CD Integration
```bash
# Run tests in CI mode
pnpm test:unit --run --coverage --reporter=json

# Run tests with JUnit output
pnpm test:unit --run --reporter=junit --outputFile=test-results.xml
```

## Quality Gates

### Coverage Requirements
- **Overall Coverage:** Minimum 80%
- **Critical Components:** Minimum 90%
- **New Code:** Minimum 85%
- **Branches:** Minimum 75%

### Test Quality Metrics
- All tests must pass consistently
- No flaky tests allowed
- Test execution time < 30 seconds for full suite
- Memory usage during tests < 512MB

### Code Quality Checks
```bash
# Run linting with tests
pnpm lint && pnpm test:unit

# Type checking with tests
pnpm type-check && pnpm test:unit

# Full quality check
pnpm test:quality
```

## Continuous Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Unit Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:unit --coverage
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
```

## Best Practices

### Test Writing Guidelines
1. **Arrange-Act-Assert Pattern:** Structure tests clearly
2. **Descriptive Test Names:** Use clear, descriptive test names
3. **Single Responsibility:** Each test should test one thing
4. **Mock External Dependencies:** Mock all external services
5. **Test Edge Cases:** Include error scenarios and edge cases

### Performance Considerations
1. **Parallel Execution:** Run tests in parallel when possible
2. **Efficient Mocking:** Use lightweight mocks
3. **Memory Management:** Clean up resources after tests
4. **Fast Feedback:** Prioritize fast-running tests

### Maintenance
1. **Regular Updates:** Keep test dependencies updated
2. **Refactor Tests:** Refactor tests when code changes
3. **Remove Dead Tests:** Remove obsolete tests
4. **Documentation:** Document complex test scenarios
