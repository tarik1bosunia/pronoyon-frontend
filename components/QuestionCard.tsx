import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from './editor/MarkdownRenderer'; // Ensure path matches your structure
import { Question } from '@/types/question';
import { Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  question: Question;
  onDelete?: (id: string) => void; // Made optional for read-only views
  showActions?: boolean;
}

export const QuestionCard = ({ question, onDelete, showActions = true }: Props) => {
  
  // Helper to render Roman Numeral Statements if they exist in the question text
  // Note: In the real app, you might want to structure 'statements' separately in the DB,
  // but here we are parsing them from the text or assuming the text contains them.
  // For better UI, we just render the 'text' via Markdown which handles the layout.

  return (
    <Card className="p-6 space-y-4 bg-white border-gray-200 shadow-sm hover:shadow-md transition-all">
      {/* Header: Type, Marks, Actions */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold",
            question.type === 'mcq' 
              ? "bg-blue-100 text-blue-700" 
              : "bg-purple-100 text-purple-700"
          )}>
            {question.type === 'mcq' ? 'MCQ' : 'Creative'}
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            {question.marks} marks
          </span>
          {question.board && (
             <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
               {question.board} {question.year}
             </span>
          )}
        </div>
        
        {showActions && onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(question.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Question Content */}
      <div className="space-y-4">
        {/* Main Text */}
        <div className="text-gray-900 text-base font-medium">
           <MarkdownRenderer content={question.questionText || question.text} /> 
           {/* Handling both 'text' and 'questionText' fields based on your different snippets */}
        </div>

        {/* MCQ Options Display */}
        {question.type === 'mcq' && question.options && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {question.options.map((option, index) => (
              <div
                key={option.id}
                className={cn(
                  "p-3 rounded-lg border flex items-start gap-3 transition-colors",
                  option.isCorrect 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-200 hover:bg-gray-50"
                )}
              >
                {/* Option Label (A/B/C/D or K/Kh/G/Gh) */}
                <span className="font-bold text-sm mt-0.5 min-w-[20px]">
                  {['ক','খ','গ','ঘ'][index] || String.fromCharCode(65 + index)}.
                </span>
                
                <div className="flex-1 text-sm">
                   {/* If it's a combined choice, the text itself usually contains "i & ii" etc. */}
                   <MarkdownRenderer content={option.text} />
                </div>

                {/* Correct Indicator */}
                {option.isCorrect && (
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Creative Question (CQ) Sub-questions */}
        {question.type === 'cq' && question.subQuestions && (
          <div className="space-y-3 mt-4 pl-1">
            {question.subQuestions.map((sq, index) => (
              <div key={sq.id} className="flex gap-3 items-start group">
                <span className="font-serif font-bold text-gray-700 mt-0.5 min-w-[24px]">
                  ({String.fromCharCode(2437 + index)}) {/* Bangla Auto-labeling logic if needed, or use sq.label */}
                  {sq.label ? `(${sq.label})` : ''}
                </span>
                
                <div className="flex-1">
                  <div className="text-sm text-gray-800">
                    <MarkdownRenderer content={sq.text} />
                  </div>
                </div>
                
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                  {sq.marks}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};