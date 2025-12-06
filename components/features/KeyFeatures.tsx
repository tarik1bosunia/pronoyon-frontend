'use client';

import { useState } from 'react';
import { 
  Infinity, 
  BookOpen, 
  ListOrdered, 
  Filter, 
  FileDown, 
  Upload,
  Radio,
  Zap,
  BarChart3,
  Settings,
  Printer,
  Clock,
  List,
  GraduationCap,
  HelpCircle,
  ChevronDown,
  X
} from 'lucide-react';

const features = [
  {
    icon: Infinity,
    title: 'আনলিমিটেড প্রশ্নপত্র',
    description: 'পাবলিক অনুমোদিত মেয়াদে যত খুশি প্রশ্ন বানাতে পারবেন',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: BookOpen,
    title: 'সব বিষয় ও ক্লাস কভার',
    description: 'তৃতীয় শ্রেণি থেকে দ্বাদশ শ্রেণী পর্যন্ত সব বিষয় অন্তর্ভুক্ত',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: ListOrdered,
    title: 'অধ্যায়ভিত্তিক সিলেকশন',
    description: 'ক্লাস, বিষয় ও অধ্যায় বেছে নিজের মতো প্রশ্ম তৈরি',
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    icon: Filter,
    title: 'বোর্ডের প্রশ্ম ফিল্টার',
    description: 'বিভিন্ন শিক্ষা বোর্ডের প্রশ্ম আলাদাভাবে ফিল্টার করুন',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: FileDown,
    title: 'পিডিএফ এক্সপোর্ট সুবিধা',
    description: 'প্রশ্নপত্র তৈরি করে সাথে সাথে PDF আকারে ডাউনলোড করুন',
    color: 'bg-pink-100 text-pink-600'
  },
  {
    icon: Upload,
    title: 'আলাদা উত্তরপত্র',
    description: 'প্রশ্নপত্রের পাশাপাশি আলাদা উত্তরপত্র—ডাউনলোড ও প্রিন্ট',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Radio,
    title: 'অনলাইন পরীক্ষা',
    description: 'MCQ পরীক্ষা অনলাইনে নিন, সাথে সাথে রেজাল্ট দেখুন',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Zap,
    title: 'অফলাইন পরীক্ষা',
    description: 'অফলাইনে পরীক্ষার জন্য প্রশ্নপত্র প্রিন্ট করুন',
    color: 'bg-violet-100 text-violet-600'
  },
  {
    icon: BarChart3,
    title: 'রেজাল্ট বিশ্লেষণ',
    description: 'পরীক্ষার পর রেজাল্ট বিশ্লেষণ ও গ্রাফিকাল রিপোর্ট দেখুন',
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    icon: Settings,
    title: 'কাস্টমাইজেশন অপশন',
    description: 'প্রতিষ্ঠানের নাম, সময়/পূর্ণমান, একাধিক সেট, কলাম ও ফন্ট সাইজ পরিবর্তন, জলছাপ',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Printer,
    title: 'হবহু প্রিন্ট রেজাল্ট',
    description: 'PDF যেমন দেখাবে, প্রিন্টও ঠিক তেমনই হবে',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Clock,
    title: 'সবসময় এক্সেসযোগ্য',
    description: 'যেকোনো সময়, যেকোনো জায়গা থেকে ব্যবহার করা যাবে',
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    icon: List,
    title: 'সবচেয়ে বড় প্রশ্ম বাংক',
    description: 'বাংলাদেশের সবচেয়ে বড় প্রশ্মের ডাটাবেজ আমাদের কাছে',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: GraduationCap,
    title: 'টিচার-ফ্রেন্ডলি সার্ভিস',
    description: 'শিক্ষকদের সময় বাঁচাতে বিশেষভাবে ডিজাইনকৃত',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: HelpCircle,
    title: 'লাইভ সেশন ও সাপোর্ট',
    description: 'নিয়মিত লাইভ সেশনে জটিল বিষয় বুঝে নেওয়ার সুযোগ',
    color: 'bg-indigo-100 text-indigo-600'
  }
];

export function KeyFeatures() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Version - Side by side with login */}
      <div className="hidden lg:block w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-6">Key Features</h2>
          <div className="grid grid-cols-1 gap-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-purple-50 transition-all duration-200 hover:shadow-sm"
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm mb-0.5 leading-tight">{feature.title}</h3>
                  {feature.description && (
                    <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Version - Floating Button */}
      <div className="lg:hidden">
        {/* Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-3 shadow-2xl flex items-center gap-2 font-semibold transition-all"
        >
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          Features
        </button>

        {/* Modal/Sheet */}
        {isOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Content Sheet */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto animate-slide-up">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
                <h2 className="text-2xl font-bold text-purple-900">Key Features</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Features List */}
              <div className="p-6 space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50"
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      {feature.description && (
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </>
  );
}
