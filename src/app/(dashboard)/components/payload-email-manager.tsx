'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Send, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Settings
} from "lucide-react";
import { toast } from "sonner";
import { PayloadClient } from '../../../lib/payload-client';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'welcome' | 'reset' | 'notification' | 'custom';
}

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt: string;
  template?: string;
}

export default function PayloadEmailManager() {
  const [emailForm, setEmailForm] = useState({
    to: '',
    subject: '',
    content: '',
    template: ''
  });
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSent: 0,
    totalFailed: 0,
    totalPending: 0
  });
  
  const payloadClient = new PayloadClient();

  useEffect(() => {
    loadEmailData();
  }, []);

  const loadEmailData = async () => {
    try {
      // Load email templates and logs from Payload CMS
      // This would typically be from a custom collection for email management
      const mockTemplates: EmailTemplate[] = [
        {
          id: '1',
          name: 'Welcome Email',
          subject: 'Welcome to Creator Deal Hub!',
          content: 'Welcome to our platform! We\'re excited to have you on board.',
          type: 'welcome'
        },
        {
          id: '2',
          name: 'Password Reset',
          subject: 'Reset Your Password',
          content: 'Click the link below to reset your password.',
          type: 'reset'
        },
        {
          id: '3',
          name: 'Campaign Notification',
          subject: 'New Campaign Available',
          content: 'A new campaign matching your profile is available.',
          type: 'notification'
        }
      ];

      const mockLogs: EmailLog[] = [
        {
          id: '1',
          to: 'user@example.com',
          subject: 'Welcome to Creator Deal Hub!',
          status: 'sent',
          sentAt: new Date().toISOString(),
          template: 'Welcome Email'
        },
        {
          id: '2',
          to: 'creator@example.com',
          subject: 'New Campaign Available',
          status: 'sent',
          sentAt: new Date(Date.now() - 3600000).toISOString(),
          template: 'Campaign Notification'
        },
        {
          id: '3',
          to: 'brand@example.com',
          subject: 'Reset Your Password',
          status: 'failed',
          sentAt: new Date(Date.now() - 7200000).toISOString(),
          template: 'Password Reset'
        }
      ];

      setTemplates(mockTemplates);
      setEmailLogs(mockLogs);
      
      // Calculate stats
      setStats({
        totalSent: mockLogs.filter(log => log.status === 'sent').length,
        totalFailed: mockLogs.filter(log => log.status === 'failed').length,
        totalPending: mockLogs.filter(log => log.status === 'pending').length
      });
    } catch (error) {
      console.error('Error loading email data:', error);
      toast.error("Failed to load email data");
    }
  };

  const handleSendEmail = async () => {
    if (!emailForm.to || !emailForm.subject || !emailForm.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, this would use Payload's email functionality
      // For now, we'll simulate the email sending
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newLog: EmailLog = {
        id: Date.now().toString(),
        to: emailForm.to,
        subject: emailForm.subject,
        status: 'sent',
        sentAt: new Date().toISOString(),
        template: emailForm.template || 'Custom'
      };

      setEmailLogs(prev => [newLog, ...prev]);
      setStats(prev => ({ ...prev, totalSent: prev.totalSent + 1 }));
      
      // Reset form
      setEmailForm({ to: '', subject: '', content: '', template: '' });
      
      toast.success("Email sent successfully!");
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error("Failed to send email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (template: EmailTemplate) => {
    setEmailForm(prev => ({
      ...prev,
      subject: template.subject,
      content: template.content,
      template: template.name
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: 'default',
      failed: 'destructive',
      pending: 'secondary'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Email Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalSent}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.totalFailed}</div>
            <p className="text-xs text-muted-foreground">Delivery failed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.totalPending}</div>
            <p className="text-xs text-muted-foreground">In queue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Send Email Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-to">To</Label>
              <Input
                id="email-to"
                type="email"
                placeholder="recipient@example.com"
                value={emailForm.to}
                onChange={(e) => setEmailForm(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                placeholder="Email subject"
                value={emailForm.subject}
                onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-content">Content</Label>
              <Textarea
                id="email-content"
                placeholder="Email content..."
                rows={6}
                value={emailForm.content}
                onChange={(e) => setEmailForm(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>

            <Button 
              onClick={handleSendEmail} 
              disabled={isLoading}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? 'Sending...' : 'Send Email'}
            </Button>
          </CardContent>
        </Card>

        {/* Email Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Email Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{template.name}</h4>
                    <Badge variant="outline">{template.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.subject}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent Email Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emailLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No email activity yet
              </div>
            ) : (
              emailLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(log.status)}
                    <div>
                      <p className="font-medium">{log.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        To: {log.to} • {new Date(log.sentAt).toLocaleString()}
                      </p>
                      {log.template && (
                        <p className="text-xs text-muted-foreground">
                          Template: {log.template}
                        </p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(log.status)}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Integration Notice */}
      <Alert>
        <Settings className="h-4 w-4" />
        <AlertDescription>
          This email management system is integrated with Payload CMS. Configure your email adapter in the Payload config to enable actual email sending functionality.
        </AlertDescription>
      </Alert>
    </div>
  );
}
