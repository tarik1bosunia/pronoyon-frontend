import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Maximize2 } from 'lucide-react';
import { MultiSelectModal } from './MultiSelectModal';
import { SUBJECTS_LIST, CHAPTERS_LIST } from '../constants';

interface Props {
  onStart: () => void;
}

export function SetupView({ onStart }: Props) {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);

  const showChapterField = selectedSubjects.length <= 1;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center font-sans">
      <div className="w-full h-[45vh] bg-[#082f49] flex flex-col items-center justify-start pt-16 relative">
        <div className="absolute top-6 left-6 flex gap-2">
           <div className="w-3 h-3 rounded-full bg-red-400"></div>
           <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
           <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center leading-tight">
          ১ ক্লিকে প্রশ্ন তৈরির সফটওয়্যার !
        </h1>
        <p className="text-blue-100 text-lg">আপনার ক্লাসে প্রযুক্তির শাখা বাড়ান !</p>
      </div>

      <div className="w-full max-w-xl px-4 -mt-32 z-10 pb-20">
        <Card className="bg-white p-8 shadow-2xl border-0 rounded-xl">
          <div className="text-center mb-6 border-b border-dashed border-gray-200 pb-6">
             <p className="text-gray-600 font-medium">নিচের ইনপুট ফিল্ড গুলো সিলেক্ট করে সাবমিট করুন</p>
             <div className="flex items-center justify-center gap-2 mt-2 text-sm text-green-600">
               <CheckCircle className="h-4 w-4" />
               <span>সর্বশেষ প্রশ্ন যুক্ত হয়েছে a day ago</span>
             </div>
          </div>

          <div className="space-y-5">
            <Input 
              placeholder="প্রোগ্রাম/পরীক্ষার নাম লিখুন *" 
              className="h-12 border-gray-300 bg-white text-base focus-visible:ring-[#009d6e]"
            />
            
            <Select>
              <SelectTrigger className="h-12 border-gray-300 bg-white focus:ring-[#009d6e]">
                <SelectValue placeholder="শ্রেণি" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hsc">এইচএসসি</SelectItem>
                <SelectItem value="ssc">এসএসসি</SelectItem>
                <SelectItem value="admission">এডমিশন</SelectItem>
              </SelectContent>
            </Select>

            <div 
              onClick={() => setIsSubjectModalOpen(true)}
              className="h-12 border border-gray-300 rounded-md flex items-center justify-between px-3 cursor-pointer bg-white hover:bg-gray-50 transition-colors group"
            >
              {selectedSubjects.length === 0 ? (
                <span className="text-muted-foreground">বিষয়</span>
              ) : (
                <span className="text-gray-900 truncate font-medium">
                  {selectedSubjects.join(', ')}
                </span>
              )}
              <Maximize2 className="h-4 w-4 text-gray-400 group-hover:text-[#009d6e]" />
            </div>

            {showChapterField && (
              <div 
                onClick={() => setIsChapterModalOpen(true)}
                className="h-12 border border-gray-300 rounded-md flex items-center justify-between px-3 cursor-pointer bg-white hover:bg-gray-50 transition-colors group animate-in fade-in slide-in-from-top-2"
              >
                {selectedChapters.length === 0 ? (
                  <span className="text-muted-foreground">অধ্যায়</span>
                ) : (
                  <span className="text-gray-900 truncate font-medium">
                    {selectedChapters.join(', ')}
                  </span>
                )}
                <Maximize2 className="h-4 w-4 text-gray-400 group-hover:text-[#009d6e]" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Select>
                <SelectTrigger className="h-12 border-gray-300 bg-white">
                  <SelectValue placeholder="টাইপ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">MCQ</SelectItem>
                  <SelectItem value="cq">CQ</SelectItem>
                </SelectContent>
              </Select>
              
              <Input 
                placeholder="প্রশ্ন সংখ্যা" 
                defaultValue="100"
                type="number" 
                className="h-12 border-gray-300 bg-white" 
              />
            </div>

            <Button 
              className="w-full h-12 bg-[#009d6e] hover:bg-[#008a60] text-lg font-medium mt-4 shadow-md"
              onClick={onStart}
            >
              প্রশ্ন তৈরি করুন
            </Button>
          </div>
        </Card>
      </div>

      <MultiSelectModal 
        open={isSubjectModalOpen} 
        onOpenChange={setIsSubjectModalOpen}
        title="বিষয় সিলেক্ট করুন"
        items={SUBJECTS_LIST}
        selectedItems={selectedSubjects}
        onSelectionChange={setSelectedSubjects}
      />

      <MultiSelectModal 
        open={isChapterModalOpen} 
        onOpenChange={setIsChapterModalOpen}
        title="অধ্যায় সিলেক্ট করুন"
        items={CHAPTERS_LIST}
        selectedItems={selectedChapters}
        onSelectionChange={setSelectedChapters}
      />
    </div>
  );
}
