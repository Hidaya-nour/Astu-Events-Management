"use client"

import { useState } from "react"
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

export function AdminEventsFilter() {
  const [dateRange, setDateRange] = useState<{
    from?: Date
    to?: Date
  }>({
    from: undefined,
    to: undefined,
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Status</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="approved" defaultChecked />
            <Label htmlFor="approved" className="text-sm font-normal">
              Approved
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="pending" defaultChecked />
            <Label htmlFor="pending" className="text-sm font-normal">
              Pending
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="rejected" />
            <Label htmlFor="rejected" className="text-sm font-normal">
              Rejected
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="cancelled" />
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
            <Checkbox id="technology" defaultChecked />
            <Label htmlFor="technology" className="text-sm font-normal">
              Technology
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="workshop" defaultChecked />
            <Label htmlFor="workshop" className="text-sm font-normal">
              Workshop
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="competition" defaultChecked />
            <Label htmlFor="competition" className="text-sm font-normal">
              Competition
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="career" defaultChecked />
            <Label htmlFor="career" className="text-sm font-normal">
              Career
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="academic" defaultChecked />
            <Label htmlFor="academic" className="text-sm font-normal">
              Academic
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="cultural" defaultChecked />
            <Label htmlFor="cultural" className="text-sm font-normal">
              Cultural
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="sports" defaultChecked />
            <Label htmlFor="sports" className="text-sm font-normal">
              Sports
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-medium">Organizer</Label>
        <Select>
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
        <RadioGroup defaultValue="all">
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

      <div className="space-y-2">
        <Label className="text-sm font-medium">Date Range</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
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
            <Calendar mode="range" selected={dateRange} onSelect={setDateRange} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-medium">Featured Status</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="featured" />
            <Label htmlFor="featured" className="text-sm font-normal">
              Featured Events
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="not-featured" />
            <Label htmlFor="not-featured" className="text-sm font-normal">
              Non-Featured Events
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      <Button className="w-full">Apply Filters</Button>
      <Button variant="outline" className="w-full">
        Reset
      </Button>
    </div>
  )
}
