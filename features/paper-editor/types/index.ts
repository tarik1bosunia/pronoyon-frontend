import { Question } from '@/types/question';
import { ReactNode } from 'react';

export const QUESTION_SET_OPTIONS = [
  { value: 'set-a', label: 'Set A' },
  { value: 'set-b', label: 'Set B' },
  { value: 'set-c', label: 'Set C' }
] as const;

export const MAX_QUESTION_SETS = QUESTION_SET_OPTIONS.length;

export const MCQ_OPTION_LABELS = ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ', 'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত'];

export const PAGE_HEIGHT_PX = 1122; // 297mm at ~96dpi
export const PAGE_PADDING_PX = 56.7; // 15mm padding inside each page

export type QuestionSetValue = (typeof QUESTION_SET_OPTIONS)[number]['value'];
export type QuestionSetOption = (typeof QUESTION_SET_OPTIONS)[number];

export interface PaperEditorProps {
  initialQuestions: Question[];
  onBack: () => void;
  sidebarTop?: ReactNode;
  onOpenMobileSidebar?: () => void;
  mobileSidebarContent?: ReactNode;
  isMobileSidebarOpen?: boolean;
  onCloseMobileSidebar?: () => void;
}

export interface PageBoundary {
  start: number;
  end: number;
}
