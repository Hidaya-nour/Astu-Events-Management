import { Button } from "@/components/ui/button"
import { PlusCircle, Search, Download } from "lucide-react"
import Link from "next/link"
import { EventsTable } from "@/components/organizer/events-table"
import { EventsFilter } from "@/components/organizer//events-filter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventsCalendarView } from "@/components/organizer/events-calendar"
import { EventsStats } from "@/components/organizer/events-stats"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function OrganizerEventsPage() {
  return (
    <DashboardLayout
        appName="ASTU Events"
        appLogo="/placeholder.svg?height=32&width=32"
        helpText="Need Assistance?"
        helpLink="/dashboard/organizer/support"
    >
        <div className="space-y-6 p-2">
        <div className="flex justify-between items-center">
            <div>
            <h1 className="text-2xl font-bold tracking-tight">My Events</h1>
            <p className="text-muted-foreground mt-1">Manage your created events and track attendance.</p>
            </div>
            <div className="flex gap-2">
            <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
            </Button>
            <Link href="/organizer/events/create">
                <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
                </Button>
            </Link>
            </div>
        </div>

        <EventsStats />

        <div className="flex flex-col md:flex-row gap-4 items-start">
            <Card className="w-full md:w-64 shrink-0">
            <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Filter your events</CardDescription>
            </CardHeader>
            <CardContent>
                <EventsFilter />
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
                <EventsTable />
                </TabsContent>
                <TabsContent value="calendar" className="space-y-4">
                <EventsCalendarView />
                </TabsContent>
            </Tabs>
            </div>
        </div>
        </div>
    </DashboardLayout>
  )
}
