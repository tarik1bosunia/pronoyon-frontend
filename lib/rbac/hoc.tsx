/**
 * Higher-Order Components for RBAC
 * Wrap components to add role/permission protection
 */

'use client';

import { ComponentType, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { 
  useAuth, 
  useRole, 
  usePermission, 
  useAnyRole, 
  useAnyPermission 
} from '@/lib/rbac/hooks';

interface WithAuthOptions {
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

/**
 * HOC to require authentication
 */
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    redirectTo = '/login',
    loadingComponent,
  } = options;

  return function WithAuthComponent(props: P) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push(redirectTo);
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return loadingComponent ? (
        <>{loadingComponent}</>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}

interface WithRoleOptions {
  role?: string;
  anyRoles?: string[];
  redirectTo?: string;
  fallbackComponent?: ReactNode;
}

/**
 * HOC to require specific role(s)
 */
export function withRole<P extends object>(
  Component: ComponentType<P>,
  options: WithRoleOptions
) {
  const {
    role,
    anyRoles,
    redirectTo = '/403',
    fallbackComponent,
  } = options;

  return function WithRoleComponent(props: P) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const hasSingleRole = useRole(role || '');
    const hasAnyRoleCheck = useAnyRole(anyRoles || []);

    const hasRequiredRole = role ? hasSingleRole : hasAnyRoleCheck;

    useEffect(() => {
      if (!isLoading && isAuthenticated && !hasRequiredRole) {
        router.push(redirectTo);
      }
    }, [isAuthenticated, isLoading, hasRequiredRole, router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!isAuthenticated || !hasRequiredRole) {
      return fallbackComponent ? <>{fallbackComponent}</> : null;
    }

    return <Component {...props} />;
  };
}

interface WithPermissionOptions {
  permission?: string;
  anyPermissions?: string[];
  redirectTo?: string;
  fallbackComponent?: ReactNode;
}

/**
 * HOC to require specific permission(s)
 */
export function withPermission<P extends object>(
  Component: ComponentType<P>,
  options: WithPermissionOptions
) {
  const {
    permission,
    anyPermissions,
    redirectTo = '/403',
    fallbackComponent,
  } = options;

  return function WithPermissionComponent(props: P) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const hasSinglePermission = usePermission(permission || '');
    const hasAnyPermissionCheck = useAnyPermission(anyPermissions || []);

    const hasRequiredPermission = permission ? hasSinglePermission : hasAnyPermissionCheck;

    useEffect(() => {
      if (!isLoading && isAuthenticated && !hasRequiredPermission) {
        router.push(redirectTo);
      }
    }, [isAuthenticated, isLoading, hasRequiredPermission, router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!isAuthenticated || !hasRequiredPermission) {
      return fallbackComponent ? <>{fallbackComponent}</> : null;
    }

    return <Component {...props} />;
  };
}

interface WithRBACOptions {
  role?: string;
  anyRoles?: string[];
  permission?: string;
  anyPermissions?: string[];
  redirectTo?: string;
  fallbackComponent?: ReactNode;
}

/**
 * HOC combining role and permission checks
 */
export function withRBAC<P extends object>(
  Component: ComponentType<P>,
  options: WithRBACOptions
) {
  const {
    role,
    anyRoles,
    permission,
    anyPermissions,
    redirectTo = '/403',
    fallbackComponent,
  } = options;

  return function WithRBACComponent(props: P) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    
    const hasSingleRole = useRole(role || '');
    const hasAnyRoleCheck = useAnyRole(anyRoles || []);
    const hasSinglePermission = usePermission(permission || '');
    const hasAnyPermissionCheck = useAnyPermission(anyPermissions || []);

    const meetsRoleRequirement = role ? hasSingleRole : (anyRoles ? hasAnyRoleCheck : true);
    const meetsPermissionRequirement = permission ? hasSinglePermission : (anyPermissions ? hasAnyPermissionCheck : true);
    
    const hasAccess = meetsRoleRequirement && meetsPermissionRequirement;

    useEffect(() => {
      if (!isLoading && isAuthenticated && !hasAccess) {
        router.push(redirectTo);
      }
    }, [isAuthenticated, isLoading, hasAccess, router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!isAuthenticated || !hasAccess) {
      return fallbackComponent ? <>{fallbackComponent}</> : null;
    }

    return <Component {...props} />;
  };
}
