/**
 * RBAC Library Exports
 * Central export point for all RBAC utilities
 */

// Hooks
export {
  useUser,
  useAuth,
  useRole,
  useAnyRole,
  useAllRoles,
  usePermission,
  useAnyPermission,
  useAllPermissions,
  usePrimaryRole,
  useActiveRoles,
  useRoleLevel,
  useMinimumRoleLevel,
  useIsAdmin,
  useIsManager,
  useIsUser,
  useIsAdminOrManager,
  usePermissionsByCategory,
  useRBAC,
} from './hooks';

// Utility functions
export {
  hasRole,
  hasAnyRole,
  hasAllRoles,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getPrimaryRole,
  getActiveRoles,
  getUserRoleLevel,
  hasMinimumRoleLevel,
  isRoleExpired,
  isAdmin,
  isManager,
  isRegularUser,
  isAdminOrManager,
  getPermissionsByCategory,
  formatRoleName,
  getRoleBadgeColor,
} from './utils';

// HOCs
export {
  withAuth,
  withRole,
  withPermission,
  withRBAC,
} from './hoc';

// Types
export * from '@/types/rbac';
