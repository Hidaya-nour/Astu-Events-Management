"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import {
  Calendar,
  ChevronDown,
  Clock,
  Filter,
  MoreHorizontal,
  Star,
  Sun,
  Moon,
  MapPin,
  Search,
  TrendingUp,
  BookMarked,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"
import 'react-toastify/dist/ReactToastify.css'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "react-toastify"

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
    <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
      <div className="relative h-40">
        <Image
          src={event.image || "/placeholder.svg?height=160&width=320"}
          alt={event.title}
          fill
          className="object-cover"
        />
        <Badge variant={getBadgeVariant(event.status)} className="absolute top-2 right-2">
          {event.status}
        </Badge>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3" />
          {event.date} • <MapPin className="h-3 w-3 ml-1" /> {event.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {event.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        {event.rating && (
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${star <= event.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
              />
            ))}
            <span className="text-xs ml-1 text-muted-foreground">({event.rating}/5)</span>
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

// Upcoming Event Component
function UpcomingEvent({ event }) {
  const daysLeft = () => {
    const eventDate = new Date(event.date)
    const today = new Date()
    const diffTime = Math.abs(eventDate.getTime() - today.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <Card className="overflow-hidden border-l-4 border-l-primary">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{event.title}</CardTitle>
          <Badge variant="outline" className="ml-2">
            {daysLeft()} days left
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-xs mt-1">
          <Calendar className="h-3 w-3" />
          {event.date} • {event.startTime}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {event.location}
          </div>
          <Button size="sm" variant="ghost" className="h-8 p-0">
            <Calendar className="h-4 w-4 mr-1" />
            Add to Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Loading Skeleton for Event Cards
function EventCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative h-40">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader className="p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-3" />
        <div className="flex gap-1 mb-3">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardFooter>
    </Card>
  )
}

// Sample events data for demonstration


export default function StudentDashboard() {
  const [events, setEvents] = useState([])
  const [myEvents, setMyEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [searchQuery, setSearchQuery] = useState("")
  const [theme, setTheme] = useState("light")
  const { data: session, status } = useSession()


  async function handleRegistration(eventId: string) {
    try {
      const response = await fetch(`/api/registration/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register for event');
      }
  
      const data = await response.json();
  
      toast.success(data.message || "You have been registered for the event.");
  
      // Refresh the events list
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to register for the event. Please try again.");
    }
  }
  
  // Calculate statistics from myEvents
  const stats = {
    totalEvents: myEvents.length,
    registeredEvents: myEvents.filter((event) => event.status === "Registered").length,
    waitlistedEvents: myEvents.filter((event) => event.status === "Waitlisted").length,
    topCategory: (() => {
      if (myEvents.length === 0) return "None"

      const categoryCounts = {}

      for (const event of myEvents) {
        const category = event.category || "Uncategorized"
        categoryCounts[category] = (categoryCounts[category] || 0) + 1
      }

      let maxCount = 0
      let topCategory = "None"

      for (const category in categoryCounts) {
        if (categoryCounts[category] > maxCount) {
          maxCount = categoryCounts[category]
          topCategory = category
        }
      }

      return topCategory
    })(),
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams({
          // sort: "upcoming",
          limit: "6",
        })

        const response = await fetch(`/api/events?${queryParams.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }
        const data = await response.json()
        // The API returns events in a paginated format
        if (data && Array.isArray(data.events)) {
          setEvents(data.events)
        } else {
          setEvents([])
        }
      } catch (err) {
        setError(err.message)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    const fetchMyEvents = async () => {
      try {
        const response = await fetch("/api/events/student")
        if (!response.ok) {
          throw new Error("Failed to fetch my events")
        }
        const data = await response.json()
        setMyEvents(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error fetching my events:", err)
        setMyEvents([])
      }
    }

    fetchEvents()
    fetchMyEvents()
  }, [])

  // Filter events based on search query
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.tags && event.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))),
  )

  if (status === "loading") {
    return (
      <DashboardLayout appName="ASTU Events">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
        {/* Welcome Section with Theme Toggle */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage
                  src={session?.user?.image || "/placeholder.svg?height=64&width=64"}
                  alt={session?.user?.name || userInfo.name}
                />
                <AvatarFallback>{(session?.user?.name || userInfo.name)?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome, {session?.user?.name || userInfo.name}</h1>
                <p className="text-muted-foreground">
                  {(session?.user?.department || userInfo.department) &&
                    `${session?.user?.department || userInfo.department} • `}
                  {(session?.user?.year || userInfo.year) && `${session?.user?.year || userInfo.year} `}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <span className="text-sm text-muted-foreground flex items-center">
                <Clock className="mr-1 inline-block h-4 w-4" />
                Last login: {new Date().toLocaleDateString()}
              </span>
              
            </div>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <BookMarked className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                Total Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">Events you're involved in</p>
              <Progress value={(stats.totalEvents / 10) * 100} className="h-1 mt-2" />
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                Registered Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.registeredEvents}</div>
              <p className="text-xs text-muted-foreground">Events you're registered for</p>
              <Progress
                value={(stats.registeredEvents / stats.totalEvents) * 100}
                className="h-1 mt-2 bg-green-200 dark:bg-green-800"
              />
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock3 className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
                Waitlisted Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.waitlistedEvents}</div>
              <p className="text-xs text-muted-foreground">Events you're waitlisted for</p>
              <Progress
                value={(stats.waitlistedEvents / stats.totalEvents) * 100}
                className="h-1 mt-2 bg-amber-200 dark:bg-amber-800"
              />
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                Top Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.topCategory}</div>
              <p className="text-xs text-muted-foreground">Most frequent event category</p>
              <Progress value={80} className="h-1 mt-2 bg-purple-200 dark:bg-purple-800" />
            </CardContent>
          </Card>
        </div>

        {/* Next Upcoming Event */}
        {myEvents.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-primary" />
              Next Upcoming Event
            </h2>
            <UpcomingEvent event={myEvents[0]} />
          </div>
        )}

        {/* My Events Section with Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-bold">My Events</h2>
           
          </div>

          <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="waitlisted">Waitlisted</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-0">
              {loading &&
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <EventCardSkeleton key={i} />
                  ))}
                </div>
                }
              {myEvents && 
              //   <div className="text-center text-muted-foreground p-8 border rounded-lg">
              //     <Calendar className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              //     <p>You don't have any upcoming events.</p>
              //     <Button variant="outline" className="mt-4">
              //       Browse Events
              //     </Button>
              //   </div>
              // }
              // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              //     {myEvents
              //       .filter((event) => event.status === "Registered")
              //       .map((event) => (
              //         <EventCard key={event.id} event={event} />
              //       ))}
              //   </div>
              <Card key={myEvents.id className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <div className="aspect-video relative">
                <Image
                  src={event.image || "/placeholder.svg?height=160&width=320"}
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
                  {event.date} • {event.startTime}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {myEvents.tags &&
                    event.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <Badge
                  variant={event.capacity - (event._count?.registrations || 0) < 10 ? "destructive" : "outline"}
                >
                  {event.capacity - (event._count?.registrations || 0)} Seats Available
                </Badge>
                
              </CardFooter>
            </Card>
              
              }
            </TabsContent>

            <TabsContent value="past" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myEvents
                  .filter((event) => event.status === "Attended" || event.status === "Feedback Submitted")
                  .map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="waitlisted" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myEvents
                  .filter((event) => event.status === "Waitlisted")
                  .map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Discover Events Section with Search */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold">Discover Events</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search events..."
                  className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-8 border rounded-lg">
              <AlertCircle className="h-10 w-10 mx-auto mb-2" />
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : !filteredEvents.length ? (
            <div className="text-center text-muted-foreground p-8 border rounded-lg">
              <Search className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              <p>No events found matching "{searchQuery}"</p>
              <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                  <div className="aspect-video relative">
                    <Image
                      src={event.image || "/placeholder.svg?height=160&width=320"}
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
                      {event.date} • {event.startTime}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {event.tags &&
                        event.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <Badge
                      variant={event.capacity - (event._count?.registrations || 0) < 10 ? "destructive" : "outline"}
                    >
                      {event.capacity - (event._count?.registrations || 0)} Seats Available
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => {
                        handleRegistration(event.id)
                      }}
                    >
                      Register
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <Button>View All Events</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
