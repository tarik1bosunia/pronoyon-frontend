'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';

// Public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isMounted, setIsMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Check if current route is public
    const isPublicRoute = publicRoutes.some(route => pathname === route);
    
    console.log('AuthGuard:', { pathname, isAuthenticated, isPublicRoute });
    
    // If not authenticated and trying to access protected route
    if (!isAuthenticated && !isPublicRoute) {
      console.log('Not authenticated, redirecting to login');
      setIsRedirecting(true);
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    
    // If authenticated and trying to access login/register, redirect to home
    if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      console.log('Already authenticated, redirecting to home');
      setIsRedirecting(true);
      router.replace('/');
      return;
    }

    setIsRedirecting(false);
  }, [isAuthenticated, pathname, router, isMounted]);

  // Show loading while redirecting
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Always render children to avoid hydration mismatch
  return <>{children}</>;
}
