"use client"

import { useState } from "react"
import {
  Award,
  Bell,
  BookOpen,
  Calendar,
  ChevronDown,
  Clock,
  Download,
  Filter,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  MoreHorizontal,
  Settings,
  Star,
  User,
  Users,
  Sun,
  Moon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for the student
const userInfo = {
  name: "Abebe Bekele",
  role: "Student",
  id: "ETS0123/12",
  department: "Computer Science",
  semester: "Spring 2025",
  year: "3rd Year",
}

const registeredEvents = [
  {
    id: 1,
    title: "Machine Learning Bootcamp",
    date: "May 15, 2025",
    location: "Auditorium A",
    description: "An introduction to ML for beginners.",
    image: "/placeholder.svg?height=160&width=320",
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
    image: "/placeholder.svg?height=160&width=320",
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
    image: "/placeholder.svg?height=160&width=320",
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
    image: "/placeholder.svg?height=160&width=320",
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
    image: "/placeholder.svg?height=160&width=320",
    status: "Feedback Submitted",
    tags: ["Cultural", "Festival"],
    rating: 4,
  },
]

// Helper function to get badge variant based on status
function getBadgeVariant(status) {
  switch (status) {
    case "Registered":
      return "secondary"
    case "Attended":
      return "default"
    case "Waitlisted":
      return "destructive"
    case "Feedback Submitted":
      return "outline"
    default:
      return "default"
  }
}

// Event Card Component
function EventCard({ event }) {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative h-40">
        <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
        <Badge variant={getBadgeVariant(event.status)} className="absolute top-2 right-2">
          {event.status}
        </Badge>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3" />
          {event.date} • {event.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {event.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        {event.rating && (
          <div className="flex items-center star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={star <= event.rating ? "star-filled" : "star-empty"} />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Button size="sm" variant="outline">
          View Details
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            {event.status === "Registered" && <DropdownMenuItem>Download Ticket</DropdownMenuItem>}
            {event.status === "Registered" && <DropdownMenuItem>Cancel Registration</DropdownMenuItem>}
            {event.status === "Attended" && !event.rating && <DropdownMenuItem>Give Feedback</DropdownMenuItem>}
            {event.status === "Attended" && event.rating && <DropdownMenuItem>View Feedback</DropdownMenuItem>}
            {event.status === "Waitlisted" && <DropdownMenuItem>Check Position</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}

export default function StudentDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // In a real implementation, you would toggle a class on the html/body element
    // or use a theme provider like next-themes
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span className="font-bold">ASTU Events</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Calendar className="h-5 w-5" />
                Events Calendar
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="h-5 w-5" />
                Clubs & Organizations
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Award className="h-5 w-5" />
                Certificates & Badges
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <HelpCircle className="h-5 w-5" />
                Help & Support
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="#" className="flex items-center gap-2 text-lg font-semibold md:text-xl">
          <Home className="h-5 w-5" />
          <span className="font-bold">ASTU Events</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={toggleDarkMode} className="hidden md:flex">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              2
            </Badge>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                My Events
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar (desktop only) */}
        <aside className="hidden w-64 flex-col border-r bg-background md:flex">
          <nav className="grid gap-2 p-4 text-sm">
            <Link
              href="#"
              className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-all"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <Calendar className="h-4 w-4" />
              Events Calendar
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <Users className="h-4 w-4" />
              Clubs & Organizations
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <Award className="h-4 w-4" />
              Certificates & Badges
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>

            <div className="my-2 h-[1px] w-full bg-border" />
            <div className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
              <h3 className="mb-1 font-medium">Need Help?</h3>
              <p className="text-xs text-muted-foreground">Contact our support team for assistance.</p>
              <Button variant="link" size="sm" className="mt-2 h-auto p-0 text-xs" asChild>
                <Link href="#">Contact Support</Link>
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6 space-y-8">
            {/* Welcome Section */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Student" />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold">Welcome, {userInfo.name}</h1>
                    <p className="text-muted-foreground">
                      Student ID: {userInfo.id} • {userInfo.department} Department
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-muted-foreground">
                    <Clock className="mr-1 inline-block h-4 w-4" />
                    Current Semester: {userInfo.semester}
                  </div>
                  <Badge variant="outline" className="w-fit">
                    <BookOpen className="mr-1 h-3 w-3" /> {userInfo.year} Student
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
                  <div className="text-2xl font-bold">{registeredEvents.length + attendedEvents.length}</div>
                  <p className="text-xs text-muted-foreground">Registered this semester</p>
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
                  <div className="text-2xl font-bold">{feedbackEvents.length}</div>
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

            {/* Discover Events Section */}
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h2 className="text-xl font-bold">Discover Events</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        Categories
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Academic</DropdownMenuItem>
                      <DropdownMenuItem>Sports</DropdownMenuItem>
                      <DropdownMenuItem>Social</DropdownMenuItem>
                      <DropdownMenuItem>Clubs</DropdownMenuItem>
                      <DropdownMenuItem>Workshops</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Calendar className="h-4 w-4" />
                    Calendar View
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="overflow-hidden">
                  <div className="aspect-video relative">
                    <Image
                      src="/placeholder.svg?height=160&width=320"
                      alt="AI Workshop"
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute right-2 top-2 bg-primary">Academic</Badge>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-1 text-lg">AI Workshop Series</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      May 20, 2025 • 1:00 PM
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      Learn about the latest advancements in artificial intelligence and machine learning.
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <Badge variant="outline">50 Seats Available</Badge>
                    <Button size="sm">Register</Button>
                  </CardFooter>
                </Card>

                <Card className="overflow-hidden">
                  <div className="aspect-video relative">
                    <Image
                      src="/placeholder.svg?height=160&width=320"
                      alt="Sports Tournament"
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute right-2 top-2 bg-green-500">Sports</Badge>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-1 text-lg">Inter-Department Football Tournament</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      May 25-30, 2025 • Sports Complex
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      Annual football tournament between different departments. Register your team now!
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <Badge variant="outline">Team Registration Open</Badge>
                    <Button size="sm">Register</Button>
                  </CardFooter>
                </Card>

                <Card className="overflow-hidden">
                  <div className="aspect-video relative">
                    <Image
                      src="/placeholder.svg?height=160&width=320"
                      alt="Cultural Festival"
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute right-2 top-2 bg-orange-500">Social</Badge>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-1 text-lg">Cultural Festival 2025</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      June 5, 2025 • Student Center
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      Experience diverse cultures through music, dance, food, and art exhibitions.
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <Badge variant="outline">Open to All</Badge>
                    <Button size="sm">Register</Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="mt-4 text-center">
                <Button variant="outline">View All Events</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
