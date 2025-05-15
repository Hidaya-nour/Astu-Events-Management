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

export default function AdminEventsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/events/admin/stats')
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
                <AdminEventsFilter />
                </div>
            </SheetContent>
            </Sheet>

            <Card className="w-full md:w-64 shrink-0 hidden md:block">
            <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Filter events</CardDescription>
            </CardHeader>
            <CardContent>
                <AdminEventsFilter />
            </CardContent>
            </Card>

            <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search events..." className="pl-8 w-full" />
                </div>
                <div className="flex gap-2">
                <Select defaultValue="newest">
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
                <AdminEventsTable />
                </TabsContent>
                <TabsContent value="calendar" className="space-y-4">
                <AdminEventsCalendarView />
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
    'TECHNICAL': '#3b82f6', // blue-500
    'ACADEMIC': '#22c55e', // green-500
    'WORKSHOP': '#a855f7', // purple-500
    'CULTURAL': '#eab308', // yellow-500
    'SPORTS': '#ef4444', // red-500
    'OTHER': '#f97316' // orange-500
  }
  return colors[category] || '#6b7280' // gray-500
}
