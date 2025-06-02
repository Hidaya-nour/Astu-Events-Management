"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { EventsFilter } from "@/components/organizer/events-filter"
import { EventsStats } from "@/components/organizer/events-stats"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Search, Plus, Download, Filter, PlusCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useRouter } from "next/router"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminEventsTable } from "@/components/admin/admin-events-table"
import { AdminEventsFilter } from "@/components/admin/admin-events-filter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminEventsCalendarView } from "@/components/admin/admin-events-calendar-view"
import { AdminEventsStats } from "@/components/admin/admin-events-stats"
import { AdminPendingApprovals } from "@/components/admin/admin-pending-approval"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"

interface EventDistribution {
  category: string
  count: number
}

interface AdminStats {
  totalEvents: number
  pendingApprovals: number
  totalUsers: number
  totalOrganizations: number
  eventDistribution: EventDistribution[]
}

interface FilterState {
  status: {
    approved: boolean
    pending: boolean
    rejected: boolean
    cancelled: boolean
  }
  categories: {
    TECHNOLOGY: boolean
    WORKSHOP: boolean
    COMPETITION: boolean
    CAREER: boolean
    ACADEMIC: boolean
    CULTURAL: boolean
    SPORTS: boolean
    SEMINAR: boolean
    CONFERENCE: boolean
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
interface Event {
  id: string
  title: string
  date: Date
  startTime: string
  endTime: string
  location: string
  category: string
  status: string
  capacity: number
  currentAttendees: number
  image?: string
  images?: string[]
}

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filters, setFilters] = useState<FilterState>({
    status: {
      approved: true,
      pending: true,
      rejected: false,
      cancelled: false
    },
    categories: {
      TECHNOLOGY: true,
      WORKSHOP: true,
      COMPETITION: true,
      CAREER: true,
      ACADEMIC: true,
      CULTURAL: true,
      SPORTS: true,
      SEMINAR: true,
      CONFERENCE: true
    },
    organizer: 'all',
    timePeriod: 'all',
    dateRange: {
      from: undefined,
      to: undefined
    },
    featured: {
      featured: false,
      notFeatured: false
    }
  })

  // Update URL when filters change
  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Handle status filters
    const statusFilters = Object.entries(newFilters.status)
      .filter(([_, value]) => value)
      .map(([key]) => key.toUpperCase())
    if (statusFilters.length > 0) {
      params.set('status', statusFilters.join(','))
    } else {
      params.delete('status')
    }

    // Handle category filters
    const categoryFilters = Object.entries(newFilters.categories)
      .filter(([_, value]) => value)
      .map(([key]) => key.toUpperCase())
    if (categoryFilters.length > 0) {
      params.set('category', categoryFilters.join(','))
    } else {
      params.delete('category')
    }

    // Handle time period and date range
    if (newFilters.timePeriod === 'custom' && newFilters.dateRange.from) {
      params.set('startDate', newFilters.dateRange.from.toISOString())
      if (newFilters.dateRange.to) {
        params.set('endDate', newFilters.dateRange.to.toISOString())
      } else {
        params.delete('endDate')
      }
    } else if (newFilters.timePeriod === 'upcoming') {
      params.set('sort', 'upcoming')
      params.delete('startDate')
      params.delete('endDate')
    } else if (newFilters.timePeriod === 'past') {
      params.set('sort', 'past')
      params.delete('startDate')
      params.delete('endDate')
    } else {
      params.delete('startDate')
      params.delete('endDate')
    }

    // Update sort if not set by time period
    if (newFilters.timePeriod !== 'upcoming' && newFilters.timePeriod !== 'past') {
      params.set('sort', sortBy)
    }

    // Update URL without refreshing the page
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    updateURL(newFilters)
  }

  // Initialize filters from URL on component mount
  useEffect(() => {
    const statusParam = searchParams.get('status')?.toLowerCase().split(',') || []
    const categoryParam = searchParams.get('category')?.toLowerCase().split(',') || []
    const sortParam = searchParams.get('sort') || 'newest'
    const timePeriodParam = searchParams.get('timePeriod') || 'all'
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    setFilters(prev => ({
      ...prev,
      status: {
        approved: statusParam.includes('approved'),
        pending: statusParam.includes('pending'),
        rejected: statusParam.includes('rejected'),
        cancelled: statusParam.includes('cancelled')
      },
      categories: {
        TECHNOLOGY: categoryParam.includes('technology'),
        WORKSHOP: categoryParam.includes('workshop'),
        COMPETITION: categoryParam.includes('competition'),
        CAREER: categoryParam.includes('career'),
        ACADEMIC: categoryParam.includes('academic'),
        CULTURAL: categoryParam.includes('cultural'),
        SPORTS: categoryParam.includes('sports'),
        SEMINAR: categoryParam.includes('seminar'),
        CONFERENCE: categoryParam.includes('conference')
      },
      timePeriod: timePeriodParam,
      dateRange: {
        from: startDateParam ? new Date(startDateParam) : undefined,
        to: endDateParam ? new Date(endDateParam) : undefined
      }
    }))

    setSortBy(sortParam)
  }, [searchParams])

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       const response = await fetch('/api/events/admin/stats', {
  //         credentials: 'include'
  //       })
  //       if (!response.ok) {
  //         throw new Error(`Failed to fetch stats: ${response.status}`)
  //       }
  //       const data = await response.json()
  //       setStats(data)
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : 'Failed to fetch stats')
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchStats()
  // }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events/organizer")
        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }
        const data = await response.json()
        const transformedEvents = data.events.map((event: any) => {
          let imageUrl = "/placeholder.svg";
          let images = [];

          try {
            if (event.images) {
              const parsedImages = JSON.parse(event.images);
              if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                images = parsedImages;
                imageUrl = parsedImages[0];
              }
            }
          } catch (e) {
            console.warn("Could not parse images", e);
          }

          return {
            ...event,
            image: imageUrl,
            images: images
          };
        });
        setEvents(transformedEvents)
        setFilteredEvents(transformedEvents)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    // Apply search and sort to events
    const searchResults = events.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const sortedResults = [...searchResults].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "location":
          return a.location.localeCompare(b.location)
        case "category":
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

    setFilteredEvents(sortedResults)
  }, [searchQuery, sortBy, events])

  // Calculate stats based on filtered events
  const stats = {
    totalEvents: filteredEvents.length,
    upcomingEvents: filteredEvents.filter((event) => new Date(event.date) > new Date()).length,
    totalAttendees: filteredEvents.reduce((acc, event) => acc + event.currentAttendees, 0),
    approvedEvents: filteredEvents.filter((event) => event.status === "APPROVED").length,
  }

  if (loading) {
    return (
      <DashboardLayout appName="ASTU Events">
        <div className="flex items-center allign-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout appName="ASTU Events">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  return (
      <DashboardLayout
      appName="ASTU Events"
      appLogo="/placeholder.svg?height=32&width=32"
      helpText="Need Assistance?"
      helpLink="/organizer/support"
      >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Event Management</h1>
              <p className="text-muted-foreground mt-1">Oversee, approve, and manage all events in the system.</p>
            </div>
            <div className="flex gap-2">
              <Link href="/organizer/events/create">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </Link>
            </div>
        </div>   
        <EventsStats stats={stats} />       
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden mb-2">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Filter events by various criteria</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <AdminEventsFilter onFilterChange={handleFilterChange} />
              </div>
            </SheetContent>
          </Sheet>

          <Card className="w-full md:w-64 shrink-0 hidden md:block">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Filter events</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminEventsFilter onFilterChange={handleFilterChange} />
            </CardContent>
          </Card>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search events..." 
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past events</SelectItem>
                    <SelectItem value="attendees">Most attendees</SelectItem>
                    <SelectItem value="pending">Pending approval</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              </TabsList>
              <TabsContent value="list" className="space-y-4">
                <AdminEventsTable 
                  searchQuery={searchQuery} 
                  sortBy={sortBy}
                  filters={filters}
                />
              </TabsContent>
              <TabsContent value="calendar" className="space-y-4">
                <AdminEventsCalendarView 
                  searchQuery={searchQuery} 
                  sortBy={sortBy}
                  filters={filters}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
