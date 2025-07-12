'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, AlertTriangle, ArrowRight, Database, Shield, Zap } from 'lucide-react'

interface DeprecationNoticeProps {
  onDismiss?: () => void
  className?: string
}

export function DeprecationNotice({ onDismiss, className }: DeprecationNoticeProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  const migrationFeatures = [
    {
      icon: <Database className="h-4 w-4" />,
      title: 'Payload CMS Integration',
      description: 'Native collection management with type-safe operations',
      status: 'completed',
    },
    {
      icon: <Shield className="h-4 w-4" />,
      title: 'Enhanced Security',
      description: 'Built-in access control and authentication',
      status: 'completed',
    },
    {
      icon: <Zap className="h-4 w-4" />,
      title: 'Performance Optimized',
      description: 'Server-side rendering and caching improvements',
      status: 'completed',
    },
  ]

  return (
    <div className={className}>
      <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100">
                  ✅ Migration to Payload CMS Complete!
                </h4>
                <p className="text-sm mt-1">
                  The dashboard has been successfully upgraded with native Payload CMS integration.
                </p>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                Completed
              </Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {migrationFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-white dark:bg-gray-900 rounded-lg border"
                >
                  <div className="text-green-600 mt-0.5">{feature.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {feature.title}
                      </h5>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border">
              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                What&apos;s New:
              </h5>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-green-500" />
                  Dynamic collection management with real-time CRUD operations
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-green-500" />
                  Type-safe Payload API client with authentication
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-green-500" />
                  Enhanced email management with template system
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-green-500" />
                  Professional timeline and activity logging
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-gray-500">
                Migration completed successfully. All deprecated components have been replaced.
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDismiss}
                className="text-green-700 border-green-300 hover:bg-green-100"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default DeprecationNotice
