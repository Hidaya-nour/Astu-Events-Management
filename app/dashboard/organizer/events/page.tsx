import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { EventsTable } from "@/components/organizer/events-table"
import { EventsCalendarView } from "@/components/organizer/events-calendar"
import { EventsStats } from "@/components/organizer/events-stats"
import { EventsFilter } from "@/components/organizer/events-filter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Plus, Search } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default async function OrganizerEventsPage() {
  const session = await getServerSession(authOptions)

//   if (!session?.user) {
//     redirect("/auth/signin")
//   }

  // Get the first user's ID for testing
  const firstUser = await prisma.user.findFirst()
  if (!firstUser) {
    return (
      <DashboardLayout appName="ASTU Events">
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No users found</h3>
          <p className="text-muted-foreground">Please create a user first.</p>
        </div>
      </DashboardLayout>
    )
  }

  // Fetch events created by the first user
  const events = await prisma.event.findMany({
    where: {
      createdById: firstUser.id,
    },
    orderBy: {
      date: "asc",
    },
    include: {
      _count: {
        select: {
          registrations: true,
        },
      },
    },
  })

  // Format events for display
  const formattedEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location,
    category: event.category,
    status: event.approvalStatus,
    capacity: event.capacity,
    currentAttendees: event._count.registrations,
  }))

  // Calculate stats
  const stats = {
    totalEvents: events.length,
    upcomingEvents: events.filter((event) => event.date > new Date()).length,
    totalAttendees: events.reduce((acc, event) => acc + event._count.registrations, 0),
    approvedEvents: events.filter((event) => event.approvalStatus === "APPROVED").length,
  }

  return (
    <DashboardLayout appName="ASTU Events">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Events</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Link href="/dashboard/organizer/events/create">            
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
            </Link>
          </div>
        </div>

        <EventsStats stats={stats} />

        <div className="flex flex-col md:flex-row gap-4 items-start">
          <Card className="w-full md:w-64 shrink-0">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Filter your events</CardDescription>
            </CardHeader>
            <CardContent>
              <EventsFilter />
            </CardContent>
          </Card>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search events..." className="pl-8 w-full" />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past events</SelectItem>
                    <SelectItem value="attendees">Most attendees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              </TabsList>
              <TabsContent value="list" className="space-y-4">
                <EventsTable events={formattedEvents} />
              </TabsContent>
              <TabsContent value="calendar" className="space-y-4">
                <EventsCalendarView events={formattedEvents} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
