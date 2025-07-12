'use client';

import { useAuth } from '@/contexts/AuthContext';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Search,
  Filter,
  Star,
  Clock,
  DollarSign,
  MapPin
} from "lucide-react";

export default function OpportunitiesPage() {
  const { user } = useAuth();

  // Mock opportunities data
  const opportunities = [
    {
      id: 1,
      title: "Tech Product Launch Campaign",
      company: "TechCorp Inc.",
      budget: "$5,000 - $10,000",
      deadline: "2024-08-15",
      location: "Remote",
      category: "Technology",
      status: "Open",
      description: "Looking for tech influencers to promote our new smartphone launch.",
      requirements: ["10K+ followers", "Tech content", "Video creation"],
    },
    {
      id: 2,
      title: "Fashion Brand Collaboration",
      company: "StyleCo",
      budget: "$2,000 - $5,000",
      deadline: "2024-07-30",
      location: "New York, NY",
      category: "Fashion",
      status: "Urgent",
      description: "Seeking fashion creators for summer collection promotion.",
      requirements: ["Fashion content", "Instagram presence", "Professional photos"],
    },
    {
      id: 3,
      title: "Food & Lifestyle Content",
      company: "Gourmet Foods",
      budget: "$1,000 - $3,000",
      deadline: "2024-08-01",
      location: "Los Angeles, CA",
      category: "Food & Beverage",
      status: "Open",
      description: "Partner with us to showcase our organic food products.",
      requirements: ["Food content", "Recipe creation", "Story posts"],
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-px bg-border" />
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Target className="h-6 w-6" />
              Opportunities
            </h1>
            <p className="text-sm text-muted-foreground">
              Discover brand collaboration opportunities
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +3 from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applied</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Pending review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Active campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,500</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Opportunities List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Available Opportunities</h2>
            <Badge variant="secondary">{opportunities.length} opportunities</Badge>
          </div>

          {opportunities.map((opportunity) => (
            <Card key={opportunity.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {opportunity.company}
                    </p>
                  </div>
                  <Badge 
                    variant={opportunity.status === 'Urgent' ? 'destructive' : 'default'}
                  >
                    {opportunity.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {opportunity.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{opportunity.budget}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{opportunity.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>{opportunity.category}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.requirements.map((req, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">
                    Apply Now
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
