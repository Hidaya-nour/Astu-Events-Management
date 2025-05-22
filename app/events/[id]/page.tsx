"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, MapPin, Share, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // In a real app, you would fetch the event details based on the ID
  const event = events.find((e) => e.id === params.id) || events[0]

  const handleRegister = async () => {
    setIsLoading(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // toast({
      //   title: "Registration successful!",
      //   description: `You have successfully registered for ${event.title}.`,
      // })

      router.push("/dashboard/student")
    } catch (error) {
      // toast({
      //   title: "Registration failed",
      //   description: "There was an error registering for this event. Please try again.",
      //   variant: "destructive",
      // })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center">
        <Link href="/events" className="mr-4 text-primary-600 hover:text-primary-800">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back to events</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Details</h1>
          <p className="text-gray-500">View information and register for this event.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="relative h-64 w-full md:h-80">
              <Image
                src={event.image || "/placeholder.svg?height=400&width=800"}
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary-600 text-white">{event.category}</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl text-primary-800">{event.title}</CardTitle>
              <CardDescription className="flex items-center text-gray-500">
                <Calendar className="mr-2 h-4 w-4" />
                {event.date} | {event.time}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center text-gray-500">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Users className="mr-2 h-4 w-4" />
                  <span>
                    {event.registrations}/{event.capacity} Registered
                  </span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{event.duration}</span>
                </div>
              </div>

              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="organizers">Organizers</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <p className="text-gray-600">{event.description}</p>
                    <p className="text-gray-600">{event.longDescription}</p>
                  </div>
                </TabsContent>
                <TabsContent value="schedule" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    {event.schedule.map((item, index) => (
                      <div key={index} className="flex border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                        <div className="mr-4 text-right">
                          <div className="font-medium text-gray-900">{item.time}</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.title}</div>
                          <div className="text-sm text-gray-500">{item.description}</div>
                          {item.speaker && <div className="mt-1 text-sm text-primary-600">Speaker: {item.speaker}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="organizers" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      <span className="font-medium">Organized by:</span> {event.organizer}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Contact:</span> {event.contactEmail}
                    </p>
                    {event.sponsors && (
                      <div>
                        <p className="font-medium text-gray-900">Sponsors:</p>
                        <ul className="mt-2 list-disc pl-5 text-gray-600">
                          {event.sponsors.map((sponsor, index) => (
                            <li key={index}>{sponsor}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
              <CardDescription>Secure your spot for this event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 text-sm font-medium text-gray-500">Registration Status</div>
                <div className="text-lg font-bold text-green-600">Open</div>
                <div className="mt-1 text-xs text-gray-500">Closes on {event.registrationDeadline}</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 text-sm font-medium text-gray-500">Available Spots</div>
                <div className="text-lg font-bold text-gray-900">
                  {event.capacity - event.registrations} / {event.capacity}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {Math.round(((event.capacity - event.registrations) / event.capacity) * 100)}% available
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              <Button
                className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                onClick={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Register Now"}
              </Button>
              <Button variant="outline" className="w-full border-gray-200">
                <Share className="mr-2 h-4 w-4" />
                Share Event
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>Event venue details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Event location map"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <div className="font-medium text-gray-900">{event.location}</div>
                <div className="text-sm text-gray-500">{event.address}</div>
                <Button
                  variant="outline"
                  className="mt-2 w-full border-primary-600 text-primary-600 hover:bg-primary-50"
                >
                  Get Directions
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Similar Events</CardTitle>
              <CardDescription>You might also be interested in these events.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {events
                .filter((e) => e.id !== event.id && e.category === event.category)
                .slice(0, 2)
                .map((similarEvent) => (
                  <Link key={similarEvent.id} href={`/events/${similarEvent.id}`}>
                    <div className="flex items-center space-x-4 rounded-lg border border-gray-200 p-3 transition-all hover:border-primary-300 hover:shadow-sm">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                        <Image
                          src={similarEvent.image || "/placeholder.svg?height=64&width=64"}
                          alt={similarEvent.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{similarEvent.title}</div>
                        <div className="text-xs text-gray-500">{similarEvent.date}</div>
                      </div>
                    </div>
                  </Link>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const events = [
  {
    id: "1",
    title: "Annual Technology Symposium",
    description: "Join leading researchers and industry experts for ASTU's flagship technology conference.",
    longDescription:
      "The Annual Technology Symposium brings together the brightest minds in technology to discuss the latest trends, innovations, and research in the field. This year's theme is 'Technology for Sustainable Development' with a focus on how technology can address global challenges. The symposium will feature keynote speeches, panel discussions, research presentations, and networking opportunities.",
    date: "June 15, 2025",
    time: "9:00 AM - 5:00 PM",
    duration: "8 hours",
    location: "Main Auditorium, ASTU Campus",
    address: "ASTU Main Campus, Adama, Ethiopia",
    category: "Academic",
    image: "/images/astu-computer-lab.png",
    organizer: "Department of Computer Science",
    contactEmail: "tech.symposium@astu.edu.et",
    sponsors: ["Tech Ethiopia", "Adama Science and Technology University", "Ministry of Science and Technology"],
    registrations: 120,
    capacity: 150,
    registrationDeadline: "June 10, 2025",
    schedule: [
      {
        time: "9:00 AM - 9:30 AM",
        title: "Registration and Welcome Coffee",
        description: "Check-in and collect your conference materials",
      },
      {
        time: "9:30 AM - 10:30 AM",
        title: "Opening Keynote: The Future of Technology in Africa",
        description: "An inspiring talk on the role of technology in Africa's development",
        speaker: "Dr. Abebe Kebede, CTO of Tech Ethiopia",
      },
      {
        time: "10:45 AM - 12:15 PM",
        title: "Panel Discussion: Sustainable Technology Solutions",
        description: "Experts discuss how technology can address environmental challenges",
        speaker: "Various Industry Leaders",
      },
      {
        time: "12:15 PM - 1:30 PM",
        title: "Lunch Break and Networking",
        description: "Enjoy lunch and connect with fellow attendees",
      },
      {
        time: "1:30 PM - 3:00 PM",
        title: "Research Presentations",
        description: "ASTU students and faculty present their latest research",
      },
      {
        time: "3:15 PM - 4:15 PM",
        title: "Workshop: Practical Applications of AI",
        description: "Hands-on workshop exploring AI applications",
        speaker: "Prof. Tigist Haile",
      },
      {
        time: "4:30 PM - 5:00 PM",
        title: "Closing Remarks and Awards",
        description: "Conclusion of the symposium and presentation of awards",
      },
    ],
  },
  {
    id: "2",
    title: "Cultural Festival",
    description: "Celebrate the diverse cultures and traditions represented at ASTU University.",
    longDescription:
      "The ASTU Cultural Festival is an annual celebration of the rich cultural diversity within our university community. Students from different regions of Ethiopia and international students showcase their traditional music, dance, food, and customs. This vibrant event promotes cultural exchange, understanding, and appreciation among the ASTU community.",
    date: "July 8, 2025",
    time: "10:00 AM - 8:00 PM",
    duration: "10 hours",
    location: "University Square",
    address: "ASTU Main Campus, Adama, Ethiopia",
    category: "Cultural",
    image: "/images/astu-group-photo.png",
    organizer: "Student Affairs Office",
    contactEmail: "cultural.festival@astu.edu.et",
    sponsors: ["Ministry of Culture and Tourism", "Adama City Administration"],
    registrations: 85,
    capacity: 200,
    registrationDeadline: "July 5, 2025",
    schedule: [
      {
        time: "10:00 AM - 11:00 AM",
        title: "Opening Ceremony",
        description: "Official opening with traditional Ethiopian coffee ceremony",
      },
      {
        time: "11:00 AM - 1:00 PM",
        title: "Cultural Exhibitions",
        description: "Displays of traditional artifacts, clothing, and art from various cultures",
      },
      {
        time: "1:00 PM - 2:30 PM",
        title: "International Food Festival",
        description: "Sample cuisines from different regions and countries",
      },
      {
        time: "2:30 PM - 4:30 PM",
        title: "Traditional Music Performances",
        description: "Live performances of traditional music from various Ethiopian regions",
      },
      {
        time: "4:30 PM - 6:30 PM",
        title: "Cultural Dance Showcase",
        description: "Students perform traditional dances from their cultures",
      },
      {
        time: "6:30 PM - 8:00 PM",
        title: "Modern Fusion Performance and Closing",
        description: "Contemporary performances blending traditional and modern elements",
      },
    ],
  },
  {
    id: "3",
    title: "Engineering Workshop",
    description: "Hands-on workshop on the latest engineering practices and technologies.",
    longDescription:
      "This intensive engineering workshop provides practical, hands-on experience with cutting-edge engineering technologies and methodologies. Participants will work on real-world problems under the guidance of experienced engineers and faculty members. The workshop is designed to bridge the gap between theoretical knowledge and practical application, preparing students for the demands of the engineering industry.",
    date: "June 25, 2025",
    time: "2:00 PM - 5:00 PM",
    duration: "3 hours",
    location: "Engineering Building, Room 302",
    address: "Engineering Complex, ASTU Main Campus, Adama, Ethiopia",
    category: "Workshop",
    image: "/images/engineering-workshop.png",
    organizer: "Department of Engineering",
    contactEmail: "engineering.workshop@astu.edu.et",
    sponsors: ["Ethiopian Engineering Association", "Adama Industrial Park"],
    registrations: 30,
    capacity: 30,
    registrationDeadline: "June 20, 2025",
    schedule: [
      {
        time: "2:00 PM - 2:15 PM",
        title: "Introduction and Overview",
        description: "Welcome and introduction to the workshop",
      },
      {
        time: "2:15 PM - 3:00 PM",
        title: "Hands-on Session: Equipment Familiarization",
        description: "Introduction to the engineering equipment and safety protocols",
        speaker: "Prof. Dawit Mekonnen, Head of Engineering Department",
      },
      {
        time: "3:00 PM - 4:30 PM",
        title: "Practical Workshop: Problem Solving",
        description: "Working on real engineering challenges in small groups",
        speaker: "Industry Engineers from Adama Industrial Park",
      },
      {
        time: "4:30 PM - 5:00 PM",
        title: "Presentation and Discussion",
        description: "Groups present their solutions and receive feedback",
      },
    ],
  },
]
