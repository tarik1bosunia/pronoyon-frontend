"use client"

import { useState } from 'react';
import { Question } from '@/types/question';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { 
  ArrowLeft, Save, Printer, Trash2, 
  GripVertical, Plus, FileText, BookOpen, Settings 
} from 'lucide-react';
import { InlineEditor } from './InlineEditor';
import { UnifiedQuestionForm } from './QuestionForms';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface PaperEditorProps {
  initialQuestions: Question[];
  onBack: () => void;
}

export function PaperEditor({ initialQuestions, onBack }: PaperEditorProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [paperTitle, setPaperTitle] = useState("জীববিজ্ঞান ১ম পত্র - মডেল টেস্ট");

  // --- Inline Update Handlers ---
  const updateQuestionText = (id: string, newText: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text: newText } : q));
  };

  const updateOptionText = (qId: string, optId: string, newText: string) => {
    setQuestions(questions.map(q => {
      if (q.id !== qId) return q;
      return {
        ...q,
        options: q.options?.map(opt => opt.id === optId ? { ...opt, text: newText } : opt)
      };
    }));
  };

  const updateSubQuestionText = (qId: string, sqId: string, newText: string) => {
    setQuestions(questions.map(q => {
      if (q.id !== qId) return q;
      return {
        ...q,
        subQuestions: q.subQuestions?.map(sq => sq.id === sqId ? { ...sq, text: newText } : sq)
      };
    }));
  };

  const updateMarks = (id: string, newMarks: number) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, marks: newMarks } : q));
  };

  // --- Other Actions ---
  const handlePrint = () => window.print();
  
  const handleSettings = (id: string) => {
    setEditingId(id);
    setSheetOpen(true);
  };

  const handleAddNew = (type: 'mcq' | 'cq') => {
    setEditingId(`new-${type}`);
    setSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSaveForm = (updatedQuestion: Question) => {
    if (editingId?.startsWith('new')) {
      setQuestions([...questions, { ...updatedQuestion, id: Math.random().toString(36).substr(2, 9) }]);
    } else {
      setQuestions(questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
    }
    setSheetOpen(false);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setQuestions(items);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5]">
      {/* Header Toolbar */}
      <header className="h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm no-print">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <div>
            <h1 className="font-bold text-gray-800">প্রশ্ন এডিটর</h1>
            <p className="text-xs text-gray-500">
              Total: {questions.length} | Marks: {questions.reduce((sum, q) => sum + q.marks, 0)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden md:flex gap-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" /> প্রিন্ট করুন
          </Button>
          <Button size="sm" className="bg-[#009d6e] hover:bg-[#008a60] gap-2">
            <Save className="h-4 w-4" /> সেভ পেপার
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r hidden lg:flex flex-col no-print">
          <div className="p-4 border-b font-medium text-gray-700">Outline</div>
          <ScrollArea className="flex-1 p-2">
            {questions.map((q, idx) => (
              <div 
                key={q.id} 
                onClick={() => document.getElementById(`q-${q.id}`)?.scrollIntoView({ behavior: 'smooth' })}
                className="p-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer truncate flex gap-2"
              >
                <span className="font-bold text-gray-400">{idx + 1}.</span>
                {q.text.replace(/<[^>]*>?/gm, '')}
              </div>
            ))}
          </ScrollArea>
          <div className="p-4 border-t space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => handleAddNew('mcq')}>
              <Plus className="h-4 w-4 mr-2" /> Add MCQ
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => handleAddNew('cq')}>
              <Plus className="h-4 w-4 mr-2" /> Add Creative
            </Button>
          </div>
        </aside>

        {/* Center: A4 Paper Preview */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-[#E3E5E8] print:bg-white print:p-0">
          <div className="print-container w-full max-w-[210mm] min-h-[297mm] bg-white shadow-lg p-[15mm] relative">
            
            {/* Paper Header */}
            <div className="text-center border-b-2 border-double border-gray-800 pb-4 mb-8">
              <Input 
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
                className="text-center text-2xl font-bold border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent placeholder:text-gray-300" 
                placeholder="পরীক্ষার নাম লিখুন"
              />
              <div className="flex justify-between text-sm font-medium mt-4 px-4">
                <span>সময়: ২ ঘন্টা ৩০ মিনিট</span>
                <span>পূর্ণমান: ১০০</span>
              </div>
            </div>

            {/* Questions List with Inline Editing */}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="paper-questions">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-8">
                    {questions.map((q, index) => (
                      <Draggable key={q.id} draggableId={q.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            id={`q-${q.id}`}
                            className={cn(
                              "group relative pl-1 pr-2 py-1 rounded-lg border border-transparent transition-all",
                              snapshot.isDragging ? "bg-white shadow-2xl ring-2 ring-[#009d6e] z-50" : "hover:bg-gray-50 hover:border-gray-200"
                            )}
                          >
                            {/* Hover Actions (Hidden on print) */}
                            <div className="absolute right-0 top-0 hidden group-hover:flex gap-1 bg-white shadow border rounded p-1 z-10 no-print">
                              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleSettings(q.id)} title="Settings">
                                <Settings className="h-3 w-3 text-gray-600" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDelete(q.id)} title="Delete">
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                              <div {...provided.dragHandleProps} className="h-6 w-6 flex items-center justify-center cursor-move" title="Move">
                                <GripVertical className="h-3 w-3 text-gray-400" />
                              </div>
                            </div>

                            <div className="flex gap-2 items-baseline">
                              {/* Question Number - Aligned Baseline */}
                              <span className="font-bold font-serif text-lg select-none min-w-[24px]">{index + 1}.</span>
                              
                              <div className="flex-1 space-y-1">
                                {/* Main Question Text */}
                                <div className="text-gray-900 font-serif text-lg leading-snug">
                                  <InlineEditor 
                                    content={q.text} 
                                    onChange={(val) => updateQuestionText(q.id, val)}
                                    placeholder="প্রশ্ন লিখুন..."
                                    className="min-h-[auto] p-0 hover:bg-transparent hover:ring-0 border-none [&_.ProseMirror]:p-0"
                                  />
                                </div>

                                {/* MCQ Options Grid */}
                                {q.type === 'mcq' && q.options && (
                                  <div className="grid grid-cols-2 gap-x-12 gap-y-1 mt-1 ml-1">
                                    {q.options.map((opt, i) => (
                                      <div key={opt.id} className={cn("flex gap-2 text-[17px] font-serif items-baseline", opt.isCorrect ? "font-semibold text-gray-900" : "text-gray-800")}>
                                        {/* Label (ক, খ, etc.) */}
                                        <span className="select-none min-w-[20px]">{['ক','খ','গ','ঘ'][i]}.</span>
                                        
                                        {/* Option Text */}
                                        <div className="flex-1">
                                            <InlineEditor 
                                                content={opt.text} 
                                                onChange={(val) => updateOptionText(q.id, opt.id, val)}
                                                placeholder={`অপশন`}
                                                className="min-h-[auto] p-0 hover:bg-transparent hover:ring-0 border-none [&_.ProseMirror]:p-0 [&_.ProseMirror]:min-h-0"
                                            />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* CQ Sub-questions */}
                                {q.type === 'cq' && q.subQuestions && (
                                  <div className="space-y-1 mt-3">
                                    {q.subQuestions.map((sq) => (
                                      <div key={sq.id} className="flex justify-between items-start group/sq">
                                        <div className="flex gap-2 flex-1">
                                          <span className="font-semibold text-[17px] font-serif select-none">({sq.label})</span>
                                          <div className="flex-1 font-serif text-[17px]">
                                            <InlineEditor 
                                                content={sq.text} 
                                                onChange={(val) => updateSubQuestionText(q.id, sq.id, val)}
                                                placeholder="উপ-প্রশ্ন লিখুন..."
                                                className="min-h-[auto] p-0 hover:bg-transparent hover:ring-0 border-none"
                                            />
                                          </div>
                                        </div>
                                        <div className="w-12 text-right opacity-0 group-hover/sq:opacity-100 transition-opacity no-print">
                                            <Input 
                                                type="number" 
                                                value={sq.marks} 
                                                onChange={(e) => {
                                                    const newMarks = parseInt(e.target.value) || 0;
                                                    const newSqs = q.subQuestions?.map(s => s.id === sq.id ? {...s, marks: newMarks} : s);
                                                    setQuestions(questions.map(qu => qu.id === q.id ? {...qu, subQuestions: newSqs} : qu));
                                                }}
                                                className="h-6 w-12 text-right text-xs p-1 bg-white"
                                            />
                                        </div>
                                        <span className="hidden print:inline text-sm font-bold text-gray-600">{sq.marks}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              {/* Question Total Marks */}
                              {q.type === 'cq' && (
                                <div className="text-right w-8 font-bold text-sm text-gray-500 pt-1 print:text-black">
                                   {q.marks}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </main>
      </div>

      {/* Sidebar for Settings */}
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
                ? { 
                    id: 'temp', 
                    type: editingId.includes('mcq') ? 'mcq' : 'cq', 
                    text: '', 
                    marks: editingId.includes('mcq') ? 1 : 10,
                    options: [], 
                    subQuestions: [] 
                  } as Question
                : questions.find(q => q.id === editingId)!
              }
              onSave={handleSaveForm}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}