"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock, MapPin, Users, User, Tag, AlertCircle, CheckCircle, XCircle, Star, StarOff, Pencil } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

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
  featured?: boolean
  organizer?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  createdAt?: string
  updatedAt?: string
  _count?: {
    registrations: number
  }
}

interface ViewEventDetailsProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  onEdit: (eventId: string) => void
  onDelete: (eventId: string) => void
  onApprove?: (eventId: string) => void
  onReject?: (eventId: string) => void
  onFeature?: (eventId: string, featured: boolean) => void
}

export function ViewEventDetails({
  event,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onFeature
}: ViewEventDetailsProps) {
  const [activeTab, setActiveTab] = useState("details")

  if (!event) return null

  const attendeeCount = event._count?.registrations || 0
  const attendancePercentage = event.capacity > 0 ? (attendeeCount / event.capacity) * 100 : 0

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
    if (!category) {
      return <Badge variant="outline">Uncategorized</Badge>
    }

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

  const formatStatus = (status: string) => {
    if (!status) return 'Unknown Status';
    return status.charAt(0) + status.slice(1).toLowerCase();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{event.title}</span>
            <div className="flex items-center gap-2">
              {getStatusBadge(event.approvalStatus)}
              {event.featured && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3 mr-1 fill-yellow-500" /> Featured
                </Badge>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            Event ID: {event.id}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Date</div>
                      <div className="text-sm text-muted-foreground">
                        {(() => {
                          try {
                            if (!event.date) return 'No date set';
                            // Handle different date formats
                            const dateStr = event.date.includes('T') ? event.date : `${event.date}T00:00:00`;
                            const date = new Date(dateStr);
                            if (isNaN(date.getTime())) return 'Invalid date';
                            return format(date, "EEEE, MMMM d, yyyy");
                          } catch (error) {
                            console.error('Date formatting error:', error);
                            return 'Invalid date';
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Time</div>
                      <div className="text-sm text-muted-foreground">
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-sm text-muted-foreground">
                        {event.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Tag className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Category & Type</div>
                      <div className="flex gap-2 mt-1">
                        {getCategoryBadge(event.category)}
                        <Badge variant="outline">{event.eventType}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Attendance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Registered</span>
                    <span className="font-medium">{attendeeCount} / {event.capacity}</span>
                  </div>
                  <Progress value={attendancePercentage} className="h-2" />
                  
                  <div className="pt-2">
                    <div className="font-medium">Capacity</div>
                    <div className="text-sm text-muted-foreground">
                      {event.capacity} attendees maximum
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line">{event.description}</p>
              </CardContent>
            </Card>
            
            {event.organizer && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Organizer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {event.organizer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{event.organizer.name}</div>
                      <div className="text-sm text-muted-foreground">{event.organizer.email}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="attendees">
            <Card>
              <CardHeader>
                <CardTitle>Attendees</CardTitle>
                <CardDescription>
                  {attendeeCount} {attendeeCount === 1 ? 'person' : 'people'} registered for this event
                </CardDescription>
              </CardHeader>
              <CardContent>
                {attendeeCount > 0 ? (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">View Attendee List</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click the button below to view and manage attendees
                    </p>
                    <Button className="mt-4">Manage Attendees</Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-2 text-lg font-medium">No Attendees Yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This event doesn't have any registered attendees
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Event History</CardTitle>
                <CardDescription>
                  Timeline of changes and updates to this event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {event.createdAt && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div className="flex-1 h-full w-px bg-border mt-2"></div>
                      </div>
                      <div>
                        <div className="font-medium">Event Created</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(event.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {event.updatedAt && event.updatedAt !== event.createdAt && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                          <Pencil className="h-4 w-4" />
                        </div>
                        <div className="flex-1 h-full w-px bg-border mt-2"></div>
                      </div>
                      <div>
                        <div className="font-medium">Event Updated</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(event.updatedAt), "MMMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        event.approvalStatus === "APPROVED" 
                          ? "bg-green-100 text-green-800" 
                          : event.approvalStatus === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {event.approvalStatus === "APPROVED" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : event.approvalStatus === "REJECTED" ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">
                        Event {formatStatus(event.approvalStatus)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Current status of the event
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex gap-2 order-2 sm:order-1">
            {event.approvalStatus === "PENDING" && onApprove && onReject && (
              <>
                <Button 
                  variant="outline" 
                  className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                  onClick={() => onApprove(event.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                  onClick={() => onReject(event.id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
            {onFeature && (
              <Button 
                variant="outline" 
                onClick={() => onFeature(event.id, !event.featured)}
              >
                {event.featured ? (
                  <>
                    <StarOff className="h-4 w-4 mr-2" />
                    Unfeature
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Feature
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-end order-1 sm:order-2">
            <Button 
              variant="outline" 
              onClick={() => onEdit(event.id)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => onDelete(event.id)}
            >
              Delete
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
