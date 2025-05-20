import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface EventStats {
  totalEvents: number
  pendingEvents: number
  upcomingEvents: number
  pastEvents: number
}

export function AdminEventsStats() {
  const [stats, setStats] = useState<EventStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/events/admin/stats')
        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.status}`)
        }
        const data = await response.json()
        
        const now = new Date()
        const stats: EventStats = {
          totalEvents: data.totalEvents,
          pendingEvents: data.pendingApprovals,
          upcomingEvents: data.recentActivity.events.filter((event: any) => new Date(event.date) > now).length,
          pastEvents: data.recentActivity.events.filter((event: any) => new Date(event.date) < now).length
        }
        
        setStats(stats)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
              <div className="h-2 w-full bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-destructive text-sm">{error}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEvents}</div>
          <Progress value={100} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            All events in the system
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingEvents}</div>
          <Progress 
            value={(stats.pendingEvents / stats.totalEvents) * 100} 
            className="mt-2" 
          />
          <p className="text-xs text-muted-foreground mt-2">
            Awaiting approval
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
          <Progress 
            value={(stats.upcomingEvents / stats.totalEvents) * 100} 
            className="mt-2" 
          />
          <p className="text-xs text-muted-foreground mt-2">
            Scheduled for future
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Past Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pastEvents}</div>
          <Progress 
            value={(stats.pastEvents / stats.totalEvents) * 100} 
            className="mt-2" 
          />
          <p className="text-xs text-muted-foreground mt-2">
            Completed events
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 