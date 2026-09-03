import type { ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

type Tone = "error" | "info" | "success" | "warning";

const toneStyles: Record<Tone, string> = {
  error: "border-red-200/80 bg-red-50/90 text-red-900",
  info: "border-ink-200/80 bg-white text-ink-900 shadow-2xs",
  success: "border-emerald-200/80 bg-emerald-50/90 text-emerald-900",
  warning: "border-amber-200/80 bg-amber-50/90 text-amber-900",
};

const iconStyles: Record<Tone, string> = {
  error: "text-red-600",
  info: "text-ink-600",
  success: "text-emerald-600",
  warning: "text-amber-600",
};

const toneIcons = {
  error: AlertCircle,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
};

export function InlineAlert({
  tone,
  title,
  message,
  action,
  onClose,
  className,
}: {
  tone: Tone;
  title: string;
  message: string;
  action?: ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  const Icon = toneIcons[tone];

  return (
    <div
      className={cn(
        "relative rounded-2xl border px-4 py-3.5 transition-all duration-150 animate-fade-in",
        toneStyles[tone],
        className,
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconStyles[tone])} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold tracking-tight">{title}</p>
          <p className="mt-1 text-sm leading-relaxed opacity-90">{message}</p>
          {action ? <div className="mt-3 flex items-center gap-2">{action}</div> : null}
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss alert"
            className="rounded-lg p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

