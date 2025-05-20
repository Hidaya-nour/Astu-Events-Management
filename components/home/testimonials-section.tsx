import { Star } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Event Manager",
    company: "Global Conferences",
    content:
      "EventPro transformed how we manage our annual conference series. The platform is intuitive and the support team is always responsive.",
    rating: 5,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Marketing Director",
    company: "TechStart Inc.",
    content:
      "We've increased attendance by 40% since switching to EventPro. The analytics and marketing tools are game-changers for our events.",
    rating: 5,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Jessica Williams",
    role: "Wedding Planner",
    company: "Perfect Day Events",
    content:
      "My clients love the seamless experience from invitation to post-event surveys. EventPro has simplified my workflow tremendously.",
    rating: 4,
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-muted/50 py-24">
      <div className="container space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What Our Clients Say</h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Trusted by event professionals worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-md">
              <CardHeader>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-foreground mb-6">"{testimonial.content}"</CardDescription>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
