"use client"

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, Plus, Filter, CheckCircle, 
  LayoutDashboard, GraduationCap, Layers, 
  Settings, LogOut, FileText, Users, Menu,
  X, ChevronDown, Maximize2
} from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PaperEditor } from '@/components/editor/PaperEditor';
import { Question } from '@/types/question';

// --- Types ---
type ViewMode = 'setup' | 'browse' | 'editor';

// --- Mock Data ---
const SUBJECTS_LIST = [
  "জীববিজ্ঞান ১ম পত্র",
  "জীববিজ্ঞান ২য় পত্র",
  "উচ্চতর গণিত ১ম পত্র",
  "উচ্চতর গণিত ২য় পত্র",
  "তথ্য ও যোগাযোগ প্রযুক্তি",
  "বাংলা ১ম পত্র"
];

const CHAPTERS_LIST = [
  "কোষ ও কোষের গঠন",
  "কোষ বিভাজন",
  "কোষ রসায়ন",
  "অণুজীব",
  "শৈবাল ও ছত্রাক",
  "ব্রায়োফাইটা ও টেরিডোফাইটা"
];

// --- Filter Data ---
const GENERAL_FILTERS = [
  "রিপিটেড বোর্ড প্রশ্ন",
  "গাণিতিক",
  "তত্ত্বীয়",
  "চিত্রযুক্ত প্রশ্ন",
  "বহুপদী সমাপ্তিসূচক",
  "অভিন্ন তথ্যভিত্তিক"
];

const BOARD_LIST = [
  "ঢাকা বোর্ড",
  "বরিশাল বোর্ড",
  "রাজশাহী বোর্ড",
  "দিনাজপুর বোর্ড",
  "ময়মনসিংহ বোর্ড",
  "যশোর বোর্ড",
  "সিলেট বোর্ড",
  "কুমিল্লা বোর্ড",
  "চট্টগ্রাম বোর্ড"
];

const TOPIC_FILTERS = [
  "কোষ, কোষপ্রাচীর, প্রোটোপ্লাজম",
  "সাইটোপ্লাজম ও অঙ্গাণু",
  "রাইবোজোম, গলজি বস্তু, লাইসোজোম, সেন্ট্রিওল",
  "মাইটোকন্ড্রিয়া",
  "ময়মনসিংহ বোর্ড", // Included as per image visual, though unusual for a topic list
  "প্লাস্টিড",
  "নিউক্লিয়াস, ক্রোমোজোম",
  "DNA, RNA",
  "DNA প্রতিলিপন, জিন ও জেনেটিক কোড",
  "ট্রান্সক্রিপশন ও ট্রান্সলেশন"
];

// --- Mock Questions Data ---
const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'mcq',
    text: 'বাংলাদেশের রাজধানী কোনটি?',
    marks: 1,
    options: [
      { id: 'o1', text: 'চট্টগ্রাম', isCorrect: false },
      { id: 'o2', text: 'ঢাকা', isCorrect: true },
      { id: 'o3', text: 'খুলনা', isCorrect: false },
      { id: 'o4', text: 'রাজশাহী', isCorrect: false },
    ],
    board: 'ঢাকা বোর্ড',
    year: '২০২৩'
  },
  {
    id: '4',
    type: 'cq',
    text: 'উদ্দীপক: মি. X একটি কোষ বিভাজন প্রক্রিয়া পর্যবেক্ষণ করলেন যেখানে ক্রোমোজোম সংখ্যা অর্ধেক হয়ে যায়।',
    marks: 10,
    subQuestions: [
      { id: 'sq1', label: 'ক', text: 'মিয়োসিস কী?', marks: 1 },
      { id: 'sq2', label: 'খ', text: 'মিয়োসিসকে হ্রাসমূলক বিভাজন বলা হয় কেন?', marks: 2 },
      { id: 'sq3', label: 'গ', text: 'উদ্দীপকের বিভাজনটির গুরুত্ব ব্যাখ্যা কর।', marks: 3 },
      { id: 'sq4', label: 'ঘ', text: 'উক্ত বিভাজন না থাকলে জীবজগতে কী সমস্যা হতো? বিশ্লেষণ কর।', marks: 4 },
    ],
    board: 'যশোর বোর্ড',
    year: '২০২০'
  }
];

export default function QuestionBankUI() {
  const [viewMode, setViewMode] = useState<ViewMode>('setup');
  const [selectedIds, setSelectedIds] = useState<string[]>(['4']); 
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // --- Actions ---
  
  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
  };

  const handleSetupComplete = () => {
    setViewMode('browse');
  };

  const handleSubmitQuestions = () => {
    if (selectedIds.length === 0) {
      alert("অনুগ্রহ করে অন্তত একটি প্রশ্ন সিলেক্ট করুন");
      return;
    }
    setViewMode('editor');
  };

  // --- Render Views ---

  if (viewMode === 'editor') {
    const selectedQuestions = mockQuestions.filter(q => selectedIds.includes(q.id));
    return (
      <PaperEditor 
        initialQuestions={selectedQuestions} 
        onBack={() => setViewMode('browse')} 
      />
    );
  }

  if (viewMode === 'setup') {
    return <SetupView onStart={handleSetupComplete} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <DashboardSidebar isSidebarOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">প্রশ্ন সিলেক্ট করুন</h2>
                <p className="text-gray-500 mt-1">প্রশ্নগুলো সিলেক্ট করে সাবমিট করলেই প্রশ্ন তৈরি হয়ে যাবে!</p>
              </div>

              <div className="space-y-4">
                {mockQuestions.map((q, index) => {
                  const isSelected = selectedIds.includes(q.id);
                  return (
                    <div 
                      key={q.id}
                      onClick={() => toggleSelection(q.id)}
                      className={cn(
                        "cursor-pointer transition-all duration-200 bg-white rounded-lg p-6 border shadow-sm hover:shadow-md relative overflow-hidden group",
                        isSelected 
                          ? "border-2 border-[#009d6e] ring-1 ring-[#009d6e]/20" 
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#009d6e]" />}
                      
                      <div className="flex justify-between items-start mb-4 pl-2">
                        <h3 className="text-lg font-semibold text-gray-800 flex gap-2">
                          <span>{index + 1}.</span>
                          <span>{q.text}</span>
                        </h3>
                        {isSelected && <CheckCircle className="h-5 w-5 text-[#009d6e]" />}
                      </div>

                      {q.type === 'mcq' && q.options && (
                        <div className="grid grid-cols-2 gap-y-3 gap-x-8 pl-6 text-gray-600">
                          {q.options.map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="font-medium text-gray-400 text-sm">
                                {['ক','খ','গ','ঘ'][idx]}.
                              </span>
                              <span>{opt.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 pl-6">
                          <Badge variant="secondary" className="bg-gray-100 font-normal">{q.board}</Badge>
                          <Badge variant="secondary" className="bg-gray-100 font-normal">{q.year}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-col items-center gap-4 pb-10">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md border">
                  <Button variant="ghost" size="sm" disabled>← পূর্ববর্তী</Button>
                  <span className="font-medium px-2">1 / 1</span>
                  <Button variant="ghost" size="sm" disabled>পরবর্তী →</Button>
                </div>
                
                <Button 
                  size="lg" 
                  onClick={handleSubmitQuestions}
                  className="bg-[#009d6e] hover:bg-[#008a60] text-white px-8 h-12 text-lg shadow-lg shadow-green-600/20"
                >
                  সাবমিট করুন
                </Button>
              </div>
            </div>
          </main>
          
          {/* Right Sidebar Filter - Updated to match image */}
          <aside className="w-80 bg-[#F3F4F6] p-4 overflow-y-auto hidden xl:block border-l space-y-4">
             {/* General Filters */}
             <Card className="p-4 shadow-sm border-none">
               <div className="space-y-3">
                 {GENERAL_FILTERS.map((filter, idx) => (
                   <div key={idx} className="flex items-center gap-2.5">
                     <Checkbox id={`gen-${idx}`} defaultChecked={idx === 0} className="border-gray-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" /> 
                     <label htmlFor={`gen-${idx}`} className="text-[13px] font-medium text-gray-700 cursor-pointer select-none leading-none">
                       {filter}
                     </label>
                   </div>
                 ))}
               </div>
             </Card>

             {/* Board Filters */}
             <Card className="p-4 shadow-sm border-none">
               <h3 className="font-semibold text-gray-800 mb-3 text-sm">বোর্ড</h3>
               <Select>
                 <SelectTrigger className="w-full mb-3 h-9 text-sm">
                   <SelectValue placeholder="Year" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="2023">2023</SelectItem>
                   <SelectItem value="2022">2022</SelectItem>
                 </SelectContent>
               </Select>
               <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                 {BOARD_LIST.map((board, idx) => (
                   <div key={idx} className="flex items-center gap-2.5">
                     <Checkbox id={`board-${idx}`} defaultChecked={idx === 0} className="border-gray-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" />
                     <label htmlFor={`board-${idx}`} className="text-[13px] font-medium text-gray-700 cursor-pointer select-none leading-none">
                       {board}
                     </label>
                   </div>
                 ))}
               </div>
             </Card>

             {/* Topic Filters */}
             <Card className="p-4 shadow-sm border-none">
               <h3 className="font-semibold text-gray-800 mb-3 text-sm leading-tight">টপিক - ১ম অধ্যায়: কোষ ও কোষের গঠন</h3>
               <div className="space-y-2.5">
                 {TOPIC_FILTERS.map((topic, idx) => (
                   <div key={idx} className="flex items-start gap-2.5">
                     <Checkbox id={`topic-${idx}`} defaultChecked={idx === 0} className="mt-0.5 border-gray-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 shrink-0" />
                     <label htmlFor={`topic-${idx}`} className="text-[13px] font-medium text-gray-700 cursor-pointer select-none leading-tight">
                       {topic}
                     </label>
                   </div>
                 ))}
               </div>
             </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

// --- Setup View Component ---

function SetupView({ onStart }: { onStart: () => void }) {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  
  // State for modals
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);

  // Logic: Oddhay disappears if multiple subjects are selected
  const shouldShowChapterField = selectedSubjects.length <= 1;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center font-sans">
      {/* Hero Header */}
      <div className="w-full h-[45vh] bg-[#082f49] flex flex-col items-center justify-start pt-16 relative">
        <div className="absolute top-6 left-6 flex gap-2">
           <div className="w-3 h-3 rounded-full bg-red-400"></div>
           <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
           <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center leading-tight">
          ১ ক্লিকে প্রশ্ন তৈরির সফটওয়্যার !
        </h1>
        <p className="text-blue-100 text-lg">আপনার ক্লাসে প্রযুক্তির শাখা বাড়ান !</p>
      </div>

      {/* Floating Form Card */}
      <div className="w-full max-w-xl px-4 -mt-32 z-10 pb-20">
        <Card className="bg-white p-8 shadow-2xl border-0 rounded-xl">
          <div className="text-center mb-6 border-b border-dashed border-gray-200 pb-6">
             <p className="text-gray-600 font-medium">নিচের ইনপুট ফিল্ড গুলো সিলেক্ট করে সাবমিট করুন</p>
             <div className="flex items-center justify-center gap-2 mt-2 text-sm text-green-600">
               <CheckCircle className="h-4 w-4" />
               <span>সর্বশেষ প্রশ্ন যুক্ত হয়েছে a day ago</span>
             </div>
          </div>

          <div className="space-y-5">
            {/* Exam Name */}
            <Input 
              placeholder="প্রোগ্রাম/পরীক্ষার নাম লিখুন *" 
              className="h-12 border-gray-300 bg-white text-base"
            />
            
            {/* Class Selection */}
            <Select>
              <SelectTrigger className="h-12 border-gray-300 bg-white">
                <SelectValue placeholder="শ্রেণি" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hsc">এইচএসসি</SelectItem>
                <SelectItem value="ssc">এসএসসি</SelectItem>
                <SelectItem value="admission">এডমিশন</SelectItem>
              </SelectContent>
            </Select>

            {/* Subject Multi-Select */}
            <div 
              onClick={() => setIsSubjectModalOpen(true)}
              className="h-12 border border-gray-300 rounded-md flex items-center justify-between px-3 cursor-pointer bg-white hover:bg-gray-50 transition-colors"
            >
              {selectedSubjects.length === 0 ? (
                <span className="text-muted-foreground">বিষয়</span>
              ) : (
                <span className="text-gray-900 truncate font-medium">
                  {selectedSubjects.join(', ')}
                </span>
              )}
              <Maximize2 className="h-4 w-4 text-gray-400" />
            </div>

            {/* Chapter Multi-Select (Conditional) */}
            {shouldShowChapterField && (
              <div 
                onClick={() => setIsChapterModalOpen(true)}
                className="h-12 border border-gray-300 rounded-md flex items-center justify-between px-3 cursor-pointer bg-white hover:bg-gray-50 transition-colors animate-in fade-in slide-in-from-top-2"
              >
                {selectedChapters.length === 0 ? (
                  <span className="text-muted-foreground">অধ্যায়</span>
                ) : (
                  <span className="text-gray-900 truncate font-medium">
                    {selectedChapters.join(', ')}
                  </span>
                )}
                <Maximize2 className="h-4 w-4 text-gray-400" />
              </div>
            )}

            {/* Type & Count Grid */}
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
                placeholder="100" 
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

      {/* Subject Selection Modal */}
      <MultiSelectModal 
        open={isSubjectModalOpen}
        onOpenChange={setIsSubjectModalOpen}
        title="বিষয় সিলেক্ট করুন"
        items={SUBJECTS_LIST}
        selectedItems={selectedSubjects}
        onSelectionChange={setSelectedSubjects}
      />

      {/* Chapter Selection Modal */}
      <MultiSelectModal 
        open={isChapterModalOpen}
        onOpenChange={setIsChapterModalOpen}
        title="অধ্যায় সিলেক্ট করুন"
        items={CHAPTERS_LIST}
        selectedItems={selectedChapters}
        onSelectionChange={setSelectedChapters}
      />
    </div>
  );
}

// --- Helper Component: Multi-Select Modal ---
interface MultiSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  items: string[];
  selectedItems: string[];
  onSelectionChange: (items: string[]) => void;
}

function MultiSelectModal({ 
  open, 
  onOpenChange, 
  title, 
  items, 
  selectedItems, 
  onSelectionChange 
}: MultiSelectModalProps) {
  // Local state for handling selections before confirming
  const [tempSelected, setTempSelected] = useState<string[]>(selectedItems);

  // Sync local state whenever the modal opens or selectedItems changes
  useEffect(() => {
    if (open) {
      setTempSelected(selectedItems);
    }
  }, [open, selectedItems]);

  const toggleItem = (item: string) => {
    setTempSelected(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item) 
        : [...prev, item]
    );
  };

  const handleConfirm = () => {
    onSelectionChange(tempSelected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-gray-50 flex flex-row items-center justify-between">
          <DialogTitle className="text-gray-700 font-bold text-lg">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="p-2 max-h-[300px] overflow-y-auto">
          {items.map((item) => {
            const isSelected = tempSelected.includes(item);
            return (
              <div 
                key={item} 
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors select-none",
                  isSelected ? "bg-green-50" : "hover:bg-gray-50"
                )}
                onClick={() => toggleItem(item)}
              >
                <div 
                  className={cn(
                    "h-5 w-5 rounded border border-gray-300 flex items-center justify-center transition-all",
                    isSelected ? "bg-[#009d6e] border-[#009d6e]" : "bg-white"
                  )}
                >
                  {isSelected && <CheckCircle className="h-3.5 w-3.5 text-white" />}
                </div>
                <span 
                  className={cn(
                    "text-sm font-medium leading-none flex-1",
                    isSelected ? "text-[#009d6e]" : "text-gray-700"
                  )}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex border-t divide-x">
          <button 
            className="flex-1 p-3 text-center font-medium text-[#009d6e] hover:bg-green-50 transition-colors"
            onClick={handleConfirm}
          >
            সিলেক্ট করুন ({tempSelected.length})
          </button>
          <button 
            className="flex-1 p-3 text-center font-medium text-red-500 hover:bg-red-50 transition-colors"
            onClick={() => onOpenChange(false)}
          >
            বন্ধ করুন
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DashboardSidebar({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  return (
    <aside className={cn("bg-white border-r transition-all duration-300 flex flex-col", isSidebarOpen ? "w-64" : "w-20")}>
      <div className="p-4 flex items-center gap-3 border-b h-16">
        <div className="w-8 h-8 bg-[#082f49] rounded-md flex items-center justify-center text-white shrink-0">
           <FileText className="h-5 w-5" />
        </div>
        {isSidebarOpen && <span className="font-bold text-xl text-[#082f49]">প্রশ্নব্যাংক</span>}
      </div>
      <nav className="p-4 space-y-2 flex-1">
        <NavItem icon={<LayoutDashboard />} label="ড্যাশবোর্ড" isActive isOpen={isSidebarOpen} />
        <NavItem icon={<Plus />} label="১ ক্লিকে প্রশ্ন তৈরি" isOpen={isSidebarOpen} />
        <NavItem icon={<Layers />} label="প্রশ্নভান্ডার" isOpen={isSidebarOpen} />
      </nav>
      <div className="p-4 border-t">
        <NavItem icon={<LogOut />} label="লগআউট" className="text-red-500" isOpen={isSidebarOpen} />
      </div>
    </aside>
  )
}

function DashboardHeader({ isSidebarOpen, setSidebarOpen }: any) {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!isSidebarOpen)}>
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-4">
         <div className="relative hidden md:block">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
           <Input className="pl-9 w-64 bg-gray-50 border-gray-200" placeholder="খুঁজুন..." />
         </div>
         <Button className="rounded-full w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 p-0">
           <Users className="h-5 w-5" />
         </Button>
      </div>
    </header>
  )
}

function NavItem({ icon, label, isActive, isOpen, className }: any) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
      isActive ? "bg-[#082f49] text-white" : "text-gray-600 hover:bg-gray-100",
      !isOpen && "justify-center px-2",
      className
    )}>
      <span className="shrink-0 h-5 w-5">{icon}</span>
      {isOpen && <span className="font-medium whitespace-nowrap">{label}</span>}
    </button>
  );
}