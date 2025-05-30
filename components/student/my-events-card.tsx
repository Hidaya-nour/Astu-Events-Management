"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Eye, AlertCircle, CheckCircle, XCircle } from "lucide-react"

interface MyEventCardProps {
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
    approvalStatus: "PENDING" | "APPROVED" | "REJECTED"
    isPublic: boolean
  }
  onEdit?: (eventId: string) => void
  onDelete?: (eventId: string) => void
  onView?: (eventId: string) => void
}

export function MyEventCard({ event, onEdit, onDelete, onView }: MyEventCardProps) {
  const getStatusIcon = () => {
    switch (event.approvalStatus) {
      case "APPROVED":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = () => {
    switch (event.approvalStatus) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200"
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

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
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge className={`${getStatusColor()} flex items-center gap-1`}>
              {getStatusIcon()}
              {event.approvalStatus}
            </Badge>
            {!event.isPublic && (
              <Badge variant="outline" className="bg-white/90">
                Private
              </Badge>
            )}
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

        {event.approvalStatus === "REJECTED" && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            Your event was rejected. Please review and resubmit with necessary changes.
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onView?.(event.id)} className="flex-1">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        {event.approvalStatus !== "APPROVED" && (
          <Button variant="outline" size="sm" onClick={() => onEdit?.(event.id)} className="flex-1">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete?.(event.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
