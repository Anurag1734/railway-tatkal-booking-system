import { ArrowLeftRight, Calendar, MapPin, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export interface SearchFormValues {
  from: string;
  to: string;
  date: string;
}

const POPULAR_ROUTES = [
  { from: "CSMT", to: "NDLS", label: "Mumbai → Delhi" },
  { from: "CSMT", to: "ST", label: "Mumbai → Surat" },
  { from: "ST", to: "NDLS", label: "Surat → Delhi" },
  { from: "BRC", to: "NDLS", label: "Vadodara → Delhi" },
];

export function SearchForm({
  values,
  errors,
  loading,
  onChange,
  onSubmit,
}: {
  values: SearchFormValues;
  errors: Partial<Record<keyof SearchFormValues, string>>;
  loading: boolean;
  onChange: (next: SearchFormValues) => void;
  onSubmit: () => void;
}) {
  const today = new Date().toISOString().split("T")[0];

  function handleSwap() {
    onChange({
      ...values,
      from: values.to,
      to: values.from,
    });
  }

  function setDateOffset(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    onChange({ ...values, date: d.toISOString().split("T")[0] });
  }

  return (
    <section className="panel rounded-[2rem] border border-ink-100/90 bg-white/95 p-6 shadow-panel sm:p-8">
      {/* Header Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 items-center gap-1 rounded-full bg-rail-50 px-2.5 text-[11px] font-bold uppercase tracking-wider text-rail-700 border border-rail-200/70">
              <Sparkles className="h-3 w-3 text-rail-500" />
              Tatkal Search
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              Live Network
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            Find your train and reserve seats
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
            Search active train runs across all major corridors with real-time seat inventory.
          </p>
        </div>
      </div>

      {/* Main Search Inputs Grid */}
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_1.1fr_auto] lg:items-end">
        {/* From Station */}
        <Field label="From station" error={errors.from}>
          <div className="relative">
            <Input
              value={values.from}
              onChange={(event) => onChange({ ...values, from: event.target.value.toUpperCase() })}
              placeholder="e.g. CSMT"
              maxLength={10}
              className="pl-10 uppercase font-semibold tracking-wide"
            />
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          </div>
        </Field>

        {/* Swap Origin / Destination Button */}
        <div className="flex justify-center pb-1 lg:pb-1.5">
          <button
            type="button"
            onClick={handleSwap}
            title="Swap stations"
            aria-label="Swap origin and destination stations"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-ink-200/90 bg-ink-50 text-ink-600 shadow-2xs transition hover:border-rail-400 hover:bg-rail-50 hover:text-rail-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rail-400"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        </div>

        {/* To Station */}
        <Field label="To station" error={errors.to}>
          <div className="relative">
            <Input
              value={values.to}
              onChange={(event) => onChange({ ...values, to: event.target.value.toUpperCase() })}
              placeholder="e.g. NDLS"
              maxLength={10}
              className="pl-10 uppercase font-semibold tracking-wide"
            />
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-rail-600" />
          </div>
        </Field>

        {/* Journey Date */}
        <Field label="Journey date" error={errors.date}>
          <div className="relative">
            <Input
              type="date"
              value={values.date}
              onChange={(event) => onChange({ ...values, date: event.target.value })}
              min={today}
              className="pl-10 font-medium"
            />
            <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          </div>
        </Field>

        {/* CTA Button */}
        <div className="flex items-end pt-1 lg:pt-0">
          <Button
            className="w-full py-3 px-6 text-sm font-semibold shadow-sm hover:shadow"
            onClick={onSubmit}
            loading={loading}
            disabled={loading}
          >
            <Search className="mr-2 h-4 w-4" />
            {loading ? "Searching..." : "Search trains"}
          </Button>
        </div>
      </div>

      {/* Date Shortcuts & Route Chips */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100/70 pt-4 text-xs text-ink-500">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-ink-700">Quick routes:</span>
          {POPULAR_ROUTES.map((route) => (
            <button
              key={`${route.from}-${route.to}`}
              type="button"
              onClick={() => onChange({ ...values, from: route.from, to: route.to })}
              className="rounded-lg border border-ink-200/70 bg-ink-50/60 px-2.5 py-1 font-medium text-ink-700 transition hover:border-rail-300 hover:bg-rail-50 hover:text-rail-800"
            >
              {route.from} &rarr; {route.to}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-ink-700">Date:</span>
          <button
            type="button"
            onClick={() => setDateOffset(0)}
            className="rounded-lg border border-ink-200/70 bg-white px-2 py-0.5 font-medium hover:bg-ink-50 text-ink-700"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setDateOffset(1)}
            className="rounded-lg border border-ink-200/70 bg-white px-2 py-0.5 font-medium hover:bg-ink-50 text-ink-700"
          >
            Tomorrow
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...values, date: "2026-09-15" })}
            className="rounded-lg border border-rail-300 bg-rail-50/80 px-2 py-0.5 font-medium hover:bg-rail-100 text-rail-900"
            title="Seeded test schedule"
          >
            15 Sep (Demo)
          </button>
        </div>
      </div>
    </section>
  );
}

