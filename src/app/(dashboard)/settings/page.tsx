'use client';

import { useAuth } from '@/contexts/AuthContext';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  AlertTriangle,
  Database,
  Shield,
  Mail,
  Palette,
  Bell,
  Key
} from "lucide-react";

export default function SettingsPage() {
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
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You don&apos;t have permission to access system settings. Administrator privileges are required.
            </AlertDescription>
          </Alert>
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
              <Settings className="h-6 w-6" />
              System Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure system-wide settings and preferences
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4">
        {/* Settings Categories */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configure database connections and backup settings.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Connection Status:</span>
                  <Badge variant="default">Connected</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Last Backup:</span>
                  <span className="text-muted-foreground">2 hours ago</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Configure Database
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage authentication and security policies.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>2FA Enabled:</span>
                  <Badge variant="secondary">Optional</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Session Timeout:</span>
                  <span className="text-muted-foreground">2 hours</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Security Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configure SMTP settings and email templates.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>SMTP Status:</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Daily Limit:</span>
                  <span className="text-muted-foreground">1000 emails</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Email Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Customize the look and feel of the dashboard.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Theme:</span>
                  <Badge variant="outline">Dark</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Accent Color:</span>
                  <span className="text-muted-foreground">Lime</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Appearance Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configure system notifications and alerts.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Email Alerts:</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Push Notifications:</span>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Notification Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage API keys and integrations.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Active Keys:</span>
                  <Badge variant="default">3</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Last Used:</span>
                  <span className="text-muted-foreground">5 minutes ago</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Manage API Keys
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-lg">v1.0.0</div>
                <div className="text-muted-foreground">Version</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-lg">99.9%</div>
                <div className="text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-lg">2.1GB</div>
                <div className="text-muted-foreground">Memory Usage</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-lg">45GB</div>
                <div className="text-muted-foreground">Storage Used</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
