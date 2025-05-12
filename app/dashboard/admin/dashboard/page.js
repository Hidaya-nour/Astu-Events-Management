"use client"

import {
  Calendar,
  ChevronDown,
  ClipboardList,
  Filter,
  Home,
  MessageSquare,
  PlusCircle,
  Settings,
  Users,
} from "lucide-react"
import Image from "next/image"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboard() {
  // Define sidebar items for the admin dashboard
  const sidebarItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/admin/dashboard",
      isActive: true,
    },
    {
      title: "Event Management",
      icon: Calendar,
      href: "/admin/events",
    },
    {
      title: "User Management",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Reports",
      icon: ClipboardList,
      href: "/admin/reports",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
    {
      title: "Support Tickets",
      icon: MessageSquare,
      href: "/admin/support",
    },
  ]

  // User info
  const userInfo = {
    name: "Admin User",
    role: "Administrator",
    initials: "AU",
  }

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userInfo={userInfo}
      appName="ASTU Events"
      appLogo="/placeholder.svg?height=32&width=32"
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="rounded-lg border bg-card p-6 shadow-sm dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage events, users, and system settings</p>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Event
            </Button>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">12 active, 36 completed</p>
              <Progress value={75} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,254</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
              <Progress value={65} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">2 open, 3 in progress</p>
              <Progress value={30} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Event Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">Average attendance rate</p>
              <Progress value={87} className="mt-2 h-1" />
            </CardContent>
          </Card>
        </div>

        {/* Events Management */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold">Event Management</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    Status
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All</DropdownMenuItem>
                  <DropdownMenuItem>Active</DropdownMenuItem>
                  <DropdownMenuItem>Upcoming</DropdownMenuItem>
                  <DropdownMenuItem>Completed</DropdownMenuItem>
                  <DropdownMenuItem>Cancelled</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeEvents.map((event) => (
                  <AdminEventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.map((event) => (
                  <AdminEventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedEvents.map((event) => (
                  <AdminEventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}

function AdminEventCard({ event }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <Image
          src={event.image || "/placeholder.svg?height=200&width=400"}
          alt={event.title}
          fill
          className="object-cover"
        />
        <Badge className="absolute right-2 top-2" variant={getStatusVariant(event.status)}>
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

function getStatusVariant(status) {
  switch (status) {
    case "Active":
      return "default"
    case "Upcoming":
      return "secondary"
    case "Completed":
      return "outline"
    case "Cancelled":
      return "destructive"
    default:
      return "outline"
  }
}

// Sample data
const activeEvents = [
  {
    id: 1,
    title: "Tech Innovation Summit",
    date: "May 15, 2025",
    location: "Main Auditorium",
    image: "/placeholder.svg?height=200&width=400",
    status: "Active",
    registrations: 120,
    capacity: 150,
  },
  {
    id: 2,
    title: "Cultural Festival",
    date: "May 18, 2025",
    location: "Student Center",
    image: "/placeholder.svg?height=200&width=400",
    status: "Active",
    registrations: 85,
    capacity: 100,
  },
  {
    id: 3,
    title: "Career Fair 2025",
    date: "May 20, 2025",
    location: "Main Hall",
    image: "/placeholder.svg?height=200&width=400",
    status: "Active",
    registrations: 200,
    capacity: 250,
  },
]

const upcomingEvents = [
  {
    id: 4,
    title: "AI Workshop Series",
    date: "May 25, 2025",
    location: "Computer Science Building",
    image: "/placeholder.svg?height=200&width=400",
    status: "Upcoming",
    registrations: 45,
    capacity: 80,
  },
  {
    id: 5,
    title: "Inter-Department Football Tournament",
    date: "May 28, 2025",
    location: "Sports Complex",
    image: "/placeholder.svg?height=200&width=400",
    status: "Upcoming",
    registrations: 12,
    capacity: 16,
  },
]

const completedEvents = [
  {
    id: 6,
    title: "Photography Exhibition",
    date: "April 15, 2025",
    location: "Art Gallery",
    image: "/placeholder.svg?height=200&width=400",
    status: "Completed",
    registrations: 75,
    capacity: 100,
  },
  {
    id: 7,
    title: "Entrepreneurship Seminar",
    date: "April 10, 2025",
    location: "Business School",
    image: "/placeholder.svg?height=200&width=400",
    status: "Completed",
    registrations: 120,
    capacity: 120,
  },
]
