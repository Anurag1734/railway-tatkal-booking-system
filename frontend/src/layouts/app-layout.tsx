import { NavLink, Outlet } from "react-router-dom";
import { LogOut, Ticket, TrainFront, UserCircle2 } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { cn } from "@/lib/cn";

const navigation = [
  { to: "/", label: "Search Trains", icon: TrainFront },
  { to: "/bookings", label: "My Bookings", icon: Ticket },
  { to: "/account", label: "Account", icon: UserCircle2 },
];

export function AppLayout() {
  const { isAuthenticated, logout, profile } = useAuth();

  return (
    <div className="app-shell flex min-h-screen flex-col bg-ink-50/40">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-ink-100/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <NavLink to="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rail-500 to-rail-600 text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
              <TrainFront className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-rail-700">
                  Railway Tatkal
                </p>
                <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 sm:inline-block border border-emerald-200/60">
                  Live Engine
                </span>
              </div>
              <p className="text-xs font-medium text-ink-500">Book faster. Travel simpler.</p>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-1.5 md:flex">
              {navigation.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "focus-ring inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-150",
                      isActive
                        ? "bg-ink-900 text-white shadow-xs"
                        : "text-ink-600 hover:bg-ink-100/70 hover:text-ink-900",
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-2 rounded-xl border border-ink-200/80 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 sm:flex">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="max-w-[120px] truncate font-semibold text-ink-900">
                    {profile?.name ?? "User"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  title="Sign out of your session"
                  className="focus-ring inline-flex items-center gap-1.5 rounded-xl border border-ink-200/80 bg-white px-3 py-2 text-xs font-semibold text-ink-700 shadow-2xs transition hover:bg-ink-50 hover:text-red-700 hover:border-red-200"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/login"
                  className="focus-ring rounded-xl border border-ink-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-ink-700 shadow-2xs transition hover:bg-ink-50 hover:text-ink-900"
                >
                  Sign in
                </NavLink>
                <NavLink
                  to="/register"
                  className="focus-ring rounded-xl bg-ink-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-ink-800"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 pb-24 md:pb-10">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-ink-100 bg-white/95 px-4 py-2 backdrop-blur-md md:hidden">
        <nav className="flex items-center justify-around">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 py-1 text-[11px] font-semibold transition",
                  isActive ? "text-rail-700" : "text-ink-500 hover:text-ink-900",
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Desktop Clean Footer */}
      <footer className="mt-auto hidden border-t border-ink-100/70 bg-white/60 py-6 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 text-xs text-ink-500">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>High-Speed Tatkal Engine &bull; Redis Distributed Locking &bull; PostgreSQL Strict Isolation</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Railway Tatkal Reservation System</p>
        </div>
      </footer>
    </div>
  );
}

