"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Mail, Phone, ArrowLeft, Share2, Heart } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { format } from "date-fns"

interface EventDetails {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime?: string
  location: string
  venue?: string
  category: string
  eventType: string
  capacity: number
  departmentId?: string
  department?: string
  registrationDeadline?: string
  contactEmail?: string
  contactPhone?: string
  tags?: string[]
  images?: string[]
  organizer: {
    id: string
    name: string
    avatar?: string
  }
  _count?: {
    registrations: number
  }
}

export default function EventDetailsPage() {
  const params = useParams()
  const eventId = params.id as string

  const [event, setEvent] = useState<EventDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [registering, setRegistering] = useState(false)

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true)

        const response = await fetch(`/api/events/${eventId}`)

        if (!response.ok) {
          throw new Error(`Error fetching event details: ${response.status}`)
        }

        const data = await response.json()
        setEvent(data.event)
      } catch (error) {
        console.error("Error fetching event details:", error)
        setError(error instanceof Error ? error.message : "An error occurred while fetching event details")
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchEventDetails()
    }
  }, [eventId])

  const handleRegister = async () => {
    try {
      setRegistering(true)

      // Make API call to register for the event
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`Error registering for event: ${response.status}`)
      }

      // Update local state to reflect registration
      if (event && event._count) {
        setEvent({
          ...event,
          _count: {
            ...event._count,
            registrations: (event._count.registrations || 0) + 1,
          },
        })
      }

      // Show success message
      alert("You have successfully registered for this event!")
    } catch (error) {
      console.error("Error registering for event:", error)
      alert(error instanceof Error ? error.message : "An error occurred while registering")
    } finally {
      setRegistering(false)
    }
  }

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

  const getEventTypeLabel = (eventType: string) => {
    switch (eventType) {
      case "ONLINE":
        return "Online"
      case "HYBRID":
        return "Hybrid"
      default:
        return "In Person"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/student/events">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Events
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-40 w-full" />
            </div>

            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/student/events">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Events
          </Link>
        </Button>

        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              <p>Failed to load event details</p>
              <p className="text-sm">{error || "Event not found"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/student/events">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Events
          </Link>
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge className={getCategoryBadge(event.category)}>
              {event.category.charAt(0) + event.category.slice(1).toLowerCase()}
            </Badge>
            <Badge variant="outline">{getEventTypeLabel(event.eventType)}</Badge>
            {event.tags &&
              event.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <div className="h-[300px] w-full bg-muted">
                <img
                  src="/placeholder.svg?height=300&width=800"
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="agenda">Agenda</TabsTrigger>
                  <TabsTrigger value="speakers">Speakers</TabsTrigger>
                  <TabsTrigger value="attendees">Attendees</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">About This Event</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>

                    {event.department && (
                      <div>
                        <h4 className="font-medium mt-4">Organized by</h4>
                        <p>{event.department}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="agenda" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Event Agenda</h3>
                    <p className="text-muted-foreground">Agenda details will be provided closer to the event date.</p>
                  </div>
                </TabsContent>

                <TabsContent value="speakers" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Event Speakers</h3>
                    <p className="text-muted-foreground">Speaker information will be announced soon.</p>
                  </div>
                </TabsContent>

                <TabsContent value="attendees" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Registered Attendees</h3>
                    <p className="text-muted-foreground">Attendee list is only visible to event organizers.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Date</div>
                    <div className="text-muted-foreground">{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Time</div>
                    <div className="text-muted-foreground">
                      {event.startTime} {event.endTime && `- ${event.endTime}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-muted-foreground">
                      {event.location}
                      {event.venue && <div>{event.venue}</div>}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Capacity</div>
                    <div className="text-muted-foreground">
                      {event._count?.registrations || 0} / {event.capacity} registered
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${((event._count?.registrations || 0) / event.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {event.registrationDeadline && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Registration Deadline</div>
                      <div className="text-muted-foreground">
                        {format(new Date(event.registrationDeadline), "MMMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleRegister} disabled={registering}>
                  {registering ? "Registering..." : "Register for Event"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organizer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} alt={event.organizer.name} />
                    <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{event.organizer.name}</div>
                    {event.department && <div className="text-sm text-muted-foreground">{event.department}</div>}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  {event.contactEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.contactEmail}</span>
                    </div>
                  )}

                  {event.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.contactPhone}</span>
                    </div>
                  )}
                </div>

                {(event.contactEmail || event.contactPhone) && (
                  <Button variant="outline" className="w-full text-sm">
                    Contact Organizer
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
