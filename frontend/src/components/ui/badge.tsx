import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "rail" | "brand";

export function Badge({
  children,
  tone = "neutral",
  dot = false,
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
  className?: string;
}) {
  const styles: Record<BadgeTone, string> = {
    neutral: "bg-ink-100 text-ink-700 border border-ink-200/50",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200/60",
    warning: "bg-amber-50 text-amber-800 border border-amber-200/60",
    danger: "bg-red-50 text-red-800 border border-red-200/60",
    rail: "bg-rail-50 text-rail-800 border border-rail-200/70",
    brand: "bg-ink-900 text-white border border-ink-800",
  };

  const dotColors: Record<BadgeTone, string> = {
    neutral: "bg-ink-400",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    rail: "bg-rail-500",
    brand: "bg-rail-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        styles[tone],
        className,
      )}
    >
      {dot ? <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[tone])} /> : null}
      {children}
    </span>
  );
}

