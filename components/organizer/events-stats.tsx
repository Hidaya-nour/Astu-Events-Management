import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, CheckCircle, Clock } from "lucide-react"

export function EventsStats() {
  // Sample data - in a real app, this would come from your API
  const stats = [
    {
      title: "Total Events",
      value: "12",
      description: "All events",
      icon: Calendar,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Upcoming Events",
      value: "5",
      description: "Next 30 days",
      icon: Clock,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Total Attendees",
      value: "543",
      description: "Across all events",
      icon: Users,
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Approved Events",
      value: "10",
      description: "Ready to go",
      icon: CheckCircle,
      color: "bg-amber-100 text-amber-700",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </div>
              <div className={`rounded-full p-3 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
