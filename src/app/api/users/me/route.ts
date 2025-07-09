import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || authHeader?.replace('JWT ', '') || request.cookies.get('payload-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'No authentication token provided' },
        { status: 401 }
      )
    }

    try {
      // Verify the token and get user info
      const result = await payload.me({
        collection: 'users',
        token,
      })

      if (result.user) {
        return NextResponse.json({
          user: result.user,
          token: result.token || token,
          exp: result.exp,
        })
      } else {
        return NextResponse.json(
          { message: 'Invalid or expired token' },
          { status: 401 }
        )
      }
    } catch (error: any) {
      console.error('Token verification error:', error)
      
      if (error.message?.includes('expired') || error.message?.includes('invalid')) {
        return NextResponse.json(
          { message: 'Token has expired or is invalid' },
          { status: 401 }
        )
      }
      
      throw error
    }
  } catch (error: any) {
    console.error('Me endpoint error:', error)
    
    return NextResponse.json(
      { message: 'An error occurred while verifying authentication' },
      { status: 500 }
    )
  }
}
