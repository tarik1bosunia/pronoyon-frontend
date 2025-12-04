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

  // Debug logging for home page role detection
  if (typeof window !== 'undefined' && isAuthenticated && isMounted) {
    console.log('Home Page - isAdmin:', isAdmin);
    console.log('Home Page - isManager:', isManager);
    console.log('Home Page - user:', user);
    console.log('Home Page - user.roles:', user?.roles);
  }

  // Show admin dashboard for admins ONLY (not managers)
  if (isAuthenticated && isMounted && isAdmin && !isManager) {
    console.log('Home Page - Rendering AdminDashboardView (admin only)');
    return <AdminDashboardView isAdmin={true} userName={userName} />;
  }

  // Show manager dashboard for managers (regardless of other roles)
  if (isAuthenticated && isMounted && isManager) {
    console.log('Home Page - Rendering ManagerDashboardView (manager)');
    return <ManagerDashboardView userName={userName} />;
  }

  // Show admin dashboard for users with both admin and manager roles (prioritize admin access)
  if (isAuthenticated && isMounted && isAdmin) {
    console.log('Home Page - Rendering AdminDashboardView (admin with multiple roles)');
    return <AdminDashboardView isAdmin={true} userName={userName} />;
  }

  return <SetupView onStart={handleStart} isAuthenticated={isAuthenticated && isMounted} />;
}
