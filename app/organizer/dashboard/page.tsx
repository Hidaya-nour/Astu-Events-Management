"use client"

import { Calendar, ChevronDown, Filter, PlusCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Event {
  id: number
  title: string
  date: string
  location: string
  image?: string
  status: string
  registrations: number
  capacity: number
}

export default function OrganizerDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalAttendees: 0,
    upcomingEvents: 0,
  })

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events/organizer')
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        const data = await response.json()
        
        // Transform the API data to match our Event interface
        const transformedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          date: new Date(event.date).toLocaleDateString(),
          location: event.location,
          image: event.image || "/placeholder.svg?height=200&width=400",
          status: getEventStatus(event.date),
          registrations: event.currentAttendees || 0,
          capacity: event.maxAttendees || 0,
        }))

        setEvents(transformedEvents)

        // Calculate stats
        const now = new Date()
        const activeEvents = transformedEvents.filter(e => e.status === 'Active').length
        const upcomingEvents = transformedEvents.filter(e => e.status === 'Upcoming').length
        const totalAttendees = transformedEvents.reduce((sum, e) => sum + e.registrations, 0)

        setStats({
          totalEvents: transformedEvents.length,
          activeEvents,
          totalAttendees,
          upcomingEvents,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Filter events by status
  const activeEvents = events.filter(event => event.status === 'Active')
  const upcomingEvents = events.filter(event => event.status === 'Upcoming')
  const pastEvents = events.filter(event => event.status === 'Past')

  if (loading) {
    return (
      <DashboardLayout
        appName="ASTU Events"
        appLogo="/placeholder.svg?height=32&width=32"
        helpText="Need Assistance?"
        helpLink="/dashboard/organizer/support"
      >
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        appName="ASTU Events"
        appLogo="/placeholder.svg?height=32&width=32"
        helpText="Need Assistance?"
        helpLink="/dashboard/organizer/support"
      >
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <p className="text-red-500">Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      appName="ASTU Events"
      appLogo="/placeholder.svg?height=32&width=32"
      helpText="Need Assistance?"
      helpLink="/dashboard/organizer/support"
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="rounded-lg border bg-card p-6 shadow-sm dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Organizer Dashboard</h1>
              <p className="text-muted-foreground">Manage your events and track attendance</p>
            </div>
            <Link href="/dashboard/organizer/events/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">{stats.activeEvents} active, {stats.totalEvents - stats.activeEvents} completed</p>
              <Progress value={(stats.activeEvents / stats.totalEvents) * 100} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAttendees}</div>
              <p className="text-xs text-muted-foreground">Across all events</p>
              <Progress value={Math.min((stats.totalAttendees / (stats.totalEvents * 50)) * 100, 100)} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeEvents}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
              <Progress value={(stats.activeEvents / stats.totalEvents) * 100} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">Next: {upcomingEvents[0]?.date || 'None'}</p>
              <Progress value={(stats.upcomingEvents / stats.totalEvents) * 100} className="mt-2 h-1" />
            </CardContent>
          </Card>
        </div>

        {/* Events Management */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold">My Events</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    Category
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All</DropdownMenuItem>
                  <DropdownMenuItem>Academic</DropdownMenuItem>
                  <DropdownMenuItem>Social</DropdownMenuItem>
                  <DropdownMenuItem>Sports</DropdownMenuItem>
                  <DropdownMenuItem>Cultural</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeEvents.length > 0 ? (
                  activeEvents.map((event) => (
                    <OrganizerEventCard key={event.id} event={event} />
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-3 text-center py-8">No active events found</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <OrganizerEventCard key={event.id} event={event} />
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-3 text-center py-8">No upcoming events found</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastEvents.length > 0 ? (
                  pastEvents.map((event) => (
                    <OrganizerEventCard key={event.id} event={event} />
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-3 text-center py-8">No past events found</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}

function OrganizerEventCard({ event }: { event: Event }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <Image
          src={event.image || "/placeholder.svg?height=200&width=400"}
          alt={event.title}
          fill
          className="object-cover"
        />
        <Badge className="absolute right-2 top-2" variant={getOrganizerStatusVariant(event.status)}>
          {event.status}
        </Badge>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1 text-lg">{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3" />
          {event.date} • {event.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Registrations</span>
          <span className="text-sm">
            {event.registrations}/{event.capacity}
          </span>
        </div>
        <Progress value={(event.registrations / event.capacity) * 100} className="h-1" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <Button size="sm" variant="outline">
          View Details
        </Button>
        <Button size="sm">Manage</Button>
      </CardFooter>
    </Card>
  )
}

function getOrganizerStatusVariant(status: string) {
  switch (status) {
    case "Active":
      return "default"
    case "Upcoming":
      return "secondary"
    case "Past":
      return "outline"
    case "Draft":
      return "outline"
    default:
      return "outline"
  }
}

function getEventStatus(date: string): string {
  const eventDate = new Date(date)
  const now = new Date()
  
  if (eventDate < now) {
    return 'Past'
  } else if (eventDate.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000) { // Within 7 days
    return 'Active'
  } else {
    return 'Upcoming'
  }
}
