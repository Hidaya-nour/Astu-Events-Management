"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { DashboardStats } from "@/components/student/dashboard-stats"
import { EventCard } from "@/components/student/event-card"
import { SearchFilters } from "@/components/student/search-filters"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, Clock, MapPin, Plus } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

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
  isFavorite?: boolean
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
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>([])
  const [myEvents, setMyEvents] = useState<Event[]>([])
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events?sort=upcoming')
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      
      const transformedEvents = data.events.map((event: any) => {
        let imageUrl = "/placeholder.svg";
      
        try {
          const parsedImages = JSON.parse(event.images);
          if (Array.isArray(parsedImages)) {
            imageUrl = parsedImages[0];
          }
        } catch (e) {
          console.warn("Could not parse images", e);
        }
      
        return {
          ...event,
          images: imageUrl,
          organizer: {
            id: event.createdById || "",
            name: event.createdBy?.name || "Unknown Organizer",
            avatar: event.createdBy?.image || "/placeholder.svg"
          }
        };
      });
      
      setEvents(transformedEvents)
    } catch (err) {
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      })
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
        registrationStatus: event.status, // This comes from the registration record
        isFavorite: event.isFavorite || false
      }))
      
      setMyEvents(transformedEvents)
    } catch (err) {
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to fetch your events",
        variant: "destructive",
      })
    }
  }

  // Fetch recommended events
  const fetchRecommendedEvents = async () => {
    try {
      const response = await fetch('/api/events?sort=recommended')
      if (!response.ok) throw new Error('Failed to fetch recommended events')
      const data = await response.json()
      setRecommendedEvents(data.events)
    } catch (err) {
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to fetch recommended events",
        variant: "destructive",
      })
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

      // Refresh events after registration
      await Promise.all([
        fetchEvents(),
        fetchMyEvents(),
      ])

      toast({
        title: "Success",
        description: "Successfully registered for the event",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to register for the event",
        variant: "destructive",
      })
    }
  }

  // Handle event unregistration
  const handleUnregister = async (eventId: string) => {
    try {
      const response = await fetch(`/api/registration/${eventId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to unregister from event')
      }

      // Refresh events after unregistration
      await Promise.all([
        fetchEvents(),
        fetchMyEvents(),
      ])

      toast({
        title: "Success",
        description: "Successfully unregistered from the event",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to unregister from the event",
        variant: "destructive",
      })
    }
  }

  // Handle search and filters
  const handleSearch = async (filters: {
    search: string
    category: string[]
    date: string
    location: string
  }) => {
    try {
      const queryParams = new URLSearchParams()
      if (filters.search) queryParams.set('search', filters.search)
      if (filters.category.length) queryParams.set('category', filters.category.join(','))
      if (filters.date) queryParams.set('date', filters.date)
      if (filters.location) queryParams.set('location', filters.location)

      const response = await fetch(`/api/events?${queryParams.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch filtered events')
      const data = await response.json()
      setEvents(data.events)
    } catch (err) {
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to fetch filtered events",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        await Promise.all([
          fetchEvents(),
          fetchMyEvents(),
          fetchRecommendedEvents(),
        ])
      } catch (err) {
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      loadData()
    }
  }, [status])

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
                  src={session?.user?.image || "/placeholder.svg?height=64&width=64"}
                  alt={session?.user?.name || "User"}
                />
                <AvatarFallback>{(session?.user?.name || "User").charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome, {session?.user?.name || "User"}</h1>
                <p className="text-muted-foreground">
                  {session?.user?.department && `${session.user.department} • `}
                  {session?.user?.year && `${session.user.year} `}
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
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      variant="compact"
                      onRegister={handleRegister}
                    />
                  ))}
                  {events.length > 3 && (
                    <Button variant="outline" className="w-full">
                      View All My Events
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
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      variant="compact"
                      onRegister={handleRegister}
                    />
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Recommendations
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="discover" className="space-y-6">
            <SearchFilters onSearch={handleSearch} />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event}
                  onRegister={handleRegister}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">My Registered Events</h3>
              <Badge variant="secondary">{myEvents.length} events</Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event}
                  onRegister={handleRegister}
                  onUnregister={handleUnregister}
                />
              ))}
            </div>
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
                <EventCard 
                  key={event.id} 
                  event={event}
                  onRegister={handleRegister}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  )
}
