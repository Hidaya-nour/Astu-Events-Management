"use client"

import { DashboardProvider } from "@/contexts/dashboard-context"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userInfo = {
    name: "Admin User",
    role: "ADMIN",
    initials: "AU",
  }

  return (
    <DashboardProvider role="ADMIN" userInfo={userInfo}>
      {children}
    </DashboardProvider>
  )
} 