"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, MapPin, Users, ImageIcon, X, Plus, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const EVENT_CATEGORIES = [
  "Academic",
  "Sports",
  "Cultural",
  "Technology",
  "Workshop",
  "Seminar",
  "Conference",
  "Competition",
  "Career",
  "Other"
]


const EVENT_TYPES = [
  { value: "IN_PERSON", label: "In Person" },
  { value: "ONLINE", label: "Online" },
  { value: "HYBRID", label: "Hybrid" }
]

export function CreateEventForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: undefined as Date | undefined,
    startTime: "",
    endTime: "",
    location: "",
    venue: "",
    category: "",
    capacity: "",
    registrationDeadline: undefined as Date | undefined,
    isPublic: true,
    requiresApproval: false,
    allowFeedback: true,
    organizerInfo: true,
    tags: [] as string[],
    customTag: "",
    eventType: "IN_PERSON",
    department: "",
    contactEmail: "",
    contactPhone: "",
  })

  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState("basic")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  // const { toast } = useToast()
  const router = useRouter()

  
  const sucees_toast = (message) => toast.success(message)
  const error_toast = (message) => toast.error(message)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Basic Info Validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    if (!formData.date) {
      newErrors.date = "Event date is required"
    } else if (formData.date < new Date()) {
      newErrors.date = "Event date cannot be in the past"
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required"
    }

    if (formData.endTime && formData.startTime) {
      const [startHours, startMinutes] = formData.startTime.split(":").map(Number)
      const [endHours, endMinutes] = formData.endTime.split(":").map(Number)
      const startTime = startHours * 60 + startMinutes
      const endTime = endHours * 60 + endMinutes

      if (endTime <= startTime) {
        newErrors.endTime = "End time must be after start time"
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (!formData.capacity) {
      newErrors.capacity = "Capacity is required"
    } else if (isNaN(Number(formData.capacity)) || Number(formData.capacity) <= 0) {
      newErrors.capacity = "Capacity must be a positive number"
    }

    // Details Validation
    if (formData.registrationDeadline && formData.date) {
      if (formData.registrationDeadline > formData.date) {
        newErrors.registrationDeadline = "Registration deadline cannot be after event date"
      }
    }

    // Email validation
    if (formData.contactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.contactEmail)) {
        newErrors.contactEmail = "Invalid email format"
      }
    }

    // Phone validation
    if (formData.contactPhone) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/
      if (!phoneRegex.test(formData.contactPhone)) {
        newErrors.contactPhone = "Phone number must start with + followed by 1-14 digits"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user makes a selection
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [name]: date }))
    // Clear error when user selects a date
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleTagAdd = () => {
    if (formData.customTag && !formData.tags.includes(formData.customTag)) {
      if (formData.tags.length >= 10) {
        
      error_toast("Maximum tags reached. You can add up to 10 tags only.")

        return
      }
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.customTag],
        customTag: "",
      }))
    }
  }

  const handleTagRemove = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages = Array.from(files)
    if (images.length + newImages.length > 5) {
     
      error_toast("Maximum images reached. You can upload up to 5 images only.")

      return
    }

    setImages((prev) => [...prev, ...newImages])

    // Create URLs for preview
    const newImageUrls = newImages.map((file) => URL.createObjectURL(file))
    setImageUrls((prev) => [...prev, ...newImageUrls])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    URL.revokeObjectURL(imageUrls[index])
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Validation Error. Please fix the errors in the form")
      return
    }

    setIsLoading(true)

    try {
      // First, upload all images to Cloudinary
      const uploadedImageUrls = []
      for (const image of images) {
        const formData = new FormData()
        formData.append('file', image)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }

        const { url } = await uploadResponse.json()
        uploadedImageUrls.push(url)
      }

      // Prepare event data according to the validation schema
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date?.toISOString().split('T')[0], // Format as YYYY-MM-DD
        startTime: formData.startTime,
        endTime: formData.endTime || undefined,
        location: formData.location,
        venue: formData.venue || undefined,
        category: formData.category,
        capacity: parseInt(formData.capacity),
        registrationDeadline: formData.registrationDeadline?.toISOString().split('T')[0] || undefined,
        isPublic: formData.isPublic,
        requiresApproval: formData.requiresApproval,
        allowFeedback: formData.allowFeedback,
        organizerInfo: formData.organizerInfo,
        eventType: formData.eventType,
        department: formData.department || undefined,
        contactEmail: formData.contactEmail || undefined,
        contactPhone: formData.contactPhone || undefined,
        tags: formData.tags,
        images: uploadedImageUrls, // Add the uploaded image URLs
      }

      console.log('Submitting event data:', eventData)

      // Create event
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })

      const data = await response.json()
      console.log('API Response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event')
      }

      // Show success toast
      toast.success("Event created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      // Wait for toast to be visible before redirecting
      setTimeout(() => {
        router.push("/dashboard/organizer/events")
      }, 1000);

    } catch (error) {
      console.error('Error creating event:', error)
      toast.error(error.message || "Failed to create event. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } finally {
      setIsLoading(false)
    }
  }

  const nextTab = () => {

    
    if (currentTab === "basic") setCurrentTab("details")
    else if (currentTab === "details") setCurrentTab("media")
    else if (currentTab === "media") setCurrentTab("settings")
  }

  const prevTab = () => {
    if (currentTab === "settings") setCurrentTab("media")
    else if (currentTab === "media") setCurrentTab("details")
    else if (currentTab === "details") setCurrentTab("basic")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                className={cn(errors.title && "border-red-500")}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter event description"
                className={cn(errors.description && "border-red-500")}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground",
                        errors.date && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => handleDateChange("date", date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm text-red-500 mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <Label>Registration Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.registrationDeadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.registrationDeadline
                        ? format(formData.registrationDeadline, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.registrationDeadline}
                      onSelect={(date) => handleDateChange("registrationDeadline", date)}
                      disabled={(date) =>
                        date < new Date() ||
                        (formData.date ? date > formData.date : false)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.registrationDeadline && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.registrationDeadline}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className={cn(errors.startTime && "border-red-500")}
                />
                {errors.startTime && (
                  <p className="text-sm text-red-500 mt-1">{errors.startTime}</p>
                )}
              </div>

              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className={cn(errors.endTime && "border-red-500")}
                />
                {errors.endTime && (
                  <p className="text-sm text-red-500 mt-1">{errors.endTime}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter event location"
                className={cn(errors.location && "border-red-500")}
              />
              {errors.location && (
                <p className="text-sm text-red-500 mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <Label htmlFor="venue">Venue (Optional)</Label>
              <Input
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                placeholder="Enter venue name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger className={cn(errors.category && "border-red-500")}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="Enter maximum capacity"
                  className={cn(errors.capacity && "border-red-500")}
                />
                {errors.capacity && (
                  <p className="text-sm text-red-500 mt-1">{errors.capacity}</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>Event Type</Label>
              <RadioGroup
                value={formData.eventType}
                onValueChange={(value) => handleSelectChange("eventType", value)}
                className="flex flex-col space-y-1"
              >
                {EVENT_TYPES.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={type.value} />
                    <Label htmlFor={type.value}>{type.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="department">Department (Optional)</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Enter department name"
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Contact Email (Optional)</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="Enter contact email"
                className={cn(errors.contactEmail && "border-red-500")}
              />
              {errors.contactEmail && (
                <p className="text-sm text-red-500 mt-1">{errors.contactEmail}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contactPhone">Contact Phone (Optional)</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="Enter contact phone"
                className={cn(errors.contactPhone && "border-red-500")}
              />
              {errors.contactPhone && (
                <p className="text-sm text-red-500 mt-1">{errors.contactPhone}</p>
              )}
            </div>

            <div>
              <Label>Tags (Optional)</Label>
              <div className="flex space-x-2">
                <Input
                  value={formData.customTag}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, customTag: e.target.value }))
                  }
                  placeholder="Add a tag"
                  className="flex-1"
                />
                <Button type="button" onClick={handleTagAdd}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center space-x-1 bg-secondary px-2 py-1 rounded-md"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>Event Images (Optional)</Label>
              <div className="grid grid-cols-2 gap-4">
                {imageUrls.map((url, index) => (
                  <Card key={index}>
                    <CardContent className="p-2">
                      <div className="relative aspect-video">
                        <img
                          src={url}
                          alt={`Event image ${index + 1}`}
                          className="object-cover rounded-md w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-background/80 p-1 rounded-full hover:bg-background"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {imageUrls.length < 5 && (
                  <Card>
                    <CardContent className="p-2">
                      <div
                        className="relative aspect-video border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:border-primary"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        <div className="text-center">
                          <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload images
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public Event</Label>
                <p className="text-sm text-muted-foreground">
                  Make this event visible to everyone
                </p>
              </div>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => handleSwitchChange("isPublic", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Approval</Label>
                <p className="text-sm text-muted-foreground">
                  Manually approve registrations
                </p>
              </div>
              <Switch
                checked={formData.requiresApproval}
                onCheckedChange={(checked) =>
                  handleSwitchChange("requiresApproval", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Feedback</Label>
                <p className="text-sm text-muted-foreground">
                  Let attendees provide feedback
                </p>
              </div>
              <Switch
                checked={formData.allowFeedback}
                onCheckedChange={(checked) =>
                  handleSwitchChange("allowFeedback", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Organizer Info</Label>
                <p className="text-sm text-muted-foreground">
                  Display organizer contact information
                </p>
              </div>
              <Switch
                checked={formData.organizerInfo}
                onCheckedChange={(checked) =>
                  handleSwitchChange("organizerInfo", checked)
                }
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={prevTab}
          disabled={currentTab === "basic"}
        >
          Previous
        </Button>
        {currentTab !== "settings" ? (
         <button type="button" onClick={nextTab}>
         Next
       </button>
       
        ) : (
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Event...
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        )}
      </div>
    </form>
  )
}
