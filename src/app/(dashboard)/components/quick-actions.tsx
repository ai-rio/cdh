'use client';

import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  BarChart3, 
  Settings, 
  Mail,
  Briefcase, 
  Target, 
  Search,
  Plus
} from "lucide-react"

interface QuickActionsProps {
  userRoles: {
    isAdmin: boolean;
    isCreator: boolean;
  };
}

export const QuickActions = memo(({ userRoles }: QuickActionsProps) => {
  const { isAdmin, isCreator } = userRoles;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Quick Actions</CardTitle>
        <CardDescription>
          Common tasks and shortcuts for your role
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {isCreator && (
            <>
              <Button className="w-full justify-start" variant="default">
                <Briefcase className="mr-2 h-4 w-4" />
                Update Portfolio
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Target className="mr-2 h-4 w-4" />
                Browse Opportunities
              </Button>
            </>
          )}
          
          {isAdmin && (
            <>
              <Button className="w-full justify-start" variant="default">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Platform Analytics
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Email Administration
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

QuickActions.displayName = 'QuickActions';
