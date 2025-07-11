'use client';

import { useAuth } from '@/contexts/AuthContext';
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from 'next/dynamic';

// Dynamically import ResendAdminUI to prevent SSR issues
const ResendAdminUI = dynamic(
  () => import('@/app/(frontend)/components/admin/ResendAdminUI'),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse bg-muted h-32 rounded-lg"></div>
        </CardContent>
      </Card>
    )
  }
);

export default function EmailPage() {
  const { user } = useAuth();

  // Only allow admin access
  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-border" />
            <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Unauthorized Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You don&apos;t have permission to access this page. Admin access required.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-px bg-border" />
          <h1 className="text-2xl font-bold text-primary">Email Administration</h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <ResendAdminUI />
      </div>
    </div>
  );
}
