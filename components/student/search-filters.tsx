import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"
import { useState, useEffect } from "react"

interface SearchFiltersProps {
  onSearch: (filters: {
    search: string
    category: string[]
    date: string
    location: string
  }) => void
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string[]>([])
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleSearch = () => {
    const filters = {
      search,
      category,
      date,
      location,
    }
    onSearch(filters)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(prev => {
      const newCategories = prev.includes(value)
        ? prev.filter(c => c !== value)
        : [...prev, value]
      return newCategories
    })
  }

  const handleDateChange = (value: string) => {
    setDate(value)
  }

  const handleLocationChange = (value: string) => {
    setLocation(value)
  }

  const removeFilter = (filter: string) => {
    if (category.includes(filter)) {
      setCategory(prev => prev.filter(c => c !== filter))
    } else if (date === filter) {
      setDate("")
    } else if (location === filter) {
      setLocation("")
    }
  }

  useEffect(() => {
    const filters = [
      ...category,
      date,
      location,
    ].filter(Boolean)
    setActiveFilters(filters)
  }, [category, date, location])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search events..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
          />
        </div>
        <Button variant="outline" size="icon" onClick={handleSearch}>
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Select value={category[0]} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACADEMIC">Academic</SelectItem>
            <SelectItem value="SOCIAL">Social</SelectItem>
            <SelectItem value="SPORTS">Sports</SelectItem>
            <SelectItem value="CULTURAL">Cultural</SelectItem>
            <SelectItem value="CAREER">Career</SelectItem>
          </SelectContent>
        </Select>

        <Select value={date} onValueChange={handleDateChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
          </SelectContent>
        </Select>

        <Select value={location} onValueChange={handleLocationChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ON_CAMPUS">On Campus</SelectItem>
            <SelectItem value="LIBRARY">Library</SelectItem>
            <SelectItem value="AUDITORIUM">Auditorium</SelectItem>
            <SelectItem value="ONLINE">Online</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSearch} variant="secondary">
          Apply Filters
        </Button>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge 
              key={filter} 
              variant="secondary" 
              className="gap-1 cursor-pointer"
              onClick={() => {
                removeFilter(filter)
                handleSearch()
              }}
            >
              {filter}
              <X className="h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
