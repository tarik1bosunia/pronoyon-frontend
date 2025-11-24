import { useState, useEffect } from 'react';
import { Question, MCQOption, CQSubQuestion } from '@/types/question';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RichTextEditor } from './RichTextEditor';
import { Plus, Trash2, CheckCircle, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  question: Question;
  onSave: (q: Question) => void;
}

export function UnifiedQuestionForm({ question, onSave }: Props) {
  const [text, setText] = useState(question.text || '');
  const [marks, setMarks] = useState(question.marks);
  
  // MCQ State
  const [options, setOptions] = useState<MCQOption[]>(question.options || [
    { id: '1', text: '', isCorrect: false },
    { id: '2', text: '', isCorrect: false },
    { id: '3', text: '', isCorrect: false },
    { id: '4', text: '', isCorrect: false },
  ]);

  // CQ State
  const [subQuestions, setSubQuestions] = useState<CQSubQuestion[]>(question.subQuestions || [
    { id: 'sq1', label: 'ক', text: '', marks: 1 },
    { id: 'sq2', label: 'খ', text: '', marks: 2 },
    { id: 'sq3', label: 'গ', text: '', marks: 3 },
    { id: 'sq4', label: 'ঘ', text: '', marks: 4 },
  ]);

  const handleSave = () => {
    onSave({
      ...question,
      text,
      marks,
      options: question.type === 'mcq' ? options : undefined,
      subQuestions: question.type === 'cq' ? subQuestions : undefined,
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Main Question Text */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-gray-700">প্রশ্ন / উদ্দীপক</Label>
        <RichTextEditor 
          content={text} 
          onChange={setText} 
          placeholder="প্রশ্ন লিখুন... (LaTeX: $E=mc^2$)"
          className="min-h-[150px]"
        />
      </div>

      {/* 2. MCQ Options Editor */}
      {question.type === 'mcq' && (
        <div className="space-y-4">
           <div className="flex items-center justify-between">
             <Label className="text-base font-semibold text-gray-700">অপশন সমূহ</Label>
             <span className="text-xs text-muted-foreground">সঠিক উত্তরটি মার্ক করুন</span>
           </div>
           
           <div className="space-y-3">
             {options.map((opt, idx) => (
               <div key={idx} className="flex gap-3 items-start group">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "mt-1 rounded-full shrink-0",
                      opt.isCorrect ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    )}
                    onClick={() => {
                       const newOpts = [...options];
                       // Toggle logic: If single select, uncheck others. If multi, just toggle.
                       newOpts.forEach((o, i) => o.isCorrect = i === idx ? !o.isCorrect : false);
                       setOptions(newOpts);
                    }}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </Button>
                  
                  <div className="flex-1 space-y-1">
                    <Input 
                      value={opt.text}
                      onChange={(e) => {
                        const newOpts = [...options];
                        newOpts[idx].text = e.target.value;
                        setOptions(newOpts);
                      }}
                      placeholder={`অপশন ${['ক','খ','গ','ঘ'][idx]}`}
                      className={cn(opt.isCorrect && "border-green-500 ring-1 ring-green-500/20")}
                    />
                  </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* 3. CQ Sub-Questions Editor */}
      {question.type === 'cq' && (
        <div className="space-y-4">
          <Label className="text-base font-semibold text-gray-700">উপ-প্রশ্ন (Sub-questions)</Label>
          <div className="space-y-4">
            {subQuestions.map((sq, idx) => (
              <div key={sq.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-bold bg-white border px-2 py-0.5 rounded text-sm">{sq.label}</span>
                      <span className="text-xs text-gray-500">Sub-question {idx+1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Label className="text-xs">Marks:</Label>
                       <Input 
                         type="number" 
                         value={sq.marks} 
                         onChange={(e) => {
                           const newSqs = [...subQuestions];
                           newSqs[idx].marks = Number(e.target.value);
                           setSubQuestions(newSqs);
                         }}
                         className="w-16 h-8 bg-white" 
                       />
                    </div>
                 </div>
                 <RichTextEditor 
                   content={sq.text} 
                   onChange={(val) => {
                      const newSqs = [...subQuestions];
                      newSqs[idx].text = val;
                      setSubQuestions(newSqs);
                   }}
                   placeholder="এখানে লিখুন..."
                   className="min-h-[80px] bg-white"
                 />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex gap-4 pt-6 border-t mt-8">
        <Button className="flex-1 bg-[#009d6e] hover:bg-[#008a60] h-11 text-base" onClick={handleSave}>
          সংরক্ষণ করুন
        </Button>
        <Button variant="outline" className="flex-1 h-11" onClick={() => onSave(question)}>
          বাতিল
        </Button>
      </div>
    </div>
  );
}