"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users, Heart, Loader2 } from "lucide-react"
import { EventStatusBadge } from "@/components/student/event-status-badge"
import { RelevanceBadge } from "@/components/student/relevance-badge"
import { useState } from "react"

interface EnhancedEventCardProps {
  event: {
    id: string
    title: string
    description: string
    date: string
    time: string
    location: string
    venue?: string
    organizer: string
    organizerAvatar?: string
    attendees: number
    maxAttendees?: number
    category: string
    department?: string
    year?: number
    image: string
    registrationStatus: "REGISTERED" | "WAITLISTED" | "PENDING" | "NOT_REGISTERED" | "EXPIRED"
    registrationDeadline?: string
    eventType: "IN_PERSON" | "ONLINE" | "HYBRID"
    relevance?: Array<"DEPARTMENT" | "YEAR" | "RECOMMENDED">
    isFavorite?: boolean
  }
  onRegister?: (eventId: string) => void
  onUnregister?: (eventId: string) => void
  onFavorite?: (eventId: string, isFavorite: boolean) => void
}

export function EnhancedEventCard({ event, onRegister, onUnregister, onFavorite }: EnhancedEventCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isRegistered =
    event.registrationStatus === "REGISTERED" ||
    event.registrationStatus === "WAITLISTED" ||
    event.registrationStatus === "PENDING"
  const isPastDeadline = event.registrationStatus === "EXPIRED"
  const isRelevant = event.relevance && event.relevance.length > 0

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "ONLINE":
        return "🌐"
      case "HYBRID":
        return "🔄"
      default:
        return "📍"
    }
  }

  const handleActionClick = async () => {
    try {
      setIsLoading(true)
      if (isRegistered) {
        await onUnregister?.(event.id)
      } else if (!isPastDeadline) {
        await onRegister?.(event.id)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getActionButtonText = () => {
    if (isLoading) return "Processing..."
    if (event.registrationStatus === "REGISTERED") return "Registered"
    if (event.registrationStatus === "WAITLISTED") return "Waitlisted"
    if (event.registrationStatus === "PENDING") return "Pending"
    if (event.registrationStatus === "EXPIRED") return "Registration Closed"
    return "Register"
  }

  const getActionButtonVariant = () => {
    if (isRegistered) return "outline"
    if (isPastDeadline) return "ghost"
    return "default"
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow ${isRelevant ? "ring-2 ring-blue-200" : ""}`}>
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Badge variant="secondary">{event.category}</Badge>
            {event.department && (
              <Badge variant="outline" className="bg-white/90">
                {event.department}
              </Badge>
            )}
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
              onClick={() => onFavorite?.(event.id, !event.isFavorite)}
            >
              <Heart className={`h-4 w-4 ${event.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
            <Badge variant="outline" className="bg-white/90">
              {getEventTypeIcon(event.eventType)} {event.eventType.replace("_", " ")}
            </Badge>
            <EventStatusBadge status={event.registrationStatus} className="bg-white/90" />
          </div>
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
            {event.venue && <span className="text-muted-foreground">• {event.venue}</span>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={event.organizerAvatar || "/placeholder.svg"} />
                {/* <AvatarFallback>{event.organizer.charAt(0)}</AvatarFallback> */}
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

          {event.registrationDeadline && (
            <div className="text-xs text-muted-foreground">Registration deadline: {event.registrationDeadline}</div>
          )}

          {event.relevance && event.relevance.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {event.relevance.map((type) => (
                <RelevanceBadge key={type} type={type} />
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          variant={getActionButtonVariant()}
          onClick={handleActionClick}
          disabled={isPastDeadline || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            getActionButtonText()
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
