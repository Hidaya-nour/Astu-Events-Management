"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { FeedbackForm } from "./feedback-form"
import { MessageSquare } from "lucide-react"

interface FeedbackButtonProps {
  eventId: string
  eventName: string
  eventEndTime: Date
}

export function FeedbackButton({ eventId, eventName, eventEndTime }: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-primary/10"
        >
          <MessageSquare className="h-4 w-4" />
          Give Feedback
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Event Feedback</SheetTitle>
          <SheetDescription>Share your thoughts about &quot;{eventName}&quot;</SheetDescription>
        </SheetHeader>
        <FeedbackForm eventId={eventId} onSuccess={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
