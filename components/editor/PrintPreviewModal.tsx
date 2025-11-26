"use client"

import { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Printer, FileText, X 
} from 'lucide-react';
import { Question } from '@/types/question';
import { MarkdownRenderer } from './MarkdownRenderer';
import { cn } from '@/lib/utils';

interface PrintPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: Question[];
  paperTitle: string;
  examDuration: string;
}

export function PrintPreviewModal({ 
  open, 
  onOpenChange, 
  questions, 
  paperTitle,
  examDuration
}: PrintPreviewModalProps) {
  const [columns, setColumns] = useState<1 | 2 | 3>(1);
  const [textSize, setTextSize] = useState<'medium' | 'large' | 'big'>('large');
  // Added '4' for full horizontal inline options
  const [optionLayout, setOptionLayout] = useState<'1' | '2' | '4'>('4'); 
  const [showSolution, setShowSolution] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSystemPrint = () => {
    window.print();
  };

  const getTextSizeClass = () => {
    switch (textSize) {
      case 'medium': return 'text-sm';
      case 'big': return 'text-xl';
      default: return 'text-base'; 
    }
  };

  // Helper to parse and render Combined MCQ text (Stem + Horizontal Roman + Footer)
  const renderCombinedText = (text: string) => {
    // Simple heuristic to detect Roman Numeral format
    const hasRoman = text.match(/i\./) && text.match(/ii\./);
    
    if (!hasRoman) {
      return (
        <div className="font-serif mb-1">
          <MarkdownRenderer content={text} compact />
        </div>
      );
    }

    // Split into parts
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const stem = [];
    const romans = [];
    const footer = [];
    let phase = 'stem';

    for (const line of lines) {
      if (/^(i|ii|iii)\./.test(line)) {
        phase = 'romans';
        romans.push(line);
      } else if (phase === 'romans' && (line.includes('?') || line.includes('নিচের'))) {
        phase = 'footer';
        footer.push(line);
      } else {
        if (phase === 'stem') stem.push(line);
        else if (phase === 'romans') romans.push(line); // Fallback
        else footer.push(line);
      }
    }

    return (
      <div className="font-serif mb-2">
        {/* Stem */}
          <div className="mb-1">
            <MarkdownRenderer content={stem.join('\n')} compact />
        </div>
        
        {/* Horizontal Romans */}
        {romans.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-1 my-1 px-1 justify-start">
            {romans.map((r, idx) => (
              <span key={idx} className="whitespace-nowrap font-medium">{r}</span>
            ))}
          </div>
        )}

        {/* Footer (e.g., নিচের কোনটি সঠিক?) */}
        {footer.length > 0 && (
          <div className="mt-1">
             <MarkdownRenderer content={footer.join('\n')} compact />
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 gap-0 overflow-hidden flex flex-col" aria-describedby="print-preview-desc">
        
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b bg-white space-y-0">
          <DialogTitle className="text-2xl font-bold text-gray-800">Print Question</DialogTitle>
          <DialogDescription id="print-preview-desc" className="sr-only">
            Preview layout before printing.
          </DialogDescription>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Label htmlFor="solution" className="font-medium text-gray-600">Solution</Label>
              <Switch id="solution" checked={showSolution} onCheckedChange={setShowSolution} />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="answer" className="font-medium text-gray-600">Answer</Label>
              <Switch id="answer" checked={showAnswer} onCheckedChange={setShowAnswer} />
            </div>
            <div className="h-6 w-px bg-gray-300 mx-2" />
            <Button onClick={handleSystemPrint} className="bg-[#009d6e] hover:bg-[#008a60]">
              <Printer className="w-4 h-4 mr-2" /> Print
            </Button>
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
              <FileText className="w-4 h-4 mr-2" /> Generate PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden bg-gray-50 print:bg-white">
          
          {/* Left Sidebar: Settings */}
          <aside className="w-80 bg-white border-r p-6 overflow-y-auto space-y-8">
            {/* Columns */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-lg">Number of Columns</h3>
              <RadioGroup 
                value={columns.toString()} 
                onValueChange={(v) => setColumns(parseInt(v) as 1|2|3)}
                className="flex gap-4"
              >
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex flex-col items-center gap-2">
                    <div className={cn(
                      "w-16 h-20 border-2 rounded-lg flex gap-1 p-1 cursor-pointer transition-all",
                      columns === num ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setColumns(num as 1|2|3)}
                    >
                      {Array.from({ length: num }).map((_, i) => (
                        <div key={i} className="flex-1 bg-gray-200 rounded-sm" />
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={num.toString()} id={`col-${num}`} />
                      <Label htmlFor={`col-${num}`}>{num}</Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Text Size */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-lg">Text Size</h3>
              <RadioGroup 
                value={textSize} 
                onValueChange={(v: any) => setTextSize(v)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="size-m" />
                  <Label htmlFor="size-m" className="text-sm">Aa medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="size-l" />
                  <Label htmlFor="size-l" className="text-base font-medium">Aa large</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="big" id="size-xl" />
                  <Label htmlFor="size-xl" className="text-lg font-bold">Aa big</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Option Layout */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-lg">Option Per Row</h3>
              <RadioGroup 
                value={optionLayout} 
                onValueChange={(v: any) => setOptionLayout(v)}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* 1 Column Style */}
                  <div 
                    className={cn(
                      "border-2 rounded-lg p-2 cursor-pointer transition-all",
                      optionLayout === '1' ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setOptionLayout('1')}
                  >
                    <div className="space-y-2 mb-2">
                      <div className="h-2 w-full bg-gray-300 rounded" />
                      <div className="h-2 w-full bg-gray-300 rounded" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value="1" id="opt-1" />
                    </div>
                  </div>

                  {/* 2 Column Style */}
                  <div 
                    className={cn(
                      "border-2 rounded-lg p-2 cursor-pointer transition-all",
                      optionLayout === '2' ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setOptionLayout('2')}
                  >
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="h-2 bg-blue-300 rounded" />
                      <div className="h-2 bg-blue-300 rounded" />
                      <div className="h-2 bg-blue-300 rounded" />
                      <div className="h-2 bg-blue-300 rounded" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value="2" id="opt-2" />
                    </div>
                  </div>
                </div>

                {/* 4 Column Style (Inline/Horizontal) */}
                <div 
                  className={cn(
                    "border-2 rounded-lg p-2 cursor-pointer transition-all",
                    optionLayout === '4' ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => setOptionLayout('4')}
                >
                  <div className="flex gap-2 mb-2">
                    <div className="h-2 w-1/4 bg-blue-300 rounded" />
                    <div className="h-2 w-1/4 bg-blue-300 rounded" />
                    <div className="h-2 w-1/4 bg-blue-300 rounded" />
                    <div className="h-2 w-1/4 bg-blue-300 rounded" />
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <RadioGroupItem value="4" id="opt-4" />
                    <Label htmlFor="opt-4" className="text-xs cursor-pointer">Inline (4 Columns)</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </aside>

          {/* Right Side: Live Preview */}
          <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-gray-100 print:bg-white">
            <div 
              className="bg-white shadow-lg p-[10mm] min-h-[297mm] w-full max-w-[210mm] print:shadow-none print:border print:border-transparent print:p-[15mm] print:w-full print:max-w-none block"
            >
              {/* Paper Header - Forced Full Span */}
              <div className="text-center border-b-2 border-double border-gray-800 pb-4 mb-8 [column-span:all]">
                <div className="text-2xl font-bold text-gray-900 font-serif">
                  {paperTitle || 'পরীক্ষার নাম লিখুন'}
                </div>
                <div className="flex justify-between text-sm font-medium mt-4 px-4 text-gray-800">
                  <span>সময়: {examDuration || '—'}</span>
                  <span>পূর্ণমান: ১০০</span>
                </div>
              </div>

              {/* Questions Container */}
              <div 
                className={getTextSizeClass()}
                style={{ 
                  columnCount: columns,
                  columnGap: '2rem',
                  columnRule: columns > 1 ? '1px solid #e5e7eb' : 'none'
                }}
              >
                {questions.map((q, index) => (
                  <div 
                    key={q.id} 
                    className="mb-3 break-inside-avoid-column print:break-inside-avoid print:page-break-inside-avoid"
                  >
                    <div className="flex gap-2 items-baseline">
                      <span className="font-bold min-w-[24px] text-[17px]">{index + 1}.</span>
                      <div className="flex-1 font-serif text-[17px] leading-snug">
                        {(!q.romanStatements || q.romanStatements.length === 0) && q.stem && (
                          <div className="mb-2">
                            <MarkdownRenderer content={q.stem} compact />
                          </div>
                        )}
                        {/* Auto-detects and formats combined questions horizontally */}
                        {q.romanStatements && q.romanStatements.length > 0
                          ? renderCombinedText(q.text)
                          : (
                            <MarkdownRenderer content={q.text} compact />
                          )}

                        {/* MCQ Options */}
                        {q.type === 'mcq' && q.options && (
                          <div className={cn(
                            "grid gap-y-[6px] mt-2",
                            optionLayout === '4'
                              ? "grid-cols-2 gap-x-12"
                              : optionLayout === '2'
                                ? "grid-cols-2 gap-x-10"
                                : "grid-cols-1 gap-x-6"
                          )}>
                            {q.options.map((opt, i) => (
                              <div key={opt.id} className="flex gap-2 items-baseline">
                                <span className="font-medium min-w-[20px]">
                                  {['ক','খ','গ','ঘ'][i]}.
                                </span>
                                <MarkdownRenderer content={opt.text} className="leading-tight" compact />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* CQ Sub-questions */}
                        {q.type === 'cq' && q.subQuestions && (
                          <div className="space-y-1 mt-2 ml-1">
                            {q.subQuestions.map((sq) => (
                              <div key={sq.id} className="flex gap-2 items-baseline">
                                <span className="font-medium whitespace-nowrap">({sq.label})</span>
                                <div>
                                  <MarkdownRenderer content={sq.text} className="leading-tight" compact />
                                </div>
                                <span className="ml-auto text-sm font-bold text-gray-500">
                                  {sq.marks}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Marks for Question */}
                      {q.type === 'cq' && (
                        <div className="font-bold text-gray-600 text-sm ml-2">
                          {q.marks}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
}