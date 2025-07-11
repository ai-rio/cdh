import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import { DashboardHeader } from "./components/dashboard-header"
import { Toaster } from "@/components/ui/sonner"
import { KBar } from "./components/kbar"
import ThemeProvider from "./components/theme-provider"
import './styles.css' // Use dedicated dashboard styles
import { cookies } from 'next/headers'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get sidebar state from cookies (official shadcn/ui pattern)
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <KBar>
        <SidebarProvider defaultOpen={defaultOpen}>
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
    </ThemeProvider>
  )
}
