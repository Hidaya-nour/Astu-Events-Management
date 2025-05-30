"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, ChevronDown, Clock, Filter, MapPin, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(event.category)

    const today = new Date()
    const eventDate = new Date(event.date)

    if (activeTab === "all") return matchesSearch && matchesCategory
    if (activeTab === "upcoming") return matchesSearch && matchesCategory && eventDate >= today
    if (activeTab === "past") return matchesSearch && matchesCategory && eventDate < today
    if (activeTab === "featured") return matchesSearch && matchesCategory && event.isFeatured

    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(events.map((event) => event.category)))

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="container py-12 md:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <Badge className="mb-4 bg-primary text-primary-foreground">Events Calendar</Badge>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Discover ASTU University Events
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
            Browse and register for upcoming academic conferences, cultural celebrations, workshops, and more.
          </p>
          <div className="mt-8 flex justify-center">
            <Image
              src="/images/astu-faculty-group.png"
              alt="ASTU Faculty and Students"
              width={800}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
        >
          <div className="flex w-full items-center space-x-2 md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                className="w-full bg-background pl-8 md:w-80 border-border focus:border-primary transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 border-border">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
                    <X className="mr-2 h-3 w-3" />
                    Clear Filters
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Active Filters */}
        {(searchQuery || selectedCategories.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 flex flex-wrap items-center gap-2"
          >
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="outline" className="flex items-center gap-1 bg-background">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery("")}>
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove search filter</span>
                </button>
              </Badge>
            )}
            {selectedCategories.map((category) => (
              <Badge key={category} variant="outline" className="flex items-center gap-1 bg-background">
                {category}
                <button onClick={() => handleCategoryToggle(category)}>
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {category} filter</span>
                </button>
              </Badge>
            ))}
            {(searchQuery || selectedCategories.length > 0) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2 text-xs">
                Clear all
              </Button>
            )}
          </motion.div>
        )}

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="rounded-lg border-border bg-card p-4 shadow-sm"
              >
                <div className="h-48 w-full animate-pulse rounded-md bg-muted"></div>
                <div className="mt-4 h-6 w-3/4 animate-pulse rounded bg-muted"></div>
                <div className="mt-2 h-4 w-full animate-pulse rounded bg-muted"></div>
                <div className="mt-1 h-4 w-2/3 animate-pulse rounded bg-muted"></div>
                <div className="mt-4 flex justify-between">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-1/3 animate-pulse rounded bg-muted"></div>
                </div>
                <div className="mt-4 h-10 w-full animate-pulse rounded bg-muted"></div>
              </motion.div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-12 text-center"
          >
            <div className="rounded-full bg-secondary p-3">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-foreground">No events found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <Button onClick={clearFilters} className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
              Clear filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden border-border bg-card text-card-foreground transition-all duration-300 hover:shadow-xl group h-full flex flex-col">
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                      <Image
                        src={event.image || "/placeholder.svg?height=200&width=400"}
                        alt={event.title}
                        width={400}
                        height={200}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary text-primary-foreground shadow-md">{event.category}</Badge>
                      </div>
                      {event.isFeatured && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-amber-500 text-white shadow-md">Featured</Badge>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-sm font-medium">Click to view details and register</p>
                      </div>
                    </div>
                    <CardHeader className="p-4 flex-grow">
                      <CardTitle className="line-clamp-1 text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-muted-foreground">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm">
                      <div className="flex items-center text-muted-foreground mb-2">
                        <Calendar className="mr-2 h-4 w-4 text-primary" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <Clock className="mr-2 h-4 w-4 text-primary" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4 text-primary" />
                        <span>{event.location}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 mt-auto">
                      <Link href={`/events/${event.id}`} className="w-full">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300">
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading && filteredEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center justify-center space-x-2"
          >
            <Button variant="outline" size="icon" disabled>
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-secondary">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              3
            </Button>
            <Button variant="outline" size="icon">
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
const events = [
  {
    id: "1",
    title: "Annual Technology Symposium",
    description: "Join leading researchers and industry experts for ASTU's flagship technology conference.",
    date: "June 15, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Main Auditorium, ASTU Campus",
    category: "Academic",
    image: "/images/astu-computer-lab.png",
    isFeatured: true,
  },
  {
    id: "2",
    title: "Cultural Festival",
    description: "Celebrate the diverse cultures and traditions represented at ASTU University.",
    date: "July 8, 2025",
    time: "10:00 AM - 8:00 PM",
    location: "University Square",
    category: "Cultural",
    image: "/images/astu-group-photo.png",
    isFeatured: true,
  },
  {
    id: "3",
    title: "Engineering Workshop",
    description: "Hands-on workshop on the latest engineering practices and technologies.",
    date: "June 25, 2025",
    time: "2:00 PM - 5:00 PM",
    location: "Engineering Building, Room 302",
    category: "Workshop",
    image: "/images/engineering-workshop.png",
    isFeatured: false,
  },
  {
    id: "4",
    title: "Career Fair 2025",
    description: "Connect with potential employers and explore career opportunities in various fields.",
    date: "August 5, 2025",
    time: "9:00 AM - 4:00 PM",
    location: "Student Center",
    category: "Career",
    image: "/placeholder.svg?height=200&width=400",
    isFeatured: false,
  },
  {
    id: "5",
    title: "Research Showcase",
    description: "ASTU students and faculty present their innovative research projects.",
    date: "July 20, 2025",
    time: "1:00 PM - 6:00 PM",
    location: "Science Complex",
    category: "Academic",
    image: "/placeholder.svg?height=200&width=400",
    isFeatured: false,
  },
  {
    id: "6",
    title: "Sports Tournament",
    description: "Annual inter-department sports competition featuring various sporting events.",
    date: "August 12, 2025",
    time: "8:00 AM - 6:00 PM",
    location: "ASTU Sports Complex",
    category: "Sports",
    image: "/placeholder.svg?height=200&width=400",
    isFeatured: false,
  },
  {
    id: "7",
    title: "Alumni Networking Event",
    description: "Connect with ASTU alumni and build your professional network.",
    date: "September 5, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "University Hall",
    category: "Networking",
    image: "/placeholder.svg?height=200&width=400",
    isFeatured: false,
  },
  {
    id: "8",
    title: "Entrepreneurship Summit",
    description: "Learn from successful entrepreneurs and startup founders.",
    date: "October 10, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Business School Auditorium",
    category: "Business",
    image: "/placeholder.svg?height=200&width=400",
    isFeatured: true,
  },
  {
    id: "9",
    title: "Hackathon 2025",
    description: "48-hour coding competition to solve real-world problems.",
    date: "November 15, 2025",
    time: "9:00 AM - 9:00 AM (48 hours)",
    location: "Computer Science Building",
    category: "Technology",
    image: "/placeholder.svg?height=200&width=400",
    isFeatured: false,
  },
]

