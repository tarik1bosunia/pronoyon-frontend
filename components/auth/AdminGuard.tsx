'use client';

import { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { useAuth, useIsAdmin } from '@/lib/rbac/hooks';

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();

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
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
