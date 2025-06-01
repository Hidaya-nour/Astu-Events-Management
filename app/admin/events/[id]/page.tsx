"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, MapPin, Share, Users } from "lucide-react"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

interface Event {
  id: string
  title: string
  description: string
  longDescription?: string
  date: string
  time: string
  duration?: string
  location: string
  address?: string
  category: string
  image?: string
  capacity: number
  registrations: number
  registrationDeadline?: string
  organizer?: string
  contactEmail?: string
  sponsors?: string[]
  schedule?: Array<{
    time: string
    title: string
    description: string
    speaker?: string
  }>
  isRegistered?: boolean
  registrationStatus?: "PENDING" | "CONFIRMED" | "CANCELLED" | "WAITLISTED"
}

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoadingEvent, setIsLoadingEvent] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch event')
        }
        const data = await response.json()
        setEvent(data)
      } catch (error) {
        toast.error('Failed to load event details')
        router.push('/events')
      } finally {
        setIsLoadingEvent(false)
      }
    }

    fetchEvent()
  }, [params.id, router])

  const handleRegister = async () => {
    if (!event) return
    setIsLoading(true)

    try {
      const response = await fetch(`/api/registration/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register for event')
      }

      toast.success(data.message || 'Successfully registered for event')
      router.push("/dashboard/student")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register for event')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingEvent) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <DashboardLayout
      appName="ASTU Events"
      appLogo="/placeholder.svg?height=32&width=32"
      helpText="Need Assistance?"
      helpLink="/dashboard/organizer/support"
    >        <div className="flex flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-bold">Event not found</h2>
          <Button onClick={() => router.back()}>Back to Events</Button>
        </div>
    </DashboardLayout>    )
  }

  return (
    <DashboardLayout
    appName="ASTU Events"
    appLogo="/placeholder.svg?height=32&width=32"
    helpText="Need Assistance?"
    helpLink="/dashboard/organizer/support"
  >      <div className="mb-6 flex items-center">
        <Link href="/events" className="mr-4 text-primary-600 hover:text-primary-800">
          <ArrowLeft className="h-5 w-5"  onClick={() => router.back()} />
          <span className="sr-only">Back to events</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Details</h1>
          <p className="text-gray-500">View information and register for this event.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="relative h-64 w-full md:h-80">
              <Image
                src={event.image || "/placeholder.svg?height=400&width=800"}
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary-600 text-white">{event.category}</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl text-primary-800">{event.title}</CardTitle>
              <CardDescription className="flex items-center text-gray-500">
                <Calendar className="mr-2 h-4 w-4" />
                {event.date} | {event.time}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center text-gray-500">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Users className="mr-2 h-4 w-4" />
                  <span>
                    {event.registrations}/{event.capacity} Registered
                  </span>
                </div>
                {event.duration && (
                  <div className="flex items-center text-gray-500">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{event.duration}</span>
                  </div>
                )}
              </div>

              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  {event.schedule && <TabsTrigger value="schedule">Schedule</TabsTrigger>}
                  <TabsTrigger value="organizers">Organizers</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <p className="text-gray-600">{event.description}</p>
                    {event.longDescription && (
                      <p className="text-gray-600">{event.longDescription}</p>
                    )}
                  </div>
                </TabsContent>
                {event.schedule && (
                  <TabsContent value="schedule" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      {event.schedule.map((item, index) => (
                        <div key={index} className="flex border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                          <div className="mr-4 text-right">
                            <div className="font-medium text-gray-900">{item.time}</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                            {item.speaker && (
                              <div className="mt-1 text-sm text-primary-600">
                                Speaker: {item.speaker}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}
                <TabsContent value="organizers" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    {event.organizer && (
                      <p className="text-gray-600">
                        <span className="font-medium">Organized by:</span> {event.organizer}
                      </p>
                    )}
                    {event.contactEmail && (
                      <p className="text-gray-600">
                        <span className="font-medium">Contact:</span> {event.contactEmail}
                      </p>
                    )}
                    {event.sponsors && event.sponsors.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-900">Sponsors:</p>
                        <ul className="mt-2 list-disc pl-5 text-gray-600">
                          {event.sponsors.map((sponsor, index) => (
                            <li key={index}>{sponsor}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 text-sm font-medium text-gray-500">Registration Status</div>
                <div className="text-lg font-bold text-green-600">
                  {event.isRegistered ? (
                    <span className="capitalize">{event.registrationStatus?.toLowerCase()}</span>
                  ) : (
                    "Open"
                  )}
                </div>
                {event.registrationDeadline && (
                  <div className="mt-1 text-xs text-gray-500">
                    Closes on {event.registrationDeadline}
                  </div>
                )}
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 text-sm font-medium text-gray-500">Available Spots</div>
                <div className="text-lg font-bold text-gray-900">
                  {event.capacity - event.registrations} / {event.capacity}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {Math.round(((event.capacity - event.registrations) / event.capacity) * 100)}% available
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              <Button
                className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                onClick={handleRegister}
                disabled={isLoading || event.isRegistered}
              >
                {isLoading
                  ? "Processing..."
                  : event.isRegistered
                  ? "Already Registered"
                  : "Register Now"}
              </Button>
              <Button variant="outline" className="w-full border-gray-200">
                <Share className="mr-2 h-4 w-4" />
                Share Event
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>Event venue details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Event location map"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <div className="font-medium text-gray-900">{event.location}</div>
                {event.address && <div className="text-sm text-gray-500">{event.address}</div>}
                <Button
                  variant="outline"
                  className="mt-2 w-full border-primary-600 text-primary-600 hover:bg-primary-50"
                >
                  Get Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
</DashboardLayout>  )
}
