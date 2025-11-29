"use client"

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { mockQuestions } from '@/features/question-bank';
import { SUBJECTS_WITH_CHAPTERS } from '@/features/question-bank/constants';
import { Question } from '@/types/question';
import { cn } from '@/lib/utils';

interface AddFromDBModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestions: (questions: Question[]) => void;
  existingQuestionIds?: string[];
}

export function AddFromDBModal({ 
  isOpen, 
  onClose, 
  onAddQuestions,
  existingQuestionIds = []
}: AddFromDBModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');

  // Get chapters for selected subject
  const availableChapters = useMemo(() => {
    if (!selectedSubject) return [];
    const subjectData = SUBJECTS_WITH_CHAPTERS.find(s => s.subject === selectedSubject);
    return subjectData?.chapters || [];
  }, [selectedSubject]);

  // Get topics for selected chapter
  const availableTopics = useMemo(() => {
    if (!selectedChapter) return [];
    const chapter = availableChapters.find(c => c.chapter === selectedChapter);
    return chapter?.topics || [];
  }, [selectedChapter, availableChapters]);

  // Reset dependent filters when parent changes
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedChapter('');
    setSelectedTopic('');
  };

  const handleChapterChange = (value: string) => {
    setSelectedChapter(value);
    setSelectedTopic('');
  };

  // Filter questions based on search and filters
  const filteredQuestions = useMemo(() => {
    return mockQuestions.filter((q) => {
      // Don't show questions that are already in the editor
      if (existingQuestionIds.includes(q.id)) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchText = q.text?.toLowerCase().includes(query);
        const matchSubject = q.subject?.toLowerCase().includes(query);
        const matchChapter = q.chapter?.toLowerCase().includes(query);
        const matchTopic = q.topic?.toLowerCase().includes(query);
        
        if (!matchText && !matchSubject && !matchChapter && !matchTopic) {
          return false;
        }
      }

      // Type filter
      if (activeTypeFilter !== 'all' && q.type !== activeTypeFilter) {
        return false;
      }

      // Subject filter
      if (selectedSubject && q.subject !== selectedSubject) {
        return false;
      }

      // Chapter filter
      if (selectedChapter && q.chapter !== selectedChapter) {
        return false;
      }

      // Topic filter
      if (selectedTopic && q.topic !== selectedTopic) {
        return false;
      }

      return true;
    });
  }, [searchQuery, activeTypeFilter, selectedSubject, selectedChapter, selectedTopic, existingQuestionIds]);

  const handleToggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(filteredQuestions.map(q => q.id));
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  const handleAddSelected = () => {
    const questionsToAdd = mockQuestions.filter(q => selectedIds.includes(q.id));
    onAddQuestions(questionsToAdd);
    setSelectedIds([]);
    setSearchQuery('');
    onClose();
  };

  const handleClose = () => {
    setSelectedIds([]);
    setSearchQuery('');
    setSelectedSubject('');
    setSelectedChapter('');
    setSelectedTopic('');
    setActiveTypeFilter('all');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold">ডাটাবেস থেকে প্রশ্ন যোগ করুন</DialogTitle>
        </DialogHeader>

        {/* Filter Section */}
        <div className="px-6 py-4 space-y-4 border-b bg-gray-50">
          {/* Top Row: Subject and Chapter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">বিষয়</label>
              <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="HSC - উচ্চতর গণিত ২য় পত্র" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS_WITH_CHAPTERS.map((subject) => (
                    <SelectItem key={subject.subject} value={subject.subject}>
                      {subject.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">অধ্যায়</label>
              <Select 
                value={selectedChapter} 
                onValueChange={handleChapterChange}
                disabled={!selectedSubject}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="সরলরৈখিক বা সমজাতে চলমান রূপার গতি" />
                </SelectTrigger>
                <SelectContent>
                  {availableChapters.map((chapter) => (
                    <SelectItem key={chapter.chapter} value={chapter.chapter}>
                      {chapter.chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second Row: Topic and Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">টপিক</label>
              <Select 
                value={selectedTopic} 
                onValueChange={setSelectedTopic}
                disabled={!selectedChapter}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="টপিক নির্বাচন" />
                </SelectTrigger>
                <SelectContent>
                  {availableTopics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">প্রশ্ন সার্চ</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="এখানে খুঁজুন"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTypeFilter('all')}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeTypeFilter === 'all'
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              )}
            >
              All
            </button>
            <button
              onClick={() => setActiveTypeFilter('mcq')}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeTypeFilter === 'mcq'
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              )}
            >
              MCQ
            </button>
            <button
              onClick={() => setActiveTypeFilter('cq')}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeTypeFilter === 'cq'
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              )}
            >
              CQ
            </button>
            <button
              onClick={() => setActiveTypeFilter('writing')}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeTypeFilter === 'writing'
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              )}
            >
              পালিতিক
            </button>
            <button
              className="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            >
              ছোট নৈবিত্তিক/সংক্ষিপ্ত..
            </button>
          </div>

          {/* Selection Info */}
          <div className="flex items-center justify-between text-sm pt-2">
            <span className="text-gray-600">
              {filteredQuestions.length} টি প্রশ্ন পাওয়া গেছে • {selectedIds.length} টি নির্বাচিত
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                সব নির্বাচন
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClearAll}>
                মুছে ফেলুন
              </Button>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-2 py-4">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                কোন প্রশ্ন পাওয়া যায়নি
              </div>
            ) : (
              filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className={cn(
                    "group relative rounded-xl border-2 bg-white p-5 transition-all duration-200 cursor-pointer",
                    selectedIds.includes(question.id)
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                  )}
                  onClick={() => handleToggleSelection(question.id)}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 pt-1">
                      <Checkbox
                        checked={selectedIds.includes(question.id)}
                        onCheckedChange={() => handleToggleSelection(question.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-5 w-5"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-base font-medium text-gray-900 leading-relaxed line-clamp-3">
                            {question.text}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={cn(
                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
                            question.type === 'mcq' && "bg-emerald-100 text-emerald-700",
                            question.type === 'cq' && "bg-blue-100 text-blue-700",
                            question.type === 'writing' && "bg-purple-100 text-purple-700"
                          )}>
                            {question.type === 'mcq' ? 'MCQ' : question.type === 'cq' ? 'সৃজনশীল' : 'লিখিত'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {question.subject && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
                            📚 {question.subject}
                          </span>
                        )}
                        {question.chapter && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium">
                            📖 {question.chapter}
                          </span>
                        )}
                        {question.topic && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-pink-50 text-pink-700 text-xs font-medium">
                            🎯 {question.topic}
                          </span>
                        )}
                        {question.board && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium">
                            🏛️ {question.board}
                          </span>
                        )}
                        {question.year && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-medium">
                            📅 {question.year}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
          <Button variant="outline" onClick={handleClose}>
            বাতিল
          </Button>
          <Button
            onClick={handleAddSelected}
            disabled={selectedIds.length === 0}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            {selectedIds.length} টি প্রশ্ন যোগ করুন
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
