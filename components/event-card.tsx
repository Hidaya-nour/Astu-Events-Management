import { Calendar, MapPin, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string
    date: string
    location: string
    category: string
    image?: string
    attendees: number
    capacity: number
  }
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date)
  const isPastEvent = eventDate < new Date()

  return (
    <div className="overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md">
      <div className="relative">
        <img
          src={event.image || "/placeholder.svg?height=200&width=400"}
          alt={event.title}
          className="h-48 w-full object-cover"
        />
        <Badge className="absolute right-2 top-2" variant={isPastEvent ? "secondary" : "default"}>
          {isPastEvent ? "Past" : "Upcoming"}
        </Badge>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="outline">{event.category}</Badge>
          <span className="text-sm text-gray-500">
            {eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
        <h3 className="mb-2 line-clamp-1 text-xl font-semibold">{event.title}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-gray-500">{event.description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="mr-2 h-4 w-4" />
            {eventDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="mr-2 h-4 w-4" />
            {event.location}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="mr-2 h-4 w-4" />
            {event.attendees}/{event.capacity} registered
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button asChild variant="outline">
            <Link href={`/events/${event.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
