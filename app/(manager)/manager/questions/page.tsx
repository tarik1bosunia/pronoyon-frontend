'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Filter,
  Download
} from 'lucide-react';

export default function QuestionsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const questions = [
    {
      id: 1,
      title: 'পদার্থবিজ্ঞান - নিউটনের প্রথম সূত্র ব্যাখ্যা করুন',
      subject: 'পদার্থবিজ্ঞান',
      chapter: 'অধ্যায় ৩ - গতিসূত্র',
      type: 'CQ',
      difficulty: 'মাঝারি',
      status: 'published',
      createdAt: '২ দিন আগে',
      views: 245
    },
    {
      id: 2,
      title: 'রসায়ন - জৈব যৌগের সাধারণ সংকেত কী?',
      subject: 'রসায়ন',
      chapter: 'অধ্যায় ৭ - জৈব রসায়ন',
      type: 'MCQ',
      difficulty: 'সহজ',
      status: 'published',
      createdAt: '৫ দিন আগে',
      views: 182
    },
    {
      id: 3,
      title: 'গণিত - সমাকলনের মৌলিক উপপাদ্য প্রমাণ করুন',
      subject: 'গণিত',
      chapter: 'অধ্যায় ৯ - সমাকলন',
      type: 'CQ',
      difficulty: 'কঠিন',
      status: 'draft',
      createdAt: '১ সপ্তাহ আগে',
      views: 0
    },
    {
      id: 4,
      title: 'জীববিজ্ঞান - কোষ বিভাজনের ধাপগুলি লিখুন',
      subject: 'জীববিজ্ঞান',
      chapter: 'অধ্যায় ২ - কোষবিদ্যা',
      type: 'CQ',
      difficulty: 'মাঝারি',
      status: 'published',
      createdAt: '৩ দিন আগে',
      views: 167
    },
  ];

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || q.status === activeTab;
    return matchesSearch && matchesTab;
  });

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

  const stats = {
    total: questions.length,
    published: questions.filter(q => q.status === 'published').length,
    draft: questions.filter(q => q.status === 'draft').length,
    totalViews: questions.reduce((sum, q) => sum + q.views, 0)
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">আমার প্রশ্ন</h2>
          <p className="text-gray-600 mt-1">আপনার তৈরি সব প্রশ্ন দেখুন এবং পরিচালনা করুন</p>
        </div>
        <Button className="bg-[#009d6e] hover:bg-[#008a60] shadow-md" onClick={() => window.location.href = '/manager/create'}>
          <Plus className="h-4 w-4 mr-2" />
          নতুন প্রশ্ন যোগ করুন
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">মোট প্রশ্ন</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-xl">
                <FileText className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">প্রকাশিত</p>
                <p className="text-3xl font-bold text-green-600">{stats.published}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-xl">
                <CheckCircle className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">খসড়া</p>
                <p className="text-3xl font-bold text-orange-600">{stats.draft}</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-xl">
                <Clock className="h-7 w-7 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">মোট ভিউ</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalViews}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-xl">
                <Eye className="h-7 w-7 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <Input
            placeholder="প্রশ্ন অনুসন্ধান করুন..."
            className="pl-12 h-12 text-base border-gray-300 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" className="border-gray-300 shadow-sm">
            <Filter className="h-4 w-4 mr-2" />
            ফিল্টার
          </Button>
          <Button variant="outline" size="lg" className="border-gray-300 shadow-sm">
            <Download className="h-4 w-4 mr-2" />
            এক্সপোর্ট
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            সব ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="published" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            প্রকাশিত ({stats.published})
          </TabsTrigger>
          <TabsTrigger value="draft" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            খসড়া ({stats.draft})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="p-16 text-center">
                  <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-2">কোনো প্রশ্ন পাওয়া যায়নি</p>
                  <p className="text-gray-600">নতুন প্রশ্ন যোগ করে শুরু করুন</p>
                </CardContent>
              </Card>
            ) : (
              filteredQuestions.map((question) => (
                <Card key={question.id} className="hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-[#009d6e]">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs font-semibold">{question.type}</Badge>
                          <Badge className={`${getDifficultyColor(question.difficulty)} text-xs font-semibold`}>
                            {question.difficulty}
                          </Badge>
                          {question.status === 'published' ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200 text-xs font-semibold">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              প্রকাশিত
                            </Badge>
                          ) : (
                            <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs font-semibold">
                              <Clock className="h-3 w-3 mr-1" />
                              খসড়া
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                          {question.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="font-semibold text-gray-700">{question.subject}</span>
                          <span className="text-gray-400">•</span>
                          <span>{question.chapter}</span>
                          <span className="text-gray-400">•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {question.createdAt}
                          </span>
                          {question.views > 0 && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="flex items-center gap-1 font-medium text-purple-600">
                                <Eye className="h-4 w-4" />
                                {question.views} ভিউ
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                          onClick={() => router.push(`/questions/${question.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          দেখুন
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                          onClick={() => router.push(`/questions/${question.id}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          সম্পাদনা
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                          onClick={() => {
                            if (confirm('এই প্রশ্নটি মুছে ফেলতে চান?')) {
                              console.log('Delete question:', question.id);
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
