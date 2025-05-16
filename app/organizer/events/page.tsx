"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { EventsFilter } from "@/components/organizer/events-filter"
import { EventsStats } from "@/components/organizer/events-stats"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Search, Plus, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events/organizer")
        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }
        const data = await response.json()
        setEvents(data)
        setFilteredEvents(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    // Apply search and sort to events
    const searchResults = events.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const sortedResults = [...searchResults].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "location":
          return a.location.localeCompare(b.location)
        case "category":
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

    setFilteredEvents(sortedResults)
  }, [searchQuery, sortBy, events])

  // Calculate stats based on filtered events
  const stats = {
    totalEvents: filteredEvents.length,
    upcomingEvents: filteredEvents.filter((event) => new Date(event.date) > new Date()).length,
    totalAttendees: filteredEvents.reduce((acc, event) => acc + event.currentAttendees, 0),
    approvedEvents: filteredEvents.filter((event) => event.status === "APPROVED").length,
  }

  if (loading) {
    return (
      <DashboardLayout appName="ASTU Events">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout appName="ASTU Events">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  if (events.length === 0) {
    return (
      <DashboardLayout appName="ASTU Events">
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold mb-2">No Events Found</h2>
          <p className="text-gray-500 mb-4">You haven't created any events yet.</p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout appName="ASTU Events">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Events</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Filter events by various criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <EventsFilter events={events} onFilterChange={setFilteredEvents} />
            </CardContent>
          </Card>

          <div className="md:col-span-3 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <EventsStats stats={stats} />
            <div className="grid gap-4">
              {filteredEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} • {event.startTime} - {event.endTime}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.location} • {event.category}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === "APPROVED" ? "bg-green-100 text-green-700" :
                          event.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                          event.status === "REJECTED" ? "bg-red-100 text-red-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {event.status}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {event.currentAttendees}/{event.capacity} attendees
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
