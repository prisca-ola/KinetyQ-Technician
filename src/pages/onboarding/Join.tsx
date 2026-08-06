import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  ShieldCheck,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";

interface Choice {
  to: string;
  icon: LucideIcon;
  title: string;
  body: string;
}

const INDEPENDENT: Choice[] = [
  {
    to: "/onboarding/individual",
    icon: UserRound,
    title: "Individual technician",
    body: "Sign up on your own to find and manage service work.",
  },
  {
    to: "/onboarding/business",
    icon: Building2,
    title: "Service business",
    body: "Register your workshop and manage a team of technicians.",
  },
];

const ORG: Choice = {
  to: "/onboarding/organization",
  icon: Users,
  title: "Join your organization",
  body: "You were invited by a fleet company you work for. Enter your invite code.",
};

function ChoiceCard({ choice }: { choice: Choice }) {
  const { icon: Icon } = choice;
  return (
    <Link
      to={choice.to}
      className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card transition-colors hover:border-brand-blue sm:p-5"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-blue-50 text-brand-blue">
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-[16px] font-bold text-ink">{choice.title}</h3>
        <p className="mt-0.5 text-[13px] leading-snug text-neutral-500">
          {choice.body}
        </p>
      </div>
      <ArrowRight className="h-5 w-5 shrink-0 text-neutral-300 transition-colors group-hover:text-brand-blue" />
    </Link>
  );
}

export default function Join() {
  // Prefetch nothing; navigation is instant. Kept for parity/testing hooks.
  useNavigate();
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-[60px] max-w-2xl items-center justify-between px-4 sm:px-6">
          <Logo className="h-6 text-navy" />
          <Link
            to="/login"
            className="text-[13px] font-semibold text-neutral-500 hover:text-ink"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-ink">
            Join KinetyQ
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            How would you like to get started?
          </p>
        </div>

        <p className="eyebrow mb-3">Independent</p>
        <div className="space-y-3">
          {INDEPENDENT.map((c) => (
            <ChoiceCard key={c.to} choice={c} />
          ))}
        </div>

        <p className="eyebrow mb-3 mt-7">Part of an organization</p>
        <ChoiceCard choice={ORG} />

        <div className="mt-8 flex items-center justify-center gap-2 text-[13px] text-neutral-500">
          <ShieldCheck className="h-4 w-4 text-neutral-400" />
          Verified technicians only. Your details are used for verification.
        </div>

        <p className="mt-6 text-center text-[13px] text-neutral-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-blue">
            Sign in
          </Link>
        </p>
      </main>
    </div>
  );
}
