import type { Payload } from 'payload';
import type { 
  FindOptions, 
  FindResult, 
  CreateOptions, 
  UpdateOptions, 
  DeleteOptions,
  Where,
  User
} from '@/types';

export class CollectionOperations {
  constructor(private payload: Payload) {}

  async find<T = any>(options: FindOptions): Promise<FindResult<T>> {
    const {
      collection,
      where,
      limit = 25,
      page = 1,
      sort,
      depth = 1,
      user,
      overrideAccess = false,
      select,
      populate
    } = options;

    try {
      const result = await this.payload.find({
        collection,
        where,
        limit,
        page,
        sort,
        depth,
        user,
        overrideAccess,
        select,
        populate
      });

      return {
        docs: result.docs as T[],
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page ?? page,
        limit: result.limit ?? limit,
        hasNextPage: result.hasNextPage ?? false,
        hasPrevPage: result.hasPrevPage ?? false,
        nextPage: result.nextPage ?? undefined,
        prevPage: result.prevPage ?? undefined,
        pagingCounter: result.pagingCounter ?? ((page - 1) * limit) + 1
      };
    } catch (error) {
      console.error('Error finding documents:', error);
      throw new Error(`Failed to find documents in ${collection}: ${error.message}`);
    }
  }

  async findById<T = any>(
    collection: string, 
    id: string, 
    options: {
      depth?: number;
      user?: User;
      overrideAccess?: boolean;
      select?: string[];
    } = {}
  ): Promise<T | null> {
    const { depth = 1, user, overrideAccess = false, select } = options;

    try {
      const result = await this.payload.findByID({
        collection,
        id,
        depth,
        user,
        overrideAccess,
        select
      });

      return result as T;
    } catch (error) {
      if (error.message?.includes('not found')) {
        return null;
      }
      console.error('Error finding document by ID:', error);
      throw new Error(`Failed to find document ${id} in ${collection}: ${error.message}`);
    }
  }

  async create<T = any>(options: CreateOptions): Promise<T> {
    const {
      collection,
      data,
      user,
      overrideAccess = false,
      depth = 1
    } = options;

    try {
      const result = await this.payload.create({
        collection,
        data,
        user,
        overrideAccess,
        depth
      });

      return result as T;
    } catch (error) {
      console.error('Error creating document:', error);
      throw new Error(`Failed to create document in ${collection}: ${error.message}`);
    }
  }

  async update<T = any>(options: UpdateOptions): Promise<T> {
    const {
      collection,
      id,
      data,
      user,
      overrideAccess = false,
      depth = 1
    } = options;

    try {
      const result = await this.payload.update({
        collection,
        id,
        data,
        user,
        overrideAccess,
        depth
      });

      return result as T;
    } catch (error) {
      console.error('Error updating document:', error);
      throw new Error(`Failed to update document ${id} in ${collection}: ${error.message}`);
    }
  }

  async delete(options: DeleteOptions): Promise<void> {
    const {
      collection,
      id,
      user,
      overrideAccess = false
    } = options;

    try {
      await this.payload.delete({
        collection,
        id,
        user,
        overrideAccess
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error(`Failed to delete document ${id} from ${collection}: ${error.message}`);
    }
  }

  async bulkUpdate<T = any>(
    collection: string,
    where: Where,
    data: Partial<T>,
    options: {
      user?: User;
      overrideAccess?: boolean;
      depth?: number;
    } = {}
  ): Promise<{ docs: T[]; count: number }> {
    const { user, overrideAccess = false, depth = 1 } = options;

    try {
      const result = await this.payload.update({
        collection,
        where,
        data,
        user,
        overrideAccess,
        depth
      });

      return {
        docs: Array.isArray(result) ? result as T[] : [result as T],
        count: Array.isArray(result) ? result.length : 1
      };
    } catch (error) {
      console.error('Error bulk updating documents:', error);
      throw new Error(`Failed to bulk update documents in ${collection}: ${error.message}`);
    }
  }

  async bulkDelete(
    collection: string,
    where: Where,
    options: {
      user?: User;
      overrideAccess?: boolean;
    } = {}
  ): Promise<{ count: number }> {
    const { user, overrideAccess = false } = options;

    try {
      const result = await this.payload.delete({
        collection,
        where,
        user,
        overrideAccess
      });

      return {
        count: Array.isArray(result) ? result.length : 1
      };
    } catch (error) {
      console.error('Error bulk deleting documents:', error);
      throw new Error(`Failed to bulk delete documents from ${collection}: ${error.message}`);
    }
  }

  async count(
    collection: string,
    where?: Where,
    options: {
      user?: User;
      overrideAccess?: boolean;
    } = {}
  ): Promise<number> {
    const { user, overrideAccess = false } = options;

    try {
      const result = await this.payload.count({
        collection,
        where,
        user,
        overrideAccess
      });

      return result.totalDocs;
    } catch (error) {
      console.error('Error counting documents:', error);
      throw new Error(`Failed to count documents in ${collection}: ${error.message}`);
    }
  }

  async exists(
    collection: string,
    where: Where,
    options: {
      user?: User;
      overrideAccess?: boolean;
    } = {}
  ): Promise<boolean> {
    try {
      const count = await this.count(collection, where, options);
      return count > 0;
    } catch (error) {
      console.error('Error checking document existence:', error);
      return false;
    }
  }

  async aggregate(
    collection: string,
    pipeline: any[],
    options: {
      user?: User;
      overrideAccess?: boolean;
    } = {}
  ): Promise<any[]> {
    // Note: This would require access to the underlying database adapter
    // For now, we'll implement basic aggregation using find operations
    console.warn('Advanced aggregation not yet implemented, using basic find operation');
    
    try {
      const result = await this.find({
        collection,
        limit: 0, // Get all documents for aggregation
        user: options.user,
        overrideAccess: options.overrideAccess
      });

      // Basic aggregation simulation - would need proper implementation
      return result.docs;
    } catch (error) {
      console.error('Error performing aggregation:', error);
      throw new Error(`Failed to aggregate documents in ${collection}: ${error.message}`);
    }
  }

  // Utility methods for common operations
  async findRecent<T = any>(
    collection: string,
    limit: number = 10,
    options: {
      user?: User;
      overrideAccess?: boolean;
      depth?: number;
    } = {}
  ): Promise<T[]> {
    const result = await this.find<T>({
      collection,
      limit,
      sort: '-createdAt',
      ...options
    });

    return result.docs;
  }

  async search<T = any>(
    collection: string,
    query: string,
    fields: string[] = ['title', 'name', 'description'],
    options: {
      limit?: number;
      page?: number;
      user?: User;
      overrideAccess?: boolean;
    } = {}
  ): Promise<FindResult<T>> {
    const { limit = 25, page = 1, user, overrideAccess = false } = options;

    // Build OR query for text search across specified fields
    const where: Where = {
      or: fields.map(field => ({
        [field]: {
          contains: query
        }
      }))
    };

    return this.find<T>({
      collection,
      where,
      limit,
      page,
      user,
      overrideAccess
    });
  }

  async getCollectionStats(
    collection: string,
    options: {
      user?: User;
      overrideAccess?: boolean;
    } = {}
  ): Promise<{
    total: number;
    recent: number;
    avgDocumentSize?: number;
  }> {
    const { user, overrideAccess = false } = options;

    try {
      // Get total count
      const total = await this.count(collection, undefined, { user, overrideAccess });

      // Get recent count (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recent = await this.count(
        collection,
        {
          createdAt: {
            greater_than: sevenDaysAgo.toISOString()
          }
        },
        { user, overrideAccess }
      );

      return {
        total,
        recent,
        avgDocumentSize: undefined // Would need to implement based on actual data
      };
    } catch (error) {
      console.error('Error getting collection stats:', error);
      throw new Error(`Failed to get stats for ${collection}: ${error.message}`);
    }
  }
}