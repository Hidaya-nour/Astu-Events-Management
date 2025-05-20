"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterState {
  status: {
    approved: boolean
    pending: boolean
    rejected: boolean
    cancelled: boolean
  }
  categories: {
    TECHNOLOGY: boolean
    WORKSHOP: boolean
    COMPETITION: boolean
    CAREER: boolean
    ACADEMIC: boolean
    CULTURAL: boolean
    SPORTS: boolean
    SEMINAR: boolean
    CONFERENCE: boolean
  }
  organizer: string
  timePeriod: string
  dateRange: {
    from?: Date
    to?: Date
  }
  featured: {
    featured: boolean
    notFeatured: boolean
  }
}

interface AdminEventsFilterProps {
  onFilterChange: (filters: FilterState) => void
}

export function AdminEventsFilter({ onFilterChange }: AdminEventsFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    status: {
      approved: true,
      pending: true,
      rejected: false,
      cancelled: false
    },
    categories: {
      TECHNOLOGY: true,
      WORKSHOP: true,
      COMPETITION: true,
      CAREER: true,
      ACADEMIC: true,
      CULTURAL: true,
      SPORTS: true,
      SEMINAR: true,
      CONFERENCE: true
    },
    organizer: 'all',
    timePeriod: 'all',
    dateRange: {
      from: undefined,
      to: undefined
    },
    featured: {
      featured: false,
      notFeatured: false
    }
  })

  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const handleStatusChange = (status: keyof FilterState['status']) => {
    setFilters(prev => ({
      ...prev,
      status: {
        ...prev.status,
        [status]: !prev.status[status]
      }
    }))
  }

  const handleCategoryChange = (category: keyof FilterState['categories']) => {
    setFilters(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: !prev.categories[category]
      }
    }))
  }

  const handleOrganizerChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      organizer: value
    }))
  }

  const handleTimePeriodChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      timePeriod: value,
      dateRange: value === 'custom' ? prev.dateRange : { from: undefined, to: undefined }
    }))
  }

  const handleDateRangeChange = (range: { from: Date; to?: Date } | undefined) => {
    setFilters(prev => ({
      ...prev,
      dateRange: range || { from: undefined, to: undefined }
    }))
  }

  const handleFeaturedChange = (type: keyof FilterState['featured']) => {
    setFilters(prev => ({
      ...prev,
      featured: {
        ...prev.featured,
        [type]: !prev.featured[type]
      }
    }))
  }

  const handleReset = () => {
    setFilters({
      status: {
        approved: true,
        pending: true,
        rejected: false,
        cancelled: false
      },
      categories: {
        TECHNOLOGY: true,
        WORKSHOP: true,
        COMPETITION: true,
        CAREER: true,
        ACADEMIC: true,
        CULTURAL: true,
        SPORTS: true,
        SEMINAR: true,
        CONFERENCE: true
      },
      organizer: 'all',
      timePeriod: 'all',
      dateRange: {
        from: undefined,
        to: undefined
      },
      featured: {
        featured: false,
        notFeatured: false
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Status</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="approved" 
              checked={filters.status.approved}
              onCheckedChange={() => handleStatusChange('approved')}
            />
            <Label htmlFor="approved" className="text-sm font-normal">
              Approved
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="pending" 
              checked={filters.status.pending}
              onCheckedChange={() => handleStatusChange('pending')}
            />
            <Label htmlFor="pending" className="text-sm font-normal">
              Pending
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="rejected" 
              checked={filters.status.rejected}
              onCheckedChange={() => handleStatusChange('rejected')}
            />
            <Label htmlFor="rejected" className="text-sm font-normal">
              Rejected
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="cancelled" 
              checked={filters.status.cancelled}
              onCheckedChange={() => handleStatusChange('cancelled')}
            />
            <Label htmlFor="cancelled" className="text-sm font-normal">
              Cancelled
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-medium">Category</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="technology" 
              checked={filters.categories.TECHNOLOGY}
              onCheckedChange={() => handleCategoryChange('TECHNOLOGY')}
            />
            <Label htmlFor="technology" className="text-sm font-normal">
              Technology
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="workshop" 
              checked={filters.categories.WORKSHOP}
              onCheckedChange={() => handleCategoryChange('WORKSHOP')}
            />
            <Label htmlFor="workshop" className="text-sm font-normal">
              Workshop
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="competition" 
              checked={filters.categories.COMPETITION}
              onCheckedChange={() => handleCategoryChange('COMPETITION')}
            />
            <Label htmlFor="competition" className="text-sm font-normal">
              Competition
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="career" 
              checked={filters.categories.CAREER}
              onCheckedChange={() => handleCategoryChange('CAREER')}
            />
            <Label htmlFor="career" className="text-sm font-normal">
              Career
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="academic" 
              checked={filters.categories.ACADEMIC}
              onCheckedChange={() => handleCategoryChange('ACADEMIC')}
            />
            <Label htmlFor="academic" className="text-sm font-normal">
              Academic
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="cultural" 
              checked={filters.categories.CULTURAL}
              onCheckedChange={() => handleCategoryChange('CULTURAL')}
            />
            <Label htmlFor="cultural" className="text-sm font-normal">
              Cultural
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="sports" 
              checked={filters.categories.SPORTS}
              onCheckedChange={() => handleCategoryChange('SPORTS')}
            />
            <Label htmlFor="sports" className="text-sm font-normal">
              Sports
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="seminar" 
              checked={filters.categories.SEMINAR}
              onCheckedChange={() => handleCategoryChange('SEMINAR')}
            />
            <Label htmlFor="seminar" className="text-sm font-normal">
              Seminar
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="conference" 
              checked={filters.categories.CONFERENCE}
              onCheckedChange={() => handleCategoryChange('CONFERENCE')}
            />
            <Label htmlFor="conference" className="text-sm font-normal">
              Conference
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-medium">Organizer</Label>
        <Select value={filters.organizer} onValueChange={handleOrganizerChange}>
          <SelectTrigger>
            <SelectValue placeholder="All organizers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All organizers</SelectItem>
            <SelectItem value="cs-dept">Computer Science Department</SelectItem>
            <SelectItem value="ai-club">AI Research Club</SelectItem>
            <SelectItem value="career">Career Services</SelectItem>
            <SelectItem value="mobile-club">Mobile Dev Club</SelectItem>
            <SelectItem value="student-union">Student Union</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-medium">Time Period</Label>
        <RadioGroup value={filters.timePeriod} onValueChange={handleTimePeriodChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="text-sm font-normal">
              All Events
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upcoming" id="upcoming" />
            <Label htmlFor="upcoming" className="text-sm font-normal">
              Upcoming Events
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="past" id="past" />
            <Label htmlFor="past" className="text-sm font-normal">
              Past Events
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom" className="text-sm font-normal">
              Custom Range
            </Label>
          </div>
        </RadioGroup>
      </div>

      {filters.timePeriod === 'custom' && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !filters.dateRange.from && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "LLL dd, y")} - {format(filters.dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(filters.dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Select date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar 
                mode="range" 
                selected={{
                  from: filters.dateRange.from || undefined,
                  to: filters.dateRange.to || undefined
                }}
                onSelect={handleDateRangeChange} 
                initialFocus 
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      <Separator />

      <Separator />

      <Button className="w-full" onClick={() => onFilterChange(filters)}>Apply Filters</Button>
     
    </div>
  )
}
