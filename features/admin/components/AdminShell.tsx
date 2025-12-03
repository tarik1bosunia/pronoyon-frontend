'use client';

import { ReactNode, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ProtectedRoute, AdminGuard } from '@/components/auth';
import { AdminSidebar, AdminMobileNav } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Admin Overview',
  '/admin/users': 'User Management',
  '/admin/roles': 'Roles & Permissions',
};

const formatSegment = (segment: string) =>
  segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = [{ label: 'Admin', href: '/admin' }];

  if (segments.length <= 1) {
    crumbs[0] = { label: 'Admin Overview', href: '/admin' };
    return crumbs;
  }

  let cumulative = '';
  for (let i = 1; i < segments.length; i += 1) {
    cumulative += `/${segments[i]}`;
    crumbs.push({
      label: formatSegment(segments[i]),
      href: `/admin${cumulative}`,
    });
  }

  crumbs[crumbs.length - 1].href = undefined;
  return crumbs;
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/admin';
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const title = PAGE_TITLES[pathname] || 'Admin Console';
  const breadcrumbs = useMemo(() => buildBreadcrumbs(pathname), [pathname]);

  return (
    <ProtectedRoute>
      <AdminGuard>
        <div className="flex min-h-screen bg-slate-50">
          <AdminSidebar />
          <AdminMobileNav open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen} />
          <div className="flex min-h-screen flex-1 flex-col">
            <AdminHeader title={title} breadcrumbs={breadcrumbs} onOpenMobileNav={() => setIsMobileNavOpen(true)} />
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
          </div>
        </div>
      </AdminGuard>
    </ProtectedRoute>
  );
}
