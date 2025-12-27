import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Maximize2, BookOpen, Zap, Shield, Users, LogOut } from 'lucide-react';
import { MultiSelectModal } from './MultiSelectModal';
import { SUBJECTS_LIST, CHAPTERS_LIST } from '../constants';
import { useLogoutMutation } from '@/lib/redux/services/authApi';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { logout as logoutAction } from '@/lib/redux/slices/authSlice';
import { toast } from 'sonner';
import type { RootState } from '@/lib/redux/store';

interface Props {
  onStart: () => void;
  isAuthenticated?: boolean;
}

export function SetupView({ onStart, isAuthenticated = false }: Props) {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((state: RootState) => state.auth.refresh);

  const showChapterField = selectedSubjects.length <= 1;

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await logout({ refresh: refreshToken }).unwrap();
      }
      dispatch(logoutAction());
      toast.success('লগআউট সফল হয়েছে');
      window.location.href = '/';
    } catch {
      // Even if the API call fails, logout locally
      dispatch(logoutAction());
      toast.success('লগআউট সফল হয়েছে');
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex flex-col items-center font-sans">
      {/* Header with Auth Buttons */}
      <header className="w-full bg-white border-b border-gray-200 shadow-sm" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-[#009d6e]" />
            <h2 className="text-2xl font-bold text-gray-900">Pronoyon</h2>
          </div>
          
          <div suppressHydrationWarning>
            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-[#009d6e] hover:bg-gray-100"
                  onClick={() => window.location.href = '/login'}
                >
                  লগইন
                </Button>
                <Button 
                  className="bg-[#009d6e] hover:bg-[#008a60] text-white shadow-md"
                  onClick={() => window.location.href = '/register'}
                >
                  রেজিস্টার করুন
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  className="bg-[#009d6e] hover:bg-[#008a60] text-white"
                  onClick={() => window.location.href = '/questions'}
                >
                  ড্যাশবোর্ড
                </Button>
                <Button 
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? 'লগআউট হচ্ছে...' : 'লগআউট'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="w-full bg-linear-to-br from-[#082f49] via-[#0c4a6e] to-[#075985] text-white pt-20 pb-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">দ্রুত ও সহজ প্রশ্ন তৈরি</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            ১ ক্লিকে প্রশ্ন তৈরির
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-blue-400">
              সফটওয়্যার !
            </span>
          </h1>
          
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            আপনার ক্লাসে প্রযুক্তির শাখা বাড়ান! হাজারো প্রশ্নের ব্যাংক থেকে সহজেই প্রশ্নপত্র তৈরি করুন
          </p>
          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium">১০,০০০০+ প্রশ্ন</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium">নিরাপদ ও সুরক্ষিত</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Users className="h-5 w-5 text-purple-400" />
              <span className="text-sm font-medium">৫০০+ শিক্ষক ব্যবহার করছেন</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="w-full max-w-4xl px-4 -mt-24 z-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: রেডি প্রশ্ন */}
          <Card className="bg-white p-8 shadow-xl border-0 rounded-2xl hover:shadow-2xl transition-shadow cursor-pointer group">
            <div className="flex flex-col items-center justify-center text-center h-full min-h-[200px]">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                <BookOpen className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">নিজে প্রশ্ন তৈরি করুন</h3>
            </div>
          </Card>



          {/* Card 2: ১ ক্লিকে প্রশ্ন তৈরি */}
          <Card 
            className="bg-white p-8 shadow-xl border-0 rounded-2xl hover:shadow-2xl transition-shadow cursor-pointer group relative overflow-hidden"
            onClick={onStart}
          >
            {/* <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              ৩৮—১২শ
            </div> */}
            <div className="flex flex-col items-center justify-center text-center h-full min-h-[200px]">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-50 transition-colors">
                <span className="text-4xl">+</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">১ ক্লিকে প্রশ্ন তৈরি</h3>
            </div>
          </Card>



          {/* Card 3: অনলাইন পরীক্ষা তৈরি */}
          <Card className="bg-white p-8 shadow-xl border-0 rounded-2xl hover:shadow-2xl transition-shadow cursor-pointer group">
            <div className="flex flex-col items-center justify-center text-center h-full min-h-[200px]">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-50 transition-colors">
                <Zap className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">অনলাইন পরীক্ষা তৈরি</h3>
            </div>
          </Card>

          {/* Card 4: OMR Evaluator */}
          <Card className="bg-white p-8 shadow-xl border-0 rounded-2xl hover:shadow-2xl transition-shadow cursor-pointer group">
            <div className="flex flex-col items-center justify-center text-center h-full min-h-[200px]">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-50 transition-colors">
                <CheckCircle className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">OMR Evaluator</h3>
            </div>
          </Card>


        </div>
      </div>

      {/* Footer Section */}
      <footer className="w-full bg-gray-900 text-gray-300 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-6 w-6 text-[#009d6e]" />
                <h3 className="text-xl font-bold text-white">Pronoyon</h3>
              </div>
              <p className="text-sm text-gray-400">
                শিক্ষকদের জন্য সবচেয়ে সহজ প্রশ্নপত্র তৈরির সফটওয়্যার
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">দ্রুত লিংক</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button 
                    onClick={() => window.location.href = '/about'}
                    className="hover:text-[#009d6e] transition-colors bg-transparent border-0 cursor-pointer p-0"
                  >
                    আমাদের সম্পর্কে
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.location.href = '/features'}
                    className="hover:text-[#009d6e] transition-colors bg-transparent border-0 cursor-pointer p-0"
                  >
                    ফিচার সমূহ
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.location.href = '/pricing'}
                    className="hover:text-[#009d6e] transition-colors bg-transparent border-0 cursor-pointer p-0"
                  >
                    মূল্য
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">যোগাযোগ</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-[#009d6e] transition-colors cursor-pointer">
                  support@pronoyon.com
                </li>
                <li className="hover:text-[#009d6e] transition-colors cursor-pointer">
                  +৮৮০ ১৭XX-XXXXXX
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Pronoyon. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
