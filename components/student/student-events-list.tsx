"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, Heart } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { format } from "date-fns"

interface Event {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  category: string
  eventType: string
  capacity: number
  organizer: {
    id: string
    name: string
    avatar?: string
  }
  _count?: {
    registrations: number
  }
  registrationDeadline?: string
  isPublic: boolean
  venue?: string
  department?: string
  contactEmail?: string
  contactPhone?: string
}

interface StudentEventsListProps {
  searchQuery?: string
  filters?: {
    category?: string[]
    eventType?: string
    dateRange?: {
      from?: Date
      to?: Date
    }
  }
  sortBy?: string
}

export function StudentEventsList({ searchQuery = "", filters = {}, sortBy = "upcoming" }: StudentEventsListProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalEvents, setTotalEvents] = useState(0)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)

        // Build query parameters
        const queryParams = new URLSearchParams()

        // Add search query
        if (searchQuery) {
          queryParams.append("search", searchQuery)
        }

        // Add sort parameter
        queryParams.append("sort", sortBy)

        // Add pagination
        queryParams.append("page", currentPage.toString())
        queryParams.append("limit", "9") // 9 items per page for 3x3 grid

        // Add category filter
        if (filters.category && filters.category.length > 0) {
          queryParams.append("category", filters.category.join(","))
        }

        // Add event type filter
        if (filters.eventType) {
          queryParams.append("eventType", filters.eventType)
        }

        // Add date range filter
        if (filters.dateRange?.from) {
          queryParams.append("startDate", filters.dateRange.from.toISOString())
        }
        if (filters.dateRange?.to) {
          queryParams.append("endDate", filters.dateRange.to.toISOString())
        }

        // Only show approved events to students
        queryParams.append("status", "APPROVED")

        // Make the API request
        const response = await fetch(`/api/events?${queryParams.toString()}`)

        if (!response.ok) {
          throw new Error(`Error fetching events: ${response.status}`)
        }

        const data = await response.json()

        setEvents(data.events)
        setTotalEvents(data.total)
        setTotalPages(data.totalPages)
      } catch (error) {
        console.error("Error fetching events:", error)
        setError(error instanceof Error ? error.message : "An error occurred while fetching events")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [searchQuery, filters, sortBy, currentPage])

  const getCategoryBadge = (category: string) => {
    const categories: Record<string, string> = {
      TECHNICAL: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      WORKSHOP: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      ACADEMIC: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
      CULTURAL: "bg-pink-100 text-pink-800 hover:bg-pink-100",
      SPORTS: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      OTHER: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    }

    return categories[category] || "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case "ONLINE":
        return (
          <Badge variant="outline" className="bg-blue-50">
            Online
          </Badge>
        )
      case "HYBRID":
        return (
          <Badge variant="outline" className="bg-purple-50">
            Hybrid
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-green-50">
            In Person
          </Badge>
        )
    }
  }

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  if (loading && currentPage === 1) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-[200px] w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <p>Failed to load events</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>No events found</p>
            <p className="text-sm">Try adjusting your filters or check back later</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden flex flex-col">
            <div className="relative h-[200px] w-full bg-muted">
              {/* If we have images array, use the first one, otherwise use placeholder */}
              <img
                src="/placeholder.svg?height=200&width=400"
                alt={event.title}
                className="h-full w-full object-cover"
              />
              <Badge className={`absolute top-2 right-2 ${getCategoryBadge(event.category)}`}>
                {event.category.charAt(0) + event.category.slice(1).toLowerCase()}
              </Badge>
            </div>

            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                {getEventTypeIcon(event.eventType)}
              </div>
              <CardDescription className="line-clamp-2">{event.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-grow">
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {event.startTime} {event.endTime && `- ${event.endTime}`}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{event.venue || event.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {event._count?.registrations || 0} / {event.capacity} registered
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Link href={`/student/events/${event.id}`}>
                <Button size="sm">Register Now</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {currentPage < totalPages && (
        <div className="flex justify-center mt-6">
          <Button onClick={handleLoadMore} disabled={loading}>
            {loading ? "Loading..." : "Load More Events"}
          </Button>
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground mt-2">
        Showing {events.length} of {totalEvents} events
      </div>
    </div>
  )
}
