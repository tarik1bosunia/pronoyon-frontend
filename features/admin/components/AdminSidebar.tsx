'use client';

import type { ComponentType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ShieldCheck, LockKeyhole, Activity, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export type AdminNavItem = {
  title: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  description?: string;
  badge?: string;
  disabled?: boolean;
};

export const adminNavItems: AdminNavItem[] = [
  {
    title: 'Overview',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    description: 'Invite, promote or deactivate accounts.',
  },
  {
    title: 'Managers',
    href: '/admin/managers',
    icon: UserCog,
    description: 'Manage platform managers.',
  },
  {
    title: 'Roles & Permissions',
    href: '/admin/roles',
    icon: ShieldCheck,
    description: 'Define roles and manage permissions.',
  },
  {
    title: 'Security',
    href: '/admin/security',
    icon: LockKeyhole,
    badge: 'Soon',
    disabled: true,
  },
  {
    title: 'Audit Trail',
    href: '/admin/activity',
    icon: Activity,
    badge: 'Soon',
    disabled: true,
  },
];

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onInvite?: () => void;
}

export function AdminSidebar({ isCollapsed = false, onInvite }: AdminSidebarProps) {
  const pathname = usePathname();
  return (
    <aside
      className={cn(
        'hidden border-r border-slate-200/80 bg-white/95 backdrop-blur md:flex md:flex-col md:shadow-sm',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className={cn('flex items-center gap-2 border-b border-slate-200/70 px-5 py-4', isCollapsed && 'justify-center')}>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white font-semibold">PA</div>
        {!isCollapsed && (
          <div>
            <p className="text-sm font-semibold text-slate-900">Pronoyon Admin</p>
            <p className="text-xs text-slate-500">Control Center</p>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-1.5">
          {adminNavItems.map((item) => (
            <SidebarLink key={item.href} item={item} isActive={pathname === item.href} isCollapsed={isCollapsed} />
          ))}
        </nav>
      </div>
      {onInvite && (
        <div className={cn('border-t border-slate-200/70 px-4 py-4', isCollapsed && 'px-2')}>
          <Button size={isCollapsed ? 'icon' : 'sm'} className="w-full" onClick={onInvite}>
            {isCollapsed ? '+' : 'Invite teammate'}
          </Button>
        </div>
      )}
    </aside>
  );
}

interface SidebarLinkProps {
  item: AdminNavItem;
  isActive: boolean;
  isCollapsed: boolean;
}

function SidebarLink({ item, isActive, isCollapsed }: SidebarLinkProps) {
  const Icon = item.icon;
  const content = (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
        isActive
          ? 'bg-slate-900 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        item.disabled && 'cursor-not-allowed opacity-60'
      )}
    >
      <Icon className="h-4 w-4" />
      {!isCollapsed && (
        <div className="flex flex-1 items-center justify-between">
          <span className="font-medium">{item.title}</span>
          {item.badge && (
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (item.disabled) {
    return (
      <div className={cn('w-full', isCollapsed && 'flex justify-center')}>
        <div className="w-full">{content}</div>
      </div>
    );
  }

  return (
    <Link href={item.href} className={cn('block', isCollapsed && 'flex justify-center')}>
      {content}
    </Link>
  );
}

interface AdminMobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite?: () => void;
}

export function AdminMobileNav({ open, onOpenChange, onInvite }: AdminMobileNavProps) {
  const pathname = usePathname();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <div className="border-b border-slate-200 px-5 py-4">
          <p className="text-sm font-semibold text-slate-900">Admin Navigation</p>
          <p className="text-xs text-slate-500">Manage platform access & users</p>
        </div>
        <div className="space-y-1 px-3 py-4">
          {adminNavItems.map((item) => (
            <MobileLink
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              onNavigate={() => onOpenChange(false)}
            />
          ))}
        </div>
        {onInvite && (
          <div className="border-t border-slate-200 px-4 py-4">
            <Button className="w-full" onClick={onInvite}>
              Invite teammate
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps {
  item: AdminNavItem;
  isActive: boolean;
  onNavigate: () => void;
}

function MobileLink({ item, isActive, onNavigate }: MobileLinkProps) {
  const Icon = item.icon;
  const content = (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
        isActive
          ? 'bg-slate-900 text-white'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        item.disabled && 'cursor-not-allowed opacity-60'
      )}
    >
      <Icon className="h-4 w-4" />
      <div className="flex flex-1 items-center justify-between">
        <span className="font-medium">{item.title}</span>
        {item.badge && (
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            {item.badge}
          </span>
        )}
      </div>
    </div>
  );

  if (item.disabled) {
    return <div>{content}</div>;
  }

  return (
    <Link href={item.href} onClick={onNavigate}>
      {content}
    </Link>
  );
}
