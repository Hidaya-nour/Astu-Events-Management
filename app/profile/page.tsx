import ProfileHeader from "components/profile/profile-header"
import ProfileStats from "@/components/profile/profile-stats"
import ProfileEvents from "@/components/profile/profile-events"
import { Suspense } from "react"
import ProfileSkeleton from "@/components/profile/profile-skeleton"

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4">
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
  )
}
