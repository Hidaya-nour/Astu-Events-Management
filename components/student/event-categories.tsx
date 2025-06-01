import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Laptop, Music, Briefcase, Trophy, BookOpen } from "lucide-react"

export function EventCategories() {
  // Sample data - in a real app, this would come from your database
  const categories = [
    {
      name: "Technology",
      count: 12,
      icon: Laptop,
      color: "text-blue-500",
    },
    {
      name: "Cultural",
      count: 8,
      icon: Music,
      color: "text-pink-500",
    },
    {
      name: "Career",
      count: 15,
      icon: Briefcase,
      color: "text-green-500",
    },
    {
      name: "Sports",
      count: 10,
      icon: Trophy,
      color: "text-orange-500",
    },
    {
      name: "Academic",
      count: 20,
      icon: BookOpen,
      color: "text-purple-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Categories</CardTitle>
        <CardDescription>Browse events by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`rounded-full p-2 mr-3 bg-muted ${category.color}`}>
                  <category.icon className="h-4 w-4" />
                </div>
                <span className="font-medium">{category.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{category.count} events</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Categories
        </Button>
      </CardFooter>
    </Card>
  )
}
