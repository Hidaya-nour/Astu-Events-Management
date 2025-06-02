'use client'
import SettingsTabs from "@/components/settings/settings-tabs"
import { Suspense } from "react"
import SettingsSkeleton from "@/components/settings/settings-skeleton"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()

  return (
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
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsTabs />
      </Suspense>
    </div>
  )
}