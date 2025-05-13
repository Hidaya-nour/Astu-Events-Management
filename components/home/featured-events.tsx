import Link from "next/link"
import Image from "next/image"
import { CalendarDays, MapPin, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sample event data
const featuredEvents = [
  {
    id: 1,
    title: "Tech Conference 2024",
    description: "Join industry leaders for a day of innovation and networking",
    image: "/placeholder.svg?height=400&width=600",
    date: "June 15-17, 2024",
    location: "San Francisco, CA",
    category: "Conference",
  },
  {
    id: 2,
    title: "Summer Music Festival",
    description: "Experience three days of amazing live performances",
    image: "/placeholder.svg?height=400&width=600",
    date: "July 8-10, 2024",
    location: "Austin, TX",
    category: "Festival",
  },
  {
    id: 3,
    title: "Charity Gala Dinner",
    description: "An elegant evening supporting environmental conservation",
    image: "/placeholder.svg?height=400&width=600",
    date: "August 22, 2024",
    location: "New York, NY",
    category: "Gala",
  },
]

export function FeaturedEvents() {
  return (
    <section className="container py-24 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Featured Events</h2>
          <p className="text-gray-500 max-w-[600px]">
            Discover and attend some of our most anticipated upcoming events
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/events">
            View all events
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden border-0 shadow-lg">
            <div className="aspect-video relative">
              <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
              <Badge className="absolute top-4 left-4">{event.category}</Badge>
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{event.title}</CardTitle>
              <CardDescription className="line-clamp-2">{event.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-500" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{event.location}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/events/${event.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
