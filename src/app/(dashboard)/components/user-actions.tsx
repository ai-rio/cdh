'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useVisualFeedback } from '../hooks/use-visual-feedback'
import { LoadingButton, StatusAlert } from './visual-feedback'
import {
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
  Settings,
  Download,
  Upload,
  Mail,
  Shield,
  Eye,
  Copy,
  Archive,
  RefreshCw,
} from 'lucide-react'

// Form schemas
const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Please select a role'),
  bio: z.string().optional(),
})

const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'creator', 'brand', 'user']),
  department: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>
type UserFormValues = z.infer<typeof userFormSchema>

interface UserActionsProps {
  userRole?: string
  userId?: string
  userName?: string
  onUserUpdate?: (data: any) => void
  onUserDelete?: (userId: string) => void
}

export function UserActions({
  userRole = 'user',
  userId,
  userName,
  onUserUpdate,
  onUserDelete,
}: UserActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Add visual feedback hook
  const feedback = useVisualFeedback()

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userName || '',
      email: '',
      role: userRole,
      bio: '',
    },
  })

  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      department: '',
    },
  })

  const handleProfileSubmit = async (data: ProfileFormValues) => {
    try {
      await feedback.withLoading('profile-update', async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        onUserUpdate?.(data)
        feedback.showSuccess('Profile updated successfully!', 'Your changes have been saved.')
        setIsEditDialogOpen(false)
        profileForm.reset()
      })
    } catch (error) {
      feedback.showError('Failed to update profile', 'Please check your connection and try again.')
    }
  }

  const handleUserCreate = async (data: UserFormValues) => {
    try {
      await feedback.withLoading('user-create', async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        feedback.showSuccess('User created successfully!', `${data.name} has been added to the system.`)
        setIsCreateDialogOpen(false)
        userForm.reset()
      })
    } catch (error) {
      feedback.showError('Failed to create user', 'Please check the information and try again.')
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      await feedback.withLoading('user-delete', async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        onUserDelete?.(userId || '')
        feedback.showSuccess('User deleted successfully!', 'The user has been removed from the system.')
        setIsDeleteDialogOpen(false)
      })
    } catch (error) {
      feedback.showError('Failed to delete user', 'Please try again or contact support.')
    }
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'view':
        toast.info(`Viewing details for ${userName || 'user'}`)
        break
      case 'copy':
        navigator.clipboard.writeText(userId || '')
        toast.success('User ID copied to clipboard!')
        break
      case 'archive':
        toast.info(`${userName || 'User'} archived successfully`)
        break
      case 'email':
        toast.info(`Opening email client for ${userName || 'user'}`)
        break
      case 'download':
        toast.info('Downloading user data...')
        break
      case 'refresh':
        toast.info('Refreshing user data...')
        break
      default:
        toast.info(`Action: ${action}`)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Quick Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => handleQuickAction('view')}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleQuickAction('copy')}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleQuickAction('email')}>
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => handleQuickAction('download')}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleQuickAction('refresh')}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleQuickAction('archive')}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to the user profile. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="creator">Creator</SelectItem>
                        <SelectItem value="brand">Brand</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Brief description about the user (optional).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={feedback.isLoading('profile-update')}
                >
                  Cancel
                </Button>
                <LoadingButton 
                  type="submit" 
                  isLoading={feedback.isLoading('profile-update')}
                  loadingText="Saving..."
                >
                  Save Changes
                </LoadingButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the user
              <strong> {userName || 'this user'}</strong> and remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={feedback.isLoading('user-delete')}
            >
              Cancel
            </Button>
            <LoadingButton 
              variant="destructive" 
              onClick={handleDeleteConfirm} 
              isLoading={feedback.isLoading('user-delete')}
              loadingText="Deleting..."
            >
              Delete User
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      {userRole === 'admin' && (
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system. Fill in the required information.
              </DialogDescription>
            </DialogHeader>

            <Form {...userForm}>
              <form onSubmit={userForm.handleSubmit(handleUserCreate)} className="space-y-4">
                <FormField
                  control={userForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={userForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={userForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center">
                              <Shield className="mr-2 h-4 w-4" />
                              Admin
                            </div>
                          </SelectItem>
                          <SelectItem value="creator">Creator</SelectItem>
                          <SelectItem value="brand">Brand</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={userForm.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter department (optional)" {...field} />
                      </FormControl>
                      <FormDescription>Optional department or team assignment.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={feedback.isLoading('user-create')}
                  >
                    Cancel
                  </Button>
                  <LoadingButton 
                    type="submit" 
                    isLoading={feedback.isLoading('user-create')}
                    loadingText="Creating..."
                  >
                    Create User
                  </LoadingButton>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Admin Actions Dropdown Component
export function AdminActionsDropdown() {
  const handleAdminAction = (action: string) => {
    switch (action) {
      case 'backup':
        toast.info('Starting system backup...')
        break
      case 'maintenance':
        toast.warning('Entering maintenance mode...')
        break
      case 'logs':
        toast.info('Opening system logs...')
        break
      case 'settings':
        toast.info('Opening system settings...')
        break
      default:
        toast.info(`Admin action: ${action}`)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Admin Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>System Administration</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleAdminAction('backup')}>
          <Download className="mr-2 h-4 w-4" />
          Create Backup
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleAdminAction('maintenance')}>
          <Settings className="mr-2 h-4 w-4" />
          Maintenance Mode
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleAdminAction('logs')}>
          <Eye className="mr-2 h-4 w-4" />
          View System Logs
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleAdminAction('settings')}>
          <Shield className="mr-2 h-4 w-4" />
          System Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
