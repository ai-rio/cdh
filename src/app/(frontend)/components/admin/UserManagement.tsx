'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, UserCheck, UserX, AlertCircle, Shield, User as UserIcon, Building, UserPlus } from 'lucide-react';
import { User as PayloadUser } from '@/payload-types';
import { useAuth } from '@/contexts/AuthContext';

// Using User type from payload-types.ts

interface PayloadResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export default function UserManagement() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<PayloadUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PayloadUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Debug logging
  console.log('UserManagement - Current User:', currentUser);
  console.log('UserManagement - Token exists:', !!token);
  console.log('UserManagement - User role:', currentUser?.role);

  // Fetch users from Payload API
  const fetchUsers = async () => {
    if (!token || currentUser?.role !== 'admin') {
      setError('Unauthorized: Admin access required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/users?limit=100', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in again');
        } else if (response.status === 403) {
          throw new Error('Forbidden: Admin access required');
        } else {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }
      }

      const data: PayloadResponse<PayloadUser> = await response.json();
      setUsers(data.docs || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, [token, currentUser]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = async (userData: Partial<PayloadUser>) => {
    if (!token || currentUser?.role !== 'admin') {
      setError('Unauthorized: Admin access required');
      return;
    }

    try {
      setError(null);
      
      const userDataWithPassword = {
        ...userData,
        password: 'TempPassword123!', // Temporary password - user should reset
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userDataWithPassword),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      const newUser = await response.json();
      setUsers([...users, newUser.doc || newUser]);
      setSuccess('User created successfully');
      setIsCreateModalOpen(false);
      // Refresh users list
      fetchUsers();
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async (userId: string, userData: Partial<PayloadUser>) => {
    if (!token || currentUser?.role !== 'admin') {
      setError('Unauthorized: Admin access required');
      return;
    }
    
    try {
      setError(null);
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => user.id === userId ? (updatedUser.doc || updatedUser) : user));
      setSuccess('User updated successfully');
      setEditingUser(null);
      // Refresh users list
      fetchUsers();
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!token || currentUser?.role !== 'admin') {
      setError('Unauthorized: Admin access required');
      return;
    }

    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setError(null);
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      setUsers(users.filter(user => user.id !== userId));
      setSuccess('User deleted successfully');
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(err.message || 'Failed to delete user');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'brand': return <Building className="h-4 w-4" />;
      case 'creator': return <UserIcon className="h-4 w-4" />;
      default: return <UserIcon className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-600';
      case 'brand': return 'bg-blue-600';
      case 'creator': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  // Check if current user is admin
  if (currentUser?.role !== 'admin') {
    return (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">User Management</CardTitle>
            <CardDescription className="text-gray-400">
              Manage user accounts, roles, and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="border-red-600 bg-red-900/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-400">
                Access denied. Admin privileges required to manage users.
                <br />
                Current user: {currentUser?.name || 'Not logged in'} 
                <br />
                Current role: {currentUser?.role || 'No role'}
                <br />
                Has token: {token ? 'Yes' : 'No'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">User Management</CardTitle>
            <CardDescription className="text-gray-400">
              Loading user data...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-400">Loading users...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {error && (
        <Alert className="border-red-600 bg-red-900/20">
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="border-green-600 bg-green-900/20">
          <AlertDescription className="text-green-400">{success}</AlertDescription>
        </Alert>
      )}

      {/* Header and Controls */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">User Management</CardTitle>
          <CardDescription className="text-gray-400">
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              <option value="all">All Roles</option>
              <option value="creator">Creators</option>
              <option value="brand">Brands</option>
              <option value="admin">Admins</option>
            </select>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New User</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Add a new user to the platform
                  </DialogDescription>
                </DialogHeader>
                <CreateUserForm onSubmit={handleCreateUser} onCancel={() => setIsCreateModalOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">User</th>
                  <th className="text-left py-3 px-4 text-gray-300">Role</th>
                  <th className="text-left py-3 px-4 text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300">Last Login</th>
                  <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>
                        <span className="mr-1">{getRoleIcon(user.role)}</span>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={user.status === 'active' ? 'default' : 'secondary'}
                        className={user.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingUser(user)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id)}
                          className="border-red-600 text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No users found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Edit User</DialogTitle>
              <DialogDescription className="text-gray-400">
                Update user information and permissions
              </DialogDescription>
            </DialogHeader>
            <EditUserForm 
              user={editingUser} 
              onSubmit={(data) => handleUpdateUser(editingUser.id, data)}
              onCancel={() => setEditingUser(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Create User Form Component
function CreateUserForm({ onSubmit, onCancel }: { onSubmit: (data: Partial<PayloadUser>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'creator' as const,
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-gray-300">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
      <div>
        <Label htmlFor="email" className="text-gray-300">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
      <div>
        <Label htmlFor="role" className="text-gray-300">Role</Label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        >
          <option value="creator">Creator</option>
          <option value="brand">Brand</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <Label htmlFor="password" className="text-gray-300">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} className="border-gray-600 text-gray-300">
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Create User
        </Button>
      </div>
    </form>
  );
}

// Edit User Form Component
function EditUserForm({ user, onSubmit, onCancel }: { user: PayloadUser; onSubmit: (data: Partial<PayloadUser>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-name" className="text-gray-300">Name</Label>
        <Input
          id="edit-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
      <div>
        <Label htmlFor="edit-email" className="text-gray-300">Email</Label>
        <Input
          id="edit-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
      <div>
        <Label htmlFor="edit-role" className="text-gray-300">Role</Label>
        <select
          id="edit-role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        >
          <option value="creator">Creator</option>
          <option value="brand">Brand</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <Label htmlFor="edit-status" className="text-gray-300">Status</Label>
        <select
          id="edit-status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} className="border-gray-600 text-gray-300">
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Update User
        </Button>
      </div>
    </form>
  );
}