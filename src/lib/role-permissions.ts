/**
 * Role-based access control (RBAC) implementation
 * Defines permissions, roles, and permission checking utilities
 */

import type { Permission, Role, RolePermissionMatrix, PermissionContext } from './auth-types';

// Permission constants
export const PERMISSIONS = {
  // Dashboard permissions
  READ_DASHBOARD: 'read:dashboard' as const,
  WRITE_DASHBOARD: 'write:dashboard' as const,
  
  // User management permissions
  READ_USERS: 'read:users' as const,
  WRITE_USERS: 'write:users' as const,
  DELETE_USERS: 'delete:users' as const,
  
  // Media management permissions
  READ_MEDIA: 'read:media' as const,
  WRITE_MEDIA: 'write:media' as const,
  DELETE_MEDIA: 'delete:media' as const,
  
  // System administration
  ADMIN_SYSTEM: 'admin:system' as const,
  
  // Analytics and reporting
  VIEW_ANALYTICS: 'view:analytics' as const,
  
  // Collection management
  MANAGE_COLLECTIONS: 'manage:collections' as const,
} as const;

// Role constants
export const ROLES = {
  USER: 'user' as const,
  ADMIN: 'admin' as const,
  SUPER_ADMIN: 'super_admin' as const,
  CREATOR: 'creator' as const,
  BRAND: 'brand' as const,
} as const;

// Role permission matrix - defines what permissions each role has
export const ROLE_PERMISSIONS: RolePermissionMatrix = {
  user: [
    PERMISSIONS.READ_DASHBOARD,
    PERMISSIONS.READ_MEDIA,
  ],
  admin: [
    PERMISSIONS.READ_DASHBOARD,
    PERMISSIONS.WRITE_DASHBOARD,
    PERMISSIONS.READ_USERS,
    PERMISSIONS.WRITE_USERS,
    PERMISSIONS.READ_MEDIA,
    PERMISSIONS.WRITE_MEDIA,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_COLLECTIONS,
  ],
  super_admin: [
    // Super admin has all permissions
    PERMISSIONS.READ_DASHBOARD,
    PERMISSIONS.WRITE_DASHBOARD,
    PERMISSIONS.READ_USERS,
    PERMISSIONS.WRITE_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.READ_MEDIA,
    PERMISSIONS.WRITE_MEDIA,
    PERMISSIONS.DELETE_MEDIA,
    PERMISSIONS.ADMIN_SYSTEM,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_COLLECTIONS,
  ],
  creator: [
    PERMISSIONS.READ_DASHBOARD,
    PERMISSIONS.WRITE_DASHBOARD,
    PERMISSIONS.READ_MEDIA,
    PERMISSIONS.WRITE_MEDIA,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_COLLECTIONS,
  ],
  brand: [
    PERMISSIONS.READ_DASHBOARD,
    PERMISSIONS.READ_MEDIA,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  userPermissions: Permission[], 
  requiredPermission: Permission,
  context?: PermissionContext
): boolean {
  // Basic permission check
  if (userPermissions.includes(requiredPermission)) {
    return true;
  }
  
  // Context-based permission checks could be added here
  // For example, checking if user owns a resource, or has admin role for system-wide permissions
  if (context?.resource || context?.action) {
    // Future: implement context-aware permission checking
    // For now, fall back to basic permission check
  }
  
  return false;
}

/**
 * Get all permissions for a given role
 */
export function getUserPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if user can access dashboard
 */
export function canAccessDashboard(userPermissions: Permission[]): boolean {
  return hasPermission(userPermissions, PERMISSIONS.READ_DASHBOARD);
}

/**
 * Check if user can manage other users
 */
export function canManageUsers(userPermissions: Permission[]): boolean {
  return hasPermission(userPermissions, PERMISSIONS.WRITE_USERS);
}

/**
 * Check if user can view system health and analytics
 */
export function canViewSystemHealth(userPermissions: Permission[]): boolean {
  return hasPermission(userPermissions, PERMISSIONS.VIEW_ANALYTICS) ||
         hasPermission(userPermissions, PERMISSIONS.ADMIN_SYSTEM);
}

/**
 * Check if user can delete resources
 */
export function canDeleteUsers(userPermissions: Permission[]): boolean {
  return hasPermission(userPermissions, PERMISSIONS.DELETE_USERS);
}

export function canDeleteMedia(userPermissions: Permission[]): boolean {
  return hasPermission(userPermissions, PERMISSIONS.DELETE_MEDIA);
}

/**
 * Check if user has admin privileges
 */
export function isAdmin(userPermissions: Permission[]): boolean {
  return hasPermission(userPermissions, PERMISSIONS.ADMIN_SYSTEM) ||
         hasPermission(userPermissions, PERMISSIONS.WRITE_USERS);
}

/**
 * Check if user has super admin privileges
 */
export function isSuperAdmin(userPermissions: Permission[]): boolean {
  return hasPermission(userPermissions, PERMISSIONS.ADMIN_SYSTEM);
}

/**
 * Validate if a role is valid
 */
export function isValidRole(role: any): role is Role {
  return typeof role === 'string' && Object.values(ROLES).includes(role as Role);
}

/**
 * Validate if a permission is valid
 */
export function isValidPermission(permission: any): permission is Permission {
  return typeof permission === 'string' && 
         Object.values(PERMISSIONS).includes(permission as Permission);
}

/**
 * Check if user has any of the required permissions
 */
export function hasAnyPermission(
  userPermissions: Permission[], 
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.some(permission => 
    hasPermission(userPermissions, permission)
  );
}

/**
 * Check if user has all of the required permissions
 */
export function hasAllPermissions(
  userPermissions: Permission[], 
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.every(permission => 
    hasPermission(userPermissions, permission)
  );
}

/**
 * Get the highest role level (for role hierarchy)
 */
export function getHighestRole(roles: Role[]): Role | null {
  if (roles.includes(ROLES.SUPER_ADMIN)) return ROLES.SUPER_ADMIN;
  if (roles.includes(ROLES.ADMIN)) return ROLES.ADMIN;
  if (roles.includes(ROLES.USER)) return ROLES.USER;
  return null;
}

/**
 * Check if role A has higher privileges than role B
 */
export function roleHasHigherPrivileges(roleA: Role, roleB: Role): boolean {
  const hierarchy: Record<Role, number> = {
    [ROLES.USER]: 1,
    [ROLES.BRAND]: 2,
    [ROLES.CREATOR]: 3,
    [ROLES.ADMIN]: 4,
    [ROLES.SUPER_ADMIN]: 5,
  };
  
  return hierarchy[roleA] > hierarchy[roleB];
}

/**
 * Get effective permissions for a user with multiple roles
 */
export function getEffectivePermissions(roles: Role[]): Permission[] {
  const allPermissions = new Set<Permission>();
  
  roles.forEach(role => {
    const rolePermissions = getUserPermissions(role);
    rolePermissions.forEach(permission => allPermissions.add(permission));
  });
  
  return Array.from(allPermissions);
}

/**
 * Permission groups for easier UI management
 */
export const PERMISSION_GROUPS = {
  dashboard: {
    label: 'Dashboard Access',
    permissions: [PERMISSIONS.READ_DASHBOARD, PERMISSIONS.WRITE_DASHBOARD],
  },
  users: {
    label: 'User Management',
    permissions: [PERMISSIONS.READ_USERS, PERMISSIONS.WRITE_USERS, PERMISSIONS.DELETE_USERS],
  },
  media: {
    label: 'Media Management',
    permissions: [PERMISSIONS.READ_MEDIA, PERMISSIONS.WRITE_MEDIA, PERMISSIONS.DELETE_MEDIA],
  },
  system: {
    label: 'System Administration',
    permissions: [PERMISSIONS.ADMIN_SYSTEM, PERMISSIONS.VIEW_ANALYTICS, PERMISSIONS.MANAGE_COLLECTIONS],
  },
} as const;

/**
 * Get permissions by group
 */
export function getPermissionsByGroup(groupName: keyof typeof PERMISSION_GROUPS): Permission[] {
  return [...(PERMISSION_GROUPS[groupName]?.permissions || [])];
}

/**
 * Check if user has permissions for entire group
 */
export function hasPermissionGroup(
  userPermissions: Permission[], 
  groupName: keyof typeof PERMISSION_GROUPS
): boolean {
  const groupPermissions = getPermissionsByGroup(groupName);
  return hasAllPermissions(userPermissions, groupPermissions);
}

/**
 * Default role assignment for new users
 */
export const DEFAULT_USER_ROLE: Role = ROLES.USER;

/**
 * Minimum permissions required for basic app access
 */
export const MINIMUM_PERMISSIONS: Permission[] = [PERMISSIONS.READ_DASHBOARD];