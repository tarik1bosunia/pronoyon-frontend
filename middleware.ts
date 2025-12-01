/**
 * Next.js Middleware for Route Protection
 * Handles authentication and RBAC checks at the edge
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define route patterns and their requirements
const routeConfig = {
  // Public routes (no auth required)
  public: [
    '/',
    '/login',
    '/register',
    '/auth/google/callback',
  ],
  
  // Admin-only routes
  admin: [
    '/admin',
    '/admin/users',
    '/admin/payments',
    '/admin/analytics',
  ],
  
  // Manager-only routes
  manager: [
    '/manager',
    '/questions/create',
    '/questions/edit',
    '/subjects',
    '/topics',
  ],
  
  // User-only routes
  user: [
    '/drafts',
    '/drafts/create',
    '/wallet',
    '/my-exports',
  ],
  
  // Authenticated routes (any logged-in user)
  authenticated: [
    '/dashboard',
    '/profile',
    '/questions',
  ],
};

function isPublicRoute(pathname: string): boolean {
  return routeConfig.public.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
}

function getRequiredRole(pathname: string): string | null {
  // Check admin routes
  if (routeConfig.admin.some(route => pathname.startsWith(route))) {
    return 'admin';
  }
  
  // Check manager routes
  if (routeConfig.manager.some(route => pathname.startsWith(route))) {
    return 'manager';
  }
  
  // Check user routes
  if (routeConfig.user.some(route => pathname.startsWith(route))) {
    return 'user';
  }
  
  // Check authenticated routes
  if (routeConfig.authenticated.some(route => pathname.startsWith(route))) {
    return 'authenticated';
  }
  
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }
  
  // Check if route requires authentication
  const requiredRole = getRequiredRole(pathname);
  
  if (!requiredRole) {
    // Route not configured, allow access
    return NextResponse.next();
  }
  
  // Get auth token from cookies or headers
  const accessToken = request.cookies.get('access_token')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '');
  
  // No token, redirect to login
  if (!accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // TODO: Decode JWT and check role/permissions
  // For now, we'll let the client-side guards handle detailed RBAC
  // This middleware mainly handles authentication
  
  try {
    // In production, decode JWT here and check role
    // const payload = decodeJWT(accessToken);
    // const userRole = payload.role;
    
    // For now, allow authenticated users through
    // Client-side guards will handle fine-grained RBAC
    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
