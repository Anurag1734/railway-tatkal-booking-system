import { Link } from "react-router-dom";
import {
  Calendar,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { InlineAlert } from "@/components/feedback/inline-alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";

export function AccountPage() {
  const { profile, logout } = useAuth();

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <InlineAlert
          tone="warning"
          title="Profile unavailable"
          message="We could not load your account details right now. Please try signing in again."
          action={
            <Link to="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="section-grid max-w-4xl mx-auto py-2 animate-fade-in">
      {/* Profile Header */}
      <section className="panel rounded-[2.25rem] border border-ink-100/90 bg-white/95 p-6 sm:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rail-400 to-rail-600 text-white font-extrabold text-xl shadow-md ring-4 ring-rail-100">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rail-700">
                  Passenger Account
                </span>
                <Badge tone="success" dot>
                  Verified
                </Badge>
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
                {profile.name}
              </h1>
              <p className="text-xs font-medium text-ink-500">
                User ID #{profile.userId} &bull; {profile.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link to="/bookings">
              <Button variant="ghost" className="text-xs shadow-2xs">
                <Ticket className="mr-1.5 h-3.5 w-3.5" />
                My bookings
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={logout}
              className="text-xs shadow-2xs hover:text-red-700 hover:border-red-200"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Sign out
            </Button>
          </div>
        </div>
      </section>

      {/* Profile Metrics Grid */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="panel rounded-[1.75rem] border border-ink-100/90 bg-white/95 p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-ink-400">
            <Mail className="h-4 w-4 text-rail-500" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">
              Email Address
            </p>
          </div>
          <p className="mt-2 text-base font-bold text-ink-900 truncate">{profile.email}</p>
          <p className="mt-0.5 text-xs text-ink-500">Used for reservation confirmations &amp; security</p>
        </div>

        <div className="panel rounded-[1.75rem] border border-ink-100/90 bg-white/95 p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-ink-400">
            <Phone className="h-4 w-4 text-rail-500" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">
              Mobile Number
            </p>
          </div>
          <p className="mt-2 text-base font-bold text-ink-900">{profile.phone}</p>
          <p className="mt-0.5 text-xs text-ink-500">Linked to IRCTC verified passenger ID</p>
        </div>

        <div className="panel rounded-[1.75rem] border border-ink-100/90 bg-white/95 p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-ink-400">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">
              Access Role
            </p>
          </div>
          <p className="mt-2 text-base font-bold text-ink-900">{profile.role}</p>
          <p className="mt-0.5 text-xs text-ink-500">Standard Tatkal user privileges</p>
        </div>

        <div className="panel rounded-[1.75rem] border border-ink-100/90 bg-white/95 p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-ink-400">
            <Calendar className="h-4 w-4 text-rail-500" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">
              Member Since
            </p>
          </div>
          <p className="mt-2 text-base font-bold text-ink-900">
            {formatDateTime(profile.createdAt)}
          </p>
          <p className="mt-0.5 text-xs text-ink-500">Registration timestamp</p>
        </div>
      </section>
    </div>
  );
}

