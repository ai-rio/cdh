#!/bin/bash

echo "🚀 Installing essential shadcn/ui components for dashboard..."

# Phase 1: Critical components for basic dashboard functionality
echo "📦 Phase 1: Installing critical components..."
pnpm dlx shadcn@latest add table
pnpm dlx shadcn@latest add skeleton  
pnpm dlx shadcn@latest add breadcrumb
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add progress

echo "✅ Phase 1 complete!"

# Phase 2: Enhanced interaction components
echo "📦 Phase 2: Installing interaction components..."
pnpm dlx shadcn@latest add toast
pnpm dlx shadcn@latest add command
pnpm dlx shadcn@latest add form
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add checkbox

echo "✅ Phase 2 complete!"

# Phase 3: Additional useful components
echo "📦 Phase 3: Installing additional components..."
pnpm dlx shadcn@latest add switch
pnpm dlx shadcn@latest add tooltip
pnpm dlx shadcn@latest add avatar
pnpm dlx shadcn@latest add scroll-area

echo "✅ All essential dashboard components installed!"
echo "🎯 Ready to build advanced dashboard features!"
