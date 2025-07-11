'use client';

import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, User } from "lucide-react"

interface RecentActivityProps {
  userRoles: {
    isAdmin: boolean;
    isCreator: boolean;
  };
}

export const RecentActivity = memo(({ userRoles }: RecentActivityProps) => {
  const { isAdmin, isCreator } = userRoles;

  const getActivities = () => {
    const baseActivities = [
      {
        icon: CheckCircle,
        title: "Account created successfully",
        time: "Just now",
        status: "completed"
      },
      {
        icon: User,
        title: "Profile setup completed",
        time: "2 minutes ago",
        status: "completed"
      }
    ];

    if (isAdmin) {
      return [
        ...baseActivities,
        {
          icon: CheckCircle,
          title: "Welcome to Admin Command Center!",
          time: "3 minutes ago",
          status: "info"
        }
      ];
    }

    if (isCreator) {
      return [
        ...baseActivities,
        {
          icon: CheckCircle,
          title: "Welcome to Creator's Deal Hub!",
          time: "3 minutes ago",
          status: "info"
        }
      ];
    }

    return baseActivities;
  };

  const activities = getActivities();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Recent Activity</CardTitle>
        <CardDescription>
          Your latest actions and updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <activity.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.title}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                  <Badge 
                    variant={activity.status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {activity.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
          
          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>All activities are up to date</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

RecentActivity.displayName = 'RecentActivity';
