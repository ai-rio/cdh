import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Use payload.auth() with headers to verify authentication
    const { user } = await payload.auth({ headers: request.headers })

    if (user) {
      return NextResponse.json({
        user: user,
      })
    } else {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }
  } catch (error: any) {
    console.error('Me endpoint error:', error)
    
    return NextResponse.json(
      { message: 'An error occurred while verifying authentication' },
      { status: 500 }
    )
  }
}
