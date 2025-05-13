import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CreateEventForm } from "@/components/forms/create-event-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function CreateEventPage() {
  return (
    <DashboardLayout
      appName="ASTU Events"
      sidebarItems={[
        { icon: "home", title: "Dashboard", href: "/dashboard" },
        { icon: "calendar-check", title: "Create Event", href: "/organizer/events/create" },
        { icon: "users", title: "Manage Attendees", href: "/organizer/attendees" },
        { icon: "file-edit", title: "Crete Events", href: "/organizer/events" },
        { icon: "download", title: "Export Reports", href: "/organizer/reports" },
      ]}
      userInfo={{
        name: "Jane Organizer",
        role: "Organizer",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JO"
      }}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Create New Event</h1>
        </div>

        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/organizer/dashboard">
                  <Home className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/organizer/events">Events</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink>Create Event</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-4xl mx-auto">
          <CreateEventForm />
        </div>
      </div>
    </DashboardLayout>
  )
}
