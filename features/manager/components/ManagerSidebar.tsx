'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Eye, 
  Users, 
  BarChart3, 
  Home,
  BookOpen,
  LogOut,
  Menu,
  X,
  Plus,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useLogoutMutation } from '@/lib/redux/services/authApi';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { logout as logoutAction } from '@/lib/redux/slices/authSlice';
import { toast } from 'sonner';
import type { RootState } from '@/lib/redux/store';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'নতুন প্রশ্ন', href: '/manager/create', icon: Plus },
  { name: 'আমার প্রশ্ন', href: '/manager/questions', icon: FileText },
  { name: 'খসড়া', href: '/manager/drafts', icon: Eye },
  { name: 'পরিসংখ্যান', href: '/manager/stats', icon: BarChart3 },
];

interface ManagerSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ManagerSidebar({ isOpen }: ManagerSidebarProps) {
  const pathname = usePathname();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((state: RootState) => state.auth.refresh);
  const user = useAppSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await logout({ refresh: refreshToken }).unwrap();
      }
      dispatch(logoutAction());
      toast.success('Logged out successfully');
      window.location.href = '/';
    } catch {
      dispatch(logoutAction());
      toast.success('Logged out successfully');
      window.location.href = '/';
    }
  };

  const userName = user?.first_name 
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.email?.split('@')[0] || 'Manager';

  return (
    <div className={`hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-64 lg:flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Pronoyon</h1>
            <p className="text-xs text-gray-500">Manager Console</p>
          </div>
        </div>
        
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>

            <li className="mt-auto">
              <div className="border-t border-gray-200 pt-4">
                <div className="mb-4 px-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 mt-1 truncate">{userName}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export function ManagerMobileNav({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const pathname = usePathname();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((state: RootState) => state.auth.refresh);
  const user = useAppSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await logout({ refresh: refreshToken }).unwrap();
      }
      dispatch(logoutAction());
      toast.success('Logged out successfully');
      window.location.href = '/';
    } catch {
      dispatch(logoutAction());
      toast.success('Logged out successfully');
      window.location.href = '/';
    }
  };

  const userName = user?.first_name 
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.email?.split('@')[0] || 'Manager';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold">Pronoyon</div>
                <div className="text-xs text-gray-500 font-normal">Manager Console</div>
              </div>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex-1 px-4 py-4 overflow-y-auto">
            <ul role="list" className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => onOpenChange(false)}
                      className={cn(
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600',
                          'h-6 w-6 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-gray-200 px-4 py-4">
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Signed in as</p>
              <p className="text-sm font-medium text-gray-900 mt-1 truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
