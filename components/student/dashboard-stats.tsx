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
        // Fetch registered events
        const upcomingRes = await fetch('/api/registration/student')
        const upcomingData = await upcomingRes.json()
        
        // Filter for confirmed registrations only
        const confirmedEvents = upcomingData.filter((event: any) => event.status === 'CONFIRMED')
        
        // Filter upcoming events
        const today = new Date()
        const upcomingEvents = confirmedEvents.filter((event: any) => new Date(event.date) >= today)
        
        // Filter this week's events
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        const thisWeekEvents = confirmedEvents.filter((event: any) => {
          const eventDate = new Date(event.date)
          return eventDate >= today && eventDate <= nextWeek
        })

        // Filter past attended events
        const pastEvents = confirmedEvents.filter((event: any) => new Date(event.date) < today)

        setStats({
          upcomingEvents: upcomingEvents.length,
          thisWeekEvents: thisWeekEvents.length,
          favorites: 0, // This would need a separate favorites API endpoint
          attended: pastEvents.length
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
