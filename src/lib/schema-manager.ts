import type { Payload } from 'payload';
import type { 
  CollectionConfig, 
  FieldConfig,
  ValidationResult,
  SchemaVersion,
  MigrationResult,
  MigrationPreview,
  SchemaChange,
  User
} from '@/types';

export class SchemaManager {
  private schemaVersions: Map<string, SchemaVersion[]> = new Map();

  constructor(private payload: Payload) {}

  async getCollectionConfig(slug: string): Promise<CollectionConfig | null> {
    try {
      // Get collection config from Payload
      const collections = this.payload.config.collections;
      const collection = collections?.find(col => col.slug === slug);
      
      if (!collection) {
        return null;
      }

      return {
        slug: collection.slug,
        labels: collection.labels,
        fields: collection.fields as FieldConfig[],
        admin: collection.admin,
        access: collection.access,
        hooks: collection.hooks,
        versions: collection.versions,
        timestamps: collection.timestamps,
        auth: collection.auth
      };
    } catch (error) {
      console.error('Error getting collection config:', error);
      throw new Error(`Failed to get config for collection ${slug}: ${error.message}`);
    }
  }

  async getAllCollectionConfigs(): Promise<CollectionConfig[]> {
    try {
      const collections = this.payload.config.collections || [];
      
      return collections.map(collection => ({
        slug: collection.slug,
        labels: collection.labels,
        fields: collection.fields as FieldConfig[],
        admin: collection.admin,
        access: collection.access,
        hooks: collection.hooks,
        versions: collection.versions,
        timestamps: collection.timestamps,
        auth: collection.auth
      }));
    } catch (error) {
      console.error('Error getting all collection configs:', error);
      throw new Error(`Failed to get collection configs: ${error.message}`);
    }
  }

  async createCollection(config: Partial<CollectionConfig>): Promise<void> {
    try {
      // Validate the collection config
      const validationResult = this.validateCollectionConfig(config);
      if (!validationResult.valid) {
        throw new Error(`Invalid collection config: ${validationResult.errors.map(e => e.message).join(', ')}`);
      }

      // Note: In a real implementation, this would require dynamic collection registration
      // For now, we'll simulate the operation
      console.log('Creating collection:', config.slug);
      
      // Store schema version
      await this.saveSchemaVersion(config.slug!, {
        type: 'add_collection',
        path: '',
        newValue: config,
        description: `Created collection ${config.slug}`
      });

      // In a real implementation, this would restart or reload Payload with the new config
      console.warn('Collection creation requires server restart to take effect');
    } catch (error) {
      console.error('Error creating collection:', error);
      throw new Error(`Failed to create collection: ${error.message}`);
    }
  }

  async updateCollection(slug: string, updates: Partial<CollectionConfig>): Promise<void> {
    try {
      const currentConfig = await this.getCollectionConfig(slug);
      if (!currentConfig) {
        throw new Error(`Collection ${slug} not found`);
      }

      const updatedConfig = { ...currentConfig, ...updates };
      const validationResult = this.validateCollectionConfig(updatedConfig);
      
      if (!validationResult.valid) {
        throw new Error(`Invalid collection config: ${validationResult.errors.map(e => e.message).join(', ')}`);
      }

      // Store schema version
      await this.saveSchemaVersion(slug, {
        type: 'modify_collection',
        path: '',
        oldValue: currentConfig,
        newValue: updatedConfig,
        description: `Updated collection ${slug}`
      });

      console.warn('Collection update requires server restart to take effect');
    } catch (error) {
      console.error('Error updating collection:', error);
      throw new Error(`Failed to update collection ${slug}: ${error.message}`);
    }
  }

  async deleteCollection(slug: string): Promise<void> {
    try {
      const currentConfig = await this.getCollectionConfig(slug);
      if (!currentConfig) {
        throw new Error(`Collection ${slug} not found`);
      }

      // Store schema version
      await this.saveSchemaVersion(slug, {
        type: 'remove_collection',
        path: '',
        oldValue: currentConfig,
        description: `Deleted collection ${slug}`
      });

      console.warn('Collection deletion requires server restart to take effect');
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw new Error(`Failed to delete collection ${slug}: ${error.message}`);
    }
  }

  async addField(
    collectionSlug: string, 
    field: FieldConfig, 
    position?: number
  ): Promise<void> {
    try {
      const config = await this.getCollectionConfig(collectionSlug);
      if (!config) {
        throw new Error(`Collection ${collectionSlug} not found`);
      }

      // Validate the field
      const fieldValidation = this.validateFieldConfig(field);
      if (!fieldValidation.valid) {
        throw new Error(`Invalid field config: ${fieldValidation.errors.map(e => e.message).join(', ')}`);
      }

      // Add field to the specified position or end
      const newFields = [...config.fields];
      if (position !== undefined && position >= 0 && position <= newFields.length) {
        newFields.splice(position, 0, field);
      } else {
        newFields.push(field);
      }

      const updatedConfig = { ...config, fields: newFields };

      // Store schema version
      await this.saveSchemaVersion(collectionSlug, {
        type: 'add_field',
        path: `fields.${field.name}`,
        newValue: field,
        description: `Added field ${field.name} to ${collectionSlug}`
      });

      console.log(`Field ${field.name} added to collection ${collectionSlug}`);
    } catch (error) {
      console.error('Error adding field:', error);
      throw new Error(`Failed to add field to ${collectionSlug}: ${error.message}`);
    }
  }

  async removeField(collectionSlug: string, fieldName: string): Promise<void> {
    try {
      const config = await this.getCollectionConfig(collectionSlug);
      if (!config) {
        throw new Error(`Collection ${collectionSlug} not found`);
      }

      const fieldIndex = config.fields.findIndex(f => f.name === fieldName);
      if (fieldIndex === -1) {
        throw new Error(`Field ${fieldName} not found in collection ${collectionSlug}`);
      }

      const removedField = config.fields[fieldIndex];
      const newFields = config.fields.filter(f => f.name !== fieldName);

      // Store schema version
      await this.saveSchemaVersion(collectionSlug, {
        type: 'remove_field',
        path: `fields.${fieldName}`,
        oldValue: removedField,
        description: `Removed field ${fieldName} from ${collectionSlug}`
      });

      console.log(`Field ${fieldName} removed from collection ${collectionSlug}`);
    } catch (error) {
      console.error('Error removing field:', error);
      throw new Error(`Failed to remove field from ${collectionSlug}: ${error.message}`);
    }
  }

  async updateField(
    collectionSlug: string, 
    fieldName: string, 
    updates: Partial<FieldConfig>
  ): Promise<void> {
    try {
      const config = await this.getCollectionConfig(collectionSlug);
      if (!config) {
        throw new Error(`Collection ${collectionSlug} not found`);
      }

      const fieldIndex = config.fields.findIndex(f => f.name === fieldName);
      if (fieldIndex === -1) {
        throw new Error(`Field ${fieldName} not found in collection ${collectionSlug}`);
      }

      const oldField = config.fields[fieldIndex];
      const updatedField = { ...oldField, ...updates };

      // Validate the updated field
      const fieldValidation = this.validateFieldConfig(updatedField);
      if (!fieldValidation.valid) {
        throw new Error(`Invalid field config: ${fieldValidation.errors.map(e => e.message).join(', ')}`);
      }

      // Store schema version
      await this.saveSchemaVersion(collectionSlug, {
        type: 'modify_field',
        path: `fields.${fieldName}`,
        oldValue: oldField,
        newValue: updatedField,
        description: `Updated field ${fieldName} in ${collectionSlug}`
      });

      console.log(`Field ${fieldName} updated in collection ${collectionSlug}`);
    } catch (error) {
      console.error('Error updating field:', error);
      throw new Error(`Failed to update field in ${collectionSlug}: ${error.message}`);
    }
  }

  async reorderFields(collectionSlug: string, fieldNames: string[]): Promise<void> {
    try {
      const config = await this.getCollectionConfig(collectionSlug);
      if (!config) {
        throw new Error(`Collection ${collectionSlug} not found`);
      }

      // Validate that all field names exist
      const existingFieldNames = config.fields.map(f => f.name);
      const missingFields = fieldNames.filter(name => !existingFieldNames.includes(name));
      if (missingFields.length > 0) {
        throw new Error(`Fields not found: ${missingFields.join(', ')}`);
      }

      // Reorder fields
      const reorderedFields = fieldNames.map(name => 
        config.fields.find(f => f.name === name)!
      );

      // Add any fields not in the reorder list to the end
      const unspecifiedFields = config.fields.filter(f => !fieldNames.includes(f.name));
      const newFields = [...reorderedFields, ...unspecifiedFields];

      // Store schema version
      await this.saveSchemaVersion(collectionSlug, {
        type: 'reorder_fields',
        path: 'fields',
        oldValue: config.fields.map(f => f.name),
        newValue: fieldNames,
        description: `Reordered fields in ${collectionSlug}`
      });

      console.log(`Fields reordered in collection ${collectionSlug}`);
    } catch (error) {
      console.error('Error reordering fields:', error);
      throw new Error(`Failed to reorder fields in ${collectionSlug}: ${error.message}`);
    }
  }

  validateCollectionConfig(config: Partial<CollectionConfig>): ValidationResult {
    const errors: any[] = [];
    const warnings: any[] = [];

    // Required fields validation
    if (!config.slug) {
      errors.push({
        field: 'slug',
        message: 'Collection slug is required',
        code: 'REQUIRED_FIELD'
      });
    } else if (!/^[a-z0-9-_]+$/.test(config.slug)) {
      errors.push({
        field: 'slug',
        message: 'Collection slug must contain only lowercase letters, numbers, hyphens, and underscores',
        code: 'INVALID_FORMAT'
      });
    }

    if (!config.fields || config.fields.length === 0) {
      errors.push({
        field: 'fields',
        message: 'Collection must have at least one field',
        code: 'REQUIRED_FIELD'
      });
    }

    // Validate individual fields
    if (config.fields) {
      const fieldNames = new Set<string>();
      config.fields.forEach((field, index) => {
        const fieldValidation = this.validateFieldConfig(field);
        errors.push(...fieldValidation.errors.map(err => ({
          ...err,
          field: `fields[${index}].${err.field}`
        })));
        warnings.push(...fieldValidation.warnings.map(warn => ({
          ...warn,
          field: `fields[${index}].${warn.field}`
        })));

        // Check for duplicate field names
        if (fieldNames.has(field.name)) {
          errors.push({
            field: `fields[${index}].name`,
            message: `Duplicate field name: ${field.name}`,
            code: 'DUPLICATE_FIELD'
          });
        }
        fieldNames.add(field.name);
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  validateFieldConfig(field: FieldConfig): ValidationResult {
    const errors: any[] = [];
    const warnings: any[] = [];

    // Required properties
    if (!field.name) {
      errors.push({
        field: 'name',
        message: 'Field name is required',
        code: 'REQUIRED_FIELD'
      });
    } else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(field.name)) {
      errors.push({
        field: 'name',
        message: 'Field name must start with a letter and contain only letters, numbers, and underscores',
        code: 'INVALID_FORMAT'
      });
    }

    if (!field.type) {
      errors.push({
        field: 'type',
        message: 'Field type is required',
        code: 'REQUIRED_FIELD'
      });
    }

    // Type-specific validations
    if (field.type === 'text' || field.type === 'textarea') {
      if (field.minLength !== undefined && field.minLength < 0) {
        errors.push({
          field: 'minLength',
          message: 'minLength must be non-negative',
          code: 'INVALID_VALUE'
        });
      }
      if (field.maxLength !== undefined && field.maxLength < 1) {
        errors.push({
          field: 'maxLength',
          message: 'maxLength must be positive',
          code: 'INVALID_VALUE'
        });
      }
      if (field.minLength !== undefined && field.maxLength !== undefined && field.minLength > field.maxLength) {
        errors.push({
          field: 'minLength',
          message: 'minLength cannot be greater than maxLength',
          code: 'INVALID_RANGE'
        });
      }
    }

    if (field.type === 'number') {
      if (field.min !== undefined && field.max !== undefined && field.min > field.max) {
        errors.push({
          field: 'min',
          message: 'min cannot be greater than max',
          code: 'INVALID_RANGE'
        });
      }
    }

    if (field.type === 'relationship') {
      if (!field.relationTo) {
        errors.push({
          field: 'relationTo',
          message: 'relationTo is required for relationship fields',
          code: 'REQUIRED_FIELD'
        });
      }
    }

    // Performance warnings
    if (field.index === true && !field.required) {
      warnings.push({
        field: 'index',
        message: 'Indexing non-required fields may impact performance',
        code: 'PERFORMANCE_WARNING'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  private async saveSchemaVersion(collectionSlug: string, change: Omit<SchemaChange, 'timestamp'>): Promise<void> {
    const versions = this.schemaVersions.get(collectionSlug) || [];
    
    const newVersion: SchemaVersion = {
      id: `${collectionSlug}-${Date.now()}`,
      version: `${versions.length + 1}.0.0`,
      timestamp: new Date(),
      author: { id: 'system' } as User, // Would get from context
      changes: [{ ...change } as SchemaChange],
      rollbackAvailable: true
    };

    versions.push(newVersion);
    this.schemaVersions.set(collectionSlug, versions);
  }

  async getSchemaHistory(collectionSlug: string): Promise<SchemaVersion[]> {
    return this.schemaVersions.get(collectionSlug) || [];
  }

  async previewMigration(
    fromSchema: CollectionConfig, 
    toSchema: CollectionConfig
  ): Promise<MigrationPreview> {
    const changes: SchemaChange[] = [];
    const risks: any[] = [];

    // Compare schemas and identify changes
    // This is a simplified implementation - would need more comprehensive logic
    
    // Field changes
    const fromFieldMap = new Map(fromSchema.fields.map(f => [f.name, f]));
    const toFieldMap = new Map(toSchema.fields.map(f => [f.name, f]));

    // Added fields
    for (const [name, field] of toFieldMap) {
      if (!fromFieldMap.has(name)) {
        changes.push({
          type: 'add_field',
          path: `fields.${name}`,
          newValue: field,
          description: `Add field ${name}`
        });
      }
    }

    // Removed fields
    for (const [name, field] of fromFieldMap) {
      if (!toFieldMap.has(name)) {
        changes.push({
          type: 'remove_field',
          path: `fields.${name}`,
          oldValue: field,
          description: `Remove field ${name}`
        });
        
        risks.push({
          level: 'high' as const,
          description: `Removing field ${name} will cause data loss`,
          mitigation: 'Backup data before migration'
        });
      }
    }

    // Modified fields
    for (const [name, newField] of toFieldMap) {
      const oldField = fromFieldMap.get(name);
      if (oldField && JSON.stringify(oldField) !== JSON.stringify(newField)) {
        changes.push({
          type: 'modify_field',
          path: `fields.${name}`,
          oldValue: oldField,
          newValue: newField,
          description: `Modify field ${name}`
        });

        // Check for type changes
        if (oldField.type !== newField.type) {
          risks.push({
            level: 'critical' as const,
            description: `Changing field type from ${oldField.type} to ${newField.type} may cause data loss`,
            mitigation: 'Ensure data compatibility or provide transformation logic'
          });
        }
      }
    }

    return {
      changes,
      affectedDocuments: 0, // Would calculate based on actual data
      estimatedTime: changes.length * 1000, // Rough estimate
      risks,
      recommendations: [
        'Backup your database before applying migration',
        'Test migration on a copy of production data first',
        'Apply migration during low-traffic periods'
      ]
    };
  }
}