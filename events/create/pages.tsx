"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Info, MapPin, Upload, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function CreateEventPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    venue: "",
    capacity: "",
    image: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean) => {
    e.preventDefault()

    // Basic validation
    if (!formData.title || !formData.description || !formData.category || !formData.date) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    try {
      // In a real app, you would make an API call to create the event
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: isDraft ? "Draft saved" : "Event submitted for approval",
        description: isDraft
          ? "Your event has been saved as a draft."
          : "Your event has been submitted and is pending approval.",
      })

      router.push("/dashboard/organizer")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating your event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center">
        <Link href="/dashboard/organizer" className="mr-4 text-primary-600 hover:text-primary-800">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back to dashboard</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
          <p className="text-gray-500">Fill in the details to create a new event at ASTU University.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Basic information about your event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Event Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide a detailed description of your event"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="career">Career</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Date and Time</CardTitle>
              <CardDescription>When will your event take place?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">
                  Date <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startTime">
                    Start Time <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">
                    End Time <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>Where will your event take place?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.location} onValueChange={(value) => handleSelectChange("location", value)}>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main-campus">Main Campus</SelectItem>
                    <SelectItem value="science-complex">Science Complex</SelectItem>
                    <SelectItem value="engineering-building">Engineering Building</SelectItem>
                    <SelectItem value="student-center">Student Center</SelectItem>
                    <SelectItem value="sports-complex">Sports Complex</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue">
                  Specific Venue <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                  <Input
                    id="venue"
                    name="venue"
                    placeholder="e.g., Room 302, Auditorium, Field"
                    value={formData.venue}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Image</CardTitle>
              <CardDescription>Upload an image for your event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6">
                <Upload className="mb-2 h-8 w-8 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">Drag and drop an image or click to browse</p>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    // Handle file upload
                  }}
                />
                <Button variant="outline" onClick={() => document.getElementById("image")?.click()} className="mt-2">
                  Upload Image
                </Button>
              </div>
              <div className="text-xs text-gray-500">
                <p>Recommended image size: 1200 x 600 pixels</p>
                <p>Maximum file size: 5MB</p>
                <p>Supported formats: JPG, PNG</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Capacity</CardTitle>
              <CardDescription>How many attendees can participate?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">
                  Maximum Capacity <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-gray-500" />
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    placeholder="e.g., 50"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submission</CardTitle>
              <CardDescription>Review and submit your event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                <div className="flex">
                  <Info className="mr-2 h-4 w-4" />
                  <div>
                    <p>Your event will be reviewed by an administrator before it is published.</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                className="border-primary-600 text-primary-600 hover:bg-primary-50"
                onClick={(e) => handleSubmit(e, true)}
                disabled={isLoading}
              >
                Save as Draft
              </Button>
              <Button
                className="bg-primary-600 hover:bg-primary-700 text-white"
                onClick={(e) => handleSubmit(e, false)}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit for Approval"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
