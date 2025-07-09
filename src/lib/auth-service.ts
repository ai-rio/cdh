/**
 * Authentication service for handling API calls to Payload CMS
 */

export interface LoginResponse {
  user: any;
  token: string;
  exp?: number;
}

export interface RegisterResponse {
  user: any;
  token: string;
  exp?: number;
}

export interface AuthError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

class AuthService {
  private baseUrl = '/api/users';

  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || this.getErrorMessage(response.status, 'login'));
    }

    const data = await response.json();
    
    if (!data.user || !data.token) {
      throw new Error('Invalid response from server');
    }

    return data;
  }

  /**
   * Register new user
   */
  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || this.getErrorMessage(response.status, 'register'));
    }

    const data = await response.json();
    
    if (!data.user || !data.token) {
      throw new Error('Invalid response from server');
    }

    return data;
  }

  /**
   * Logout user
   */
  async logout(token: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      // Ignore logout errors - user is logged out locally anyway
      console.warn('Logout request failed:', error);
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(token: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    return data.user;
  }

  /**
   * Refresh JWT token
   */
  async refreshToken(token: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/refresh-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return data;
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to send password reset email');
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to reset password');
    }
  }

  /**
   * Get appropriate error message based on status code
   */
  private getErrorMessage(status: number, operation: 'login' | 'register'): string {
    switch (status) {
      case 400:
        return operation === 'register' ? 'Invalid registration data' : 'Invalid login data';
      case 401:
        return 'Invalid email or password';
      case 409:
        return 'An account with this email already exists';
      case 429:
        return 'Too many attempts. Please try again later.';
      case 500:
      case 502:
      case 503:
        return 'Server error. Please try again later.';
      default:
        return `${operation === 'register' ? 'Registration' : 'Login'} failed. Please try again.`;
    }
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const authService = new AuthService();
export default authService;
