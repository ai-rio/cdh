"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { LoadingOverlay, InlineLoading } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  X,
  RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"

// Enhanced Alert Components
interface StatusAlertProps {
  variant: "success" | "error" | "warning" | "info"
  title: string
  description?: string
  onDismiss?: () => void
  className?: string
}

export function StatusAlert({ 
  variant, 
  title, 
  description, 
  onDismiss,
  className 
}: StatusAlertProps) {
  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const Icon = icons[variant]

  return (
    <Alert 
      variant={variant === "error" ? "destructive" : "default"}
      className={cn(
        variant === "success" && "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
        variant === "warning" && "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
        variant === "info" && "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
        className
      )}
    >
      <Icon className="h-4 w-4" />
      <div className="flex-1">
        <AlertTitle>{title}</AlertTitle>
        {description && <AlertDescription>{description}</AlertDescription>}
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={onDismiss}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </Alert>
  )
}

// Enhanced Progress Components
interface ProgressWithLabelProps {
  value: number
  label?: string
  showPercentage?: boolean
  className?: string
  size?: "sm" | "default" | "lg"
}

export function ProgressWithLabel({ 
  value, 
  label, 
  showPercentage = true,
  className,
  size = "default"
}: ProgressWithLabelProps) {
  const sizeClasses = {
    sm: "h-1",
    default: "h-2",
    lg: "h-3"
  }

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && <span className="font-medium">{value}%</span>}
        </div>
      )}
      <Progress 
        value={value} 
        className={cn(sizeClasses[size])}
      />
    </div>
  )
}

// Loading States Components
interface LoadingCardProps {
  isLoading: boolean
  children: React.ReactNode
  loadingMessage?: string
  className?: string
}

export function LoadingCard({ 
  isLoading, 
  children, 
  loadingMessage = "Loading...",
  className 
}: LoadingCardProps) {
  return (
    <LoadingOverlay 
      isLoading={isLoading} 
      message={loadingMessage}
      className={className}
    >
      {children}
    </LoadingOverlay>
  )
}

// Status Badge Components
interface StatusBadgeProps {
  status: "online" | "offline" | "pending" | "success" | "error" | "warning"
  children: React.ReactNode
  showDot?: boolean
}

export function StatusBadge({ status, children, showDot = true }: StatusBadgeProps) {
  const statusConfig = {
    online: { variant: "default" as const, color: "bg-green-500", textColor: "text-green-700 dark:text-green-300" },
    offline: { variant: "secondary" as const, color: "bg-gray-500", textColor: "text-gray-700 dark:text-gray-300" },
    pending: { variant: "secondary" as const, color: "bg-yellow-500", textColor: "text-yellow-700 dark:text-yellow-300" },
    success: { variant: "default" as const, color: "bg-green-500", textColor: "text-green-700 dark:text-green-300" },
    error: { variant: "destructive" as const, color: "bg-red-500", textColor: "text-red-700 dark:text-red-300" },
    warning: { variant: "secondary" as const, color: "bg-yellow-500", textColor: "text-yellow-700 dark:text-yellow-300" },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={cn("flex items-center gap-1.5", config.textColor)}>
      {showDot && (
        <div className={cn("h-2 w-2 rounded-full", config.color)} />
      )}
      {children}
    </Badge>
  )
}

// Loading Button Component
interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  isLoading: boolean
  loadingText?: string
}

export function LoadingButton({ 
  isLoading, 
  children, 
  loadingText,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={disabled || isLoading}
      {...props}
    >
      <InlineLoading 
        isLoading={isLoading} 
        loadingText={loadingText}
        spinnerSize="sm"
      >
        {children}
      </InlineLoading>
    </Button>
  )
}

// Retry Component
interface RetryComponentProps {
  onRetry: () => void
  isRetrying?: boolean
  message?: string
  className?: string
}

export function RetryComponent({ 
  onRetry, 
  isRetrying = false, 
  message = "Something went wrong. Please try again.",
  className 
}: RetryComponentProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4 p-6", className)}>
      <StatusAlert
        variant="error"
        title="Error"
        description={message}
      />
      <LoadingButton
        isLoading={isRetrying}
        loadingText="Retrying..."
        onClick={onRetry}
        variant="outline"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry
      </LoadingButton>
    </div>
  )
}
