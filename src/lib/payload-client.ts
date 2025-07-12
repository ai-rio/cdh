'use client';

import { User, Media } from '@/payload-types';

// Payload API client configuration
const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

export interface PayloadResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface PayloadSingleResponse<T> {
  doc: T;
}

export interface PayloadError {
  message: string;
  errors?: Array<{
    message: string;
    field: string;
  }>;
}

export class PayloadClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = PAYLOAD_API_URL) {
    this.baseUrl = baseUrl;
    this.initializeAuth();
  }

  private initializeAuth() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('payload-token') || localStorage.getItem('auth_token');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `JWT ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication methods
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await fetch(`${this.baseUrl}/api/users/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await this.handleResponse<{ user: User; token: string }>(response);
    
    if (data.token) {
      this.token = data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('payload-token', data.token);
      }
    }

    return data;
  }

  async logout(): Promise<void> {
    await fetch(`${this.baseUrl}/api/users/logout`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('payload-token');
      localStorage.removeItem('auth_token');
    }
  }

  async me(): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/users/me`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        return null;
      }

      const data = await this.handleResponse<{ user: User }>(response);
      return data.user;
    } catch {
      return null;
    }
  }

  // Generic collection methods
  async getCollection<T>(
    collection: string,
    options: {
      page?: number;
      limit?: number;
      sort?: string;
      where?: Record<string, any>;
      search?: string;
    } = {}
  ): Promise<PayloadResponse<T>> {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.sort) params.append('sort', options.sort);
    if (options.where) params.append('where', JSON.stringify(options.where));
    if (options.search) params.append('search', options.search);

    const response = await fetch(`${this.baseUrl}/api/${collection}?${params}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse<PayloadResponse<T>>(response);
  }

  async getDocument<T>(collection: string, id: string | number): Promise<T> {
    const response = await fetch(`${this.baseUrl}/api/${collection}/${id}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async createDocument<T>(collection: string, data: Partial<T>): Promise<T> {
    const response = await fetch(`${this.baseUrl}/api/${collection}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async updateDocument<T>(collection: string, id: string | number, data: Partial<T>): Promise<T> {
    const response = await fetch(`${this.baseUrl}/api/${collection}/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async deleteDocument(collection: string, id: string | number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/${collection}/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    await this.handleResponse<void>(response);
  }

  // Specific collection methods for type safety
  async getUsers(options?: {
    page?: number;
    limit?: number;
    sort?: string;
    where?: Record<string, any>;
    search?: string;
  }): Promise<PayloadResponse<User>> {
    return this.getCollection<User>('users', options);
  }

  async getUser(id: string | number): Promise<User> {
    return this.getDocument<User>('users', id);
  }

  async createUser(data: Partial<User>): Promise<User> {
    return this.createDocument<User>('users', data);
  }

  async updateUser(id: string | number, data: Partial<User>): Promise<User> {
    return this.updateDocument<User>('users', id, data);
  }

  async deleteUser(id: string | number): Promise<void> {
    return this.deleteDocument('users', id);
  }

  async getMedia(options?: {
    page?: number;
    limit?: number;
    sort?: string;
    where?: Record<string, any>;
    search?: string;
  }): Promise<PayloadResponse<Media>> {
    return this.getCollection<Media>('media', options);
  }

  async getMediaItem(id: string | number): Promise<Media> {
    return this.getDocument<Media>('media', id);
  }

  async createMedia(data: Partial<Media>): Promise<Media> {
    return this.createDocument<Media>('media', data);
  }

  async updateMedia(id: string | number, data: Partial<Media>): Promise<Media> {
    return this.updateDocument<Media>('media', id, data);
  }

  async deleteMedia(id: string | number): Promise<void> {
    return this.deleteDocument('media', id);
  }

  // File upload method for media
  async uploadFile(file: File, alt?: string): Promise<Media> {
    const formData = new FormData();
    formData.append('file', file);
    if (alt) formData.append('alt', alt);

    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `JWT ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}/api/media`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse<Media>(response);
  }

  // Collection schema introspection
  async getCollectionConfig(collection: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/${collection}/config`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse<any>(response);
  }

  // Get all available collections
  async getCollections(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/collections`, {
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse<{ collections: string[] }>(response);
      return data.collections;
    } catch {
      // Fallback to known collections if API doesn't support this endpoint
      return ['users', 'media'];
    }
  }

  // Dashboard-specific methods
  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalMedia: number;
    recentActivity: number;
  }> {
    try {
      const [users, media] = await Promise.all([
        this.getUsers({ limit: 1 }),
        this.getMedia({ limit: 1 }),
      ]);

      return {
        totalUsers: users.totalDocs,
        totalMedia: media.totalDocs,
        recentActivity: 0, // This would need to be implemented based on actual activity tracking
      };
    } catch (error) {
      const dashboardError = new Error(`Failed to fetch dashboard stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw dashboardError;
    }
  }

  async getCollectionCounts(): Promise<Record<string, number>> {
    try {
      const collections = await this.getCollections();
      const counts: Record<string, number> = {};

      await Promise.all(
        collections.map(async (collection) => {
          try {
            const data = await this.getCollection(collection, { limit: 1 });
            counts[collection] = data.totalDocs;
          } catch (error) {
            counts[collection] = 0;
          }
        })
      );

      return counts;
    } catch (error) {
      throw new Error(`Failed to fetch collection counts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRecentDocuments(collection: string, days = 7): Promise<any[]> {
    try {
      const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const response = await this.getCollection(collection, {
        where: {
          createdAt: {
            greater_than: sinceDate.toISOString(),
          },
        },
        sort: '-createdAt',
        limit: 10,
      });

      return response.docs;
    } catch (error) {
      throw new Error(`Failed to fetch recent documents for ${collection}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Singleton instance
export const payloadClient = new PayloadClient();

// React hook for using Payload client
export function usePayloadClient() {
  return payloadClient;
}
