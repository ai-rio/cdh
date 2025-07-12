# Integration Test Plan - Dashboard Migration

## Overview

This document outlines the integration testing strategy for the Payload CMS Dashboard Integration project. Integration tests verify that different components work together correctly and that the system behaves as expected when components interact.

## Testing Framework Setup

### Required Dependencies
```bash
# Integration testing dependencies
pnpm add -D @playwright/test
pnpm add -D @testing-library/react @testing-library/jest-dom
pnpm add -D msw
pnpm add -D docker-compose
pnpm add -D testcontainers
```

### Test Environment Setup
```typescript
// tests/integration/setup.ts
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
```

## Integration Test Categories

### 1. API Integration Tests
Test the integration between frontend components and Payload CMS API.

#### Dashboard Service Integration
```typescript
// tests/integration/dashboard-service-api.test.ts
describe('Dashboard Service API Integration', () => {
  describe('collection data fetching', () => {
    it('should fetch and aggregate user and media collections');
    it('should handle API rate limiting gracefully');
    it('should retry failed requests with exponential backoff');
    it('should cache responses and serve from cache');
  });

  describe('authentication integration', () => {
    it('should authenticate requests with valid tokens');
    it('should refresh expired tokens automatically');
    it('should handle authentication failures');
  });

  describe('error handling', () => {
    it('should handle network timeouts');
    it('should handle server errors (5xx)');
    it('should handle client errors (4xx)');
    it('should provide meaningful error messages');
  });
});
```

### 2. Component Integration Tests
Test how React components interact with services and hooks.

#### Collection Manager Integration
```typescript
// tests/integration/collection-manager-flow.test.ts
describe('Collection Manager Integration', () => {
  describe('CRUD workflow', () => {
    it('should complete full create-read-update-delete cycle');
    it('should handle form validation with API responses');
    it('should update UI optimistically and rollback on errors');
    it('should sync data across multiple component instances');
  });

  describe('bulk operations', () => {
    it('should perform bulk delete operations');
    it('should handle partial failures in bulk operations');
    it('should provide progress feedback for long operations');
  });
});
```

### 3. Authentication Flow Integration
Test complete authentication workflows.

#### Auth Flow Integration
```typescript
// tests/integration/auth-flow.test.ts
describe('Authentication Flow Integration', () => {
  describe('login workflow', () => {
    it('should complete login and redirect to dashboard');
    it('should persist authentication across page refreshes');
    it('should handle concurrent login attempts');
  });

  describe('role-based access', () => {
    it('should enforce role-based route protection');
    it('should show/hide features based on user roles');
    it('should handle role changes during active session');
  });
});
```

### 4. Real-time Integration Tests
Test WebSocket and real-time functionality.

#### WebSocket Integration
```typescript
// tests/integration/websocket-realtime.test.ts
describe('WebSocket Real-time Integration', () => {
  describe('connection management', () => {
    it('should establish WebSocket connection on dashboard load');
    it('should reconnect automatically after connection loss');
    it('should handle multiple concurrent connections');
  });

  describe('real-time updates', () => {
    it('should receive and display real-time collection updates');
    it('should sync updates across multiple browser tabs');
    it('should handle conflicting updates gracefully');
  });
});
```

## Test Environment Configuration

### Docker Compose for Integration Tests
```yaml
# docker-compose.test.yml
version: '3.8'
services:
  postgres-test:
    image: postgres:15
    environment:
      POSTGRES_DB: payload_test
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
    ports:
      - "5433:5432"
    
  redis-test:
    image: redis:7-alpine
    ports:
      - "6380:6379"
      
  payload-test:
    build: .
    environment:
      DATABASE_URI: postgresql://test:test@postgres-test:5432/payload_test
      REDIS_URL: redis://redis-test:6379
      NODE_ENV: test
    ports:
      - "3001:3000"
    depends_on:
      - postgres-test
      - redis-test
```

### Test Database Setup
```typescript
// tests/integration/database-setup.ts
import { execSync } from 'child_process';

export async function setupTestDatabase() {
  // Start test containers
  execSync('docker-compose -f docker-compose.test.yml up -d');
  
  // Wait for services to be ready
  await waitForServices();
  
  // Run migrations
  execSync('pnpm payload migrate');
  
  // Seed test data
  await seedTestData();
}

export async function teardownTestDatabase() {
  execSync('docker-compose -f docker-compose.test.yml down -v');
}
```

## Story-Specific Integration Tests

### Story 1: Core Dashboard Service
```bash
# Run dashboard service integration tests
pnpm test:integration dashboard-service-api
pnpm test:integration dashboard-caching
pnpm test:integration dashboard-error-handling
```

### Story 2: Authentication Integration
```bash
# Run authentication integration tests
pnpm test:integration auth-flow
pnpm test:integration role-based-access
pnpm test:integration token-management
```

### Story 3: Collection Management
```bash
# Run collection management integration tests
pnpm test:integration collection-crud
pnpm test:integration bulk-operations
pnpm test:integration file-upload
```

### Story 4: Real-time Updates
```bash
# Run real-time integration tests
pnpm test:integration websocket-connection
pnpm test:integration realtime-updates
pnpm test:integration notification-system
```

### Story 5: Admin Panel Enhancement
```bash
# Run admin panel integration tests
pnpm test:integration admin-panel-functionality
pnpm test:integration system-monitoring
pnpm test:integration user-analytics
```

### Story 6: User Management
```bash
# Run user management integration tests
pnpm test:integration user-management-workflows
pnpm test:integration user-profile-management
pnpm test:integration user-activity-tracking
```

### Story 7: Performance Optimization
```bash
# Run performance integration tests
pnpm test:integration cache-performance
pnpm test:integration performance-monitoring
pnpm test:integration optimization-effectiveness
```

## Test Data Management

### Test Data Factory
```typescript
// tests/integration/test-data-factory.ts
export class TestDataFactory {
  static async createTestUser(overrides = {}) {
    return await payloadClient.createDocument('users', {
      name: 'Test User',
      email: 'test@example.com',
      role: 'creator',
      ...overrides
    });
  }

  static async createTestCollection(name: string, count: number) {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(await this.createTestUser({ 
        name: `Test User ${i}`,
        email: `test${i}@example.com`
      }));
    }
    return items;
  }

  static async cleanupTestData() {
    // Clean up all test data
    await payloadClient.deleteDocument('users', { where: { email: { like: 'test%' } } });
  }
}
```

## Mock Service Workers (MSW) Setup

### API Mocks
```typescript
// tests/integration/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  // Auth endpoints
  rest.post('/api/users/login', (req, res, ctx) => {
    return res(
      ctx.json({
        user: { id: '1', email: 'test@example.com', role: 'admin' },
        token: 'mock-jwt-token'
      })
    );
  }),

  // Collection endpoints
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.json({
        docs: [
          { id: '1', name: 'User 1', email: 'user1@example.com' },
          { id: '2', name: 'User 2', email: 'user2@example.com' }
        ],
        totalDocs: 2,
        page: 1,
        totalPages: 1
      })
    );
  }),

  // WebSocket mock
  rest.get('/ws', (req, res, ctx) => {
    return res(ctx.status(101)); // WebSocket upgrade
  })
];
```

## Performance Integration Tests

### Load Testing Integration
```typescript
// tests/integration/performance-load.test.ts
describe('Performance Load Integration', () => {
  describe('dashboard loading under load', () => {
    it('should maintain performance with 100 concurrent users');
    it('should handle large datasets (10k+ records) efficiently');
    it('should maintain response times under sustained load');
  });

  describe('cache performance', () => {
    it('should improve response times with caching enabled');
    it('should handle cache invalidation correctly');
    it('should maintain cache consistency across instances');
  });
});
```

## Security Integration Tests

### Security Testing
```typescript
// tests/integration/security.test.ts
describe('Security Integration', () => {
  describe('authentication security', () => {
    it('should prevent unauthorized access to protected routes');
    it('should validate JWT tokens correctly');
    it('should handle token tampering attempts');
  });

  describe('data security', () => {
    it('should sanitize user inputs');
    it('should prevent SQL injection attempts');
    it('should enforce role-based data access');
  });
});
```

## Test Execution Commands

### Basic Integration Tests
```bash
# Run all integration tests
pnpm test:integration

# Run specific integration test suite
pnpm test:integration auth-flow

# Run integration tests with coverage
pnpm test:integration --coverage

# Run integration tests in CI mode
pnpm test:integration --run
```

### Environment-Specific Tests
```bash
# Run tests against local environment
pnpm test:integration:local

# Run tests against staging environment
pnpm test:integration:staging

# Run tests with Docker containers
pnpm test:integration:docker
```

## Continuous Integration Setup

### GitHub Actions Workflow
```yaml
# .github/workflows/integration-tests.yml
name: Integration Tests
on: [push, pull_request]

jobs:
  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:integration
        env:
          DATABASE_URI: postgresql://postgres:test@localhost:5432/test
```

## Quality Gates

### Integration Test Requirements
- All integration tests must pass
- Test execution time < 5 minutes for full suite
- No flaky tests (>95% success rate)
- Coverage of all critical user workflows

### Performance Benchmarks
- API integration tests: < 2 seconds per test
- Database integration tests: < 5 seconds per test
- WebSocket integration tests: < 3 seconds per test
- End-to-end workflows: < 10 seconds per test

## Troubleshooting

### Common Issues
1. **Database Connection Issues**: Check Docker containers are running
2. **WebSocket Connection Failures**: Verify WebSocket server is available
3. **Authentication Failures**: Check test tokens and mock configurations
4. **Timeout Issues**: Increase timeout values for slow operations

### Debug Commands
```bash
# Run integration tests with debug output
pnpm test:integration --verbose

# Run specific test with debugging
pnpm test:integration auth-flow --debug

# Check test environment status
pnpm test:integration:health-check
```
