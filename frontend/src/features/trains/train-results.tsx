import { ArrowRight, ChevronRight, Clock, MapPin, TrainFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { computeDuration, formatDate, formatTime } from "@/lib/format";
import type { TrainSearchResponse } from "@/types/api";

export function TrainResults({
  results,
  onSelect,
}: {
  results: TrainSearchResponse[];
  onSelect: (train: TrainSearchResponse) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-500">
          Available Train Runs ({results.length})
        </p>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Tatkal Quota
        </span>
      </div>

      {results.map((train) => (
        <article
          key={train.trainRunId}
          className="group panel rounded-[2rem] border border-ink-100/90 bg-white/95 p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-rail-300 hover:shadow-elevated"
        >
          {/* Header Row: Train Identity + Date */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100/70 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rail-50 text-rail-700 border border-rail-200/60 group-hover:bg-rail-500 group-hover:text-white transition-colors duration-200">
                <TrainFront className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold tracking-tight text-ink-900 group-hover:text-rail-900 transition-colors">
                    {train.trainName}
                  </h2>
                  <Badge tone={train.trainType.toLowerCase().includes("vande") || train.trainType.toLowerCase().includes("rajdhani") ? "rail" : "neutral"} dot>
                    {train.trainType}
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-ink-500">
                  Train #{train.trainNumber} &bull; Service Run #{train.trainRunId}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Journey Date
              </p>
              <p className="text-sm font-bold text-ink-800">{formatDate(train.runDate)}</p>
            </div>
          </div>

          {/* Core Journey Timeline */}
          <div className="my-5 rounded-2xl bg-ink-50/70 p-4.5 sm:p-5 border border-ink-100/60">
            <div className="grid gap-4 sm:grid-cols-[1.2fr_auto_1.2fr] sm:items-center">
              {/* Departure */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-400">
                  Departure
                </span>
                <p className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900">
                  {formatTime(train.departureTime)}
                </p>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="rounded-md bg-ink-200/70 px-1.5 py-0.5 font-mono text-xs font-bold text-ink-800">
                    {train.sourceStation}
                  </span>
                  <span className="text-xs font-medium text-ink-600 truncate">
                    {train.sourceStationName}
                  </span>
                </div>
                <p className="text-[11px] text-ink-500 mt-0.5">{train.sourceCity}</p>
              </div>

              {/* Duration / Arrow Bar */}
              <div className="flex flex-col items-center justify-center gap-1.5 px-4 text-ink-400 sm:border-x sm:border-ink-200/50">
                <div className="flex items-center gap-1 text-xs font-semibold text-ink-600">
                  <Clock className="h-3.5 w-3.5 text-rail-500" />
                  <span>{computeDuration(train.departureTime, train.arrivalTime)}</span>
                </div>
                <div className="relative flex w-28 sm:w-32 items-center justify-center">
                  <div className="h-0.5 w-full bg-ink-200/90 rounded-full" />
                  <div className="absolute h-2 w-2 rounded-full bg-rail-500 left-0" />
                  <ArrowRight className="absolute -right-1 h-3.5 w-3.5 text-ink-400" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                  Direct Express
                </span>
              </div>

              {/* Arrival */}
              <div className="sm:text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-400">
                  Arrival
                </span>
                <p className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900">
                  {formatTime(train.arrivalTime)}
                </p>
                <div className="mt-1.5 flex items-baseline gap-1.5 sm:justify-end">
                  <span className="text-xs font-medium text-ink-600 truncate">
                    {train.destinationStationName}
                  </span>
                  <span className="rounded-md bg-ink-200/70 px-1.5 py-0.5 font-mono text-xs font-bold text-ink-800">
                    {train.destinationStation}
                  </span>
                </div>
                <p className="text-[11px] text-ink-500 mt-0.5">{train.destinationCity}</p>
              </div>
            </div>
          </div>

          {/* Footer Action Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-ink-500">
              <MapPin className="h-3.5 w-3.5 text-rail-500 shrink-0" />
              <span>
                Origin: <strong className="font-semibold text-ink-700">{train.sourceStation}</strong> &bull;
                Destination: <strong className="font-semibold text-ink-700">{train.destinationStation}</strong>
              </span>
            </div>

            <Button
              className="group/btn shadow-xs hover:shadow"
              variant="secondary"
              onClick={() => onSelect(train)}
            >
              <span>Select train &amp; view seats</span>
              <ChevronRight className="ml-1.5 h-4 w-4 transition-transform duration-150 group-hover/btn:translate-x-0.5" />
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}

