import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Stepper } from "./Stepper";

interface OnboardingLayoutProps {
  steps: string[];
  current: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  children: ReactNode;
  footer?: ReactNode;
}

// Shared shell for every onboarding wizard: branded top bar, progress stepper,
// a titled content card, and a sticky footer for the Back / Continue actions.
export function OnboardingLayout({
  steps,
  current,
  title,
  subtitle,
  onBack,
  backLabel = "Back",
  children,
  footer,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-[60px] max-w-3xl items-center justify-between px-4 sm:px-6">
          <Logo className="h-6 text-navy" />
          <Link
            to="/login"
            className="text-[13px] font-semibold text-neutral-500 hover:text-ink"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6">
          <Stepper steps={steps} current={current} />
        </div>

        <div className="card p-5 sm:p-7">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-500 hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </button>
          )}

          <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}

          <div className="mt-6">{children}</div>
        </div>

        {footer && <div className="mt-5">{footer}</div>}
      </main>
    </div>
  );
}
