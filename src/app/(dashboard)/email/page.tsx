'use client';

import { useAuth } from '@/contexts/AuthContext';
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Mail, Database } from "lucide-react"
import dynamic from 'next/dynamic';

// Import Payload CMS PayloadEmailManager for email management
const PayloadEmailManager = dynamic(
  () => import('../components/payload-email-manager'),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="animate-pulse bg-muted h-8 w-40 rounded"></div>
            <div className="space-y-3">
              <div className="animate-pulse bg-muted h-10 w-full rounded"></div>
              <div className="animate-pulse bg-muted h-10 w-full rounded"></div>
              <div className="animate-pulse bg-muted h-32 w-full rounded"></div>
              <div className="animate-pulse bg-muted h-10 w-full rounded"></div>
            </div>
          </div>
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
              <CardTitle className="text-destructive flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Unauthorized Access
              </CardTitle>
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
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Mail className="h-6 w-6" />
              Email Administration
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage email templates, campaigns, and delivery with Payload CMS
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Payload CMS Integration Notice */}
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <Database className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <strong>Payload CMS Integration Active:</strong> This email management system is now powered by native Payload CMS with email adapter integration, template management, and delivery tracking.
          </AlertDescription>
        </Alert>

        {/* Payload CMS Email Manager */}
        <PayloadEmailManager />
      </div>
    </div>
  );
}
