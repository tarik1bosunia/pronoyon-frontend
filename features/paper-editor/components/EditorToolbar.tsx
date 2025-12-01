"use client"

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Printer, Menu } from 'lucide-react';
import { QuestionSetOption } from '../types';
import { Question } from '@/types/question';

interface EditorToolbarProps {
  onBack: () => void;
  onOpenMobileSidebar?: () => void;
  questions: Question[];
  activeSet: string;
  activeSetLabel: string;
  availableSets: QuestionSetOption[];
  pageCount: number;
  onSetChange: (set: string) => void;
  onPrintClick: () => void;
}

export const EditorToolbar = ({
  onBack,
  onOpenMobileSidebar,
  questions,
  activeSet,
  activeSetLabel,
  availableSets,
  pageCount,
  onSetChange,
  onPrintClick
}: EditorToolbarProps) => {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm no-print">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
        {onOpenMobileSidebar && (
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={onOpenMobileSidebar}
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="font-bold text-gray-800">প্রশ্ন এডিটর</h1>
          <p className="text-xs text-gray-500">
            Total: {questions.length} | Marks: {questions.reduce((sum, q) => sum + q.marks, 0)} | Pages: {pageCount} | Current Set: {activeSetLabel || 'N/A'}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          <span>Set</span>
          <Select value={activeSet} onValueChange={onSetChange}>
            <SelectTrigger className="h-7 w-28 border-0 bg-transparent p-0 text-xs font-medium text-gray-700 focus-visible:ring-0">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {availableSets.map((set) => (
                <SelectItem key={set.value} value={set.value}>
                  {set.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="hidden md:flex gap-2" onClick={onPrintClick}>
          <Printer className="h-4 w-4" /> প্রিন্ট করুন
        </Button>
        <Button size="sm" className="bg-[#009d6e] hover:bg-[#008a60] gap-2">
          <Save className="h-4 w-4" /> সেভ পেপার
        </Button>
      </div>
    </header>
  );
};
