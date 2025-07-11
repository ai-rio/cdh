"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useVisualFeedback } from "../hooks/use-visual-feedback"
import { EnhancedRecentActivity } from "./enhanced-recent-activity"
import { 
  StatusAlert, 
  ProgressWithLabel, 
  LoadingCard, 
  StatusBadge, 
  LoadingButton,
  RetryComponent 
} from "./visual-feedback"
import { 
  Users, 
  Activity, 
  TrendingUp,
  Clock,
  RefreshCw,
  Download
} from "lucide-react"

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  systemHealth: "healthy" | "warning" | "error"
  uptime: number
}

export function EnhancedOverview() {
  const feedback = useVisualFeedback()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(true)

  // Simulate data loading
  const loadDashboardData = async () => {
    try {
      await feedback.withLoading('dashboard-data', async () => {
        // Simulate API call with progress
        for (let i = 0; i <= 100; i += 20) {
          feedback.setProgress(i)
          await new Promise(resolve => setTimeout(resolve, 200))
        }
        
        // Simulate potential error (20% chance)
        if (Math.random() < 0.2) {
          throw new Error("Failed to load dashboard data")
        }
        
        setStats({
          totalUsers: 1234,
          activeUsers: 892,
          systemHealth: "healthy",
          uptime: 99.9
        })
        
        feedback.showSuccess("Dashboard loaded", "All data is up to date")
      })
    } catch (err) {
      setError("Failed to load dashboard data")
      feedback.showError("Loading failed", "Unable to fetch dashboard data")
    }
  }

  // Simulate background operations
  const handleExport = async () => {
    try {
      await feedback.withLoading('export-data', async () => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        feedback.showSuccess("Export completed", "Data has been exported successfully")
      })
    } catch (err) {
      feedback.showError("Export failed", "Please try again")
    }
  }

  const handleSync = async () => {
    try {
      await feedback.withLoading('sync-data', async () => {
        await new Promise(resolve => setTimeout(resolve, 1500))
        feedback.showInfo("Sync completed", "All data is synchronized")
      })
    } catch (err) {
      feedback.showError("Sync failed", "Please check your connection")
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (error && !stats) {
    return (
      <div className="space-y-6">
        <RetryComponent
          onRetry={loadDashboardData}
          isRetrying={feedback.isLoading('dashboard-data')}
          message={error}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Alerts */}
      {showAlert && (
        <StatusAlert
          variant="info"
          title="System Maintenance"
          description="Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM EST."
          onDismiss={() => setShowAlert(false)}
        />
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <LoadingButton
          isLoading={feedback.isLoading('export-data')}
          loadingText="Exporting..."
          onClick={handleExport}
          variant="outline"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </LoadingButton>
        
        <LoadingButton
          isLoading={feedback.isLoading('sync-data')}
          loadingText="Syncing..."
          onClick={handleSync}
          variant="outline"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Sync Data
        </LoadingButton>
      </div>

      {/* Progress Indicator */}
      {feedback.isLoading('dashboard-data') && (
        <Card>
          <CardContent className="pt-6">
            <ProgressWithLabel
              value={feedback.progress}
              label="Loading dashboard data..."
              showPercentage={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <LoadingCard 
          isLoading={feedback.isLoading('dashboard-data')}
          loadingMessage="Loading user stats..."
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
        </LoadingCard>

        <LoadingCard 
          isLoading={feedback.isLoading('dashboard-data')}
          loadingMessage="Loading activity data..."
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                +15.3% from last month
              </p>
            </CardContent>
          </Card>
        </LoadingCard>

        <LoadingCard 
          isLoading={feedback.isLoading('dashboard-data')}
          loadingMessage="Loading system health..."
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <StatusBadge status={stats?.systemHealth === "healthy" ? "success" : "warning"}>
                  {stats?.systemHealth || "Unknown"}
                </StatusBadge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </LoadingCard>

        <LoadingCard 
          isLoading={feedback.isLoading('dashboard-data')}
          loadingMessage="Loading uptime data..."
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.uptime || 0}%</div>
              <ProgressWithLabel
                value={stats?.uptime || 0}
                showPercentage={false}
                size="sm"
                className="mt-2"
              />
            </CardContent>
          </Card>
        </LoadingCard>
      </div>

      {/* Status Examples */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current status of various system components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Database Connection</span>
            <StatusBadge status="success">Connected</StatusBadge>
          </div>
          <div className="flex items-center justify-between">
            <span>API Gateway</span>
            <StatusBadge status="success">Operational</StatusBadge>
          </div>
          <div className="flex items-center justify-between">
            <span>Background Jobs</span>
            <StatusBadge status="pending">Processing</StatusBadge>
          </div>
          <div className="flex items-center justify-between">
            <span>Email Service</span>
            <StatusBadge status="warning">Degraded</StatusBadge>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Recent Activity with Timeline */}
      <div className="grid gap-6 lg:grid-cols-2">
        <EnhancedRecentActivity 
          maxItems={8}
          showFilters={true}
          showRefresh={true}
        />
        
        <div className="space-y-4">
          <StatusAlert
            variant="success"
            title="Backup Completed"
            description="Daily backup completed successfully at 3:00 AM."
          />
          
          <StatusAlert
            variant="warning"
            title="High Memory Usage"
            description="Server memory usage is at 85%. Consider scaling up resources."
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used administrative actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <LoadingButton
                isLoading={feedback.isLoading('backup-data')}
                loadingText="Creating backup..."
                onClick={async () => {
                  await feedback.withLoading('backup-data', async () => {
                    await new Promise(resolve => setTimeout(resolve, 2000))
                    feedback.showSuccess("Backup created", "System backup completed successfully")
                  })
                }}
                variant="outline"
                className="w-full justify-start"
              >
                <Download className="h-4 w-4 mr-2" />
                Create System Backup
              </LoadingButton>
              
              <LoadingButton
                isLoading={feedback.isLoading('clear-cache')}
                loadingText="Clearing cache..."
                onClick={async () => {
                  await feedback.withLoading('clear-cache', async () => {
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    feedback.showInfo("Cache cleared", "System cache has been cleared")
                  })
                }}
                variant="outline"
                className="w-full justify-start"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear System Cache
              </LoadingButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
