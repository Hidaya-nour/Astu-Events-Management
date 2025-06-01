import { Skeleton } from "@/components/ui/skeleton"

export default function EventsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
          <div className="ml-auto">
            <Skeleton className="h-10 w-[200px]" />
          </div>
        </div>
      </div>

      {/* Events Display */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border shadow-sm">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="mb-4 h-4 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex justify-end pt-2">
                    <Skeleton className="h-9 w-28" />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )

}
