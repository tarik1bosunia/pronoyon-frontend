"use client"

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DashboardSidebar,
  DashboardHeader,
  QuestionBrowseView,
  FilterSidebar,
  mockQuestions,
  type FilterState
} from '@/features/question-bank';

export default function QuestionsBrowsePage() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>(['1', '2', '3', '4', '5']);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    boards: [],
    years: [],
    subjects: [],
    chapters: [],
    topics: [],
    specialFilters: []
  });

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

  const filteredQuestions = useMemo(() => {
    return mockQuestions.filter((q) => {
      if (filters.types.length > 0 && !filters.types.includes(q.type)) {
        return false;
      }

      if (filters.boards.length > 0 && q.board) {
        const questionBoard = q.board.replace(' বোর্ড', '');
        if (!filters.boards.includes(questionBoard)) {
          return false;
        }
      }

      if (filters.years.length > 0 && q.year && !filters.years.includes(q.year)) {
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
  }, [filters]);

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
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <DashboardSidebar isSidebarOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex flex-1 overflow-hidden">
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
