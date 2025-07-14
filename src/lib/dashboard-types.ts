import { User, Media } from '../payload-types';

// Dashboard Overview Data
export interface DashboardOverview {
  totalUsers: number;
  totalMedia: number;
  recentActivity: ActivityItem[];
  systemHealth: SystemHealth;
  quickStats: QuickStats;
}

// Collection Statistics
export interface CollectionStats {
  collection: string;
  totalDocuments: number;
  recentDocuments: number;
  lastUpdated: string;
  avgDocumentSize?: number;
  growthRate?: number;
}

// User Analytics
export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  userRoles: UserRoleDistribution[];
  userActivity: UserActivityMetrics;
}

export interface UserRoleDistribution {
  role: string;
  count: number;
  percentage: number;
}

export interface UserActivityMetrics {
  loginCount: number;
  averageSessionTime: number;
  mostActiveUsers: User[];
}

// System Health
export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  memoryUsage: number;
  diskUsage: number;
  activeConnections: number;
  errorRate: number;
  lastChecked: string;
}

// Activity Items
export interface ActivityItem {
  id: string;
  type: 'user' | 'media' | 'system';
  action: string;
  user?: Partial<User>;
  timestamp: string;
  details?: Record<string, any>;
}

// Quick Stats for Dashboard Cards
export interface QuickStats {
  todayStats: {
    newUsers: number;
    newMedia: number;
    totalActions: number;
  };
  weekStats: {
    newUsers: number;
    newMedia: number;
    totalActions: number;
  };
  monthStats: {
    newUsers: number;
    newMedia: number;
    totalActions: number;
  };
}

// Error Types
export interface DashboardError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Cache Types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  strategy: 'LRU' | 'FIFO' | 'TTL';
}

// Service Configuration
export interface DashboardServiceConfig {
  cache: CacheConfig;
  refreshIntervals: {
    overview: number;
    stats: number;
    health: number;
  };
  performance: {
    maxConcurrentRequests: number;
    requestTimeout: number;
    retryAttempts: number;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    enablePerformanceLogging: boolean;
  };
}

// Performance Metrics
export interface PerformanceMetrics {
  requestCount: number;
  averageResponseTime: number;
  cacheHitRate: number;
  errorRate: number;
  activeRequests: number;
  lastUpdated: string;
}

// Request Context
export interface RequestContext {
  id: string;
  method: string;
  endpoint: string;
  startTime: number;
  user?: Partial<User>;
}

// Batch Request Types
export interface BatchRequest {
  id: string;
  requests: Array<{
    key: string;
    fn: () => Promise<any>;
    priority: 'low' | 'medium' | 'high';
  }>;
}

export interface BatchResponse<T = any> {
  results: Record<string, T>;
  errors: Record<string, DashboardError>;
  executionTime: number;
}