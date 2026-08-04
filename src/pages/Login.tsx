import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, Wrench, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/brand/Logo";
import { Swoosh } from "@/components/brand/Swoosh";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { DEMO_KEY } from "@/lib/mockData";

const HIGHLIGHTS = [
  { icon: Wrench, text: "Find and manage service work in one workspace" },
  { icon: Zap, text: "Review diagnostics and quote with confidence" },
  { icon: ShieldCheck, text: "Verified profile, credentials, and job history" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    // Small delay to mimic a network round-trip.
    setTimeout(() => {
      const res = login(email, key);
      setBusy(false);
      if (res.ok) navigate("/jobs", { replace: true });
      else setError(res.error ?? "Sign in failed.");
    }, 350);
  }

  function fillDemo(demoEmail: string) {
    setEmail(demoEmail);
    setKey(DEMO_KEY);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative overflow-hidden bg-ink text-white">
        <div className="absolute -right-10 -top-16 h-72 w-72 rounded-full bg-brand-blue/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-brand-yellow/10 blur-3xl" />
        <Swoosh
          variant="duo"
          className="pointer-events-none absolute right-6 top-6 w-32 opacity-90 lg:right-10 lg:top-10 lg:w-44"
        />

        <div className="relative flex h-full flex-col justify-between p-6 sm:p-10 lg:p-12">
          <Logo className="h-6 text-white sm:h-7" />

          <div className="hidden lg:block max-w-md">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-yellow">
              Technician Workspace
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] tracking-tight xl:text-5xl">
              Smarter drives.
              <br />
              Stronger futures.
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70">
              The operational home for KinetyQ technicians. Sign in to find work,
              quote jobs, and keep vehicles healthy.
            </p>

            <ul className="mt-8 space-y-3">
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-[14px] text-white/85">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10">
                    <Icon className="h-[18px] w-[18px] text-brand-yellow" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <p className="hidden lg:block text-[12px] text-white/40">
            KinetyQ · Smarter Vehicle Health
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-7">
            <h2 className="font-display text-2xl font-bold text-ink">Sign in</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Welcome back. Enter your details to continue.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4" noValidate>
            <Field label="Email" htmlFor="email">
              <Input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                invalid={!!error}
              />
            </Field>

            <Field label="Access key" htmlFor="key">
              <Input
                id="key"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your access key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                invalid={!!error}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-neutral-400 hover:text-ink"
                    aria-label={show ? "Hide access key" : "Show access key"}
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </Field>

            {error && (
              <div className="rounded-xl border border-danger/30 bg-danger-50 px-3 py-2 text-[13px] font-medium text-danger">
                {error}
              </div>
            )}

            <Button type="submit" block size="lg" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 rounded-2xl border border-line bg-neutral-50 p-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
              Demo accounts · key {DEMO_KEY}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo("tech@kinetyq.com")}
                className="rounded-lg border border-line bg-surface px-3 py-2 text-left text-[12px] hover:border-brand-blue"
              >
                <span className="block font-semibold text-ink">Individual</span>
                <span className="text-neutral-500">tech@kinetyq.com</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo("business@kinetyq.com")}
                className="rounded-lg border border-line bg-surface px-3 py-2 text-left text-[12px] hover:border-brand-blue"
              >
                <span className="block font-semibold text-ink">Business</span>
                <span className="text-neutral-500">business@kinetyq.com</span>
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-[13px] text-neutral-500">
            New technician?{" "}
            <span className="font-semibold text-brand-blue">
              Onboarding opens in the next phase
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
