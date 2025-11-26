import { useState, useEffect } from 'react';
import { Question, MCQOption, CQSubQuestion } from '@/types/question';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from './RichTextEditor';
import { Plus, Trash2, CheckCircle, GripVertical, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

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

  // CQ & Writing State
  const [subQuestions, setSubQuestions] = useState<CQSubQuestion[]>(question.subQuestions || []);

  // Ensure Writing questions have at least 1 sub-question initially
  useEffect(() => {
    if (question.type === 'writing' && subQuestions.length === 0) {
      setSubQuestions([{ id: uuidv4(), label: '1', text: '', marks: 5 }]);
    }
  }, [question.type]);

  const handleAddSubQuestion = () => {
    const nextLabel = (subQuestions.length + 1).toString();
    setSubQuestions([...subQuestions, { id: uuidv4(), label: nextLabel, text: '', marks: 5 }]);
  };

  const handleRemoveSubQuestion = (id: string) => {
    setSubQuestions(subQuestions.filter(sq => sq.id !== id));
  };

  const handleSave = () => {
    onSave({
      ...question,
      text,
      marks,
      options: question.type === 'mcq' ? options : undefined,
      subQuestions: (question.type === 'cq' || question.type === 'writing') ? subQuestions : undefined,
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

      {/* 3. CQ / Writing Sub-Questions Editor */}
      {(question.type === 'cq' || question.type === 'writing') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold text-gray-700">
              {question.type === 'writing' ? 'প্রশ্নসমূহ (Questions)' : 'উপ-প্রশ্ন (Sub-questions)'}
            </Label>
            
            {/* ADD BUTTON FOR WRITING TYPE */}
            {question.type === 'writing' && (
              <Button onClick={handleAddSubQuestion} variant="outline" size="sm" className="gap-2 border-dashed border-gray-400 text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                <Plus className="w-4 h-4" /> আরো প্রশ্ন যোগ করুন
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {subQuestions.map((sq, idx) => (
              <div key={sq.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3 relative group hover:border-gray-300 transition-colors">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {/* Editable Label for Writing Type */}
                      {question.type === 'writing' ? (
                         <Input 
                           value={sq.label}
                           onChange={(e) => {
                             const newSqs = [...subQuestions];
                             newSqs[idx].label = e.target.value;
                             setSubQuestions(newSqs);
                           }}
                           className="w-12 h-8 bg-white text-center font-bold text-sm px-1"
                         />
                      ) : (
                        <span className="font-bold bg-white border px-2 py-0.5 rounded text-sm min-w-[2rem] text-center">{sq.label}</span>
                      )}
                      <span className="text-xs text-gray-500">
                        {question.type === 'writing' ? `Question` : `Sub-question`}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <Label className="text-xs text-gray-500">Marks:</Label>
                       <Input 
                         type="number" 
                         value={sq.marks} 
                         onChange={(e) => {
                           const newSqs = [...subQuestions];
                           newSqs[idx].marks = Number(e.target.value);
                           setSubQuestions(newSqs);
                         }}
                         className="w-14 h-8 bg-white text-right" 
                       />
                       {/* Delete Button for Writing Type (only if more than 1) */}
                       {question.type === 'writing' && subQuestions.length > 1 && (
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 ml-1"
                           onClick={() => handleRemoveSubQuestion(sq.id)}
                           title="Remove this sub-question"
                         >
                           <Trash2 className="w-4 h-4" />
                         </Button>
                       )}
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
            
            {/* Add Button also at the bottom for convenience */}
            {question.type === 'writing' && (
              <Button onClick={handleAddSubQuestion} variant="ghost" className="w-full border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400">
                <Plus className="w-4 h-4 mr-2" /> আরেকটি প্রশ্ন যোগ করুন
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex gap-4 pt-6 border-t mt-8 bg-white sticky bottom-0 z-10 p-4 -mx-6 -mb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Button className="flex-1 bg-[#009d6e] hover:bg-[#008a60] h-11 text-base font-medium" onClick={handleSave}>
          সংরক্ষণ করুন
        </Button>
        <Button variant="outline" className="flex-1 h-11 text-base" onClick={() => onSave(question)}>
          বাতিল
        </Button>
      </div>
    </div>
  );
}