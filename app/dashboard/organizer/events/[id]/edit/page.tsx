import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { EventForm } from "@/components/forms/event-form"

export default async function EditEventPage({ params }: { params: { id: string } }) {
  // If params is a promise, await it (for edge cases)
  // const resolvedParams = await params;
  // Use resolvedParams.id if needed
  return (
    <DashboardLayout
      appName="ASTU Events"
      sidebarItems={[
        { icon: "home", title: "Dashboard", href: "/dashboard" },
        { icon: "calendar-check", title: "Create Event", href: "/organizer/events/create" },
        { icon: "users", title: "Manage Attendees", href: "/organizer/attendees" },
        { icon: "file-edit", title: "Edit Events", href: "/organizer/events" },
        { icon: "download", title: "Export Reports", href: "/organizer/reports" },
      ]}
      userInfo={{
        name: "Jane Organizer",
        role: "Organizer",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JO"
      }}
    >
      <div>
        <DashboardHeader heading="Edit Event" text="Update your event details." />
        <div className="max-w-3xl mx-auto">
          <EventForm eventId={params.id} />
        </div>
      </div>
    </DashboardLayout>
  )
}
