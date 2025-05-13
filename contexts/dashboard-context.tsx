"use client"

import React, { createContext, useContext, ReactNode } from 'react'

type UserRole = 'EVENT_ORGANIZER' | 'STUDENT' | 'ADMIN'

interface UserInfo {
  name: string
  role: string
  initials?: string
  avatar?: string
}

interface SidebarItem {
  title: string
  icon: string
  href: string
  isActive?: boolean
}

interface DashboardContextType {
  userInfo: UserInfo
  sidebarItems: SidebarItem[]
  setActiveItem: (href: string) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

const ORGANIZER_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: "home",
    href: "/dashboard/organizer/dashboard",
  },
  {
    title: "My Events",
    icon: "calendar-check",
    href: "/dashboard/organizer/events",
  },
  {
    title: "Attendees",
    icon: "users",
    href: "/dashboard/organizer/attendees",
  },
  {
    title: "Feedback",
    icon: "file-edit",
    href: "/dashboard/organizer/feedback",
  },
  {
    title: "Settings",
    icon: "download",
    href: "/dashboard/organizer/settings",
  },
]

const STUDENT_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: "home",
    href: "/dashboard/student/dashboard",
  },
  {
    title: "My Events",
    icon: "calendar-check",
    href: "/dashboard/student/events",
  },
  {
    title: "My Registrations",
    icon: "users",
    href: "/dashboard/student/registrations",
  },
  {
    title: "Settings",
    icon: "download",
    href: "/dashboard/student/settings",
  },
]

const ADMIN_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: "home",
    href: "/dashboard/admin/dashboard",
  },
  {
    title: "Events",
    icon: "calendar-check",
    href: "/dashboard/admin/events",
  },
  {
    title: "Users",
    icon: "users",
    href: "/dashboard/admin/users",
  },
  {
    title: "Settings",
    icon: "download",
    href: "/dashboard/admin/settings",
  },
]

export function DashboardProvider({ 
  children, 
  role = 'EVENT_ORGANIZER',
  userInfo 
}: { 
  children: ReactNode
  role?: UserRole
  userInfo: UserInfo
}) {
  const [sidebarItems, setSidebarItems] = React.useState<SidebarItem[]>(() => {
    switch (role) {
      case 'STUDENT':
        return STUDENT_SIDEBAR_ITEMS
      case 'ADMIN':
        return ADMIN_SIDEBAR_ITEMS
      default:
        return ORGANIZER_SIDEBAR_ITEMS
    }
  })

  const setActiveItem = (href: string) => {
    setSidebarItems(prev => 
      prev.map(item => ({
        ...item,
        isActive: item.href === href
      }))
    )
  }

  return (
    <DashboardContext.Provider value={{ userInfo, sidebarItems, setActiveItem }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
} 