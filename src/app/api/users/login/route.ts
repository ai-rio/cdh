import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    const result = await payload.login({
      collection: 'users',
      data: {
        email: email.toLowerCase().trim(),
        password,
      },
    })

    if (result.user && result.token) {
      // Set HTTP-only cookie for additional security
      const response = NextResponse.json({
        user: result.user,
        token: result.token,
        exp: result.exp,
      })

      response.cookies.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return response
    } else {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error: any) {
    console.error('Login error:', error)
    
    if (error.message?.includes('Invalid login')) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    if (error.message?.includes('locked')) {
      return NextResponse.json(
        { message: 'Account is temporarily locked due to too many failed login attempts' },
        { status: 423 }
      )
    }

    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
