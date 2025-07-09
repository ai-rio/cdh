'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Database, 
  Mail, 
  Shield, 
  Bell, 
  Palette,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Server,
  Key
} from 'lucide-react';

interface SystemConfig {
  general: {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  security: {
    jwtSecret: string;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireEmailVerification: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    adminAlerts: boolean;
    userWelcomeEmail: boolean;
  };
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    faviconUrl: string;
  };
}

interface SystemHealth {
  database: { status: 'healthy' | 'warning' | 'error'; message: string };
  storage: { status: 'healthy' | 'warning' | 'error'; message: string; usage: number };
  memory: { status: 'healthy' | 'warning' | 'error'; message: string; usage: number };
  api: { status: 'healthy' | 'warning' | 'error'; message: string; responseTime: number };
}

export default function SystemSettings() {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch('/api/admin/config');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockConfig: SystemConfig = {
          general: {
            siteName: "Creator's Deal Hub",
            siteDescription: "The ultimate platform for creator-brand collaborations",
            maintenanceMode: false,
            registrationEnabled: true
          },
          email: {
            smtpHost: "smtp.gmail.com",
            smtpPort: 587,
            smtpUser: "noreply@cdh.com",
            smtpPassword: "••••••••",
            fromEmail: "noreply@cdh.com",
            fromName: "Creator's Deal Hub"
          },
          security: {
            jwtSecret: "••••••••••••••••",
            sessionTimeout: 24,
            maxLoginAttempts: 5,
            passwordMinLength: 8,
            requireEmailVerification: true
          },
          notifications: {
            emailNotifications: true,
            pushNotifications: false,
            adminAlerts: true,
            userWelcomeEmail: true
          },
          appearance: {
            primaryColor: "#3B82F6",
            secondaryColor: "#1F2937",
            logoUrl: "/logo.png",
            faviconUrl: "/favicon.ico"
          }
        };

        const mockHealth: SystemHealth = {
          database: { status: 'healthy', message: 'Database connection stable' },
          storage: { status: 'healthy', message: 'Storage usage normal', usage: 45 },
          memory: { status: 'warning', message: 'Memory usage elevated', usage: 78 },
          api: { status: 'healthy', message: 'API responding normally', responseTime: 120 }
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setConfig(mockConfig);
        setHealth(mockHealth);
      } catch (err) {
        setError('Failed to load system configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async (section: keyof SystemConfig, data: any) => {
    try {
      setSaving(true);
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/admin/config/${section}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (config) {
        setConfig({ ...config, [section]: data });
      }
      setSuccess(`${section} settings saved successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Failed to save ${section} settings`);
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy': return 'bg-green-600';
      case 'warning': return 'bg-yellow-600';
      case 'error': return 'bg-red-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!config || !health) {
    return (
      <div className="text-center py-8 text-gray-400">
        Failed to load system configuration.
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

      {/* System Health Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Server className="h-5 w-5 mr-2" />
            System Health
          </CardTitle>
          <CardDescription className="text-gray-400">
            Monitor system components and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">Database</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(health.database.status)}
                <Badge className={getStatusColor(health.database.status)}>
                  {health.database.status}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">Storage</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(health.storage.status)}
                <Badge className={getStatusColor(health.storage.status)}>
                  {health.storage.usage}%
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">Memory</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(health.memory.status)}
                <Badge className={getStatusColor(health.memory.status)}>
                  {health.memory.usage}%
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">API</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(health.api.status)}
                <Badge className={getStatusColor(health.api.status)}>
                  {health.api.responseTime}ms
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Settings */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="general" className="data-[state=active]:bg-blue-600">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-blue-600">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-blue-600">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-blue-600">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings 
            config={config.general} 
            onSave={(data) => handleSave('general', data)}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="email">
          <EmailSettings 
            config={config.email} 
            onSave={(data) => handleSave('email', data)}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings 
            config={config.security} 
            onSave={(data) => handleSave('security', data)}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings 
            config={config.notifications} 
            onSave={(data) => handleSave('notifications', data)}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSettings 
            config={config.appearance} 
            onSave={(data) => handleSave('appearance', data)}
            saving={saving}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// General Settings Component
function GeneralSettings({ config, onSave, saving }: { 
  config: SystemConfig['general']; 
  onSave: (data: SystemConfig['general']) => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState(config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">General Settings</CardTitle>
        <CardDescription className="text-gray-400">
          Configure basic site information and features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="siteName" className="text-gray-300">Site Name</Label>
            <Input
              id="siteName"
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="siteDescription" className="text-gray-300">Site Description</Label>
            <Textarea
              id="siteDescription"
              value={formData.siteDescription}
              onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={formData.maintenanceMode}
              onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="maintenanceMode" className="text-gray-300">Maintenance Mode</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="registrationEnabled"
              checked={formData.registrationEnabled}
              onChange={(e) => setFormData({ ...formData, registrationEnabled: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="registrationEnabled" className="text-gray-300">Enable User Registration</Label>
          </div>
          <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Email Settings Component
function EmailSettings({ config, onSave, saving }: { 
  config: SystemConfig['email']; 
  onSave: (data: SystemConfig['email']) => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState(config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Email Configuration</CardTitle>
        <CardDescription className="text-gray-400">
          Configure SMTP settings for email delivery
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtpHost" className="text-gray-300">SMTP Host</Label>
              <Input
                id="smtpHost"
                value={formData.smtpHost}
                onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="smtpPort" className="text-gray-300">SMTP Port</Label>
              <Input
                id="smtpPort"
                type="number"
                value={formData.smtpPort}
                onChange={(e) => setFormData({ ...formData, smtpPort: parseInt(e.target.value) })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtpUser" className="text-gray-300">SMTP Username</Label>
              <Input
                id="smtpUser"
                value={formData.smtpUser}
                onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="smtpPassword" className="text-gray-300">SMTP Password</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={formData.smtpPassword}
                onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromEmail" className="text-gray-300">From Email</Label>
              <Input
                id="fromEmail"
                type="email"
                value={formData.fromEmail}
                onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="fromName" className="text-gray-300">From Name</Label>
              <Input
                id="fromName"
                value={formData.fromName}
                onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Email Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Security Settings Component
function SecuritySettings({ config, onSave, saving }: { 
  config: SystemConfig['security']; 
  onSave: (data: SystemConfig['security']) => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState(config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Security Settings</CardTitle>
        <CardDescription className="text-gray-400">
          Configure authentication and security policies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="jwtSecret" className="text-gray-300">JWT Secret</Label>
            <Input
              id="jwtSecret"
              type="password"
              value={formData.jwtSecret}
              onChange={(e) => setFormData({ ...formData, jwtSecret: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sessionTimeout" className="text-gray-300">Session Timeout (hours)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={formData.sessionTimeout}
                onChange={(e) => setFormData({ ...formData, sessionTimeout: parseInt(e.target.value) })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="maxLoginAttempts" className="text-gray-300">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={formData.maxLoginAttempts}
                onChange={(e) => setFormData({ ...formData, maxLoginAttempts: parseInt(e.target.value) })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="passwordMinLength" className="text-gray-300">Minimum Password Length</Label>
            <Input
              id="passwordMinLength"
              type="number"
              value={formData.passwordMinLength}
              onChange={(e) => setFormData({ ...formData, passwordMinLength: parseInt(e.target.value) })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="requireEmailVerification"
              checked={formData.requireEmailVerification}
              onChange={(e) => setFormData({ ...formData, requireEmailVerification: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="requireEmailVerification" className="text-gray-300">Require Email Verification</Label>
          </div>
          <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Security Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Notification Settings Component
function NotificationSettings({ config, onSave, saving }: { 
  config: SystemConfig['notifications']; 
  onSave: (data: SystemConfig['notifications']) => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState(config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Notification Settings</CardTitle>
        <CardDescription className="text-gray-400">
          Configure notification preferences and delivery methods
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={formData.emailNotifications}
                onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="emailNotifications" className="text-gray-300">Enable Email Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="pushNotifications"
                checked={formData.pushNotifications}
                onChange={(e) => setFormData({ ...formData, pushNotifications: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="pushNotifications" className="text-gray-300">Enable Push Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="adminAlerts"
                checked={formData.adminAlerts}
                onChange={(e) => setFormData({ ...formData, adminAlerts: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="adminAlerts" className="text-gray-300">Admin System Alerts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="userWelcomeEmail"
                checked={formData.userWelcomeEmail}
                onChange={(e) => setFormData({ ...formData, userWelcomeEmail: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="userWelcomeEmail" className="text-gray-300">Send Welcome Email to New Users</Label>
            </div>
          </div>
          <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Notification Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Appearance Settings Component
function AppearanceSettings({ config, onSave, saving }: { 
  config: SystemConfig['appearance']; 
  onSave: (data: SystemConfig['appearance']) => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState(config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Appearance Settings</CardTitle>
        <CardDescription className="text-gray-400">
          Customize the visual appearance of your platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryColor" className="text-gray-300">Primary Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-16 h-10 bg-gray-700 border-gray-600"
                />
                <Input
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="flex-1 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="secondaryColor" className="text-gray-300">Secondary Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-16 h-10 bg-gray-700 border-gray-600"
                />
                <Input
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="flex-1 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="logoUrl" className="text-gray-300">Logo URL</Label>
              <Input
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="faviconUrl" className="text-gray-300">Favicon URL</Label>
              <Input
                id="faviconUrl"
                value={formData.faviconUrl}
                onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Appearance Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}