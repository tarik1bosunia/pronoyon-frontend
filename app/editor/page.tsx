"use client"

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PaperEditor } from '@/components/editor/PaperEditor';
import { mockQuestions } from '@/features/question-bank';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  FileText,
  ListChecks,
  Settings as SettingsIcon,
  Share2,
  Trophy
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const FALLBACK_COUNT = 5;

type NonQuestionSection = 'grade' | 'settings' | 'leaderboard' | 'share';
type ExamSection = 'questions' | NonQuestionSection;

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<ExamSection>('questions');

  const idsParam = searchParams.get('ids') ?? '';

  const selectedIds = useMemo(() => {
    return idsParam
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);
  }, [idsParam]);

  const initialQuestions = useMemo(() => {
    if (!mockQuestions.length) {
      return [];
    }

    const filtered = mockQuestions.filter((q) => selectedIds.includes(q.id));
    if (filtered.length > 0) {
      return filtered;
    }

    return mockQuestions.slice(0, Math.min(FALLBACK_COUNT, mockQuestions.length));
  }, [selectedIds]);

  const handleBackToBrowse = () => {
    router.push('/');
  };

  if (!initialQuestions.length) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white text-center">
        <p className="text-xl font-semibold text-gray-800">No questions available.</p>
        <button
          type="button"
          onClick={handleBackToBrowse}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-500"
        >
          Back to Browse
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#edf2f9]">
      <ExamSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onBackToList={handleBackToBrowse}
      />

      <div className="flex-1 overflow-hidden">
        <div className={cn('h-full', activeSection === 'questions' ? 'block' : 'hidden')}>
          <PaperEditor initialQuestions={initialQuestions} onBack={handleBackToBrowse} />
        </div>

        {activeSection !== 'questions' && (
          <SectionPlaceholder section={activeSection as NonQuestionSection} />
        )}
      </div>
    </div>
  );
}

interface ExamSidebarProps {
  activeSection: ExamSection;
  onSectionChange: (section: ExamSection) => void;
  onBackToList: () => void;
}

const sidebarNavItems: Array<{ id: ExamSection; label: string; icon: LucideIcon }> = [
  { id: 'questions', label: 'Questions', icon: FileText },
  { id: 'grade', label: 'Grade', icon: ListChecks },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'share', label: 'Share Exam Link', icon: Share2 }
];

const ExamSidebar = ({ activeSection, onSectionChange, onBackToList }: ExamSidebarProps) => {
  return (
    <aside className="hidden lg:flex w-72 flex-col bg-white border-r shadow-sm">
      <div className="px-6 pt-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 font-semibold flex items-center justify-center">
            PB
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Porikkhok Builder</p>
            <p className="text-xs text-gray-500">Manage your exam flow</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-b space-y-3">
        <button
          type="button"
          onClick={onBackToList}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          <ChevronLeft className="h-4 w-4" />
          All Exams
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 shadow-sm">
          <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900">English</p>
            <div className="flex items-center gap-2 text-[11px] font-medium">
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-600">Ongoing</span>
              <span className="rounded-full bg-gray-200 px-2 py-0.5 text-gray-600">Private</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <p className="px-6 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Exam Sections
        </p>
        <div className="space-y-1 px-3">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="px-6 py-4 border-t text-xs text-gray-400">
        Need help? <span className="text-blue-600">Contact support</span>
      </div>
    </aside>
  );
};

const sectionCopy: Record<NonQuestionSection, { title: string; description: string }> = {
  grade: {
    title: 'Grade Analytics Coming Soon',
    description: 'Track marks, insights, and student progress once grading tools are ready.'
  },
  settings: {
    title: 'Exam Settings Panel',
    description: 'Configure timing, availability, and visibility for the exam from this panel soon.'
  },
  leaderboard: {
    title: 'Leaderboard Preview',
    description: 'Rankings, trends, and live updates will appear here after launch.'
  },
  share: {
    title: 'Share Exam Link',
    description: 'Generate invite links and QR codes for students—feature arriving shortly.'
  }
};

const SectionPlaceholder = ({ section }: { section: NonQuestionSection }) => {
  const copy = sectionCopy[section];
  return (
    <div className="flex h-full flex-col items-center justify-center bg-white">
      <div className="max-w-md space-y-3 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">{copy.title}</h2>
        <p className="text-sm text-gray-500">{copy.description}</p>
      </div>
    </div>
  );
};
