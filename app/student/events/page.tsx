"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventFilters } from "@/components/student/event-filters"
import { EnhancedEventCard } from "@/components/student/enhanced-event-card"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DashboardProvider } from "@/contexts/dashboard-context"
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
  registrationStatus: "REGISTERED" | "WAITLISTED" | "PENDING" | "NOT_REGISTERED" | "EXPIRED" | "CANCELLED"
  registrationDeadline?: string
  eventType: "IN_PERSON" | "ONLINE" | "HYBRID"
  relevance?: Array<"DEPARTMENT" | "YEAR" | "RECOMMENDED">
  isFavorite?: boolean
  status?: "PENDING" | "APPROVED" | "REJECTED"
  approvalStatus?: "APPROVED" | "REJECTED" | "PENDING"
  department?: string
  year?: number
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
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([])
  const [organizedEvents, setOrganizedEvents] = useState<Event[]>([])
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [filters, setFilters] = useState<Filters>({})

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      // Transform the events data to match EnhancedEventCard interface
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
          time: event.startTime || "TBD",
          attendees: event._count?.registrations || 0,
          maxAttendees: event.capacity,
          organizer: typeof event.organizer === 'object' ? event.organizer.name : event.organizer,
          organizerAvatar: typeof event.organizer === 'object' ? event.organizer.avatar : undefined,
          registrationStatus: event.registrationStatus || "NOT_REGISTERED",
          eventType: event.eventType || "IN_PERSON",
          relevance: event.relevance || []
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
      
      const transformedEvents = data.map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description || "",
        date: event.date,
        time: event.startTime || "TBD",
        endTime: event.endTime,
        location: event.location,
        venue: event.venue,
        organizer: event.createdBy?.name || "Unknown Organizer",
        organizerAvatar: event.createdBy?.image || "/placeholder.svg",
        attendees: event._count?.registrations || 0,
        maxAttendees: event.capacity || undefined,
        category: event.category,
        image: event.images ? JSON.parse(event.images)[0] : "/placeholder.svg",
        registrationStatus: "REGISTERED",
        isFavorite: event.isFavorite || false,
        status: event.status,
        department: event.department,
        year: event.year,
        eventType: event.eventType || "IN_PERSON",
        relevance: event.relevance || []
      }))

      setRegisteredEvents(transformedEvents)
      
      // Update events state with registration status
      setEvents(prevEvents => 
        prevEvents.map(event => ({
          ...event,
          isRegistered: transformedEvents.some(regEvent => regEvent.id === event.id),
          registrationStatus: transformedEvents.some(regEvent => regEvent.id === event.id) 
            ? "REGISTERED" 
            : "NOT_REGISTERED"
        }))
      )
    } catch (err) {
      setError(err.message)
      toast.error("Failed to fetch registered events")
    }
  }

  // Fetch organized events
  const fetchOrganizedEvents = async () => {
    try {
      const response = await fetch('/api/events/organizer')
      if (!response.ok) throw new Error('Failed to fetch organized events')
      const data = await response.json()
      
      const transformedEvents = data.map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description || "",
        date: event.date,
        time: event.startTime || "TBD",
        endTime: event.endTime,
        location: event.location,
        venue: event.venue || "",
        organizer: event.createdBy?.name || "Unknown Organizer",
        organizerAvatar: event.createdBy?.image || "/placeholder.svg",
        attendees: event._count?.registrations || 0,
        maxAttendees: event.capacity || undefined,
        category: event.category,
        image: event.images ? JSON.parse(event.images)[0] : "/placeholder.svg",
        registrationStatus: "NOT_REGISTERED",
        status: event.status,
        approvalStatus: event.approvalStatus || "PENDING",
        isFavorite: false,
        department: event.department,
        year: event.year,
        eventType: event.eventType || "IN_PERSON",
        relevance: []
      }))
      
      setOrganizedEvents(transformedEvents)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to fetch organized events")
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
        await Promise.all([
          fetchEvents(),
          fetchRegisteredEvents(),
          fetchOrganizedEvents()
        ])
        
        // Set recommended events based on relevance
        setRecommendedEvents(
          events.filter(event => 
            event.relevance?.includes("RECOMMENDED") || 
            event.department === session?.user?.department
          )
        )
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
  }, [status])

  if (status === 'loading') {
    return (
      <DashboardProvider
        role="STUDENT"
        userInfo={{
          name: "Loading...",
          role: "STUDENT",
        }}
      >
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
      </DashboardProvider>
    )
  }

  return (
    <DashboardProvider
      role="STUDENT"
      userInfo={{
        name: session?.user?.name || "Student",
        role: "STUDENT",
        avatar: session?.user?.image,
      }}
    >
      <DashboardLayout
        appName="ASTU Events"
        appLogo="/placeholder.svg?height=32&width=32"
        helpText="Need Assistance?"
        helpLink="/dashboard/student/support"
      >
        <main className="flex-1 space-y-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Explore Events</h2>
              <p className="text-muted-foreground">Discover and register for events happening around campus</p>
            </div>
            <Button onClick={() => router.push('/organizer/events/create')}>
              Request to Organize
            </Button>
          </div>

          <Tabs defaultValue="all" className="space-y-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="registered">My Registrations ({registeredEvents.length})</TabsTrigger>
              <TabsTrigger value="organized">Created by me ({organizedEvents.length})</TabsTrigger>
              <TabsTrigger value="recommended">Recommended ({recommendedEvents.length})</TabsTrigger>
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
                    onClick={(e) => {
                      // Don't navigate if clicking the register button
                      if ((e.target as HTMLElement).closest('button')) {
                        return;
                      }
                      router.push(`/student/events/${event.id}`);
                    }}                >
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
                {registeredEvents.map((event) => (
                  <Card 
                    key={event.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('button')) {
                        return;
                      }
                      router.push(`/student/events/${event.id}`);
                    }}
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
              {registeredEvents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">You haven't registered for any events yet</p>
                  <Button className="mt-4" onClick={() => setActiveTab("all")}>
                    Browse Events
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="organized" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {organizedEvents.map((event) => (
                  <Card 
                    key={event.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('button')) {
                        return;
                      }
                      router.push(`/student/events/${event.id}`);
                    }}
                  >
                    <EnhancedEventCard
                      event={event}
                      showStatus={true}
                      statusText={event.approvalStatus}
                    />
                  </Card>
                ))}
              </div>
              {organizedEvents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">You haven't organized any events yet</p>
                  <Button className="mt-4" onClick={() => router.push('/organizer/events/create')}>
                    Request to Organize
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recommended" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recommendedEvents.map((event) => (
                  <Card 
                    key={event.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('button')) {
                        return;
                      }
                      router.push(`/student/events/${event.id}`);
                    }}
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
              {recommendedEvents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No recommended events available</p>
                  <Button variant="outline" className="mt-4" onClick={() => setActiveTab("all")}>
                    Browse All Events
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </DashboardLayout>
    </DashboardProvider>
  )
}
