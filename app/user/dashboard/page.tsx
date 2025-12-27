"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserMenu } from '@/components/auth/UserMenu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, FileText, CheckCircle, Clock, Search, 
  Plus, Eye, Edit, Trash2, TrendingUp, BarChart3,
  Target, Award, Filter, ChevronRight, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { 
  useGetUserDraftsQuery, 
  useGetUserStatsQuery,
  useDeleteDraftMutation,
  useCreateDraftMutation
} from '@/lib/redux/services/questionsApi';
import { toast } from 'sonner';

// Mock data for completed question papers - Replace with actual API when available
const MOCK_COMPLETED = [
  {
    id: '1',
    title: 'পদার্থবিজ্ঞান ১ম পত্র - মডেল টেস্ট ১',
    class: 'HSC',
    subject: 'পদার্থবিজ্ঞান',
    totalMarks: 100,
    totalQuestions: 30,
    completedAt: '১ ঘন্টা আগে',
    score: 92,
    duration: '২ ঘন্টা',
    difficulty: 'medium'
  },
  {
    id: '2',
    title: 'রসায়ন ২য় পত্র - অধ্যায় ১-৩',
    class: 'HSC',
    subject: 'রসায়ন',
    totalMarks: 75,
    totalQuestions: 25,
    completedAt: '৩ ঘন্টা আগে',
    score: 75,
    duration: '১.৫ ঘন্টা',
    difficulty: 'easy'
  },
  {
    id: '3',
    title: 'গণিত - ক্যালকুলাস পূর্ণাঙ্গ পরীক্ষা',
    class: 'HSC',
    subject: 'গণিত',
    totalMarks: 100,
    totalQuestions: 15,
    completedAt: '১ দিন আগে',
    score: 85,
    duration: '৩ ঘন্টা',
    difficulty: 'hard'
  },
  {
    id: '4',
    title: 'জীববিজ্ঞান ১ম পত্র - বোর্ড প্রস্তুতি',
    class: 'HSC',
    subject: 'জীববিজ্ঞান',
    totalMarks: 100,
    totalQuestions: 35,
    completedAt: '২ দিন আগে',
    score: 88,
    duration: '২.৫ ঘন্টা',
    difficulty: 'medium'
  }
];

function DashboardPageContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch data from API
  const { data: statsData, isLoading: statsLoading } = useGetUserStatsQuery();
  const { data: draftsData, isLoading: draftsLoading, refetch: refetchDrafts } = useGetUserDraftsQuery({ 
    page: 1, 
    page_size: 10,
    search: searchQuery 
  });
  const [deleteDraft] = useDeleteDraftMutation();
  const [createDraft] = useCreateDraftMutation();

  // Handle URL query params for tab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab) setActiveTab(tab);
    }
  }, []);

  const stats = {
    totalDrafts: statsData?.total_drafts || 0,
    totalCompleted: statsData?.total_questions_completed || 0,
    thisWeek: statsData?.questions_this_week || 0,
    accuracy: statsData?.average_accuracy || 0
  };

  const drafts = draftsData?.results || [];

  const handleDeleteDraft = async (draftId: string) => {
    if (confirm('আপনি কি নিশ্চিত এই ড্রাফটটি মুছে ফেলতে চান?')) {
      try {
        await deleteDraft(draftId).unwrap();
        toast.success('ড্রাফট সফলভাবে মুছে ফেলা হয়েছে');
        refetchDrafts();
      } catch (error) {
        toast.error('ড্রাফট মুছতে ব্যর্থ হয়েছে');
      }
    }
  };

  const handleCreateDraft = async () => {
    const title = prompt('নতুন ড্রাফটের নাম লিখুন:');
    if (title) {
      try {
        await createDraft({ title }).unwrap();
        toast.success('নতুন ড্রাফট তৈরি করা হয়েছে');
        refetchDrafts();
      } catch (error) {
        toast.error('ড্রাফট তৈরি করতে ব্যর্থ হয়েছে');
      }
    }
  };

  const formatBanglaDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'এইমাত্র';
    if (diffHours < 24) return `${diffHours} ঘন্টা আগে`;
    if (diffDays < 7) return `${diffDays} দিন আগে`;
    return date.toLocaleDateString('bn-BD');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'hard':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  প্রণয়ন
                </span>
              </Link>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ড্যাশবোর্ড</h1>
          <p className="text-gray-600">আপনার অগ্রগতি এবং প্রশ্ন সংগ্রহ দেখুন</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-100">ড্রাফট পেপার</CardTitle>
                <FileText className="h-5 w-5 text-blue-100" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">
                {statsLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.totalDrafts}
              </div>
              <p className="text-xs text-blue-100">অসম্পূর্ণ প্রশ্নপত্র</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-100">সম্পূর্ণ পেপার</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-100" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">
                {statsLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.totalCompleted}
              </div>
              <p className="text-xs text-green-100">সম্পন্ন প্রশ্নপত্র</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-100">এই সপ্তাহে</CardTitle>
                <TrendingUp className="h-5 w-5 text-purple-100" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">
                {statsLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.thisWeek}
              </div>
              <p className="text-xs text-purple-100">নতুন পেপার তৈরি</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-orange-100">মোট প্রশ্ন</CardTitle>
                <Target className="h-5 w-5 text-orange-100" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">
                {statsLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.accuracy}
              </div>
              <p className="text-xs text-orange-100">সব পেপারে</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border shadow-sm p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              সারসংক্ষেপ
            </TabsTrigger>
            <TabsTrigger value="drafts" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              ড্রাফট পেপার ({stats.totalDrafts})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              সম্পূর্ণ পেপার ({stats.totalCompleted})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Drafts */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">সাম্প্রতিক ড্রাফট পেপার</CardTitle>
                      <CardDescription>আপনার শেষ সংরক্ষিত প্রশ্নপত্র</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/user/dashboard?tab=drafts">
                        সব দেখুন <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {draftsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      </div>
                    ) : drafts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        কোনো ড্রাফট পাওয়া যায়নি
                      </div>
                    ) : (
                      drafts.slice(0, 3).map((draft) => (
                        <div
                          key={draft.id}
                          className="p-4 rounded-lg border bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all cursor-pointer"
                          onClick={() => router.push(`/user/drafts/${draft.id}`)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{draft.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {draft.question_count} প্রশ্ন
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{draft.description || 'বিবরণ নেই'}</span>
                            <span className="text-gray-500">{formatBanglaDate(draft.updated_at)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">সম্পূর্ণ পেপার</CardTitle>
                      <CardDescription>আপনার সম্পন্ন প্রশ্নপত্র</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/user/dashboard?tab=completed">
                        সব দেখুন <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {MOCK_COMPLETED.slice(0, 3).map((paper) => (
                      <div
                        key={paper.id}
                        className="p-4 rounded-lg border bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                            {paper.title}
                          </h4>
                          <Badge variant="outline" className={cn("text-xs uppercase", getDifficultyColor(paper.difficulty))}>
                            {paper.difficulty === 'easy' ? 'সহজ' : paper.difficulty === 'medium' ? 'মাঝারি' : 'কঠিন'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-3">
                            <Badge variant="secondary" className="text-xs">
                              {paper.subject}
                            </Badge>
                            <span className="text-gray-600">{paper.totalQuestions} প্রশ্ন</span>
                          </div>
                          <span className={cn("font-semibold", getAccuracyColor(paper.score))}>
                            {paper.score}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Drafts Tab */}
          <TabsContent value="drafts" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">ড্রাফট প্রশ্নপত্র</CardTitle>
                    <CardDescription>আপনার অসম্পূর্ণ প্রশ্নপত্র</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="পেপার খুঁজুন..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" onClick={handleCreateDraft}>
                      <Plus className="mr-2 h-4 w-4" /> নতুন
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {draftsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                    </div>
                  ) : drafts.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 mb-4">আপনার কোনো ড্রাফট পেপার নেই</p>
                      <Button onClick={handleCreateDraft}>
                        <Plus className="mr-2 h-4 w-4" /> প্রথম পেপার তৈরি করুন
                      </Button>
                    </div>
                  ) : (
                    drafts.map((draft) => (
                      <div
                        key={draft.id}
                        className="p-5 rounded-xl border bg-gradient-to-r from-white to-gray-50 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                              {draft.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{draft.description || 'বিবরণ নেই'}</p>
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                              <span className="flex items-center">
                                <FileText className="h-4 w-4 mr-1" />
                                {draft.question_count} প্রশ্ন
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatBanglaDate(draft.updated_at)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/user/drafts/${draft.id}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteDraft(draft.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            তৈরি: {new Date(draft.created_at).toLocaleDateString('bn-BD')}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all"
                            onClick={() => router.push(`/user/drafts/${draft.id}`)}
                          >
                            বিস্তারিত দেখুন <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">সম্পূর্ণ প্রশ্নপত্র</CardTitle>
                    <CardDescription>আপনার সম্পন্ন প্রশ্নপত্র</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="পেপার খুঁজুন..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" /> ফিল্টার
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_COMPLETED.map((paper) => (
                    <div
                      key={paper.id}
                      className="p-5 rounded-xl border bg-gradient-to-r from-white to-gray-50 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {paper.class}
                            </Badge>
                            <Badge variant="outline" className={cn("text-xs uppercase", getDifficultyColor(paper.difficulty))}>
                              {paper.difficulty === 'easy' ? 'সহজ' : paper.difficulty === 'medium' ? 'মাঝারি' : 'কঠিন'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {paper.totalMarks} নম্বর
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {paper.totalQuestions} প্রশ্ন
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{paper.title}</h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <span className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {paper.subject}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {paper.duration} | {paper.completedAt}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className="text-right">
                            <div className={cn("text-3xl font-bold", getAccuracyColor(paper.score))}>
                              {paper.score}%
                            </div>
                            <p className="text-xs text-gray-500">{paper.score}/{paper.totalMarks}</p>
                          </div>
                          <Button size="sm" variant="outline" className="group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                            <Eye className="mr-1 h-4 w-4" /> বিস্তারিত
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function UserDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardPageContent />
    </ProtectedRoute>
  );
}
