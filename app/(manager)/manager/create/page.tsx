'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CreateQuestionPage() {
  const router = useRouter();
  const [questionType, setQuestionType] = useState<'MCQ' | 'CQ'>('MCQ');
  const [questionText, setQuestionText] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [marks, setMarks] = useState('1');
  const [options, setOptions] = useState([
    { id: 1, text: '', isCorrect: false },
    { id: 2, text: '', isCorrect: false },
    { id: 3, text: '', isCorrect: false },
    { id: 4, text: '', isCorrect: false },
  ]);

  const addOption = () => {
    setOptions([...options, { id: Date.now(), text: '', isCorrect: false }]);
  };

  const removeOption = (id: number) => {
    if (options.length > 2) {
      setOptions(options.filter(opt => opt.id !== id));
    }
  };

  const updateOption = (id: number, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const toggleCorrect = (id: number) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt));
  };

  const handleSubmit = (isDraft: boolean = false) => {
    // Validate
    if (!questionText.trim()) {
      toast.error('প্রশ্ন লিখুন');
      return;
    }
    if (!subject.trim()) {
      toast.error('বিষয় নির্বাচন করুন');
      return;
    }
    if (questionType === 'MCQ' && !options.some(opt => opt.isCorrect)) {
      toast.error('সঠিক উত্তর নির্বাচন করুন');
      return;
    }

    // TODO: Send to backend API
    console.log({
      type: questionType,
      text: questionText,
      subject,
      chapter,
      marks: parseInt(marks),
      options: questionType === 'MCQ' ? options : undefined,
      status: isDraft ? 'draft' : 'published'
    });

    toast.success(isDraft ? 'খসড়া সংরক্ষিত হয়েছে' : 'প্রশ্ন সফলভাবে তৈরি হয়েছে');
    router.push('/manager/questions');
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          ফিরে যান
        </Button>
        <h1 className="text-3xl font-bold">নতুন প্রশ্ন তৈরি করুন</h1>
        <p className="text-gray-600 mt-2">ডাটাবেস সমৃদ্ধ করতে প্রশ্ন যোগ করুন</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>প্রশ্নের বিবরণ</CardTitle>
          <CardDescription>প্রশ্নের তথ্য পূরণ করুন</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Type */}
          <div className="space-y-2">
            <Label>প্রশ্নের ধরন</Label>
            <Select value={questionType} onValueChange={(val: 'MCQ' | 'CQ') => setQuestionType(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MCQ">MCQ (বহুনির্বাচনী)</SelectItem>
                <SelectItem value="CQ">CQ (সৃজনশীল প্রশ্ন)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subject & Chapter */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>বিষয়</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="বিষয় নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="পদার্থবিজ্ঞান">পদার্থবিজ্ঞান</SelectItem>
                  <SelectItem value="রসায়ন">রসায়ন</SelectItem>
                  <SelectItem value="গণিত">গণিত</SelectItem>
                  <SelectItem value="জীববিজ্ঞান">জীববিজ্ঞান</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>অধ্যায়</Label>
              <Input
                placeholder="যেমন: অধ্যায় ১"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
              />
            </div>
          </div>

          {/* Marks */}
          <div className="space-y-2">
            <Label>নম্বর</Label>
            <Input
              type="number"
              min="1"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              className="w-32"
            />
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <Label>প্রশ্ন</Label>
            <Textarea
              placeholder="প্রশ্ন লিখুন..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* MCQ Options */}
          {questionType === 'MCQ' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>অপশন সমূহ</Label>
                <Button onClick={addOption} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  অপশন যোগ করুন
                </Button>
              </div>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-3">
                    <Button
                      variant={option.isCorrect ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCorrect(option.id)}
                      className={option.isCorrect ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {String.fromCharCode(65 + index)}
                    </Button>
                    <Input
                      placeholder={`অপশন ${String.fromCharCode(65 + index)}`}
                      value={option.text}
                      onChange={(e) => updateOption(option.id, e.target.value)}
                      className="flex-1"
                    />
                    {options.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(option.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                সঠিক উত্তরের অক্ষরে ক্লিক করুন
              </p>
            </div>
          )}

          {/* CQ Note */}
          {questionType === 'CQ' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                সৃজনশীল প্রশ্নের জন্য উদ্দীপক এবং উপ-প্রশ্নগুলি যুক্ত করার ফিচার শীঘ্রই আসছে।
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={() => handleSubmit(false)}
              className="flex-1 bg-[#009d6e] hover:bg-[#008a60]"
            >
              <Save className="h-4 w-4 mr-2" />
              প্রকাশ করুন
            </Button>
            <Button
              onClick={() => handleSubmit(true)}
              variant="outline"
              className="flex-1"
            >
              খসড়া হিসেবে সংরক্ষণ করুন
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
