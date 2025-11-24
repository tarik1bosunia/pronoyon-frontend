import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from './editor/MarkdownRenderer';
import { Question } from '@/types/question';
import { Trash2, CheckCircle2 } from 'lucide-react';

interface Props {
  question: Question;
  onDelete: (id: string) => void;
}

export const QuestionCard = ({ question, onDelete }: Props) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            question.type === 'mcq' 
              ? 'bg-primary/10 text-primary' 
              : 'bg-accent/10 text-accent'
          }`}>
            {question.type === 'mcq' ? 'MCQ' : 'CQ'}
          </span>
          <span className="text-sm text-muted-foreground">
            {question.marks} marks
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(question.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <MarkdownRenderer content={question.questionText} />

        {question.type === 'mcq' && question.options && (
          <div className="space-y-2 mt-4">
            {question.options.map((option, index) => (
              <div
                key={option.id}
                className={`p-3 rounded-lg border ${
                  option.isCorrect
                    ? 'border-success bg-success/10'
                    : 'border-border'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-sm">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <MarkdownRenderer content={option.text} className="flex-1" />
                  {option.isCorrect && (
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {question.type === 'cq' && question.subQuestions && (
          <div className="space-y-4 mt-4">
            {question.subQuestions.map((sq, index) => (
              <div key={sq.id} className="border-l-2 border-primary pl-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">
                    ({String.fromCharCode(97 + index)})
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {sq.marks} marks
                  </span>
                </div>
                <MarkdownRenderer content={sq.text} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
