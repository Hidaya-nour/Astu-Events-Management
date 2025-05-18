import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"

export function UpcomingEvents() {
  // Sample data - in a real app, this would come from your database
  const events = [
    {
      id: 1,
      title: "Tech Symposium",
      description: "Join us for a day of technology talks and networking with industry professionals.",
      date: "May 15, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "Main Auditorium",
      category: "Technology",
      organizer: "Computer Science Department",
    },
    {
      id: 2,
      title: "Cultural Festival",
      description: "Celebrate the diverse cultures at ASTU with performances, food, and activities.",
      date: "May 20, 2025",
      time: "12:00 PM - 8:00 PM",
      location: "University Grounds",
      category: "Cultural",
      organizer: "Student Union",
    },
    {
      id: 3,
      title: "Career Fair",
      description: "Meet with potential employers and learn about job opportunities in your field.",
      date: "May 25, 2025",
      time: "9:00 AM - 3:00 PM",
      location: "Exhibition Hall",
      category: "Career",
      organizer: "Career Services",
    },
  ]

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      Technology: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      Cultural: "bg-pink-100 text-pink-800 hover:bg-pink-100",
      Career: "bg-green-100 text-green-800 hover:bg-green-100",
      Sports: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      Academic: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    }
    return colors[category] || "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Discover events happening at ASTU</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <Badge variant="outline" className={getCategoryBadge(event.category)}>
                  {event.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mb-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">By: {event.organizer}</span>
                <Button size="sm">Register</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Events
        </Button>
      </CardFooter>
    </Card>
  )
}
