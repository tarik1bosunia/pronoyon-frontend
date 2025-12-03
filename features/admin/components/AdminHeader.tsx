'use client';

import React, { type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { UserMenu } from '@/components/auth';
import { Menu, Search, Bell } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

interface AdminHeaderProps {
  title: string;
  breadcrumbs: Crumb[];
  onOpenMobileNav: () => void;
  actions?: ReactNode;
}

export function AdminHeader({ title, breadcrumbs, onOpenMobileNav, actions }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="flex flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Button
            variant="ghost"
            size="icon"
            className="mr-1 h-9 w-9 md:hidden"
            onClick={onOpenMobileNav}
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <Breadcrumb className="hidden md:block">
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={`${crumb.label}-${index}`}>
                  <BreadcrumbItem>
                    {crumb.href && index < breadcrumbs.length - 1 ? (
                      <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <span className="font-medium text-slate-900 md:hidden">{title}</span>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">{title}</h1>
            <p className="text-sm text-slate-500">Manage your platform users, roles, and access.</p>
          </div>
          <div className="flex flex-1 items-center gap-3 md:flex-none">
            <div className="relative hidden flex-1 items-center md:flex">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search people, roles, or emails" className="pl-10" />
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            {actions}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
