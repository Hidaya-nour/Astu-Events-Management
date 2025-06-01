"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Eye } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from 'react-toastify'
interface Event {
  id: string
  title: string
  date: Date
  time: string
  location: string
  category: string
  organizer: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: Date
}

export function AdminPendingApprovals() {
  const [pendingEvents, setPendingEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [approvedEvents, setApprovedEvents] = useState<string[]>([])
  const [rejectedEvents, setRejectedEvents] = useState<string[]>([])

  useEffect(() => {
    const fetchPendingEvents = async () => {
      try {
        const response = await fetch('/api/events?status=PENDING&sort=newest')
        if (!response.ok) {
          throw new Error('Failed to fetch pending events')
        }
        const data = await response.json()
        setPendingEvents(data.events.map((event: any) => ({
          ...event,
          date: new Date(event.date),
          createdAt: new Date(event.createdAt)
        })))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pending events')
      } finally {
        setLoading(false)
      }
    }

    fetchPendingEvents()
  }, [])



const handleApprove = async (eventId: string) => {
  try {
    const response = await fetch(`/api/events/${eventId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to approve event')
    }

    toast.success('Event approved successfully')
    setApprovedEvents((prev) => [...prev, eventId])
    setRejectedEvents((prev) => prev.filter((id) => id !== eventId))
    setPendingEvents((prev) => prev.filter((event) => event.id !== eventId))
  } catch (err) {
    console.error('Error approving event:', err)
    toast.error(err instanceof Error ? err.message : 'Failed to approve event')
  }
}

const handleReject = async (eventId: string) => {
  try {
    const response = await fetch(`/api/events/${eventId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ approvalStatus: 'REJECTED' }),
    })

    if (!response.ok) {
      throw new Error('Failed to reject event')
    }

    toast.success('Event rejected successfully')
    setRejectedEvents((prev) => [...prev, eventId])
    setApprovedEvents((prev) => prev.filter((id) => id !== eventId))
    setPendingEvents((prev) => prev.filter((event) => event.id !== eventId))
  } catch (err) {
    console.error('Error rejecting event:', err)
    toast.error('Failed to reject event')
  }
}


  const getCategoryBadge = (category: string) => {
    const categories: Record<string, { bg: string; text: string }> = {
      TECHNOLOGY: { bg: "bg-blue-100", text: "text-blue-800" },
      WORKSHOP: { bg: "bg-purple-100", text: "text-purple-800" },
      COMPETITION: { bg: "bg-orange-100", text: "text-orange-800" },
      CAREER: { bg: "bg-green-100", text: "text-green-800" },
      ACADEMIC: { bg: "bg-indigo-100", text: "text-indigo-800" },
      CULTURAL: { bg: "bg-pink-100", text: "text-pink-800" },
      SPORTS: { bg: "bg-red-100", text: "text-red-800" },
      SEMINAR: { bg: "bg-yellow-100", text: "text-yellow-800" },
      CONFERENCE: { bg: "bg-teal-100", text: "text-teal-800" },
    }

    const style = categories[category] || { bg: "bg-gray-100", text: "text-gray-800" }

    return (
      <Badge className={`${style.bg} ${style.text} hover:${style.bg}`}>
        {category.charAt(0) + category.slice(1).toLowerCase().replace("_", " ")}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
        <p className="mt-2 text-muted-foreground">Loading pending events...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-red-600">Error</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {pendingEvents.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-medium">All caught up!</h3>
          <p className="text-muted-foreground">There are no events pending approval.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingEvents.map((event) => (
            <div
              key={event.id}
              className={`border rounded-lg p-4 ${
                approvedEvents.includes(event.id)
                  ? "border-green-500 bg-green-50"
                  : rejectedEvents.includes(event.id)
                    ? "border-red-500 bg-red-50"
                    : ""
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium">{event.title}</h4>
                {getCategoryBadge(event.category)}
              </div>

              <div className="space-y-1 mb-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{format(event.date, "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} alt={event.organizer.name} />
                  <AvatarFallback>
                    {event.organizer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">{event.organizer.name}</div>
              </div>

              <div className="flex justify-between items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/events/${event.id}`}>
                          <Eye className="h-4 w-2 mr-1" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View event details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={approvedEvents.includes(event.id) ? "default" : "outline"}
                          size="sm"
                          className={approvedEvents.includes(event.id) ? "bg-green-600" : ""}
                          onClick={() => handleApprove(event.id)}
                        >
                          <CheckCircle className="h-4 w-2 mr-1" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Approve this event</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={rejectedEvents.includes(event.id) ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => handleReject(event.id)}
                        >
                          <XCircle className="h-4 w-2 mr-1" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reject this event</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingEvents.length > 0 && (
        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/admin/events?status=PENDING">View All Pending Events</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
