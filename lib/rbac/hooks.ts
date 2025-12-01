/**
 * RBAC Custom Hooks
 * Hooks for role and permission checking in components
 */

'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import type { User } from '@/types/auth';
import type { Role, Permission } from '@/types/rbac';
import {
  hasRole as checkHasRole,
  hasAnyRole as checkHasAnyRole,
  hasAllRoles as checkHasAllRoles,
  hasPermission as checkHasPermission,
  hasAnyPermission as checkHasAnyPermission,
  hasAllPermissions as checkHasAllPermissions,
  getPrimaryRole as getUserPrimaryRole,
  getActiveRoles as getUserActiveRoles,
  getUserRoleLevel as getRoleLevel,
  hasMinimumRoleLevel as checkMinimumRoleLevel,
  isAdmin as checkIsAdmin,
  isManager as checkIsManager,
  isRegularUser as checkIsRegularUser,
  isAdminOrManager as checkIsAdminOrManager,
  getPermissionsByCategory as filterPermissionsByCategory,
} from './utils';

/**
 * Hook to get current user with RBAC data
 */
export function useUser(): User | null {
  return useAppSelector((state) => state.auth.user);
}

/**
 * Hook to check authentication status
 */
export function useAuth() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useUser();
  
  return {
    isAuthenticated,
    user,
    isLoading: false, // Can be enhanced with loading state
  };
}

/**
 * Hook to check if user has a specific role
 */
export function useRole(roleSlug: string): boolean {
  const user = useUser();
  return checkHasRole(user, roleSlug);
}

/**
 * Hook to check if user has any of the specified roles
 */
export function useAnyRole(roleSlugs: string[]): boolean {
  const user = useUser();
  return checkHasAnyRole(user, roleSlugs);
}

/**
 * Hook to check if user has all of the specified roles
 */
export function useAllRoles(roleSlugs: string[]): boolean {
  const user = useUser();
  return checkHasAllRoles(user, roleSlugs);
}

/**
 * Hook to check if user has a specific permission
 */
export function usePermission(permissionName: string): boolean {
  const user = useUser();
  return checkHasPermission(user, permissionName);
}

/**
 * Hook to check if user has any of the specified permissions
 */
export function useAnyPermission(permissionNames: string[]): boolean {
  const user = useUser();
  return checkHasAnyPermission(user, permissionNames);
}

/**
 * Hook to check if user has all of the specified permissions
 */
export function useAllPermissions(permissionNames: string[]): boolean {
  const user = useUser();
  return checkHasAllPermissions(user, permissionNames);
}

/**
 * Hook to get user's primary role
 */
export function usePrimaryRole(): Role | null {
  const user = useUser();
  return getUserPrimaryRole(user);
}

/**
 * Hook to get all active roles
 */
export function useActiveRoles(): Role[] {
  const user = useUser();
  return getUserActiveRoles(user);
}

/**
 * Hook to get user's role level
 */
export function useRoleLevel(): number {
  const user = useUser();
  return getRoleLevel(user);
}

/**
 * Hook to check if user has minimum role level
 */
export function useMinimumRoleLevel(minimumLevel: number): boolean {
  const user = useUser();
  return checkMinimumRoleLevel(user, minimumLevel);
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin(): boolean {
  const user = useUser();
  return checkIsAdmin(user);
}

/**
 * Hook to check if user is manager
 */
export function useIsManager(): boolean {
  const user = useUser();
  return checkIsManager(user);
}

/**
 * Hook to check if user is regular user
 */
export function useIsUser(): boolean {
  const user = useUser();
  return checkIsRegularUser(user);
}

/**
 * Hook to check if user is admin or manager
 */
export function useIsAdminOrManager(): boolean {
  const user = useUser();
  return checkIsAdminOrManager(user);
}

/**
 * Hook to get permissions by category
 */
export function usePermissionsByCategory(category: string): Permission[] {
  const user = useUser();
  return filterPermissionsByCategory(user, category);
}

/**
 * Comprehensive RBAC hook with all checks
 */
export function useRBAC() {
  const user = useUser();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  return {
    user,
    isAuthenticated,
    
    // Role checks
    hasRole: (roleSlug: string) => checkHasRole(user, roleSlug),
    hasAnyRole: (roleSlugs: string[]) => checkHasAnyRole(user, roleSlugs),
    hasAllRoles: (roleSlugs: string[]) => checkHasAllRoles(user, roleSlugs),
    
    // Permission checks
    hasPermission: (permissionName: string) => checkHasPermission(user, permissionName),
    hasAnyPermission: (permissionNames: string[]) => checkHasAnyPermission(user, permissionNames),
    hasAllPermissions: (permissionNames: string[]) => checkHasAllPermissions(user, permissionNames),
    
    // Role info
    primaryRole: getUserPrimaryRole(user),
    activeRoles: getUserActiveRoles(user),
    roleLevel: getRoleLevel(user),
    hasMinimumRoleLevel: (level: number) => checkMinimumRoleLevel(user, level),
    
    // Convenience checks
    isAdmin: checkIsAdmin(user),
    isManager: checkIsManager(user),
    isUser: checkIsRegularUser(user),
    isAdminOrManager: checkIsAdminOrManager(user),
    
    // Permission utilities
    getPermissionsByCategory: (category: string) => filterPermissionsByCategory(user, category),
  };
}
