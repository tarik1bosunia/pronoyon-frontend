"use client"

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, Plus, Eye, BookOpen, 
  FileText, Users, Menu, Filter,
  CheckCircle, ChevronRight, LayoutDashboard,
  GraduationCap, Layers, Settings, LogOut
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils"; // Standard shadcn utility

// --- Mock Data ---
const mockQuestions = [
  {
    id: '1',
    text: 'বাংলাদেশের রাজধানী কোনটি?',
    options: ['চট্টগ্রাম', 'ঢাকা', 'খুলনা', 'রাজশাহী'],
    correct: 'ঢাকা',
    board: 'ঢাকা বোর্ড',
    year: '২০২৩',
    difficulty: 'Easy'
  },
  {
    id: '2',
    text: 'সূর্য কেন আলো দেয়?',
    options: ['তাপ বিকিরণ', 'পরমাণু বিস্ফোরণ', 'নিউক্লিয়ার ফিউশন', 'বৈদ্যুতিক তরঙ্গ'],
    correct: 'নিউক্লিয়ার ফিউশন',
    board: 'রাজশাহী বোর্ড',
    year: '২০২২',
    difficulty: 'Hard'
  },
  {
    id: '3',
    text: 'নোবেল পুরস্কার কবে থেকে প্রদান করা শুরু হয়?',
    options: ['১৮৯৫', '১৯০১', '১৯১০', '১৯২৫'],
    correct: '১৯০১',
    board: 'কুমিল্লা বোর্ড',
    year: '২০২১',
    difficulty: 'Medium'
  },
  {
    id: '4', // This one will be pre-selected to match the image
    text: 'বাংলা ভাষার প্রথম গ্রন্থ কোনটি?',
    options: ['মেঘনাদ বধ কাব্য', 'চর্যাপদ', 'গীতাঞ্জলি', 'সোনার তরী'],
    correct: 'চর্যাপদ',
    board: 'যশোর বোর্ড',
    year: '২০২০',
    difficulty: 'Hard'
  },
  {
    id: '5',
    text: 'বাংলাদেশের জাতীয় পতাকার রং কী কী?',
    options: ['লাল ও হলুদ', 'সবুজ ও লাল', 'নীল ও লাল', 'সবুজ ও সাদা'],
    correct: 'সবুজ ও লাল',
    board: 'দিনাজপুর বোর্ড',
    year: '২০১৯',
    difficulty: 'Easy'
  }
];

export default function QuestionBankUI() {
  const [viewMode, setViewMode] = useState<'setup' | 'browse'>('setup');
  
  // State for the questions added to the "cart" (Selected questions)
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>(['4']); 
  
  // Sidebar State
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Toggle selection of a question
  const toggleSelection = (id: string) => {
    setSelectedQuestions(prev => 
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {viewMode === 'setup' ? (
        <SetupView onStart={() => setViewMode('browse')} />
      ) : (
        <DashboardLayout 
          isSidebarOpen={isSidebarOpen} 
          setSidebarOpen={setSidebarOpen}
        >
          <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            
            {/* Main Content (Question List) */}
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-800">প্রশ্ন সিলেক্ট করুন</h2>
                  <p className="text-gray-500 mt-1">প্রশ্নগুলো সিলেক্ট করে সাবমিট করলেই প্রশ্ন তৈরি হয়ে যাবে!</p>
                </div>

                <div className="space-y-4">
                  {mockQuestions.map((q, index) => {
                    const isSelected = selectedQuestions.includes(q.id);
                    return (
                      <div 
                        key={q.id}
                        onClick={() => toggleSelection(q.id)}
                        className={cn(
                          "cursor-pointer transition-all duration-200 bg-white rounded-lg p-6 border shadow-sm hover:shadow-md relative overflow-hidden group",
                          isSelected 
                            ? "border-2 border-[#009d6e] ring-1 ring-[#009d6e]/20" // Green border when selected
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        {/* Selected Indicator Strip */}
                        {isSelected && (
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#009d6e]" />
                        )}

                        {/* Header */}
                        <div className="flex justify-between items-start mb-4 pl-2">
                          <h3 className="text-lg font-semibold text-gray-800 flex gap-2">
                            <span>{index + 1}.</span>
                            <span>{q.text}</span>
                          </h3>
                          {isSelected && <CheckCircle className="h-5 w-5 text-[#009d6e]" />}
                        </div>

                        {/* Options Grid - Matches Image 4 */}
                        <div className="grid grid-cols-2 gap-y-3 gap-x-8 pl-6 text-gray-600">
                          {q.options.map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="font-medium text-gray-400 text-sm">
                                {idx === 0 ? 'ক.' : idx === 1 ? 'খ.' : idx === 2 ? 'গ.' : 'ঘ.'}
                              </span>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>

                        {/* Footer Badges */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 pl-6">
                           <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500 hover:bg-gray-200 font-normal">
                              {q.board}
                           </Badge>
                           <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500 hover:bg-gray-200 font-normal">
                              {q.year}
                           </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination & Action */}
                <div className="mt-8 flex flex-col items-center gap-4 pb-10">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md border">
                    <Button variant="ghost" size="sm" disabled>← পূর্ববর্তী</Button>
                    <span className="font-medium px-2">1 / 2</span>
                    <Button variant="ghost" size="sm">পরবর্তী →</Button>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="bg-[#009d6e] hover:bg-[#008a60] text-white px-8 h-12 text-lg shadow-lg shadow-green-600/20"
                  >
                    সাবমিট করুন
                  </Button>
                </div>
              </div>
            </main>

            {/* Right Filter Sidebar - Matches Image 2 Right Side */}
            <aside className="w-80 bg-white border-l p-5 overflow-y-auto hidden xl:block">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800">ফিল্টার</h3>
                <Filter className="h-4 w-4 text-gray-500" />
              </div>

              <div className="space-y-6">
                {/* Board Filter */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-700">বোর্ড নির্বাচন</h4>
                  <div className="space-y-2">
                    {['ঢাকা বোর্ড', 'রাজশাহী বোর্ড', 'কুমিল্লা বোর্ড', 'যশোর বোর্ড'].map((b) => (
                      <div key={b} className="flex items-center space-x-2">
                        <Checkbox id={b} />
                        <label htmlFor={b} className="text-sm text-gray-600 cursor-pointer select-none">
                          {b}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Subject Filter */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-700">বিষয়</h4>
                  <div className="space-y-2">
                    {['জীববিজ্ঞান ১ম পত্র', 'জীববিজ্ঞান ২য় পত্র', 'পদার্থবিজ্ঞান'].map((s) => (
                      <div key={s} className="flex items-center space-x-2">
                        <Checkbox id={s} defaultChecked />
                        <label htmlFor={s} className="text-sm text-gray-600 cursor-pointer select-none">
                          {s}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Year Filter */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-700">সাল</h4>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="সব সাল" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">সব সাল</SelectItem>
                      <SelectItem value="2023">২০২৩</SelectItem>
                      <SelectItem value="2022">২০২২</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </aside>
          </div>
        </DashboardLayout>
      )}
    </div>
  );
}

// --- Sub-Components ---

// 1. Setup/Landing View (Based on Image 1)
function SetupView({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Dark Blue Hero Header */}
      <div className="w-full h-[45vh] bg-[#082f49] flex flex-col items-center justify-start pt-16 relative">
        {/* Mac-style dots decoration */}
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

      {/* Floating Card Form */}
      <div className="w-full max-w-xl px-4 -mt-32 z-10">
        <Card className="bg-white p-8 shadow-2xl border-0 rounded-xl">
          <div className="text-center mb-6 border-b border-dashed border-gray-200 pb-6">
             <p className="text-gray-600 font-medium">নিচের ইনপুট ফিল্ড গুলো সিলেক্ট করে সাবমিট করুন</p>
             <div className="flex items-center justify-center gap-2 mt-2 text-sm text-green-600">
               <CheckCircle className="h-4 w-4" />
               <span>সর্বশেষ প্রশ্ন যুক্ত হয়েছে 15 minutes ago</span>
             </div>
          </div>

          <div className="space-y-5">
            <Input 
              placeholder="বার্ষিক পরীক্ষা" 
              className="h-12 bg-white border-gray-300 text-base"
            />
            
            <Select>
              <SelectTrigger className="h-12 border-gray-300">
                <SelectValue placeholder="এইচএসসি" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hsc">এইচএসসি</SelectItem>
                <SelectItem value="ssc">এসএসসি</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="h-12 border-gray-300">
                <SelectValue placeholder="জীববিজ্ঞান ১ম পত্র" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bio1">জীববিজ্ঞান ১ম পত্র</SelectItem>
                <SelectItem value="phy1">পদার্থবিজ্ঞান ১ম পত্র</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="h-12 border-gray-300">
                <SelectValue placeholder="অধ্যায়" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ch1">কোষ ও কোষের গঠন</SelectItem>
                <SelectItem value="ch2">কোষ বিভাজন</SelectItem>
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Select>
                <SelectTrigger className="h-12 border-gray-300">
                  <SelectValue placeholder="টাইপ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">MCQ</SelectItem>
                  <SelectItem value="cq">CQ</SelectItem>
                </SelectContent>
              </Select>
              
              <Input placeholder="প্রশ্ন সংখ্যা" type="number" className="h-12 border-gray-300" />
            </div>

            <Button 
              className="w-full h-12 bg-[#009d6e] hover:bg-[#008a60] text-lg font-medium mt-2"
              onClick={onStart}
            >
              প্রশ্ন তৈরি করুন
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

// 2. Dashboard Shell (Sidebar + Header)
function DashboardLayout({ children, isSidebarOpen, setSidebarOpen }: any) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Matches Image 2 Left Side */}
      <aside className={cn(
        "bg-white border-r transition-all duration-300 flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
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
          <div className="pt-4 pb-2">
             {isSidebarOpen && <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">ম্যানেজমেন্ট</p>}
          </div>
          <NavItem icon={<FileText />} label="আমার তৈরি প্রশ্ন" isOpen={isSidebarOpen} />
          <NavItem icon={<GraduationCap />} label="অনলাইন পরীক্ষা" isOpen={isSidebarOpen} />
          <NavItem icon={<Users />} label="শিক্ষার্থী" isOpen={isSidebarOpen} />
        </nav>

        <div className="p-4 border-t">
          <NavItem icon={<Settings />} label="সেটিংস" isOpen={isSidebarOpen} />
          <NavItem icon={<LogOut />} label="লগআউট" className="text-red-500 hover:bg-red-50 hover:text-red-600" isOpen={isSidebarOpen} />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
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

        {children}
      </div>
    </div>
  );
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