'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  Database,
  Sparkles,
  X
} from "lucide-react";

interface DeprecationNoticeProps {
  onDismiss?: () => void;
  autoRedirect?: boolean;
  redirectDelay?: number;
}

export function DeprecationNotice({ 
  onDismiss, 
  autoRedirect = false, 
  redirectDelay = 10 
}: DeprecationNoticeProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(redirectDelay);
  const [dismissed, setDismissed] = useState(false);

  // Auto-redirect countdown
  useEffect(() => {
    if (!autoRedirect || dismissed) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/dashboard/collections');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRedirect, dismissed, router]);

  // Handle manual navigation
  const handleNavigate = () => {
    router.push('/dashboard/collections');
  };

  // Handle dismiss
  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  return (
    <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-yellow-800 dark:text-yellow-200">
              Control Panel Deprecated
            </CardTitle>
            <Badge variant="outline" className="border-yellow-600 text-yellow-700">
              Legacy
            </Badge>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-yellow-600 hover:text-yellow-800"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-yellow-200 bg-yellow-100/50 dark:border-yellow-800 dark:bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            This control panel has been replaced with a new, enhanced dashboard that provides 
            better integration with Payload CMS and improved user experience.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
              <Database className="h-4 w-4" />
              What&apos;s New
            </h4>
            <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
              <li>• Native Payload CMS integration</li>
              <li>• Dynamic collection management</li>
              <li>• Enhanced user interface with shadcn/ui</li>
              <li>• Real-time data updates</li>
              <li>• Improved performance and reliability</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Enhanced Features
            </h4>
            <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
              <li>• Advanced search and filtering</li>
              <li>• Bulk operations support</li>
              <li>• Better mobile responsiveness</li>
              <li>• Comprehensive activity logging</li>
              <li>• Professional timeline interface</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300">
            <Clock className="h-4 w-4" />
            {autoRedirect ? (
              <span>Redirecting in {countdown} seconds...</span>
            ) : (
              <span>Please migrate to the new dashboard</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {autoRedirect && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDismissed(true)}
                className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
              >
                Stay Here
              </Button>
            )}
            <Button
              onClick={handleNavigate}
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Go to New Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DeprecationNotice;
