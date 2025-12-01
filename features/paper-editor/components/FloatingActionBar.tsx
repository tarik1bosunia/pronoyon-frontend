"use client"

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shuffle } from 'lucide-react';
import { QuestionSetOption } from '../types';

interface FloatingActionBarProps {
  activeSet: string;
  availableSets: QuestionSetOption[];
  isAtSetLimit: boolean;
  onSetChange: (set: string) => void;
  onCreateSet: () => void;
  onShuffleAndCreateSet: () => void;
  onQuickAddQuestion: (
    type: 'mcq' | 'cq' | 'combined' | 'writing',
    count?: number,
    optionsPerQuestion?: number
  ) => void;
  onAddNew: (type: 'mcq' | 'cq' | 'combined' | 'writing') => void;
  onAddFromDatabase: () => void;
}

export const FloatingActionBar = ({
  activeSet,
  availableSets,
  isAtSetLimit,
  onSetChange,
  onCreateSet,
  onShuffleAndCreateSet,
  onQuickAddQuestion,
  onAddNew,
  onAddFromDatabase
}: FloatingActionBarProps) => {
  return (
    <div className="no-print fixed bottom-4 left-4 right-4 z-40 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl lg:left-[19rem] lg:right-6">
      <div className="flex items-center gap-2">
        <span className="text-slate-300">Set</span>
        <Select value={activeSet} onValueChange={onSetChange}>
          <SelectTrigger className="h-9 w-40 border-slate-700 bg-slate-800 text-left text-white">
            <SelectValue placeholder="Select Set" />
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

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="h-9 rounded-full border border-slate-700 bg-slate-800 text-xs uppercase tracking-wide text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onCreateSet}
          disabled={isAtSetLimit}
        >
          + New Set
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="h-9 rounded-full border border-slate-700 bg-purple-600 text-xs uppercase tracking-wide text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onShuffleAndCreateSet}
          disabled={isAtSetLimit}
        >
          <Shuffle className="h-3.5 w-3.5 mr-1.5" /> Shuffle Set
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="h-9 rounded-full border border-slate-700 bg-slate-800 text-xs uppercase tracking-wide text-white hover:bg-slate-700"
          onClick={() => onQuickAddQuestion('mcq')}
        >
          + MCQ
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="h-9 rounded-full border border-slate-700 bg-slate-800 text-xs uppercase tracking-wide text-white hover:bg-slate-700"
          onClick={() => onQuickAddQuestion('mcq', 1, 5)}
        >
          + MCQ 5
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="h-9 rounded-full border border-slate-700 bg-slate-800 text-xs uppercase tracking-wide text-white hover:bg-slate-700"
          onClick={() => onQuickAddQuestion('cq')}
        >
          + CQ
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="h-9 rounded-full border border-slate-700 bg-slate-800 text-xs uppercase tracking-wide text-white hover:bg-slate-700"
          onClick={() => onAddNew('cq')}
        >
          + CQ 4
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="h-9 rounded-full border border-slate-700 bg-slate-800 text-xs uppercase tracking-wide text-white hover:bg-slate-700"
          onClick={() => onAddNew('cq')}
        >
          + CQ N
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="h-9 rounded-full border border-slate-700 bg-slate-800 text-xs uppercase tracking-wide text-white hover:bg-slate-700"
          onClick={() => onAddNew('combined')}
        >
          + MCQ N
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="h-9 rounded-full border border-slate-700 bg-slate-800 text-xs uppercase tracking-wide text-white hover:bg-slate-700"
          onClick={() => onAddNew('writing')}
        >
          + Written
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="h-9 rounded-full border border-slate-700 bg-teal-500 text-xs uppercase tracking-wide text-white hover:bg-teal-400"
          onClick={onAddFromDatabase}
        >
          Add from DB
        </Button>
      </div>
    </div>
  );
};
