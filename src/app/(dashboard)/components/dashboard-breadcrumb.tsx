"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home, Users, Briefcase, Settings, BarChart3 } from "lucide-react"

const routeConfig = {
  "/dashboard": {
    label: "Dashboard",
    icon: Home,
  },
  "/dashboard/admin": {
    label: "Admin",
    icon: Settings,
  },
  "/dashboard/creator": {
    label: "Creator",
    icon: Users,
  },
  "/dashboard/brand": {
    label: "Brand",
    icon: Briefcase,
  },
  "/dashboard/analytics": {
    label: "Analytics",
    icon: BarChart3,
  },
}

export function DashboardBreadcrumb() {
  const pathname = usePathname()
  
  // Handle null pathname case
  if (!pathname) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }
  
  // Generate breadcrumb items based on current path
  const pathSegments = pathname.split("/").filter(Boolean)
  const breadcrumbItems = []
  
  // Always start with Dashboard
  breadcrumbItems.push({
    href: "/dashboard",
    label: "Dashboard",
    icon: Home,
    isLast: pathname === "/dashboard"
  })
  
  // Add subsequent path segments
  let currentPath = ""
  for (let i = 0; i < pathSegments.length; i++) {
    currentPath += `/${pathSegments[i]}`
    
    if (currentPath !== "/dashboard" && routeConfig[currentPath as keyof typeof routeConfig]) {
      const config = routeConfig[currentPath as keyof typeof routeConfig]
      breadcrumbItems.push({
        href: currentPath,
        label: config.label,
        icon: config.icon,
        isLast: i === pathSegments.length - 1
      })
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item) => (
          <div key={item.href} className="flex items-center">
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink 
                  href={item.href}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
