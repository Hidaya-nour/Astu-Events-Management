import { Badge } from "@/components/ui/badge"
import { Sparkles, GraduationCap } from "lucide-react"

interface RelevanceBadgeProps {
  type: "DEPARTMENT" | "YEAR" | "RECOMMENDED"
  className?: string
}

export function RelevanceBadge({ type, className = "" }: RelevanceBadgeProps) {
  switch (type) {
    case "DEPARTMENT":
      return (
        <Badge variant="outline" className={`bg-blue-100 text-blue-800 border-blue-200 ${className}`}>
          <GraduationCap className="h-3 w-3 mr-1" />
          Your Department
        </Badge>
      )
    case "YEAR":
      return (
        <Badge variant="outline" className={`bg-purple-100 text-purple-800 border-purple-200 ${className}`}>
          <GraduationCap className="h-3 w-3 mr-1" />
          Your Year
        </Badge>
      )
    case "RECOMMENDED":
      return (
        <Badge variant="outline" className={`bg-amber-100 text-amber-800 border-amber-200 ${className}`}>
          <Sparkles className="h-3 w-3 mr-1" />
          Recommended
        </Badge>
      )
    default:
      return null
  }
}
