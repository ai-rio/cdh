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
  User,
  LogOut,
  Moon,
  Sun,
  Mail,
  FileText,
  TrendingUp
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
    {
      id: "email",
      name: "Email Management",
      subtitle: "Manage email campaigns and templates",
      shortcut: ["e"],
      keywords: "email campaigns templates resend",
      icon: <Mail className="h-4 w-4" />,
      perform: () => router.push("/dashboard/email"),
    },
    {
      id: "portfolio",
      name: "Portfolio",
      subtitle: "View and manage portfolio items",
      shortcut: ["shift", "p"],
      keywords: "portfolio projects work showcase",
      icon: <FileText className="h-4 w-4" />,
      perform: () => router.push("/dashboard/portfolio"),
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
        keywords: "analytics metrics stats data insights",
        icon: <BarChart3 className="h-4 w-4" />,
        perform: () => router.push("/dashboard/analytics"),
      },
      {
        id: "users",
        name: "User Management",
        subtitle: "Manage platform users and permissions",
        keywords: "users management admin permissions roles",
        icon: <Users className="h-4 w-4" />,
        perform: () => router.push("/dashboard/users"),
      },
      {
        id: "performance",
        name: "Performance Metrics",
        subtitle: "View system performance and monitoring",
        keywords: "performance monitoring system health metrics",
        icon: <TrendingUp className="h-4 w-4" />,
        perform: () => router.push("/dashboard/analytics"),
      }
    )
  }

  if (user?.role === "creator") {
    roleActions.push(
      {
        id: "creator",
        name: "Creator Dashboard",
        subtitle: "Access creator tools and portfolio",
        shortcut: ["c"],
        keywords: "creator portfolio opportunities projects",
        icon: <Users className="h-4 w-4" />,
        perform: () => router.push("/dashboard/creator"),
      },
      {
        id: "creator-portfolio",
        name: "My Portfolio",
        subtitle: "Manage your creative portfolio",
        keywords: "portfolio projects showcase work creative",
        icon: <FileText className="h-4 w-4" />,
        perform: () => router.push("/dashboard/portfolio"),
      }
    )
  }

  if (user?.role === "brand") {
    roleActions.push(
      {
        id: "brand",
        name: "Brand Dashboard", 
        subtitle: "Access brand campaigns and creator discovery",
        shortcut: ["b"],
        keywords: "brand campaigns creators discovery marketing",
        icon: <Briefcase className="h-4 w-4" />,
        perform: () => router.push("/dashboard/brand"),
      },
      {
        id: "brand-analytics",
        name: "Campaign Analytics",
        subtitle: "View brand campaign performance",
        keywords: "analytics campaigns performance metrics brand",
        icon: <TrendingUp className="h-4 w-4" />,
        perform: () => router.push("/dashboard/analytics"),
      }
    )
  }

  return [...baseActions, ...roleActions]
}
