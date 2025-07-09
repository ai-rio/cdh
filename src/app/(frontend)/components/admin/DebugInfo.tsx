'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugInfo() {
  const { user, token, isLoading, isInitialized, error } = useAuth();

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="text-white">
        <div className="space-y-2">
          <p><strong>Is Initialized:</strong> {isInitialized ? 'Yes' : 'No'}</p>
          <p><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Has Token:</strong> {token ? 'Yes' : 'No'}</p>
          <p><strong>Token Length:</strong> {token ? token.length : 'N/A'}</p>
          <p><strong>User Exists:</strong> {user ? 'Yes' : 'No'}</p>
          {user && (
            <>
              <p><strong>User Name:</strong> {user.name}</p>
              <p><strong>User Email:</strong> {user.email}</p>
              <p><strong>User Role:</strong> {user.role}</p>
              <p><strong>User ID:</strong> {user.id}</p>
            </>
          )}
          {error && <p><strong>Auth Error:</strong> {error}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
