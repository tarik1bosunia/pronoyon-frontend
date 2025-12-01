'use client';

import { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { useAuth, useIsAdmin, useUser } from '@/lib/rbac/hooks';

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const user = useUser();

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('AdminGuard - isAuthenticated:', isAuthenticated);
    console.log('AdminGuard - isAdmin:', isAdmin);
    console.log('AdminGuard - user:', user);
    console.log('AdminGuard - user.roles:', user?.roles);
  }

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

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <Alert variant="destructive" className="max-w-xl">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Administrator Access Required</AlertTitle>
          <AlertDescription>
            You do not have permission to view this section. Contact an administrator if you believe this is a mistake.
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
