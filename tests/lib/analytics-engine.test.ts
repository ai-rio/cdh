import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { AnalyticsEngine } from '@/lib/analytics-engine';
import type { 
  CollectionStats,
  FieldUsageStats,
  PerformanceMetrics,
  Report,
  ReportType,
  User 
} from '@/types/collection-management';

// Mock Payload
const mockPayload = {
  config: {
    collections: [
      {
        slug: 'posts',
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'content', type: 'richText', required: false },
          { name: 'status', type: 'select', required: false },
          { name: 'publishedAt', type: 'date', required: false },
          { name: 'views', type: 'number', required: false }
        ]
      }
    ]
  },
  count: vi.fn(),
  find: vi.fn()
};

const sampleDocuments = [
  {
    id: '1',
    title: 'First Post',
    content: 'Rich content here',
    status: 'published',
    publishedAt: '2024-01-01T00:00:00.000Z',
    views: 150,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'Second Post',
    content: null,
    status: 'draft',
    publishedAt: null,
    views: 0,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '3',
    title: 'Third Post',
    content: 'More content',
    status: 'published',
    publishedAt: '2024-01-03T00:00:00.000Z',
    views: 75,
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z'
  }
];

describe('AnalyticsEngine - TDD Implementation', () => {
  let analyticsEngine: AnalyticsEngine;
  let mockUser: User;

  beforeEach(() => {
    analyticsEngine = new AnalyticsEngine(mockPayload as any);
    mockUser = { id: 'user1', email: 'test@example.com' } as User;
    vi.clearAllMocks();
    
    // Default mock responses
    mockPayload.count.mockResolvedValue({ totalDocs: 100 });
    mockPayload.find.mockResolvedValue({ docs: sampleDocuments });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Collection Statistics', () => {
    it('should calculate basic collection statistics', async () => {
      const stats = await analyticsEngine.getCollectionStats('posts');

      expect(stats).toMatchObject({
        totalDocuments: expect.any(Number),
        averageDocumentSize: expect.any(Number),
        fieldUsage: expect.any(Object),
        creationTrends: expect.any(Array),
        updateFrequency: expect.any(Array),
        storageUsage: expect.any(Object),
        performanceMetrics: expect.any(Object),
        lastCalculated: expect.any(String)
      });

      expect(stats.totalDocuments).toBe(100);
      expect(mockPayload.count).toHaveBeenCalledWith({
        collection: 'posts',
        overrideAccess: true
      });
    });

    it('should calculate creation trends over 30 days', async () => {
      // Mock count responses for different date ranges
      mockPayload.count
        .mockResolvedValueOnce({ totalDocs: 100 }) // Total count
        .mockResolvedValue({ totalDocs: 2 }); // Daily counts

      const stats = await analyticsEngine.getCollectionStats('posts');

      expect(stats.creationTrends).toHaveLength(30);
      expect(stats.creationTrends[0]).toMatchObject({
        date: expect.any(String),
        value: expect.any(Number),
        label: expect.any(String)
      });

      // Should have called count for each day + initial total
      expect(mockPayload.count).toHaveBeenCalledTimes(31);
    });

    it('should calculate update frequency trends', async () => {
      mockPayload.count
        .mockResolvedValueOnce({ totalDocs: 100 }) // Total count
        .mockResolvedValue({ totalDocs: 1 }); // Daily update counts

      const stats = await analyticsEngine.getCollectionStats('posts');

      expect(stats.updateFrequency).toHaveLength(30);
      expect(stats.updateFrequency[0]).toMatchObject({
        date: expect.any(String),
        value: expect.any(Number),
        label: expect.stringContaining('updated')
      });
    });

    it('should calculate field usage statistics', async () => {
      const stats = await analyticsEngine.getCollectionStats('posts');

      expect(stats.fieldUsage).toEqual(expect.any(Object));
      expect(Object.keys(stats.fieldUsage)).toContain('title');
      expect(Object.keys(stats.fieldUsage)).toContain('content');
      expect(Object.keys(stats.fieldUsage)).toContain('status');

      // title field should have 100% usage (all samples have title)
      expect(stats.fieldUsage.title).toBe(1);
      // content field should have 66% usage (2 out of 3 samples have content)
      expect(stats.fieldUsage.content).toBeCloseTo(0.67, 1);
    });

    it('should calculate storage statistics', async () => {
      const stats = await analyticsEngine.getCollectionStats('posts');

      expect(stats.storageUsage).toMatchObject({
        totalSize: expect.any(Number),
        averageDocumentSize: expect.any(Number),
        indexSize: expect.any(Number),
        efficiency: expect.any(Number)
      });

      expect(stats.storageUsage.totalSize).toBeGreaterThan(0);
      expect(stats.storageUsage.averageDocumentSize).toBeGreaterThan(0);
      expect(stats.storageUsage.efficiency).toBeLessThanOrEqual(1);
    });

    it('should calculate performance metrics', async () => {
      const stats = await analyticsEngine.getCollectionStats('posts');

      expect(stats.performanceMetrics).toMatchObject({
        averageQueryTime: expect.any(Number),
        slowQueries: expect.any(Number),
        cacheHitRate: expect.any(Number),
        indexUsage: expect.any(Object)
      });

      expect(stats.performanceMetrics.averageQueryTime).toBeGreaterThan(0);
      expect(stats.performanceMetrics.cacheHitRate).toBeLessThanOrEqual(1);
      expect(stats.performanceMetrics.indexUsage).toHaveProperty('id');
    });

    it('should cache collection statistics', async () => {
      // First call
      const stats1 = await analyticsEngine.getCollectionStats('posts');
      
      // Second call should use cache
      const stats2 = await analyticsEngine.getCollectionStats('posts');

      expect(stats1).toEqual(stats2);
      expect(mockPayload.count).toHaveBeenCalledTimes(31); // Only called once (30 days + total)
    });

    it('should handle errors in statistics calculation gracefully', async () => {
      mockPayload.count.mockRejectedValue(new Error('Database error'));

      await expect(
        analyticsEngine.getCollectionStats('posts')
      ).rejects.toThrow('Failed to get stats for posts: Database error');
    });

    it('should handle collections without timestamp fields', async () => {
      // Mock responses when createdAt/updatedAt don't exist
      mockPayload.count
        .mockResolvedValueOnce({ totalDocs: 50 }) // Total
        .mockRejectedValue(new Error('Field not found')); // For date queries

      const stats = await analyticsEngine.getCollectionStats('posts');

      expect(stats.totalDocuments).toBe(50);
      expect(stats.creationTrends).toHaveLength(30);
      expect(stats.creationTrends.every(trend => trend.value === 0)).toBe(true);
    });
  });

  describe('Field Usage Analytics', () => {
    it('should calculate detailed field usage statistics', async () => {
      const fieldStats = await analyticsEngine.getFieldUsage('posts', 'title');

      expect(fieldStats).toMatchObject({
        fieldName: 'title',
        usageCount: expect.any(Number),
        nullCount: expect.any(Number),
        uniqueCount: expect.any(Number),
        mostCommonValues: expect.any(Array)
      });

      expect(fieldStats.fieldName).toBe('title');
      expect(fieldStats.usageCount).toBe(3); // All samples have title
      expect(fieldStats.nullCount).toBe(0);
      expect(fieldStats.uniqueCount).toBe(3); // All titles are unique
    });

    it('should calculate average length for string fields', async () => {
      const fieldStats = await analyticsEngine.getFieldUsage('posts', 'title');

      expect(fieldStats.averageLength).toBeDefined();
      expect(fieldStats.averageLength).toBeGreaterThan(0);
    });

    it('should identify most common values', async () => {
      // Add sample data with repeated values
      const documentsWithRepeats = [
        ...sampleDocuments,
        { ...sampleDocuments[0], id: '4', title: 'First Post' }, // Duplicate title
        { ...sampleDocuments[1], id: '5', title: 'Second Post' } // Duplicate title
      ];
      
      mockPayload.find.mockResolvedValue({ docs: documentsWithRepeats });

      const fieldStats = await analyticsEngine.getFieldUsage('posts', 'title');

      expect(fieldStats.mostCommonValues).toHaveLength(3);
      expect(fieldStats.mostCommonValues[0]).toMatchObject({
        value: expect.any(String),
        count: expect.any(Number)
      });

      // Most common should be the repeated values
      expect(fieldStats.mostCommonValues[0].count).toBeGreaterThan(1);
    });

    it('should handle null and undefined values correctly', async () => {
      const fieldStats = await analyticsEngine.getFieldUsage('posts', 'content');

      expect(fieldStats.usageCount).toBe(2); // 2 out of 3 have content
      expect(fieldStats.nullCount).toBe(1); // 1 is null
      expect(fieldStats.uniqueCount).toBe(2); // 2 unique values
    });

    it('should cache field usage statistics', async () => {
      // First call
      const stats1 = await analyticsEngine.getFieldUsage('posts', 'title');
      
      // Second call should use cache
      const stats2 = await analyticsEngine.getFieldUsage('posts', 'title');

      expect(stats1).toEqual(stats2);
      expect(mockPayload.find).toHaveBeenCalledTimes(1);
    });

    it('should handle field usage calculation errors', async () => {
      mockPayload.find.mockRejectedValue(new Error('Database error'));

      await expect(
        analyticsEngine.getFieldUsage('posts', 'title')
      ).rejects.toThrow('Failed to get field usage for title in posts: Database error');
    });
  });

  describe('Performance Metrics', () => {
    it('should get performance metrics for collection', async () => {
      const metrics = await analyticsEngine.getPerformanceMetrics('posts');

      expect(metrics).toMatchObject({
        averageQueryTime: expect.any(Number),
        slowQueries: expect.any(Number),
        cacheHitRate: expect.any(Number),
        indexUsage: expect.any(Object)
      });

      expect(metrics.averageQueryTime).toBeGreaterThan(0);
      expect(metrics.cacheHitRate).toBeGreaterThan(0);
      expect(metrics.cacheHitRate).toBeLessThanOrEqual(1);
    });

    it('should cache performance metrics', async () => {
      // First call
      const metrics1 = await analyticsEngine.getPerformanceMetrics('posts');
      
      // Second call should use cache
      const metrics2 = await analyticsEngine.getPerformanceMetrics('posts');

      expect(metrics1).toEqual(metrics2);
    });
  });

  describe('Report Generation', () => {
    it('should generate usage report', async () => {
      const report = await analyticsEngine.generateReport('posts', 'usage');

      expect(report).toMatchObject({
        id: expect.any(String),
        type: 'usage',
        title: expect.stringContaining('Usage Report'),
        description: expect.any(String),
        generatedAt: expect.any(Date),
        generatedBy: expect.any(Object),
        data: expect.any(Object),
        recommendations: expect.any(Array),
        exportFormats: expect.any(Array)
      });

      expect(report.data.overview).toMatchObject({
        totalDocuments: expect.any(Number),
        averageDocumentSize: expect.any(Number),
        totalStorageUsed: expect.any(Number)
      });

      expect(report.data.trends).toMatchObject({
        creation: expect.any(Array),
        updates: expect.any(Array)
      });
    });

    it('should generate performance report', async () => {
      const report = await analyticsEngine.generateReport('posts', 'performance');

      expect(report.type).toBe('performance');
      expect(report.data.queryMetrics).toMatchObject({
        averageResponseTime: expect.any(Number),
        slowQueries: expect.any(Number),
        cacheHitRate: expect.any(Number)
      });
    });

    it('should generate data quality report', async () => {
      const report = await analyticsEngine.generateReport('posts', 'data_quality');

      expect(report.type).toBe('data_quality');
      expect(report.data).toMatchObject({
        completeness: expect.any(Number),
        consistency: expect.any(Number),
        validity: expect.any(Number)
      });

      expect(report.data.completeness).toBeGreaterThan(0);
      expect(report.data.completeness).toBeLessThanOrEqual(1);
    });

    it('should generate schema analysis report', async () => {
      const report = await analyticsEngine.generateReport('posts', 'schema_analysis');

      expect(report.type).toBe('schema_analysis');
      expect(report.data).toMatchObject({
        fields: expect.any(Number),
        fieldTypes: expect.any(Object),
        relationships: expect.any(Number),
        complexity: expect.any(Number)
      });

      expect(report.data.fields).toBe(5); // posts collection has 5 fields
      expect(report.data.fieldTypes).toHaveProperty('text');
      expect(report.data.fieldTypes).toHaveProperty('richText');
    });

    it('should include relevant recommendations in reports', async () => {
      // Mock large dataset to trigger recommendations
      mockPayload.count.mockResolvedValue({ totalDocs: 15000 });
      
      const report = await analyticsEngine.generateReport('posts', 'usage');

      expect(report.recommendations).toContain(
        'Consider implementing pagination for better performance'
      );
    });

    it('should handle unsupported report types', async () => {
      await expect(
        analyticsEngine.generateReport('posts', 'unsupported' as ReportType)
      ).rejects.toThrow('Unsupported report type: unsupported');
    });

    it('should handle report generation errors', async () => {
      mockPayload.count.mockRejectedValue(new Error('Database error'));

      await expect(
        analyticsEngine.generateReport('posts', 'usage')
      ).rejects.toThrow('Failed to generate usage report for posts: Database error');
    });

    it('should generate reports with unique IDs', async () => {
      const report1 = await analyticsEngine.generateReport('posts', 'usage');
      const report2 = await analyticsEngine.generateReport('posts', 'usage');

      expect(report1.id).not.toBe(report2.id);
      expect(report1.id).toContain('posts-usage');
      expect(report2.id).toContain('posts-usage');
    });
  });

  describe('Data Quality Analysis', () => {
    it('should calculate data completeness correctly', async () => {
      const report = await analyticsEngine.generateReport('posts', 'data_quality');
      
      // With our sample data: title (3/3), content (2/3), status (3/3), publishedAt (2/3), views (3/3)
      // Total: 13 out of 15 possible values = 86.7%
      expect(report.data.completeness).toBeCloseTo(0.87, 1);
    });

    it('should provide data consistency metrics', async () => {
      const report = await analyticsEngine.generateReport('posts', 'data_quality');
      
      expect(report.data.consistency).toBeGreaterThan(0.8);
      expect(report.data.consistency).toBeLessThanOrEqual(1);
    });

    it('should provide data validity metrics', async () => {
      const report = await analyticsEngine.generateReport('posts', 'data_quality');
      
      expect(report.data.validity).toBeGreaterThan(0.9);
      expect(report.data.validity).toBeLessThanOrEqual(1);
    });
  });

  describe('Schema Analysis', () => {
    it('should analyze field type distribution', async () => {
      const report = await analyticsEngine.generateReport('posts', 'schema_analysis');
      
      expect(report.data.fieldTypes).toEqual({
        text: 1,
        richText: 1,
        select: 1,
        date: 1,
        number: 1
      });
    });

    it('should count relationship fields', async () => {
      // Add a relationship field to mock config
      const mockPayloadWithRelations = {
        ...mockPayload,
        config: {
          collections: [{
            ...mockPayload.config.collections[0],
            fields: [
              ...mockPayload.config.collections[0].fields,
              { name: 'author', type: 'relationship', relationTo: 'users' },
              { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true }
            ]
          }]
        }
      };

      const engine = new AnalyticsEngine(mockPayloadWithRelations as any);
      const report = await engine.generateReport('posts', 'schema_analysis');
      
      expect(report.data.relationships).toBe(2);
    });

    it('should calculate schema complexity', async () => {
      const report = await analyticsEngine.generateReport('posts', 'schema_analysis');
      
      expect(report.data.complexity).toBeGreaterThan(0);
      expect(report.data.complexity).toBeLessThanOrEqual(1);
    });

    it('should provide schema recommendations', async () => {
      // Mock a complex schema
      const complexFields = Array.from({ length: 60 }, (_, i) => ({
        name: `field${i}`,
        type: i % 3 === 0 ? 'relationship' : 'text'
      }));

      const mockPayloadComplex = {
        ...mockPayload,
        config: {
          collections: [{
            slug: 'posts',
            fields: complexFields
          }]
        }
      };

      const engine = new AnalyticsEngine(mockPayloadComplex as any);
      const report = await engine.generateReport('posts', 'schema_analysis');
      
      expect(report.recommendations).toContain(
        'Schema has many fields - consider using groups or tabs for organization'
      );
    });
  });

  describe('Caching and Performance', () => {
    it('should respect cache TTL', async () => {
      // Create engine with short TTL for testing
      const shortTtlEngine = new AnalyticsEngine(mockPayload as any);
      
      // First call
      await shortTtlEngine.getCollectionStats('posts');
      expect(mockPayload.count).toHaveBeenCalledTimes(31);
      
      // Second call immediately should use cache
      mockPayload.count.mockClear();
      await shortTtlEngine.getCollectionStats('posts');
      expect(mockPayload.count).not.toHaveBeenCalled();
    });

    it('should handle concurrent requests efficiently', async () => {
      const promises = Array.from({ length: 5 }, () => 
        analyticsEngine.getCollectionStats('posts')
      );

      const results = await Promise.all(promises);
      
      // All results should be identical (cached)
      expect(results.every(result => 
        JSON.stringify(result) === JSON.stringify(results[0])
      )).toBe(true);
      
      // Should only hit the database once
      expect(mockPayload.count).toHaveBeenCalledTimes(31);
    });

    it('should complete analytics operations within reasonable time', async () => {
      const startTime = Date.now();
      await analyticsEngine.getCollectionStats('posts');
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });
});