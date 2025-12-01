"use client"

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuestionSetOption } from '../types';

interface PaperHeaderProps {
  paperTitle: string;
  examDuration: string;
  activeSetLabel: string;
  availableSets: QuestionSetOption[];
  activeSet: string;
  onTitleChange: (title: string) => void;
  onDurationChange: (duration: string) => void;
  onSetChange: (set: string) => void;
}

export const PaperHeader = ({
  paperTitle,
  examDuration,
  activeSetLabel,
  availableSets,
  activeSet,
  onTitleChange,
  onDurationChange,
  onSetChange
}: PaperHeaderProps) => {
  return (
    <div
      data-paper-header
      className="text-center border-b-2 border-double border-gray-800 pb-4 mb-8"
    >
      <Input
        value={paperTitle}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-center text-2xl font-bold border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent placeholder:text-gray-300"
        placeholder="পরীক্ষার নাম লিখুন"
      />
      <div className="flex justify-between text-sm font-medium mt-4 px-4">
        <label className="flex items-center gap-2">
          <span>সময়:</span>
          <Input
            value={examDuration}
            onChange={(e) => onDurationChange(e.target.value)}
            className="h-auto w-32 border-none bg-transparent p-0 text-sm text-center shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="সময়"
          />
        </label>
        <span>পূর্ণমান: ১০০</span>
      </div>
      {activeSetLabel && (
        <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
          {activeSetLabel}
        </div>
      )}
    </div>
  );
};
