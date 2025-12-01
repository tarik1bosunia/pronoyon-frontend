/**
 * RBAC Guard Component
 * Combined guard for authentication, roles, and permissions
 */

'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth, useRole, usePermission, useAnyRole, useAnyPermission } from '@/lib/rbac/hooks';

interface RBACGuardProps {
  children: ReactNode;
  
  // Auth requirements
  requireAuth?: boolean;
  
  // Role requirements (one of these)
  role?: string;
  anyRoles?: string[];
  
  // Permission requirements (one of these)
  permission?: string;
  anyPermissions?: string[];
  
  // Redirect paths
  loginRedirect?: string;
  forbiddenRedirect?: string;
  
  // Fallback components
  loadingFallback?: ReactNode;
  unauthorizedFallback?: ReactNode;
  forbiddenFallback?: ReactNode;
}

export function RBACGuard({
  children,
  requireAuth = true,
  role,
  anyRoles,
  permission,
  anyPermissions,
  loginRedirect = '/login',
  forbiddenRedirect = '/403',
  loadingFallback,
  unauthorizedFallback,
  forbiddenFallback,
}: RBACGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  
  // Role checks
  const hasSingleRole = useRole(role || '');
  const hasAnyRoleCheck = useAnyRole(anyRoles || []);
  
  // Permission checks
  const hasSinglePermission = usePermission(permission || '');
  const hasAnyPermissionCheck = useAnyPermission(anyPermissions || []);

  // Determine if user meets role requirements
  let meetsRoleRequirements = true;
  if (role) {
    meetsRoleRequirements = hasSingleRole;
  } else if (anyRoles && anyRoles.length > 0) {
    meetsRoleRequirements = hasAnyRoleCheck;
  }

  // Determine if user meets permission requirements
  let meetsPermissionRequirements = true;
  if (permission) {
    meetsPermissionRequirements = hasSinglePermission;
  } else if (anyPermissions && anyPermissions.length > 0) {
    meetsPermissionRequirements = hasAnyPermissionCheck;
  }

  const hasAccess = meetsRoleRequirements && meetsPermissionRequirements;

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(loginRedirect);
      } else if (isAuthenticated && !hasAccess) {
        router.push(forbiddenRedirect);
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, hasAccess, loginRedirect, forbiddenRedirect, router]);

  // Show loading state
  if (isLoading) {
    return loadingFallback ? (
      <>{loadingFallback}</>
    ) : (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show unauthorized state (not logged in)
  if (requireAuth && !isAuthenticated) {
    return unauthorizedFallback ? (
      <>{unauthorizedFallback}</>
    ) : (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  // Show forbidden state (logged in but lacks permissions)
  if (isAuthenticated && !hasAccess) {
    return forbiddenFallback ? (
      <>{forbiddenFallback}</>
    ) : (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">403</h1>
        <p className="text-lg text-gray-600">You don&apos;t have permission to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}
