import { Button } from "@/components/ui/Button";

interface WizardActionsProps {
  onBack?: () => void;
  backLabel?: string;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  busy?: boolean;
}

export function WizardActions({
  onBack,
  backLabel = "Back",
  onNext,
  nextLabel = "Continue",
  nextDisabled,
  busy,
}: WizardActionsProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-3 shadow-card sm:p-4">
      {onBack ? (
        <Button variant="ghost" onClick={onBack} disabled={busy}>
          {backLabel}
        </Button>
      ) : (
        <span />
      )}
      <Button
        onClick={onNext}
        disabled={nextDisabled || busy}
        className="min-w-[150px]"
      >
        {busy ? "Submitting…" : nextLabel}
      </Button>
    </div>
  );
}
