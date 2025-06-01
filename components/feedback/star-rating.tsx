"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  max?: number
}

export function StarRating({ value, onChange, max = 5 }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0)

  return (
    <div className="flex gap-1">
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1
        return (
          <button
            key={i}
            type="button"
            className={cn(
              "rounded-md p-1 transition-all",
              (hoverValue || value) >= starValue ? "text-amber-500" : "text-muted-foreground",
              (hoverValue || value) >= starValue ? "hover:text-amber-600" : "hover:text-amber-400",
            )}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(0)}
          >
            <Star
              className={cn(
                "h-6 w-6 transition-all",
                (hoverValue || value) >= starValue ? "fill-current" : "fill-none",
              )}
            />
            <span className="sr-only">
              Rate {starValue} out of {max}
            </span>
          </button>
        )
      })}
    </div>
  )
}
