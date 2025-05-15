"use client"

import { DashboardProvider } from "@/contexts/dashboard-context"

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userInfo = {
    name: "Event Organizer",
    role: "Club Organizer",
    initials: "EO",
  }

  return (
    <DashboardProvider role="EVENT_ORGANIZER" userInfo={userInfo}>
      {children}
    </DashboardProvider>
  )
} 