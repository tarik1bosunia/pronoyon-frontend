'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  UserMinus, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useGetUserStatsQuery } from '@/lib/redux/services/usersApi';
import { useGetPaymentStatsQuery } from '@/lib/redux/services/paymentsApi';

export function AdminOverview() {
  // Fetch data from backend
  const { data: userStats, isLoading: isLoadingUsers, error: userError } = useGetUserStatsQuery();
  const { data: paymentStats, isLoading: isLoadingPayments, error: paymentError } = useGetPaymentStatsQuery();

  // Loading state
  if (isLoadingUsers || isLoadingPayments) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-slate-200/80">
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Error state
  if (userError || paymentError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load dashboard data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // Calculate stats from API data
  const stats = [
    {
      title: 'Total Users',
      value: userStats?.total_users?.toLocaleString() || '0',
      change: `${userStats?.new_users_percentage || 0}%`,
      trend: (userStats?.new_users_percentage || 0) >= 0 ? 'up' : 'down',
      icon: Users,
      description: `${userStats?.active_users || 0} active users`,
    },
    {
      title: 'Total Revenue',
      value: `৳${parseFloat(paymentStats?.total_revenue || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${paymentStats?.revenue_percentage_change || 0}%`,
      trend: (paymentStats?.revenue_percentage_change || 0) >= 0 ? 'up' : 'down',
      icon: DollarSign,
      description: `${paymentStats?.completed_transactions || 0} completed`,
    },
    {
      title: 'Pending Transactions',
      value: paymentStats?.pending_transactions?.toLocaleString() || '0',
      change: 'Processing',
      trend: 'neutral',
      icon: CreditCard,
      description: 'Awaiting completion',
    },
    {
      title: 'Avg Transaction',
      value: `৳${parseFloat(paymentStats?.average_transaction || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: 'Per order',
      trend: 'neutral',
      icon: TrendingUp,
      description: `${paymentStats?.total_transactions || 0} total`,
    },
  ];

  const roleBreakdown = userStats?.role_distribution?.map((role) => ({
    role: role.role_name,
    count: role.count,
    percentage: role.percentage,
    accent: role.role_slug === 'admin' ? 'bg-red-500' : 
             role.role_slug === 'manager' ? 'bg-blue-500' : 'bg-emerald-500',
  })) || [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-slate-200/80 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1">
                {stat.trend === 'up' ? (
                  <span className="text-emerald-600 inline-flex items-center gap-1 font-medium">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.change} vs last week
                  </span>
                ) : stat.trend === 'down' ? (
                  <span className="text-rose-600 inline-flex items-center gap-1 font-medium">
                    <ArrowDownRight className="h-3 w-3" />
                    {stat.change} vs last week
                  </span>
                ) : (
                  <span className="text-slate-600">{stat.change}</span>
                )}
              </p>
              <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Payment Overview Section */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200/80 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Payment Statistics
            </CardTitle>
            <CardDescription>Overview of financial transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-100 bg-emerald-50/50 px-4 py-3">
                <p className="text-xs text-slate-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {paymentStats?.completed_transactions || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  ৳{parseFloat(paymentStats?.total_revenue || '0').toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-amber-50/50 px-4 py-3">
                <p className="text-xs text-slate-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-amber-700">
                  {paymentStats?.pending_transactions || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">In progress</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-rose-50/50 px-4 py-3">
                <p className="text-xs text-slate-600 mb-1">Failed</p>
                <p className="text-2xl font-bold text-rose-700">
                  {paymentStats?.failed_transactions || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">Issues occurred</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-blue-50/50 px-4 py-3">
                <p className="text-xs text-slate-600 mb-1">Refunded</p>
                <p className="text-2xl font-bold text-blue-700">
                  {paymentStats?.refunded_transactions || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">Money returned</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-sm text-slate-600">Top-ups (Credit)</span>
                <span className="text-sm font-semibold text-slate-900">
                  {paymentStats?.top_up_count || 0} transactions
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-sm text-slate-600">Debits (Withdrawals)</span>
                <span className="text-sm font-semibold text-slate-900">
                  {paymentStats?.debit_count || 0} transactions
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2">
                <span className="text-sm text-emerald-700 font-medium">Revenue This Week</span>
                <span className="text-sm font-bold text-emerald-800">
                  ৳{parseFloat(paymentStats?.revenue_this_week || '0').toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              User Role Distribution
            </CardTitle>
            <CardDescription>Platform access breakdown by role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {roleBreakdown.length > 0 ? (
              roleBreakdown.map((item) => (
                <div 
                  key={item.role} 
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${item.accent}`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.role}</p>
                      <p className="text-xs text-slate-500">{item.count.toLocaleString()} accounts</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white text-slate-700 font-semibold">
                    {item.percentage.toFixed(1)}%
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No role data available</p>
            )}
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center">
                <p className="text-xs text-slate-600 mb-1">Active</p>
                <p className="text-xl font-bold text-emerald-700">{userStats?.active_users || 0}</p>
              </div>
              <div className="rounded-lg bg-slate-100 px-3 py-2 text-center">
                <p className="text-xs text-slate-600 mb-1">Inactive</p>
                <p className="text-xl font-bold text-slate-700">{userStats?.inactive_users || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* System Activity */}
      <Card className="border-slate-200/80 hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            System Activity
          </CardTitle>
          <CardDescription>Recent platform activities and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-sm text-slate-600 text-center">
                Activity logs will be displayed here when backend integration is complete.
              </p>
              <p className="text-xs text-slate-500 text-center mt-2">
                This section will show audit trails, user actions, and system events.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
