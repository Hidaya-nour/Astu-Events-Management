"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, MapPin, Users, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const mockEvents = {
  attending: [
    {
      id: "1",
      title: "Tech Summit 2025",
      description: "Annual technology conference featuring the latest innovations",
      date: "Oct 15, 2025",
      location: "Main Auditorium",
      attendees: 120,
      image: "/placeholder.svg?height=100&width=200",
      status: "upcoming",
    },
    {
      id: "2",
      title: "Cultural Night",
      description: "Celebrating diverse cultures through performances and exhibitions",
      date: "Jan 5, 2025",
      location: "University Square",
      attendees: 200,
      image: "/placeholder.svg?height=100&width=200",
      status: "past",
    },
  ],
  organized: [
    {
      id: "3",
      title: "Coding Workshop",
      description: "Learn the basics of web development in this hands-on workshop",
      date: "Nov 10, 2025",
      location: "Computer Lab 3",
      attendees: 30,
      image: "/placeholder.svg?height=100&width=200",
      status: "upcoming",
    },
  ],
}

export default function ProfileEvents() {
  const [events, setEvents] = useState(mockEvents)

  return (
    <Tabs defaultValue="attending" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="attending">Attending</TabsTrigger>
        <TabsTrigger value="organized">Organized</TabsTrigger>
      </TabsList>
      <TabsContent value="attending" className="mt-6">
        <div className="grid gap-4">
          {events.attending.length > 0 ? (
            events.attending.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <EmptyState message="You haven't registered for any events yet." />
          )}
        </div>
      </TabsContent>
      <TabsContent value="organized" className="mt-6">
        <div className="grid gap-4">
          {events.organized.length > 0 ? (
            events.organized.map((event) => <EventCard key={event.id} event={event} isOrganizer />)
          ) : (
            <EmptyState message="You haven't organized any events yet." />
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}

function EventCard({ event, isOrganizer = false }) {
  return (
    <Card>
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-40 w-full sm:h-auto sm:w-48">
          <Image src={event.image || "/placeholder.svg"} alt={event.title} className="object-cover" fill />
        </div>
        <div className="flex flex-1 flex-col">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription className="mt-1">{event.description}</CardDescription>
              </div>
              <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>
                {event.status === "upcoming" ? "Upcoming" : "Past"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-2 h-4 w-4" />
                {event.date}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="mr-2 h-4 w-4" />
                {event.location}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="mr-2 h-4 w-4" />
                {event.attendees} attendees
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            {isOrganizer ? (
              <Button variant="outline">Manage Event</Button>
            ) : (
              <Button variant="outline">
                View Details
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <Calendar className="mb-2 h-10 w-10 text-gray-400" />
      <p className="text-gray-500">{message}</p>
      <Button variant="outline" className="mt-4">
        Browse Events
      </Button>
    </div>
  )
}
