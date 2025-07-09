'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginTest() {
  const { user, token, login, logout, isLoading, error } = useAuth();
  const [email, setEmail] = useState('testadmin@example.com');
  const [password, setPassword] = useState('TestPassword123!');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);
    
    try {
      await login(email, password);
      setLoginSuccess('Login successful!');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    logout();
    setLoginSuccess(null);
    setLoginError(null);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Admin Login Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Auth State */}
        <div className="bg-gray-700 p-4 rounded">
          <h3 className="text-white font-semibold mb-2">Current Authentication State:</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p><strong>Logged in:</strong> {user ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? `${user.name} (${user.email})` : 'None'}</p>
            <p><strong>Role:</strong> {user?.role || 'None'}</p>
            <p><strong>Has Token:</strong> {token ? 'Yes' : 'No'}</p>
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Login Form */}
        {!user && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter admin email"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter password"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Logging in...' : 'Login as Admin'}
            </Button>
          </form>
        )}

        {/* Logout Button */}
        {user && (
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Logout
          </Button>
        )}

        {/* Error/Success Messages */}
        {loginError && (
          <Alert className="border-red-600 bg-red-900/20">
            <AlertDescription className="text-red-400">{loginError}</AlertDescription>
          </Alert>
        )}
        
        {loginSuccess && (
          <Alert className="border-green-600 bg-green-900/20">
            <AlertDescription className="text-green-400">{loginSuccess}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="border-yellow-600 bg-yellow-900/20">
            <AlertDescription className="text-yellow-400">Auth Error: {error}</AlertDescription>
          </Alert>
        )}

        {/* Quick Login Buttons */}
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Quick Login Options:</p>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEmail('testadmin@example.com');
                setPassword('TestPassword123!');
              }}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Test Admin
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEmail('carlos@ai.rio.br');
                setPassword('AdminPassword123!');
              }}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Carlos Admin
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
