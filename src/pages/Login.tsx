import { useState, type CSSProperties, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { DEMO_KEY } from "@/lib/mockData";

// Navy linear gradient with a soft blue glow (the brand dark + blue).
const PANEL_BG: CSSProperties = {
  backgroundColor: "#001824",
  backgroundImage: [
    "radial-gradient(88% 70% at 42% 52%, rgba(3,116,182,0.55) 0%, rgba(1,26,42,0) 60%)",
    "linear-gradient(157deg, #000f17 0%, #001824 52%, #012a41 100%)",
  ].join(","),
};

const AVATARS = ["#F9C80E", "#0077B6", "#5FB0E5"];

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
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[1080px] rounded-[28px] border border-line bg-surface p-3 shadow-pop sm:p-4">
        <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
          {/* Left brand panel - navy gradient + noise */}
          <div
            style={PANEL_BG}
            className="relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-[20px] p-6 text-white sm:p-8 lg:min-h-[560px]"
          >
            <div className="pointer-events-none absolute inset-0 noise-overlay opacity-[0.15] mix-blend-overlay" />

            <div className="relative flex items-center justify-between">
              <Logo className="h-6 text-white" />
              <span className="hidden text-[12px] font-medium text-white/45 sm:block">
                Technician workspace
              </span>
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/10 py-1 pl-1.5 pr-3.5 backdrop-blur">
                <div className="flex -space-x-2">
                  {AVATARS.map((c, i) => (
                    <span
                      key={i}
                      className="h-6 w-6 rounded-full border-2 border-navy"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <span className="text-[12px] font-medium text-white/80">
                  Trusted by KinetyQ technicians
                </span>
              </div>

              <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl lg:text-[42px]">
                Every job,
                <br />
                under control.
              </h1>
              <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-white/65">
                Find work, review diagnostics, quote, and complete service, all
                from one technician workspace.
              </p>
            </div>
          </div>

          {/* Right form panel */}
          <div className="flex flex-col justify-center px-2 py-6 sm:px-8 lg:px-12">
            <Logo className="h-6 text-navy" />

            <div className="mt-7">
              <h2 className="font-display text-[26px] font-bold text-ink">
                Sign in
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Welcome back. Enter your details to continue.
              </p>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              <Field label="Your Email" htmlFor="email">
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

              <Button type="submit" variant="dark" block size="lg" disabled={busy}>
                {busy ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <div className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                Demo accounts · key {DEMO_KEY}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo("tech@kinetyq.com")}
                  className="rounded-lg border border-line bg-surface px-3 py-2 text-left text-[12px] transition-colors hover:border-brand-blue"
                >
                  <span className="block font-semibold text-ink">Individual</span>
                  <span className="text-neutral-500">tech@kinetyq.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo("business@kinetyq.com")}
                  className="rounded-lg border border-line bg-surface px-3 py-2 text-left text-[12px] transition-colors hover:border-brand-blue"
                >
                  <span className="block font-semibold text-ink">Business</span>
                  <span className="text-neutral-500">business@kinetyq.com</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
