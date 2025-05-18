"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { format, isSameDay } from "date-fns"

interface CalendarEvent {
  id: string
  title: string
  date: string
  location: string
  startTime: string
  endTime?: string
  category: string
}

interface StudentEventsCalendarProps {
  searchQuery?: string
  filters?: any
}

export function StudentEventsCalendar({ searchQuery = "", filters = {} }: StudentEventsCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([])

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

        // We want all events for the calendar view with no pagination
        queryParams.append("limit", "100")

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
        updateSelectedDayEvents(selectedDate, data.events)
      } catch (error) {
        console.error("Error fetching events:", error)
        setError(error instanceof Error ? error.message : "An error occurred while fetching events")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [searchQuery, filters, selectedDate])

  const updateSelectedDayEvents = (date: Date | undefined, eventList: CalendarEvent[]) => {
    if (!date || !eventList.length) {
      setSelectedDayEvents([])
      return
    }

    const dayEvents = eventList.filter((event) => isSameDay(new Date(event.date), date))

    setSelectedDayEvents(dayEvents)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    updateSelectedDayEvents(date, events)
  }

  // Function to determine which dates have events
  const getDayClassName = (date: Date) => {
    const hasEvent = events.some((event) => isSameDay(new Date(event.date), date))
    return hasEvent ? "bg-primary/10 rounded-full font-bold" : ""
  }

  const getCategoryColor = (category: string) => {
    const categories: Record<string, string> = {
      TECHNICAL: "bg-blue-500",
      WORKSHOP: "bg-purple-500",
      ACADEMIC: "bg-indigo-500",
      CULTURAL: "bg-pink-500",
      SPORTS: "bg-orange-500",
      OTHER: "bg-gray-500",
    }

    return categories[category] || "bg-gray-500"
  }

  if (loading && !events.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Skeleton className="h-[350px] w-full" />
        </div>
        <div className="md:col-span-2">
          <Skeleton className="h-16 w-full mb-4" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full mb-3" />
          ))}
        </div>
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardContent className="p-4">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
            modifiers={{
              hasEvent: (date) => events.some((event) => isSameDay(new Date(event.date), date)),
            }}
            modifiersClassNames={{
              hasEvent: "bg-primary/10 rounded-full font-bold",
            }}
            defaultMonth={selectedDate}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">Days with events are highlighted</div>
        </CardContent>
      </Card>

      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">
              {selectedDate ? `Events on ${format(selectedDate, "MMMM d, yyyy")}` : "Select a date to see events"}
            </h3>

            {selectedDayEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No events scheduled for this day</div>
            ) : (
              <div className="space-y-4">
                {selectedDayEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="flex border-l-4 h-full" style={{ borderColor: getCategoryColor(event.category) }}>
                      <CardContent className="p-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{event.title}</h4>
                            <div className="space-y-1 mt-1">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                <span>
                                  {event.startTime} {event.endTime && `- ${event.endTime}`}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={getCategoryBadge(event.category)}>
                            {event.category.charAt(0) + event.category.slice(1).toLowerCase()}
                          </Badge>
                        </div>
                        <div className="mt-2">
                          <Link href={`/student/events/${event.id}`}>
                            <Button size="sm">View Details</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getCategoryBadge(category: string) {
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
