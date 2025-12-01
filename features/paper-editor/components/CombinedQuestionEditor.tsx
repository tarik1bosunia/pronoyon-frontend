"use client"

import { Question } from '@/types/question';
import { InlineEditor } from '@/components/editor/InlineEditor';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CombinedQuestionEditorProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  showStem: boolean;
  onToggleStem: (show: boolean) => void;
}

export const CombinedQuestionEditor = ({ 
  question, 
  onUpdate,
  showStem,
  onToggleStem
}: CombinedQuestionEditorProps) => {
  const statements = question.romanStatements || ["", "", ""];
  const stem = question.stem ?? "";
  const hasStem = stem.trim().length > 0;
  const footer = question.footer || "নিচের কোনটি সঠিক?";

  const updateStem = (val: string) => onUpdate({ stem: val });
  const updateStatement = (index: number, val: string) => {
    const newStatements = [...statements];
    newStatements[index] = val;
    onUpdate({ romanStatements: newStatements });
  };
  const updateFooter = (val: string) => onUpdate({ footer: val });

  return (
    <div className="space-y-2">
      {/* Show stem editor only if toggled on or has content */}
      {(showStem || hasStem) && (
        <div className="mb-2 relative group/stem-content">
          <InlineEditor
            content={stem}
            onChange={updateStem}
            placeholder="উদ্দীপক লিখুন..."
            className="min-h-[auto] p-0 hover:bg-transparent hover:ring-0 border-none [&_.ProseMirror]:p-0"
            density="compact"
          />
          {/* Remove button */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute -top-6 right-0 opacity-0 group-hover/stem-content:opacity-100 transition-opacity text-xs h-5 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 no-print"
            onClick={() => {
              onUpdate({ stem: '' });
              onToggleStem(false);
            }}
          >
            <X className="h-3 w-3 mr-1" /> মুছুন
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
        {['i', 'ii', 'iii'].map((roman, idx) => (
          <div key={roman} className="flex items-baseline gap-1">
            <span className="font-semibold min-w-[16px]">{roman}.</span>
            <InlineEditor 
              content={statements[idx]} 
              onChange={(v) => updateStatement(idx, v)}
              placeholder={`বিবৃতি ${idx + 1}`}
              className="min-h-[auto] min-w-[100px] p-0 hover:bg-transparent hover:ring-0 border-none [&_.ProseMirror]:p-0"
              density="compact"
            />
          </div>
        ))}
      </div>

      <div className="mt-2">
        <InlineEditor 
          content={footer} 
          onChange={updateFooter} 
          placeholder="প্রশ্ন..."
          className="min-h-[auto] p-0 hover:bg-transparent hover:ring-0 border-none [&_.ProseMirror]:p-0"
          density="compact"
        />
      </div>
    </div>
  );
};
