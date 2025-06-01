'use client'
import SettingsTabs from "@/components/settings/settings-tabs"
import { Suspense } from "react"
import SettingsSkeleton from "@/components/settings/settings-skeleton"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>
      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsTabs />
      </Suspense>
    </div>
  )
}
