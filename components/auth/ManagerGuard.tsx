'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { useAuth, useIsManager, useIsAdminOrManager, useUser } from '@/lib/rbac/hooks';

interface ManagerGuardProps {
  children: ReactNode;
}

export function ManagerGuard({ children }: ManagerGuardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const isManagerOrAdmin = useIsAdminOrManager();
  const isManager = useIsManager();
  const user = useUser();

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('ManagerGuard - isAuthenticated:', isAuthenticated);
    console.log('ManagerGuard - isManagerOrAdmin:', isManagerOrAdmin);
    console.log('ManagerGuard - isManager:', isManager);
    console.log('ManagerGuard - user:', user);
  }

  useEffect(() => {
    if (isAuthenticated && !isManagerOrAdmin) {
      router.push('/');
    }
  }, [isAuthenticated, isManagerOrAdmin, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Alert className="max-w-lg">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Authenticating…</AlertTitle>
          <AlertDescription>
            Checking your account status. Please hold on for a moment.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isManagerOrAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <Alert variant="destructive" className="max-w-xl">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Manager Access Required</AlertTitle>
          <AlertDescription>
            You do not have permission to view this section. This area is for managers and administrators only.
            <div className="mt-2 text-xs font-mono">
              <p>Debug Info:</p>
              <p>User ID: {user?.id}</p>
              <p>Email: {user?.email}</p>
              <p>Roles: {JSON.stringify(user?.roles)}</p>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
