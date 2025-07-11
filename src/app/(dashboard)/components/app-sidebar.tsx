'use client'

import * as React from "react"
import {
  BarChart3,
  Home,
  Settings,
  Users,
  Mail,
  Briefcase,
  Search,
  Target,
  LogOut,
  User,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"

// Menu items based on user role
const getMenuItems = (userRole: string) => {
  const baseItems = [
    {
      title: "Overview",
      url: "/dashboard/dashboard",
      icon: Home,
    },
  ]

  if (userRole === 'admin') {
    return [
      ...baseItems,
      {
        title: "User Management",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        title: "Platform Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3,
      },
      {
        title: "System Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
      {
        title: "Email",
        url: "/dashboard/email",
        icon: Mail,
      },
    ]
  }

  if (userRole === 'creator') {
    return [
      ...baseItems,
      {
        title: "Portfolio",
        url: "/dashboard/portfolio",
        icon: Briefcase,
      },
      {
        title: "Opportunities",
        url: "/dashboard/opportunities",
        icon: Target,
      },
    ]
  }

  if (userRole === 'brand') {
    return [
      ...baseItems,
      {
        title: "Campaigns",
        url: "/dashboard/campaigns",
        icon: Target,
      },
      {
        title: "Find Creators",
        url: "/dashboard/creators",
        icon: Search,
      },
    ]
  }

  return baseItems
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth()
  
  const menuItems = React.useMemo(() => {
    return getMenuItems(user?.role || 'creator')
  }, [user?.role])

  const dashboardTitle = React.useMemo(() => {
    if (user?.role === 'admin') return 'Admin Command Center'
    if (user?.role === 'creator') return 'Creator Dashboard'
    return 'Brand Dashboard'
  }, [user?.role])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">CDH</span>
            <span className="truncate text-xs text-muted-foreground">
              {user?.role === 'admin' ? 'Admin' : user?.role === 'creator' ? 'Creator' : 'Brand'}
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{dashboardTitle}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                <User className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {user?.role?.toUpperCase()}
              </Badge>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="flex items-center justify-between px-2 py-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex-1 justify-start text-destructive hover:text-destructive"
              >
                <LogOut className="size-4" />
                <span>Logout</span>
              </Button>
              <ThemeToggle />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
