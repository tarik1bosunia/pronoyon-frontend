"use client"

import { useState, useEffect } from 'react';
import { PaperEditor } from '@/components/editor/PaperEditor';
import { 
  DashboardSidebar, 
  DashboardHeader, 
  SetupView, 
  QuestionBrowseView,
  FilterSidebar,
  mockQuestions,
  type ViewMode
} from '@/features/question-bank';

export default function QuestionBankUI() {
  const [viewMode, setViewMode] = useState<ViewMode>('setup');
  const [selectedIds, setSelectedIds] = useState<string[]>(['1', '2', '3', '4', '5']); 
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isFilterOpen, setFilterOpen] = useState(false);

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

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
  };

  const handleSetupComplete = () => {
    setViewMode('browse');
  };

  const handleSubmitQuestions = () => {
    if (selectedIds.length === 0) {
      alert("অনুগ্রহ করে অন্তত একটি প্রশ্ন সিলেক্ট করুন");
      return;
    }
    setViewMode('editor');
  };

  if (viewMode === 'editor') {
    const selectedQuestions = mockQuestions.filter(q => selectedIds.includes(q.id));
    return (
      <PaperEditor 
        initialQuestions={selectedQuestions} 
        onBack={() => setViewMode('browse')} 
      />
    );
  }

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
            questions={mockQuestions}
            selectedIds={selectedIds}
            onToggleSelection={toggleSelection}
            onSubmit={handleSubmitQuestions}
            onOpenFilters={() => setFilterOpen(true)}
          />
          
          <FilterSidebar isOpen={isFilterOpen} onClose={() => setFilterOpen(false)} />
        </div>
      </div>
    </div>
  );
}
