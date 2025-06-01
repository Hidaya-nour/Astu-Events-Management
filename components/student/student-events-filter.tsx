"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, CalendarIcon, Filter, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"

interface StudentEventsFilterProps {
  onSearchChange: (query: string) => void
  onFilterChange: (filters: any) => void
  onSortChange: (sort: string) => void
}

export function StudentEventsFilter({ onSearchChange, onFilterChange, onSortChange }: StudentEventsFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [eventType, setEventType] = useState<string | undefined>()
  const [categories, setCategories] = useState<Record<string, boolean>>({
    academic: false,
    technical: false,
    cultural: false,
    sports: false,
    workshop: false,
    other: false,
  })
  const [sortBy, setSortBy] = useState("upcoming")
  const [filtersApplied, setFiltersApplied] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(searchQuery)
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updatedCategories = { ...categories, [category]: checked }
    setCategories(updatedCategories)
  }

  const applyFilters = () => {
    // Convert categories to an array of selected categories
    const selectedCategories = Object.entries(categories)
      .filter(([_, selected]) => selected)
      .map(([category]) => category.toUpperCase())

    onFilterChange({
      category: selectedCategories,
      eventType: eventType,
      dateRange: dateRange,
    })

    setFiltersApplied(true)
  }

  const resetFilters = () => {
    setCategories({
      academic: false,
      technical: false,
      cultural: false,
      sports: false,
      workshop: false,
      other: false,
    })
    setDateRange(undefined)
    setEventType(undefined)

    onFilterChange({})
    setFiltersApplied(false)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    onSortChange(value)
  }

  return (
    <Card className="bg-card">
      <CardContent className="p-4">
        <form onSubmit={handleSearch} className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" size="sm" className="absolute right-1 top-1 h-8">
            Search
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 md:flex-nowrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto justify-start">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {filtersApplied && <span className="ml-2 rounded-full bg-primary w-2 h-2" />}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Event Type</h4>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All event types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_PERSON">In Person</SelectItem>
                      <SelectItem value="ONLINE">Online</SelectItem>
                      <SelectItem value="HYBRID">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Date Range</h4>
                  <div className="grid gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange?.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="categories">
                    <AccordionTrigger>Categories</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="academic"
                            checked={categories.academic}
                            onCheckedChange={(checked) => handleCategoryChange("academic", checked as boolean)}
                          />
                          <Label htmlFor="academic">Academic</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="technical"
                            checked={categories.technical}
                            onCheckedChange={(checked) => handleCategoryChange("technical", checked as boolean)}
                          />
                          <Label htmlFor="technical">Technical</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="cultural"
                            checked={categories.cultural}
                            onCheckedChange={(checked) => handleCategoryChange("cultural", checked as boolean)}
                          />
                          <Label htmlFor="cultural">Cultural</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="sports"
                            checked={categories.sports}
                            onCheckedChange={(checked) => handleCategoryChange("sports", checked as boolean)}
                          />
                          <Label htmlFor="sports">Sports</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="workshop"
                            checked={categories.workshop}
                            onCheckedChange={(checked) => handleCategoryChange("workshop", checked as boolean)}
                          />
                          <Label htmlFor="workshop">Workshop</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="other"
                            checked={categories.other}
                            onCheckedChange={(checked) => handleCategoryChange("other", checked as boolean)}
                          />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    <X className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button size="sm" onClick={applyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="attendees">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
