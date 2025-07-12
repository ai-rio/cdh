'use client';

import React from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { DashboardHeader } from "./dashboard-header"
import { Toaster } from "@/components/ui/sonner"
import { KBar } from "./kbar"
import { AuthGuard } from "./auth-guard"
import { AuthProvider } from "@/contexts/AuthContext"
import ThemeProvider from "./theme-provider"

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  defaultSidebarOpen?: boolean;
}

export function DashboardLayoutClient({ 
  children, 
  defaultSidebarOpen = true 
}: DashboardLayoutClientProps) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <AuthGuard 
          requireAuth={true}
          requirePermissions={['read:dashboard']}
          fallbackPath="/"
        >
          <KBar>
            <SidebarProvider defaultOpen={defaultSidebarOpen}>
              <AppSidebar />
              <SidebarInset>
                <DashboardHeader />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                  {children}
                </div>
              </SidebarInset>
              <Toaster />
            </SidebarProvider>
          </KBar>
        </AuthGuard>
      </ThemeProvider>
    </AuthProvider>
  );
}