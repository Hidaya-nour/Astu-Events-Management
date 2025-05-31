"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Camera, Edit, Mail, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const mockUser = {
  id: "1",
  name: "Ezedin Kedir",
  email: "ezex.kedir@astu.edu.et",
  bio: "Computer Science and Engineering Student at Adama Science and Technology University",
  location: "Adama, Ethiopia",
  joinedAt: "May 2025",
  profileImage: "/placeholder.svg?height=150&width=150",
  coverImage: "/placeholder.svg?height=300&width=1200",
}

export default function ProfileHeader() {
  const { toast } = useToast()
  const [user, setUser] = useState(mockUser)
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState(user.name)

  const handleEditName = () => {
    setIsEditingName(true)
    console.log("clicked")
  }

  const handleSaveName = async () => {
    if (!newName.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty.",
        variant: "destructive",
      })
      return
    }
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUser((prev) => ({ ...prev, name: newName }))
      setIsEditingName(false)
      toast({
        title: "Name updated",
        description: "Your profile name has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update name. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancelEdit = () => {
    setNewName(user.name)
    setIsEditingName(false)
  }
  const [isUploading, setIsUploading] = useState(false)
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUser((prev) => ({ ...prev, profileImage: URL.createObjectURL(file) }))
      toast({
        title: "Profile image updated",
        description: "Your profile image has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }
  // coverimagehandler
  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUser((prev) => ({ ...prev, coverImage: URL.createObjectURL(file) }))
      toast({
        title: "Cover image updated",
        description: "Your cover image has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }
  return (
    <div className="rounded-lg bg-white shadow-md dark:bg-gray-800">
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg sm:h-64">
        <Image src={user.coverImage || "/placeholder.svg"} alt="Cover" className="object-cover" fill priority />
        <label htmlFor="cover-upload" className="absolute bottom-4 right-4">
         
          <Camera className="mr-2 h-4 w-4" />
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverImageUpload}
                disabled={isUploading}
              />
        </label>
        
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-end sm:-mt-16">
          <div className="relative mb-4 sm:mb-0">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-gray-100 dark:border-gray-800">
              <Image
                src={user.profileImage || "/placeholder.svg"}
                alt={user.name}
                className="object-cover"
                fill
                priority
              />
            </div>
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-primary/90"
            >
              <Camera className="h-4 w-4" />
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageUpload}
                disabled={isUploading}
              />
            </label>
          </div>

          <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:pl-6 sm:text-left">
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <>
                  <input
                    type="text"
                    className="text-2xl font-bold border border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    autoFocus
                  />
                  <Button size="icon" variant="ghost" onClick={handleSaveName} className="h-8 w-8">
                    ✅
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleCancelEdit} className="h-8 w-8">
                    ❌
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <Button onClick={handleEditName} className="h-8 w-8" size="icon" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                </>
              )}
          </div>
            <p className="mt-1 text-gray-600 dark:text-gray-400">{user.bio}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Mail className="mr-1 h-4 w-4" />
                {user.email}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="mr-1 h-4 w-4" />
                {user.location}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="mr-1 h-4 w-4" />
                Joined {user.joinedAt}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
