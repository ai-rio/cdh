'use client';

import { useAuth } from '@/contexts/AuthContext';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Plus,
  BarChart3,
  Users,
  Eye,
  Heart,
  Share,
  TrendingUp
} from "lucide-react";

export default function CampaignsPage() {
  const { user } = useAuth();

  // Mock campaigns data
  const campaigns = [
    {
      id: 1,
      name: "Summer Collection Launch",
      status: "Active",
      budget: "$25,000",
      spent: "$18,500",
      progress: 74,
      creators: 12,
      reach: "2.4M",
      engagement: "156K",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      description: "Promoting our new summer fashion collection through lifestyle influencers.",
    },
    {
      id: 2,
      name: "Tech Product Demo",
      status: "Planning",
      budget: "$15,000",
      spent: "$0",
      progress: 0,
      creators: 0,
      reach: "0",
      engagement: "0",
      startDate: "2024-08-15",
      endDate: "2024-09-30",
      description: "Showcase our latest smartphone features through tech reviewers.",
    },
    {
      id: 3,
      name: "Holiday Special",
      status: "Completed",
      budget: "$30,000",
      spent: "$28,750",
      progress: 100,
      creators: 18,
      reach: "3.8M",
      engagement: "285K",
      startDate: "2023-11-01",
      endDate: "2023-12-31",
      description: "Holiday season promotional campaign with lifestyle and fashion creators.",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Planning': return 'secondary';
      case 'Completed': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-px bg-border" />
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Target className="h-6 w-6" />
              Campaigns
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your influencer marketing campaigns
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4">
        {/* Campaign Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaigns.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Creators</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {campaigns.reduce((sum, c) => sum + c.creators, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6.2M</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">441K</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Campaigns</h2>
            <Badge variant="secondary">{campaigns.length} campaigns</Badge>
          </div>

          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {campaign.description}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium">Budget</p>
                    <p className="text-lg font-bold">{campaign.budget}</p>
                    <p className="text-xs text-muted-foreground">
                      Spent: {campaign.spent}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Creators</p>
                    <p className="text-lg font-bold">{campaign.creators}</p>
                    <p className="text-xs text-muted-foreground">
                      Active collaborators
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Reach</p>
                    <p className="text-lg font-bold">{campaign.reach}</p>
                    <p className="text-xs text-muted-foreground">
                      Total impressions
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Engagement</p>
                    <p className="text-lg font-bold">{campaign.engagement}</p>
                    <p className="text-xs text-muted-foreground">
                      Likes, comments, shares
                    </p>
                  </div>
                </div>

                {campaign.status === 'Active' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Campaign Progress</span>
                      <span>{campaign.progress}%</span>
                    </div>
                    <Progress value={campaign.progress} className="h-2" />
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{campaign.startDate} - {campaign.endDate}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{campaign.reach}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{campaign.engagement}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Creators
                    </Button>
                  </div>
                  <Button size="sm">
                    View Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
