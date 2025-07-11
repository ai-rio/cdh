'use client';

import { useAuth } from '@/contexts/AuthContext';
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Plus, Edit, Eye } from "lucide-react"

export default function PortfolioPage() {
  const { user } = useAuth();

  // Only allow creator access
  if (user?.role !== 'creator') {
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
              <CardTitle className="text-destructive">Unauthorized Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You don&apos;t have permission to access this page. Creator access required.</p>
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-primary">My Portfolio</h1>
            <p className="text-sm text-muted-foreground">Showcase your work and achievements</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Sample Project 1
              </CardTitle>
              <CardDescription>
                A showcase of creative work and collaboration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Badge variant="secondary">Design</Badge>
                  <Badge variant="secondary">Branding</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  This is a sample project demonstrating portfolio capabilities.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="mr-2 h-3 w-3" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Sample Project 2
              </CardTitle>
              <CardDescription>
                Another example of creative collaboration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Badge variant="secondary">Content</Badge>
                  <Badge variant="secondary">Social Media</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  This is another sample project for portfolio demonstration.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="mr-2 h-3 w-3" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <Plus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Add New Project</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Showcase your latest work and achievements
              </p>
              <Button>Create Project</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Statistics</CardTitle>
            <CardDescription>
              Track your portfolio performance and engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">2</div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">156</div>
                <p className="text-sm text-muted-foreground">Profile Views</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">12</div>
                <p className="text-sm text-muted-foreground">Inquiries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
