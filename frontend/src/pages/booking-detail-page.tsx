import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Ticket,
  TrainFront,
  Users,
  X,
} from "lucide-react";
import { cancelBooking, getBooking } from "@/api/booking-api";
import { InlineAlert } from "@/components/feedback/inline-alert";
import { PageLoader } from "@/components/feedback/page-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateTime } from "@/lib/format";
import { toAppError, type AppError } from "@/lib/http-error";
import type { BookingResponse } from "@/types/api";

export function BookingDetailPage() {
  const { bookingReference = "" } = useParams();
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!bookingReference) {
      return;
    }

    void getBooking(bookingReference)
      .then(setBooking)
      .catch((nextError) => setError(toAppError(nextError)))
      .finally(() => setLoading(false));
  }, [bookingReference]);

  function handleCopy() {
    if (!booking) return;
    void navigator.clipboard.writeText(booking.bookingReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleConfirmCancel() {
    if (!bookingReference) {
      return;
    }

    setCanceling(true);
    setError(null);

    try {
      const updated = await cancelBooking(bookingReference);
      setBooking(updated);
      setShowCancelModal(false);
    } catch (nextError) {
      setError(toAppError(nextError));
    } finally {
      setCanceling(false);
    }
  }

  if (loading) {
    return <PageLoader label="Loading booking details and seat allocations..." />;
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <InlineAlert
          tone="error"
          title="Booking not found"
          message={error?.message ?? "We could not find the requested booking reference."}
          action={
            <Link to="/bookings">
              <Button variant="ghost">Return to my bookings</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const isConfirmed = booking.status === "CONFIRMED";
  const isCancelled = booking.status === "CANCELLED";

  return (
    <div className="section-grid max-w-4xl mx-auto py-2 animate-fade-in">
      {/* Top back navigation */}
      <div>
        <Link
          to="/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-ink-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all bookings
        </Link>
      </div>

      {error ? (
        <InlineAlert
          tone="error"
          title="Booking action failed"
          message={error.message}
          onClose={() => setError(null)}
        />
      ) : null}

      {isCancelled ? (
        <InlineAlert
          tone="warning"
          title="Reservation Cancelled"
          message="This reservation was cancelled. The associated seat allocations have been released back to the live Tatkal pool."
        />
      ) : null}

      {/* Main Ticket Card */}
      <section className="panel rounded-[2.25rem] border border-ink-100/90 bg-white/95 p-6 sm:p-8 shadow-card">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-100/70 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rail-500 to-rail-600 text-white shadow-xs">
              <TrainFront className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rail-700">
                  Tatkal E-Ticket
                </span>
                <Badge tone={isConfirmed ? "success" : isCancelled ? "danger" : "warning"} dot>
                  {booking.status}
                </Badge>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl mt-0.5">
                {booking.trainName ?? "Express Train"}
              </h1>
              <p className="text-xs font-semibold text-ink-500">
                Train #{booking.trainNumber} &bull; Journey on {formatDate(booking.journeyDate)}
              </p>
            </div>
          </div>

          {/* Reference pill */}
          <div className="flex items-center gap-2 rounded-2xl border border-ink-200/90 bg-ink-50/80 px-3.5 py-1.5 shadow-2xs">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">PNR Reference</p>
              <p className="font-mono text-sm font-extrabold text-ink-900">{booking.bookingReference}</p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg p-1 text-ink-400 hover:bg-ink-200/60 hover:text-ink-700 transition"
              title="Copy Reference"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Route Snapshot */}
        <div className="my-6 grid gap-4 rounded-2xl bg-ink-50/70 p-5 border border-ink-100/60 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Route Corridor</p>
            <p className="mt-1 text-lg font-extrabold text-ink-900">
              {booking.sourceStationCode} &rarr; {booking.destinationStationCode}
            </p>
            <p className="mt-0.5 text-xs text-ink-600">
              {booking.sourceStationName} to {booking.destinationStationName}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Booking Timestamp</p>
            <p className="mt-1 text-sm font-semibold text-ink-900">
              {formatDateTime(booking.createdAt)}
            </p>
            <p className="text-xs text-ink-500 mt-0.5">Verified Reservation Record</p>
          </div>
        </div>

        {/* Passengers & Allocated Seats Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Passenger Roster */}
          <section className="rounded-2xl border border-ink-100/80 bg-white p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-3.5">
              <Users className="h-4 w-4 text-rail-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-700">
                Passengers ({(booking.passengers ?? []).length})
              </h2>
            </div>
            <div className="space-y-2.5">
              {(booking.passengers ?? []).map((passenger, index) => (
                <div
                  key={`${passenger.name}-${index}`}
                  className="rounded-xl bg-ink-50/70 p-3 border border-ink-100/60"
                >
                  <p className="text-sm font-bold text-ink-900">
                    {index + 1}. {passenger.name}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-600">
                    {passenger.gender} &bull; Age {passenger.age} &bull; Preference:{" "}
                    <span className="font-semibold text-ink-700">
                      {passenger.berthPreference || "No preference"}
                    </span>
                  </p>
                  {passenger.concessionType ? (
                    <span className="mt-1 inline-block rounded bg-rail-50 px-2 py-0.5 text-[10px] font-semibold text-rail-800">
                      Concession: {passenger.concessionType}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          {/* Allocated Seats */}
          <section className="rounded-2xl border border-ink-100/80 bg-white p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-3.5">
              <Ticket className="h-4 w-4 text-rail-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-700">
                Allocated Seats ({(booking.seatAllocations ?? []).length})
              </h2>
            </div>
            <div className="space-y-2.5">
              {(booking.seatAllocations ?? []).map((seat) => (
                <div
                  key={seat.seatId}
                  className="flex items-center justify-between rounded-xl bg-ink-50/70 p-3 border border-ink-100/60"
                >
                  <div>
                    <p className="font-mono text-base font-bold text-ink-900">
                      Coach {seat.coachCode} &bull; Seat {seat.seatNumber}
                    </p>
                    <p className="text-xs text-ink-500">{seat.berthType}</p>
                  </div>
                  <Badge tone={seat.status === "BOOKED" ? "brand" : "neutral"}>
                    {seat.status}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Cancellation Action */}
        {isConfirmed ? (
          <div className="mt-8 border-t border-ink-100/70 pt-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-ink-900">Need to cancel this trip?</p>
              <p className="text-xs text-ink-500">
                Cancelling will release your reserved seats back into the live Tatkal pool.
              </p>
            </div>
            <Button
              variant="danger"
              onClick={() => setShowCancelModal(true)}
              className="shadow-xs text-xs"
            >
              Cancel this booking
            </Button>
          </div>
        ) : null}
      </section>

      {/* Cancellation Confirmation Modal */}
      {showCancelModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 px-4 backdrop-blur-sm animate-fade-in-fast">
          <div className="panel w-full max-w-md rounded-[2rem] border border-ink-200/80 bg-white p-6 shadow-elevated">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-200/70">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="rounded-lg p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700 transition"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-bold text-ink-900">
                Cancel reservation {booking.bookingReference}?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Are you sure you want to cancel this booking for{" "}
                <strong className="text-ink-900">{booking.trainName}</strong>? Your allocated seats
                will be immediately unlocked and released back to live Tatkal inventory.
              </p>
              <div className="mt-3 rounded-xl bg-ink-50 p-3 text-xs text-ink-500 border border-ink-100">
                This action is immediate and cannot be undone.
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-ink-100 pt-4">
              <Button
                variant="ghost"
                onClick={() => setShowCancelModal(false)}
                disabled={canceling}
              >
                No, keep booking
              </Button>
              <Button
                variant="danger"
                onClick={() => void handleConfirmCancel()}
                loading={canceling}
                disabled={canceling}
              >
                {canceling ? "Cancelling..." : "Yes, cancel booking"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

