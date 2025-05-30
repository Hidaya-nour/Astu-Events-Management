import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Star, Users } from "lucide-react"
import { useEffect, useState } from "react"

export function DashboardStats() {
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    thisWeekEvents: 0,
    favorites: 0,
    attended: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch upcoming events
        const upcomingRes = await fetch('/api/events?sort=upcoming')
        const upcomingData = await upcomingRes.json()
        
        // Fetch this week's events
        const today = new Date()
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        const weekRes = await fetch(`/api/events?startDate=${today.toISOString()}&endDate=${nextWeek.toISOString()}`)
        const weekData = await weekRes.json()

        // Fetch attended events
        const attendedRes = await fetch('/api/events?status=ATTENDED')
        const attendedData = await attendedRes.json()

        setStats({
          upcomingEvents: upcomingData.total || 0,
          thisWeekEvents: weekData.total || 0,
          favorites: 0, // This would need a separate favorites API endpoint
          attended: attendedData.total || 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  const statsData = [
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents.toString(),
      description: "Events you're registered for",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "This Week",
      value: stats.thisWeekEvents.toString(),
      description: "Events happening this week",
      icon: Clock,
      color: "text-green-600",
    },
    {
      title: "Favorites",
      value: stats.favorites.toString(),
      description: "Events you've favorited",
      icon: Star,
      color: "text-yellow-600",
    },
    {
      title: "Attended",
      value: stats.attended.toString(),
      description: "Events attended this semester",
      icon: Users,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
