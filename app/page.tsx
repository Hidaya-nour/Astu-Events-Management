import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Users } from "lucide-react"
import Link from "next/link"
import EventCard from "@/components/event-card"
import { mockEvents } from "@/lib/mock-data"

export default function HomePage() {
  // Featured events (first 3 from mock data)
  const featuredEvents = mockEvents.slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-16 text-white md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">ASTU Events Platform</h1>
          <p className="mb-8 text-lg md:text-xl">
            Discover, create, and join events at Adama Science and Technology University
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Link href="/events">Browse Events</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/events/create">Create Event</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="mb-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">Featured Events</h2>
          <Button asChild variant="outline">
            <Link href="/events">View All</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-16">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">Event Categories</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              href={`/events?category=${category.slug}`}
              key={category.slug}
              className="flex flex-col items-center rounded-lg p-4 text-center transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="mb-3 rounded-full bg-purple-100 p-3 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                <category.icon className="h-6 w-6" />
              </div>
              <span className="font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16 rounded-xl bg-gray-50 p-8 dark:bg-gray-800">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
              <CalendarDays className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Find Events</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Browse through upcoming events happening at ASTU and find what interests you.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Join or Create</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Register for events you want to attend or create your own to share with the community.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
              <MapPin className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Attend & Connect</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Attend events, connect with other students, and build your network at ASTU.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center text-white">
        <h2 className="mb-4 text-2xl font-bold md:text-3xl">Ready to get started?</h2>
        <p className="mb-6 text-lg">Join the ASTU Events community today and never miss an event again.</p>
        <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
          <Link href="/events">Explore Events</Link>
        </Button>
      </section>
    </div>
  )
}

const categories = [
  { name: "Academic", slug: "academic", icon: CalendarDays },
  { name: "Cultural", slug: "cultural", icon: Users },
  { name: "Sports", slug: "sports", icon: MapPin },
  { name: "Technology", slug: "technology", icon: CalendarDays },
  { name: "Arts", slug: "arts", icon: Users },
  { name: "Career", slug: "career", icon: MapPin },
]
