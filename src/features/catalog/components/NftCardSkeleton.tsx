import { Skeleton } from '@/components/ui/skeleton';

export function NftCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-sm overflow-hidden shadow-lg">
      {/* Aspect square image with shimmer */}
      <Skeleton className="aspect-square w-full rounded-xl" />

      {/* Info section */}
      <div className="mt-3.5 space-y-2.5 flex-1">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>

        <Skeleton className="h-5 w-4/5 rounded-md" />

        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-3.5 w-24 rounded-md" />
        </div>
      </div>

      {/* Price and Action Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
        <div className="space-y-1">
          <Skeleton className="h-3 w-10 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
}
