'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search,
  Edit,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function DraftsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const drafts = [
    {
      id: 1,
      title: 'গণিত - সমাকলনের মৌলিক উপপাদ্য প্রমাণ করুন',
      subject: 'গণিত',
      chapter: 'অধ্যায় ৯ - সমাকলন',
      type: 'CQ',
      difficulty: 'কঠিন',
      lastEdited: '১ সপ্তাহ আগে',
      completion: 45
    },
    {
      id: 2,
      title: 'পদার্থবিজ্ঞান - বেগ এবং ত্বরণের মধ্যে পার্থক্য',
      subject: 'পদার্থবিজ্ঞান',
      chapter: 'অধ্যায় ১ - ভেক্টর',
      type: 'MCQ',
      difficulty: 'সহজ',
      lastEdited: '২ দিন আগে',
      completion: 80
    },
    {
      id: 3,
      title: 'রসায়ন - অ্যালকোহলের ধর্ম বর্ণনা করুন',
      subject: 'রসায়ন',
      chapter: 'অধ্যায় ৮ - জৈব যৌগ',
      type: 'CQ',
      difficulty: 'মাঝারি',
      lastEdited: '৪ দিন আগে',
      completion: 60
    },
  ];

  const filteredDrafts = drafts.filter(draft =>
    draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    draft.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'সহজ':
        return 'bg-green-100 text-green-800';
      case 'মাঝারি':
        return 'bg-orange-100 text-orange-800';
      case 'কঠিন':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompletionColor = (completion: number) => {
    if (completion >= 75) return 'bg-green-500';
    if (completion >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">খসড়া প্রশ্ন</h2>
          <p className="text-gray-600">অসমাপ্ত প্রশ্নগুলি সম্পাদনা করুন এবং প্রকাশ করুন</p>
        </div>
      </div>

      {/* Warning Card */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <p className="font-medium text-orange-900">খসড়া প্রশ্ন সম্পূর্ণ করুন</p>
              <p className="text-sm text-orange-800">
                আপনার {drafts.length} টি খসড়া প্রশ্ন আছে। এগুলি সম্পূর্ণ করে ডাটাবেস সমৃদ্ধ করতে সাহায্য করুন।
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="খসড়া প্রশ্ন অনুসন্ধান করুন..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Drafts List */}
      <div className="space-y-4">
        {filteredDrafts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium mb-2">কোনো খসড়া প্রশ্ন নেই</p>
              <p className="text-sm text-gray-500">সব প্রশ্ন সম্পূর্ণ হয়েছে! 🎉</p>
            </CardContent>
          </Card>
        ) : (
          filteredDrafts.map((draft) => (
            <Card key={draft.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{draft.type}</Badge>
                      <Badge className={getDifficultyColor(draft.difficulty)}>
                        {draft.difficulty}
                      </Badge>
                      <Badge className="bg-orange-100 text-orange-800">
                        <Clock className="h-3 w-3 mr-1" />
                        খসড়া
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {draft.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="font-medium">{draft.subject}</span>
                      <span>•</span>
                      <span>{draft.chapter}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {draft.lastEdited}
                      </span>
                    </div>

                    {/* Completion Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">সম্পূর্ণতা</span>
                        <span className="text-sm font-bold text-gray-900">{draft.completion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${getCompletionColor(draft.completion)}`}
                          style={{ width: `${draft.completion}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-blue-50 hover:bg-blue-100"
                      onClick={() => router.push(`/questions/${draft.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      সম্পাদনা করুন
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        if (confirm('এই খসড়াটি মুছে ফেলতে চান?')) {
                          console.log('Delete draft:', draft.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
