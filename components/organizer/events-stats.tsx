import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, CheckCircle, Clock } from "lucide-react"

interface Stats {
  totalEvents: number
  upcomingEvents: number
  totalAttendees: number
}

interface EventsStatsProps {
  stats: Stats
}

export function EventsStats({ stats }: EventsStatsProps) {
  const statsData = [
    {
      title: "Total Events",
      value: stats.totalEvents.toString(),
      description: "All events",
      icon: Calendar,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents.toString(),
      description: "Next 30 days",
      icon: Clock,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Total Attendees",
      value: stats.totalAttendees.toString(),
      description: "Across all events",
      icon: Users,
      color: "bg-purple-100 text-purple-700",
    },
   
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statsData.map((stat, index) => (
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
