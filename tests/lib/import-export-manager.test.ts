import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ImportExportManager } from '@/lib/import-export-manager';
import type { 
  ImportOptions, 
  ImportResult, 
  FieldMapping,
  User 
} from '@/types/collection-management';

// Mock Blob for Node.js environment
class MockBlob {
  private content: string;
  public type: string;

  constructor(parts: any[], options: { type?: string } = {}) {
    this.content = parts.join('');
    this.type = options.type || '';
  }

  text(): Promise<string> {
    return Promise.resolve(this.content);
  }
}

// @ts-ignore
global.Blob = MockBlob;

// Mock Payload
const mockPayload = {
  config: {
    collections: [
      {
        slug: 'posts',
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'content', type: 'richText', required: false },
          { name: 'status', type: 'select', options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' }
          ]},
          { name: 'publishedAt', type: 'date', required: false },
          { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true }
        ]
      }
    ]
  },
  find: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  count: vi.fn()
};

describe('ImportExportManager - TDD Implementation', () => {
  let importExportManager: ImportExportManager;
  let mockUser: User;

  beforeEach(() => {
    importExportManager = new ImportExportManager(mockPayload as any);
    mockUser = { id: 'user1', email: 'test@example.com' } as User;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Import Functionality', () => {
    const sampleImportData = [
      {
        title: 'Test Post 1',
        content: 'Sample content 1',
        status: 'draft',
        publishedAt: '2024-01-01'
      },
      {
        title: 'Test Post 2',
        content: 'Sample content 2',
        status: 'published',
        publishedAt: '2024-01-02'
      }
    ];

    const fieldMapping: FieldMapping[] = [
      { sourceField: 'title', targetField: 'title', required: true },
      { sourceField: 'content', targetField: 'content' },
      { sourceField: 'status', targetField: 'status', defaultValue: 'draft' },
      { sourceField: 'publishedAt', targetField: 'publishedAt' }
    ];

    const defaultImportOptions: ImportOptions = {
      format: 'json',
      mapping: fieldMapping,
      validation: 'strict',
      conflictResolution: 'skip',
      batchSize: 10,
      skipErrors: false,
      dryRun: false
    };

    it('should import data successfully with valid records', async () => {
      mockPayload.find.mockResolvedValue({ docs: [] }); // No conflicts
      mockPayload.create.mockResolvedValue({ id: 'new-id' });

      const result = await importExportManager.import({
        collection: 'posts',
        data: sampleImportData,
        options: defaultImportOptions,
        user: mockUser
      });

      expect(result.success).toBe(true);
      expect(result.totalRecords).toBe(2);
      expect(result.importedRecords).toBe(2);
      expect(result.errorRecords).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(mockPayload.create).toHaveBeenCalledTimes(2);
    });

    it('should handle validation errors in strict mode', async () => {
      const invalidData = [
        { content: 'Missing title', status: 'draft' }, // Missing required title
        { title: 'Valid Post', content: 'Valid content', status: 'invalid_status' } // Invalid status
      ];

      mockPayload.find.mockResolvedValue({ docs: [] });

      const result = await importExportManager.import({
        collection: 'posts',
        data: invalidData,
        options: { ...defaultImportOptions, validation: 'strict' },
        user: mockUser
      });

      expect(result.success).toBe(false);
      expect(result.errorRecords).toBe(2);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].message).toContain('Required field title is missing');
      expect(mockPayload.create).not.toHaveBeenCalled();
    });

    it('should skip errors when skipErrors is true', async () => {
      const mixedData = [
        { title: 'Valid Post', content: 'Valid content', status: 'draft' },
        { content: 'Invalid - missing title' }, // Invalid
        { title: 'Another Valid Post', content: 'More content', status: 'published' }
      ];

      mockPayload.find.mockResolvedValue({ docs: [] });
      mockPayload.create.mockResolvedValue({ id: 'new-id' });

      const result = await importExportManager.import({
        collection: 'posts',
        data: mixedData,
        options: { ...defaultImportOptions, skipErrors: true },
        user: mockUser
      });

      expect(result.success).toBe(true);
      expect(result.totalRecords).toBe(3);
      expect(result.importedRecords).toBe(2);
      expect(result.errorRecords).toBe(1);
      expect(mockPayload.create).toHaveBeenCalledTimes(2);
    });

    it('should handle conflict resolution strategies', async () => {
      const existingRecord = { id: 'existing-1', title: 'Existing Post', status: 'published' };
      mockPayload.find.mockResolvedValue({ docs: [existingRecord] });
      mockPayload.update.mockResolvedValue({ id: 'existing-1' });

      // Test overwrite strategy
      const result = await importExportManager.import({
        collection: 'posts',
        data: [{ title: 'Existing Post', content: 'Updated content', status: 'draft' }],
        options: { ...defaultImportOptions, conflictResolution: 'overwrite' },
        user: mockUser
      });

      expect(result.success).toBe(true);
      expect(result.importedRecords).toBe(1);
      expect(mockPayload.update).toHaveBeenCalledWith({
        collection: 'posts',
        id: 'existing-1',
        data: expect.objectContaining({ title: 'Existing Post', content: 'Updated content' }),
        user: mockUser,
        overrideAccess: false
      });
    });

    it('should support merge conflict resolution', async () => {
      const existingRecord = { 
        id: 'existing-1', 
        title: 'Existing Post', 
        content: 'Original content',
        status: 'published' 
      };
      mockPayload.find.mockResolvedValue({ docs: [existingRecord] });
      mockPayload.update.mockResolvedValue({ id: 'existing-1' });

      const result = await importExportManager.import({
        collection: 'posts',
        data: [{ title: 'Existing Post', content: 'Updated content' }],
        options: { ...defaultImportOptions, conflictResolution: 'merge' },
        user: mockUser
      });

      expect(result.success).toBe(true);
      expect(mockPayload.update).toHaveBeenCalledWith({
        collection: 'posts',
        id: 'existing-1',
        data: expect.objectContaining({
          title: 'Existing Post',
          content: 'Updated content',
          status: 'published' // Should keep existing status
        }),
        user: mockUser,
        overrideAccess: false
      });
    });

    it('should support dry run mode', async () => {
      const result = await importExportManager.import({
        collection: 'posts',
        data: sampleImportData,
        options: { ...defaultImportOptions, dryRun: true },
        user: mockUser
      });

      expect(result.success).toBe(true);
      expect(result.preview).toBe(true);
      expect(result.importedRecords).toBe(2);
      expect(mockPayload.create).not.toHaveBeenCalled();
      expect(mockPayload.update).not.toHaveBeenCalled();
    });

    it('should process data in batches', async () => {
      const largeDataset = Array.from({ length: 25 }, (_, i) => ({
        title: `Post ${i + 1}`,
        content: `Content ${i + 1}`,
        status: 'draft'
      }));

      mockPayload.find.mockResolvedValue({ docs: [] });
      mockPayload.create.mockResolvedValue({ id: 'new-id' });

      const result = await importExportManager.import({
        collection: 'posts',
        data: largeDataset,
        options: { ...defaultImportOptions, batchSize: 10 },
        user: mockUser
      });

      expect(result.success).toBe(true);
      expect(result.totalRecords).toBe(25);
      expect(result.importedRecords).toBe(25);
      expect(mockPayload.create).toHaveBeenCalledTimes(25);
    });

    it('should apply field transformations', async () => {
      const transformMapping: FieldMapping[] = [
        { 
          sourceField: 'title', 
          targetField: 'title',
          transform: (value: string) => value.toUpperCase()
        },
        { 
          sourceField: 'publishedAt', 
          targetField: 'publishedAt',
          transform: (value: string) => new Date(value).toISOString()
        }
      ];

      mockPayload.find.mockResolvedValue({ docs: [] });
      mockPayload.create.mockResolvedValue({ id: 'new-id' });

      const result = await importExportManager.import({
        collection: 'posts',
        data: [{ title: 'test post', publishedAt: '2024-01-01' }],
        options: { ...defaultImportOptions, mapping: transformMapping },
        user: mockUser
      });

      expect(result.success).toBe(true);
      expect(mockPayload.create).toHaveBeenCalledWith({
        collection: 'posts',
        data: expect.objectContaining({
          title: 'TEST POST',
          publishedAt: expect.stringContaining('2024-01-01')
        }),
        user: mockUser,
        overrideAccess: false
      });
    });

    it('should handle field transformation errors gracefully', async () => {
      const faultyMapping: FieldMapping[] = [
        { 
          sourceField: 'title', 
          targetField: 'title',
          transform: () => { throw new Error('Transform error'); },
          defaultValue: 'Default Title'
        }
      ];

      mockPayload.find.mockResolvedValue({ docs: [] });
      mockPayload.create.mockResolvedValue({ id: 'new-id' });

      const result = await importExportManager.import({
        collection: 'posts',
        data: [{ title: 'test post' }],
        options: { ...defaultImportOptions, mapping: faultyMapping },
        user: mockUser
      });

      expect(result.success).toBe(true);
      expect(mockPayload.create).toHaveBeenCalledWith({
        collection: 'posts',
        data: expect.objectContaining({
          title: 'Default Title'
        }),
        user: mockUser,
        overrideAccess: false
      });
    });

    it('should measure and return execution time', async () => {
      mockPayload.find.mockResolvedValue({ docs: [] });
      mockPayload.create.mockResolvedValue({ id: 'new-id' });

      const result = await importExportManager.import({
        collection: 'posts',
        data: sampleImportData,
        options: defaultImportOptions,
        user: mockUser
      });

      expect(typeof result.executionTime).toBe('number');
      expect(result.executionTime).toBeGreaterThan(0);
    });
  });

  describe('Export Functionality', () => {
    const sampleExportData = [
      {
        id: '1',
        title: 'Post 1',
        content: 'Content 1',
        status: 'published',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: '2',
        title: 'Post 2',
        content: 'Content 2',
        status: 'draft',
        createdAt: '2024-01-02T00:00:00.000Z'
      }
    ];

    beforeEach(() => {
      mockPayload.find.mockResolvedValue({ docs: sampleExportData });
    });

    it('should export data as JSON', async () => {
      const result = await importExportManager.export({
        collection: 'posts',
        format: 'json',
        user: mockUser
      });

      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('application/json');
      
      const text = await result.text();
      const data = JSON.parse(text);
      expect(data).toEqual(sampleExportData);
    });

    it('should export data as CSV', async () => {
      const result = await importExportManager.export({
        collection: 'posts',
        format: 'csv',
        user: mockUser
      });

      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('text/csv');
      
      const text = await result.text();
      expect(text).toContain('id,title,content,status,createdAt');
      expect(text).toContain('Post 1');
      expect(text).toContain('Post 2');
    });

    it('should export specific fields only', async () => {
      const result = await importExportManager.export({
        collection: 'posts',
        format: 'csv',
        fields: ['title', 'status'],
        user: mockUser
      });

      const text = await result.text();
      expect(text).toContain('title,status');
      expect(text).not.toContain('content');
      expect(text).not.toContain('createdAt');
    });

    it('should apply query filters during export', async () => {
      const queryFilter = {
        status: { equals: 'published' }
      };

      await importExportManager.export({
        collection: 'posts',
        format: 'json',
        query: queryFilter,
        user: mockUser
      });

      expect(mockPayload.find).toHaveBeenCalledWith({
        collection: 'posts',
        where: queryFilter,
        limit: 0,
        user: mockUser,
        overrideAccess: false,
        select: undefined
      });
    });

    it('should handle export with limit', async () => {
      await importExportManager.export({
        collection: 'posts',
        format: 'json',
        limit: 100,
        user: mockUser
      });

      expect(mockPayload.find).toHaveBeenCalledWith({
        collection: 'posts',
        where: undefined,
        limit: 100,
        user: mockUser,
        overrideAccess: false,
        select: undefined
      });
    });

    it('should handle CSV export with special characters', async () => {
      const dataWithSpecialChars = [
        {
          id: '1',
          title: 'Title with "quotes" and, commas',
          content: 'Content with\nnewlines',
          status: 'published'
        }
      ];

      mockPayload.find.mockResolvedValue({ docs: dataWithSpecialChars });

      const result = await importExportManager.export({
        collection: 'posts',
        format: 'csv',
        user: mockUser
      });

      const text = await result.text();
      expect(text).toContain('"Title with ""quotes"" and, commas"');
      expect(text).toContain('"Content with\nnewlines"');
    });

    it('should handle empty export data', async () => {
      mockPayload.find.mockResolvedValue({ docs: [] });

      const result = await importExportManager.export({
        collection: 'posts',
        format: 'csv',
        user: mockUser
      });

      expect(result).toBeInstanceOf(Blob);
      const text = await result.text();
      expect(text).toBe('');
    });

    it('should throw error for unsupported export format', async () => {
      await expect(
        importExportManager.export({
          collection: 'posts',
          format: 'xml' as any,
          user: mockUser
        })
      ).rejects.toThrow('Unsupported export format: xml');
    });

    it('should handle export errors gracefully', async () => {
      mockPayload.find.mockRejectedValue(new Error('Database connection failed'));

      await expect(
        importExportManager.export({
          collection: 'posts',
          format: 'json',
          user: mockUser
        })
      ).rejects.toThrow('Export failed: Database connection failed');
    });
  });

  describe('Validation and Error Handling', () => {
    it('should reject import with empty data', async () => {
      await expect(
        importExportManager.import({
          collection: 'posts',
          data: [],
          options: {
            format: 'json',
            mapping: [],
            validation: 'strict',
            conflictResolution: 'skip',
            batchSize: 10,
            skipErrors: false
          },
          user: mockUser
        })
      ).rejects.toThrow('No data provided for import');
    });

    it('should handle collection validation errors', async () => {
      // Mock payload config without the requested collection
      const managerWithoutCollection = new ImportExportManager({
        ...mockPayload,
        config: { collections: [] }
      } as any);

      const result = await managerWithoutCollection.import({
        collection: 'nonexistent',
        data: [{ title: 'Test' }],
        options: {
          format: 'json',
          mapping: [{ sourceField: 'title', targetField: 'title' }],
          validation: 'strict',
          conflictResolution: 'skip',
          batchSize: 10,
          skipErrors: false
        },
        user: mockUser
      });

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate field types correctly', async () => {
      const invalidTypeData = [
        { title: 123, content: 'Valid content', status: 'draft' }, // title should be string
        { title: 'Valid title', content: 'Valid content', status: 'invalid_status' } // invalid status
      ];

      mockPayload.find.mockResolvedValue({ docs: [] });

      const result = await importExportManager.import({
        collection: 'posts',
        data: invalidTypeData,
        options: {
          format: 'json',
          mapping: [
            { sourceField: 'title', targetField: 'title' },
            { sourceField: 'content', targetField: 'content' },
            { sourceField: 'status', targetField: 'status' }
          ],
          validation: 'strict',
          conflictResolution: 'skip',
          batchSize: 10,
          skipErrors: false
        },
        user: mockUser
      });

      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.message.includes('Expected string'))).toBe(true);
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle large batch processing efficiently', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        title: `Post ${i + 1}`,
        content: `Content ${i + 1}`,
        status: i % 2 === 0 ? 'draft' : 'published'
      }));

      mockPayload.find.mockResolvedValue({ docs: [] });
      mockPayload.create.mockResolvedValue({ id: 'new-id' });

      const startTime = Date.now();
      const result = await importExportManager.import({
        collection: 'posts',
        data: largeDataset,
        options: {
          format: 'json',
          mapping: [
            { sourceField: 'title', targetField: 'title' },
            { sourceField: 'content', targetField: 'content' },
            { sourceField: 'status', targetField: 'status' }
          ],
          validation: 'lenient',
          conflictResolution: 'skip',
          batchSize: 50,
          skipErrors: true
        },
        user: mockUser
      });
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(result.totalRecords).toBe(1000);
      expect(result.importedRecords).toBe(1000);
      expect(endTime - startTime).toBeLessThan(10000); // Should complete within 10 seconds
    });

    it('should handle nested field mapping', async () => {
      const nestedData = [
        {
          'user.name': 'John Doe',
          'user.email': 'john@example.com',
          'content': 'Post content'
        }
      ];

      const nestedMapping: FieldMapping[] = [
        { sourceField: 'user.name', targetField: 'title' },
        { sourceField: 'user.email', targetField: 'authorEmail' },
        { sourceField: 'content', targetField: 'content' }
      ];

      mockPayload.find.mockResolvedValue({ docs: [] });
      mockPayload.create.mockResolvedValue({ id: 'new-id' });

      const result = await importExportManager.import({
        collection: 'posts',
        data: nestedData,
        options: {
          format: 'json',
          mapping: nestedMapping,
          validation: 'lenient',
          conflictResolution: 'skip',
          batchSize: 10,
          skipErrors: false
        },
        user: mockUser
      });

      expect(result.success).toBe(true);
      expect(mockPayload.create).toHaveBeenCalledWith({
        collection: 'posts',
        data: expect.objectContaining({
          title: 'John Doe',
          authorEmail: 'john@example.com',
          content: 'Post content'
        }),
        user: mockUser,
        overrideAccess: false
      });
    });
  });
});