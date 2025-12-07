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
import { MultiSelectModal } from '@/features/question-bank/components/MultiSelectModal';
import { useGetQuestionsQuery } from '@/lib/redux/services/questionsApi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Maximize2, BookOpen } from 'lucide-react';

// Sample data for multiselect - you can replace with actual data from backend
const SUBJECTS_LIST = [
  'পদার্থবিজ্ঞান',
  'রসায়ন',
  'গণিত',
  'জীববিজ্ঞান',
  'বাংলা',
  'ইংরেজি',
  'আইসিটি'
];

const CHAPTERS_LIST = [
  'অধ্যায় ১',
  'অধ্যায় ২',
  'অধ্যায় ৩',
  'অধ্যায় ৪',
  'অধ্যায় ৫',
  'অধ্যায় ৬'
];

function QuestionsPageContent() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
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

  const showChapterField = selectedSubjects.length <= 1;

  // Fetch questions from backend
  const { data: questionsData, isLoading, error } = useGetQuestionsQuery({
    page,
    page_size: 50,
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
    // Use API data directly - backend data is already in the correct format
    const questions = questionsData?.results || [];
    
    return questions.filter((q: any) => {
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

      if (filters.schools.length > 0 && q.school && !filters.schools.includes(q.school)) {
        return false;
      }

      if (filters.schoolYears.length > 0 && q.schoolYear && !filters.schoolYears.includes(q.schoolYear)) {
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
  }, [questionsData, filters]);

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

  // If setup form not completed, show setup view
  if (!showQuestions) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex flex-col items-center font-sans">
        {/* Header */}
        <header className="w-full bg-white border-b border-gray-200 shadow-sm" suppressHydrationWarning>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-[#009d6e]" />
              <h2 className="text-2xl font-bold text-gray-900">Pronoyon</h2>
            </div>
            <UserMenu />
          </div>
        </header>

        {/* Hero Section */}
        <div className="w-full bg-linear-to-br from-[#082f49] via-[#0c4a6e] to-[#075985] text-white pt-20 pb-32 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              প্রশ্নপত্র তৈরি করুন
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-blue-400">
                সহজ ও দ্রুত
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              আপনার প্রয়োজন অনুযায়ী প্রশ্ন সিলেক্ট করুন এবং প্রশ্নপত্র তৈরি করুন
            </p>
          </div>
        </div>

        {/* Question Setup Card */}
        <div className="w-full max-w-2xl px-4 -mt-24 z-10 pb-20">
          <Card className="bg-white p-8 shadow-2xl border-0 rounded-2xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">প্রশ্নপত্র তৈরি শুরু করুন</h3>
              <p className="text-gray-600">নিচের ইনপুট ফিল্ড গুলো সিলেক্ট করে সাবমিট করুন</p>
              <div className="flex items-center justify-center gap-2 mt-3 text-sm">
                <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">সর্বশেষ আপডেট: সম্প্রতি</span>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <Input 
                placeholder="প্রোগ্রাম/পরীক্ষার নাম লিখুন *" 
                className="h-12 border-gray-300 bg-white text-base focus-visible:ring-[#009d6e] focus-visible:border-[#009d6e]"
              />
              
              <Select>
                <SelectTrigger className="h-12 border-gray-300 bg-white focus:ring-[#009d6e]">
                  <SelectValue placeholder="শ্রেণি" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hsc">এইচএসসি</SelectItem>
                  <SelectItem value="ssc">এসএসসি</SelectItem>
                  <SelectItem value="admission">এডমিশন</SelectItem>
                </SelectContent>
              </Select>

              <div 
                onClick={() => setIsSubjectModalOpen(true)}
                className="h-12 border border-gray-300 rounded-md flex items-center justify-between px-3 cursor-pointer bg-white hover:bg-gray-50 hover:border-[#009d6e] transition-all group"
              >
                {selectedSubjects.length === 0 ? (
                  <span className="text-muted-foreground">বিষয়</span>
                ) : (
                  <span className="text-gray-900 truncate font-medium">
                    {selectedSubjects.join(', ')}
                  </span>
                )}
                <Maximize2 className="h-4 w-4 text-gray-400 group-hover:text-[#009d6e] transition-colors" />
              </div>

              {showChapterField && (
                <div 
                  onClick={() => setIsChapterModalOpen(true)}
                  className="h-12 border border-gray-300 rounded-md flex items-center justify-between px-3 cursor-pointer bg-white hover:bg-gray-50 hover:border-[#009d6e] transition-all group animate-in fade-in slide-in-from-top-2"
                >
                  {selectedChapters.length === 0 ? (
                    <span className="text-muted-foreground">অধ্যায়</span>
                  ) : (
                    <span className="text-gray-900 truncate font-medium">
                      {selectedChapters.join(', ')}
                    </span>
                  )}
                  <Maximize2 className="h-4 w-4 text-gray-400 group-hover:text-[#009d6e] transition-colors" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Select>
                  <SelectTrigger className="h-12 border-gray-300 bg-white">
                    <SelectValue placeholder="টাইপ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcq">MCQ</SelectItem>
                    <SelectItem value="cq">CQ</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input 
                  placeholder="প্রশ্ন সংখ্যা" 
                  defaultValue="100"
                  type="number" 
                  className="h-12 border-gray-300 bg-white" 
                />
              </div>

              <Button 
                className="w-full h-12 bg-[#009d6e] hover:bg-[#008a60] text-lg font-medium mt-4 shadow-lg hover:shadow-xl transition-all"
                onClick={() => setShowQuestions(true)}
              >
                প্রশ্ন তৈরি করুন
              </Button>
            </div>
          </Card>
        </div>

        <MultiSelectModal 
          open={isSubjectModalOpen} 
          onOpenChange={setIsSubjectModalOpen}
          title="বিষয় সিলেক্ট করুন"
          items={SUBJECTS_LIST}
          selectedItems={selectedSubjects}
          onSelectionChange={setSelectedSubjects}
        />

        <MultiSelectModal 
          open={isChapterModalOpen} 
          onOpenChange={setIsChapterModalOpen}
          title="অধ্যায় সিলেক্ট করুন"
          items={CHAPTERS_LIST}
          selectedItems={selectedChapters}
          onSelectionChange={setSelectedChapters}
        />
      </div>
    );
  }

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
