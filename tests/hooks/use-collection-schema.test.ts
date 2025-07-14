import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCollectionSchema } from '@/app/(dashboard)/hooks/use-collection-schema';
import type { CollectionConfig, FieldConfig, ValidationResult, MigrationResult, SchemaVersion } from '@/types/collection-management';

// Mock the payload client and related hooks
const mockPayload = {
  getCollectionConfig: vi.fn(),
  updateCollectionConfig: vi.fn(),
  createCollection: vi.fn(),
  deleteCollection: vi.fn(),
  migrateSchema: vi.fn(),
};

vi.mock('@/hooks/use-payload', () => ({
  usePayload: () => ({ payload: mockPayload })
}));

vi.mock('@/lib/schema-manager', () => ({
  SchemaManager: vi.fn().mockImplementation(() => ({
    getCollectionConfig: mockPayload.getCollectionConfig,
    updateCollectionConfig: mockPayload.updateCollectionConfig,
    createCollection: mockPayload.createCollection,
    deleteCollection: mockPayload.deleteCollection,
    migrateSchema: mockPayload.migrateSchema,
    validateCollectionConfig: vi.fn().mockReturnValue({ valid: true, errors: [], warnings: [] }),
    getSchemaHistory: vi.fn().mockResolvedValue([]),
    addField: vi.fn(),
    removeField: vi.fn(),
    updateField: vi.fn(),
    reorderFields: vi.fn(),
    previewMigration: vi.fn()
  }))
}));

vi.mock('@/lib/field-type-registry', () => ({
  getFieldTypeConfig: vi.fn(),
  getAllFieldTypes: vi.fn().mockReturnValue([]),
  validateFieldConfig: vi.fn().mockReturnValue({ valid: true, errors: [], warnings: [] })
}));

// Test wrapper with React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return ({ children }: { children: React.ReactNode }) => 
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

const mockCollectionConfig: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Post',
    plural: 'Posts',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      required: false,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
    },
    {
      name: 'tags',
      type: 'relationship',
      label: 'Tags',
      relationTo: 'tags',
      hasMany: true,
    },
  ],
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  timestamps: true,
  versions: {
    drafts: true,
  },
};

describe('useCollectionSchema Hook - TDD Implementation', () => {
  let wrapper: any;
  const defaultOptions = {
    collection: 'posts'
  };

  beforeEach(() => {
    wrapper = createWrapper();
    vi.clearAllMocks();
    
    // Default mock responses
    mockPayload.getCollectionConfig.mockResolvedValue(mockCollectionConfig);
    mockPayload.updateCollectionConfig.mockResolvedValue(mockCollectionConfig);
    mockPayload.createCollection.mockResolvedValue({ success: true });
    mockPayload.deleteCollection.mockResolvedValue({ success: true });
    mockPayload.migrateSchema.mockResolvedValue({
      success: true,
      migrationId: 'migration-123',
      changes: [],
      migratedDocuments: 0
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Schema State Management', () => {
    it('should initialize with default state', async () => {
      const { result } = renderHook(
        () => useCollectionSchema(defaultOptions),
        { wrapper }
      );

      expect(result.current.schema).toBeNull();
      expect(result.current.fields).toEqual([]);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should load collection schema on initialization', async () => {
      const { result } = renderHook(
        () => useCollectionSchema(defaultOptions),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockPayload.getCollectionConfig).toHaveBeenCalledWith('posts');
      expect(result.current.schema).toEqual(mockCollectionConfig);
      expect(result.current.fields).toEqual(mockCollectionConfig.fields);
    });

    it('should handle schema loading errors gracefully', async () => {
      const errorMessage = 'Collection not found';
      mockPayload.getCollectionConfig.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(
        () => useCollectionSchema({ collection: 'invalid-collection' }),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toEqual(expect.objectContaining({
        message: errorMessage
      }));
      expect(result.current.schema).toBeNull();
    });

    it('should refresh schema when collection changes', async () => {
      const { result, rerender } = renderHook(
        ({ collection }) => useCollectionSchema({ collection }),
        { 
          wrapper,
          initialProps: { collection: 'collection1' }
        }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockPayload.getCollectionConfig).toHaveBeenCalledWith('collection1');

      rerender({ collection: 'collection2' });

      await waitFor(() => {
        expect(mockPayload.getCollectionConfig).toHaveBeenCalledWith('collection2');
      });
    });

    it('should extract fields correctly from schema', async () => {
      const { result } = renderHook(
        () => useCollectionSchema(defaultOptions),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.fields).toHaveLength(4);
      expect(result.current.fields[0].name).toBe('title');
      expect(result.current.fields[0].type).toBe('text');
      expect(result.current.fields[0].required).toBe(true);
    });
  });

  describe('Field Management', () => {
    it('should add a new field to the schema', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const newField: FieldConfig = {
        name: 'excerpt',
        type: 'textarea',
        label: 'Excerpt',
        maxLength: 200,
      };

      const updatedConfig = {
        ...mockCollectionConfig,
        fields: [...mockCollectionConfig.fields, newField],
      };

      mockPayload.updateCollectionConfig.mockResolvedValue(updatedConfig);

      await act(async () => {
        await result.current.addField(newField);
      });

      expect(mockPayload.updateCollectionConfig).toHaveBeenCalledWith('posts', {
        fields: [...mockCollectionConfig.fields, newField],
      });
    });

    it('should add field at specific position', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const newField: FieldConfig = {
        name: 'subtitle',
        type: 'text',
        label: 'Subtitle',
      };

      const updatedConfig = {
        ...mockCollectionConfig,
        fields: [
          mockCollectionConfig.fields[0],
          newField,
          ...mockCollectionConfig.fields.slice(1),
        ],
      };

      mockPayload.updateCollectionConfig.mockResolvedValue(updatedConfig);

      await act(async () => {
        await result.current.addField(newField, 1);
      });

      expect(mockPayload.updateCollectionConfig).toHaveBeenCalledWith('posts', {
        fields: updatedConfig.fields,
      });
    });

    it('should remove a field from the schema', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const updatedConfig = {
        ...mockCollectionConfig,
        fields: mockCollectionConfig.fields.filter(f => f.name !== 'content'),
      };

      mockPayload.updateCollectionConfig.mockResolvedValue(updatedConfig);

      await act(async () => {
        await result.current.removeField('content');
      });

      expect(mockPayload.updateCollectionConfig).toHaveBeenCalledWith('posts', {
        fields: updatedConfig.fields,
      });
    });

    it('should update an existing field', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const updatedConfig = {
        ...mockCollectionConfig,
        fields: mockCollectionConfig.fields.map(f =>
          f.name === 'title' ? { ...f, required: false, maxLength: 100 } : f
        ),
      };

      mockPayload.updateCollectionConfig.mockResolvedValue(updatedConfig);

      await act(async () => {
        await result.current.updateField('title', { required: false, maxLength: 100 });
      });

      expect(mockPayload.updateCollectionConfig).toHaveBeenCalledWith('posts', {
        fields: updatedConfig.fields,
      });
    });

    it('should reorder fields correctly', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const newOrder = ['content', 'title', 'status', 'tags'];
      const reorderedFields = newOrder.map(name =>
        mockCollectionConfig.fields.find(f => f.name === name)!
      );

      const updatedConfig = {
        ...mockCollectionConfig,
        fields: reorderedFields,
      };

      mockPayload.updateCollectionConfig.mockResolvedValue(updatedConfig);

      await act(async () => {
        await result.current.reorderFields(newOrder);
      });

      expect(mockPayload.updateCollectionConfig).toHaveBeenCalledWith('posts', {
        fields: reorderedFields,
      });
    });
  });

  describe('Collection Management', () => {
    it('should create a new collection', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const newCollectionConfig: Partial<CollectionConfig> = {
        slug: 'products',
        labels: {
          singular: 'Product',
          plural: 'Products',
        },
        fields: [
          {
            name: 'name',
            type: 'text',
            label: 'Product Name',
            required: true,
          },
        ],
      };

      await act(async () => {
        await result.current.createCollection(newCollectionConfig);
      });

      expect(mockPayload.createCollection).toHaveBeenCalledWith(newCollectionConfig);
    });

    it('should update collection configuration', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const updates = {
        labels: {
          singular: 'Blog Post',
          plural: 'Blog Posts',
        },
        admin: {
          useAsTitle: 'title',
          defaultColumns: ['title', 'status', 'updatedAt'],
        },
      };

      await act(async () => {
        await result.current.updateCollection('posts', updates);
      });

      expect(mockPayload.updateCollectionConfig).toHaveBeenCalledWith('posts', updates);
    });

    it('should delete a collection', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      await act(async () => {
        await result.current.deleteCollection('posts');
      });

      expect(mockPayload.deleteCollection).toHaveBeenCalledWith('posts');
    });

    it('should clone a collection', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const clonedConfig = {
        ...mockCollectionConfig,
        slug: 'articles',
        labels: {
          singular: 'Article',
          plural: 'Articles',
        },
      };

      mockPayload.createCollection.mockResolvedValue({ success: true });

      await act(async () => {
        await result.current.cloneCollection('posts', 'articles');
      });

      expect(mockPayload.createCollection).toHaveBeenCalledWith(clonedConfig);
    });
  });

  describe('Schema Validation', () => {
    it('should validate schema configuration', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const validationResult = result.current.validateSchema(mockCollectionConfig);

      expect(validationResult.isValid).toBe(true);
      expect(validationResult.errors).toHaveLength(0);
    });

    it('should detect invalid schema configurations', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const invalidConfig = {
        ...mockCollectionConfig,
        slug: '', // Invalid: empty slug
        fields: [], // Invalid: no fields
      };

      const validationResult = result.current.validateSchema(invalidConfig);

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errors.length).toBeGreaterThan(0);
      expect(validationResult.errors).toContain('Collection slug is required');
    });

    it('should validate individual fields', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const invalidField = {
        name: '',
        type: 'invalid-type',
        label: 'Test Field',
      };

      const fieldValidation = result.current.validateField(invalidField);

      expect(fieldValidation.isValid).toBe(false);
      expect(fieldValidation.errors).toContain('Field name is required');
      expect(fieldValidation.errors).toContain('Invalid field type');
    });
  });

  describe('Schema Migration', () => {
    it('should migrate schema from one version to another', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const newSchema = {
        ...mockCollectionConfig,
        fields: [
          ...mockCollectionConfig.fields,
          {
            name: 'publishedAt',
            type: 'date',
            label: 'Published Date',
          },
        ],
      };

      await act(async () => {
        await result.current.migrateSchema(mockCollectionConfig, newSchema);
      });

      expect(mockPayload.migrateSchema).toHaveBeenCalledWith(
        mockCollectionConfig,
        newSchema
      );
    });

    it('should handle migration errors', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const error = new Error('Migration failed');
      mockPayload.migrateSchema.mockRejectedValue(error);

      const newSchema = {
        ...mockCollectionConfig,
        fields: mockCollectionConfig.fields.slice(0, 2), // Remove fields
      };

      await act(async () => {
        try {
          await result.current.migrateSchema(mockCollectionConfig, newSchema);
        } catch (e) {
          expect(e).toEqual(error);
        }
      });
    });
  });

  describe('Field Type Utilities', () => {
    it('should provide available field types', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const fieldTypes = result.current.getFieldTypes();

      expect(fieldTypes).toContainEqual(
        expect.objectContaining({
          type: 'text',
          label: 'Text',
          category: 'data',
        })
      );

      expect(fieldTypes).toContainEqual(
        expect.objectContaining({
          type: 'richText',
          label: 'Rich Text',
          category: 'data',
        })
      );

      expect(fieldTypes).toContainEqual(
        expect.objectContaining({
          type: 'relationship',
          label: 'Relationship',
          category: 'data',
        })
      );
    });

    it('should provide default field configuration for each type', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const textFieldDefault = result.current.getDefaultFieldConfig('text');
      expect(textFieldDefault).toEqual(
        expect.objectContaining({
          type: 'text',
          required: false,
          admin: expect.any(Object),
        })
      );

      const selectFieldDefault = result.current.getDefaultFieldConfig('select');
      expect(selectFieldDefault).toEqual(
        expect.objectContaining({
          type: 'select',
          options: [],
          required: false,
        })
      );
    });

    it('should provide validation rules for field types', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const textValidationRules = result.current.getFieldValidationRules('text');
      expect(textValidationRules).toContainEqual(
        expect.objectContaining({
          type: 'minLength',
          configurable: true,
        })
      );

      const emailValidationRules = result.current.getFieldValidationRules('email');
      expect(emailValidationRules).toContainEqual(
        expect.objectContaining({
          type: 'email',
          configurable: false,
        })
      );
    });
  });

  describe('Document Validation', () => {
    it('should validate document data against schema', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const validDocument = {
        title: 'Test Post',
        content: { blocks: [] },
        status: 'draft',
        tags: ['tag1', 'tag2'],
      };

      const validation = result.current.validateDocument(validDocument);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect validation errors in document data', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const invalidDocument = {
        // missing required title
        content: { blocks: [] },
        status: 'invalid-status', // invalid option
      };

      const validation = result.current.validateDocument(invalidDocument);

      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors).toContain('Title is required');
      expect(validation.errors).toContain('Invalid status value');
    });
  });

  describe('Utility Functions', () => {
    it('should get field configuration by name', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const titleField = result.current.getFieldConfig('title');
      expect(titleField).toEqual(mockCollectionConfig.fields[0]);

      const nonExistentField = result.current.getFieldConfig('nonexistent');
      expect(nonExistentField).toBeNull();
    });

    it('should generate default values from schema', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const defaultValues = result.current.getDefaultValues();

      expect(defaultValues).toEqual({
        title: '',
        content: null,
        status: 'draft',
        tags: [],
      });
    });

    it('should refresh schema data', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Clear the mock to verify refresh calls the API again
      mockPayload.getCollectionConfig.mockClear();

      await act(async () => {
        await result.current.refresh();
      });

      expect(mockPayload.getCollectionConfig).toHaveBeenCalledWith('posts');
    });
  });

  describe('Error Handling', () => {
    it('should handle field addition errors', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const error = new Error('Field addition failed');
      mockPayload.updateCollectionConfig.mockRejectedValue(error);

      const newField: FieldConfig = {
        name: 'test',
        type: 'text',
        label: 'Test',
      };

      await act(async () => {
        try {
          await result.current.addField(newField);
        } catch (e) {
          expect(e).toEqual(error);
        }
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle collection creation errors', async () => {
      const { result } = renderHook(() => useCollectionSchema(defaultOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const error = new Error('Collection creation failed');
      mockPayload.createCollection.mockRejectedValue(error);

      const newCollection: Partial<CollectionConfig> = {
        slug: 'test',
        labels: { singular: 'Test', plural: 'Tests' },
        fields: [],
      };

      await act(async () => {
        try {
          await result.current.createCollection(newCollection);
        } catch (e) {
          expect(e).toEqual(error);
        }
      });
    });
  });
});