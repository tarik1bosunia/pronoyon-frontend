/**
 * Role Gate Component
 * Conditionally renders children based on role checks
 */

'use client';

import { ReactNode } from 'react';
import { useRole, useAnyRole, useAllRoles } from '@/lib/rbac/hooks';

interface RoleGateProps {
  children: ReactNode;
  role?: string;
  anyRoles?: string[];
  allRoles?: string[];
  fallback?: ReactNode;
}

export function RoleGate({
  children,
  role,
  anyRoles,
  allRoles,
  fallback = null,
}: RoleGateProps) {
  const hasSingleRole = useRole(role || '');
  const hasAny = useAnyRole(anyRoles || []);
  const hasAll = useAllRoles(allRoles || []);

  // Determine if user has required roles
  let hasAccess = false;

  if (role) {
    hasAccess = hasSingleRole;
  } else if (anyRoles && anyRoles.length > 0) {
    hasAccess = hasAny;
  } else if (allRoles && allRoles.length > 0) {
    hasAccess = hasAll;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
