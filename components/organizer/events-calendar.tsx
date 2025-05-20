"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock, MapPin } from "lucide-react"
import { format, isSameDay } from "date-fns"
import Link from "next/link"

interface Event {
  id: string
  title: string
  date: Date
  startTime: string
  endTime: string
  location: string
  category: string
  status: string
  capacity: number
  currentAttendees: number
}

interface EventsCalendarViewProps {
  events: Event[]
}

export function EventsCalendarView({ events }: EventsCalendarViewProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const handleSelect = (day: Date | undefined) => {
    if (day) {
      setSelectedDate(day)
    }
  }

  const eventsOnSelectedDate = events.filter((event) => selectedDate && isSameDay(event.date, selectedDate))

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      case "CANCELLED":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    const categories: Record<string, { bg: string; text: string }> = {
      TECHNOLOGY: { bg: "bg-blue-100", text: "text-blue-800" },
      WORKSHOP: { bg: "bg-purple-100", text: "text-purple-800" },
      COMPETITION: { bg: "bg-orange-100", text: "text-orange-800" },
      CAREER: { bg: "bg-green-100", text: "text-green-800" },
      ACADEMIC: { bg: "bg-indigo-100", text: "text-indigo-800" },
      CULTURAL: { bg: "bg-pink-100", text: "text-pink-800" },
      SPORTS: { bg: "bg-red-100", text: "text-red-800" },
    }

    const style = categories[category] || { bg: "bg-gray-100", text: "text-gray-800" }

    return (
      <Badge className={`${style.bg} ${style.text} hover:${style.bg}`}>
        {category.charAt(0) + category.slice(1).toLowerCase().replace("_", " ")}
      </Badge>
    )
  }

  if (!events.length) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No events found</h3>
        <p className="text-muted-foreground">Create your first event to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      <div className="md:col-span-5">
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium">{format(date, "MMMM yyyy")}</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newDate = new Date(date)
                    newDate.setMonth(newDate.getMonth() - 1)
                    setDate(newDate)
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newDate = new Date(date)
                    newDate.setMonth(newDate.getMonth() + 1)
                    setDate(newDate)
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              month={date}
              className="rounded-md border-0"
              modifiers={{
                event: events.map((event) => event.date),
              }}
              modifiersStyles={{
                event: {
                  fontWeight: "bold",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  borderRadius: "0.25rem",
                  color: "rgb(59, 130, 246)",
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Events on {format(selectedDate, "MMMM d, yyyy")}</h3>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </div>

            {eventsOnSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {eventsOnSelectedDate.map((event) => (
                  <div key={event.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      {getStatusBadge(event.status)}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">{getCategoryBadge(event.category)}</div>
                      <span className="text-xs text-muted-foreground">
                        {event.currentAttendees}/{event.capacity} attendees
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h4 className="font-medium mb-1">No Events</h4>
                <p className="text-sm text-muted-foreground mb-4">There are no events scheduled for this date.</p>
                <Link href="/dashboard/organizer/events/create">
                  <Button variant="outline" size="sm">
                    Create Event
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
