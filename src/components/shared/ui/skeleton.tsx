import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-surface-raised animate-pulse rounded-lg", className)} {...props} />;
}

export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8" aria-label="Loading page" role="status">
      <Skeleton className="h-9 w-48" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-64 w-full" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
