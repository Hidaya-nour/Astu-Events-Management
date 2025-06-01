"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, XCircle, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface Registration {
  id: string
  status: string
  createdAt: string
  event: {
    id: string
    title: string
    description: string
    date: string
    startTime: string
    endTime?: string
    location: string
    venue?: string
    category: string
    capacity: number
    _count?: {
      registrations: number
    }
    images?: string[]
  }
}

interface StudentRegistrationsListProps {
  registrations: Registration[]
  onCancelRegistration: (registrationId: string) => void
  showFeedbackButton?: boolean
  showCancelButton?: boolean
}

export function StudentRegistrationsList({
  registrations,
  onCancelRegistration,
  showFeedbackButton = false,
  showCancelButton = true,
}: StudentRegistrationsListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "CANCELLED":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cancelled</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
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

    return (
      <Badge className={categories[category] || "bg-gray-100 text-gray-800 hover:bg-gray-100"}>
        {category.charAt(0) + category.slice(1).toLowerCase()}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      {registrations.map((registration) => (
        <Card key={registration.id}>
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row gap-4 p-6">
              <div className="h-24 w-24 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                <img
                  src={registration.event.images?.[0] || "/placeholder.svg?height=96&width=96"}
                  alt={registration.event.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">
                    <Link href={`/student/events/${registration.event.id}`} className="hover:underline">
                      {registration.event.title}
                    </Link>
                  </h3>
                  {getStatusBadge(registration.status)}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(registration.event.date), "MMM d, yyyy")}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {registration.event.startTime}
                    {registration.event.endTime && ` - ${registration.event.endTime}`}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {registration.event.venue || registration.event.location}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {getCategoryBadge(registration.event.category)}
                  <Badge variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    {registration.event._count?.registrations || 0}/{registration.event.capacity}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-2 justify-end">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/student/events/${registration.event.id}`}>View Details</Link>
                </Button>

                {showFeedbackButton && registration.status === "CONFIRMED" && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/student/events/${registration.event.id}/feedback`}>
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Give Feedback
                    </Link>
                  </Button>
                )}

                {showCancelButton && registration.status !== "CANCELLED" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => onCancelRegistration(registration.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
