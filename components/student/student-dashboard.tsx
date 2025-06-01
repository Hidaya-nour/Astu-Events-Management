import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { UpcomingEvents } from "@/components/student/upcoming-events"
import { MyRegistrations } from "@/components/student/my-registrations"
import { EventCategories } from "@/components/student/event-categories"
import { StudentNotifications } from "@/components/student/student-notifications"

export function StudentDashboard() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Student Dashboard" text="Discover and register for university events." />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <UpcomingEvents />
        </div>
        <div>
          <EventCategories />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <MyRegistrations />
        <StudentNotifications />
      </div>
    </DashboardShell>
  )
}
