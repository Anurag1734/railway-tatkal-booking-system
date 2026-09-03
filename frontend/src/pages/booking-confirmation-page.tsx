import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Check,
  CheckCircle2,
  Copy,
  TrainFront,
} from "lucide-react";
import { getBooking } from "@/api/booking-api";
import { InlineAlert } from "@/components/feedback/inline-alert";
import { PageLoader } from "@/components/feedback/page-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateTime } from "@/lib/format";
import { toAppError, type AppError } from "@/lib/http-error";
import type { BookingResponse } from "@/types/api";

export function BookingConfirmationPage() {
  const { bookingReference = "" } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState<BookingResponse | null>(
    (location.state as { booking?: BookingResponse } | null)?.booking ?? null,
  );
  const [loading, setLoading] = useState(!booking);
  const [error, setError] = useState<AppError | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (booking || !bookingReference) {
      return;
    }

    setLoading(true);
    void getBooking(bookingReference)
      .then(setBooking)
      .catch((nextError) => setError(toAppError(nextError)))
      .finally(() => setLoading(false));
  }, [booking, bookingReference]);

  function handleCopy() {
    if (!booking) return;
    void navigator.clipboard.writeText(booking.bookingReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return <PageLoader label="Generating your verified booking confirmation..." />;
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <InlineAlert
          tone="error"
          title="Booking not available"
          message={error?.message ?? "We could not load this booking confirmation."}
          action={
            <Link to="/bookings">
              <Button variant="ghost">Check my bookings</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl section-grid py-4 animate-fade-in">
      <section className="panel relative overflow-hidden rounded-[2.25rem] border border-ink-100/90 bg-white/95 p-6 sm:p-10 shadow-card">
        {/* Top Success Banner */}
        <div className="flex flex-col items-center text-center pb-8 border-b border-ink-100/70">
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-35" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
              <Check className="h-7 w-7 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
            Reservation Confirmed
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            You're all set to travel!
          </h1>
          <p className="mt-1.5 text-xs text-ink-500 max-w-md">
            Your Tatkal reservation is securely recorded in the railway system. A digital confirmation is stored under your account.
          </p>

          {/* Reference Pill with 1-Click Copy */}
          <div className="mt-6 inline-flex items-center gap-2.5 rounded-2xl border border-ink-200/90 bg-ink-50/80 px-4 py-2 shadow-2xs">
            <span className="text-xs font-semibold text-ink-500">Booking Ref:</span>
            <span className="font-mono text-base font-extrabold tracking-wider text-ink-900">
              {booking.bookingReference}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="ml-1 rounded-lg p-1 text-ink-400 hover:bg-ink-200/60 hover:text-ink-700 transition"
              title="Copy Reference"
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            {copied ? (
              <span className="text-[11px] font-bold text-emerald-700 animate-fade-in-fast">
                Copied!
              </span>
            ) : null}
          </div>
        </div>

        {/* E-Ticket Card Layout */}
        <div className="my-8 rounded-2xl border border-ink-200/80 bg-ink-50/40 p-5 sm:p-6 space-y-5">
          {/* Train Identity */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rail-500 text-white">
                <TrainFront className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-ink-900">{booking.trainName}</h2>
                <p className="text-xs text-ink-500 font-semibold">
                  Train #{booking.trainNumber} &bull; Tatkal Quota
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Date</p>
              <p className="text-sm font-bold text-ink-900">{formatDate(booking.journeyDate)}</p>
            </div>
          </div>

          {/* Route details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Journey</p>
              <p className="mt-1 text-base font-bold text-ink-900">
                {booking.sourceStationCode} &rarr; {booking.destinationStationCode}
              </p>
              <p className="text-xs text-ink-500 mt-0.5">
                {booking.sourceStationName} to {booking.destinationStationName}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">
                Booked On
              </p>
              <p className="mt-1 text-sm font-semibold text-ink-900">
                {formatDateTime(booking.createdAt)}
              </p>
              <Badge tone="success" dot className="mt-1">
                {booking.status}
              </Badge>
            </div>
          </div>

          {/* Passengers & Seat Allocation */}
          <div className="border-t border-ink-100 pt-4 space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-500">
              Allocated Passengers &amp; Berths
            </p>
            {(booking.passengers ?? []).map((passenger, index) => {
              const seat = booking.seatAllocations?.[index];

              return (
                <div
                  key={`${passenger.name}-${index}`}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-xl bg-white p-3.5 border border-ink-100 shadow-2xs"
                >
                  <div>
                    <p className="text-sm font-bold text-ink-900">
                      {index + 1}. {passenger.name}
                    </p>
                    <p className="text-xs text-ink-500">
                      {passenger.gender} &bull; Age {passenger.age}
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-lg bg-rail-50 border border-rail-200/80 px-2.5 py-1 font-mono text-xs font-bold text-rail-900">
                      {seat ? `Coach ${seat.coachCode} • Seat ${seat.seatNumber} (${seat.berthType})` : "Allocated"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Link to={`/bookings/${booking.bookingReference}`}>
            <Button className="shadow-xs">View booking details</Button>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/bookings">
              <Button variant="ghost">My bookings</Button>
            </Link>
            <Link to="/">
              <Button variant="secondary">Book another journey</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

