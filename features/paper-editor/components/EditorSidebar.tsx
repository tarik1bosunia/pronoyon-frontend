"use client"

import { Question } from '@/types/question';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, ListChecks, PenTool } from 'lucide-react';
import { ReactNode } from 'react';

interface EditorSidebarProps {
  sidebarTop?: ReactNode;
  questions: Question[];
  onAddNew: (type: 'mcq' | 'cq' | 'combined' | 'writing') => void;
  onQuestionClick: (questionId: string) => void;
  onCloseMobileSidebar?: () => void;
}

export const EditorSidebar = ({
  sidebarTop,
  questions,
  onAddNew,
  onQuestionClick,
  onCloseMobileSidebar
}: EditorSidebarProps) => {
  return (
    <div className="flex h-full flex-col">
      {sidebarTop && (
        <div className="border-b bg-white">{sidebarTop}</div>
      )}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="px-4 pb-3 pt-4 border-b font-medium text-gray-700">Outline</div>
        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-1 p-2">
            {questions.map((q, idx) => (
              <div 
                key={q.id} 
                onClick={() => {
                  onQuestionClick(q.id);
                  onCloseMobileSidebar?.();
                }}
                className="p-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer truncate flex gap-2"
              >
                <span className="font-bold text-gray-400">{idx + 1}.</span>
                {(q.stem || q.text).split('\n')[0].substring(0, 30)}...
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

    </div>
  );
};
