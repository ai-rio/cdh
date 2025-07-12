import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Redirect old control panel routes to new dashboard
  if (pathname.startsWith('/control-panel')) {
    // Preserve query parameters if any
    const searchParams = request.nextUrl.searchParams;
    const newUrl = new URL('/dashboard', request.url);
    
    // Copy search parameters
    searchParams.forEach((value, key) => {
      newUrl.searchParams.set(key, value);
    });

    // Add migration parameter to show notice
    newUrl.searchParams.set('migrated', 'true');
    
    console.log('🔄 Redirecting deprecated control panel to dashboard:', pathname, '→', newUrl.pathname);
    return NextResponse.redirect(newUrl, 301); // Permanent redirect
  }

  // Redirect specific admin panel pages to equivalent dashboard pages
  const redirectMap: Record<string, string> = {
    '/admin/users': '/dashboard/users',
    '/admin/collections': '/dashboard/collections',
    '/admin/settings': '/dashboard',
    '/admin': '/dashboard',
  };

  if (redirectMap[pathname]) {
    const newUrl = new URL(redirectMap[pathname], request.url);
    newUrl.searchParams.set('migrated', 'true');
    console.log('🔄 Redirecting deprecated admin route:', pathname, '→', newUrl.pathname);
    return NextResponse.redirect(newUrl, 301);
  }
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard']
  
  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Get authentication token from cookies (check both possible cookie names)
  const payloadToken = request.cookies.get('payload-token')?.value
  const authToken = request.cookies.get('auth_token')?.value
  const token = payloadToken || authToken
  
  // Debug logging
  if (isProtectedRoute) {
    console.log('🔍 Middleware check:', {
      pathname,
      hasPayloadToken: !!payloadToken,
      hasAuthToken: !!authToken,
      hasAnyToken: !!token,
      payloadTokenValue: payloadToken ? `${payloadToken.substring(0, 10)}...` : 'none',
      authTokenValue: authToken ? `${authToken.substring(0, 10)}...` : 'none'
    });
  }
  
  // If accessing a protected route without authentication, redirect to home
  if (isProtectedRoute && !token) {
    console.log('🔒 Redirecting unauthenticated user from protected route:', pathname)
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Allow all other requests (including home page access for both authenticated and unauthenticated users)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
