import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';

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
      title: 'আমার প্রশ্নপত্র',
      value: '৪৫',
      change: '+৮',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'up'
    },
    {
      title: 'টিম সদস্য',
      value: '১২',
      change: '+২',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'up'
    },
    {
      title: 'রিভিউ প্রয়োজন',
      value: '৮',
      change: '0',
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: 'neutral'
    },
    {
      title: 'সম্পন্ন এই মাসে',
      value: '৩৮',
      change: '+১২',
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: 'up'
    },
  ];

  const quickActions = [
    {
      title: 'নতুন প্রশ্নপত্র',
      description: 'প্রশ্নপত্র তৈরি করুন',
      icon: Plus,
      href: '/questions/create',
      color: 'bg-[#009d6e] hover:bg-[#008a60]',
    },
    {
      title: 'প্রশ্ন রিভিউ',
      description: 'মুলতুবি রিভিউ দেখুন',
      icon: Eye,
      href: '/manager/reviews',
      color: 'bg-orange-600 hover:bg-orange-700',
    },
    {
      title: 'টিম ব্যবস্থাপনা',
      description: 'আপনার টিম পরিচালনা করুন',
      icon: Users,
      href: '/manager/team',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'রিপোর্ট দেখুন',
      description: 'কর্মক্ষমতা রিপোর্ট',
      icon: BarChart3,
      href: '/manager/reports',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  const pendingReviews = [
    {
      title: 'পদার্থবিজ্ঞান - অধ্যায় ৫',
      author: 'রহিম আহমেদ',
      questions: '১৫',
      time: '২ ঘণ্টা আগে',
      priority: 'high'
    },
    {
      title: 'রসায়ন - জৈব যৌগ',
      author: 'করিম হোসেন',
      questions: '২০',
      time: '৫ ঘণ্টা আগে',
      priority: 'medium'
    },
    {
      title: 'গণিত - সমাকলন',
      author: 'সালমা খাতুন',
      questions: '১২',
      time: '১ দিন আগে',
      priority: 'low'
    },
  ];

  const teamActivity = [
    {
      name: 'রহিম আহমেদ',
      action: 'নতুন প্রশ্ন যোগ করেছেন',
      count: '২৫ টি',
      status: 'active',
      avatar: 'RA'
    },
    {
      name: 'করিম হোসেন',
      action: 'প্রশ্নপত্র সম্পাদনা করেছেন',
      count: '৮ টি',
      status: 'active',
      avatar: 'KH'
    },
    {
      name: 'সালমা খাতুন',
      action: 'রিভিউ সম্পন্ন করেছেন',
      count: '১৫ টি',
      status: 'completed',
      avatar: 'SK'
    },
    {
      name: 'জামাল উদ্দিন',
      action: 'নতুন অধ্যায় যোগ করেছেন',
      count: '৩ টি',
      status: 'active',
      avatar: 'JU'
    },
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
        <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                আসসালামু আলাইকুম, {userName || 'ম্যানেজার'}! 👋
              </h2>
              <p className="text-blue-50 text-lg">
                আপনার টিম ভালো করছে। আজকের কাজের তালিকা দেখুন।
              </p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Reviews */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">রিভিউ প্রয়োজন</CardTitle>
                  <CardDescription>মুলতুবি রিভিউ তালিকা</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/manager/reviews'}
                >
                  সব দেখুন
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingReviews.map((review, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 group cursor-pointer"
                    onClick={() => window.location.href = `/manager/reviews/${index + 1}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {review.title}
                        </h3>
                        {review.priority === 'high' && (
                          <Flag className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">লেখক: {review.author}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{review.questions} প্রশ্ন</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {review.time}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      রিভিউ করুন
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
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="প্রশ্ন খুঁজুন..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full bg-[#009d6e] hover:bg-[#008a60]"
                  onClick={() => window.location.href = '/questions'}
                >
                  <Search className="h-4 w-4 mr-2" />
                  অনুসন্ধান করুন
                </Button>
              </CardContent>
            </Card>

            {/* Team Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  টিম কর্মক্ষমতা
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teamActivity.map((member, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-600">{member.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-blue-600">
                          {member.count}
                        </span>
                        {member.status === 'active' && (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                            সক্রিয়
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-blue-600 hover:text-blue-700"
                  onClick={() => window.location.href = '/manager/team'}
                >
                  টিম বিস্তারিত দেখুন
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
