import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Calendar, CheckCircle, AlertCircle } from "lucide-react"

export function StudentNotifications() {
  // Sample data - in a real app, this would come from your database
  const notifications = [
    {
      id: 1,
      title: "Event Registration Confirmed",
      message: "Your registration for Tech Symposium has been confirmed.",
      time: "2 hours ago",
      type: "success",
    },
    {
      id: 2,
      title: "Upcoming Event Reminder",
      message: "Career Fair is happening tomorrow. Don't forget to bring your resume!",
      time: "5 hours ago",
      type: "info",
    },
    {
      id: 3,
      title: "New Event Added",
      message: "A new workshop on AI has been added to the calendar.",
      time: "1 day ago",
      type: "info",
    },
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "info":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Recent updates and alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex space-x-3 border-b pb-3 last:border-0">
              <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
              <div>
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Notifications
        </Button>
      </CardFooter>
    </Card>
  )
}
