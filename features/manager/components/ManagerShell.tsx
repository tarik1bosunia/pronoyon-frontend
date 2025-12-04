'use client';

import { ReactNode, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { ManagerGuard } from '@/components/auth/ManagerGuard';
import { ManagerSidebar, ManagerMobileNav } from './ManagerSidebar';
import { ManagerHeader } from './ManagerHeader';

const PAGE_TITLES: Record<string, string> = {
  '/manager/create': 'Create Question',
  '/manager/questions': 'My Questions',
  '/manager/drafts': 'Draft Questions',
  '/manager/stats': 'Statistics & Progress',
};

const formatSegment = (segment: string) =>
  segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: { label: string; href?: string }[] = [{ label: 'Manager', href: '/manager/questions' }];

  if (segments.length <= 1) {
    return crumbs;
  }

  let cumulative = '';
  for (let i = 1; i < segments.length; i += 1) {
    cumulative += `/${segments[i]}`;
    crumbs.push({
      label: formatSegment(segments[i]),
      href: `/manager${cumulative}`,
    });
  }

  crumbs[crumbs.length - 1].href = undefined;
  return crumbs;
}

export function ManagerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/manager/questions';
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const title = PAGE_TITLES[pathname] || 'Manager Console';
  const breadcrumbs = useMemo(() => buildBreadcrumbs(pathname), [pathname]);

  return (
    <ProtectedRoute>
      <ManagerGuard>
        <div className="flex min-h-screen bg-slate-50">
          <ManagerSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          <ManagerMobileNav open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen} />
          <div className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
            <ManagerHeader 
              title={title} 
              breadcrumbs={breadcrumbs} 
              onOpenMobileNav={() => setIsMobileNavOpen(true)}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              isSidebarOpen={isSidebarOpen}
            />
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
          </div>
        </div>
      </ManagerGuard>
    </ProtectedRoute>
  );
}
