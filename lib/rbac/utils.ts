/**
 * RBAC Utility Functions
 * Helper functions for role and permission checking
 */

import type { User } from '@/types/auth';
import type { Role, Permission, UserRole } from '@/types/rbac';

/**
 * Check if user has a specific role by slug
 */
export function hasRole(user: User | null, roleSlug: string): boolean {
  if (!user?.roles || !Array.isArray(user.roles)) return false;
  
  return user.roles.some(
    (userRole: UserRole) => 
      userRole.role.slug === roleSlug && 
      userRole.is_active && 
      !isRoleExpired(userRole)
  );
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: User | null, roleSlugs: string[]): boolean {
  if (!user?.roles || !Array.isArray(user.roles)) return false;
  
  return roleSlugs.some(slug => hasRole(user, slug));
}

/**
 * Check if user has all of the specified roles
 */
export function hasAllRoles(user: User | null, roleSlugs: string[]): boolean {
  if (!user?.roles || !Array.isArray(user.roles)) return false;
  
  return roleSlugs.every(slug => hasRole(user, slug));
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: User | null, permissionName: string): boolean {
  if (!user?.permissions || !Array.isArray(user.permissions)) return false;
  
  return user.permissions.some(
    (permission: Permission) => 
      permission.name === permissionName && 
      permission.is_active
  );
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(user: User | null, permissionNames: string[]): boolean {
  if (!user?.permissions || !Array.isArray(user.permissions)) return false;
  
  return permissionNames.some(name => hasPermission(user, name));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(user: User | null, permissionNames: string[]): boolean {
  if (!user?.permissions || !Array.isArray(user.permissions)) return false;
  
  return permissionNames.every(name => hasPermission(user, name));
}

/**
 * Get user's primary role
 */
export function getPrimaryRole(user: User | null): Role | null {
  if (!user?.roles || !Array.isArray(user.roles)) return null;
  
  const primaryUserRole = user.roles.find(
    (userRole: UserRole) => 
      userRole.is_primary && 
      userRole.is_active && 
      !isRoleExpired(userRole)
  );
  
  return primaryUserRole?.role || null;
}

/**
 * Get all active roles for user
 */
export function getActiveRoles(user: User | null): Role[] {
  if (!user?.roles || !Array.isArray(user.roles)) return [];
  
  return user.roles
    .filter((userRole: UserRole) => 
      userRole.is_active && !isRoleExpired(userRole)
    )
    .map((userRole: UserRole) => userRole.role);
}

/**
 * Get user's role level (highest level from active roles)
 */
export function getUserRoleLevel(user: User | null): number {
  const roles = getActiveRoles(user);
  if (roles.length === 0) return 0;
  
  return Math.max(...roles.map(role => role.level));
}

/**
 * Check if user's role level is at least the specified level
 */
export function hasMinimumRoleLevel(user: User | null, minimumLevel: number): boolean {
  return getUserRoleLevel(user) >= minimumLevel;
}

/**
 * Check if a user role is expired
 */
export function isRoleExpired(userRole: UserRole): boolean {
  if (!userRole.expires_at) return false;
  
  const expiryDate = new Date(userRole.expires_at);
  const now = new Date();
  
  return expiryDate < now;
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, 'admin');
}

/**
 * Check if user is manager
 */
export function isManager(user: User | null): boolean {
  return hasRole(user, 'manager');
}

/**
 * Check if user is regular user
 */
export function isRegularUser(user: User | null): boolean {
  return hasRole(user, 'user');
}

/**
 * Check if user is admin or manager
 */
export function isAdminOrManager(user: User | null): boolean {
  return hasAnyRole(user, ['admin', 'manager']);
}

/**
 * Get permissions by category
 */
export function getPermissionsByCategory(
  user: User | null, 
  category: string
): Permission[] {
  if (!user?.permissions || !Array.isArray(user.permissions)) return [];
  
  return user.permissions.filter(
    (permission: Permission) => 
      permission.category === category && 
      permission.is_active
  );
}

/**
 * Format role display name
 */
export function formatRoleName(role: Role): string {
  return role.name;
}

/**
 * Get role badge color for UI
 */
export function getRoleBadgeColor(roleSlug: string): string {
  const colorMap: Record<string, string> = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    user: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };
  
  return colorMap[roleSlug] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
}
