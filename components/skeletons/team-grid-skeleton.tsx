import { Skeleton } from "@/components/ui/skeleton";

export function TeamGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="group">
          {/* Image Skeleton */}
          <Skeleton className="rounded-lg aspect-[4/5] mb-6 w-full" />
          
          <div className="space-y-2">
            {/* Name Skeleton */}
            <Skeleton className="h-6 w-3/4" />
            
            {/* Role Skeleton */}
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
