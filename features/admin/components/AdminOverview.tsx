import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, UserPlus, ShieldCheck, UserMinus, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const stats = [
  {
    title: 'Total Users',
    value: '1,248',
    change: '+12%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Active Managers',
    value: '84',
    change: '+4%',
    trend: 'up',
    icon: ShieldCheck,
  },
  {
    title: 'Pending Invitations',
    value: '18',
    change: '-3%',
    trend: 'down',
    icon: UserPlus,
  },
  {
    title: 'Deactivated Accounts',
    value: '6',
    change: '+1%',
    trend: 'up',
    icon: UserMinus,
  },
];

const invitations = [
  {
    email: 'anis.manager@pronoyon.com',
    role: 'Manager',
    status: 'Sent 2 hours ago',
  },
  {
    email: 'mou.teacher@academy.com',
    role: 'User',
    status: 'Sent yesterday',
  },
  {
    email: 'rafi.ops@pronoyon.com',
    role: 'Manager',
    status: 'Accepted 3 days ago',
  },
];

const auditLog = [
  {
    actor: 'You',
    action: 'Promoted Farhana Ahmed to Manager',
    time: '5 minutes ago',
  },
  {
    actor: 'Tanvir Rahman',
    action: 'Deactivated 3 dormant accounts',
    time: '1 hour ago',
  },
  {
    actor: 'Automation',
    action: 'Synced 12 new teachers from Question Bank',
    time: 'Today, 9:20 AM',
  },
  {
    actor: 'You',
    action: 'Updated permissions for RBAC: Editor role',
    time: 'Yesterday, 6:04 PM',
  },
];

const roleBreakdown = [
  { role: 'Admin', count: 4, accent: 'bg-red-500' },
  { role: 'Manager', count: 92, accent: 'bg-blue-500' },
  { role: 'User', count: 1_152, accent: 'bg-emerald-500' },
];

export function AdminOverview() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-slate-200/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-500">
                {stat.trend === 'up' ? (
                  <span className="text-emerald-600 inline-flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.change} vs last week
                  </span>
                ) : (
                  <span className="text-rose-600 inline-flex items-center gap-1">
                    <ArrowDownRight className="h-3 w-3" />
                    {stat.change} vs last week
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="border-slate-200/80 lg:col-span-2">
          <CardHeader>
            <CardTitle>User Role Breakdown</CardTitle>
            <CardDescription>Understand how the platform access is distributed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {roleBreakdown.map((item) => (
              <div key={item.role} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${item.accent}`} />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.role}</p>
                    <p className="text-xs text-slate-500">{item.count.toLocaleString()} accounts</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-white text-slate-700">
                  {(item.count / 1248 * 100).toFixed(1)}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader>
            <CardTitle>Recent Invitations</CardTitle>
            <CardDescription>Track outstanding invites and activities.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {invitations.map((invite) => (
              <div key={invite.email} className="rounded-xl border border-slate-100 p-4">
                <p className="text-sm font-semibold text-slate-900">{invite.email}</p>
                <p className="text-xs text-slate-500">{invite.status}</p>
                <Badge className="mt-3 w-fit bg-slate-900 text-white">{invite.role}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card className="border-slate-200/80">
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
          <CardDescription>Every critical change is recorded in the audit trail.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLog.map((entry, index) => (
              <div key={`${entry.actor}-${index}`} className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/90 text-sm font-semibold text-white">
                  {entry.actor
                    .split(' ')
                    .map((segment) => segment[0])
                    .join('')}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{entry.action}</p>
                  <p className="text-xs text-slate-500">{entry.time}</p>
                </div>
                {index < auditLog.length - 1 && <Separator className="hidden h-10 w-px bg-slate-200 sm:block" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
