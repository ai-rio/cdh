"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Action } from "kbar"
import { 
  Home, 
  Users, 
  Briefcase, 
  Settings, 
  BarChart3, 
  Search,
  User,
  LogOut,
  Moon,
  Sun
} from "lucide-react"
import { useTheme } from "next-themes"

export function useKBarActions(): Action[] {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { setTheme, theme } = useTheme()

  const baseActions: Action[] = [
    // Navigation Actions
    {
      id: "dashboard",
      name: "Dashboard",
      subtitle: "Go to dashboard overview",
      shortcut: ["d"],
      keywords: "dashboard home overview",
      icon: <Home className="h-4 w-4" />,
      perform: () => router.push("/dashboard"),
    },
    
    // Theme Actions
    {
      id: "theme",
      name: "Toggle Theme",
      subtitle: "Switch between light and dark mode",
      shortcut: ["t"],
      keywords: "theme dark light mode",
      icon: theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
      perform: () => setTheme(theme === "dark" ? "light" : "dark"),
    },

    // User Actions
    {
      id: "profile",
      name: "Profile",
      subtitle: "View your profile information",
      shortcut: ["p"],
      keywords: "profile user account",
      icon: <User className="h-4 w-4" />,
      perform: () => router.push("/dashboard"),
    },

    {
      id: "logout",
      name: "Logout",
      subtitle: "Sign out of your account",
      shortcut: ["shift", "l"],
      keywords: "logout sign out exit",
      icon: <LogOut className="h-4 w-4" />,
      perform: () => logout(),
    },
  ]

  // Role-based actions
  const roleActions: Action[] = []

  if (user?.role === "admin") {
    roleActions.push(
      {
        id: "admin",
        name: "Admin Dashboard",
        subtitle: "Access admin features and settings",
        shortcut: ["a"],
        keywords: "admin administration settings users",
        icon: <Settings className="h-4 w-4" />,
        perform: () => router.push("/dashboard/admin"),
      },
      {
        id: "analytics",
        name: "Analytics",
        subtitle: "View platform analytics and metrics",
        shortcut: ["shift", "a"],
        keywords: "analytics metrics stats data",
        icon: <BarChart3 className="h-4 w-4" />,
        perform: () => router.push("/dashboard/analytics"),
      },
      {
        id: "users",
        name: "User Management",
        subtitle: "Manage platform users",
        keywords: "users management admin",
        icon: <Users className="h-4 w-4" />,
        perform: () => router.push("/dashboard/admin"),
      }
    )
  }

  if (user?.role === "creator") {
    roleActions.push({
      id: "creator",
      name: "Creator Dashboard",
      subtitle: "Access creator tools and portfolio",
      shortcut: ["c"],
      keywords: "creator portfolio opportunities",
      icon: <Users className="h-4 w-4" />,
      perform: () => router.push("/dashboard/creator"),
    })
  }

  if (user?.role === "brand") {
    roleActions.push({
      id: "brand",
      name: "Brand Dashboard", 
      subtitle: "Access brand campaigns and creator discovery",
      shortcut: ["b"],
      keywords: "brand campaigns creators discovery",
      icon: <Briefcase className="h-4 w-4" />,
      perform: () => router.push("/dashboard/brand"),
    })
  }

  return [...baseActions, ...roleActions]
}
