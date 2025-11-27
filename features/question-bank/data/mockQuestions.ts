import { Question } from '@/types/question';

export const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'mcq',
    text: 'কোষের "পাওয়ার হাউস" (Power House) বলা হয় কোনটিকে?',
    marks: 1,
    options: [
      { id: 'o1', text: 'নিউক্লিয়াস', isCorrect: false },
      { id: 'o2', text: 'মাইটোকন্ড্রিয়া', isCorrect: true },
      { id: 'o3', text: 'প্লাস্টিড', isCorrect: false },
      { id: 'o4', text: 'গলগি বডি', isCorrect: false },
    ],
    board: 'ঢাকা বোর্ড',
    year: '২০২৩',
    topic: 'কোষ ও কোষের গঠন'
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
    year: '২০২২',
    topic: 'কোষ ও কোষের গঠন'
  },
  {
    id: '3',
    type: 'mcq',
    text: 'DNA তে থাকে— i. ডিঅক্সিরাইবোজ সুগার ii. ইউরাসিল ক্ষারক iii. ফসফরিক এসিড',
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
    year: '২০২১',
    topic: 'কোষ রসায়ন'
  },
  {
    id: '4',
    type: 'cq',
    text: 'উদ্দীপক: মি. X একটি কোষ বিভাজন প্রক্রিয়া পর্যবেক্ষণ করলেন যেখানে ক্রোমোজোম সংখ্যা অর্ধেক হয়ে যায়।',
    marks: 10,
    subQuestions: [
      { id: 'sq1', label: 'ক', text: 'মিয়োসিস কী?', marks: 1 },
      { id: 'sq2', label: 'খ', text: 'মিয়োসিসকে হ্রাসমূলক বিভাজন বলা হয় কেন?', marks: 2 },
      { id: 'sq3', label: 'গ', text: 'উদ্দীপকের বিভাজনটির গুরুত্ব ব্যাখ্যা কর।', marks: 3 },
      { id: 'sq4', label: 'ঘ', text: 'উক্ত বিভাজন না থাকলে জীবজগতে কী সমস্যা হতো? বিশ্লেষণ কর।', marks: 4 },
    ],
    board: 'সিলেট বোর্ড',
    year: '২০২০',
    topic: 'কোষ বিভাজন'
  },
  {
    id: '5',
    type: 'writing',
    text: 'নিচের প্রশ্নগুলোর উত্তর দাও:',
    marks: 15,
    subQuestions: [
      { id: 'w1', label: '1', text: 'নিউক্লিয়াসের গঠন ও কাজ বর্ণনা কর।', marks: 5 },
      { id: 'w2', label: '2', text: 'মাইটোকন্ড্রিয়াকে কেন কোষের শক্তিঘর বলা হয়? ব্যাখ্যা কর।', marks: 5 },
      { id: 'w3', label: '3', text: 'প্লাস্টিডের প্রকারভেদ আলোচনা কর।', marks: 5 },
    ],
    board: 'বরিশাল বোর্ড',
    year: '২০১৯',
    topic: 'কোষ ও কোষের গঠন'
  },
  {
    id: '6',
    type: 'mcq',
    text: 'ফটোসিন্থেসিস প্রক্রিয়ায় ক্লোরোফিল কোন তরঙ্গদৈর্ঘ্যের আলো সবচেয়ে বেশি শোষণ করে?',
    marks: 1,
    options: [
      { id: 'o6-1', text: 'সবুজ', isCorrect: false },
      { id: 'o6-2', text: 'নীল ও লাল', isCorrect: true },
      { id: 'o6-3', text: 'কমলা', isCorrect: false },
      { id: 'o6-4', text: 'হলুদ', isCorrect: false },
    ],
    board: 'ঢাকা বোর্ড',
    year: '২০২৩',
    topic: 'প্রকাশ সংশ্লেষণ'
  },
  {
    id: '7',
    type: 'mcq',
    text: 'গাছের কোন অংশে ট্রান্সপিরেশন প্রধানত সংঘটিত হয়?',
    marks: 1,
    options: [
      { id: 'o7-1', text: 'মূল', isCorrect: false },
      { id: 'o7-2', text: 'পুষ্প', isCorrect: false },
      { id: 'o7-3', text: 'পাতা', isCorrect: true },
      { id: 'o7-4', text: 'গুঁড়ি', isCorrect: false },
    ],
    board: 'রাজশাহী বোর্ড',
    year: '২০২২',
    topic: 'স্থিতিশীলতা'
  },
  {
    id: '8',
    type: 'mcq',
    text: 'মানবদেহে লোহিত রক্ত কণিকার আয়ু কত দিন?',
    marks: 1,
    options: [
      { id: 'o8-1', text: '৩০ দিন', isCorrect: false },
      { id: 'o8-2', text: '৬০ দিন', isCorrect: false },
      { id: 'o8-3', text: '১২০ দিন', isCorrect: true },
      { id: 'o8-4', text: '১৮০ দিন', isCorrect: false },
    ],
    board: 'চট্টগ্রাম বোর্ড',
    year: '২০২১',
    topic: 'রক্ত ও সঞ্চালন'
  },
  {
    id: '9',
    type: 'mcq',
    text: 'মিউটেশনের ফলে কী ঘটে?',
    marks: 1,
    options: [
      { id: 'o9-1', text: 'কোষ বিভাজন দ্রুত হয়', isCorrect: false },
      { id: 'o9-2', text: 'জেনেটিক পরিবর্তন ঘটে', isCorrect: true },
      { id: 'o9-3', text: 'প্রোটিন সংশ্লেষণ বন্ধ হয়', isCorrect: false },
      { id: 'o9-4', text: 'শর্করা ভাঙ্গন বৃদ্ধি পায়', isCorrect: false },
    ],
    board: 'যশোর বোর্ড',
    year: '২০২০',
    topic: 'জিনতত্ত্ব'
  },
  {
    id: '10',
    type: 'mcq',
    text: 'মানব অগ্ন্যাশয়ে নিঃসৃত ইনসুলিন হরমোনের মূল কাজ কী?',
    marks: 1,
    options: [
      { id: 'o10-1', text: 'রক্তচাপ নিয়ন্ত্রণ', isCorrect: false },
      { id: 'o10-2', text: 'রক্তে গ্লুকোজ নিয়ন্ত্রণ', isCorrect: true },
      { id: 'o10-3', text: 'মূল শোষণ বৃদ্ধি', isCorrect: false },
      { id: 'o10-4', text: 'বংশবিস্তার নিয়ন্ত্রণ', isCorrect: false },
    ],
    board: 'সিলেট বোর্ড',
    year: '২০১৯',
    topic: 'অন্ত:স্রাব গ্রন্থি'
  },
  {
    id: '11',
    type: 'mcq',
    text: 'রাইবোজোম কোথায় সংশ্লেষিত হয়?',
    marks: 1,
    options: [
      { id: 'o11-1', text: 'প্লাজমা মেমব্রেন', isCorrect: false },
      { id: 'o11-2', text: 'নিউক্লিওলাস', isCorrect: true },
      { id: 'o11-3', text: 'গলগি বডি', isCorrect: false },
      { id: 'o11-4', text: 'লিসোসোম', isCorrect: false },
    ],
    board: 'বরিশাল বোর্ড',
    year: '২০১৮',
    topic: 'কোষ অঙ্গাণু'
  },
  {
    id: '12',
    type: 'mcq',
    text: 'ভ্রূণগত বিকাশের কোন পর্যায়ে গ্যাসট্রুলেশন ঘটে?',
    marks: 1,
    options: [
      { id: 'o12-1', text: 'মোরুলা', isCorrect: false },
      { id: 'o12-2', text: 'ব্লাস্টুলা', isCorrect: false },
      { id: 'o12-3', text: 'গ্যাসট্রুলা', isCorrect: true },
      { id: 'o12-4', text: 'ফিটাল', isCorrect: false },
    ],
    board: 'দিনাজপুর বোর্ড',
    year: '২০২১',
    topic: 'ভ্রূণবিদ্যা'
  },
  {
    id: '13',
    type: 'mcq',
    text: 'মানবদেহে ভিটামিন D এর ঘাটতিতে কোন রোগ হয়?',
    marks: 1,
    options: [
      { id: 'o13-1', text: 'স্কার্ভি', isCorrect: false },
      { id: 'o13-2', text: 'রিকেটস', isCorrect: true },
      { id: 'o13-3', text: 'বেরি-বেরি', isCorrect: false },
      { id: 'o13-4', text: 'পেলাগ্রা', isCorrect: false },
    ],
    board: 'কুমিল্লা বোর্ড',
    year: '২০২২',
    topic: 'পুষ্টি ও খাদ্য'
  },
  {
    id: '14',
    type: 'mcq',
    text: 'ইকোসিস্টেমের শক্তি প্রবাহ কোন নিয়ম মেনে চলে?',
    marks: 1,
    options: [
      { id: 'o14-1', text: 'শক্তি সংরক্ষণ নিয়ম', isCorrect: true },
      { id: 'o14-2', text: 'ওহমের নিয়ম', isCorrect: false },
      { id: 'o14-3', text: 'বয়েলের নিয়ম', isCorrect: false },
      { id: 'o14-4', text: 'চার্লসের নিয়ম', isCorrect: false },
    ],
    board: 'ময়মনসিংহ বোর্ড',
    year: '২০২০',
    topic: 'পরিবেশবিদ্যা'
  },
  {
    id: '15',
    type: 'mcq',
    text: 'মানব কোষে মোট কত জোড়া ক্রোমোজোম থাকে?',
    marks: 1,
    options: [
      { id: 'o15-1', text: '২১ জোড়া', isCorrect: false },
      { id: 'o15-2', text: '২২ জোড়া', isCorrect: false },
      { id: 'o15-3', text: '২৩ জোড়া', isCorrect: true },
      { id: 'o15-4', text: '২৪ জোড়া', isCorrect: false },
    ],
    board: 'রংপুর বোর্ড',
    year: '২০২৩',
    topic: 'জিনতত্ত্ব'
  }
];
