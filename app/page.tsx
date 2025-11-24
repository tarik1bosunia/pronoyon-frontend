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
  X, ChevronDown, Maximize2, Check
} from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose
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
  "বাংলা ১ম পত্র",
  "বাংলা ২য় পত্র",
  "পদার্থবিজ্ঞান ১ম পত্র"
];

const CHAPTERS_LIST = [
  "কোষ ও কোষের গঠন",
  "কোষ বিভাজন",
  "কোষ রসায়ন",
  "অণুজীব",
  "শৈবাল ও ছত্রাক",
  "ব্রায়োফাইটা ও টেরিডোফাইটা",
  "নগ্নবীজী ও আবৃতবীজী উদ্ভিদ",
  " টিস্যু ও টিস্যুতন্ত্র",
  "উদ্ভিদ শারীরতত্ত্ব",
  "উদ্ভিদ প্রজনন",
  "জীবপ্রযুক্তি",
  "জীবের পরিবেশ, বিস্তার ও সংরক্ষণ"
];

// --- Mock Questions Data ---
const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'mcq',
    text: 'কোষের "পাওয়ার হাউস" (Power House) বলা হয় কোনটিকে?',
    marks: 1,
    options: [
      { id: 'o1', text: 'নিউক্লিয়াস', isCorrect: false },
      { id: 'o2', text: 'মাইটোকন্ড্রিয়া', isCorrect: true },
      { id: 'o3', text: 'প্লাস্টিড', isCorrect: false },
      { id: 'o4', text: 'গলগি বডি', isCorrect: false },
    ],
    board: 'ঢাকা বোর্ড',
    year: '২০২৩'
  },
  {
    id: '2',
    type: 'mcq',
    text: 'নিচের কোনটি আদিকোষের বৈশিষ্ট্য?',
    marks: 1,
    options: [
      { id: 'o1', text: 'সুগঠিত নিউক্লিয়াস থাকে', isCorrect: false },
      { id: 'o2', text: 'মাইটোকন্ড্রিয়া থাকে', isCorrect: false },
      { id: 'o3', text: 'রাইবোজোম ৭০S প্রকৃতির', isCorrect: true },
      { id: 'o4', text: 'কোষ বিভাজন মাইটোসিস প্রক্রিয়ায় হয়', isCorrect: false },
    ],
    board: 'রাজশাহী বোর্ড',
    year: '২০২২'
  },
  {
    id: '3',
    type: 'mcq',
    // Standard text fallback
    text: 'DNA তে থাকে— i. ডিঅক্সিরাইবোজ সুগার ii. ইউরাসিল ক্ষারক iii. ফসফরিক এসিড',
    // Structured Data for Combined MCQ
    stem: 'DNA তে থাকে—',
    romanStatements: [
      'ডিঅক্সিরাইবোজ সুগার',
      'ইউরাসিল ক্ষারক',
      'ফসফরিক এসিড'
    ],
    footer: 'নিচের কোনটি সঠিক?',
    marks: 1,
    options: [
      { id: 'c1', text: 'i ও ii', isCorrect: false },
      { id: 'c2', text: 'i ও iii', isCorrect: true },
      { id: 'c3', text: 'ii ও iii', isCorrect: false },
      { id: 'c4', text: 'i, ii ও iii', isCorrect: false },
    ],
    board: 'যশোর বোর্ড',
    year: '২০২১'
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
    board: 'সিলেট বোর্ড',
    year: '২০২০'
  }
];

export default function QuestionBankUI() {
  const [viewMode, setViewMode] = useState<ViewMode>('setup');
  const [selectedIds, setSelectedIds] = useState<string[]>(['1', '2', '3', '4']); 
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
                    
                    {/* UPDATED: Question Text Rendering to support Combined/Roman Questions */}
                    <div className="flex justify-between items-start mb-4 pl-2">
                      <div className="flex gap-2 text-lg font-semibold text-gray-800 w-full">
                        <span className="shrink-0">{index + 1}.</span>
                        <div className="flex flex-col w-full">
                          {/* Main Stem */}
                          <span>{q.stem || q.text}</span>
                          
                          {/* Roman Statements (Render if they exist) */}
                          {q.romanStatements && q.romanStatements.length > 0 && (
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-base font-normal text-gray-700">
                              {q.romanStatements.map((stmt, i) => (
                                <span key={i} className="whitespace-nowrap">
                                  {['i', 'ii', 'iii'][i]}. {stmt}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {isSelected && <CheckCircle className="h-6 w-6 text-[#009d6e] shrink-0 ml-2" />}
                    </div>

                    {/* Options Grid */}
                    {q.type === 'mcq' && q.options && (
                      <div className="grid grid-cols-2 gap-y-3 gap-x-8 pl-6 text-gray-600 mt-2">
                        {q.options.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-gray-400 min-w-[20px]">
                              {['ক','খ','গ','ঘ'][idx]}.
                            </span>
                            <span className="truncate">{opt.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer Badges */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 pl-6">
                        <Badge variant="secondary" className="bg-gray-100 font-normal hover:bg-gray-200">{q.board}</Badge>
                        <Badge variant="secondary" className="bg-gray-100 font-normal hover:bg-gray-200">{q.year}</Badge>
                        <Badge variant="outline" className="ml-auto text-gray-500">{q.type === 'mcq' ? 'MCQ' : 'Creative'}</Badge>
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
                সাবমিট করুন ({selectedIds.length})
              </Button>
            </div>
          </div>
        </main>
      </div>
      
      <aside className="w-80 bg-white border-l p-5 overflow-y-auto hidden xl:block">
         <div className="flex items-center justify-between mb-6">
           <h3 className="font-bold text-gray-800">ফিল্টার</h3>
           <Filter className="h-4 w-4 text-gray-500" />
         </div>
         <div className="space-y-4">
             <div className="space-y-2">
               <label className="text-sm font-medium">বোর্ড</label>
               <div className="space-y-2">
                 {['ঢাকা', 'রাজশাহী', 'যশোর', 'সিলেট', 'কুমিল্লা'].map(b => (
                   <div key={b} className="flex items-center gap-2">
                     <Checkbox id={b} /> <label htmlFor={b} className="text-sm text-gray-600">{b}</label>
                   </div>
                 ))}
               </div>
             </div>
         </div>
      </aside>
    </div>
  );
}

// ... (Rest of the components SetupView, MultiSelectModal, etc. remain unchanged) ...
function SetupView({ onStart }: { onStart: () => void }) {
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
          ১ ক্লিকে প্রশ্ন তৈরির সফটওয়্যার !
        </h1>
        <p className="text-blue-100 text-lg">আপনার ক্লাসে প্রযুক্তির শাখা বাড়ান !</p>
      </div>

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
                <span className="text-muted-foreground">বিষয়</span>
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
                  <span className="text-muted-foreground">অধ্যায়</span>
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
        title="বিষয় সিলেক্ট করুন"
        items={SUBJECTS_LIST}
        selectedItems={selectedSubjects}
        onSelectionChange={setSelectedSubjects}
      />

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

function MultiSelectModal({ 
  open, 
  onOpenChange, 
  title, 
  items, 
  selectedItems, 
  onSelectionChange 
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  items: string[];
  selectedItems: string[];
  onSelectionChange: (items: string[]) => void;
}) {
  const [tempSelection, setTempSelection] = useState<string[]>(selectedItems);

  useEffect(() => {
    if (open) {
      setTempSelection(selectedItems);
    }
  }, [open, selectedItems]);

  const toggleItem = (item: string) => {
    setTempSelection(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item) 
        : [...prev, item]
    );
  };

  const handleConfirm = () => {
    onSelectionChange(tempSelection);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-xl">
        <DialogHeader className="p-4 border-b bg-gray-50/50 flex flex-row items-center justify-between">
          <DialogTitle className="text-gray-700 font-bold text-lg">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="p-2 max-h-[400px] overflow-y-auto">
          {items.map((item) => {
            const isSelected = tempSelection.includes(item);
            return (
              <div 
                key={item}
                onClick={() => toggleItem(item)}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all select-none mx-1 my-1",
                  isSelected ? "bg-green-50 border border-green-100" : "hover:bg-gray-50 border border-transparent"
                )}
              >
                <div className={cn(
                  "h-5 w-5 rounded border flex items-center justify-center transition-colors",
                  isSelected ? "bg-[#009d6e] border-[#009d6e]" : "border-gray-300 bg-white"
                )}>
                  {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                </div>
                <span className={cn(
                  "text-sm font-medium flex-1",
                  isSelected ? "text-[#009d6e]" : "text-gray-700"
                )}>
                  {item}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 border-t divide-x">
          <button 
            onClick={handleConfirm}
            className="p-3 text-sm font-semibold text-white bg-[#009d6e] hover:bg-[#008a60] transition-colors"
          >
            সিলেক্ট করুন ({tempSelection.length})
          </button>
          <button 
            onClick={() => onOpenChange(false)}
            className="p-3 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
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