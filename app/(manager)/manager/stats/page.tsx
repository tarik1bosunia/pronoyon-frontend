'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  FileText,
  CheckCircle,
  Clock,
  Download,
  Calendar,
  Award,
  Target
} from 'lucide-react';

export default function StatsPage() {
  const performanceData = {
    thisMonth: {
      questionsCreated: 52,
      questionsPublished: 48,
      draftQuestions: 4,
      totalContribution: 892,
      avgCompletionTime: '২.৫ ঘণ্টা',
      qualityScore: 94
    },
    lastMonth: {
      questionsCreated: 38,
      questionsPublished: 35,
      draftQuestions: 3,
      totalContribution: 840,
      avgCompletionTime: '৩.২ ঘণ্টা',
      qualityScore: 91
    },
  };

  const subjectContribution = [
    { subject: 'পদার্থবিজ্ঞান', questions: 245, percentage: 27, target: 300 },
    { subject: 'রসায়ন', questions: 198, percentage: 22, target: 250 },
    { subject: 'গণিত', questions: 231, percentage: 26, target: 300 },
    { subject: 'জীববিজ্ঞান', questions: 218, percentage: 25, target: 250 },
  ];

  const monthlyTrend = [
    { month: 'জুলাই', questions: 42 },
    { month: 'আগস্ট', questions: 48 },
    { month: 'সেপ্টেম্বর', questions: 38 },
    { month: 'অক্টোবর', questions: 52 },
  ];

  const achievements = [
    { title: 'প্রথম ১০০ প্রশ্ন', date: 'জানুয়ারি ২০২৪', icon: Award },
    { title: 'মাসের সেরা অবদানকারী', date: 'মার্চ ২০২৪', icon: Award },
    { title: '৫০০ প্রশ্ন মাইলস্টোন', date: 'জুন ২০২৪', icon: Target },
  ];

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">পরিসংখ্যান এবং অগ্রগতি</h2>
          <p className="text-gray-600">আপনার অবদান এবং কর্মক্ষমতা দেখুন - ডাটাবেস সমৃদ্ধ করার যাত্রা</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          রিপোর্ট ডাউনলোড
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                parseFloat(calculateChange(performanceData.thisMonth.questionsCreated, performanceData.lastMonth.questionsCreated)) > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {parseFloat(calculateChange(performanceData.thisMonth.questionsCreated, performanceData.lastMonth.questionsCreated)) > 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="font-medium">
                  {Math.abs(parseFloat(calculateChange(performanceData.thisMonth.questionsCreated, performanceData.lastMonth.questionsCreated)))}%
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {performanceData.thisMonth.questionsCreated}
            </h3>
            <p className="text-sm text-gray-600">তৈরি প্রশ্ন (এই মাসে)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                parseFloat(calculateChange(performanceData.thisMonth.questionsPublished, performanceData.lastMonth.questionsPublished)) > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {parseFloat(calculateChange(performanceData.thisMonth.questionsPublished, performanceData.lastMonth.questionsPublished)) > 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="font-medium">
                  {Math.abs(parseFloat(calculateChange(performanceData.thisMonth.questionsPublished, performanceData.lastMonth.questionsPublished)))}%
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {performanceData.thisMonth.questionsPublished}
            </h3>
            <p className="text-sm text-gray-600">প্রকাশিত প্রশ্ন</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                parseFloat(calculateChange(performanceData.thisMonth.qualityScore, performanceData.lastMonth.qualityScore)) > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {parseFloat(calculateChange(performanceData.thisMonth.qualityScore, performanceData.lastMonth.qualityScore)) > 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="font-medium">
                  {Math.abs(parseFloat(calculateChange(performanceData.thisMonth.qualityScore, performanceData.lastMonth.qualityScore)))}%
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {performanceData.thisMonth.qualityScore}%
            </h3>
            <p className="text-sm text-gray-600">মানের স্কোর</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-50 p-3 rounded-lg">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-sm text-gray-600">
                মোট
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {performanceData.thisMonth.totalContribution}
            </h3>
            <p className="text-sm text-gray-600">সর্বমোট অবদান</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Tabs defaultValue="subject-wise">
        <TabsList>
          <TabsTrigger value="subject-wise">বিষয়ভিত্তিক</TabsTrigger>
          <TabsTrigger value="timeline">সময়রেখা</TabsTrigger>
          <TabsTrigger value="achievements">অর্জন</TabsTrigger>
        </TabsList>

        <TabsContent value="subject-wise" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>বিষয়ভিত্তিক অবদান</CardTitle>
              <CardDescription>প্রতিটি বিষয়ে আপনার মোট প্রশ্ন</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {subjectContribution.map((subject, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{subject.subject}</p>
                        <p className="text-sm text-gray-600">
                          {subject.questions}/{subject.target} প্রশ্ন ({subject.percentage}%)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{subject.questions}</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                        style={{ width: `${(subject.questions / subject.target) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>মাসিক প্রবণতা</CardTitle>
              <CardDescription>গত কয়েক মাসের অবদান</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyTrend.map((month, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium text-gray-700">
                      {month.month}
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-8 relative">
                        <div
                          className="bg-gradient-to-r from-[#009d6e] to-[#007a54] h-8 rounded-full flex items-center justify-end pr-3 text-white font-bold text-sm transition-all"
                          style={{ width: `${(month.questions / 60) * 100}%` }}
                        >
                          {month.questions}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">গড় সময়</p>
                  <p className="text-2xl font-bold text-blue-600">{performanceData.thisMonth.avgCompletionTime}</p>
                  <p className="text-xs text-gray-600">প্রতি প্রশ্ন</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">খসড়া</p>
                  <p className="text-2xl font-bold text-purple-600">{performanceData.thisMonth.draftQuestions}</p>
                  <p className="text-xs text-gray-600">অসমাপ্ত প্রশ্ন</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>আপনার অর্জন</CardTitle>
              <CardDescription>মাইলস্টোন এবং পুরস্কার</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                      <div className="bg-yellow-500 p-3 rounded-full">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{achievement.title}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {achievement.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
