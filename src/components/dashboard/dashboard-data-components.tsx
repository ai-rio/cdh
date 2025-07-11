"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable, createSortableHeader, createActionColumn } from "@/components/ui/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Calendar,
  Mail,
  Shield,
  Clock,
  BarChart3
} from "lucide-react"

// Types for our data
interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive" | "pending"
  lastLogin: string
  avatar?: string
}

interface ActivityLog {
  id: string
  user: string
  action: string
  timestamp: string
  status: "success" | "warning" | "error"
}

interface MetricData {
  title: string
  value: string | number
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ComponentType<{ className?: string }>
}

// Sample data - in real app this would come from API
const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-15T10:30:00Z",
    avatar: "/avatars/john.jpg"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "creator",
    status: "active",
    lastLogin: "2024-01-14T15:45:00Z"
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "user",
    status: "pending",
    lastLogin: "2024-01-13T09:15:00Z"
  }
]

const sampleActivity: ActivityLog[] = [
  {
    id: "1",
    user: "John Doe",
    action: "Created new project",
    timestamp: "2024-01-15T10:30:00Z",
    status: "success"
  },
  {
    id: "2",
    user: "Jane Smith",
    action: "Updated user profile",
    timestamp: "2024-01-14T15:45:00Z",
    status: "success"
  },
  {
    id: "3",
    user: "Bob Wilson",
    action: "Failed login attempt",
    timestamp: "2024-01-13T09:15:00Z",
    status: "error"
  }
]

const sampleMetrics: MetricData[] = [
  {
    title: "Total Users",
    value: 1234,
    change: "+12%",
    trend: "up",
    icon: Users
  },
  {
    title: "Active Sessions",
    value: 89,
    change: "+5%",
    trend: "up",
    icon: Activity
  },
  {
    title: "Revenue",
    value: "$12,345",
    change: "-2%",
    trend: "down",
    icon: TrendingUp
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "+0.5%",
    trend: "up",
    icon: BarChart3
  }
]

// User table columns
const userColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
        className="rounded border border-input"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(e.target.checked)}
        className="rounded border border-input"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: createSortableHeader("Name"),
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: createSortableHeader("Email"),
    cell: ({ row }) => (
      <div className="flex items-center space-x-1">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <span>{row.getValue("email")}</span>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: createSortableHeader("Role"),
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <Badge variant={role === "admin" ? "default" : role === "creator" ? "secondary" : "outline"}>
          <Shield className="h-3 w-3 mr-1" />
          {role.toUpperCase()}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: createSortableHeader("Status"),
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge 
          variant={
            status === "active" ? "default" : 
            status === "pending" ? "secondary" : 
            "destructive"
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "lastLogin",
    header: createSortableHeader("Last Login"),
    cell: ({ row }) => {
      const date = new Date(row.getValue("lastLogin"))
      return (
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{date.toLocaleDateString()}</span>
        </div>
      )
    },
  },
  createActionColumn<User>([
    {
      label: "Edit User",
      onClick: (user) => console.log("Edit user:", user.id),
    },
    {
      label: "View Details",
      onClick: (user) => console.log("View user:", user.id),
    },
    {
      label: "Delete User",
      onClick: (user) => console.log("Delete user:", user.id),
      variant: "destructive",
    },
  ]),
]

// Activity log columns
const activityColumns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "user",
    header: createSortableHeader("User"),
  },
  {
    accessorKey: "action",
    header: createSortableHeader("Action"),
  },
  {
    accessorKey: "timestamp",
    header: createSortableHeader("Time"),
    cell: ({ row }) => {
      const date = new Date(row.getValue("timestamp"))
      return (
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{date.toLocaleString()}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: createSortableHeader("Status"),
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge 
          variant={
            status === "success" ? "default" : 
            status === "warning" ? "secondary" : 
            "destructive"
          }
        >
          {status}
        </Badge>
      )
    },
  },
]

// Loading skeleton components
export function DataTableSkeleton() {
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[100px] ml-auto" />
      </div>
      <div className="rounded-md border">
        <div className="p-4">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-6 w-[80px]" />
                <Skeleton className="h-6 w-[80px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-8 w-[80px]" />
        <Skeleton className="h-8 w-[80px]" />
      </div>
    </div>
  )
}

export function MetricCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[80px] mb-2" />
        <Skeleton className="h-4 w-[60px]" />
      </CardContent>
    </Card>
  )
}

// Main data components
export function UserManagementTable({ isLoading = false }: { isLoading?: boolean }) {
  if (isLoading) {
    return <DataTableSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>User Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={userColumns}
          data={sampleUsers}
          searchKey="name"
          searchPlaceholder="Search users..."
        />
      </CardContent>
    </Card>
  )
}

export function ActivityLogTable({ isLoading = false }: { isLoading?: boolean }) {
  if (isLoading) {
    return <DataTableSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={activityColumns}
          data={sampleActivity}
          searchKey="user"
          searchPlaceholder="Search activity..."
        />
      </CardContent>
    </Card>
  )
}

export function MetricsGrid({ isLoading = false }: { isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {sampleMetrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${
                metric.trend === "up" ? "text-green-600" : 
                metric.trend === "down" ? "text-red-600" : 
                "text-muted-foreground"
              }`}>
                {metric.change} from last month
              </p>
              <Progress 
                value={Math.random() * 100} 
                className="mt-2 h-2" 
              />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Responsive data visualization component
export function ResponsiveDataVisualization({ isLoading = false }: { isLoading?: boolean }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-[100px]" />
              <Skeleton className="h-[100px]" />
              <Skeleton className="h-[100px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Data Visualization</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Simulated chart area */}
          <div className="h-[200px] bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Chart visualization would go here</p>
              <p className="text-sm text-muted-foreground">Integration with Chart.js or similar</p>
            </div>
          </div>
          
          {/* Responsive grid of mini metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary">85%</div>
              <div className="text-sm text-muted-foreground">System Health</div>
              <Progress value={85} className="mt-2 h-2" />
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary">42</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
              <Progress value={70} className="mt-2 h-2" />
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary">98.5%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
              <Progress value={98.5} className="mt-2 h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
