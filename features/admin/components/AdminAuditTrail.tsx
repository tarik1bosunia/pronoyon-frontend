'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Activity,
  UserPlus,
  UserMinus,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Search,
  X,
  FileText,
  Filter,
  Download,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetRecentActivitiesQuery,
  useGetActivitySummaryQuery,
} from '@/lib/redux/services/adminApi';
import { format } from 'date-fns';

const getActivityIcon = (targetType: string, actionType: string) => {
  if (targetType === 'role') {
    return actionType === 'assigned' || actionType === 'modified' ? (
      <UserPlus className="h-4 w-4" />
    ) : (
      <UserMinus className="h-4 w-4" />
    );
  }
  if (targetType === 'wallet') {
    return <CreditCard className="h-4 w-4" />;
  }
  return <Activity className="h-4 w-4" />;
};

const getActivityColor = (targetType: string, actionType: string) => {
  if (targetType === 'role') {
    return actionType === 'assigned' || actionType === 'modified'
      ? 'bg-green-100 text-green-600'
      : 'bg-red-100 text-red-600';
  }
  if (targetType === 'wallet') {
    return 'bg-blue-100 text-blue-600';
  }
  return 'bg-gray-100 text-gray-600';
};

export function AdminAuditTrail() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [limit, setLimit] = useState(50);

  const { data: activities, isLoading: activitiesLoading } = useGetRecentActivitiesQuery({ limit });
  const { data: summary, isLoading: summaryLoading } = useGetActivitySummaryQuery();

  const filteredActivities = activities?.filter((activity) => {
    const matchesSearch =
      activity.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.actor_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterType === 'all' || activity.target_type === filterType;

    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting audit trail...');
    // toast.success('Audit trail exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="h-8 w-8" />
            Audit Trail
          </h1>
          <p className="text-muted-foreground mt-1">
            Track all system activities and user actions
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Summary Stats */}
      {summaryLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.total_activities || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Role Assignments</CardTitle>
              <UserPlus className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.role_assignments || 0}</div>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                New roles assigned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Role Revocations</CardTitle>
              <UserMinus className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.role_revocations || 0}</div>
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                Roles removed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.completed_transactions || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Successful transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.failed_transactions || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Failed transactions</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Detailed record of all platform activities</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="role">Role Changes</SelectItem>
                  <SelectItem value="wallet">Wallet Activities</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : filteredActivities && filteredActivities.length > 0 ? (
            <div className="space-y-2">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/30 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.target_type, activity.details.action_type)}`}>
                    {getActivityIcon(activity.target_type, activity.details.action_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">{activity.actor}</p>
                          <Badge variant="outline" className="text-xs">
                            {activity.actor_email}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right text-xs text-muted-foreground flex-shrink-0">
                        <p>{format(new Date(activity.timestamp), 'MMM d, yyyy')}</p>
                        <p>{format(new Date(activity.timestamp), 'HH:mm:ss')}</p>
                      </div>
                    </div>
                    {activity.details.reason && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        Reason: {activity.details.reason}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {activity.target_type}
                      </Badge>
                      {activity.details.role && (
                        <Badge variant="outline" className="text-xs">
                          {activity.details.role}
                        </Badge>
                      )}
                      {activity.details.amount && (
                        <Badge variant="outline" className="text-xs">
                          ৳{activity.details.amount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-1">No activities found</p>
              <p className="text-sm">
                {searchQuery || filterType !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Activities will appear here as they occur'}
              </p>
            </div>
          )}

          {filteredActivities && filteredActivities.length >= limit && (
            <div className="flex items-center justify-center mt-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setLimit(limit + 50)}
              >
                Load More Activities
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
