import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePayload } from '@/hooks/use-payload';
import { SchemaManager } from '@/lib/schema-manager';
import { getFieldTypeConfig, getAllFieldTypes, validateFieldConfig } from '@/lib/field-type-registry';
import type { 
  CollectionConfig, 
  FieldConfig,
  ValidationResult,
  SchemaVersion,
  MigrationResult,
  MigrationPreview,
  FieldTypeConfig,
  ValidationRule
} from '@/types';

interface UseCollectionSchemaOptions {
  collection: string;
  enableCaching?: boolean;
  cacheTimeout?: number;
}

export function useCollectionSchema({ 
  collection, 
  enableCaching = true,
  cacheTimeout = 300000 // 5 minutes
}: UseCollectionSchemaOptions) {
  // State
  const [schema, setSchema] = useState<CollectionConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [schemaHistory, setSchemaHistory] = useState<SchemaVersion[]>([]);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);

  // Hooks
  const { payload } = usePayload();

  // Managers
  const schemaManager = useMemo(() => 
    payload ? new SchemaManager(payload) : null, 
    [payload]
  );

  // Cache
  const [schemaCache, setSchemaCache] = useState<Map<string, { 
    data: CollectionConfig; 
    timestamp: number 
  }>>(new Map());

  // Computed values
  const fields = useMemo(() => schema?.fields || [], [schema]);
  
  const fieldsByName = useMemo(() => {
    const map = new Map<string, FieldConfig>();
    fields.forEach(field => map.set(field.name, field));
    return map;
  }, [fields]);

  // Load schema
  const loadSchema = useCallback(async (forceRefresh = false) => {
    if (!schemaManager) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      if (enableCaching && !forceRefresh) {
        const cached = schemaCache.get(collection);
        if (cached && Date.now() - cached.timestamp < cacheTimeout) {
          setSchema(cached.data);
          setIsLoading(false);
          return;
        }
      }

      const config = await schemaManager.getCollectionConfig(collection);
      
      if (config) {
        setSchema(config);
        
        // Update cache
        if (enableCaching) {
          setSchemaCache(prev => new Map(prev.set(collection, {
            data: config,
            timestamp: Date.now()
          })));
        }
      } else {
        setError(new Error(`Collection ${collection} not found`));
      }
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load schema:', err);
    } finally {
      setIsLoading(false);
    }
  }, [schemaManager, collection, enableCaching, cacheTimeout, schemaCache]);

  // Load schema history
  const loadSchemaHistory = useCallback(async () => {
    if (!schemaManager) return;

    try {
      const history = await schemaManager.getSchemaHistory(collection);
      setSchemaHistory(history);
    } catch (err) {
      console.error('Failed to load schema history:', err);
    }
  }, [schemaManager, collection]);

  // Field management
  const addField = useCallback(async (field: FieldConfig, position?: number): Promise<void> => {
    if (!schemaManager) throw new Error('Schema manager not available');

    // Validate field config
    const validation = validateFieldConfig(field);
    if (!validation.valid) {
      throw new Error(`Invalid field config: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    try {
      await schemaManager.addField(collection, field, position);
      
      // Update local state optimistically
      setSchema(prev => {
        if (!prev) return prev;
        
        const newFields = [...prev.fields];
        if (position !== undefined && position >= 0 && position <= newFields.length) {
          newFields.splice(position, 0, field);
        } else {
          newFields.push(field);
        }
        
        return { ...prev, fields: newFields };
      });

      // Clear cache
      if (enableCaching) {
        setSchemaCache(prev => {
          const newCache = new Map(prev);
          newCache.delete(collection);
          return newCache;
        });
      }

      // Reload to get server state
      await loadSchema(true);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [schemaManager, collection, enableCaching, loadSchema]);

  const removeField = useCallback(async (fieldName: string): Promise<void> => {
    if (!schemaManager) throw new Error('Schema manager not available');

    try {
      await schemaManager.removeField(collection, fieldName);
      
      // Update local state optimistically
      setSchema(prev => {
        if (!prev) return prev;
        
        const newFields = prev.fields.filter(f => f.name !== fieldName);
        return { ...prev, fields: newFields };
      });

      // Clear cache
      if (enableCaching) {
        setSchemaCache(prev => {
          const newCache = new Map(prev);
          newCache.delete(collection);
          return newCache;
        });
      }

      // Reload to get server state
      await loadSchema(true);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [schemaManager, collection, enableCaching, loadSchema]);

  const updateField = useCallback(async (fieldName: string, updates: Partial<FieldConfig>): Promise<void> => {
    if (!schemaManager) throw new Error('Schema manager not available');

    // Get current field
    const currentField = fieldsByName.get(fieldName);
    if (!currentField) {
      throw new Error(`Field ${fieldName} not found`);
    }

    const updatedField = { ...currentField, ...updates };
    
    // Validate updated field
    const validation = validateFieldConfig(updatedField);
    if (!validation.valid) {
      throw new Error(`Invalid field config: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    try {
      await schemaManager.updateField(collection, fieldName, updates);
      
      // Update local state optimistically
      setSchema(prev => {
        if (!prev) return prev;
        
        const newFields = prev.fields.map(f => 
          f.name === fieldName ? updatedField : f
        );
        return { ...prev, fields: newFields };
      });

      // Clear cache
      if (enableCaching) {
        setSchemaCache(prev => {
          const newCache = new Map(prev);
          newCache.delete(collection);
          return newCache;
        });
      }

      // Reload to get server state
      await loadSchema(true);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [schemaManager, collection, fieldsByName, enableCaching, loadSchema]);

  const reorderFields = useCallback(async (fieldNames: string[]): Promise<void> => {
    if (!schemaManager) throw new Error('Schema manager not available');

    try {
      await schemaManager.reorderFields(collection, fieldNames);
      
      // Update local state optimistically
      setSchema(prev => {
        if (!prev) return prev;
        
        const fieldMap = new Map(prev.fields.map(f => [f.name, f]));
        const reorderedFields = fieldNames.map(name => fieldMap.get(name)!);
        const unspecifiedFields = prev.fields.filter(f => !fieldNames.includes(f.name));
        
        return { 
          ...prev, 
          fields: [...reorderedFields, ...unspecifiedFields] 
        };
      });

      // Clear cache
      if (enableCaching) {
        setSchemaCache(prev => {
          const newCache = new Map(prev);
          newCache.delete(collection);
          return newCache;
        });
      }

      // Reload to get server state
      await loadSchema(true);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [schemaManager, collection, enableCaching, loadSchema]);

  // Collection management
  const createCollection = useCallback(async (config: Partial<CollectionConfig>): Promise<void> => {
    if (!schemaManager) throw new Error('Schema manager not available');

    try {
      await schemaManager.createCollection(config);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [schemaManager]);

  const updateCollection = useCallback(async (slug: string, updates: Partial<CollectionConfig>): Promise<void> => {
    if (!schemaManager) throw new Error('Schema manager not available');

    try {
      await schemaManager.updateCollection(slug, updates);
      
      if (slug === collection) {
        // Update local state if updating current collection
        setSchema(prev => prev ? { ...prev, ...updates } : prev);
        
        // Clear cache
        if (enableCaching) {
          setSchemaCache(prev => {
            const newCache = new Map(prev);
            newCache.delete(collection);
            return newCache;
          });
        }
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [schemaManager, collection, enableCaching]);

  const deleteCollection = useCallback(async (slug: string): Promise<void> => {
    if (!schemaManager) throw new Error('Schema manager not available');

    try {
      await schemaManager.deleteCollection(slug);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [schemaManager]);

  const cloneCollection = useCallback(async (sourceSlug: string, targetSlug: string): Promise<void> => {
    if (!schemaManager) throw new Error('Schema manager not available');

    try {
      const sourceConfig = await schemaManager.getCollectionConfig(sourceSlug);
      if (!sourceConfig) {
        throw new Error(`Source collection ${sourceSlug} not found`);
      }

      const clonedConfig: Partial<CollectionConfig> = {
        ...sourceConfig,
        slug: targetSlug,
        labels: {
          singular: targetSlug.charAt(0).toUpperCase() + targetSlug.slice(1),
          plural: targetSlug.charAt(0).toUpperCase() + targetSlug.slice(1) + 's'
        }
      };

      await schemaManager.createCollection(clonedConfig);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [schemaManager]);

  // Schema validation
  const validateSchema = useCallback((schemaToValidate?: CollectionConfig): ValidationResult => {
    if (!schemaManager) {
      return { valid: false, errors: [{ message: 'Schema manager not available' } as any], warnings: [] };
    }

    const targetSchema = schemaToValidate || schema;
    if (!targetSchema) {
      return { valid: false, errors: [{ message: 'No schema to validate' } as any], warnings: [] };
    }

    return schemaManager.validateCollectionConfig(targetSchema);
  }, [schemaManager, schema]);

  const validateDocument = useCallback((data: any): ValidationResult => {
    if (!schema) {
      return { valid: false, errors: [{ message: 'Schema not loaded' } as any], warnings: [] };
    }

    const errors: any[] = [];
    const warnings: any[] = [];

    // Validate against schema fields
    for (const field of schema.fields) {
      const value = data[field.name];

      // Required field validation
      if (field.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field: field.name,
          value,
          message: `Required field ${field.name} is missing`,
          code: 'REQUIRED_FIELD'
        });
      }

      // Type validation
      if (value !== undefined && value !== null) {
        const fieldTypeConfig = getFieldTypeConfig(field.type);
        if (fieldTypeConfig) {
          const typeValidation = validateFieldType(field, value);
          if (!typeValidation.valid) {
            errors.push({
              field: field.name,
              value,
              message: typeValidation.message,
              code: 'TYPE_VALIDATION'
            });
          }
        }
      }
    }

    return { valid: errors.length === 0, errors, warnings };
  }, [schema]);

  // Migration management
  const previewMigration = useCallback(async (toSchema: CollectionConfig): Promise<MigrationPreview> => {
    if (!schemaManager || !schema) {
      throw new Error('Schema manager or current schema not available');
    }

    return schemaManager.previewMigration(schema, toSchema);
  }, [schemaManager, schema]);

  // Field type utilities
  const getFieldTypes = useCallback((): FieldTypeConfig[] => {
    return getAllFieldTypes();
  }, []);

  const getDefaultFieldConfig = useCallback((type: string): FieldConfig | null => {
    const typeConfig = getFieldTypeConfig(type);
    if (!typeConfig) return null;

    return {
      name: '',
      type,
      ...typeConfig.defaultConfig
    } as FieldConfig;
  }, []);

  const getFieldValidationRules = useCallback((type: string): ValidationRule[] => {
    const typeConfig = getFieldTypeConfig(type);
    return typeConfig?.validationRules || [];
  }, []);

  // Utility functions
  const getFieldConfig = useCallback((fieldName: string): FieldConfig | null => {
    return fieldsByName.get(fieldName) || null;
  }, [fieldsByName]);

  const getDefaultValues = useCallback((): Record<string, any> => {
    if (!schema) return {};

    const defaults: Record<string, any> = {};
    
    for (const field of schema.fields) {
      if (field.defaultValue !== undefined) {
        defaults[field.name] = field.defaultValue;
      }
    }

    return defaults;
  }, [schema]);

  const refresh = useCallback(() => {
    return loadSchema(true);
  }, [loadSchema]);

  const clearCache = useCallback(() => {
    setSchemaCache(new Map());
  }, []);

  // Helper function for field type validation
  const validateFieldType = (field: FieldConfig, value: any): { valid: boolean; message?: string } => {
    const typeConfig = getFieldTypeConfig(field.type);
    if (!typeConfig) return { valid: true };

    // Use the field type registry validation
    const validation = validateFieldConfig({ ...field, defaultValue: value });
    return {
      valid: validation.valid,
      message: validation.errors[0]?.message
    };
  };

  // Effects
  useEffect(() => {
    loadSchema();
    loadSchemaHistory();
  }, [loadSchema, loadSchemaHistory]);

  return {
    // Schema state
    schema,
    fields,
    isLoading,
    error,
    schemaHistory,
    
    // Field management
    addField,
    removeField,
    updateField,
    reorderFields,
    
    // Collection management
    createCollection,
    updateCollection,
    deleteCollection,
    cloneCollection,
    
    // Schema operations
    validateSchema,
    validateDocument,
    previewMigration,
    
    // Field type utilities
    getFieldTypes,
    getDefaultFieldConfig,
    getFieldValidationRules,
    
    // Utilities
    getFieldConfig,
    getDefaultValues,
    refresh,
    clearCache,
    
    // Cache control
    schemaCache: enableCaching ? schemaCache : new Map()
  };
}