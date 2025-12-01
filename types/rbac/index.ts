/**
 * RBAC Type Definitions
 * Matches backend RBAC system structure
 */

// Role levels from backend
export const ROLE_LEVELS = {
  ADMIN: 70,
  MANAGER: 60,
  USER: 10,
} as const;

// Role types
export type RoleType = 'admin' | 'manager' | 'user';

// Permission structure
export interface Permission {
  id: number;
  name: string; // e.g., 'user.create', 'question.view'
  codename: string;
  category: string;
  description?: string;
  is_active: boolean;
}

// Role structure
export interface Role {
  id: number;
  name: string;
  slug: string;
  level: number;
  role_type: string;
  description?: string;
  permissions: Permission[];
  is_active: boolean;
}

// User role assignment
export interface UserRole {
  id: number;
  role: Role;
  is_primary: boolean;
  is_active: boolean;
  expires_at?: string | null;
  assigned_at: string;
  context?: Record<string, any>;
}

// Extended user with RBAC data
export interface UserWithRBAC {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  roles: UserRole[];
  permissions: Permission[];
  primary_role?: Role;
}

// RBAC check results
export interface RBACCheckResult {
  allowed: boolean;
  reason?: string;
}

// Permission category types
export type PermissionCategory = 
  | 'user'
  | 'question'
  | 'subject'
  | 'topic'
  | 'draft'
  | 'payment'
  | 'wallet'
  | 'system'
  | 'pdf'
  | 'questionset'
  | 'questionbank';
