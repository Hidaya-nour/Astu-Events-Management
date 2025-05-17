"use client"

import { useState } from "react"
import { Loader2, AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DeleteEventDialogProps {
  eventId: string | null
  eventTitle?: string
  isOpen: boolean
  onClose: () => void
  onConfirm: (eventId: string) => Promise<void>
}

export function DeleteEventDialog({
  eventId,
  eventTitle,
  isOpen,
  onClose,
  onConfirm,
}: DeleteEventDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!eventId) return
    
    setIsDeleting(true)
    try {
      await onConfirm(eventId)
      onClose()
    } catch (error) {
      console.error("Failed to delete event:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Event
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this event? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm font-medium">
            You are about to delete:
          </p>
          <p className="mt-1 text-sm font-bold">
            {eventTitle || "Unknown Event"}
          </p>
          
          <div className="mt-4 rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">
              This will permanently delete the event, all registrations, and associated data.
              Attendees will be notified that the event has been cancelled.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Event"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
    