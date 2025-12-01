"use client"

import { Fragment, useRef, useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { FileText, BookOpen } from 'lucide-react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { UnifiedQuestionForm } from '@/components/editor/QuestionForms';
import { PrintPreviewModal } from '@/components/editor/PrintPreviewModal';
import { AddFromDBModal } from '@/components/editor/AddFromDBModal';
import { 
  PaperEditorProps,
  EditorToolbar,
  EditorSidebar,
  FloatingActionBar,
  PaperHeader,
  PaperPages,
  MobileSidebar,
  usePaperEditor
} from '@/features/paper-editor';
import { usePageBreaks } from '@/features/paper-editor/hooks/usePageBreaks';

export function PaperEditor({
  initialQuestions,
  onBack,
  sidebarTop,
  onOpenMobileSidebar,
  mobileSidebarContent,
  isMobileSidebarOpen,
  onCloseMobileSidebar
}: PaperEditorProps) {
  const pageContainerRef = useRef<HTMLDivElement>(null);
  
  const {
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
    setSheetOpen,
    setPaperTitle,
    setExamDuration,
    setPageBreaks,
    setShowStemForQuestion,
    setShowSolutionForQuestion,
    setIsAddFromDBOpen,
    setPrintModalOpen,
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
    getNewQuestionDefaults,
  } = usePaperEditor(initialQuestions);

  // Page breaks calculation
  usePageBreaks(
    pageContainerRef,
    questions,
    paperTitle,
    examDuration,
    optionGap,
    optionBlockGap,
    optionPadding,
    setPageBreaks
  );

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
    <PaperHeader
      paperTitle={paperTitle}
      examDuration={examDuration}
      activeSetLabel={activeSetLabel}
      availableSets={availableSets}
      activeSet={activeSet}
      onTitleChange={setPaperTitle}
      onDurationChange={setExamDuration}
      onSetChange={handleActiveSetChange}
    />
  );

  const sidebarContent = (
    <EditorSidebar
      sidebarTop={sidebarTop}
      questions={questions}
      onAddNew={handleAddNew}
      onQuestionClick={(questionId) => {
        document.getElementById(`q-${questionId}`)?.scrollIntoView({ behavior: 'smooth' });
      }}
      onCloseMobileSidebar={onCloseMobileSidebar}
    />
  );

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5]">
      {/* Header Toolbar */}
      <EditorToolbar
        onBack={onBack}
        onOpenMobileSidebar={onOpenMobileSidebar}
        questions={questions}
        activeSet={activeSet}
        activeSetLabel={activeSetLabel}
        availableSets={availableSets}
        pageCount={pageCount}
        onSetChange={handleActiveSetChange}
        onPrintClick={handlePrintClick}
      />

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
                    <PaperPages
                      pageBoundaries={pageBoundaries}
                      questions={questions}
                      pageHeader={pageHeader}
                      optionGap={optionGap}
                      optionBlockGap={optionBlockGap}
                      optionPadding={optionPadding}
                      showStemForQuestion={showStemForQuestion}
                      showSolutionForQuestion={showSolutionForQuestion}
                      onUpdate={updateQuestion}
                      onUpdateOptionText={updateOptionText}
                      onToggleOptionCorrectness={toggleOptionCorrectness}
                      onUpdateSubQuestionText={updateSubQuestionText}
                      onSettings={handleSettings}
                      onDelete={handleDelete}
                      onToggleStem={(id, show) => 
                        setShowStemForQuestion(prev => ({ ...prev, [id]: show }))
                      }
                      onToggleSolution={(id, show) => 
                        setShowSolutionForQuestion(prev => ({ ...prev, [id]: show }))
                      }
                      updateCurrentSet={updateCurrentSet}
                      placeholder={provided.placeholder}
                    />
                  </div>
                );
              }}
            </Droppable>
          </DragDropContext>
        </main>
      </div>

      {/* Floating Action Bar */}
      <FloatingActionBar
        activeSet={activeSet}
        availableSets={availableSets}
        isAtSetLimit={isAtSetLimit}
        onSetChange={handleActiveSetChange}
        onCreateSet={handleCreateSet}
        onShuffleAndCreateSet={handleShuffleAndCreateSet}
        onQuickAddQuestion={handleQuickAddQuestion}
        onAddNew={handleAddNew}
        onAddFromDatabase={handleAddFromDatabase}
      />

      {/* Question Edit Sheet */}
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

      {/* Print Preview Modal */}
      <PrintPreviewModal 
        open={isPrintModalOpen}
        onOpenChange={setPrintModalOpen}
        questions={questions}
        paperTitle={paperTitle}
        examDuration={examDuration}
      />

      {/* Add From Database Modal */}
      <AddFromDBModal
        isOpen={isAddFromDBOpen}
        onClose={() => setIsAddFromDBOpen(false)}
        onAddQuestions={handleAddQuestionsFromDB}
        existingQuestionIds={questions.map(q => q.id)}
      />

      {/* Mobile Sidebar */}
      {typeof isMobileSidebarOpen === 'boolean' && (
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={onCloseMobileSidebar}
          sidebarContent={sidebarContent}
          mobileSidebarContent={mobileSidebarContent}
        />
      )}
    </div>
  );
}
