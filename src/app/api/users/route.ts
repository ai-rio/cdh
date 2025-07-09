import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return NextResponse.json(
        { message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email.toLowerCase().trim(),
        },
      },
      limit: 1,
    })

    if (existingUsers.docs.length > 0) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Create the user
    const user = await payload.create({
      collection: 'users',
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        role: 'creator', // Default role
      },
    })

    // Log the user in automatically after registration
    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email: email.toLowerCase().trim(),
        password,
      },
    })

    if (loginResult.user && loginResult.token) {
      // Set HTTP-only cookie for additional security
      const response = NextResponse.json({
        user: loginResult.user,
        token: loginResult.token,
        exp: loginResult.exp,
      })

      response.cookies.set('payload-token', loginResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return response
    } else {
      // User created but login failed - still return success
      return NextResponse.json({
        user,
        message: 'Account created successfully. Please log in.',
      })
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    
    if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    if (error.message?.includes('validation')) {
      return NextResponse.json(
        { message: 'Please check your input and try again' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
