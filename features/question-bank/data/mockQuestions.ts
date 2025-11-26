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
    year: '২০২১'
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
    year: '২০২০'
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
    year: '২০১৯'
  }
];
