"use client"

import { Calendar, ChevronDown, Filter, Home, MessageSquare, PlusCircle, Settings, Users } from "lucide-react"
import Image from "next/image"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function OrganizerDashboard() {
  // Define sidebar items for the organizer dashboard
  const sidebarItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/organizer/dashboard",
      isActive: true,
    },
    {
      title: "My Events",
      icon: Calendar,
      href: "/organizer/events",
    },
    {
      title: "Attendees",
      icon: Users,
      href: "/organizer/attendees",
    },
    {
      title: "Feedback",
      icon: MessageSquare,
      href: "/organizer/feedback",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/organizer/settings",
    },
  ]

  // User info
  const userInfo = {
    name: "Event Organizer",
    role: "Club Organizer",
    initials: "EO",
  }

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userInfo={userInfo}
      appName="ASTU Events"
      appLogo="/placeholder.svg?height=32&width=32"
      helpText="Need Assistance?"
      helpLink="/organizer/support"
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
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">3 active, 5 completed</p>
              <Progress value={75} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">Across all events</p>
              <Progress value={65} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.7/5</div>
              <p className="text-xs text-muted-foreground">From 128 reviews</p>
              <Progress value={94} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Next: May 25, 2025</p>
              <Progress value={40} className="mt-2 h-1" />
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
                {organizerActiveEvents.map((event) => (
                  <OrganizerEventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {organizerUpcomingEvents.map((event) => (
                  <OrganizerEventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {organizerPastEvents.map((event) => (
                  <OrganizerEventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}

function OrganizerEventCard({ event }) {
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

function getOrganizerStatusVariant(status) {
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

// Sample data
const organizerActiveEvents = [
  {
    id: 1,
    title: "Computer Science Club Meeting",
    date: "May 15, 2025",
    location: "CS Building, Room 101",
    image: "/placeholder.svg?height=200&width=400",
    status: "Active",
    registrations: 28,
    capacity: 30,
  },
  {
    id: 2,
    title: "Programming Contest",
    date: "May 18, 2025",
    location: "Computer Lab",
    image: "/placeholder.svg?height=200&width=400",
    status: "Active",
    registrations: 45,
    capacity: 50,
  },
]

const organizerUpcomingEvents = [
  {
    id: 3,
    title: "Tech Talk: AI Innovations",
    date: "May 25, 2025",
    location: "Auditorium",
    image: "/placeholder.svg?height=200&width=400",
    status: "Upcoming",
    registrations: 35,
    capacity: 100,
  },
  {
    id: 4,
    title: "Hackathon 2025",
    date: "June 5-6, 2025",
    location: "Innovation Center",
    image: "/placeholder.svg?height=200&width=400",
    status: "Upcoming",
    registrations: 20,
    capacity: 60,
  },
]

const organizerPastEvents = [
  {
    id: 5,
    title: "Web Development Workshop",
    date: "April 15, 2025",
    location: "CS Building, Room 102",
    image: "/placeholder.svg?height=200&width=400",
    status: "Past",
    registrations: 25,
    capacity: 25,
  },
  {
    id: 6,
    title: "Mobile App Development",
    date: "April 10, 2025",
    location: "CS Building, Room 103",
    image: "/placeholder.svg?height=200&width=400",
    status: "Past",
    registrations: 22,
    capacity: 25,
  },
]
