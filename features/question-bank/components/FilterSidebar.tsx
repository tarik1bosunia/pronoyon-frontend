import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Filter, RotateCcw, ChevronDown } from 'lucide-react';
import { BOARDS_LIST, SUBJECTS_LIST } from '../constants';
import { useState } from 'react';

const YEARS = ['২০২৩', '২০২২', '২০২১', '২০২০', '২০১৯', '২০১৮'];
const QUESTION_TYPES = [
  { value: 'mcq', label: 'MCQ', count: 45 },
  { value: 'cq', label: 'সৃজনশীল', count: 28 },
  { value: 'writing', label: 'লিখিত', count: 12 }
];

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export function FilterSidebar({ isOpen, onClose }: Props = {}) {
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    board: true,
    year: true,
    subject: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
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
            className="text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            রিসেট
          </Button>
        </div>
      </div>

      {/* Filters Content */}
      <div className="pb-6">
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
                    <Checkbox id={`type-${type.value}`} className="border-gray-300" /> 
                    <label 
                      htmlFor={`type-${type.value}`} 
                      className="text-sm text-gray-700 cursor-pointer group-hover:text-gray-900"
                    >
                      {type.label}
                    </label>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{type.count}</span>
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
              {BOARDS_LIST.map(board => (
                <div key={board} className="flex items-center gap-3 group">
                  <Checkbox id={`board-${board}`} className="border-gray-300" /> 
                  <label 
                    htmlFor={`board-${board}`} 
                    className="text-sm text-gray-700 cursor-pointer group-hover:text-gray-900"
                  >
                    {board} বোর্ড
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Year Filter */}
        <div className="border-b">
          <button
            onClick={() => toggleSection('year')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-800 text-sm">বছর</span>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expandedSections.year ? 'rotate-180' : ''}`} />
          </button>
          {expandedSections.year && (
            <div className="px-6 pb-4 grid grid-cols-2 gap-3">
              {YEARS.map(year => (
                <div key={year} className="flex items-center gap-2 group">
                  <Checkbox id={`year-${year}`} className="border-gray-300" /> 
                  <label 
                    htmlFor={`year-${year}`} 
                    className="text-sm text-gray-700 cursor-pointer group-hover:text-gray-900"
                  >
                    {year}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subject Filter */}
        <div className="border-b">
          <button
            onClick={() => toggleSection('subject')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-800 text-sm">বিষয়</span>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expandedSections.subject ? 'rotate-180' : ''}`} />
          </button>
          {expandedSections.subject && (
            <div className="px-6 pb-4 space-y-3 max-h-80 overflow-y-auto">
              {SUBJECTS_LIST.map(subject => (
                <div key={subject} className="flex items-center gap-3 group">
                  <Checkbox id={`subject-${subject}`} className="border-gray-300" /> 
                  <label 
                    htmlFor={`subject-${subject}`} 
                    className="text-sm text-gray-700 cursor-pointer group-hover:text-gray-900 leading-snug"
                  >
                    {subject}
                  </label>
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
