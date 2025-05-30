"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentRegistrationsList } from "@/components/student/student-registration-list"
import { StudentRegistrationsEmpty } from "@/components/student/student-registration-empty"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface Event {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime?: string
  location: string
  venue?: string
  category: string
  capacity: number
  _count?: {
    registrations: number
  }
}

interface Registration {
  id: string
  status: string
  createdAt: string
  event: Event
}

export default function StudentRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events/student')
      if (!response.ok) {
        throw new Error('Failed to fetch registrations')
      }
      const data = await response.json()
      setRegistrations(Array.isArray(data) ? data : [])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch registrations", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      setRegistrations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const handleCancelRegistration = async (registrationId: string) => {
    if (!confirm("Are you sure you want to cancel this registration?")) {
      return
    }

    try {
      const response = await fetch(`/api/events/register/${registrationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to cancel registration')
    }

    // Update the local state to reflect the cancellation
      setRegistrations(registrations.map((reg) => 
        reg.id === registrationId ? { ...reg, status: "CANCELLED" } : reg
      ))

      toast.success('Registration cancelled successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel registration", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  // Filter registrations by status and date
  const upcomingRegistrations = registrations.filter(
    (reg) => reg.event?.date && new Date(reg.event.date) >= new Date() && reg.status !== "CANCELLED"
  )

  const pastRegistrations = registrations.filter(
    (reg) => reg.event?.date && new Date(reg.event.date) < new Date() && reg.status !== "CANCELLED"
  )

  const cancelledRegistrations = registrations.filter((reg) => reg.status === "CANCELLED")

  if (loading) {
    return (
      <DashboardLayout
        appName="ASTU Events"
        appLogo="/placeholder.svg?height=32&width=32"
        helpText="Need Assistance?"
        helpLink="/student/support"
      >
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
    appName="ASTU Events"
    appLogo="/placeholder.svg?height=32&width=32"
    helpText="Need Assistance?"
    helpLink="/student/support"
  >
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Registrations</h1>
        <Button onClick={() => router.push("/student/events")}>Browse Events</Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming ({upcomingRegistrations.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastRegistrations.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledRegistrations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingRegistrations.length > 0 ? (
            <StudentRegistrationsList
              registrations={upcomingRegistrations}
              onCancelRegistration={handleCancelRegistration}
              showFeedbackButton={false}
            />
          ) : (
            <StudentRegistrationsEmpty
              message="You don't have any upcoming event registrations."
              buttonText="Browse Events"
              buttonLink="/student/events"
            />
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastRegistrations.length > 0 ? (
            <StudentRegistrationsList
              registrations={pastRegistrations}
              onCancelRegistration={handleCancelRegistration}
              showFeedbackButton={true}
            />
          ) : (
            <StudentRegistrationsEmpty
              message="You don't have any past event registrations."
              buttonText="Browse Events"
              buttonLink="/student/events"
            />
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          {cancelledRegistrations.length > 0 ? (
            <StudentRegistrationsList
              registrations={cancelledRegistrations}
              onCancelRegistration={handleCancelRegistration}
              showFeedbackButton={false}
              showCancelButton={false}
            />
          ) : (
            <StudentRegistrationsEmpty
              message="You don't have any cancelled event registrations."
              buttonText="Browse Events"
              buttonLink="/student/events"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
    </DashboardLayout>
  )
}
