// Collection Management Type Definitions
import { User } from '@/payload-types';

// Core Payload Types
export interface CollectionConfig {
  slug: string;
  labels?: {
    singular?: string;
    plural?: string;
  };
  fields: FieldConfig[];
  admin?: {
    useAsTitle?: string;
    defaultColumns?: string[];
    preview?: (doc: any) => string;
    description?: string;
    group?: string;
  };
  access?: {
    create?: (args: any) => boolean;
    read?: (args: any) => boolean;
    update?: (args: any) => boolean;
    delete?: (args: any) => boolean;
  };
  hooks?: {
    beforeOperation?: Array<(args: any) => any>;
    afterOperation?: Array<(args: any) => any>;
    beforeValidate?: Array<(args: any) => any>;
    afterValidate?: Array<(args: any) => any>;
    beforeChange?: Array<(args: any) => any>;
    afterChange?: Array<(args: any) => any>;
    beforeRead?: Array<(args: any) => any>;
    afterRead?: Array<(args: any) => any>;
    beforeDelete?: Array<(args: any) => any>;
    afterDelete?: Array<(args: any) => any>;
  };
  versions?: {
    drafts?: boolean;
    maxPerDoc?: number;
  };
  timestamps?: boolean;
  auth?: boolean;
}

export interface FieldConfig {
  name: string;
  type: string;
  label?: string;
  required?: boolean;
  unique?: boolean;
  index?: boolean;
  hidden?: boolean;
  localized?: boolean;
  defaultValue?: any;
  validate?: (value: any) => boolean | string;
  admin?: {
    position?: 'sidebar';
    width?: string;
    style?: Record<string, any>;
    className?: string;
    description?: string;
    placeholder?: string;
    readOnly?: boolean;
    disabled?: boolean;
    condition?: (data: any) => boolean;
    components?: {
      Cell?: React.Component;
      Field?: React.Component;
      Filter?: React.Component;
    };
    date?: {
      pickerAppearance?: 'dayAndTime' | 'timeOnly' | 'dayOnly' | 'monthOnly';
      displayFormat?: string;
      timeFormat?: string;
    };
    rows?: number;
  };
  access?: {
    create?: (args: any) => boolean;
    read?: (args: any) => boolean;
    update?: (args: any) => boolean;
  };
  hooks?: {
    beforeValidate?: Array<(args: any) => any>;
    afterValidate?: Array<(args: any) => any>;
    beforeChange?: Array<(args: any) => any>;
    afterChange?: Array<(args: any) => any>;
    beforeRead?: Array<(args: any) => any>;
    afterRead?: Array<(args: any) => any>;
  };
  // Field-specific properties
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  hasMany?: boolean;
  minRows?: number;
  maxRows?: number;
  relationTo?: string | string[];
  filterOptions?: any;
  options?: Array<{
    label: string;
    value: string | number;
  }>;
  blocks?: FieldConfig[];
  fields?: FieldConfig[];
  tabs?: Array<{
    label: string;
    name: string;
    fields: FieldConfig[];
  }>;
  upload?: {
    staticDir?: string;
    staticURL?: string;
    disableLocalStorage?: boolean;
    adminThumbnail?: string;
    mimeTypes?: string[];
    imageSizes?: Array<{
      name: string;
      width?: number;
      height?: number;
      position?: string;
    }>;
  };
}

// Query Types
export interface Where {
  [key: string]: any;
  and?: Where[];
  or?: Where[];
}

export interface FindOptions {
  collection: string;
  where?: Where;
  limit?: number;
  page?: number;
  sort?: string;
  depth?: number;
  user?: User;
  overrideAccess?: boolean;
  select?: string[];
  populate?: string[];
}

export interface FindResult<T = any> {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage?: number;
  prevPage?: number;
  pagingCounter: number;
}

// CRUD Operation Types
export interface CreateOptions {
  collection: string;
  data: any;
  user?: User;
  overrideAccess?: boolean;
  depth?: number;
}

export interface UpdateOptions {
  collection: string;
  id: string;
  data: any;
  user?: User;
  overrideAccess?: boolean;
  depth?: number;
}

export interface DeleteOptions {
  collection: string;
  id: string;
  user?: User;
  overrideAccess?: boolean;
}

// Import/Export Types
export interface ImportOptions {
  format: 'csv' | 'json' | 'xlsx';
  mapping: FieldMapping[];
  validation: ValidationLevel;
  conflictResolution: ConflictResolution;
  batchSize: number;
  skipErrors: boolean;
  dryRun?: boolean;
  preserveIds?: boolean;
  updateExisting?: boolean;
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transform?: (value: any) => any;
  defaultValue?: any;
  required?: boolean;
}

export type ValidationLevel = 'strict' | 'lenient' | 'none';
export type ConflictResolution = 'skip' | 'overwrite' | 'merge' | 'error';

export interface ImportResult {
  success: boolean;
  totalRecords: number;
  importedRecords: number;
  skippedRecords: number;
  errorRecords: number;
  errors: ImportError[];
  warnings: ImportWarning[];
  executionTime: number;
  preview?: boolean;
}

export interface ImportError {
  row: number;
  field?: string;
  value?: any;
  message: string;
  code: string;
}

export interface ImportWarning {
  row: number;
  field?: string;
  value?: any;
  message: string;
  suggestion?: string;
}

// Collection Statistics
export interface CollectionStats {
  totalDocuments: number;
  averageDocumentSize: number;
  fieldUsage: Record<string, number>;
  creationTrends: TimeSeriesData[];
  updateFrequency: TimeSeriesData[];
  storageUsage: StorageStats;
  performanceMetrics: PerformanceMetrics;
  lastCalculated: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface StorageStats {
  totalSize: number;
  averageDocumentSize: number;
  indexSize: number;
  efficiency: number;
}

export interface PerformanceMetrics {
  averageQueryTime: number;
  slowQueries: number;
  cacheHitRate: number;
  indexUsage: Record<string, number>;
}

export interface FieldUsageStats {
  fieldName: string;
  usageCount: number;
  nullCount: number;
  uniqueCount: number;
  averageLength?: number;
  mostCommonValues: Array<{
    value: any;
    count: number;
  }>;
}

// Real-time Collaboration Types
export interface DocumentChange {
  collection: string;
  documentId: string;
  fieldPath: string;
  oldValue: any;
  newValue: any;
  userId?: string;
  timestamp: Date;
  changeType: 'create' | 'update' | 'delete';
}

export interface LockResult {
  success: boolean;
  lockId?: string;
  expiresAt?: Date;
  lockedBy?: User;
  message?: string;
}

export interface LockStatus {
  isLocked: boolean;
  lockId?: string;
  lockedBy?: User;
  expiresAt?: Date;
  timeRemaining?: number;
}

export interface UserPresence {
  userId: string;
  collection: string;
  documentId?: string;
  fieldPath?: string;
  cursor?: CursorPosition;
  lastSeen: Date;
  isActive: boolean;
}

export interface CursorPosition {
  x: number;
  y: number;
  elementId?: string;
  selection?: {
    start: number;
    end: number;
  };
}

export interface ActiveUser {
  user: User;
  presence: UserPresence;
  color: string;
}

export interface DocumentConflict {
  documentId: string;
  collection: string;
  fieldPath: string;
  conflictType: 'concurrent_edit' | 'version_mismatch' | 'lock_conflict';
  localValue: any;
  remoteValue: any;
  timestamp: Date;
  users: User[];
}

export interface ConflictResolutionResult {
  resolution: 'local' | 'remote' | 'merge' | 'manual';
  resolvedValue: any;
  conflicts: DocumentConflict[];
}

// Schema Management Types
export interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'email' | 'date' | 'array' | 'object';
  min?: number;
  max?: number;
  pattern?: string;
  required?: boolean;
  custom?: (value: any) => boolean | string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  value: any;
  message: string;
  code: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationWarning extends ValidationError {
  suggestion?: string;
}

export interface SchemaVersion {
  id: string;
  version: string;
  timestamp: Date;
  author: User;
  changes: SchemaChange[];
  description?: string;
  rollbackAvailable: boolean;
}

export interface SchemaChange {
  type: 'add_field' | 'remove_field' | 'modify_field' | 'reorder_fields' | 'add_collection' | 'remove_collection' | 'modify_collection';
  path: string;
  oldValue?: any;
  newValue?: any;
  description?: string;
}

export interface MigrationResult {
  success: boolean;
  migrationId: string;
  appliedChanges: SchemaChange[];
  affectedDocuments: number;
  executionTime: number;
  rollbackScript?: string;
  errors: MigrationError[];
  warnings: MigrationWarning[];
}

export interface MigrationError {
  operation: string;
  message: string;
  documentId?: string;
  fieldPath?: string;
  originalValue?: any;
}

export interface MigrationWarning extends MigrationError {
  suggestion?: string;
}

export interface MigrationPreview {
  changes: SchemaChange[];
  affectedDocuments: number;
  estimatedTime: number;
  risks: MigrationRisk[];
  recommendations: string[];
}

export interface MigrationRisk {
  level: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigation?: string;
  affectedDocuments?: number;
}

// Callback and Subscription Types
export type ChangeCallback = (change: DocumentChange) => void;
export type PresenceCallback = (presence: UserPresence[]) => void;

export interface Subscription {
  id: string;
  unsubscribe: () => void;
  isActive: boolean;
}

// Advanced Operations Types
export interface CloneOptions {
  includeData?: boolean;
  includeIndexes?: boolean;
  includeHooks?: boolean;
  includeAccess?: boolean;
  newSlug?: string;
  newLabels?: {
    singular?: string;
    plural?: string;
  };
}

export interface DuplicateOptions {
  includeRelationships?: boolean;
  updateReferences?: boolean;
  suffix?: string;
  preserveIds?: boolean;
}

export interface DataTransformation {
  field: string;
  operation: 'map' | 'filter' | 'reduce' | 'sort' | 'group';
  expression: string | ((value: any) => any);
  conditions?: Where;
}

export interface TransformResult {
  success: boolean;
  affectedDocuments: number;
  transformations: DataTransformation[];
  executionTime: number;
  preview?: any[];
  errors: TransformError[];
}

export interface TransformError {
  documentId: string;
  field: string;
  operation: string;
  message: string;
  originalValue: any;
}

export interface CleanupResult {
  orphanedRecords: number;
  deletedRecords: number;
  fixedReferences: number;
  errors: CleanupError[];
  executionTime: number;
}

export interface CleanupError {
  documentId: string;
  issue: string;
  message: string;
  autoFixed: boolean;
}

export interface IntegrityReport {
  valid: boolean;
  issues: IntegrityIssue[];
  checkedDocuments: number;
  checkedReferences: number;
  executionTime: number;
}

export interface IntegrityIssue {
  type: 'orphaned_reference' | 'missing_required_field' | 'invalid_type' | 'constraint_violation';
  documentId: string;
  field?: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  autoFixable: boolean;
}

export interface OptimizationResult {
  indexesCreated: number;
  indexesRemoved: number;
  performanceGain: number;
  storageReduced: number;
  recommendations: OptimizationRecommendation[];
  executionTime: number;
}

export interface OptimizationRecommendation {
  type: 'index' | 'schema' | 'query' | 'storage';
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  estimatedGain: string;
}

// Reporting Types
export type ReportType = 'usage' | 'performance' | 'security' | 'data_quality' | 'schema_analysis';

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  description: string;
  generatedAt: Date;
  generatedBy: User;
  data: any;
  charts?: ReportChart[];
  recommendations?: string[];
  exportFormats: string[];
}

export interface ReportChart {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  title: string;
  data: any[];
  config?: Record<string, any>;
}