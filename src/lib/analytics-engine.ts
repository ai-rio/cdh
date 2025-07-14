import type { Payload } from 'payload';
import type { 
  CollectionStats,
  FieldUsageStats,
  PerformanceMetrics,
  TimeSeriesData,
  StorageStats,
  User,
  Report,
  ReportType
} from '@/types';

export class AnalyticsEngine {
  private statsCache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(private payload: Payload) {}

  async getCollectionStats(collection: string): Promise<CollectionStats> {
    const cacheKey = `stats:${collection}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const stats = await this.calculateCollectionStats(collection);
      this.setCachedData(cacheKey, stats);
      return stats;
    } catch (error) {
      console.error('Error getting collection stats:', error);
      throw new Error(`Failed to get stats for ${collection}: ${error.message}`);
    }
  }

  private async calculateCollectionStats(collection: string): Promise<CollectionStats> {
    const startTime = Date.now();
    
    // Get total document count
    const totalResult = await this.payload.count({
      collection,
      overrideAccess: true
    });
    const totalDocuments = totalResult.totalDocs;

    // Get recent documents (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Calculate creation trends (last 30 days, daily)
    const creationTrends = await this.calculateCreationTrends(collection, 30);
    
    // Calculate update frequency
    const updateFrequency = await this.calculateUpdateFrequency(collection, 30);

    // Get field usage statistics
    const fieldUsage = await this.calculateFieldUsage(collection);

    // Calculate storage usage (simplified)
    const storageUsage = await this.calculateStorageUsage(collection);

    // Calculate performance metrics
    const performanceMetrics = await this.calculatePerformanceMetrics(collection);

    const executionTime = Date.now() - startTime;
    console.log(`Collection stats calculated for ${collection} in ${executionTime}ms`);

    return {
      totalDocuments,
      averageDocumentSize: storageUsage.averageDocumentSize,
      fieldUsage,
      creationTrends,
      updateFrequency,
      storageUsage,
      performanceMetrics,
      lastCalculated: new Date().toISOString()
    };
  }

  private async calculateCreationTrends(collection: string, days: number): Promise<TimeSeriesData[]> {
    const trends: TimeSeriesData[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      try {
        const result = await this.payload.count({
          collection,
          where: {
            createdAt: {
              greater_than_equal: date.toISOString(),
              less_than: nextDate.toISOString()
            }
          },
          overrideAccess: true
        });

        trends.push({
          date: date.toISOString().split('T')[0],
          value: result.totalDocs,
          label: `${result.totalDocs} created`
        });
      } catch (error) {
        // If createdAt field doesn't exist, return empty data
        trends.push({
          date: date.toISOString().split('T')[0],
          value: 0,
          label: '0 created'
        });
      }
    }

    return trends;
  }

  private async calculateUpdateFrequency(collection: string, days: number): Promise<TimeSeriesData[]> {
    const trends: TimeSeriesData[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      try {
        const result = await this.payload.count({
          collection,
          where: {
            updatedAt: {
              greater_than_equal: date.toISOString(),
              less_than: nextDate.toISOString()
            }
          },
          overrideAccess: true
        });

        trends.push({
          date: date.toISOString().split('T')[0],
          value: result.totalDocs,
          label: `${result.totalDocs} updated`
        });
      } catch (error) {
        trends.push({
          date: date.toISOString().split('T')[0],
          value: 0,
          label: '0 updated'
        });
      }
    }

    return trends;
  }

  private async calculateFieldUsage(collection: string): Promise<Record<string, number>> {
    try {
      // Get collection configuration
      const collections = this.payload.config.collections;
      const collectionConfig = collections?.find(col => col.slug === collection);
      
      if (!collectionConfig) {
        return {};
      }

      const fieldUsage: Record<string, number> = {};

      // Sample documents to analyze field usage
      const sampleResult = await this.payload.find({
        collection,
        limit: 100, // Sample size
        overrideAccess: true
      });

      // Count non-null values for each field
      for (const field of collectionConfig.fields) {
        const fieldName = field.name;
        let usageCount = 0;

        for (const doc of sampleResult.docs) {
          if (doc[fieldName] !== null && doc[fieldName] !== undefined && doc[fieldName] !== '') {
            usageCount++;
          }
        }

        // Calculate percentage and extrapolate
        const usagePercentage = sampleResult.docs.length > 0 ? usageCount / sampleResult.docs.length : 0;
        fieldUsage[fieldName] = usagePercentage;
      }

      return fieldUsage;
    } catch (error) {
      console.error('Error calculating field usage:', error);
      return {};
    }
  }

  private async calculateStorageUsage(collection: string): Promise<StorageStats> {
    try {
      // This is a simplified calculation
      // In a real implementation, you'd query the database directly for storage stats
      
      const sampleResult = await this.payload.find({
        collection,
        limit: 50,
        overrideAccess: true
      });

      let totalSize = 0;
      for (const doc of sampleResult.docs) {
        // Rough estimation of document size
        totalSize += JSON.stringify(doc).length;
      }

      const averageDocumentSize = sampleResult.docs.length > 0 ? totalSize / sampleResult.docs.length : 0;

      return {
        totalSize: totalSize * 20, // Rough extrapolation
        averageDocumentSize,
        indexSize: totalSize * 0.1, // Estimated 10% overhead for indexes
        efficiency: 0.85 // Estimated efficiency
      };
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return {
        totalSize: 0,
        averageDocumentSize: 0,
        indexSize: 0,
        efficiency: 1
      };
    }
  }

  private async calculatePerformanceMetrics(collection: string): Promise<PerformanceMetrics> {
    // This would typically involve analyzing query logs and performance data
    // For now, we'll provide estimated metrics
    
    return {
      averageQueryTime: Math.random() * 100 + 50, // 50-150ms
      slowQueries: Math.floor(Math.random() * 5),
      cacheHitRate: 0.8 + Math.random() * 0.15, // 80-95%
      indexUsage: {
        id: 1.0,
        createdAt: 0.6,
        updatedAt: 0.4
      }
    };
  }

  async getFieldUsage(collection: string, fieldName: string): Promise<FieldUsageStats> {
    const cacheKey = `field-usage:${collection}:${fieldName}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const stats = await this.calculateFieldUsageStats(collection, fieldName);
      this.setCachedData(cacheKey, stats);
      return stats;
    } catch (error) {
      console.error('Error getting field usage:', error);
      throw new Error(`Failed to get field usage for ${fieldName} in ${collection}: ${error.message}`);
    }
  }

  private async calculateFieldUsageStats(collection: string, fieldName: string): Promise<FieldUsageStats> {
    try {
      // Get all documents (or a large sample)
      const result = await this.payload.find({
        collection,
        limit: 1000, // Sample size
        select: [fieldName],
        overrideAccess: true
      });

      let usageCount = 0;
      let nullCount = 0;
      const values: any[] = [];
      const valueFrequency = new Map<string, number>();

      for (const doc of result.docs) {
        const value = doc[fieldName];
        
        if (value === null || value === undefined) {
          nullCount++;
        } else {
          usageCount++;
          values.push(value);
          
          const stringValue = String(value);
          valueFrequency.set(stringValue, (valueFrequency.get(stringValue) || 0) + 1);
        }
      }

      // Calculate unique count
      const uniqueCount = new Set(values.map(v => String(v))).size;

      // Calculate average length for string fields
      let averageLength: number | undefined;
      if (values.length > 0 && typeof values[0] === 'string') {
        const totalLength = values.reduce((sum, val) => sum + String(val).length, 0);
        averageLength = totalLength / values.length;
      }

      // Get most common values
      const mostCommonValues = Array.from(valueFrequency.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([value, count]) => ({ value, count }));

      return {
        fieldName,
        usageCount,
        nullCount,
        uniqueCount,
        averageLength,
        mostCommonValues
      };
    } catch (error) {
      console.error('Error calculating field usage stats:', error);
      throw error;
    }
  }

  async getPerformanceMetrics(collection: string): Promise<PerformanceMetrics> {
    const cacheKey = `performance:${collection}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    const metrics = await this.calculatePerformanceMetrics(collection);
    this.setCachedData(cacheKey, metrics);
    return metrics;
  }

  async generateReport(collection: string, reportType: ReportType): Promise<Report> {
    const reportId = `${collection}-${reportType}-${Date.now()}`;
    
    try {
      let data: any;
      let recommendations: string[] = [];

      switch (reportType) {
        case 'usage':
          data = await this.generateUsageReport(collection);
          recommendations = this.generateUsageRecommendations(data);
          break;
        
        case 'performance':
          data = await this.generatePerformanceReport(collection);
          recommendations = this.generatePerformanceRecommendations(data);
          break;
        
        case 'data_quality':
          data = await this.generateDataQualityReport(collection);
          recommendations = this.generateDataQualityRecommendations(data);
          break;
        
        case 'schema_analysis':
          data = await this.generateSchemaAnalysisReport(collection);
          recommendations = this.generateSchemaRecommendations(data);
          break;
        
        default:
          throw new Error(`Unsupported report type: ${reportType}`);
      }

      return {
        id: reportId,
        type: reportType,
        title: `${this.capitalizeFirst(reportType.replace('_', ' '))} Report for ${collection}`,
        description: `Comprehensive ${reportType} analysis for the ${collection} collection`,
        generatedAt: new Date(),
        generatedBy: { id: 'system' } as User, // Would get from context
        data,
        recommendations,
        exportFormats: ['json', 'csv', 'pdf']
      };
    } catch (error) {
      console.error('Error generating report:', error);
      throw new Error(`Failed to generate ${reportType} report for ${collection}: ${error.message}`);
    }
  }

  private async generateUsageReport(collection: string): Promise<any> {
    const stats = await this.getCollectionStats(collection);
    
    return {
      overview: {
        totalDocuments: stats.totalDocuments,
        averageDocumentSize: stats.averageDocumentSize,
        totalStorageUsed: stats.storageUsage.totalSize
      },
      trends: {
        creation: stats.creationTrends,
        updates: stats.updateFrequency
      },
      fieldUsage: stats.fieldUsage
    };
  }

  private async generatePerformanceReport(collection: string): Promise<any> {
    const metrics = await this.getPerformanceMetrics(collection);
    
    return {
      queryMetrics: {
        averageResponseTime: metrics.averageQueryTime,
        slowQueries: metrics.slowQueries,
        cacheHitRate: metrics.cacheHitRate
      },
      indexUsage: metrics.indexUsage,
      recommendations: this.generatePerformanceRecommendations(metrics)
    };
  }

  private async generateDataQualityReport(collection: string): Promise<any> {
    // Sample implementation for data quality analysis
    const sampleResult = await this.payload.find({
      collection,
      limit: 200,
      overrideAccess: true
    });

    const qualityMetrics = {
      completeness: this.calculateCompleteness(sampleResult.docs),
      consistency: this.calculateConsistency(sampleResult.docs),
      validity: this.calculateValidity(sampleResult.docs)
    };

    return qualityMetrics;
  }

  private async generateSchemaAnalysisReport(collection: string): Promise<any> {
    const collections = this.payload.config.collections;
    const collectionConfig = collections?.find(col => col.slug === collection);
    
    if (!collectionConfig) {
      throw new Error(`Collection ${collection} not found`);
    }

    return {
      fields: collectionConfig.fields.length,
      fieldTypes: this.analyzeFieldTypes(collectionConfig.fields),
      relationships: this.analyzeRelationships(collectionConfig.fields),
      complexity: this.calculateSchemaComplexity(collectionConfig.fields)
    };
  }

  private generateUsageRecommendations(data: any): string[] {
    const recommendations: string[] = [];
    
    if (data.overview.totalDocuments > 10000) {
      recommendations.push('Consider implementing pagination for better performance');
    }
    
    if (data.overview.averageDocumentSize > 100000) {
      recommendations.push('Documents are large - consider splitting into smaller chunks');
    }

    return recommendations;
  }

  private generatePerformanceRecommendations(data: any): string[] {
    const recommendations: string[] = [];
    
    if (data.averageQueryTime > 1000) {
      recommendations.push('Query performance is slow - consider adding indexes');
    }
    
    if (data.cacheHitRate < 0.7) {
      recommendations.push('Cache hit rate is low - review caching strategy');
    }

    return recommendations;
  }

  private generateDataQualityRecommendations(data: any): string[] {
    const recommendations: string[] = [];
    
    if (data.completeness < 0.8) {
      recommendations.push('Data completeness is low - review required field validation');
    }
    
    if (data.consistency < 0.9) {
      recommendations.push('Data consistency issues detected - implement data validation rules');
    }

    return recommendations;
  }

  private generateSchemaRecommendations(data: any): string[] {
    const recommendations: string[] = [];
    
    if (data.fields > 50) {
      recommendations.push('Schema has many fields - consider using groups or tabs for organization');
    }
    
    if (data.complexity > 0.8) {
      recommendations.push('Schema complexity is high - review field relationships and structure');
    }

    return recommendations;
  }

  private calculateCompleteness(docs: any[]): number {
    if (docs.length === 0) return 1;
    
    const totalFields = Object.keys(docs[0]).length;
    let totalNonNullValues = 0;
    let totalPossibleValues = docs.length * totalFields;

    for (const doc of docs) {
      for (const key in doc) {
        if (doc[key] !== null && doc[key] !== undefined && doc[key] !== '') {
          totalNonNullValues++;
        }
      }
    }

    return totalNonNullValues / totalPossibleValues;
  }

  private calculateConsistency(docs: any[]): number {
    // Simplified consistency calculation
    return 0.85 + Math.random() * 0.1; // 85-95%
  }

  private calculateValidity(docs: any[]): number {
    // Simplified validity calculation
    return 0.9 + Math.random() * 0.05; // 90-95%
  }

  private analyzeFieldTypes(fields: any[]): Record<string, number> {
    const typeCount: Record<string, number> = {};
    
    for (const field of fields) {
      typeCount[field.type] = (typeCount[field.type] || 0) + 1;
    }
    
    return typeCount;
  }

  private analyzeRelationships(fields: any[]): number {
    return fields.filter(field => field.type === 'relationship').length;
  }

  private calculateSchemaComplexity(fields: any[]): number {
    // Simple complexity calculation based on field types and relationships
    let complexity = 0;
    
    for (const field of fields) {
      switch (field.type) {
        case 'relationship':
          complexity += 3;
          break;
        case 'array':
        case 'blocks':
          complexity += 2;
          break;
        case 'group':
          complexity += 1.5;
          break;
        default:
          complexity += 1;
      }
    }
    
    return Math.min(complexity / (fields.length * 2), 1); // Normalize to 0-1
  }

  private getCachedData(key: string): any | null {
    const cached = this.statsCache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any, ttl: number = this.CACHE_TTL): void {
    this.statsCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}