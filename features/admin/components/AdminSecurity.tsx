'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Shield,
  Activity,
  Users,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Search,
  X,
  Clock,
  Monitor,
  Globe,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetSecurityOverviewQuery,
  useGetActiveSessionsQuery,
  useRevokeSessionMutation,
  useRevokeUserSessionsMutation,
  useGetLoginHistoryQuery,
  useGetSecurityLogsQuery,
} from '@/lib/redux/services/adminApi';
import { format } from 'date-fns';

export function AdminSecurity() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionOffset, setSessionOffset] = useState(0);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showRevokeAllDialog, setShowRevokeAllDialog] = useState(false);

  const { data: overview, isLoading: overviewLoading } = useGetSecurityOverviewQuery();
  const { data: sessionsData, isLoading: sessionsLoading } = useGetActiveSessionsQuery({
    limit: 20,
    offset: sessionOffset,
  });
  const { data: loginHistory, isLoading: historyLoading } = useGetLoginHistoryQuery({ limit: 50 });
  const { data: securityLogs, isLoading: logsLoading } = useGetSecurityLogsQuery({ limit: 50 });

  const [revokeSession] = useRevokeSessionMutation();
  const [revokeUserSessions] = useRevokeUserSessionsMutation();

  const handleRevokeSession = async () => {
    if (!selectedSession) return;

    try {
      await revokeSession({ token_id: selectedSession }).unwrap();
      toast.success('Session revoked successfully');
      setShowRevokeDialog(false);
      setSelectedSession(null);
    } catch (error) {
      toast.error('Failed to revoke session');
    }
  };

  const handleRevokeUserSessions = async () => {
    if (!selectedUserId) return;

    try {
      const result = await revokeUserSessions({ user_id: selectedUserId }).unwrap();
      toast.success(result.message);
      setShowRevokeAllDialog(false);
      setSelectedUserId(null);
    } catch (error) {
      toast.error('Failed to revoke user sessions');
    }
  };

  const confirmRevokeSession = (sessionId: string) => {
    setSelectedSession(sessionId);
    setShowRevokeDialog(true);
  };

  const confirmRevokeUserSessions = (userId: string) => {
    setSelectedUserId(userId);
    setShowRevokeAllDialog(true);
  };

  const filteredSessions = sessionsData?.sessions.filter((session) =>
    session.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHistory = loginHistory?.history.filter((item) =>
    item.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Security & Authentication
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor sessions, login attempts, and security events
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Activity className="h-3 w-3 mr-1" />
          Live Monitoring
        </Badge>
      </div>

      {/* Overview Stats */}
      {overviewLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Monitor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.active_sessions || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {overview?.active_users_week || 0} active users this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Login Attempts</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.login_attempts_today || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {overview?.failed_attempts_today || 0} failed attempts today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Authentication Methods</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(overview?.authentication_methods.email || 0) +
                  (overview?.authentication_methods.google || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {overview?.authentication_methods.google || 0} via Google
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Status</CardTitle>
              {(overview?.suspicious_activities || 0) > 0 ? (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                {(overview?.suspicious_activities || 0) > 0 ? (
                  <>
                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                    Alert
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    Secure
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {overview?.suspicious_activities || 0} suspicious activities
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {overview && (overview.suspicious_activities > 0 || overview.failed_attempts_today > 5) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {overview.suspicious_activities > 0 &&
              `${overview.suspicious_activities} suspicious activities detected. `}
            {overview.failed_attempts_today > 5 &&
              `${overview.failed_attempts_today} failed login attempts today. Please review security logs.`}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sessions" className="gap-2">
            <Monitor className="h-4 w-4" />
            Active Sessions
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Clock className="h-4 w-4" />
            Login History
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <Activity className="h-4 w-4" />
            Security Logs
          </TabsTrigger>
        </TabsList>

        {/* Active Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active User Sessions</CardTitle>
                  <CardDescription>Manage and monitor active authentication sessions</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by user..."
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
              </div>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : filteredSessions && filteredSessions.length > 0 ? (
                <div className="space-y-3">
                  {filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-2 rounded-lg bg-green-100 text-green-600">
                          <Monitor className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{session.user.full_name}</p>
                            <Badge variant="outline" className="text-xs">Active</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{session.user.email}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>Started: {format(new Date(session.created_at), 'MMM d, HH:mm')}</span>
                            <span>•</span>
                            <span>Expires: {format(new Date(session.expires_at), 'MMM d, HH:mm')}</span>
                            {session.last_activity && (
                              <>
                                <span>•</span>
                                <span>Last: {format(new Date(session.last_activity), 'MMM d, HH:mm')}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => confirmRevokeUserSessions(session.user.id)}
                        >
                          Revoke All
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmRevokeSession(session.id)}
                        >
                          <LogOut className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active sessions found</p>
                </div>
              )}

              {sessionsData && sessionsData.total > 20 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSessionOffset(Math.max(0, sessionOffset - 20))}
                    disabled={sessionOffset === 0}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Showing {sessionOffset + 1}-{Math.min(sessionOffset + 20, sessionsData.total)} of{' '}
                    {sessionsData.total}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSessionOffset(sessionOffset + 20)}
                    disabled={sessionOffset + 20 >= sessionsData.total}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Login History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Login History</CardTitle>
                  <CardDescription>Recent login activity across all users</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by user..."
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
              </div>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="space-y-2">
                  {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr className="border-b">
                          <th className="text-left p-4 font-medium">User</th>
                          <th className="text-left p-4 font-medium">Authentication</th>
                          <th className="text-left p-4 font-medium">Last Login</th>
                          <th className="text-left p-4 font-medium">Joined</th>
                          <th className="text-left p-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHistory && filteredHistory.length > 0 ? (
                          filteredHistory.map((item, index) => (
                            <tr key={index} className="border-b last:border-0 hover:bg-muted/30">
                              <td className="p-4">
                                <div>
                                  <p className="font-medium">{item.user.full_name}</p>
                                  <p className="text-xs text-muted-foreground">{item.user.email}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge variant="outline">
                                  {item.authentication_method === 'google' ? 'Google' : 'Email'}
                                </Badge>
                              </td>
                              <td className="p-4">
                                {item.last_login
                                  ? format(new Date(item.last_login), 'MMM d, yyyy HH:mm')
                                  : 'Never'}
                              </td>
                              <td className="p-4 text-muted-foreground">
                                {format(new Date(item.date_joined), 'MMM d, yyyy')}
                              </td>
                              <td className="p-4">
                                <Badge variant={item.is_active ? 'default' : 'secondary'}>
                                  {item.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-muted-foreground">
                              No login history found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Event Logs</CardTitle>
              <CardDescription>Detailed security events and authentication activities</CardDescription>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="space-y-3">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : securityLogs && securityLogs.logs.length > 0 ? (
                <div className="space-y-2">
                  {securityLogs.logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/30 transition-colors"
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          log.event_type === 'session_revoked'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {log.event_type === 'session_revoked' ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Activity className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{log.user.full_name}</p>
                          <Badge variant="outline" className="text-xs">
                            {log.event_type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.user.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {log.details.reason || 'No additional details'}
                        </p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <p>{format(new Date(log.timestamp), 'MMM d, yyyy')}</p>
                        <p>{format(new Date(log.timestamp), 'HH:mm:ss')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No security logs found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Revoke Session Dialog */}
      <AlertDialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke this session? The user will be logged out immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevokeSession} className="bg-destructive hover:bg-destructive/90">
              Revoke Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Revoke All User Sessions Dialog */}
      <AlertDialog open={showRevokeAllDialog} onOpenChange={setShowRevokeAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke All User Sessions</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke all active sessions for this user? They will be logged out from
              all devices immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevokeUserSessions}
              className="bg-destructive hover:bg-destructive/90"
            >
              Revoke All Sessions
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
