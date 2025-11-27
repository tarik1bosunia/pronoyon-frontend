"use client"

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PaperEditor } from '@/components/editor/PaperEditor';
import { ExamSettingsPanel } from '@/components/editor/ExamSettingsPanel';
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

type PlaceholderSection = 'grade' | 'leaderboard' | 'share';
type ExamSection = 'questions' | 'settings' | PlaceholderSection;

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<ExamSection>('questions');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
    router.push('/questions');
  };

  const handleSectionChange = (section: ExamSection) => {
    setActiveSection(section);
    setSidebarOpen(false);
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

  if (activeSection === 'questions') {
    return (
      <PaperEditor
        initialQuestions={initialQuestions}
        onBack={handleBackToBrowse}
        sidebarTop={
          <div>
            <div className="flex items-center justify-between px-4 py-3">
              <button
                type="button"
                onClick={() => {
                  setSidebarOpen(false);
                  handleBackToBrowse();
                }}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
              >
                <ChevronLeft className="h-4 w-4" /> All Exams
              </button>
            </div>
            <div className="px-4 pb-4">
              <p className="pb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Exam Sections</p>
              <ExamNav activeSection={activeSection} onSectionChange={handleSectionChange} />
            </div>
          </div>
        }
        onOpenMobileSidebar={() => setSidebarOpen(true)}
        isMobileSidebarOpen={isSidebarOpen}
        onCloseMobileSidebar={() => setSidebarOpen(false)}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#edf2f9]">
      <aside className="hidden lg:flex w-72 flex-col bg-white border-r shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <button
            type="button"
            onClick={handleBackToBrowse}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            <ChevronLeft className="h-4 w-4" /> All Exams
          </button>
        </div>
        <div className="px-4 py-4">
          <p className="pb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Exam Sections</p>
          <ExamNav activeSection={activeSection} onSectionChange={handleSectionChange} />
        </div>
      </aside>
      <div className="flex-1 overflow-hidden">
        {activeSection === 'settings' ? (
          <ExamSettingsPanel onBack={() => setActiveSection('questions')} />
        ) : (
          <SectionPlaceholder section={activeSection as PlaceholderSection} />
        )}
      </div>
    </div>
  );
}
const sidebarNavItems: Array<{ id: ExamSection; label: string; icon: LucideIcon }> = [
  { id: 'questions', label: 'Questions', icon: FileText },
  { id: 'grade', label: 'Grade', icon: ListChecks },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'share', label: 'Share Exam Link', icon: Share2 }
];

interface ExamNavProps {
  activeSection: ExamSection;
  onSectionChange: (section: ExamSection) => void;
}

const ExamNav = ({ activeSection, onSectionChange }: ExamNavProps) => {
  return (
    <div className="space-y-1">
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
  );
};

const sectionCopy: Record<PlaceholderSection, { title: string; description: string }> = {
  grade: {
    title: 'Grade Analytics Coming Soon',
    description: 'Track marks, insights, and student progress once grading tools are ready.'
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

const SectionPlaceholder = ({ section }: { section: PlaceholderSection }) => {
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
