/**
 * Authentication and authorization type definitions
 * for the unified auth system
 */

// Permission string literal types
export type Permission =
  | 'read:dashboard'
  | 'write:dashboard'
  | 'read:users'
  | 'write:users'
  | 'delete:users'
  | 'read:media'
  | 'write:media'
  | 'delete:media'
  | 'admin:system'
  | 'view:analytics'
  | 'manage:collections';

// Role string literal types
export type Role = 'user' | 'admin' | 'super_admin' | 'creator' | 'brand';

// Core user interface
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  permissions: Permission[];
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  
  // Optional admin-specific fields
  adminLevel?: 'basic' | 'advanced' | 'super';
  department?: string;
  profile?: {
    avatar?: string;
    bio?: string;
    phone?: string;
  };
}

// Session management
export interface AuthSession {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresAt: string;
  issuedAt: string;
  lastActivity: string;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Authentication result
export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  token?: string;
  refreshToken?: string;
  expiresAt?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Error types
export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

// Role permission matrix type
export interface RolePermissionMatrix {
  [key: string]: Permission[];
  user: Permission[];
  admin: Permission[];
  super_admin: Permission[];
}

// Token payload interface
export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
  permissions: Permission[];
  iat: number;
  exp: number;
  iss?: string;
  aud?: string;
}

// Session storage interface
export interface SessionStorage {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  lastActivity: string | null;
}

// Auth configuration
export interface AuthConfig {
  tokenRefreshThreshold: number; // Time in ms before expiry to refresh
  sessionTimeoutMinutes: number;
  maxConcurrentSessions: number;
  enableRememberMe: boolean;
  enableAutoLogout: boolean;
}

// Permission check context
export interface PermissionContext {
  resource?: string;
  action?: string;
  conditions?: Record<string, any>;
}

// Authentication provider interface
export interface AuthProvider {
  name: string;
  type: 'local' | 'oauth' | 'saml' | 'ldap';
  enabled: boolean;
  config: Record<string, any>;
}

// User registration data
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: Role;
  permissions?: Permission[];
  profile?: {
    avatar?: string;
    bio?: string;
    phone?: string;
  };
}

// Password reset interfaces
export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
  confirmPassword: string;
}

// User profile update interface
export interface UserProfileUpdate {
  name?: string;
  email?: string;
  profile?: {
    avatar?: string;
    bio?: string;
    phone?: string;
  };
}

// Authentication event types
export type AuthEvent = 
  | 'login:success'
  | 'login:failed'
  | 'logout'
  | 'token:refreshed'
  | 'token:expired'
  | 'session:timeout'
  | 'permission:denied'
  | 'role:changed';

// Authentication event data
export interface AuthEventData {
  event: AuthEvent;
  userId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Hook return type for usePayloadAuth
export interface UsePayloadAuthReturn {
  // State
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Permission[];
  roles: Role[];
  lastActivity: Date;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: UserProfileUpdate) => Promise<void>;
  
  // Permission checks
  hasPermission: (permission: Permission, context?: PermissionContext) => boolean;
  hasRole: (role: Role) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  
  // Session management
  updateActivity: () => void;
  getSession: () => AuthSession | null;
  
  // Utilities
  isTokenExpired: () => boolean;
  getTokenExpiryTime: () => Date | null;
}