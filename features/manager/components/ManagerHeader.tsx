'use client';

import Link from 'next/link';
import { Menu, ChevronRight, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface ManagerHeaderProps {
  title: string;
  breadcrumbs: Breadcrumb[];
  onOpenMobileNav: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function ManagerHeader({ title, breadcrumbs, onOpenMobileNav, onToggleSidebar, isSidebarOpen }: ManagerHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenMobileNav}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open sidebar</span>
      </Button>

      {onToggleSidebar && (
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex"
          onClick={onToggleSidebar}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeft className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      )}

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 flex-col justify-center">
          <nav className="flex text-xs" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight className="mx-2 h-3 w-3 text-gray-400" aria-hidden="true" />
                  )}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-gray-900">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>
      </div>
    </header>
  );
}
