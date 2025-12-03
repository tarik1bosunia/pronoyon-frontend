import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Shield,
  Zap,
  Database,
  Activity
} from 'lucide-react';
import { useLogoutMutation } from '@/lib/redux/services/authApi';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { logout as logoutAction } from '@/lib/redux/slices/authSlice';
import { toast } from 'sonner';
import type { RootState } from '@/lib/redux/store';
import { Input } from '@/components/ui/input';

interface Props {
  isAdmin: boolean;
  userName?: string;
}

export function AdminDashboardView({ isAdmin, userName }: Props) {
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
    } catch (error) {
      dispatch(logoutAction());
      toast.success('লগআউট সফল হয়েছে');
      window.location.href = '/';
    }
  };

  const stats = [
    {
      title: 'মোট প্রশ্ন',
      value: '১০,৫০০+',
      change: '+১২%',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'up'
    },
    {
      title: 'সক্রিয় ব্যবহারকারী',
      value: '৫৪৫',
      change: '+৮%',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'up'
    },
    {
      title: 'মোট ম্যানেজার',
      value: '২৮',
      change: '+৩',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: 'up'
    },
    {
      title: 'সিস্টেম স্ট্যাটাস',
      value: '৯৯.৯%',
      change: 'Uptime',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: 'up'
    },
  ];

  const quickActions = [
    {
      title: 'ব্যবহারকারী ব্যবস্থাপনা',
      description: 'ব্যবহারকারী ও ভূমিকা পরিচালনা',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'ম্যানেজার ব্যবস্থাপনা',
      description: 'ম্যানেজার নিয়োগ ও পরিচালনা',
      icon: Shield,
      href: '/admin/managers',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'সিস্টেম সেটিংস',
      description: 'অ্যাপ্লিকেশন কনফিগারেশন',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-700 hover:bg-gray-800',
    },
    {
      title: 'ডাটাবেস ব্যবস্থাপনা',
      description: 'ব্যাকআপ ও রক্ষণাবেক্ষণ',
      icon: Database,
      href: '/admin/database',
      color: 'bg-[#009d6e] hover:bg-[#008a60]',
    },
  ];

  const recentActivities = [
    {
      user: 'সিস্টেম',
      action: 'নতুন ম্যানেজার যোগ হয়েছে',
      subject: 'রহিম আহমেদ',
      time: '১০ মিনিট আগে',
      status: 'success'
    },
    {
      user: 'অ্যাডমিন',
      action: 'ব্যবহারকারী রোল আপডেট করেছেন',
      subject: 'করিম হোসেন',
      time: '৩০ মিনিট আগে',
      status: 'info'
    },
    {
      user: 'সিস্টেম',
      action: 'ব্যাকআপ সম্পন্ন হয়েছে',
      subject: 'ডাটাবেস',
      time: '১ ঘণ্টা আগে',
      status: 'success'
    },
    {
      user: 'মনিটরিং',
      action: 'উচ্চ ট্রাফিক সনাক্ত',
      subject: 'সিস্টেম পারফরম্যান্স',
      time: '২ ঘণ্টা আগে',
      status: 'warning'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#009d6e] p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pronoyon</h1>
                <p className="text-sm text-gray-500">
                  {isAdmin ? 'অ্যাডমিন ড্যাশবোর্ড' : 'ম্যানেজার ড্যাশবোর্ড'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <span>স্বাগতম,</span>
                <span className="font-semibold text-gray-900">{userName || 'অ্যাডমিন'}</span>
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
        <div className="bg-gradient-to-r from-[#009d6e] to-[#00b87c] rounded-2xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                আসসালামু আলাইকুম, {userName || 'অ্যাডমিন'}! 👋
              </h2>
              <p className="text-green-50 text-lg">
                আপনার সিস্টেম সুচারুভাবে চলছে। আজকের কার্যক্রম দেখুন।
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl font-bold">{new Date().getDate()}</div>
                <div className="text-sm">
                  {new Date().toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' })}
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
                    <div className={`flex items-center gap-1 text-sm ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`h-4 w-4 ${
                        stat.trend === 'down' ? 'rotate-180' : ''
                      }`} />
                      <span className="font-medium">{stat.change}</span>
                    </div>
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
            <CardDescription>সিস্টেম ব্যবস্থাপনা ও নিয়ন্ত্রণ</CardDescription>
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
          {/* Recent Activities */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">সিস্টেম কার্যক্রম</CardTitle>
                  <CardDescription>সিস্টেমের গুরুত্বপূর্ণ ঘটনা</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  ফিল্টার
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className={`p-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-100' :
                      activity.status === 'warning' ? 'bg-orange-100' : 'bg-blue-100'
                    }`}>
                      {activity.status === 'success' ? (
                        <CheckCircle className={`h-5 w-5 ${
                          activity.status === 'success' ? 'text-green-600' :
                          activity.status === 'warning' ? 'text-orange-600' : 'text-blue-600'
                        }`} />
                      ) : (
                        <AlertCircle className={`h-5 w-5 ${
                          activity.status === 'warning' ? 'text-orange-600' : 'text-blue-600'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.action}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{activity.subject}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-[#009d6e] hover:text-[#008a60]">
                সব কার্যক্রম দেখুন
              </Button>
            </CardContent>
          </Card>

          {/* Quick Search & System Status */}
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
                    placeholder="যেকোনো কিছু খুঁজুন..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    ব্যবহারকারী খুঁজুন
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    ম্যানেজার খুঁজুন
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Activity className="h-4 w-4 mr-2" />
                    লগ দেখুন
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">সিস্টেম স্ট্যাটাস</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">ডাটাবেস</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">সক্রিয়</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">API সার্ভার</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">সক্রিয়</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">স্টোরেজ</span>
                  </div>
                  <span className="text-sm font-medium text-yellow-600">৭৮%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">ক্যাশ</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">৪২%</span>
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  সিস্টেম রিপোর্ট
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
