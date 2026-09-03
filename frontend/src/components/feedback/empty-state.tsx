import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  message: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "panel rounded-[2rem] border border-ink-100/80 bg-white/90 px-6 py-12 text-center shadow-xs animate-fade-in",
        className,
      )}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-50 text-ink-700 ring-1 ring-ink-200/60 shadow-2xs">
        <Icon className="h-6 w-6 text-ink-600" />
      </div>
      <h2 className="text-lg font-semibold tracking-tight text-ink-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-600">{message}</p>
      {action ? <div className="mt-6 flex justify-center gap-3">{action}</div> : null}
    </div>
  );
}

