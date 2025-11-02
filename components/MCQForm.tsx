import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { MCQOption } from '@/types/question';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  onSubmit: (questionText: string, marks: number, options: MCQOption[]) => void;
}

export const MCQForm = ({ onSubmit }: Props) => {
  const [questionText, setQuestionText] = useState('');
  const [marks, setMarks] = useState(1);
  const [options, setOptions] = useState<MCQOption[]>([
    { id: uuidv4(), text: '', isCorrect: false },
    { id: uuidv4(), text: '', isCorrect: false },
    { id: uuidv4(), text: '', isCorrect: false },
    { id: uuidv4(), text: '', isCorrect: false },
  ]);

  const addOption = () => {
    setOptions([...options, { id: uuidv4(), text: '', isCorrect: false }]);
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(opt => opt.id !== id));
    }
  };

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const toggleCorrect = (id: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt));
  };

  const handleSubmit = () => {
    if (!questionText.trim()) {
      alert('Please enter a question');
      return;
    }
    if (options.some(opt => !opt.text.trim())) {
      alert('Please fill all options');
      return;
    }
    if (!options.some(opt => opt.isCorrect)) {
      alert('Please mark at least one correct answer');
      return;
    }
    onSubmit(questionText, marks, options);
    setQuestionText('');
    setMarks(1);
    setOptions([
      { id: uuidv4(), text: '', isCorrect: false },
      { id: uuidv4(), text: '', isCorrect: false },
      { id: uuidv4(), text: '', isCorrect: false },
      { id: uuidv4(), text: '', isCorrect: false },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Side */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="question">Question (Supports Markdown & LaTeX)</Label>
            <Textarea
              id="question"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your question here... Use $...$ for inline math and $$...$$ for display math"
              className="min-h-[150px] font-mono text-sm mt-2"
            />
          </div>

          <div>
            <Label htmlFor="marks">Marks</Label>
            <Input
              id="marks"
              type="number"
              min={1}
              value={marks}
              onChange={(e) => setMarks(parseInt(e.target.value) || 1)}
              className="mt-2"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              <Button onClick={addOption} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>
            {options.map((option, index) => (
              <div key={option.id} className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCorrect(option.id)}
                  className="px-2"
                >
                  {option.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </Button>
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(option.id, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  className="flex-1 font-mono text-sm"
                />
                {options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(option.id)}
                    className="px-2"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Add MCQ Question
          </Button>
        </div>

        {/* Preview Side */}
        <div>
          <Label>Preview</Label>
          <Card className="p-6 mt-2 min-h-[400px] bg-preview">
            {questionText ? (
              <div className="space-y-4">
                <div className="font-semibold text-sm text-muted-foreground">
                  Marks: {marks}
                </div>
                <MarkdownRenderer content={questionText} />
                <div className="space-y-2 mt-4">
                  {options.map((option, index) => (
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
                        {option.text ? (
                          <MarkdownRenderer content={option.text} className="flex-1" />
                        ) : (
                          <span className="text-muted-foreground text-sm italic">
                            Option {String.fromCharCode(65 + index)}
                          </span>
                        )}
                      </div>
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
