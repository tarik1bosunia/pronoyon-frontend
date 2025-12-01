"use client"

import { useState, useMemo, useCallback } from 'react';
import { Question } from '@/types/question';
import { QUESTION_SET_OPTIONS, MAX_QUESTION_SETS, QuestionSetValue, QuestionSetOption } from '../types';
import { cloneQuestions, buildQuestion, getNewQuestionDefaults } from '../utils/questionHelpers';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { mockQuestions } from '@/features/question-bank/data/mockQuestions';

export const usePaperEditor = (initialQuestions: Question[]) => {
  const { toast } = useToast();
  
  const [activeSet, setActiveSet] = useState<QuestionSetValue>('set-a');
  const [availableSets, setAvailableSets] = useState<QuestionSetOption[]>(() => [QUESTION_SET_OPTIONS[0]]);
  const [questionSets, setQuestionSets] = useState<Record<string, Question[]>>(() => ({
    [QUESTION_SET_OPTIONS[0].value]: cloneQuestions(initialQuestions)
  }));
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

  const questions = questionSets[activeSet] ?? [];
  const activeSetLabel = availableSets.find((option) => option.value === activeSet)?.label ?? '';
  const isAtSetLimit = availableSets.length >= MAX_QUESTION_SETS;

  const updateCurrentSet = useCallback((updater: (list: Question[]) => Question[]) => {
    setQuestionSets((prev) => ({
      ...prev,
      [activeSet]: updater(prev[activeSet] ?? [])
    }));
  }, [activeSet]);

  const updateQuestion = useCallback((id: string, updates: Partial<Question>) => {
    updateCurrentSet((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  }, [updateCurrentSet]);

  const updateOptionText = useCallback((qId: string, optId: string, newText: string) => {
    updateCurrentSet((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          options: q.options?.map((opt) => (opt.id === optId ? { ...opt, text: newText } : opt))
        };
      })
    );
  }, [updateCurrentSet]);

  const toggleOptionCorrectness = useCallback((qId: string, optId: string) => {
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
  }, [updateCurrentSet]);

  const updateSubQuestionText = useCallback((qId: string, sqId: string, newText: string) => {
    updateCurrentSet((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          subQuestions: q.subQuestions?.map((sq) => (sq.id === sqId ? { ...sq, text: newText } : sq))
        };
      })
    );
  }, [updateCurrentSet]);

  const handlePrintClick = () => setPrintModalOpen(true);
  
  const handleSettings = useCallback((id: string) => {
    setEditingId(id);
    setSheetOpen(true);
  }, []);

  const handleActiveSetChange = useCallback((value: string) => {
    const typedValue = value as QuestionSetValue;
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
  }, [availableSets, questionSets, initialQuestions]);

  const handleCreateSet = useCallback(() => {
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

    if (!nextDefinition) return;

    setAvailableSets((prev) => [...prev, nextDefinition]);
    setQuestionSets((prev) => ({
      ...prev,
      [nextDefinition.value]: cloneQuestions(initialQuestions)
    }));
    setActiveSet(nextDefinition.value);
    setEditingId(null);
    setSheetOpen(false);
    setPageBreaks([]);
  }, [isAtSetLimit, availableSets, initialQuestions, toast]);

  const handleShuffleAndCreateSet = useCallback(() => {
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

    if (!nextDefinition) return;

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
  }, [isAtSetLimit, availableSets, questions, toast]);

  const handleAddNew = useCallback((type: 'mcq' | 'cq' | 'combined' | 'writing') => {
    setEditingId(`new-${type}`);
    setSheetOpen(true);
  }, []);

  const handleAddFromDatabase = () => setIsAddFromDBOpen(true);

  const handleAddQuestionsFromDB = useCallback((questions: Question[]) => {
    updateCurrentSet((prev) => [...prev, ...questions]);
    toast({
      title: 'সফল',
      description: `${questions.length} টি প্রশ্ন যোগ করা হয়েছে`
    });
  }, [updateCurrentSet, toast]);

  const handleExchangeQuestion = useCallback((currentQuestion: Question) => {
    const alternativeQuestions = mockQuestions.filter(q => 
      q.chapter === currentQuestion.chapter &&
      q.id !== currentQuestion.id &&
      !questions.some(existing => existing.id === q.id)
    );

    if (alternativeQuestions.length === 0) {
      toast({
        title: 'কোন বিকল্প নেই',
        description: 'এই অধ্যায়ে আর কোন প্রশ্ন পাওয়া যায়নি',
        variant: 'destructive'
      });
      return;
    }

    const randomQuestion = alternativeQuestions[Math.floor(Math.random() * alternativeQuestions.length)];
    
    updateCurrentSet((prev) => prev.map((q) => 
      q.id === currentQuestion.id ? { ...randomQuestion, id: currentQuestion.id } : q
    ));
    
    setSheetOpen(false);
    toast({
      title: 'প্রশ্ন পরিবর্তিত হয়েছে',
      description: `${currentQuestion.chapter} থেকে নতুন প্রশ্ন যোগ করা হয়েছে`
    });
  }, [questions, updateCurrentSet, toast]);

  const handleDelete = useCallback((id: string) => {
    updateCurrentSet((prev) => prev.filter((q) => q.id !== id));
  }, [updateCurrentSet]);

  const handleSaveForm = useCallback((updatedQuestion: Question) => {
    if (editingId?.startsWith('new')) {
      updateCurrentSet((prev) => [...prev, { ...updatedQuestion, id: uuidv4() }]);
    } else {
      updateCurrentSet((prev) => prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)));
    }
    setSheetOpen(false);
  }, [editingId, updateCurrentSet]);

  const handleQuickAddQuestion = useCallback((
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
  }, [updateCurrentSet]);

  const onDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    updateCurrentSet((prev) => {
      const items = Array.from(prev);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      return items;
    });
  }, [updateCurrentSet]);

  return {
    // State
    activeSet,
    availableSets,
    questions,
    editingId,
    isSheetOpen,
    isPrintModalOpen,
    isAddFromDBOpen,
    paperTitle,
    examDuration,
    optionGap,
    optionBlockGap,
    optionPadding,
    pageBreaks,
    showStemForQuestion,
    showSolutionForQuestion,
    activeSetLabel,
    isAtSetLimit,
    
    // Setters
    setSheetOpen,
    setPaperTitle,
    setExamDuration,
    setPageBreaks,
    setShowStemForQuestion,
    setShowSolutionForQuestion,
    setIsAddFromDBOpen,
    setPrintModalOpen,
    
    // Handlers
    updateCurrentSet,
    updateQuestion,
    updateOptionText,
    toggleOptionCorrectness,
    updateSubQuestionText,
    handlePrintClick,
    handleSettings,
    handleActiveSetChange,
    handleCreateSet,
    handleShuffleAndCreateSet,
    handleAddNew,
    handleAddFromDatabase,
    handleAddQuestionsFromDB,
    handleExchangeQuestion,
    handleDelete,
    handleSaveForm,
    handleQuickAddQuestion,
    onDragEnd,
    
    // Utils
    getNewQuestionDefaults,
  };
};
