"use client"

import { CalendarDays, Users, Award, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const mockStats = {
  eventsAttended: 12,
  eventsOrganized: 3,
  connections: 45,
  memberSince: "Jan 2025",
}

export default function ProfileStats() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <CalendarDays className="mr-3 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Events Attended</p>
                <p className="text-2xl font-bold">{mockStats.eventsAttended}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Award className="mr-3 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Events Organized</p>
                <p className="text-2xl font-bold">{mockStats.eventsOrganized}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="mr-3 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Connections</p>
                <p className="text-2xl font-bold">{mockStats.connections}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="mr-3 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-lg font-medium">{mockStats.memberSince}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
