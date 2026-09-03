import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, FolderClock, RotateCcw, Ticket, TrainFront } from "lucide-react";
import { getMyBookings } from "@/api/booking-api";
import { EmptyState } from "@/components/feedback/empty-state";
import { InlineAlert } from "@/components/feedback/inline-alert";
import { BookingCardSkeleton } from "@/components/feedback/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateTime } from "@/lib/format";
import { toAppError, type AppError } from "@/lib/http-error";
import type { BookingResponse } from "@/types/api";

type FilterTab = "ALL" | "CONFIRMED" | "CANCELLED";

export function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    void loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (nextError) {
      setError(toAppError(nextError));
    } finally {
      setLoading(false);
    }
  }

  const filteredBookings = useMemo(() => {
    if (activeTab === "ALL") return bookings;
    return bookings.filter((b) => b.status === activeTab);
  }, [activeTab, bookings]);

  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const cancelledCount = bookings.filter((b) => b.status === "CANCELLED").length;

  return (
    <div className="section-grid max-w-5xl mx-auto">
      {/* Header Banner */}
      <section className="panel rounded-[2rem] border border-ink-100/90 bg-white/95 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center gap-1 rounded-full bg-rail-50 px-2.5 text-[11px] font-bold uppercase tracking-wider text-rail-700 border border-rail-200/70">
                <Ticket className="h-3 w-3 text-rail-500" />
                Reservations
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              My train bookings
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">
              Manage your confirmed journeys, review passenger seat allocations, or cancel reservations.
            </p>
          </div>

          <Link to="/">
            <Button variant="secondary" className="shadow-xs text-xs">
              <TrainFront className="mr-1.5 h-3.5 w-3.5" />
              Book new journey
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        {!loading && bookings.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2 border-t border-ink-100/70 pt-4">
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === "ALL"
                  ? "bg-ink-900 text-white shadow-2xs"
                  : "bg-ink-50 text-ink-600 hover:bg-ink-100"
              }`}
            >
              All Bookings ({bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("CONFIRMED")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === "CONFIRMED"
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "bg-ink-50 text-ink-600 hover:bg-ink-100"
              }`}
            >
              Confirmed ({confirmedCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("CANCELLED")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === "CANCELLED"
                  ? "bg-red-700 text-white shadow-2xs"
                  : "bg-ink-50 text-ink-600 hover:bg-ink-100"
              }`}
            >
              Cancelled ({cancelledCount})
            </button>
          </div>
        ) : null}
      </section>

      {/* Error State */}
      {error ? (
        <InlineAlert
          tone="error"
          title="Something went wrong"
          message={error.message || "We couldn't load your bookings right now."}
          action={
            <Button variant="ghost" onClick={() => void loadBookings()} className="text-xs">
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Try again
            </Button>
          }
        />
      ) : null}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid gap-4">
          <BookingCardSkeleton />
          <BookingCardSkeleton />
          <BookingCardSkeleton />
        </div>
      ) : bookings.length === 0 ? (
        /* Empty State */
        <EmptyState
          icon={FolderClock}
          title="No bookings yet"
          message="Your confirmed journeys will appear here once you reserve your train seats."
          action={
            <Link to="/">
              <Button variant="primary" className="shadow-xs">
                Search trains
              </Button>
            </Link>
          }
        />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title={`No ${activeTab.toLowerCase()} bookings found`}
          message={`There are no journeys with status "${activeTab.toLowerCase()}".`}
          action={
            <Button variant="ghost" onClick={() => setActiveTab("ALL")}>
              View all bookings
            </Button>
          }
        />
      ) : (
        /* Bookings List */
        <div className="grid gap-4">
          {filteredBookings.map((booking) => {
            const isConfirmed = booking.status === "CONFIRMED";
            const isCancelled = booking.status === "CANCELLED";

            return (
              <article
                key={booking.bookingReference}
                className="group panel rounded-[1.75rem] border border-ink-100/90 bg-white/95 p-6 shadow-sm hover:shadow-card hover:border-rail-300 transition-all duration-150"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Badge
                        tone={isConfirmed ? "success" : isCancelled ? "danger" : "warning"}
                        dot
                      >
                        {booking.status}
                      </Badge>
                      <span className="font-mono text-xs font-bold text-ink-500">
                        PNR: {booking.bookingReference}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold tracking-tight text-ink-900 group-hover:text-rail-900 transition-colors">
                        {booking.trainName ?? booking.trainNumber ?? "Express Service"}
                      </h2>
                      <p className="text-xs font-semibold text-ink-600 mt-0.5">
                        {booking.sourceStationCode} &rarr; {booking.destinationStationCode} &bull;{" "}
                        {formatDate(booking.journeyDate)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
                      <span>Booked on {formatDateTime(booking.createdAt)}</span>
                      {booking.seatAllocations && booking.seatAllocations.length > 0 ? (
                        <>
                          <span>&bull;</span>
                          <span className="font-semibold text-ink-700">
                            Seats:{" "}
                            {booking.seatAllocations
                              .map((s) => `${s.coachCode}-${s.seatNumber}`)
                              .join(", ")}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <Link to={`/bookings/${booking.bookingReference}`}>
                      <Button variant="ghost" className="group/btn text-xs font-semibold shadow-2xs">
                        <span>View details</span>
                        <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

