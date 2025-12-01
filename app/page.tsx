"use client"

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import type { RootState } from '@/lib/redux/store';
import { SetupView } from '@/features/question-bank';

export default function QuestionBankSetupPage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const handleStart = useCallback(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      router.push('/questions');
    }
  }, [router, isAuthenticated]);

  return <SetupView onStart={handleStart} isAuthenticated={isAuthenticated} />;
}
