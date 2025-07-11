"use client"

import { ActionImpl } from "kbar"
import { cn } from "@/lib/utils"

interface RenderResultsProps {
  item: ActionImpl
  active: boolean
}

export function RenderResults({ item, active }: RenderResultsProps) {
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-3 px-4 py-3 text-sm transition-colors",
        active ? "bg-accent text-accent-foreground" : "text-foreground"
      )}
    >
      {item.icon && (
        <div className="flex h-5 w-5 items-center justify-center">
          {item.icon}
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        {item.subtitle && (
          <span className="text-xs text-muted-foreground">{item.subtitle}</span>
        )}
      </div>
      {item.shortcut?.length && (
        <div className="ml-auto flex gap-1">
          {item.shortcut.map((shortcut) => (
            <kbd
              key={shortcut}
              className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 flex"
            >
              {shortcut}
            </kbd>
          ))}
        </div>
      )}
    </div>
  )
}
