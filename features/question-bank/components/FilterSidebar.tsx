import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Filter, RotateCcw, ChevronDown, Maximize2, ChevronRight } from 'lucide-react';
import { BOARDS_LIST, SUBJECTS_WITH_CHAPTERS, SPECIAL_FILTERS } from '../constants';
import { useState } from 'react';
import { YearSelectModal } from './YearSelectModal';
import { BoardSelectModal } from './BoardSelectModal';
import type { FilterState } from '../types';

const QUESTION_TYPES = [
  { value: 'mcq', label: 'MCQ' },
  { value: 'cq', label: 'সৃজনশীল' },
  { value: 'writing', label: 'লিখিত' }
];

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function FilterSidebar({ isOpen, onClose, filters, onFiltersChange }: Props) {
  const [expandedSections, setExpandedSections] = useState({
    special: true,
    type: true,
    board: true,
    subject: true
  });
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleSubject = (subject: string) => {
    setExpandedSubjects(prev => ({ ...prev, [subject]: !prev[subject] }));
  };

  const toggleChapter = (chapter: string) => {
    setExpandedChapters(prev => ({ ...prev, [chapter]: !prev[chapter] }));
  };

  const handleToggleType = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    onFiltersChange({ ...filters, types: newTypes });
  };

  const handleToggleBoard = (board: string) => {
    const newBoards = filters.boards.includes(board)
      ? filters.boards.filter(b => b !== board)
      : [...filters.boards, board];
    onFiltersChange({ ...filters, boards: newBoards });
  };

  const handleToggleSubject = (subject: string) => {
    const newSubjects = filters.subjects.includes(subject)
      ? filters.subjects.filter(s => s !== subject)
      : [...filters.subjects, subject];
    onFiltersChange({ ...filters, subjects: newSubjects });
  };

  const handleToggleTopic = (topic: string) => {
    const newTopics = filters.topics.includes(topic)
      ? filters.topics.filter(t => t !== topic)
      : [...filters.topics, topic];
    onFiltersChange({ ...filters, topics: newTopics });
  };

  const handleToggleChapter = (chapter: string) => {
    const newChapters = filters.chapters.includes(chapter)
      ? filters.chapters.filter(c => c !== chapter)
      : [...filters.chapters, chapter];
    onFiltersChange({ ...filters, chapters: newChapters });
  };

  const handleToggleSpecialFilter = (value: string) => {
    const newSpecialFilters = filters.specialFilters.includes(value)
      ? filters.specialFilters.filter(tag => tag !== value)
      : [...filters.specialFilters, value];
    onFiltersChange({ ...filters, specialFilters: newSpecialFilters });
  };

  const handleYearsChange = (years: string[]) => {
    onFiltersChange({ ...filters, years });
  };

  const handleBoardsChange = (boards: string[]) => {
    onFiltersChange({ ...filters, boards });
  };

  const handleReset = () => {
    onFiltersChange({
      types: [],
      boards: [],
      years: [],
      subjects: [],
      chapters: [],
      topics: [],
      specialFilters: []
    });
  };

  const FilterContent = () => (
    <>
      {/* Header */}
      <div className="p-6 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Filter className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">ফিল্টার</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
            className="text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            রিসেট
          </Button>
        </div>
      </div>

      {/* Filters Content */}
      <div className="pb-6">
        {/* Special Filters */}
        <div className="border-b">
          <button
            onClick={() => toggleSection('special')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-800 text-sm">বিশেষ ফিল্টার</span>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expandedSections.special ? 'rotate-180' : ''}`} />
          </button>
          {expandedSections.special && (
            <div className="px-6 pb-4 flex flex-wrap gap-2">
              {SPECIAL_FILTERS.map((filter) => {
                const isActive = filters.specialFilters.includes(filter.value);
                return (
                  <button
                    key={filter.value}
                    onClick={() => handleToggleSpecialFilter(filter.value)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Question Type Filter */}
        <div className="border-b">
          <button
            onClick={() => toggleSection('type')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-800 text-sm">প্রশ্নের ধরন</span>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expandedSections.type ? 'rotate-180' : ''}`} />
          </button>
          {expandedSections.type && (
            <div className="px-6 pb-4 space-y-3">
              {QUESTION_TYPES.map(type => (
                <div key={type.value} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id={`type-${type.value}`} 
                      checked={filters.types.includes(type.value)}
                      onCheckedChange={() => handleToggleType(type.value)}
                      className="border-gray-300" 
                    /> 
                    <label 
                      htmlFor={`type-${type.value}`} 
                      className="text-sm text-gray-700 cursor-pointer group-hover:text-gray-900"
                    >
                      {type.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Board Filter */}
        <div className="border-b">
          <button
            onClick={() => toggleSection('board')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-800 text-sm">বোর্ড</span>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expandedSections.board ? 'rotate-180' : ''}`} />
          </button>
          {expandedSections.board && (
            <div className="px-6 pb-4 space-y-3">
              {/* Year Selection */}
              <div className="pb-3 border-b border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setIsYearModalOpen(true)}
                  className="w-full justify-between"
                >
                  <span className="text-sm">
                    {filters.years.length > 0 
                      ? `${filters.years.length} টি বছর নির্বাচিত` 
                      : 'বছর নির্বাচন করুন'}
                  </span>
                  <Maximize2 className="h-4 w-4" />
                </Button>
                {filters.years.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {filters.years.map(year => (
                      <span key={year} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {year}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Board Selection */}
              <div>
                <Button
                  variant="outline"
                  onClick={() => setIsBoardModalOpen(true)}
                  className="w-full justify-between"
                >
                  <span className="text-sm">
                    {filters.boards.length > 0 
                      ? `${filters.boards.length} টি বোর্ড নির্বাচিত` 
                      : 'বোর্ড নির্বাচন করুন'}
                  </span>
                  <Maximize2 className="h-4 w-4" />
                </Button>
                {filters.boards.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {filters.boards.map(board => (
                      <span key={board} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {board}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Subject, Chapter & Topic Filter */}
        <div className="border-b">
          <button
            onClick={() => toggleSection('subject')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-800 text-sm">বিষয়</span>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expandedSections.subject ? 'rotate-180' : ''}`} />
          </button>
          {expandedSections.subject && (
            <div className="pb-4 max-h-[500px] overflow-y-auto">
              {SUBJECTS_WITH_CHAPTERS.map((item) => (
                <div key={item.subject} className="border-b last:border-b-0">
                  {/* Subject Header */}
                  <div className="px-6 py-3">
                    <div className="flex items-center gap-3 group">
                      <Checkbox 
                        id={`subject-${item.subject}`} 
                        checked={filters.subjects.includes(item.subject)}
                        onCheckedChange={() => handleToggleSubject(item.subject)}
                        className="border-gray-300" 
                      /> 
                      <label 
                        htmlFor={`subject-${item.subject}`} 
                        className="text-sm font-medium text-gray-800 cursor-pointer group-hover:text-gray-900 flex-1"
                      >
                        {item.subject}
                      </label>
                      <button
                        onClick={() => toggleSubject(item.subject)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronRight 
                          className={`h-4 w-4 text-gray-500 transition-transform ${
                            expandedSubjects[item.subject] ? 'rotate-90' : ''
                          }`} 
                        />
                      </button>
                    </div>
                  </div>

                  {/* Chapters under Subject */}
                  {expandedSubjects[item.subject] && (
                    <div className="bg-gray-50/50">
                      {item.chapters.map((chapterItem) => (
                        <div key={chapterItem.chapter} className="border-t">
                          {/* Chapter Header */}
                          <div className="px-6 py-2 pl-10">
                            <div className="flex items-center gap-3 group">
                              <Checkbox 
                                id={`chapter-${chapterItem.chapter}`} 
                                checked={filters.chapters.includes(chapterItem.chapter)}
                                onCheckedChange={() => handleToggleChapter(chapterItem.chapter)}
                                className="border-gray-300" 
                              /> 
                              <label 
                                htmlFor={`chapter-${chapterItem.chapter}`} 
                                className="text-sm font-medium text-gray-700 cursor-pointer group-hover:text-gray-900 flex-1"
                              >
                                {chapterItem.chapter}
                              </label>
                              <button
                                onClick={() => toggleChapter(chapterItem.chapter)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <ChevronRight 
                                  className={`h-4 w-4 text-gray-500 transition-transform ${
                                    expandedChapters[chapterItem.chapter] ? 'rotate-90' : ''
                                  }`} 
                                />
                              </button>
                            </div>
                          </div>

                          {/* Topics under Chapter */}
                          {expandedChapters[chapterItem.chapter] && (
                            <div className="pb-3 bg-gray-100/50">
                              {chapterItem.topics.map((topic) => (
                                <div key={topic} className="flex items-center gap-3 group pl-16 py-1">
                                  <Checkbox 
                                    id={`topic-${topic}`} 
                                    checked={filters.topics.includes(topic)}
                                    onCheckedChange={() => handleToggleTopic(topic)}
                                    className="border-gray-300" 
                                  /> 
                                  <label 
                                    htmlFor={`topic-${topic}`} 
                                    className="text-sm text-gray-600 cursor-pointer group-hover:text-gray-900 leading-snug"
                                  >
                                    {topic}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      <YearSelectModal
        isOpen={isYearModalOpen}
        onClose={() => setIsYearModalOpen(false)}
        selectedYears={filters.years}
        onYearsChange={handleYearsChange}
      />
      <BoardSelectModal
        isOpen={isBoardModalOpen}
        onClose={() => setIsBoardModalOpen(false)}
        selectedBoards={filters.boards}
        onBoardsChange={handleBoardsChange}
      />
      
      {/* Desktop Sidebar - Always visible on xl screens */}
      <aside className="w-80 bg-white border-l overflow-y-auto hidden xl:block">
        <FilterContent />
      </aside>

      {/* Mobile/Tablet Sheet - Controlled by parent */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-[85vw] sm:w-96 p-0 overflow-y-auto">
          <SheetHeader className="sr-only">
            <SheetTitle>ফিল্টার</SheetTitle>
          </SheetHeader>
          <FilterContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
