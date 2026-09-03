import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Sparkles, TrainFront } from "lucide-react";

export function AuthLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-ink-100/80 bg-white shadow-panel">
        <div className="grid lg:grid-cols-[1.12fr_0.88fr]">
          {/* LEFT SIDE: Railway & Travel Visual (Desktop / Tablet) */}
          <section className="relative hidden min-h-[640px] flex-col justify-between overflow-hidden bg-ink-950 p-10 text-white lg:flex xl:p-12">
            {/* Background Train Image with graceful fallback */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/train-hero.jpg"
                alt="Modern passenger express train on railway tracks"
                className="h-full w-full object-cover object-[65%_center] transition-transform duration-1000 ease-out hover:scale-105"
                loading="eager"
              />
              {/* Gradient overlays for cinematic depth & pristine contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/75 to-ink-950/50" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/40 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(221,151,62,0.15),transparent_65%)]" />
            </div>

            {/* Header / Brand */}
            <div className="relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-rail-400 to-rail-600 text-white shadow-md shadow-rail-900/30 ring-1 ring-white/20">
                  <TrainFront className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-rail-300">
                    Railway Tatkal
                  </p>
                  <p className="text-xs font-medium text-white/70">Express Reservation System</p>
                </div>
              </div>

              <div className="mt-8 max-w-md">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Book your journey with confidence
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  High-speed Tatkal engine with real-time seat holds and guaranteed single-allocation
                  concurrency.
                </p>
              </div>
            </div>

            {/* Middle Feature Highlights */}
            <div className="relative z-10 my-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rail-200">
                  <Sparkles className="h-3.5 w-3.5 text-rail-400" />
                  Engineering Highlights
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/85">
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-2.5 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Live Seat Inventory
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-2.5 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-rail-400" />
                    5-Min Seat Hold
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-2.5 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Redis Concurrency Lock
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-2.5 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-rail-400" />
                    Instant PNR Generation
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Tagline */}
            <div className="relative z-10 flex items-center gap-2 text-xs font-medium text-white/60">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Bank-grade JWT security & deterministic inventory allocation</span>
            </div>
          </section>

          {/* RIGHT SIDE: Authentication Form & Mobile Visual Header */}
          <section className="flex flex-col justify-between p-6 sm:p-10 lg:p-12">
            {/* Mobile Header: Compact Railway Visual */}
            <div className="relative -mx-6 -mt-6 mb-6 overflow-hidden bg-ink-950 p-6 text-white sm:-mx-10 sm:-mt-10 sm:mb-8 sm:p-8 lg:hidden">
              <img
                src="/images/train-hero.jpg"
                alt="Modern passenger express train"
                className="absolute inset-0 h-full w-full object-cover object-center opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/85 to-transparent" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rail-500 text-white shadow-xs">
                    <TrainFront className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rail-300">
                      Railway Tatkal
                    </p>
                    <p className="text-sm font-bold text-white">Book with confidence</p>
                  </div>
                </div>
                <NavLink
                  to="/"
                  className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm transition hover:bg-white/20"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Search
                </NavLink>
              </div>
            </div>

            {/* Desktop Top Nav */}
            <div className="hidden items-center justify-between lg:flex">
              <NavLink
                to="/"
                className="group inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition-colors hover:text-ink-900"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                Back to search
              </NavLink>
            </div>

            {/* Form Content with smooth keyframe transition */}
            <div className="my-auto py-4">
              <div key={location.pathname} className="animate-fade-in">
                <Outlet />
              </div>
            </div>

            {/* Subtle Footer */}
            <div className="mt-6 pt-4 text-center text-xs text-ink-400 border-t border-ink-100/60">
              Railway Tatkal Booking System &bull; Fast, Calm &amp; Reliable
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

