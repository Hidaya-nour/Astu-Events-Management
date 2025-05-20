"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"

interface Event {
  id: string
  title: string
  date: Date
  startTime: string
  endTime: string
  location: string
  category: string
  status: string
  capacity: number
  currentAttendees: number
}

interface EventsFilterProps {
  events: Event[]
  onFilterChange: (filteredEvents: Event[]) => void
}

export function EventsFilter({ events, onFilterChange }: EventsFilterProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [statusFilters, setStatusFilters] = useState({
    APPROVED: true,
    PENDING: true,
    REJECTED: true,
    CANCELLED: true,
  })
  const [categoryFilters, setCategoryFilters] = useState({
    TECHNOLOGY: true,
    WORKSHOP: true,
    COMPETITION: true,
    CAREER: true,
    ACADEMIC: true,
    CULTURAL: true,
    SPORTS: true,
  })

  const toggleStatusFilter = (status: keyof typeof statusFilters) => {
    setStatusFilters((prev) => ({
      ...prev,
      [status]: !prev[status],
    }))
  }

  const toggleCategoryFilter = (category: keyof typeof categoryFilters) => {
    setCategoryFilters((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const resetFilters = () => {
    setDateRange(undefined)
    setStatusFilters({
      APPROVED: true,
      PENDING: true,
      REJECTED: true,
      CANCELLED: true,
    })
    setCategoryFilters({
      TECHNOLOGY: true,
      WORKSHOP: true,
      COMPETITION: true,
      CAREER: true,
      ACADEMIC: true,
      CULTURAL: true,
      SPORTS: true,
    })
  }

  useEffect(() => {
    // Apply filters to events
    const filteredEvents = events.filter((event) => {
      // Filter by status
      if (!statusFilters[event.status as keyof typeof statusFilters]) {
        return false
      }

      // Filter by category
      if (!categoryFilters[event.category as keyof typeof categoryFilters]) {
        return false
      }

      // Filter by date
      if (dateRange && (!dateRange.from || !dateRange.to || !isSameDay(event.date, dateRange.from) || !isSameDay(event.date, dateRange.to))) {
        return false
      }

      return true
    })

    onFilterChange(filteredEvents)
  }, [events, statusFilters, categoryFilters, dateRange, onFilterChange])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Status</Label>
        <div className="space-y-2">
          {Object.entries(statusFilters).map(([status, checked]) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status}`}
                checked={checked}
                onCheckedChange={() => toggleStatusFilter(status as keyof typeof statusFilters)}
              />
              <Label
                htmlFor={`status-${status}`}
                className="text-sm font-normal"
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-medium">Category</Label>
        <div className="space-y-2">
          {Object.entries(categoryFilters).map(([category, checked]) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={checked}
                onCheckedChange={() => toggleCategoryFilter(category as keyof typeof categoryFilters)}
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm font-normal"
              >
                {category.charAt(0) + category.slice(1).toLowerCase()}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-medium">Date Range</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange?.from && "text-muted-foreground"
              )}
            >
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
                "Select date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-medium">Attendance</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="full" />
            <Label htmlFor="full" className="text-sm font-normal">Fully Booked</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="available" defaultChecked />
            <Label htmlFor="available" className="text-sm font-normal">Spots Available</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="low" />
            <Label htmlFor="low" className="text-sm font-normal">Low Attendance (50%)</Label>
          </div>
        </div>
      </div>

      <Separator />

      <Button variant="outline" className="w-full" onClick={resetFilters}>
        Reset Filters
      </Button>
    </div>
  )
}
