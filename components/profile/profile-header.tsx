"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useSession, signIn } from "next-auth/react"
import { Camera, Edit, Mail, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import EditProfileModal from "./EditProfileModal"

interface User {
  id: string
  name: string
  email: string
  bio?: string
  location?: string
  image?: string
  coverImage?: string
  createdAt: string
}

export default function ProfileHeader() {
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (status === "loading") {
      // session still loading, do nothing yet
      return
    }

    if (status === "unauthenticated") {
      // not logged in, redirect to sign-in page
      signIn()
      return
    }

    if (session?.user?.id) {
      const fetchUser = async () => {
        try {
          const res = await fetch(`/api/user/${session.user.id}`)
          if (!res.ok) throw new Error("Failed to fetch user")
          const data = await res.json()
          setUser(data)
        } catch (err) {
          toast({ title: "Failed to load user", variant: "destructive" })
        }
      }
      fetchUser()
    }
  }, [session, status, toast])

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return
    try {
      const res = await fetch(`/api/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error("Update failed")
      const updatedUser = await res.json()
      setUser(updatedUser)
      toast({ title: "Profile updated" })
    } catch {
      toast({ title: "Update failed", variant: "destructive" })
    }
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    try {
      setIsUploading(true)
      // For demo, create a local object URL; in real app upload to server/cloud
      const imageUrl = URL.createObjectURL(file)
      await updateUser(type === "profile" ? { image: imageUrl } : { coverImage: imageUrl })
    } finally {
      setIsUploading(false)
    }
  }

  if (status === "loading") return <div>Loading session...</div>
  if (status === "unauthenticated") return <div>Redirecting to sign-in...</div>
  if (!user) return <div>Loading user profile...</div>

  return (
    <>
      <div className="rounded-lg bg-white shadow-md dark:bg-gray-800">
        <div
          className="relative h-48 w-full overflow-hidden rounded-t-lg sm:h-64"
          style={{
            backgroundImage: `url(${user.coverImage || "/placeholder.svg"})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <label htmlFor="cover-upload">
            <Button size="sm" variant="secondary" className="absolute bottom-4 right-4" asChild>
              <span>
                <Camera className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Change Cover"}
              </span>
            </Button>
            <input
              id="cover-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, "cover")}
              disabled={isUploading}
            />
          </label>
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-end">
            <div className="relative mb-4 sm:mb-0">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-gray-100 dark:border-gray-800">
                <Image
                  src={user.image || "/placeholder.svg"}
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
                  onChange={(e) => handleImageUpload(e, "profile")}
                  disabled={isUploading}
                />
              </label>
            </div>
            <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:pl-6 sm:text-left">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditOpen(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-1 text-gray-600 dark:text-gray-400">{user.bio || "No bio provided."}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Mail className="mr-1 h-4 w-4" />
                  {user.email}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="mr-1 h-4 w-4" />
                  {user.location || "Unknown location"}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="mr-1 h-4 w-4" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal open={editOpen} onOpenChange={setEditOpen} user={user} onUpdate={updateUser} />
    </>
  )
}
