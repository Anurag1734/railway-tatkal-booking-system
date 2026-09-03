import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { InlineAlert } from "@/components/feedback/inline-alert";
import { useAuth, type AppError } from "@/features/auth/auth-context";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const state = location.state as { redirectTo?: string; notice?: string } | null;
  const redirectTo = state?.redirectTo ?? "/";
  const notice = state?.notice ?? null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (nextError) {
      setError(nextError as AppError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">Sign in</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          Welcome back. Continue your journey.
        </p>
      </div>

      {notice ? (
        <div className="mt-5">
          <InlineAlert tone="success" title="Ready to sign in" message={notice} />
        </div>
      ) : null}

      <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
        <Field label="Email">
          <div className="relative">
            <Input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="name@example.com"
              autoComplete="email"
              required
              className="pl-10"
            />
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          </div>
        </Field>

        <Field label="Password">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="pl-10 pr-10"
            />
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rail-400"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        {error ? (
          <InlineAlert
            tone="error"
            title="Authentication issue"
            message={error.message || "Invalid email or password. Please try again."}
          />
        ) : null}

        <div className="pt-2">
          <Button
            className="w-full py-3 text-base shadow-sm hover:shadow"
            type="submit"
            loading={submitting}
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>

      <div className="mt-8 border-t border-ink-100 pt-6 text-center">
        <p className="text-sm text-ink-600">
          New to the system?{" "}
          <Link
            className="font-semibold text-rail-700 underline-offset-4 hover:text-rail-800 hover:underline"
            to="/register"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

