import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

// GET method for fetching all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Authenticate the user
    const { user } = await payload.auth({ headers: request.headers })
    
    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      )
    }
    
    // Get query parameters for pagination and filtering
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search') || ''
    const role = url.searchParams.get('role') || ''
    
    // Build where clause
    const where: any = {}
    
    if (search) {
      where.or = [
        {
          name: {
            contains: search,
          },
        },
        {
          email: {
            contains: search,
          },
        },
      ]
    }
    
    if (role && role !== 'all') {
      where.role = {
        equals: role,
      }
    }
    
    // Fetch users
    const users = await payload.find({
      collection: 'users',
      where,
      page,
      limit,
      sort: '-createdAt',
    })
    
    return NextResponse.json(users)
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { message: 'Error fetching users' },
      { status: 500 }
    )
  }
}

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

// PATCH method for updating users (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Authenticate the user
    const { user } = await payload.auth({ headers: request.headers })
    
    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      )
    }
    
    const { id, ...updateData } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }
    
    // Update the user
    const updatedUser = await payload.update({
      collection: 'users',
      id,
      data: updateData,
    })
    
    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { message: 'Error updating user' },
      { status: 500 }
    )
  }
}

// DELETE method for deleting users (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Authenticate the user
    const { user } = await payload.auth({ headers: request.headers })
    
    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      )
    }
    
    const { id } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }
    
    // Prevent admin from deleting themselves
    if (id === user.id) {
      return NextResponse.json(
        { message: 'Cannot delete your own account' },
        { status: 400 }
      )
    }
    
    // Delete the user
    await payload.delete({
      collection: 'users',
      id,
    })
    
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { message: 'Error deleting user' },
      { status: 500 }
    )
  }
}
