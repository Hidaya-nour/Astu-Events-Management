"use client"

import {
  Award,
  BookOpen,
  Calendar,
  ChevronDown,
  Clock,
  Download,
  Filter,
  Home,
  MoreHorizontal,
  Settings,
  Star,
  Users,
} from "lucide-react"
import Image from "next/image"

import { DashboardLayout } from "../../../components/layout/dashboard-layout"
import { Avatar, AvatarFallback, AvatarImage } from "../../../../@/components/ui/avatar"
import { Badge } from "../../../../@/components/ui/badge"
import { Button } from "../../../../@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../@/components/ui/dropdown-menu"
import { Progress } from "../../../../@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../@/components/ui/tooltip"

// Sample real data for the student
const userInfo = {
  name: "Abebe Bekele",
  role: "Student",
  initials: "AB",
  additionalInfo: [
    {
      label: "Current Semester",
      value: "Spring 2025",
      icon: Clock,
    },
  ],
  badges: [
    {
      label: "3rd Year Student",
      icon: BookOpen,
    },
  ],
}

const registeredEvents = [
  {
    id: 1,
    title: "Machine Learning Bootcamp",
    date: "May 15, 2025",
    location: "Auditorium A",
    description: "An introduction to ML for beginners.",
    image: "/placeholder.svg",
    status: "Registered",
    tags: ["AI", "Bootcamp"],
    rating: 4,
  },
  {
    id: 2,
    title: "Tech Innovation Summit",
    date: "May 20, 2025",
    location: "Main Auditorium",
    description: "Annual summit discussing emerging tech trends.",
    image: "/placeholder.svg",
    status: "Registered",
    tags: ["Tech", "Summit"],
    rating: 4.5,
  },
]

const attendedEvents = [
  {
    id: 3,
    title: "AI Workshop Series",
    date: "March 10, 2025",
    location: "Tech Lab",
    description: "Workshops focusing on the latest AI techniques.",
    image: "/placeholder.svg",
    status: "Attended",
    tags: ["AI", "Workshop"],
    rating: 5,
  },
]

const waitlistedEvents = [
  {
    id: 4,
    title: "Inter-Department Football Tournament",
    date: "May 25, 2025",
    location: "Sports Complex",
    description: "Annual football tournament between departments.",
    image: "/placeholder.svg",
    status: "Waitlisted",
    tags: ["Sports", "Tournament"],
    rating: null,
  },
]

const feedbackEvents = [
  {
    id: 5,
    title: "Cultural Festival 2025",
    date: "June 5, 2025",
    location: "Student Center",
    description: "A celebration of diverse cultures through music, dance, and art.",
    image: "/placeholder.svg",
    status: "Feedback Submitted",
    tags: ["Cultural", "Festival"],
    rating: 4,
  },
]

export default function StudentDashboard() {
  const sidebarItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
      isActive: true,
    },
    {
      title: "Events Calendar",
      icon: Calendar,
      href: "/dashboard/calendar",
    },
    {
      title: "Clubs & Organizations",
      icon: Users,
      href: "/dashboard/clubs",
    },
    {
      title: "Certificates & Badges",
      icon: Award,
      href: "/dashboard/certificates",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ]

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userInfo={userInfo}
      appName="ASTU Events"
      appLogo="/placeholder.svg?height=32&width=32"
      helpText="Need Help?"
      helpLink="/support"
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="rounded-lg border bg-card p-6 shadow-sm dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src="/placeholder.svg" alt="Student" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome, Abebe Bekele</h1>
                <p className="text-muted-foreground">Student ID: ETS0123/12 • Computer Science Department</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">
                <Clock className="mr-1 inline-block h-4 w-4" />
                Current Semester: Spring 2025
              </div>
              <Badge variant="outline" className="w-fit">
                <BookOpen className="mr-1 h-3 w-3" /> 3rd Year Student
              </Badge>
            </div>
          </div>
        </div>

        {/* Event Reminder Banner */}
        <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">Upcoming: Tech Innovation Summit</h3>
                <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM • Main Auditorium</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                View Details
              </Button>
              <Button size="sm">
                <Download className="mr-1 h-4 w-4" />
                Get Ticket
              </Button>
            </div>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{registeredEvents.length}</div>
              <p className="text-xs text-muted-foreground">Attended this semester</p>
              <Progress value={60} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Active participant</p>
              <Progress value={50} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Feedback Given</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Average rating: 4.2/5</p>
              <Progress value={80} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Academic</div>
              <p className="text-xs text-muted-foreground">7 events attended</p>
              <Progress value={70} className="mt-2 h-1" />
            </CardContent>
          </Card>
        </div>

        {/* My Events Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">My Events</h2>
          <Tabs defaultValue="registered">
            <TabsList className="mb-4">
              <TabsTrigger value="registered">Registered</TabsTrigger>
              <TabsTrigger value="attended">Attended</TabsTrigger>
              <TabsTrigger value="waitlisted">Waitlisted</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            <TabsContent value="registered">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="attended">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attendedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="waitlisted">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {waitlistedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="feedback">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedbackEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Event Card Component
const EventCard = ({ event }: { event: any }) => {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Registered":
        return "secondary"
      case "Attended":
        return "success"
      case "Waitlisted":
        return "warning"
      default:
        return "default"
    }
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm">{event.title}</CardTitle>
        <CardDescription>{event.date}</CardDescription>
      </CardHeader>
      <CardContent>
        <Image src={event.image} alt={event.title} width={200} height={120} className="rounded-md" />
        <div className="mt-3 text-xs text-muted-foreground">{event.description}</div>
        <Badge variant={getBadgeVariant(event.status)} className="mt-2">{event.status}</Badge>
      </CardContent>
      <CardFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-6 w-6 p-0" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>View Feedback</DropdownMenuItem>
            <DropdownMenuItem>Cancel Registration</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
