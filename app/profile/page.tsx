'use client'

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import ProfileHeader from "components/profile/profile-header"
import ProfileStats from "@/components/profile/profile-stats"
import ProfileEvents from "@/components/profile/profile-events"
import { Suspense } from "react"
import ProfileSkeleton from "@/components/profile/profile-skeleton"

export default function ProfilePage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
        <Suspense fallback={<ProfileSkeleton />}>
          <div className="space-y-8">
            <ProfileHeader />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="md:col-span-1">
                <ProfileStats />
              </div>
              <div className="md:col-span-2">
                <ProfileEvents />
              </div>
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  )
}