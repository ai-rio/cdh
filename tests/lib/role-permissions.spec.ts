import { describe, it, expect } from 'vitest';
import { 
  PERMISSIONS,
  ROLES,
  ROLE_PERMISSIONS,
  hasPermission,
  getUserPermissions,
  canAccessDashboard,
  canManageUsers,
  canViewSystemHealth,
  isValidRole,
  isValidPermission
} from '@/lib/role-permissions';
import type { Role, Permission } from '@/lib/auth-types';

describe('Role Permissions', () => {
  describe('Permission constants', () => {
    it('should define all required permissions', () => {
      expect(PERMISSIONS.READ_DASHBOARD).toBe('read:dashboard');
      expect(PERMISSIONS.WRITE_DASHBOARD).toBe('write:dashboard');
      expect(PERMISSIONS.READ_USERS).toBe('read:users');
      expect(PERMISSIONS.WRITE_USERS).toBe('write:users');
      expect(PERMISSIONS.DELETE_USERS).toBe('delete:users');
      expect(PERMISSIONS.READ_MEDIA).toBe('read:media');
      expect(PERMISSIONS.WRITE_MEDIA).toBe('write:media');
      expect(PERMISSIONS.DELETE_MEDIA).toBe('delete:media');
      expect(PERMISSIONS.ADMIN_SYSTEM).toBe('admin:system');
      expect(PERMISSIONS.VIEW_ANALYTICS).toBe('view:analytics');
      expect(PERMISSIONS.MANAGE_COLLECTIONS).toBe('manage:collections');
    });
  });

  describe('Role constants', () => {
    it('should define all required roles', () => {
      expect(ROLES.USER).toBe('user');
      expect(ROLES.ADMIN).toBe('admin');
      expect(ROLES.SUPER_ADMIN).toBe('super_admin');
    });
  });

  describe('Role Permission Matrix', () => {
    it('should define correct permissions for user role', () => {
      const userPermissions = ROLE_PERMISSIONS.user;
      expect(userPermissions).toContain('read:dashboard');
      expect(userPermissions).toContain('read:media');
      expect(userPermissions).not.toContain('write:users');
      expect(userPermissions).not.toContain('admin:system');
    });

    it('should define correct permissions for admin role', () => {
      const adminPermissions = ROLE_PERMISSIONS.admin;
      expect(adminPermissions).toContain('read:dashboard');
      expect(adminPermissions).toContain('write:dashboard');
      expect(adminPermissions).toContain('read:users');
      expect(adminPermissions).toContain('write:users');
      expect(adminPermissions).toContain('view:analytics');
      expect(adminPermissions).not.toContain('admin:system');
    });

    it('should define correct permissions for super_admin role', () => {
      const superAdminPermissions = ROLE_PERMISSIONS.super_admin;
      expect(superAdminPermissions).toContain('admin:system');
      expect(superAdminPermissions).toContain('delete:users');
      expect(superAdminPermissions).toContain('manage:collections');
      // Super admin should have all permissions
      Object.values(PERMISSIONS).forEach(permission => {
        expect(superAdminPermissions).toContain(permission);
      });
    });
  });

  describe('hasPermission function', () => {
    it('should return true when user has the required permission', () => {
      const userPermissions: Permission[] = ['read:dashboard', 'read:media'];
      expect(hasPermission(userPermissions, 'read:dashboard')).toBe(true);
      expect(hasPermission(userPermissions, 'read:media')).toBe(true);
    });

    it('should return false when user lacks the required permission', () => {
      const userPermissions: Permission[] = ['read:dashboard'];
      expect(hasPermission(userPermissions, 'write:users')).toBe(false);
      expect(hasPermission(userPermissions, 'admin:system')).toBe(false);
    });

    it('should handle empty permissions array', () => {
      expect(hasPermission([], 'read:dashboard')).toBe(false);
    });
  });

  describe('getUserPermissions function', () => {
    it('should return correct permissions for user role', () => {
      const permissions = getUserPermissions('user');
      expect(permissions).toEqual(ROLE_PERMISSIONS.user);
    });

    it('should return correct permissions for admin role', () => {
      const permissions = getUserPermissions('admin');
      expect(permissions).toEqual(ROLE_PERMISSIONS.admin);
    });

    it('should return correct permissions for super_admin role', () => {
      const permissions = getUserPermissions('super_admin');
      expect(permissions).toEqual(ROLE_PERMISSIONS.super_admin);
    });

    it('should return empty array for invalid role', () => {
      const permissions = getUserPermissions('invalid_role' as Role);
      expect(permissions).toEqual([]);
    });
  });

  describe('Permission helper functions', () => {
    describe('canAccessDashboard', () => {
      it('should return true for users with dashboard read permission', () => {
        expect(canAccessDashboard(['read:dashboard'])).toBe(true);
      });

      it('should return false for users without dashboard permission', () => {
        expect(canAccessDashboard(['read:media'])).toBe(false);
        expect(canAccessDashboard([])).toBe(false);
      });
    });

    describe('canManageUsers', () => {
      it('should return true for users with user write permission', () => {
        expect(canManageUsers(['write:users'])).toBe(true);
      });

      it('should return false for users without user management permission', () => {
        expect(canManageUsers(['read:users'])).toBe(false);
        expect(canManageUsers(['read:dashboard'])).toBe(false);
      });
    });

    describe('canViewSystemHealth', () => {
      it('should return true for users with analytics or admin permissions', () => {
        expect(canViewSystemHealth(['view:analytics'])).toBe(true);
        expect(canViewSystemHealth(['admin:system'])).toBe(true);
      });

      it('should return false for users without required permissions', () => {
        expect(canViewSystemHealth(['read:dashboard'])).toBe(false);
        expect(canViewSystemHealth(['write:users'])).toBe(false);
      });
    });
  });

  describe('Validation functions', () => {
    describe('isValidRole', () => {
      it('should return true for valid roles', () => {
        expect(isValidRole('user')).toBe(true);
        expect(isValidRole('admin')).toBe(true);
        expect(isValidRole('super_admin')).toBe(true);
      });

      it('should return false for invalid roles', () => {
        expect(isValidRole('invalid_role')).toBe(false);
        expect(isValidRole('')).toBe(false);
        expect(isValidRole(null as any)).toBe(false);
      });
    });

    describe('isValidPermission', () => {
      it('should return true for valid permissions', () => {
        expect(isValidPermission('read:dashboard')).toBe(true);
        expect(isValidPermission('write:users')).toBe(true);
        expect(isValidPermission('admin:system')).toBe(true);
      });

      it('should return false for invalid permissions', () => {
        expect(isValidPermission('invalid:permission')).toBe(false);
        expect(isValidPermission('')).toBe(false);
        expect(isValidPermission(null as any)).toBe(false);
      });
    });
  });

  describe('Role hierarchy', () => {
    it('should ensure super_admin has more permissions than admin', () => {
      const adminPerms = ROLE_PERMISSIONS.admin;
      const superAdminPerms = ROLE_PERMISSIONS.super_admin;
      
      adminPerms.forEach(permission => {
        expect(superAdminPerms).toContain(permission);
      });
      
      expect(superAdminPerms.length).toBeGreaterThan(adminPerms.length);
    });

    it('should ensure admin has more permissions than user', () => {
      const userPerms = ROLE_PERMISSIONS.user;
      const adminPerms = ROLE_PERMISSIONS.admin;
      
      userPerms.forEach(permission => {
        expect(adminPerms).toContain(permission);
      });
      
      expect(adminPerms.length).toBeGreaterThan(userPerms.length);
    });
  });
});