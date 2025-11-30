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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  onSubmit: (questionText: string, marks: number, options: MCQOption[]) => void;
}

export const MCQForm = ({ onSubmit }: Props) => {
  const [questionText, setQuestionText] = useState('');
  const [marks, setMarks] = useState(1);
  const [solutionParagraphs, setSolutionParagraphs] = useState<Array<{ id: string; text: string }>>([{ id: uuidv4(), text: '' }]);
  const [mcqType, setMcqType] = useState<'simple' | 'combined'>('simple');
  
  // --- Simple MCQ State ---
  const [simpleOptions, setSimpleOptions] = useState<MCQOption[]>([
    { id: uuidv4(), text: '', isCorrect: false },
    { id: uuidv4(), text: '', isCorrect: false },
    { id: uuidv4(), text: '', isCorrect: false },
    { id: uuidv4(), text: '', isCorrect: false },
  ]);

  // --- Combined MCQ State ---
  // Statements i, ii, iii
  const [statements, setStatements] = useState<{id: string, text: string}[]>([
    { id: 'i', text: '' },
    { id: 'ii', text: '' },
    { id: 'iii', text: '' },
  ]);
  
  // The 4 final choices (K, Kh, G, Gh) which combine i, ii, iii
  const [combinedChoices, setCombinedChoices] = useState<Array<{ id: string; label: string; optionIndices: number[]; isCorrect: boolean }>>([
    { id: uuidv4(), label: 'ক', optionIndices: [0, 1], isCorrect: false }, // i & ii
    { id: uuidv4(), label: 'খ', optionIndices: [1, 2], isCorrect: false }, // ii & iii
    { id: uuidv4(), label: 'গ', optionIndices: [0, 2], isCorrect: false }, // i & iii
    { id: uuidv4(), label: 'ঘ', optionIndices: [0, 1, 2], isCorrect: false }, // i, ii & iii
  ]);

  // --- Handlers for Simple MCQ ---
  const addOption = () => {
    setSimpleOptions([...simpleOptions, { id: uuidv4(), text: '', isCorrect: false }]);
  };

  const removeOption = (id: string) => {
    if (simpleOptions.length > 2) {
      setSimpleOptions(simpleOptions.filter(opt => opt.id !== id));
    }
  };

  const updateSimpleOption = (id: string, text: string) => {
    setSimpleOptions(simpleOptions.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const toggleSimpleCorrect = (id: string) => {
    // For single select, uncheck others
    setSimpleOptions(simpleOptions.map(opt => ({ ...opt, isCorrect: opt.id === id })));
  };

  // --- Handlers for Combined MCQ ---
  const updateStatement = (index: number, text: string) => {
    const newStatements = [...statements];
    newStatements[index].text = text;
    setStatements(newStatements);
  };

  const toggleChoiceOption = (choiceIndex: number, statementIndex: number) => {
    const newChoices = [...combinedChoices];
    const indices = newChoices[choiceIndex].optionIndices;
    
    if (indices.includes(statementIndex)) {
      newChoices[choiceIndex].optionIndices = indices.filter(i => i !== statementIndex).sort();
    } else {
      newChoices[choiceIndex].optionIndices = [...indices, statementIndex].sort();
    }
    setCombinedChoices(newChoices);
  };

  const toggleChoiceCorrect = (index: number) => {
    const newChoices = combinedChoices.map((c, i) => ({ ...c, isCorrect: i === index }));
    setCombinedChoices(newChoices);
  };

  // --- Submit Handler ---
  const handleSubmit = () => {
    if (!questionText.trim()) {
      alert('Please enter a question');
      return;
    }

    if (mcqType === 'simple') {
      if (simpleOptions.some(opt => !opt.text.trim())) {
        alert('Please fill all options');
        return;
      }
      if (!simpleOptions.some(opt => opt.isCorrect)) {
        alert('Please mark at least one correct answer');
        return;
      }
      onSubmit(questionText, marks, simpleOptions);
    } else {
      // Validate Combined
      if (statements.some(s => !s.text.trim())) {
        alert('Please fill all 3 statements (i, ii, iii)');
        return;
      }
      if (!combinedChoices.some(c => c.isCorrect)) {
        alert('Please select the correct combination');
        return;
      }

      // Format the question text to include the statements
      // We append the statements to the question text using Markdown list syntax
      const formattedQuestion = `
${questionText}

i. ${statements[0].text}
ii. ${statements[1].text}
iii. ${statements[2].text}

নিচের কোনটি সঠিক?
      `.trim();

      // Format the options based on the selected indices
      // e.g., [0, 1] -> "i ও ii"
      const romanNumerals = ['i', 'ii', 'iii'];
      const formattedOptions = combinedChoices.map(choice => ({
        id: choice.id,
        text: choice.optionIndices.map(idx => romanNumerals[idx]).join(' ও '),
        isCorrect: choice.isCorrect
      }));

      onSubmit(formattedQuestion, marks, formattedOptions);
    }
    
    // Reset form
    setQuestionText('');
    setMarks(1);
    setSolutionParagraphs([{ id: uuidv4(), text: '' }]);
    // Reset arrays... (optional, for brevity skipping full reset logic here)
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Side */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="question">Question Stem</Label>
            <div className="mt-2">
              <InlineEditor
                content={questionText}
                onChange={setQuestionText}
                placeholder="প্রশ্ন লিখুন... (LaTeX: $E=mc^2$)"
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
            <Label htmlFor="solution">Solution (Optional)</Label>
            <div className="mt-2 space-y-2">
              {solutionParagraphs.map((para, index) => (
                <div key={para.id} className="relative group/para">
                  <InlineEditor
                    content={para.text}
                    onChange={(text: string) => {
                      const newParas = [...solutionParagraphs];
                      newParas[index] = { ...para, text };
                      setSolutionParagraphs(newParas);
                    }}
                    placeholder={`প্যারাগ্রাফ ${index + 1}... (LaTeX: $E=mc^2$)`}
                  />
                  {solutionParagraphs.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute -top-2 -right-2 opacity-0 group-hover/para:opacity-100 transition-opacity h-5 w-5 p-0 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                      onClick={() => setSolutionParagraphs(solutionParagraphs.filter(p => p.id !== para.id))}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSolutionParagraphs([...solutionParagraphs, { id: uuidv4(), text: '' }])}
                className="w-full border-dashed"
              >
                <Plus className="h-4 w-4 mr-1" />
                প্যারাগ্রাফ যোগ করুন
              </Button>
            </div>
          </div>

          <Tabs value={mcqType} onValueChange={(v: any) => setMcqType(v)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simple">সাধারণ MCQ</TabsTrigger>
              <TabsTrigger value="combined">বহুপদী সমাপ্তিসূচক</TabsTrigger>
            </TabsList>
            
            {/* --- SIMPLE MCQ FORM --- */}
            <TabsContent value="simple" className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <Label>অপশন সমূহ</Label>
                <Button onClick={addOption} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Add Option
                </Button>
              </div>
              {simpleOptions.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSimpleCorrect(option.id)}
                    className="px-2 shrink-0"
                  >
                    {option.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300" />
                    )}
                  </Button>
                  <span className="font-semibold text-sm w-6 shrink-0">
                    {['ক','খ','গ','ঘ'][index] || String.fromCharCode(65 + index)}.
                  </span>
                  <Input 
                    value={option.text}
                    onChange={(e) => updateSimpleOption(option.id, e.target.value)}
                    placeholder={`Option text...`}
                  />
                  {simpleOptions.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(option.id)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </TabsContent>

            {/* --- COMBINED MCQ FORM --- */}
            <TabsContent value="combined" className="space-y-6 mt-4">
              {/* Statements i, ii, iii */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">বিবৃতি সমূহ (Statements)</Label>
                {statements.map((stmt, idx) => (
                  <div key={stmt.id} className="flex items-center gap-2">
                    <span className="font-serif font-bold w-8 text-right pr-2">{['i','ii','iii'][idx]}.</span>
                    <Input 
                      value={stmt.text}
                      onChange={(e) => updateStatement(idx, e.target.value)}
                      placeholder={`বিবৃতি ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>

              {/* Combination Choices */}
              <div className="space-y-3 pt-2 border-t">
                <Label className="text-sm font-medium text-gray-700">সঠিক উত্তর বাছাই করুন</Label>
                <div className="grid grid-cols-2 gap-4">
                  {combinedChoices.map((choice, idx) => (
                    <Card key={choice.id} className={`p-3 border ${choice.isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-700">{choice.label}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleChoiceCorrect(idx)}
                          className="h-6 w-6 p-0 rounded-full"
                        >
                          {choice.isCorrect ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Circle className="h-5 w-5 text-gray-300" />}
                        </Button>
                      </div>
                      
                      {/* Clickable Badges to toggle i, ii, iii for this choice */}
                      <div className="flex gap-1 flex-wrap">
                        {['i', 'ii', 'iii'].map((roman, rIdx) => (
                          <Badge
                            key={rIdx}
                            variant={choice.optionIndices.includes(rIdx) ? "default" : "outline"}
                            className="cursor-pointer hover:bg-gray-200"
                            onClick={() => toggleChoiceOption(idx, rIdx)}
                          >
                            {roman}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-gray-500 text-center">
                        Preview: {choice.optionIndices.map(i => ['i', 'ii', 'iii'][i]).join(' ও ')}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button onClick={handleSubmit} className="w-full bg-[#009d6e] hover:bg-[#008a60]">
            Add Question
          </Button>
        </div>

        {/* Preview Side */}
        <div>
          <Label>Preview</Label>
          <Card className="p-6 mt-2 min-h-[400px] bg-white border-gray-200 shadow-sm">
            {questionText ? (
              <div className="space-y-4">
                <div className="font-semibold text-sm text-muted-foreground flex justify-between">
                  <span>Preview</span>
                  <span>Marks: {marks}</span>
                </div>
                
                {/* Question Text */}
                <MarkdownRenderer content={questionText} />

                {/* Specific Render for Combined Type */}
                {mcqType === 'combined' && (
                  <div className="pl-4 space-y-1 my-4">
                    {statements.map((s, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="font-serif">{['i','ii','iii'][i]}.</span>
                        <span>{s.text || '...'}</span>
                      </div>
                    ))}
                    <div className="font-medium mt-2 pt-2">নিচের কোনটি সঠিক?</div>
                  </div>
                )}

                {/* Options Grid */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {(mcqType === 'simple' ? simpleOptions : combinedChoices).map((opt: any, index) => (
                    <div
                      key={opt.id}
                      className={cn(
                        "p-3 rounded-lg border flex items-start gap-2",
                        opt.isCorrect ? "border-green-500 bg-green-50" : "border-gray-100"
                      )}
                    >
                      <span className="font-semibold text-sm min-w-[20px]">
                        {['ক','খ','গ','ঘ'][index]}.
                      </span>
                      {mcqType === 'simple' ? (
                        <MarkdownRenderer content={opt.text} />
                      ) : (
                        <span className="font-serif">
                          {opt.optionIndices.map((i: number) => ['i', 'ii', 'iii'][i]).join(' ও ')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {solutionParagraphs.some(p => p.text.trim()) && (
                  <div className="mt-6 pt-4 border-t">
                    <div className="font-semibold text-sm text-muted-foreground mb-2">
                      সমাধান (Solution):
                    </div>
                    <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-200 space-y-3">
                      {solutionParagraphs.filter(p => p.text.trim()).map((para, index) => (
                        <div key={para.id}>
                          <MarkdownRenderer content={para.text} />
                        </div>
                      ))}
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