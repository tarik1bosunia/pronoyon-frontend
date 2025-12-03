'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, MoreHorizontal, Loader2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  useGetRolesQuery,
  useGetPermissionsByCategoryQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  type Role,
  type Permission
} from '@/lib/redux/services/rolesApi';

interface FormState {
  name: string;
  description: string;
  level: number;
  permissionIds: number[];
}

const defaultFormState: FormState = {
  name: '',
  description: '',
  level: 50,
  permissionIds: [],
};

const levelColors: Record<string, string> = {
  high: 'bg-rose-100 text-rose-700',
  medium: 'bg-blue-100 text-blue-700',
  low: 'bg-emerald-100 text-emerald-700',
};

export function RolesManagement() {
  const [search, setSearch] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [rolePendingDelete, setRolePendingDelete] = useState<Role | null>(null);

  const { data: roles, isLoading, refetch } = useGetRolesQuery();
  const { data: permissionsByCategory } = useGetPermissionsByCategoryQuery();

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const filteredRoles = roles?.filter(role =>
    role.name.toLowerCase().includes(search.toLowerCase()) ||
    role.description?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const openCreateSheet = () => {
    setEditingRole(null);
    setFormState(defaultFormState);
    setIsSheetOpen(true);
  };

  const openEditSheet = (role: Role) => {
    setEditingRole(role);
    setFormState({
      name: role.name,
      description: role.description || '',
      level: role.level,
      permissionIds: role.permissions.map(p => p.id),
    });
    setIsSheetOpen(true);
  };

  const handleSaveRole = async () => {
    if (!formState.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    try {
      if (editingRole) {
        await updateRole({
          slug: editingRole.slug,
          data: {
            name: formState.name,
            description: formState.description,
            level: formState.level,
            permission_ids: formState.permissionIds,
          },
        }).unwrap();
        toast.success('Role updated successfully');
      } else {
        await createRole({
          name: formState.name,
          description: formState.description,
          level: formState.level,
          permission_ids: formState.permissionIds,
        }).unwrap();
        toast.success('Role created successfully');
      }
      setIsSheetOpen(false);
      refetch();
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Failed to save role';
      toast.error(errorMessage);
    }
  };

  const handleDeleteRole = async () => {
    if (!rolePendingDelete) return;
    try {
      await deleteRole(rolePendingDelete.slug).unwrap();
      toast.success('Role deleted successfully');
      setRolePendingDelete(null);
      refetch();
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Failed to delete role';
      toast.error(errorMessage);
    }
  };

  const togglePermission = (permissionId: number) => {
    setFormState(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter(id => id !== permissionId)
        : [...prev.permissionIds, permissionId]
    }));
  };

  const getLevelBadge = (level: number) => {
    if (level >= 70) return { label: 'High', color: levelColors.high };
    if (level >= 50) return { label: 'Medium', color: levelColors.medium };
    return { label: 'Low', color: levelColors.low };
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Roles & Permissions</CardTitle>
            <CardDescription>Define roles and assign granular permissions to control access.</CardDescription>
          </div>
          <Button onClick={openCreateSheet}>
            <Plus className="mr-2 h-4 w-4" /> Create role
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : (
            <ScrollArea className="rounded-lg border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Role</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map((role) => {
                    const levelBadge = getLevelBadge(role.level);
                    return (
                      <TableRow key={role.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-slate-500" />
                            <div>
                              <div className="font-semibold text-slate-900">{role.name}</div>
                              <div className="text-xs text-slate-500">{role.slug}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{role.description || '—'}</TableCell>
                        <TableCell>
                          <Badge className={cn('capitalize', levelBadge.color)}>
                            {levelBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{role.permissions.length} permissions</TableCell>
                        <TableCell className="text-sm text-slate-600">{role.user_count} users</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Role actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openEditSheet(role)}>Edit role</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setRolePendingDelete(role)}
                                disabled={role.is_default}
                              >
                                Delete role
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {!filteredRoles.length && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12 text-center text-sm text-slate-500">
                        No roles found.
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
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingRole ? 'Edit role' : 'Create new role'}</SheetTitle>
            <SheetDescription>
              {editingRole
                ? 'Update role details and permissions.'
                : 'Define a new role with specific permissions.'}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role name</Label>
              <Input
                id="name"
                placeholder="Content Manager"
                value={formState.name}
                onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Can manage content and moderate discussions"
                value={formState.description}
                onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Access level (1-100)</Label>
              <Input
                id="level"
                type="number"
                min="1"
                max="100"
                value={formState.level}
                onChange={(e) => setFormState(prev => ({ ...prev, level: parseInt(e.target.value) || 50 }))}
              />
              <p className="text-xs text-slate-500">Higher levels have more authority</p>
            </div>

            <div className="space-y-3">
              <Label>Permissions</Label>
              <ScrollArea className="h-[300px] rounded-lg border border-slate-200 p-4">
                {permissionsByCategory && Object.entries(permissionsByCategory).map(([category, permissions]) => (
                  <div key={category} className="mb-4">
                    <h4 className="mb-2 text-sm font-semibold text-slate-900 capitalize">{category}</h4>
                    <div className="space-y-2">
                      {permissions.map((permission: Permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`permission-${permission.id}`}
                            checked={formState.permissionIds.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <label
                            htmlFor={`permission-${permission.id}`}
                            className="text-sm text-slate-700 cursor-pointer flex-1"
                          >
                            {permission.name}
                            {permission.description && (
                              <span className="text-xs text-slate-500 block">{permission.description}</span>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <p className="text-xs text-slate-500">{formState.permissionIds.length} permissions selected</p>
            </div>
          </div>
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole} disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editingRole ? (
                'Save changes'
              ) : (
                'Create role'
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={Boolean(rolePendingDelete)} onOpenChange={(open) => !open && setRolePendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete role?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Users with this role will lose their assigned permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRole} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
