import { Button } from '@/components/ui/button';
import { Question } from '@/types/question';
import { QuestionListItem } from './QuestionListItem';
import { Filter } from 'lucide-react';
import { SPECIAL_FILTERS } from '../constants';

interface Props {
  questions: Question[];
  selectedIds: string[];
  onToggleSelection: (id: string) => void;
  onSubmit: () => void;
  onOpenFilters: () => void;
  activeSpecialFilters: string[];
  onToggleSpecialFilter: (value: string) => void;
}

const SpecialFilterPill = ({
  value,
  label,
  isActive,
  onToggle
}: {
  value: string;
  label: string;
  isActive: boolean;
  onToggle: (value: string) => void;
}) => (
  <button
    onClick={() => onToggle(value)}
    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors whitespace-nowrap ${
      isActive
        ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm'
        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
    }`}
  >
    {label}
  </button>
);

export function QuestionBrowseView({
  questions,
  selectedIds,
  onToggleSelection,
  onSubmit,
  onOpenFilters,
  activeSpecialFilters,
  onToggleSpecialFilter
}: Props) {
  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div className="text-center flex-1">
                <h2 className="text-2xl font-bold text-gray-800">প্রশ্ন সিলেক্ট করুন</h2>
                <p className="text-gray-500 mt-1">প্রশ্নগুলো সিলেক্ট করে সাবমিট করলেই প্রশ্ন তৈরি হয়ে যাবে!</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-wrap gap-2 justify-end">
                  {SPECIAL_FILTERS.map((filter) => (
                    <SpecialFilterPill
                      key={filter.value}
                      value={filter.value}
                      label={filter.label}
                      isActive={activeSpecialFilters.includes(filter.value)}
                      onToggle={onToggleSpecialFilter}
                    />
                  ))}
                </div>

                {/* Filter Button - Only on small/medium screens */}
                <Button
                  onClick={onOpenFilters}
                  variant="outline"
                  size="sm"
                  className="xl:hidden flex items-center gap-2 shrink-0"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">ফিল্টার</span>
                </Button>
              </div>
            </div>

            {/* Mobile Special Filters */}
            <div className="flex md:hidden flex-wrap gap-2 justify-center">
              {SPECIAL_FILTERS.map((filter) => (
                <SpecialFilterPill
                  key={filter.value}
                  value={filter.value}
                  label={filter.label}
                  isActive={activeSpecialFilters.includes(filter.value)}
                  onToggle={onToggleSpecialFilter}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((q, index) => (
              <QuestionListItem
                key={q.id}
                question={q}
                index={index}
                isSelected={selectedIds.includes(q.id)}
                onToggleSelect={onToggleSelection}
              />
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 pb-10">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md border">
              <Button variant="ghost" size="sm" disabled>← পূর্ববর্তী</Button>
              <span className="font-medium px-2">1 / 1</span>
              <Button variant="ghost" size="sm" disabled>পরবর্তী →</Button>
            </div>
            
            <Button 
              size="lg" 
              onClick={onSubmit}
              className="bg-[#009d6e] hover:bg-[#008a60] text-white px-8 h-12 text-lg shadow-lg shadow-green-600/20"
            >
              সাবমিট করুন ({selectedIds.length})
            </Button>
          </div>
        </div>
      </main>
  );
}
