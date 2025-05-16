"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import {
  Award,
  Bell,
  BookOpen,
  Calendar,
  ChevronDown,
  Clock,
  Download,
  Filter,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  MoreHorizontal,
  Settings,
  Star,
  User,
  Users,
  Sun,
  Moon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for the student
const userInfo = {
  name: "Abebe Bekele",
  role: "Student",
  id: "ETS0123/12",
  department: "Computer Science",
  semester: "Spring 2025",
  year: "3rd Year",
}


// Helper function to get badge variant based on status
function getBadgeVariant(status) {
  switch (status) {
    case "Registered":
      return "secondary"
    case "Attended":
      return "default"
    case "Waitlisted":
      return "destructive"
    case "Feedback Submitted":
      return "outline"
    default:
      return "default"
  }
}

// Event Card Component
function EventCard({ event }) {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative h-40">
        <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
        <Badge variant={getBadgeVariant(event.status)} className="absolute top-2 right-2">
          {event.status}
        </Badge>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3" />
          {event.date} • {event.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {event.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        {event.rating && (
          <div className="flex items-center star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={star <= event.rating ? "star-filled" : "star-empty"} />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Button size="sm" variant="outline">
          View Details
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            {event.status === "Registered" && <DropdownMenuItem>Download Ticket</DropdownMenuItem>}
            {event.status === "Registered" && <DropdownMenuItem>Cancel Registration</DropdownMenuItem>}
            {event.status === "Attended" && !event.rating && <DropdownMenuItem>Give Feedback</DropdownMenuItem>}
            {event.status === "Attended" && event.rating && <DropdownMenuItem>View Feedback</DropdownMenuItem>}
            {event.status === "Waitlisted" && <DropdownMenuItem>Check Position</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}

export default function StudentDashboard() {
  const [events, setEvents] = useState([])
  const [myEvents, setMyEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { data: session, status } = useSession()

  // Calculate statistics from myEvents
  const stats = {
    totalEvents: myEvents.length,
    registeredEvents: myEvents.filter(event => event.status === 'registered').length,
    waitlistedEvents: myEvents.filter(event => event.status === 'waitlisted').length,
    topCategory: (() => {
      if (myEvents.length === 0) return 'None';
      
      const categoryCounts = new Map<string, number>();
      
      for (const event of myEvents) {
        const category = event.category || 'Uncategorized';
        categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
      }
      
      let maxCount = 0;
      let topCategory = 'None';
      
      for (const [category, count] of categoryCounts) {
        if (count > maxCount) {
          maxCount = count;
          topCategory = category;
        }
      }
      
      return topCategory;
    })()
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        const data = await response.json()
        setEvents(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const fetchMyEvents = async () => {
      try {
        const response = await fetch('/api/events/my-events')
        if (!response.ok) {
          throw new Error('Failed to fetch my events')
        }
        const data = await response.json()
        setMyEvents(data)
      } catch (err) {
        console.error('Error fetching my events:', err)
      }
    }

    fetchEvents()
    fetchMyEvents()
  }, [])

  if (status === "loading") {
    return (
      <DashboardLayout appName="ASTU Events">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      appName="ASTU Events"
      appLogo="/placeholder.svg?height=32&width=32"
      helpText="Need Assistance?"
      helpLink="/dashboard/student/support"
    >
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        {/* Welcome Section */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src={session?.user?.image || "/placeholder.svg"} alt={session?.user?.name} />
                <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}</h1>
                <p className="text-muted-foreground">
                  {session?.user?.department && `${session.user.department} • `}
                  {session?.user?.year && `${session.user.year}th Year `}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">
                <Clock className="mr-1 inline-block h-4 w-4" />
                Last login: {new Date().toLocaleDateString()}
              </span>
            </div>
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
              <p className="text-xs text-muted-foreground">Events you're involved in</p>
              <Progress 
                value={(stats.totalEvents / 10) * 100} 
                className="mt-2 h-1" 
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Registered Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.registeredEvents}</div>
              <p className="text-xs text-muted-foreground">Successfully registered</p>
              <Progress 
                value={(stats.registeredEvents / stats.totalEvents) * 100 || 0} 
                className="mt-2 h-1" 
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Waitlisted Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.waitlistedEvents}</div>
              <p className="text-xs text-muted-foreground">Waiting for confirmation</p>
              <Progress 
                value={(stats.waitlistedEvents / stats.totalEvents) * 100 || 0} 
                className="mt-2 h-1" 
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.topCategory}</div>
              <p className="text-xs text-muted-foreground">Most frequent category</p>
              <Progress 
                value={75} 
                className="mt-2 h-1" 
              />
            </CardContent>
          </Card>
        </div>

        {/* My Events Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">My Events</h2>
          <Tabs defaultValue="registered">
            <TabsList className="mb-4">
              <TabsTrigger value="registered">Registered</TabsTrigger>
              <TabsTrigger value="waitlisted">Waitlisted</TabsTrigger>
            </TabsList>
            <TabsContent value="registered">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myEvents
                  .filter(event => event.status === 'registered')
                  .map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                {myEvents.filter(event => event.status === 'registered').length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No registered events found
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="waitlisted">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myEvents
                  .filter(event => event.status === 'waitlisted')
                  .map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                {myEvents.filter(event => event.status === 'waitlisted').length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No waitlisted events found
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Discover Events Section */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold">Discover Events</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    Categories
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Academic</DropdownMenuItem>
                  <DropdownMenuItem>Sports</DropdownMenuItem>
                  <DropdownMenuItem>Social</DropdownMenuItem>
                  <DropdownMenuItem>Clubs</DropdownMenuItem>
                  <DropdownMenuItem>Workshops</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" className="gap-1">
                <Calendar className="h-4 w-4" />
                Calendar View
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <Image
                      src={event.images?.[0] || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute right-2 top-2 bg-primary">{event.category}</Badge>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-1 text-lg">{event.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      {new Date(event.date).toLocaleDateString()} • {event.startTime}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <Badge variant="outline">
                      {event.capacity - (event.currentAttendees || 0)} Seats Available
                    </Badge>
                    <Button size="sm">Register</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-4 text-center">
            <Button variant="outline">View All Events</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
