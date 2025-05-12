"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [name]: date }))
  }

  const handleTagAdd = () => {
    if (formData.customTag && !formData.tags.includes(formData.customTag)) {
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
    setImages((prev) => [...prev, ...newImages])

    // Create URLs for preview
    const newImageUrls = newImages.map((file) => URL.createObjectURL(file))
    setImageUrls((prev) => [...prev, ...newImageUrls])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imageUrls[index])
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate form
    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.startTime ||
      !formData.location ||
      !formData.category ||
      !formData.capacity
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // In a real app, you would upload images and submit form data to your API
      // For now, we'll just simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Success",
        description: "Event has been created successfully.",
      })

      router.push("/organizer/events")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem creating the event. Please try again.",
        variant: "destructive",
      })
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
      <Card>
        <CardContent className="pt-4">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Event Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter a descriptive title for your event"
                  value={formData.title}
                  onChange={handleInputChange}
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
                  placeholder="Provide details about your event"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-[150px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Event Date <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => handleDateChange("date", date)}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACADEMIC">Academic</SelectItem>
                      <SelectItem value="CULTURAL">Cultural</SelectItem>
                      <SelectItem value="SPORTS">Sports</SelectItem>
                      <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                      <SelectItem value="CAREER">Career</SelectItem>
                      <SelectItem value="WORKSHOP">Workshop</SelectItem>
                      <SelectItem value="SEMINAR">Seminar</SelectItem>
                      <SelectItem value="COMPETITION">Competition</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">
                    Start Time <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      name="location"
                      placeholder="Building or area"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Specific Venue</Label>
                  <Input
                    id="venue"
                    name="venue"
                    placeholder="Room number, hall name, etc."
                    value={formData.venue}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">
                    Capacity <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      placeholder="Maximum number of attendees"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Registration Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.registrationDeadline && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.registrationDeadline
                          ? format(formData.registrationDeadline, "PPP")
                          : "Select deadline"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.registrationDeadline}
                        onSelect={(date) => handleDateChange("registrationDeadline", date)}
                        initialFocus
                        disabled={(date) => date < new Date() || (formData.date ? date > formData.date : false)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department/Organization</Label>
                <Input
                  id="department"
                  name="department"
                  placeholder="Department or organization hosting this event"
                  value={formData.department}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    placeholder="Email for inquiries"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    placeholder="Phone number for inquiries"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Event Type</Label>
                <RadioGroup
                  value={formData.eventType}
                  onValueChange={(value) => handleSelectChange("eventType", value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="IN_PERSON" id="in_person" />
                    <Label htmlFor="in_person" className="font-normal">
                      In-Person
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="VIRTUAL" id="virtual" />
                    <Label htmlFor="virtual" className="font-normal">
                      Virtual
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="HYBRID" id="hybrid" />
                    <Label htmlFor="hybrid" className="font-normal">
                      Hybrid (Both)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 ml-1"
                        onClick={() => handleTagRemove(tag)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {tag}</span>
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    id="customTag"
                    name="customTag"
                    placeholder="Add a tag"
                    value={formData.customTag}
                    onChange={handleInputChange}
                  />
                  <Button type="button" variant="outline" onClick={handleTagAdd} disabled={!formData.customTag}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label>Event Images</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden aspect-video bg-muted">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Event preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove image</span>
                      </Button>
                    </div>
                  ))}

                  {imageUrls.length < 5 && (
                    <div
                      className="border-2 border-dashed rounded-md flex flex-col items-center justify-center p-4 aspect-video cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (max 5MB)</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  onChange={handleImageUpload}
                  multiple
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageUrls.length >= 5}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  {imageUrls.length === 0 ? "Upload Images" : "Add More Images"}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  You can upload up to 5 images. First image will be used as the cover.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Organizer Information</Label>
                <div className="flex items-start space-x-3 p-4 rounded-md border">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Organizer" />
                    <AvatarFallback>OU</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-medium">Computer Science Department</h4>
                    <p className="text-xs text-muted-foreground">
                      Organizer information will be displayed on the event page
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch
                        id="organizerInfo"
                        checked={formData.organizerInfo}
                        onCheckedChange={(checked) => handleSwitchChange("organizerInfo", checked)}
                      />
                      <Label htmlFor="organizerInfo" className="text-sm font-normal">
                        Show organizer information
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPublic">Public Event</Label>
                    <p className="text-sm text-muted-foreground">Make this event visible to all students</p>
                  </div>
                  <Switch
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleSwitchChange("isPublic", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requiresApproval">Require Approval</Label>
                    <p className="text-sm text-muted-foreground">Manually approve student registrations</p>
                  </div>
                  <Switch
                    id="requiresApproval"
                    checked={formData.requiresApproval}
                    onCheckedChange={(checked) => handleSwitchChange("requiresApproval", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowFeedback">Allow Feedback</Label>
                    <p className="text-sm text-muted-foreground">Let attendees provide feedback after the event</p>
                  </div>
                  <Switch
                    id="allowFeedback"
                    checked={formData.allowFeedback}
                    onCheckedChange={(checked) => handleSwitchChange("allowFeedback", checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preview</Label>
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    {imageUrls.length > 0 ? (
                      <img
                        src={imageUrls[0] || "/placeholder.svg"}
                        alt="Event cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                      {formData.category || "Category"}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg line-clamp-1">{formData.title || "Event Title"}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                      <span>
                        {formData.date ? format(formData.date, "PPP") : "Event Date"}
                        {formData.startTime ? ` • ${formData.startTime}` : ""}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>{formData.location || "Location"}</span>
                    </div>
                    <p className="text-sm mt-2 line-clamp-2">
                      {formData.description || "Event description will appear here."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevTab} disabled={currentTab === "basic"}>
          Previous
        </Button>

        {currentTab !== "settings" ? (
          <Button type="button" onClick={nextTab}>
            Next
          </Button>
        ) : (
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
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
