import { Check, Clock, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import type { SeatInventoryResponse } from "@/types/api";

export function SeatPicker({
  seats,
  selectedSeatIds,
  onToggle,
}: {
  seats: SeatInventoryResponse[];
  selectedSeatIds: number[];
  onToggle: (seat: SeatInventoryResponse) => void;
}) {
  const grouped = seats.reduce<Record<string, SeatInventoryResponse[]>>((acc, seat) => {
    acc[seat.coachCode] ??= [];
    acc[seat.coachCode].push(seat);
    return acc;
  }, {});

  const availableCount = seats.filter((s) => s.status === "AVAILABLE").length;
  const heldCount = seats.filter((s) => s.status === "HELD").length;
  const bookedCount = seats.filter((s) => s.status === "BOOKED").length;

  return (
    <div className="space-y-6">
      {/* Visual Legend */}
      <div className="rounded-2xl border border-ink-100 bg-ink-50/70 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-500">Seat Legend</p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            {/* Available */}
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-md border border-ink-300 bg-white shadow-2xs" />
              <span className="text-ink-700">Available ({availableCount})</span>
            </div>
            {/* Selected */}
            <div className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-md border border-rail-500 bg-rail-500 text-white shadow-2xs">
                <Check className="h-3 w-3" />
              </span>
              <span className="text-rail-900 font-bold">Selected ({selectedSeatIds.length})</span>
            </div>
            {/* Held */}
            <div className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-md border border-amber-300 bg-amber-100 text-amber-700">
                <Clock className="h-2.5 w-2.5" />
              </span>
              <span className="text-amber-800">Held ({heldCount})</span>
            </div>
            {/* Booked / Unavailable */}
            <div className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-md border border-ink-200 bg-ink-100 text-ink-400">
                <Lock className="h-2.5 w-2.5" />
              </span>
              <span className="text-ink-400">Unavailable ({bookedCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coach Layouts */}
      {Object.entries(grouped).map(([coachCode, coachSeats]) => {
        const coachAvailable = coachSeats.filter((s) => s.status === "AVAILABLE").length;

        return (
          <section
            key={coachCode}
            className="rounded-[2rem] border border-ink-100 bg-white p-5 sm:p-6 shadow-xs"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-ink-100/70 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-ink-900">Coach {coachCode}</h3>
                  <Badge tone="brand">
                    {coachSeats[0]?.classType.replaceAll("_", " ") ?? "Standard"}
                  </Badge>
                </div>
                <p className="text-xs text-ink-500 mt-0.5">
                  {coachAvailable} of {coachSeats.length} seats currently available
                </p>
              </div>
              <span className="text-xs font-semibold text-ink-400">Click a seat to select</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {coachSeats.map((seat) => {
                const isSelected = selectedSeatIds.includes(seat.seatId);
                const isAvailable = seat.status === "AVAILABLE";
                const isHeld = seat.status === "HELD";
                const isBooked = seat.status === "BOOKED";
                const isDisabled = !isAvailable && !isSelected;

                return (
                  <button
                    key={seat.seatId}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => onToggle(seat)}
                    aria-label={`Seat ${seat.coachCode}-${seat.seatNumber}, ${seat.berthType}, ${
                      isSelected ? "Selected" : seat.status
                    }`}
                    className={cn(
                      "focus-ring group relative flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all duration-150 active:scale-[0.98]",
                      // Available state
                      isAvailable &&
                        !isSelected &&
                        "border-ink-200/90 bg-white hover:border-rail-400 hover:bg-rail-50/40 hover:shadow-sm cursor-pointer",
                      // Selected state
                      isSelected &&
                        "border-rail-500 bg-rail-50/90 text-rail-950 ring-2 ring-rail-400/25 shadow-sm font-semibold cursor-pointer",
                      // Held state
                      isHeld &&
                        !isSelected &&
                        "border-amber-200 bg-amber-50/60 text-amber-900 opacity-80 cursor-not-allowed",
                      // Booked state
                      isBooked &&
                        !isSelected &&
                        "border-ink-200/60 bg-ink-50/70 text-ink-400 opacity-60 cursor-not-allowed",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-bold tracking-tight text-ink-900">
                        {seat.coachCode}-{seat.seatNumber}
                      </span>
                      {isSelected ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rail-500 text-white shadow-2xs">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                      ) : isHeld ? (
                        <span className="flex items-center gap-1 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                          <Clock className="h-3 w-3" />
                          Held
                        </span>
                      ) : isBooked ? (
                        <span className="flex items-center gap-1 rounded-md bg-ink-200/60 px-1.5 py-0.5 text-[10px] font-semibold text-ink-500">
                          <Lock className="h-3 w-3" />
                          Booked
                        </span>
                      ) : (
                        <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/60">
                          Available
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="font-semibold uppercase tracking-wider text-ink-500">
                        {seat.berthType.replaceAll("_", " ")}
                      </span>
                      <span className="text-[11px] text-ink-400">
                        {isSelected ? "Tap to remove" : isAvailable ? "Tap to hold" : "Locked"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

