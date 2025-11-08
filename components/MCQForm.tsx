import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { InlineEditor } from './InlineEditor';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { MCQOption } from '@/types/question';
import { v4 as uuidv4 } from 'uuid';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Props {
  onSubmit: (questionText: string, marks: number, options: MCQOption[]) => void;
}

export const MCQForm = ({ onSubmit }: Props) => {
  const [questionText, setQuestionText] = useState('');
  const [marks, setMarks] = useState(1);
  const [mcqType, setMcqType] = useState<'simple' | 'combined'>('simple');
  const [options, setOptions] = useState<MCQOption[]>([
    { id: uuidv4(), text: '', isCorrect: false },
    { id: uuidv4(), text: '', isCorrect: false },
    { id: uuidv4(), text: '', isCorrect: false },
    { id: uuidv4(), text: '', isCorrect: false },
  ]);
  const [combinedChoices, setCombinedChoices] = useState<Array<{ id: string; label: string; optionIndices: number[]; isCorrect: boolean }>>([
    { id: uuidv4(), label: 'ক', optionIndices: [], isCorrect: false },
    { id: uuidv4(), label: 'খ', optionIndices: [], isCorrect: false },
    { id: uuidv4(), label: 'গ', optionIndices: [], isCorrect: false },
    { id: uuidv4(), label: 'ঘ', optionIndices: [], isCorrect: false },
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

  const toggleChoiceOption = (choiceId: string, optionIndex: number) => {
    setCombinedChoices(combinedChoices.map(choice => {
      if (choice.id === choiceId) {
        const newIndices = choice.optionIndices.includes(optionIndex)
          ? choice.optionIndices.filter(i => i !== optionIndex)
          : [...choice.optionIndices, optionIndex].sort();
        return { ...choice, optionIndices: newIndices };
      }
      return choice;
    }));
  };

  const toggleChoiceCorrect = (id: string) => {
    setCombinedChoices(combinedChoices.map(choice => 
      choice.id === id ? { ...choice, isCorrect: !choice.isCorrect } : choice
    ));
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
    
    if (mcqType === 'simple') {
      if (!options.some(opt => opt.isCorrect)) {
        alert('Please mark at least one correct answer');
        return;
      }
      onSubmit(questionText, marks, options);
    } else {
      if (!combinedChoices.some(choice => choice.isCorrect)) {
        alert('Please mark at least one correct answer choice');
        return;
      }
      // Convert combined choices to display format
      const combinedText = `${questionText}\n\nনিচের কোনটি সঠিক?\n${combinedChoices.map(choice => 
        `${choice.label}. ${choice.optionIndices.map(i => ['i', 'ii', 'iii', 'iv', 'v'][i]).join(' ও ')}`
      ).join('\n')}`;
      onSubmit(combinedText, marks, combinedChoices.map(choice => ({
        id: choice.id,
        text: choice.optionIndices.map(i => ['i', 'ii', 'iii', 'iv', 'v'][i]).join(' ও '),
        isCorrect: choice.isCorrect
      })));
    }
    
    setQuestionText('');
    setMarks(1);
    setOptions([
      { id: uuidv4(), text: '', isCorrect: false },
      { id: uuidv4(), text: '', isCorrect: false },
      { id: uuidv4(), text: '', isCorrect: false },
      { id: uuidv4(), text: '', isCorrect: false },
    ]);
    setCombinedChoices([
      { id: uuidv4(), label: 'ক', optionIndices: [], isCorrect: false },
      { id: uuidv4(), label: 'খ', optionIndices: [], isCorrect: false },
      { id: uuidv4(), label: 'গ', optionIndices: [], isCorrect: false },
      { id: uuidv4(), label: 'ঘ', optionIndices: [], isCorrect: false },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Side */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="question">Question (Supports Markdown & LaTeX)</Label>
            <div className="mt-2">
              <InlineEditor
                content={questionText}
                onChange={setQuestionText}
                placeholder="Type your question... Use **bold**, *italic*, or $E=mc^2$ for math"
              />
            </div>
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

          <div>
            <Label>MCQ Type</Label>
            <RadioGroup value={mcqType} onValueChange={(value: 'simple' | 'combined') => setMcqType(value)} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="simple" id="simple" />
                <Label htmlFor="simple" className="font-normal cursor-pointer">Simple (A, B, C, D)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="combined" id="combined" />
                <Label htmlFor="combined" className="font-normal cursor-pointer">Combined (i, ii, iii with choices)</Label>
              </div>
            </RadioGroup>
          </div>

          {mcqType === 'simple' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Options</Label>
                <Button onClick={addOption} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              </div>
              {options.map((option, index) => (
                <Card key={option.id} className="p-3 space-y-2">
                  <div className="flex items-center gap-2">
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
                    <span className="font-semibold text-sm min-w-[20px]">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {options.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(option.id)}
                        className="ml-auto px-2"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <InlineEditor
                    content={option.text}
                    onChange={(text) => updateOption(option.id, text)}
                    placeholder={`Option ${String.fromCharCode(65 + index)} (supports markdown & LaTeX)`}
                    className="text-sm"
                  />
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Statement Options (i, ii, iii, iv, v)</Label>
                {options.slice(0, 5).map((option, index) => (
                  <Card key={option.id} className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm min-w-[20px]">
                        {['i', 'ii', 'iii', 'iv', 'v'][index]}.
                      </span>
                    </div>
                    <InlineEditor
                      content={option.text}
                      onChange={(text) => updateOption(option.id, text)}
                      placeholder={`Statement ${['i', 'ii', 'iii', 'iv', 'v'][index]} (supports markdown & LaTeX)`}
                      className="text-sm"
                    />
                  </Card>
                ))}
              </div>

              <div className="space-y-3">
                <Label>Answer Choices (নিচের কোনটি সঠিক?)</Label>
                {combinedChoices.map((choice, index) => (
                  <Card key={choice.id} className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleChoiceCorrect(choice.id)}
                        className="px-2"
                      >
                        {choice.isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </Button>
                      <span className="font-semibold">{choice.label}.</span>
                      <div className="flex gap-1 flex-wrap">
                        {options.slice(0, 5).map((_, optIndex) => (
                          <Button
                            key={optIndex}
                            variant={choice.optionIndices.includes(optIndex) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleChoiceOption(choice.id, optIndex)}
                            className="px-2 py-1 h-7"
                          >
                            {['i', 'ii', 'iii', 'iv', 'v'][optIndex]}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

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
                {mcqType === 'simple' ? (
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
                ) : (
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      {options.slice(0, 5).map((option, index) => (
                        <div key={option.id} className="flex items-start gap-2">
                          <span className="font-semibold text-sm min-w-[24px]">
                            {['i', 'ii', 'iii', 'iv', 'v'][index]}.
                          </span>
                          {option.text ? (
                            <MarkdownRenderer content={option.text} className="flex-1" />
                          ) : (
                            <span className="text-muted-foreground text-sm italic">
                              Statement {['i', 'ii', 'iii', 'iv', 'v'][index]}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t">
                      <p className="font-semibold text-sm mb-2">নিচের কোনটি সঠিক?</p>
                      <div className="grid grid-cols-2 gap-2">
                        {combinedChoices.map((choice) => (
                          <div
                            key={choice.id}
                            className={`p-2 rounded-lg border text-sm ${
                              choice.isCorrect
                                ? 'border-success bg-success/10'
                                : 'border-border'
                            }`}
                          >
                            {choice.label}. {choice.optionIndices.map(i => ['i', 'ii', 'iii', 'iv', 'v'][i]).join(' ও ')}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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
