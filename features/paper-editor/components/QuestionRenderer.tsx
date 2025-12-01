"use client"

import { Question } from '@/types/question';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InlineEditor } from '@/components/editor/InlineEditor';
import { Settings, Trash2, GripVertical, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Draggable } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import { MCQ_OPTION_LABELS } from '../types';
import { CombinedQuestionEditor } from './CombinedQuestionEditor';

interface QuestionRendererProps {
  question: Question;
  questionIndex: number;
  optionGap: number;
  optionBlockGap: number;
  optionPadding: number;
  showStemForQuestion: Record<string, boolean>;
  showSolutionForQuestion: Record<string, boolean>;
  onUpdate: (id: string, updates: Partial<Question>) => void;
  onUpdateOptionText: (qId: string, optId: string, newText: string) => void;
  onToggleOptionCorrectness: (qId: string, optId: string) => void;
  onUpdateSubQuestionText: (qId: string, sqId: string, newText: string) => void;
  onSettings: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStem: (id: string, show: boolean) => void;
  onToggleSolution: (id: string, show: boolean) => void;
  updateCurrentSet: (updater: (list: Question[]) => Question[]) => void;
}

export const QuestionRenderer = ({
  question: q,
  questionIndex,
  optionGap,
  optionBlockGap,
  optionPadding,
  showStemForQuestion,
  showSolutionForQuestion,
  onUpdate,
  onUpdateOptionText,
  onToggleOptionCorrectness,
  onUpdateSubQuestionText,
  onSettings,
  onDelete,
  onToggleStem,
  onToggleSolution,
  updateCurrentSet
}: QuestionRendererProps) => {
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
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onSettings(q.id)} title="Settings">
              <Settings className="h-3 w-3 text-gray-600" />
            </Button>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onDelete(q.id)} title="Delete">
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
                    onClick={() => onToggleStem(q.id, true)}
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
                    onChange={(val) => onUpdate(q.id, { stem: val })}
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
                      onUpdate(q.id, { stem: '' });
                      onToggleStem(q.id, false);
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
                    onUpdate={(updates) => onUpdate(q.id, updates)}
                    showStem={showStem}
                    onToggleStem={(show) => onToggleStem(q.id, show)}
                  />
                ) : (
                  <InlineEditor
                    content={q.text}
                    onChange={(val) => onUpdate(q.id, { text: val })}
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
                        onClick={() => onToggleOptionCorrectness(q.id, opt.id)}
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
                          onChange={(val) => onUpdateOptionText(q.id, opt.id, val)}
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
                            onChange={(val) => onUpdateSubQuestionText(q.id, sq.id, val)}
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
                      onUpdate(q.id, { solutionParagraphs: [] });
                      onToggleSolution(q.id, false);
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
                            onUpdate(q.id, { solutionParagraphs: newParas });
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
                            onUpdate(q.id, { solutionParagraphs: newParas });
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
                      onUpdate(q.id, { solutionParagraphs: newParas });
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
                  onToggleSolution(q.id, true);
                  onUpdate(q.id, { solutionParagraphs: [{ id: uuidv4(), text: '' }] });
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
};
