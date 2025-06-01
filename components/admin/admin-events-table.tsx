"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash2, Users, Eye, Copy, BarChart, Calendar, Clock, MapPin, Star, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import Link from "next/link"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import { ViewEventDetails } from "./view-events-details"
import { EditEventForm } from "./edit-event-form"
import { DeleteEventDialog } from "./delete-event-dialog"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Event {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  category: string
  eventType: string
  approvalStatus: string
  capacity: number
  _count?: {
    registrations: number
  }
}

interface FilterState {
  status: {
    approved: boolean
    pending: boolean
    rejected: boolean
    cancelled: boolean
  }
  categories: {
    technology: boolean
    workshop: boolean
    competition: boolean
    career: boolean
    academic: boolean
    cultural: boolean
    sports: boolean
    Academic: boolean
    Seminar: boolean
    Conference: boolean
    Workshop: boolean
  }
  
  organizer: string
  timePeriod: string
  dateRange: {
    from?: Date
    to?: Date
  }
  featured: {
    featured: boolean
    notFeatured: boolean
  }
}

interface AdminEventsTableProps {
  searchQuery: string
  sortBy: string
  filters: FilterState
}

export function AdminEventsTable({ searchQuery, sortBy, filters }: AdminEventsTableProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalEvents, setTotalEvents] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const eventsPerPage = 10

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams()
        if (searchQuery) {
          queryParams.append('search', searchQuery)
        }
        if (sortBy) {
          queryParams.append('sort', sortBy)
        }

        // Add filter parameters
        const statusFilters = Object.entries(filters.status)
          .filter(([_, value]) => value)
          .map(([key]) => key.toUpperCase())
        if (statusFilters.length > 0) {
          queryParams.append('status', statusFilters.join(','))
        }

        const categoryFilters = Object.entries(filters.categories)
          .filter(([_, value]) => value)
          .map(([key]) => key.toUpperCase())
        if (categoryFilters.length > 0) {
          queryParams.append('category', categoryFilters.join(','))
        }

        if (filters.organizer !== 'all') {
          queryParams.append('organizer', filters.organizer)
        }

        if (filters.timePeriod !== 'all') {
          queryParams.append('timePeriod', filters.timePeriod)
        }

        if (filters.dateRange.from) {
          queryParams.append('startDate', filters.dateRange.from.toISOString())
        }
        if (filters.dateRange.to) {
          queryParams.append('endDate', filters.dateRange.to.toISOString())
        }

        if (filters.featured.featured) {
          queryParams.append('featured', 'true')
        }
        if (filters.featured.notFeatured) {
          queryParams.append('featured', 'false')
        }
        const url = `/api/events?${queryParams.toString()}`;
        console.log("📡 Fetching events from:", url);
        
        const response = await fetch(`/api/events?${queryParams.toString()}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`)
        }
        const data = await response.json()
        setEvents(data.events)
        setTotalEvents(data.total || 0)
        setTotalPages(Math.ceil(data.total / eventsPerPage))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [searchQuery, sortBy, filters])

  const toggleEventSelection = (eventId: string) => {
    setSelectedEvents((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]))
  }

  const toggleAllEvents = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([])
    } else {
      setSelectedEvents(events.map((event) => event.id))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      case "CANCELLED":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    const categories: Record<string, { bg: string; text: string }> = {
      TECHNICAL: { bg: "bg-blue-100", text: "text-blue-800" },
      WORKSHOP: { bg: "bg-purple-100", text: "text-purple-800" },
      ACADEMIC: { bg: "bg-indigo-100", text: "text-indigo-800" },
      CULTURAL: { bg: "bg-pink-100", text: "text-pink-800" },
      SPORTS: { bg: "bg-red-100", text: "text-red-800" },
      OTHER: { bg: "bg-gray-100", text: "text-gray-800" },
    }

    const style = categories[category] || { bg: "bg-gray-100", text: "text-gray-800" }

    return (
      <Badge className={`${style.bg} ${style.text} hover:${style.bg}`}>
        {category.charAt(0) + category.slice(1).toLowerCase().replace("_", " ")}
      </Badge>
    )
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event)
    setViewDialogOpen(true)
  }

  const handleEditEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch event details')
      }
      const event = await response.json()
      setSelectedEvent(event)
      setEditDialogOpen(true)
    } catch (error) {
      console.error('Error fetching event:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to fetch event details. Please try again.')
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete event')
      }

      setEvents(events.filter(event => event.id !== eventId))
      toast.success('Event deleted successfully')
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete event. Please try again.')
    }
  }

  const handleEventUpdated = (updatedEvent: Event) => {
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event))
    setEditDialogOpen(false)
  }

  const handleEventDeleted = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId))
    setDeleteDialogOpen(false)
  }

  const handleSaveEvent = async (eventId: string, data: any) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update event')
      }

      const updatedEvent = await response.json()
      setEvents(events.map(event => 
        event.id === eventId ? updatedEvent : event
      ))
      
      toast.success('Event updated successfully')
      setEditDialogOpen(false)
    } catch (error) {
      console.error('Error updating event:', error)
      toast.error('Failed to update event. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="border rounded-lg">
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="border rounded-lg p-4">
          <div className="text-destructive text-center">
            <p>Failed to load events</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="space-y-4">
        <div className="border rounded-lg p-8">
          <div className="text-center text-muted-foreground">
            <p>No events found</p>
            <p className="text-sm">Try adjusting your search query</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {selectedEvents.length > 0 && (
        <div className="bg-muted p-2 rounded-md flex items-center justify-between">
          <span className="text-sm">
            {selectedEvents.length} event{selectedEvents.length > 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button size="sm" variant="outline">
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button size="sm" variant="outline">
              <Star className="h-4 w-4 mr-1" />
              Feature
            </Button>
            <Button size="sm" variant="outline" className="text-red-600">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedEvents.length === events.length && events.length > 0}
                  onCheckedChange={toggleAllEvents}
                  aria-label="Select all events"
                />
              </TableHead>
              <TableHead>Event</TableHead>
              <TableHead className="hidden md:table-cell">Date & Time</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Attendees</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedEvents.includes(event.id)}
                    onCheckedChange={() => toggleEventSelection(event.id)}
                    aria-label={`Select ${event.title}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{event.title}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col">
                    <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                    <span className="text-sm text-muted-foreground">
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{event.location}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {getCategoryBadge(event.category)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {getStatusBadge(event.approvalStatus)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{event._count?.registrations || 0} / {event.capacity}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewEvent(event)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditEvent(event.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Event
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        Manage Attendees
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{(currentPage - 1) * eventsPerPage + 1}</strong> to{" "}
          <strong>{Math.min(currentPage * eventsPerPage, totalEvents)}</strong> of{" "}
          <strong>{totalEvents}</strong> events
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <Button
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              </PaginationItem>
            ))}
            <PaginationItem>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* View Dialog */}
      <ViewEventDetails
        event={selectedEvent}
        isOpen={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onApprove={async (eventId) => {
          // Implement approve functionality
          const response = await fetch(`/api/events/${eventId}/approve`, {
            method: 'PUT',
          })
          if (response.ok) {
            const updatedEvent = await response.json()
            setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event))
          }
        }}
        onReject={async (eventId) => {
          // Implement reject functionality
          const response = await fetch(`/api/events/${eventId}/reject`, {
            method: 'PUT',
          })
          if (response.ok) {
            const updatedEvent = await response.json()
            setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event))
          }
        }}
        onFeature={async (eventId, featured) => {
          // Implement feature functionality
          const response = await fetch(`/api/events/${eventId}/feature`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ featured }),
          })
          if (response.ok) {
            const updatedEvent = await response.json()
            setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event))
          }
        }}
      />

      {/* Edit Dialog */}
      <EditEventForm
        event={selectedEvent}
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSaveEvent}
      />

      {/* Delete Dialog */}
      <DeleteEventDialog
        eventId={selectedEvent?.id || null}
        eventTitle={selectedEvent?.title}
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteEvent}
      />
    </div>
  )
}

