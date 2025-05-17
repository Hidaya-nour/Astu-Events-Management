"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, isSameDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"

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
  approvalStatus: string
  capacity: number
  _count: {
    registrations: number
  }
}

interface AdminEventsCalendarViewProps {
  searchQuery: string
  sortBy: string
}

export function AdminEventsCalendarView({ searchQuery, sortBy }: AdminEventsCalendarViewProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams()
        if (searchQuery) {
          queryParams.append('search', searchQuery)
        }
        if (sortBy) {
          queryParams.append('sort', sortBy)
        }

        const response = await fetch(`/api/events?${queryParams.toString()}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`)
        }
        const data = await response.json()
        setEvents(data.events)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [searchQuery, sortBy])

  const filteredEvents = selectedDate
    ? events.filter(event => isSameDay(new Date(event.date), selectedDate))
    : events

  if (loading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-destructive text-center h-[400px] flex items-center justify-center">
        <div>
          <p>Failed to load events</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center h-[400px] flex items-center justify-center">
        <div>
          <p className="text-lg font-medium">No events found</p>
          <p className="text-sm text-muted-foreground">
            {searchQuery ? 'Try adjusting your search' : 'No events available'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-1">
        <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            />
          </CardContent>
        </Card>

      <div className="md:col-span-2 space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center h-[400px] flex items-center justify-center">
            <div>
              <p className="text-lg font-medium">No events found</p>
              <p className="text-sm text-muted-foreground">
                {selectedDate
                  ? `No events on ${format(selectedDate, 'PPP')}`
                  : 'Try selecting a date or adjusting your search'}
              </p>
            </div>
                    </div>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.date), 'PPP')} • {event.startTime} - {event.endTime}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.location} • {event.category}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      event.approvalStatus === "APPROVED" ? "default" :
                      event.approvalStatus === "PENDING" ? "secondary" :
                      event.approvalStatus === "REJECTED" ? "destructive" :
                      "outline"
                    }>
                      {event.approvalStatus}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {/* {event._count.registrations}/{event.capacity} attendees */}
                    </span>
              </div>
              </div>
          </CardContent>
        </Card>
          ))
        )}
      </div>
    </div>
  )
}
