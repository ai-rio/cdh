import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // For JWT-based authentication, logout is primarily about clearing the client-side token
    // and HTTP-only cookies. There's no server-side token invalidation needed with JWTs
    // since they are stateless and will expire naturally.
    
    // Clear the HTTP-only cookie
    const response = NextResponse.json({ 
      message: 'Logged out successfully',
      success: true 
    })
    
    response.cookies.set('payload-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('Logout error:', error)
    
    // Even if there's an error, we should clear the cookie
    const response = NextResponse.json({ 
      message: 'Logged out',
      success: true 
    })
    
    response.cookies.set('payload-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return response
  }
}
