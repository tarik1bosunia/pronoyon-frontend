'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Plus, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const initialUsers = [
  {
    id: 'USR-1001',
    fullName: 'Farhana Ahmed',
    email: 'farhana.ahmed@pronoyon.com',
    role: 'manager',
    status: 'active',
    lastActive: '5 minutes ago',
    createdAt: '2024-04-15',
    teams: ['Science', 'Biology'],
  },
  {
    id: 'USR-1002',
    fullName: 'Tanvir Rahman',
    email: 'tanvir@pronoyon.com',
    role: 'admin',
    status: 'active',
    lastActive: 'Online now',
    createdAt: '2023-11-02',
    teams: ['Core'],
  },
  {
    id: 'USR-1003',
    fullName: 'Moumita Sultana',
    email: 'moumita@classroom.com',
    role: 'user',
    status: 'pending',
    lastActive: 'Invited today',
    createdAt: '2024-05-01',
    teams: ['Chemistry'],
  },
  {
    id: 'USR-1004',
    fullName: 'Rajib Hasan',
    email: 'rajib.ops@pronoyon.com',
    role: 'manager',
    status: 'inactive',
    lastActive: '30 days ago',
    createdAt: '2022-12-19',
    teams: ['Ops'],
  },
];

type RoleType = 'admin' | 'manager' | 'user';
type StatusType = 'active' | 'inactive' | 'pending';

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: RoleType;
  status: StatusType;
  lastActive: string;
  createdAt: string;
  teams: string[];
}

const defaultFormState: Omit<AdminUser, 'id' | 'lastActive' | 'createdAt'> = {
  fullName: '',
  email: '',
  role: 'manager',
  status: 'active',
  teams: [],
};

const statusMap: Record<StatusType, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700' },
  inactive: { label: 'Inactive', className: 'bg-slate-200 text-slate-600' },
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
};

const roleColors: Record<RoleType, string> = {
  admin: 'bg-rose-100 text-rose-700',
  manager: 'bg-blue-100 text-blue-700',
  user: 'bg-emerald-100 text-emerald-700',
};

export function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | RoleType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | StatusType>('all');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formState, setFormState] = useState(defaultFormState);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userPendingDelete, setUserPendingDelete] = useState<AdminUser | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const openCreateSheet = () => {
    setEditingUser(null);
    setFormState(defaultFormState);
    setIsSheetOpen(true);
  };

  const openEditSheet = (user: AdminUser) => {
    setEditingUser(user);
    setFormState({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      teams: user.teams,
    });
    setIsSheetOpen(true);
  };

  const handleSaveUser = () => {
    if (!formState.fullName.trim() || !formState.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    if (editingUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                ...formState,
              }
            : user,
        ),
      );
      toast.success('User updated successfully');
    } else {
      const newUser: AdminUser = {
        id: `USR-${Math.floor(Math.random() * 9000 + 1000)}`,
        fullName: formState.fullName,
        email: formState.email,
        role: formState.role,
        status: formState.status,
        teams: formState.teams,
        createdAt: new Date().toISOString().split('T')[0],
        lastActive: 'Invited just now',
      };
      setUsers((prev) => [newUser, ...prev]);
      toast.success('Invitation sent');
    }

    setIsSheetOpen(false);
  };

  const handleToggleStatus = (user: AdminUser) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u)));
    toast.success(`User ${nextStatus === 'active' ? 'reactivated' : 'deactivated'}`);
  };

  const handleDeleteUser = () => {
    if (!userPendingDelete) return;
    setUsers((prev) => prev.filter((user) => user.id !== userPendingDelete.id));
    toast.success('User removed successfully');
    setUserPendingDelete(null);
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>User Directory</CardTitle>
            <CardDescription>Invite new teammates, promote to managers, or deactivate dormant accounts.</CardDescription>
          </div>
          <Button onClick={openCreateSheet}>
            <Plus className="mr-2 h-4 w-4" /> Invite user
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-3">
            <Input
              placeholder="Search by name or email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as 'all' | RoleType)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | StatusType)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="rounded-lg border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[220px]">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-semibold text-slate-900">{user.fullName}</div>
                      <div className="text-xs text-slate-500">ID: {user.id}</div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={cn('capitalize', roleColors[user.role])}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('capitalize', statusMap[user.status].className)}>
                        {statusMap[user.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{user.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>User actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditSheet(user)}>Update details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setUserPendingDelete(user)}
                          >
                            Delete account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {!filteredUsers.length && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-sm text-slate-500">
                      No users matched your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editingUser ? 'Update account' : 'Invite a new teammate'}</SheetTitle>
            <SheetDescription>
              {editingUser
                ? 'Promote, deactivate or update the selected member.'
                : 'Send an invitation email with role-based permissions instantly.'}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="fullName">
                Full name
              </label>
              <Input
                id="fullName"
                placeholder="Mahfuz Rahman"
                value={formState.fullName}
                onChange={(event) => setFormState((prev) => ({ ...prev, fullName: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="email">
                Work email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="mahfuz@pronoyon.com"
                value={formState.email}
                onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Role</label>
                <Select
                  value={formState.role}
                  onValueChange={(value) =>
                    setFormState((prev) => ({ ...prev, role: value as RoleType }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <Select
                  value={formState.status}
                  onValueChange={(value) =>
                    setFormState((prev) => ({ ...prev, status: value as StatusType }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="teams">
                Teams (comma separated)
              </label>
              <Input
                id="teams"
                placeholder="Biology, Content"
                value={formState.teams.join(', ')}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    teams: event.target.value
                      .split(',')
                      .map((team) => team.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </div>
          </div>
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>{editingUser ? 'Save changes' : 'Send invite'}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={Boolean(userPendingDelete)} onOpenChange={(open) => !open && setUserPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The user will permanently lose access to Pronoyon Admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
