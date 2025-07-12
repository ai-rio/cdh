# Performance Test Plan - Dashboard Migration

## Overview

This document outlines the performance testing strategy for the Payload CMS Dashboard Integration project. Performance tests ensure the system meets speed, scalability, and resource usage requirements under various load conditions.

## Performance Testing Framework

### Required Dependencies
```bash
# Performance testing dependencies
pnpm add -D k6
pnpm add -D lighthouse
pnpm add -D @playwright/test
pnpm add -D clinic
pnpm add -D autocannon
```

### Performance Testing Tools

#### K6 for Load Testing
```javascript
// tests/performance/k6-config.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up
    { duration: '5m', target: 50 }, // Stay at 50 users
    { duration: '2m', target: 100 }, // Ramp up to 100
    { duration: '5m', target: 100 }, // Stay at 100
    { duration: '2m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'], // Error rate under 1%
  },
};
```

#### Lighthouse for Web Performance
```typescript
// tests/performance/lighthouse-config.ts
export const lighthouseConfig = {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'largest-contentful-paint',
      'cumulative-layout-shift',
      'total-blocking-time',
      'speed-index'
    ],
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1
    }
  }
};
```

## Performance Test Categories

### 1. Load Testing
Test system behavior under expected load conditions.

#### Dashboard Load Test
```javascript
// tests/performance/dashboard-load.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 50, // 50 virtual users
  duration: '5m',
};

export default function() {
  // Login
  let loginResponse = http.post('http://localhost:3000/api/users/login', {
    email: 'test@example.com',
    password: 'password123'
  });
  
  check(loginResponse, {
    'login successful': (r) => r.status === 200,
    'login response time < 1s': (r) => r.timings.duration < 1000,
  });

  let token = loginResponse.json('token');
  let headers = { 'Authorization': `Bearer ${token}` };

  // Dashboard overview
  let dashboardResponse = http.get('http://localhost:3000/api/dashboard/overview', { headers });
  check(dashboardResponse, {
    'dashboard loaded': (r) => r.status === 200,
    'dashboard response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Users collection
  let usersResponse = http.get('http://localhost:3000/api/users', { headers });
  check(usersResponse, {
    'users loaded': (r) => r.status === 200,
    'users response time < 300ms': (r) => r.timings.duration < 300,
  });

  sleep(1);
}
```

#### API Endpoint Load Test
```javascript
// tests/performance/api-load.js
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 20 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 0 },
  ],
};

export default function() {
  let endpoints = [
    '/api/users',
    '/api/media',
    '/api/dashboard/overview',
    '/api/dashboard/metrics'
  ];

  endpoints.forEach(endpoint => {
    let response = http.get(`http://localhost:3000${endpoint}`, {
      headers: { 'Authorization': 'Bearer ' + __ENV.AUTH_TOKEN }
    });

    check(response, {
      [`${endpoint} status 200`]: (r) => r.status === 200,
      [`${endpoint} response time < 500ms`]: (r) => r.timings.duration < 500,
    });
  });
}
```

### 2. Stress Testing
Test system behavior under extreme load conditions.

#### Stress Test Configuration
```javascript
// tests/performance/stress-test.js
export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '5m', target: 400 },
    { duration: '10m', target: 400 },
    { duration: '3m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<1000'], // 99% under 1s
    http_req_failed: ['rate<0.05'], // Error rate under 5%
  },
};
```

### 3. Frontend Performance Testing

#### Page Load Performance
```typescript
// tests/performance/page-performance.spec.ts
import { test, expect } from '@playwright/test';
import { injectSpeedInsights } from '@vercel/speed-insights';

test.describe('Page Performance', () => {
  test('dashboard page load performance', async ({ page }) => {
    // Start performance monitoring
    await page.addInitScript(() => {
      window.performance.mark('test-start');
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Measure performance
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      };
    });

    // Assert performance benchmarks
    expect(performanceMetrics.domContentLoaded).toBeLessThan(1000);
    expect(performanceMetrics.loadComplete).toBeLessThan(2000);
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(1500);
  });

  test('collection page performance with large datasets', async ({ page }) => {
    await page.goto('/dashboard/collections/users?limit=1000');
    
    const startTime = Date.now();
    await page.waitForSelector('[data-testid="data-table"]');
    const renderTime = Date.now() - startTime;

    expect(renderTime).toBeLessThan(3000);
  });
});
```

#### Memory Usage Testing
```typescript
// tests/performance/memory-usage.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Memory Usage', () => {
  test('dashboard memory usage should remain stable', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    // Perform typical user actions
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="nav-users"]');
      await page.waitForLoadState('networkidle');
      await page.click('[data-testid="nav-dashboard"]');
      await page.waitForLoadState('networkidle');
    }

    // Check final memory usage
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    const memoryIncrease = finalMemory - initialMemory;
    const memoryIncreasePercent = (memoryIncrease / initialMemory) * 100;

    // Memory increase should be less than 50%
    expect(memoryIncreasePercent).toBeLessThan(50);
  });
});
```

### 4. Database Performance Testing

#### Database Query Performance
```typescript
// tests/performance/database-performance.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { payloadClient } from '@/lib/payload-client';

describe('Database Performance', () => {
  beforeAll(async () => {
    // Create test data
    await createLargeDataset();
  });

  afterAll(async () => {
    // Cleanup test data
    await cleanupTestData();
  });

  it('should query users efficiently with large dataset', async () => {
    const startTime = Date.now();
    
    const result = await payloadClient.getUsers({
      limit: 100,
      page: 1
    });
    
    const queryTime = Date.now() - startTime;
    
    expect(queryTime).toBeLessThan(500); // Under 500ms
    expect(result.docs).toHaveLength(100);
  });

  it('should handle complex queries efficiently', async () => {
    const startTime = Date.now();
    
    const result = await payloadClient.getUsers({
      where: {
        and: [
          { role: { equals: 'creator' } },
          { createdAt: { greater_than: new Date('2023-01-01') } }
        ]
      },
      sort: '-createdAt',
      limit: 50
    });
    
    const queryTime = Date.now() - startTime;
    
    expect(queryTime).toBeLessThan(1000); // Under 1s
  });
});
```

### 5. WebSocket Performance Testing

#### Real-time Performance
```javascript
// tests/performance/websocket-performance.js
import ws from 'k6/ws';
import { check } from 'k6';

export let options = {
  vus: 100,
  duration: '5m',
};

export default function() {
  const url = 'ws://localhost:3000/ws';
  const params = { tags: { my_tag: 'websocket' } };

  const response = ws.connect(url, params, function(socket) {
    socket.on('open', function() {
      console.log('WebSocket connection established');
      
      // Send periodic messages
      socket.setInterval(function() {
        socket.send(JSON.stringify({
          type: 'heartbeat',
          timestamp: Date.now()
        }));
      }, 1000);
    });

    socket.on('message', function(message) {
      const data = JSON.parse(message);
      check(data, {
        'message received': (d) => d !== null,
        'message latency < 100ms': (d) => (Date.now() - d.timestamp) < 100,
      });
    });

    socket.setTimeout(function() {
      socket.close();
    }, 60000); // Close after 1 minute
  });

  check(response, { 'WebSocket connection successful': (r) => r && r.status === 101 });
}
```

## Performance Benchmarks

### Response Time Targets
| Operation | Target | Acceptable | Critical |
|-----------|--------|------------|----------|
| Dashboard Load | < 1s | < 2s | < 3s |
| API Requests | < 300ms | < 500ms | < 1s |
| Search Results | < 500ms | < 1s | < 2s |
| File Upload (10MB) | < 30s | < 60s | < 120s |
| Bulk Operations (100 items) | < 5s | < 10s | < 20s |

### Throughput Targets
| Metric | Target | Acceptable | Critical |
|--------|--------|------------|----------|
| Concurrent Users | 100 | 50 | 25 |
| Requests/Second | 1000 | 500 | 250 |
| Database Queries/Second | 500 | 250 | 100 |
| WebSocket Connections | 500 | 250 | 100 |

### Resource Usage Targets
| Resource | Target | Acceptable | Critical |
|----------|--------|------------|----------|
| Memory Usage | < 100MB | < 150MB | < 200MB |
| CPU Usage | < 50% | < 70% | < 90% |
| Database Connections | < 50 | < 100 | < 150 |
| Cache Hit Rate | > 70% | > 50% | > 30% |

## Test Execution Commands

### Load Testing
```bash
# Run basic load test
pnpm test:performance:load

# Run stress test
pnpm test:performance:stress

# Run API performance test
pnpm test:performance:api

# Run WebSocket performance test
pnpm test:performance:websocket
```

### Frontend Performance
```bash
# Run Lighthouse performance audit
pnpm test:performance:lighthouse

# Run page load performance tests
pnpm test:performance:pages

# Run memory usage tests
pnpm test:performance:memory
```

### Database Performance
```bash
# Run database performance tests
pnpm test:performance:database

# Run query optimization tests
pnpm test:performance:queries
```

## Performance Monitoring

### Real-time Monitoring Setup
```typescript
// src/lib/performance-monitor.ts
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  getAverageMetric(name: string): number {
    const values = this.metrics.get(name) || [];
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  getPercentile(name: string, percentile: number): number {
    const values = this.metrics.get(name) || [];
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index] || 0;
  }

  exportMetrics() {
    const report: Record<string, any> = {};
    
    for (const [name, values] of this.metrics.entries()) {
      report[name] = {
        count: values.length,
        average: this.getAverageMetric(name),
        p50: this.getPercentile(name, 50),
        p95: this.getPercentile(name, 95),
        p99: this.getPercentile(name, 99),
        min: Math.min(...values),
        max: Math.max(...values)
      };
    }
    
    return report;
  }
}
```

### Performance Dashboard
```typescript
// src/app/(dashboard)/components/performance-dashboard.tsx
export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await fetch('/api/performance/metrics').then(r => r.json());
      setMetrics(data);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="performance-dashboard">
      <div className="metrics-grid">
        <MetricCard
          title="Response Time"
          value={metrics?.responseTime.average}
          unit="ms"
          target={300}
        />
        <MetricCard
          title="Throughput"
          value={metrics?.throughput}
          unit="req/s"
          target={1000}
        />
        <MetricCard
          title="Error Rate"
          value={metrics?.errorRate}
          unit="%"
          target={1}
          inverse
        />
        <MetricCard
          title="Memory Usage"
          value={metrics?.memoryUsage}
          unit="MB"
          target={100}
        />
      </div>
      
      <div className="charts-section">
        <ResponseTimeChart data={metrics?.responseTimeHistory} />
        <ThroughputChart data={metrics?.throughputHistory} />
      </div>
    </div>
  );
}
```

## Performance Optimization Strategies

### Frontend Optimizations
1. **Code Splitting**: Lazy load components and routes
2. **Caching**: Implement aggressive caching strategies
3. **Virtualization**: Use virtual scrolling for large lists
4. **Memoization**: Optimize React re-renders
5. **Bundle Optimization**: Tree shaking and minification

### Backend Optimizations
1. **Database Indexing**: Optimize database queries
2. **Connection Pooling**: Efficient database connections
3. **Caching Layer**: Redis for frequently accessed data
4. **API Optimization**: Request batching and deduplication
5. **CDN**: Static asset delivery optimization

### Infrastructure Optimizations
1. **Load Balancing**: Distribute traffic across instances
2. **Auto Scaling**: Scale based on demand
3. **Monitoring**: Real-time performance monitoring
4. **Alerting**: Proactive issue detection
5. **Resource Optimization**: Right-size infrastructure

## Performance Test Automation

### CI/CD Integration
```yaml
# .github/workflows/performance-tests.yml
name: Performance Tests
on:
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM
  workflow_dispatch:

jobs:
  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Start application
        run: |
          pnpm build
          pnpm start &
          sleep 30
      
      - name: Run load tests
        run: pnpm test:performance:load
      
      - name: Run Lighthouse audit
        run: pnpm test:performance:lighthouse
      
      - name: Upload performance results
        uses: actions/upload-artifact@v3
        with:
          name: performance-results
          path: test-results/performance/
```

## Performance Regression Detection

### Automated Performance Monitoring
```typescript
// tests/performance/regression-detection.ts
interface PerformanceBenchmark {
  metric: string;
  baseline: number;
  threshold: number; // Percentage increase that triggers alert
}

const benchmarks: PerformanceBenchmark[] = [
  { metric: 'dashboard_load_time', baseline: 1000, threshold: 20 },
  { metric: 'api_response_time', baseline: 300, threshold: 30 },
  { metric: 'memory_usage', baseline: 100, threshold: 50 },
];

export function detectPerformanceRegression(
  currentMetrics: Record<string, number>
): { hasRegression: boolean; regressions: string[] } {
  const regressions: string[] = [];

  for (const benchmark of benchmarks) {
    const currentValue = currentMetrics[benchmark.metric];
    if (!currentValue) continue;

    const increase = ((currentValue - benchmark.baseline) / benchmark.baseline) * 100;
    
    if (increase > benchmark.threshold) {
      regressions.push(
        `${benchmark.metric}: ${increase.toFixed(1)}% increase (${currentValue}ms vs ${benchmark.baseline}ms baseline)`
      );
    }
  }

  return {
    hasRegression: regressions.length > 0,
    regressions
  };
}
```

## Reporting and Analysis

### Performance Report Generation
```typescript
// scripts/generate-performance-report.ts
import { generateReport } from './performance-reporter';

async function main() {
  const report = await generateReport({
    timeRange: '24h',
    includeCharts: true,
    format: 'html'
  });

  console.log('Performance report generated:', report.path);
}

main().catch(console.error);
```

### Performance Metrics Dashboard
- Real-time performance monitoring
- Historical trend analysis
- Performance regression alerts
- Resource usage tracking
- User experience metrics

## Quality Gates

### Performance Acceptance Criteria
- All performance benchmarks must be met
- No performance regressions > 20%
- Load tests must pass with 95% success rate
- Memory usage must remain stable
- Error rates must stay below 1%

### Performance Review Process
1. Run performance tests before each release
2. Review performance metrics weekly
3. Investigate any performance regressions
4. Update benchmarks based on infrastructure changes
5. Optimize based on real-world usage patterns
