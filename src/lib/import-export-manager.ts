import type { Payload } from 'payload';
import type { 
  ImportOptions, 
  ImportResult, 
  ImportError, 
  ImportWarning,
  FieldMapping,
  User,
  Where
} from '@/types';

export class ImportExportManager {
  constructor(private payload: Payload) {}

  async import(options: {
    collection: string;
    data: any[];
    options: ImportOptions;
    user?: User;
  }): Promise<ImportResult> {
    const { collection, data, options: importOptions, user } = options;
    const startTime = Date.now();
    
    let importedRecords = 0;
    let skippedRecords = 0;
    let errorRecords = 0;
    const errors: ImportError[] = [];
    const warnings: ImportWarning[] = [];

    try {
      // Validate import options
      if (!data || data.length === 0) {
        throw new Error('No data provided for import');
      }

      // Process data in batches
      const batchSize = importOptions.batchSize || 100;
      const batches = this.chunkArray(data, batchSize);

      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        
        for (let rowIndex = 0; rowIndex < batch.length; rowIndex++) {
          const globalRowIndex = batchIndex * batchSize + rowIndex;
          const rawRecord = batch[rowIndex];

          try {
            // Transform record using field mapping
            const transformedRecord = this.transformRecord(rawRecord, importOptions.mapping);

            // Validate record
            const validationResult = await this.validateRecord(
              transformedRecord, 
              collection, 
              importOptions.validation
            );

            if (validationResult.hasErrors && !importOptions.skipErrors) {
              validationResult.errors.forEach(error => {
                errors.push({
                  row: globalRowIndex + 1,
                  field: error.field,
                  value: error.value,
                  message: error.message,
                  code: error.code
                });
              });
              errorRecords++;
              continue;
            }

            if (validationResult.hasWarnings) {
              validationResult.warnings.forEach(warning => {
                warnings.push({
                  row: globalRowIndex + 1,
                  field: warning.field,
                  value: warning.value,
                  message: warning.message,
                  suggestion: warning.suggestion
                });
              });
            }

            // Check for conflicts
            const conflictResolution = await this.handleConflicts(
              transformedRecord,
              collection,
              importOptions.conflictResolution,
              user
            );

            if (conflictResolution.skip) {
              skippedRecords++;
              continue;
            }

            // Import record
            if (!importOptions.dryRun) {
              if (conflictResolution.isUpdate) {
                await this.payload.update({
                  collection,
                  id: conflictResolution.existingId!,
                  data: conflictResolution.data,
                  user,
                  overrideAccess: false
                });
              } else {
                await this.payload.create({
                  collection,
                  data: conflictResolution.data,
                  user,
                  overrideAccess: false
                });
              }
            }

            importedRecords++;
          } catch (error) {
            errors.push({
              row: globalRowIndex + 1,
              message: error.message,
              code: 'IMPORT_ERROR'
            });
            errorRecords++;

            if (!importOptions.skipErrors) {
              break;
            }
          }
        }
      }

      const executionTime = Date.now() - startTime;

      return {
        success: errorRecords === 0 || importOptions.skipErrors,
        totalRecords: data.length,
        importedRecords,
        skippedRecords,
        errorRecords,
        errors,
        warnings,
        executionTime,
        preview: importOptions.dryRun
      };
    } catch (error) {
      throw new Error(`Import failed: ${error.message}`);
    }
  }

  async export(options: {
    collection: string;
    query?: Where;
    format: 'csv' | 'json' | 'xlsx';
    user?: User;
    fields?: string[];
    limit?: number;
  }): Promise<Blob> {
    const { collection, query, format, user, fields, limit } = options;

    try {
      // Fetch data
      const result = await this.payload.find({
        collection,
        where: query,
        limit: limit || 0, // 0 means no limit
        user,
        overrideAccess: false,
        select: fields
      });

      // Convert to requested format
      switch (format) {
        case 'json':
          return this.exportToJson(result.docs);
        case 'csv':
          return this.exportToCsv(result.docs, fields);
        case 'xlsx':
          return this.exportToXlsx(result.docs, fields);
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      throw new Error(`Export failed: ${error.message}`);
    }
  }

  private transformRecord(record: any, mapping: FieldMapping[]): any {
    const transformed: any = {};

    for (const map of mapping) {
      let value = this.getNestedValue(record, map.sourceField);

      // Apply transformation if provided
      if (map.transform) {
        try {
          value = map.transform(value);
        } catch (error) {
          console.warn(`Transformation failed for field ${map.sourceField}:`, error);
          value = map.defaultValue;
        }
      }

      // Use default value if value is null/undefined and default is provided
      if ((value === null || value === undefined) && map.defaultValue !== undefined) {
        value = map.defaultValue;
      }

      // Set the transformed value
      this.setNestedValue(transformed, map.targetField, value);
    }

    return transformed;
  }

  private async validateRecord(
    record: any, 
    collection: string, 
    validationLevel: 'strict' | 'lenient' | 'none'
  ): Promise<{
    hasErrors: boolean;
    hasWarnings: boolean;
    errors: any[];
    warnings: any[];
  }> {
    const errors: any[] = [];
    const warnings: any[] = [];

    if (validationLevel === 'none') {
      return { hasErrors: false, hasWarnings: false, errors, warnings };
    }

    try {
      // Get collection config for validation
      const collections = this.payload.config.collections;
      const collectionConfig = collections?.find(col => col.slug === collection);
      
      if (!collectionConfig) {
        throw new Error(`Collection ${collection} not found`);
      }

      // Validate required fields
      for (const field of collectionConfig.fields) {
        if (field.required && (record[field.name] === undefined || record[field.name] === null)) {
          if (validationLevel === 'strict') {
            errors.push({
              field: field.name,
              value: record[field.name],
              message: `Required field ${field.name} is missing`,
              code: 'REQUIRED_FIELD'
            });
          } else {
            warnings.push({
              field: field.name,
              value: record[field.name],
              message: `Required field ${field.name} is missing`,
              suggestion: 'Provide a value or set a default'
            });
          }
        }

        // Type validation
        if (record[field.name] !== undefined) {
          const typeValidation = this.validateFieldType(field, record[field.name]);
          if (!typeValidation.valid) {
            if (validationLevel === 'strict') {
              errors.push({
                field: field.name,
                value: record[field.name],
                message: typeValidation.message,
                code: 'TYPE_MISMATCH'
              });
            } else {
              warnings.push({
                field: field.name,
                value: record[field.name],
                message: typeValidation.message,
                suggestion: typeValidation.suggestion
              });
            }
          }
        }
      }

      return {
        hasErrors: errors.length > 0,
        hasWarnings: warnings.length > 0,
        errors,
        warnings
      };
    } catch (error) {
      errors.push({
        message: `Validation error: ${error.message}`,
        code: 'VALIDATION_ERROR'
      });
      return { hasErrors: true, hasWarnings: false, errors, warnings };
    }
  }

  private validateFieldType(field: any, value: any): { valid: boolean; message?: string; suggestion?: string } {
    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'email':
        if (typeof value !== 'string') {
          return {
            valid: false,
            message: `Expected string for ${field.type} field`,
            suggestion: 'Convert value to string'
          };
        }
        break;
      case 'number':
        if (typeof value !== 'number' && !Number.isFinite(Number(value))) {
          return {
            valid: false,
            message: 'Expected numeric value',
            suggestion: 'Ensure value is a valid number'
          };
        }
        break;
      case 'checkbox':
        if (typeof value !== 'boolean') {
          return {
            valid: false,
            message: 'Expected boolean value',
            suggestion: 'Use true/false or 1/0'
          };
        }
        break;
      case 'date':
        if (!(value instanceof Date) && isNaN(Date.parse(value))) {
          return {
            valid: false,
            message: 'Expected valid date',
            suggestion: 'Use ISO date format (YYYY-MM-DD)'
          };
        }
        break;
    }

    return { valid: true };
  }

  private async handleConflicts(
    record: any,
    collection: string,
    conflictResolution: 'skip' | 'overwrite' | 'merge' | 'error',
    user?: User
  ): Promise<{
    skip: boolean;
    isUpdate: boolean;
    existingId?: string;
    data: any;
  }> {
    // Check for existing record (simplified - would need better logic)
    let existingRecord = null;
    let existingId: string | undefined;

    // Look for existing record by common unique fields
    const uniqueFields = ['id', 'email', 'slug', 'name'];
    for (const field of uniqueFields) {
      if (record[field]) {
        try {
          const result = await this.payload.find({
            collection,
            where: { [field]: { equals: record[field] } },
            limit: 1,
            user,
            overrideAccess: false
          });

          if (result.docs.length > 0) {
            existingRecord = result.docs[0];
            existingId = existingRecord.id;
            break;
          }
        } catch (error) {
          // Continue if field doesn't exist or other error
          continue;
        }
      }
    }

    if (!existingRecord) {
      return { skip: false, isUpdate: false, data: record };
    }

    // Handle conflict based on resolution strategy
    switch (conflictResolution) {
      case 'skip':
        return { skip: true, isUpdate: false, data: record };
      
      case 'error':
        throw new Error(`Conflict detected: Record already exists`);
      
      case 'overwrite':
        return { skip: false, isUpdate: true, existingId, data: record };
      
      case 'merge':
        const mergedData = { ...existingRecord, ...record };
        return { skip: false, isUpdate: true, existingId, data: mergedData };
      
      default:
        throw new Error(`Unknown conflict resolution strategy: ${conflictResolution}`);
    }
  }

  private exportToJson(data: any[]): Blob {
    const jsonString = JSON.stringify(data, null, 2);
    return new Blob([jsonString], { type: 'application/json' });
  }

  private exportToCsv(data: any[], fields?: string[]): Blob {
    if (data.length === 0) {
      return new Blob([''], { type: 'text/csv' });
    }

    // Determine fields to export
    const exportFields = fields || Object.keys(data[0]);
    
    // Create CSV header
    const header = exportFields.join(',');
    
    // Create CSV rows
    const rows = data.map(record => {
      return exportFields.map(field => {
        const value = this.getNestedValue(record, field);
        return this.escapeCsvValue(value);
      }).join(',');
    });

    const csvContent = [header, ...rows].join('\n');
    return new Blob([csvContent], { type: 'text/csv' });
  }

  private exportToXlsx(data: any[], fields?: string[]): Blob {
    // This is a simplified implementation
    // In a real app, you'd use a library like xlsx or exceljs
    console.warn('XLSX export not fully implemented, falling back to CSV');
    return this.exportToCsv(data, fields);
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!(key in current)) {
        current[key] = {};
      }
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  private escapeCsvValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    const stringValue = String(value);
    
    // Escape quotes and wrap in quotes if necessary
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  }
}