"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, X, Filter } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

interface EventFiltersProps {
  onFiltersChange?: (filters: {
    search?: string
    category?: string
    department?: string
    eventType?: string
    dateRange?: string
    registrationStatus?: string
    showRelevantOnly?: boolean
    hideExpired?: boolean
    yearLevel?: number
  }) => void
  departments?: string[]
  categories?: string[]
  years?: number[]
  userDepartment?: string
  userYear?: number
}

export function EventFilters({
  onFiltersChange,
  departments = ["Computer Science", "Engineering", "Business", "Arts", "Science", "Mathematics", "Student Affairs"],
  categories = ["Academic", "Social", "Sports", "Cultural", "Career", "Workshop", "Seminar", "Conference"],
  years = [1, 2, 3, 4, 5],
  userDepartment = "Computer Science",
  userYear = 3,
}: EventFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<{
    search: string
    category: string | null
    department: string | null
    eventType: string | null
    dateRange: string | null
    registrationStatus: string | null
    showRelevantOnly: boolean
    hideExpired: boolean
    yearLevel: number | null
  }>({
    search: "",
    category: null,
    department: null,
    eventType: null,
    dateRange: null,
    registrationStatus: null,
    showRelevantOnly: false,
    hideExpired: true,
    yearLevel: null,
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  useEffect(() => {
    // Update active filters for display
    const newActiveFilters: string[] = []
    if (filters.category) newActiveFilters.push(filters.category)
    if (filters.department) newActiveFilters.push(filters.department)
    if (filters.eventType) newActiveFilters.push(filters.eventType)
    if (filters.dateRange) newActiveFilters.push(filters.dateRange)
    if (filters.registrationStatus) newActiveFilters.push(filters.registrationStatus)
    if (filters.yearLevel) newActiveFilters.push(`Year ${filters.yearLevel}`)
    if (filters.showRelevantOnly) newActiveFilters.push("Relevant to me")
    if (filters.hideExpired) newActiveFilters.push("Hide expired")

    setActiveFilters(newActiveFilters)
    onFiltersChange?.(filters)
  }, [filters, onFiltersChange])

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchTerm }))
  }

  const removeFilter = (filter: string) => {
    if (filter === "Relevant to me") {
      setFilters((prev) => ({ ...prev, showRelevantOnly: false }))
    } else if (filter === "Hide expired") {
      setFilters((prev) => ({ ...prev, hideExpired: false }))
    } else if (filter.startsWith("Year ")) {
      setFilters((prev) => ({ ...prev, yearLevel: null }))
    } else if (categories.includes(filter)) {
      setFilters((prev) => ({ ...prev, category: null }))
    } else if (departments.includes(filter)) {
      setFilters((prev) => ({ ...prev, department: null }))
    } else if (["IN_PERSON", "ONLINE", "HYBRID"].includes(filter)) {
      setFilters((prev) => ({ ...prev, eventType: null }))
    } else if (["Today", "This Week", "This Month", "Upcoming"].includes(filter)) {
      setFilters((prev) => ({ ...prev, dateRange: null }))
    } else if (["Registered", "Not Registered", "Waitlisted", "Pending"].includes(filter)) {
      setFilters((prev) => ({ ...prev, registrationStatus: null }))
    }
  }

  const clearAllFilters = () => {
    setFilters({
      search: "",
      category: null,
      department: null,
      eventType: null,
      dateRange: null,
      registrationStatus: null,
      showRelevantOnly: false,
      hideExpired: true,
      yearLevel: null,
    })
    setSearchTerm("")
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button variant="outline" onClick={handleSearch}>
          <Search className="h-4 w-4" />
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[300px] sm:w-[400px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter Events</SheetTitle>
              <SheetDescription>Customize your event view</SheetDescription>
            </SheetHeader>

            <div className="py-4 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Registration Status</h3>
                <Select
                  value={filters.registrationStatus || ""}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, registrationStatus: value || null }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All statuses</SelectItem>
                    <SelectItem value="Registered">Registered</SelectItem>
                    <SelectItem value="Not Registered">Not Registered</SelectItem>
                    <SelectItem value="Waitlisted">Waitlisted</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Category</h3>
                <Select
                  value={filters.category || ""}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value || null }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Department</h3>
                <Select
                  value={filters.department || ""}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, department: value || null }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All departments</SelectItem>
                    {departments.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Year Level</h3>
                <Select
                  value={filters.yearLevel?.toString() || ""}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, yearLevel: value ? Number(value) : null }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All years</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        Year {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Event Type</h3>
                <Select
                  value={filters.eventType || ""}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, eventType: value || null }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All types</SelectItem>
                    <SelectItem value="IN_PERSON">In Person</SelectItem>
                    <SelectItem value="ONLINE">Online</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Date Range</h3>
                <Select
                  value={filters.dateRange || ""}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, dateRange: value || null }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All dates</SelectItem>
                    <SelectItem value="Today">Today</SelectItem>
                    <SelectItem value="This Week">This Week</SelectItem>
                    <SelectItem value="This Month">This Month</SelectItem>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="relevant"
                    checked={filters.showRelevantOnly}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({ ...prev, showRelevantOnly: checked === true }))
                    }
                  />
                  <Label htmlFor="relevant">Show only events relevant to me</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="expired"
                    checked={filters.hideExpired}
                    onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, hideExpired: checked === true }))}
                  />
                  <Label htmlFor="expired">Hide events past registration deadline</Label>
                </div>
              </div>
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button>Apply Filters</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="gap-1">
              {filter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter(filter)} />
            </Badge>
          ))}
          {activeFilters.length > 1 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7 text-xs">
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
