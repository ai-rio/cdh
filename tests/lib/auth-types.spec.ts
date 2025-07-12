import { describe, it, expect } from 'vitest';
import { 
  AuthUser, 
  AuthSession, 
  LoginCredentials, 
  AuthResult,
  Permission,
  Role,
  RolePermissionMatrix
} from '@/lib/auth-types';

describe('Auth Types', () => {
  describe('AuthUser interface', () => {
    it('should define required user properties', () => {
      const user: AuthUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        permissions: ['read:dashboard'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      expect(user).toBeDefined();
      expect(user.id).toBe('user123');
      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe('user');
      expect(Array.isArray(user.permissions)).toBe(true);
    });

    it('should allow optional admin-specific properties', () => {
      const adminUser: AuthUser = {
        id: 'admin123',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        permissions: ['read:dashboard', 'write:users', 'admin:system'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        adminLevel: 'super',
        department: 'IT'
      };

      expect(adminUser.adminLevel).toBe('super');
      expect(adminUser.department).toBe('IT');
    });
  });

  describe('AuthSession interface', () => {
    it('should define session properties', () => {
      const session: AuthSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
          permissions: ['read:dashboard'],
          isActive: true,
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        token: 'jwt.token.here',
        refreshToken: 'refresh.token.here',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        issuedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };

      expect(session.user).toBeDefined();
      expect(session.token).toBeDefined();
      expect(session.expiresAt).toBeDefined();
    });
  });

  describe('Permission and Role types', () => {
    it('should define permission strings correctly', () => {
      const readPermission: Permission = 'read:dashboard';
      const writePermission: Permission = 'write:users';
      const adminPermission: Permission = 'admin:system';

      expect(readPermission).toBe('read:dashboard');
      expect(writePermission).toBe('write:users');
      expect(adminPermission).toBe('admin:system');
    });

    it('should define role types correctly', () => {
      const userRole: Role = 'user';
      const adminRole: Role = 'admin';
      const superAdminRole: Role = 'super_admin';

      expect(userRole).toBe('user');
      expect(adminRole).toBe('admin');
      expect(superAdminRole).toBe('super_admin');
    });
  });

  describe('LoginCredentials interface', () => {
    it('should define login credential structure', () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true
      };

      expect(credentials.email).toBe('test@example.com');
      expect(credentials.password).toBe('password123');
      expect(credentials.rememberMe).toBe(true);
    });

    it('should allow optional rememberMe field', () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      expect(credentials.rememberMe).toBeUndefined();
    });
  });

  describe('AuthResult interface', () => {
    it('should define successful auth result', () => {
      const successResult: AuthResult = {
        success: true,
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
          permissions: ['read:dashboard'],
          isActive: true,
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        token: 'jwt.token.here',
        refreshToken: 'refresh.token.here',
        expiresAt: new Date(Date.now() + 3600000).toISOString()
      };

      expect(successResult.success).toBe(true);
      expect(successResult.user).toBeDefined();
      expect(successResult.token).toBeDefined();
    });

    it('should define failed auth result', () => {
      const failureResult: AuthResult = {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
          details: { field: 'password' }
        }
      };

      expect(failureResult.success).toBe(false);
      expect(failureResult.error).toBeDefined();
      expect(failureResult.error?.code).toBe('INVALID_CREDENTIALS');
    });
  });
});