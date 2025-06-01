"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { DashboardStats } from "@/components/student/dashboard-stats"
import { EventCard } from "@/components/student/event-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, Clock, MapPin, Plus } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "react-toastify"
import { EventFilters } from "@/components/student/event-filters"
import { useRouter } from "next/navigation"

interface Event {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime?: string
  location: string
  venue?: string
  organizer: {
    id: string
    name: string
    avatar?: string
  }
  category: string
  images: string
  capacity: number
  _count?: {
    registrations: number
  }
  isRegistered?: boolean
  registrationStatus?: "PENDING" | "CONFIRMED" | "CANCELLED" | "WAITLISTED"
  isFavorite?: boolean
  status?: string
  approvalStatus?: "APPROVED" | "REJECTED" | "PENDING"
  attendees?: {
    id: string
    name: string
    email: string
    image?: string
    department?: string
    year?: number
    registrationStatus: string
  }[]
}

// Add type for the session user
interface SessionUser {
  id: string
  name: string
  email: string
  image?: string
  department?: string
  year?: number
  role?: string
}

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

export default function StudentDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const user = session?.user as SessionUser | undefined
  const [events, setEvents] = useState<Event[]>([])
  const [myEvents, setMyEvents] = useState<Event[]>([])
  const [organizedEvents, setOrganizedEvents] = useState<Event[]>([])
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<{
    search?: string
    category?: string
    department?: string
    eventType?: string
    dateRange?: string
    registrationStatus?: string
    showRelevantOnly?: boolean
    hideExpired?: boolean
    yearLevel?: number
  }>({})

  // Fetch all events with filters
  const fetchEvents = async () => {
    try {
      const queryParams = new URLSearchParams()
      
      // Add search term
      if (filters.search) {
        queryParams.set('search', filters.search.trim())
      }

      // Add category filter
      if (filters.category && filters.category !== 'ALL') {
        queryParams.set('category', filters.category)
      }

      // Add date range filter
      if (filters.dateRange && filters.dateRange !== 'ALL') {
        const today = new Date()
        const endOfDay = new Date(today)
        endOfDay.setHours(23, 59, 59, 999)

        switch (filters.dateRange) {
          case 'Today':
            queryParams.set('startDate', today.toISOString())
            queryParams.set('endDate', endOfDay.toISOString())
            break
          case 'This Week':
            const endOfWeek = new Date(today)
            endOfWeek.setDate(today.getDate() + 7)
            queryParams.set('startDate', today.toISOString())
            queryParams.set('endDate', endOfWeek.toISOString())
            break
          case 'This Month':
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
            queryParams.set('startDate', today.toISOString())
            queryParams.set('endDate', endOfMonth.toISOString())
            break
          case 'Upcoming':
            queryParams.set('startDate', today.toISOString())
            break
        }
      }

      // Add event type filter
      if (filters.eventType && filters.eventType !== 'ALL') {
        queryParams.set('eventType', filters.eventType)
      }

      // Add department filter
      if (filters.department && filters.department !== 'ALL') {
        queryParams.set('department', filters.department)
      }

      // Add registration status filter
      if (filters.registrationStatus && filters.registrationStatus !== 'ALL') {
        queryParams.set('status', filters.registrationStatus)
      }

      // Add sorting

      //queryParams.set('sort', 'upcoming')

      console.log('Fetching events with params:', queryParams.toString())
      const response = await fetch(`/api/events?${queryParams.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch events')
      }
      
      const data = await response.json()
      
      const transformedEvents = data.events.map((event: any) => ({
        ...event,
        images: event.images || "/placeholder.svg",
        organizer: {
          id: event.createdById || "",
          name: event.createdBy?.name || "Unknown Organizer",
          avatar: event.createdBy?.image || "/placeholder.svg"
        }
      }));
      
      setEvents(transformedEvents)
    } catch (err) {
      console.error('Error fetching events:', err)
      setError(err.message)
      toast.error(err.message || "Failed to fetch events")
    }
  }

  // Fetch my registered events
  const fetchMyEvents = async () => {
    try {
      const response = await fetch('/api/registration/student')
      if (!response.ok) throw new Error('Failed to fetch my events')
      const data = await response.json()
      
      // Transform the data to match the Event interface
      const transformedEvents = data.map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        startTime: event.startTime || "TBD",
        endTime: event.endTime,
        location: event.location,
        venue: event.venue,
        organizer: {
          id: event.createdById || "",
          name: event.organizer || "Unknown Organizer",
          avatar: event.organizerAvatar || "/placeholder.svg"
        },
        category: event.category,
        images: event.image || "/placeholder.svg",
        capacity: event.capacity || 0,
        _count: {
          registrations: event._count?.registrations || 0
        },
        isRegistered: true,
        registrationStatus: event.status,
        isFavorite: event.isFavorite || false,
        attendees: event.attendees || []
      }))
      
      setMyEvents(transformedEvents)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to fetch your events")
    }
  }

  // Fetch recommended events
  const fetchRecommendedEvents = async () => {
    try {
      const response = await fetch('/api/recommendations')
      if (!response.ok) throw new Error('Failed to fetch recommended events')
      const data = await response.json()
      
      // Transform the data to match the Event interface
      const transformedEvents = data.map((event: any) => ({
        ...event,
        images: event.images || "/placeholder.svg",
        organizer: {
          id: event.createdById || "",
          name: event.createdBy?.name || "Unknown Organizer",
          avatar: event.createdBy?.image || "/placeholder.svg"
        }
      }));
      
      setRecommendedEvents(transformedEvents)
    } catch (err) {
      console.error('Error fetching recommended events:', err)
      setError(err.message)
      toast.error("Failed to fetch recommended events")
    }
  }

  // Fetch events organized by the student
  const fetchOrganizedEvents = async () => {
    try {
      const response = await fetch('/api/events/organizer')
      if (!response.ok) throw new Error('Failed to fetch organized events')
      const data = await response.json()
      
      const transformedEvents = data.map((event: any) => ({
        ...event,
        description: event.description || "",
        venue: event.venue || "",
        images: event.images || "/placeholder.svg",
        organizer: {
          id: event.createdById || "",
          name: event.createdBy?.name || "Unknown Organizer",
          avatar: event.createdBy?.image || "/placeholder.svg"
        },
        _count: {
          registrations: event.currentAttendees || 0
        }
      }));
      
      setOrganizedEvents(transformedEvents)
    } catch (err) {
      console.error('Error fetching organized events:', err)
      setError(err.message)
      setOrganizedEvents([])
    }
  }

  // Handle event registration
  const handleRegister = async (eventId: string) => {
    try {
      const response = await fetch(`/api/registration/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to register for event')
      }

      // Refresh both events lists
      await Promise.all([
        fetchEvents(),
        fetchMyEvents(),
      ])

    } catch (error) {
    }
  }

  // Handle event unregistration
  const handleCancelRegistration = async (eventId: string) => {
    try {
      const response = await fetch(`/api/registration/${eventId}`, {
        method: 'delete',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to cancel registration')
      }

      // Refresh events after unregistration
      await Promise.all([
        fetchEvents(),
        fetchMyEvents(),
      ])

      // toast.success("Successfully unregistered from the event")
    } catch (error) {
      // toast.error("Failed to unregister from the event")
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        await Promise.all([
          fetchEvents(),
          fetchMyEvents(),
          fetchOrganizedEvents(),
          fetchRecommendedEvents()
        ])
      } catch (err) {
        console.error('Error loading data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      loadData()
    }
  }, [status, filters])

  if (status === 'loading') {
    return (
      <DashboardLayout
        appName="ASTU Events"
        appLogo="/placeholder.svg?height=32&width=32"
        helpText="Need Assistance?"
        helpLink="/dashboard/student/support"
      >
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
      <main className="flex-1 space-y-6 p-6">
        {/* Welcome Section */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage
                  src={user?.image || "/placeholder.svg?height=64&width=64"}
                  alt={user?.name || "User"}
                />
                <AvatarFallback>{(user?.name || "User").charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome, {user?.name || "User"}</h1>
                <p className="text-muted-foreground">
                  {user?.department && `${user.department} • `}
                  {user?.year && `Year ${user.year}`}
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
       
        {/* Stats */}
        <DashboardStats />

        {/* Next Upcoming Event */}
        {events.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-primary" />
              Next Upcoming Event
            </h2>
            <UpcomingEvent event={events[0]} />
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="discover">Discover Events</TabsTrigger>
            <TabsTrigger value="my-events">My Events</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Upcoming Events
                    <Badge variant="secondary">{events.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {events.slice(0, 3).map((event) => (
                    <div 
                      key={event.id}
                      className="cursor-pointer hover:bg-muted/50 rounded-lg transition-colors"
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('button')) {
                          return;
                        }
                        router.push(`/student/events/${event.id}`);
                      }}
                    >
                      <EventCard
                        event={event} 
                        variant="compact"
                        onRegister={handleRegister}
                      />
                    </div>
                  ))}
                  {events.length > 3 && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push('/student/events')}
                    >
                      View All Events
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Recommended for You */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended for You</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendedEvents.slice(0, 3).map((event) => (
                    <div 
                      key={event.id}
                      className="cursor-pointer hover:bg-muted/50 rounded-lg transition-colors"
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('button')) {
                          return;
                        }
                        router.push(`/student/events/${event.id}`);
                      }}
                    >
                      <EventCard 
                        event={event} 
                        variant="compact"
                        onRegister={handleRegister}
                      />
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push('/student/events?tab=recommended')}
                  >
                    View All Recommendations
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="discover" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <EventFilters 
                onFiltersChange={setFilters}
                userDepartment={user?.department}
                userYear={user?.year}
              />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="cursor-pointer hover:bg-muted/50 rounded-lg transition-colors"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('button')) {
                      return;
                    }
                    router.push(`/student/events/${event.id}`);
                  }}
                >
                  <EventCard 
                    event={event}
                    onRegister={handleRegister}
                  />
                </div>
              ))}
            </div>
            {events.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No events match your current filters</p>
                <Button variant="outline" className="mt-4" onClick={() => setFilters({})}>
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-events" className="space-y-6">
            <Tabs defaultValue="registered" className="space-y-6">
              <TabsList>
                <TabsTrigger value="registered">Registered Events</TabsTrigger>
                <TabsTrigger value="organized">Organized Events</TabsTrigger>
              </TabsList>

              <TabsContent value="registered">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">My Registered Events</h3>
                  <Badge variant="secondary">{myEvents.length} events</Badge>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {myEvents.map((event) => (
                    <div 
                      key={event.id}
                      className="cursor-pointer hover:bg-muted/50 rounded-lg transition-colors"
                      onClick={() => router.push(`/student/events/${event.id}`)}
                    >
                      <EventCard 
                        event={event}
                        onRegister={handleRegister}
                        onCancelRegistration={handleCancelRegistration}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="organized">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Events I Organized</h3>
                  <Badge variant="secondary">{organizedEvents.length} events</Badge>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {organizedEvents.map((event) => (
                    <div 
                      key={event.id}
                      className="cursor-pointer hover:bg-muted/50 rounded-lg transition-colors"
                      onClick={() => router.push(`/student/events/${event.id}`)}
                    >
                      <EventCard 
                        event={{
                          ...event,
                          status: event.approvalStatus === "APPROVED" ? "APPROVED" : 
                                  event.approvalStatus === "REJECTED" ? "REJECTED" : "PENDING"
                        }}
                        showStatus={true}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="recommended" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Recommended Events</h3>
                <p className="text-sm text-muted-foreground">Based on your interests and past attendance</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendedEvents.map((event) => (
                <div 
                  key={event.id}
                  className="cursor-pointer hover:bg-muted/50 rounded-lg transition-colors"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('button')) {
                      return;
                    }
                    router.push(`/student/events/${event.id}`);
                  }}
                >
                  <EventCard 
                    event={event}
                    onRegister={handleRegister}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  )
}
