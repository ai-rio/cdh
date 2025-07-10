// Smart API client that works seamlessly in development and production
import { createClient } from '@supabase/supabase-js';

const isDevelopment = process.env.NODE_ENV === 'development';
const forceLocalAPI = process.env.USE_LOCAL_API === 'true';
const useLocalAPI = isDevelopment || forceLocalAPI;

// Only initialize Supabase client if not in local-only mode
const supabase = !useLocalAPI && process.env.NEXT_PUBLIC_SUPABASE_URL ? createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
) : null;

export class SmartAPI {
  /**
   * Get users with automatic environment detection
   * - Development: Uses local API directly
   * - Production: Uses Edge Functions with fallback
   */
  static async getUsers(token: string) {
    console.log(`🔧 API Mode: ${useLocalAPI ? 'LOCAL' : 'EDGE_FUNCTIONS'}`);
    
    if (!token) {
      return { data: null, error: new Error('Authentication token required'), source: 'error' };
    }
    
    if (useLocalAPI) {
      return this.getUsersLocal(token);
    }

    // Production: Try edge functions first
    try {
      const startTime = performance.now();
      const { data, error } = await supabase!.functions.invoke('users-cached', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const endTime = performance.now();
      console.log(`⚡ Edge Function: ${Math.round(endTime - startTime)}ms`);

      if (error) throw error;
      return { data, error: null, source: 'edge-function' };
    } catch (error) {
      console.warn('🔄 Edge function failed, falling back to local API:', error);
      return this.getUsersLocal(token);
    }
  }

  /**
   * Login with automatic environment detection
   */
  static async login(email: string, password: string) {
    console.log(`🔧 Auth Mode: ${useLocalAPI ? 'LOCAL' : 'EDGE_FUNCTIONS'}`);
    
    if (useLocalAPI) {
      return this.loginLocal(email, password);
    }

    // Production: Try edge functions first
    try {
      const startTime = performance.now();
      const { data, error } = await supabase!.functions.invoke('auth-optimized', {
        body: { email, password },
      });

      const endTime = performance.now();
      console.log(`⚡ Edge Auth: ${Math.round(endTime - startTime)}ms`);

      if (error) throw error;
      return { data, error: null, source: 'edge-function' };
    } catch (error) {
      console.warn('🔄 Edge auth failed, falling back to local API:', error);
      return this.loginLocal(email, password);
    }
  }

  /**
   * Local API methods (work in both development and production)
   */
  static async getUsersLocal(token: string) {
    try {
      const startTime = performance.now();
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const endTime = performance.now();
      console.log(`🏠 Local API: ${Math.round(endTime - startTime)}ms`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
      }

      const data = await response.json();
      return { data, error: null, source: 'local-api' };
    } catch (error) {
      return { data: null, error, source: 'local-api' };
    }
  }

  static async loginLocal(email: string, password: string) {
    try {
      const startTime = performance.now();
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const endTime = performance.now();
      console.log(`🏠 Local Auth: ${Math.round(endTime - startTime)}ms`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      return { data, error: null, source: 'local-api' };
    } catch (error) {
      return { data: null, error, source: 'local-api' };
    }
  }

  /**
   * Get current API mode for debugging
   */
  static getAPIMode() {
    return {
      isDevelopment,
      forceLocalAPI,
      useLocalAPI,
      mode: useLocalAPI ? 'LOCAL_API' : 'EDGE_FUNCTIONS',
    };
  }
}

// Export for debugging
export const API_CONFIG = {
  isDevelopment,
  forceLocalAPI,
  useLocalAPI,
  mode: useLocalAPI ? 'LOCAL_API' : 'EDGE_FUNCTIONS',
};
