'use client';

import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Shield, Briefcase, Target } from "lucide-react"

interface OverviewCardsProps {
  userInfo: {
    name: string;
    email: string;
    role: string;
    id: string | number;
  };
  userRoles: {
    isAdmin: boolean;
    isCreator: boolean;
  };
}

export const OverviewCards = memo(({ userInfo, userRoles }: OverviewCardsProps) => {
  const { isAdmin, isCreator } = userRoles;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profile Info</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Name:</span>
              <span className="text-sm font-medium">{userInfo.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Email:</span>
              <span className="text-sm font-medium">{userInfo.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Role:</span>
              <Badge variant="secondary">{userInfo.role.toUpperCase()}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">ID:</span>
              <span className="text-sm font-mono">{String(userInfo.id).slice(0, 8)}...</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Stats</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Admin</div>
            <p className="text-xs text-muted-foreground">
              Full system access
            </p>
            <div className="mt-4 space-y-1">
              <div className="text-xs">• User Management</div>
              <div className="text-xs">• Platform Analytics</div>
              <div className="text-xs">• System Settings</div>
            </div>
          </CardContent>
        </Card>
      )}

      {isCreator && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Creator Stats</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Creator</div>
            <p className="text-xs text-muted-foreground">
              Portfolio & opportunities
            </p>
            <div className="mt-4 space-y-1">
              <div className="text-xs">• Portfolio Management</div>
              <div className="text-xs">• Browse Opportunities</div>
              <div className="text-xs">• Deal Tracking</div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Account Status</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">Active</div>
          <p className="text-xs text-muted-foreground">
            Account in good standing
          </p>
          <div className="mt-4 space-y-1">
            <div className="text-xs">• Email verified</div>
            <div className="text-xs">• Profile complete</div>
            <div className="text-xs">• Ready to use</div>
          </div>
        </CardContent>
      </Card>
    </>
  );
});

OverviewCards.displayName = 'OverviewCards';
