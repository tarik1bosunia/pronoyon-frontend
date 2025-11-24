"use client"

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, Plus, Filter, CheckCircle, 
  LayoutDashboard, GraduationCap, Layers, 
  Settings, LogOut, FileText, Users, Menu
} from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PaperEditor } from '@/components/editor/PaperEditor';
import { Question } from '@/types/question';

// --- Types ---
type ViewMode = 'setup' | 'browse' | 'editor';

// --- Mock Data (Expanded with Types) ---
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
    id: '2',
    type: 'mcq',
    text: 'সূর্য কেন আলো দেয়?',
    marks: 1,
    options: [
      { id: 'o1', text: 'তাপ বিকিরণ', isCorrect: false },
      { id: 'o2', text: 'নিউক্লিয়ার ফিউশন', isCorrect: true },
      { id: 'o3', text: 'রাসায়নিক বিক্রিয়া', isCorrect: false },
      { id: 'o4', text: 'কোনটিই নয়', isCorrect: false },
    ],
    board: 'রাজশাহী বোর্ড',
    year: '২০২২'
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
  const [selectedIds, setSelectedIds] = useState<string[]>(['4']); // Default pre-selected
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

  // 3. EDITOR VIEW (Final Step)
  if (viewMode === 'editor') {
    const selectedQuestions = mockQuestions.filter(q => selectedIds.includes(q.id));
    return (
      <PaperEditor 
        initialQuestions={selectedQuestions} 
        onBack={() => setViewMode('browse')} 
      />
    );
  }

  // 1. SETUP VIEW (First Step)
  if (viewMode === 'setup') {
    return <SetupView onStart={handleSetupComplete} />;
  }

  // 2. BROWSE VIEW (Middle Step)
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
                    
                    <div className="flex justify-between items-start mb-4 pl-2">
                      <h3 className="text-lg font-semibold text-gray-800 flex gap-2">
                        <span>{index + 1}.</span>
                        <span>{q.text}</span>
                      </h3>
                      {isSelected && <CheckCircle className="h-5 w-5 text-[#009d6e]" />}
                    </div>

                    {/* Options Preview */}
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

                    {/* Badges */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 pl-6">
                        <Badge variant="secondary" className="bg-gray-100 font-normal">{q.board}</Badge>
                        <Badge variant="secondary" className="bg-gray-100 font-normal">{q.year}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit Action */}
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
      </div>
      
      {/* Right Sidebar Filter (Static Mock) */}
      <aside className="w-80 bg-white border-l p-5 overflow-y-auto hidden xl:block">
         <div className="flex items-center justify-between mb-6">
           <h3 className="font-bold text-gray-800">ফিল্টার</h3>
           <Filter className="h-4 w-4 text-gray-500" />
         </div>
         <div className="space-y-4">
             <div className="space-y-2">
               <label className="text-sm font-medium">বোর্ড</label>
               <div className="space-y-2">
                 {['ঢাকা', 'রাজশাহী', 'যশোর'].map(b => (
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

// --- Sub Components ---

function SetupView({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
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

      <div className="w-full max-w-xl px-4 -mt-32 z-10">
        <Card className="bg-white p-8 shadow-2xl border-0 rounded-xl">
          <div className="text-center mb-6 border-b border-dashed border-gray-200 pb-6">
             <p className="text-gray-600 font-medium">নিচের ইনপুট ফিল্ড গুলো সিলেক্ট করে সাবমিট করুন</p>
          </div>
          <div className="space-y-5">
            <Input placeholder="পরীক্ষার নাম (যেমন: বার্ষিক পরীক্ষা)" className="h-12" />
            <Select>
              <SelectTrigger className="h-12"><SelectValue placeholder="এইচএসসি" /></SelectTrigger>
              <SelectContent><SelectItem value="hsc">এইচএসসি</SelectItem></SelectContent>
            </Select>
            <Button className="w-full h-12 bg-[#009d6e] hover:bg-[#008a60] text-lg mt-2" onClick={onStart}>
              প্রশ্ন তৈরি করুন
            </Button>
          </div>
        </Card>
      </div>
    </div>
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