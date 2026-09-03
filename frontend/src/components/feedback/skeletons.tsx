import { cn } from "@/lib/cn";

export function TrainCardSkeleton({ className }: { className?: string }) {
  return (
    <article
      className={cn(
        "panel relative overflow-hidden rounded-[1.75rem] border border-ink-100/90 bg-white p-6 shadow-xs",
        className,
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="skeleton-shimmer h-5 w-20 rounded-full" />
            <div className="skeleton-shimmer h-4 w-28 rounded-md" />
          </div>
          <div className="flex items-center gap-3">
            <div className="skeleton-shimmer h-11 w-11 rounded-2xl" />
            <div className="space-y-1.5">
              <div className="skeleton-shimmer h-6 w-48 rounded-md" />
              <div className="skeleton-shimmer h-4 w-32 rounded-md" />
            </div>
          </div>
        </div>

        <div className="skeleton-shimmer h-24 w-full rounded-3xl lg:w-96" />
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-ink-100/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="skeleton-shimmer h-4 w-56 rounded-md" />
        <div className="skeleton-shimmer h-10 w-36 rounded-2xl" />
      </div>
    </article>
  );
}

export function BookingCardSkeleton() {
  return (
    <article className="panel relative overflow-hidden rounded-[1.75rem] border border-ink-100/90 bg-white p-6 shadow-xs">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="skeleton-shimmer h-5 w-24 rounded-full" />
            <div className="skeleton-shimmer h-4 w-32 rounded-md" />
          </div>
          <div className="skeleton-shimmer h-6 w-52 rounded-md" />
          <div className="skeleton-shimmer h-4 w-44 rounded-md" />
        </div>
        <div className="skeleton-shimmer h-10 w-28 rounded-2xl" />
      </div>
    </article>
  );
}

export function SeatGridSkeleton() {
  return (
    <section className="rounded-3xl border border-ink-100 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-1">
          <div className="skeleton-shimmer h-5 w-24 rounded-md" />
          <div className="skeleton-shimmer h-4 w-32 rounded-md" />
        </div>
        <div className="skeleton-shimmer h-5 w-16 rounded-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-16 rounded-3xl" />
        ))}
      </div>
    </section>
  );
}
