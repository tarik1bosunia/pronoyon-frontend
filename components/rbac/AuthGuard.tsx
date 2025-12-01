/**
 * Auth Guard Component
 * Protects routes and shows loading/unauthorized states
 */

'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/rbac/hooks';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  loadingFallback?: ReactNode;
  unauthorizedFallback?: ReactNode;
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = '/login',
  loadingFallback,
  unauthorizedFallback,
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

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

  // Show unauthorized state
  if (requireAuth && !isAuthenticated) {
    return unauthorizedFallback ? (
      <>{unauthorizedFallback}</>
    ) : (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
