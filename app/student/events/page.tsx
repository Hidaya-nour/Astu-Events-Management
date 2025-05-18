"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { StudentEventsList } from "@/components/student/student-events-list"
import { StudentEventsFilter } from "@/components/student/student-events-filter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Grid3X3 } from 'lucide-react'
import { StudentEventsCalendar } from "@/components/student/student-events-calendar"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function StudentEventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState("upcoming")

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
  }

  return (
    <div className="space-y-6">
     <DashboardLayout
      appName="ASTU Events"
      appLogo="/placeholder.svg?height=32&width=32"
      helpText="Need Assistance?"
      helpLink="/student/support"
    >
      <StudentEventsFilter 
        onSearchChange={handleSearchChange} 
        onFilterChange={handleFilterChange} 
        onSortChange={handleSortChange} 
      />

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Available Events</h2>
          <TabsList>
            <TabsTrigger value="grid">
              <Grid3X3 className="h-4 w-4 mr-2" />
              Grid View
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid" className="mt-0">
          <StudentEventsList 
            searchQuery={searchQuery} 
            filters={filters} 
            sortBy={sortBy} 
          />
        </TabsContent>

        <TabsContent value="calendar" className="mt-0">
          <StudentEventsCalendar 
            searchQuery={searchQuery} 
            filters={filters} 
          />
        </TabsContent>
      </Tabs>
      </DashboardLayout>
    </div>
  )
}
