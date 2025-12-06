"use client"

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserMenu } from '@/components/auth/UserMenu';
import {
  DashboardSidebar,
  DashboardHeader,
  QuestionBrowseView,
  FilterSidebar,
  type FilterState
} from '@/features/question-bank';
import { useGetQuestionsQuery, useGetClassesQuery, useGetSubjectsQuery } from '@/lib/redux/services/questionsApi';

function QuestionsPageContent() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    boards: [],
    years: [],
    schools: [],
    schoolYears: [],
    subjects: [],
    chapters: [],
    topics: [],
    specialFilters: []
  });

  // Fetch questions from backend
  const { data: questionsData, isLoading, error } = useGetQuestionsQuery({
    page,
    page_size: 20,
    type: filters.types.length > 0 ? filters.types[0].toLowerCase() : undefined,
    subject_id: filters.subjects.length > 0 ? filters.subjects[0] : undefined,
  });

  // Fetch classes and subjects for filters
  const { data: classes } = useGetClassesQuery();
  const { data: subjects } = useGetSubjectsQuery({});

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Transform backend data to match the expected format
  const transformedQuestions = useMemo(() => {
    if (!questionsData?.results) return [];
    
    return questionsData.results.map((q) => ({
      id: q.id,
      type: q.type as 'mcq' | 'cq',
      question: q.question_text,
      text: q.question_text,
      questionHtml: q.question_text_html,
      board: q.subject?.class_level?.name || '',
      year: '',
      school: '',
      schoolYear: '',
      subject: q.subject?.name || '',
      chapter: q.topics?.[0]?.chapter?.name || '',
      topic: q.topics?.[0]?.name || '',
      marks: parseFloat(q.marks),
      difficulty: q.difficulty,
      specialTags: q.tags || [],
      options: q.mcq_options?.map(opt => ({
        id: opt.id,
        label: opt.option_label,
        text: opt.option_text,
        isCorrect: opt.is_correct
      })) || [],
      subQuestions: q.cq_sub_questions?.map(sq => ({
        id: sq.id,
        label: sq.label,
        question: sq.sub_question_text,
        text: sq.sub_question_text,
        marks: parseFloat(sq.marks),
        answer: sq.answer
      })) || []
    }));
  }, [questionsData]);

  const filteredQuestions = useMemo(() => {
    return transformedQuestions.filter((q) => {
      if (filters.types.length > 0 && !filters.types.includes(q.type)) {
        return false;
      }

      if (filters.subjects.length > 0 && q.subject && !filters.subjects.includes(q.subject)) {
        return false;
      }

      if (filters.chapters.length > 0 && q.chapter && !filters.chapters.includes(q.chapter)) {
        return false;
      }

      if (filters.topics.length > 0 && q.topic && !filters.topics.includes(q.topic)) {
        return false;
      }

      if (filters.specialFilters.length > 0) {
        const questionTags = q.specialTags ?? [];
        if (!questionTags.some((tag: string) => filters.specialFilters.includes(tag))) {
          return false;
        }
      }

      return true;
    });
  }, [transformedQuestions, filters]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]));
  };

  const handleSubmitQuestions = () => {
    if (selectedIds.length === 0) {
      alert('অনুগ্রহ করে অন্তত একটি প্রশ্ন সিলেক্ট করুন');
      return;
    }

    const params = new URLSearchParams();
    params.set('ids', selectedIds.join(','));
    router.push(`/editor?${params.toString()}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans" suppressHydrationWarning>
      <DashboardSidebar isSidebarOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-gray-600">প্রশ্ন লোড হচ্ছে...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center text-red-600">
                <p>প্রশ্ন লোড করতে সমস্যা হয়েছে</p>
                <p className="text-sm mt-2">দয়া করে পরে আবার চেষ্টা করুন</p>
              </div>
            </div>
          ) : (
            <QuestionBrowseView
              questions={filteredQuestions}
              selectedIds={selectedIds}
              onToggleSelection={toggleSelection}
              onSubmit={handleSubmitQuestions}
              onOpenFilters={() => setFilterOpen(true)}
              activeSpecialFilters={filters.specialFilters}
              onToggleSpecialFilter={(value: string) =>
                setFilters((prev) => {
                  const exists = prev.specialFilters.includes(value);
                  return {
                    ...prev,
                    specialFilters: exists
                      ? prev.specialFilters.filter((tag) => tag !== value)
                      : [...prev.specialFilters, value]
                  };
                })
              }
            />
          )}

          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setFilterOpen(false)}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      </div>
    </div>
  );
}

export default function QuestionsBrowsePage() {
  return (
    <ProtectedRoute>
      <QuestionsPageContent />
    </ProtectedRoute>
  );
}
