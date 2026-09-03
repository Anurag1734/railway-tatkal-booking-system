import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { InlineAlert } from "@/components/feedback/inline-alert";
import { useAuth, type AppError } from "@/features/auth/auth-context";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await register(form);
      navigate("/login", {
        replace: true,
        state: {
          notice: "Account created successfully! Please sign in with your credentials.",
        },
      });
    } catch (nextError) {
      setError(nextError as AppError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">Create your account</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          Join Railway Tatkal for instant access to live train seats and reservations.
        </p>
      </div>

      <form className="mt-7 space-y-3.5" onSubmit={handleSubmit}>
        <Field label="Full name">
          <div className="relative">
            <Input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Anurag Sharma"
              autoComplete="name"
              required
              className="pl-10"
            />
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          </div>
        </Field>

        <Field label="Email">
          <div className="relative">
            <Input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="pl-10"
            />
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          </div>
        </Field>

        <Field label="Phone">
          <div className="relative">
            <Input
              type="tel"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              placeholder="9876543210"
              autoComplete="tel"
              required
              className="pl-10"
            />
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          </div>
        </Field>

        <Field label="Password" hint="Use at least 8 characters.">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              minLength={8}
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
            title="Registration failed"
            message={error.message || "We could not complete your registration. Please check your details."}
          />
        ) : null}

        <div className="pt-2">
          <Button
            className="w-full py-3 text-base shadow-sm hover:shadow"
            type="submit"
            loading={submitting}
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Register"}
          </Button>
        </div>
      </form>

      <div className="mt-8 border-t border-ink-100 pt-6 text-center">
        <p className="text-sm text-ink-600">
          Already registered?{" "}
          <Link
            className="font-semibold text-rail-700 underline-offset-4 hover:text-rail-800 hover:underline"
            to="/login"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

