"use client"

import { KBarProvider, KBarPortal, KBarPositioner, KBarAnimator, KBarSearch, KBarResults, useMatches, ActionImpl } from "kbar"
import { useRouter } from "next/navigation"
import { RenderResults } from "./render-results"
import { useKBarActions } from "./use-kbar-actions"

interface KBarProps {
  children: React.ReactNode
}

function RenderResultsWrapper() {
  const { results } = useMatches()
  
  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) => {
        // Ensure item is ActionImpl, not string
        if (typeof item === 'string') {
          return (
            <div className="px-4 py-2 text-sm text-muted-foreground font-medium">
              {item}
            </div>
          )
        }
        return <RenderResults item={item as ActionImpl} active={active} />
      }}
    />
  )
}

export function KBar({ children }: KBarProps) {
  const router = useRouter()
  const actions = useKBarActions()

  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <KBarAnimator className="relative mx-auto mt-16 w-full max-w-2xl overflow-hidden rounded-lg border bg-background shadow-lg">
            <div className="flex items-center border-b px-4">
              <svg
                className="mr-3 h-5 w-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <KBarSearch
                className="flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Search for commands, pages, or actions..."
              />
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
                <span className="text-xs">ESC</span>
              </kbd>
            </div>
            <RenderResultsWrapper />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  )
}
