"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users, X, CheckCircle, AlertCircle, ClockIcon } from "lucide-react"

interface RegistrationCardProps {
  registration: {
    id: string
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "WAITLISTED"
    event: {
      id: string
      title: string
      description: string
      date: string
      time: string
      location: string
      organizer: string
      organizerAvatar?: string
      attendees: number
      maxAttendees?: number
      category: string
      image: string
    }
  }
  onCancel?: (registrationId: string) => void
  onView?: (eventId: string) => void
}

export function RegistrationCard({ registration, onCancel, onView }: RegistrationCardProps) {
  const { event } = registration

  const getStatusIcon = () => {
    switch (registration.status) {
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "CANCELLED":
        return <X className="h-4 w-4 text-red-600" />
      case "WAITLISTED":
        return <ClockIcon className="h-4 w-4 text-orange-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = () => {
    switch (registration.status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200"
      case "WAITLISTED":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const isPastEvent = new Date(event.date) < new Date()

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <Badge className="absolute top-2 left-2" variant="secondary">
            {event.category}
          </Badge>
          <Badge className={`absolute top-2 right-2 ${getStatusColor()} flex items-center gap-1`}>
            {getStatusIcon()}
            {registration.status}
          </Badge>
          {isPastEvent && <Badge className="absolute bottom-2 left-2 bg-gray-100 text-gray-800">Past Event</Badge>}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{event.date}</span>
            <Clock className="h-4 w-4 text-muted-foreground ml-2" />
            <span>{event.time}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{event.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={event.organizerAvatar || "/placeholder.svg"} />
                <AvatarFallback>{event.organizer.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{event.organizer}</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {event.attendees}
                {event.maxAttendees ? `/${event.maxAttendees}` : ""}
              </span>
            </div>
          </div>
        </div>

        {registration.status === "WAITLISTED" && (
          <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
            You're on the waitlist. You'll be notified if a spot becomes available.
          </div>
        )}

        {registration.status === "PENDING" && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
            Your registration is pending approval from the organizer.
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onView?.(event.id)} className="flex-1">
          View Event
        </Button>
        {registration.status !== "CANCELLED" && !isPastEvent && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCancel?.(registration.id)}
            className="text-red-600 hover:text-red-700"
          >
            Cancel Registration
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
