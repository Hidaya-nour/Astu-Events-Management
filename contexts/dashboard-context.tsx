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
    href: "/organizer",
  },
  {
    title: "My Events",
    icon: "calendar-check",
    href: "/organizer/events",
  },
  {
    title: "Attendees",
    icon: "users",
    href: "/organizer/attendees",
  },
  {
    title: "Feedback",
    icon: "file-edit",
    href: "/organizer/feedback",
  },
  {
    title: "Settings",
    icon: "download",
    href: "/organizer/settings",
  },
]

const STUDENT_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: "home",
    href: "/student",
  },
  {
    title: "My Events",
    icon: "calendar-check",
    href: "/student/events",
  },
  {
    title: "My Requests",
    icon: "users",
    href: "/student/request",
  },
  {
    title: "Settings",
    icon: "download",
    href: "/student/settings",
  },
]

const ADMIN_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: "home",
    href: "/admin",
  },
  {
    title: "Events",
    icon: "calendar-check",
    href: "/admin/events",
  },
  {
    title: "Users",
    icon: "users",
    href: "/admin/users",
  },
  {
    title: "Settings",
    icon: "download",
    href: "/admin/settings",
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