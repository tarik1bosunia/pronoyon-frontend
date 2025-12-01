"use client"

import { Fragment, ReactNode } from 'react';
import { Question } from '@/types/question';
import { PageBoundary } from '../types';
import { cn } from '@/lib/utils';
import { QuestionRenderer } from './QuestionRenderer';

interface PaperPagesProps {
  pageBoundaries: PageBoundary[];
  questions: Question[];
  pageHeader: ReactNode;
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
  placeholder?: ReactNode;
}

export const PaperPages = ({
  pageBoundaries,
  questions,
  pageHeader,
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
  updateCurrentSet,
  placeholder
}: PaperPagesProps) => {
  const pageCount = pageBoundaries.length;

  return (
    <>
      {pageBoundaries.map((span, pageIndex) => {
        const pageQuestions = questions.slice(span.start, span.end);

        return (
          <Fragment key={`page-${pageIndex}`}>
            <section className="relative flex justify-center">
              <div className="w-[210mm] min-h-[297mm] rounded-[3px] border border-slate-200 bg-white shadow-[0_28px_60px_-35px_rgba(15,23,42,0.55)]">
                <div className="flex h-full flex-col px-[15mm] py-[15mm]">
                  {pageIndex === 0 && pageHeader}
                  <div className={cn("flex-1", pageIndex === 0 ? "" : "")}>
                    <div className="space-y-3">
                      {pageQuestions.map((q, localIdx) => {
                        const questionIndex = span.start + localIdx;
                        
                        return (
                          <QuestionRenderer
                            key={q.id}
                            question={q}
                            questionIndex={questionIndex}
                            optionGap={optionGap}
                            optionBlockGap={optionBlockGap}
                            optionPadding={optionPadding}
                            showStemForQuestion={showStemForQuestion}
                            showSolutionForQuestion={showSolutionForQuestion}
                            onUpdate={onUpdate}
                            onUpdateOptionText={onUpdateOptionText}
                            onToggleOptionCorrectness={onToggleOptionCorrectness}
                            onUpdateSubQuestionText={onUpdateSubQuestionText}
                            onSettings={onSettings}
                            onDelete={onDelete}
                            onToggleStem={onToggleStem}
                            onToggleSolution={onToggleSolution}
                            updateCurrentSet={updateCurrentSet}
                          />
                        );
                      })}
                      {pageIndex === pageCount - 1 && placeholder}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Fragment>
        );
      })}
    </>
  );
};
