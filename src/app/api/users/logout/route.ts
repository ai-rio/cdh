import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('payload-token')?.value

    if (token) {
      try {
        // Attempt to logout with Payload (this may invalidate the token server-side)
        await payload.logout({
          collection: 'users',
        })
      } catch (error) {
        // Logout errors are not critical - we'll clear the cookie anyway
        console.warn('Payload logout warning:', error)
      }
    }

    // Clear the HTTP-only cookie
    const response = NextResponse.json({ message: 'Logged out successfully' })
    
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
    const response = NextResponse.json({ message: 'Logged out' })
    
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
