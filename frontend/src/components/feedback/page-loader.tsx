import { TrainFront } from "lucide-react";

export function PageLoader({ label }: { label: string }) {
  return (
    <div className="flex min-h-[45vh] items-center justify-center px-4 py-12">
      <div className="panel w-full max-w-sm rounded-3xl border border-ink-100/80 bg-white/95 px-8 py-8 text-center shadow-card animate-fade-in">
        <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-rail-100/70 animate-ping opacity-35" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 text-rail-300 shadow-xs">
            <TrainFront className="h-6 w-6 animate-pulse text-rail-400" />
          </div>
        </div>
        <p className="text-sm font-semibold tracking-tight text-ink-800">{label}</p>
        <p className="mt-1 text-xs text-ink-500">Communicating with Tatkal reservation engine...</p>
      </div>
    </div>
  );
}

