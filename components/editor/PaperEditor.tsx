"use client"

import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Question } from '@/types/question';
import { mockQuestions } from '@/features/question-bank/data/mockQuestions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  ArrowLeft, Save, Printer, Trash2, 
  GripVertical, Plus, FileText, BookOpen, Settings, 
  ListChecks, PenTool, Menu, X, Shuffle
} from 'lucide-react';
import { InlineEditor } from './InlineEditor';
import { UnifiedQuestionForm } from './QuestionForms';
import { PrintPreviewModal } from './PrintPreviewModal';
import { AddFromDBModal } from './AddFromDBModal';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MarkdownRenderer } from './MarkdownRenderer';
import { RichTextEditor } from './RichTextEditor';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

const PAGE_HEIGHT_PX = 1122; // 297mm at ~96dpi
const PAGE_PADDING_PX = 56.7; // 15mm padding inside each page

const QUESTION_SET_OPTIONS = [
  { value: 'set-a', label: 'Set A' },
  { value: 'set-b', label: 'Set B' },
  { value: 'set-c', label: 'Set C' }
] as const;
const MAX_QUESTION_SETS = QUESTION_SET_OPTIONS.length;
const MCQ_OPTION_LABELS = ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ', 'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত'];

const cloneQuestions = (items: Question[]): Question[] =>
  items.map((question) => ({
    ...question,
    options: question.options?.map((opt) => ({ ...opt })),
    subQuestions: question.subQuestions?.map((sq) => ({ ...sq })),
    romanStatements: question.romanStatements ? [...question.romanStatements] : undefined
  }));

interface PaperEditorProps {
  initialQuestions: Question[];
  onBack: () => void;
  sidebarTop?: ReactNode;
  onOpenMobileSidebar?: () => void;
  mobileSidebarContent?: ReactNode;
  isMobileSidebarOpen?: boolean;
  onCloseMobileSidebar?: () => void;
}

// --- HELPER: Combined Question Component ---
const CombinedQuestionEditor = ({ 
  question, 
  onUpdate,
  showStem,
  onToggleStem
}: { 
  question: Question; 
  onUpdate: (updates: Partial<Question>) => void;
  showStem: boolean;
  onToggleStem: (show: boolean) => void;
}) => {
  
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
      {/* Hover button for উদ্দীপক - shows when no stem */}
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


export function PaperEditor({
  initialQuestions,
  onBack,
  sidebarTop,
  onOpenMobileSidebar,
  mobileSidebarContent,
  isMobileSidebarOpen,
  onCloseMobileSidebar
}: PaperEditorProps) {
  const [activeSet, setActiveSet] = useState<(typeof QUESTION_SET_OPTIONS)[number]['value']>('set-a');
  const [availableSets, setAvailableSets] = useState<Array<(typeof QUESTION_SET_OPTIONS)[number]>>(() => [
    QUESTION_SET_OPTIONS[0]
  ]);
  const [questionSets, setQuestionSets] = useState<Record<string, Question[]>>(() => ({
    [QUESTION_SET_OPTIONS[0].value]: cloneQuestions(initialQuestions)
  }));
  const questions = questionSets[activeSet] ?? [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isPrintModalOpen, setPrintModalOpen] = useState(false);
  const [isAddFromDBOpen, setIsAddFromDBOpen] = useState(false);
  const [paperTitle, setPaperTitle] = useState("জীববিজ্ঞান ১ম পত্র - মডেল টেস্ট");
  const [examDuration, setExamDuration] = useState("২ ঘন্টা ৩০ মিনিট");
  const [optionGap, setOptionGap] = useState(4);
  const [optionBlockGap, setOptionBlockGap] = useState(8);
  const [optionPadding, setOptionPadding] = useState(2);
  const [pageBreaks, setPageBreaks] = useState<number[]>([]);
  const [showStemForQuestion, setShowStemForQuestion] = useState<Record<string, boolean>>({});
  const [showSolutionForQuestion, setShowSolutionForQuestion] = useState<Record<string, boolean>>({});
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const updateCurrentSet = (updater: (list: Question[]) => Question[]) => {
    setQuestionSets((prev) => ({
      ...prev,
      [activeSet]: updater(prev[activeSet] ?? [])
    }));
  };

  const activeSetLabel = availableSets.find((option) => option.value === activeSet)?.label ?? '';
  const isAtSetLimit = availableSets.length >= MAX_QUESTION_SETS;

  // Determine page breaks by measuring rendered question heights
  useEffect(() => {
    const computePageBreaks = () => {
      if (!pageContainerRef.current) return;

      const container = pageContainerRef.current;
      const headerEl = container.querySelector('[data-paper-header]') as HTMLElement | null;
      const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 0;
      const questionEls = Array.from(
        container.querySelectorAll<HTMLElement>('[data-question-index]')
      );

      if (!questionEls.length) {
        setPageBreaks((prev) => (prev.length ? [] : prev));
        return;
      }

      const usableHeight = PAGE_HEIGHT_PX - PAGE_PADDING_PX * 2;
      let currentHeight = headerHeight;
      const breaks: number[] = [];

      questionEls.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        const styles = window.getComputedStyle(el);
        const marginTop = parseFloat(styles.marginTop || '0');
        const marginBottom = parseFloat(styles.marginBottom || '0');
        const totalHeight = rect.height + marginTop + marginBottom;

        // Handle very first question with header space considered
        if (idx === 0) {
          if (currentHeight + totalHeight > usableHeight) {
            breaks.push(idx);
            currentHeight = totalHeight;
          } else {
            currentHeight += totalHeight;
          }
          return;
        }

        // If the single question itself exceeds usable height, force new page
        if (totalHeight > usableHeight) {
          breaks.push(idx);
          currentHeight = totalHeight;
          return;
        }

        if (currentHeight + totalHeight > usableHeight) {
          breaks.push(idx);
          currentHeight = totalHeight;
        } else {
          currentHeight += totalHeight;
        }
      });

      const normalized = Array.from(new Set(breaks))
        .filter((idx) => idx > 0 && idx < questionEls.length)
        .sort((a, b) => a - b);

      setPageBreaks((prev) => {
        if (prev.length === normalized.length && prev.every((val, i) => val === normalized[i])) {
          return prev;
        }
        return normalized;
      });
    };

    const frame = requestAnimationFrame(computePageBreaks);
    const handleResize = () => requestAnimationFrame(computePageBreaks);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
  }, [questions, paperTitle, examDuration, optionGap, optionBlockGap, optionPadding]);

  // --- Update Handlers ---
  const updateQuestion = (id: string, updates: Partial<Question>) => {
    updateCurrentSet((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const updateOptionText = (qId: string, optId: string, newText: string) => {
    updateCurrentSet((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          options: q.options?.map((opt) => (opt.id === optId ? { ...opt, text: newText } : opt))
        };
      })
    );
  };

  const toggleOptionCorrectness = (qId: string, optId: string) => {
    updateCurrentSet((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          options: q.options?.map((opt) => ({
            ...opt,
            isCorrect: opt.id === optId
          }))
        };
      })
    );
  };

  const updateSubQuestionText = (qId: string, sqId: string, newText: string) => {
    updateCurrentSet((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          subQuestions: q.subQuestions?.map((sq) => (sq.id === sqId ? { ...sq, text: newText } : sq))
        };
      })
    );
  };

  const handlePrintClick = () => setPrintModalOpen(true);
  
  const handleSettings = (id: string) => {
    setEditingId(id);
    setSheetOpen(true);
  };

  const handleActiveSetChange = (value: string) => {
    const typedValue = value as (typeof QUESTION_SET_OPTIONS)[number]['value'];
    if (!availableSets.some((set) => set.value === typedValue)) {
      return;
    }

    if (!questionSets[typedValue]) {
      setQuestionSets((prev) => ({
        ...prev,
        [typedValue]: cloneQuestions(initialQuestions)
      }));
    }

    setActiveSet(typedValue);
    setEditingId(null);
    setSheetOpen(false);
    setPageBreaks([]);
  };

  const handleCreateSet = () => {
    if (isAtSetLimit) {
      toast({
        title: 'Maximum sets reached',
        description: 'Only three sets (A, B, C) are supported right now.'
      });
      return;
    }

    const nextDefinition = QUESTION_SET_OPTIONS.find(
      (definition) => !availableSets.some((set) => set.value === definition.value)
    );

    if (!nextDefinition) {
      return;
    }

    setAvailableSets((prev) => [...prev, nextDefinition]);
    setQuestionSets((prev) => ({
      ...prev,
      [nextDefinition.value]: cloneQuestions(initialQuestions)
    }));
    setActiveSet(nextDefinition.value);
    setEditingId(null);
    setSheetOpen(false);
    setPageBreaks([]);
  };

  const handleShuffleAndCreateSet = () => {
    if (isAtSetLimit) {
      toast({
        title: 'Maximum sets reached',
        description: 'Only three sets (A, B, C) are supported right now.'
      });
      return;
    }

    const nextDefinition = QUESTION_SET_OPTIONS.find(
      (definition) => !availableSets.some((set) => set.value === definition.value)
    );

    if (!nextDefinition) {
      return;
    }

    // Shuffle current set questions
    const shuffledQuestions = [...questions]
      .map((q) => ({ q, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ q }) => ({ ...q }));

    setAvailableSets((prev) => [...prev, nextDefinition]);
    setQuestionSets((prev) => ({
      ...prev,
      [nextDefinition.value]: shuffledQuestions
    }));
    setActiveSet(nextDefinition.value);
    setEditingId(null);
    setSheetOpen(false);
    setPageBreaks([]);
    
    toast({
      title: 'Set created',
      description: `${nextDefinition.label} created with shuffled questions from current set`
    });
  };

  const handleAddNew = (type: 'mcq' | 'cq' | 'combined' | 'writing') => {
    setEditingId(`new-${type}`);
    setSheetOpen(true);
  };

  const handleAddFromDatabase = () => {
    setIsAddFromDBOpen(true);
  };

  const handleAddQuestionsFromDB = (questions: Question[]) => {
    updateCurrentSet((prev) => [...prev, ...questions]);
    toast({
      title: 'সফল',
      description: `${questions.length} টি প্রশ্ন যোগ করা হয়েছে`
    });
  };

  const handleExchangeQuestion = (currentQuestion: Question) => {
    // Find other questions from the same chapter, excluding the current question
    const alternativeQuestions = mockQuestions.filter(q => 
      q.chapter === currentQuestion.chapter &&
      q.id !== currentQuestion.id &&
      !questions.some(existing => existing.id === q.id) // Don't show questions already in the editor
    );

    if (alternativeQuestions.length === 0) {
      toast({
        title: 'কোন বিকল্প নেই',
        description: 'এই অধ্যায়ে আর কোন প্রশ্ন পাওয়া যায়নি',
        variant: 'destructive'
      });
      return;
    }

    // Pick a random question from alternatives
    const randomQuestion = alternativeQuestions[Math.floor(Math.random() * alternativeQuestions.length)];
    
    // Replace the current question with the new one
    updateCurrentSet((prev) => prev.map((q) => 
      q.id === currentQuestion.id ? { ...randomQuestion, id: currentQuestion.id } : q
    ));
    
    setSheetOpen(false);
    toast({
      title: 'প্রশ্ন পরিবর্তিত হয়েছে',
      description: `${currentQuestion.chapter} থেকে নতুন প্রশ্ন যোগ করা হয়েছে`
    });
  };

  const handleDelete = (id: string) => {
    updateCurrentSet((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSaveForm = (updatedQuestion: Question) => {
    if (editingId?.startsWith('new')) {
      updateCurrentSet((prev) => [...prev, { ...updatedQuestion, id: uuidv4() }]);
    } else {
      updateCurrentSet((prev) => prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)));
    }
    setSheetOpen(false);
  };

  const handleQuickAddQuestion = (
    type: 'mcq' | 'cq' | 'combined' | 'writing',
    count = 1,
    optionsPerQuestion?: number
  ) => {
    const newQuestions: Question[] = Array.from({ length: Math.max(count, 1) }, () =>
      buildQuestion(type, optionsPerQuestion)
    );
    const primaryId = newQuestions[0].id;
    updateCurrentSet((prev) => [...prev, ...newQuestions]);
    setEditingId(primaryId);
    setSheetOpen(true);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    updateCurrentSet((prev) => {
      const items = Array.from(prev);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      return items;
    });
  };

  const pageBoundaries = useMemo(() => {
    const checkpoints = [0, ...pageBreaks, questions.length]
      .filter((value, idx, arr) => idx === 0 || value > arr[idx - 1]);

    const spans: Array<{ start: number; end: number }> = [];
    for (let i = 0; i < checkpoints.length - 1; i += 1) {
      spans.push({ start: checkpoints[i], end: checkpoints[i + 1] });
    }

    if (!spans.length) {
      spans.push({ start: 0, end: questions.length });
    }

    return spans;
  }, [pageBreaks, questions.length]);

  const pageCount = pageBoundaries.length;

  const pageHeader = (
    <div
      data-paper-header
      className="text-center border-b-2 border-double border-gray-800 pb-4 mb-8"
    >
      <Input
        value={paperTitle}
        onChange={(e) => setPaperTitle(e.target.value)}
        className="text-center text-2xl font-bold border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent placeholder:text-gray-300"
        placeholder="পরীক্ষার নাম লিখুন"
      />
      <div className="flex justify-between text-sm font-medium mt-4 px-4">
        <label className="flex items-center gap-2">
          <span>সময়:</span>
          <Input
            value={examDuration}
            onChange={(e) => setExamDuration(e.target.value)}
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

  // --- Defaults for New Questions ---
  const getNewQuestionDefaults = (typeStr: string): Question => {
    const type = typeStr.replace('new-', '') as 'mcq' | 'cq' | 'combined' | 'writing';
    
    if (type === 'cq') {
      return {
        id: 'temp',
        type: 'cq',
        text: '',
        marks: 10,
        subQuestions: [
          { id: uuidv4(), label: 'ক', text: '', marks: 1 },
          { id: uuidv4(), label: 'খ', text: '', marks: 2 },
          { id: uuidv4(), label: 'গ', text: '', marks: 3 },
          { id: uuidv4(), label: 'ঘ', text: '', marks: 4 },
        ]
      } as Question;
    }

    if (type === 'writing') {
      return {
        id: 'temp',
        type: 'writing',
        text: '', // Main stem
        marks: 5,
        subQuestions: [
          { id: uuidv4(), label: '1', text: '', marks: 5 }, // Starts with 1 sub-question
        ]
      } as Question;
    }

    if (type === 'combined') {
      return {
        id: 'temp',
        type: 'mcq',
        text: '', 
        stem: '',
        romanStatements: ['', '', ''],
        footer: 'নিচের কোনটি সঠিক?',
        marks: 1,
        options: [
          { id: uuidv4(), text: 'i ও ii', isCorrect: false },
          { id: uuidv4(), text: 'i ও iii', isCorrect: false },
          { id: uuidv4(), text: 'ii ও iii', isCorrect: false },
          { id: uuidv4(), text: 'i, ii ও iii', isCorrect: false },
        ]
      } as Question;
    }

    // Standard MCQ
    return {
      id: 'temp',
      type: 'mcq',
      text: '',
      stem: '',
      marks: 1,
      options: [
        { id: uuidv4(), text: '', isCorrect: false },
        { id: uuidv4(), text: '', isCorrect: false },
        { id: uuidv4(), text: '', isCorrect: false },
        { id: uuidv4(), text: '', isCorrect: false },
      ]
    } as Question;
  };

  const buildQuestion = (
    type: 'mcq' | 'cq' | 'combined' | 'writing',
    optionsPerQuestion?: number
  ): Question => {
    const template = getNewQuestionDefaults(`new-${type}`);

    if (
      type === 'mcq' &&
      template.options &&
      typeof optionsPerQuestion === 'number' &&
      optionsPerQuestion > template.options.length
    ) {
      const additions = Array.from({ length: optionsPerQuestion - template.options.length }, () => ({
        id: uuidv4(),
        text: '',
        isCorrect: false
      }));
      template.options = [...template.options, ...additions];
    }

    return {
      ...template,
      id: uuidv4()
    };
  };

  const sidebarContent = (
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
                  document.getElementById(`q-${q.id}`)?.scrollIntoView({ behavior: 'smooth' });
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

      <div className="p-4 border-t space-y-3 bg-gray-50/50">
        <Button 
          variant="outline" 
          className="w-full justify-start h-11 bg-white hover:bg-gray-50 border-gray-200 shadow-sm" 
          onClick={() => handleAddNew('mcq')}
        >
          <Plus className="h-4 w-4 mr-3 text-gray-500" /> 
          Add MCQ
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start h-11 bg-white hover:bg-gray-50 border-gray-200 shadow-sm" 
          onClick={() => handleAddNew('combined')}
        >
          <ListChecks className="h-4 w-4 mr-3 text-gray-500" /> 
          Add Combined MCQ
        </Button>

        <Button 
          variant="outline" 
          className="w-full justify-start h-11 bg-white hover:bg-gray-50 border-gray-200 shadow-sm" 
          onClick={() => handleAddNew('cq')}
        >
          <div className="h-5 w-5 mr-2.5 rounded-full bg-gray-800 text-white flex items-center justify-center text-[10px] font-bold">N</div>
          Add Creative
        </Button>

        <Button 
          variant="outline" 
          className="w-full justify-start h-11 bg-white hover:bg-gray-50 border-gray-200 shadow-sm" 
          onClick={() => handleAddNew('writing')}
        >
          <PenTool className="h-4 w-4 mr-3 text-gray-500" />
          Add Writing
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5]">
      {/* Header Toolbar */}
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
            <Select value={activeSet} onValueChange={handleActiveSetChange}>
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
          <Button variant="outline" size="sm" className="hidden md:flex gap-2" onClick={handlePrintClick}>
            <Printer className="h-4 w-4" /> প্রিন্ট করুন
          </Button>
          <Button size="sm" className="bg-[#009d6e] hover:bg-[#008a60] gap-2">
            <Save className="h-4 w-4" /> সেভ পেপার
          </Button>
        </div>
      </header>

      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-72 bg-white border-r hidden lg:flex flex-col no-print h-full min-h-0">
          {sidebarContent}
        </aside>

        {/* Center: Paper Preview */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#E3E5E8] print:bg-white print:p-0 print:block">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="paper-questions">
              {(provided) => {
                const setDroppableRef = (node: HTMLDivElement | null) => {
                  pageContainerRef.current = node ?? null;
                  provided.innerRef(node);
                };

                return (
                  <div
                    ref={setDroppableRef}
                    {...provided.droppableProps}
                    className="mx-auto flex w-full max-w-5xl flex-col gap-2 pb-16"
                  >
                    {pageBoundaries.map((span, pageIndex) => {
                      const pageQuestions = questions.slice(span.start, span.end);

                      return (
                        <Fragment key={`page-${pageIndex}`}>
                          <section className="relative flex justify-center">
                            <div className="w-[210mm] min-h-[297mm] rounded-[3px] border border-slate-200 bg-white shadow-[0_28px_60px_-35px_rgba(15,23,42,0.55)]">
                              <div className="flex h-full flex-col px-[15mm] py-[15mm]">
                                {pageIndex === 0 && pageHeader}
                                <div className={cn("flex-1", pageIndex === 0 ? "" : "")}
                                >
                                  <div className="space-y-3">
                                    {pageQuestions.map((q, localIdx) => {
                                      const questionIndex = span.start + localIdx;
                                      const showStem = showStemForQuestion[q.id] || false;
                                      const hasStem = Boolean(q.stem?.trim());
                                      const shouldShowStemButton = q.type === 'mcq' && !showStem && !hasStem;
                                      const isCombined = Boolean(q.romanStatements && q.romanStatements.length > 0);

                                      return (
                                        <Draggable key={q.id} draggableId={q.id} index={questionIndex}>
                                          {(dragProvided, snapshot) => (
                                            <div
                                              ref={dragProvided.innerRef}
                                              {...dragProvided.draggableProps}
                                              data-question-index={questionIndex}
                                              id={`q-${q.id}`}
                                              className={cn(
                                                "group relative pl-1 pr-2 py-1 rounded-lg border border-transparent transition-all bg-white",
                                                "print:break-inside-avoid print:page-break-inside-avoid",
                                                snapshot.isDragging
                                                  ? "shadow-2xl ring-2 ring-[#009d6e] z-50"
                                                  : "hover:bg-gray-50 hover:border-gray-200"
                                              )}
                                            >
                                              {/* Hover Actions */}
                                              <div className="absolute right-0 top-0 hidden group-hover:flex gap-1 bg-white shadow border rounded p-1 z-10 no-print">
                                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleSettings(q.id)} title="Settings">
                                                  <Settings className="h-3 w-3 text-gray-600" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDelete(q.id)} title="Delete">
                                                  <Trash2 className="h-3 w-3 text-red-500" />
                                                </Button>
                                                <div {...dragProvided.dragHandleProps} className="h-6 w-6 flex items-center justify-center cursor-move" title="Move">
                                                  <GripVertical className="h-3 w-3 text-gray-400" />
                                                </div>
                                              </div>

                                              <div className="flex gap-2 items-baseline">
                                                <span className="font-bold font-serif text-lg select-none min-w-[24px]">
                                                  {questionIndex + 1}.
                                                </span>

                                                <div className="flex-1 space-y-1">
                                                  {/* Hover button for উদ্দীপক */}
                                                  {shouldShowStemButton && (
                                                    <div className="relative group/stem-trigger">
                                                      <div className="absolute -top-3 left-0 right-0 h-3 bg-transparent"></div>
                                                      <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="absolute -top-7 left-0 opacity-0 group-hover/stem-trigger:opacity-100 transition-all duration-200 text-xs h-7 px-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-500 shadow-sm hover:shadow-md z-20 no-print font-medium"
                                                        onClick={() => setShowStemForQuestion(prev => ({ ...prev, [q.id]: true }))}
                                                      >
                                                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                                                        উদ্দীপক যুক্ত করুন
                                                      </Button>
                                                    </div>
                                                  )}

                                                  {/* Show উদ্দীপক editor if toggled on or if it has content - for non-combined questions */}
                                                  {!isCombined && (showStem || hasStem) && (
                                                    <div className="mb-2 relative group/stem-content">
                                                      <InlineEditor
                                                        content={q.stem ?? ''}
                                                        onChange={(val) => updateQuestion(q.id, { stem: val })}
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
                                                          updateQuestion(q.id, { stem: '' });
                                                          setShowStemForQuestion(prev => ({ ...prev, [q.id]: false }));
                                                        }}
                                                      >
                                                        <X className="h-3 w-3 mr-1" /> মুছুন
                                                      </Button>
                                                    </div>
                                                  )}

                                                  <div className="text-gray-900 font-serif text-lg leading-snug">
                                                    {isCombined ? (
                                                      <CombinedQuestionEditor
                                                        question={q}
                                                        onUpdate={(updates) => updateQuestion(q.id, updates)}
                                                        showStem={showStem}
                                                        onToggleStem={(show) => setShowStemForQuestion(prev => ({ ...prev, [q.id]: show }))}
                                                      />
                                                    ) : (
                                                      <InlineEditor
                                                        content={q.text}
                                                        onChange={(val) => updateQuestion(q.id, { text: val })}
                                                        placeholder="প্রশ্ন লিখুন..."
                                                        className="min-h-[auto] p-0 hover:bg-transparent hover:ring-0 border-none [&_.ProseMirror]:p-0"
                                                        density="compact"
                                                      />
                                                    )}
                                                  </div>

                                                  {q.type === 'mcq' && q.options && (
                                                    <div
                                                      className="grid grid-cols-2 ml-0.5"
                                                      style={{
                                                        columnGap: optionGap,
                                                        rowGap: Math.max(optionGap / 2, 2),
                                                        marginTop: Math.max(optionBlockGap, 0)
                                                      }}
                                                    >
                                                      {q.options.map((opt, i) => (
                                                        <div
                                                          key={opt.id}
                                                          className="flex gap-2 text-[17px] font-serif items-baseline group/opt"
                                                          style={{
                                                            paddingTop: optionPadding,
                                                            paddingBottom: optionPadding
                                                          }}
                                                        >
                                                          <div
                                                            onClick={() => toggleOptionCorrectness(q.id, opt.id)}
                                                            className={cn(
                                                              "h-6 w-6 rounded-full border flex items-center justify-center text-xs cursor-pointer select-none transition-colors shrink-0 mt-0.5",
                                                              opt.isCorrect
                                                                ? "bg-slate-900 text-white border-slate-900"
                                                                : "bg-white text-gray-500 border-gray-400 hover:border-gray-600"
                                                            )}
                                                            title={opt.isCorrect ? "Correct Answer" : "Mark as Correct"}
                                                          >
                                                            {MCQ_OPTION_LABELS[i] ?? String.fromCharCode(65 + i)}
                                                          </div>

                                                          <div className="flex-1">
                                                            <InlineEditor
                                                              content={opt.text}
                                                              onChange={(val) => updateOptionText(q.id, opt.id, val)}
                                                              placeholder={`অপশন`}
                                                              className="min-h-[auto] p-0 hover:bg-transparent hover:ring-0 border-none [&_.ProseMirror]:p-0 [&_.ProseMirror]:min-h-0 leading-tight"
                                                              density="compact"
                                                            />
                                                          </div>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}

                                                  {(q.type === 'cq' || q.type === 'writing') && q.subQuestions && (
                                                    <div className="space-y-1 mt-2">
                                                      {q.subQuestions.map((sq) => (
                                                        <div key={sq.id} className="flex justify-between items-baseline group/sq">
                                                          <div className="flex gap-2 flex-1 items-baseline">
                                                            <span className="font-semibold text-[17px] font-serif select-none whitespace-nowrap">
                                                              {q.type === 'cq' ? `(${sq.label})` : `${sq.label}.`}
                                                            </span>
                                                            <div className="flex-1 font-serif text-[17px]">
                                                              <InlineEditor
                                                                content={sq.text}
                                                                onChange={(val) => updateSubQuestionText(q.id, sq.id, val)}
                                                                placeholder="উপ-প্রশ্ন লিখুন..."
                                                                className="min-h-[auto] p-0 hover:bg-transparent hover:ring-0 border-none [&_.ProseMirror]:p-0"
                                                                density="compact"
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="flex items-center">
                                                            <div className="w-12 text-right opacity-0 group-hover/sq:opacity-100 transition-opacity no-print">
                                                              <Input
                                                                type="number"
                                                                value={sq.marks}
                                                                onChange={(e) => {
                                                                  const newMarks = parseInt(e.target.value, 10) || 0;
                                                                  const newSqs = q.subQuestions?.map((s) =>
                                                                    s.id === sq.id ? { ...s, marks: newMarks } : s
                                                                  );
                                                                  updateCurrentSet((prev) =>
                                                                    prev.map((question) =>
                                                                      question.id === q.id
                                                                        ? { ...question, subQuestions: newSqs }
                                                                        : question
                                                                    )
                                                                  );
                                                                }}
                                                                className="h-6 w-12 text-right text-xs p-1 bg-white"
                                                              />
                                                            </div>
                                                            <span className="hidden print:inline text-sm font-bold text-gray-600 ml-4">{sq.marks}</span>
                                                          </div>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>

                                                {(q.type === 'cq' || q.type === 'writing') && (
                                                  <div className="text-right w-8 font-bold text-sm text-gray-500 pt-1 print:text-black">
                                                    {q.marks}
                                                  </div>
                                                )}
                                              </div>

                                              {/* Solution Section */}
                                              <div className="mt-3">
                                                {(showSolutionForQuestion[q.id] || (q.solutionParagraphs && q.solutionParagraphs.length > 0)) ? (
                                                  <div className="relative group/solution-content bg-green-50/40 rounded-lg p-4 pt-3">
                                                    <div className="flex items-end justify-end mb-2">
                                                      <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="opacity-0 group-hover/solution-content:opacity-100 transition-opacity text-xs h-5 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 no-print shrink-0"
                                                        onClick={() => {
                                                          updateQuestion(q.id, { solutionParagraphs: [] });
                                                          setShowSolutionForQuestion(prev => ({ ...prev, [q.id]: false }));
                                                        }}
                                                      >
                                                        <X className="h-3 w-3 mr-1" /> সব মুছুন
                                                      </Button>
                                                    </div>
                                                    <div className="space-y-3">
                                                      {(q.solutionParagraphs && q.solutionParagraphs.length > 0 ? q.solutionParagraphs : [{ id: uuidv4(), text: '' }]).map((para, paraIndex) => (
                                                        <div key={para.id} className="relative group/para rounded p-2" style={{ backgroundColor: '#DCFCE7' }}>
                                                          <div className="text-[17px] leading-relaxed font-serif text-gray-900">
                                                            <InlineEditor
                                                              content={para.text}
                                                              onChange={(val) => {
                                                                const currentParas = q.solutionParagraphs || [];
                                                                const newParas = [...currentParas];
                                                                if (paraIndex < newParas.length) {
                                                                  newParas[paraIndex] = { ...newParas[paraIndex], text: val };
                                                                } else {
                                                                  newParas.push({ id: para.id, text: val });
                                                                }
                                                                updateQuestion(q.id, { solutionParagraphs: newParas });
                                                              }}
                                                              placeholder={`প্যারাগ্রাফ ${paraIndex + 1}...`}
                                                              className="min-h-[auto] p-0 hover:bg-transparent hover:ring-0 border-none [&_.ProseMirror]:p-0"
                                                              density="compact"
                                                            />
                                                          </div>
                                                          {q.solutionParagraphs && q.solutionParagraphs.length > 1 && (
                                                            <Button
                                                              size="sm"
                                                              variant="ghost"
                                                              className="absolute -top-2 -right-2 opacity-0 group-hover/para:opacity-100 transition-opacity h-5 w-5 p-0 rounded-full bg-red-100 hover:bg-red-200 text-red-600 no-print"
                                                              onClick={() => {
                                                                const newParas = q.solutionParagraphs!.filter(p => p.id !== para.id);
                                                                updateQuestion(q.id, { solutionParagraphs: newParas });
                                                              }}
                                                            >
                                                              <X className="h-3 w-3" />
                                                            </Button>
                                                          )}
                                                        </div>
                                                      ))}
                                                      <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-xs h-6 px-2 border-dashed border-green-400 text-green-700 hover:bg-green-100 hover:border-green-500 no-print bg-white"
                                                        onClick={() => {
                                                          const currentParas = q.solutionParagraphs || [];
                                                          const newParas = [...currentParas, { id: uuidv4(), text: '' }];
                                                          updateQuestion(q.id, { solutionParagraphs: newParas });
                                                        }}
                                                      >
                                                        <Plus className="h-3 w-3 mr-1" />
                                                        প্যারাগ্রাফ যোগ করুন
                                                      </Button>
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-xs h-7 px-3 bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 text-green-700 hover:from-green-100 hover:to-emerald-100 hover:border-green-500 shadow-sm hover:shadow-md no-print font-medium"
                                                    onClick={() => {
                                                      setShowSolutionForQuestion(prev => ({ ...prev, [q.id]: true }));
                                                      updateQuestion(q.id, { solutionParagraphs: [{ id: uuidv4(), text: '' }] });
                                                    }}
                                                  >
                                                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                                                    সমাধান যুক্ত করুন
                                                  </Button>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </Draggable>
                                      );
                                    })}
                                    {pageIndex === pageCount - 1 && provided.placeholder}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                        </Fragment>
                      );
                    })}
                  </div>
                );
              }}
            </Droppable>
          </DragDropContext>
        </main>
      </div>

      <div className="no-print fixed bottom-4 left-4 right-4 z-40 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl lg:left-[19rem] lg:right-6">
        <div className="flex items-center gap-2">
          <span className="text-slate-300">Set</span>
          <Select value={activeSet} onValueChange={handleActiveSetChange}>
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
            onClick={handleCreateSet}
            disabled={isAtSetLimit}
          >
            + New Set
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-9 rounded-full border border-slate-700 bg-purple-600 text-xs uppercase tracking-wide text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleShuffleAndCreateSet}
            disabled={isAtSetLimit}
          >
            <Shuffle className="h-3.5 w-3.5 mr-1.5" /> Shuffle Set
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-9 rounded-full border border-slate-700 bg-slate-800 text-xs uppercase tracking-wide text-white hover:bg-slate-700"
            onClick={() => handleQuickAddQuestion('mcq')}
          >
            + MCQ
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-9 rounded-full border border-slate-700 bg-slate-800 text-xs uppercase tracking-wide text-white hover:bg-slate-700"
            onClick={() => handleQuickAddQuestion('mcq', 1, 5)}
          >
            + MCQ 5
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-9 rounded-full border border-slate-700 bg-slate-800 text-xs uppercase tracking-wide text-white hover:bg-slate-700"
            onClick={() => handleQuickAddQuestion('cq')}
          >
            + CQ
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-9 rounded-full border border-slate-700 bg-slate-800 text-xs uppercase tracking-wide text-white hover:bg-slate-700"
            onClick={() => handleAddNew('cq')}
          >
            + CQ 4
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-9 rounded-full border border-slate-700 bg-slate-800 text-xs uppercase tracking-wide text-white hover:bg-slate-700"
            onClick={() => handleAddNew('cq')}
          >
            + CQ N
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-9 rounded-full border border-slate-700 bg-slate-800 text-xs uppercase tracking-wide text-white hover:bg-slate-700"
            onClick={() => handleAddNew('combined')}
          >
            + MCQ N
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-9 rounded-full border border-slate-700 bg-slate-800 text-xs uppercase tracking-wide text-white hover:bg-slate-700"
            onClick={() => handleAddNew('writing')}
          >
            + Written
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-9 rounded-full border border-slate-700 bg-teal-500 text-xs uppercase tracking-wide text-white hover:bg-teal-400"
            onClick={handleAddFromDatabase}
          >
            Add from DB
          </Button>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="min-w-[100%] sm:min-w-[550px] overflow-y-auto p-0 border-l shadow-2xl no-print">
          <SheetHeader className="px-6 py-4 border-b bg-gray-50 sticky top-0 z-20">
            <SheetTitle className="flex items-center gap-2 text-[#082f49]">
               {editingId?.includes('mcq') || questions.find(q => q.id === editingId)?.type === 'mcq' 
                 ? <><FileText className="w-5 h-5"/> সেটিংস & প্রিভিউ</> 
                 : <><BookOpen className="w-5 h-5"/> সেটিংস & প্রিভিউ</>}
            </SheetTitle>
          </SheetHeader>
          
          <div className="p-6">
            <UnifiedQuestionForm 
              key={editingId} 
              question={editingId?.startsWith('new') 
                ? getNewQuestionDefaults(editingId)
                : questions.find(q => q.id === editingId)!
              }
              onSave={handleSaveForm}
              onExchange={handleExchangeQuestion}
            />
          </div>
        </SheetContent>
      </Sheet>

      <PrintPreviewModal 
        open={isPrintModalOpen}
        onOpenChange={setPrintModalOpen}
        questions={questions}
        paperTitle={paperTitle}
        examDuration={examDuration}
      />

      <AddFromDBModal
        isOpen={isAddFromDBOpen}
        onClose={() => setIsAddFromDBOpen(false)}
        onAddQuestions={handleAddQuestionsFromDB}
        existingQuestionIds={questions.map(q => q.id)}
      />

      {typeof isMobileSidebarOpen === 'boolean' && (
        <div
          className={cn(
            "fixed inset-0 z-50 lg:hidden transition-opacity duration-200",
            isMobileSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onCloseMobileSidebar}
            role="presentation"
          />
          <div
            className={cn(
              "absolute left-0 top-0 bottom-0 h-full w-72 max-w-[80vw] bg-white shadow-xl transition-transform duration-200",
              isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
                <span className="text-sm font-semibold text-gray-700">Sections</span>
                <Button variant="ghost" size="icon" onClick={() => onCloseMobileSidebar?.()}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">
                {mobileSidebarContent ? (
                  <ScrollArea className="h-full">{mobileSidebarContent}</ScrollArea>
                ) : (
                  sidebarContent
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}