import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

// GET method for fetching a specific user (admin only)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
    
    // Check if user is admin or accessing their own profile
    if (user.role !== 'admin' && user.id !== params.id) {
      return NextResponse.json(
        { message: 'Access denied' },
        { status: 403 }
      )
    }
    
    // Fetch the user
    const userData = await payload.findByID({
      collection: 'users',
      id: params.id,
    })
    
    return NextResponse.json(userData)
  } catch (error: any) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { message: 'Error fetching user' },
      { status: 500 }
    )
  }
}

// PATCH method for updating a specific user (admin only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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
    
    const updateData = await request.json()
    
    // Update the user
    const updatedUser = await payload.update({
      collection: 'users',
      id: params.id,
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

// DELETE method for deleting a specific user (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
    
    // Prevent admin from deleting themselves
    if (params.id === user.id) {
      return NextResponse.json(
        { message: 'Cannot delete your own account' },
        { status: 400 }
      )
    }
    
    // Delete the user
    await payload.delete({
      collection: 'users',
      id: params.id,
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