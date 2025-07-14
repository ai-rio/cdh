// Re-export all collection management types
export * from './collection-management';

// Common types for the application
export interface Where {
  [key: string]: any;
}

export interface ImportOptions {
  format: 'csv' | 'json' | 'xlsx';
  mapping?: any[];
  validation?: string;
}

export interface FilterOptions {
  where?: Where;
  [key: string]: any;
}

// Re-export Payload types for convenience
export type { User, Media } from '@/payload-types';