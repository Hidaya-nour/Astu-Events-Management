"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Filter, MapPin, Search } from "lucide-react"
import Link from "next/link"
import EventCard from "@/components/event-card"
import { mockEvents } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDate, setSelectedDate] = useState("all")
  const [view, setView] = useState("grid")

  // Filter events based on search query and filters
  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory

    const matchesDate =
      selectedDate === "all" ||
      (selectedDate === "upcoming" && new Date(event.date) > new Date()) ||
      (selectedDate === "past" && new Date(event.date) < new Date())

    return matchesSearch && matchesCategory && matchesDate
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button asChild>
          <Link href="/events/create">Create Event</Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <div className="flex flex-1 flex-wrap gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="arts">Arts</SelectItem>
                <SelectItem value="career">Career</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto">
            <Tabs value={view} onValueChange={setView} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Active filters */}
        {(selectedCategory !== "all" || selectedDate !== "all" || searchQuery) && (
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory("all")} className="ml-1 rounded-full hover:bg-gray-200">
                  ✕
                </button>
              </Badge>
            )}
            {selectedDate !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1">
                Date: {selectedDate}
                <button onClick={() => setSelectedDate("all")} className="ml-1 rounded-full hover:bg-gray-200">
                  ✕
                </button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="outline" className="flex items-center gap-1">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery("")} className="ml-1 rounded-full hover:bg-gray-200">
                  ✕
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCategory("all")
                setSelectedDate("all")
                setSearchQuery("")
              }}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Events Display */}
      <TabsContent value="grid" className="mt-0">
        {filteredEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <Calendar className="mb-2 h-10 w-10 text-gray-400" />
            <p className="text-gray-500">No events found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSelectedCategory("all")
                setSelectedDate("all")
                setSearchQuery("")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="list" className="mt-0">
        {filteredEvents.length > 0 ? (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div key={event.id} className="flex flex-col overflow-hidden rounded-lg border shadow-sm sm:flex-row">
                <div className="relative h-48 w-full sm:h-auto sm:w-48">
                  <img
                    src={event.image || "/placeholder.svg?height=200&width=200"}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.description}</p>
                    </div>
                    <Badge>{event.category}</Badge>
                  </div>
                  <div className="mt-auto space-y-2 pt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-2 h-4 w-4" />
                      {event.location}
                    </div>
                    <div className="flex justify-end">
                      <Button asChild variant="outline">
                        <Link href={`/events/${event.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <Calendar className="mb-2 h-10 w-10 text-gray-400" />
            <p className="text-gray-500">No events found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSelectedCategory("all")
                setSelectedDate("all")
                setSearchQuery("")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </TabsContent>
    </div>
  )
}
