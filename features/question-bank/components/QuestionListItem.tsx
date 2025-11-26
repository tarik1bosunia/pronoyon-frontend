import { cn } from "@/lib/utils";
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { Question } from '@/types/question';

interface Props {
  question: Question;
  index: number;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export function QuestionListItem({ question, index, isSelected, onToggleSelect }: Props) {
  return (
    <div 
      onClick={() => onToggleSelect(question.id)}
      className={cn(
        "cursor-pointer transition-all duration-200 bg-white rounded-lg p-6 border shadow-sm hover:shadow-md relative overflow-hidden group",
        isSelected 
          ? "border-2 border-[#009d6e] ring-1 ring-[#009d6e]/20" 
          : "border-gray-200 hover:border-gray-300"
      )}
    >
      {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#009d6e]" />}
      
      <div className="flex justify-between items-start mb-4 pl-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 flex gap-2">
            <span>{index + 1}.</span>
            <span className="line-clamp-2">{(question.stem || question.text).split('\n')[0]}</span>
          </h3>
          
          {/* Combined MCQ with Roman Statements */}
          {question.type === 'mcq' && question.romanStatements && question.romanStatements.length > 0 && (
            <div className="mt-3 ml-8 space-y-1.5 text-gray-700">
              {question.romanStatements.map((statement, idx) => (
                <div key={idx} className="flex gap-2 text-sm">
                  <span className="font-medium">{['i', 'ii', 'iii', 'iv', 'v'][idx]})</span>
                  <span>{statement}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Footer for combined questions */}
          {question.type === 'mcq' && question.footer && (
            <div className="mt-2 ml-8 text-sm text-gray-600">
              {question.footer}
            </div>
          )}
        </div>
        {isSelected && <CheckCircle className="h-5 w-5 text-[#009d6e] shrink-0" />}
      </div>

      {question.type === 'mcq' && question.options && (
        <div className="grid grid-cols-2 gap-y-3 gap-x-8 pl-6 text-gray-600">
          {question.options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-400">
                {['ক','খ','গ','ঘ'][idx]}.
              </span>
              <span className="truncate">{opt.text}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 pl-6">
        <Badge variant="secondary" className="bg-gray-100 font-normal hover:bg-gray-200">{question.board}</Badge>
        <Badge variant="secondary" className="bg-gray-100 font-normal hover:bg-gray-200">{question.year}</Badge>
        <Badge variant="outline" className="ml-auto text-gray-500">
          {question.type === 'mcq' ? 'MCQ' : (question.type === 'writing' ? 'Writing' : 'Creative')}
        </Badge>
      </div>
    </div>
  );
}
