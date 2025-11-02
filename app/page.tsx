'use client'
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { MCQForm } from '@/components/MCQForm';
import { CQForm } from '@/components/CQForm';
import { QuestionCard } from '@/components/QuestionCard';
import { Question, MCQOption, CQSubQuestion } from '@/types/question';
import { BookOpen, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleAddMCQ = (questionText: string, marks: number, options: MCQOption[]) => {
    const newQuestion: Question = {
      id: uuidv4(),
      type: 'mcq',
      questionText,
      marks,
      options,
      createdAt: new Date(),
    };
    setQuestions([newQuestion, ...questions]);
    toast({
      title: "MCQ Added!",
      description: "Multiple choice question added successfully",
    });
  };

  const handleAddCQ = (questionText: string, marks: number, subQuestions: CQSubQuestion[]) => {
    const newQuestion: Question = {
      id: uuidv4(),
      type: 'cq',
      questionText,
      marks,
      subQuestions,
      createdAt: new Date(),
    };
    setQuestions([newQuestion, ...questions]);
    toast({
      title: "CQ Added!",
      description: "Creative question added successfully",
    });
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    toast({
      title: "Question Deleted",
      description: "Question removed from your question bank",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Ready",
      description: "Question export functionality can be implemented",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Question Bank</h1>
                <p className="text-sm text-muted-foreground">
                  Create questions with Markdown & LaTeX support
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right mr-4">
                <div className="text-2xl font-bold">{questions.length}</div>
                <div className="text-xs text-muted-foreground">Questions</div>
              </div>
              <Button onClick={handleExport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Create Question Panel */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <Tabs defaultValue="mcq" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="mcq" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Multiple Choice (MCQ)
                  </TabsTrigger>
                  <TabsTrigger value="cq" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Creative Question (CQ)
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="mcq">
                  <MCQForm onSubmit={handleAddMCQ} />
                </TabsContent>

                <TabsContent value="cq">
                  <CQForm onSubmit={handleAddCQ} />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your Questions</h2>
              {questions.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {questions.filter(q => q.type === 'mcq').length} MCQ,{' '}
                  {questions.filter(q => q.type === 'cq').length} CQ
                </span>
              )}
            </div>

            {questions.length === 0 ? (
              <Card className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-2">No questions yet</h3>
                <p className="text-sm text-muted-foreground">
                  Create your first question using the forms above
                </p>
              </Card>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {questions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    onDelete={handleDeleteQuestion}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
