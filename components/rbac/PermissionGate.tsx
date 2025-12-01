/**
 * Permission Gate Component
 * Conditionally renders children based on permission checks
 */

'use client';

import { ReactNode } from 'react';
import { usePermission, useAnyPermission, useAllPermissions } from '@/lib/rbac/hooks';

interface PermissionGateProps {
  children: ReactNode;
  permission?: string;
  anyPermissions?: string[];
  allPermissions?: string[];
  fallback?: ReactNode;
}

export function PermissionGate({
  children,
  permission,
  anyPermissions,
  allPermissions,
  fallback = null,
}: PermissionGateProps) {
  const hasSinglePermission = usePermission(permission || '');
  const hasAny = useAnyPermission(anyPermissions || []);
  const hasAll = useAllPermissions(allPermissions || []);

  // Determine if user has required permissions
  let hasAccess = false;

  if (permission) {
    hasAccess = hasSinglePermission;
  } else if (anyPermissions && anyPermissions.length > 0) {
    hasAccess = hasAny;
  } else if (allPermissions && allPermissions.length > 0) {
    hasAccess = hasAll;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
