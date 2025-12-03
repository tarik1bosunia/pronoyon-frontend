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
import { Plus, MoreHorizontal, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  type User
} from '@/lib/redux/services/usersApi';

type RoleType = 'admin' | 'manager' | 'user';
type StatusType = 'active' | 'inactive' | 'pending';

interface FormState {
  fullName: string;
  email: string;
  role: RoleType;
  status: StatusType;
  password?: string;
}

const defaultFormState: FormState = {
  fullName: '',
  email: '',
  role: 'user',
  status: 'active',
  password: '',
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

const roleIdMap: Record<RoleType, number> = {
  admin: 1, // Adjust these IDs based on your backend
  manager: 2,
  user: 3,
};

export function UserManagement() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | RoleType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'true' | 'false'>('all');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userPendingDelete, setUserPendingDelete] = useState<User | null>(null);

  // API hooks
  const { data: usersData, isLoading, error, refetch } = useGetUsersQuery({
    search: search || undefined,
    role: roleFilter === 'all' ? undefined : roleFilter,
    is_active: statusFilter === 'all' ? undefined : statusFilter === 'true',
  });

  

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [activateUser] = useActivateUserMutation();
  const [deactivateUser] = useDeactivateUserMutation();

  const users = usersData?.results || [];

  // Temporary debug
  console.log('Debug:', { 
    usersData, 
    results: usersData?.results,
    usersLength: users.length,
    isLoading,
    error 
  });

  const openCreateSheet = () => {
    setEditingUser(null);
    setFormState(defaultFormState);
    setIsSheetOpen(true);
  };

  const openEditSheet = (user: User) => {
    setEditingUser(user);
    const [firstName, ...lastNameParts] = user.full_name.split(' ');
    setFormState({
      fullName: user.full_name,
      email: user.email,
      role: (user.primary_role?.role_type || 'user') as RoleType,
      status: user.is_active ? 'active' : 'inactive',
    });
    setIsSheetOpen(true);
  };

  const handleSaveUser = async () => {
    if (!formState.fullName.trim() || !formState.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    const [first_name, ...last_name_parts] = formState.fullName.trim().split(' ');
    const last_name = last_name_parts.join(' ');

    try {
      if (editingUser) {
        await updateUser({
          id: editingUser.id,
          data: {
            first_name,
            last_name,
            is_active: formState.status === 'active',
            role_id: roleIdMap[formState.role],
          },
        }).unwrap();
        toast.success('User updated successfully');
      } else {
        if (!formState.password) {
          toast.error('Password is required for new users');
          return;
        }
        await createUser({
          email: formState.email,
          first_name,
          last_name,
          is_active: formState.status === 'active',
          role_id: roleIdMap[formState.role],
          password: formState.password,
        }).unwrap();
        toast.success('User created successfully');
      }
      setIsSheetOpen(false);
      refetch();
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Failed to save user';
      toast.error(errorMessage);
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      if (user.is_active) {
        await deactivateUser(user.id).unwrap();
        toast.success('User deactivated');
      } else {
        await activateUser(user.id).unwrap();
        toast.success('User activated');
      }
      refetch();
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Failed to update user status';
      toast.error(errorMessage);
    }
  };

  const handleDeleteUser = async () => {
    if (!userPendingDelete) return;
    try {
      await deleteUser(userPendingDelete.id).unwrap();
      toast.success('User deleted successfully');
      setUserPendingDelete(null);
      refetch();
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Failed to delete user';
      toast.error(errorMessage);
    }
  };

  const getLastActive = (user: User) => {
    if (!user.last_login) return 'Never logged in';
    const lastLogin = new Date(user.last_login);
    const now = new Date();
    const diffMs = now.getTime() - lastLogin.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getUserStatus = (user: User): StatusType => {
    if (!user.is_active) return 'inactive';
    if (!user.last_login) return 'pending';
    return 'active';
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
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'true' | 'false')}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : (
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
                  {users.map((user) => {
                    const status = getUserStatus(user);
                    const roleType = (user.primary_role?.role_type || 'user') as RoleType;
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-semibold text-slate-900">{user.full_name}</div>
                          <div className="text-xs text-slate-500">ID: {user.id}</div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{user.email}</TableCell>
                        <TableCell>
                          <Badge className={cn('capitalize', roleColors[roleType])}>{roleType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('capitalize', statusMap[status].className)}>
                            {statusMap[status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{getLastActive(user)}</TableCell>
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
                                {user.is_active ? 'Deactivate' : 'Activate'}
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
                    );
                  })}
                  {!users.length && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12 text-center text-sm text-slate-500">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
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
                disabled={!!editingUser}
              />
            </div>
            {!editingUser && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={formState.password || ''}
                  onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
                />
              </div>
            )}
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
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser} disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editingUser ? (
                'Save changes'
              ) : (
                'Create user'
              )}
            </Button>
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
