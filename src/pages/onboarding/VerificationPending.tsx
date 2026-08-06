import { Link } from "react-router-dom";
import { Building2, Clock, FileCheck2, MailCheck, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { getPending } from "@/lib/onboarding";

export default function VerificationPending() {
  const pending = getPending();
  const isOrg = pending?.path === "organization";

  const steps = isOrg
    ? [
        { icon: MailCheck, text: "Your request has reached your organization." },
        { icon: ShieldCheck, text: "Your organization admin activates your access." },
        { icon: Clock, text: "You will be able to sign in once activated." },
      ]
    : [
        { icon: FileCheck2, text: "We review your details and documents." },
        { icon: ShieldCheck, text: "We verify your identity and credentials." },
        { icon: Clock, text: "You will be notified once you are approved." },
      ];

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-[60px] max-w-2xl items-center px-4 sm:px-6">
          <Logo className="h-6 text-navy" />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-12 sm:px-6 sm:py-16">
        <div className="card overflow-hidden">
          <div className="flex flex-col items-center bg-navy px-6 py-9 text-center text-white">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10">
              <Clock className="h-8 w-8 text-brand-yellow" />
            </span>
            <h1 className="mt-4 font-display text-2xl font-bold text-white">
              {isOrg ? "Request sent" : "Application submitted"}
            </h1>
            <p className="mt-1.5 max-w-sm text-sm text-white/70">
              {isOrg
                ? "Your request to join has been sent to your organization."
                : "Thanks for applying. Your account is now pending verification."}
            </p>
          </div>

          <div className="p-6 sm:p-7">
            {pending && (
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-line bg-neutral-50 p-3.5">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-blue-50 text-brand-blue">
                  <Building2 className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-ink">
                    {pending.businessName ?? pending.name}
                  </p>
                  <p className="truncate text-[12px] text-neutral-500">
                    {isOrg && pending.orgName
                      ? `Joining ${pending.orgName}`
                      : pending.email}
                  </p>
                </div>
                <span className="ml-auto inline-flex h-6 items-center rounded-full bg-warning-50 px-2.5 text-[11px] font-semibold text-warning">
                  Pending
                </span>
              </div>
            )}

            <p className="eyebrow mb-3">What happens next</p>
            <ol className="space-y-3">
              {steps.map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neutral-100">
                    <Icon className="h-[18px] w-[18px] text-neutral-500" />
                  </span>
                  <span className="text-[14px] text-neutral-600">{text}</span>
                </li>
              ))}
            </ol>

            <div className="mt-7">
              <Link to="/login">
                <Button block size="lg">
                  Back to sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-[12px] text-neutral-400">
          This is a prototype. Verification is simulated and no account is created.
        </p>
      </main>
    </div>
  );
}
