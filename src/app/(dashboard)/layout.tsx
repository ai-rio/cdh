import { DashboardLayoutClient } from "./components/dashboard-layout-client"
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
    <DashboardLayoutClient defaultSidebarOpen={defaultOpen}>
      {children}
    </DashboardLayoutClient>
  )
}
