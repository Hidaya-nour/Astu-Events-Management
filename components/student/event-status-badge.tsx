import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock } from "lucide-react"
// import { CheckCircle, Clock } from "lucide-react"

interface EventStatusBadgeProps {
  status: "REGISTERED" | "WAITLISTED" | "PENDING" | "NOT_REGISTERED" | "EXPIRED"
  className?: string
}

export function EventStatusBadge({ status, className = "" }: EventStatusBadgeProps) {
  switch (status) {
    case "REGISTERED":
      return (
        <Badge variant="outline" className={`bg-green-100 text-green-800 border-green-200 ${className}`}>
          <CheckCircle className="h-3 w-3 mr-1" />
          Registered
        </Badge>
      )
    case "WAITLISTED":
      return (
        <Badge variant="outline" className={`bg-orange-100 text-orange-800 border-orange-200 ${className}`}>
          <Clock className="h-3 w-3 mr-1" />
          Waitlisted
        </Badge>
      )
    case "PENDING":
      return (
        <Badge variant="outline" className={`bg-yellow-100 text-yellow-800 border-yellow-200 ${className}`}>
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    case "EXPIRED":
      return (
        <Badge variant="outline" className={`bg-gray-100 text-gray-800 border-gray-200 ${className}`}>
          Registration Closed
        </Badge>
      )
    default:
      return null
  }
}
