"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  ChevronLeft,
  Tag,
  Info,
  Star,
  MessageSquare,
  Download,
  CalendarPlus,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { toast } from "react-toastify"
import { FeedbackButton } from "@/components/feedback/feedback-button"


interface Organizer {
  id: string
  name: string
  department: string
  image?: string
}

interface Attendee {
  id: string
  name: string
  department?: string
  image?: string
}

interface Event {
  id: string
  title: string
  description: string
  longDescription?: string
  date: string
  startTime: string
  endTime?: string
  location: string
  venue?: string
  category: string
  capacity: number
  registeredCount: number
  image?: string
  tags?: string[]
  organizer: Organizer
  attendees?: Attendee[]
  isRegistered?: boolean
  registrationStatus?: string
  similarEvents?: Event[]
}

export default function EventDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [registering, setRegistering] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [feedbackStats, setFeedbackStats] = useState<{
    totalRatings: number
    averageRating: number
    helpfulCount: number
    helpfulPercentage: number
  } | null>(null)
  const [feedback, setFeedback] = useState<Array<{
    id: string
    rating: number
    feedback: string
    email?: string
    wasHelpful: boolean
    createdAt: Date
  }>>([])

  const fetchFeedback = async () => {
    try {
      const feedbackResponse = await fetch(`/api/feedback?eventId=${params.id}`)
      if (!feedbackResponse.ok) throw new Error("Failed to fetch feedback")
      const feedbackData = await feedbackResponse.json()
      setFeedbackStats(feedbackData.stats)
      setFeedback(feedbackData.feedback)
    } catch (err) {
      console.error("Error fetching feedback:", err)
    }
  }

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true)
        const [eventResponse, feedbackResponse] = await Promise.all([
          fetch(`/api/events/${params.id}`),
          fetch(`/api/feedback?eventId=${params.id}`)
        ])

        if (!eventResponse.ok) throw new Error("Failed to fetch event details")
        if (!feedbackResponse.ok) throw new Error("Failed to fetch feedback")

        const eventData = await eventResponse.json()
        const feedbackData = await feedbackResponse.json()

        setEvent(eventData)
        setFeedbackStats(feedbackData.stats)
        setFeedback(feedbackData.feedback)
      } catch (err) {
        setError("Failed to load event details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchEventDetails()
  }, [params.id])

  const handleRegister = async () => {
    try {
      setRegistering(true)
      // In a real application, you would call your API
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event?.id }),
      })
      if (!response.ok) throw new Error("Registration failed")

      // Update local state
      if (event) {
        setEvent({
          ...event,
          isRegistered: true,
          registrationStatus: "CONFIRMED",
          registeredCount: event.registeredCount + 1,
        })
      }

      toast.success("Registration Successfuly")
    } catch (err) {
      toast.error("Registration Failed")
    } finally {
      setRegistering(false)
    }
  }

  const handleCancelRegistration = async () => {
    try {
      setRegistering(true)
      const response = await fetch(`/api/events/register/${event?.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error("Cancellation failed")

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      if (event) {
        setEvent({
          ...event,
          isRegistered: false,
          registrationStatus: undefined,
          registeredCount: event.registeredCount - 1,
        })
      }

      toast.success("Registration Cancelled")
    } catch (err) {
      toast.error("Cancellation Failed")
    } finally {
      setRegistering(false)
    }
  }

  const handleAddToCalendar = () => {
    if (!event) return

    // Create calendar event details
    const title = encodeURIComponent(event.title)
    const start = encodeURIComponent(`${event.date}T${event.startTime}`)
    const end = encodeURIComponent(`${event.date}T${event.endTime || "23:59"}`)
    const location = encodeURIComponent(event.location + (event.venue ? `, ${event.venue}` : ""))
    const details = encodeURIComponent(event.description)

    // Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`

    // Open in new tab
    window.open(googleCalendarUrl, "_blank")

    toast.success("Calendar Event Created")
  }

  const handleShare = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        })
      } catch (err) {
        // Fallback to copying to clipboard
        fallbackShare()
      }
    } else {
      // Use fallback for browsers that don't support sharing
      fallbackShare()
    }
  }

  const fallbackShare = () => {
    // Create a temporary input element
    const input = document.createElement('input')
    input.value = window.location.href
    document.body.appendChild(input)
    input.select()
    
    try {
      document.execCommand('copy')
      toast.success("Link Copied")
    } catch (err) {
      toast.error("Failed to copy link")
    } finally {
      document.body.removeChild(input)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, MMMM d, yyyy")
    } catch (e) {
      return dateString
    }
  }

  // Loading state
  if (loading) {
    return (
      <DashboardLayout
      appName="ASTU Events"
      appLogo="/placeholder.svg?height=32&width=32"
      helpText="Need Assistance?"
      helpLink="/dashboard/student/support"
    >    
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Events
          </Button>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            </div>

            <div className="space-y-6">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-[150px] w-full rounded-lg" />
          </div>
        </div>
</DashboardLayout>    )
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout
      appName="ASTU Events"
      appLogo="/placeholder.svg?height=32&width=32"
      helpText="Need Assistance?"
      helpLink="/dashboard/student/support"
    >        
    <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/20 rounded-lg border border-dashed">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <AlertCircle className="h-10 w-10 text-muted-foreground" />
            </div>
          <h3 className="mt-4 text-lg font-semibold">Error Loading Event</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">{error}</p>
          <div className="mt-6">
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </DashboardLayout>  
    )
  }

  // No event found
  if (!event) {
    return (
      <DashboardLayout
      appName="ASTU Events"
      appLogo="/placeholder.svg?height=32&width=32"
      helpText="Need Assistance?"
      helpLink="/dashboard/student/support"
    >        <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/20 rounded-lg border border-dashed">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Info className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Event Not Found</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <Button onClick={() => router.push("/student/events")}>Browse Events</Button>
          </div>
            </div>
      </DashboardLayout>
    )
  }

  // Calculate registration percentage
  const registrationPercentage = Math.min(Math.round((event.registeredCount / event.capacity) * 100), 100)

  // Determine if event is full
  const isEventFull = event.registeredCount >= event.capacity

  // Determine if event has passed
  const hasEventPassed = new Date(event.date) < new Date()

  return (
    <DashboardLayout
    appName="ASTU Events"
    appLogo="/placeholder.svg?height=32&width=32"
    helpText="Need Assistance?"
    helpLink="/dashboard/student/support"
  >
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Events
        </Button>
        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        <div className="flex items-center text-muted-foreground">
          <Badge className="mr-2 bg-primary">{event.category}</Badge>
          <span className="text-sm">Organized by {event.organizer.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Image */}
          <div className="relative rounded-lg overflow-hidden h-[400px] shadow-md">
            <Image
              src={event.image || "/placeholder.svg?height=400&width=800"}
                  alt={event.title}
              fill
              className="object-cover"
              priority
                />
              </div>

          {/* Event Details Tabs */}
              <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="attendees">Attendees ({event.attendees?.length || 0})</TabsTrigger>
              <TabsTrigger value="similar">Similar Events</TabsTrigger>
                </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-2 text-primary-600 mt-0.5" />
                      <div>
                    <h3 className="font-medium">Date</h3>
                    <p>{formatDate(event.date)}</p>
                  </div>
                  </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-2 text-primary-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Time</h3>
                    <p>
                      {event.startTime} {event.endTime ? `- ${event.endTime}` : ""}
                    </p>
                  </div>
                  </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-primary-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p>
                      {event.location} {event.venue ? `(${event.venue})` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 mr-2 text-primary-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Capacity</h3>
                    <p>
                      {event.registeredCount} / {event.capacity} registered
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

                  <div>
                <h3 className="font-medium text-lg mb-2">About This Event</h3>
                <div className="text-muted-foreground whitespace-pre-line">
                  {showFullDescription ? event.longDescription || event.description : event.description}

                  {event.longDescription && event.longDescription !== event.description && (
                    <Button
                      variant="link"
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="p-0 h-auto text-primary"
                    >
                      {showFullDescription ? "Show less" : "Read more"}
                    </Button>
                  )}
                </div>
                    </div>

              {event.tags && event.tags.length > 0 && (
                <div>
                  <h3 className="font-medium text-lg mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-muted/50">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium text-lg mb-2">Organizer</h3>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={event.organizer.image || "/placeholder.svg?height=40&width=40"} />
                    {/* <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback> */}
                  </Avatar>
                  <div>
                    <p className="font-medium">{event.organizer.name}</p>
                    <p className="text-sm text-muted-foreground">{event.organizer.department}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attendees" className="pt-4">
              {event.attendees && event.attendees.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {event.attendees.map((attendee) => (
                    <div key={attendee.id} className="flex items-center space-x-3 p-3 rounded-md border">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={attendee.image || "/placeholder.svg?height=40&width=40"} />
                        <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    <div>
                        <p className="font-medium">{attendee.name}</p>
                        {attendee.department && <p className="text-xs text-muted-foreground">{attendee.department}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p>No attendees yet. Be the first to register!</p>
                  </div>
                )}
            </TabsContent>

            <TabsContent value="similar" className="pt-4">
              {event.similarEvents && event.similarEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.similarEvents.map((similarEvent) => (
                    <Card key={similarEvent.id} className="overflow-hidden">
                      <div className="aspect-video relative bg-muted">
                        {similarEvent.image && (
                          <Image
                            src={similarEvent.image || "/placeholder.svg"}
                            alt={similarEvent.title}
                            fill
                            className="object-cover"
                          />
                        )}
                        <Badge className="absolute top-2 right-2 bg-primary">{similarEvent.category}</Badge>
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{similarEvent.title}</CardTitle>
                        <CardDescription>
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {formatDate(similarEvent.date)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="line-clamp-2 text-sm text-muted-foreground">{similarEvent.description}</p>
              </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => router.push(`/student/events/${similarEvent.id}`)}
                        >
                          View Details
                </Button>
              </CardFooter>
            </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p>No similar events found.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration Card */}
            <Card>
              <CardHeader>
              <CardTitle>Registration</CardTitle>
              <CardDescription>
                {isEventFull
                  ? "This event is currently full"
                  : `${event.capacity - event.registeredCount} spots remaining`}
              </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{event.registeredCount} registered</span>
                  <span>{event.capacity} capacity</span>
                </div>
                <Progress value={registrationPercentage} className="h-2" />
              </div>

              {hasEventPassed ? (
                <div className="flex items-center text-muted-foreground bg-muted/50 p-3 rounded-md">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>This event has already taken place</span>
                </div>
              ) : event.isRegistered ? (
                <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-md">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>You're registered for this event</span>
                </div>
              ) : isEventFull ? (
                <div className="flex items-center text-amber-600 bg-amber-50 p-3 rounded-md">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>This event is full</span>
                </div>
              ) : null}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              {!hasEventPassed &&
                (event.isRegistered ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full" disabled={registering}>
                        {registering ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Cancel Registration"
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Registration</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel your registration for this event? You may not be able to
                          register again if the event fills up.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No, keep it</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancelRegistration}>
                          Yes, cancel registration
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button className="w-full" disabled={isEventFull || registering} onClick={handleRegister}>
                    {registering ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Register for Event"
                    )}
                  </Button>
                ))}

              <div className="flex w-full gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={handleAddToCalendar}>
                        <CalendarPlus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add to Calendar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share Event</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {event.isRegistered && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download Ticket</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                <div className="flex-1">
                  <FeedbackButton 
                    eventId={event.id} 
                    eventName={event.title} 
                    eventEndTime={new Date(`${event.date}T${event.endTime || event.startTime}`)}
                    onFeedbackSubmitted={fetchFeedback}
                  />
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* Reviews/Ratings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Event Ratings</CardTitle>
              <CardDescription>What students are saying about this event</CardDescription>
            </CardHeader>
            <CardContent>
              {feedbackStats ? (
                <>
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(feedbackStats.averageRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{feedbackStats.averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm ml-1">
                      ({feedbackStats.totalRatings} ratings)
                    </span>
                  </div>

                  <div className="space-y-4">
                    {feedback.map((item) => (
                      <div key={item.id} className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {item.email ? item.email.charAt(0).toUpperCase() : "A"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium text-sm">
                              {item.email ? item.email.split("@")[0] : "Anonymous"}
                            </span>
                            <span className="text-muted-foreground text-xs ml-2">
                              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <div className="flex my-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= item.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm">{item.feedback}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p>No feedback yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                View All Reviews
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
</DashboardLayout>  )
}

