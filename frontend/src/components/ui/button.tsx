import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-950 shadow-sm hover:shadow",
  secondary:
    "bg-rail-500 text-white hover:bg-rail-600 active:bg-rail-700 shadow-sm hover:shadow",
  ghost:
    "bg-white text-ink-800 hover:bg-ink-50 hover:text-ink-950 border border-ink-200/90 shadow-xs",
  danger:
    "bg-danger text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
};

export function Button({
  children,
  className,
  variant = "primary",
  loading = false,
  disabled,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: Variant;
  loading?: boolean;
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "focus-ring inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" /> : null}
      {children}
    </button>
  );
}

