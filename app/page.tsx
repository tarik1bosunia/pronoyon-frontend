"use client"

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DashboardSidebar, 
  DashboardHeader, 
  QuestionBrowseView,
  FilterSidebar,
  SetupView,
  mockQuestions,
  type FilterState,
  type ViewMode
} from '@/features/question-bank';

export default function QuestionBankUI() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('setup');
  const [selectedIds, setSelectedIds] = useState<string[]>(['1', '2', '3', '4', '5']); 
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    boards: [],
    years: [],
    subjects: [],
    topics: []
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

  // Filter questions based on active filters
  const filteredQuestions = useMemo(() => {
    return mockQuestions.filter(q => {
      // Type filter
      if (filters.types.length > 0 && !filters.types.includes(q.type)) {
        return false;
      }
      
      // Board filter (remove " বোর্ড" suffix for comparison)
      if (filters.boards.length > 0 && q.board) {
        const questionBoard = q.board.replace(' বোর্ড', '');
        if (!filters.boards.includes(questionBoard)) {
          return false;
        }
      }
      
      // Year filter
      if (filters.years.length > 0 && q.year && !filters.years.includes(q.year)) {
        return false;
      }
      
      // Topic filter
      if (filters.topics.length > 0 && q.topic && !filters.topics.includes(q.topic)) {
        return false;
      }
      
      // Subject filter (you'll need to add subject field to questions in future)
      if (filters.subjects.length > 0 && q.topic && !filters.subjects.some(s => q.topic?.includes(s))) {
        return false;
      }
      
      return true;
    });
  }, [filters]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
  };

  const handleSubmitQuestions = () => {
    if (selectedIds.length === 0) {
      alert("অনুগ্রহ করে অন্তত একটি প্রশ্ন সিলেক্ট করুন");
      return;
    }
    const params = new URLSearchParams();
    params.set('ids', selectedIds.join(','));
    router.push(`/editor?${params.toString()}`);
  };

  const handleSetupComplete = () => {
    setViewMode('browse');
  };

  if (viewMode === 'setup') {
    return <SetupView onStart={handleSetupComplete} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <DashboardSidebar isSidebarOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="flex flex-1 overflow-hidden">
          <QuestionBrowseView
            questions={filteredQuestions}
            selectedIds={selectedIds}
            onToggleSelection={toggleSelection}
            onSubmit={handleSubmitQuestions}
            onOpenFilters={() => setFilterOpen(true)}
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
