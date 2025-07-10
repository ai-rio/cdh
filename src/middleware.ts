import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
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
