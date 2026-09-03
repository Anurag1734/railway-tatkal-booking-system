import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, RotateCcw, SearchX, TrainFront } from "lucide-react";
import { searchTrains } from "@/api/train-api";
import { EmptyState } from "@/components/feedback/empty-state";
import { InlineAlert } from "@/components/feedback/inline-alert";
import { PageLoader } from "@/components/feedback/page-loader";
import { TrainCardSkeleton } from "@/components/feedback/skeletons";
import { Button } from "@/components/ui/button";
import { SearchForm, type SearchFormValues } from "@/features/trains/search-form";
import { TrainResults } from "@/features/trains/train-results";
import { useAuth } from "@/features/auth/auth-context";
import { toAppError, type AppError } from "@/lib/http-error";
import type { TrainSearchResponse } from "@/types/api";

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, isBootstrapping } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState<SearchFormValues>({
    from: searchParams.get("from") ?? "",
    to: searchParams.get("to") ?? "",
    date: searchParams.get("date") ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SearchFormValues, string>>>({});
  const [results, setResults] = useState<TrainSearchResponse[]>([]);
  const [error, setError] = useState<AppError | null>(null);
  const [loading, setLoading] = useState(false);

  const hasSearch = useMemo(
    () => Boolean(searchParams.get("from") && searchParams.get("to") && searchParams.get("date")),
    [searchParams],
  );

  useEffect(() => {
    if (!isAuthenticated || !hasSearch) {
      return;
    }

    const from = searchParams.get("from") ?? "";
    const to = searchParams.get("to") ?? "";
    const date = searchParams.get("date") ?? "";

    setForm({ from, to, date });
    void runSearch({ from, to, date });
  }, [hasSearch, isAuthenticated, searchParams]);

  async function runSearch(values: SearchFormValues): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      const data = await searchTrains(values);
      setResults(data);
    } catch (nextError) {
      setResults([]);
      setError(toAppError(nextError));
    } finally {
      setLoading(false);
    }
  }

  function validate(values: SearchFormValues) {
    const nextErrors: Partial<Record<keyof SearchFormValues, string>> = {};

    if (!values.from.trim()) {
      nextErrors.from = "Enter source station code (e.g. CSMT).";
    }
    if (!values.to.trim()) {
      nextErrors.to = "Enter destination station code (e.g. NDLS).";
    }
    if (!values.date) {
      nextErrors.date = "Choose your travel date.";
    }
    if (values.from.trim() && values.to.trim() && values.from === values.to) {
      nextErrors.to = "Source and destination must be different stations.";
    }

    return nextErrors;
  }

  function handleSubmit() {
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const normalized = {
      from: form.from.trim().toUpperCase(),
      to: form.to.trim().toUpperCase(),
      date: form.date,
    };

    setForm(normalized);
    setSearchParams(normalized);

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          redirectTo: `/?from=${normalized.from}&to=${normalized.to}&date=${normalized.date}`,
        },
      });
      return;
    }

    void runSearch(normalized);
  }

  function handleSelect(train: TrainSearchResponse) {
    const params = new URLSearchParams({
      trainRunId: String(train.trainRunId),
      trainId: String(train.trainId),
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      trainType: train.trainType,
      sourceStationId: String(train.sourceStationId),
      sourceStationCode: train.sourceStation,
      sourceStationName: train.sourceStationName,
      destinationStationId: String(train.destinationStationId),
      destinationStationCode: train.destinationStation,
      destinationStationName: train.destinationStationName,
      runDate: train.runDate,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
    });

    navigate(`/booking?${params.toString()}`);
  }

  if (isBootstrapping) {
    return <PageLoader label="Connecting to Railway Tatkal service..." />;
  }

  return (
    <div className="section-grid max-w-6xl mx-auto">
      {!isAuthenticated ? (
        <InlineAlert
          tone="info"
          title="Sign in recommended for Tatkal reservation"
          message="You can search schedules freely. To hold seats and secure Tatkal bookings, sign in to your verified account."
          action={
            <Link to="/login">
              <Button variant="ghost" className="text-xs py-1.5 px-3">
                <span>Sign in now</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          }
        />
      ) : null}

      <SearchForm
        values={form}
        errors={errors}
        loading={loading}
        onChange={(next) => {
          setForm(next);
          setErrors({});
        }}
        onSubmit={handleSubmit}
      />

      {error ? (
        <InlineAlert
          tone="error"
          title="Unable to complete train search"
          message={error.message || "We encountered an issue checking train schedules. Please try again."}
          action={
            <Button
              variant="ghost"
              className="text-xs py-1.5 px-3"
              onClick={() => void runSearch(form)}
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Try again
            </Button>
          }
        />
      ) : null}

      {loading ? (
        <div className="grid gap-4">
          <TrainCardSkeleton />
          <TrainCardSkeleton />
        </div>
      ) : hasSearch && results.length === 0 && !error ? (
        <EmptyState
          icon={SearchX}
          title="No train runs found for this date"
          message={`No direct Tatkal services were found between ${form.from || "origin"} and ${form.to || "destination"} on this date. Try another date or a different station corridor.`}
          action={
            <Button
              variant="ghost"
              onClick={() => {
                const today = new Date().toISOString().split("T")[0];
                const demo = { from: "CSMT", to: "NDLS", date: today };
                setForm(demo);
                setSearchParams(demo);
                if (isAuthenticated) void runSearch(demo);
              }}
            >
              Search Mumbai (CSMT) → Delhi (NDLS)
            </Button>
          }
        />
      ) : results.length > 0 ? (
        <TrainResults results={results} onSelect={handleSelect} />
      ) : (
        <EmptyState
          icon={TrainFront}
          title="Ready to book your Tatkal journey"
          message="Select your origin, destination station, and travel date above to view live trains and hold seats."
        />
      )}
    </div>
  );
}

