"use client"

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import type { RootState } from '@/lib/redux/store';
import { SetupView } from '@/features/question-bank';

export default function QuestionBankSetupPage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );


  useEffect(() => {
    // Redirect authenticated users directly to questions page
    if (isAuthenticated) {
      router.push('/questions');
    }
  }, [isAuthenticated, router]);

  const handleStart = useCallback(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      router.push('/questions');
    }
  }, [router, isAuthenticated]);

  return <SetupView onStart={handleStart} />;
}
