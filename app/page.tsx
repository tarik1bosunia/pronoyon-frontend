"use client"

import { useCallback, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import type { RootState } from '@/lib/redux/store';
import { SetupView, AdminDashboardView, ManagerDashboardView } from '@/features/question-bank';
import { useIsAdmin, useIsManager } from '@/lib/rbac/hooks';

const subscribeOnce = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function QuestionBankSetupPage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useAppSelector((state: RootState) => state.auth.user);
  const isAdmin = useIsAdmin();
  const isManager = useIsManager();
  const isMounted = useSyncExternalStore(
    subscribeOnce,
    getClientSnapshot,
    getServerSnapshot
  );

  const handleStart = useCallback(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      router.push('/questions');
    }
  }, [router, isAuthenticated]);

  const userName = user?.first_name 
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.email?.split('@')[0] || 'ব্যবহারকারী';

  // Show admin dashboard for admins
  if (isAuthenticated && isMounted && isAdmin) {
    return <AdminDashboardView isAdmin={true} userName={userName} />;
  }

  // Show manager dashboard for managers
  if (isAuthenticated && isMounted && isManager) {
    return <ManagerDashboardView userName={userName} />;
  }

  return <SetupView onStart={handleStart} isAuthenticated={isAuthenticated && isMounted} />;
}
