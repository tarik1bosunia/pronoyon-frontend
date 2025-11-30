"use client"

import { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Printer, FileText, X, Settings 
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
  const [columns, setColumns] = useState<1 | 2>(1);
  const [textSize, setTextSize] = useState<'medium' | 'large' | 'big'>('large');
  // Added '4' for full horizontal inline options
  const [optionLayout, setOptionLayout] = useState<'1' | '2' | '4'>('4'); 
  const [printMode, setPrintMode] = useState<'question' | 'solution' | 'both'>('question');
  const [numberingStyle, setNumberingStyle] = useState<'english' | 'bangla'>('bangla');
  const [optionStyle, setOptionStyle] = useState<'none' | 'dot' | 'parenthesis' | 'rightParen'>('dot');
  const [questionGap, setQuestionGap] = useState(12);
  const [columnGap, setColumnGap] = useState(32);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showPageNumber, setShowPageNumber] = useState(true);
  const [pageNumberLanguage, setPageNumberLanguage] = useState<'english' | 'bangla' | 'uppercase' | 'roman' | 'none'>('bangla');
  const [pageNumberSettingsOpen, setPageNumberSettingsOpen] = useState(false);
  const [pageNumberAdditionalText, setPageNumberAdditionalText] = useState('');
  const [showColumnDivider, setShowColumnDivider] = useState(true);
  const [showWatermark, setShowWatermark] = useState(false);
  const [watermarkSettingsOpen, setWatermarkSettingsOpen] = useState(false);
  const [watermarkText, setWatermarkText] = useState('pronoyon.com');
  const [watermarkFontSize, setWatermarkFontSize] = useState('96');
  const [watermarkFontFamily, setWatermarkFontFamily] = useState('kalpurush');
  const [watermarkOpacity, setWatermarkOpacity] = useState(16);
  const [watermarkOrientation, setWatermarkOrientation] = useState<'horizontal' | 'vertical' | 'diagonal'>('diagonal');
  const [watermarkPosition, setWatermarkPosition] = useState('center');

  const handleSystemPrint = () => {
    window.print();
  };

  const getQuestionNumber = (index: number) => {
    if (numberingStyle === 'english') {
      return (index + 1).toString();
    } else {
      const banglaNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return (index + 1).toString().split('').map(d => banglaNumbers[parseInt(d)]).join('');
    }
  };

  const getPageNumber = (pageNum: number) => {
    if (pageNumberLanguage === 'none') {
      return '';
    }
    if (pageNumberLanguage === 'english') {
      return pageNum.toString();
    } else if (pageNumberLanguage === 'bangla') {
      const banglaNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return pageNum.toString().split('').map(d => banglaNumbers[parseInt(d)]).join('');
    } else if (pageNumberLanguage === 'uppercase') {
      return String.fromCharCode(64 + pageNum); // A, B, C, D...
    } else if (pageNumberLanguage === 'roman') {
      const romanNumerals = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
      return romanNumerals[pageNum] || pageNum.toString();
    }
    return pageNum.toString();
  };

  const getOptionLabel = (index: number) => {
    if (numberingStyle === 'english') {
      return String.fromCharCode(97 + index); // a, b, c, d, e, f...
    } else {
      const banglaOptions = ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ'];
      return banglaOptions[index] || String.fromCharCode(0x0995 + index); // ক, খ, গ, ঘ, ঙ...
    }
  };


  const formatOptionLabel = (index: number) => {
    const label = getOptionLabel(index);
    switch (optionStyle) {
      case 'none':
        return label;
      case 'dot':
        return `${label}.`;
      case 'parenthesis':
        return `(${label})`;
      case 'rightParen':
        return `${label})`;
      default:
        return `${label}.`;
    }
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
              <Label className="font-medium text-gray-600">Print Mode:</Label>
              <Select value={printMode} onValueChange={(v: any) => setPrintMode(v)}>
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="solution">Solution</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
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
                onValueChange={(v) => setColumns(parseInt(v) as 1|2)}
                className="flex gap-4"
              >
                {[1, 2].map((num) => (
                  <div key={num} className="flex flex-col items-center gap-2">
                    <div className={cn(
                      "w-16 h-20 border-2 rounded-lg flex gap-1 p-1 cursor-pointer transition-all",
                      columns === num ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setColumns(num as 1|2)}
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

            {/* Numbering Style */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-lg">নাম্বারিং স্টাইল</h3>
              <RadioGroup 
                value={numberingStyle} 
                onValueChange={(v: any) => setNumberingStyle(v)}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="english" id="num-english" />
                  <Label htmlFor="num-english" className="cursor-pointer">English (1, 2, 3... / a, b, c, d...)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bangla" id="num-bangla" />
                  <Label htmlFor="num-bangla" className="cursor-pointer">বাংলা (১, ২, ৩... / ক, খ, গ, ঘ...)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Option Style */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-lg">অপশন স্টাইল</h3>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={optionStyle === 'none' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOptionStyle('none')}
                  className="h-10 px-4"
                >
                  ক
                </Button>
                <Button
                  variant={optionStyle === 'dot' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOptionStyle('dot')}
                  className="h-10 px-4"
                >
                  ক.
                </Button>
                <Button
                  variant={optionStyle === 'parenthesis' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOptionStyle('parenthesis')}
                  className="h-10 px-4"
                >
                  (ক)
                </Button>
                <Button
                  variant={optionStyle === 'rightParen' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOptionStyle('rightParen')}
                  className="h-10 px-4"
                >
                  ক)
                </Button>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Question Gap */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-800 text-lg">প্রশ্নের গ্যাপ</h3>
                <span className="text-sm text-gray-600 font-medium">{questionGap}px</span>
              </div>
              <Slider
                value={[questionGap]}
                onValueChange={(value) => setQuestionGap(value[0])}
                min={0}
                max={48}
                step={4}
                className="w-full"
              />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Column Gap */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-800 text-lg">কলাম গ্যাপ</h3>
                <span className="text-sm text-gray-600 font-medium">{columnGap}px</span>
              </div>
              <Slider
                value={[columnGap]}
                onValueChange={(value) => setColumnGap(value[0])}
                min={8}
                max={64}
                step={4}
                className="w-full"
              />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Page Number */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-lg">পেজ নম্বর</h3>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={showPageNumber} 
                    onCheckedChange={setShowPageNumber}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPageNumberSettingsOpen(true)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Column Divider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-lg">কলাম ডিভাইডার</h3>
                <Switch 
                  checked={showColumnDivider} 
                  onCheckedChange={setShowColumnDivider}
                />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Watermark */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-lg">ওয়াটার মার্ক</h3>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={showWatermark} 
                    onCheckedChange={setShowWatermark}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      if (showWatermark) {
                        setWatermarkSettingsOpen(true);
                      }
                    }}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
              className="bg-white shadow-lg p-[10mm] min-h-[297mm] w-full max-w-[210mm] print:shadow-none print:border print:border-transparent print:p-[15mm] print:w-full print:max-w-none block relative"
            >
              {/* Watermark */}
              {showWatermark && watermarkText && (
                <div 
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                  style={{
                    opacity: watermarkOpacity / 100,
                  }}
                >
                  <div
                    className="text-gray-400 whitespace-nowrap select-none absolute"
                    style={{
                      fontSize: `${watermarkFontSize}px`,
                      fontFamily: watermarkFontFamily,
                      ...(watermarkPosition === 'top-left' && {
                        top: '10%',
                        left: '10%',
                        transform: watermarkOrientation === 'diagonal' ? 'rotate(-45deg)' : watermarkOrientation === 'vertical' ? 'rotate(-90deg)' : 'none'
                      }),
                      ...(watermarkPosition === 'top' && {
                        top: '10%',
                        left: '50%',
                        transform: watermarkOrientation === 'diagonal' ? 'translateX(-50%) rotate(-45deg)' : watermarkOrientation === 'vertical' ? 'translateX(-50%) rotate(-90deg)' : 'translateX(-50%)'
                      }),
                      ...(watermarkPosition === 'top-right' && {
                        top: '10%',
                        right: '10%',
                        transform: watermarkOrientation === 'diagonal' ? 'rotate(-45deg)' : watermarkOrientation === 'vertical' ? 'rotate(-90deg)' : 'none'
                      }),
                      ...(watermarkPosition === 'left' && {
                        top: '50%',
                        left: '10%',
                        transform: watermarkOrientation === 'diagonal' ? 'translateY(-50%) rotate(-45deg)' : watermarkOrientation === 'vertical' ? 'translateY(-50%) rotate(-90deg)' : 'translateY(-50%)'
                      }),
                      ...(watermarkPosition === 'center' && {
                        top: '50%',
                        left: '50%',
                        transform: watermarkOrientation === 'diagonal' ? 'translate(-50%, -50%) rotate(-45deg)' : watermarkOrientation === 'vertical' ? 'translate(-50%, -50%) rotate(-90deg)' : 'translate(-50%, -50%)'
                      }),
                      ...(watermarkPosition === 'right' && {
                        top: '50%',
                        right: '10%',
                        transform: watermarkOrientation === 'diagonal' ? 'translateY(-50%) rotate(-45deg)' : watermarkOrientation === 'vertical' ? 'translateY(-50%) rotate(-90deg)' : 'translateY(-50%)'
                      }),
                      ...(watermarkPosition === 'bottom-left' && {
                        bottom: '10%',
                        left: '10%',
                        transform: watermarkOrientation === 'diagonal' ? 'rotate(-45deg)' : watermarkOrientation === 'vertical' ? 'rotate(-90deg)' : 'none'
                      }),
                      ...(watermarkPosition === 'bottom' && {
                        bottom: '10%',
                        left: '50%',
                        transform: watermarkOrientation === 'diagonal' ? 'translateX(-50%) rotate(-45deg)' : watermarkOrientation === 'vertical' ? 'translateX(-50%) rotate(-90deg)' : 'translateX(-50%)'
                      }),
                      ...(watermarkPosition === 'bottom-right' && {
                        bottom: '10%',
                        right: '10%',
                        transform: watermarkOrientation === 'diagonal' ? 'rotate(-45deg)' : watermarkOrientation === 'vertical' ? 'rotate(-90deg)' : 'none'
                      })
                    }}
                  >
                    {watermarkText}
                  </div>
                </div>
              )}
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
                  columnGap: `${columnGap}px`,
                  columnRule: columns > 1 && showColumnDivider ? '1px solid #e5e7eb' : 'none'
                }}
              >
                {questions.map((q, index) => (
                  <div 
                    key={q.id} 
                    className="break-inside-avoid-column print:break-inside-avoid print:page-break-inside-avoid"
                    style={{ marginBottom: `${questionGap}px` }}
                  >
                    {/* Question Section */}
                    {(printMode === 'question' || printMode === 'both') && (
                      <div className="flex gap-2 items-baseline">
                        <span className="font-bold min-w-[24px] text-[17px]">{getQuestionNumber(index)}.</span>
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
                                  {formatOptionLabel(i)}
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
                    )}

                    {/* Solution Section */}
                    {(printMode === 'solution' || printMode === 'both') && q.solutionParagraphs && q.solutionParagraphs.length > 0 && (
                      <div className={cn("mt-3", printMode === 'solution' && "flex gap-2 items-baseline")}>
                        {printMode === 'solution' && (
                          <span className="font-bold min-w-[24px] text-[17px]">{getQuestionNumber(index)}.</span>
                        )}
                        <div className="bg-green-50/40 rounded-lg p-3 space-y-2 flex-1">
                          {q.solutionParagraphs.map((para, pIndex) => (
                            <div 
                              key={para.id} 
                              className="rounded p-2 text-[17px] leading-relaxed font-serif text-gray-900"
                              style={{ backgroundColor: '#DCFCE7' }}
                            >
                              <MarkdownRenderer content={para.text} compact />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Page Number at Bottom */}
              {showPageNumber && (
                <div className="text-center mt-8 pt-4 border-t border-gray-300 [column-span:all]">
                  <span className="text-sm font-medium text-gray-700">
                    {pageNumberAdditionalText && `${pageNumberAdditionalText} `}
                    {getPageNumber(1)}
                  </span>
                </div>
              )}
            </div>
          </main>
        </div>
      </DialogContent>

      {/* Page Number Settings Modal */}
      <Dialog open={pageNumberSettingsOpen} onOpenChange={setPageNumberSettingsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">পেজ নম্বর সেটিংস</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-2">
            {/* Page Number Style */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base">পেজ নাম্বারিং স্টাইল</h3>
              <div className="flex gap-3">
                <Button
                  variant={pageNumberLanguage === 'english' ? 'default' : 'outline'}
                  onClick={() => setPageNumberLanguage('english')}
                  className="flex-1 h-auto py-3"
                >
                  1,2..
                </Button>
                <Button
                  variant={pageNumberLanguage === 'bangla' ? 'default' : 'outline'}
                  onClick={() => setPageNumberLanguage('bangla')}
                  className="flex-1 h-auto py-3"
                >
                  ১,২..
                </Button>
                <Button
                  variant={pageNumberLanguage === 'uppercase' ? 'default' : 'outline'}
                  onClick={() => setPageNumberLanguage('uppercase')}
                  className="flex-1 h-auto py-3"
                >
                  A,B..
                </Button>
                <Button
                  variant={pageNumberLanguage === 'roman' ? 'default' : 'outline'}
                  onClick={() => setPageNumberLanguage('roman')}
                  className="flex-1 h-auto py-3"
                >
                  i,ii..
                </Button>
                <Button
                  variant={pageNumberLanguage === 'none' ? 'default' : 'outline'}
                  onClick={() => setPageNumberLanguage('none')}
                  className={cn(
                    "flex-1 h-auto py-3",
                    pageNumberLanguage === 'none' && "bg-green-600 hover:bg-green-700 text-white"
                  )}
                >
                  none
                </Button>
              </div>
            </div>

            {/* Additional Settings Input */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base">পেজ নাম্বারের সাথে কোনো শব্দ যুক্ত করতে এখানে লিখুন</h3>
              <input
                type="text"
                value={pageNumberAdditionalText}
                onChange={(e) => setPageNumberAdditionalText(e.target.value)}
                placeholder="Enter additional settings"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setPageNumberSettingsOpen(false)}
                className="px-8 py-2 bg-red-500 text-white hover:bg-red-600 border-red-500"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setPageNumberSettingsOpen(false)}
                className="px-8 py-2 bg-green-600 hover:bg-green-700"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Watermark Settings Modal */}
      <Dialog open={watermarkSettingsOpen} onOpenChange={setWatermarkSettingsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">ওয়াটার মার্ক সেটিংস</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-2">
            {/* Watermark Text */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Watermark Text</Label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Font Size and Font Family */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">Font Size</Label>
                <Select value={watermarkFontSize} onValueChange={setWatermarkFontSize}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="48">48px</SelectItem>
                    <SelectItem value="64">64px</SelectItem>
                    <SelectItem value="72">72px</SelectItem>
                    <SelectItem value="96">96px</SelectItem>
                    <SelectItem value="120">120px</SelectItem>
                    <SelectItem value="144">144px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base font-semibold">Font Family</Label>
                <Select value={watermarkFontFamily} onValueChange={setWatermarkFontFamily}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kalpurush">kalpurush</SelectItem>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Opacity Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Opacity</Label>
                <span className="text-sm text-gray-600 font-medium">{watermarkOpacity}%</span>
              </div>
              <Slider
                value={[watermarkOpacity]}
                onValueChange={(value) => setWatermarkOpacity(value[0])}
                min={5}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Orientation */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Orientation</Label>
              <RadioGroup 
                value={watermarkOrientation} 
                onValueChange={(v: any) => setWatermarkOrientation(v)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="horizontal" id="orient-horizontal" />
                  <Label htmlFor="orient-horizontal" className="cursor-pointer">Horizontal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vertical" id="orient-vertical" />
                  <Label htmlFor="orient-vertical" className="cursor-pointer">Vertical</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="diagonal" id="orient-diagonal" />
                  <Label htmlFor="orient-diagonal" className="cursor-pointer">Diagonal</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Position Grid */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Position</Label>
              <div className="grid grid-cols-3 gap-3">
                {['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'].map((pos) => (
                  <Button
                    key={pos}
                    variant={watermarkPosition === pos ? 'default' : 'outline'}
                    onClick={() => setWatermarkPosition(pos)}
                    className="h-12 capitalize"
                  >
                    {pos.split('-').join(' ')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setWatermarkSettingsOpen(false)}
                className="px-8 py-2"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setWatermarkSettingsOpen(false)}
                className="px-8 py-2 bg-blue-600 hover:bg-blue-700"
              >
                Apply Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}