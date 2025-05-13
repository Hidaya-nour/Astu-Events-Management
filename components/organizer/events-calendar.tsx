"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock, MapPin } from "lucide-react"
import { format, isSameDay } from "date-fns"

// Sample data - in a real app, this would come from your API
const events = [
  {
    id: "1",
    title: "Tech Symposium 2025",
    date: new Date("2025-05-15"),
    time: "10:00 AM - 4:00 PM",
    location: "Main Auditorium",
    status: "APPROVED",
    category: "TECHNOLOGY",
    attendees: 120,
    capacity: 150,
  },
  {
    id: "2",
    title: "Workshop on AI and Machine Learning",
    date: new Date("2025-06-05"),
    time: "2:00 PM - 5:00 PM",
    location: "Computer Lab",
    status: "PENDING",
    category: "WORKSHOP",
    attendees: 45,
    capacity: 50,
  },
  {
    id: "3",
    title: "Annual Coding Competition",
    date: new Date("2025-06-15"),
    time: "9:00 AM - 6:00 PM",
    location: "Exhibition Hall",
    status: "APPROVED",
    category: "COMPETITION",
    attendees: 75,
    capacity: 100,
  },
  {
    id: "4",
    title: "Career Development Seminar",
    date: new Date("2025-05-25"),
    time: "1:00 PM - 4:00 PM",
    location: "Conference Room",
    status: "APPROVED",
    category: "CAREER",
    attendees: 60,
    capacity: 80,
  },
  {
    id: "5",
    title: "Mobile App Development Workshop",
    date: new Date("2025-07-10"),
    time: "10:00 AM - 3:00 PM",
    location: "Computer Lab",
    status: "PENDING",
    category: "WORKSHOP",
    attendees: 30,
    capacity: 40,
  },
]

export function EventsCalendarView() {
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
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">{getCategoryBadge(event.category)}</div>
                      <span className="text-xs text-muted-foreground">
                        {event.attendees}/{event.capacity} attendees
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
                <Button variant="outline" size="sm">
                  Create Event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
