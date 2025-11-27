"use client"

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SetupView } from '@/features/question-bank';

export default function QuestionBankSetupPage() {
  const router = useRouter();

  const handleStart = useCallback(() => {
    router.push('/questions');
  }, [router]);

  return <SetupView onStart={handleStart} />;
}
