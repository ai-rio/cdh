'use client';

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

// Timeline Context
const TimelineContext = React.createContext<{
  orientation?: 'vertical' | 'horizontal'
}>({
  orientation: 'vertical'
})

// Timeline Root Component
interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal'
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, orientation = 'vertical', children, ...props }, ref) => {
    return (
      <TimelineContext.Provider value={{ orientation }}>
        <div
          ref={ref}
          className={cn(
            "relative",
            orientation === 'vertical' ? "space-y-4" : "flex space-x-4 overflow-x-auto",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TimelineContext.Provider>
    )
  }
)
Timeline.displayName = "Timeline"

// Timeline Item Component
interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  isLast?: boolean
}

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, isLast = false, children, ...props }, ref) => {
    const { orientation } = React.useContext(TimelineContext)
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative",
          orientation === 'vertical' ? "pb-8" : "flex-shrink-0",
          className
        )}
        {...props}
      >
        {children}
        {/* Timeline Line */}
        {!isLast && (
          <div
            className={cn(
              "absolute bg-border",
              orientation === 'vertical' 
                ? "left-4 top-8 h-full w-px" 
                : "top-4 left-8 w-full h-px"
            )}
          />
        )}
      </div>
    )
  }
)
TimelineItem.displayName = "TimelineItem"

// Timeline Dot Component
interface TimelineDotProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning'
  size?: 'sm' | 'default' | 'lg'
}

const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    const { orientation } = React.useContext(TimelineContext)
    
    const sizeClasses = {
      sm: 'h-2 w-2',
      default: 'h-3 w-3',
      lg: 'h-4 w-4'
    }
    
    const variantClasses = {
      default: 'bg-muted-foreground',
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      destructive: 'bg-destructive',
      success: 'bg-green-500',
      warning: 'bg-yellow-500'
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-10 rounded-full border-2 border-background",
          orientation === 'vertical' ? "left-2.5" : "top-2.5",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TimelineDot.displayName = "TimelineDot"

// Timeline Content Component
interface TimelineContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation } = React.useContext(TimelineContext)
    
    return (
      <div
        ref={ref}
        className={cn(
          orientation === 'vertical' ? "ml-8" : "mt-8",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TimelineContent.displayName = "TimelineContent"

// Timeline Header Component
interface TimelineHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  timestamp?: string
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
}

const TimelineHeader = React.forwardRef<HTMLDivElement, TimelineHeaderProps>(
  ({ className, title, subtitle, timestamp, badge, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-start justify-between gap-2 mb-2", className)}
        {...props}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-foreground truncate">
              {title}
            </h4>
            {badge && (
              <Badge variant={badge.variant || 'default'} className="text-xs">
                {badge.text}
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        {timestamp && (
          <time className="text-xs text-muted-foreground whitespace-nowrap">
            {timestamp}
          </time>
        )}
      </div>
    )
  }
)
TimelineHeader.displayName = "TimelineHeader"

// Timeline Body Component
interface TimelineBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const TimelineBody = React.forwardRef<HTMLDivElement, TimelineBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TimelineBody.displayName = "TimelineBody"

// Timeline Card Component (for enhanced styling)
interface TimelineCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  timestamp?: string
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  avatar?: {
    src?: string
    fallback: string
  }
  dotVariant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning'
  isLast?: boolean
}

const TimelineCard = React.forwardRef<HTMLDivElement, TimelineCardProps>(
  ({ 
    className, 
    title, 
    subtitle, 
    timestamp, 
    badge, 
    avatar, 
    dotVariant = 'default',
    isLast = false,
    children, 
    ...props 
  }, ref) => {
    return (
      <TimelineItem isLast={isLast}>
        <TimelineDot variant={dotVariant} />
        <TimelineContent>
          <Card className={cn("border-l-2 border-l-primary/20", className)} ref={ref} {...props}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {avatar && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={avatar.src} />
                    <AvatarFallback className="text-xs">
                      {avatar.fallback}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 min-w-0">
                  <TimelineHeader 
                    title={title}
                    subtitle={subtitle}
                    timestamp={timestamp}
                    badge={badge}
                  />
                  {children && (
                    <TimelineBody>
                      {children}
                    </TimelineBody>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TimelineContent>
      </TimelineItem>
    )
  }
)
TimelineCard.displayName = "TimelineCard"

// Activity Timeline Component (specialized for activity logs)
interface ActivityTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  activities: Array<{
    id: string
    title: string
    description?: string
    timestamp: string
    type: 'user' | 'system' | 'admin' | 'error' | 'success'
    user?: {
      name: string
      avatar?: string
      initials: string
    }
    metadata?: Record<string, any>
  }>
  showAvatars?: boolean
  maxItems?: number
}

const ActivityTimeline = React.forwardRef<HTMLDivElement, ActivityTimelineProps>(
  ({ className, activities, showAvatars = true, maxItems, ...props }, ref) => {
    const displayActivities = maxItems ? activities.slice(0, maxItems) : activities
    
    const getActivityVariant = (type: string) => {
      switch (type) {
        case 'success': return 'success'
        case 'error': return 'destructive'
        case 'admin': return 'primary'
        case 'system': return 'secondary'
        default: return 'default'
      }
    }
    
    const getActivityBadge = (type: string) => {
      switch (type) {
        case 'success': return { text: 'Success', variant: 'default' as const }
        case 'error': return { text: 'Error', variant: 'destructive' as const }
        case 'admin': return { text: 'Admin', variant: 'secondary' as const }
        case 'system': return { text: 'System', variant: 'outline' as const }
        case 'user': return { text: 'User', variant: 'default' as const }
        default: return undefined
      }
    }
    
    return (
      <Timeline ref={ref} className={className} {...props}>
        {displayActivities.map((activity, index) => (
          <TimelineCard
            key={activity.id}
            title={activity.title}
            subtitle={activity.user?.name}
            timestamp={activity.timestamp}
            badge={getActivityBadge(activity.type)}
            avatar={showAvatars && activity.user ? {
              src: activity.user.avatar,
              fallback: activity.user.initials
            } : undefined}
            dotVariant={getActivityVariant(activity.type)}
            isLast={index === displayActivities.length - 1}
          >
            {activity.description && (
              <p className="mt-2">{activity.description}</p>
            )}
            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
              <div className="mt-2 pt-2 border-t">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(activity.metadata).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium">{key}:</span>{' '}
                      <span className="text-muted-foreground">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TimelineCard>
        ))}
      </Timeline>
    )
  }
)
ActivityTimeline.displayName = "ActivityTimeline"

export {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineContent,
  TimelineHeader,
  TimelineBody,
  TimelineCard,
  ActivityTimeline,
  type TimelineProps,
  type TimelineItemProps,
  type TimelineDotProps,
  type TimelineContentProps,
  type TimelineHeaderProps,
  type TimelineBodyProps,
  type TimelineCardProps,
  type ActivityTimelineProps
}
