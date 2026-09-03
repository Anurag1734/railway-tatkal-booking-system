import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TimerReset,
} from "lucide-react";
import { createBooking } from "@/api/booking-api";
import { getSeatInventory, holdSeat } from "@/api/inventory-api";
import { InlineAlert } from "@/components/feedback/inline-alert";
import { PageLoader } from "@/components/feedback/page-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { SeatPicker } from "@/features/booking/seat-picker";
import {
  computeDuration,
  formatCountdown,
  formatDate,
  formatTime,
  parseApiDateTime,
} from "@/lib/format";
import { toAppError, type AppError } from "@/lib/http-error";
import type { BookingPassengerRequest, SeatInventoryResponse } from "@/types/api";

const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const berthOptions = [
  { value: "", label: "No preference" },
  { value: "LOWER", label: "Lower Berth" },
  { value: "MIDDLE", label: "Middle Berth" },
  { value: "UPPER", label: "Upper Berth" },
  { value: "SIDE_LOWER", label: "Side Lower" },
  { value: "SIDE_UPPER", label: "Side Upper" },
];

interface PassengerFormState {
  name: string;
  age: string;
  gender: string;
  berthPreference: string;
  concessionType: string;
}

function createPassengerState(): PassengerFormState {
  return {
    name: "",
    age: "",
    gender: "MALE",
    berthPreference: "",
    concessionType: "",
  };
}

export function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trainRunId = Number(searchParams.get("trainRunId"));
  const sourceStationId = Number(searchParams.get("sourceStationId"));
  const destinationStationId = Number(searchParams.get("destinationStationId"));

  const [seats, setSeats] = useState<SeatInventoryResponse[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
  const [heldSeats, setHeldSeats] = useState<SeatInventoryResponse[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [passengers, setPassengers] = useState<PassengerFormState[]>([]);

  const bookingContext = useMemo(() => {
    if (!trainRunId || !sourceStationId || !destinationStationId) {
      return null;
    }

    return {
      trainRunId,
      sourceStationId,
      destinationStationId,
      trainNumber: searchParams.get("trainNumber") ?? "Unknown train",
      trainName: searchParams.get("trainName") ?? "Selected run",
      trainType: searchParams.get("trainType") ?? "Run",
      sourceStationCode: searchParams.get("sourceStationCode") ?? "",
      sourceStationName: searchParams.get("sourceStationName") ?? "",
      destinationStationCode: searchParams.get("destinationStationCode") ?? "",
      destinationStationName: searchParams.get("destinationStationName") ?? "",
      runDate: searchParams.get("runDate") ?? "",
      departureTime: searchParams.get("departureTime") ?? "",
      arrivalTime: searchParams.get("arrivalTime") ?? "",
    };
  }, [destinationStationId, searchParams, sourceStationId, trainRunId]);

  const countdown = useMemo(() => {
    const heldUntil = heldSeats
      .map((seat) => seat.heldUntil)
      .filter((value): value is string => Boolean(value))
      .sort()[0] ?? null;

    return formatCountdown(heldUntil);
  }, [heldSeats]);

  useEffect(() => {
    if (!bookingContext) {
      return;
    }

    void refreshSeats();
  }, [bookingContext]);

  useEffect(() => {
    if (!heldSeats.length) {
      return;
    }

    const timer = window.setInterval(() => {
      const isExpired = heldSeats
        .map((seat) => seat.heldUntil)
        .filter((value): value is string => Boolean(value))
        .some((value) => {
          const expiry = parseApiDateTime(value);
          return expiry ? expiry.getTime() <= Date.now() : false;
        });

      if (isExpired) {
        setError({
          code: "HOLD_EXPIRED",
          message: "Your 5-minute seat hold has expired. We refreshed seat inventory so you can re-select.",
        });
        setHeldSeats([]);
        setSelectedSeatIds([]);
        setPassengers([]);
        setStep(1);
        void refreshSeats();
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [heldSeats]);

  async function refreshSeats() {
    if (!bookingContext) {
      return;
    }

    setLoadingSeats(true);
    try {
      const data = await getSeatInventory(bookingContext.trainRunId);
      setSeats(data);
    } catch (nextError) {
      setError(toAppError(nextError));
    } finally {
      setLoadingSeats(false);
    }
  }

  function toggleSeat(seat: SeatInventoryResponse) {
    setSelectedSeatIds((current) =>
      current.includes(seat.seatId)
        ? current.filter((seatId) => seatId !== seat.seatId)
        : [...current, seat.seatId],
    );
  }

  async function holdSelectedSeats() {
    if (!bookingContext) {
      return;
    }
    if (!selectedSeatIds.length) {
      setError({ code: "NO_SEATS", message: "Please pick at least one available seat to proceed." });
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const held: SeatInventoryResponse[] = [];
      for (const seatId of selectedSeatIds) {
        const response = await holdSeat(bookingContext.trainRunId, seatId);
        held.push(response);
      }

      setHeldSeats(held);
      setPassengers(held.map(() => createPassengerState()));
      setStep(2);
      await refreshSeats();
    } catch (nextError) {
      setHeldSeats([]);
      setStep(1);
      const appErr = toAppError(nextError);
      // Friendly error handling for seat conflicts: never expose raw exception trace
      const friendlyMessage =
        appErr.status === 409 || appErr.code?.includes("CONFLICT") || appErr.code?.includes("ALREADY")
          ? "One or more of your chosen seats were just reserved by another traveler. Seat availability has been updated."
          : appErr.message || "Could not complete seat hold. Please refresh and try again.";

      setError({ ...appErr, message: friendlyMessage });
      await refreshSeats();
    } finally {
      setActionLoading(false);
    }
  }

  function updatePassenger(index: number, key: keyof PassengerFormState, value: string) {
    setPassengers((current) =>
      current.map((passenger, itemIndex) =>
        itemIndex === index ? { ...passenger, [key]: value } : passenger,
      ),
    );
  }

  function validatePassengers() {
    return passengers.every(
      (passenger) => passenger.name.trim() && passenger.age.trim() && passenger.gender.trim(),
    );
  }

  async function confirmBooking() {
    if (!bookingContext) {
      return;
    }

    if (!validatePassengers()) {
      setError({
        code: "PASSENGERS_REQUIRED",
        message: "Please fill in all passenger names, ages, and genders to confirm booking.",
      });
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const payloadPassengers: BookingPassengerRequest[] = passengers.map((passenger) => ({
        name: passenger.name.trim(),
        age: Number(passenger.age),
        gender: passenger.gender,
        berthPreference: passenger.berthPreference || null,
        concessionType: passenger.concessionType || null,
      }));

      const booking = await createBooking({
        trainRunId: bookingContext.trainRunId,
        sourceStationId: bookingContext.sourceStationId,
        destinationStationId: bookingContext.destinationStationId,
        seatIds: heldSeats.map((seat) => seat.seatId),
        passengers: payloadPassengers,
      });

      navigate(`/booking/confirmation/${booking.bookingReference}`, {
        replace: true,
        state: { booking },
      });
    } catch (nextError) {
      setError(toAppError(nextError));
      await refreshSeats();
    } finally {
      setActionLoading(false);
    }
  }

  if (!bookingContext) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <InlineAlert
          tone="warning"
          title="Missing booking context"
          message="No train run was selected. Please search for a train schedule first."
          action={
            <Link to="/">
              <Button variant="secondary">Go to search</Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (loadingSeats) {
    return <PageLoader label="Fetching real-time coach inventory..." />;
  }

  const stepsList = [
    { number: 1, title: "Select Seats" },
    { number: 2, title: "Passenger Details" },
    { number: 3, title: "Review & Confirm" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Step Flow */}
      <div className="panel rounded-[2rem] border border-ink-100/90 bg-white/95 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-ink-900 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to schedules
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
                {bookingContext.trainName}
              </h1>
              <Badge tone="brand">#{bookingContext.trainNumber}</Badge>
              <Badge tone="rail">{bookingContext.trainType}</Badge>
            </div>
            <p className="text-xs font-medium text-ink-500 mt-1">
              {formatDate(bookingContext.runDate)} &bull; {bookingContext.sourceStationCode} &rarr; {bookingContext.destinationStationCode}
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="flex items-center gap-2 sm:gap-4">
            {stepsList.map((s, idx) => {
              const isCompleted = step > s.number;
              const isCurrent = step === s.number;

              return (
                <div key={s.number} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-rail-500 text-white ring-4 ring-rail-200/50"
                          : "bg-ink-100 text-ink-500"
                      }`}
                    >
                      {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : s.number}
                    </span>
                    <span
                      className={`hidden text-xs font-semibold sm:inline ${
                        isCurrent ? "text-ink-900" : "text-ink-400"
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                  {idx < stepsList.length - 1 ? (
                    <div className="h-0.5 w-4 sm:w-6 bg-ink-200/70" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Route Snapshot Ribbon */}
        <div className="mt-5 grid gap-3 rounded-2xl bg-ink-50/70 p-4 border border-ink-100/60 sm:grid-cols-3 sm:items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">From</span>
            <p className="text-base font-bold text-ink-900">
              {bookingContext.sourceStationCode} &bull; {formatTime(bookingContext.departureTime)}
            </p>
            <p className="text-xs text-ink-500 truncate">{bookingContext.sourceStationName}</p>
          </div>
          <div className="flex flex-col items-center justify-center text-ink-500 sm:border-x sm:border-ink-200/40 px-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Duration</span>
            <p className="text-xs font-bold text-ink-800">
              {computeDuration(bookingContext.departureTime, bookingContext.arrivalTime)}
            </p>
          </div>
          <div className="sm:text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">To</span>
            <p className="text-base font-bold text-ink-900">
              {bookingContext.destinationStationCode} &bull; {formatTime(bookingContext.arrivalTime)}
            </p>
            <p className="text-xs text-ink-500 truncate">{bookingContext.destinationStationName}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Work Area + Sticky Selection Sidebar */}
      <div className="grid gap-6 xl:grid-cols-[1.65fr_0.95fr] items-start">
        <section className="space-y-6">
          {error ? (
            <InlineAlert
              tone="error"
              title="Booking notice"
              message={error.message}
              onClose={() => setError(null)}
            />
          ) : null}

          {/* STEP 1: Seat Selection */}
          {step === 1 ? (
            <div className="panel rounded-[2rem] border border-ink-100/90 bg-white/95 p-6 shadow-sm animate-fade-in">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-ink-100/70 pb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-ink-900">Choose your seats</h2>
                  <p className="text-xs text-ink-500 mt-0.5">
                    Click available seats to select. They will be held exclusively for you once you continue.
                  </p>
                </div>
                <Button variant="ghost" onClick={() => void refreshSeats()} className="text-xs">
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  Refresh availability
                </Button>
              </div>

              <SeatPicker seats={seats} selectedSeatIds={selectedSeatIds} onToggle={toggleSeat} />

              <div className="mt-8 flex items-center justify-between border-t border-ink-100/70 pt-5">
                <p className="text-xs font-semibold text-ink-500">
                  {selectedSeatIds.length === 0
                    ? "Select at least 1 seat to continue"
                    : `${selectedSeatIds.length} seat(s) selected`}
                </p>
                <Button
                  onClick={() => void holdSelectedSeats()}
                  disabled={selectedSeatIds.length === 0 || actionLoading}
                  loading={actionLoading}
                  className="px-6 shadow-sm hover:shadow"
                >
                  {actionLoading ? "Holding seats..." : "Hold selected seats & continue"}
                </Button>
              </div>
            </div>
          ) : null}

          {/* STEP 2: Passenger Details */}
          {step === 2 ? (
            <div className="panel rounded-[2rem] border border-ink-100/90 bg-white/95 p-6 shadow-sm animate-fade-in space-y-6">
              <div className="flex items-center justify-between border-b border-ink-100/70 pb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-ink-900">
                    Passenger information
                  </h2>
                  <p className="text-xs text-ink-500 mt-0.5">
                    Enter details for each held seat to comply with Tatkal ticket verification rules.
                  </p>
                </div>
                {countdown ? (
                  <div className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/80 px-3 py-1 text-xs font-bold text-amber-800">
                    <TimerReset className="h-3.5 w-3.5 animate-pulse text-amber-600" />
                    Hold: {countdown}
                  </div>
                ) : null}
              </div>

              <div className="space-y-4">
                {heldSeats.map((seat, index) => (
                  <section
                    key={seat.seatId}
                    className="rounded-2xl border border-ink-200/80 bg-ink-50/40 p-5 transition-all shadow-2xs"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white">
                          {index + 1}
                        </span>
                        <h3 className="text-sm font-bold text-ink-900">Passenger {index + 1}</h3>
                      </div>
                      <Badge tone="rail">
                        Seat {seat.coachCode}-{seat.seatNumber} &bull; {seat.berthType}
                      </Badge>
                    </div>

                    <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                      <Field label="Full name">
                        <Input
                          value={passengers[index]?.name ?? ""}
                          onChange={(event) => updatePassenger(index, "name", event.target.value)}
                          placeholder="e.g. Anurag Sharma"
                          required
                        />
                      </Field>

                      <Field label="Age">
                        <Input
                          type="number"
                          min="1"
                          max="120"
                          value={passengers[index]?.age ?? ""}
                          onChange={(event) => updatePassenger(index, "age", event.target.value)}
                          placeholder="Age (years)"
                          required
                        />
                      </Field>

                      <Field label="Gender">
                        <Select
                          value={passengers[index]?.gender ?? "MALE"}
                          onChange={(event) => updatePassenger(index, "gender", event.target.value)}
                        >
                          {genderOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Select>
                      </Field>

                      <Field label="Berth preference">
                        <Select
                          value={passengers[index]?.berthPreference ?? ""}
                          onChange={(event) =>
                            updatePassenger(index, "berthPreference", event.target.value)
                          }
                        >
                          {berthOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Select>
                      </Field>

                      <div className="sm:col-span-2 lg:col-span-2">
                        <Field label="Concession (optional)">
                          <Input
                            value={passengers[index]?.concessionType ?? ""}
                            onChange={(event) =>
                              updatePassenger(index, "concessionType", event.target.value)
                            }
                            placeholder="Optional: SENIOR_CITIZEN, STUDENT, etc."
                          />
                        </Field>
                      </div>
                    </div>
                  </section>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-ink-100/70 pt-5">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Change seats
                </Button>
                <Button
                  onClick={() => {
                    if (validatePassengers()) {
                      setError(null);
                      setStep(3);
                    } else {
                      setError({
                        code: "PASSENGERS_INCOMPLETE",
                        message: "Please provide valid names, ages, and genders for all passengers.",
                      });
                    }
                  }}
                  className="px-6"
                >
                  Review reservation &rarr;
                </Button>
              </div>
            </div>
          ) : null}

          {/* STEP 3: Review & Confirm */}
          {step === 3 ? (
            <div className="panel rounded-[2rem] border border-ink-100/90 bg-white/95 p-6 shadow-sm animate-fade-in space-y-6">
              <div className="flex items-center justify-between border-b border-ink-100/70 pb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-ink-900">Review reservation</h2>
                  <p className="text-xs text-ink-500 mt-0.5">
                    Verify all passenger and seat allocations before final confirmation.
                  </p>
                </div>
                {countdown ? (
                  <div className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/80 px-3 py-1 text-xs font-bold text-amber-800">
                    <TimerReset className="h-3.5 w-3.5 animate-pulse text-amber-600" />
                    Hold: {countdown}
                  </div>
                ) : null}
              </div>

              {/* Passengers Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-500">
                  Confirmed Passenger Roster ({passengers.length})
                </h3>
                {passengers.map((passenger, index) => (
                  <div
                    key={`${heldSeats[index]?.seatId ?? index}`}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-2xl border border-ink-100/80 bg-ink-50/50 p-4"
                  >
                    <div>
                      <p className="font-bold text-ink-900 text-sm">
                        {index + 1}. {passenger.name}
                      </p>
                      <p className="text-xs text-ink-500 mt-0.5">
                        {passenger.gender} &bull; Age {passenger.age} &bull; Preference:{" "}
                        {passenger.berthPreference || "Any"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-rail-100 px-2.5 py-1 font-mono text-xs font-bold text-rail-900">
                        Coach {heldSeats[index]?.coachCode} &bull; Seat {heldSeats[index]?.seatNumber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-ink-100/70 pt-5">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Edit passenger details
                </Button>
                <Button
                  onClick={() => void confirmBooking()}
                  disabled={actionLoading}
                  loading={actionLoading}
                  className="px-8 py-3 text-base shadow-sm hover:shadow"
                >
                  {actionLoading ? "Confirming booking..." : "Confirm & Book Tatkal Ticket"}
                </Button>
              </div>
            </div>
          ) : null}
        </section>

        {/* STICKY SIDEBAR: Reservation Context */}
        <aside className="space-y-4 xl:sticky xl:top-20">
          <div className="panel rail-stripe rounded-[2rem] border border-ink-100/90 bg-white/95 p-6 pl-7 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rail-700">
                Reservation Drawer
              </p>
              <Sparkles className="h-4 w-4 text-rail-500" />
            </div>

            <div className="mt-4 space-y-3.5 border-t border-ink-100/70 pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-500">Train</span>
                <span className="font-bold text-ink-900">#{bookingContext.trainNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-500">Selected seats</span>
                <span className="font-bold text-ink-900">{selectedSeatIds.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-500">Active holds</span>
                <span className="font-bold text-ink-900">{heldSeats.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-500">Hold timer</span>
                <span
                  className={`font-mono font-bold ${
                    countdown ? "text-amber-700" : "text-ink-400"
                  }`}
                >
                  {countdown ?? "Not active"}
                </span>
              </div>
            </div>

            {heldSeats.length > 0 ? (
              <div className="mt-5 border-t border-ink-100/70 pt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400 mb-2">
                  Held Seat Numbers
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {heldSeats.map((s) => (
                    <span
                      key={s.seatId}
                      className="rounded-lg bg-rail-50 border border-rail-200/80 px-2 py-0.5 font-mono text-xs font-bold text-rail-800"
                    >
                      {s.coachCode}-{s.seatNumber}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-ink-50/80 p-3.5 text-xs text-ink-600 border border-ink-100/70">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Seats are locked atomically in Redis. Double-booking prevention guaranteed.
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

