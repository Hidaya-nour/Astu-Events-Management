"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventFilters } from "@/components/student/event-filters"
import { EnhancedEventCard } from "@/components/student/enhanced-event-card"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  venue?: string
  organizer: string
  organizerAvatar?: string
  attendees: number
  maxAttendees?: number
  category: string
  image: string
  department?: string
  year?: number
  registrationStatus: "REGISTERED" | "NOT_REGISTERED" | "WAITLISTED" | "PENDING" | "EXPIRED"
  registrationDeadline?: string
  eventType: "IN_PERSON" | "ONLINE" | "HYBRID"
  relevance?: ("DEPARTMENT" | "YEAR" | "RECOMMENDED")[]
  isFavorite?: boolean
  images: string[]
}

interface Filters {
  search?: string
  category?: string
  department?: string
  eventType?: string
  registrationStatus?: string
  yearLevel?: number
  showRelevantOnly?: boolean
  hideExpired?: boolean
}

export default function EventsPage() {
  const { data: session, status } = useSession()
  const [filters, setFilters] = useState<Filters>({})
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([])
  const [departmentEvents, setDepartmentEvents] = useState<Event[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      // Transform the events data to ensure organizer is a string
      const transformedEvents = data.events.map((event: any) => {
        let imageUrl = "/placeholder.svg";
        let images = [];

        try {
          if (event.images) {
            const parsedImages = JSON.parse(event.images);
            if (Array.isArray(parsedImages) && parsedImages.length > 0) {
              images = parsedImages;
              imageUrl = parsedImages[0];
            }
          }
        } catch (e) {
          console.warn("Could not parse images", e);
        }

        return {
          ...event,
          image: imageUrl,
          images: images,
          organizer: typeof event.organizer === 'object' ? event.organizer.name : event.organizer
        }
      })
      setEvents(transformedEvents)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to fetch events", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  // Fetch registered events
  const fetchRegisteredEvents = async () => {
    try {
      const response = await fetch('/api/registration/student')
      if (!response.ok) throw new Error('Failed to fetch registered events')
      const data = await response.json()
      
      // Transform registered events to match the Event interface
      const transformedRegisteredEvents = data.map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time || "TBD",
        location: event.location,
        venue: event.venue,
        organizer: event.organizer,
        organizerAvatar: event.organizerAvatar,
        attendees: event.attendees || 0,
        maxAttendees: event.maxAttendees,
        category: event.category,
        image: event.image || "/placeholder.svg",
        department: event.department,
        year: event.year,
        registrationStatus: event.status,
        registrationDeadline: event.registrationDeadline,
        eventType: event.eventType || "IN_PERSON",
        relevance: event.tags?.map((tag: string) => tag.toUpperCase()) || [],
        isFavorite: event.isFavorite || false,
        images: event.images || []
      }))

      // Update the events state with registered events
      setEvents(prevEvents => {
        // Create a map of existing events for quick lookup
        const eventMap = new Map(prevEvents.map(event => [event.id, event]))
        
        // Update or add registered events
        transformedRegisteredEvents.forEach(event => {
          eventMap.set(event.id, event)
        })
        setRegisteredEvents(transformedRegisteredEvents)
        return Array.from(eventMap.values())
      })
    } catch (err) {
      setError(err.message)
      toast.error("Failed to fetch registered events")
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
      await fetchEvents()

      toast.success("Successfully registered for the event", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (error) {
      toast.error(error.message || "Failed to register for the event", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
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
      await fetchEvents()

      toast.success("Successfully unregistered from the event", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (error) {
      toast.error(error.message || "Failed to unregister from the event", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  // Handle favorite toggle
  const handleFavorite = async (eventId: string, isFavorite: boolean) => {
    try {
      const response = await fetch(`/api/events/${eventId}/favorite`, {
        method: isFavorite ? 'POST' : 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update favorite status')
      }

      // Refresh events after favorite toggle
      await fetchEvents()

      toast.success(isFavorite ? "Added to favorites" : "Removed from favorites", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (error) {
      toast.error(error.message || "Failed to update favorite status", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  // Filter events based on active tab and filters
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])

  useEffect(() => {
    let result = [...events]

    // Filter by tab first
    if (activeTab === "registered") {
      result = registeredEvents
    } else if (activeTab === "recommended") {
      result = result.filter((event) => event.relevance?.includes("RECOMMENDED"))
    } else if (activeTab === "department") {
      result = result.filter(
        (event) =>
          event.department === session?.user?.department ||
          event.relevance?.includes("DEPARTMENT")
      )
    }

    // Apply additional filters
    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        result = result.filter(
          (event) =>
            event.title.toLowerCase().includes(searchLower) ||
            event.description.toLowerCase().includes(searchLower) ||
            event.category.toLowerCase().includes(searchLower)
        )
      }

      if (filters.category && filters.category !== 'ALL') {
        result = result.filter((event) => event.category === filters.category)
      }

      if (filters.department && filters.department !== 'ALL') {
        result = result.filter((event) => event.department === filters.department)
      }

      if (filters.eventType && filters.eventType !== 'ALL') {
        result = result.filter((event) => event.eventType === filters.eventType)
      }

      if (filters.registrationStatus && filters.registrationStatus !== 'ALL') {
        switch (filters.registrationStatus) {
          case 'Registered':
            result = result.filter((event) => event.registrationStatus === 'REGISTERED')
            break
          case 'Not Registered':
            result = result.filter((event) => event.registrationStatus === 'NOT_REGISTERED')
            break
          case 'Waitlisted':
            result = result.filter((event) => event.registrationStatus === 'WAITLISTED')
            break
          case 'Pending':
            result = result.filter((event) => event.registrationStatus === 'PENDING')
            break
        }
      }

      if (filters.yearLevel) {
        result = result.filter((event) => event.year === filters.yearLevel)
      }

      if (filters.showRelevantOnly) {
        result = result.filter(
          (event) =>
            event.department === session?.user?.department ||
            event.year === session?.user?.year ||
            (event.relevance && event.relevance.length > 0)
        )
      }

      if (filters.hideExpired) {
        const now = new Date()
        result = result.filter((event) => {
          const eventDate = new Date(event.date)
          return eventDate >= now
        })
      }
    }

    setFilteredEvents(result)
  }, [activeTab, filters, events, registeredEvents, session?.user?.department, session?.user?.year])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        await Promise.all([fetchEvents(), fetchRegisteredEvents()])
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

  const recommendedEvents = events.filter((event) => event.relevance?.includes("RECOMMENDED"))

  // Update department events when events or session changes
  useEffect(() => {
    if (session?.user?.department) {
      setDepartmentEvents(
        events.filter(
          (event) =>
            event.department === session.user.department ||
            event.relevance?.includes("DEPARTMENT")
        )
      )
    }
  }, [events, session?.user?.department])

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
        <div>
          <h2 className="text-2xl font-bold">Explore Events</h2>
          <p className="text-muted-foreground">Discover and register for events happening around campus</p>
        </div>

        <Tabs defaultValue="all" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="registered">My Registrations ({registeredEvents.length})</TabsTrigger>
            <TabsTrigger value="recommended">Recommended ({recommendedEvents.length})</TabsTrigger>
            <TabsTrigger value="department">My Department ({departmentEvents.length})</TabsTrigger>
          </TabsList>

          <EventFilters
            onFiltersChange={setFilters}
            userDepartment={session?.user?.department}
            userYear={session?.user?.year}
          />

          <TabsContent value="all" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push(`/student/events/${event.id}`)}
                >
                  <EnhancedEventCard
                    event={event}
                    onRegister={handleRegister}
                    onUnregister={handleUnregister}
                    onFavorite={handleFavorite}
                  />
                </Card>
              ))}
            </div>
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No events match your current filters</p>
                <Button variant="outline" className="mt-4" onClick={() => setFilters({})}>
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="registered" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push(`/student/events/${event.id}`)}
                >
                  <EnhancedEventCard
                    event={event}
                    onRegister={handleRegister}
                    onUnregister={handleUnregister}
                    onFavorite={handleFavorite}
                  />
                </Card>
              ))}
            </div>
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">You haven't registered for any events yet</p>
                <Button className="mt-4" onClick={() => setActiveTab("all")}>
                  Browse Events
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommended" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push(`/student/events/${event.id}`)}
                >
                  <EnhancedEventCard
                    event={event}
                    onRegister={handleRegister}
                    onUnregister={handleUnregister}
                    onFavorite={handleFavorite}
                  />
                </Card>
              ))}
            </div>
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No recommended events match your current filters</p>
                <Button variant="outline" className="mt-4" onClick={() => setFilters({})}>
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="department" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push(`/student/events/${event.id}`)}
                >
                  <EnhancedEventCard
                    event={event}
                    onRegister={handleRegister}
                    onUnregister={handleUnregister}
                    onFavorite={handleFavorite}
                  />
                </Card>
              ))}
            </div>
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No department events match your current filters</p>
                <Button variant="outline" className="mt-4" onClick={() => setFilters({})}>
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  )
}
