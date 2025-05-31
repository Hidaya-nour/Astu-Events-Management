"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Share2, Users, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { mockEvents } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import Link from "next/link"

export default function EventPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [isRegistering, setIsRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Find the event from mock data
  const event = mockEvents.find((e) => e.id === params.id)

  // If event not found, show 404
  if (!event) {
    notFound()
  }

  const eventDate = new Date(event.date)
  const isPastEvent = eventDate < new Date()

  const handleRegister = async () => {
    setIsRegistering(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsRegistered(true)
    setIsRegistering(false)

    toast({
      title: "Registration successful",
      description: "You have successfully registered for this event.",
    })
  }

  const handleSave = () => {
    setIsSaved(!isSaved)

    toast({
      title: isSaved ? "Event removed" : "Event saved",
      description: isSaved
        ? "Event has been removed from your saved events."
        : "Event has been added to your saved events.",
    })
  }

  const handleShare = () => {
    // Copy the current URL to clipboard
    navigator.clipboard.writeText(window.location.href)

    toast({
      title: "Link copied",
      description: "Event link has been copied to clipboard.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/events" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Events
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-6 overflow-hidden rounded-lg">
            <img
              src={event.image || "/placeholder.svg?height=400&width=800"}
              alt={event.title}
              className="h-[400px] w-full object-cover"
            />
          </div>

          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <Badge>{event.category}</Badge>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant={isSaved ? "default" : "outline"} size="sm" onClick={handleSave}>
                  <Heart className={`mr-2 h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                  {isSaved ? "Saved" : "Save"}
                </Button>
              </div>
            </div>

            <h1 className="mb-2 text-3xl font-bold">{event.title}</h1>
            <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
          </div>

          <div className="mb-8 space-y-6">
            <h2 className="text-xl font-semibold">Event Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start rounded-lg border p-4">
                <Calendar className="mr-3 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {eventDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start rounded-lg border p-4">
                <Clock className="mr-3 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-gray-600 dark:text-gray-300">{event.time || "6:00 PM - 9:00 PM"}</p>
                </div>
              </div>

              <div className="flex items-start rounded-lg border p-4">
                <MapPin className="mr-3 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-gray-600 dark:text-gray-300">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start rounded-lg border p-4">
                <Users className="mr-3 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Capacity</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {event.attendees}/{event.capacity} registered
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">About This Event</h2>
            <div className="prose max-w-none dark:prose-invert">
              <p>
                Join us for an exciting event at Adama Science and Technology University! This {event.category} event
                will feature engaging activities, networking opportunities, and valuable insights for all attendees.
              </p>
              <p>
                Whether you're a student, faculty member, or community member, this event offers something for everyone.
                Don't miss out on this opportunity to connect with others and expand your knowledge.
              </p>
              <h3>What to Expect</h3>
              <ul>
                <li>Interactive sessions with industry experts</li>
                <li>Networking opportunities with peers and professionals</li>
                <li>Hands-on workshops and demonstrations</li>
                <li>Refreshments and snacks provided</li>
              </ul>
              <p>
                Make sure to bring your student ID and any necessary materials. We look forward to seeing you there!
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="sticky top-8 space-y-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Registration</h3>

              {isPastEvent ? (
                <div className="rounded-lg bg-gray-100 p-4 text-center dark:bg-gray-800">
                  <p className="font-medium text-gray-600 dark:text-gray-300">This event has already taken place.</p>
                </div>
              ) : isRegistered ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
                    <p className="font-medium text-green-600 dark:text-green-400">You're registered for this event!</p>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => setIsRegistered(false)}>
                    Cancel Registration
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">{event.capacity - event.attendees} spots remaining</p>
                  <Button className="w-full" onClick={handleRegister} disabled={isRegistering}>
                    {isRegistering ? "Registering..." : "Register Now"}
                  </Button>
                </div>
              )}
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Organizer</h3>
              <div className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Organizer" />
                  <AvatarFallback>ORG</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="font-medium">{event.organizer || "ASTU Events Team"}</p>
                  <p className="text-sm text-gray-500">Event Organizer</p>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Contact Organizer
              </Button>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Attendees</h3>
              <div className="flex -space-x-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Avatar key={i} className="border-2 border-background">
                      <AvatarImage
                        src={`/placeholder.svg?height=32&width=32&text=${i + 1}`}
                        alt={`Attendee ${i + 1}`}
                      />
                      <AvatarFallback>{i + 1}</AvatarFallback>
                    </Avatar>
                  ))}
                {event.attendees > 5 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-gray-100 text-xs font-medium dark:bg-gray-800">
                    +{event.attendees - 5}
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">{event.attendees} people are attending this event</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
