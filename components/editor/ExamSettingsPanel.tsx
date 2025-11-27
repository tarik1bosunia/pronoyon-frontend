"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Copy, Wand2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ExamSettingsPanelProps {
  onBack?: () => void;
}

export const ExamSettingsPanel = ({ onBack }: ExamSettingsPanelProps) => {
  const { toast } = useToast();
  const [examName, setExamName] = useState('English');
  const [instruction, setInstruction] = useState('university of rajshahi');
  const [examCode, setExamCode] = useState('ENG-2025-01');
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [showGradingActions, setShowGradingActions] = useState(false);
  const [showSharingTools, setShowSharingTools] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://app.pronoyon/exams/english');
    toast({
      title: 'Link copied',
      description: 'The public share link is now in your clipboard.'
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-[#f3f6fb]">
      <div className="mx-auto max-w-6xl px-8 py-8 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Exam Settings</h1>
            <p className="text-sm text-slate-500">Configure everything about this exam from a single place.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {onBack && (
              <Button variant="outline" onClick={onBack} className="rounded-full">
                Back to Questions
              </Button>
            )}
            <Button variant="outline" className="rounded-full">
              Preview Exam
            </Button>
            <Button className="rounded-full bg-[#0e76fd] hover:bg-[#0a64d6] text-white">
              Save Changes
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Update the title and key details students see before joining.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="exam-name">Exam name</Label>
                <Input
                  id="exam-name"
                  value={examName}
                  onChange={(event) => setExamName(event.target.value)}
                  placeholder="Enter exam title"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instruction for the exam</Label>
                <Textarea
                  id="instructions"
                  value={instruction}
                  onChange={(event) => setInstruction(event.target.value)}
                  rows={5}
                  className="resize-none"
                  placeholder="Add details such as venue, duration, or instructions for candidates"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Exam Sections</CardTitle>
              <CardDescription>Enable or disable sections that appear alongside the question outline.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingToggle
                title="Show leaderboard section"
                description="Display the leaderboard panel beneath the outline."
                checked={showLeaderboard}
                onCheckedChange={setShowLeaderboard}
              />
              <SettingToggle
                title="Show grading actions"
                description="Expose grading shortcuts in the outline drawer."
                checked={showGradingActions}
                onCheckedChange={setShowGradingActions}
              />
              <SettingToggle
                title="Show sharing tools"
                description="Keep share exam controls visible under the outline."
                checked={showSharingTools}
                onCheckedChange={setShowSharingTools}
              />
            </CardContent>
            <CardFooter className="text-xs text-slate-500">
              These sections help teachers switch context quickly without leaving the outline view.
            </CardFooter>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Schedule & Access</CardTitle>
              <CardDescription>Control availability windows and access credentials.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start-date">Starts on</Label>
                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
                  <CalendarIcon className="h-4 w-4 text-slate-400" />
                  <input
                    id="start-date"
                    type="datetime-local"
                    className="flex-1 bg-transparent text-sm outline-none"
                    defaultValue="2025-02-01T09:30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">Ends on</Label>
                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
                  <CalendarIcon className="h-4 w-4 text-slate-400" />
                  <input
                    id="end-date"
                    type="datetime-local"
                    className="flex-1 bg-transparent text-sm outline-none"
                    defaultValue="2025-02-01T11:00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" placeholder="e.g. 01h 30m" defaultValue="02h 00m" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam-code">Exam code</Label>
                <div className="flex items-center rounded-md border border-slate-200 bg-white">
                  <Input
                    id="exam-code"
                    value={examCode}
                    onChange={(event) => setExamCode(event.target.value)}
                    className="border-0 h-11"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-11 px-3 text-xs font-medium text-slate-600"
                    onClick={() => setExamCode('ENG-2025-01')}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Wand2 className="h-4 w-4 text-slate-400" /> Auto-close the exam when the end time is reached.
              </div>
              <p>You can edit these values later — students will only see updated schedules when you publish.</p>
            </CardFooter>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Share exam link</CardTitle>
              <CardDescription>Distribute the exam to students with a secure link.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3">
                <Label className="text-xs uppercase text-slate-500">Public link</Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    readOnly
                    value="https://app.pronoyon/exams/english"
                    className="h-11 border-slate-200 bg-white text-sm"
                  />
                  <Button type="button" onClick={handleCopyLink} variant="secondary" className="h-11 px-4">
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3">
                <Label className="text-xs uppercase text-slate-500">Private access</Label>
                <div className="mt-2 grid gap-3">
                  <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
                    <span>Require access code</span>
                    <span className="font-medium text-slate-900">Enabled</span>
                  </div>
                  <Input readOnly value="RJSH-482910" className="h-11 border-slate-200 bg-white text-sm" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center gap-3">
              <Button variant="outline" className="rounded-full">
                Generate new link
              </Button>
              <Button className="rounded-full bg-[#0e76fd] hover:bg-[#0a64d6] text-white">
                Share with students
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface SettingToggleProps {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}

const SettingToggle = ({ title, description, checked, onCheckedChange }: SettingToggleProps) => {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-100 bg-white p-4 shadow-sm">
      <div>
        <p className="font-medium text-slate-900">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
};
