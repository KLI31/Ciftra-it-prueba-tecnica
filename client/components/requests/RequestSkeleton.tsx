import { Skeleton } from "@/components/ui/skeleton";

export function RequestCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <Skeleton className="w-5 h-5 rounded-full mt-1" />

          <div className="flex-1 min-w-0 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <div className="flex flex-wrap items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>

        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function RequestListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <RequestCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function RequestSmallCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full ml-4" />
    </div>
  );
}

export function RequestSmallListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <RequestSmallCardSkeleton key={i} />
      ))}
    </div>
  );
}
