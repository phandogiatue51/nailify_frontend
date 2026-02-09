import { Skeleton } from "@/components/ui/skeleton";

export const BookingSkeleton = () => (
  <div className="p-4 max-w-4xl mx-auto space-y-6 animate-pulse">
    <Skeleton className="h-32 w-full rounded-[3rem]" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-64 w-full rounded-[2rem]" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-[2rem]" />
        <Skeleton className="h-40 w-full rounded-[2rem]" />
      </div>
    </div>
  </div>
);
