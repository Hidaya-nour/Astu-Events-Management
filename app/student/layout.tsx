"use client"

import { DashboardProvider } from "@/contexts/dashboard-context"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userInfo = {
    name: "Student User",
    role: "STUDENT",
    initials: "SU",
  }

  return (
    <DashboardProvider role="STUDENT" userInfo={userInfo}>
      {children}
    </DashboardProvider>
  )
} 