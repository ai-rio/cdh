"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "animate-spin",
  {
    variants: {
      size: {
        default: "h-4 w-4",
        sm: "h-3 w-3",
        lg: "h-6 w-6",
        xl: "h-8 w-8",
      },
      variant: {
        default: "text-muted-foreground",
        primary: "text-primary",
        destructive: "text-destructive",
        secondary: "text-secondary-foreground",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
}

function Spinner({ className, size, variant }: SpinnerProps) {
  return (
    <Loader2 className={cn(spinnerVariants({ size, variant }), className)} />
  )
}

// Loading overlay component for full-screen loading states
interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
  spinnerSize?: VariantProps<typeof spinnerVariants>["size"]
  message?: string
}

function LoadingOverlay({ 
  isLoading, 
  children, 
  className,
  spinnerSize = "lg",
  message = "Loading..."
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-2">
            <Spinner size={spinnerSize} variant="primary" />
            {message && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Inline loading component for buttons and small areas
interface InlineLoadingProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
  spinnerSize?: VariantProps<typeof spinnerVariants>["size"]
}

function InlineLoading({ 
  isLoading, 
  children, 
  loadingText,
  spinnerSize = "sm"
}: InlineLoadingProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Spinner size={spinnerSize} />
        {loadingText && <span>{loadingText}</span>}
      </div>
    )
  }
  
  return <>{children}</>
}

export { Spinner, LoadingOverlay, InlineLoading, spinnerVariants }
