import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export function MyRegistrations() {
  // Sample data - in a real app, this would come from your database
  const registrations = [
    {
      id: 1,
      event: "Tech Symposium",
      date: "May 15, 2025",
      status: "Confirmed",
    },
    {
      id: 2,
      event: "Career Fair",
      date: "May 25, 2025",
      status: "Pending",
    },
    {
      id: 3,
      event: "Workshop on AI",
      date: "June 5, 2025",
      status: "Confirmed",
    },
  ]

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Confirmed: "bg-green-100 text-green-800 hover:bg-green-100",
      Pending: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      Cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
    }
    return colors[status] || "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Registrations</CardTitle>
        <CardDescription>Events you've registered for</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {registrations.map((reg) => (
            <div key={reg.id} className="flex justify-between items-center border-b pb-3 last:border-0">
              <div>
                <p className="font-medium">{reg.event}</p>
                <p className="text-sm text-muted-foreground">{reg.date}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getStatusBadge(reg.status)}>
                  {reg.status}
                </Badge>
                {reg.status === "Confirmed" && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Registrations
        </Button>
      </CardFooter>
    </Card>
  )
}
