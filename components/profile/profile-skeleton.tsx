import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="rounded-lg bg-white shadow-md dark:bg-gray-800">
        <div className="h-48 w-full rounded-t-lg sm:h-64">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-end sm:-mt-16">
            <div className="mb-4 sm:mb-0">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>
            <div className="flex flex-1 flex-col items-center sm:items-start sm:pl-6">
              <Skeleton className="mb-2 h-8 w-48" />
              <Skeleton className="mb-3 h-4 w-64" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
        <div className="md:col-span-2">
          <Skeleton className="mb-4 h-10 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
