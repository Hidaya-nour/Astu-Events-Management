'use client'
import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="space-y-6">
          <div>
            <Skeleton className="mb-2 h-6 w-48" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
          <div className="space-y-4">
            <div>
              <Skeleton className="mb-1 h-5 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="mb-1 h-5 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Skeleton className="mb-1 h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="mb-1 h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div>
              <Skeleton className="mb-1 h-5 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
