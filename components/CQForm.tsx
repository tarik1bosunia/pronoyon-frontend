import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { InlineEditor } from './editor/InlineEditor';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Plus, Trash2 } from 'lucide-react';
import { CQSubQuestion } from '@/types/question';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  onSubmit: (questionText: string, marks: number, subQuestions: CQSubQuestion[]) => void;
}

export const CQForm = ({ onSubmit }: Props) => {
  const [questionText, setQuestionText] = useState('');
  const [marks, setMarks] = useState(10);
  const [subQuestions, setSubQuestions] = useState<CQSubQuestion[]>([
    { id: uuidv4(), text: '', marks: 3 },
    { id: uuidv4(), text: '', marks: 3 },
    { id: uuidv4(), text: '', marks: 4 },
  ]);

  const addSubQuestion = () => {
    setSubQuestions([...subQuestions, { id: uuidv4(), text: '', marks: 0 }]);
  };

  const removeSubQuestion = (id: string) => {
    if (subQuestions.length > 1) {
      setSubQuestions(subQuestions.filter(sq => sq.id !== id));
    }
  };

  const updateSubQuestion = (id: string, field: 'text' | 'marks', value: string | number) => {
    setSubQuestions(subQuestions.map(sq => 
      sq.id === id ? { ...sq, [field]: value } : sq
    ));
  };

  const handleSubmit = () => {
    if (!questionText.trim()) {
      alert('Please enter a question');
      return;
    }
    if (subQuestions.some(sq => !sq.text.trim())) {
      alert('Please fill all sub-questions');
      return;
    }
    onSubmit(questionText, marks, subQuestions);
    setQuestionText('');
    setMarks(10);
    setSubQuestions([
      { id: uuidv4(), text: '', marks: 3 },
      { id: uuidv4(), text: '', marks: 3 },
      { id: uuidv4(), text: '', marks: 4 },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Side */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="cq-question">Main Question (Supports Markdown & LaTeX)</Label>
            <div className="mt-2">
              <InlineEditor
                content={questionText}
                onChange={setQuestionText}
                placeholder="Type your main question... Use **bold**, *italic*, or $E=mc^2$ for math"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cq-marks">Total Marks</Label>
            <Input
              id="cq-marks"
              type="number"
              min={1}
              value={marks}
              onChange={(e) => setMarks(parseInt(e.target.value) || 1)}
              className="mt-2"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Sub-Questions</Label>
              <Button onClick={addSubQuestion} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Sub-Question
              </Button>
            </div>
            {subQuestions.map((sq, index) => (
              <Card key={sq.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">
                    Sub-Question {index + 1}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      value={sq.marks}
                      onChange={(e) => updateSubQuestion(sq.id, 'marks', parseInt(e.target.value) || 0)}
                      placeholder="Marks"
                      className="w-20 h-8"
                    />
                    {subQuestions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubQuestion(sq.id)}
                        className="h-8 px-2"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
                <InlineEditor
                  content={sq.text}
                  onChange={(text) => updateSubQuestion(sq.id, 'text', text)}
                  placeholder={`Enter sub-question ${index + 1}... (supports markdown & LaTeX)`}
                />
              </Card>
            ))}
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Add CQ Question
          </Button>
        </div>

        {/* Preview Side */}
        <div>
          <Label>Preview</Label>
          <Card className="p-6 mt-2 min-h-[400px] bg-preview">
            {questionText ? (
              <div className="space-y-4">
                <div className="font-semibold text-sm text-muted-foreground">
                  Total Marks: {marks}
                </div>
                <MarkdownRenderer content={questionText} />
                <div className="space-y-4 mt-6">
                  {subQuestions.map((sq, index) => (
                    <div key={sq.id} className="border-l-2 border-primary pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">
                          ({String.fromCharCode(97 + index)})
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {sq.marks} marks
                        </span>
                      </div>
                      {sq.text ? (
                        <MarkdownRenderer content={sq.text} />
                      ) : (
                        <span className="text-muted-foreground text-sm italic">
                          Sub-question {index + 1}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Start typing to see preview...
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
