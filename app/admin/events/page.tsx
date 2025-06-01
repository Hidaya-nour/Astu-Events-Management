"use client"
import { Button } from "@/components/ui/button"
import { Download, Filter, PlusCircle, Search } from 'lucide-react'
import Link from "next/link"
import { AdminEventsTable } from "@/components/admin/admin-events-table"
import { AdminEventsFilter } from "@/components/admin/admin-events-filter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminEventsCalendarView } from "@/components/admin/admin-events-calendar-view"
import { AdminEventsStats } from "@/components/admin/admin-events-stats"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminPendingApprovals } from "@/components/admin/admin-pending-approval"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from 'next/navigation'

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

export default function AdminEventsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [stats, setStats] = useState<AdminStats | null>(null)
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/events/admin/stats', {
          credentials: 'include'
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.status}`)
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <DashboardLayout
      appName="ASTU Events"
      appLogo="/placeholder.svg?height=32&width=32"
      helpText="Need Assistance?"
      helpLink="/dashboard/admin/support"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Event Management</h1>
            <p className="text-muted-foreground mt-1">Oversee, approve, and manage all events in the system.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Link href="/admin/events/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>

        <AdminEventsStats />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Events waiting for your approval</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminPendingApprovals />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Distribution</CardTitle>
              <CardDescription>Events by category</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="w-full h-[220px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              ) : error ? (
                <div className="text-destructive text-center h-[220px] flex items-center justify-center">
                  <div>
                    <p>Failed to load event distribution</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats?.eventDistribution.map((dist) => (
                    <div key={dist.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{dist.category}</span>
                        <span className="text-sm text-muted-foreground">{dist.count} events</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${(dist.count / (stats.totalEvents || 1)) * 100}%`,
                            backgroundColor: getCategoryColor(dist.category)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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

function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    'TECHNOLOGY': '#3b82f6', // blue-500
    'ACADEMIC': '#22c55e', // green-500
    'WORKSHOP': '#a855f7', // purple-500
    'CULTURAL': '#eab308', // yellow-500
    'SPORTS': '#ef4444', // red-500
    'OTHER': '#f97316' // orange-500
  }
  return colors[category] || '#6b7280' // gray-500
}
