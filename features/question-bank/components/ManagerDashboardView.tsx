import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Users, 
  FileText, 
  BarChart3, 
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Eye,
  Flag,
  Award,
  Calendar
} from 'lucide-react';
import { useLogoutMutation } from '@/lib/redux/services/authApi';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { logout as logoutAction } from '@/lib/redux/slices/authSlice';
import { toast } from 'sonner';
import type { RootState } from '@/lib/redux/store';


interface Props {
  userName?: string;
}

export function ManagerDashboardView({ userName }: Props) {
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((state: RootState) => state.auth.refresh);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await logout({ refresh: refreshToken }).unwrap();
      }
      dispatch(logoutAction());
      toast.success('লগআউট সফল হয়েছে');
      window.location.href = '/';
    } catch {
      dispatch(logoutAction());
      toast.success('লগআউট সফল হয়েছে');
      window.location.href = '/';
    }
  };

  const stats = [
    {
      title: 'আমার প্রশ্ন',
      value: '২৪৫',
      change: '+৩৮',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'up'
    },
    {
      title: 'এই সপ্তাহে যোগ',
      value: '৫২',
      change: '+১৫',
      icon: Plus,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'up'
    },
    {
      title: 'খসড়া প্রশ্ন',
      value: '১৮',
      change: '0',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: 'neutral'
    },
    {
      title: 'মোট অবদান',
      value: '৮৯২',
      change: '+৫৮',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: 'up'
    },
  ];

  const quickActions = [
    {
      title: 'নতুন প্রশ্ন যোগ করুন',
      description: 'একটি নতুন প্রশ্ন তৈরি করুন',
      icon: Plus,
      href: '/manager/create',
      color: 'bg-[#009d6e] hover:bg-[#008a60]',
    },
    {
      title: 'খসড়া প্রশ্ন',
      description: 'অসমাপ্ত প্রশ্ন সম্পাদনা করুন',
      icon: FileText,
      href: '/manager/drafts',
      color: 'bg-orange-600 hover:bg-orange-700',
    },
    {
      title: 'আমার প্রশ্ন',
      description: 'সব প্রশ্ন দেখুন এবং পরিচালনা করুন',
      icon: Eye,
      href: '/manager/questions',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'পরিসংখ্যান',
      description: 'আপনার অবদান দেখুন',
      icon: BarChart3,
      href: '/manager/stats',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  const recentQuestions = [
    {
      id: 1,
      title: 'পদার্থবিজ্ঞান - নিউটনের গতিসূত্র',
      subject: 'পদার্থবিজ্ঞান',
      chapter: 'অধ্যায় ৩',
      time: '২ ঘণ্টা আগে',
      status: 'published',
      type: 'MCQ'
    },
    {
      id: 2,
      title: 'রসায়ন - জৈব যৌগের নামকরণ',
      subject: 'রসায়ন',
      chapter: 'অধ্যায় ৭',
      time: '৫ ঘণ্টা আগে',
      status: 'published',
      type: 'CQ'
    },
    {
      id: 3,
      title: 'গণিত - সমাকলনের প্রয়োগ',
      subject: 'গণিত',
      chapter: 'অধ্যায় ৯',
      time: '১ দিন আগে',
      status: 'published',
      type: 'MCQ'
    }
  ];

  const subjectProgress = [
    {
      subject: 'পদার্থবিজ্ঞান',
      questions: 85,
      target: 100,
      percentage: 85,
      color: 'blue'
    },
    {
      subject: 'রসায়ন',
      questions: 72,
      target: 100,
      percentage: 72,
      color: 'green'
    },
    {
      subject: 'গণিত',
      questions: 68,
      target: 100,
      percentage: 68,
      color: 'purple'
    },
    {
      subject: 'জীববিজ্ঞান',
      questions: 45,
      target: 100,
      percentage: 45,
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pronoyon</h1>
                <p className="text-sm text-gray-500">ম্যানেজার ড্যাশবোর্ড</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <span>স্বাগতম,</span>
                <span className="font-semibold text-gray-900">{userName || 'ম্যানেজার'}</span>
              </div>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#009d6e] to-[#007a54] rounded-2xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                আসসালামু আলাইকুম, {userName || 'ম্যানেজার'}! 👋
              </h2>
              <p className="text-green-50 text-lg">
                ডাটাবেস সমৃদ্ধ করতে আজ নতুন প্রশ্ন যোগ করুন।
              </p>
              <Button 
                className="mt-4 bg-white text-[#009d6e] hover:bg-gray-100 font-semibold"
                onClick={() => window.location.href = '/manager/create'}
              >
                <Plus className="h-5 w-5 mr-2" />
                নতুন প্রশ্ন যোগ করুন
              </Button>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <Calendar className="h-8 w-8 mb-2 mx-auto" />
                <div className="text-2xl font-bold">{new Date().getDate()}</div>
                <div className="text-sm">
                  {new Date().toLocaleDateString('bn-BD', { month: 'short' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    {stat.trend !== 'neutral' && (
                      <div className={`flex items-center gap-1 text-sm ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className={`h-4 w-4 ${
                          stat.trend === 'down' ? 'rotate-180' : ''
                        }`} />
                        <span className="font-medium">{stat.change}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">দ্রুত কার্যক্রম</CardTitle>
            <CardDescription>আপনার দৈনন্দিন কাজ পরিচালনা করুন</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => window.location.href = action.href}
                    className={`${action.color} text-white p-6 rounded-xl hover:shadow-lg transition-all text-left group`}
                  >
                    <Icon className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-lg mb-1">{action.title}</h3>
                    <p className="text-sm text-white/90">{action.description}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Questions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">সাম্প্রতিক প্রশ্ন</CardTitle>
                  <CardDescription>আপনার সর্বশেষ যোগ করা প্রশ্ন</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/manager/questions'}
                >
                  সব দেখুন
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentQuestions.map((question) => (
                  <div 
                    key={question.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 group cursor-pointer"
                    onClick={() => window.location.href = `/questions/${question.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {question.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {question.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{question.subject} • {question.chapter}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          {question.status === 'published' ? (
                            <>
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span className="text-green-600">প্রকাশিত</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 text-orange-500" />
                              <span className="text-orange-600">খসড়া</span>
                            </>
                          )}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {question.time}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      দেখুন
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Search */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">দ্রুত অনুসন্ধান</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="প্রশ্ন খুঁজুন..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Subject Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  বিষয়ভিত্তিক অগ্রগতি
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjectProgress.map((subject, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{subject.subject}</p>
                        <p className="text-xs text-gray-600">
                          {subject.questions}/{subject.target} প্রশ্ন
                        </p>
                      </div>
                      <span className="text-sm font-bold text-gray-700">{subject.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          subject.color === 'blue' ? 'bg-blue-500' :
                          subject.color === 'green' ? 'bg-green-500' :
                          subject.color === 'purple' ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${subject.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-blue-600 hover:text-blue-700"
                  onClick={() => window.location.href = '/manager/stats'}
                >
                  বিস্তারিত পরিসংখ্যান
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
